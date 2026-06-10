# 🚀 LaunchLens - DeployFix Assistant

Welcome to **LaunchLens**! 👋

Are you a beginner who just got a scary wall of red text when trying to deploy your app on Vercel, Netlify, or Railway? Don't worry! **LaunchLens** is a developer-focused diagnostic tool that decodes those failed deployment logs into plain-English explanations. It tells you exactly what went wrong and gives you an easy, step-by-step checklist to fix it.

---

## ✨ Features

- **Log Decoder:** Paste your confusing build/server logs, and we'll translate them into human-readable issues.
- **Guided Fixes:** Get a step-by-step interactive checklist to resolve your deployment errors.
- **Secrets Redaction:** Your sensitive data (like API keys) are automatically hidden for safety.
- **Dashboard & Stats:** Keep track of your past debugging sessions and see your success rates.
- **Easy Authentication:** Secure login using simulated OAuth.

---

## 🎥 Interactive Demo

*(Here are some quick previews of LaunchLens in action!)*

### 1. Analyzing Logs
![Analyzing Logs Demo](https://raw.githubusercontent.com/soumyachk101/LaunchLens/main/docs/demo-analyze.gif "Pasting logs into LaunchLens")
> *Watch how LaunchLens instantly parses a Vercel build failure.*

### 2. Step-by-Step Fixes
![Fix Checklist Demo](https://raw.githubusercontent.com/soumyachk101/LaunchLens/main/docs/demo-fixes.gif "Interactive fix checklist")
> *Follow the simple checklist to solve the root cause.*

*(Note: If the GIFs are not loading, they will be uploaded soon!)*

---

## 🛠️ How It Works (System Architecture)

Here is a simplified view of how the Next.js frontend talks to our Express backend.

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

## 🔍 Troubleshooting Workflow

Wondering what happens when you paste your logs? Here is the flow!

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

## ⚙️ Sequence Flow Diagram

For the advanced users, here is the sequence of network requests during a debugging session:

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

## 🚀 Getting Started

Follow these instructions to run the project on your local machine. It's beginner-friendly!

### Prerequisites
Before you start, make sure you have:
- **Node.js (v18+)**: [Download here](https://nodejs.org/)
- **PostgreSQL**: Install it locally or run a Docker container.
- **npm**: Comes with Node.js.

### 1️⃣ Database Setup
First, we need to set up the database to store our rules and logs.

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a `.env` file in the `backend/` directory and configure your PostgreSQL connection URL:
   ```env
   DATABASE_URL="postgresql://<USER>:<PASSWORD>@localhost:5432/deployfix?schema=public"
   PORT=5000
   ```
3. Push the schema to your database (creates the tables):
   ```bash
   npx prisma db push
   ```
4. Populate the database with diagnostic rules (seeding):
   ```bash
   npx prisma db seed
   ```

### 2️⃣ Backend Setup
Now let's start the API server!

1. Still inside the `backend` folder, install the required packages:
   ```bash
   npm install
   ```
2. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will now be running on [http://localhost:5000/api](http://localhost:5000/api).*

### 3️⃣ Frontend Setup
Finally, let's start the user interface!

1. Open a **new terminal** and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the required packages:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to [http://localhost:3000](http://localhost:3000). 
5. You'll be redirected to `/login`. Sign in using email credentials or simulate OAuth, and start analyzing logs!

---

## 💡 How to Use
1. **Login:** Once the app is running, sign in.
2. **Dashboard:** You'll see your dashboard with past sessions. Click "New Diagnosis" (or equivalent) to start.
3. **Paste Logs:** Copy your failed deployment logs from Vercel/Netlify and paste them into the wizard.
4. **Get Fixes:** LaunchLens will decode the logs and give you a checklist.
5. **Resolve:** Follow the checklist, fix your code, and mark the issue as resolved!

---

## 🤝 Contributing
Contributions are always welcome! Feel free to open an issue or submit a pull request if you want to add new rules or features.

## 📄 License
This project is open-source and available under the MIT License.
