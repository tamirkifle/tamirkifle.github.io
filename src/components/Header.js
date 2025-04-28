import { useState } from "react";
import { Burger, StyledMenu } from "./utility/ResponsiveUtilities";

export default function Header() {
  const [open, setOpen] = useState(false);
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
          </ul>
        </nav>
      </div>
    </header>
  );
}
