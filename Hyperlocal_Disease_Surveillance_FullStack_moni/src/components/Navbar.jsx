import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import DropdownMenu from "./DropdownMenu";
import emblem from "../assets/landing/emblem.png";
import "./landing.css";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Features", href: "#features" },
];

export default function Navbar({ onSelectRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`ks-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="ks-nav__inner">
        <a href="#home" className="ks-brand" onClick={() => setActive("#home")}>
          <img src={emblem} alt="Karna Suraksha emblem" className="ks-brand__logo" />
          <span className="ks-brand__text">
            <span className="ks-brand__name">KARNA SURAKSHA</span>
            <span className="ks-brand__sub">Disease Surveillance Platform</span>
          </span>
        </a>

        <nav className="ks-nav__links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setActive(l.href)}
              className={`ks-nav__link ${active === l.href ? "is-active" : ""}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ks-nav__menu">
          <button
            type="button"
            className="ks-nav__burger"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={30} strokeWidth={2.4} /> : <Menu size={30} strokeWidth={2.4} />}
          </button>

          <DropdownMenu
            isOpen={isOpen}
            onSelectRole={(role) => {
              setIsOpen(false);
              onSelectRole && onSelectRole(role);
            }}
            links={NAV_LINKS}
            onNavigate={(href) => {
              setActive(href);
              setIsOpen(false);
            }}
          />
        </div>
      </div>
    </header>
  );
}
