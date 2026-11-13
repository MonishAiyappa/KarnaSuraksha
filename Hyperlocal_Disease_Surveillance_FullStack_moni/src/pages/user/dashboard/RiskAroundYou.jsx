import {
  ArrowRight,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import KarnatakaMap
  from "../../../assets/maps/karnataka-risk-map-dashboard.png";

import "../UserDashboard.css";


// ============================================================
// RISK AROUND YOU CARD
// ============================================================

export default function RiskAroundYou({
  taluk,
  risk = "Low",
  onViewMap,
}) {

  const locationName =
    taluk?.talukName ||
    taluk?.name ||
    taluk?.districtName ||
    "Selected area";

  const normalizedRisk =
    String(risk || "Low");

  const riskClass =
    normalizedRisk === "High" ||
    normalizedRisk === "Critical"
      ? "is-high"
      : normalizedRisk === "Moderate"
        ? "is-moderate"
        : "is-low";

  const openRiskMap = () => {

    if (
      typeof onViewMap === "function"
    ) {
      onViewMap();
    }
  };


  return (

    <section className="ud-card ud-risk">

      <div className="ud-card-title">

        <ShieldCheck
          strokeWidth={1.8}
          aria-hidden="true"
        />

        <h2>
          RISK AROUND YOU
        </h2>

      </div>


      <div className="ud-risk-body">

        {/* MAP */}

        <button
          type="button"
          className="ud-risk-map"
          onClick={openRiskMap}
          aria-label="Open Disease Risk Map"
        >

          <img
            src={KarnatakaMap}
            alt="Karnataka disease risk map"
            draggable="false"
          />

          <span
            className="ud-pin"
            aria-hidden="true"
          >
            <MapPin
              fill="currentColor"
              strokeWidth={1.5}
            />
          </span>

        </button>


        {/* LEGEND */}

        <div className="ud-risk-legend">

          <Legend
            color="#149447"
            label="Low Risk"
          />

          <Legend
            color="#F4A51C"
            label="Moderate Risk"
          />

          <Legend
            color="#F04444"
            label="High Risk"
          />

        </div>


        {/* CURRENT RISK */}

        <div className="ud-risk-current">

          <p>
            Current risk
          </p>

          <strong className={riskClass}>
            {normalizedRisk}
          </strong>

          <span title={locationName}>
            {locationName}
          </span>

        </div>


        {/* BUTTON */}

        <button
          type="button"
          className="ud-btn-outline ud-risk-btn"
          onClick={openRiskMap}
          aria-label="View Disease Risk Map"
        >

          <span>
            View Risk Map
          </span>

          <ArrowRight
            strokeWidth={2}
            aria-hidden="true"
          />

        </button>

      </div>

    </section>
  );
}


// ============================================================
// LEGEND ROW
// ============================================================

function Legend({
  color,
  label,
}) {

  return (

    <div className="ud-legend-row">

      <span
        className="ud-legend-dot"
        style={{
          backgroundColor: color,
        }}
      />

      <span>
        {label}
      </span>

    </div>
  );
}
