from rest_framework import permissions

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


class IsParticipantOrOwner(permissions.BasePermission):
    """
    Custom permission to only allow participants or the owner of the chat to view it.
    """

    def has_object_permission(self, request, view, obj):
        if request.user == obj.owner:
            return True
        return obj.participants.filter(id=request.user.id).exists()
