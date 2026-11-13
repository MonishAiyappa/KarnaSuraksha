import {
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import DiseaseVisual
  from "../../../components/DiseaseVisual";

import {
  getDiseaseVisual,
} from "../../../data/diseaseVisuals";

import "../UserDashboard.css";


// ============================================================
// WEEK'S UPDATE CARD
// ============================================================

export default function TodaysUpdate({
  disease,
  category,
  location,
  trend,
  percentageChange,
  onViewDetails,
}) {

  const visual =
    getDiseaseVisual(
      disease,
      category
    );

  const direction =
    String(
      trend || "stable"
    ).toLowerCase();

  const numericChange =
    Number(
      percentageChange
    );

  const hasChange =
    Number.isFinite(
      numericChange
    );

  const increasing =
    direction.includes(
      "increas"
    ) ||
    numericChange > 0;

  const decreasing =
    direction.includes(
      "decreas"
    ) ||
    numericChange < 0;

  const trendText =
    increasing
      ? "increasing"
      : decreasing
        ? "decreasing"
        : "stable";


  return (

    <section className="ud-card ud-update">

      <div className="ud-card-title">

        <CalendarDays
          strokeWidth={1.8}
          aria-hidden="true"
        />

        <h2>
          WEEK&apos;S UPDATE
        </h2>

      </div>


      <div className="ud-update-body">

        <div className="ud-update-text">

          <h3>
            {visual.name} activity is{" "}
            {trendText} in{" "}
            {location || "your area"}.
          </h3>

          <p>
            {hasChange
              ? `Cases have ${
                  increasing
                    ? "increased"
                    : decreasing
                      ? "decreased"
                      : "changed"
                } by ${Math.abs(
                  numericChange
                )}% compared with last week.`
              : `Current surveillance information for ${visual.name} is available for your selected area.`}
          </p>

          <button
            type="button"
            className="ud-btn-outline"
            onClick={onViewDetails}
          >

            View Details

            <ArrowRight
              strokeWidth={2}
              aria-hidden="true"
            />

          </button>

        </div>


        <div className="ud-update-img">

          <DiseaseVisual
            disease={disease}
            category={category}
            type="update"
            alt={`${visual.name} surveillance illustration`}
          />

        </div>

      </div>

    </section>
  );
}
