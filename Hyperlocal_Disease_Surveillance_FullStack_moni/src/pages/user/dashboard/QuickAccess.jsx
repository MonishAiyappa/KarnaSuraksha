import {
  ArrowRight,
  BarChart3,
  BellRing,
  BriefcaseMedical,
  HeartPulse,
} from "lucide-react";

import "../UserDashboard.css";


// ============================================================
// QUICK ACCESS CARD
// ============================================================

const ITEMS = [
  {
    key: "analytics",
    page: "analytics",
    label: "Analytics",
    icon: BarChart3,
    iconColor: "#1E9B52",
    bg: "#DDF4E8",
  },
  {
    key: "alerts",
    page: "notifications",
    label: "Emergency Alerts",
    icon: BellRing,
    iconColor: "#F0443C",
    bg: "#FEEBD9",
  },
  {
    key: "medical-chat",
    page: "medical-chat",
    label: "Medical Assistant",
    icon: BriefcaseMedical,
    iconColor: "#7B4DE0",
    bg: "#E9E4FC",
  },
  {
    key: "home-relief",
    page: "home-relief",
    label: "Home Relief",
    icon: HeartPulse,
    iconColor: "#F0443C",
    bg: "#FFE5E6",
  },
];


export default function QuickAccess({
  onNavigate,
}) {

  return (

    <section className="ud-card ud-quick">

      <h2 className="ud-quick-title">
        QUICK ACCESS
      </h2>


      <div className="ud-quick-grid">

        {ITEMS.map(
          ({
            key,
            page,
            label,
            icon: Icon,
            iconColor,
            bg,
          }) => (

            <button
              key={key}
              type="button"
              className="ud-quick-item"
              style={{
                backgroundColor: bg,
                "--ud-quick-color": iconColor,
              }}
              onClick={() =>
                onNavigate?.(page)
              }
            >

              <Icon
                aria-hidden="true"
                strokeWidth={1.9}
                style={{
                  color: iconColor,
                }}
              />

              <span>
                {label}
              </span>

              <ArrowRight
                className="ud-quick-arrow"
                aria-hidden="true"
                strokeWidth={2}
                style={{
                  color: iconColor,
                }}
              />

            </button>

          )
        )}

      </div>


      <button
        type="button"
        className="ud-quick-more"
        onClick={() =>
          onNavigate?.("precautions")
        }
      >

        More

        <ArrowRight
          aria-hidden="true"
          strokeWidth={2}
        />

      </button>

    </section>
  );
}
