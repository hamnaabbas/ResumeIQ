# Agent Orchestrator Architecture for ResumeIQ

## Overview

The Agent Orchestrator is the **decision-making core** of ResumeIQ. Instead of a single LLM call, the orchestrator:

1. **Analyzes** what needs to happen
2. **Selects** which specialized agents to invoke
3. **Coordinates** agent outputs
4. **Validates** results for factual consistency
5. **Iterates** until optimal results are achieved

This makes ResumeIQ truly "agentic" and creates the research differentiation for your FYP.

---

## Core Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    API Request                               │
│         (Resume, Job Description, User ID)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   Orchestrator         │
        │   (Decision Engine)    │
        └────────┬───────────────┘
                 │
        ┌────────┴──────────┬──────────┬──────────┬─────────┐
        │                   │          │          │         │
        ▼                   ▼          ▼          ▼         ▼
    ┌──────────┐      ┌───────────┐ ┌────────┐ ┌────────┐ ┌──────┐
    │ Resume   │      │   Job     │ │ Skill  │ │  ATS   │ │Match │
    │ Parser   │      │ Analyzer  │ │Extract │ │Analyzer│ │Agent │
    │ Agent    │      │  Agent    │ │ Agent  │ │ Agent  │ │      │
    └─────┬────┘      └─────┬─────┘ └────┬───┘ └────┬───┘ └───┬──┘
          │                 │            │          │         │
          └─────────────────┼────────────┼──────────┼─────────┘
                            │            │          │
                    ┌───────▼────────────▼──────────▼──────┐
                    │   Gap Analysis Agent                 │
                    │   (Identifies differences)           │
                    └───────────┬──────────────────────────┘
                                │
                        ┌───────▼────────┐
                        │ Optimization   │
                        │   Agent        │
                        │ (Iterative)    │
                        └───────┬────────┘
                                │
                    ┌───────────▼──────────┐
                    │ Validation Agent     │
                    │ (Fact-checking)      │
                    └───────────┬──────────┘
                                │
                        ┌───────▼────────┐
                        │ Evaluation      │
                        │ Agent           │
                        │ (Scores Report) │
                        └───────┬────────┘
                                │
                    ┌───────────▼──────────────┐
                    │  Final Response          │
                    │  (Report, scores, etc.)  │
                    └──────────────────────────┘
```

---

## 9 Specialized Agents

### 1. **Resume Parser Agent**
**Purpose**: Extract structured information from resume

**Inputs**:
- Resume file (PDF/DOCX)
- Resume text

**Outputs**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "summary": "...",
  "education": [...],
  "experience": [...],
  "skills": [...],
  "projects": [...],
  "certifications": [...]
}
```

**Implementation**: Hybrid (Traditional + AI)
- Use PDF/DOCX extraction libraries (pdfplumber, python-docx)
- Apply regex for section detection
- Use LLM for ambiguous sections only

**Dependencies**: None (root agent)

---

### 2. **Job Analyzer Agent**
**Purpose**: Extract and normalize job description

**Inputs**:
- Job description text
- Job metadata (title, company, etc.)

**Outputs**:
```json
{
  "title": "Senior Backend Engineer",
  "company": "Tech Company",
  "required_skills": [...],
  "preferred_skills": [...],
  "experience_years": 5,
  "education_required": "Bachelor's in CS",
  "responsibilities": [...],
  "salary_range": {...}
}
```

**Implementation**: LLM + Structured Output
- Use function calling for consistent extraction
- Apply skill taxonomy normalization

**Dependencies**: None (root agent)

---

### 3. **Skill Extraction Agent**
**Purpose**: Normalize skills and create semantic embeddings

**Inputs**:
- Resume skills list
- Job skills list
- Skill taxonomy database

**Outputs**:
```json
{
  "resume_skills": [
    {
      "name": "Python",
      "category": "programming_language",
      "normalized": "python",
      "proficiency": "expert",
      "embedding": [0.12, 0.45, ...]
    }
  ],
  "job_skills": [
    {
      "name": "Python",
      "category": "programming_language",
      "normalized": "python",
      "required": true,
      "priority": "high",
      "embedding": [0.12, 0.45, ...]
    }
  ],
  "skill_taxonomy_used": "v2.1"
}
```

**Implementation**: Taxonomy-based + Semantic Similarity
- Use predefined skill taxonomy mapping
- Generate embeddings for semantic matching
- Handle variations (e.g., "JS" → "JavaScript", "ML" → "Machine Learning")
- Use local embeddings model for cost efficiency

**Dependencies**:
- Resume Parser Agent
- Job Analyzer Agent

---

### 4. **ATS Analyzer Agent**
**Purpose**: Evaluate resume ATS compatibility

**Inputs**:
- Parsed resume structure
- Formatted resume text
- ATS compatibility guidelines

**Outputs**:
```json
{
  "ats_score": 78,
  "score_breakdown": {
    "formatting": 18,
    "structure": 16,
    "keywords": 14,
    "contact_info": 10,
    "sections": 12,
    "readability": 8
  },
  "issues": [
    {
      "type": "missing_keyword",
      "severity": "high",
      "detail": "AWS not mentioned",
      "section": "experience"
    }
  ],
  "recommendations": [
    "Add AWS to skills section",
    "Use standard section headers"
  ]
}
```

**Implementation**: Rule-based + AI
- Check formatting rules deterministically (tables, images, columns)
- Use LLM to identify keyword gaps (not fabricate)
- Compare against job description keywords
- Never add keywords not present in original resume

**Dependencies**:
- Resume Parser Agent

---

### 5. **Match Agent**
**Purpose**: Semantic resume-to-job matching

**Inputs**:
- Normalized resume skills (with embeddings)
- Normalized job skills (with embeddings)
- Resume experience
- Job requirements

**Outputs**:
```json
{
  "overall_match": 82,
  "match_breakdown": {
    "skills": 92,
    "experience": 78,
    "education": 90,
    "projects": 85,
    "seniority": 75
  },
  "matched_skills": [
    {
      "resume_skill": "Python",
      "job_skill": "Python",
      "match_score": 1.0,
      "match_type": "exact"
    }
  ],
  "missing_skills": [
    {
      "job_skill": "Docker",
      "required": true,
      "priority": "high"
    }
  ],
  "strengths": [
    "Strong Python experience matches role",
    "3+ years relevant backend experience"
  ],
  "weaknesses": [
    "Limited DevOps/Docker experience",
    "No AWS certification mentioned"
  ]
}
```

**Implementation**: Semantic Similarity + Scoring
- Use cosine similarity on embeddings
- Compare years of experience with requirements
- Check education alignment
- Rate match in multiple dimensions

**Dependencies**:
- Skill Extraction Agent
- Resume Parser Agent
- Job Analyzer Agent

---

### 6. **Gap Analysis Agent**
**Purpose**: Identify specific skill and experience gaps with market context

**Inputs**:
- Match results
- Job requirements
- Market data (most demanded skills for role)

**Outputs**:
```json
{
  "critical_gaps": [
    {
      "skill": "Docker",
      "importance": "critical",
      "reason": "Required by 85% of similar backend roles",
      "why_matters": "Industry standard for deployment",
      "learning_effort": "medium",
      "learning_time_weeks": 3,
      "priority_rank": 1,
      "learning_resources": [
        "Docker official documentation",
        "Udemy: Docker for beginners"
      ]
    }
  ],
  "nice_to_have_gaps": [
    {
      "skill": "Kubernetes",
      "importance": "medium",
      "reason": "Preferred in 45% of similar roles",
      "learning_effort": "high",
      "learning_time_weeks": 6
    }
  ],
  "gap_summary": "You are missing 3 critical skills. Focusing on Docker and Redis will increase your competitiveness for this role.",
  "time_to_competitiveness_weeks": 8,
  "market_insight": "These skills are trending in backend engineering roles"
}
```

**Implementation**: Data-driven analysis
- Use actual job market dataset (not LLM fabrication)
- Compare against similar roles
- Provide learning time estimates
- Include reasoning from knowledge base

**Dependencies**:
- Match Agent
- Skill Extraction Agent

---

### 7. **Optimization Agent**
**Purpose**: Iteratively improve resume while preserving facts

**Inputs**:
- Original resume (canonical truth)
- Gap analysis results
- Job description
- Optimization level (conservative/balanced/aggressive)
- Candidate constraints (unchangeable fields)

**Outputs**:
```json
{
  "optimized_resume": "...",
  "optimized_sections": {
    "summary": {
      "before": "Experienced software engineer",
      "after": "Backend Engineer with 5+ years Python experience building scalable APIs",
      "changes": ["added specific tech stack", "added years of experience"],
      "facts_preserved": true,
      "added_keywords": ["Python", "APIs", "scalable"]
    },
    "experience": [
      {
        "before": "Built web application",
        "after": "Developed real-time delivery application using React, Node.js and PostgreSQL, implementing REST APIs for order management",
        "changes": ["added technologies", "added specific responsibilities"],
        "facts_preserved": true
      }
    ]
  },
  "iteration_number": 1,
  "improvement_estimate": 8,
  "next_iteration_needed": true,
  "validation_warnings": []
}
```

**Implementation**: Iterative Loop with Constraints
- Preserve original resume as source of truth
- Only rewrite/reorganize genuine information
- Never add skills, degrees, certifications not in original
- Support 3 levels of optimization intensity
- Track iteration count (max 3-4)
- Stop when improvements plateau

**Dependencies**:
- Resume Parser Agent
- Gap Analysis Agent
- Job Analyzer Agent

---

### 8. **Validation Agent**
**Purpose**: Ensure no hallucinated information in optimized resume

**Inputs**:
- Original resume (source of truth)
- Optimized resume (generated)
- All section changes

**Outputs**:
```json
{
  "hallucination_score": 0.92,
  "is_valid": true,
  "critical_issues": [],
  "warnings": [
    {
      "type": "new_metric_added",
      "severity": "warning",
      "detail": "Added '50,000 users' - not mentioned in original",
      "original_claim": "Built a React application",
      "generated_claim": "Built a React application used by 50,000 users"
    }
  ],
  "approved_changes": [
    "Grammar fixes",
    "Reordered bullet points",
    "Added technical details from original content"
  ],
  "validation_method": "semantic_comparison",
  "summary": "Resume is valid with minor warnings. User review recommended for metric additions."
}
```

**Implementation**: Fact-checking
- Sentence-by-sentence comparison
- Flag new skills, degrees, companies
- Alert on unsubstantiated metrics or claims
- Use semantic similarity to catch paraphrasing of false claims
- Require user approval for questionable changes
- Maintain edit trail

**Dependencies**:
- Optimization Agent

---

### 9. **Evaluation Agent**
**Purpose**: Final comprehensive scoring and reporting

**Inputs**:
- Original resume + parsed data
- Optimized resume + parsed data
- All agent results (ATS, Match, Gap, etc.)
- Before/after optimization metrics

**Outputs**:
```json
{
  "evaluation_summary": {
    "overall_improvement": 12,
    "recommendation": "Resume is now well-optimized for target role"
  },
  
  "final_scores": {
    "original": {
      "ats_score": 72,
      "match_score": 75,
      "overall_readiness": 73
    },
    "optimized": {
      "ats_score": 85,
      "match_score": 88,
      "overall_readiness": 86
    }
  },
  
  "improvements": {
    "ats_improvement": 13,
    "match_improvement": 13,
    "overall_improvement": 13
  },
  
  "detailed_report": {
    "summary": "Your optimized resume significantly improves alignment with the target role.",
    
    "top_improvements": [
      "Added Docker and Redis to skills (industry relevant)",
      "Reorganized experience to highlight backend expertise",
      "Improved keyword density for ATS"
    ],
    
    "next_steps": [
      "Review and approve the optimized resume",
      "Focus on learning Docker in next 3-4 weeks",
      "Apply to roles focusing on backend engineering",
      "Update LinkedIn profile with new skills"
    ],
    
    "confidence_score": 0.89,
    "data_quality": "high"
  },
  
  "recommendations": [
    {
      "type": "skill_development",
      "skill": "Docker",
      "priority": "critical",
      "timeframe": "4 weeks"
    }
  ],
  
  "export_formats": [
    {
      "format": "pdf",
      "url": "https://...",
      "filename": "resume_optimized.pdf"
    },
    {
      "format": "docx",
      "url": "https://...",
      "filename": "resume_optimized.docx"
    }
  ]
}
```

**Implementation**: Aggregation + Intelligent Reporting
- Compile all metrics from other agents
- Generate human-readable narrative
- Calculate improvement deltas
- Provide prioritized action items
- Support multiple export formats

**Dependencies**:
- All other agents

---

## Orchestrator Decision Logic

### Phase 1: Analysis
```python
def analyze_phase(resume, job_description, user_id):
    """Determine what work needs to be done"""
    tasks = []
    
    # Always start with parsing
    tasks.append(Task(name="parse_resume", agent_id="resume_parser"))
    tasks.append(Task(name="analyze_job", agent_id="job_analyzer"))
    
    # Core analysis agents
    tasks.extend([
        Task(name="extract_skills", agent_id="skill_extraction"),
        Task(name="calculate_ats", agent_id="ats_analyzer"),
        Task(name="calculate_match", agent_id="match_agent"),
    ])
    
    # If match is below threshold, add gap analysis
    tasks.append(Task(name="gap_analysis", agent_id="gap_analysis"))
    
    return tasks
```

### Phase 2: Specialization
```python
def select_agents(tasks, config):
    """Map tasks to agent instances"""
    agent_registry = {
        "resume_parser": ResumeParserAgent(config),
        "job_analyzer": JobAnalyzerAgent(config),
        "skill_extraction": SkillExtractionAgent(config),
        "ats_analyzer": ATSAnalyzerAgent(config),
        "match_agent": MatchAgent(config),
        "gap_analysis": GapAnalysisAgent(config),
        "optimization": OptimizationAgent(config),
        "validation": ValidationAgent(config),
        "evaluation": EvaluationAgent(config),
    }
    
    selected_agents = []
    for task in tasks:
        agent = agent_registry[task.agent_id]
        selected_agents.append((task, agent))
    
    return selected_agents
```

### Phase 3: Orchestration
```python
def execute_phase(selected_agents, data, orchestration_state):
    """Execute agents in dependency order with monitoring"""
    results = {}
    
    for task, agent in selected_agents:
        # Check if dependencies ready
        if not orchestration_state.dependencies_ready(task.agent_id):
            continue
        
        try:
            # Emit agent start event (for frontend real-time updates)
            emit_event("agent_start", {
                "agent_id": agent.id,
                "agent_name": agent.name,
                "description": agent.description
            })
            
            # Execute agent with timeout
            result = execute_with_timeout(
                agent.execute(data, results),
                timeout_seconds=agent.timeout_seconds
            )
            
            # Store result
            results[agent.id] = result
            orchestration_state.add_result(agent.id, result)
            
            # Emit agent complete event
            emit_event("agent_complete", {
                "agent_id": agent.id,
                "execution_time_ms": result["execution_time_ms"],
                "status": "success"
            })
            
        except AgentTimeout:
            emit_event("agent_timeout", {"agent_id": agent.id})
            return handle_agent_timeout(agent, orchestration_state)
            
        except AgentError as e:
            emit_event("agent_error", {
                "agent_id": agent.id,
                "error": str(e)
            })
            return handle_agent_error(agent, e, orchestration_state)
    
    return results
```

### Phase 4: Optimization Loop (Optional)
```python
def optimize_phase(results, optimization_params, max_iterations=3):
    """Iteratively improve resume if needed"""
    orchestration_id = generate_id()
    iteration = 0
    current_resume = results["resume_parsed"]
    optimization_history = []
    
    while iteration < max_iterations:
        # Decide if optimization needed
        if should_optimize(results, optimization_params):
            emit_event("optimization_iteration_start", {
                "iteration": iteration + 1,
                "max_iterations": max_iterations
            })
            
            # Run optimization agent
            optimized = optimization_agent.execute({
                "original_resume": results["resume_parsed"],
                "gaps": results["gap_analysis"],
                "job": results["job_analyzed"],
                "optimization_level": optimization_params.level
            })
            
            # Validate no hallucination
            validation_result = validation_agent.execute({
                "original": results["resume_parsed"],
                "optimized": optimized
            })
            
            # If valid, accept optimization
            if validation_result["is_valid"]:
                current_resume = optimized
                optimization_history.append({
                    "iteration": iteration,
                    "optimized_resume": optimized,
                    "validation_result": validation_result
                })
                iteration += 1
                
                emit_event("optimization_iteration_complete", {
                    "iteration": iteration,
                    "improvement": optimized.get("improvement_estimate", 0)
                })
            else:
                # Stop if validation fails
                emit_event("optimization_stopped", {
                    "reason": "validation_failed",
                    "iteration": iteration
                })
                break
        else:
            # No further optimization needed
            break
    
    return {
        "optimized_resume": current_resume,
        "iterations_completed": iteration,
        "optimization_history": optimization_history
    }
```

### Phase 5: Evaluation
```python
def evaluate_phase(results, original_data):
    """Generate final comprehensive evaluation"""
    evaluation = evaluation_agent.execute({
        "original_resume": original_data["resume_parsed"],
        "optimized_resume": results.get("optimized_resume") or original_data["resume_parsed"],
        "ats_original": results.get("ats_analysis", {}),
        "match_original": results.get("match_analysis", {}),
        "gap_analysis": results.get("gap_analysis", {}),
        "optimization_results": results.get("optimization_results", {}),
        "validation_report": results.get("validation_report", {})
    })
    
    emit_event("evaluation_complete", evaluation)
    return evaluation
```

---

## State Management

### Orchestrator State
```python
@dataclass
class OrchestratorState:
    orchestration_id: str
    user_id: str
    resume_id: str
    job_id: str
    created_at: datetime
    
    phase: str  # "analysis", "specialization", "execution", "optimization", "evaluation"
    status: str  # "pending", "processing", "completed", "failed"
    
    agents_executed: list[str]
    agents_failed: list[str]
    results: dict[str, Any]
    
    def add_result(self, agent_id: str, result: dict):
        self.results[agent_id] = result
        self.agents_executed.append(agent_id)
    
    def mark_failed(self, agent_id: str, error: str):
        self.agents_failed.append(agent_id)
    
    def dependencies_ready(self, agent_id: str) -> bool:
        """Check if all dependencies for this agent are ready"""
        dependencies = AGENT_DEPENDENCIES.get(agent_id, [])
        return all(dep in self.agents_executed for dep in dependencies)
    
    def to_dict(self) -> dict:
        return {
            "orchestration_id": self.orchestration_id,
            "user_id": self.user_id,
            "phase": self.phase,
            "status": self.status,
            "agents_executed": len(self.agents_executed),
            "agents_failed": len(self.agents_failed),
            "progress": (len(self.agents_executed) / 9) * 100
        }
```

### Agent Dependencies Map
```python
AGENT_DEPENDENCIES = {
    "resume_parser": [],
    "job_analyzer": [],
    
    "skill_extraction": ["resume_parser", "job_analyzer"],
    "ats_analyzer": ["resume_parser"],
    
    "match_agent": ["skill_extraction", "job_analyzer"],
    
    "gap_analysis": ["match_agent", "skill_extraction"],
    
    "optimization": ["gap_analysis", "resume_parser"],
    
    "validation": ["optimization"],
    
    "evaluation": ["resume_parser", "ats_analyzer", "match_agent", "validation"]
}
```

---

## Data Flow

### Input to Orchestrator
```json
{
  "user_id": "user_123",
  "resume_id": "resume_456",
  "job_id": "job_789",
  "action": "optimize",
  "params": {
    "max_iterations": 3,
    "preserve_fields": ["name", "email", "phone"],
    "optimization_focus": "ats",
    "optimization_level": "balanced"
  }
}
```

### Processing Pipeline
1. Load resume from database
2. Load job description from database
3. Create OrchestratorState
4. Execute analysis phase (determine tasks)
5. Select specialized agents
6. Execute agents in dependency order with real-time updates
7. Optionally run optimization loop
8. Validate optimized resume
9. Execute evaluation
10. Store results and state in database
11. Return response with orchestration_id for status polling

### Output from Orchestrator
```json
{
  "orchestration_id": "orch_xyz",
  "status": "completed",
  "timestamp": "2024-XX-XX",
  
  "results": {
    "resume_parsed": {...},
    "job_analyzed": {...},
    "skills_extracted": {...},
    "ats_analysis": {...},
    "match_analysis": {...},
    "gap_analysis": {...},
    "optimization_results": {...},
    "validation_report": {...},
    "evaluation": {...}
  },
  
  "metrics": {
    "total_execution_time_ms": 4500,
    "agents_executed": 9,
    "agents_failed": 0,
    "iterations": 2,
    "improvements": {
      "ats": 13,
      "match": 15
    }
  },
  
  "recommendations": [...]
}
```

---

## Error Handling

### Agent Failure Strategies

```python
def execute_agent_safely(agent, data, results, orchestration_state):
    """Execute agent with comprehensive error handling"""
    try:
        start_time = time.time()
        result = agent.execute(data, results)
        result["execution_time_ms"] = (time.time() - start_time) * 1000
        return result
        
    except AgentTimeout as e:
        orchestration_state.mark_failed(agent.id, f"Timeout: {str(e)}")
        # Try fallback strategy
        fallback = get_fallback_result(agent.id, data)
        if fallback:
            return fallback
        else:
            raise OrchestrationError(f"Agent {agent.name} timed out and no fallback available")
    
    except AgentValidationError as e:
        # Input validation failed - fatal
        orchestration_state.mark_failed(agent.id, f"Validation: {str(e)}")
        raise
    
    except AgentError as e:
        # Agent-specific error
        orchestration_state.mark_failed(agent.id, str(e))
        
        # Try retry if configured
        if agent.retry_attempts > 0:
            return retry_agent(agent, data, results, agent.retry_attempts)
        else:
            raise
    
    except Exception as e:
        # Unexpected error
        orchestration_state.mark_failed(agent.id, f"Unexpected: {str(e)}")
        raise OrchestrationError(f"Agent {agent.name} failed unexpectedly: {str(e)}")
```

### Graceful Degradation

```python
def handle_orchestration_failure(orchestration_id, error, results_so_far):
    """Return partial results if orchestration fails"""
    return {
        "orchestration_id": orchestration_id,
        "status": "partial_failure",
        "completed_agents": results_so_far.keys(),
        "error": str(error),
        "partial_results": results_so_far,
        "message": "Analysis partially completed. Some features unavailable."
    }
```

---

## Configuration

### Agent Configuration (YAML)
```yaml
agents:
  resume_parser:
    type: "hybrid"
    timeout_seconds: 30
    retry_attempts: 2
    fallback_strategy: "cached"
    
  job_analyzer:
    type: "llm"
    timeout_seconds: 20
    retry_attempts: 2
    model: "gpt-4"
    temperature: 0.2
    
  skill_extraction:
    type: "hybrid"
    timeout_seconds: 15
    retry_attempts: 1
    embedding_model: "text-embedding-3-small"
    use_cache: true
    
  ats_analyzer:
    type: "rule_based"
    timeout_seconds: 10
    retry_attempts: 0
    
  match_agent:
    type: "semantic"
    timeout_seconds: 15
    retry_attempts: 1
    embedding_model: "text-embedding-3-small"
    similarity_threshold: 0.7
    
  gap_analysis:
    type: "llm"
    timeout_seconds: 20
    retry_attempts: 1
    model: "gpt-4"
    use_market_data: true
    
  optimization:
    type: "llm"
    timeout_seconds: 30
    retry_attempts: 1
    model: "gpt-4"
    max_iterations: 3
    iteration_timeout: 25
    
  validation:
    type: "hybrid"
    timeout_seconds: 20
    retry_attempts: 1
    model: "gpt-3.5-turbo"
    similarity_threshold: 0.85
    
  evaluation:
    type: "deterministic"
    timeout_seconds: 10
    retry_attempts: 0

orchestrator:
  execution_mode: "sequential"
  max_total_time_seconds: 300
  max_retries: 2
  cache_results: true
  emit_events: true
  log_level: "info"
```

---

## Real-Time Communication

### Server-Sent Events (SSE)

Frontend subscribes to:
```
GET /api/analysis/{orchestration_id}/progress
```

Backend emits events:
```
event: agent_start
data: {
  "agent_id": "resume_parser",
  "agent_name": "Resume Parser",
  "description": "Extracting resume structure and content"
}

event: agent_complete
data: {
  "agent_id": "resume_parser",
  "execution_time_ms": 2100,
  "status": "success"
}

event: optimization_iteration_start
data: {"iteration": 1, "max_iterations": 3}

event: evaluation_complete
data: {...full evaluation...}
```

---

## Monitoring & Logging

### Metrics Collection

```python
@dataclass
class OrchestrationMetrics:
    orchestration_id: str
    total_time_ms: float
    agents_executed: int
    agents_failed: int
    iterations_completed: int
    cache_hits: int
    cache_misses: int
    
    agent_timings: dict[str, float]  # agent_id -> time_ms
    improvements: dict[str, float]   # metric -> improvement
    
    def to_dict(self):
        return {
            "orchestration_id": self.orchestration_id,
            "total_time_ms": self.total_time_ms,
            "agents_executed": self.agents_executed,
            "agents_failed": self.agents_failed,
            "iterations_completed": self.iterations_completed,
            "cache_hit_rate": self.cache_hits / (self.cache_hits + self.cache_misses),
            "average_agent_time_ms": sum(self.agent_timings.values()) / len(self.agent_timings),
            "improvements": self.improvements
        }
```

### Structured Logging

```python
import logging

logger = logging.getLogger("resumeiq.orchestrator")

# Log orchestration lifecycle
logger.info(f"Orchestration {orch_id} started for user {user_id}")
logger.info(f"Agent {agent_name} completed in {elapsed_ms}ms")
logger.warning(f"Agent {agent_name} exceeded target time: {elapsed_ms}ms")
logger.error(f"Agent {agent_name} failed: {error_message}")
logger.info(f"Orchestration {orch_id} completed in {total_ms}ms with {improvements} improvement")

# Store in database for analysis
orchestration_log = {
    "orchestration_id": orch_id,
    "timestamp": datetime.now(),
    "event_type": "agent_complete",
    "agent_id": agent_id,
    "metrics": {...}
}
```

---

## Research Integration

### Experiment Tracking Framework

```python
class ResearchExperiment:
    """Track control vs treatment group for research validation"""
    
    def __init__(self, experiment_id):
        self.experiment_id = experiment_id
        self.hypothesis = "Agentic orchestration improves match score vs single-pass LLM"
        self.control_group = []     # Single-pass LLM baseline
        self.treatment_group = []   # Full orchestrator
        self.created_at = datetime.now()
    
    def log_result(self, group: str, result: dict):
        """Log experiment result"""
        if group == "control":
            self.control_group.append({
                "timestamp": datetime.now(),
                "metrics": result
            })
        elif group == "treatment":
            self.treatment_group.append({
                "timestamp": datetime.now(),
                "metrics": result
            })
    
    def analyze(self) -> dict:
        """Statistical analysis"""
        if not self.control_group or not self.treatment_group:
            return {"status": "insufficient_data"}
        
        control_scores = [r["metrics"]["match_score"] for r in self.control_group]
        treatment_scores = [r["metrics"]["match_score"] for r in self.treatment_group]
        
        return {
            "hypothesis": self.hypothesis,
            "control_mean": statistics.mean(control_scores),
            "treatment_mean": statistics.mean(treatment_scores),
            "improvement_percent": (
                (statistics.mean(treatment_scores) - statistics.mean(control_scores)) /
                statistics.mean(control_scores) * 100
            ),
            "statistical_significance": perform_t_test(control_scores, treatment_scores),
            "sample_size_control": len(control_scores),
            "sample_size_treatment": len(treatment_scores)
        }
```

### Metrics for FYP Research

Track:
1. **Match Score**: Original vs Optimized
2. **ATS Score**: Original vs Optimized
3. **Hallucination Rate**: Percentage of unsupported claims
4. **Execution Time**: Total and per-agent
5. **Iteration Count**: How many optimization iterations needed
6. **User Satisfaction**: Rating of recommendations

---

## Security & Privacy

1. **Agent Isolation**
   - Each agent runs in separate process/container
   - No shared state between agents (except through results)
   - Input validation for each agent

2. **Data Protection**
   - Resumes encrypted at rest
   - All API communication HTTPS
   - LLM API keys never logged
   - Intermediate results cleared after processing

3. **Audit Logging**
   - All orchestration decisions logged
   - User actions tracked
   - Agent errors logged with context
   - Cannot be disabled (for compliance)

4. **Rate Limiting**
   - Per-user: 10 analyses per hour
   - Per-orchestration: 3 optimization iterations max
   - Prevents API abuse

---

## Performance Optimization

1. **Parallel Execution**
   - Resume Parser & Job Analyzer run in parallel
   - Independent agents don't wait for each other

2. **Caching**
   - Cache skill taxonomy (loaded once)
   - Cache embeddings for common skills
   - Cache model responses (with TTL)

3. **Batching**
   - Process multiple analyses together if possible
   - Batch embeddings generation

4. **Connection Pooling**
   - Reuse database connections
   - Reuse API connections to LLM providers

5. **Timeouts**
   - Reasonable timeout for each agent type
   - Fail-fast rather than hanging

---

## Implementation Priority

**MVP (Must Have)**:
- Orchestrator core
- Resume Parser, Job Analyzer agents
- ATS, Match agents
- Basic evaluation

**Phase 2**:
- Skill Extraction, Gap Analysis agents
- Optimization agent
- Validation agent
- Real-time event streaming

**Phase 3**:
- Research framework
- Advanced caching
- Performance optimization

