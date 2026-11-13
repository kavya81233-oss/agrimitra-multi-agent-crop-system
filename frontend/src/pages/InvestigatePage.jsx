import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  Microscope,
  MapPin,
  FileText,
  Sparkles,
  AlertCircle,
  X,
  CheckCircle2,
  Image as ImageIcon,
  HelpCircle,
  Play
} from 'lucide-react';
import { analyzeCrop } from '../services/api';
import { useToast } from '../components/Toast';
import AgentExecutionCenter from '../components/AgentExecutionCenter';

export default function InvestigatePage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  // Form states
  const [cropType, setCropType] = useState('Tomato');
  const [location, setLocation] = useState('Bengaluru Rural, Karnataka');
  const [symptoms, setSymptoms] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Execution states
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [executionResult, setExecutionResult] = useState(null);
  const [createdAnalysisId, setCreatedAnalysisId] = useState(null);

  const samplePresets = [
    {
      title: 'Tomato Early Blight',
      crop: 'Tomato',
      location: 'Bengaluru Rural, Karnataka',
      symptoms: 'Concentric brown rings on lower leaves, yellowing margins, target-board pattern with premature leaf drop.'
    },
    {
      title: 'Rice Blast',
      crop: 'Rice',
      location: 'Mandya, Karnataka',
      symptoms: 'Spindle-shaped elliptical lesions with gray centers and dark reddish borders on leaves and panicle neck.'
    },
    {
      title: 'Potato Late Blight',
      crop: 'Potato',
      location: 'Hassan, Karnataka',
      symptoms: 'Large water-soaked irregular lesions on leaf edges with white fuzzy mildew forming under high humidity.'
    },
    {
      title: 'Cotton Leaf Curl Virus',
      crop: 'Cotton',
      location: 'Dharwad, Karnataka',
      symptoms: 'Severe upward leaf curling, thickening of veins with small leafy enations underneath, stunting of plants.'
    }
  ];

  const handleApplyPreset = (preset) => {
    setCropType(preset.crop);
    setLocation(preset.location);
    setSymptoms(preset.symptoms);
    setSelectedFile(null);
    setPreviewUrl(null);
    addToast(`Loaded preset scenario: ${preset.title}`, 'info');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('Please upload a valid image file (JPEG, PNG, WebP)', 'error');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartInvestigation = async (e) => {
    e.preventDefault();

    if (!cropType) {
      addToast('Please select a crop type', 'warning');
      return;
    }
    if (!location) {
      addToast('Please enter your farm location', 'warning');
      return;
    }

    setIsExecuting(true);
    setActiveStep(0);
    setExecutionResult(null);

    try {
      // Begin visual stepped animation while invoking orchestrator
      const stepTimer1 = setTimeout(() => setActiveStep(1), 500); // Diagnosis Agent
      const stepTimer2 = setTimeout(() => setActiveStep(2), 1200); // Weather Agent
      const stepTimer3 = setTimeout(() => setActiveStep(3), 1900); // Knowledge Agent
      const stepTimer4 = setTimeout(() => setActiveStep(4), 2600); // Risk Assessment
      const stepTimer5 = setTimeout(() => setActiveStep(5), 3300); // Action Planner

      // Call backend API
      const response = await analyzeCrop({
        cropType,
        location,
        symptomsDescription: symptoms,
        file: selectedFile
      });

      // Complete all steps
      setTimeout(() => {
        setActiveStep(6);
        setExecutionResult(response.full_result);
        setCreatedAnalysisId(response.analysis_id);
        addToast('Investigation successfully completed by all 5 agents!', 'success');
      }, 3800);

    } catch (err) {
      console.error(err);
      addToast(err.message || 'Error occurred during multi-agent investigation', 'error');
      setIsExecuting(false);
    }
  };

  const handleViewReport = () => {
    if (createdAnalysisId) {
      navigate(`/report/${createdAnalysisId}`);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold mb-2">
          <Microscope className="w-3.5 h-3.5" />
          Autonomous Diagnostic Pipeline
        </div>
        <h1 className="text-3xl font-black text-forest-900 tracking-tight">
          Crop Disease Investigation
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload an image of an affected leaf, enter symptoms, and trigger the multi-agent AI swarm.
        </p>
      </div>

      {/* If executing, display the interactive AgentExecutionCenter */}
      {isExecuting ? (
        <AgentExecutionCenter
          activeStep={activeStep}
          executionResult={executionResult}
          onViewReport={handleViewReport}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (8 cols) */}
          <form
            onSubmit={handleStartInvestigation}
            className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6"
          >
            {/* Step 1: Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                1. Upload Crop or Leaf Image
                <span className="text-xs font-normal text-slate-400 ml-2">(Optional but recommended)</span>
              </label>

              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-forest-600 rounded-3xl p-8 text-center cursor-pointer transition bg-slate-50/50 hover:bg-forest-50/20 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white text-forest-800 shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition">
                    <UploadCloud className="w-7 h-7 text-forest-700" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    Click to upload leaf photo or drag & drop
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports JPG, PNG, WebP up to 15MB. Clear macro focus on leaf lesions recommended.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900/5 max-h-72 flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    className="object-contain max-h-72 w-full rounded-3xl"
                  />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white shadow-lg backdrop-blur-md transition"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/70 text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Image Staged for AI Vision
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Crop Type Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                2. Select Crop Type
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {['Tomato', 'Potato', 'Rice', 'Maize', 'Wheat', 'Cotton'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCropType(c)}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition text-center ${
                      cropType === c
                        ? 'bg-forest-800 text-white border-forest-800 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Farm Location */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>3. Farm Location</span>
                <span className="text-[11px] text-slate-400 font-normal">Used for live Open-Meteo weather sync</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru Rural, Mandya, Dharwad..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent bg-slate-50/50"
                  required
                />
              </div>
              {/* Quick location chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Bengaluru Rural', 'Mandya', 'Mysuru', 'Hassan', 'Dharwad', 'Belagavi'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(`${loc}, Karnataka`)}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-forest-100 text-slate-600 hover:text-forest-900 transition"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Observed Symptoms Description */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>4. Visible Symptoms Description</span>
                <span className="text-[11px] text-slate-400 font-normal">Describe leaf spots, curling, discoloration</span>
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={3}
                placeholder="e.g. Dark brown concentric circles on lower leaves with yellow halos. Leaf margins drying out prematurely..."
                className="w-full p-3.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent bg-slate-50/50"
              />
              {/* Quick symptom tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'Concentric target rings',
                  'Yellow halos around spots',
                  'Water-soaked lesions',
                  'White fuzzy mold under leaf',
                  'Upward leaf curling',
                  'Stunted plant growth'
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSymptoms((prev) => (prev ? `${prev}, ${tag}` : tag))}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-forest-50 hover:bg-forest-100 text-forest-800 border border-forest-200/60 transition"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-forest-900/20 hover:shadow-2xl transition flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Start Multi-Agent AI Investigation</span>
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2">
                Triggers Orchestrator, Vision Pathology, Open-Meteo sync, and Farm Action Planner.
              </p>
            </div>
          </form>

          {/* Right Sidebar: Quick Demo Presets (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">One-Click Demonstration Scenarios</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click any scenario below to automatically prefill verified agronomic parameters for testing:
              </p>

              <div className="space-y-2.5">
                {samplePresets.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleApplyPreset(preset)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-forest-50/60 border border-slate-200 hover:border-forest-300 cursor-pointer transition space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-forest-900">
                        {preset.title}
                      </span>
                      <span className="text-[10px] font-bold text-forest-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {preset.crop}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{preset.symptoms}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety principles reminder */}
            <div className="p-5 rounded-3xl bg-forest-50/60 border border-forest-200 text-xs text-forest-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-forest-900">
                <HelpCircle className="w-4 h-4 text-forest-700" />
                <span>Scientific Verification Policy</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                If no live Gemini API key is configured in the environment, AgriMitra transparently executes in
                labelled Demo Mode using curated knowledge bases. We never present false confidence scores.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
