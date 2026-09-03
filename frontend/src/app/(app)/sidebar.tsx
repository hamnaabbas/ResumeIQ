'use client'

import Link from 'next/link'
import { FileText, Upload, Search, Settings, LogOut, Home, BarChart3, Brain } from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  children: React.ReactNode
}

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Upload Resume', href: '/upload', icon: Upload },
    { label: 'Job Analysis', href: '/analyze', icon: Search },
    { label: 'My Results', href: '/results', icon: BarChart3 },
    { label: 'Optimizer', href: '/optimize', icon: FileText },
    { label: 'Agent Progress', href: '/agent-orchestrator', icon: Brain },
  ]

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white pt-6 overflow-y-auto transition-transform md:translate-x-0 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 mb-8">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8" />
            <span className="text-xl font-bold">ResumeIQ</span>
          </div>
        </div>

        <nav className="space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default function AppLayout({ children }: SidebarProps) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64">{children}</main>
    </div>
  )
}
