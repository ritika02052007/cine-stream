import { useState } from "react";
import useDebounce from "../hooks/useDebounce.js";
import MovieResults from "../components/MovieResults.jsx";
import MoodMatcher from "../components/MoodMatcher.jsx";
import MovieCard from "../components/MovieCard.jsx";
export default function Home() {
  const [input, setInput] = useState("");
  const [moodMovie, setMoodMovie] = useState(null);
  const query = useDebounce(input.trim(), 500); // only changes after 500ms pause

  return (
    <>
      <input
        className="search"
        type="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search movies..."
      />

      <MoodMatcher onResult={setMoodMovie} />

      {moodMovie && (
        <section className="mood-result">
          <h2>
            Your mood pick
            <button onClick={() => setMoodMovie(null)}>Dismiss</button>
          </h2>
          <div className="grid single">
            <MovieCard movie={moodMovie} />
          </div>
        </section>
      )}

      <h2 className="section-title">
        {query ? `Results for "${query}"` : "Popular Movies"}
      </h2>

      <MovieResults key={query} query={query} />
    </>
  );
}
