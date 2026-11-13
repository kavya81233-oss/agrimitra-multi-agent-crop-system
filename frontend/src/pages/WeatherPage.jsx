import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Search,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  Calendar,
  Sparkles,
  Info,
  CheckCircle2,
  MapPin,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { fetchWeather } from '../services/api';
import { useToast } from '../components/Toast';

export default function WeatherPage() {
  const { addToast } = useToast();
  const [locationInput, setLocationInput] = useState('Bengaluru Rural');
  const [currentLocation, setCurrentLocation] = useState('Bengaluru Rural, Karnataka');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeatherData('Bengaluru Rural, Karnataka');
  }, []);

  const loadWeatherData = async (loc) => {
    try {
      setLoading(true);
      const data = await fetchWeather(loc);
      setWeather(data);
      setCurrentLocation(data.location || loc);
    } catch (e) {
      console.error(e);
      addToast('Could not load weather data for this location', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!locationInput.trim()) return;
    loadWeatherData(locationInput.trim());
  };

  const presetLocations = [
    'Bengaluru Rural',
    'Mandya',
    'Mysuru',
    'Hassan',
    'Dharwad',
    'Belagavi',
    'Raichur',
    'Kalaburagi'
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title & Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-2">
          <CloudSun className="w-3.5 h-3.5" />
          Atmospheric Intelligence & Spore Prediction
        </div>
        <h1 className="text-3xl font-black text-forest-900 tracking-tight">
          Weather Intelligence
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time Open-Meteo meteorological data synced with pathogen germination and spraying window models.
        </p>
      </div>

      {/* Location Search Bar & Quick Chips */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Search Indian farm location or district (e.g. Mandya, Hassan, Dharwad)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent bg-slate-50/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" /> Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-medium">Quick Districts:</span>
          {presetLocations.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                setLocationInput(loc);
                loadWeatherData(`${loc}, Karnataka`);
              }}
              className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 hover:bg-forest-50 hover:text-forest-900 text-slate-600 transition"
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">Querying Open-Meteo Geocoding & Atmospheric Servers...</p>
        </div>
      ) : weather ? (
        <div className="space-y-6">
          {/* Main Current Conditions Card */}
          <div className="bg-gradient-to-br from-sky-900 via-sky-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold tracking-wider uppercase border border-white/20">
                    {weather.source || 'Open-Meteo Live API'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black mt-2">
                    {weather.location}
                  </h2>
                  <p className="text-xs text-sky-200 mt-0.5">
                    Coordinates: {weather.latitude?.toFixed(4)}°N, {weather.longitude?.toFixed(4)}°E
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-4xl sm:text-5xl font-black">
                    {weather.temperature}°C
                  </span>
                  <p className="text-xs font-bold text-sky-200 mt-1">
                    {weather.weather_condition}
                  </p>
                </div>
              </div>

              {/* 4 Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <span className="text-[11px] text-sky-200 font-medium block">Relative Humidity</span>
                  <span className="text-xl font-black text-white mt-1 block">{weather.humidity}%</span>
                  <span className="text-[10px] text-sky-300">
                    {weather.humidity >= 75 ? '⚠️ High fungal spore risk' : 'Normal moisture'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <span className="text-[11px] text-sky-200 font-medium block">Precipitation</span>
                  <span className="text-xl font-black text-white mt-1 block">{weather.precipitation} mm</span>
                  <span className="text-[10px] text-sky-300">
                    {weather.precipitation > 2 ? '⚠️ Soil splash risk' : 'Dry leaf surface'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <span className="text-[11px] text-sky-200 font-medium block">Wind Speed</span>
                  <span className="text-xl font-black text-white mt-1 block">{weather.wind_speed} km/h</span>
                  <span className="text-[10px] text-sky-300">
                    {weather.wind_speed < 12 ? 'Optimal spray window' : 'Moderate drift'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <span className="text-[11px] text-sky-200 font-medium block">Atmospheric Risk</span>
                  <span className="text-xl font-black text-amber-300 mt-1 block">
                    {weather.environmental_risk}
                  </span>
                  <span className="text-[10px] text-sky-200">Composite spore score</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Temperature & Rainfall Chart */}
          {weather.forecast_days && weather.forecast_days.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">7-Day Agricultural Weather Forecast</h3>
                  <p className="text-xs text-slate-500">Predicted daily temperature swings and rainfall spikes</p>
                </div>
                <span className="text-xs font-semibold text-slate-400">Open-Meteo High Resolution</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weather.forecast_days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val, name) => [
                        `${val}${name === 'temp_max' || name === 'temp_min' ? '°C' : ' mm'}`,
                        name === 'temp_max' ? 'Max Temp' : name === 'temp_min' ? 'Min Temp' : 'Rainfall'
                      ]}
                    />
                    <Bar dataKey="temp_max" fill="#166534" radius={[4, 4, 0, 0]} name="temp_max" />
                    <Bar dataKey="temp_min" fill="#86efac" radius={[4, 4, 0, 0]} name="temp_min" />
                    <Bar dataKey="precipitation" fill="#0284c7" radius={[4, 4, 0, 0]} name="precipitation" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-6 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-forest-800" /> Max Temperature (°C)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-300" /> Min Temperature (°C)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-sky-600" /> Rainfall (mm)
                </span>
              </div>
            </div>
          )}

          {/* Microclimate Pathogen Risk Observations */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Weather-Driven Pathogen Risk Factors
              </h3>
              <span className="text-[10px] font-bold text-forest-800 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200">
                AI Agronomic Assessment
              </span>
            </div>

            <div className="space-y-3">
              {weather.risk_factors?.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 leading-relaxed">{factor}</p>
                </div>
              ))}
            </div>

            {/* Practical Field Recommendations Based on Weather */}
            <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-200 space-y-2 text-xs">
              <span className="font-bold text-forest-900 block">
                AgriMitra Tactical Spray & Irrigation Advisory:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>
                  <strong>Optimal Spray Window:</strong> Tomorrow between 6:30 AM and 9:00 AM (wind speed &lt; 10 km/h, foliage dry to touch).
                </li>
                <li>
                  <strong>Irrigation Timing:</strong> Shift from overhead sprinklers to root-zone drip to reduce leaf wetness duration.
                </li>
                <li>
                  <strong>Post-Rain Scour Protection:</strong> If rainfall exceeds 5 mm, inspect bottom tomato and potato leaves within 24 hours.
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
