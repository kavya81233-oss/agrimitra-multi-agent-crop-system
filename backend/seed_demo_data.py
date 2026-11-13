import os
import sys
import datetime

# Ensure backend path is on sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)

from database import SessionLocal, engine, Base
from models.models import Farmer, CropAnalysis, AgentInvestigation, FarmAction, Notification
from agents.orchestrator import InvestigationOrchestrator
from services.knowledge_service import seed_knowledge_base

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed knowledge base
    seed_knowledge_base(db)

    # Check if analyses already exist
    if db.query(CropAnalysis).count() > 0:
        print("Analyses already seeded.")
        db.close()
        return

    # Ensure farmer
    farmer = db.query(Farmer).first()
    if not farmer:
        farmer = Farmer(
            name="Ramesh Kumar",
            farm_name="Sannidhi Organic Farms",
            location="Bengaluru Rural, Karnataka",
            phone="+91 98450 12345",
            email="ramesh.kumar@agrimitra.org",
            preferred_language="en"
        )
        db.add(farmer)
        db.commit()
        db.refresh(farmer)

    orchestrator = InvestigationOrchestrator()

    # Sample Case 1: Tomato Early Blight
    print("Seeding Case 1: Tomato Early Blight...")
    res1 = orchestrator.run_investigation(
        crop_type="Tomato",
        location="Bengaluru Rural, Karnataka",
        symptoms_description="Dark brown concentric rings on lower leaves, yellowing halos around lesions, premature leaf drying."
    )
    analysis1 = CropAnalysis(
        farmer_id=farmer.id,
        crop_name="Tomato",
        location="Bengaluru Rural, Karnataka",
        latitude=12.9716,
        longitude=77.5946,
        image_path=None,
        symptoms_description="Dark brown concentric rings on lower leaves, yellowing halos around lesions.",
        disease_detected="Early Blight",
        confidence=None,
        is_simulated=True,
        risk_level=res1["risk_assessment"]["risk_level"],
        status="COMPLETED",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
    )
    db.add(analysis1)
    db.commit()
    db.refresh(analysis1)

    inv1 = AgentInvestigation(
        analysis_id=analysis1.id,
        orchestrator_plan=res1["orchestrator_plan"],
        crop_diagnosis_output=res1["crop_diagnosis"],
        weather_output=res1["weather_intelligence"],
        knowledge_output=res1["agricultural_knowledge"],
        risk_output=res1["risk_assessment"],
        action_plan_output=res1["farm_action_plan"],
        execution_timeline=res1["execution_timeline"],
        execution_time_ms=res1["total_execution_time_ms"],
        created_at=analysis1.created_at
    )
    db.add(inv1)

    for task in res1["farm_action_plan"]["all_recommended_tasks"]:
        db.add(FarmAction(
            analysis_id=analysis1.id,
            farmer_id=farmer.id,
            title=task["title"],
            description=task["description"],
            reason=task["reason"],
            priority=task["priority"],
            category=task["category"],
            suggested_date=task["suggested_date"],
            status="pending",
            created_at=analysis1.created_at
        ))

    # Sample Case 2: Rice Blast
    print("Seeding Case 2: Rice Blast...")
    res2 = orchestrator.run_investigation(
        crop_type="Rice",
        location="Mandya, Karnataka",
        symptoms_description="Spindle-shaped eye lesions with grey centers and brown borders on paddy leaves."
    )
    analysis2 = CropAnalysis(
        farmer_id=farmer.id,
        crop_name="Rice",
        location="Mandya, Karnataka",
        latitude=12.5242,
        longitude=76.8958,
        image_path=None,
        symptoms_description="Spindle-shaped eye lesions with grey centers and brown borders.",
        disease_detected="Rice Blast",
        confidence=None,
        is_simulated=True,
        risk_level="HIGH",
        status="COMPLETED",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
    )
    db.add(analysis2)
    db.commit()
    db.refresh(analysis2)

    inv2 = AgentInvestigation(
        analysis_id=analysis2.id,
        orchestrator_plan=res2["orchestrator_plan"],
        crop_diagnosis_output=res2["crop_diagnosis"],
        weather_output=res2["weather_intelligence"],
        knowledge_output=res2["agricultural_knowledge"],
        risk_output=res2["risk_assessment"],
        action_plan_output=res2["farm_action_plan"],
        execution_timeline=res2["execution_timeline"],
        execution_time_ms=res2["total_execution_time_ms"],
        created_at=analysis2.created_at
    )
    db.add(inv2)

    for task in res2["farm_action_plan"]["all_recommended_tasks"]:
        db.add(FarmAction(
            analysis_id=analysis2.id,
            farmer_id=farmer.id,
            title=task["title"],
            description=task["description"],
            reason=task["reason"],
            priority=task["priority"],
            category=task["category"],
            suggested_date=task["suggested_date"],
            status="approved" if "Pruning" in task["title"] else "pending",
            created_at=analysis2.created_at
        ))

    # Seed Notifications
    db.add(Notification(
        farmer_id=farmer.id,
        title="High Risk Warning: Rice Blast in Mandya",
        message="Weather conditions (humidity > 80%) pose acute spore germination risk. Prompt action advised.",
        type="warning",
        link=f"/report/{analysis2.id}",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=18)
    ))

    db.commit()
    print("Successfully seeded demo data!")
    db.close()

if __name__ == "__main__":
    seed()
