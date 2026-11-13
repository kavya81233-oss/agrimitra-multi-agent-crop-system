import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Cpu,
  CloudSun,
  BookOpen,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  Microscope,
  Leaf
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const agents = [
    {
      num: '01',
      name: 'Crop Diagnosis Agent',
      icon: Microscope,
      tag: 'Vision & Pathology',
      desc: 'Inspects leaf lesions, symptom morphology, and color patterns using configured Gemini Vision or botanical heuristics to identify suspected pathogens with explicit uncertainty bounds.',
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-700 border-emerald-200'
    },
    {
      num: '02',
      name: 'Weather Intelligence Agent',
      icon: CloudSun,
      tag: 'Atmospheric Microclimate',
      desc: 'Retrieves live Open-Meteo atmospheric readings (temperature, relative humidity, precipitation, wind) to compute fungal spore germination indexes and leaf-wetness risk.',
      color: 'from-sky-500/10 to-blue-500/10 text-sky-700 border-sky-200'
    },
    {
      num: '03',
      name: 'Agricultural Knowledge Agent',
      icon: BookOpen,
      tag: 'Agronomic Research Retrieval',
      desc: 'Extracts validated agricultural compendiums, ICAR & FAO extension bulletins, pathogen lifecycles, and verified organic management protocols for target crops.',
      color: 'from-amber-500/10 to-orange-500/10 text-amber-700 border-amber-200'
    },
    {
      num: '04',
      name: 'Risk Assessment Agent',
      icon: AlertTriangle,
      tag: 'Multi-Factor Threat Synthesis',
      desc: 'Synthesizes pathogen virulence, environmental conduciveness, and diagnostic confidence into normalized risk levels (Low, Medium, High, Critical) with urgency horizons.',
      color: 'from-rose-500/10 to-red-500/10 text-rose-700 border-rose-200'
    },
    {
      num: '05',
      name: 'Farm Action Planner Agent',
      icon: ClipboardList,
      tag: 'Decision Support & Scheduling',
      desc: 'Compiles actionable, farmer-approved recommendations across Immediate Actions, Preventive Measures, Canopy Monitoring, and Follow-up activities.',
      color: 'from-emerald-500/10 to-green-500/10 text-forest-800 border-forest-200'
    }
  ];

  const steps = [
    {
      step: 'Step 1',
      title: 'Upload Crop Imagery',
      desc: 'Snap a clear photograph of an affected leaf, stem, or fruit and describe visible symptoms.',
      icon: Microscope
    },
    {
      step: 'Step 2',
      title: 'Autonomous Swarm Execution',
      desc: 'The Orchestrator dispatches five specialized agents in parallel to diagnose, fetch weather, and verify knowledge.',
      icon: Cpu
    },
    {
      step: 'Step 3',
      title: 'Synthesized Risk Report',
      desc: 'Review multi-agent findings, microclimatic spore risk, and pathogen uncertainties in a comprehensive report.',
      icon: Activity
    },
    {
      step: 'Step 4',
      title: 'Farmer-Approved Action Plan',
      desc: 'Approve prioritized tasks, add calendar reminders, and execute safe cultural or bio-control measures.',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="-m-4 md:-m-8">
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-800 text-white flex items-center justify-center shadow">
              <Sprout className="w-5 h-5 text-emerald-300" />
            </div>
            <span className="font-extrabold text-lg text-forest-900 tracking-tight">
              AgriMitra
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-forest-800 transition">Features</a>
            <a href="#architecture" className="hover:text-forest-800 transition">Multi-Agent Swarm</a>
            <a href="#how-it-works" className="hover:text-forest-800 transition">How It Works</a>
            <a href="#about" className="hover:text-forest-800 transition">Safety & Ethics</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs md:text-sm font-bold text-forest-800 hover:text-forest-900 px-3 py-2 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/investigate')}
              className="text-xs md:text-sm font-bold bg-forest-800 hover:bg-forest-900 text-white px-4 py-2 rounded-xl shadow-md transition flex items-center gap-2"
            >
              Start Investigation
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-[#F8FAF7] to-[#F8FAF7] pt-16 pb-20 px-4 md:px-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 border border-forest-200 text-forest-800 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-forest-700" />
              Autonomous Multi-Agent Crop Intelligence
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-forest-900 tracking-tight leading-[1.1]">
              Smarter Farming Starts with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-800 via-emerald-600 to-teal-600">
                Intelligent AI.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              AgriMitra connects five specialized AI agents orchestrated together to diagnose crop diseases,
              analyze microclimatic weather risks, cross-reference agricultural compendiums, and generate
              actionable, farmer-approved management plans.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/investigate')}
                className="px-6 py-3.5 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-xl shadow-forest-900/20 hover:shadow-2xl transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5"
              >
                <span>Get Started – AI Investigation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300/80 hover:border-forest-700 text-slate-800 hover:text-forest-900 font-bold text-sm shadow-sm transition-all"
              >
                Explore Farmer Dashboard
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/60 max-w-lg">
              <div>
                <p className="text-2xl font-black text-forest-900">5</p>
                <p className="text-xs font-medium text-slate-500">Autonomous Agents</p>
              </div>
              <div>
                <p className="text-2xl font-black text-forest-900">100%</p>
                <p className="text-xs font-medium text-slate-500">Free Open-Meteo Weather</p>
              </div>
              <div>
                <p className="text-2xl font-black text-forest-900">0%</p>
                <p className="text-xs font-medium text-slate-500">Unlabeled Predictions</p>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Orchestrator Swarm Live
                </span>
              </div>

              {/* Simulated Flow */}
              <div className="py-4 space-y-3">
                <div className="p-3 rounded-xl bg-forest-50/70 border border-forest-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Microscope className="w-5 h-5 text-forest-800" />
                    <div>
                      <p className="text-xs font-bold text-forest-900">Crop Diagnosis Agent</p>
                      <p className="text-[10px] text-slate-500">Tomato: Early Blight (Alternaria solani)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CloudSun className="w-5 h-5 text-sky-700" />
                    <div>
                      <p className="text-xs font-bold text-sky-900">Weather Intelligence Agent</p>
                      <p className="text-[10px] text-slate-500">26.5°C • 78% RH (High Spore Alert)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                    Live Sync
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-5 h-5 text-amber-700" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">Agronomic Knowledge Agent</p>
                      <p className="text-[10px] text-slate-500">ICAR IIHR Bulletin #48 Validated</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Cited
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-rose-700" />
                    <div>
                      <p className="text-xs font-bold text-rose-900">Risk Assessment Agent</p>
                      <p className="text-[10px] text-slate-500">Risk: MEDIUM-HIGH • Action: 48h</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                    Assessed
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ClipboardList className="w-5 h-5 text-emerald-700" />
                    <div>
                      <p className="text-xs font-bold text-forest-900">Farm Action Planner</p>
                      <p className="text-[10px] text-slate-500">4 Prioritized Tasks Generated</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Awaiting Approval
                  </span>
                </div>
              </div>

              <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Farmer Approval Required</span>
                <span className="font-bold text-forest-800 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Safety First
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Agent Architecture Section */}
      <section id="architecture" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            Autonomous Multi-Agent Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
            Meet the 5 Specialized AI Agents
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            No single model can solve farming. AgriMitra coordinates modular Python agents through an
            Orchestrator to produce structured, verifiable results.
          </p>
        </div>

        {/* Orchestrator Master Banner */}
        <div className="mb-10 p-6 rounded-3xl bg-forest-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wider">
                Workflow Controller
              </span>
              <h3 className="text-2xl font-black">Orchestrator Agent</h3>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                Receives farmer inputs, compiles the investigation plan, coordinates sequential execution,
                synthesizes multi-factor evidence, and constructs the final diagnosis and farm action package.
              </p>
            </div>
            <button
              onClick={() => navigate('/investigate')}
              className="px-5 py-2.5 rounded-xl bg-white text-forest-900 font-bold text-xs hover:bg-forest-50 transition shrink-0"
            >
              Trigger Orchestration
            </button>
          </div>
        </div>

        {/* 5 Specialized Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((ag) => {
            const Icon = ag.icon;
            return (
              <div
                key={ag.num}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold text-slate-300 tracking-widest">{ag.num}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border bg-gradient-to-r ${ag.color}`}>
                      {ag.tag}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-800 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-forest-900 mb-2">{ag.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{ag.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Independent Python Class</span>
                  <span className="text-forest-700 font-bold">Standard Output</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 md:px-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
              How the Multi-Agent Investigation Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A transparent, 4-step pipeline designed for speed, clarity, and safety.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="relative flex flex-col items-start p-6 rounded-3xl bg-[#F8FAF7] border border-slate-200/80">
                  <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center font-bold mb-4 shadow">
                    <Icon className="w-6 h-6 text-emerald-300" />
                  </div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                    {s.step}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety & Informational Disclaimer */}
      <section id="about" className="py-16 px-4 md:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 rounded-3xl bg-amber-50/80 border border-amber-200/80 text-amber-950 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            Agricultural Safety & Ethical AI Principles
          </div>
          <h3 className="text-xl font-bold">Important Agricultural Disclaimer</h3>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed max-w-3xl mx-auto">
            AgriMitra is an autonomous decision support system created for informational and educational assistance.
            It provides evidence-backed agronomic guidance, but does not replace direct physical inspections by certified
            local agricultural extension officers, plant pathology laboratories, or regional Krishi Vigyan Kendras (KVK).
            Farmers must exercise professional judgment before applying synthetic agrochemicals.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-forest-800 text-white flex items-center justify-center">
              <Sprout className="w-4 h-4 text-emerald-300" />
            </div>
            <span className="font-bold text-sm text-forest-900">AgriMitra</span>
            <span className="text-slate-400">|</span>
            <span>Autonomous Multi-Agent Crop Health System</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/dashboard" className="hover:text-forest-900 transition">Dashboard</Link>
            <Link to="/investigate" className="hover:text-forest-900 transition">Crop Diagnosis</Link>
            <Link to="/weather" className="hover:text-forest-900 transition">Weather Intelligence</Link>
            <Link to="/actions" className="hover:text-forest-900 transition">Farm Actions</Link>
            <Link to="/assistant" className="hover:text-forest-900 transition">AI Assistant</Link>
          </div>
          <p>© 2026 AgriMitra. Dedicated to Empowering Farmers.</p>
        </div>
      </footer>
    </div>
  );
}
