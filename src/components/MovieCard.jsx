import { IMG_BASE } from "../api.js";
import { useFavorites } from "../context/FavoritesContext.jsx";

export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(movie.id);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "NR";

  return (
    <article className="card">
      {movie.poster_path ? (
        <img
          src={`${IMG_BASE}${movie.poster_path}`}
          alt={movie.title}
          loading="lazy"
        />
      ) : (
        <div className="no-poster">No Poster</div>
      )}

      <button
        className={`heart ${fav ? "active" : ""}`}
        onClick={() => toggleFavorite(movie)}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      >
        {fav ? "♥" : "♡"}
      </button>

      <div className="card-info">
        <h3 title={movie.title}>{movie.title}</h3>
        <div className="meta">
          <span>{year}</span>
          <span className="rating">★ {rating}</span>
        </div>
      </div>
    </article>
  );
}
