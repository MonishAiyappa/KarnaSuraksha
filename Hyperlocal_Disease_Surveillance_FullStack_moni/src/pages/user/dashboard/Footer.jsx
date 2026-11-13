import {
  HeartPulse,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import emblem from "../../../assets/landing/emblem.png";

import "../UserDashboard.css";


// ============================================================
// PORTAL FOOTER (shown under every user page)
// ============================================================

const PILLARS = [
  { key: "safe", Icon: ShieldCheck, text: "Safe Communities" },
  { key: "health", Icon: HeartPulse, text: "Better Health" },
  { key: "together", Icon: Users, text: "Stronger Together" },
];


export default function Footer() {

  return (

    <footer className="ud-footer">

      <div className="ud-footer-inner">

        <div className="ud-footer-brand">

          <img
            src={emblem}
            alt=""
            draggable="false"
          />

          <div>

            <strong>Karna Suraksha</strong>

            <small>Disease Surveillance Platform</small>

          </div>

        </div>


        <ul className="ud-footer-pillars">

          {PILLARS.map(({ key, Icon, text }) => (

            <li key={key}>

              <Icon aria-hidden="true" />

              <span>{text}</span>

            </li>

          ))}

        </ul>


        <p className="ud-footer-copy">
          © {new Date().getFullYear()} Karna Suraksha. All rights reserved.
        </p>


        <div className="ud-footer-social">

          <h3>Connect With Us</h3>

          <div>

            <a
              href="#"
              aria-label="Twitter"
              onClick={(event) => event.preventDefault()}
            >
              <FaTwitter className="ud-ico-desktop" />
              <FaXTwitter className="ud-ico-phone" />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              onClick={(event) => event.preventDefault()}
            >
              <FaLinkedin />
            </a>

            <a
              href="#"
              aria-label="GitHub"
              onClick={(event) => event.preventDefault()}
            >
              <FaGithub />
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}
