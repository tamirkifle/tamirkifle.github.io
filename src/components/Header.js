import { useState } from "react";
import { Burger, StyledMenu } from "./utility/ResponsiveUtilities";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleThemeToggle = () => {
    toggleTheme();
    setOpen(false); // Close mobile menu when theme is toggled
  };

  return (
    <header className="primary-header sticky">
      <div className="container">
        <div className="hamburger">
          <Burger open={open} setOpen={setOpen} />
          <StyledMenu open={open}>
            <a href="#about" onClick={() => setOpen(!open)}>
              <span role="img" aria-label="about">
                💁🏻‍♂️
              </span>
              About
            </a>
            <a href="#portfolio" onClick={() => setOpen(!open)}>
              <span role="img" aria-label="portfolio">
                🖼
              </span>
              Projects
            </a>
            <button 
              onClick={handleThemeToggle}
              className="theme-toggle-btn"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </StyledMenu>
        </div>
        <nav className="primary-nav">
          <ul className="split">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#portfolio">Projects</a>
            </li>
            <li>
              <button 
                onClick={toggleTheme}
                className="theme-toggle-btn"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? "☀️" : "🌙"}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
