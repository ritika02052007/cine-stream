import { useEffect, useRef, useState } from "react";
import { getPopular, searchMovies } from "../api.js";
import MovieCard from "./MovieCard.jsx";

// Remounted (via `key`) whenever the query changes, so state resets cleanly.
export default function MovieResults({ query }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sentinelRef = useRef(null);

  // Fetch whenever the page (or query) changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const request = query ? searchMovies(query, page) : getPopular(page);
    request
      .then((data) => {
        if (cancelled) return;
        // append without overwriting; skip duplicates TMDB sometimes returns
        setMovies((prev) => {
          const seen = new Set(prev.map((m) => m.id));
          return [...prev, ...data.results.filter((m) => !seen.has(m.id))];
        });
        setTotalPages(Math.min(data.total_pages, 500)); // TMDB caps at 500
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [query, page]);

  // Infinite scroll: observe the invisible div at the bottom of the grid
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && !error && page < totalPages) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loading, error, page, totalPages]);

  return (
    <>
      {error && <p className="error">{error}</p>}
      <section className="grid">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </section>

      {!loading && !error && movies.length === 0 && (
        <p className="status">No movies found{query ? ` for "${query}"` : ""}.</p>
      )}
      {loading && <p className="status">Loading...</p>}
      {!loading && page >= totalPages && movies.length > 0 && (
        <p className="status">You've reached the end.</p>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />
    </>
  );
}
