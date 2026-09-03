'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Loader, CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react'

type AgentState = 'pending' | 'running' | 'completed' | 'error'

interface AgentStep {
  id: string
  name: string
  description: string
  state: AgentState
  progress: number
  startTime?: Date
  endTime?: Date
  result?: string
  error?: string
}

interface OrchestrationPhase {
  id: string
  title: string
  description: string
  steps: AgentStep[]
  isExpanded: boolean
}

const mockPhases: OrchestrationPhase[] = [
  {
    id: 'intake',
    title: 'Phase 1: Data Intake',
    description: 'Extract and normalize resume & job description',
    isExpanded: true,
    steps: [
      {
        id: 'resume-parse',
        name: 'Resume Parser Agent',
        description: 'Extracting sections, contact info, skills, experience...',
        state: 'completed',
        progress: 100,
        result: 'Extracted 8 sections, 24 skills, 3 experiences',
      },
      {
        id: 'job-parse',
        name: 'Job Description Parser Agent',
        description: 'Analyzing job requirements, keywords, seniority level...',
        state: 'completed',
        progress: 100,
        result: 'Identified 18 required skills, 12 preferred skills',
      },
    ],
  },
  {
    id: 'analysis',
    title: 'Phase 2: Intelligent Analysis',
    description: 'Deep analysis using semantic matching & embeddings',
    isExpanded: true,
    steps: [
      {
        id: 'skill-matching',
        name: 'Skill Matching Agent',
        description: 'Performing semantic matching on 400+ skills...',
        state: 'completed',
        progress: 100,
        result: '82% skill alignment (18 of 22 core skills matched)',
      },
      {
        id: 'ats-analysis',
        name: 'ATS Compatibility Agent',
        description: 'Checking formatting, keywords, structure, readability...',
        state: 'completed',
        progress: 100,
        result: 'ATS Score: 78/100 - Good structure, missing 4 keywords',
      },
      {
        id: 'gap-analysis',
        name: 'Gap Analysis Agent',
        description: 'Identifying skill and experience gaps...',
        state: 'running',
        progress: 65,
        result: 'Found 3 high-priority gaps: Docker, Kubernetes, AWS',
      },
    ],
  },
  {
    id: 'optimization',
    title: 'Phase 3: Resume Optimization',
    description: 'Generate improvements while preserving factual accuracy',
    isExpanded: false,
    steps: [
      {
        id: 'fact-check',
        name: 'Fact Validation Agent',
        description: 'Verifying all claims against original resume...',
        state: 'pending',
        progress: 0,
      },
      {
        id: 'optimization',
        name: 'Resume Optimizer Agent',
        description: 'Rewriting sections to highlight relevant skills...',
        state: 'pending',
        progress: 0,
      },
      {
        id: 'keyword-enhancement',
        name: 'Keyword Enhancement Agent',
        description: 'Adding missing ATS keywords naturally...',
        state: 'pending',
        progress: 0,
      },
    ],
  },
  {
    id: 'evaluation',
    title: 'Phase 4: Evaluation & Feedback',
    description: 'Compare original vs optimized, generate recommendations',
    isExpanded: false,
    steps: [
      {
        id: 'comparison',
        name: 'Comparison Agent',
        description: 'Analyzing changes and improvements...',
        state: 'pending',
        progress: 0,
      },
      {
        id: 'hallucination-check',
        name: 'Anti-Hallucination Validator',
        description: 'Ensuring no unsupported claims were added...',
        state: 'pending',
        progress: 0,
      },
      {
        id: 'recommendations',
        name: 'Recommendation Engine',
        description: 'Generating actionable improvement tips...',
        state: 'pending',
        progress: 0,
      },
    ],
  },
]

function StepIcon({ state }: { state: AgentState }) {
  switch (state) {
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-green-600" />
    case 'running':
      return <Loader className="w-5 h-5 text-blue-600 animate-spin" />
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-600" />
    case 'pending':
    default:
      return <Clock className="w-5 h-5 text-gray-400" />
  }
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-blue-600"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function AgentStepCard({ step, isLast }: { step: AgentStep; isLast: boolean }) {
  return (
    <div className="relative">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-12 w-0.5 h-12 bg-gray-200" />
      )}

      <div className="flex gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 pt-1">
          <StepIcon state={step.state} />
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">{step.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                  step.state === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : step.state === 'running'
                      ? 'bg-blue-100 text-blue-700'
                      : step.state === 'error'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                }`}
              >
                {step.state === 'running' ? (
                  <span className="flex items-center gap-1">
                    <Loader className="w-3 h-3 animate-spin" />
                    Running
                  </span>
                ) : (
                  step.state.charAt(0).toUpperCase() + step.state.slice(1)
                )}
              </span>
            </div>

            {/* Progress bar */}
            {step.state !== 'pending' && (
              <div className="mb-3">
                <ProgressBar progress={step.progress} />
              </div>
            )}

            {/* Result or Error */}
            {step.result && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                <Zap className="w-4 h-4 inline mr-2" />
                {step.result}
              </div>
            )}

            {step.error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                {step.error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PhaseSection({ phase, onToggle }: { phase: OrchestrationPhase; onToggle: () => void }) {
  const completedSteps = phase.steps.filter((s) => s.state === 'completed').length
  const totalSteps = phase.steps.length
  const isPhaseComplete = completedSteps === totalSteps
  const hasRunningStep = phase.steps.some((s) => s.state === 'running')

  return (
    <div className="mb-6">
      {/* Phase Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:border-blue-400 transition text-left flex items-center justify-between group"
      >
        <div className="flex items-center gap-3 flex-1">
          <div>
            {isPhaseComplete ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : hasRunningStep ? (
              <Loader className="w-6 h-6 text-blue-600 animate-spin" />
            ) : (
              <Clock className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">{phase.title}</h3>
            <p className="text-sm text-gray-600">{phase.description}</p>
          </div>
          <div className="text-sm font-semibold text-gray-700">
            {completedSteps}/{totalSteps}
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform ${
            phase.isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Phase Content */}
      {phase.isExpanded && (
        <div className="mt-4 pl-4 border-l-2 border-blue-200">
          {phase.steps.map((step, index) => (
            <AgentStepCard key={step.id} step={step} isLast={index === phase.steps.length - 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AgentProgressPage() {
  const [phases, setPhases] = useState<OrchestrationPhase[]>(mockPhases)
  const [isRunning, setIsRunning] = useState(true)
  const [completionPercentage, setCompletionPercentage] = useState(0)

  // Simulate agent execution
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setPhases((prevPhases) =>
        prevPhases.map((phase) => ({
          ...phase,
          steps: phase.steps.map((step) => {
            // Simulate progression
            if (step.state === 'running' && step.progress < 100) {
              return { ...step, progress: step.progress + Math.random() * 15 }
            }
            if (step.state === 'running' && step.progress >= 100) {
              return { ...step, progress: 100, state: 'completed' as AgentState }
            }
            return step
          }),
        }))
      )
    }, 800)

    return () => clearInterval(interval)
  }, [isRunning])

  // Calculate overall progress
  useEffect(() => {
    const totalSteps = phases.reduce((acc, phase) => acc + phase.steps.length, 0)
    const completedSteps = phases.reduce(
      (acc, phase) =>
        acc + phase.steps.filter((s) => s.state === 'completed').length,
      0
    )
    const runningSteps = phases.reduce(
      (acc, phase) => acc + phase.steps.filter((s) => s.state === 'running').length,
      0
    )
    const runningProgress = phases.reduce(
      (acc, phase) =>
        acc +
        phase.steps.reduce(
          (stepAcc, s) => stepAcc + (s.state === 'running' ? s.progress : 0),
          0
        ),
      0
    )

    const percentage =
      ((completedSteps * 100 + runningProgress) / (totalSteps * 100)) * 100
    setCompletionPercentage(Math.min(100, percentage))
  }, [phases])

  const togglePhase = (phaseId: string) => {
    setPhases((prevPhases) =>
      prevPhases.map((phase) =>
        phase.id === phaseId ? { ...phase, isExpanded: !phase.isExpanded } : phase
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agent Orchestrator</h1>
              <p className="text-gray-600 mt-1">
                Real-time analysis: Software Engineer Role | TechCorp Inc.
              </p>
            </div>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                isRunning
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isRunning ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
            <span className="text-2xl font-bold text-blue-600">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <ProgressBar progress={completionPercentage} />
          <p className="text-sm text-gray-600 mt-4">
            Multi-agent orchestration in progress. Current phase: Gap Analysis. Estimated time
            remaining: ~45 seconds.
          </p>
        </div>
      </div>

      {/* Phases */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {phases.map((phase) => (
          <PhaseSection
            key={phase.id}
            phase={phase}
            onToggle={() => togglePhase(phase.id)}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Legend</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
              <span>Running</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span>Error</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
