from rest_framework import viewsets, status
from rest_framework.response import Response

from .clients.pulsar_client_avro import PulsarClient
from .logging_mixin import LoggingMixin
from .models import AudioFile, ChatMessage, Chat, ImageFile
from .serializers import AudioFileSerializer, ChatMessageSerializer, ChatSerializer, ImageFileSerializer


class AudioFileViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = AudioFile.objects.all()
    serializer_class = AudioFileSerializer


class ImageFileViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = ImageFile.objects.all()
    serializer_class = ImageFileSerializer


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer


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
