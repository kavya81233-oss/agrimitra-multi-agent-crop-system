import time
import datetime
from typing import Dict, Any, Optional

from agents.crop_diagnosis_agent import CropDiagnosisAgent
from agents.weather_agent import WeatherIntelligenceAgent
from agents.agricultural_knowledge_agent import AgriculturalKnowledgeAgent
from agents.risk_assessment_agent import RiskAssessmentAgent
from agents.action_planner_agent import FarmActionPlannerAgent

class InvestigationOrchestrator:
    """
    ORCHESTRATOR AGENT
    Responsibilities:
    - Receive farmer input.
    - Create the investigation plan.
    - Assign tasks to the agents.
    - Collect agent outputs.
    - Coordinate the investigation.
    - Produce the final structured result and execution timeline.
    """

    def __init__(self):
        self.crop_diagnosis_agent = CropDiagnosisAgent()
        self.weather_agent = WeatherIntelligenceAgent()
        self.knowledge_agent = AgriculturalKnowledgeAgent()
        self.risk_agent = RiskAssessmentAgent()
        self.action_planner_agent = FarmActionPlannerAgent()

    def run_investigation(
        self,
        crop_type: str,
        location: str,
        symptoms_description: str,
        image_bytes: Optional[bytes] = None,
        image_path: Optional[str] = None
    ) -> Dict[str, Any]:
        overall_start_time = time.time()
        start_iso = datetime.datetime.utcnow().isoformat() + "Z"

        # 1. Orchestration Planning Phase
        plan = {
            "created_at": start_iso,
            "goal": f"Autonomous multi-agent health diagnostic and risk mitigation plan for {crop_type} at {location}",
            "tasks_assigned": [
                {"step": 1, "agent": "Crop Diagnosis Agent", "task": "Vision and agronomic symptom analysis"},
                {"step": 2, "agent": "Weather Intelligence Agent", "task": "Live Open-Meteo atmospheric analysis & microclimate pathogen risk"},
                {"step": 3, "agent": "Agricultural Knowledge Agent", "task": "Targeted local agronomic knowledge retrieval and citations"},
                {"step": 4, "agent": "Risk Assessment Agent", "task": "Multi-factor threat synthesis, uncertainty and urgency calculation"},
                {"step": 5, "agent": "Farm Action Planner Agent", "task": "Prioritized farmer-approved action and monitoring schedule"}
            ]
        }

        execution_timeline = []

        # -----------------------------------------------------------------
        # STEP 1: Invoke Crop Diagnosis Agent
        # -----------------------------------------------------------------
        step1_start = time.time()
        diagnosis_output = self.crop_diagnosis_agent.execute(
            crop_type=crop_type,
            symptoms_description=symptoms_description,
            image_bytes=image_bytes,
            image_path=image_path
        )
        step1_dur = int((time.time() - step1_start) * 1000)
        execution_timeline.append({
            "stage": 1,
            "agent_id": "agent_crop_diagnosis",
            "agent_name": "Crop Diagnosis Agent",
            "status": "completed",
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "duration_ms": step1_dur,
            "summary": diagnosis_output.get("summary"),
            "key_finding": f"Identified {diagnosis_output.get('disease_name')} ({diagnosis_output.get('confidence_label')})"
        })

        # -----------------------------------------------------------------
        # STEP 2: Invoke Weather Intelligence Agent
        # -----------------------------------------------------------------
        step2_start = time.time()
        weather_output = self.weather_agent.execute(
            location=location,
            crop_type=crop_type,
            suspected_pathogen_type=diagnosis_output.get("pathogen_type")
        )
        step2_dur = int((time.time() - step2_start) * 1000)
        execution_timeline.append({
            "stage": 2,
            "agent_id": "agent_weather_intelligence",
            "agent_name": "Weather Intelligence Agent",
            "status": "completed",
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "duration_ms": step2_dur,
            "summary": weather_output.get("summary"),
            "key_finding": f"{weather_output.get('temperature')}°C, {weather_output.get('humidity')}% Humidity. Environmental Risk: {weather_output.get('environmental_risk_level')}"
        })

        # -----------------------------------------------------------------
        # STEP 3: Invoke Agricultural Knowledge Agent
        # -----------------------------------------------------------------
        step3_start = time.time()
        knowledge_output = self.knowledge_agent.execute(
            crop_type=crop_type,
            disease_name=diagnosis_output.get("disease_name", "Early Blight"),
            symptoms_query=symptoms_description
        )
        step3_dur = int((time.time() - step3_start) * 1000)
        execution_timeline.append({
            "stage": 3,
            "agent_id": "agent_agri_knowledge",
            "agent_name": "Agricultural Knowledge Agent",
            "status": "completed",
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "duration_ms": step3_dur,
            "summary": knowledge_output.get("summary"),
            "key_finding": f"Agronomic data verified from {knowledge_output.get('sources')}"
        })

        # -----------------------------------------------------------------
        # STEP 4: Invoke Risk Assessment Agent
        # -----------------------------------------------------------------
        step4_start = time.time()
        risk_output = self.risk_agent.execute(
            diagnosis_output=diagnosis_output,
            weather_output=weather_output,
            knowledge_output=knowledge_output
        )
        step4_dur = int((time.time() - step4_start) * 1000)
        execution_timeline.append({
            "stage": 4,
            "agent_id": "agent_risk_assessment",
            "agent_name": "Risk Assessment Agent",
            "status": "completed",
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "duration_ms": step4_dur,
            "summary": risk_output.get("summary"),
            "key_finding": f"Overall Risk: {risk_output.get('risk_level')} ({risk_output.get('risk_score')}/100) - {risk_output.get('urgency_timeframe')}"
        })

        # -----------------------------------------------------------------
        # STEP 5: Invoke Farm Action Planner Agent
        # -----------------------------------------------------------------
        step5_start = time.time()
        action_output = self.action_planner_agent.execute(
            crop_type=crop_type,
            diagnosis_output=diagnosis_output,
            weather_output=weather_output,
            knowledge_output=knowledge_output,
            risk_output=risk_output
        )
        step5_dur = int((time.time() - step5_start) * 1000)
        execution_timeline.append({
            "stage": 5,
            "agent_id": "agent_action_planner",
            "agent_name": "Farm Action Planner Agent",
            "status": "completed",
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "duration_ms": step5_dur,
            "summary": action_output.get("summary"),
            "key_finding": f"{len(action_output.get('all_recommended_tasks', []))} prioritized tasks compiled (Follow-up: {action_output.get('suggested_follow_up_date')})"
        })

        total_duration_ms = int((time.time() - overall_start_time) * 1000)

        # Final Synthesized Report Package
        return {
            "orchestrator_plan": plan,
            "execution_timeline": execution_timeline,
            "total_execution_time_ms": total_duration_ms,
            "crop_diagnosis": diagnosis_output,
            "weather_intelligence": weather_output,
            "agricultural_knowledge": knowledge_output,
            "risk_assessment": risk_output,
            "farm_action_plan": action_output,
            "final_summary": {
                "crop": crop_type,
                "location": weather_output.get("location", location),
                "disease_detected": diagnosis_output.get("disease_name"),
                "scientific_name": diagnosis_output.get("scientific_name"),
                "pathogen_type": diagnosis_output.get("pathogen_type"),
                "confidence": diagnosis_output.get("confidence"),
                "confidence_label": diagnosis_output.get("confidence_label"),
                "is_simulated": diagnosis_output.get("is_simulated"),
                "analysis_source": diagnosis_output.get("analysis_source"),
                "risk_level": risk_output.get("risk_level"),
                "risk_score": risk_output.get("risk_score"),
                "urgency": risk_output.get("urgency_timeframe"),
                "immediate_actions_count": len(action_output.get("immediate_actions", [])),
                "follow_up_date": action_output.get("suggested_follow_up_date")
            }
        }
