from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AudioFileViewSet, ChatViewSet, ChatMessageViewSet, ImageFileViewSet, ParticipantViewSet

router = DefaultRouter()
router.register(r'AudioFile', AudioFileViewSet)
router.register(r'ImageFile', ImageFileViewSet)
router.register(r'Chat', ChatViewSet)
router.register(r'ChatMessage', ChatMessageViewSet)
router.register(r'Participant', ParticipantViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
