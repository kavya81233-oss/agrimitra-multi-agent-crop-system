from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.models import WeatherRecord
from models.schemas import WeatherRequest
from services.weather_service import fetch_weather

router = APIRouter(prefix="/api/weather", tags=["Weather Intelligence"])

@router.get("")
def get_weather(
    location: str = Query("Bengaluru", description="City, district, or region"),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    db: Session = Depends(get_db)
):
    data = fetch_weather(location_name=location, lat=lat, lon=lon)

    # Save to WeatherRecord
    record = WeatherRecord(
        location=data.get("location", location),
        latitude=data.get("latitude", 0.0),
        longitude=data.get("longitude", 0.0),
        temperature=data.get("temperature", 25.0),
        humidity=data.get("humidity"),
        precipitation=data.get("precipitation"),
        wind_speed=data.get("wind_speed"),
        weather_code=data.get("weather_code"),
        weather_condition=data.get("weather_condition"),
        environmental_risk=data.get("environmental_risk", "LOW"),
        raw_data=data
    )
    db.add(record)
    db.commit()

    return data

@router.post("")
def post_weather(req: WeatherRequest, db: Session = Depends(get_db)):
    data = fetch_weather(location_name=req.location, lat=req.latitude, lon=req.longitude)

    record = WeatherRecord(
        location=data.get("location", req.location),
        latitude=data.get("latitude", 0.0),
        longitude=data.get("longitude", 0.0),
        temperature=data.get("temperature", 25.0),
        humidity=data.get("humidity"),
        precipitation=data.get("precipitation"),
        wind_speed=data.get("wind_speed"),
        weather_code=data.get("weather_code"),
        weather_condition=data.get("weather_condition"),
        environmental_risk=data.get("environmental_risk", "LOW"),
        raw_data=data
    )
    db.add(record)
    db.commit()

    return data
