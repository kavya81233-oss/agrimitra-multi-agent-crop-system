# AgriMitra – Autonomous Multi-Agent Crop Health and Farming Decision Support System

AgriMitra is an AI-powered agricultural decision-support web application that empowers farmers to diagnose crop diseases, analyze atmospheric weather risks, query agricultural compendiums, and execute prioritized, farmer-approved management actions.

The platform employs a **genuine multi-agent architecture** where five specialized AI agents collaborate through an Orchestrator Agent.

---

## Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │          Farmer / Web UI               │
                      │  (React, Vite, Tailwind CSS, Recharts) │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │          FastAPI Backend               │
                      │       (REST APIs & SQLite DB)          │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │          ORCHESTRATOR AGENT            │
                      │  - Formulates Investigation Plan       │
                      │  - Assigns Sub-Tasks to Agents         │
                      │  - Collates Evidence & Generates Report│
                      └────┬──────┬──────┬──────┬─────────┬────┘
                           │      │      │      │         │
       ┌───────────────────┘      │      │      │         └────────────────────┐
       ▼                          ▼      ▼      ▼                              ▼
┌───────────────┐  ┌──────────────┐  ┌───────────────┐  ┌────────────────┐  ┌──────────────────┐
│   AGENT 1:    │  │   AGENT 2:   │  │   AGENT 3:    │  │    AGENT 4:    │  │     AGENT 5:     │
│ Crop Diagnosis│  │   Weather    │  │ Agricultural  │  │Risk Assessment │  │Farm Action Plan  │
│     Agent     │  │ Intelligence │  │Knowledge Agent│  │     Agent      │  │     Planner      │
│ (Vision & AI) │  │ (Open-Meteo) │  │  (ICAR/FAO)   │  │(Contagion & Unc│  │ (Prioritized Map)│
└───────────────┘  └──────────────┘  └───────────────┘  └────────────────┘  └──────────────────┘
```

### The 5 Specialized Agents

1. **Crop Diagnosis Agent (`crop_diagnosis_agent.py`)**
   - Analyzes uploaded leaf imagery using configured **Google Gemini 2.5 Flash Vision Model** or rule-based symptom matching.
   - Detects pathogen type, lesion morphology, symptoms, and potential alternative diagnoses.
   - Transparently displays uncertainty factors; never hallucinates false confidence when running in demo mode.

2. **Weather Intelligence Agent (`weather_agent.py`)**
   - Retrieves live atmospheric conditions via the **Open-Meteo API** (free, no API key required).
   - Evaluates ambient temperature, relative humidity, precipitation, and wind speeds.
   - Analyzes microclimate risk factors (e.g. conidial fungal spore germination index when humidity > 75%).

3. **Agricultural Knowledge Agent (`agricultural_knowledge_agent.py`)**
   - Searches local curated agronomic knowledge base (`crops_data.json`) covering Tomatoes, Potatoes, Rice, Maize, Wheat, and Cotton.
   - Provides verified organic remedies (*Trichoderma viride*, *Pseudomonas fluorescens*, neem extracts) and cultural prevention methods.
   - Returns verifiable scientific references (ICAR, IIHR, CPRI, IRRI, FAO).

4. **Risk Assessment Agent (`risk_assessment_agent.py`)**
   - Synthesizes findings from Diagnosis, Weather, and Knowledge agents.
   - Calculates composite threat score (0–100) and categorizes risk (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
   - Identifies missing farm parameters (soil pH, prior fungicide applications, irrigation schedule) and establishes urgency horizons.

5. **Farm Action Planner Agent (`action_planner_agent.py`)**
   - Sequences recommendations into four prioritized categories: **Immediate Actions**, **Preventive Measures**, **Monitoring Tasks**, and **Follow-up Activities**.
   - Strict ethical guardrails: Requires farmer approval before marking AI recommendations as scheduled farm actions.
   - Strictly prohibits unverified pesticide/chemical dosages without regional extension officer soil tests.

---

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons, Recharts, React Router v6
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic v2
- **Database**: SQLite with SQLAlchemy ORM
- **AI / Integrations**:
  - Google Gemini API (`google-genai` SDK) for multimodal leaf vision & agronomic reasoning
  - Open-Meteo REST API for real-time weather & 7-day agricultural forecasts
  - Local Agricultural Knowledge Base (JSON retrieval)

---

## Project Structure

```
agrimitra/
├── backend/
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── orchestrator.py                  # Orchestrator Agent
│   │   ├── crop_diagnosis_agent.py          # Agent 1: Crop Diagnosis
│   │   ├── weather_agent.py                 # Agent 2: Weather Intelligence
│   │   ├── agricultural_knowledge_agent.py  # Agent 3: Agricultural Knowledge
│   │   ├── risk_assessment_agent.py         # Agent 4: Risk Assessment
│   │   └── action_planner_agent.py          # Agent 5: Farm Action Planner
│   ├── knowledge_base/
│   │   └── crops_data.json                  # Agronomic disease & practice compendium
│   ├── models/
│   │   ├── __init__.py
│   │   ├── models.py                        # SQLAlchemy ORM Tables
│   │   └── schemas.py                       # Pydantic Schemas
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── analyze.py                       # /api/analyze-crop & /api/analyses
│   │   ├── weather.py                       # /api/weather
│   │   ├── actions.py                       # /api/actions
│   │   └── assistant.py                     # /api/assistant/chat (EN & Kannada)
│   ├── services/
│   │   ├── __init__.py
│   │   ├── gemini_service.py                # Gemini Vision & Chat client
│   │   ├── weather_service.py               # Open-Meteo geocoding & forecast
│   │   └── knowledge_service.py             # Knowledge retrieval engine
│   ├── uploads/                             # Stored crop images
│   ├── database.py                          # SQLite & SQLAlchemy engine
│   ├── main.py                              # FastAPI Application
│   ├── requirements.txt                     # Backend dependencies
│   ├── seed_demo_data.py                    # Initial realistic data seeder
│   └── .env.example                         # Environment configuration template
├── frontend/
│   ├── public/
│   │   └── leaf.svg                         # AgriMitra favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgentExecutionCenter.jsx     # Live multi-agent timeline & inspectable findings
│   │   │   └── Toast.jsx                    # Toast alert notifications
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx               # Sidebar, header, date, language switcher
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx              # SaaS landing page with architecture diagram
│   │   │   ├── DashboardPage.jsx            # Farmer metrics, weather widget, chart, tasks
│   │   │   ├── InvestigatePage.jsx          # Leaf upload, presets, execution trigger
│   │   │   ├── ReportPage.jsx               # Multi-agent printable/exportable report
│   │   │   ├── WeatherPage.jsx              # Live Open-Meteo forecast & spore risk
│   │   │   ├── ActionsPage.jsx              # Task manager & farmer approval gate
│   │   │   ├── AssistantPage.jsx            # Bilingual (English/Kannada) AI chat
│   │   │   └── HistoryPage.jsx              # Past investigations & comparative monitoring
│   │   ├── services/
│   │   │   └── api.js                       # Frontend API client
│   │   ├── App.jsx                          # Router configuration
│   │   ├── index.css                        # Tailwind directives & styles
│   │   └── main.jsx                         # Application entrypoint
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## Getting Started

### 1. Prerequisites

Ensure you have installed:
- **Python 3.10+** (verified on Python 3.13)
- **Node.js v18+** and **npm**

---

### 2. Backend Setup

Open a terminal and navigate to `agrimitra/backend`:

```bash
cd agrimitra/backend
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

#### Environment Variables (Optional Google Gemini Key)
Copy the `.env.example` file to `.env`:

```bash
copy .env.example .env
```

If you wish to use live Google Gemini Vision and multimodal reasoning:
1. Obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Edit `backend/.env`:
   ```ini
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

> **Note on Demo Mode:**
> If `GEMINI_API_KEY` is not provided, AgriMitra runs in **labelled Demo / Rule-Based Mode**.
> It utilizes the built-in botanical knowledge base to simulate realistic diagnoses with complete transparency and explicitly labels them as such.

#### Seed Demo Data (Optional)
To pre-populate realistic sample investigations and farm actions:

```bash
python seed_demo_data.py
```

#### Start Backend Server
Run the FastAPI application with Uvicorn:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend API will be available at `http://127.0.0.1:8000`.
Interactive Swagger API docs can be viewed at `http://127.0.0.1:8000/docs`.

---

### 3. Frontend Setup

Open a new terminal window and navigate to `agrimitra/frontend`:

```bash
cd agrimitra/frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## Key Features & Pages Walkthrough

1. **Landing Page (`/`)**
   - High-impact agricultural SaaS landing page with leaf emblem, statistics, features, and an interactive Multi-Agent Architecture visualization.

2. **Farmer Dashboard (`/dashboard`)**
   - Top farmer banner, 4 vital metric cards (Total Analyses, Healthy Crops %, Disease Alerts, Pending Tasks).
   - Live weather widget with temperature, humidity, rainfall, and pathogen incubation risks.
   - Recharts visual breakdown of crop health distribution.
   - Recent investigations table and quick-action launcher.

3. **Crop Disease Investigation (`/investigate`)**
   - Leaf/crop photo uploader with instant preview.
   - Selection of crop types (Tomato, Potato, Rice, Maize, Wheat, Cotton).
   - Quick location selector with popular Karnataka agricultural districts (Bengaluru Rural, Mandya, Hassan, Dharwad, etc.).
   - Observed symptoms selector and text description.
   - **One-click demo preset scenarios** for immediate testing without having to find sample leaf images.

4. **Multi-Agent Investigation Center (`AgentExecutionCenter`)**
   - Animated visual timeline displaying the real-time status (`Waiting`, `Running`, `Completed`) of each agent.
   - Expandable drawers on each agent card to inspect intermediate findings, confidence metrics, and references.

5. **Final Investigation Report (`/report/:id`)**
   - Comprehensive diagnostic report including crop image, disease classification, risk level badges, weather conditions, verified citations, and prioritized action plan.
   - Single-click print/export to PDF.
   - "Approve All Actions" button to synchronize recommendations directly into the Farm Action Planner.

6. **Weather Intelligence (`/weather`)**
   - Real-time Open-Meteo weather lookups for any Indian district.
   - 7-day temperature and precipitation forecast charts.
   - Microclimatic spore germination alerts and optimal agricultural spraying window advisories.

7. **Farm Action Planner (`/actions`)**
   - Board organizing actions into: Immediate Actions, Preventive Measures, Monitoring Tasks, and Follow-up Activities.
   - Enforces farmer agency: AI recommendations remain "Pending" until approved by the farmer.
   - Supports creating custom tasks, marking tasks complete, and deleting items.

8. **Agricultural AI Assistant (`/assistant`)**
   - Conversational agronomic chat with instant prompt suggestions.
   - **Bilingual English and Kannada (ಕನ್ನಡ) options**.
   - Answers questions regarding chlorosis, blight prevention, heavy rain recovery, and organic soil care with ICAR source citations.

9. **Continuous Monitoring & History (`/history`)**
   - Search and filter previous investigation reports.
   - **Side-by-side comparison feature**: Select any two scans (Baseline A and Follow-up B) to evaluate disease progression and treatment recovery over time.

---

## Safety & Ethical Principles

- **No Artificial Confidence:** Model confidence is only displayed when returned by a live vision model. Simulated demo mode is explicitly labelled.
- **Human Agency:** Farm actions recommended by AI cannot execute without explicit farmer approval.
- **Chemical Safety:** AgriMitra does not recommend unverified synthetic agrochemical dosages without certified local agricultural officer consultation.
- **Informational Disclaimer:** Clear banners inform farmers that AI suggestions provide educational guidance and complement local Krishi Vigyan Kendra (KVK) expertise.
