import { Users, ArrowRight, ShieldCheck } from "lucide-react";
import heroScene from "../assets/landing/hero-scene.jpg";
import "./landing.css";

export default function Hero({ onSelectRole }) {
  return (
    <section id="home" className="ks-hero">
      <div className="ks-hero__inner">
        <div className="ks-hero__scene" aria-hidden="true">
          <img src={heroScene} alt="" draggable={false} />
        </div>

        <div className="ks-hero__copy">
          <div className="ks-badge">
            <span>AI-DRIVEN</span>
            <i />
            <span>DATA-POWERED</span>
            <i />
            <span>COMMUNITY-FOCUSED</span>
          </div>

          <h1 className="ks-hero__title">
            <span>Monitoring the</span>
            <span>World.</span>
            <span>
              Protecting <em>Every</em>
            </span>
            <em>Life.</em>
          </h1>

          <div className="ks-hero__rule">
            <span />
            <b>
              <ShieldCheck size={16} strokeWidth={2.6} />
            </b>
            <span />
          </div>

          <p className="ks-hero__lead">
            An intelligent platform to monitor diseases worldwide,
            <br className="ks-br" /> predict outbreak risks, and provide timely precautionary
            <br className="ks-br" /> advisories for a healthier tomorrow.
          </p>

          <button type="button" className="ks-cta" onClick={() => onSelectRole && onSelectRole("user")}>
            <Users size={40} strokeWidth={1.5} className="ks-cta__icon" />
            <span className="ks-cta__text">
              <strong>Get Started!</strong>
              <small>View data, alerts &amp; trends</small>
            </span>
            <ArrowRight size={26} className="ks-cta__arrow" />
          </button>

          <div className="ks-trusted">
            <ShieldCheck size={15} />
            <span>Trusted by Health Authorities Worldwide</span>
          </div>
        </div>
      </div>
    </section>
  );
}
