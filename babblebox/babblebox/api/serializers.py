from rest_framework import serializers
from .models import AudioFile, ChatMessage, Chat, ImageFile


class AudioFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioFile
        fields = ['id', 'audio', 'transcription_en', 'file_location']


class ImageFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageFile
        fields = ['id', 'image', 'file_location']


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'topic']


class ChatMessageSerializer(serializers.ModelSerializer):
    audio_file = AudioFileSerializer(write_only=True)
    id = serializers.CharField(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'chat_id', 'audio_message_id', 'timestamp', 'audio_file', 'image_id']
        read_only_fields = ('audio_message_id', 'timestamp', 'id')

    def create(self, validated_data):
        # No need to use the serializer as we can directly create the audioFile
        audio_file_data = validated_data.pop('audio_file')
        audio_file = AudioFile.objects.create(**audio_file_data)
        validated_data.pop('image_id')

        image_file = ImageFile.objects.create()
        chat_message = ChatMessage.objects.create(audio_message_id=audio_file, image_id=image_file, **validated_data)
        return chat_message
