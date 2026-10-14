import { ShieldCheck, Users, Leaf } from "lucide-react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import emblem from "../assets/landing/emblem.png";
import scene from "../assets/landing/footer-scene.jpg";
import "./landing.css";

const PILLARS = [
  { icon: ShieldCheck, title: "Early Detection", sub: "Saves Lives" },
  { icon: Users, title: "Stronger Communities", sub: "Empowered" },
  { icon: Leaf, title: "Healthier Tomorrow", sub: "Sustainable" },
];

export default function Footer() {
  return (
    <footer className="ks-footer">
      <img src={scene} alt="" aria-hidden="true" className="ks-footer__scene" draggable={false} />

      <div className="ks-footer__inner">
        <div className="ks-footer__brand">
          <img src={emblem} alt="" />
          <div>
            <strong>KARNA SURAKSHA</strong>
            <small>Hyperlocal Disease Surveillance Platform</small>
          </div>
        </div>

        <p className="ks-footer__tag">
          Healthier Communities, A Safer <span>Tomorrow.</span>
        </p>

        <ul className="ks-footer__pillars">
          {PILLARS.map(({ icon: Icon, title, sub }) => (
            <li key={title}>
              <Icon size={18} />
              <strong>{title}</strong>
              <small>{sub}</small>
            </li>
          ))}
        </ul>

        <div className="ks-footer__social">
          <h4>Connect With Us</h4>
          <div>
            <a href="#" aria-label="Twitter">
              <FaTwitter size={16} />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedin size={16} />
            </a>
            <a href="#" aria-label="GitHub">
              <FaGithub size={16} />
            </a>
          </div>
        </div>

        <p className="ks-footer__copy">© 2024 Karna Suraksha. All rights reserved.</p>
      </div>
    </footer>
  );
}
