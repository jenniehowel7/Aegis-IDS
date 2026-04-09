# Aegis IDS Frontend Handoff for Backend and AI Teams

## 1) Document Purpose
This is the implementation handoff for three teams:
- Frontend team (what already exists)
- Backend team (what must be built to serve the frontend)
- AI team (what model services and outputs are required)

This document is based on the active codebase in this repository.

## 2) Current Frontend Status (Already Built)
Active stack:
- Next.js App Router
- React + TypeScript
- UI components + charts

Implemented routes:
- /auth
- /dashboard
- /live
- /batch
- /model
- /incidents
- /profile

Role behavior already implemented in frontend:
- Individual: limited access (no /model and /incidents)
- Company: full access
- Admin: full access

Current data mode:
- Frontend currently runs in local demo mode (mock data).
- API behavior is currently simulated in lib/api.ts with local data from lib/mock-data.ts.

## 3) Frontend API Contract (What Backend Must Serve)
The frontend already expects these capabilities and response shapes.

Auth:
- POST /auth/login
  - Request: identifier, password
  - Response: user object
- POST /auth/register
  - Request: username, email, role, password
  - Response: user object

Dashboard:
- GET /dashboard
  - Response:
    - stats: total_packets, threats_detected, uptime, throughput, open_incidents
    - traffic_trends[]: time, normal, attack
    - attack_categories[]: category, count
    - protocol_distribution[]: protocol, count
    - service_distribution[]: service, count
    - recent_alerts[]: id, time, src_ip, dst_ip, protocol, service, status, severity, confidence, optional method/path/reason

Live stream:
- GET /live
  - Response: packet array with
    - id, time, src_ip, dst_ip, port, protocol, service, src_bytes, dst_bytes, duration, latency, status, confidence

Batch analysis:
- POST /batch/analyze
  - Request: CSV upload
  - Response:
    - total_records, threats_detected, normal_traffic
    - predictions[]
    - raw_data[]
    - insights: service_breakdown[], protocol_distribution[]

Model analytics:
- GET /model
  - Response:
    - precision, recall, f1_score, auc
    - confusion_matrix (2x2)
    - detection_by_type[]: type, rate
    - roc_curve[]: fpr, tpr
    - operational: detection_latency_ms, false_positive_ceiling, service_availability

Incidents:
- GET /incidents
  - Response: incident summary list
- GET /incidents/:id
  - Response: incident detail including request, rationale/features, playbook, timeline

Profile:
- GET /profile/:userId
- PUT /profile/:userId
- POST /profile/:userId/security
- POST /profile/:userId/password

Admin:
- GET /admin/users

Health:
- GET /health

## 4) Backend Team Build Requirements
The backend team should build a production API that replaces frontend demo data without changing frontend screens.

Required backend responsibilities:
- Implement all endpoints listed above
- Return payloads compatible with current frontend type expectations
- Enforce role-based access for protected resources
- Authenticate with secure token-based auth and session strategy
- Validate request payloads and file uploads
- Standardize error responses (status + message)
- Add pagination for large lists where needed (incidents, alerts)
- Add observability: request logs, model latency, error metrics, health checks

Recommended response standards:
- Success responses: JSON with stable field names
- Error responses: JSON with message and detail fields
- Date/time fields in ISO format

Performance targets for backend serving frontend:
- Dashboard and model endpoints: low latency and cache-friendly
- Live endpoint: support high-frequency fetch or streaming mode
- Batch endpoint: async-safe for large uploads and long inference jobs

## 5) AI Team Build Requirements
The AI team should provide reliable model services and outputs consumed by backend.

Required AI responsibilities:
- Provide a versioned inference pipeline for binary classification (Normal vs Attack)
- Provide confidence score per prediction
- Provide model metrics artifact for frontend analytics page
- Provide category-level detection rates and ROC points
- Provide feature-level rationale data for incident drill-down
- Define model input schema and preprocessing rules
- Deliver model version metadata and inference constraints

AI deliverables expected by backend:
- Input contract (feature list, types, required vs optional)
- Output contract:
  - predicted label
  - confidence
  - optional attack category
  - optional top feature contributions
- Batch inference support
- Real-time inference support (single or mini-batch)
- Monitoring hooks for drift/performance

## 6) Data and Interface Ownership
Frontend owns:
- UI behavior, navigation, role-based view gating
- Rendering of charts/tables/details from API payloads

Backend owns:
- Auth, authorization, endpoint security, storage, API stability
- Integration with AI inference service and business rules

AI owns:
- Model training/inference lifecycle, metrics quality, explainability outputs
- Ongoing model evaluation and improvement

## 7) Integration Plan (Execution Order)
Step 1:
- Backend team exposes all endpoints with mocked backend payloads that match frontend contracts.

Step 2:
- Frontend switches from local demo mode to backend mode in lib/api.ts.

Step 3:
- AI team provides inference service and model artifacts to backend.

Step 4:
- Backend connects inference service to live, batch, dashboard, incidents, and model endpoints.

Step 5:
- Cross-team E2E testing with role-specific scenarios and data edge cases.

## 8) Validation Checklist Before Go-Live
- All frontend routes load from backend data
- Login/register/profile/security/password flows work
- Role restrictions enforced both frontend and backend
- Live stream endpoint stable under load
- Batch upload supports expected file sizes and errors gracefully
- Model analytics endpoint returns complete metric payloads
- Incident detail endpoint returns rationale/playbook/timeline consistently

## 9) Model Details and Expected Outcomes (Place This Near Final Review)
Primary objective:
- Detect malicious network behavior with high precision and actionable recall while supporting explainable analyst workflows.

Required model behavior:
- Binary classification output: Normal or Attack
- Confidence score for every prediction
- Stable behavior across live and batch inputs
- Explainability support for incident triage

Operational outcomes the system should achieve:
- Low false-positive rate for analyst usability
- Sufficient recall to avoid missed critical threats
- Latency suitable for near real-time monitoring
- Versioned, reproducible model outputs

Model reporting expected for frontend analytics:
- Precision, Recall, F1, AUC
- Confusion matrix
- Detection rate by attack type
- ROC curve points
- Operational metrics: latency, false-positive threshold, availability target

How AI connects to backend:
- Backend sends normalized feature vectors to inference layer
- AI returns prediction payload (label, confidence, optional rationale)
- Backend augments with domain context (severity, playbook, timeline)
- Backend stores and serves this data through API endpoints

How backend connects to frontend after backend and AI are integrated:
- Frontend calls backend endpoint contracts already implemented in UI
- Backend replaces local demo responses with real system data
- Frontend requires no major page redesign if payload contracts are preserved

## 10) What More We Can Add Next
- Real websocket live stream instead of polling
- Tenant isolation for multi-organization deployments
- Incident workflow states (new, triaged, escalated, closed)
- Human feedback loop for model retraining
- Alert suppression and policy engine
- SIEM integrations and export connectors
- Threat intel enrichment for incident context
- Drift detection dashboards and model rollback controls
