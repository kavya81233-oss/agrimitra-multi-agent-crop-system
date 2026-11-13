import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Microscope,
  CloudSun,
  ClipboardList,
  BotMessageSquare,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ArrowRight,
  TrendingUp,
  Droplets,
  Wind,
  Thermometer,
  ShieldAlert,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { fetchDashboardStats, fetchAnalyses, fetchWeather, fetchActions, updateAction } from '../services/api';
import { useToast } from '../components/Toast';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [stats, setStats] = useState({
    total_analyses: 28,
    healthy_percentage: 78,
    disease_alerts: 4,
    pending_actions: 7,
    is_demo_metrics: true
  });
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [weather, setWeather] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsData, analysesData, weatherData, actionsData] = await Promise.all([
        fetchDashboardStats().catch(() => null),
        fetchAnalyses().catch(() => []),
        fetchWeather('Bengaluru').catch(() => null),
        fetchActions({ status: 'pending' }).catch(() => [])
      ]);

      if (statsData) setStats(statsData);
      if (analysesData) setRecentAnalyses(analysesData.slice(0, 5));
      if (weatherData) setWeather(weatherData);
      if (actionsData) setTasks(actionsData.slice(0, 5));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTask = async (taskId) => {
    try {
      await updateAction(taskId, { status: 'approved' });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      addToast('Action approved by farmer and added to work schedule!', 'success');
    } catch (e) {
      addToast('Failed to approve action', 'error');
    }
  };

  // Crop health chart data
  const healthDistribution = [
    { name: 'Healthy Crops', value: stats.healthy_percentage, color: '#16a34a' },
    { name: 'Under Treatment', value: 100 - stats.healthy_percentage - stats.disease_alerts * 3, color: '#eab308' },
    { name: 'Active Alerts', value: stats.disease_alerts * 3, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-700/60 border border-forest-600/50 text-xs font-semibold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Autonomous Farm Decision Support
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, Ramesh Kumar!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
              Your 5-agent agricultural swarm is continuously analyzing weather, disease risks, and farm actions
              across 4 crop blocks in Bengaluru Rural.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/investigate')}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition flex items-center gap-2"
            >
              <Microscope className="w-4 h-4" />
              Start New Investigation
            </button>
            <button
              onClick={() => navigate('/assistant')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition flex items-center gap-2"
            >
              <BotMessageSquare className="w-4 h-4" />
              Ask AI Agronomist
            </button>
          </div>
        </div>

        {/* Decorative background leaf illustration */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <Activity className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Demo Data Notice if metrics are sample */}
      {stats.is_demo_metrics && (
        <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Demonstration Mode:</strong> Sample metrics shown below for initial orientation. New crop investigations will dynamically update this dashboard.
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
            Demo Data
          </span>
        </div>
      )}

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Analyses</span>
            <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center">
              <Microscope className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{stats.total_analyses}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +4 this week
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Multi-agent diagnosis scans</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Healthy Crops</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700">{stats.healthy_percentage}%</span>
            <span className="text-xs font-semibold text-emerald-600">Vigorous canopy</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Based on recent field observations</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Disease Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600">{stats.disease_alerts}</span>
            <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
              Attention Needed
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active fungal & bacterial risks</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Tasks</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{stats.pending_actions}</span>
            <span className="text-xs font-semibold text-slate-500">Awaiting approval</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Generated by Action Planner</p>
        </div>
      </div>

      {/* Main Grid: Weather + Health Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weather Intelligence Widget (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Current Weather Intelligence</h3>
                  <p className="text-xs text-slate-500">{weather?.location || 'Bengaluru Rural, Karnataka'}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                weather?.is_live
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}>
                {weather?.is_live ? 'Live Open-Meteo API' : 'Regional Fallback Model'}
              </span>
            </div>

            {/* Current temperature and main readings */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <Thermometer className="w-4 h-4 text-rose-500 mx-auto mb-1" />
                <span className="text-xs text-slate-400 font-medium">Temperature</span>
                <p className="text-lg font-black text-slate-900 mt-0.5">{weather?.temperature ?? 26.5}°C</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <Droplets className="w-4 h-4 text-sky-500 mx-auto mb-1" />
                <span className="text-xs text-slate-400 font-medium">Humidity</span>
                <p className="text-lg font-black text-sky-700 mt-0.5">{weather?.humidity ?? 78}%</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <CloudSun className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="text-xs text-slate-400 font-medium">Precipitation</span>
                <p className="text-lg font-black text-slate-900 mt-0.5">{weather?.precipitation ?? 1.2} mm</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <Wind className="w-4 h-4 text-teal-500 mx-auto mb-1" />
                <span className="text-xs text-slate-400 font-medium">Wind Speed</span>
                <p className="text-lg font-black text-slate-900 mt-0.5">{weather?.wind_speed ?? 9.5} km/h</p>
              </div>
            </div>

            {/* Environmental Disease Risk Callout */}
            <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-200/80 text-xs">
              <div className="flex items-center justify-between mb-1.5 font-bold text-forest-900">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-forest-700" />
                  Spore & Pathogen Incubation Risk
                </span>
                <span className="px-2 py-0.5 rounded bg-forest-200 text-forest-900 font-extrabold uppercase text-[10px]">
                  {weather?.environmental_risk || 'MEDIUM'} Risk
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {weather?.risk_factors?.[0] || 'Relative humidity above 75% significantly increases fungal germination on tomatoes and potatoes.'}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Condition: {weather?.weather_condition || 'Partly cloudy with moisture'}</span>
            <button
              onClick={() => navigate('/weather')}
              className="font-bold text-forest-800 hover:text-forest-900 flex items-center gap-1"
            >
              View 7-Day Agricultural Forecast <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Crop Health Summary Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">Crop Health Distribution</h3>
              <span className="text-[11px] font-semibold text-slate-400">Total Scans: {stats.total_analyses}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Overall health breakdown across monitored fields.</p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {healthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-around text-xs mt-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-slate-600">Healthy ({stats.healthy_percentage}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-600">Observation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600">Alerts ({stats.disease_alerts})</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-400 font-medium">Updated automatically after each investigation</span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/investigate')}
          className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-forest-600 hover:shadow-md transition text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Microscope className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">1. Analyze Crop</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Upload leaf photo for 5-agent diagnosis</p>
        </button>

        <button
          onClick={() => navigate('/weather')}
          className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-600 hover:shadow-md transition text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <CloudSun className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">2. Check Weather</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Open-Meteo forecast & spore humidity index</p>
        </button>

        <button
          onClick={() => navigate('/actions')}
          className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-amber-600 hover:shadow-md transition text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <ClipboardList className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">3. View Farm Actions</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Approve and track prioritized field tasks</p>
        </button>

        <button
          onClick={() => navigate('/assistant')}
          className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-emerald-600 hover:shadow-md transition text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">4. AI Assistant</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Ask questions in English or Kannada</p>
        </button>
      </div>

      {/* Lower Section: Recent Analyses & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Analyses (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Crop Investigations</h3>
              <p className="text-xs text-slate-500">Autonomous diagnostic reports</p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-bold text-forest-800 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentAnalyses.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No analyses recorded yet. Click "Start New Investigation" to begin.
              </div>
            ) : (
              recentAnalyses.map((a) => (
                <div
                  key={a.id}
                  onClick={() => navigate(`/report/${a.id}`)}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-2xl cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 shrink-0 font-bold text-xs">
                      {a.crop_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {a.crop_name} – {a.disease_detected || 'Investigated'}
                      </p>
                      <p className="text-[11px] text-slate-400">{a.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        a.risk_level === 'HIGH' || a.risk_level === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : a.risk_level === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {a.risk_level} Risk
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Farm Actions (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pending Farm Tasks</h3>
                <p className="text-xs text-slate-500">Requires farmer approval</p>
              </div>
              <button
                onClick={() => navigate('/actions')}
                className="text-xs font-bold text-forest-800 hover:underline flex items-center gap-1"
              >
                Manage <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No pending tasks awaiting approval. Great job!
                </div>
              ) : (
                tasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-forest-200 transition space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 leading-snug">{t.title}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                          t.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{t.description}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Due {t.suggested_date || 'Soon'}
                      </span>
                      <button
                        onClick={() => handleApproveTask(t.id)}
                        className="text-[11px] font-bold text-white bg-forest-800 hover:bg-forest-900 px-2.5 py-1 rounded-lg transition"
                      >
                        Approve Action
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              AI recommendations are not automatically executed.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
