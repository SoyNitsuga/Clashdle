import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import CollectionPage from "./pages/CollectionPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/collection" element={<CollectionPage />} />
      </Routes>
    </>
  );
}