# Roll Royale 🎲

A beautiful, modern raffle/draw application built with React, Convex, and deployed on GitHub Pages.

## Features

- 🎯 Create draw sessions with multiple participants and items
- ⏱️ Cooldown system to prevent repeated wins
- 🎵 Custom winner sound effects
- 📊 Global history tracking across all sessions
- 🎨 Beautiful UI with smooth animations
- 📱 Responsive design

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Convex (serverless backend)
- **UI**: Tailwind CSS, Radix UI, Framer Motion
- **Routing**: React Router v7
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/celestialchips/roll-royale.git
cd roll-royale
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Get your Convex URL:
   - Go to [Convex Dashboard](https://dashboard.convex.dev)
   - Create a new project or use an existing one
   - Copy your deployment URL
   - Add it to `.env`:
```
VITE_CONVEX_URL=https://your-project.convex.cloud
```

5. Start the Convex development server:
```bash
npx convex dev
```

6. In a separate terminal, start the Vite dev server:
```bash
pnpm dev
```

7. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

1. Set up the Convex production deployment:
```bash
npx convex deploy
```

2. Add your production Convex URL to GitHub Secrets:
   - Go to your repository settings
   - Navigate to Secrets and Variables > Actions
   - Add a new secret named `VITE_CONVEX_URL`
   - Paste your production Convex URL

3. Enable GitHub Pages:
   - Go to repository Settings > Pages
   - Under "Build and deployment", select "GitHub Actions" as the source

4. Push to main branch - the site will automatically deploy!

### Manual Deployment

You can also deploy manually:

```bash
# Build the project
pnpm run predeploy

# Deploy to GitHub Pages
pnpm run deploy
```

## Project Structure

```
roll-royale/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── SessionSetup.tsx
│   │   ├── NamePicker.tsx
│   │   └── LogoDropdown.tsx
│   ├── pages/            # Page components
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   ├── History.tsx
│   │   └── NotFound.tsx
│   ├── convex/           # Convex backend
│   │   ├── draws.ts      # Draw logic and mutations
│   │   ├── schema.ts     # Database schema
│   │   └── auth.ts       # Authentication (if needed)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── main.tsx          # App entry point
├── public/               # Static assets
│   └── audio/           # Winner sound effects
└── vite.config.ts       # Vite configuration
```

## Adding Custom Audio Files

1. Add `.wav` audio files to `public/audio/`
2. Update the `AUDIO_OPTIONS` array in `src/components/SessionSetup.tsx`:

```typescript
const AUDIO_OPTIONS = [
  { value: "none", label: "No Audio" },
  { value: "/audio/your-sound.wav", label: "Your Sound Name" },
  // ... other options
];
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes!
