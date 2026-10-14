import { Hospital, ShieldCheck, Target } from "lucide-react";
import scenery from "../assets/landing/about-scenery.jpg";
import kodaguMap from "../assets/landing/kodagu-map.jpg";
import "./landing.css";

const PILLARS = [
  { icon: Hospital, title: "Local Health", text: "Data from Hospitals,|Rural Health Workers" },
  { icon: ShieldCheck, title: "Expert Review", text: "Medical professionals|validate and verify" },
  { icon: Target, title: "Actionable Insights", text: "From real data to|proactive change" },
];

const ZONES = [
  { label: "High", count: 7, color: "#e5412d", tint: "#fde3df" },
  { label: "Medium", count: 14, color: "#f19a1f", tint: "#fdf0d6" },
  { label: "Low", count: 21, color: "#b8c81f", tint: "#f3f6cf" },
  { label: "Ponnampet", count: 5, color: "#12875a", tint: "#d8efe5", highlight: true },
];

const REPORTS = [
  ["Chikungunya", "7 Sep"],
  ["Influenza", "5 Sep"],
  ["Chikungunya", "3 Sep"],
  ["H1N1 (Confirmed)", "1 Sep"],
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const SERIES = [
  { name: "Respiratory", color: "#1f9a8a", pts: [22, 26, 38, 18, 30, 24, 17, 16] },
  { name: "Heat-borne", color: "#e5412d", pts: [17, 16, 20, 26, 22, 24, 21, 24] },
  { name: "Gastrointestinal", color: "#176c47", pts: [20, 24, 36, 18, 26, 22, 16, 14] },
];
const EXTRA = [
  { color: "#5aa9d6", pts: [null, null, null, 38, 22, 38, 24, 36] },
  { color: "#f2b320", pts: [null, null, null, 24, 38, 26, 34, 24] },
  { color: "#f19a1f", pts: [null, null, null, 20, 26, 20, 26, 34] },
];

function TrendChart() {
  const w = 260,
    h = 96,
    max = 40;
  const x = (i) => 18 + (i * (w - 26)) / (MONTHS.length - 1);
  const y = (v) => h - 14 - (v / max) * (h - 22);
  return (
    <svg viewBox={`0 0 ${w} ${h + 12}`} className="ks-trend" role="img" aria-label="Disease trends by month">
      {[0, 10, 20, 30, 40].map((t) => (
        <g key={t}>
          <line x1="18" x2={w - 8} y1={y(t)} y2={y(t)} stroke="#dfe8e0" strokeWidth="0.6" />
          <text x="12" y={y(t) + 2.5} fontSize="6.5" fill="#7a8f84" textAnchor="end">
            {t}
          </text>
        </g>
      ))}
      {[...EXTRA, ...SERIES].map((s, k) => {
        const pts = s.pts.map((v, i) => (v == null ? null : [x(i), y(v)])).filter(Boolean);
        return (
          <g key={k}>
            <polyline fill="none" stroke={s.color} strokeWidth="1.1" strokeLinejoin="round" points={pts.map((p) => p.join(",")).join(" ")} />
            {pts.map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r="1.5" fill="#fff" stroke={s.color} strokeWidth="0.9" />
            ))}
          </g>
        );
      })}
      {MONTHS.map((m, i) => (
        <text key={m} x={x(i)} y={h + 6} fontSize="6.5" fill="#7a8f84" textAnchor="middle">
          {m}
        </text>
      ))}
    </svg>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="ks-about">
      <div className="ks-wrap ks-about__grid">
        <img src={scenery} alt="" aria-hidden="true" className="ks-about__scenery" draggable={false} />

        <div className="ks-about__copy">
          <p className="ks-eyebrow">About Karna Suraksha</p>
          <h2 className="ks-h2">
            From Local Data
            <br className="ks-br" /> to Safer Communities
          </h2>
          <p className="ks-about__lead">
            Karna Suraksha collects and analyses disease reports
            <br className="ks-br" /> from local clinics, hospitals and health workers. Our platform
            <br className="ks-br" /> turns this data into actionable insights — helping authorities
            <br className="ks-br" /> and communities stay one step ahead of outbreaks.
          </p>

          <ul className="ks-pillars">
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span className="ks-pillars__icon">
                  <Icon size={26} strokeWidth={2.4} />
                </span>
                <strong>{title}</strong>
                <small>
                  {text.split("|").map((t, i) => (
                    <span key={i}>{t}</span>
                  ))}
                </small>
              </li>
            ))}
          </ul>
        </div>

        <div className="ks-dash" aria-label="Sample district dashboard">
          <header className="ks-dash__head">
            <span>Kodagu District</span>
            <span aria-hidden="true">•••</span>
          </header>

          <div className="ks-dash__top">
            <div className="ks-dash__map">
              <img src={kodaguMap} alt="Kodagu district risk heat map" draggable={false} />
            </div>
            <div className="ks-dash__panel">
              <h4>Disease Trends</h4>
              <div className="ks-legend">
                {SERIES.map((s) => (
                  <span key={s.name}>
                    <i style={{ background: s.color }} />
                    {s.name}
                  </span>
                ))}
              </div>
              <TrendChart />
            </div>
          </div>

          <div className="ks-dash__bottom">
            <div className="ks-dash__panel">
              <h4>Top Risk Zones</h4>
              <ul className="ks-zones">
                {ZONES.map((z) => (
                  <li key={z.label} className={z.highlight ? "is-hl" : ""}>
                    <i style={{ background: z.color }} />
                    <span>{z.label}</span>
                    <b style={{ background: z.tint, color: z.color }}>{z.count}</b>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ks-dash__panel">
              <h4>Recent Reports</h4>
              <ul className="ks-reports">
                {REPORTS.map(([d, t], i) => (
                  <li key={i}>
                    <i />
                    <span>{d}</span>
                    <time>{t}</time>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
