import re
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, ScanResult
from app.schemas import ProductScanRequest, ProductScanResponse
from app.routers.deps import get_current_user

router = APIRouter(prefix="/products", tags=["Products"])

# Ingredient database maps for analysis
ACNE_HARMFUL = {
    "coconut oil": "Comedogenic (clogs pores) and highly likely to exacerbate acne breakouts.",
    "cocoa butter": "Highly comedogenic ingredient that creates an occlusive barrier, trapping sebum.",
    "isopropyl myristate": "Known acne trigger that penetrates pores and causes blackheads.",
    "sodium lauryl sulfate": "Harsh surfactant that can strip the skin barrier and cause rebound sebum overproduction.",
    "lanolin": "Can trap bacteria and dead skin cells in the hair follicles, leading to inflammatory papules."
}

ACNE_BENEFICIAL = {
    "salicylic acid": "Beta Hydroxy Acid (BHA) that deep cleans pores, dissolves oil, and reduces whiteheads/blackheads.",
    "benzoyl peroxide": "Targets P. acnes bacteria and reduces inflammatory acne lesions.",
    "niacinamide": "Anti-inflammatory agent that regulates sebum production and reduces post-acne dark spots.",
    "tea tree oil": "Natural antibacterial alternative to soothe active pimples.",
    "retinol": "Promotes cell turnover to prevent pore blockage and clear existing acne."
}

ECZEMA_HARMFUL = {
    "alcohol denat": "Drying alcohol that strips the lipid skin barrier and causes severe eczema flare-ups.",
    "denatured alcohol": "Drying alcohol that strips the lipid skin barrier and causes severe eczema flare-ups.",
    "isopropyl alcohol": "Extremely drying agent that damages the moisture barrier and induces skin cracking.",
    "fragrance": "Common allergen/sensitizer that frequently triggers contact dermatitis and itching.",
    "parfum": "Common allergen/sensitizer that frequently triggers contact dermatitis and itching.",
    "salicylic acid": "BHA exfoliant that is too harsh/drying for compromised eczema-prone skin barriers.",
    "glycolic acid": "Alpha Hydroxy Acid (AHA) that can cause burning and irritation on sensitive or raw eczema skin.",
    "sodium lauryl sulfate": "Aggressive surfactant that degrades skin barrier proteins and lipids."
}

ECZEMA_BENEFICIAL = {
    "ceramide": "Crucial skin-identical lipid that restores the cracked barrier in eczema patients.",
    "shea butter": "Rich emollient that provides intense hydration and reinforces the moisture envelope.",
    "colloidal oatmeal": "Clinically proven to reduce itching, inflammation, and skin redness.",
    "glycerin": "Humectant that draws water into the stratum corneum to relieve harmattan dryness.",
    "hyaluronic acid": "Attracts water molecules to skin cells, relieving tight, flaky skin irritation.",
    "petrolatum": "Creates a protective barrier to lock in skin moisture and prevent transepidermal water loss."
}

@router.post("/analyze", response_model=ProductScanResponse)
def analyze_ingredients(
    payload: ProductScanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Analyze ingredient lists against the user's latest skin condition and concern to detect risks."""
    ingredients_lower = payload.ingredients_text.lower()
    
    # Retrieve user's latest scan result
    latest_scan = db.query(ScanResult).filter(
        ScanResult.user_id == current_user.id
    ).order_by(ScanResult.date.desc()).first()
    
    condition = "general"
    if latest_scan:
        condition = latest_scan.condition_name.lower()
    elif current_user.primary_skin_concern:
        condition = current_user.primary_skin_concern.lower()
        
    fit_score = 90  # Default baseline score
    harmful_ingredients = []
    reasons = []
    beneficial_count = 0
    
    # Analyze based on skin condition
    if "acne" in condition:
        # Check harmful acne ingredients
        for ing, desc in ACNE_HARMFUL.items():
            if ing in ingredients_lower:
                harmful_ingredients.append(ing.title())
                reasons.append(desc)
                fit_score -= 20
                
        # Check beneficial acne ingredients
        for ing, desc in ACNE_BENEFICIAL.items():
            if ing in ingredients_lower:
                beneficial_count += 1
                fit_score += 5
                
        if len(harmful_ingredients) == 0:
            if beneficial_count > 0:
                reason_summary = "Excellent fit for your acne-prone skin! Contains active skin-clearing ingredients with zero flagged comedogenic pore-cloggers."
            else:
                reason_summary = "Safe to use. While this product contains no active acne treatments, it is free of comedogenic ingredients that could trigger breakouts."
        else:
            reason_summary = f"Flagged risk: Contains comedogenic or irritating ingredients ({', '.join(harmful_ingredients)}) which may block pores and worsen your active acne."
            
    elif "eczema" in condition or "dermatitis" in condition or "dry" in condition:
        # Check harmful eczema ingredients
        for ing, desc in ECZEMA_HARMFUL.items():
            if ing in ingredients_lower:
                harmful_ingredients.append(ing.title())
                reasons.append(desc)
                fit_score -= 20
                
        # Check beneficial eczema ingredients
        for ing, desc in ECZEMA_BENEFICIAL.items():
            if ing in ingredients_lower:
                beneficial_count += 1
                fit_score += 5
                
        if len(harmful_ingredients) == 0:
            if beneficial_count > 0:
                reason_summary = "Highly recommended! Packed with barrier-repairing ceramides and emollients that deeply hydrate and soothe eczema-prone skin."
            else:
                reason_summary = "Safe. This product does not contain deep-repair emollients but is free of drying alcohols, exfoliants, and fragrances."
        else:
            reason_summary = f"High alert: Contains ingredients like {', '.join(harmful_ingredients)} that are highly irritating or drying for compromised eczema skin barriers."
            
    else:
        # General/sensitive skin checks
        # Avoid harsh alcohols and sulfate surfactants
        general_harmful = {"alcohol denat": "Drying alcohol.", "sodium lauryl sulfate": "Harsh stripping surfactant.", "fragrance": "Potential skin allergen."}
        for ing, desc in general_harmful.items():
            if ing in ingredients_lower:
                harmful_ingredients.append(ing.title())
                reasons.append(desc)
                fit_score -= 10
                
        if len(harmful_ingredients) == 0:
            reason_summary = "A neutral, clean formulation suitable for general daily skincare routines."
        else:
            reason_summary = f"Mild risk: Contains {', '.join(harmful_ingredients)} which may dry out or mildly sensitize normal skin."
            
    # Clamp fit score between 0 and 100
    fit_score = max(0, min(100, fit_score))
    
    # Determine compatibility label
    if fit_score >= 80:
        compatibility = "Safe"
    elif fit_score >= 50:
        compatibility = "Use with Caution"
    else:
        compatibility = "Avoid"
        
    # Build complete detailed explanation
    reasons_detail = reason_summary
    if reasons:
        reasons_detail += " " + " ".join(reasons)
        
    return ProductScanResponse(
        fit_score=fit_score,
        compatibility=compatibility,
        reason=reasons_detail,
        harmful_ingredients=harmful_ingredients
    )
