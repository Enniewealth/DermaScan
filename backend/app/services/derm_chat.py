# ============================================
# DermaScan — Derm Chat Service
# Integrates Gemini AI for chat, with full
# system prompt and intelligent mock fallback
# ============================================

import json
import random
from typing import Dict, Any, List, Optional
import google.generativeai as genai
from app.config import settings

is_gemini_configured = bool(settings.GEMINI_API_KEY)
if is_gemini_configured:
    genai.configure(api_key=settings.GEMINI_API_KEY)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DERM_SYSTEM_PROMPT = """You are Derm, the AI skin health assistant inside DermaScan — a mobile application built specifically for Nigerian users and people across all six Fitzpatrick skin tones (with a special understanding of melanin-rich, darker skin).

Your role is to help users understand their skin conditions, interpret their scan results, guide toward appropriate care, and connect them to dermatologists when needed. You must understand how every condition presents differently across the full Fitzpatrick spectrum — and never assume a user's skin type unless they have told you or completed the quiz.

IDENTITY & PERSONALITY:
- Warm but clinical. Like a knowledgeable doctor friend.
- Calm and reassuring. Never alarm unnecessarily.
- Direct. Give real answers without excessive disclaimers.
- Humble. Know your limits and direct to specialists when needed.
- Nigerian-aware. Understand limited dermatologist access, cost sensitivity, local pharmacy availability, tropical skin conditions.

RESPONSE FORMAT:
- Short, clear paragraphs. Maximum 4-5 short paragraphs.
- Plain English — no jargon without explanation.
- Use numbered lists or bullet points for steps.
- Bold condition names and key terms using **bold**.
- Never write walls of text.
- If more detail needed, offer: "Want me to go deeper on this?"

LANGUAGE & COMMUNICATION RULES:
- Always respond in the language the user writes in (English, Yoruba, Hausa, Igbo). Switch immediately if they do.
- Avoid: "Normal skin", "Damaged skin", "Ethnic/Exotic skin", "Problem skin", "Bleaching" (as a recommendation), "It's just cosmetic".
- Use instead: "Your skin type", "How this presents on your skin", "This is very common for your skin tone", "This is a medical condition, not a flaw".

FITZPATRICK SPECTRUM KNOWLEDGE & PRESENTATION:
1. Acne: Types I-III (red/pink lesions, PIE); Types IV-VI (darker papules, PIH is a primary concern. Benzoyl peroxide 2.5% to avoid PIH).
2. Eczema: Types I-III (red/weeping/scaly); Types IV-VI (grey/dark brown/ashen patches, prominent follicles. Itch without visible redness is common).
3. Psoriasis: Types I-III (silvery-white scale on red plaques); Types IV-VI (grey/violet/dark brown plaques).
4. Rosacea: Types I-III (facial redness/flushing); Types IV-VI (rare, burning/stinging without redness, granulomatous firm brown papules).
5. Hyperpigmentation: Types I-III (sun spots, PIE); Types IV-VI (PIH is the dominant concern from any inflammation, deep melasma).
6. Fungal (Tinea versicolor): Types I-III (darker patches); Types IV-VI (lighter/hypopigmented patches).
7. Sun Damage/Skin Cancer: Types I-III (high risk, melanoma on sun-exposed areas); Types IV-VI (melanoma rare but found on palms, soles, under nails - acral lentiginous).
8. Scarring: Types I-III (hypertrophic); Types IV-VI (significantly elevated Keloid risk from minor trauma/acne).
9. Vitiligo: Handle with MAXIMUM emotional sensitivity, especially for Types IV-VI where contrast is high.

RESPONSE RULES BY SKIN TYPE:
- If UNKNOWN: Ask before giving specific guidance ("Are you fair-skinned, medium, or dark-skinned?") or direct to the skin quiz.
- Types I-II: Lead sun protection messages, interpret redness as inflammation.
- Types III-IV: Address both PIH risk and UV awareness.
- Types V-VI: Address PIH as a secondary concern. Never describe erythema as a symptom — use "darkening" or "discolouration". Mention keloid risk for skin trauma. Affirm darker skin is not "problem skin".

UNIVERSAL TREATMENT PRINCIPLES:
1. Patch test everything new on a small area first.
2. Introduce one new product at a time.
3. Consistency matters more than product selection.
4. Less is more — a 3-step routine done daily beats a 10-step routine twice a week.
5. SPF is not optional for any skin type (prevents cancer in I-III, prevents PIH/Melasma in IV-VI).
6. Mental health and skin health are connected — acknowledge the psychological weight.

TREATMENT GUIDANCE (Nigeria-specific):
- Recommend generic drug classes (clotrimazole, hydrocortisone 1%, benzoyl peroxide, salicylic/azelaic/kojic acid), not brands.
- NEVER recommend mercury-containing products or hydroquinone above 2% (warn about ochronosis).

RESPONSE STRUCTURE:
For condition questions: name/define → skin-type presentation → causes → self-care steps → when to see doctor.
For treatment questions: self-care → OTC options in Nigeria → what dermatologist would prescribe → what to avoid → timeline.
For symptoms: ask 1-2 clarifying questions (including skin type if unknown) → list possibilities → recommend scan.

HARD LIMITS & ESCALATION:
- Never diagnose definitively, prescribe, dismiss concerns, repeat disclaimers robotically, or lead with worst-case scenarios.
- Escalate (recommend dermatologist) for: rapidly spreading rash, weeping/infected skin, burns, not improving after 2-3 weeks, suspicious moles (especially on palms/soles/nails), severe scan results.

IMPORTANT: Your responses must be formatted as valid JSON with this structure:
{
  "reply": "your response text here",
  "suggested_replies": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "escalation": null or {"message": "...", "cta_text": "...", "price_from": "₦2,500"}
}

The "reply" field should contain your actual response with **bold** formatting for key terms.
The "suggested_replies" field should contain 2-3 contextual quick-reply suggestions.
The "escalation" field should be null unless you detect severity requiring professional attention.
"""

DERM_SYSTEM_PROMPT += """

CONVERSATION INTELLIGENCE RULES
=================================

RULE 1 — NEVER ASK FOR INFORMATION ALREADY GIVEN:
Before responding, scan the full conversation history for information already provided:
  - Body location (arm, face, knee, back, etc.)
  - Duration (days, weeks, months)
  - Symptoms (itchy, painful, burning, spreading)
  - Appearance (patches, bumps, spots, rash, ring)

If already provided: extract and use it. Do NOT ask for it again.

CORRECT example:
User: "patches, the back of my knee, three weeks, it is itchy"
Response: Jump straight to assessment.
Location = back of knee ✓
Duration = three weeks ✓
Symptom = itchy patches ✓
This is enough to give a focused assessment.

WRONG example:
User: same message above
Response: "Where exactly is the rash? How long have you had it?"
This is wrong. Never do this.

---

RULE 2 — NEVER REPEAT THE SAME RESPONSE:
Read the conversation history before every response. If you gave a response in a previous turn, do not repeat it. Always build the conversation forward.

---

RULE 3 — PROGRESSIVE ASSESSMENT MODEL:
Turn 1: Gather only what is genuinely missing
Turn 2: Give initial assessment based on what you know
Turn 3+: Refine, answer follow-ups, escalate if needed

Never stay on Turn 1 behaviour after the user has provided symptoms.

---

RULE 4 — ONE QUESTION MAXIMUM PER TURN:
If you need clarification, ask ONE question only. Never list multiple questions at once. Choose the single most important missing piece of information.

---

RULE 5 — NO MID-CONVERSATION GREETINGS:
Never say "Thanks for reaching out" or "I'm here to help" or "I'm ready to help" after the first message. These are opening lines only. After message 1, go straight to the response.

---

RULE 6 — EXTRACT BEFORE ASKING:
Minimum information needed for initial assessment:
  - At least one symptom type AND
  - Body location OR duration
If you have both → give assessment now.
If you are missing both → ask for symptoms first.
If you have symptoms but no location → ask location only.
"""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MOCK RESPONSES (when no Gemini API key)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MOCK_RESPONSES: Dict[str, Dict[str, Any]] = {
    "eczema": {
        "reply": "**Eczema** (atopic dermatitis) is an inflammatory condition that causes dry, itchy patches on your skin. On darker skin tones, it often appears as darker brown, greyish, or even purple patches rather than the typical red.\n\nIn Nigeria's climate, eczema tends to flare up during Harmattan when the air is very dry, or during extreme humidity shifts.\n\n**What you can do right now:**\n1. Apply a thick emollient (like shea butter or petroleum jelly) right after bathing\n2. Avoid harsh antiseptic soaps — use gentle, fragrance-free cleansers\n3. Keep the area moisturised throughout the day\n4. Avoid scratching — it can cause **post-inflammatory hyperpigmentation** (dark marks)\n\nIf the patches are spreading, weeping, or not improving after 2 weeks of consistent care, it's worth seeing a dermatologist.",
        "suggested_replies": ["What triggers eczema?", "Show me treatment options", "Can it cause dark marks?"],
        "escalation": None
    },
    "acne": {
        "reply": "**Acne** happens when your pores get clogged with oil and dead skin cells. On melanin-rich skin, the biggest concern isn't just the pimples themselves — it's the **dark spots (PIH)** they can leave behind.\n\nThis is especially common in Nigeria's warm, humid climate where your skin produces more oil.\n\n**What you can do:**\n1. Wash your face twice daily with a gentle cleanser containing **salicylic acid** (2%)\n2. Apply **benzoyl peroxide** (5%) sparingly to active spots at night\n3. Use a lightweight, oil-free moisturiser\n4. **Never squeeze or pop pimples** — this almost always causes dark spots on darker skin\n5. Use sunscreen daily — yes, even with dark skin — to prevent existing spots from getting darker\n\nMost mild acne responds well to consistent care within 4-6 weeks.",
        "suggested_replies": ["How do I fade dark spots?", "What products should I avoid?", "Is my acne hormonal?"],
        "escalation": None
    },
    "dark_spots": {
        "reply": "**Dark spots** (post-inflammatory hyperpigmentation or PIH) are very common in people with Fitzpatrick IV–VI skin tones. They happen when your skin produces extra melanin in response to inflammation, injury, or irritation.\n\nCommon causes include acne, eczema, insect bites, razor bumps, and even harsh skincare products.\n\n**Safe and effective treatments available in Nigerian pharmacies:**\n1. **Azelaic acid** (15-20%) — gentle and effective, won't thin your skin\n2. **Kojic acid** creams — helps lighten spots gradually\n3. **Vitamin C serum** — brightens and protects\n4. **Niacinamide** (vitamin B3) — reduces melanin transfer\n\n**Important:** Avoid hydroquinone above 2% and any product containing mercury. These can cause serious damage including **ochronosis** (permanent blue-grey discolouration).\n\nAlways wear sunscreen — even brief sun exposure can darken existing spots.",
        "suggested_replies": ["How long to see results?", "Are bleaching creams safe?", "What about lemon juice?"],
        "escalation": None
    },
    "rash": {
        "reply": "I'd like to help you figure out what's going on. A few quick questions:\n\n1. **Where exactly is the rash?** (face, arms, trunk, etc.)\n2. **How long have you had it?** (days, weeks, months)\n\nBased on what you've described, it could be a few things:\n- **Eczema** — dry, itchy patches, common in Harmattan\n- **Tinea** (fungal infection) — ring-shaped patches, very common in Nigeria's humid climate\n- **Contact dermatitis** — a reaction to something your skin touched\n\n**In the meantime:**\n- Keep the area clean and dry\n- Avoid scratching\n- Apply a gentle moisturiser if it feels dry\n- Consider doing a **DermaScan** for a more specific identification\n\nIf you can share a photo, I can give you a more focused assessment.",
        "suggested_replies": ["I'll upload a photo", "It's on my arm", "It's been about a week"],
        "escalation": None
    },
    "scan_context_eczema": {
        "reply": "I can see your scan picked up **moderate eczema** on your forearm with a **94% confidence** score.\n\nHere's what this means:\n- The AI is quite confident in this identification\n- **Moderate severity** means it needs active care but isn't urgent\n- On your skin tone, the inflammation may appear as darker or greyish patches rather than red\n\n**Your next steps:**\n1. Start a consistent moisturising routine — apply emollient 2-3 times daily\n2. A mild **hydrocortisone cream (1%)** from your local pharmacy can help with itching — use for no more than 7 days\n3. Avoid harsh soaps and very hot water\n4. Watch for **hyperpigmentation** — the dark marks eczema can leave. Gentle exfoliation later can help\n\nIf it doesn't improve in 2-3 weeks, or if it starts weeping or spreading, I'd recommend seeing a dermatologist.\n\nWhat would you like to know more about?",
        "suggested_replies": ["What triggers eczema?", "Will it leave dark marks?", "Talk to a dermatologist"],
        "escalation": None
    },
    "severe_condition": {
        "reply": "Based on what you've described, I think it's important to see a dermatologist **soon**.\n\nHere's why: symptoms like spreading patches with weeping or crusting can indicate a secondary infection that needs medical treatment beyond what over-the-counter products can address.\n\n**In the meantime:**\n- Keep the area clean and dry\n- Don't apply any new products to the affected area\n- Avoid scratching or picking at the skin\n\nDermaScan can connect you to an available specialist — you can get a consultation from as little as ₦2,500.",
        "suggested_replies": ["Show me available experts", "What could it be?", "Is it urgent?"],
        "escalation": {
            "message": "This may need professional attention.",
            "cta_text": "See Available Experts",
            "price_from": "₦2,500"
        }
    },
    "greeting": {
        "reply": "Hi, I'm **Derm** — your AI skin assistant. 👋\n\nTell me what's going on with your skin and I'll do my best to help. You can describe a symptom, ask about a condition, or share an image — and I speak Yoruba, Hausa, and Igbo too.\n\nJust so you know — I'm an AI assistant, not a doctor. I can help you understand your skin and guide you toward the right care, but for anything serious, please see a qualified dermatologist. DermaScan can connect you to one anytime.",
        "suggested_replies": ["I have a rash on my arm", "What causes dark spots?", "Talk to me in Yoruba"],
        "escalation": None
    },
    "yoruba_greeting": {
        "reply": "Pẹ̀lẹ́ o! Mo jẹ́ **Derm** — olùrànlọ́wọ́ àwọ̀ ara rẹ tí AI ṣe. 👋\n\nSọ ohun tí ó ń ṣẹlẹ̀ pẹ̀lú àwọ̀ ara rẹ fún mi, èmi yóò gbìyànjú láti ràn ọ́ lọ́wọ́. O lè ṣàpèjúwe àmì àrùn kan, béèrè nípa ipò àwọ̀ ara, tàbí pín àwòrán kan.\n\nMáà gbàgbé pé èmi jẹ́ olùrànlọ́wọ́ AI, kìí ṣe dókítà. Fún ohunkóhun tí ó ṣe pàtàkì, jọ̀wọ́ rí oníṣègùn àwọ̀ ara kan.",
        "suggested_replies": ["Mo ní ìrora ní àwọ̀ ara mi", "Kí ló ń fa àmì dúdú?", "Ṣé àrùn mi lè ràn?"],
        "escalation": None
    },
    "bleaching": {
        "reply": "I understand this is something many people think about, and I'm happy to give you the facts.\n\n**Products to avoid completely:**\n- Anything containing **mercury** — causes kidney damage and permanent skin discolouration\n- **Hydroquinone above 2%** — can cause **ochronosis** (permanent blue-grey patches)\n- **Unregulated topical steroids** — thins the skin and causes stretch marks, acne, and rebound darkening\n\nThese ingredients are found in many unregulated products sold in Nigerian markets, even if they claim to be \"toning\" or \"glowing\" creams.\n\n**If your goal is to treat dark spots or uneven skin tone, these are safe and effective options:**\n1. **Azelaic acid** — evens out tone without thinning skin\n2. **Kojic acid** — natural melanin regulator\n3. **Niacinamide** — brightens and strengthens your skin barrier\n4. **Vitamin C serum** — antioxidant protection + brightening\n5. **Sunscreen daily** — prevents spots from darkening\n\nThese work gradually (4-8 weeks) but they're safe for long-term use.",
        "suggested_replies": ["How do I know if a product is safe?", "What is ochronosis?", "Recommend a routine for uneven tone"],
        "escalation": None
    },
    "contagious": {
        "reply": "Good question! Whether a skin condition is contagious depends on what it is:\n\n**Contagious conditions (can spread to others):**\n- **Ringworm (Tinea)** — very common in Nigeria, spreads through direct contact\n- **Scabies** — spreads through prolonged skin-to-skin contact\n- **Impetigo** — bacterial infection, common in children\n- **Chickenpox** — highly contagious viral infection\n\n**NOT contagious (cannot spread to others):**\n- **Eczema** — inflammatory, not infectious\n- **Acne** — caused by your own oil and bacteria\n- **Psoriasis** — autoimmune condition\n- **Vitiligo** — pigment loss, not infectious\n- **Keloids** — scar tissue overgrowth\n\nIf you're unsure about a specific condition, you can do a scan and I'll tell you whether it's something that can spread.\n\nDo you have a specific condition you're wondering about?",
        "suggested_replies": ["Tell me about ringworm", "I think I have scabies", "Scan my skin"],
        "escalation": None
    },
    "default": {
        "reply": "Thanks for reaching out! I'm here to help with any skin-related concerns.\n\nCould you tell me a bit more about what you're experiencing? For example:\n- What does it look like? (patches, bumps, spots, rash)\n- Where on your body is it?\n- How long have you noticed it?\n- Is it itchy, painful, or just visible?\n\nYou can also upload a photo or do a scan for a more accurate assessment.\n\nI'm ready to help!",
        "suggested_replies": ["I have a rash", "I want to scan my skin", "What causes dark spots?"],
        "escalation": None
    }
}


def _extract_info_from_history(history: List[Dict]) -> Dict[str, Optional[str]]:
    """Extract location, duration, symptoms, appearance from conversation history."""
    extracted = {
        "location": None,
        "duration": None,
        "symptoms": [],
        "appearance": [],
    }

    body_parts = [
        "arm", "elbow", "wrist", "hand", "finger",
        "leg", "knee", "ankle", "foot", "toe", "thigh", "calf",
        "face", "forehead", "cheek", "chin", "nose", "lip", "eye",
        "neck", "shoulder", "chest", "back", "stomach", "waist",
        "scalp", "ear", "groin", "buttock",
    ]
    duration_words = [
        "day", "days", "week", "weeks", "month", "months", "year", "years",
        "today", "yesterday", "morning", "evening",
    ]
    symptom_words = [
        "itch", "itchy", "itching", "pain", "painful", "burning", "burn",
        "stinging", "tingling", "numb", "swelling", "swollen", "dry",
        "peeling", "flaking", "cracking", "oozing", "weeping", "bleeding",
        "sore", "tender", "throbbing", "warm", "hot",
    ]
    appearance_words = [
        "patch", "patches", "bump", "bumps", "spot", "spots", "rash",
        "ring", "rings", "blister", "blisters", "pimple", "pimples",
        "lump", "scale", "scales", "scab", "mark", "marks", "lesion",
        "mole", "dot", "dots", "line", "lines", "streak",
    ]

    for msg in history:
        content = msg.get("content", "").lower()
        for part in body_parts:
            if part in content and not extracted["location"]:
                extracted["location"] = part
        for word in duration_words:
            if word in content and not extracted["duration"]:
                extracted["duration"] = word
        for word in symptom_words:
            if word in content and word not in extracted["symptoms"]:
                extracted["symptoms"].append(word)
        for word in appearance_words:
            if word in content and word not in extracted["appearance"]:
                extracted["appearance"].append(word)

    return extracted


def _match_mock_response(
    message: str,
    scan_context: Optional[Dict] = None,
    language: str = "EN",
    history: List[Dict] = None,
) -> str:
    """Match user message to the best mock response key, using conversation history."""
    if history is None:
        history = []

    msg = message.lower().strip()

    # Check for Yoruba
    if language == "YO" or any(w in msg for w in ["yoruba", "yorùbá", "sọ", "pẹ̀lẹ́", "àwọ̀"]):
        return "yoruba_greeting"

    # Check for scan context
    if scan_context and scan_context.get("condition") and len(history) <= 1:
        return "scan_context_eczema"

    # Extract info from full history (including current message)
    all_history = list(history) + [{"role": "user", "content": message}]
    info = _extract_info_from_history(all_history)
    has_rich_info = info["location"] and info["symptoms"]

    # Greetings (only on first message with no prior history)
    if len(history) <= 1 and any(w in msg for w in ["hi", "hello", "hey", "good morning", "good afternoon"]):
        return "greeting"

    # Bleaching / lightening
    if any(w in msg for w in ["bleach", "lighten", "toning cream", "glow", "fair", "lighter skin", "bleaching"]):
        return "bleaching"

    # Contagious
    if any(w in msg for w in ["contagious", "spread", "catch", "infectious"]):
        return "contagious"

    # Dark spots / hyperpigmentation
    if any(w in msg for w in ["dark spot", "dark marks", "hyperpigmentation", "black spot", "uneven tone"]):
        return "dark_spots"

    # Eczema keywords
    if any(w in msg for w in ["eczema", "atopic", "dry skin"]):
        return "eczema"

    # Acne
    if any(w in msg for w in ["acne", "pimple", "pimples", "breakout", "spots on face", "bumps on face"]):
        return "acne"

    # Severe / urgent
    if any(w in msg for w in ["spreading", "weeping", "pus", "fever", "infected", "severe", "emergency", "urgent", "worse"]):
        return "severe_condition"

    # Short generic follow-ups after rich info was already provided
    if has_rich_info and len(msg.split()) <= 2:
        return "scan_context_eczema"

    # First messages with very little info → give a targeted ask
    if len(history) <= 1 and not has_rich_info:
        return "rash"

    # Rich info provided → give assessment
    if has_rich_info:
        return "scan_context_eczema"

    # Fallback: progressive — if they've provided partial info
    if info["symptoms"]:
        return "rash"

    return "default"


async def get_derm_response(
    message: str,
    language: str = "EN",
    scan_context: Optional[Dict] = None,
    history: List[Dict] = None,
    mode: str = "text",
    user_name: str = "",
) -> Dict[str, Any]:
    """
    Generate a Derm response using Gemini AI or mock fallback.
    """
    if history is None:
        history = []

    if is_gemini_configured:
        try:
            return await _gemini_response(message, language, scan_context, history, mode, user_name)
        except Exception as e:
            print(f"Gemini chat failed: {e}. Falling back to mock.")

    # Mock fallback — now uses conversation history
    key = _match_mock_response(message, scan_context, language, history)

    # Build a dynamic response if user already provided rich info
    all_history = list(history) + [{"role": "user", "content": message}]
    info = _extract_info_from_history(all_history)
    has_rich_info = info["location"] and info["symptoms"]

    if key == "scan_context_eczema" and has_rich_info and not scan_context:
        # Dynamic assessment based on extracted info
        location = info["location"] or "affected area"
        symptom_list = ", ".join(info["symptoms"][:3]) if info["symptoms"] else "irritated"
        duration = info["duration"] or "some time"

        response = {
            "reply": f"Based on what you've told me — {symptom_list} on your **{location}** that's been present for **{duration}** — this sounds most like **eczema (atopic dermatitis)** or possibly **contact dermatitis**.\n\n**Eczema** often presents as dry, itchy patches and can flare in Nigeria's Harmattan or humid shifts. On melanin-rich skin, it may appear as darker or greyish patches rather than the typical redness.\n\n**What to do now:**\n1. Apply a thick emollient (like shea butter or petroleum jelly) after bathing\n2. Use gentle, fragrance-free cleansers — avoid harsh antiseptic soaps\n3. Try an OTC **hydrocortisone 1% cream** from your pharmacy for 5-7 days for the itching\n4. Avoid scratching — this can cause **post-inflammatory hyperpigmentation** (dark marks)\n\nIf it doesn't improve in 2 weeks, or starts weeping/spreading, see a dermatologist.",
            "suggested_replies": ["What triggers eczema?", "Will it leave dark marks?", "What cream can I buy?"],
            "escalation": None,
        }
        return _apply_mode(response, mode)

    response = MOCK_RESPONSES[key].copy()
    return _apply_mode(response, mode)


def _apply_mode(response: Dict, mode: str) -> Dict:
    """Apply voice mode formatting to a response."""
    if mode == "voice":
        response = response.copy()
        reply = response["reply"]
        reply = reply.replace("**", "")
        reply = reply.replace("1. ", "First, ").replace("2. ", "Also, ").replace("3. ", "And, ").replace("4. ", "Finally, ").replace("5. ", "Lastly, ")
        response["reply"] = reply
        response["suggested_replies"] = response["suggested_replies"][:2]
    return response


async def _gemini_response(
    message: str,
    language: str,
    scan_context: Optional[Dict],
    history: List[Dict],
    mode: str,
    user_name: str,
) -> Dict[str, Any]:
    """Call Gemini API with the Derm system prompt."""

    # Build the contextual system prompt
    system_prompt = DERM_SYSTEM_PROMPT

    if language != "EN":
        lang_map = {"YO": "Yoruba", "HA": "Hausa", "IG": "Igbo"}
        system_prompt += f"\n\nIMPORTANT: The user has selected {lang_map.get(language, language)} language. Respond ENTIRELY in {lang_map.get(language, language)}. For medical terms with no direct translation, use the English term followed by a plain explanation in {lang_map.get(language, language)}."

    if scan_context:
        system_prompt += f"\n\nSCAN CONTEXT (current scan result):\n{json.dumps(scan_context, indent=2)}\nReference this scan naturally in your first response. Don't make the user re-explain."

    if mode == "voice":
        system_prompt += "\n\nVOICE MODE: Shorten responses to 3-5 sentences. No bullet points, no markdown bold, no numbered lists. Use natural spoken transitions. End with a clear question. Spell out numbers for natural speech."

    # Build conversation history for Gemini
    contents = []

    for msg in history:
        role = "user" if msg["role"] == "user" else "model"

        # Gemini requires the conversation to start with 'user'
        if not contents and role == "model":
            continue  # Skip assistant messages at the very start

        contents.append({"role": role, "parts": [msg["content"]]})

    # Add current user message as a new user turn
    contents.append({"role": "user", "parts": [message]})

    model = genai.GenerativeModel(
        "gemini-1.5-flash",
        system_instruction=system_prompt,
    )

    response = model.generate_content(
        contents,
        generation_config={"response_mime_type": "application/json"}
    )

    result = json.loads(response.text)

    # Ensure proper structure
    return {
        "reply": result.get("reply", "I'm sorry, I couldn't process that. Could you try rephrasing?"),
        "suggested_replies": result.get("suggested_replies", ["Tell me more", "Scan my skin", "Talk to a doctor"]),
        "escalation": result.get("escalation", None),
    }
