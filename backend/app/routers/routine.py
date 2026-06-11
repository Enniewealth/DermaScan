from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, RoutineStep, ScanResult
from app.schemas import RoutineStepResponse, RoutineStepUpdate
from app.routers.deps import get_current_user

router = APIRouter(prefix="/routine", tags=["Routine"])

@router.get("", response_model=List[RoutineStepResponse])
def get_routine(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch the active routine steps for the current user."""
    steps = db.query(RoutineStep).filter(
        RoutineStep.user_id == current_user.id
    ).order_by(RoutineStep.time_of_day, RoutineStep.step_number).all()
    return steps

@router.post("/generate", response_model=List[RoutineStepResponse])
def generate_routine(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Automatically generate a specialized routine checklist based on the user's latest scan results."""
    # Find latest scan result
    latest_scan = db.query(ScanResult).filter(
        ScanResult.user_id == current_user.id
    ).order_by(ScanResult.date.desc()).first()

    # Clear existing routine steps for this user
    db.query(RoutineStep).filter(RoutineStep.user_id == current_user.id).delete()

    # Default routine steps (if no scan exists or condition is general)
    condition_name = latest_scan.condition_name.lower() if latest_scan else "general"

    new_steps = []
    
    if "acne" in condition_name:
        # Acne Routine
        new_steps = [
            # Morning
            {"time_of_day": "morning", "step_number": 1, "product_name": "Salicylic Acid 2% Cleanser", "product_type": "cleanser", "instruction": "Wash face with lukewarm water. Pat dry with a clean towel."},
            {"time_of_day": "morning", "step_number": 2, "product_name": "Benzoyl Peroxide 5% Gel", "product_type": "treatment", "instruction": "Apply a thin layer to active breakouts or acne-prone zones. Avoid eyes."},
            {"time_of_day": "morning", "step_number": 3, "product_name": "Niacinamide Oil-Free Moisturizer", "product_type": "moisturizer", "instruction": "Apply evenly to soothe skin and regulate sebum production."},
            {"time_of_day": "morning", "step_number": 4, "product_name": "Broad-Spectrum SPF 50+ Fluid", "product_type": "sunscreen", "instruction": "Apply 15 minutes before sun exposure to prevent dark spot hyperpigmentation."},
            # Evening
            {"time_of_day": "evening", "step_number": 1, "product_name": "Gentle Purifying Foaming Cleanser", "product_type": "cleanser", "instruction": "Remove oil, pollution, and sweat accumulated during the day."},
            {"time_of_day": "evening", "step_number": 2, "product_name": "Adapalene 0.1% Gel (Retinoid)", "product_type": "treatment", "instruction": "Apply a pea-sized amount to the entire face at night to prevent microcomedones."},
            {"time_of_day": "evening", "step_number": 3, "product_name": "Ceramide Barrier Cream", "product_type": "moisturizer", "instruction": "Hydrate and restore skin barrier function overnight."},
            # Weekly
            {"time_of_day": "weekly", "step_number": 1, "product_name": "Kaolin Clay & Tea Tree Mask", "product_type": "treatment", "instruction": "Apply to oily regions once a week for 10 minutes to deep clean pores."}
        ]
    elif "eczema" in condition_name or "dermatitis" in condition_name:
        # Eczema / Dermatitis Routine
        new_steps = [
            # Morning
            {"time_of_day": "morning", "step_number": 1, "product_name": "Hydrating Ceramide Cleanser", "product_type": "cleanser", "instruction": "Wash gently. Use cool or lukewarm water. Do not scrub."},
            {"time_of_day": "morning", "step_number": 2, "product_name": "Hydrocortisone 1% Cream (if flaring)", "product_type": "treatment", "instruction": "Apply a thin layer strictly to red, itchy, or scaling patches."},
            {"time_of_day": "morning", "step_number": 3, "product_name": "Thick Emollient Cream (Shea Butter/Oat)", "product_type": "moisturizer", "instruction": "Massage into damp skin to lock in moisture and build the lipid barrier."},
            {"time_of_day": "morning", "step_number": 4, "product_name": "Physical Mineral Sunscreen SPF 30+", "product_type": "sunscreen", "instruction": "Zinc oxide/Titanium dioxide formula. Safe for eczema-prone skin."},
            # Evening
            {"time_of_day": "evening", "step_number": 1, "product_name": "Ultra-Gentle Cleansing Oil/Lotion", "product_type": "cleanser", "instruction": "Wash face to remove daily impurities without stripping natural skin oils."},
            {"time_of_day": "evening", "step_number": 2, "product_name": "Prescribed Eczema Ointment", "product_type": "treatment", "instruction": "Apply to flare-up locations as directed by your physician."},
            {"time_of_day": "evening", "step_number": 3, "product_name": "Deep Repair Cream or Petrolatum Jelly", "product_type": "moisturizer", "instruction": "Apply a generous layer to protect and restore skin barrier overnight."},
            # Weekly
            {"time_of_day": "weekly", "step_number": 1, "product_name": "Colloidal Oatmeal Soothing Treatment", "product_type": "treatment", "instruction": "Soak affected skin areas or apply oatmeal paste for 15 minutes to reduce itchiness."}
        ]
    else:
        # General / Protective Routine
        new_steps = [
            # Morning
            {"time_of_day": "morning", "step_number": 1, "product_name": "Gentle Skin Cleanser", "product_type": "cleanser", "instruction": "Gently clean face with warm water and pat dry."},
            {"time_of_day": "morning", "step_number": 2, "product_name": "Vitamin C + Hyaluronic Acid Serum", "product_type": "treatment", "instruction": "Apply 3-4 drops to brighten and protect against pollution."},
            {"time_of_day": "morning", "step_number": 3, "product_name": "Daily Light Hydrating Lotion", "product_type": "moisturizer", "instruction": "Apply to face and neck for non-greasy hydration."},
            {"time_of_day": "morning", "step_number": 4, "product_name": "Broad-Spectrum SPF 50 Sunscreen", "product_type": "sunscreen", "instruction": "Apply evenly. Crucial for skin health and anti-aging in sunny weather."},
            # Evening
            {"time_of_day": "evening", "step_number": 1, "product_name": "Gentle Skin Cleanser", "product_type": "cleanser", "instruction": "Thoroughly cleanse face to remove dirt and sunscreen."},
            {"time_of_day": "evening", "step_number": 2, "product_name": "Hyaluronic Acid Serum", "product_type": "treatment", "instruction": "Apply to damp face for intensive nighttime hydration."},
            {"time_of_day": "evening", "step_number": 3, "product_name": "Barrier Restoration Cream", "product_type": "moisturizer", "instruction": "Apply to face and neck to nourish skin overnight."},
            # Weekly
            {"time_of_day": "weekly", "step_number": 1, "product_name": "Exfoliating AHA/BHA Solution", "product_type": "treatment", "instruction": "Apply for 5-10 minutes then rinse off. Use once a week to remove dead cells."}
        ]

    # Bulk insert
    db_steps = []
    for step in new_steps:
        db_step = RoutineStep(
            user_id=current_user.id,
            time_of_day=step["time_of_day"],
            step_number=step["step_number"],
            product_name=step["product_name"],
            product_type=step["product_type"],
            instruction=step["instruction"],
            is_completed=False
        )
        db.add(db_step)
        db_steps.append(db_step)
        
    db.commit()
    
    # Reload steps to serialize properly
    for step in db_steps:
        db.refresh(step)
        
    return db_steps

@router.put("/{step_id}", response_model=RoutineStepResponse)
def update_routine_step(
    step_id: str,
    payload: RoutineStepUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a specific routine step (e.g. check/uncheck completion)."""
    step = db.query(RoutineStep).filter(
        RoutineStep.id == step_id,
        RoutineStep.user_id == current_user.id
    ).first()
    
    if not step:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routine step not found or unauthorized."
        )
        
    if payload.is_completed is not None:
        step.is_completed = payload.is_completed
        
    db.commit()
    db.refresh(step)
    return step

@router.put("/{step_id}/toggle", response_model=RoutineStepResponse)
def toggle_routine_step(
    step_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggle a routine step's completed status."""
    step = db.query(RoutineStep).filter(
        RoutineStep.id == step_id,
        RoutineStep.user_id == current_user.id
    ).first()
    
    if not step:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routine step not found or unauthorized."
        )
        
    step.is_completed = not step.is_completed
    db.commit()
    db.refresh(step)
    return step
