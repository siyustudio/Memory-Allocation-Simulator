import type { Page } from "../types";

export function HeaderNav({
  currentPage,
  onNavigate,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}) {
  const isQuizActive =
    currentPage === "setup" || currentPage === "quiz" || currentPage === "result";

  return (
    <header className="brand-header">
      <button type="button" className="brand-logo" onClick={() => onNavigate("home")}>
        <span className="brand-mark">P</span>
        <span className="brand-name">Memory Parking</span>
      </button>

      <nav className="nav-tabs" aria-label="Menu Utama">
        <button
          type="button"
          className={`nav-tab ${currentPage === "home" ? "active" : ""}`}
          onClick={() => onNavigate("home")}
        >
          Beranda
        </button>
        <button
          type="button"
          className={`nav-tab ${currentPage === "learn" ? "active" : ""}`}
          onClick={() => onNavigate("learn")}
        >
          Belajar Materi
        </button>
        <button
          type="button"
          className={`nav-tab ${currentPage === "simulation" ? "active" : ""}`}
          onClick={() => onNavigate("simulation")}
        >
          Simulasi Memori
        </button>
        <button
          type="button"
          className={`nav-tab ${currentPage === "comparison" ? "active" : ""}`}
          onClick={() => onNavigate("comparison")}
        >
          Perbandingan Algoritma
        </button>
        <button
          type="button"
          className={`nav-tab ${isQuizActive ? "active" : ""}`}
          onClick={() => onNavigate("setup")}
        >
          Latihan / Kuis
        </button>
      </nav>
    </header>
  );
}
