# KalaGanaka — Ancient Wisdom, Modern Science

**Explore the Cosmos Through Ancient Indian Astronomy and Modern Scientific Calculations**

KalaGanaka is an interactive astronomy and timekeeping platform that brings together traditional Indian astronomical knowledge and modern computational astronomy. It helps users explore how people understood time, tracked celestial bodies, observed solar and lunar cycles, and developed calendrical systems.

The project combines immersive 3D visualizations, astronomical calculations, traditional methods, comparative analysis, and an AI-powered educational assistant in one platform.

> **Core idea:** Explore the methods of the past, calculate the sky using modern astronomy, and understand the differences through interactive visualizations.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Objectives](#2-project-objectives)
3. [The Six Modules](#3-the-six-modules)
4. [Module 1 — Ancient vs Modern Timekeeping](#4-module-1--ancient-vs-modern-timekeeping)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Frontend Design Principles](#7-frontend-design-principles)
8. [Repository Structure](#8-repository-structure)
9. [Getting Started](#9-getting-started)
10. [Backend API Integration](#10-backend-api-integration)
11. [Scientific Accuracy and Data Integrity](#11-scientific-accuracy-and-data-integrity)
12. [Development Workflow](#12-development-workflow)
13. [Testing and Quality Assurance](#13-testing-and-quality-assurance)
14. [Performance and Accessibility](#14-performance-and-accessibility)
15. [Configuration and Environment Variables](#15-configuration-and-environment-variables)
16. [Team Responsibilities](#16-team-responsibilities)
17. [Roadmap](#17-roadmap)
18. [Known Limitations](#18-known-limitations)
19. [Contributing](#19-contributing)
20. [License](#20-license)

---

## 1. Project Overview

Timekeeping and astronomy have developed across many civilizations. Traditional Indian astronomy includes observational practices, calendrical systems, angular measurements, and methods for understanding celestial cycles. Modern astronomy provides computational methods for calculating celestial positions and relating them to standardized time systems.

KalaGanaka makes these ideas accessible through an educational, interactive web experience.

Rather than presenting historical knowledge and modern calculations as unrelated topics, the platform allows users to explore their methods, assumptions, outputs, and differences.

### What KalaGanaka aims to provide

- Interactive 3D representations of astronomical instruments and celestial systems.
- Educational explanations of historical Indian timekeeping and calendrical concepts.
- Modern solar, lunar, and planetary calculations.
- Panchang calculations and festival-date exploration.
- Side-by-side comparisons between supported historical methods and modern results.
- An AI assistant that explains calculations in accessible language.
- A responsive interface suitable for desktop, tablet, and mobile devices.

### Project status

KalaGanaka is under development. The modules, APIs, and architectural structure described in this README define the intended system. Features should be considered implemented only when their code, calculations, tests, and integrations are verified.

---

## 2. Project Objectives

### Educational objectives

1. Explain the relationship between celestial motion and timekeeping.
2. Introduce important concepts from traditional Indian astronomy.
3. Help users understand modern astronomical calculations.
4. Explain how historical and modern methods differ in their inputs, assumptions, and outputs.
5. Make complex concepts accessible through visualization and plain-language explanations.

### Technical objectives

1. Build an interactive frontend using React and Three.js.
2. Provide reusable astronomical calculation services through a Python backend.
3. Separate historical methods from modern ephemeris-based calculations.
4. Expose stable, documented APIs for frontend integration.
5. Validate scientific calculations against reliable references and documented examples.
6. Provide meaningful error states, responsive layouts, and automated tests.

---

## 3. The Six Modules

### Module 1 — Ancient vs Modern Timekeeping

**Purpose:** Explore historical timekeeping through the Konark Sun Temple Chakra and compare it with modern time calculation.

The experience will include:

- A detailed, interactive 3D representation of the Konark Chakra.
- A modern astronomical timekeeping visualization.
- A time-of-day slider that moves the simulated Sun.
- Sunlight and shadow visualization.
- Independent rotation and zoom controls for both 3D objects.
- A synchronized mode that updates both visualizations.
- An information button explaining important readings and calculations.
- Modern civil time, local mean solar time, and local apparent solar time where supported.
- Educational explanations of historical timekeeping and the limitations of interpreting historical instruments.

The Konark Chakra is the central historical visual of this module. It must not be replaced by a generic sundial.

### Module 2 — Solar Calendar and Solar Festivals

**Purpose:** Explore the Sun's apparent motion and its relationship to daily timekeeping, seasons, and solar-calendar events.

Planned features:

- Sunrise and sunset.
- Solar noon and day length.
- Solar altitude and azimuth.
- Solar longitude.
- Solar-calendar and festival-date exploration.
- Location and date selection.
- Explanations of seasonal and solar cycles.
- Comparisons between supported traditional methods and modern calculations.

Solar festival dates may depend on a specific calendrical tradition, astronomical event, local time, and observance convention. Supported rules will be documented.

### Module 3 — Lunar Calendar, Panchang, and Festivals

**Purpose:** Help users explore lunar cycles and important Panchang components.

Planned features:

- Tithi.
- Nakshatra.
- Yoga.
- Karana.
- Vara.
- Transition times for Panchang elements.
- Lunar phase exploration.
- Festival-date lookup for supported traditions.
- Location-aware calculations where required.
- Explanations of the astronomical basis of each result.

Tithi and other angularly defined elements change at calculated transition times; they must not be assumed to change only at midnight.

### Module 4 — Planetary Position Explorer

**Purpose:** Visualize the positions and motion of celestial bodies.

Planned features:

- Sun and Moon positions.
- Mercury, Venus, Mars, Jupiter, and Saturn.
- Interactive planetary visualization.
- Date and time controls.
- Coordinate and angular-position displays.
- Explanations of coordinate systems and reference conventions.
- Traditional-versus-modern comparisons where a documented historical method is available.

Planet positions and visualization scales will be based on the supported calculation model. A visually simplified model must not be mistaken for a physically to-scale solar system.

### Module 5 — Ancient vs Modern Analysis Lab

**Purpose:** Provide a detailed workspace for comparing historical methods and modern calculations.

Planned features:

- Method selection.
- Input and date-range controls.
- Side-by-side numerical results.
- Differences and unit conversions.
- Charts and time-series exploration.
- Formula explanations.
- Source and method metadata.
- Assumptions, limitations, and validation information.

This module is the detailed analysis workspace. The other modules will show concise comparisons in context.

A small numerical difference is not automatically proof that a historical method is more accurate. Accuracy claims require appropriate historical evidence, reference data, and defined uncertainty.

### Module 6 — Grok AI Assistant

**Purpose:** Explain astronomical concepts and actual application results through a conversational interface.

Planned features:

- Natural-language questions.
- Hindi and English explanations.
- Contextual explanations of the current module.
- Explanations of calculation formulas and assumptions.
- Responses grounded in results returned by backend services.
- References to supported methods and sources.
- Graceful handling of API failures and unsupported questions.

The assistant will explain and contextualize calculated results. It will not be treated as the authoritative source of numerical astronomical calculations.

---

## 4. Module 1 — Ancient vs Modern Timekeeping

Module 1 is the primary interactive experience for exploring the relationship between the Konark Chakra and modern astronomical timekeeping.

### 4.1 Konark Chakra visualization

The frontend will create a procedural 3D representation inspired by the stone wheel of the Konark Sun Temple.

Planned visual elements:

- Stone-textured outer rim.
- Central hub.
- Radial spokes.
- Concentric circular details.
- Decorative stone carvings.
- Directional sunlight.
- Simulated shadows.
- Interactive educational hotspots.

The scene will be created with Three.js geometry, materials, lights, and shaders where useful. The wheel should not be merely a static image displayed in a 3D container.

The model is an educational recreation, not a claim of exact archaeological reconstruction unless its geometry is verified against suitable documentation.

### 4.2 Sun-position slider

Users will be able to move a horizontal slider across the selected day.

The slider will:

- Represent the selected simulation time.
- Move the Sun visualization.
- Update scene lighting and shadows.
- Update relevant modern astronomical readings.
- Synchronize the Sun across both machines when synchronized mode is enabled.
- Support quick selection of useful times, including morning, solar noon, and afternoon.

Actual sunrise and sunset positions must be calculated for the selected date and location. Fixed slider positions must not be presented as actual solar events for every location.

### 4.3 Modern astronomical timekeeping machine

A separate procedural 3D visualization will illustrate modern astronomical timekeeping concepts using:

- A Sun-position indicator.
- Angular reference lines.
- Solar altitude and azimuth.
- A time display.
- Coordinate or orientation guides.
- Interactive camera controls.

The instrument is a visualization of the calculation, not a substitute for the astronomical calculation engine.

### 4.4 Independent movement

Users should be able to interact with each machine independently.

Each visualization should support:

- Dragging to rotate the camera.
- Zooming in and out.
- Resetting to the default view.
- Inspecting important features.
- Using touch gestures on mobile devices.

Moving the camera must not change the simulated time. Moving the time slider must not unexpectedly rotate the camera.

### 4.5 Synchronized comparison

In synchronized mode, changing the time slider updates both scenes.

Users can switch between:

- Konark Chakra view.
- Modern timekeeping view.
- Side-by-side comparison.

The time input is shared when synchronized, while camera positions remain independent.

### 4.6 Calculation information button

An information button will be available next to important readings.

The associated panel should explain:

1. What the value means.
2. The inputs used.
3. The formula or calculation method.
4. The steps used to derive the value.
5. The units and time conventions.
6. The assumptions and known limitations.
7. The source or method version, when available.

Historical interpretations must be presented with suitable context. No unsupported exact mapping between a particular Konark Chakra spoke and a clock-time value should be invented.

### 4.7 Time concepts to distinguish

| Concept | Meaning |
|---|---|
| UTC | A standardized global time reference. |
| IST | Indian Standard Time, UTC+05:30. |
| Local mean solar time | A solar-time reference based on the observer's longitude and a mean-Sun convention. |
| Local apparent solar time | A time reference based on the apparent Sun's position. |
| Solar noon | The time when the Sun crosses the local meridian, subject to the selected calculation convention. |

These values are related, but they are not interchangeable.

The backend will be responsible for authoritative modern calculations. The frontend will display results with units, conventions, and method information.

---

## 5. Technology Stack

The following is the proposed stack. Existing repository dependencies should be inspected before installing or replacing packages.

### Frontend

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Type-safe application code |
| Vite | Development server and production bundler |
| Three.js | 3D rendering engine |
| React Three Fiber | React renderer for Three.js |
| Drei | Helpers for camera controls, loaders, and 3D interaction |
| Tailwind CSS | Styling and responsive layouts, if compatible with the existing setup |
| React Router | Navigation between the six modules |
| Recharts | Comparison charts and time-series plots |
| Lucide React | Interface icons |
| Fetch API or Axios | Backend communication |

### Backend

| Technology | Purpose |
|---|---|
| Python | Calculation and service implementation |
| FastAPI | REST API |
| Pydantic | Request validation and response schemas |
| Skyfield | Modern astronomical calculations |
| JPL ephemeris data | High-precision planetary reference data, depending on the selected file |
| pytest | Automated testing |
| HTTPX / FastAPI TestClient | API testing |
| Grok API | AI-powered explanations |

The actual backend libraries, ephemeris files, and external API configuration must be verified against the repository and deployment requirements.

### Optional infrastructure

- PostgreSQL, if persistent application data is needed.
- Redis, if shared caching becomes necessary.
- Docker, if containerized development and deployment are required.
- A production hosting provider for the frontend and backend.

Optional infrastructure should be introduced only when it provides a clear benefit.

---

## 6. System Architecture

KalaGanaka uses a frontend/backend architecture.

```text
User
 |
 v
React + TypeScript Frontend
 |
 +--> Three.js / React Three Fiber
 |      |
 |      +--> Konark Chakra
 |      +--> Modern astronomical visualization
 |      +--> Interactive Sun and camera controls
 |
 +--> Shared API Client
        |
        v
     FastAPI Backend
        |
        +--> Modern Astronomy Services
        |
        +--> Panchang Services
        |
        +--> Traditional Method Services
        |
        +--> Comparison Engine
        |
        +--> Festival Engine
        |
        +--> Grok Assistant Service
```

### Frontend responsibilities

- Render pages and 3D visualizations.
- Manage user inputs and interface state.
- Provide accessible controls.
- Display backend results.
- Explain calculations in readable language.
- Handle loading, error, and unsupported-result states.
- Keep API communication separate from visual components.

### Backend responsibilities

- Validate inputs.
- Perform authoritative calculations.
- Manage historical methods and their metadata.
- Calculate Panchang values and supported festival occurrences.
- Compare compatible results.
- Return structured responses with units and assumptions.
- Integrate with the AI provider securely.

### Core design rule

**The frontend must not invent authoritative astronomy values.** It may animate and illustrate a simulation, but numerical scientific results should come from tested calculation functions or documented backend responses.

---

## 7. Frontend Design Principles

### Visual identity

KalaGanaka should have a distinctive visual identity inspired by celestial observation and traditional Indian astronomy.

The proposed design includes:

- Deep navy and near-black backgrounds.
- Antique gold highlights.
- Restrained cosmic particle effects.
- Refined typography.
- Fine orbital lines and astronomical markings.
- Stone-inspired materials for the Konark Chakra.
- Subtle motion instead of excessive animation.
- Clear information hierarchy and readable text.

### Original 3D construction

For the Konark Chakra and modern instrument, build the geometry programmatically.

Avoid relying on AI-generated screenshots, static hero images, or premade 3D models as the primary experience.

Procedural geometry should be organized into reusable components, with appropriate separation between the wheel's geometry, materials, lighting, camera, and interaction logic.

### Reusable UI components

Likely shared components include:

- `Navbar`
- `ModuleCard`
- `SectionHeading`
- `TimeSlider`
- `DateTimePicker`
- `LocationSelector`
- `InfoPopover`
- `CalculationPanel`
- `ComparisonCard`
- `ChartPanel`
- `LoadingState`
- `ErrorState`
- `MobileModuleSelector`

These components should be reused across modules where the interaction and data requirements are genuinely shared.

---

## 8. Repository Structure

The following is a proposed target structure. Adapt it to the actual repository rather than duplicating existing folders or moving working code unnecessarily.

```text
kalaganaka/
├── README.md
├── .gitignore
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── public/
│   │
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── routes/
│       │
│       ├── components/
│       │   ├── layout/
│       │   ├── ui/
│       │   ├── charts/
│       │   └── astronomy/
│       │
│       ├── modules/
│       │   ├── timekeeping/
│       │   │   ├── TimekeepingPage.tsx
│       │   │   ├── KonarkChakra.tsx
│       │   │   ├── ModernTimeMachine.tsx
│       │   │   ├── SunTimeSlider.tsx
│       │   │   ├── CalculationInfo.tsx
│       │   │   └── components/
│       │   │
│       │   ├── solar-calendar/
│       │   ├── lunar-panchang/
│       │   ├── planetary-explorer/
│       │   ├── analysis-lab/
│       │   └── assistant/
│       │
│       ├── services/
│       │   ├── api-client.ts
│       │   ├── astronomy-api.ts
│       │   ├── panchang-api.ts
│       │   ├── comparison-api.ts
│       │   ├── festival-api.ts
│       │   └── assistant-api.ts
│       │
│       ├── hooks/
│       ├── types/
│       ├── utils/
│       └── styles/
│
├── backend/
│   ├── requirements.txt
│   ├── .env.example
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   └── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── astronomy/
│   │   │   ├── panchang/
│   │   │   ├── traditional/
│   │   │   ├── comparison/
│   │   │   ├── festivals/
│   │   │   └── assistant/
│   │   ├── core/
│   │   └── data/
│   │
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── scientific_validation/
│
└── docs/
    ├── architecture.md
    ├── api-contract.md
    ├── historical-methods.md
    ├── scientific-conventions.md
    └── development-guide.md
```

---

## 9. Getting Started

### Prerequisites

Install:

- Node.js with npm.
- Python compatible with the backend dependencies.
- Git.
- A code editor such as VS Code or Antigravity.

Three.js rendering requires a browser with WebGL support.

### 9.1 Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd kalaganaka
```

Replace the placeholder with the actual repository URL.

### 9.2 Set up the frontend

If a frontend already exists, use its existing scripts and dependencies first.

For a new Vite React TypeScript frontend:

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

Install the planned 3D and interface dependencies as needed:

```bash
npm install three @react-three/fiber @react-three/drei
npm install react-router-dom recharts lucide-react
npm install -D @types/three
```

Install and configure Tailwind CSS according to the version selected by the project. Do not mix configuration instructions for different Tailwind major versions.

Start the development server:

```bash
npm run dev
```

Run the available checks:

```bash
npm run build
npm run lint
```

The lint command is available only if configured in `package.json`.

### 9.3 Set up the backend

Open a separate terminal:

```bash
cd backend
```

Create and activate a virtual environment.

**Windows PowerShell:**

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

**macOS/Linux:**

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Start the FastAPI server using the actual application entry point:

```bash
uvicorn app.main:app --reload
```

If the entry point or module path differs, use the one defined by the existing project.

When available, the API documentation will usually be accessible at:

```text
http://127.0.0.1:8000/docs
```

Run the tests:

```bash
python -m pytest -q
```

Successful setup depends on the actual dependency versions, required ephemeris files, and environment configuration.

### 9.4 Run frontend and backend together

Run the frontend and backend in separate terminals.

The frontend should call the backend through a configurable base URL. During development, configure the appropriate Vite environment variable and FastAPI CORS origins.

Do not hardcode deployment-specific URLs throughout the component code.

---

## 10. Backend API Integration

The frontend and backend should agree on API contracts before connecting the modules.

The paths below are proposed examples. Existing backend routes take precedence, and the final paths must be confirmed against the actual application.

| Module | Example endpoint | Purpose |
|---|---|---|
| Timekeeping | `POST /api/timekeeping/calculate` | Calculate and compare supported timekeeping values |
| Astronomy | `GET /api/astronomy/positions` | Obtain celestial positions |
| Solar calendar | `GET /api/astronomy/solar-events` | Obtain solar events |
| Panchang | `GET /api/panchang` | Obtain Panchang values |
| Panchang | `GET /api/panchang/transitions` | Obtain transition times |
| Planetary explorer | `GET /api/astronomy/positions` | Retrieve supported body positions |
| Analysis lab | `POST /api/comparison/calculate` | Compare compatible methods |
| Festivals | `GET /api/festivals` | Retrieve supported festival information |
| AI assistant | `POST /api/assistant/chat` | Request an explanation |

### Example modern calculation request

```json
{
  "datetime": "2026-10-29T12:00:00+05:30",
  "latitude": 19.8876,
  "longitude": 75.3200,
  "timezone": "Asia/Kolkata"
}
```

This is an illustrative request contract. The actual schema must match the backend.

### Example structured response

```json
{
  "status": "calculated",
  "civil_time": {
    "datetime": "2026-10-29T12:00:00+05:30",
    "timezone": "Asia/Kolkata"
  },
  "solar_time": {
    "local_mean_solar_time": null,
    "local_apparent_solar_time": null
  },
  "solar_position": {
    "altitude_degrees": null,
    "azimuth_degrees": null
  },
  "method": {
    "name": "modern_ephemeris",
    "version": null
  },
  "assumptions": [],
  "warnings": []
}
```

Null values are deliberate placeholders in this documentation example, not calculation results.

### Frontend API requirements

- Validate inputs before making requests.
- Handle unsuccessful HTTP responses.
- Show loading and error states.
- Use typed request and response interfaces.
- Avoid duplicate requests when inputs have not changed.
- Debounce rapid slider requests if necessary.
- Keep numerical calculation logic in the backend where appropriate.
- Never expose API secrets in frontend environment variables.

For interactive sliders, the frontend may animate a preview locally and request authoritative results at a suitable interval. Clearly distinguish preview values from calculated values.

---

## 11. Scientific Accuracy and Data Integrity

Scientific reliability is a core requirement of KalaGanaka.

### Modern astronomy

Modern calculations should document:

- Ephemeris source and version.
- Supported dates.
- Observer location and elevation, where relevant.
- Timezone and UTC conversion.
- Coordinate system and reference frame.
- Apparent versus astrometric position.
- Geocentric versus topocentric calculations.
- Refraction assumptions, where relevant.
- Units and angle normalization.

### Traditional astronomy

Each implemented historical method should have:

- A traceable source.
- A documented formula or algorithm.
- Epoch and constants, where applicable.
- Input and output units.
- Assumptions and corrections.
- A worked example or validation reference.
- Known limitations.

Historical methods should not be invented merely to fill a comparison table.

### Comparison methodology

Only compare values with compatible meanings and conventions.

For example, an angular difference can be calculated using the signed shortest angular separation:

\[
\Delta\lambda =
((\lambda_T-\lambda_M+180^\circ)\bmod 360^\circ)-180^\circ
\]

This formula is appropriate for comparing two angular values expressed in the same convention. It is not a formula for calculating elapsed-time differences.

A comparison should explain whether the values are directly comparable, partially comparable, or incompatible under their current conventions.

### Historical interpretation of the Konark Chakra

The wheel must be represented respectfully and with historical context.

- Distinguish documented history from modern interpretation.
- Do not assert an exact time reading from every spoke without reliable evidence.
- Do not assume a decorative or symbolic feature is a calibrated measurement scale.
- Label simulated sunlight and shadows appropriately.
- Explain when a visualization is illustrative rather than a validated reconstruction.

---

## 12. Development Workflow

Development should proceed incrementally.

### Step 1 — Audit

- Inspect the existing frontend and backend.
- Review dependencies and routes.
- Identify reusable code.
- Confirm which features are implemented and which are planned.

### Step 2 — Establish the design system

- Define colors, typography, spacing, and responsive breakpoints.
- Build the shared navigation.
- Create common cards, buttons, controls, and information panels.

### Step 3 — Build Module 1

- Create the Konark Chakra geometry.
- Create the modern astronomical instrument.
- Add independent camera controls.
- Add the shared Sun-position slider.
- Implement synchronized and independent modes.
- Add calculation explanations and accessible controls.

### Step 4 — Integrate modern astronomy

- Agree on the request and response schemas.
- Connect the timekeeping page to backend calculations.
- Display actual results and calculation metadata.
- Handle unavailable data and errors.

### Step 5 — Implement the remaining modules

Build the solar calendar, Panchang, planetary explorer, analysis lab, and AI assistant using the shared design system and API client.

### Step 6 — Test and optimize

- Validate calculations.
- Test responsive layouts.
- Optimize 3D performance.
- Test all API integrations.
- Resolve critical errors before deployment.

---

## 13. Testing and Quality Assurance

### Frontend tests

Test:

- Navigation and routing.
- Input validation.
- Slider behavior.
- Independent camera controls.
- Synchronization between machines.
- Information panels and popovers.
- Loading and error states.
- Mobile and desktop layouts.
- Keyboard and reduced-motion behavior.

### Backend tests

Test:

- Request validation.
- Date and timezone conversion.
- Solar position and event calculations.
- Panchang transition boundaries.
- Historical methods against documented examples.
- Angular differences and convention handling.
- Festival-rule boundaries.
- Missing ephemeris data.
- External AI provider failures.

### Integration tests

Verify that:

- Frontend requests match backend schemas.
- API errors are displayed clearly.
- Numerical results include units and method metadata.
- The UI does not mistake unavailable results for zero values.
- Changes in selected date and location update relevant outputs.
- Slider animations do not overwhelm the backend with unnecessary requests.

---

## 14. Performance and Accessibility

### Performance

- Limit particle counts and expensive shadow calculations on mobile devices.
- Use efficient geometry and materials.
- Reuse geometries where appropriate.
- Dispose of Three.js resources when components unmount.
- Dynamically load large module components where beneficial.
- Avoid continuously recalculating expensive astronomical values on every render.
- Throttle or debounce high-frequency interactions.
- Provide a fallback when WebGL is unavailable.

### Accessibility

- Provide labels for every input.
- Ensure keyboard-operable controls.
- Maintain readable contrast.
- Avoid relying on color alone to communicate results.
- Provide text equivalents for important 3D information.
- Respect reduced-motion preferences.
- Keep touch targets usable on mobile.
- Make calculation explanations understandable without requiring 3D interaction.

---

## 15. Configuration and Environment Variables

Use environment variables for environment-specific configuration.

Example frontend configuration:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Example backend configuration:

```dotenv
XAI_API_KEY=replace_with_your_server_side_key
XAI_MODEL=your_configured_model
EPHEMERIS_PATH=path_to_your_ephemeris_file
ALLOWED_ORIGINS=http://localhost:5173
LOG_LEVEL=INFO
```

These are example placeholders. Use only variables supported by the actual backend configuration.

**Security requirements:**

- Never commit real API keys.
- Do not place secret keys in `VITE_` environment variables.
- Keep local `.env` files out of version control.
- Provide an `.env.example` containing placeholders.
- Restrict production CORS origins to the intended frontend domains.
- Avoid logging secrets or unnecessary personal information.

---

## 16. Team Responsibilities

The project divides work across frontend development and backend calculation services.

### Person 1 — Frontend

Responsibilities:

- Landing page and shared design system.
- Navigation and responsive layouts.
- Three.js visualizations.
- Konark Chakra interaction.
- Modern timekeeping visualization.
- Sun-position slider and synchronized controls.
- Information panels and explanations.
- Backend API integration.
- Frontend testing and deployment.

### Persons 2 and 3 — Backend

Responsibilities:

- Modern astronomical calculation engine.
- Historical calculation methods.
- Panchang and transition calculations.
- Festival rules.
- Comparison engine.
- API schemas and documentation.
- Grok integration.
- Scientific validation and backend testing.
- Backend deployment and configuration.

### Shared responsibilities

- Agree on API schemas before integration.
- Review scientific terminology.
- Verify the interpretation of historical methods.
- Test end-to-end module workflows.
- Coordinate changes through Git.
- Document unfinished features and known issues.

---

## 17. Roadmap

The timeline below is a proposed development sequence, not a statement of current completion.

| Phase | Focus | Expected outcome |
|---|---|---|
| 1 | Repository audit and design system | Stable foundation |
| 2 | Landing page and navigation | Shared visual identity |
| 3 | Konark Chakra and modern machine | Interactive 3D prototype |
| 4 | Sun slider and calculation panels | Complete Module 1 interaction |
| 5 | Modern astronomy integration | Verified numerical readings |
| 6 | Solar and lunar modules | Calendar and Panchang features |
| 7 | Planetary explorer and analysis lab | Position visualization and comparisons |
| 8 | Festival engine and AI assistant | Additional learning experiences |
| 9 | Scientific validation and QA | Tested calculation workflows |
| 10 | Deployment and documentation | Reproducible release |

The order may change depending on existing code, backend readiness, and available historical validation sources.

---

## 18. Known Limitations

Until the relevant functionality is implemented and verified:

- The 3D Konark Chakra is an educational recreation, not necessarily an exact archaeological model.
- Exact historical time mappings for individual spokes are not assumed.
- Modern astronomical results depend on the chosen ephemeris, conventions, location, and date range.
- Festival observance rules may vary across regions and traditions.
- Not all historical methods may be supported by sufficiently documented sources.
- AI-generated explanations may require safeguards and should be grounded in calculation results.
- Browser graphics performance varies by device and WebGL support.
- API endpoints listed as examples must be verified against the actual backend.

These limitations should be communicated clearly in the application rather than hidden from users.

---

## 19. Contributing

Contributions should preserve the project's educational purpose, scientific transparency, and maintainable architecture.

### Contribution guidelines

1. Check existing code before creating duplicate components or services.
2. Use descriptive component and function names.
3. Keep astronomy calculations separate from UI components.
4. Add tests for new calculation logic.
5. Document historical methods and their sources.
6. Avoid fabricated scientific data and unsupported historical claims.
7. Keep secrets out of Git.
8. Update API documentation when response schemas change.
9. Test changes before merging.
10. Keep pull requests focused and explain their purpose.

### Suggested Git workflow

```bash
git checkout -b feature/module-1-timekeeping
```

After implementing and testing the feature:

```bash
git add .
git commit -m "feat: implement interactive timekeeping module"
git push -u origin feature/module-1-timekeeping
```

Open a pull request according to the team's repository workflow.

---

## 20. License

The project license has not yet been specified.

Before public distribution, select and add a license that matches the project's goals and the licensing requirements of its dependencies and data sources. Do not assume that external ephemeris data, photographs, historical illustrations, or third-party assets can automatically be redistributed.

---

## Final Vision

KalaGanaka aims to make astronomy more understandable through a combination of historical context, scientific calculation, and hands-on exploration.

The Konark Chakra serves as the central visual entry point into the history of timekeeping. The modern astronomical instrument provides a complementary way to understand solar position and time calculations. The remaining modules extend this experience to solar calendars, lunar cycles, Panchang, planetary motion, comparative analysis, and conversational learning.

**KalaGanaka — Ancient Wisdom. Modern Science. One Interactive Cosmos.**
