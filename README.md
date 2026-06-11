# LaunchLens - DeployFix Assistant

LaunchLens is a developer-focused diagnostic tool that decodes failed deployment logs and environment variables from modern platforms like Vercel, Netlify, and Railway into plain-English root causes and validation checklists.

---

## 1. System Architecture (Normal Graph)

This graph displays the split client-server organization, where the Next.js frontend communicates with the Express backend via REST API calls, and the backend persists records using the Prisma client.

```mermaid
graph TD
    subgraph Client [Frontend Next.js Application]
        F1[Landing Showcase + Interactive Log Simulator]
        F2[Login System - Credentials & Simulated OAuth]
        F3[Dashboard Panel - Live API Stats & Skeletons]
        F4[Diagnosis Multi-Step Wizard]
        F5[Interactive Checklists View]
    end
    
    subgraph API [Backend Express API]
        S1[Express Router & Controllers]
        S2[Log Redactor & Normalizer]
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
    K --> L[Mark Resolved & Save Troubleshooting History in Database]
```

---

## 3. Sequence Flow Diagram (Sequence/Animated Graph)

This diagram details the sequence of network requests, rules validation, and database updates executed during a typical debugging session, including authentication locks.

```mermaid
sequenceDiagram
    autonumber
    actor User as Developer
    participant Client as Next.js App
    participant Middleware as Auth Middleware
    participant Server as Express Server
    participant Rules as Rules Engine
    participant Database as PostgreSQL (Prisma)

    User->>Client: Open /login & select GitHub/Google
    Client->>Client: Simulate secure OAuth 2.0 handshake
    Client->>Client: Save session credentials in cookies
    Client->>Client: Redirect to /dashboard
    
    User->>Client: Access Dashboard / Protected Views
    Client->>Middleware: Intercept route check (verify cookie)
    Middleware-->>Client: Authorized (Proceed)
    
    Client->>Server: GET /api/sessions/stats
    Server->>Database: Query aggregated diagnostic statistics
    Database-->>Server: Result counts
    Server-->>Client: Dynamic stats payload (runs, breakdown)
    
    User->>Client: Pastes logs & submits context in wizard
    Client->>Server: POST /api/sessions (Create Session)
    Server->>Database: Insert Session (Draft status)
    Database-->>Server: Session ID
    
    Client->>Server: POST /api/sessions/:id/analyze
    Note over Server,Rules: Normalization & Secret Redaction
    Server->>Rules: Match logs against database rules
    Rules-->>Server: Ranked Findings List
    Server->>Database: Save Findings & Recommendations
    Database-->>Server: Stored
    Server-->>Client: Return ranked suggestions
    
    User->>Client: Tick validation steps & click Resolve
    Client->>Server: PATCH /api/sessions/:id (resolved status)
    Server->>Database: Update status to 'RESOLVED' and set resolvedAt
    Database-->>Server: Stored
    Server-->>Client: Return updated session
```

---

## 4. Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database (or docker container)
- npm

### Database Setup
1. Inside the `backend/` directory, configure the `DATABASE_URL` connection string in your `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/deployfix?schema=public"
   PORT=5001
   ```
2. Run Prisma migrations or schema push to synchronize the database:
   ```bash
   npx prisma db push
   ```
3. Run the database seeder to populate the active diagnostic rules:
   ```bash
   npx prisma db seed
   ```

### Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The backend API runs on [http://localhost:5001/api](http://localhost:5001/api).

### Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies and start the development server:
   ```bash
   npm install
   ```
3. Run the dev script:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser. Unauthenticated routes will redirect to `/login`. Sign in using email credentials or simulate OAuth to start scanning deployment logs!
