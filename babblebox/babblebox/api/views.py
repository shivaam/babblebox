from venv import logger
from rest_framework import viewsets, status
from rest_framework.response import Response

from .permissions import IsOwnerOrReadOnly, IsChatParticipantOrOwnerForChatObj

from .clients.pulsar_client_avro import PulsarClient
from .logging_mixin import LoggingMixin
from .models import AudioFile, ChatMessage, Chat, ImageFile, ChatParticipant
from .serializers import AudioFileSerializer, ChatMessageSerializer, ChatParticipantSerializer, ChatSerializer, ImageFileSerializer
from django.db import transaction
from django.db.models import Q
from django.core.exceptions import PermissionDenied

class AudioFileViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = AudioFile.objects.all()
    serializer_class = AudioFileSerializer


class ImageFileViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = ImageFile.objects.all()
    serializer_class = ImageFileSerializer

'''
Participant viewset use cases:
- DONE - Only owner can add new people to th chat as they can directly add participants from
the chat objet.
- P0 - Each user can add new participants to chat: they own, they have send message access to, and public chats

- P1 - Each user can view the chat particpants they are part of.
- P1 - Owner can remove people from the chat.
- P1 - Users cannot view participants of a chat they are not part of if the chat is not public.
- For a public chat, user can simply view the chat or join it. If joined we will add entry to the participant table
- User can leave a chat they are part of by deleting the participant entry
'''

def str_to_bool(value):
    """Convert string representations of truthiness to boolean."""
    return str(value).lower() in ("true", "1", "t", "y", "yes")

class ChatParticipantViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = ChatParticipant.objects.all()
    serializer_class = ChatParticipantSerializer

    def get_queryset(self):
        """
        Only return participants for the chat which user is a particpant of.
        """
        user_chat_ids = ChatParticipant.objects.filter(user=self.request.user).values_list('chat', flat=True)
        queryset = ChatParticipant.objects.filter(chat_id__in=user_chat_ids)
        #queryset = ChatParticipant.objects.filter(user=self.request.user)
        chat_id = self.request.query_params.get('chat_id')
        # add the username of each user in the query set result
        # join with user table to get the username in the queryset
        queryset = queryset.select_related('user')

        if chat_id is not None:
            queryset = queryset.filter(chat_id=chat_id)
        return queryset

    def user_can_create_participant(self, user, chat_id):
        """
        Placeholder method to check if the user has permission to add a participant.
        Implement your actual permission logic here.
        """
        # Example check: user must be the chat owner or an existing participant with write access
        return ChatParticipant.objects.filter(chat_id=chat_id, user=user, has_write_access=True).exists()

    def perform_create(self, serializer):
        chat_id = self.request.data.get('chat')
        user_id = self.request.data.get('user')

        chat_obj = Chat.objects.get(id=chat_id)
        # Permission check
        if not chat_obj.is_public and not self.user_can_create_participant(self.request.user, chat_id):
            # Raise a permission denied error if the user does not have permission to add participants
            raise PermissionDenied("You do not have permission to add participants to this chat.")


        # Check if the participant relationship already exists and update or create accordingly
        obj, created = ChatParticipant.objects.update_or_create(
            chat_id=chat_id,
            user_id=user_id,
            defaults={
                'has_read_access': str_to_bool(self.request.data.get('has_read_access', True)),
                'has_write_access': str_to_bool(self.request.data.get('has_write_access', True))
            }
        )

class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    def perform_create(self, serializer):
        with transaction.atomic():
            # Save the Chat instance created by the serializer
            # Assuming the request includes the owner information.
            # You may need to adjust this based on how your owner is determined (e.g., from the request user)
            owner = self.request.user
            chat = serializer.save(owner=owner)
            # Create a Participant instance for the owner with the necessary flags
            ChatParticipant.objects.create(chat=chat, user=owner, has_read_access=True, has_write_access=True)
            logger.info(f"Chat created with id: {chat.id}")


    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            permission_classes = [IsOwnerOrReadOnly]
        elif self.action == 'retrieve':
            permission_classes = [IsChatParticipantOrOwnerForChatObj]
        else:
            return super().get_permissions()
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        # Filter chats where the user is the owner or a participant
        return Chat.objects.select_related('owner').filter(
            Q(is_public=True) |  # Public chats
            Q(owner=user) | Q(participants=user)
        ).distinct()



class ChatMessageViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        owner = self.request.user
        serializer.save(owner=owner)
        data = serializer.data
        data["chat_id"] = str(data["chat_id"])
        PulsarClient.send_message(data, ChatMessage.get_avro_schema())
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        """
        Optionally restricts the returned chat messages to a given chat,
        by filtering against a `chat_id` query parameter in the URL.
        """
        queryset = ChatMessage.objects.all().select_related('owner')
        chat_id = self.request.query_params.get('chat_id')
        if chat_id is not None:
            queryset = queryset.filter(chat_id=chat_id)
        return queryset
