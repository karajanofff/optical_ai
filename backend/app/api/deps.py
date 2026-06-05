from fastapi import Depends

from app.models.user import User
from app.services.auth import get_current_user


def current_user(user: User = Depends(get_current_user)) -> User:
    return user
