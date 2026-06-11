import json
import random
from typing import Dict, Any, List
from fastapi import UploadFile
import google.generativeai as genai
from app.config import settings

# Initialize Gemini if API key is provided
is_gemini_configured = bool(settings.GEMINI_API_KEY)
if is_gemini_configured:
    genai.configure(api_key=settings.GEMINI_API_KEY)


def get_mock_diagnoses() -> List[Dict[str, Any]]:
    return [
        {
            "condition": {
                "name": "Eczema",
                "fullName": "Eczema (Atopic Dermatitis)",
                "description": "An inflammatory skin condition characterized by red, dry, and intensely itchy patches. It often flares up in response to dry harmattan winds or extreme humidity shifts in Nigeria.",
                "category": "Inflammatory"
            },
            "confidence": 94,
            "severity": "moderate",
            "hydrationLevel": 24,
            "sebumLevel": 31,
            "barrierIntegrity": 35,
            "hyperpigmentationIndex": 65,
            "symptoms": ["Dry skin", "Intense itching (pruritus)", "Erythema (redness or darkening on skin type V/VI)", "Scaling patches"],
            "causes": ["Genetics", "Immune system dysregulation", "Harmattan wind dryness", "Frequent use of harsh antiseptic soaps"],
            "riskIndicators": ["Avoid scratching to prevent secondary bacterial infection", "Seek a physician if patches begin weeping or leaking fluid", "Monitor for signs of fever"],
            "recommendations": ["Apply a thick emollient immediately after bathing", "Use mild, non-scented moisturizing soaps", "Avoid hot baths"],
            "clinicalInsights": "Atopic dermatitis in individuals with Fitzpatrick skin types V & VI often presents with hyperpigmented patches rather than standard bright red lesions. The tropical climate in Nigeria makes maintaining moisture retention critical, especially during the dry Harmattan season.",
            "medications": [
                {
                    "name": "Generic Hydrocortisone Cream 1%",
                    "type": "Mild Topical Steroid",
                    "tier": "budget",
                    "priceRange": "₦800 - ₦1,500",
                    "description": "Affordable, widely available mild steroid cream to reduce itching and redness.",
                    "isRecommended": True
                },
                {
                    "name": "Betnovate-N-Cream",
                    "type": "Steroid + Antibacterial",
                    "tier": "standard",
                    "priceRange": "₦2,500 - ₦5,000",
                    "description": "Medium strength topical steroid combined with an antibiotic to treat eczema showing minor infection signs.",
                    "isRecommended": False
                },
                {
                    "name": "Elocon Lotion (Mometasone)",
                    "type": "Potent Topical Steroid",
                    "tier": "premium",
                    "priceRange": "₦9,000 - ₦20,000",
                    "description": "Advanced high-potency steroid lotion, highly effective for thicker plaques and severe flare-ups.",
                    "isRecommended": False
                }
            ],
            "applicationSteps": [
                {
                    "stepNumber": 1,
                    "title": "Clean the Area",
                    "description": "Gently wash the affected skin with lukewarm water and a mild soap."
                },
                {
                    "stepNumber": 2,
                    "title": "Apply Thin Layer",
                    "description": "Apply a thin layer of the recommended cream to the affected area. Do not rub vigorously."
                },
                {
                    "stepNumber": 3,
                    "title": "Frequency",
                    "description": "Repeat 2-3 times daily, especially immediately after bathing when skin is slightly damp."
                }
            ]
        },
        {
            "condition": {
                "name": "Acne Vulgaris",
                "fullName": "Acne Vulgaris (Pimples)",
                "description": "A common skin condition occurring when hair follicles become clogged with oil and dead skin cells, leading to blackheads, whiteheads, or inflamed pimples.",
                "category": "Bacterial / Oil Secretion"
            },
            "confidence": 88,
            "severity": "mild",
            "hydrationLevel": 62,
            "sebumLevel": 88,
            "barrierIntegrity": 58,
            "hyperpigmentationIndex": 72,
            "symptoms": ["Papules (pimples)", "Comedones (blackheads/whiteheads)", "Oily skin", "Hyperpigmentation"],
            "causes": ["Excess sebum production", "P. acnes bacteria", "Hormonal factors", "Humidity and sweating"],
            "riskIndicators": ["Do not squeeze or pop pimples to avoid permanent dark spots and scarring", "Avoid oil-based cosmetics"],
            "recommendations": ["Wash face twice daily with a salicylic acid cleanser", "Use non-comedogenic sunscreen", "Maintain hydration"],
            "clinicalInsights": "Acne in African skin types is strongly associated with Post-Inflammatory Hyperpigmentation (PIH). Early treatment is key to prevent dark spots that can last for months. Clean skin hygiene is essential given Nigeria's warm and humid weather.",
            "medications": [
                {
                    "name": "Generic Benzoyl Peroxide Gel 5%",
                    "type": "Antimicrobial & Keratolytic Gel",
                    "tier": "budget",
                    "priceRange": "₦1,200 - ₦2,200",
                    "description": "Kills acne-causing bacteria and helps clear clogged pores.",
                    "isRecommended": True
                },
                {
                    "name": "Differin Gel (Adapalene 0.1%)",
                    "type": "Topical Retinoid",
                    "tier": "standard",
                    "priceRange": "₦4,500 - ₦7,500",
                    "description": "Clears blackheads/whiteheads and prevents new acne. Also helps fade dark spots.",
                    "isRecommended": False
                },
                {
                    "name": "Duac Once Daily Gel",
                    "type": "Clindamycin + Benzoyl Peroxide",
                    "tier": "premium",
                    "priceRange": "₦12,000 - ₦18,000",
                    "description": "Premium dual-action gel combining an antibiotic and benzoyl peroxide for fast clearance.",
                    "isRecommended": False
                }
            ],
            "applicationSteps": [
                {
                    "stepNumber": 1,
                    "title": "Wash and Dry Face",
                    "description": "Wash face with a gentle cleanser and pat dry with a clean towel."
                },
                {
                    "stepNumber": 2,
                    "title": "Apply a Pea-Sized Amount",
                    "description": "Spread a small, pea-sized amount evenly over the entire affected area, avoiding the eyes and mouth."
                },
                {
                    "stepNumber": 3,
                    "title": "Frequency",
                    "description": "Apply once daily at night, followed by a light oil-free moisturizer."
                }
            ]
        }
    ]


async def analyze_skin_image(file: UploadFile, symptoms: str) -> Dict[str, Any]:
    """
    Analyzes an uploaded skin image and symptoms description.
    Uses Gemini Vision API if configured, otherwise falls back to a high-quality mock diagnosis.
    """
    if is_gemini_configured:
        try:
            # Read image bytes
            image_data = await file.read()
            await file.seek(0)
            
            # Setup prompt optimized for Fitzpatick types and Nigerian contexts
            prompt = f"""
            You are a dermatology expert AI specializing in Fitzpatrick skin types V & VI (African skin tones) and tropical/Nigerian climate contexts.
            Analyze this skin lesion image alongside the patient's symptoms: "{symptoms}".
            
            Provide a detailed diagnosis and recommended treatment in a strictly valid JSON format.
            Ensure the prices are realistic for the Nigerian pharmaceutical market (in Naira ₦).
            Ensure the response is a single valid JSON object matching this schema:
            {{
              "condition": {{
                "name": "Short Name (e.g. Eczema)",
                "fullName": "Full Medical Name (e.g. Eczema (Atopic Dermatitis))",
                "description": "Brief patient-friendly explanation of the condition",
                "category": "e.g. Inflammatory, Bacterial, Fungal"
              }},
              "confidence": integer (0 to 100),
              "severity": "mild", "moderate", "severe", or "critical",
              "hydrationLevel": integer (0 to 100),
              "sebumLevel": integer (0 to 100),
              "barrierIntegrity": integer (0 to 100),
              "hyperpigmentationIndex": integer (0 to 100),
              "symptoms": ["symptom 1", "symptom 2", ...],
              "causes": ["cause 1", "cause 2", ...],
              "riskIndicators": ["warning 1", "warning 2", ...],
              "recommendations": ["lifestyle recommendation 1", ...],
              "clinicalInsights": "Medical insight specifically explaining how this condition behaves in dark skin tones or warm/humid Nigerian climates",
              "medications": [
                {{
                  "name": "Medication Name",
                  "type": "Medical description of drug",
                  "tier": "budget", "standard", or "premium",
                  "priceRange": "₦Price Range",
                  "description": "How it works for this condition",
                  "isRecommended": boolean
                }}
              ],
              "applicationSteps": [
                {{
                  "stepNumber": integer,
                  "title": "Step title",
                  "description": "Detailed step instructions"
                }}
              ]
            }}
            """
            
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            contents = [
                {"mime_type": file.content_type, "data": image_data},
                prompt
            ]
            
            response = model.generate_content(
                contents,
                generation_config={"response_mime_type": "application/json"}
            )
            
            # Parse response text to json
            result = json.loads(response.text)
            return result
            
        except Exception as e:
            print(f"Gemini API analysis failed: {e}. Falling back to mock diagnosis.")
            
    # Mock Fallback
    mock_list = get_mock_diagnoses()
    # If the user symptoms match acne keywords, return acne, else eczema
    symptoms_lower = symptoms.lower()
    if "pimple" in symptoms_lower or "acne" in symptoms_lower or "face" in symptoms_lower or "spot" in symptoms_lower:
        return mock_list[1]
    
    # Randomly select or return eczema
    return mock_list[0]
