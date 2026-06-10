# DeployFix Assistant Delivery Plan

## Hackathon build strategy

The highest-value version is a polished MVP that solves a narrow but painful problem extremely well. Avoid trying to support every cloud platform or every framework.

## Recommended MVP scope

### Platforms

- Vercel
- Netlify
- Railway

### Frameworks

- Next.js
- React
- Node.js API

### Supported issue classes

- Missing env variables
- Auth callback mismatch
- Database URL / connection issues
- Build dependency failures
- DNS/domain misconfiguration
- API base URL / CORS issues

## Day-wise plan

## Day 1

- Finalize schema and routes.
- Set up auth.
- Build dashboard shell.
- Create diagnosis wizard.
- Seed initial rules.

## Day 2

- Build analysis pipeline.
- Create result page.
- Save sessions to database.
- Add copy/share summary.
- Polish UI.

## Day 3

- Add history filters.
- Add resolved status flow.
- Improve loading and empty states.
- Test demo scenarios.
- Refine pitch and demo narrative.

## Team split suggestion

### Builder 1

- Frontend shell.
- Wizard.
- Results UI.

### Builder 2

- Backend APIs.
- DB schema.
- Rule engine.

### Builder 3, if available

- Landing page.
- Auth.
- Demo content.
- Slides and pitch.

## Demo script

1. Open landing page.
2. Start diagnosis.
3. Paste broken production logs.
4. Show top-ranked issue.
5. Expand recommended fixes.
6. Copy summary.
7. Open session history.
8. Mark issue resolved.

## Hackathon judging strengths

- Clear real-world pain point.
- Strong utility for developers.
- Easy-to-understand live demo.
- Obvious extensibility beyond hackathon.
- Strong alignment with modern full-stack tooling.

## Stretch goals

- GitHub repo metadata connect.
- AI explanation rewrite.
- “Generate env checklist” feature.
- Shareable public diagnosis link.

## Risks and mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Overbuilding AI features | High | Keep deterministic rules first |
| Weak demo logs | High | Prepare strong canned scenarios |
| Auth setup delay | Medium | Use Clerk or GitHub-only login |
| DB migration issues | Medium | Freeze schema early |
| UI unfinished | High | Use component library from start |

## Submission checklist

- Working live URL.
- GitHub repo.
- Demo credentials if needed.
- Problem statement.
- Architecture slide.
- Screenshots / short video.
- Clear future roadmap.
