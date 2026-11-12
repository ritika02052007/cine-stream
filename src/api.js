const TMDB_BASE = "https://api.themoviedb.org/3";
const KEY = import.meta.env.VITE_TMDB_KEY;

export const IMG_BASE = "https://image.tmdb.org/t/p/w500";

// A v4 Read Access Token is a long JWT; a v3 key is a 32-char string.
async function tmdb(path, params = {}) {
  if (!KEY) throw new Error("Missing VITE_TMDB_KEY. Add it to your .env file.");

  const isToken = KEY.length > 40;
  const url = new URL(TMDB_BASE + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  if (!isToken) url.searchParams.set("api_key", KEY);

  const res = await fetch(url, {
    headers: isToken ? { Authorization: `Bearer ${KEY}` } : {},
  });
  if (!res.ok) throw new Error(`TMDB request failed (${res.status})`);
  return res.json();
}

export const getPopular = (page = 1) => tmdb("/movie/popular", { page });

export const searchMovies = (query, page = 1) =>
  tmdb("/search/movie", { query, page, include_adult: false });

// ---- Mood Matcher: Gemini returns ONE title, which we feed to TMDB search ----
export async function getTitleFromMood(mood) {
  const key = import.meta.env.VITE_GEMINI_KEY;
  const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
  if (!key) throw new Error("Missing VITE_GEMINI_KEY. Add it to your .env file.");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Suggest ONE movie based on this mood: ${mood}. Return ONLY the movie title as a plaintext string.`,
              },
            ],
          },
        ],
      }),
    }
  );
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);

  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  // sanitize: first line only, strip quotes, asterisks, trailing "(year)"
  return raw
    .split("\n")[0]
    .replace(/["'*`]/g, "")
    .replace(/\(\d{4}\)\s*$/, "")
    .trim();
}
