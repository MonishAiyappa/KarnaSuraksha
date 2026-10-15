import {
  Map as MapIcon,
  BarChart3,
  Shield,
  UserRound,
  House,
  ChevronRight,
  ArrowUpRight,
  X,
} from "lucide-react";
import emblem from "../assets/landing/emblem.png";
import spreadMap from "../assets/landing/spread-map.jpg";
import precautionArt from "../assets/landing/precaution-art.jpg";
import "./landing.css";

const INSIGHTS = [
  { name: "Dengue", dot: "#12875a" },
  { name: "Influenza", dot: "#12875a" },
  { name: "Chikungunya", dot: "#f2b320" },
  { name: "Malaria", dot: "#f19a1f", hl: true },
];

const TOPICS = [
  ["Fever", "Home care tips"],
  ["Cough", "What to avoid care"],
  ["Stomach ache", "Home remedies"],
];

function Card({ icon: Icon, title, badge, className = "", children, aside }) {
  return (
    <article className={`ks-card ${className}`}>
      <div className="ks-card__icon">
        <Icon size={24} strokeWidth={1.8} />
      </div>
      <div className="ks-card__body">
        <h3>
          {title}
          {badge && <span className="ks-chip">{badge}</span>}
        </h3>
        {children}
      </div>
      {aside}
    </article>
  );
}

export default function PlatformCapabilities() {
  return (
    <section id="features" className="ks-features">
      <div className="ks-wrap">
        <p className="ks-eyebrow">Our Features</p>
        <h2 className="ks-h2 ks-h2--wide">
          Everything You Need for a Safer, Healthier Tomorrow
        </h2>
        <p className="ks-features__lead">
          Powerful features to help you stay informed, respond faster, and keep your community
          healthy.
        </p>

        <div className="ks-fgrid">
          {/* Arrows connecting the center emblem to the feature cards */}
          <svg
            className="ks-connectors"
            viewBox="0 0 1000 420"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <marker
                id="ks-arrowhead"
                markerWidth="9"
                markerHeight="9"
                refX="7.5"
                refY="4.5"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M0,0 L9,4.5 L0,9 Z" fill="#16834b" />
              </marker>
            </defs>

            <path d="M430 66 H405" markerEnd="url(#ks-arrowhead)" />
            <path d="M570 66 H595" markerEnd="url(#ks-arrowhead)" />
            <path d="M430 168 H405" markerEnd="url(#ks-arrowhead)" />
            <path d="M570 168 H595" markerEnd="url(#ks-arrowhead)" />
          </svg>

          {/* Predictive Spread Map */}
          <div className="ks-fgrid__a ks-card ks-card--media">
            <img
              src={spreadMap}
              alt="Predicted spread heat map"
              className="ks-media ks-media--dark"
            />
            <div className="ks-card__icon">
              <MapIcon size={24} strokeWidth={1.8} />
            </div>
            <div className="ks-card__body">
              <h3>
                Predictive Spread Map <span className="ks-chip">AI-Powered</span>
              </h3>
              <ul>
                <li className="ks-li-head">7-14 day estimated zone map using:</li>
                <li>Case clusters + population density</li>
                <li>Historical patterns</li>
                <li>Serious pings</li>
                <li>Prepare for outbreaks</li>
                <li>Plan resource better</li>
              </ul>
            </div>
          </div>

          {/* Center emblem */}
          <div className="ks-fgrid__c ks-center">
            <img src={emblem} alt="Karna Suraksha" />
            <h3>Karna Suraksha</h3>
            <p>
              Stay Informed,
              <br />
              Protected, Healthy
            </p>
          </div>

          {/* Risk Zone */}
          <Card
            icon={BarChart3}
            title="Risk Zone & Disease Insights"
            className="ks-fgrid__b ks-card--split"
            aside={
              <div className="ks-mini ks-mini--insights">
                <h5>Health Insights</h5>
                <ul>
                  {INSIGHTS.map((d) => (
                    <li key={d.name} className={d.hl ? "is-hl" : ""}>
                      <i style={{ background: d.dot }} />
                      <span>{d.name}</span>
                      <ArrowUpRight size={12} color="#e5412d" />
                    </li>
                  ))}
                </ul>
              </div>
            }
          >
            <p>Track, monitor, and analyse. Get real-time</p>
            <p className="ks-card__sub">insights on :</p>
            <ul>
              <li>Hotspot and high-risk zones</li>
              <li>Disease trends</li>
              <li>Seasonal patterns</li>
              <li>Variant emergence + Early warning alerts</li>
            </ul>
          </Card>

          {/* Precautionary Measures */}
          <div className="ks-fgrid__d ks-card ks-card--media ks-card--media-light">
            <img
              src={precautionArt}
              alt="Doctor wearing a mask"
              className="ks-media"
            />
            <div className="ks-card__icon">
              <Shield size={24} strokeWidth={1.8} />
            </div>
            <div className="ks-card__body">
              <h3>Precautionary Measures</h3>
              <ul>
                <li className="ks-li-head">Get clear information on:</li>
                <li>Disease-specific prevention steps</li>
                <li>Personal hygiene practices</li>
                <li>Ways to reduce exposure &amp; transmission</li>
                <li>Safe water &amp; sanitation measures</li>
                <li>Community-level protective actions</li>
              </ul>
            </div>
          </div>

          {/* Medical Assistant */}
          <Card
            icon={UserRound}
            title="Medical Assistant"
            className="ks-fgrid__e ks-card--split"
            aside={
              <div className="ks-mini ks-mini--chat">
                <div className="ks-chat__ask">
                  <UserRound size={14} /> Ask your health query...
                </div>
                <span>What are the symptoms of dengue?</span>
                <span>What precautions should I take?</span>
                <span>When to seek treatment?</span>
              </div>
            }
          >
            <p>24/7 AI assistant for your health.</p>
            <p className="ks-card__gap">
              Get answers, precautions,
              <br className="ks-br" /> guidance on:
            </p>
            <ul>
              <li>Common symptoms</li>
              <li>Treatment options</li>
              <li>Doctor consultation</li>
              <li>Stay informed, stay safer</li>
            </ul>
          </Card>

          {/* Home Relief */}
          <Card
            icon={House}
            title="Home Relief"
            className="ks-fgrid__f ks-card--split"
            aside={
              <div className="ks-mini ks-mini--topics">
                <h5>
                  Popular Topics <X size={12} />
                </h5>
                <ul>
                  {TOPICS.map(([a, b]) => (
                    <li key={a}>
                      <i />
                      <span>
                        {a} – {b}
                      </span>
                      <ChevronRight size={13} />
                    </li>
                  ))}
                  <li className="is-alert">
                    <i />
                    <span>View what&apos;s in a nearby limits</span>
                  </li>
                </ul>
              </div>
            }
          >
            <p>Need quick relief? Get home-care tips, symptom-based</p>
            <p>suggestions, and know when to see the doctor.</p>
            <ul>
              <li>Identify symptoms</li>
              <li>Safety dos &amp; donts</li>
            </ul>
          </Card>

          <p className="ks-fgrid__tag" aria-hidden="true">
            Healthy People
            <br />
            Stronger Communities
          </p>
        </div>
      </div>
    </section>
  );
}