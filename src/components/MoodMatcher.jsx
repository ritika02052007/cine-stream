import { useState } from "react";
import { getTitleFromMood, searchMovies } from "../api.js";

export default function MoodMatcher({ onResult }) {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mood.trim()) return;
    setLoading(true);
    setError("");
    try {
      const title = await getTitleFromMood(mood); // 1. LLM -> title
      const data = await searchMovies(title); // 2. silent TMDB search
      if (!data.results.length) throw new Error(`No movie found for "${title}".`);
      onResult(data.results[0]); // 3. render
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mood" onSubmit={handleSubmit}>
      <input
        type="text"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder='🤖 Mood Matcher: "I am feeling sad but want an action movie"'
      />
      <button type="submit" disabled={loading}>
        {loading ? "Thinking..." : "Match my mood"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
