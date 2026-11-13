import os
import json
import base64
from typing import Dict, Any, Optional
from PIL import Image
import io

def get_gemini_api_key() -> Optional[str]:
    return os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

def analyze_crop_image_with_gemini(
    image_bytes: bytes,
    crop_type: str,
    symptoms_text: str
) -> Dict[str, Any]:
    api_key = get_gemini_api_key()
    
    if not api_key:
        return {
            "success": False,
            "is_simulated": True,
            "error": "GEMINI_API_KEY not configured. Running in labelled Demo / Rule-Based Mode.",
            "data": None
        }

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        prompt = f"""
You are an expert plant pathologist and agricultural diagnostician.
Analyze this crop image of a {crop_type} plant.
The farmer notes the following observed symptoms: "{symptoms_text}".

Please return a valid JSON object strictly matching this schema (do NOT wrap with markdown backticks or other text):
{{
  "disease_name": "Name of diagnosed disease or Healthy Crop",
  "scientific_name": "Scientific name of pathogen or N/A",
  "pathogen_type": "Fungal | Bacterial | Viral | Pest | Physiological | Healthy",
  "confidence_percentage": 85.5,
  "symptoms_observed_in_image": [
    "description of visible spot patterns, discoloration, halos, or wilting"
  ],
  "alternative_causes": [
    "Alternative diagnosis 1",
    "Alternative diagnosis 2"
  ],
  "uncertainty_notes": "Explicitly state any diagnostic uncertainties (e.g. angle of leaf, lighting, early stage symptoms)",
  "risk_severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "key_observations": "Short 2-sentence summary of findings."
}}
"""

        # Prepare image part
        image_part = types.Part.from_bytes(
            data=image_bytes,
            mime_type="image/jpeg"
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[image_part, prompt],
        )

        text_response = response.text.strip()
        # Clean potential markdown fences
        if text_response.startswith("```json"):
            text_response = text_response[7:]
        if text_response.startswith("```"):
            text_response = text_response[3:]
        if text_response.endswith("```"):
            text_response = text_response[:-3]
        text_response = text_response.strip()

        parsed = json.loads(text_response)
        return {
            "success": True,
            "is_simulated": False,
            "data": parsed,
            "model": "gemini-2.5-flash"
        }

    except Exception as e:
        print(f"Gemini Vision API Exception: {e}")
        return {
            "success": False,
            "is_simulated": True,
            "error": f"Live Gemini API invocation error: {str(e)}",
            "data": None
        }

def ask_gemini_assistant(
    prompt: str,
    context: Optional[str] = None,
    language: str = "en"
) -> Dict[str, Any]:
    api_key = get_gemini_api_key()

    if not api_key:
        return {
            "success": False,
            "is_simulated": True,
            "text": None
        }

    try:
        from google import genai
        client = genai.Client(api_key=api_key)

        lang_instruction = "Respond in clear English." if language == "en" else "Respond in natural, fluent Kannada (ಕನ್ನಡ) script with agricultural accuracy."

        full_prompt = f"""
You are AgriMitra AI, a compassionate and knowledgeable agricultural specialist helping smallholder farmers.
{lang_instruction}

Context from agricultural knowledge base:
{context or 'No prior context provided.'}

Farmer Question:
"{prompt}"

Provide a structured, helpful answer:
1. Direct answer and explanation.
2. Safe preventive and organic management steps.
3. When to consult local village agricultural extension officer.
Do not recommend unverified hazardous chemical dosages without local soil/crop testing.
Include an informational disclaimer at the end.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt,
        )
        return {
            "success": True,
            "is_simulated": False,
            "text": response.text.strip()
        }
    except Exception as e:
        print(f"Gemini Assistant error: {e}")
        return {
            "success": False,
            "is_simulated": True,
            "text": None,
            "error": str(e)
        }
