import os
import uuid
import logging

from avro.schema import parse
from django.db import models
from django.db.models import Index
from django.conf import settings

from config.settings.base import BASE_DIR
from babblebox.api.whisper.whisper import get_transcription


class AudioFile(models.Model):
    id = models.CharField(max_length=100, unique=True, editable=False, primary_key=True)
    audio = models.FileField(upload_to='audios')
    transcription_en = models.TextField(blank=True)
    transcription_original = models.TextField(blank=True)
    file_location = models.CharField(max_length=255, editable=False)
    upload_timestamp = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            # Generate a unique ID
            self.id = str(uuid.uuid4())
        super(AudioFile, self).save(*args, **kwargs)
        print(self.audio)
        # Generate transcription after the file is saved
        # Update the transcription fields
        self.file_location = settings.MEDIA_ROOT + "/" + str(self.audio)
        # Save the model again to store the transcription
        super(AudioFile, self).save(update_fields=['transcription_en', 'file_location'])


class ImageFile(models.Model):
    id = models.CharField(max_length=100, unique=True, editable=False, primary_key=True)
    image = models.ImageField(upload_to='images',  null=True, blank=True)
    file_location = models.CharField(max_length=255, editable=False, null=False, blank=True)
    upload_timestamp = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            # Generate a unique ID
            self.id = str(uuid.uuid4())
        super(ImageFile, self).save(*args, **kwargs)
        if self.image:
            self.file_location = settings.MEDIA_ROOT + "/" + str(self.image)
            super(ImageFile, self).save(update_fields=['file_location'])


class Chat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    topic = models.CharField(max_length=255, editable=True)

    def save(self, *args, **kwargs):
        if not self.id:
            # Generate a unique ID
            self.id = str(uuid.uuid4())
        super(Chat, self).save(*args, **kwargs)


class ChatMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat_id = models.ForeignKey(Chat, on_delete=models.CASCADE)
    audio_message_id = models.ForeignKey(AudioFile, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    image_id = models.ForeignKey(ImageFile, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        indexes = [
            Index(fields=['chat_id'], name='chat_id_idx'),
            Index(fields=['timestamp'], name='timestamp_idx'),
            # Assuming you want to be able to filter by chat_id and then within a time range
            Index(fields=['chat_id', 'timestamp'], name='chat_id_timestamp_idx'),
        ]

    @classmethod
    def get_messages_for_chat(cls, chat_id):
        return cls.objects.filter(chat_id=chat_id).order_by('timestamp')

    @classmethod
    def get_avro_schema(cls):
        schema_file = os.path.join(BASE_DIR, 'babblebox/api/schemas/chat_message_schema.avsc')
        print(BASE_DIR)
        print(schema_file)
        with open(schema_file, 'r') as file:
            schema = parse(file.read())
            print(schema)
            return schema


logger = logging.getLogger(__name__)

logger.info(f'Django DEBUG mode is {"on" if settings.DEBUG else "off"}')
print(ChatMessage.get_avro_schema())
