import { useFavorites } from "../context/FavoritesContext.jsx";
import MovieCard from "../components/MovieCard.jsx";

export default function Favorites() {
  const { favorites } = useFavorites();
  return (
    <>
      <h2 className="section-title">My Favorites</h2>
      {favorites.length === 0 ? (
        <p className="status">No favorites yet. Tap the ♡ on any movie.</p>
      ) : (
        <section className="grid">
          {favorites.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </section>
      )}
    </>
  );
}
