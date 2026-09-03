'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2, Zap, Brain } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface AnalysisResult {
  overallMatch: number
  skillAlignment: number
  atsScore: number
  experienceAlignment: number
  gapCount: number
}

const mockResult: AnalysisResult = {
  overallMatch: 82,
  skillAlignment: 82,
  atsScore: 78,
  experienceAlignment: 88,
  gapCount: 3,
}

const skillData = [
  { name: 'Matched', value: 18, color: '#10b981' },
  { name: 'Missing', value: 4, color: '#f59e0b' },
]

const matchTrendData = [
  { stage: 'Initial Parse', score: 45 },
  { stage: 'Skill Match', score: 65 },
  { stage: 'ATS Check', score: 72 },
  { stage: 'Gap Analysis', score: 82 },
  { stage: 'Final', score: 85 },
]

const scoreComponents = [
  { name: 'Skills', score: 82 },
  { name: 'Experience', score: 88 },
  { name: 'ATS', score: 78 },
  { name: 'Education', score: 95 },
]

function ScoreCard({
  title,
  score,
  max = 100,
  color,
  subtitle,
}: {
  title: string
  score: number
  max?: number
  color: string
  subtitle?: string
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 transition">
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <div className="flex items-baseline justify-between mb-2">
        <span className={`text-4xl font-bold ${color}`}>{score}</span>
        <span className="text-gray-500">/{max}</span>
      </div>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color.replace('text', 'bg')}`}
          style={{ width: `${(score / max) * 100}%` }}
        />
      </div>
    </div>
  )
}

export default function AnalysisResultsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'gaps' | 'recommendations'>('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
              <p className="text-gray-600 mt-2">
                Software Engineer | TechCorp Inc. | Completed in 2m 34s
              </p>
            </div>
            <Link
              href="/optimize"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Optimize Resume
            </Link>
          </div>
        </div>
      </div>

      {/* Main Score */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white p-12 mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-2">Resume-Job Match</p>
              <div className="text-6xl font-bold mb-2">{mockResult.overallMatch}%</div>
              <p className="text-blue-100">Strong alignment with target role</p>
            </div>
            <div className="text-right">
              <TrendingUp className="w-16 h-16 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {[
            { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
            { id: 'skills' as const, label: 'Skills Analysis', icon: Brain },
            { id: 'gaps' as const, label: 'Skill Gaps', icon: AlertCircle },
            { id: 'recommendations' as const, label: 'Recommendations', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-semibold flex items-center gap-2 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Score Cards Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              <ScoreCard
                title="Overall Match"
                score={mockResult.overallMatch}
                color="text-green-600"
                subtitle="Excellent fit for this role"
              />
              <ScoreCard
                title="Skill Alignment"
                score={mockResult.skillAlignment}
                color="text-blue-600"
                subtitle="18 of 22 skills matched"
              />
              <ScoreCard
                title="ATS Compatibility"
                score={mockResult.atsScore}
                color="text-amber-600"
                subtitle="Some keyword gaps"
              />
              <ScoreCard
                title="Experience"
                score={mockResult.experienceAlignment}
                color="text-purple-600"
                subtitle="Strong background match"
              />
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Trend Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Progression</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={matchTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ fill: '#2563eb', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Score Components */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreComponents}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="score" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Summary</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={skillData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {skillData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {skillData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.name}
                      </span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Matched Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Python',
                      'React',
                      'Node.js',
                      'PostgreSQL',
                      'REST APIs',
                      'Git',
                      'AWS',
                      'Docker',
                      'JavaScript',
                      'TypeScript',
                      'Testing',
                      'CI/CD',
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Kubernetes', 'Terraform', 'GraphQL', 'Rust'].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium"
                      >
                        ✗ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gaps Tab */}
        {activeTab === 'gaps' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Identified Skill Gaps</h3>
            <div className="space-y-4">
              {[
                {
                  skill: 'Kubernetes',
                  priority: 'High',
                  relevance: '87%',
                  reason: 'Required for 87% of similar roles',
                  effort: '2-3 weeks',
                },
                {
                  skill: 'System Design',
                  priority: 'High',
                  relevance: '76%',
                  reason: 'Essential for senior engineer interviews',
                  effort: '3-4 weeks',
                },
                {
                  skill: 'AWS Advanced',
                  priority: 'Medium',
                  relevance: '64%',
                  reason: 'Preferred skill for this company',
                  effort: '2-3 weeks',
                },
              ].map((gap, idx) => (
                <div key={idx} className="border-l-4 border-amber-400 pl-4 py-3">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{gap.skill}</h4>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold">
                      {gap.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{gap.reason}</p>
                  <div className="flex gap-4 text-xs text-gray-600">
                    <span>Market Relevance: <strong>{gap.relevance}</strong></span>
                    <span>Learning Effort: <strong>{gap.effort}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Improvement Recommendations</h3>
            <div className="space-y-4">
              {[
                {
                  title: 'Enhance Resume Keywords',
                  description: 'Add missing ATS keywords: "microservices", "containerization", "cloud architecture"',
                  impact: '+4 ATS compatibility points',
                  effort: 'Quick',
                },
                {
                  title: 'Highlight Relevant Projects',
                  description: 'Reorder projects to showcase your backend system design experience first',
                  impact: '+6 relevance score',
                  effort: 'Quick',
                },
                {
                  title: 'Quantify Achievements',
                  description: 'Add metrics to your infrastructure project: "Reduced deployment time by 40%"',
                  impact: '+8 impact score',
                  effort: 'Medium',
                },
                {
                  title: 'Learn Kubernetes',
                  description: 'Start with "Kubernetes for Developers" course - high market demand',
                  impact: 'Unlock 15+ more jobs',
                  effort: '3-4 weeks',
                },
              ].map((rec, idx) => (
                <div key={idx} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                    <span className="px-2 py-1 bg-blue-200 text-blue-700 rounded text-xs font-semibold">
                      {rec.effort}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                  <p className="text-sm text-green-700 font-medium">💡 Impact: {rec.impact}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
