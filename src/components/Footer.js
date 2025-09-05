import githubIcon from "../images/icons/icons8-github.svg";
import twitterIcon from "../images/icons/icons8-twitter-circled.svg";
import linkedinIcon from "../images/icons/icons8-linkedin-circled.svg";

export default function Footer() {
  return (
    <footer className="primary-footer" id="contact">
      <div className="primary--footer--socials">
        <ul>
          <li>
            <a href="https://github.com/tamirkifle">
              <img src={githubIcon} alt="Tamir's Github" />
            </a>
          </li>
          <li>
            <a href="https://twitter.com/CallusedHuman">
              <img src={twitterIcon} alt="Tamir's Twitter" />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/tamir-yirga">
              <img src={linkedinIcon} alt="Tamir's Linkedin" />
            </a>
          </li>
        </ul>
      </div>
      <p className="footnote">
        &copy; 2025 Tamir Kifle Yirga. All Rights Reserved.
      </p>
    </footer>
  );
}
