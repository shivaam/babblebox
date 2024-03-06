from rest_framework import viewsets, status
from rest_framework.response import Response

from .permissions import IsOwnerOrReadOnly, IsParticipantOrOwner

from .clients.pulsar_client_avro import PulsarClient
from .logging_mixin import LoggingMixin
from .models import AudioFile, ChatMessage, Chat, ImageFile, ChatParticipant
from .serializers import AudioFileSerializer, ChatMessageSerializer, ChatSerializer, ImageFileSerializer, ParticipantSerializer
from django.db import transaction
from django.db.models import Q

class AudioFileViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = AudioFile.objects.all()
    serializer_class = AudioFileSerializer


class ImageFileViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = ImageFile.objects.all()
    serializer_class = ImageFileSerializer

class ParticipantViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned chat messages to a given chat,
        by filtering against a `chat_id` query parameter in the URL.
        """
        queryset = Chat.objects.all()
        chat_id = self.request.query_params.get('chat_id')
        if chat_id is not None:
            queryset = queryset.filter(chat_id=chat_id)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        chat = serializer.save()
        data = serializer.data
        data["id"] = str(data["id"])
        return Response(serializer.data, status=status.HTTP_201_CREATED)

'''
Participant viewset use cases:
- P0 - Each user can view the chat particpants they are part of.
- P0 - Each user can add new participants to chat: they own, they have send message access to, and public chats
- P0 - Owner can remove people from the chat.
- P0 - Users cannot view participants of a chat they are not part of if the chat is not public.

- For a public chat, user can simply view the chat or join it. If joined we will add entry to the participant table
- User can leave a chat they are part of by deleting the participant entry
'''

class ParticipantViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = ChatParticipant.objects.all()
    serializer_class = ParticipantSerializer

    def get_queryset(self):
        """
        Only return participants for the chat which user is a particpant of.
        """
        queryset = ChatParticipant.objects.filter(user=self.request.user)
        chat_id = self.request.query_params.get('chat_id')

        if chat_id is not None:
            queryset = queryset.filter(chat_id=chat_id)
        return queryset

class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    def perform_create(self, serializer):
        with transaction.atomic():
            print("Creating chat")
            # Save the Chat instance created by the serializer
            # Assuming the request includes the owner information.
            # You may need to adjust this based on how your owner is determined (e.g., from the request user)
            owner = self.request.user
            chat = serializer.save(owner=owner)

            # Create a Participant instance for the owner with the necessary flags
            ChatParticipant.objects.create(chat=chat, user=owner, has_read_access=True, has_write_access=True)


    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            permission_classes = [IsOwnerOrReadOnly]
        elif self.action == 'retrieve':
            permission_classes = [IsParticipantOrOwner]
        else:
            return super().get_permissions()
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        # Filter chats where the user is the owner or a participant
        return Chat.objects.filter(
            Q(owner=user) | Q(participants=user)
        ).distinct()


class ChatMessageViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data = serializer.data
        data["chat_id"] = str(data["chat_id"])
        PulsarClient.send_message(data, ChatMessage.get_avro_schema())
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        """
        Optionally restricts the returned chat messages to a given chat,
        by filtering against a `chat_id` query parameter in the URL.
        """
        queryset = ChatMessage.objects.all()
        chat_id = self.request.query_params.get('chat_id')
        if chat_id is not None:
            queryset = queryset.filter(chat_id=chat_id)
        return queryset
