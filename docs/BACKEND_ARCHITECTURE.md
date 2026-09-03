# ResumeIQ Backend Architecture

## Technology Stack

### Core Framework
- **FastAPI** (Python 3.11+) - Modern async web framework
- **Pydantic** - Data validation and serialization
- **SQLAlchemy 2.0** - ORM for database operations
- **Alembic** - Database migrations

### Database & Caching
- **PostgreSQL 15+** - Primary relational database
- **pgvector** - Vector storage for embeddings
- **Redis** - Caching, task queues, real-time messaging

### AI/ML Stack
- **OpenAI API** (gpt-4, gpt-3.5-turbo) - LLM calls
- **sentence-transformers** - Local embedding model (all-MiniLM-L6-v2)
- **LangChain** (optional) - LLM orchestration utilities

### Document Processing
- **pdfplumber** - PDF extraction
- **python-docx** - DOCX parsing
- **PyPDF2** - PDF manipulation

### Task Queue & Workers
- **Celery** - Distributed task queue
- **Redis** - Message broker

### Authentication & Security
- **python-jose** - JWT token handling
- **passlib** - Password hashing
- **python-multipart** - Form parsing

### Testing & Quality
- **pytest** - Testing framework
- **pytest-asyncio** - Async test support
- **httpx** - Async HTTP client for testing
- **black** - Code formatting
- **flake8** - Linting

### Deployment & Monitoring
- **Gunicorn** - WSGI server
- **Docker** - Containerization
- **python-dotenv** - Environment configuration

---

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                          # FastAPI app initialization
│   ├── config.py                        # Configuration management
│   │
│   ├── core/
│   │   ├── security.py                  # JWT, password hashing
│   │   ├── dependencies.py              # Dependency injection
│   │   └── exceptions.py                # Custom exceptions
│   │
│   ├── models/                          # Database models (SQLAlchemy)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── resume.py
│   │   ├── job.py
│   │   ├── analysis.py
│   │   ├── resume_version.py
│   │   └── orchestration_log.py
│   │
│   ├── schemas/                         # Pydantic schemas (API)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── resume.py
│   │   ├── job.py
│   │   ├── analysis.py
│   │   └── common.py
│   │
│   ├── api/                             # API routes
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── endpoints/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py
│   │   │   │   ├── resumes.py
│   │   │   │   ├── jobs.py
│   │   │   │   ├── analysis.py
│   │   │   │   └── health.py
│   │   │   └── router.py
│   │   └── ws/                          # WebSocket endpoints
│   │       └── analysis_progress.py
│   │
│   ├── agents/                          # Orchestrator & agents
│   │   ├── __init__.py
│   │   ├── orchestrator.py              # Main orchestrator
│   │   ├── base.py                      # Base agent class
│   │   │
│   │   ├── agents/
│   │   │   ├── __init__.py
│   │   │   ├── resume_parser.py
│   │   │   ├── job_analyzer.py
│   │   │   ├── skill_extraction.py
│   │   │   ├── ats_analyzer.py
│   │   │   ├── match_agent.py
│   │   │   ├── gap_analysis.py
│   │   │   ├── optimization.py
│   │   │   ├── validation.py
│   │   │   └── evaluation.py
│   │   │
│   │   └── utils/
│   │       ├── embeddings.py
│   │       ├── llm_client.py
│   │       └── skill_taxonomy.py
│   │
│   ├── services/                        # Business logic
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   ├── resume_service.py
│   │   ├── job_service.py
│   │   ├── analysis_service.py
│   │   └── orchestration_service.py
│   │
│   ├── tasks/                           # Celery tasks
│   │   ├── __init__.py
│   │   └── analysis_tasks.py
│   │
│   ├── db/
│   │   ├── __init__.py
│   │   ├── base.py                      # SQLAlchemy base
│   │   ├── session.py                   # Database session
│   │   └── init_db.py                   # Database initialization
│   │
│   └── utils/
│       ├── __init__.py
│       ├── logger.py
│       ├── cache.py
│       └── validators.py
│
├── migrations/                          # Alembic migrations
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       └── 001_initial_schema.py
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py                      # Pytest fixtures
│   ├── test_auth.py
│   ├── test_resume.py
│   ├── test_agents/
│   │   ├── test_resume_parser.py
│   │   ├── test_orchestrator.py
│   │   └── test_validation.py
│   └── integration/
│       └── test_end_to_end.py
│
├── requirements.txt
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── wsgi.py                              # WSGI entry point
├── pytest.ini
├── pyproject.toml
└── README.md
```

---

## Core Components

### 1. Database Models

```python
# app/models/user.py
from sqlalchemy import Column, String, DateTime, Boolean
from datetime import datetime
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

```python
# app/models/resume.py
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from app.db.base import Base

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    filename = Column(String)
    file_path = Column(String)  # S3 or local storage
    file_size = Column(Integer)
    
    # Parsed data (stored as JSON)
    parsed_data = Column(JSON)  # name, email, skills, etc.
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

```python
# app/models/analysis.py
from sqlalchemy import Column, String, JSON, DateTime, Integer, ForeignKey
from app.db.base import Base

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(String, primary_key=True, index=True)
    orchestration_id = Column(String, unique=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    resume_id = Column(String, ForeignKey("resumes.id"), index=True)
    job_id = Column(String, ForeignKey("jobs.id"), index=True)
    
    # Results from all agents
    results = Column(JSON)
    
    # Status tracking
    status = Column(String, default="pending")  # pending, processing, completed, failed
    error_message = Column(String, nullable=True)
    
    # Metrics
    execution_time_ms = Column(Integer)
    agents_executed = Column(Integer)
    iterations_completed = Column(Integer)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
```

---

### 2. Pydantic Schemas (API Contracts)

```python
# app/schemas/resume.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ResumeBase(BaseModel):
    pass

class ResumeCreate(ResumeBase):
    file: bytes
    filename: str

class ResumeParsed(BaseModel):
    name: str
    email: str
    phone: Optional[str]
    summary: Optional[str]
    skills: List[str]
    education: List[dict]
    experience: List[dict]
    projects: List[dict]

class ResumeResponse(ResumeBase):
    id: str
    user_id: str
    filename: str
    parsed_data: ResumeParsed
    created_at: datetime
    
    class Config:
        from_attributes = True
```

```python
# app/schemas/analysis.py
from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class AnalysisResultsResponse(BaseModel):
    resume_parsed: Dict[str, Any]
    job_analyzed: Dict[str, Any]
    skills_extracted: Dict[str, Any]
    ats_analysis: Dict[str, Any]
    match_analysis: Dict[str, Any]
    gap_analysis: Dict[str, Any]
    optimization_results: Optional[Dict[str, Any]]
    validation_report: Optional[Dict[str, Any]]
    evaluation: Dict[str, Any]

class AnalysisResponse(BaseModel):
    id: str
    orchestration_id: str
    user_id: str
    status: str
    results: Optional[AnalysisResultsResponse]
    metrics: Dict[str, Any]
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True
```

---

### 3. FastAPI Routes

```python
# app/api/v1/endpoints/analysis.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from app.schemas.analysis import AnalysisResponse
from app.core.dependencies import get_current_user
from app.services.analysis_service import AnalysisService
from app.services.orchestration_service import OrchestrationService

router = APIRouter(prefix="/analysis", tags=["analysis"])

@router.post("/start", response_model=dict)
async def start_analysis(
    resume_id: str,
    job_id: str,
    background_tasks: BackgroundTasks,
    current_user = Depends(get_current_user),
    service: AnalysisService = Depends()
):
    """Start a new analysis"""
    
    # Create analysis record
    analysis = await service.create_analysis(
        user_id=current_user.id,
        resume_id=resume_id,
        job_id=job_id
    )
    
    # Queue orchestration as background task
    background_tasks.add_task(
        run_orchestration,
        analysis.id,
        analysis.orchestration_id,
        current_user.id,
        resume_id,
        job_id
    )
    
    return {
        "analysis_id": analysis.id,
        "orchestration_id": analysis.orchestration_id,
        "status": "queued"
    }

@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(
    analysis_id: str,
    current_user = Depends(get_current_user),
    service: AnalysisService = Depends()
):
    """Get analysis results"""
    analysis = await service.get_analysis(analysis_id)
    
    if analysis.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    return analysis

async def run_orchestration(analysis_id, orchestration_id, user_id, resume_id, job_id):
    """Background task to run orchestration"""
    orchestration_service = OrchestrationService()
    await orchestration_service.run_analysis(
        analysis_id=analysis_id,
        orchestration_id=orchestration_id,
        user_id=user_id,
        resume_id=resume_id,
        job_id=job_id
    )
```

---

### 4. Server-Sent Events for Real-Time Updates

```python
# app/api/ws/analysis_progress.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.orchestration_service import OrchestrationService
import json
import asyncio

router = APIRouter()

@router.get("/analysis/{orchestration_id}/progress")
async def analysis_progress(orchestration_id: str):
    """Stream analysis progress as Server-Sent Events"""
    
    async def event_generator():
        service = OrchestrationService()
        
        while True:
            # Get current orchestration state
            state = await service.get_orchestration_state(orchestration_id)
            
            if state is None:
                yield "event: error\n"
                yield "data: orchestration not found\n\n"
                break
            
            # Stream agent updates
            for agent in state.agents_executed:
                agent_result = state.results.get(agent)
                if agent_result and agent_result.get("event_emitted") is False:
                    yield f"event: agent_complete\n"
                    yield f"data: {json.dumps(agent_result)}\n\n"
                    agent_result["event_emitted"] = True
            
            # Check if completed
            if state.status == "completed":
                yield f"event: orchestration_complete\n"
                yield f"data: {json.dumps(state.to_dict())}\n\n"
                break
            elif state.status == "failed":
                yield f"event: orchestration_error\n"
                yield f"data: {json.dumps({'error': state.error})}\n\n"
                break
            
            # Wait before next check
            await asyncio.sleep(0.5)
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

---

### 5. Base Agent Class

```python
# app/agents/base.py
from abc import ABC, abstractmethod
from typing import Dict, Any
from datetime import datetime
import time

class BaseAgent(ABC):
    def __init__(self, name: str, description: str, timeout_seconds: int = 30):
        self.name = name
        self.description = description
        self.timeout_seconds = timeout_seconds
    
    @abstractmethod
    async def execute(self, data: Dict[str, Any], previous_results: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agent logic"""
        pass
    
    async def run(self, data: Dict[str, Any], previous_results: Dict[str, Any]) -> Dict[str, Any]:
        """Run agent with timing and error handling"""
        start_time = time.time()
        
        try:
            result = await self.execute(data, previous_results)
            execution_time_ms = (time.time() - start_time) * 1000
            
            return {
                "status": "success",
                "data": result,
                "execution_time_ms": execution_time_ms,
                "error": None
            }
        except TimeoutError:
            return {
                "status": "timeout",
                "data": None,
                "execution_time_ms": (time.time() - start_time) * 1000,
                "error": f"Agent {self.name} timed out after {self.timeout_seconds}s"
            }
        except Exception as e:
            return {
                "status": "error",
                "data": None,
                "execution_time_ms": (time.time() - start_time) * 1000,
                "error": str(e)
            }
```

---

### 6. Resume Parser Agent

```python
# app/agents/agents/resume_parser.py
import pdfplumber
from docx import Document
from app.agents.base import BaseAgent
from typing import Dict, Any
import json
import re

class ResumeParserAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Resume Parser",
            description="Extracting resume structure and content",
            timeout_seconds=30
        )
    
    async def execute(self, data: Dict[str, Any], previous_results: Dict[str, Any]) -> Dict[str, Any]:
        file_path = data.get("file_path")
        file_type = file_path.split(".")[-1].lower()
        
        if file_type == "pdf":
            text = self._extract_pdf(file_path)
        elif file_type == "docx":
            text = self._extract_docx(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
        
        # Parse resume sections
        parsed = self._parse_sections(text)
        return parsed
    
    def _extract_pdf(self, file_path: str) -> str:
        with pdfplumber.open(file_path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        return text
    
    def _extract_docx(self, file_path: str) -> str:
        doc = Document(file_path)
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    
    def _parse_sections(self, text: str) -> Dict[str, Any]:
        """Use regex + LLM to parse sections"""
        sections = {
            "name": self._extract_name(text),
            "email": self._extract_email(text),
            "phone": self._extract_phone(text),
            "summary": "",
            "education": [],
            "experience": [],
            "skills": [],
            "projects": [],
            "certifications": []
        }
        return sections
    
    def _extract_email(self, text: str) -> str:
        match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        return match.group(0) if match else ""
    
    def _extract_phone(self, text: str) -> str:
        # Pattern for various phone formats
        patterns = [
            r'\+?\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{0,4}',
            r'\(\d{3}\)\s?\d{3}[-.\s]?\d{4}'
        ]
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(0)
        return ""
    
    def _extract_name(self, text: str) -> str:
        # Usually first line or near email
        lines = text.split("\n")
        for line in lines[:5]:
            if line.strip() and not any(x in line.lower() for x in ["email", "phone", "linkedin"]):
                return line.strip()
        return ""
```

---

### 7. Orchestrator Service

```python
# app/services/orchestration_service.py
from app.agents.orchestrator import Orchestrator
from app.agents.agents.resume_parser import ResumeParserAgent
from app.agents.agents.job_analyzer import JobAnalyzerAgent
# ... import other agents
from app.db.session import SessionLocal
from app.models.analysis import Analysis
import uuid
import json

class OrchestrationService:
    def __init__(self):
        self.db = SessionLocal()
        self.orchestrator = Orchestrator()
    
    async def run_analysis(
        self,
        analysis_id: str,
        orchestration_id: str,
        user_id: str,
        resume_id: str,
        job_id: str
    ):
        """Run complete analysis orchestration"""
        
        # Load resume and job from database
        resume = self.db.query(Resume).filter(Resume.id == resume_id).first()
        job = self.db.query(Job).filter(Job.id == job_id).first()
        
        # Prepare data for orchestrator
        data = {
            "file_path": resume.file_path,
            "parsed_resume": resume.parsed_data,
            "job_description": job.description,
            "user_id": user_id
        }
        
        # Run orchestration
        result = await self.orchestrator.run(data)
        
        # Update analysis record
        analysis = self.db.query(Analysis).filter(Analysis.id == analysis_id).first()
        analysis.results = result["results"]
        analysis.status = "completed"
        analysis.execution_time_ms = result["metrics"]["total_execution_time_ms"]
        analysis.agents_executed = result["metrics"]["agents_executed"]
        analysis.iterations_completed = result["metrics"]["iterations"]
        analysis.completed_at = datetime.utcnow()
        
        self.db.commit()
    
    async def get_orchestration_state(self, orchestration_id: str):
        """Get current orchestration state for SSE"""
        analysis = self.db.query(Analysis).filter(
            Analysis.orchestration_id == orchestration_id
        ).first()
        return analysis
```

---

## Configuration Management

```python
# app/config.py
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/resumeiq"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # LLM
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4"
    
    # Embedding
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    
    # App
    APP_NAME: str = "ResumeIQ"
    DEBUG: bool = False
    
    # Storage
    STORAGE_TYPE: str = "local"  # or "s3"
    STORAGE_PATH: str = "/tmp/resumeiq"
    
    class Config:
        env_file = ".env"

settings = Settings()
```

---

## Environment Variables

```bash
# .env.example

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/resumeiq
REDIS_URL=redis://localhost:6379

# JWT
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# LLM
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# App
APP_NAME=ResumeIQ
DEBUG=False

# Storage
STORAGE_TYPE=local
STORAGE_PATH=/tmp/resumeiq

# Email (for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-password
```

---

## Database Migrations with Alembic

```bash
# Initialize Alembic (already done)
alembic init migrations

# Create migration after model changes
alembic revision --autogenerate -m "Add resume table"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## Authentication & Security

```python
# app/core/security.py
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise JWTError
        return user_id
    except JWTError:
        return None
```

---

## Testing Setup

```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.base import Base
from app.core.dependencies import get_db

SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def test_user_token(client):
    response = client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User"
    })
    user = response.json()
    
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "testpass123"
    })
    token = response.json()["access_token"]
    return token
```

---

## Running the Application

### Local Development

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run migrations
alembic upgrade head

# Start Redis (required)
redis-server

# Start Celery worker (in separate terminal)
celery -A app.tasks worker --loglevel=info

# Start FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```

### Using Docker

```bash
# Build image
docker build -t resumeiq:latest .

# Start with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop
docker-compose down
```

---

## API Endpoints

### Authentication
```
POST   /api/v1/auth/register       - Register new user
POST   /api/v1/auth/login          - Login (get JWT token)
POST   /api/v1/auth/logout         - Logout
GET    /api/v1/auth/me             - Get current user
```

### Resumes
```
POST   /api/v1/resumes              - Upload resume
GET    /api/v1/resumes              - List user's resumes
GET    /api/v1/resumes/{id}         - Get resume details
DELETE /api/v1/resumes/{id}         - Delete resume
```

### Jobs
```
POST   /api/v1/jobs                 - Create job (paste description)
GET    /api/v1/jobs                 - List jobs
GET    /api/v1/jobs/{id}            - Get job details
DELETE /api/v1/jobs/{id}            - Delete job
```

### Analysis
```
POST   /api/v1/analysis/start       - Start new analysis
GET    /api/v1/analysis/{id}        - Get analysis results
GET    /api/v1/analysis              - List analyses
GET    /api/v1/analysis/{id}/progress - SSE stream of progress

POST   /api/v1/analysis/{id}/optimize - Start optimization
```

### Health
```
GET    /health                      - Health check
GET    /metrics                     - Prometheus metrics
```

---

## Deployment Checklist

- [ ] Environment variables configured securely
- [ ] Database migrations applied
- [ ] Database backups configured
- [ ] Redis persistence enabled
- [ ] Celery workers running (multiple instances for production)
- [ ] Gunicorn/Uvicorn with proper worker count
- [ ] HTTPS/TLS configured
- [ ] CORS properly configured for frontend domain
- [ ] Rate limiting enabled
- [ ] Logging and monitoring configured
- [ ] Regular backups scheduled
- [ ] Error tracking (Sentry) configured
- [ ] Database connection pooling optimized

---

## Performance Optimization Tips

1. **Database**: Add indexes on frequently queried fields
2. **Caching**: Cache skill taxonomy, embeddings, and model responses
3. **Async**: Use async/await throughout for I/O operations
4. **Connection Pooling**: Configure optimal pool size for PostgreSQL
5. **Pagination**: Implement pagination for list endpoints
6. **Compression**: Enable gzip compression for responses
7. **CDN**: Serve static files through CDN if applicable

