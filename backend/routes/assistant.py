from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, List

from database import get_db
from models.schemas import AssistantChatRequest, AssistantChatResponse
from services.gemini_service import ask_gemini_assistant, get_gemini_api_key
from services.knowledge_service import search_knowledge

router = APIRouter(prefix="/api/assistant", tags=["Agricultural AI Assistant"])

KANNADA_KNOWLEDGE_SNIPPETS = {
    "yellow": "ಟೊಮೆಟೊ ಅಥವಾ ಬೆಳೆಗಳ ಎಲೆಗಳು ಹಳದಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗಲು ಪ್ರಮುಖ ಕಾರಣಗಳು: ಸಾರಜನಕದ (Nitrogen) ಕೊರತೆ, ಅಧಿಕ ನೀರು ನಿಲ್ಲುವುದು, ಅಥವಾ ಆರಂಭಿಕ ಬ್ಲೈಟ್ (Early Blight) ಶಿಲೀಂಧ್ರ ರೋಗ. ನಿಯಂತ್ರಣ ಕ್ರಮ: ಬೇವಿನ ಎಣ್ಣೆ (Neem oil 5ml/L) ಸಿಂಪಡಿಸಿ, ಸಾವಯವ ಗೊಬ್ಬರ ನೀಡಿ ಮತ್ತು ಹೆಚ್ಚುವರಿ ನೀರನ್ನು ಹೊರಹಾಕಿ.",
    "blight": "ಬ್ಲೈಟ್ (ಕೊಳೆ ರೋಗ) ತಡೆಯಲು ಕ್ರಮಗಳು: ತೇವಾಂಶ ಹೆಚ್ಚಿರುವಾಗ ರೋಗ ವೇಗವಾಗಿ ಹರಡುತ್ತದೆ. ಟ್ರೈಕೋಡರ್ಮಾ ವಿರಿಡೆ (Trichoderma viride - 20g/L) ಅಥವಾ ಸುಡೋಮೊನಾಸ್ ಸಿಂಪಡಿಸಿ. ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ಕಿತ್ತು ಸುಟ್ಟುಹಾಕಿ.",
    "rain": "ಭಾರೀ ಮಳೆಯ ನಂತರದ ನಿರ್ವಹಣೆ: ಹೊಲದಲ್ಲಿ ನಿಂತ ನೀರನ್ನು ತಕ್ಷಣ ಬಸಿದು ತೆಗೆಯಿರಿ. ಬೇರು ಕೊಳೆತ ತಡೆಯಲು ಬೋರ್ಡೋ ಮಿಶ್ರಣ (Bordeaux mixture 1%) ಅಥವಾ ತಾಮ್ರದ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ ಸಿಂಪಡಿಸಿ. ಸಾರಜನಕವನ್ನು ಮಣ್ಣು ಒಣಗಿದ ನಂತರವೇ ನೀಡಿ.",
    "soil": "ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸಲು: ಎರೆಹುಳು ಗೊಬ್ಬರ (Vermicompost) ಮತ್ತು ಹಸಿರೆಲೆ ಗೊಬ್ಬರಗಳನ್ನು (ಹಣಸೆ, ಸೆಣಬು) ಬಳಸಿ. ಪ್ರತಿ 2 ವರ್ಷಕ್ಕೊಮ್ಮೆ ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮಾಡಿಸಿ.",
    "default": "ನಮಸ್ಕಾರ! ಅಗ್ರಿಮಿತ್ರ (AgriMitra) ಕೃಷಿ ಸಹಾಯಕ್ಕೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಬೆಳೆ ರೋಗ, ಹವಾಮಾನ ನಿರ್ವಹಣೆ ಅಥವಾ ಸಾವಯವ ಪರಿಹಾರಗಳ ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ. ಕೀಟನಾಶಕ ಬಳಸುವ ಮುನ್ನ ಕೃಷಿ ವಿಸ್ತರಣಾಧಿಕಾರಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ."
}

@router.post("/chat", response_model=AssistantChatResponse)
def chat_with_assistant(req: AssistantChatRequest, db: Session = Depends(get_db)):
    user_msg = req.message.strip().lower()
    lang = req.language.lower() # "en" or "kn"

    # Search knowledge base for matching agronomic facts
    knowledge_records = search_knowledge(query=user_msg, limit=2)
    sources = []
    context_snippets = []

    for rec in knowledge_records:
        title = rec.get("disease_or_topic", "")
        crop = rec.get("crop", "")
        symptoms = rec.get("symptoms", "")
        remedies = rec.get("organic_remedies", "")
        src = rec.get("sources", "ICAR / Agricultural Guidelines")
        sources.append(src)
        context_snippets.append(f"[{crop} - {title}]: Symptoms: {symptoms}. Organic remedies: {remedies}")

    joined_context = "\n".join(context_snippets)

    # 1. Attempt Gemini if configured
    gemini_key = get_gemini_api_key()
    if gemini_key:
        gemini_res = ask_gemini_assistant(prompt=req.message, context=joined_context, language=lang)
        if gemini_res.get("success") and gemini_res.get("text"):
            return AssistantChatResponse(
                reply=gemini_res["text"],
                language=lang,
                sources=list(set(sources)),
                suggested_questions=[
                    "What are the best organic treatments for leaf spots?",
                    "How should I adjust watering after rain?",
                    "When is the best time to spray bio-fungicides?"
                ] if lang == "en" else [
                    "ಎಲೆ ಚುಕ್ಕೆ ರೋಗಕ್ಕೆ ಸಾವಯವ ಪರಿಹಾರಗಳೇನು?",
                    "ಮಳೆಯ ನಂತರ ನೀರಿನ ನಿರ್ವಹಣೆ ಹೇಗೆ ಮಾಡಬೇಕು?",
                    "ಜೈವಿಕ ಶಿಲೀಂಧ್ರನಾಶಕಗಳನ್ನು ಯಾವಾಗ ಸಿಂಪಡಿಸಬೇಕು?"
                ],
                is_simulated=False
            )

    # 2. Curated Bilingual Knowledge Response (Demo / Fallback Mode)
    if lang == "kn":
        # Kannada response logic
        reply_body = KANNADA_KNOWLEDGE_SNIPPETS["default"]
        for key, snippet in KANNADA_KNOWLEDGE_SNIPPETS.items():
            if key in user_msg:
                reply_body = snippet
                break

        full_reply = (
            f"{reply_body}\n\n"
            f"⚠️ ಸೂಚನೆ: ಈ ಸಲಹೆಗಳು ಮಾಹಿತಿ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಮಾತ್ರ. ಅಧಿಕೃತ ಪರಿಹಾರಕ್ಕಾಗಿ ನಿಮ್ಮ ಹತ್ತಿರದ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ ಅಥವಾ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರವನ್ನು (KVK) ಸಂಪರ್ಕಿಸಿ."
        )
        return AssistantChatResponse(
            reply=full_reply,
            language="kn",
            sources=["ICAR-IIHR ಕೃಷಿ ಮಾರ್ಗದರ್ಶಿ", "ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (KVK)"],
            suggested_questions=[
                "ಎಲೆ ಹಳದಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗಲು ಕಾರಣವೇನು?",
                "ಭಾರೀ ಮಳೆಯ ನಂತರ ಏನು ಮಾಡಬೇಕು?",
                "ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸುವುದು ಹೇಗೆ?"
            ],
            is_simulated=True
        )
    else:
        # English response logic
        if "yellow" in user_msg:
            reply_text = (
                "**Potential Causes of Leaf Yellowing (Chlorosis):**\n"
                "1. **Nitrogen Deficiency:** Older bottom leaves uniformly pale yellow while upper leaves remain pale green.\n"
                "2. **Overwatering / Waterlogging:** Poor root oxygenation inhibits nutrient uptake.\n"
                "3. **Fungal Blight or Virus:** Look for brown necrotic centers or curling patterns alongside yellowing.\n\n"
                "**Action Steps:**\n"
                "- Check soil moisture: Ensure root zone drains well.\n"
                "- Apply well-decomposed compost or mild organic nitrogen liquid (e.g. seaweed extract or vermiwash).\n"
                "- Inspect leaf undersides for whiteflies or fungal spores."
            )
        elif "blight" in user_msg or "fungal" in user_msg:
            reply_text = (
                "**Managing & Preventing Fungal Blights:**\n"
                "1. **Sanitary Pruning:** Promptly remove and safely burn or bury affected bottom leaves.\n"
                "2. **Air Circulation & Drip Irrigation:** Avoid wetting leaf surfaces late in the day. Keep plants staked.\n"
                "3. **Biological Sprays:** Use *Trichoderma viride* or *Pseudomonas fluorescens* (20g/L) preventively every 10-14 days.\n"
                "4. **Mulching:** Spread a 3-inch straw mulch layer to block soil fungal splash."
            )
        elif "rain" in user_msg or "flood" in user_msg:
            reply_text = (
                "**Post-Rain Emergency Farm Protocol:**\n"
                "1. **Surface Drainage:** Open drainage trenches immediately to discharge standing water within 24-48 hours.\n"
                "2. **Avoid Foot Traffic on Wet Soil:** Prevents severe soil compaction and root damage.\n"
                "3. **Protective Copper Spray:** High humidity following rain triggers spore explosion. Spray Copper Oxychloride (2.5g/L) or Bordeaux mixture once foliage is dry to touch."
            )
        elif "soil" in user_msg:
            reply_text = (
                "**Improving Soil Health Naturally:**\n"
                "1. Incorporate 2-3 tonnes of farmyard manure (FYM) or enriched vermicompost per acre.\n"
                "2. Sow green manure cover crops (e.g., Sunhemp or Dhaincha) and plow them under at flowering stage.\n"
                "3. Conduct soil testing every 2 crop seasons to check organic carbon and micronutrient balances."
            )
        else:
            if knowledge_records:
                rec = knowledge_records[0]
                reply_text = (
                    f"**Agronomic Guidance for {rec.get('crop')} ({rec.get('disease_or_topic')}):**\n"
                    f"- **Observed Symptoms:** {rec.get('symptoms')}\n"
                    f"- **Recommended Organic Remediation:** {rec.get('organic_remedies')}\n"
                    f"- **Preventive Measures:** {rec.get('preventive_measures')}\n"
                    f"- **Source Reference:** {rec.get('sources')}"
                )
            else:
                reply_text = (
                    "**AgriMitra Diagnostic Assistance:**\n"
                    "For accurate assistance, specify your crop name (e.g. Tomato, Rice, Potato, Wheat, Cotton) and describe the symptoms on leaves, stems, or roots. You can also upload a clear leaf image on the Crop Disease Investigation page."
                )

        disclaimer = (
            "\n\n*⚠️ Informational Disclaimer: AI recommendations are educational and do not replace direct field inspections "
            "by certified local agricultural extension officers or Krishi Vigyan Kendra (KVK) specialists.*"
        )

        return AssistantChatResponse(
            reply=reply_text + disclaimer,
            language="en",
            sources=list(set(sources)) if sources else ["ICAR Agricultural Knowledge Compendium"],
            suggested_questions=[
                "Why are my tomato leaves turning yellow?",
                "How can I prevent fungal diseases?",
                "What should I do after heavy rainfall?",
                "How can I improve soil health?"
            ],
            is_simulated=True
        )
