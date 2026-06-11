from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, ScanResult, MedicationRecommendation, ApplicationStep
from app.schemas import ScanResultResponse
from app.routers.deps import get_current_user
from app.services.cloudinary import upload_image
from app.services.gemini import analyze_skin_image

router = APIRouter(prefix="/scans", tags=["Scans"])


def serialize_scan_result(db_scan: ScanResult) -> Dict[str, Any]:
    """Helper to convert flat database fields to nested condition schema format."""
    return {
        "id": db_scan.id,
        "user_id": db_scan.user_id,
        "condition": {
            "name": db_scan.condition_name,
            "full_name": db_scan.condition_full_name,
            "description": db_scan.condition_description,
            "category": db_scan.condition_category,
        },
        "confidence": db_scan.confidence,
        "severity": db_scan.severity,
        "date": db_scan.date,
        "image_url": db_scan.image_url,
        "symptoms": db_scan.symptoms or [],
        "causes": db_scan.causes or [],
        "risk_indicators": db_scan.risk_indicators or [],
        "recommendations": db_scan.recommendations or [],
        "clinical_insights": db_scan.clinical_insights,
        "status": db_scan.status,
        "medications": [
            {
                "id": med.id,
                "name": med.name,
                "type": med.type,
                "tier": med.tier,
                "price_range": med.price_range,
                "description": med.description,
                "is_recommended": med.is_recommended
            }
            for med in db_scan.medications
        ],
        "application_steps": [
            {
                "id": step.id,
                "step_number": step.step_number,
                "title": step.title,
                "description": step.description
            }
            for step in db_scan.application_steps
        ],
        "hydration_level": db_scan.hydration_level,
        "sebum_level": db_scan.sebum_level,
        "barrier_integrity": db_scan.barrier_integrity,
        "hyperpigmentation_index": db_scan.hyperpigmentation_index,
    }


@router.post("/analyze", response_model=ScanResultResponse, status_code=status.HTTP_201_CREATED)
async def analyze_scan(
    photo: UploadFile = File(...),
    symptoms: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Upload the image to Cloudinary (or local fallback)
    image_url = await upload_image(photo)
    
    # 2. Perform AI Skin Analysis using Gemini (or mock fallback)
    try:
        analysis = await analyze_skin_image(photo, symptoms)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Analysis processing failed: {str(e)}"
        )
        
    # 3. Create ScanResult DB entry
    db_scan = ScanResult(
        user_id=current_user.id,
        condition_name=analysis["condition"]["name"],
        condition_full_name=analysis["condition"]["fullName"],
        condition_description=analysis["condition"]["description"],
        condition_category=analysis["condition"]["category"],
        confidence=analysis["confidence"],
        severity=analysis["severity"],
        image_url=image_url,
        symptoms=analysis.get("symptoms", []),
        causes=analysis.get("causes", []),
        risk_indicators=analysis.get("riskIndicators", []),
        recommendations=analysis.get("recommendations", []),
        clinical_insights=analysis.get("clinicalInsights", ""),
        status="completed",
        hydration_level=analysis.get("hydrationLevel", 70),
        sebum_level=analysis.get("sebumLevel", 50),
        barrier_integrity=analysis.get("barrierIntegrity", 80),
        hyperpigmentation_index=analysis.get("hyperpigmentationIndex", 25)
    )
    db.add(db_scan)
    db.flush()  # Populate db_scan.id
    
    # 4. Create Medication recommendations entries
    for med in analysis.get("medications", []):
        db_med = MedicationRecommendation(
            scan_id=db_scan.id,
            name=med["name"],
            type=med["type"],
            tier=med["tier"],
            price_range=med["priceRange"],
            description=med["description"],
            is_recommended=med.get("isRecommended", False)
        )
        db.add(db_med)
        
    # 5. Create Application steps entries
    for step in analysis.get("applicationSteps", []):
        db_step = ApplicationStep(
            scan_id=db_scan.id,
            step_number=step["stepNumber"],
            title=step["title"],
            description=step["description"]
        )
        db.add(db_step)
        
    db.commit()
    db.refresh(db_scan)
    
    # Return formatted result
    return serialize_scan_result(db_scan)


@router.get("/history", response_model=List[ScanResultResponse])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    scans = db.query(ScanResult).filter(ScanResult.user_id == current_user.id).order_by(ScanResult.date.desc()).all()
    return [serialize_scan_result(scan) for scan in scans]


@router.get("/{scan_id}", response_model=ScanResultResponse)
def get_scan_detail(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    scan = db.query(ScanResult).filter(
        ScanResult.id == scan_id,
        ScanResult.user_id == current_user.id
    ).first()
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan result not found or access denied."
        )
    return serialize_scan_result(scan)
