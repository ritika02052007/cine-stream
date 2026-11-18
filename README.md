# Cine-Stream

Netflix-lite movie explorer built with React + Vite + TMDB.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in your keys
3. `npm run dev`
## Features
- Popular movies in a CSS grid (poster, title, year, rating)
- Debounced search (500ms)
- Infinite scroll with IntersectionObserver
- Favorites synced to localStorage, `/favorites` route
- Native lazy-loaded images, placeholder for missing posters
- AI Mood Matcher (Gemini -> TMDB search)

## Deploy (Vercel/Netlify)
Add `VITE_TMDB_KEY`, `VITE_GEMINI_KEY` (and optionally `VITE_GEMINI_MODEL`) as environment variables, then redeploy.
