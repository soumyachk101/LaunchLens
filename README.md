# LaunchLens - DeployFix Assistant

LaunchLens is a developer-focused diagnostic tool that decodes failed deployment logs and environment variables from modern platforms like Vercel, Netlify, and Railway into plain-English root causes and validation checklists.

---

## 1. System Architecture (Normal Graph)

This graph displays the split client-server organization, where the Next.js frontend communicates with the Express backend via REST API calls, and the backend persists records using the Prisma client.

```mermaid
graph TD
    subgraph Client [Frontend next.js Application]
        F1[Landing Showcase]
        F2[Dashboard Panel]
        F3[Diagnosis Multi-Step Wizard]
        F4[Interactive Checklists View]
    end
    
    subgraph API [Backend Express API]
        S1[Express Router & Controllers]
        S2[Log Redactor]
        S3[Rules Evaluator Engine]
        S4[Prisma Access Layer]
    end
    
    subgraph DB [Database Engine]
        DB1[(PostgreSQL Database)]
    end

    Client -->|HTTP REST JSON| API
    API -->|Prisma Client / SQL| DB
```

---

## 2. Troubleshooting Workflow (Workflow Graph)

This graph displays the steps taken to process a deployment logs diagnostic session, from inputs to final resolution.

```mermaid
graph TD
    A[Start: Deployment Fails] --> B{Choose Input Method}
    B -->|Option 1| C[Paste Build / Server Logs]
    B -->|Option 2| D[Complete Guided Questionnaire]
    C --> E[Secrets Redaction & Text Normalization]
    D --> F[Inject Context Parameters]
    E --> G[Diagnosis Rules Engine Scan]
    F --> G
    G --> H{Find Pattern Matches?}
    H -->|Yes| I[Assemble Ranked Findings & Fix Steps]
    H -->|No| J[Fallback: General Diagnostic Guidance]
    I --> K[Display Interactive Resolution Checklist]
    J --> K
    K --> L[Mark Resolved & Save Troubleshooting History]
```

---

## 3. Sequence Flow Diagram (Sequence/Animated Graph)

This diagram details the sequence of network requests, rules validation, and database updates executed during a typical debugging session.

```mermaid
sequenceDiagram
    autonumber
    actor User as Developer
    participant Client as Next.js App
    participant Server as Express Server
    participant Rules as Rules Engine
    participant Database as PostgreSQL (Prisma)

    User->>Client: Pastes logs & submits context
    Client->>Server: POST /api/sessions (Create Draft)
    Server->>Database: Insert Session (Draft)
    Database-->>Server: OK (Session ID)
    Client->>Server: POST /api/sessions/:id/analyze
    Note over Server,Rules: Normalization & Secret Redaction
    Server->>Rules: Match logs against patterns
    Rules-->>Server: Ranked Findings List
    Server->>Database: Save Findings & Recommendations
    Database-->>Server: Stored
    Server-->>Client: Return ranked suggestions
    Client-->>User: Render interactive checklist
    User->>Client: Tick validation steps & click Resolve
    Client->>Server: POST /api/sessions/:id/resolve
    Server->>Database: Update status to 'RESOLVED'
    Database-->>Server: Stored
    Server-->>Client: OK
    Client-->>User: Show resolved success state
```

---

## 4. Getting Started

### Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to view the application.

### Backend Setup
1. Open a new terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configurations and generate the database clients:
   ```bash
   # Ensure env variables are configured in .env
   npm run prisma:generate
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The backend API will run on [http://localhost:5000/api](http://localhost:5000/api).
