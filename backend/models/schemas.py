from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class FarmerBase(BaseModel):
    name: str
    farm_name: str
    location: str
    phone: Optional[str] = None
    email: Optional[str] = None
    preferred_language: Optional[str] = "en"

class FarmerResponse(FarmerBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class FarmActionBase(BaseModel):
    title: str
    description: str
    reason: Optional[str] = None
    priority: str = "Medium"
    category: str = "Immediate Actions"
    suggested_date: Optional[str] = None
    status: str = "pending"
    analysis_id: Optional[int] = None
    farmer_id: Optional[int] = None

class FarmActionCreate(FarmActionBase):
    pass

class FarmActionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    reason: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    suggested_date: Optional[str] = None
    status: Optional[str] = None

class FarmActionResponse(FarmActionBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class WeatherRequest(BaseModel):
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class WeatherData(BaseModel):
    location: str
    latitude: float
    longitude: float
    temperature: float
    humidity: Optional[float] = None
    precipitation: Optional[float] = None
    wind_speed: Optional[float] = None
    weather_code: Optional[int] = None
    weather_condition: Optional[str] = None
    environmental_risk: str = "LOW"
    forecast_days: Optional[List[Dict[str, Any]]] = None
    disease_risk_alerts: Optional[List[Dict[str, Any]]] = None

class AgentTimelineItem(BaseModel):
    agent_id: str
    agent_name: str
    status: str # waiting, running, completed, failed
    timestamp: Optional[str] = None
    duration_ms: Optional[int] = None
    summary: Optional[str] = None
    findings: Optional[Dict[str, Any]] = None

class InvestigationResponse(BaseModel):
    id: int
    analysis_id: int
    orchestrator_plan: Optional[Dict[str, Any]] = None
    crop_diagnosis_output: Optional[Dict[str, Any]] = None
    weather_output: Optional[Dict[str, Any]] = None
    knowledge_output: Optional[Dict[str, Any]] = None
    risk_output: Optional[Dict[str, Any]] = None
    action_plan_output: Optional[Dict[str, Any]] = None
    execution_timeline: Optional[List[Dict[str, Any]]] = None
    execution_time_ms: int
    created_at: datetime
    class Config:
        from_attributes = True

class CropAnalysisResponse(BaseModel):
    id: int
    crop_name: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_path: Optional[str] = None
    symptoms_description: Optional[str] = None
    disease_detected: Optional[str] = None
    confidence: Optional[float] = None
    is_simulated: bool = False
    risk_level: str
    status: str
    created_at: datetime
    investigation: Optional[InvestigationResponse] = None
    farm_actions: Optional[List[FarmActionResponse]] = None
    class Config:
        from_attributes = True

class AssistantChatRequest(BaseModel):
    message: str
    language: str = "en" # "en" or "kn"
    context: Optional[Dict[str, Any]] = None

class AssistantChatResponse(BaseModel):
    reply: str
    language: str
    sources: Optional[List[str]] = None
    suggested_questions: Optional[List[str]] = None
    is_simulated: bool = False

class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    link: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True
