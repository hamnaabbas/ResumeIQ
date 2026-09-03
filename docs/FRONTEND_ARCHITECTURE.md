# ResumeIQ Frontend Architecture

## Technology Stack

### Core Framework
- **Next.js 14+** with TypeScript
- **React 18+** for component composition
- **Tailwind CSS** for styling
- **shadcn/ui** for pre-built components

### UI & Visualization
- **Recharts** for charts and data visualization
- **Lucide Icons** for iconography
- **Framer Motion** for animations (optional but recommended)

### Form & State Management
- **React Hook Form** for form handling
- **Zod** for schema validation
- **TanStack Query (React Query)** for server state
- **Zustand** for client state (lightweight, simple)

### Utilities
- **clsx** for conditional classnames
- **date-fns** for date handling
- **axios** or **fetch** for API communication

---

## Project Structure

```
frontend/
├── public/                          # Static assets
│   ├── images/
│   ├── icons/
│   └── favicons/
│
├── src/
│   ├── app/                        # Next.js app router
│   │   ├── (public)/               # Marketing website
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── pricing/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   └── contact/page.tsx
│   │   │
│   │   ├── auth/                   # Authentication
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── dashboard/              # Application area
│   │   │   ├── layout.tsx         # Sidebar + main layout
│   │   │   ├── page.tsx           # Dashboard home
│   │   │   ├── resumes/
│   │   │   │   ├── page.tsx       # My Resumes list
│   │   │   │   ├── upload/page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── preview/page.tsx
│   │   │   │
│   │   │   ├── job-description/
│   │   │   │   └── [id]/page.tsx
│   │   │   │
│   │   │   ├── analysis/
│   │   │   │   ├── page.tsx       # Analysis list
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx   # Main analysis results
│   │   │   │       ├── overview/page.tsx
│   │   │   │       ├── skills/page.tsx
│   │   │   │       ├── ats/page.tsx
│   │   │   │       ├── gaps/page.tsx
│   │   │   │       ├── recommendations/page.tsx
│   │   │   │       ├── optimizer/page.tsx
│   │   │   │       └── versions/page.tsx
│   │   │   │
│   │   │   ├── career-roadmap/page.tsx
│   │   │   └── settings/page.tsx
│   │   │
│   │   └── api/                    # API routes (if needed)
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ForgotPasswordForm.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── PublicLayout.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── ScoreCard.tsx
│   │   │   ├── SkillGapChart.tsx
│   │   │   ├── RecentAnalyses.tsx
│   │   │   └── WelcomeCard.tsx
│   │   │
│   │   ├── resume/
│   │   │   ├── ResumeUpload.tsx
│   │   │   ├── ResumePreview.tsx
│   │   │   ├── ResumeParsed.tsx
│   │   │   └── ResumeList.tsx
│   │   │
│   │   ├── job/
│   │   │   ├── JobDescriptionInput.tsx
│   │   │   ├── JobDescriptionAnalysis.tsx
│   │   │   └── JobList.tsx
│   │   │
│   │   ├── analysis/
│   │   │   ├── AnalysisProgress.tsx        # Agent progress visualization
│   │   │   ├── AgentTimeline.tsx           # Shows agent execution order
│   │   │   ├── ScoreExplanation.tsx        # Why this score?
│   │   │   ├── SkillMatchVisualization.tsx # Matched vs missing skills
│   │   │   ├── ATSAnalysisCard.tsx
│   │   │   ├── GapAnalysisCard.tsx
│   │   │   └── RecommendationCard.tsx
│   │   │
│   │   ├── optimizer/
│   │   │   ├── OptimizationEditor.tsx      # Before/after editor
│   │   │   ├── OptimizationControls.tsx    # Conservative/Balanced/Aggressive
│   │   │   ├── FactProtectionAlert.tsx     # Warn if hallucinating
│   │   │   └── OptimizationResults.tsx
│   │   │
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Notification.tsx
│   │   │   └── Badge.tsx
│   │   │
│   │   └── landing/
│   │       ├── Hero.tsx
│   │       ├── Features.tsx
│   │       ├── HowItWorks.tsx
│   │       └── CallToAction.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useAnalysis.ts
│   │   ├── useResume.ts
│   │   ├── useJob.ts
│   │   ├── useAgentProgress.ts          # Real-time agent updates
│   │   └── useNotification.ts
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts               # Axios instance
│   │   │   ├── auth.ts
│   │   │   ├── analysis.ts
│   │   │   ├── resume.ts
│   │   │   └── job.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.ts
│   │   │   ├── resume.ts
│   │   │   └── analysis.ts
│   │   │
│   │   └── store/
│   │       ├── authStore.ts
│   │       ├── analysisStore.ts
│   │       └── notificationStore.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.ts
│   │   ├── analysis.ts
│   │   ├── resume.ts
│   │   └── agent.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   └── middleware/
│       └── auth.ts                   # Middleware for protected routes
│
├── tests/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── __mocks__/
│
├── .env.example
├── .env.local (git ignored)
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── package.json
└── README.md
```

---

## Core Pages & Routes

### Public Routes (No Authentication Required)

```
/                           # Landing page
/pricing                    # Pricing page
/about                      # About page
/contact                    # Contact page
/auth/login                 # Login page
/auth/register              # Registration page
/auth/forgot-password       # Forgot password
```

### Protected Routes (Require Authentication)

```
/dashboard                  # Main dashboard (overview)
/dashboard/resumes          # My Resumes
/dashboard/resumes/upload   # Upload new resume
/dashboard/resumes/[id]/preview  # Resume preview & edit

/dashboard/job-description/[id]   # Job analysis

/dashboard/analysis         # Analysis list
/dashboard/analysis/[id]    # Main analysis results
/dashboard/analysis/[id]/overview        # Overall scores
/dashboard/analysis/[id]/skills          # Skill matching
/dashboard/analysis/[id]/ats             # ATS analysis
/dashboard/analysis/[id]/gaps            # Skill gaps
/dashboard/analysis/[id]/recommendations # Recommendations
/dashboard/analysis/[id]/optimizer       # Resume optimizer
/dashboard/analysis/[id]/versions        # Resume versions

/dashboard/career-roadmap   # Learning pathways
/dashboard/settings         # Settings
```

---

## Key Components

### 1. Landing Page (`/`)

```tsx
// Hero section with:
// - Logo + Tagline: "Your AI Career Intelligence Agent"
// - Main headline: "Analyze. Optimize. Get Job-Ready."
// - Subheading explaining the value
// - CTA buttons: "Start Free" + "Learn More"
// - Animated dashboard mockup showing analysis in progress

export function Hero() {
  return (
    <section className="hero">
      {/* Logo + tagline */}
      {/* Main headline */}
      {/* Animated visual */}
      {/* CTAs */}
    </section>
  )
}
```

### 2. Features Section

```tsx
// Cards showing:
// - Resume Analysis
// - ATS Compatibility
// - Job Matching
// - Skill Gap Detection
// - Intelligent Optimization
// - Explainable AI

export function Features() {
  const features = [
    {
      icon: "file-text",
      title: "Resume Analysis",
      description: "AI-powered parsing and structure analysis"
    },
    // ... more features
  ]
  
  return (
    <section className="features">
      {features.map(feature => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </section>
  )
}
```

### 3. Dashboard Layout

```tsx
// Sidebar + Main content area
// Sidebar includes:
// - Logo
// - Navigation links (Dashboard, Resumes, Analysis, etc.)
// - User profile + logout

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Navbar />
        {children}
      </main>
    </div>
  )
}
```

### 4. Dashboard Home

```tsx
export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <WelcomeCard userName="Hamna" />
      
      {/* Latest analysis scores */}
      <div className="grid grid-cols-3 gap-4">
        <ScoreCard
          title="Latest Match Score"
          score={82}
          icon="target"
        />
        <ScoreCard
          title="ATS Compatibility"
          score={78}
          icon="shield"
        />
        <ScoreCard
          title="Skill Alignment"
          score={87}
          icon="star"
        />
      </div>
      
      {/* Skill gaps chart */}
      <SkillGapChart />
      
      {/* Recent analyses */}
      <RecentAnalyses />
    </div>
  )
}
```

### 5. Agent Progress Visualization (CRITICAL)

This is what makes your app look **agentic**:

```tsx
export function AnalysisProgress({ orchestrationId }: { orchestrationId: string }) {
  const { agents, currentAgent, overallProgress } = useAgentProgress(orchestrationId)
  
  return (
    <div className="space-y-4">
      {/* Overall progress bar */}
      <div className="bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
      
      {/* Agent timeline */}
      <div className="space-y-3">
        {agents.map((agent, index) => (
          <AgentTimeline
            key={agent.id}
            agent={agent}
            isActive={agent.id === currentAgent?.id}
            isCompleted={agent.status === 'completed'}
            index={index}
          />
        ))}
      </div>
      
      {/* Current agent details */}
      {currentAgent && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <h3 className="font-semibold text-blue-900">{currentAgent.name}</h3>
          <p className="text-sm text-blue-700 mt-1">{currentAgent.description}</p>
        </div>
      )}
    </div>
  )
}
```

```tsx
export function AgentTimeline({
  agent,
  isActive,
  isCompleted,
  index
}: {
  agent: Agent
  isActive: boolean
  isCompleted: boolean
  index: number
}) {
  return (
    <div className="flex gap-3">
      {/* Step number with status indicator */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
        isCompleted && "bg-green-100 text-green-700",
        isActive && "bg-blue-100 text-blue-700 ring-2 ring-blue-500",
        !isActive && !isCompleted && "bg-gray-200 text-gray-600"
      )}>
        {isCompleted ? <Check size={16} /> : index + 1}
      </div>
      
      {/* Agent info */}
      <div className="flex-1">
        <p className="font-medium">{agent.name}</p>
        <p className="text-sm text-gray-600">{agent.description}</p>
        
        {/* Status */}
        {isActive && <p className="text-xs text-blue-600 mt-1">In progress...</p>}
        {isCompleted && (
          <p className="text-xs text-green-600 mt-1">
            Completed in {agent.executionTimeMs}ms
          </p>
        )}
      </div>
      
      {/* Loading indicator if active */}
      {isActive && <LoadingSpinner size="sm" />}
    </div>
  )
}
```

### 6. Resume Optimizer (Side-by-Side)

```tsx
export function OptimizationEditor({
  originalResume,
  optimizedResume,
  changes
}: {
  originalResume: string
  optimizedResume: string
  changes: Change[]
}) {
  const [selectedOptimizationLevel, setLevel] = useState("balanced")
  
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left: Original */}
      <div>
        <h3 className="font-semibold mb-4">Original Resume</h3>
        <div className="bg-gray-50 p-4 rounded border">
          {originalResume}
        </div>
      </div>
      
      {/* Right: Optimized */}
      <div>
        <h3 className="font-semibold mb-4">Optimized Resume</h3>
        <div className="bg-green-50 p-4 rounded border">
          {/* Highlight changes */}
          <ResumeDiff original={originalResume} updated={optimizedResume} />
        </div>
      </div>
      
      {/* Changes list with fact validation */}
      <div className="col-span-2 space-y-3">
        <h4 className="font-semibold">Changes Made:</h4>
        {changes.map(change => (
          <ChangeItem key={change.id} change={change} />
        ))}
      </div>
      
      {/* Optimization controls */}
      <OptimizationControls
        selected={selectedOptimizationLevel}
        onChange={setLevel}
      />
    </div>
  )
}
```

### 7. Fact Protection Alert

```tsx
export function FactProtectionAlert({ warning }: { warning: FactWarning }) {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
      <div className="flex gap-3">
        <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-semibold text-amber-900">Fact Check</h4>
          <p className="text-sm text-amber-800 mt-1">{warning.message}</p>
          <p className="text-xs text-amber-700 mt-2">
            <strong>Original:</strong> {warning.original}
          </p>
          <div className="mt-2 flex gap-2">
            <button className="px-3 py-1 bg-amber-600 text-white rounded text-sm">
              Approve Change
            </button>
            <button className="px-3 py-1 bg-white border border-amber-300 rounded text-sm">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## State Management with Zustand

### Auth Store

```typescript
// lib/store/authStore.ts
import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  
  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      set({ user: response.data.user, isAuthenticated: true })
    } finally {
      set({ isLoading: false })
    }
  },
  
  register: async (email, password, name) => {
    set({ isLoading: true })
    try {
      const response = await apiClient.post('/auth/register', { email, password, name })
      set({ user: response.data.user, isAuthenticated: true })
    } finally {
      set({ isLoading: false })
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false })
  }
}))
```

### Analysis Store

```typescript
// lib/store/analysisStore.ts
interface AnalysisStore {
  analyses: Analysis[]
  currentAnalysis: Analysis | null
  selectedResume: Resume | null
  selectedJob: Job | null
  
  setCurrentAnalysis: (analysis: Analysis) => void
  setSelectedResume: (resume: Resume) => void
  setSelectedJob: (job: Job) => void
  addAnalysis: (analysis: Analysis) => void
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  analyses: [],
  currentAnalysis: null,
  selectedResume: null,
  selectedJob: null,
  
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  setSelectedResume: (resume) => set({ selectedResume: resume }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  addAnalysis: (analysis) => set((state) => ({
    analyses: [analysis, ...state.analyses]
  }))
}))
```

---

## Real-Time Agent Progress with Server-Sent Events

```typescript
// hooks/useAgentProgress.ts
export function useAgentProgress(orchestrationId: string) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null)
  const [overallProgress, setOverallProgress] = useState(0)
  
  useEffect(() => {
    const eventSource = new EventSource(
      `/api/analysis/${orchestrationId}/progress`
    )
    
    eventSource.addEventListener('agent-start', (event) => {
      const agent = JSON.parse(event.data)
      setCurrentAgent(agent)
      setAgents(prev => [...prev, agent])
    })
    
    eventSource.addEventListener('agent-complete', (event) => {
      const { agentId, executionTimeMs } = JSON.parse(event.data)
      setAgents(prev =>
        prev.map(agent =>
          agent.id === agentId
            ? { ...agent, status: 'completed', executionTimeMs }
            : agent
        )
      )
      setOverallProgress(prev => prev + (100 / 9)) // 9 agents total
    })
    
    eventSource.addEventListener('error', () => {
      eventSource.close()
    })
    
    return () => eventSource.close()
  }, [orchestrationId])
  
  return { agents, currentAgent, overallProgress }
}
```

---

## API Communication Layer

```typescript
// lib/api/client.ts
import axios from 'axios'
import { useAuthStore } from '@/lib/store/authStore'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)
```

```typescript
// lib/api/analysis.ts
export const analysisAPI = {
  async startAnalysis(resumeId: string, jobId: string) {
    const response = await apiClient.post('/analysis', {
      resume_id: resumeId,
      job_id: jobId
    })
    return response.data
  },
  
  async getAnalysis(analysisId: string) {
    const response = await apiClient.get(`/analysis/${analysisId}`)
    return response.data
  },
  
  async optimizeResume(analysisId: string, level: 'conservative' | 'balanced' | 'aggressive') {
    const response = await apiClient.post(
      `/analysis/${analysisId}/optimize`,
      { optimization_level: level }
    )
    return response.data
  }
}
```

---

## Type Definitions

```typescript
// types/analysis.ts
export interface Agent {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  executionTimeMs?: number
  error?: string
}

export interface Analysis {
  id: string
  resumeId: string
  jobId: string
  createdAt: string
  status: 'processing' | 'completed' | 'failed'
  
  results: {
    resumeParsed: ParsedResume
    jobAnalyzed: AnalyzedJob
    skillsExtracted: SkillExtraction
    atsAnalysis: ATSAnalysis
    matchAnalysis: MatchAnalysis
    gapAnalysis: GapAnalysis
    optimizationResults?: OptimizationResults
    evaluationReport: EvaluationReport
  }
  
  metrics: {
    executionTimeMs: number
    agentsExecuted: number
    iterations: number
    improvements: {
      ats: number
      match: number
    }
  }
}

export interface ATSAnalysis {
  score: number
  scoreBreakdown: {
    formatting: number
    structure: number
    keywords: number
    contactInfo: number
    sections: number
    readability: number
  }
  issues: Array<{
    type: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    detail: string
  }>
  recommendations: string[]
}

export interface MatchAnalysis {
  overallMatch: number
  matchBreakdown: {
    skills: number
    experience: number
    education: number
    projects: number
  }
  matchedSkills: string[]
  missingSkills: string[]
  strengths: string[]
  weaknesses: string[]
}

export interface GapAnalysis {
  criticalGaps: Gap[]
  niceToHaveGaps: Gap[]
  gapSummary: string
}

export interface Gap {
  skill: string
  importance: 'critical' | 'high' | 'medium' | 'low'
  reason: string
  learningEffort: 'low' | 'medium' | 'high'
  learningTimeWeeks: number
}

export interface OptimizationResults {
  optimizedResume: string
  optimizedSections: Record<string, SectionChange>
  iterationNumber: number
  improvement: number
  nextIterationNeeded: boolean
}

export interface SectionChange {
  before: string
  after: string
  changes: string[]
  factPreserved: boolean
}

export interface EvaluationReport {
  finalScores: {
    atsOriginal: number
    atsOptimized: number
    matchOriginal: number
    matchOptimized: number
  }
  improvements: {
    atsImprovement: number
    matchImprovement: number
  }
  summary: string
  topImprovements: string[]
  recommendations: string[]
}
```

---

## Design System

### Color Palette

```css
/* Primary - Professional Blue */
--color-primary: #2563eb        /* Blue-600 */
--color-primary-light: #dbeafe  /* Blue-100 */
--color-primary-dark: #1e40af   /* Blue-700 */

/* Success - Green */
--color-success: #16a34a        /* Green-600 */
--color-success-light: #dcfce7  /* Green-100 */

/* Warning - Amber */
--color-warning: #d97706        /* Amber-600 */
--color-warning-light: #fef3c7  /* Amber-100 */

/* Error - Red */
--color-error: #dc2626          /* Red-600 */
--color-error-light: #fee2e2    /* Red-100 */

/* Neutral */
--color-neutral-50: #f9fafb
--color-neutral-100: #f3f4f6
--color-neutral-600: #4b5563
--color-neutral-900: #111827
```

### Typography

```css
/* Font family */
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

/* Sizes */
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */

/* Weights */
--font-normal: 400
--font-semibold: 600
--font-bold: 700
```

### Spacing

Use Tailwind's default spacing:
- `sm`: 0.5rem (8px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `2xl`: 3rem (48px)

---

## FYP Demo Flow

Perfect 5-10 minute demonstration:

```
1. Open ResumeIQ
   └─ Show landing page, professional design

2. Login (pre-created account)
   └─ Show dashboard with previous analyses

3. Upload Resume
   └─ Show drag-and-drop, parsing, preview

4. Add Job Description
   └─ Show job analysis results

5. Click "Analyze Resume"
   └─ Show AGENT PROGRESS SCREEN
   └─ Resume Parser Agent
   └─ Job Analyzer Agent
   └─ Skill Extraction Agent
   └─ ATS Analyzer Agent
   └─ Match Agent
   └─ Gap Analysis Agent
   [agents complete one by one with animations]

6. Show Results Dashboard
   └─ Overall match score: 82%
   └─ ATS score: 78%
   └─ Explanation of why scores

7. Show Skill Matching
   └─ Matched skills
   └─ Missing skills
   └─ Chart visualization

8. Show ATS Issues
   └─ What's wrong with current resume
   └─ Specific recommendations

9. Click "Optimize Resume"
   └─ Show Optimization Controls
   └─ Select "Balanced" optimization
   └─ Click "Start Optimization"

10. Show Optimization Agent Running
    └─ Single agent, showing real-time changes

11. Show Before/After
    └─ Left: original resume
    └─ Right: optimized resume
    └─ Highlight changes in green
    └─ Show fact protection alerts

12. Click "Re-analyze"
    └─ Show agents running again (faster)
    └─ New scores: 89% match, 85% ATS
    └─ "+7 improvement" badge

13. Show Download
    └─ Download optimized resume as PDF
    └─ Download full analysis report

14. Closing:
    "That's ResumeIQ - agentic AI for your career."
```

---

## Loading & Error States

### Skeleton Loading
```tsx
<div className="space-y-3">
  <Skeleton className="h-6 w-2/3" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-5/6" />
</div>
```

### Error State
```tsx
<div className="bg-red-50 border-l-4 border-red-500 p-4">
  <h3 className="font-semibold text-red-900">Error</h3>
  <p className="text-sm text-red-700 mt-1">Failed to load analysis.</p>
  <button className="mt-3 text-sm text-red-600 underline">Try again</button>
</div>
```

---

## Mobile Responsiveness

- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Sidebar → hamburger menu on mobile
- Two-column layouts → single column
- Charts → scrollable on smaller screens
- Ensure touch-friendly buttons (min 44px)

---

## Build Order (Week-by-Week)

**Week 1**: Authentication & Layout
- Login/Register pages
- Sidebar & navigation
- Protected route middleware

**Week 2**: Dashboard
- Dashboard homepage
- Welcome card
- Score cards

**Week 3**: Resume Management
- Resume upload
- Resume preview
- Resume list

**Week 4**: Job Management
- Job description input
- Job analysis view
- Job list

**Week 5**: Analysis Dashboard
- Core results page
- Skill matching view
- ATS analysis

**Week 6**: Agent Visualization
- Agent progress screen
- Agent timeline
- Real-time updates

**Week 7**: Optimizer
- Before/after editor
- Optimization controls
- Fact protection alerts

**Week 8**: Polish & Extra Features
- Landing page
- Settings
- Version history

---

## Key Takeaway

The most important principle for your FYP demo:

> **Make the AI agents visible to the user.**

Instead of:
```
Analyzing... ⏳
```

Show:
```
📄 Resume Parser Agent ✓ 2.1s
📋 Job Analyzer Agent ✓ 1.8s
🎯 Skill Extractor Agent ▶ 0.9s...
```

This single difference makes ResumeIQ look like a legitimate agentic AI system rather than a standard resume website with an LLM attached.

