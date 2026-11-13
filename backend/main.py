import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from database import engine, Base, get_db
from models.models import Farmer, CropAnalysis, FarmAction, Notification
from services.knowledge_service import seed_knowledge_base
from routes import analyze, weather, actions, assistant

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AgriMitra API",
    description="Autonomous Multi-Agent Crop Health and Farming Decision Support System",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(analyze.router)
app.include_router(weather.router)
app.include_router(actions.router)
app.include_router(assistant.router)

# Seed database on startup
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    try:
        # Seed Knowledge Base
        seed_knowledge_base(db)

        # Seed initial Demo Farmer
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

            # Seed demo notification
            notification = Notification(
                farmer_id=farmer.id,
                title="Welcome to AgriMitra!",
                message="Your multi-agent farm intelligence system is online and ready for crop disease investigation.",
                type="info",
                link="/investigate"
            )
            db.add(notification)
            db.commit()
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "app": "AgriMitra API",
        "description": "Autonomous Multi-Agent Crop Health and Farming Decision Support System",
        "version": "1.0.0",
        "status": "online",
        "endpoints": {
            "analyze_crop": "POST /api/analyze-crop",
            "weather": "GET /api/weather",
            "actions": "GET /api/actions",
            "assistant": "POST /api/assistant/chat",
            "dashboard_stats": "GET /api/dashboard/stats"
        }
    }

@app.get("/api/health")
def health_check():
    gemini_key_set = bool(os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY"))
    return {
        "status": "healthy",
        "database": "sqlite_connected",
        "gemini_vision_configured": gemini_key_set,
        "mode": "Live AI (Gemini)" if gemini_key_set else "Demo Mode (Rule-Based Synthesis)"
    }

@app.get("/api/farmer")
def get_farmer_profile(db: Session = Depends(get_db)):
    farmer = db.query(Farmer).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return {
        "id": farmer.id,
        "name": farmer.name,
        "farm_name": farmer.farm_name,
        "location": farmer.location,
        "phone": farmer.phone,
        "email": farmer.email,
        "preferred_language": farmer.preferred_language,
        "created_at": farmer.created_at
    }

@app.get("/api/notifications")
def get_notifications(db: Session = Depends(get_db)):
    notes = db.query(Notification).order_by(Notification.created_at.desc()).limit(10).all()
    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "is_read": n.is_read,
            "link": n.link,
            "created_at": n.created_at.isoformat() if n.created_at else None
        } for n in notes
    ]

@app.put("/api/notifications/{id}/read")
def mark_notification_read(id: int, db: Session = Depends(get_db)):
    n = db.query(Notification).filter(Notification.id == id).first()
    if n:
        n.is_read = True
        db.commit()
    return {"success": True}

@app.get("/api/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_analyses = db.query(CropAnalysis).count()
    healthy_count = db.query(CropAnalysis).filter(
        CropAnalysis.disease_detected.ilike("%healthy%")
    ).count()

    healthy_pct = int((healthy_count / total_analyses * 100)) if total_analyses > 0 else 82

    disease_alerts = db.query(CropAnalysis).filter(
        CropAnalysis.risk_level.in_(["HIGH", "CRITICAL"])
    ).count()

    pending_actions = db.query(FarmAction).filter(
        FarmAction.status == "pending"
    ).count()

    # If database is fresh and empty, provide meaningful labeled demo stats
    is_demo = total_analyses == 0
    if is_demo:
        total_analyses = 28
        healthy_pct = 78
        disease_alerts = 4
        pending_actions = 7

    return {
        "total_analyses": total_analyses,
        "healthy_percentage": healthy_pct,
        "disease_alerts": disease_alerts,
        "pending_actions": pending_actions,
        "is_demo_metrics": is_demo
    }
