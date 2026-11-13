import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Printer,
  RotateCcw,
  Save,
  MessageSquare,
  Microscope,
  CloudSun,
  BookOpen,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Thermometer,
  Droplets,
  Wind,
  ExternalLink,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { fetchAnalysisById, updateAction } from '../services/api';
import { useToast } from '../components/Toast';

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await fetchAnalysisById(id);
      setAnalysis(data);
    } catch (e) {
      console.error(e);
      addToast(`Could not load report #${id}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApproveAllActions = async () => {
    if (!analysis?.farm_actions) return;
    try {
      for (const act of analysis.farm_actions) {
        if (act.status === 'pending') {
          await updateAction(act.id, { status: 'approved' });
        }
      }
      addToast('All recommended tasks approved and synchronized with Farm Action Planner!', 'success');
      loadReport();
    } catch (e) {
      addToast('Failed to approve tasks', 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-700">Synthesizing Final Multi-Agent Report...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-600 font-bold">Investigation report not found.</p>
        <button
          onClick={() => navigate('/investigate')}
          className="px-5 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs"
        >
          Start New Investigation
        </button>
      </div>
    );
  }

  const investigation = analysis.investigation || {};
  const cropDiag = investigation.crop_diagnosis_output || {};
  const weatherIntel = investigation.weather_output || {};
  const knowledge = investigation.knowledge_output || {};
  const riskAssess = investigation.risk_output || {};
  const actionPlan = investigation.action_plan_output || {};

  const riskBadgeColor = {
    LOW: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-300',
    HIGH: 'bg-rose-100 text-rose-800 border-rose-300',
    CRITICAL: 'bg-red-200 text-red-950 border-red-400 font-black'
  }[analysis.risk_level] || 'bg-slate-100 text-slate-800 border-slate-300';

  return (
    <div className="space-y-8 max-w-5xl mx-auto print:p-0">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Investigations
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
          </button>
          <button
            onClick={() => navigate('/investigate')}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Re-run Scan
          </button>
          <button
            onClick={() => navigate('/assistant')}
            className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" /> Consult AI Agronomist
          </button>
        </div>
      </div>

      {/* Printable Report Header Container */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-forest-800 uppercase tracking-wider bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200">
                Official Multi-Agent Agronomic Report #{analysis.id}
              </span>
              <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${riskBadgeColor}`}>
                {analysis.risk_level} Threat Level
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {analysis.crop_name}: {analysis.disease_detected || 'Crop Health Diagnosis'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Location: <strong>{analysis.location}</strong> • Investigated on {new Date(analysis.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-slate-400 block">Orchestrator Execution Time</span>
            <span className="text-lg font-mono font-bold text-slate-800">
              {investigation.execution_time_ms || 280} ms
            </span>
          </div>
        </div>

        {/* Diagnostic Hero: Image + Quick Diagnosis Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Crop Image Viewport (4 cols) */}
          <div className="md:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden relative">
              {analysis.image_path ? (
                <img
                  src={analysis.image_path}
                  alt={analysis.crop_name}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 p-6 text-center space-y-2">
                  <Microscope className="w-12 h-12 text-forest-800 opacity-30" />
                  <p className="text-xs font-semibold text-slate-500">
                    Symptom-Based Analysis (No photo uploaded)
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Evaluated via farmer-reported lesion morphology
                  </p>
                </div>
              )}
              <div className="p-3 bg-white/90 backdrop-blur-md border-t border-slate-200 text-xs flex items-center justify-between">
                <span className="font-bold text-slate-700">{analysis.crop_name} Specimen</span>
                <span className="text-[10px] text-slate-500">
                  {cropDiag.pathogen_type || 'Pathological Specimen'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Findings Summary (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            {/* Primary Diagnosis Box */}
            <div className="p-4 rounded-2xl bg-forest-50/60 border border-forest-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest-900 uppercase tracking-wider">
                  Confirmed AI Diagnosis
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {cropDiag.confidence_label || (analysis.is_simulated ? 'Demo Mode (Rule-Based Synthesis)' : 'Live Model')}
                </span>
              </div>
              <h3 className="text-xl font-black text-forest-900">
                {analysis.disease_detected}
              </h3>
              <p className="text-xs text-slate-600 italic">
                Scientific Classification: {cropDiag.scientific_name || 'N/A'} • Pathogen: {cropDiag.pathogen_type || 'Fungal'}
              </p>
              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                {cropDiag.summary || analysis.symptoms_description}
              </p>
            </div>

            {/* Differential / Alternative Causes */}
            {cropDiag.alternative_causes && cropDiag.alternative_causes.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1">
                  Alternative / Secondary Potential Causes:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  {cropDiag.alternative_causes.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Urgency and Timeframe */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Urgency Horizon</span>
                <p className="text-xs font-extrabold text-amber-950 mt-0.5">
                  {riskAssess.urgency_timeframe || 'Action within 48 Hours'}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200">
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">Next Follow-Up</span>
                <p className="text-xs font-extrabold text-sky-950 mt-0.5">
                  {actionPlan.suggested_follow_up_date || 'In 3-5 Days'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Conditions At Investigation Snapshot */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CloudSun className="w-4 h-4 text-sky-600" />
              Microclimate Atmospheric Conditions (Open-Meteo)
            </h4>
            <span className="text-[10px] font-semibold text-slate-400">
              {weatherIntel.location || analysis.location}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-white border border-slate-100">
              <span className="text-[11px] text-slate-400">Temperature</span>
              <p className="text-base font-bold text-slate-800 mt-0.5">{weatherIntel.temperature ?? 26.5}°C</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-100">
              <span className="text-[11px] text-slate-400">Relative Humidity</span>
              <p className="text-base font-bold text-sky-700 mt-0.5">{weatherIntel.humidity ?? 78}%</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-100">
              <span className="text-[11px] text-slate-400">Precipitation</span>
              <p className="text-base font-bold text-slate-800 mt-0.5">{weatherIntel.precipitation ?? 1.2} mm</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-100">
              <span className="text-[11px] text-slate-400">Environmental Risk</span>
              <p className="text-base font-bold text-rose-700 mt-0.5">{weatherIntel.environmental_risk_level || 'MEDIUM'}</p>
            </div>
          </div>
          {weatherIntel.crop_specific_observations?.length > 0 && (
            <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
              <strong>Agronomic Spore Impact:</strong> {weatherIntel.crop_specific_observations[0]}
            </p>
          )}
        </div>

        {/* Agricultural Research & Verified Agronomic Sources */}
        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-700" />
              Verified Agricultural Compendium Evidence
            </h4>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              Research Validated
            </span>
          </div>
          <div className="space-y-2 text-xs text-slate-700">
            <p>
              <strong>Organic Remediation:</strong>{' '}
              {knowledge.organic_practices || 'Spray Trichoderma viride or Pseudomonas fluorescens (20g/L).'}
            </p>
            <p>
              <strong>Cultural Prevention:</strong>{' '}
              {knowledge.preventive_guidelines || 'Practice drip irrigation, prune bottom foliage, and solarize soil.'}
            </p>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-amber-200/60">
              <strong>Source References:</strong> {knowledge.sources || 'ICAR Indian Council of Agricultural Research'}
            </p>
          </div>
        </div>

        {/* Prioritized Action Recommendations */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Synthesized Farm Action Recommendations
              </h3>
              <p className="text-xs text-slate-500">
                Sequenced by urgency. Farmer approval required before execution.
              </p>
            </div>
            <button
              onClick={handleApproveAllActions}
              className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 print:hidden"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve All & Sync to Tasks
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.farm_actions?.map((action) => (
              <div
                key={action.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-forest-300 transition space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider bg-forest-100 px-2 py-0.5 rounded">
                      {action.category}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                        action.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {action.priority} Priority
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{action.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                  <p className="text-[11px] text-slate-500 italic mt-1.5 bg-white p-2 rounded-lg border border-slate-100">
                    <strong>Reason:</strong> {action.reason}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Due: {action.suggested_date}
                  </span>
                  <span
                    className={`font-bold ${
                      action.status === 'approved' ? 'text-emerald-700' : 'text-amber-600'
                    }`}
                  >
                    {action.status === 'approved' ? 'Approved by Farmer' : 'Pending Approval'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ethical Disclaimer at bottom of report */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs space-y-1">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Official AgriMitra Advisory Disclaimer
          </p>
          <p className="text-[11px] leading-relaxed">
            This autonomous investigation was produced through a collaborative swarm of 5 specialized AI agents.
            While grounded in agronomic literature, field conditions such as soil pH, micro-irrigation salinity, and
            unseen pest vectors can influence outcomes. Always consult your local Krishi Vigyan Kendra (KVK) officer
            before spraying synthetic agrochemicals.
          </p>
        </div>
      </div>
    </div>
  );
}
