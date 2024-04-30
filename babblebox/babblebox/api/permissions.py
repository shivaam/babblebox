from venv import logger
from rest_framework import permissions

from .models import Chat, ChatParticipant

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the chat.
        return obj.owner == request.user


class IsChatParticipantOrOwnerForChatObj(permissions.BasePermission):
    """
    Custom permission to only allow participants or the owner of the chat to view it.
    """

    def has_object_permission(self, request, view, obj):
        if request.user == obj.owner or obj.is_public:
            return True
        return obj.participants.filter(id=request.user.id).exists()


class IsChatParticipant(permissions.BasePermission):
    """
    Custom permission to only allow participants of a chat to add new participants.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        # if given chat is public, then anyone can join
        chat_id = request.data.get('chat')  # Assuming the chat ID is sent in the request body
        if not chat_id:
            logger.error('Chat ID not found in request body')
            return False

        chat_obj = Chat.objects.get(id=chat_id)
        if chat_obj.is_public:
            logger.info('Chat is public. Anyone can join')
            return True

        return ChatParticipant.objects.filter(chat_id=chat_id, user=request.user).exists()
