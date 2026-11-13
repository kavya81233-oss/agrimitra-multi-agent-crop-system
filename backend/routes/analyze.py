import os
import uuid
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List

from database import get_db
from models.models import CropAnalysis, AgentInvestigation, FarmAction, Farmer, Notification
from models.schemas import CropAnalysisResponse
from agents.orchestrator import InvestigationOrchestrator

router = APIRouter(prefix="/api", tags=["Crop Analysis & Investigation"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

orchestrator = InvestigationOrchestrator()

@router.post("/analyze-crop")
async def analyze_crop(
    crop_type: str = Form(...),
    location: str = Form(...),
    symptoms_description: Optional[str] = Form(""),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    image_rel_path = None
    image_bytes = None

    if file and file.filename:
        file_ext = os.path.splitext(file.filename)[1] or ".jpg"
        unique_name = f"{uuid.uuid4().hex}{file_ext}"
        saved_path = os.path.join(UPLOAD_DIR, unique_name)
        
        content = await file.read()
        image_bytes = content
        with open(saved_path, "wb") as f:
            f.write(content)
        
        image_rel_path = f"/uploads/{unique_name}"

    # Default farmer if none exists
    farmer = db.query(Farmer).first()
    if not farmer:
        farmer = Farmer(
            name="Ramesh Kumar",
            farm_name="Green Valley Farm",
            location=location or "Bengaluru, Karnataka"
        )
        db.add(farmer)
        db.commit()
        db.refresh(farmer)

    # Run multi-agent investigation workflow
    result = orchestrator.run_investigation(
        crop_type=crop_type,
        location=location,
        symptoms_description=symptoms_description or "",
        image_bytes=image_bytes,
        image_path=image_rel_path
    )

    summary = result.get("final_summary", {})
    crop_diagnosis = result.get("crop_diagnosis", {})
    weather_intel = result.get("weather_intelligence", {})
    knowledge_res = result.get("agricultural_knowledge", {})
    risk_res = result.get("risk_assessment", {})
    action_res = result.get("farm_action_plan", {})

    # Save CropAnalysis to database
    analysis = CropAnalysis(
        farmer_id=farmer.id,
        crop_name=crop_type,
        location=summary.get("location", location),
        latitude=weather_intel.get("latitude"),
        longitude=weather_intel.get("longitude"),
        image_path=image_rel_path,
        symptoms_description=symptoms_description,
        disease_detected=summary.get("disease_detected"),
        confidence=summary.get("confidence"),
        is_simulated=summary.get("is_simulated", True),
        risk_level=summary.get("risk_level", "MEDIUM"),
        status="COMPLETED"
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    # Save AgentInvestigation
    investigation = AgentInvestigation(
        analysis_id=analysis.id,
        orchestrator_plan=result.get("orchestrator_plan"),
        crop_diagnosis_output=crop_diagnosis,
        weather_output=weather_intel,
        knowledge_output=knowledge_res,
        risk_output=risk_res,
        action_plan_output=action_res,
        execution_timeline=result.get("execution_timeline"),
        execution_time_ms=result.get("total_execution_time_ms", 0)
    )
    db.add(investigation)

    # Persist recommended actions
    recommended_tasks = action_res.get("all_recommended_tasks", [])
    for task in recommended_tasks:
        farm_action = FarmAction(
            analysis_id=analysis.id,
            farmer_id=farmer.id,
            title=task.get("title"),
            description=task.get("description"),
            reason=task.get("reason"),
            priority=task.get("priority", "Medium"),
            category=task.get("category", "Immediate Actions"),
            suggested_date=task.get("suggested_date"),
            status="pending"
        )
        db.add(farm_action)

    # Add notification for farmer
    notification = Notification(
        farmer_id=farmer.id,
        title=f"Analysis Complete: {crop_type} ({summary.get('disease_detected')})",
        message=f"Multi-Agent investigation concluded with Risk Level {summary.get('risk_level')}. Review recommended actions.",
        type="warning" if summary.get("risk_level") in ["HIGH", "CRITICAL"] else "info",
        link=f"/report/{analysis.id}"
    )
    db.add(notification)

    db.commit()
    db.refresh(analysis)

    return {
        "success": True,
        "analysis_id": analysis.id,
        "crop_name": analysis.crop_name,
        "disease_detected": analysis.disease_detected,
        "risk_level": analysis.risk_level,
        "confidence": analysis.confidence,
        "is_simulated": analysis.is_simulated,
        "image_path": analysis.image_path,
        "total_execution_time_ms": result.get("total_execution_time_ms"),
        "investigation": investigation,
        "full_result": result
    }

@router.get("/analyses")
def get_analyses(limit: int = 20, db: Session = Depends(get_db)):
    analyses = db.query(CropAnalysis).order_by(CropAnalysis.created_at.desc()).limit(limit).all()
    results = []
    for a in analyses:
        results.append({
            "id": a.id,
            "crop_name": a.crop_name,
            "location": a.location,
            "image_path": a.image_path,
            "symptoms_description": a.symptoms_description,
            "disease_detected": a.disease_detected,
            "confidence": a.confidence,
            "is_simulated": a.is_simulated,
            "risk_level": a.risk_level,
            "status": a.status,
            "created_at": a.created_at.isoformat() if a.created_at else None
        })
    return results

@router.get("/analyses/{id}")
def get_analysis_by_id(id: int, db: Session = Depends(get_db)):
    analysis = db.query(CropAnalysis).filter(CropAnalysis.id == id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Crop analysis not found")

    investigation = db.query(AgentInvestigation).filter(AgentInvestigation.analysis_id == id).first()
    actions = db.query(FarmAction).filter(FarmAction.analysis_id == id).all()

    return {
        "id": analysis.id,
        "crop_name": analysis.crop_name,
        "location": analysis.location,
        "latitude": analysis.latitude,
        "longitude": analysis.longitude,
        "image_path": analysis.image_path,
        "symptoms_description": analysis.symptoms_description,
        "disease_detected": analysis.disease_detected,
        "confidence": analysis.confidence,
        "is_simulated": analysis.is_simulated,
        "risk_level": analysis.risk_level,
        "status": analysis.status,
        "created_at": analysis.created_at.isoformat() if analysis.created_at else None,
        "investigation": {
            "id": investigation.id if investigation else None,
            "orchestrator_plan": investigation.orchestrator_plan if investigation else None,
            "crop_diagnosis_output": investigation.crop_diagnosis_output if investigation else None,
            "weather_output": investigation.weather_output if investigation else None,
            "knowledge_output": investigation.knowledge_output if investigation else None,
            "risk_output": investigation.risk_output if investigation else None,
            "action_plan_output": investigation.action_plan_output if investigation else None,
            "execution_timeline": investigation.execution_timeline if investigation else [],
            "execution_time_ms": investigation.execution_time_ms if investigation else 0
        } if investigation else None,
        "farm_actions": [
            {
                "id": act.id,
                "title": act.title,
                "description": act.description,
                "reason": act.reason,
                "priority": act.priority,
                "category": act.category,
                "suggested_date": act.suggested_date,
                "status": act.status
            } for act in actions
        ]
    }

@router.get("/agents/status/{id}")
def get_agent_status(id: int, db: Session = Depends(get_db)):
    investigation = db.query(AgentInvestigation).filter(AgentInvestigation.analysis_id == id).first()
    if not investigation:
        raise HTTPException(status_code=404, detail="Investigation record not found")

    return {
        "analysis_id": id,
        "execution_timeline": investigation.execution_timeline,
        "execution_time_ms": investigation.execution_time_ms,
        "plan": investigation.orchestrator_plan
    }
