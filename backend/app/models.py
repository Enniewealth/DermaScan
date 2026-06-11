import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: generate_uuid("usr"))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    primary_skin_concern = Column(String, default="General")
    fitzpatrick_type = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    scans = relationship("ScanResult", back_populates="user", cascade="all, delete-orphan")
    routine_steps = relationship("RoutineStep", cascade="all, delete-orphan")


class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(String, primary_key=True, default=lambda: generate_uuid("set"))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    scan_reminders = Column(Boolean, default=True)
    language = Column(String, default="English - Nigeria")
    privacy_mode = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="settings")


class ScanResult(Base):
    __tablename__ = "scan_results"

    id = Column(String, primary_key=True, default=lambda: generate_uuid("scn"))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    condition_name = Column(String, nullable=False)
    condition_full_name = Column(String, nullable=False)
    condition_description = Column(Text, nullable=False)
    condition_category = Column(String, nullable=False)
    confidence = Column(Integer, nullable=False)
    severity = Column(String, nullable=False)  # mild, moderate, severe, critical
    date = Column(DateTime, default=datetime.utcnow)
    image_url = Column(String, nullable=False)
    symptoms = Column(JSON, nullable=True)         # List[str]
    causes = Column(JSON, nullable=True)           # List[str]
    risk_indicators = Column(JSON, nullable=True)  # List[str]
    recommendations = Column(JSON, nullable=True)  # List[str]
    clinical_insights = Column(Text, nullable=True)
    status = Column(String, default="completed")   # pending, completed, failed
    
    # Cosmetic skin biomarkers (Oyster Gap)
    hydration_level = Column(Integer, nullable=True, default=70)
    sebum_level = Column(Integer, nullable=True, default=50)
    barrier_integrity = Column(Integer, nullable=True, default=80)
    hyperpigmentation_index = Column(Integer, nullable=True, default=25)

    # Relationships
    user = relationship("User", back_populates="scans")
    medications = relationship("MedicationRecommendation", back_populates="scan", cascade="all, delete-orphan")
    application_steps = relationship("ApplicationStep", back_populates="scan", cascade="all, delete-orphan")


class MedicationRecommendation(Base):
    __tablename__ = "medication_recommendations"

    id = Column(String, primary_key=True, default=lambda: generate_uuid("med"))
    scan_id = Column(String, ForeignKey("scan_results.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)          # Triple Action Topical Cream, etc.
    tier = Column(String, nullable=False)          # budget, standard, premium
    price_range = Column(String, nullable=False)   # e.g., ₦800 - ₦1,500
    description = Column(Text, nullable=False)
    is_recommended = Column(Boolean, default=False)

    # Relationships
    scan = relationship("ScanResult", back_populates="medications")


class ApplicationStep(Base):
    __tablename__ = "application_steps"

    id = Column(String, primary_key=True, default=lambda: generate_uuid("stp"))
    scan_id = Column(String, ForeignKey("scan_results.id", ondelete="CASCADE"), nullable=False)
    step_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)

    # Relationships
    scan = relationship("ScanResult", back_populates="application_steps")


class RoutineStep(Base):
    __tablename__ = "routine_steps"

    id = Column(String, primary_key=True, default=lambda: generate_uuid("rts"))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    time_of_day = Column(String, nullable=False)   # morning, evening, weekly
    step_number = Column(Integer, nullable=False)
    product_name = Column(String, nullable=False)
    product_type = Column(String, nullable=False)  # cleanser, treatment, moisturizer, sunscreen
    instruction = Column(Text, nullable=False)
    is_completed = Column(Boolean, default=False)
