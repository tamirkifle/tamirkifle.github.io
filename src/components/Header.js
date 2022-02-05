export default function Header() {
  return (
    <header className="sticky">
      <nav className="primary-nav">
        <ul className="split">
          <li>
            <a href="#" className="active">
              Home
            </a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#portfolio">Portfolio</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
