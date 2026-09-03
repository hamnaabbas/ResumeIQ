# ResumeIQ Frontend

A modern Next.js frontend for the ResumeIQ AI-powered resume analysis system.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

```bash
npm run build
npm start
```

## Project Structure

- `src/app` - Next.js app router pages and layouts
- `src/components` - Reusable React components
- `src/hooks` - Custom React hooks
- `src/lib` - Utility functions and API client
- `src/types` - TypeScript type definitions
- `src/styles` - Global CSS and Tailwind configuration

## Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Lucide React** - Icon library
