# CLAUDE.md — MediSync Frontend

This file is automatically loaded by Claude Code at the start of every session.
It provides all the context, conventions, and guardrails needed to work on this project.

---

## Project Overview

**Project:** MediSync — Medical Appointment Management System  
**Course:** Arquitectura Centrada en el Negocio (ARCN_M)  
**Authors:** Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano  
**Repository:** `medi-sync-frontend`

React SPA that serves as the patient-facing interface for the MediSync system. Patients can
browse specialist doctors, select available time slots, book appointments, and receive
confirmation — all through a single-page application that communicates with the backend API Gateway.

```
Browser → React SPA (Vite) → API Gateway (port 3000)
                ↕
          Redux Toolkit (client state)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | JavaScript (ES2022 modules) |
| Framework | React 18 |
| Build tool | Vite 5 |
| State management | Redux Toolkit |
| Styling | Tailwind CSS 3 |
| HTTP client | Fetch API (wrapped in `src/services/api.js`) |
| Testing | Vitest 2 + @testing-library/react |
| Coverage | @vitest/coverage-v8 (lcov) |
| CI/CD | GitHub Actions → Vercel |
| Node version | 20 (LTS) |

---

## Repository Structure

```
medi-sync-frontend/
├── .claude/
│   └── settings.json          # Claude Code permissions
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Build → Test → SonarCloud → Deploy pipeline
├── public/
├── src/
│   ├── components/
│   │   ├── booking/           # Booking-flow specific components
│   │   ├── cards/             # Card display components
│   │   ├── layout/            # Page shell components (sidebar, header, container)
│   │   └── ui/                # Reusable primitive components (Button, Badge, Icon…)
│   ├── data/
│   │   └── mockData.js        # Static mock data for local development
│   ├── hooks/
│   │   └── useApi.js          # Custom hooks wrapping API calls + local state
│   ├── pages/                 # Top-level route views (Dashboard, FindSpecialist…)
│   ├── services/
│   │   └── api.js             # Fetch wrapper — single entry point for all HTTP calls
│   ├── test/
│   │   └── setup.js           # Vitest global setup (@testing-library/jest-dom)
│   ├── App.jsx                # Root component — page routing via useState
│   ├── index.css              # Tailwind directives + global resets
│   └── main.jsx               # React DOM entry point
├── .env.example               # Template — never commit .env
├── .gitignore
├── CLAUDE.md                  # This file
├── index.html                 # Vite HTML entry
├── package.json
├── postcss.config.js
├── sonar-project.properties   # SonarCloud configuration
├── tailwind.config.js
└── vite.config.js             # Vite + Vitest configuration
```

---

## Claude Code Integration

### How AI-assisted development is used in this project

This repository uses **Claude Code** (Anthropic's AI CLI) as a development assistant under the
**SDD (Specification-Driven Development) with AI** methodology taught in the ARCN_M course.
Claude Code reads this file at every session start to gain instant project context.

### Skills applied

| Skill | Purpose |
|---|---|
| `init` | Generated the initial CLAUDE.md scaffolding |
| `simplify` | Reviews changed code for reuse, quality, and efficiency after implementation |
| `security-review` | Audits pending branch changes before merge to main |
| `review` | Reviews pull requests for correctness and convention compliance |
| `fewer-permission-prompts` | Scans session transcripts and adds safe commands to the allowlist in `.claude/settings.json` |

### Guardrails enforced via `.claude/settings.json`

- **Read-only filesystem operations** (ls, find, cat, grep…) are auto-approved — no prompt shown.
- **npm scripts** that build, test, or install are auto-approved.
- **Safe git operations** (status, log, diff, add, commit, pull, fetch) are auto-approved.
- **Destructive operations** are hard-denied and cannot be approved at runtime:
  - `rm`, `rmdir` — prevent accidental file deletion.
  - `git push --force`, `git reset --hard`, `git clean` — prevent history rewrite.
  - `npm publish / unpublish` — prevent accidental registry publishes.
  - `kill`, `pkill`, `sudo`, `chmod 777` — prevent privilege escalation or process termination.
- **`includeCoAuthoredBy: true`** — every AI-assisted commit automatically includes a
  `Co-Authored-By: Claude` trailer for attribution and academic transparency.

---

## Language and Naming Conventions

- **All code, comments, variable names, and test strings must be in English.**
- Follow standard React / JavaScript conventions:

| Element | Convention | Example |
|---|---|---|
| React components | `PascalCase` file and function | `SpecialistCard.jsx`, `function SpecialistCard()` |
| Hooks | `camelCase` prefixed with `use` | `useApi.js`, `useAppointments` |
| Regular functions / variables | `camelCase` | `fetchSpecialists`, `selectedSlot` |
| Constants | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `BUTTON_VARIANTS` |
| Files — components | `PascalCase.jsx` | `NavigationSidebar.jsx` |
| Files — non-components | `camelCase.js` | `api.js`, `mockData.js` |
| CSS classes | Tailwind utility classes only — no custom class names | `bg-blue-600 text-white` |
| Environment variables | `UPPER_SNAKE_CASE`, prefixed `VITE_` for client exposure | `VITE_API_BASE_URL` |

---

## JSDoc Convention

Every exported component and custom hook must have this exact JSDoc header:

```javascript
/**
 * Brief description of the component or hook.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since YYYY-MM-DD
 */
```

- Props that are non-obvious get a concise `@param` or inline `/** ... */` note.
- Internal helper functions do **not** need JSDoc unless the logic is genuinely non-obvious.
- Inline comments are added **only** when the WHY is non-obvious: a hidden constraint,
  a browser quirk, or a workaround for a specific limitation. Never explain WHAT the code does.

---

## Component Design Rules

### Hierarchy

```
pages/          ← full-page views; own their local state and coordinate child components
components/
  layout/       ← structural shells; receive children and layout props only
  cards/        ← display components; receive data as props, emit events via callbacks
  booking/      ← domain-specific composite components for the booking flow
  ui/           ← stateless primitives (Button, Badge, Icon…); zero business logic
hooks/          ← encapsulate data fetching and derived state; return plain values
services/       ← all fetch calls; no React imports; one function per endpoint
```

### Rules

- Components in `ui/` must be **stateless** — they accept props and render; no `useState`.
- Components in `cards/` and `booking/` may hold **UI-only state** (open/closed, hover) but no
  data-fetching or business logic.
- Pages own state and pass data down; they do **not** reach into sibling components.
- Never call `fetch` or `api.*` directly from JSX — always go through a hook in `hooks/`.
- Keep components **small and focused**: if a component exceeds ~80 lines, extract a sub-component.

---

## Design Principles

| Principle | How it applies in React |
|---|---|
| **SRP** | One component = one responsibility; hooks handle data, components handle rendering |
| **OCP** | Add new variants via a variant map (e.g., `BUTTON_VARIANTS`) — never a chain of `if` statements |
| **DRY** | Shared styles live in Tailwind config or variant maps; shared logic lives in `hooks/` |
| **KISS** | Prefer plain `useState` + callbacks over complex state machines for simple UI flows |
| **YAGNI** | Do not add props, variants, or hooks that no current consumer needs |

---

## State Management

- **Local UI state** (`useState`) — preferred for component-scoped concerns (open/closed, form input).
- **Redux Toolkit** — used only for state that is genuinely shared across multiple pages
  (e.g., current user, booking context).
- Do **not** lift state higher than its narrowest common ancestor.
- Do **not** put server-fetched data in Redux — keep it in the hook that fetched it.

---

## API and Environment Variables

- All HTTP calls go through `src/services/api.js` — never call `fetch` directly in a component.
- The base URL is controlled by `VITE_API_BASE_URL` (exposed to the client via Vite's
  `import.meta.env.VITE_*` mechanism).
- Never commit `.env` files. Keep `.env.example` up to date with every new variable.
- Never access `import.meta.env` inside `hooks/` or `services/` — inject the base URL via
  module initialisation in `api.js` only.

---

## Testing Rules

### Framework
**Vitest 2** + **@testing-library/react**. Coverage via `@vitest/coverage-v8` (lcov format).

### File placement
- Unit / component tests: co-located with the file under test, suffix `.test.jsx` / `.test.js`.
- Example: `Button.jsx` → `Button.test.jsx` (same directory).
- Global setup: `src/test/setup.js` (imports `@testing-library/jest-dom`).

### Test naming — use the `should` pattern
```javascript
it('should render children text')
it('should call onClick when clicked')
it('should be disabled when disabled prop is true')
it('should not render icon when loading')
```

### Structure — always AAA
```javascript
it('should call onClick when clicked', () => {
  // Arrange
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Confirm</Button>)

  // Act
  fireEvent.click(screen.getByRole('button'))

  // Assert
  expect(onClick).toHaveBeenCalledOnce()
})
```

### Mock policy
- Mock **only external modules**: `vi.mock('./Icon', ...)`, `vi.mock('./Spinner', ...)`.
- Use **real instances** for pure presentational components and variant maps.
- Never mock the component under test.
- Do **not** test Tailwind class strings beyond what is meaningful (variant selection, not full class lists).

### Quality checklist
- Cover happy path **and** edge cases (null children, disabled state, loading state, all variants).
- Each test must be fully independent — no shared mutable state between `it()` blocks.
- Extract shared setup into `beforeEach()` to avoid duplication.
- Apply the **FIRST** principles: Fast, Independent, Repeatable, Self-validating, Timely.

---

## CI/CD Pipeline

Defined in `.github/workflows/ci-cd.yml`. Three sequential stages:

| Stage | Trigger | What it does |
|---|---|---|
| **build-and-test** | Every push / PR to `main`, `staging`, `development` | `npm ci` → `npm run build` → `npm run test:cov` → uploads `coverage/lcov.info` |
| **sonarcloud** | After build-and-test passes | Downloads lcov artifact → `SonarSource/sonarcloud-github-action` |
| **deploy** | Push to `main` only, after sonarcloud passes | Vercel CLI: `vercel pull` → `vercel build --prod` → `vercel deploy --prebuilt --prod` |

### Required GitHub Secrets

| Secret | Source |
|---|---|
| `SONAR_TOKEN` | SonarCloud → My Account → Security → Generate Token |
| `VERCEL_TOKEN` | Vercel → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | `vercel link` locally → `.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | Same file → `projectId` |

`GITHUB_TOKEN` is injected automatically by GitHub Actions — no manual setup required.

---

## What to Avoid

- **Do not** call `fetch` or `api.*` directly inside JSX or component bodies.
- **Do not** import from `src/services/api.js` inside a component — always use a hook.
- **Do not** put business logic or data-fetching in `ui/` components — they must stay stateless.
- **Do not** use inline styles (`style={{ ... }}`) — use Tailwind utility classes exclusively.
- **Do not** hardcode the API base URL — always read from `import.meta.env.VITE_API_BASE_URL`.
- **Do not** commit `.env` files or any file containing real credentials.
- **Do not** push directly to `main` — use feature branches and go through the pipeline.
- **Do not** write multi-paragraph JSDoc blocks that explain WHAT the code does.
- **Do not** add props, variants, or state for hypothetical future requirements (YAGNI).
- **Do not** share state between pages via module-level variables — use Redux or prop drilling.
