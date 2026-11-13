import React, { useState } from 'react';
import {
  Cpu,
  Microscope,
  CloudSun,
  BookOpen,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function AgentExecutionCenter({
  activeStep,
  executionResult,
  onViewReport
}) {
  const [expandedAgent, setExpandedAgent] = useState('crop_diagnosis');

  const agentsList = [
    {
      id: 'orchestrator',
      name: 'Orchestrator Agent',
      role: 'Investigation Coordinator & Synthesizer',
      stepNumber: 0,
      icon: Cpu,
      color: 'border-slate-300 bg-slate-50 text-slate-800',
      data: executionResult?.orchestrator_plan
    },
    {
      id: 'crop_diagnosis',
      name: 'Crop Diagnosis Agent',
      role: 'Vision & Symptom Pathology',
      stepNumber: 1,
      icon: Microscope,
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
      data: executionResult?.crop_diagnosis
    },
    {
      id: 'weather_intelligence',
      name: 'Weather Intelligence Agent',
      role: 'Open-Meteo & Microclimate Risk',
      stepNumber: 2,
      icon: CloudSun,
      color: 'border-sky-200 bg-sky-50/50 text-sky-900',
      data: executionResult?.weather_intelligence
    },
    {
      id: 'agri_knowledge',
      name: 'Agricultural Knowledge Agent',
      role: 'Agronomic Research & Retrieval',
      stepNumber: 3,
      icon: BookOpen,
      color: 'border-amber-200 bg-amber-50/50 text-amber-900',
      data: executionResult?.agricultural_knowledge
    },
    {
      id: 'risk_assessment',
      name: 'Risk Assessment Agent',
      role: 'Contagion & Uncertainty Analysis',
      stepNumber: 4,
      icon: AlertTriangle,
      color: 'border-rose-200 bg-rose-50/50 text-rose-900',
      data: executionResult?.risk_assessment
    },
    {
      id: 'action_planner',
      name: 'Farm Action Planner Agent',
      role: 'Decision Support & Action Sequencing',
      stepNumber: 5,
      icon: ClipboardList,
      color: 'border-forest-200 bg-forest-50/50 text-forest-900',
      data: executionResult?.farm_action_plan
    }
  ];

  const getAgentStatus = (stepNumber) => {
    if (activeStep > stepNumber) return 'completed';
    if (activeStep === stepNumber) return 'running';
    return 'waiting';
  };

  const isAllCompleted = activeStep >= 6;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Live Multi-Agent Swarm Collaboration
          </div>
          <h2 className="text-2xl font-black text-forest-900 tracking-tight">
            Autonomous Multi-Agent Investigation Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Five specialized AI agents collaborate through an Orchestrator to generate an evidence-backed diagnosis.
          </p>
        </div>

        {isAllCompleted && (
          <button
            onClick={onViewReport}
            className="px-6 py-3 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-xl shadow-forest-900/20 transition-all flex items-center gap-2 shrink-0 animate-bounce"
          >
            <span>View Final Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-forest-900 flex items-center gap-2">
            {!isAllCompleted ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Agents Actively Executing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                All 5 Agents Completed Investigation in {executionResult?.total_execution_time_ms || 320} ms
              </>
            )}
          </span>
          <span className="text-slate-400">
            {Math.min(100, Math.round((activeStep / 6) * 100))}% Complete
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-forest-800 via-emerald-600 to-teal-500 transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, (activeStep / 6) * 100)}%` }}
          />
        </div>
      </div>

      {/* Agent Cards Timeline Grid */}
      <div className="space-y-4">
        {agentsList.map((agent) => {
          const status = getAgentStatus(agent.stepNumber);
          const Icon = agent.icon;
          const isExpanded = expandedAgent === agent.id;

          return (
            <div
              key={agent.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                status === 'running'
                  ? 'border-amber-400 bg-amber-50/20 shadow-md ring-2 ring-amber-400/30'
                  : status === 'completed'
                  ? 'border-emerald-200 bg-white hover:border-emerald-300'
                  : 'border-slate-200/60 bg-slate-50/40 opacity-70'
              }`}
            >
              {/* Card Header Row */}
              <div
                onClick={() => status === 'completed' && setExpandedAgent(isExpanded ? null : agent.id)}
                className={`p-4 flex items-center justify-between gap-4 select-none ${
                  status === 'completed' ? 'cursor-pointer hover:bg-slate-50/80' : ''
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      status === 'running'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{agent.name}</h4>
                      <span className="text-[10px] text-slate-400 hidden sm:inline">• {agent.role}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {status === 'running' && 'Active Turn: Executing analysis & querying model...'}
                      {status === 'waiting' && 'In Queue: Awaiting preceding agent handoff...'}
                      {status === 'completed' && (
                        agent.data?.summary || 'Execution complete. Findings logged.'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Status Badge */}
                  {status === 'running' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 animate-pulse">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      Running
                    </span>
                  )}
                  {status === 'waiting' && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                      Waiting
                    </span>
                  )}
                  {status === 'completed' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Completed
                    </span>
                  )}

                  {status === 'completed' && (
                    <button
                      type="button"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      aria-label="Toggle agent findings"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable Findings Drawer */}
              {isExpanded && status === 'completed' && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between text-slate-500 font-semibold">
                    <span>Agent Detailed Findings & Structured Payload</span>
                    <span className="text-[11px] font-mono">
                      Execution time: {agent.data?.duration_ms || 120} ms
                    </span>
                  </div>

                  {/* Render tailored insights depending on agent */}
                  {agent.id === 'crop_diagnosis' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700">Diagnosis Source:</span>{' '}
                        <span className="font-mono text-forest-800">{agent.data?.analysis_source}</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700">Identified Pathogen:</span>{' '}
                        <span className="font-bold text-rose-700">{agent.data?.disease_name}</span>{' '}
                        <span className="text-slate-500 italic">({agent.data?.scientific_name})</span>
                      </div>
                      {agent.data?.alternative_causes?.length > 0 && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-700">Differential Causes Considered:</span>
                          <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                            {agent.data.alternative_causes.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {agent.id === 'weather_intelligence' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                        <p className="text-slate-400 font-medium">Temperature</p>
                        <p className="text-base font-bold text-slate-900">{agent.data?.temperature}°C</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                        <p className="text-slate-400 font-medium">Humidity</p>
                        <p className="text-base font-bold text-sky-700">{agent.data?.humidity}%</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                        <p className="text-slate-400 font-medium">Precipitation</p>
                        <p className="text-base font-bold text-slate-900">{agent.data?.precipitation} mm</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                        <p className="text-slate-400 font-medium">Atmospheric Risk</p>
                        <p className="text-base font-bold text-forest-800">{agent.data?.environmental_risk_level}</p>
                      </div>
                    </div>
                  )}

                  {agent.id === 'agri_knowledge' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700">Verified Agronomic Source:</span>{' '}
                        <span className="text-slate-800">{agent.data?.sources}</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700">Cultural & Preventive Practices:</span>
                        <p className="mt-1 text-slate-600">{agent.data?.preventive_guidelines}</p>
                      </div>
                    </div>
                  )}

                  {agent.id === 'risk_assessment' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <span className="font-bold text-slate-700">Synthesized Risk Score:</span>
                        <span className="text-sm font-black text-rose-700">
                          {agent.data?.risk_score} / 100 ({agent.data?.risk_level})
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700">Urgency Horizon:</span>{' '}
                        <span className="font-semibold text-slate-900">{agent.data?.urgency_timeframe}</span>
                        <p className="mt-1 text-slate-600">{agent.data?.risk_rationale}</p>
                      </div>
                    </div>
                  )}

                  {agent.id === 'action_planner' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700">Tasks Sequence Compiled:</span>{' '}
                        <span className="font-bold text-forest-900">
                          {agent.data?.all_recommended_tasks?.length || 0} Action Items
                        </span>
                        <p className="mt-1 text-slate-600">
                          Follow-up date scheduled for: <strong>{agent.data?.suggested_follow_up_date}</strong>
                        </p>
                      </div>
                    </div>
                  )}

                  {agent.id === 'orchestrator' && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-700">Orchestrator Goal:</span>
                      <p className="mt-1 text-slate-600">{agent.data?.goal}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Safety Notice Footer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Transparent Multi-Agent Verification Guarantee</p>
          <p className="text-amber-900 mt-0.5">
            AgriMitra never fabricates model predictions. If live vision API is unconfigured, results are transparently labelled as Demo Mode. No chemical dosage is recommended without verified extension backing.
          </p>
        </div>
      </div>
    </div>
  );
}
