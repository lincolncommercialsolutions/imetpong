# IMETPONG Game Collection

A TypeScript-based game collection featuring classic arcade games with modern styling.

## Project Structure

```
tennis/
├── home.html           # Main landing page
├── pong.html          # Pong game page
├── backup.html        # Original backup (preserved)
├── index.html         # Current index (will be replaced)
├── games/
│   └── coming-soon.html
├── src/
│   ├── main.ts        # Home page logic
│   ├── games/
│   │   └── pong.ts    # Pong game logic
│   └── styles/
│       ├── main.css   # Global styles
│       └── pong.css   # Pong-specific styles
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Features

- TypeScript for type safety
- Vite for fast development and building
- Vercel Analytics integration
- Multi-page game collection
- Responsive design
- Secret cheat codes: `ball54`, `27`, `cat`, `time`

## Adding New Games

1. Create a new HTML file in the root or `games/` directory
2. Create a TypeScript file in `src/games/`
3. Add styles in `src/styles/`
4. Update `home.html` to add the game card
5. Update `vite.config.ts` input object

## Deployment

This project is configured for Vercel deployment with analytics enabled.
