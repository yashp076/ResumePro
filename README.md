# ResumePro

A professional, full-stack AI-powered resume builder that helps users create role-tailored resumes with intelligent content suggestions, real-time ATS scoring, and polished PDF export.

## Features

- **AI-Powered Content Suggestions** - Generate role-specific summaries, experience bullets, and skills using Groq (Llama) or Google Gemini AI
- **Real-Time ATS Score** - Live keyword matching analysis against target role requirements
- **Content Quality Analysis** - Automated checks for action verbs, quantified achievements, and section depth with actionable improvement tips
- **Role-Specific Tailoring** - Choose from 20+ predefined roles across Engineering, Design, Business, Marketing, Finance, and Healthcare
- **Live Preview** - Instant visual feedback as you build your resume
- **Multiple Templates** - Switch between Modern, Classic, and Minimal templates
- **PDF Export** - Download your resume as a polished, print-ready PDF
- **Auto-Save** - Automatic local persistence via browser localStorage
- **Import/Export** - Save and load resume data as JSON files
- **Custom Roles** - Define your own target role beyond the predefined library
- **Rate-Limited API** - Protected backend with request throttling and input validation
- **Responsive Design** - Works across desktop and tablet screen sizes

## Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **React Router** for client-side routing
- **Context API** for global state management
- **html2canvas + jsPDF** for client-side PDF generation
- **Lucide React** for iconography

### Backend
- **Express.js** REST API
- **Google Gemini AI** and **Groq (Llama)** for AI content generation
- **Helmet** for HTTP security headers
- **CORS** for cross-origin resource sharing
- **Express Validator** for request validation
- **Express Rate Limiter** for API protection
- **Morgan** for HTTP request logging
- **dotenv** for environment configuration

## Project Structure

```
ai-resume-builder/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx              # Main application layout
│   │   │   ├── ResumeForm.jsx       # Resume data entry form
│   │   │   ├── ResumePreview.jsx    # Live resume preview with templates
│   │   │   ├── AtsScore.jsx         # ATS keyword scoring widget
│   │   │   ├── QualityPanel.jsx     # Content quality analysis
│   │   │   ├── RoleInsights.jsx     # Target role display
│   │   │   ├── SuggestionsPanel.jsx # AI suggestion generator
│   │   │   ├── Field.jsx            # Reusable form field component
│   │   │   └── DemoStats.jsx        # Application metrics display
│   │   ├── context/
│   │   │   └── ResumeContext.jsx    # Global resume state management
│   │   ├── data/
│   │   │   ├── defaultResume.js     # Default resume template data
│   │   │   └── roles.js             # Fallback role categories
│   │   ├── lib/
│   │   │   ├── api.js               # API client functions
│   │   │   ├── ats.js               # ATS keyword analysis logic
│   │   │   ├── resumeQuality.js     # Content quality scoring
│   │   │   ├── pdf.js               # PDF export utility
│   │   │   └── storage.js           # localStorage persistence
│   │   ├── main.jsx                 # Application entry point
│   │   ├── styles.css               # Global styles and Tailwind
│   │   └── App.jsx                  # Root component
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   └── package.json
├── server/                          # Express backend
│   ├── src/
│   │   ├── index.js                 # Express app setup and middleware
│   │   ├── routes.js                # API route definitions
│   │   ├── ai.js                    # AI provider integration (Groq/Gemini)
│   │   ├── data/
│   │   │   └── roles.js             # Role library with ATS keywords
│   │   └── .env                     # Environment variables (gitignored)
│   ├── .env.example
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml                   # CI pipeline (lint + build)
├── package.json                     # Root workspace configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd ai-resume-builder
```

2. **Install dependencies**

```bash
npm install
```

This installs dependencies for both the client and server workspaces.

3. **Configure environment variables**

```bash
copy server\.env.example server\.env
```

Edit `server/.env` with your AI provider credentials:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_key_here
GROQ_MODEL=llama-3.1-8b-instant
GEMINI_API_KEY=your_gemini_key_here
GEMINI_MODEL=gemini-2.0-flash
```

**AI Provider Options:**
- **Groq (Recommended)** - Set `AI_PROVIDER=groq` and provide `GROQ_API_KEY`. Get a free key at [groq.com](https://groq.com)
- **Google Gemini** - Set `AI_PROVIDER=gemini` and provide `GEMINI_API_KEY`. Get a key at [ai.google.dev](https://ai.google.dev)

> **Note:** The application includes high-quality fallback suggestions when no AI provider is configured, so you can use all features without an API key.

4. **Start the development server**

```bash
npm run dev
```

This starts both the frontend (port 5173) and backend (port 5000) concurrently. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run build` | Build the frontend for production |
| `npm start` | Start the backend server only |
| `npm run lint` | Run lint checks on both client and server |
| `npm run preview` | Preview the production build (client only) |

## API Reference

### `GET /api/roles`

Returns the complete role library organized by category.

**Response:**
```json
{
  "categories": [
    {
      "category": "Engineering",
      "roles": [
        { "title": "Software Engineer", "keywords": ["JavaScript", "React", ...] },
        ...
      ]
    },
    ...
  ]
}
```

### `POST /api/ai/suggestions`

Generate AI-powered resume content suggestions for a specific section.

**Request Body:**
```json
{
  "role": "Software Engineer",
  "section": "experience",
  "context": {
    "yearsOfExperience": 3,
    "industry": "Technology",
    "currentContent": ""
  }
}
```

**Supported Sections:** `summary`, `experience`, `skills`

**Response:**
```json
{
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "keywords": ["keyword1", "keyword2", ...],
  "tip": "Practical writing tip",
  "source": "groq"
}
```

**Rate Limit:** 20 requests per minute

### `POST /api/resume/export-pdf`

Reserved for future server-side PDF export. Currently returns a 501 status directing clients to use the built-in client-side PDF export.

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "ok": true,
  "service": "ai-resume-builder-api"
}
```

## How It Works

### ATS Scoring

The ATS (Applicant Tracking System) score compares your resume content against a curated keyword library for your target role. Keywords are extracted from real job descriptions and matched against your resume text in real-time. The score is calculated as the percentage of role-specific keywords found in your resume.

### Content Quality Analysis

The quality engine evaluates your resume on four dimensions:
- **Summary quality** - Word count and completeness (25% weight)
- **Quantified achievements** - Presence of metrics, numbers, and percentages in bullets (30% weight)
- **Strong action verbs** - Bullet points starting with impactful verbs (25% weight)
- **Skills depth** - Number and relevance of listed skills (20% weight)

Actionable tips are generated when any dimension falls below the recommended threshold.

### AI Suggestions

When you click "Generate" on any AI Suggestions panel, the request is sent to the configured AI provider (Groq or Gemini). The prompt instructs the AI to return:
- 3-8 resume-ready suggestions specific to your role and section
- 6-10 ATS keywords relevant to the role
- One practical writing tip

If the AI provider is unavailable or rate-limited, the system seamlessly falls back to high-quality deterministic suggestions based on role keywords and industry context.

### Data Persistence

All resume data is stored in the browser's localStorage under the key `ai-resume-builder:data`. Changes are saved automatically as you type. No user account or server-side database is required.

## Role Library

The application includes a curated library of 20+ roles across 6 categories:

| Category | Roles |
|----------|-------|
| **Engineering** | Software Engineer, Data Engineer, DevOps Engineer, QA Engineer, Machine Learning Engineer |
| **Design** | UI/UX Designer, Graphic Designer, Product Designer |
| **Business** | Product Manager, Business Analyst, Operations Manager, Strategy Analyst |
| **Marketing** | Digital Marketing Manager, Content Marketer, SEO Specialist, Growth Marketer |
| **Finance** | Financial Analyst, Accountant, Venture Capital Analyst |
| **Healthcare** | Registered Nurse, Doctor, Healthcare Administrator |

Each role comes with 6 curated ATS keywords used for scoring and AI context.

## Deployment

### Frontend

Build the production bundle:

```bash
npm run build
```

The output is in `client/dist/` and can be served by any static file server (Netlify, Vercel, Cloudflare Pages, etc.).

### Backend

Deploy the Express server to any Node.js hosting platform (Railway, Render, Fly.io, AWS, etc.). Set the required environment variables in your platform's configuration.

### Environment Variables for Production

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Server port |
| `CLIENT_ORIGIN` | No | `http://localhost:5173` | Allowed frontend origin(s), comma-separated |
| `AI_PROVIDER` | No | `gemini` | AI provider: `groq` or `gemini` |
| `GROQ_API_KEY` | Conditional | - | Required if using Groq |
| `GROQ_MODEL` | No | `llama-3.1-8b-instant` | Groq model to use |
| `GEMINI_API_KEY` | Conditional | - | Required if using Gemini |
| `GEMINI_MODEL` | No | `gemini-2.0-flash` | Gemini model to use |

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on every push and pull request to `main`:

1. Checks out the code
2. Sets up Node.js 22 with npm caching
3. Installs dependencies
4. Runs lint checks
5. Builds the frontend

## License

Private. All rights reserved.
