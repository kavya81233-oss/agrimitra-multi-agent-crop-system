import time
from datetime import datetime, timedelta
from typing import Dict, Any, List

class FarmActionPlannerAgent:
    """
    AGENT 5: FARM ACTION PLANNER AGENT
    Responsibilities:
    - Combine findings from all agents.
    - Generate prioritized farming recommendations.
    - Suggest preventive actions.
    - Create a follow-up schedule.
    - Explain why each action is recommended.
    """

    def __init__(self):
        self.agent_id = "agent_action_planner"
        self.agent_name = "Farm Action Planner Agent"

    def execute(
        self,
        crop_type: str,
        diagnosis_output: Dict[str, Any],
        weather_output: Dict[str, Any],
        knowledge_output: Dict[str, Any],
        risk_output: Dict[str, Any]
    ) -> Dict[str, Any]:
        start_time = time.time()

        disease_name = diagnosis_output.get("disease_name", "Crop Anomaly")
        risk_level = risk_output.get("risk_level", "MEDIUM")
        humidity = weather_output.get("humidity", 65.0)

        now = datetime.now()
        follow_up_days = 3 if risk_level == "HIGH" else (5 if risk_level == "MEDIUM" else 7)
        follow_up_date = (now + timedelta(days=follow_up_days)).strftime("%Y-%m-%d")

        # Generate Action Items
        immediate_actions = []
        preventive_measures = []
        monitoring_tasks = []
        follow_up_activities = []

        # 1. Immediate Actions
        immediate_actions.append({
            "title": f"Sanitary Pruning & Infected Foliage Disposal ({crop_type})",
            "description": f"Carefully snip heavily spotted lower leaves showing {disease_name} lesions. Place in a sealed bag and dispose away from fields or burn. Do NOT add infected leaves to compost.",
            "reason": "Prevents aerial dispersion of fungal/bacterial inoculum to healthy upper canopy leaves.",
            "priority": "High",
            "category": "Immediate Actions",
            "suggested_date": (now + timedelta(days=1)).strftime("%Y-%m-%d"),
            "status": "pending"
        })

        if humidity and humidity >= 70:
            immediate_actions.append({
                "title": "Irrigation Management: Switch from Overhead to Drip / Root Zone",
                "description": "Cease overhead sprinkler or hose watering. Water solely at the root zone early in the morning so sun quickly evaporates any accidental foliar splashes.",
                "reason": f"Current weather humidity is {humidity}%. Wet leaf surfaces for >6 hours promote spore germination.",
                "priority": "High",
                "category": "Immediate Actions",
                "suggested_date": (now + timedelta(days=1)).strftime("%Y-%m-%d"),
                "status": "pending"
            })

        # 2. Preventive Measures
        organic_rec = knowledge_output.get("organic_practices", "Apply bio-control agents.")
        preventive_measures.append({
            "title": "Prophylactic Bio-Fungicide Application (Trichoderma / Bacillus)",
            "description": f"Apply approved microbial antagonist: {organic_rec}",
            "reason": "Establishes a competitive beneficial microbial barrier on foliage and suppresses pathogen colonies naturally.",
            "priority": "Medium",
            "category": "Preventive Measures",
            "suggested_date": (now + timedelta(days=2)).strftime("%Y-%m-%d"),
            "status": "pending"
        })

        preventive_measures.append({
            "title": "Soil Surface Mulching (Straw or Plastic Mulch)",
            "description": "Apply a 2-3 inch dry organic straw mulch or reflective mulch layer around the base of plants.",
            "reason": "Prevents rain splash from kicking up dormant soil resting spores onto bottom leaves.",
            "priority": "Medium",
            "category": "Preventive Measures",
            "suggested_date": (now + timedelta(days=3)).strftime("%Y-%m-%d"),
            "status": "pending"
        })

        # 3. Monitoring Tasks
        monitoring_tasks.append({
            "title": "Morning Canopy Scouting (Scout 20 Sample Plants)",
            "description": "Inspect the undersides of leaves and stem nodes on 20 randomly selected plants across the field block every 48 hours.",
            "reason": "Detects new lesions or white sporulation margins before widespread outbreak occurs.",
            "priority": "Medium",
            "category": "Monitoring Tasks",
            "suggested_date": (now + timedelta(days=2)).strftime("%Y-%m-%d"),
            "status": "pending"
        })

        # 4. Follow-up Activities
        follow_up_activities.append({
            "title": f"Follow-up Photo Re-Evaluation ({follow_up_date})",
            "description": "Upload a fresh photograph of the tagged affected plants to AgriMitra to monitor disease progression or recovery response.",
            "reason": "Validates efficacy of sanitary pruning and biological treatments over a 3-5 day window.",
            "priority": "Low",
            "category": "Follow-up Activities",
            "suggested_date": follow_up_date,
            "status": "pending"
        })

        # Combine all tasks for easy database persistence
        all_tasks = immediate_actions + preventive_measures + monitoring_tasks + follow_up_activities

        safety_advisory = (
            "SAFETY & REGULATORY NOTICE: AI recommendations are advisory and designed for smallholder decision support. "
            "Specific synthetic chemical dosages (pesticides/fungicides) should only be administered in compliance "
            "with regional Krishi Vigyan Kendra (KVK) or certified agronomic extension officers following soil & leaf tests."
        )

        duration = int((time.time() - start_time) * 1000)

        return {
            "agent_id": self.agent_id,
            "agent_name": self.agent_name,
            "status": "completed",
            "duration_ms": duration,
            "suggested_follow_up_date": follow_up_date,
            "immediate_actions": immediate_actions,
            "preventive_measures": preventive_measures,
            "monitoring_tasks": monitoring_tasks,
            "follow_up_activities": follow_up_activities,
            "all_recommended_tasks": all_tasks,
            "safety_advisory": safety_advisory,
            "farmer_approval_required": True,
            "summary": f"Generated {len(all_tasks)} prioritized action tasks across 4 categories with follow-up scheduled for {follow_up_date}."
        }
