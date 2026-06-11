from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserSettings
from app.schemas import UserResponse, UserUpdate, UserSettingsUpdate, UserSettingsResponse
from app.routers.deps import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    update_data = user_in.model_dump(exclude_unset=True)
    
    # Update fields
    for field, value in update_data.items():
        setattr(current_user, field, value)
        
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/me/settings", response_model=UserSettingsResponse)
def update_settings(
    settings_in: UserSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings_obj = current_user.settings
    if not settings_obj:
        # Create settings object if somehow missing
        settings_obj = UserSettings(user_id=current_user.id)
        db.add(settings_obj)
        db.flush()

    update_data = settings_in.model_dump(exclude_unset=True)
    
    # Update settings fields
    for field, value in update_data.items():
        setattr(settings_obj, field, value)
        
    db.add(settings_obj)
    db.commit()
    db.refresh(settings_obj)
    return settings_obj
