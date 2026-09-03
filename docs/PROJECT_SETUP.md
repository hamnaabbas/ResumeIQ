# ResumeIQ Project Setup & Development Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Initialization](#project-initialization)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Development Workflow](#development-workflow)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Python 3.11+** - Backend runtime
- **Node.js 18+** - Frontend runtime
- **PostgreSQL 15+** - Database
- **Redis 7+** - Caching & message broker
- **Git** - Version control
- **Docker & Docker Compose** (optional but recommended)

### Required Accounts & API Keys

- **OpenAI API Key** - For LLM access (gpt-4, gpt-3.5-turbo)
- **GitHub Account** - For code hosting
- **Email Service** (Gmail SMTP or SendGrid) - For notifications

### Recommended Tools

- **VSCode** or **PyCharm** - IDE
- **Postman** or **Insomnia** - API testing
- **DBeaver** - Database management
- **Redis Desktop Manager** - Redis monitoring

---

## Project Initialization

### 1. Clone the Repository

```bash
git clone https://github.com/hamnaabbas/ResumeIQ.git
cd ResumeIQ
```

### 2. Create Main Directories

```bash
mkdir -p backend frontend docs
touch .gitignore README.md
```

### 3. Initialize Git

```bash
git config user.email "your-email@example.com"
git config user.name "Your Name"
git add .
git commit -m "Initial commit"
git push origin main
```

### 4. Create `.gitignore`

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
*.egg-info/
dist/
build/
.pytest_cache/

# Node
node_modules/
.next/
out/
.turbo/
*.tsbuildinfo
.eslintcache

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Database
*.db
*.sqlite

# Uploads
/storage/
/uploads/
```

---

## Backend Setup

### Step 1: Create Python Virtual Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Verify activation (should show venv in prompt)
which python  # Should show path to venv/bin/python
```

### Step 2: Install Dependencies

Create `backend/requirements.txt`:

```
# FastAPI
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0

# Database
sqlalchemy==2.0.23
alembic==1.13.0
psycopg2-binary==2.9.9
pgvector==0.2.1

# Redis & Caching
redis==5.0.1

# Task Queue
celery==5.3.4

# LLM & AI
openai==1.3.8
langchain==0.1.0
sentence-transformers==2.2.2

# Document Processing
pdfplumber==0.10.3
python-docx==0.8.11
PyPDF2==3.0.1

# Authentication & Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6

# Utilities
python-dotenv==1.0.0
requests==2.31.0

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2

# Code Quality
black==23.12.0
flake8==6.1.0
isort==5.13.2

# Monitoring & Logging
python-json-logger==2.0.7
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### Step 3: Create Project Structure

```bash
mkdir -p app/models app/schemas app/api/v1/endpoints app/agents/agents app/services app/tasks app/db app/core app/utils tests
touch app/__init__.py app/main.py app/config.py
touch app/core/__init__.py app/core/security.py app/core/dependencies.py app/core/exceptions.py
touch app/db/__init__.py app/db/base.py app/db/session.py
touch app/models/__init__.py
touch app/schemas/__init__.py
touch app/services/__init__.py
touch app/agents/__init__.py
touch tests/__init__.py tests/conftest.py
```

### Step 4: Create `.env.example` in Backend

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/resumeiq_dev
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10

# Redis
REDIS_URL=redis://localhost:6379/0
REDIS_CACHE_TTL=3600

# JWT
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# LLM
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4
OPENAI_TEMPERATURE=0.2

# Embedding
EMBEDDING_MODEL=all-MiniLM-L6-v2
EMBEDDING_CACHE_SIZE=1000

# App
APP_NAME=ResumeIQ
DEBUG=True
LOG_LEVEL=INFO

# Storage
STORAGE_TYPE=local
STORAGE_PATH=/tmp/resumeiq/uploads

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@resumeiq.com

# Celery
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2

# Cors
CORS_ORIGINS=["http://localhost:3000", "http://localhost:8000"]

# Analysis
MAX_RESUME_FILE_SIZE_MB=10
MAX_OPTIMIZATION_ITERATIONS=3
ANALYSIS_TIMEOUT_SECONDS=300
```

Copy to `.env`:

```bash
cp .env.example .env
# Edit .env with your actual values
```

### Step 5: Database Setup

```bash
# Create alembic directory
alembic init -t async migrations

# Create initial migration
alembic revision --autogenerate -m "Initial schema"

# Apply migrations
alembic upgrade head
```

### Step 6: Create Main FastAPI App

Create `app/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1.router import router as api_router
from app.db.session import engine
from app.db.base import Base

# Create tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered resume analysis and optimization",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "ok", "app": settings.APP_NAME}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
```

---

## Frontend Setup

### Step 1: Create Next.js Project

```bash
cd ../frontend

# Create Next.js project with TypeScript
npx create-next-app@latest . --typescript --tailwind --app

# Or manually init if issues
npm init -y
npm install next react react-dom
```

### Step 2: Install Dependencies

Create `frontend/package.json` (or add to existing):

```json
{
  "name": "resumeiq-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,md}\""
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@tanstack/react-query": "^5.25.0",
    "axios": "^1.6.0",
    "tailwindcss": "^3.3.0",
    "shadcn-ui": "^0.4.0",
    "lucide-react": "^0.295.0",
    "recharts": "^2.10.0",
    "framer-motion": "^10.16.0",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.1.0"
  }
}
```

Install:

```bash
npm install
```

### Step 3: Create Project Structure

```bash
mkdir -p src/app src/components src/hooks src/lib src/types src/styles tests

# Create basic files
touch .env.example .env.local tsconfig.json tailwind.config.ts next.config.js
touch src/app/layout.tsx src/app/page.tsx
```

### Step 4: Create `.env.example`

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=ResumeIQ
```

Copy:

```bash
cp .env.example .env.local
```

### Step 5: Setup Tailwind CSS

Already included in Next.js setup, but verify `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        success: '#16a34a',
        warning: '#d97706',
        error: '#dc2626',
      }
    },
  },
  plugins: [],
}
export default config
```

### Step 6: Create Basic Layout

Create `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ResumeIQ',
  description: 'AI-powered resume analysis and optimization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

---

## Database Setup

### Step 1: Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Run installer

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE resumeiq_dev;
CREATE DATABASE resumeiq_test;

# Create user
CREATE USER resumeiq WITH PASSWORD 'your_password_here';

# Grant privileges
ALTER ROLE resumeiq SET client_encoding TO 'utf8';
ALTER ROLE resumeiq SET default_transaction_isolation TO 'read committed';
ALTER ROLE resumeiq SET default_transaction_deferrable TO on;
ALTER ROLE resumeiq SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE resumeiq_dev TO resumeiq;
GRANT ALL PRIVILEGES ON DATABASE resumeiq_test TO resumeiq;

# Exit
\q
```

### Step 3: Install Redis

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu:**
```bash
sudo apt-get install redis-server
sudo service redis-server start
```

**Windows:**
- Download from: https://github.com/microsoftarchive/redis/releases
- Or use WSL

### Step 4: Verify Services

```bash
# PostgreSQL
psql -U resumeiq -d resumeiq_dev -c "SELECT version();"

# Redis
redis-cli ping  # Should return PONG
```

---

## Running the Application

### Option 1: Manual Setup (Development)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Celery Worker:**
```bash
cd backend
source venv/bin/activate
celery -A app.tasks worker --loglevel=info
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Docker Compose (Recommended)

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: resumeiq_postgres
    environment:
      POSTGRES_DB: resumeiq_dev
      POSTGRES_USER: resumeiq
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U resumeiq"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: resumeiq_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: resumeiq_backend
    command: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://resumeiq:password@postgres:5432/resumeiq_dev
      REDIS_URL: redis://redis:6379/0
      DEBUG: "true"
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    volumes:
      - ./backend:/app
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - resumeiq_network

  celery:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: resumeiq_celery
    command: celery -A app.tasks worker --loglevel=info
    environment:
      DATABASE_URL: postgresql://resumeiq:password@postgres:5432/resumeiq_dev
      REDIS_URL: redis://redis:6379/1
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    volumes:
      - ./backend:/app
    depends_on:
      - postgres
      - redis
    networks:
      - resumeiq_network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: resumeiq_frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8000
    volumes:
      - ./frontend:/app
    depends_on:
      - backend
    networks:
      - resumeiq_network

volumes:
  postgres_data:
  redis_data:

networks:
  resumeiq_network:
    driver: bridge
```

Run:

```bash
# Set environment variables
export OPENAI_API_KEY=sk-your-api-key

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Development Workflow

### 1. Feature Branch Workflow

```bash
# Create feature branch
git checkout -b feature/resume-parser

# Make changes, commit
git add .
git commit -m "Add resume parsing functionality"

# Push branch
git push origin feature/resume-parser

# Create Pull Request on GitHub
```

### 2. Code Style

**Backend:**
```bash
# Format code
black app tests

# Sort imports
isort app tests

# Lint
flake8 app
```

**Frontend:**
```bash
# Format code
npm run format

# Lint
npm run lint
```

### 3. Database Migrations

```bash
# Create migration after model changes
cd backend
alembic revision --autogenerate -m "Add resume_versions table"

# Review migration file in migrations/versions/

# Apply migration
alembic upgrade head

# Rollback if needed
alembic downgrade -1
```

### 4. Testing

**Backend:**
```bash
cd backend
pytest                          # Run all tests
pytest tests/test_auth.py      # Run specific test
pytest -v                       # Verbose output
pytest --cov=app               # With coverage
```

**Frontend:**
```bash
cd frontend
npm test                        # Run tests
npm run build                   # Production build
```

---

## Testing

### Backend Tests

Create `tests/test_auth.py`:

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_register():
    response = client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User"
    })
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_login():
    # First register
    client.post("/api/v1/auth/register", json={
        "email": "test2@example.com",
        "password": "testpass123",
        "full_name": "Test User"
    })
    
    # Then login
    response = client.post("/api/v1/auth/login", json={
        "email": "test2@example.com",
        "password": "testpass123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
```

Run tests:

```bash
pytest tests/ -v
```

---

## Deployment

### Build Docker Image

```bash
# Build
docker build -t resumeiq:latest .

# Test locally
docker run -p 8000:8000 resumeiq:latest

# Push to registry
docker tag resumeiq:latest your-registry/resumeiq:latest
docker push your-registry/resumeiq:latest
```

### Deploy to Production

Recommended platforms:
- **Backend**: Heroku, Railway, DigitalOcean App Platform, AWS ECS
- **Frontend**: Vercel, Netlify, CloudFlare Pages
- **Database**: AWS RDS, DigitalOcean Managed Database, Azure Database
- **Storage**: AWS S3, DigitalOcean Spaces

### Heroku Deployment Example

```bash
# Login to Heroku
heroku login

# Create app
heroku create resumeiq-app

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0

# Add Redis addon
heroku addons:create heroku-redis:premium-0

# Set environment variables
heroku config:set OPENAI_API_KEY=sk-your-key
heroku config:set SECRET_KEY=your-secret-key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## Troubleshooting

### Backend Issues

**"Cannot connect to database"**
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check credentials in .env
DATABASE_URL=postgresql://user:password@localhost:5432/resumeiq_dev
```

**"ModuleNotFoundError"**
```bash
# Ensure venv is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

**"Redis connection refused"**
```bash
# Check Redis is running
redis-cli ping

# Start Redis
redis-server  # macOS/Linux
# or use Docker: docker run -p 6379:6379 redis:7-alpine
```

### Frontend Issues

**"Cannot find module"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**"Port 3000 already in use"**
```bash
# Use different port
npm run dev -- -p 3001
```

### Common Git Issues

**"Permission denied (publickey)"**
```bash
# Add SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Add public key to GitHub Settings > SSH and GPG keys
```

**"Merge conflicts"**
```bash
# Resolve conflicts in your editor, then:
git add .
git commit -m "Resolve merge conflicts"
git push
```

---

## Quick Reference Commands

### Backend
```bash
# Activate venv
source backend/venv/bin/activate

# Run server
python -m uvicorn app.main:app --reload

# Run tests
pytest

# Format code
black app tests
isort app tests

# Create migration
alembic revision --autogenerate -m "message"

# Apply migrations
alembic upgrade head
```

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run format
```

### Docker
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f service_name

# Rebuild image
docker-compose up -d --build
```

### Database
```bash
# Connect to database
psql -U resumeiq -d resumeiq_dev

# Common PostgreSQL commands
\dt          # List tables
\d table_name # Describe table
SELECT * FROM users;  # Query
```

---

## Next Steps

1. ✅ **Complete Backend** - Implement all 9 agents
2. ✅ **Complete Frontend** - Build all pages and components
3. ✅ **Integration Testing** - Test agent orchestration end-to-end
4. ✅ **Research Evaluation** - Run experiments comparing baseline vs agentic
5. ✅ **Deployment** - Deploy to production
6. ✅ **Documentation** - Write user and technical docs
7. ✅ **FYP Demo** - Prepare 5-10 minute demonstration

