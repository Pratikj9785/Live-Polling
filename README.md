## Live Polling Application

React + Express + Socket.io app for real-time teacher-led polls with live results for students. Built for quick local development and easy hosting of both frontend and backend.

### Teacher Features
- **Create a new poll**: Set question, options, and duration.
- **View live polling results**: See vote counts update in real time while the poll is active and final results after close.
- **Ask a new question only if**:
  - **No question has been asked yet**, or
  - **All students have answered the previous question** (auto-close on all submissions), or the question is already closed.
- **Close poll early**: End the current poll manually.
- **Remove a student (Good-to-have)**: Kick a participant from the session.

### Student Features
- **Enter name on first visit (unique per tab)**: Name is stored in `sessionStorage`; each browser tab gets a unique suffix.
- **Submit one answer** once a question is active.
- **View live polling results after submission**: Sees live counts while the question is open; sees final results after close.
- **60s default time limit**: Poll auto-closes at deadline and shows results. Teacher can configure time (30/60/90s in UI).

### Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Redux Toolkit, Socket.IO Client
- **Backend**: Node.js, Express.js, Socket.IO Server, CORS, dotenv
- **Tooling**: Workspaces (root), Nodemon (dev), npm-run-all (root), optional Docker (server)

### Monorepo Structure
```
.
├─ package.json                # root workspace and scripts
├─ Procfile                    # process declaration (e.g., Render/Heroku)
├─ client/                     # React app (Vite + Redux + Tailwind)
│  ├─ package.json
│  └─ src/
│     ├─ services/socket.js    # Socket.IO client, uses VITE_SERVER_URL
│     ├─ store/pollSlice.js    # UI state and live counts
│     ├─ routes/{Home,Teacher,Student,Question}.jsx
│     └─ components/{Countdown,OptionButton,Participants,Results}.jsx
└─ server/                     # Express + Socket.IO backend
   ├─ package.json
   ├─ Dockerfile
   └─ src/{index.js,models.js,socket.js}
```

### How It Works (High-Level)
- Teacher and students connect via WebSockets.
- Teacher emits `poll:create` with question, options, and `durationSec`.
- Server broadcasts `poll:active` and starts the countdown; students answer via `poll:answer`.
- Live counts are broadcast with `poll:update` as answers arrive.
- Poll auto-closes on timeout or when all students have answered; server emits `poll:closed` with final tallies and correct option.
- Participants list is broadcast via `participants:update`.

Socket events (selected):
- Client → Server: `session:join`, `poll:create` (teacher), `poll:answer` (student), `poll:close` (teacher), `participants:kick` (teacher)
- Server → Client: `poll:active`, `poll:update`, `poll:closed`, `poll:history`, `participants:update`

### Installation
Prerequisites: Node.js 20+

1) Install dependencies at repo root (workspaces will install both apps):
```
npm install
```

2) Create environment files:
- Server (`server/.env`):
```
# Comma-separated origins or * for all
CORS_ORIGIN=http://localhost:5173
PORT=4000
```
- Client (`client/.env` or `client/.env.local`):
```
VITE_SERVER_URL=http://localhost:4000
```

### Running Locally
- From the repo root (runs server and client concurrently):
```
npm run dev
```
  - Server: `http://localhost:4000` (health: `/health`)
  - Client: `http://localhost:5173`

Run individually if needed:
```
# In one terminal
npm --workspace server run dev

# In another terminal
npm --workspace client run dev
```

### Production Build
- Client build:
```
npm --workspace client run build
```
- Server start:
```
npm --workspace server run start
```

### Deployment / Hosting
You must host both frontend and backend and share the deployed link(s).

Options:
- Vercel: `client/vercel.json` and `server/vercel.json` included (one project per app). Set env vars and deploy both; set `VITE_SERVER_URL` in client to your server URL.
- Render/Heroku: `Procfile` present at root; alternatively deploy `server` as a web service and `client` as a static site. Set `CORS_ORIGIN` on server to the public client URL. Set `VITE_SERVER_URL` on client to the public server URL.
- Docker: `server/Dockerfile` provided for backend containerization.

### Feature Compliance Mapping
- Must-haves
  - Functional system: Implemented end-to-end with live results and auto-close.
  - Hosting both sides: Supported; see Deployment.
  - Teacher creates polls; students answer: Implemented.
  - Both can view results: Implemented (live and final).
  - UI follows shared Figma: Tailwind-based UI aligned to the provided layout. Ensure final polish per design system before submission.

- Good to have
  - Configurable poll time limit: Implemented (30/60/90s).
  - Remove a student: Implemented via “Kick” in Participants list.
  - Well-designed UI: Implemented with Tailwind and clean components.

- Bonus (brownie points)
  - Chat popup: Not implemented.
  - Teacher views past poll results (not stored locally): Implemented in-session via `pollHistory` (server memory) and UI “Poll History.” Not persisted across deployments/restarts.

### Figma Alignment Notes
- The layout uses a centered container, card surfaces, clear button hierarchy, and responsive spacing consistent with a modern Figma design. If a specific Figma file was provided, validate spacing, colors, and typography tokens before submission.

### Security & Limits
- CORS is restricted via `CORS_ORIGIN` (comma-separated list allowed). For local dev, set to client origin.
- Students can only answer while poll is active and before the deadline.
- Teacher-only actions are validated server-side by role.

### Troubleshooting
- Socket connection fails in client: confirm `VITE_SERVER_URL` points to live backend URL and that server allows your client origin via `CORS_ORIGIN`.
- Clock skew edge cases: Countdown uses client time; server enforces deadline, so small drift will not allow late submissions.

### Scripts Reference
- Root
  - `npm run dev`: run server and client in parallel
  - `npm run start`: start server only
- Server
  - `npm run dev`: nodemon on `src/index.js`
  - `npm run start`: node `src/index.js`
- Client
  - `npm run dev`: Vite dev server
  - `npm run build`: production bundle
  - `npm run preview`: preview static build

### Submission Guidelines
- **Deadline**: 16/09/2025, EOD
- **Submission Method**: Email only
- **Email To**: `pallavi@intervue.info`
- **Email Subject**: `SDE INTERN ASSIGNMENT SUBMISSION`

Include the following in your email body:
```
Name: [Your Full Name]
Phone Number: [Your Contact Number]
Email ID: [Your Email Address]
LinkedIn URL: [Your LinkedIn Profile Link]
APPLIED VIA GOOGLE FORM: YES/NO
Assignment Link: [Hosted/Deployed Link]
```

### License
MIT


