import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import DiseaseVisual
  from "../../../components/DiseaseVisual";

import {
  getPreventionVisual,
} from "../../../data/diseaseVisuals";

import "../UserDashboard.css";


// ============================================================
// PRECAUTION OF THE WEEK CARD
// ============================================================

export default function PreventiveMeasures({
  disease,
  category,
  onMorePrecautions,
}) {

  const visual =
    getPreventionVisual(
      disease,
      category
    );


  return (

    <section className="ud-card ud-prevent">

      <div className="ud-prevent-text">

        <div className="ud-card-title">

          <ShieldCheck
            strokeWidth={2}
            aria-hidden="true"
          />

          <h2>
            PRECAUTION OF THE WEEK
          </h2>

        </div>

        <h3>
          {visual.preventionTitle}
        </h3>

        <p>
          {visual.preventionDescription}
        </p>

        <button
          type="button"
          className="ud-btn-solid"
          onClick={onMorePrecautions}
        >

          More Precautions

          <ArrowRight
            strokeWidth={2}
            aria-hidden="true"
          />

        </button>

      </div>


      <div className="ud-prevent-img">

        <DiseaseVisual
          disease={disease}
          category={category}
          type="prevention"
          alt={`${visual.name} prevention illustration`}
        />

      </div>

    </section>
  );
}
