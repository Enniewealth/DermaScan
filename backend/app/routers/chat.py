# ============================================
# DermaScan — Chat Router (Derm AI Assistant)
# ============================================

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, ScanResult
from app.routers.deps import get_current_user
from app.services.derm_chat import get_derm_response

router = APIRouter(prefix="/chat", tags=["Chat"])


class ScanContext(BaseModel):
    condition: Optional[str] = None
    confidence: Optional[int] = None
    severity: Optional[str] = None
    body_location: Optional[str] = None
    scan_id: Optional[str] = None


class ChatMessage(BaseModel):
    role: str  # "user" or "derm"
    content: str


class ChatRequest(BaseModel):
    message: str
    language: str = "EN"  # EN, YO, HA, IG
    scan_context: Optional[ScanContext] = None
    history: List[ChatMessage] = []
    mode: str = "text"  # "text" or "voice"


class ChatResponse(BaseModel):
    reply: str
    suggested_replies: List[str] = []
    escalation: Optional[dict] = None


@router.post("/message", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a message to Derm and receive an AI-powered response."""
    try:
        result = await get_derm_response(
            message=request.message,
            language=request.language,
            scan_context=request.scan_context.model_dump() if request.scan_context else None,
            history=[msg.model_dump() for msg in request.history],
            mode=request.mode,
            user_name=current_user.full_name,
        )
        return ChatResponse(**result)
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Derm is having a moment. Please try again.")
