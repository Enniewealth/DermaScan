from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from pydantic.alias_generators import to_camel

class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

# --- Authentication Schemas ---

class Token(CamelModel):
    access_token: str
    token_type: str
    user_id: str

class TokenData(CamelModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

# --- User & Settings Schemas ---

class UserSettingsBase(CamelModel):
    scan_reminders: bool = True
    language: str = "English - Nigeria"
    privacy_mode: bool = False

class UserSettingsUpdate(CamelModel):
    scan_reminders: Optional[bool] = None
    language: Optional[str] = None
    privacy_mode: Optional[bool] = None

class UserSettingsResponse(UserSettingsBase):
    pass

class UserCreate(CamelModel):
    full_name: str
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(CamelModel):
    email: EmailStr
    password: str

class UserUpdate(CamelModel):
    full_name: Optional[str] = None
    primary_skin_concern: Optional[str] = None
    avatar_url: Optional[str] = None
    fitzpatrick_type: Optional[str] = None

class UserResponse(CamelModel):
    id: str
    full_name: str
    email: EmailStr
    avatar_url: Optional[str] = None
    primary_skin_concern: str
    fitzpatrick_type: Optional[str] = None
    settings: UserSettingsResponse
    created_at: datetime

# --- Scan Result Schemas ---

class MedicationBase(CamelModel):
    name: str
    type: str
    tier: str  # budget, standard, premium
    price_range: str
    description: str
    is_recommended: bool = False

class MedicationResponse(MedicationBase):
    id: str

class ApplicationStepBase(CamelModel):
    step_number: int
    title: str
    description: str

class ApplicationStepResponse(ApplicationStepBase):
    id: str

class SkinConditionSchema(CamelModel):
    name: str
    full_name: str
    description: str
    category: str

class ScanResultResponse(CamelModel):
    id: str
    user_id: str
    condition: SkinConditionSchema
    confidence: int
    severity: str
    date: datetime
    image_url: str
    symptoms: List[str]
    causes: List[str]
    risk_indicators: List[str]
    recommendations: List[str]
    clinical_insights: str
    status: str
    medications: List[MedicationResponse]
    application_steps: List[ApplicationStepResponse]
    
    # Biomarkers (Oyster Gap)
    hydration_level: Optional[int] = None
    sebum_level: Optional[int] = None
    barrier_integrity: Optional[int] = None
    hyperpigmentation_index: Optional[int] = None


# --- Skincare Routine Schemas ---

class RoutineStepBase(CamelModel):
    time_of_day: str  # morning, evening, weekly
    step_number: int
    product_name: str
    product_type: str  # cleanser, treatment, moisturizer, sunscreen
    instruction: str

class RoutineStepCreate(RoutineStepBase):
    pass

class RoutineStepResponse(RoutineStepBase):
    id: str
    user_id: str
    is_completed: bool

class RoutineStepUpdate(CamelModel):
    is_completed: Optional[bool] = None


# --- Product Scanner Schemas ---

class ProductScanRequest(CamelModel):
    ingredients_text: str

class ProductScanResponse(CamelModel):
    fit_score: int
    compatibility: str  # Safe, Use with Caution, Avoid
    reason: str
    harmful_ingredients: List[str]
