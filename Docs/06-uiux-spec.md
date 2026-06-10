# DeployFix Assistant UI/UX Spec

## Product design direction

The UI should feel like a modern developer tool: clean, dense enough to be useful, but friendly enough for beginners. The visual tone should combine **trust**, **clarity**, and **speed**.

Recommended aesthetic inspiration:

- Vercel for calm minimalism.
- Linear for polished workflows.
- Stripe Dashboard for structured information.
- GitHub for developer familiarity.

## Design principles

- Explain complex problems with plain language.
- Keep one strong action per screen.
- Show diagnosis confidence without sounding absolute.
- Highlight evidence from logs, not just opinions.
- Use progressive disclosure for advanced details.

## Information architecture

### Global nav

- Logo
- Dashboard
- New Diagnosis
- Sessions
- Projects
- Settings
- User menu

### Page hierarchy

1. Landing
2. Auth
3. Dashboard
4. New Diagnosis Wizard
5. Results Page
6. Session History
7. Project Detail
8. Settings

## Layout system

### Desktop

- Left sidebar navigation.
- Main content pane.
- Optional right insights rail on result pages.

### Mobile

- Top compact header.
- Bottom nav or drawer.
- Single-column cards.

## Core screens

## Landing page

### Goal

Drive immediate trial.

### Sections

- Headline and CTA.
- “Supported issues” visual strip.
- “How it works” 3-step section.
- Example diagnosis preview.
- Footer.

## Dashboard

### Top area

- Greeting.
- New Diagnosis CTA.
- Recent unresolved sessions badge.

### Main widgets

- Recent sessions.
- Frequent issue types.
- Platform breakdown.
- Quick actions.

## New diagnosis wizard

Use a 4-5 step progress flow.

### Step UI components

- Segmented platform selector.
- Framework dropdown.
- Issue type cards.
- Large paste area.
- Guided form radio buttons and checkboxes.

## Diagnosis results page

### Recommended layout

#### Left/main column

- Top diagnosis summary.
- Ranked finding cards.
- Fix steps.
- Validation checklist.
- Evidence snippets.

#### Right rail

- Session metadata.
- Confidence score.
- Issue tags.
- Copy summary button.
- Mark resolved button.

## Component specs

## Buttons

### Variants

- Primary: solid accent.
- Secondary: neutral outlined.
- Ghost: text-only.
- Danger: destructive actions only.

## Cards

### Types

- Metric cards.
- Issue cards.
- Evidence cards.
- Action cards.

### Rule

Issue cards should emphasize title, confidence, and action steps. They should not drown users in long prose upfront.

## Inputs

- Labels always visible.
- Helper text below where needed.
- Error text inline.
- Monospace optional for logs and code snippets.

## Visual language

### Colors

Recommended semantic palette:

- Background: warm or cool neutral.
- Primary accent: teal or blue-green for trust.
- Success: green.
- Warning: amber.
- Error: red-magenta or red.
- Info: blue.

### Typography

- Sans-serif primary UI font.
- Monospace secondary font for logs, evidence, env vars, and technical output.

Suggested pairing:

- Inter / Geist / Satoshi for UI.
- JetBrains Mono for technical content.

## UX microcopy principles

Replace jargon-heavy text with practical phrasing.

Examples:

- Instead of “Authentication configuration invalid”, use “Your login settings likely do not match the deployed domain.”
- Instead of “Environment mismatch detected”, use “A required production environment variable may be missing.”

## Empty states

- No sessions yet -> “Run your first diagnosis.”
- No projects -> “Create a project to group deployment issues.”
- No matches -> “No strong match found. Try adding more logs or switching to guided mode.”

## Loading states

Use developer-friendly messages:

- Reading logs...
- Matching common deployment failures...
- Generating fix checklist...

## Accessibility requirements

- WCAG AA contrast.
- Full keyboard navigation.
- Focus states on all interactive components.
- Screen-reader labels for icon buttons.
- Do not rely on color alone for severity.

## Suggested design tokens

### Radius

- Small: 8px.
- Medium: 12px.
- Large: 16px.

### Spacing

- 4px base spacing system.

### Shadows

- Light subtle shadows only on floating surfaces.

## MVP screen list

- Landing page.
- Login page/modal.
- Dashboard.
- New diagnosis wizard.
- Results page.
- Sessions list.
- Session detail drawer/page.
- Settings.
