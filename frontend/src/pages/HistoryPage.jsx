import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Microscope,
  Calendar,
  ExternalLink,
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { fetchAnalyses } from '../services/api';
import { useToast } from '../components/Toast';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('All');

  // Comparison feature states
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchAnalyses();
      setAnalyses(data || []);
    } catch (e) {
      console.error(e);
      addToast('Could not load investigation history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cropList = ['All', ...new Set(analyses.map((a) => a.crop_name))];

  const filteredAnalyses = analyses.filter(
    (a) => selectedCrop === 'All' || a.crop_name === selectedCrop
  );

  const handleSelectForCompare = (item) => {
    if (!compareA) {
      setCompareA(item);
      addToast(`Selected Analysis #${item.id} as Baseline A`, 'info');
    } else if (!compareB && compareA.id !== item.id) {
      setCompareB(item);
      setIsComparing(true);
      addToast(`Selected Analysis #${item.id} as Follow-up B. Comparison view activated!`, 'success');
    } else {
      setCompareA(item);
      setCompareB(null);
      setIsComparing(false);
      addToast(`Reset comparison. Analysis #${item.id} selected as Baseline A`, 'info');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold mb-2">
            <History className="w-3.5 h-3.5" />
            Continuous Crop Health Surveillance
          </div>
          <h1 className="text-3xl font-black text-forest-900 tracking-tight">
            Investigation History & Monitoring
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review past multi-agent diagnostic records, track lesion progression, or compare two observation scans.
          </p>
        </div>

        <button
          onClick={() => navigate('/investigate')}
          className="px-5 py-2.5 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 shrink-0"
        >
          <Microscope className="w-4 h-4" /> New Investigation
        </button>
      </div>

      {/* Comparison Drawer (Continuous Crop Monitoring) */}
      {isComparing && compareA && compareB && (
        <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-teal-900 rounded-3xl p-6 text-white shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-forest-700/60 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-300" />
              <h3 className="font-extrabold text-base">Continuous Crop Health Comparison</h3>
            </div>
            <button
              onClick={() => {
                setCompareA(null);
                setCompareB(null);
                setIsComparing(false);
              }}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-xl transition"
            >
              Close Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scan A */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Baseline Scan A (#{compareA.id})
              </span>
              <h4 className="text-base font-bold">
                {compareA.crop_name} – {compareA.disease_detected}
              </h4>
              <p className="text-xs text-emerald-100">{compareA.location}</p>
              <div className="text-xs space-y-1 pt-1 text-slate-200">
                <p><strong>Observed Symptoms:</strong> {compareA.symptoms_description || 'Standard lesion scan'}</p>
                <p><strong>Threat Level:</strong> {compareA.risk_level}</p>
              </div>
              <button
                onClick={() => navigate(`/report/${compareA.id}`)}
                className="mt-2 text-xs font-bold text-amber-300 hover:underline flex items-center gap-1"
              >
                Inspect Report A <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Scan B */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                Follow-up Scan B (#{compareB.id})
              </span>
              <h4 className="text-base font-bold">
                {compareB.crop_name} – {compareB.disease_detected}
              </h4>
              <p className="text-xs text-teal-100">{compareB.location}</p>
              <div className="text-xs space-y-1 pt-1 text-slate-200">
                <p><strong>Observed Symptoms:</strong> {compareB.symptoms_description || 'Follow-up inspection'}</p>
                <p><strong>Threat Level:</strong> {compareB.risk_level}</p>
              </div>
              <button
                onClick={() => navigate(`/report/${compareB.id}`)}
                className="mt-2 text-xs font-bold text-teal-300 hover:underline flex items-center gap-1"
              >
                Inspect Report B <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter by Crop */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Crop:
          </span>
          {cropList.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                selectedCrop === crop
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredAnalyses.length} investigations
        </span>
      </div>

      {/* History Cards List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Retrieving diagnostic history records...</p>
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <Microscope className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No records found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No crop investigations matched this filter. Start an investigation to begin your crop health history.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnalyses.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-forest-300 shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 shrink-0 font-extrabold text-sm">
                  {item.crop_name.substring(0, 2).toUpperCase()}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {item.crop_name} – {item.disease_detected || 'Investigated'}
                    </h3>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.risk_level === 'HIGH' || item.risk_level === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : item.risk_level === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {item.risk_level} Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{item.location}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.created_at ? new Date(item.created_at).toLocaleString() : 'Recent'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
                <button
                  onClick={() => handleSelectForCompare(item)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                    compareA?.id === item.id
                      ? 'bg-amber-500 text-white border-amber-500'
                      : compareB?.id === item.id
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {compareA?.id === item.id
                    ? 'Selected as Baseline A'
                    : compareB?.id === item.id
                    ? 'Selected as Follow-up B'
                    : 'Select to Compare'}
                </button>

                <button
                  onClick={() => navigate(`/report/${item.id}`)}
                  className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                >
                  View Report <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
