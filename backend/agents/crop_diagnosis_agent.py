import time
from typing import Dict, Any, Optional
from services.gemini_service import analyze_crop_image_with_gemini
from services.knowledge_service import search_knowledge

class CropDiagnosisAgent:
    """
    AGENT 1: CROP DIAGNOSIS AGENT
    Responsibilities:
    - Analyze the uploaded crop image using a configured vision model.
    - Identify possible diseases.
    - Examine visible symptoms.
    - Return possible causes and uncertainty.
    """

    def __init__(self):
        self.agent_id = "agent_crop_diagnosis"
        self.agent_name = "Crop Diagnosis Agent"

    def execute(
        self,
        crop_type: str,
        symptoms_description: str,
        image_bytes: Optional[bytes] = None,
        image_path: Optional[str] = None
    ) -> Dict[str, Any]:
        start_time = time.time()

        # Step 1: Attempt genuine vision model via Gemini if image is provided
        if image_bytes:
            vision_result = analyze_crop_image_with_gemini(
                image_bytes=image_bytes,
                crop_type=crop_type,
                symptoms_text=symptoms_description
            )
            if vision_result.get("success") and vision_result.get("data"):
                data = vision_result["data"]
                duration = int((time.time() - start_time) * 1000)
                return {
                    "agent_id": self.agent_id,
                    "agent_name": self.agent_name,
                    "status": "completed",
                    "duration_ms": duration,
                    "is_simulated": False,
                    "analysis_source": "Google Gemini 2.5 Flash Vision Model",
                    "disease_name": data.get("disease_name", "Unidentified Symptom"),
                    "scientific_name": data.get("scientific_name", "N/A"),
                    "pathogen_type": data.get("pathogen_type", "Unknown"),
                    "confidence": data.get("confidence_percentage", 85.0),
                    "confidence_label": f"{data.get('confidence_percentage', 85.0):.1f}% Confidence (AI Vision Model)",
                    "symptoms_identified": data.get("symptoms_observed_in_image", [symptoms_description]),
                    "alternative_causes": data.get("alternative_causes", []),
                    "uncertainty_factors": [
                        data.get("uncertainty_notes", "Visual analysis may vary based on lighting and crop growth stage.")
                    ],
                    "risk_severity": data.get("risk_severity", "MEDIUM"),
                    "summary": f"Diagnosed {data.get('disease_name')} with {data.get('confidence_percentage')}% confidence using live vision analysis."
                }

        # Step 2: Fallback / Demo Mode with symptom rule engine & local knowledge search
        # Explicitly marked as simulated/rule-based synthesis
        knowledge_matches = search_knowledge(crop=crop_type, query=symptoms_description, limit=3)
        primary_match = knowledge_matches[0] if knowledge_matches else None

        # Determine best simulated disease based on symptoms text
        disease_name = "Early Blight"
        scientific_name = "Alternaria solani"
        pathogen_type = "Fungal"
        alt_causes = [
            "Septoria leaf spot (smaller spots with grey centers)",
            "Nutrient deficiency (potassium / magnesium leaf burn)"
        ]

        if primary_match:
            disease_name = primary_match.get("disease_or_topic", "Early Blight")
            scientific_name = primary_match.get("scientific_name", "Alternaria solani")
            pathogen_type = primary_match.get("pathogen_type", "Fungal")
            alt_causes = primary_match.get("alternative_causes", alt_causes)

        symptoms_list = [
            "Concentric rings or target-board necrotic lesions",
            "Yellowing (chlorosis) along leaf margins",
            "Localized leaf tissue desiccation and premature drop"
        ]
        if symptoms_description:
            symptoms_list.insert(0, f"Farmer reported: {symptoms_description}")

        duration = int((time.time() - start_time) * 1000)

        return {
            "agent_id": self.agent_id,
            "agent_name": self.agent_name,
            "status": "completed",
            "duration_ms": duration,
            "is_simulated": True,
            "analysis_source": "DEMO MODE (Agronomic Knowledge & Symptom Heuristic Engine)",
            "disease_name": disease_name,
            "scientific_name": scientific_name,
            "pathogen_type": pathogen_type,
            "confidence": None, # Genuine requirement: Never claim a false model confidence when no model processed it
            "confidence_label": "Unquantified (Simulated Demo Mode - Configure GEMINI_API_KEY for live model confidence)",
            "symptoms_identified": symptoms_list,
            "alternative_causes": alt_causes,
            "uncertainty_factors": [
                "DEMO MODE NOTICE: No live image vision API processed this image directly.",
                "Visual similarities exist between bacterial spots and fungal blights at early stages.",
                "Microscopic examination or PCR assay is recommended for definitive laboratory verification."
            ],
            "risk_severity": "MEDIUM",
            "summary": f"Identified suspected {disease_name} based on reported agronomic symptoms and crop profiles."
        }
