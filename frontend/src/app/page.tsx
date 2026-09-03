'use client'

import Link from 'next/link'
import { ArrowRight, FileText, Target, Zap, BarChart3, Shield, Brain } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ResumeIQ</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="px-4 py-2 text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link href="/auth/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              🚀 Your AI Career Intelligence Agent
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Analyze. Optimize.
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {' '}Get Job-Ready.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            ResumeIQ analyzes your resume against job descriptions, identifies skill gaps and ATS issues, 
            and intelligently optimizes your resume while preserving your actual experience.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 transition"
            >
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Hero Visual - Animated Dashboard */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-1">82%</div>
                <div className="text-sm text-green-700">Match Score</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">78%</div>
                <div className="text-sm text-blue-700">ATS Compatible</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <div className="text-3xl font-bold text-purple-600 mb-1">3</div>
                <div className="text-sm text-purple-700">Skills Missing</div>
              </div>
            </div>
            <div className="text-gray-500 text-center text-sm">↑ Analysis dashboard with real-time agent progress</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How ResumeIQ Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Multi-agent AI system that analyzes, evaluates, and optimizes your resume intelligently.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: 'Resume Analysis',
                description: 'AI-powered parsing and structure analysis of your resume',
              },
              {
                icon: Target,
                title: 'Job Matching',
                description: 'Semantic matching to identify alignment with target roles',
              },
              {
                icon: BarChart3,
                title: 'ATS Compatibility',
                description: 'Detect ATS issues and improve your application pass-through',
              },
              {
                icon: Zap,
                title: 'Skill Gaps',
                description: 'Identify missing skills with market insights',
              },
              {
                icon: Shield,
                title: 'Smart Optimization',
                description: 'Enhance without fabricating - preserve factual accuracy',
              },
              {
                icon: Brain,
                title: 'Explainable AI',
                description: 'Understand why scores matter - see reasoning behind recommendations',
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-blue-300 transition">
                  <Icon className="w-8 h-8 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Demo Scenario */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Perfect for Your Career</h2>
          <p className="text-xl mb-8 opacity-90">
            Whether you're a student, career changer, or experienced professional, 
            ResumeIQ helps you stand out.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { emoji: '🎓', title: 'Students', desc: 'Build competitive resumes for first roles' },
              { emoji: '🔄', title: 'Career Changers', desc: 'Bridge skills gaps between careers' },
              { emoji: '⭐', title: 'Experienced', desc: 'Optimize for senior positions' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-4xl mb-2">{item.emoji}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to optimize your career?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of candidates getting smarter about job applications.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-lg transition"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>&copy; 2024 ResumeIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
