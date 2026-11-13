import time
from typing import Dict, Any, Optional
from services.weather_service import fetch_weather

class WeatherIntelligenceAgent:
    """
    AGENT 2: WEATHER INTELLIGENCE AGENT
    Responsibilities:
    - Retrieve current weather using Open-Meteo.
    - Analyze temperature, humidity when available, and rainfall.
    - Identify environmental conditions that may increase crop disease risk.
    """

    def __init__(self):
        self.agent_id = "agent_weather_intelligence"
        self.agent_name = "Weather Intelligence Agent"

    def execute(
        self,
        location: str,
        crop_type: str,
        suspected_pathogen_type: Optional[str] = "Fungal"
    ) -> Dict[str, Any]:
        start_time = time.time()

        weather_data = fetch_weather(location_name=location)

        temp = weather_data.get("temperature", 24.0)
        humidity = weather_data.get("humidity", 70.0)
        precip = weather_data.get("precipitation", 0.0)
        wind = weather_data.get("wind_speed", 10.0)
        env_risk = weather_data.get("environmental_risk", "MEDIUM")

        # Specific microclimate analysis for crops and pathogens
        crop_risk_observations = []
        if suspected_pathogen_type and "Fungal" in suspected_pathogen_type:
            if humidity and humidity >= 75:
                crop_risk_observations.append(
                    f"CRITICAL: High relative humidity ({humidity}%) drastically accelerates fungal conidial spore germination for {crop_type}."
                )
            if precip and precip > 1.0:
                crop_risk_observations.append(
                    f"Rainfall event ({precip} mm) enables splash dispersal of resting spores onto lower foliage."
                )
            if 18 <= temp <= 28:
                crop_risk_observations.append(
                    f"Optimal pathogen growth window: Ambient temperature ({temp}°C) aligns with peak mycelial proliferation."
                )
        elif suspected_pathogen_type and "Bacterial" in suspected_pathogen_type:
            if precip and precip > 2.0:
                crop_risk_observations.append(
                    "High moisture and water congestion in leaf tissue encourage bacterial multiplication."
                )

        if not crop_risk_observations:
            crop_risk_observations.append(
                f"Current conditions in {location} ({temp}°C, {humidity}% humidity) present moderate ambient pressure."
            )

        duration = int((time.time() - start_time) * 1000)

        return {
            "agent_id": self.agent_id,
            "agent_name": self.agent_name,
            "status": "completed",
            "duration_ms": duration,
            "location": weather_data.get("location", location),
            "latitude": weather_data.get("latitude"),
            "longitude": weather_data.get("longitude"),
            "temperature": temp,
            "humidity": humidity,
            "precipitation": precip,
            "wind_speed": wind,
            "weather_condition": weather_data.get("weather_condition", "Partly cloudy"),
            "environmental_risk_level": env_risk,
            "environmental_risk_factors": weather_data.get("risk_factors", []),
            "crop_specific_observations": crop_risk_observations,
            "disease_risk_alerts": weather_data.get("disease_risk_alerts", []),
            "forecast_summary": weather_data.get("forecast_days", [])[:5],
            "is_live_weather": weather_data.get("is_live", False),
            "source": weather_data.get("source", "Open-Meteo API"),
            "summary": f"Retrieved live atmospheric data for {location}: {temp}°C, {humidity}% humidity, {weather_data.get('weather_condition')}. Environmental risk rated as {env_risk}."
        }
