import time
from typing import Dict, Any, List

class RiskAssessmentAgent:
    """
    AGENT 4: RISK ASSESSMENT AGENT
    Responsibilities:
    - Receive the outputs from the previous agents.
    - Evaluate disease-related and environmental risks.
    - Identify missing information.
    - Assess uncertainty.
    - Assign a risk category (Low, Medium, High, Critical).
    """

    def __init__(self):
        self.agent_id = "agent_risk_assessment"
        self.agent_name = "Risk Assessment Agent"

    def execute(
        self,
        diagnosis_output: Dict[str, Any],
        weather_output: Dict[str, Any],
        knowledge_output: Dict[str, Any]
    ) -> Dict[str, Any]:
        start_time = time.time()

        risk_score = 45 # baseline moderate
        contributing_factors: List[str] = []
        uncertainty_warnings: List[str] = []
        missing_information: List[str] = []

        # 1. Evaluate Disease Factor
        disease_name = diagnosis_output.get("disease_name", "")
        pathogen_type = diagnosis_output.get("pathogen_type", "")
        is_simulated = diagnosis_output.get("is_simulated", False)
        confidence = diagnosis_output.get("confidence")

        if "Late Blight" in disease_name or "Blast" in disease_name or "Rust" in disease_name:
            risk_score += 25
            contributing_factors.append(
                f"High-impact pathogen alert: {disease_name} can cause exponential secondary spread within 72 hours under conducive conditions."
            )
        elif "Virus" in disease_name or "Armyworm" in disease_name:
            risk_score += 20
            contributing_factors.append(
                f"Vector/pest mediated damage: Rapid transmission across the crop stand."
            )
        elif "Healthy" in disease_name:
            risk_score -= 30
            contributing_factors.append("No active pathogen signs detected; maintenance status.")

        # 2. Evaluate Weather Risk Factors
        env_risk = weather_output.get("environmental_risk_level", "MEDIUM")
        humidity = weather_output.get("humidity", 50.0)
        temp = weather_output.get("temperature", 25.0)
        precip = weather_output.get("precipitation", 0.0)

        if env_risk == "HIGH":
            risk_score += 25
            contributing_factors.append(
                f"Severe atmospheric trigger: High humidity ({humidity}%) and rainfall ({precip} mm) create optimal spore incubation."
            )
        elif env_risk == "MEDIUM":
            risk_score += 10
            contributing_factors.append(
                f"Moderate microclimatic pressure ({temp}°C, {humidity}% RH) warrants close vigil."
            )
        else:
            risk_score -= 5

        # 3. Assess Uncertainty and Missing Information
        if is_simulated:
            uncertainty_warnings.append(
                "DIAGNOSTIC UNCERTAINTY: Analysis performed under Demo/Heuristic mode without live image AI model verification."
            )
        elif confidence and confidence < 75.0:
            uncertainty_warnings.append(
                f"MODERATE MODEL CONFIDENCE ({confidence:.1f}%): Symptoms share overlap with secondary physiological stresses."
            )

        missing_information.append("Soil pH and electrical conductivity (EC) status.")
        missing_information.append("Irrigation frequency and canopy wetness duration.")
        missing_information.append("History of prior season fungicide or pesticide applications in this field block.")

        # 4. Final Risk Category Normalization
        risk_score = max(5, min(95, risk_score))

        if risk_score >= 75:
            risk_category = "HIGH"
            urgency = "Action Required within 24-48 Hours"
            rationale = (
                f"High disease contagion potential. The combination of virulent pathogen ({disease_name}) "
                f"and conducive weather ({humidity}% humidity) poses an immediate threat to crop yield."
            )
        elif risk_score >= 45:
            risk_category = "MEDIUM"
            urgency = "Action Recommended within 3-5 Days"
            rationale = (
                f"Moderate pathogen pressure. Symptoms observed on foliage require containment and preventive "
                f"cultural measures before secondary spread occurs."
            )
        else:
            risk_category = "LOW"
            urgency = "Routine Weekly Monitoring"
            rationale = (
                "Low overall risk. Symptoms appear isolated or manageable through routine field hygiene and balanced nutrition."
            )

        duration = int((time.time() - start_time) * 1000)

        return {
            "agent_id": self.agent_id,
            "agent_name": self.agent_name,
            "status": "completed",
            "duration_ms": duration,
            "risk_level": risk_category,
            "risk_score": risk_score,
            "urgency_timeframe": urgency,
            "risk_rationale": rationale,
            "contributing_factors": contributing_factors,
            "uncertainty_warnings": uncertainty_warnings,
            "missing_information": missing_information,
            "summary": f"Risk categorized as {risk_category} (Score: {risk_score}/100). Urgency: {urgency}."
        }
