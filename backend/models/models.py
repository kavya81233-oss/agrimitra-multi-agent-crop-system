import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Ramesh Kumar")
    farm_name = Column(String(100), default="Green Valley Farm")
    location = Column(String(100), default="Bengaluru, Karnataka")
    latitude = Column(Float, default=12.9716)
    longitude = Column(Float, default=77.5946)
    phone = Column(String(20), default="+91 98765 43210")
    email = Column(String(100), default="ramesh.farmer@agrimitra.org")
    preferred_language = Column(String(20), default="en") # 'en' or 'kn'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    analyses = relationship("CropAnalysis", back_populates="farmer", cascade="all, delete-orphan")
    actions = relationship("FarmAction", back_populates="farmer", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="farmer", cascade="all, delete-orphan")


class CropAnalysis(Base):
    __tablename__ = "crop_analyses"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=True)
    crop_name = Column(String(100), nullable=False)
    location = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    image_path = Column(String(255), nullable=True)
    symptoms_description = Column(Text, nullable=True)
    disease_detected = Column(String(150), nullable=True)
    confidence = Column(Float, nullable=True)
    is_simulated = Column(Boolean, default=False)
    risk_level = Column(String(50), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(50), default="COMPLETED") # PENDING, PROCESSING, COMPLETED, FAILED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer = relationship("Farmer", back_populates="analyses")
    investigation = relationship("AgentInvestigation", back_populates="analysis", uselist=False, cascade="all, delete-orphan")
    farm_actions = relationship("FarmAction", back_populates="analysis", cascade="all, delete-orphan")


class AgentInvestigation(Base):
    __tablename__ = "agent_investigations"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("crop_analyses.id"), nullable=False, unique=True)
    orchestrator_plan = Column(JSON, nullable=True)
    crop_diagnosis_output = Column(JSON, nullable=True)
    weather_output = Column(JSON, nullable=True)
    knowledge_output = Column(JSON, nullable=True)
    risk_output = Column(JSON, nullable=True)
    action_plan_output = Column(JSON, nullable=True)
    execution_timeline = Column(JSON, nullable=True)
    execution_time_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    analysis = relationship("CropAnalysis", back_populates="investigation")


class WeatherRecord(Base):
    __tablename__ = "weather_records"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=True)
    precipitation = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    weather_code = Column(Integer, nullable=True)
    weather_condition = Column(String(100), nullable=True)
    environmental_risk = Column(String(50), default="LOW")
    raw_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AgriculturalKnowledge(Base):
    __tablename__ = "agricultural_knowledge"

    id = Column(Integer, primary_key=True, index=True)
    crop = Column(String(100), index=True, nullable=False)
    disease_or_topic = Column(String(150), index=True, nullable=False)
    scientific_name = Column(String(150), nullable=True)
    pathogen_type = Column(String(50), nullable=True) # Fungal, Bacterial, Viral, Pest, Deficiency
    symptoms = Column(Text, nullable=False)
    causes = Column(Text, nullable=True)
    organic_remedies = Column(Text, nullable=True)
    chemical_guidelines = Column(Text, nullable=True)
    preventive_measures = Column(Text, nullable=True)
    sources = Column(String(255), nullable=True)
    tags = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class FarmAction(Base):
    __tablename__ = "farm_actions"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("crop_analyses.id"), nullable=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    reason = Column(Text, nullable=True)
    priority = Column(String(20), default="Medium") # High, Medium, Low
    category = Column(String(50), default="Immediate Actions") # Immediate Actions, Preventive Measures, Monitoring Tasks, Follow-up Activities
    suggested_date = Column(String(50), nullable=True)
    status = Column(String(30), default="pending") # pending, approved, in_progress, completed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer = relationship("Farmer", back_populates="actions")
    analysis = relationship("CropAnalysis", back_populates="farm_actions")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info") # alert, warning, info, success
    is_read = Column(Boolean, default=False)
    link = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer = relationship("Farmer", back_populates="notifications")
