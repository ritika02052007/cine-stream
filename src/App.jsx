import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import { useFavorites } from "./context/FavoritesContext.jsx";

export default function App() {
  const { favorites } = useFavorites();

  return (
    <>
      <header className="navbar">
        <NavLink to="/" className="logo">CINE<span>STREAM</span></NavLink>
        <nav>
          <NavLink to="/" end>Discover</NavLink>
          <NavLink to="/favorites">My Favorites ({favorites.length})</NavLink>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<p className="status">Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
