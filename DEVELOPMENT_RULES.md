# ResumeIQ Frontend Development Rules

## Project Overview

**ResumeIQ** is an agentic AI-powered resume analysis, job matching, and resume optimization platform for career development.

The frontend is a Next.js SaaS application that provides users with:
- Resume analysis and parsing
- Job description matching
- Skill gap identification
- Resume optimization recommendations
- Real-time agent progress visualization

---

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack React Query
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Utilities**: clsx, date-fns

---

## Architecture & Structure

### Directory Organization

```
frontend/src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── (auth)/              # Auth route group
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/         # Authenticated app route group
│   │   ├── layout.tsx       # Dashboard layout with sidebar
│   │   ├── dashboard/page.tsx
│   │   ├── resumes/
│   │   │   ├── page.tsx
│   │   │   └── upload/page.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx
│   │   │   └── new/page.tsx
│   │   ├── analysis/
│   │   │   ├── [id]/page.tsx
│   │   │   ├── [id]/skills/page.tsx
│   │   │   ├── [id]/gaps/page.tsx
│   │   │   ├── [id]/ats/page.tsx
│   │   │   └── [id]/recommendations/page.tsx
│   │   ├── optimizer/page.tsx
│   │   ├── career/page.tsx
│   │   └── settings/page.tsx
│   └── api/                 # API route handlers (placeholder)
│       └── (will be added for mock endpoints if needed)
│
├── components/              # Reusable React components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── MobileNav.tsx
│   │
│   ├── dashboard/
│   │   ├── WelcomeSection.tsx
│   │   ├── StatisticsCards.tsx
│   │   ├── LatestAnalysisCard.tsx
│   │   ├── SkillGapSection.tsx
│   │   ├── RecentAnalysesList.tsx
│   │   └── QuickActions.tsx
│   │
│   ├── resume/
│   │   ├── ResumeUploadZone.tsx
│   │   ├── ResumeList.tsx
│   │   └── ResumePreview.tsx
│   │
│   ├── job/
│   │   ├── JobForm.tsx
│   │   ├── JobList.tsx
│   │   └── JobCard.tsx
│   │
│   ├── analysis/
│   │   ├── AnalysisOverview.tsx
│   │   ├── ScoreCard.tsx
│   │   ├── SkillsTab.tsx
│   │   ├── GapsTab.tsx
│   │   ├── ATSTab.tsx
│   │   └── RecommendationsTab.tsx
│   │
│   ├── agent/
│   │   ├── AgentProgress.tsx       # Main agent visualization
│   │   ├── AgentStep.tsx           # Individual step component
│   │   ├── AgentTimeline.tsx       # Timeline visualization
│   │   └── AgentStatusBadge.tsx    # Status indicator
│   │
│   ├── optimizer/
│   │   ├── OptimizationEditor.tsx
│   │   ├── SuggestionsList.tsx
│   │   └── OptimizationPreview.tsx
│   │
│   ├── ui/                  # Basic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── Modal.tsx
│   │
│   └── common/
│       ├── Loading.tsx
│       └── EmptyState.tsx
│
├── types/                   # TypeScript types & interfaces
│   ├── api.ts             # API response types
│   ├── domain.ts          # Business domain types
│   └── agent.ts           # Agent-related types
│
├── lib/                     # Utility functions
│   ├── api.ts             # Axios instance & helpers
│   ├── constants.ts       # App constants
│   └── utils.ts           # General utilities
│
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts
│   ├── useResume.ts
│   ├── useAnalysis.ts
│   ├── useAgent.ts
│   └── useMockData.ts
│
├── mocks/                   # Mock data (frontend development only)
│   ├── resumes.ts
│   ├── analyses.ts
│   ├── jobs.ts
│   └── agents.ts
│
├── stores/                  # Zustand state management
│   ├── authStore.ts       # Auth state
│   ├── resumeStore.ts     # Resume state
│   └── agentStore.ts      # Agent state
│
└── styles/                  # Global styles
    └── globals.css        # Tailwind CSS imports
```

---

## Component Development

### Core Principles

1. **Reusable Components**: Extract UI logic into smaller, composable components
2. **Single Responsibility**: Each component has one clear purpose
3. **TypeScript First**: All components are fully typed
4. **Props Documentation**: Use JSDoc comments for component props
5. **No Duplication**: Never copy-paste UI code
6. **Accessibility**: Follow WCAG guidelines, use semantic HTML, ARIA labels

### Component Guidelines

- Place components in `components/` by domain
- Large features get their own subdirectory
- Keep page.tsx files lean (max 50 lines)
- Move complex logic to custom hooks
- Use composition over conditional rendering

### Example Component Structure

```typescript
'use client'

import { ReactNode } from 'react'
import { clsx } from 'clsx'

/**
 * CardProps - Configuration for the Card component
 */
interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

/**
 * Card - A reusable card component for content containers
 * @param children - Card content
 * @param className - Additional CSS classes
 * @param onClick - Optional click handler
 */
export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
```

---

## Design System

### Color Palette

- **Primary**: #2563eb (Blue - Trust, Intelligence)
- **Primary Light**: #dbeafe
- **Primary Dark**: #1e40af
- **Success**: #16a34a
- **Warning**: #d97706
- **Error**: #dc2626
- **Gray**: Use standard Tailwind grays (50-950)

### Typography

- **Fonts**: System font stack (Segoe UI, Roboto, Helvetica Neue)
- **Headings**: Inter/Segoe UI, Bold, 1.2 line-height
- **Body**: 14-16px, Regular weight, 1.5 line-height
- **Code**: Monospace font

### Spacing

Use Tailwind's spacing scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px

### Responsive Design

- **Mobile First**: Start with mobile, enhance for larger screens
- **Breakpoints**: Use Tailwind defaults (sm, md, lg, xl, 2xl)
- **Sidebar**: Hidden on mobile, toggle with hamburger menu
- **Grid**: 1 column (mobile) → 2 columns (tablet) → 3+ (desktop)

---

## Data Management

### TypeScript Types

**Always define types for API responses:**

```typescript
// types/domain.ts
export interface Resume {
  id: string
  fileName: string
  uploadedAt: string
  lastAnalyzedAt?: string
}

export interface Analysis {
  id: string
  resumeId: string
  jobId?: string
  overallScore: number
  atsScore: number
  matchScore: number
  createdAt: string
}

export interface AgentStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  description: string
  progress?: number
  startedAt?: string
  completedAt?: string
  error?: string
}
```

### API Communication

**DO:**
- Use Axios for HTTP requests
- Create API endpoint helpers in `lib/api.ts`
- Use React Query for data fetching
- Handle errors gracefully
- Show loading states

**DON'T:**
- Don't make raw fetch calls
- Don't hardcode API URLs
- Don't mix API calls with component logic

### Mock Data

**Purpose**: Frontend development before backend is ready

```typescript
// mocks/resumes.ts - Use only for UI development
export const MOCK_RESUMES = [
  {
    id: '1',
    fileName: 'John_Doe_Resume.pdf',
    uploadedAt: '2024-01-15T10:30:00Z',
  },
  // ...
]
```

**Important**: Mock data must be clearly separated from real API data. Use a flag or condition to switch between mock and real data.

---

## Agent Progress UI

### Agent Workflow Steps

These steps represent the AI agent's processing pipeline:

1. **Resume Parser** - Extract text and structure from resume
2. **Job Description Analyzer** - Parse job requirements
3. **Skill Extraction** - Identify skills from both
4. **Matching Agent** - Calculate similarity scores
5. **ATS Analysis** - Check ATS compatibility
6. **Gap Analysis** - Identify missing skills
7. **Recommendation Agent** - Generate suggestions
8. **Resume Optimization** - Prepare optimized version
9. **Fact Verification** - Validate accuracy
10. **Evaluation Agent** - Final quality check

### Step States

Each step has one of these states:

```typescript
type AgentStepStatus = 'pending' | 'running' | 'completed' | 'failed'

interface AgentStep {
  id: string
  name: string
  status: AgentStepStatus
  description: string
  progress?: number        // 0-100, for running state
  duration?: number        // milliseconds, for completed state
  error?: string          // error message, for failed state
}
```

### Visual Representation

- **Pending**: Grayed out icon
- **Running**: Animated spinner or progress indicator
- **Completed**: Green checkmark
- **Failed**: Red error icon

### Design Considerations

The agent UI must:
- Show current step clearly
- Display overall progress percentage
- Work without backend (mock state transitions)
- Be ready for real-time WebSocket/SSE updates later
- Handle failures gracefully
- Remain responsive on all screen sizes

---

## Frontend Rules

### CRITICAL: Do NOT

❌ **DO NOT expose API keys in the frontend**
- All sensitive credentials stay in backend
- Frontend communicates through API endpoints

❌ **DO NOT implement AI/ML logic in frontend**
- Agent orchestration happens in backend
- Frontend only displays status/results

❌ **DO NOT fabricate AI results**
- Never make up analysis scores or recommendations
- Use mock data clearly during development
- Real API data only in production

❌ **DO NOT make direct external API calls**
- All external APIs called from backend
- Frontend calls backend only

❌ **DO NOT create unnecessary dependencies**
- Don't add libraries unless essential
- Prefer Tailwind CSS over UI libraries

### MUST

✅ **DO use TypeScript strictly**
- No implicit `any` types
- Proper error handling
- Full type coverage

✅ **DO create reusable components**
- Extract repeated UI into components
- Use composition over duplication
- Document props with JSDoc

✅ **DO handle loading and error states**
- Always show loading indicators
- Display user-friendly error messages
- Prevent data flickering

✅ **DO preserve existing functionality**
- Before modifying a component, review it
- Don't break working features
- Add tests for changes

✅ **DO follow the folder structure**
- Organize by domain/feature
- Keep similar files together
- Use index.ts for exports

---

## Development Workflow

### Before Writing Code

1. **Inspect existing structure**: Check if component already exists
2. **Review types**: Ensure types are defined in `types/`
3. **Check hooks**: Use custom hooks, don't duplicate logic
4. **Plan layout**: Sketch component hierarchy before coding

### Creating a New Page

1. Create directory in `app/` following the structure
2. Create `page.tsx` with minimal code
3. Extract major sections into components
4. Define types in `types/`
5. Add mock data if needed (clearly marked)

### Creating a New Component

1. Place in appropriate `components/` subdirectory
2. Define props interface with JSDoc comments
3. Use TypeScript strictly
4. Import from `ui/` for basic components
5. Export from component's index file

### Testing the UI

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

---

## Performance & Accessibility

### Performance

- Use `next/image` for images
- Lazy load routes with dynamic imports
- Memoize expensive components with `React.memo`
- Use `useCallback` for stable function references

### Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<section>`)
- Add ARIA labels where necessary
- Ensure color contrast ratios (WCAG AA minimum)
- Keyboard navigation support
- Focus indicators visible

---

## API Contracts (Future Backend Integration)

### Resume Upload

```typescript
POST /api/resumes/upload
Content-Type: multipart/form-data

Response: {
  id: string
  fileName: string
  uploadedAt: string
}
```

### Start Analysis

```typescript
POST /api/analyses/start
{
  resumeId: string
  jobId?: string
}

Response: {
  id: string
  status: 'pending'
}
```

### Agent Progress

```typescript
WebSocket: /ws/agent/{analysisId}
or
GET /api/agent/{analysisId}/status

Response: {
  steps: AgentStep[]
  overallProgress: number
  currentStep: string
}
```

---

## Checklist for New Contributors

- [ ] Followed TypeScript strict mode
- [ ] Created components, not page code
- [ ] Used Tailwind CSS only (no inline styles)
- [ ] Documented components with JSDoc
- [ ] No hardcoded API URLs
- [ ] No console.log in production code
- [ ] No unnecessary dependencies
- [ ] Responsive design tested
- [ ] Accessibility checked
- [ ] Existing functionality preserved

---

## Quick Reference

### Common Imports

```typescript
import { clsx } from 'clsx'
import { FC, ReactNode, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
```

### Running the Project

```bash
npm run dev        # Development
npm run build      # Production build
npm run type-check # TypeScript check
npm run format     # Format code
npm run lint       # Linting
```

---

**Last Updated**: 2024-09-03
**Version**: 1.0
**Status**: Active Development
