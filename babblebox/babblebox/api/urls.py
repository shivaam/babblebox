from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AudioFileViewSet, ChatParticipantViewSet, ChatViewSet, ChatMessageViewSet, ImageFileViewSet

router = DefaultRouter()
router.register(r'AudioFile', AudioFileViewSet)
router.register(r'ImageFile', ImageFileViewSet)
router.register(r'Chat', ChatViewSet)
router.register(r'ChatMessage', ChatMessageViewSet)
router.register(r'ChatParticipant', ChatParticipantViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
