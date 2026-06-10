# DeployFix Assistant App Flow

## Main navigation

Primary app sections:

- Dashboard
- New Diagnosis
- Sessions
- Projects
- Rules Library (optional)
- Settings

## User flow overview

```text
Landing Page
  -> Sign up / Sign in
  -> Dashboard
      -> Start New Diagnosis
          -> Select platform + framework
          -> Choose input method
              -> Paste logs
              -> Guided questionnaire
              -> Both
          -> Run analysis
          -> Results page
              -> View likely issues
              -> Expand evidence
              -> See fix steps
              -> Copy/share summary
              -> Mark resolved
          -> Save session
      -> View session history
      -> Filter by status/project/platform
      -> Open previous diagnosis
```

## Screen-by-screen flow

## 1. Landing page

### Purpose

Explain the product in one screen and push users to try a diagnosis.

### Key sections

- Hero: “Fix deployment issues faster.”
- Supported platforms.
- Example issue cards.
- CTA to start diagnosis.

## 2. Auth flow

### Entry points

- Continue with GitHub.
- Continue with email magic link (optional).

### Outcome

- New users land in onboarding.
- Returning users land in dashboard.

## 3. Onboarding

### Inputs

- Name.
- Team or solo.
- Preferred platforms.
- Main framework.

### Outcome

- Create default workspace.
- Pre-fill future diagnosis forms.

## 4. Dashboard

### Purpose

Give a quick snapshot and strong CTA.

### Modules

- New diagnosis button.
- Recent sessions.
- Most common issue categories.
- Resolution rate.
- Suggested quick actions.

## 5. New diagnosis wizard

### Step 1: Project context

- Project name.
- Platform.
- Framework.
- Environment (preview / production / local-like).

### Step 2: Input source

User chooses one or more:

- Paste raw logs.
- Guided troubleshooting form.
- Repo and deployment metadata (future).

### Step 3A: Log paste

- Large text area.
- Secret redaction notice.
- “Analyze logs” CTA.

### Step 3B: Guided form

Questions:

- What broke? Build, auth, DB, domain, API, other.
- Did it work locally?
- Which provider is used?
- Did you recently change env vars, domain, auth provider, or DB?
- What exact symptom appears?

### Step 4: Review input

- Parsed metadata preview.
- Detected keywords.
- Confirmation CTA.

### Step 5: Analysis state

- Animated progress states.
- “Scanning logs.”
- “Matching patterns.”
- “Preparing fixes.”

## 6. Results page

### Sections

- Diagnosis headline.
- Ranked issue cards.
- Evidence matched from logs.
- Recommended fixes.
- Validation checklist.
- Related issues.
- Copy summary button.
- Save and mark resolved.

### Ranked issue card contents

- Category.
- Confidence.
- Severity.
- Why this is likely.
- Fix steps.
- Validation steps.

## 7. Sessions list

### Filters

- Platform.
- Framework.
- Status.
- Date range.
- Issue category.

### Table/card item

- Project name.
- Issue headline.
- Platform.
- Created at.
- Resolved status.

## 8. Session detail

### Tabs

- Summary.
- Raw input.
- Findings.
- Notes.
- Timeline.

## 9. Mark resolved flow

- User clicks resolved.
- Modal asks what fixed it.
- Optional notes saved for future similarity learning.

## 10. Share/export flow

### Options

- Copy markdown summary.
- Export PDF/text later.
- Copy checklist only.

## Ideal demo story

1. User pastes broken Next.js deployment logs.
2. System detects missing env variable + auth callback mismatch.
3. Results show exact likely fixes.
4. User copies the summary.
5. User views history with status tagged “open”.
6. User marks the issue resolved.
