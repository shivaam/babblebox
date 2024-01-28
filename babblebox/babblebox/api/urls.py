from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AudioFileViewSet, ChatViewSet, ChatMessageViewSet, ImageFileViewSet

router = DefaultRouter()
router.register(r'AudioFile', AudioFileViewSet)
router.register(r'ImageFile', ImageFileViewSet)
router.register(r'Chat', ChatViewSet)
router.register(r'ChatMessage', ChatMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]