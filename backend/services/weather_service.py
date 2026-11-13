import requests
from typing import Dict, Any, Optional

WMO_WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
}

def geocode_location(location_name: str) -> Optional[Dict[str, Any]]:
    try:
        url = "https://geocoding-api.open-meteo.com/v1/search"
        params = {"name": location_name, "count": 1, "language": "en", "format": "json"}
        response = requests.get(url, params=params, timeout=(1.5, 2.5))
        if response.status_code == 200:
            data = response.json()
            if "results" in data and len(data["results"]) > 0:
                result = data["results"][0]
                return {
                    "name": result.get("name"),
                    "admin1": result.get("admin1", ""),
                    "country": result.get("country", ""),
                    "latitude": result.get("latitude"),
                    "longitude": result.get("longitude")
                }
    except Exception as e:
        pass
    return None

def fetch_weather(location_name: str, lat: Optional[float] = None, lon: Optional[float] = None) -> Dict[str, Any]:
    resolved_name = location_name
    latitude = lat
    longitude = lon

    if latitude is None or longitude is None:
        geocoded = geocode_location(location_name)
        if geocoded:
            latitude = geocoded["latitude"]
            longitude = geocoded["longitude"]
            resolved_name = f"{geocoded['name']}, {geocoded.get('admin1', '')} ({geocoded.get('country', '')})"
        else:
            # Fallback coordinates for Bengaluru if geocoding fails or offline
            latitude = 12.9716
            longitude = 77.5946
            resolved_name = f"{location_name} (Approx. Coordinates)"

    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code",
            "timezone": "auto"
        }
        resp = requests.get(url, params=params, timeout=(1.5, 2.5))
        if resp.status_code == 200:
            data = resp.json()
            current = data.get("current", {})
            temp = current.get("temperature_2m", 25.0)
            humidity = current.get("relative_humidity_2m", 65.0)
            precip = current.get("precipitation", 0.0)
            wind = current.get("wind_speed_10m", 8.0)
            wcode = current.get("weather_code", 0)
            cond_str = WMO_WEATHER_CODES.get(wcode, "Partly cloudy")

            # Parse 7-day forecast
            daily = data.get("daily", {})
            forecast_days = []
            dates = daily.get("time", [])
            max_temps = daily.get("temperature_2m_max", [])
            min_temps = daily.get("temperature_2m_min", [])
            daily_precip = daily.get("precipitation_sum", [])
            daily_codes = daily.get("weather_code", [])

            for i in range(min(len(dates), 7)):
                forecast_days.append({
                    "date": dates[i],
                    "temp_max": max_temps[i] if i < len(max_temps) else temp,
                    "temp_min": min_temps[i] if i < len(min_temps) else temp - 5,
                    "precipitation": daily_precip[i] if i < len(daily_precip) else 0.0,
                    "condition": WMO_WEATHER_CODES.get(daily_codes[i] if i < len(daily_codes) else 0, "Clear")
                })

            risk_level, risk_factors, alerts = evaluate_environmental_risk(temp, humidity, precip, wind)

            return {
                "location": resolved_name,
                "latitude": latitude,
                "longitude": longitude,
                "temperature": temp,
                "humidity": humidity,
                "precipitation": precip,
                "wind_speed": wind,
                "weather_code": wcode,
                "weather_condition": cond_str,
                "environmental_risk": risk_level,
                "risk_factors": risk_factors,
                "disease_risk_alerts": alerts,
                "forecast_days": forecast_days,
                "is_live": True,
                "source": "Open-Meteo Live API"
            }
    except Exception as e:
        print(f"Weather API error: {e}")

    # Fallback when Open-Meteo is unreachable
    temp = 26.5
    humidity = 78.0
    precip = 1.2
    wind = 9.5
    risk_level, risk_factors, alerts = evaluate_environmental_risk(temp, humidity, precip, wind)
    return {
        "location": f"{location_name} (Simulated Regional Weather)",
        "latitude": latitude,
        "longitude": longitude,
        "temperature": temp,
        "humidity": humidity,
        "precipitation": precip,
        "wind_speed": wind,
        "weather_code": 2,
        "weather_condition": "Partly cloudy with intermittent moisture",
        "environmental_risk": risk_level,
        "risk_factors": risk_factors,
        "disease_risk_alerts": alerts,
        "forecast_days": [
            {"date": "Day 1", "temp_max": 28.0, "temp_min": 19.0, "precipitation": 1.0, "condition": "Partly cloudy"},
            {"date": "Day 2", "temp_max": 27.5, "temp_min": 18.5, "precipitation": 3.5, "condition": "Light rain"},
            {"date": "Day 3", "temp_max": 29.0, "temp_min": 20.0, "precipitation": 0.0, "condition": "Sunny"},
            {"date": "Day 4", "temp_max": 28.2, "temp_min": 19.5, "precipitation": 0.5, "condition": "Mainly clear"},
            {"date": "Day 5", "temp_max": 26.8, "temp_min": 18.0, "precipitation": 2.2, "condition": "Slight rain"}
        ],
        "is_live": False,
        "source": "Offline Fallback Model (Open-Meteo Unreachable)"
    }

def evaluate_environmental_risk(temp: float, humidity: float, precip: float, wind: float):
    risk_factors = []
    alerts = []
    score = 0

    # Fungal pathogen moisture conditions
    if humidity >= 80:
        score += 3
        risk_factors.append(f"Elevated relative humidity ({humidity}%) drastically accelerates fungal spore germination and foliar leaf wetness.")
        alerts.append({
            "type": "HIGH_HUMIDITY_BLIGHT_RISK",
            "severity": "HIGH",
            "message": "Persistent humidity (>80%) creates ideal incubation conditions for Blight, Mildew, and Leaf Spot pathogens."
        })
    elif humidity >= 65:
        score += 1
        risk_factors.append(f"Moderate humidity ({humidity}%) provides sufficient moisture for opportunistic foliar pathogens.")

    # Temperature suitability for common fungal diseases
    if 18 <= temp <= 29:
        score += 2
        risk_factors.append(f"Temperature ({temp}°C) falls squarely within the optimal vegetative growth range for Alternaria and Phytophthora pathogens.")
    elif temp > 33:
        score += 1
        risk_factors.append(f"High ambient heat ({temp}°C) increases plant transpiration stress and whitefly / spider mite activity.")

    # Precipitation
    if precip > 5.0:
        score += 3
        risk_factors.append(f"Significant recent rainfall ({precip} mm) causes splash dispersal of soil-borne resting spores onto lower leaf foliage.")
        alerts.append({
            "type": "RAIN_SPLASH_DISPERSAL",
            "severity": "HIGH",
            "message": "Rain splash risk: Avoid cultivation work when foliage is wet to prevent bacterial and fungal cross-contamination."
        })
    elif precip > 0.5:
        score += 1
        risk_factors.append(f"Light precipitation ({precip} mm) maintains leaf surface wetness.")

    # Wind
    if wind > 18.0:
        score += 1
        risk_factors.append(f"Brisk wind ({wind} km/h) can cause micro-abrasions on foliage, providing wound portals for bacterial entry.")

    if score >= 6:
        risk_level = "HIGH"
    elif score >= 3:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return risk_level, risk_factors, alerts
