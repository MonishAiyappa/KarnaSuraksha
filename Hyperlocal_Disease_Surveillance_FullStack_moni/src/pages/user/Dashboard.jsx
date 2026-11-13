import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  Bell,
  CalendarDays,
  ChevronDown,
  Clock3,
  Info,
  MapPin,
  ShieldPlus,
  Stethoscope,
  TrendingUp,
  User,
} from "lucide-react";

import { getDiseaseVisual } from "../../data/diseaseVisuals";

import LocationSelector from "../../components/LocationSelector";

import MedicalAssistantReference from "../../assets/ui/medical-assistant-reference.png";

import dashboardBanner from "../../assets/ui/user-dashboard-banner.webp";

import TodaysUpdate from "./dashboard/TodaysUpdate";
import RiskAroundYou from "./dashboard/RiskAroundYou";
import PreventiveMeasures from "./dashboard/PreventiveMeasures";
import QuickAccess from "./dashboard/QuickAccess";

import "./UserDashboard.css";


const RISK_ORDER = {
  Low: 0,
  Moderate: 1,
  High: 2,
  Critical: 3,
};

const RISK_TONE = {
  Low: {
    text: "#16803C",
    icon: "#E2F1E4",
  },

  Moderate: {
    text: "#D98200",
    icon: "#FFF0D7",
  },

  High: {
    text: "#F04444",
    icon: "#FFE1D9",
  },

  Critical: {
    text: "#C62828",
    icon: "#F6D4D4",
  },
};

function normalizeRisk(value) {
  const text = String(value || "Low").toLowerCase();

  if (text.includes("critical")) return "Critical";
  if (text.includes("high")) return "High";
  if (text.includes("moderate")) return "Moderate";

  return "Low";
}

function locationLabel(location) {
  if (!location) {
    return "Selected location";
  }

  if (location.talukName && location.districtName) {
    return `${location.talukName}, ${location.districtName}`;
  }

  return (
    location.talukName ||
    location.districtName ||
    location.stateName ||
    "Selected location"
  );
}

function calculateWeeklyChange(data) {
  if (
    data?.trend_percentage !== undefined &&
    data?.trend_percentage !== null
  ) {
    const value = Number(
      String(data.trend_percentage).replace("%", "")
    );

    return Number.isFinite(value) ? value : null;
  }

  const trend = Array.isArray(data?.trend)
    ? data.trend
    : [];

  if (trend.length < 2) {
    return null;
  }

  const previous = Number(
    trend[trend.length - 2]?.total_cases ??
      trend[trend.length - 2]?.totalCases ??
      trend[trend.length - 2]?.cases ??
      0
  );

  const current = Number(
    trend[trend.length - 1]?.total_cases ??
      trend[trend.length - 1]?.totalCases ??
      trend[trend.length - 1]?.cases ??
      0
  );

  if (!previous) {
    return current ? 100 : 0;
  }

  return Math.round(
    ((current - previous) / previous) * 100
  );
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
}

export default function Dashboard({
  username,
  defaultLocation,
  selectedLocation,
  dashboardData,
  loading,
  error,
  alertCount = 0,
  onNavigate,
  onExit,
  onLocationChange,
  onResetToDefault,
}) {

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  const [
    locationOpen,
    setLocationOpen,
  ] = useState(false);

  const controlsRef = useRef(null);


  // Close the small dropdowns when the user clicks anywhere else
  useEffect(() => {

    if (!profileOpen && !locationOpen) {
      return undefined;
    }

    const close = (event) => {

      if (
        controlsRef.current &&
        !controlsRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
        setLocationOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () =>
      document.removeEventListener("mousedown", close);

  }, [profileOpen, locationOpen]);


  /*
   * ==========================================================
   * DISEASE CARDS
   * ==========================================================
   */

  const cards = useMemo(
    () =>
      Array.isArray(
        dashboardData?.cards
      )
        ? dashboardData.cards
        : [],
    [dashboardData]
  );

  /*
   * ==========================================================
   * LOCALITY RISK DISEASE
   *
   * IMPORTANT:
   *
   * There is NO hardcoded Dengue here.
   *
   * The disease displayed by the dashboard is selected from
   * the disease cards returned for the currently selected
   * Taluk.
   *
   * Priority:
   *
   * Critical
   * High
   * Moderate
   * Low
   *
   * If two diseases have the same risk level, the disease
   * having more cases wins.
   * ==========================================================
   */

  const riskDiseaseCard =
    useMemo(() => {
      if (!cards.length) {
        return null;
      }

      return [...cards].sort(
        (a, b) => {
          const riskDifference =
            (
              RISK_ORDER[
                normalizeRisk(
                  b?.risk_level
                )
              ] ?? 0
            ) -
            (
              RISK_ORDER[
                normalizeRisk(
                  a?.risk_level
                )
              ] ?? 0
            );

          if (
            riskDifference !== 0
          ) {
            return riskDifference;
          }

          return (
            Number(
              b?.cases || 0
            ) -
            Number(
              a?.cases || 0
            )
          );
        }
      )[0];
    },
    [cards]
  );

  const riskDisease =
    riskDiseaseCard?.disease ||
    null;

  const diseaseCategory =
    riskDiseaseCard?.category ||
    dashboardData?.category ||
    null;

  const visual =
    getDiseaseVisual(
      riskDisease,
      diseaseCategory
    );

  /*
   * ==========================================================
   * TOTAL CASES
   * ==========================================================
   */

  const totalCases =
    dashboardData?.active_cases ??
    dashboardData?.total_cases ??
    dashboardData?.totalCases ??
    dashboardData?.cases ??
    cards.reduce(
      (sum, item) =>
        sum +
        Number(
          item?.cases || 0
        ),
      0
    );

  /*
   * ==========================================================
   * OVERALL LOCALITY RISK
   * ==========================================================
   */

  const risk =
    normalizeRisk(
      dashboardData?.overall_risk ||
        dashboardData?.risk_level ||
        dashboardData?.risk
    );

  const tone =
    RISK_TONE[risk];

  /*
   * ==========================================================
   * WEEKLY CHANGE
   * ==========================================================
   */

  const weeklyChange =
    useMemo(
      () =>
        calculateWeeklyChange(
          dashboardData
        ),
      [dashboardData]
    );

  /*
   * ==========================================================
   * DATE
   * ==========================================================
   */

  const today =
    new Date().toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  /*
   * ==========================================================
   * LAST UPDATED
   * ==========================================================
   */

  const lastUpdated =
    dashboardData?.last_updated_at
      ? new Date(
          dashboardData.last_updated_at
        ).toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        )
      : null;

  const trendLabel =
    weeklyChange > 0
      ? "Increasing"
      : weeklyChange < 0
        ? "Decreasing"
        : "Stable";

  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (loading) {

    return (

      <div className="ud-dash">

        <div className="ud-state">

          <div className="ud-spinner" />

          <p>
            Loading surveillance data...
          </p>

        </div>

      </div>
    );
  }


  /*
   * ==========================================================
   * ERROR
   * ==========================================================
   */

  if (error) {

    return (

      <div className="ud-dash">

        <div className="ud-state ud-state-error">
          {error}
        </div>

      </div>
    );
  }


  const badge =
    alertCount > 9
      ? "9+"
      : alertCount;


  /*
   * ==========================================================
   * DASHBOARD
   * ==========================================================
   */

  return (

    <div className="ud-dash">

      {/* =====================================================
          HEADER (greeting + controls)
      ===================================================== */}

      <header className="ud-hero">

        <img
          className="ud-hero-banner"
          src={dashboardBanner}
          alt=""
          aria-hidden="true"
          draggable="false"
        />

        <div className="ud-hero-text">

          <h1>

            {getGreeting()}, {username}

            <span
              className="ud-wave"
              aria-hidden="true"
            >
              👋
            </span>

          </h1>

          <p className="ud-monitoring">

            <span>
              Monitoring disease situation for
            </span>

            <span className="ud-pill">

              <MapPin aria-hidden="true" />

              {locationLabel(selectedLocation)}

            </span>

          </p>

          <p className="ud-updated">

            <Clock3 aria-hidden="true" />

            <span>

              Last updated:{" "}

              {lastUpdated
                ? `Today • ${lastUpdated}`
                : "Live surveillance"}

            </span>

          </p>

        </div>


        {/* CONTROLS (laptop + tablet; on phones they live in the top bar) */}

        <div
          className="ud-controls"
          ref={controlsRef}
        >

          <button
            type="button"
            className="ud-control ud-control-bell"
            onClick={() => onNavigate?.("notifications")}
            aria-label="Notifications"
          >

            <Bell
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {alertCount > 0 && (
              <span className="ud-bell-badge">
                {badge}
              </span>
            )}

          </button>


          <div className="ud-control-wrap">

            <button
              type="button"
              className="ud-control ud-control-location"
              aria-haspopup="true"
              aria-expanded={locationOpen}
              onClick={() => {
                setLocationOpen((value) => !value);
                setProfileOpen(false);
              }}
            >

              <MapPin
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>
                {locationLabel(selectedLocation)}
              </span>

              <ChevronDown
                className="ud-chevron"
                aria-hidden="true"
              />

            </button>

            {locationOpen && (

              <div className="ud-pop ud-pop-location">

                <LocationSelector
                  value={selectedLocation}
                  onChange={(next) => {

                    onLocationChange?.(next);

                    if (next?.talukId) {
                      setLocationOpen(false);
                    }
                  }}
                />

                {defaultLocation?.talukId &&
                  selectedLocation?.talukId !==
                    defaultLocation.talukId && (

                    <button
                      type="button"
                      className="ud-location-reset"
                      onClick={() => {
                        onResetToDefault?.();
                        setLocationOpen(false);
                      }}
                    >
                      Reset to My Default Location
                    </button>

                  )}

              </div>

            )}

          </div>


          <div className="ud-control ud-control-date">

            <CalendarDays
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>
              {today}
            </span>

            <ChevronDown
              className="ud-chevron"
              aria-hidden="true"
            />

          </div>


          <div className="ud-control-wrap">

            <button
              type="button"
              className="ud-control ud-control-user"
              aria-haspopup="true"
              aria-expanded={profileOpen}
              onClick={() => {
                setProfileOpen((value) => !value);
                setLocationOpen(false);
              }}
            >

              <span className="ud-avatar">
                <User
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>

              <span className="ud-user-text">

                <strong>{username}</strong>

                <small>User</small>

              </span>

              <ChevronDown
                className="ud-chevron"
                aria-hidden="true"
              />

            </button>

            {profileOpen && (

              <div className="ud-pop ud-pop-user">

                <div className="ud-pop-user-info">

                  <strong>{username}</strong>

                  <small>User</small>

                </div>

                <button
                  type="button"
                  className="ud-pop-logout"
                  onClick={onExit}
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        </div>

      </header>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="ud-content">


        {/* ---------------------------------------------------
            CURRENT HEALTH SITUATION
        --------------------------------------------------- */}

        <section className="ud-card ud-situation">

          <p className="ud-label">
            CURRENT HEALTH SITUATION
          </p>

          <div className="ud-sit-grid">

            {/* RISK */}

            <div className="ud-sit-cell ud-sit-risk">

              <div
                className="ud-sit-shield"
                style={{
                  backgroundColor: tone.icon,
                  color: tone.text,
                }}
              >
                <ShieldPlus
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <div className="ud-sit-text">

                <p
                  className="ud-sit-risk-name"
                  style={{
                    color: tone.text,
                  }}
                >
                  {risk} Risk
                </p>

                <p className="ud-sit-desc">

                  Disease activity is{" "}
                  {risk === "Low"
                    ? "low"
                    : "elevated"}{" "}
                  in your monitored area.

                </p>

                <p className="ud-sit-desc">
                  Stay cautious.
                </p>

              </div>

            </div>


            {/* ACTIVE CASES */}

            <div className="ud-sit-cell ud-sit-cases">

              <p className="ud-sit-number">
                {Number(totalCases || 0).toLocaleString("en-IN")}
              </p>

              <p className="ud-sit-title">
                Active Cases
              </p>

              <p className="ud-sit-sub">
                Total Reported
              </p>

              <p
                className={`ud-sit-change ${
                  weeklyChange > 0
                    ? "is-up"
                    : weeklyChange < 0
                      ? "is-down"
                      : "is-flat"
                }`}
              >

                {weeklyChange === null
                  ? "No trend data"
                  : `${
                      weeklyChange >= 0
                        ? "↑"
                        : "↓"
                    } ${Math.abs(
                      weeklyChange
                    )}% from last week`}

              </p>

            </div>


            {/* HIGHEST-RISK DISEASE */}

            <div className="ud-sit-cell ud-sit-disease">

              <div className="ud-sit-disease-img">

                <img
                  src={visual.diseaseImage}
                  alt=""
                  draggable="false"
                />

              </div>

              <div className="ud-sit-text">

                <p className="ud-sit-disease-name">
                  {riskDisease || "No active disease"}
                </p>

                <p className="ud-sit-sub">
                  Highest Locality Risk
                </p>

                <p className="ud-sit-cases-count">
                  {riskDiseaseCard
                    ? `${riskDiseaseCard.cases} cases`
                    : "No cases"}
                </p>

              </div>

            </div>


            {/* WEEKLY TREND */}

            <div className="ud-sit-cell ud-sit-trend">

              <div className="ud-sit-trend-icon">
                <TrendingUp
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </div>

              <div className="ud-sit-text">

                <p className="ud-sit-trend-value">
                  {weeklyChange === null
                    ? "—"
                    : `${
                        weeklyChange >= 0
                          ? "+"
                          : ""
                      }${weeklyChange}%`}
                </p>

                <p className="ud-sit-title">
                  Weekly Trend
                </p>

                <p className="ud-sit-sub">
                  vs Last Week
                </p>

                <span className="ud-chip">
                  {trendLabel}
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* ---------------------------------------------------
            WEEK'S UPDATE | RISK AROUND YOU | MEDICAL ASSISTANT
        --------------------------------------------------- */}

        <section className="ud-row2">

          <TodaysUpdate
            disease={riskDisease}
            category={diseaseCategory}
            location={
              selectedLocation?.talukName ||
              selectedLocation?.districtName
            }
            trend={
              weeklyChange > 0
                ? "increasing"
                : weeklyChange < 0
                  ? "decreasing"
                  : "stable"
            }
            percentageChange={weeklyChange}
            onViewDetails={() =>
              onNavigate?.("analytics")
            }
          />

          <RiskAroundYou
            taluk={selectedLocation}
            risk={risk}
            onViewMap={() =>
              onNavigate?.("risk-map")
            }
          />

          <section className="ud-card ud-medical">

            <div className="ud-medical-text">

              <div className="ud-card-title ud-medical-title">

                <span
                  className="ud-medical-icon"
                  aria-hidden="true"
                >
                  <Stethoscope strokeWidth={1.8} />
                </span>

                <h2>
                  Medical Assistant
                </h2>

              </div>

              <h3>
                Need Health Guidance?
              </h3>

              <p>
                Get instant guidance, preventive tips and
                health information from our Medical
                Assistant.
              </p>

              <button
                type="button"
                className="ud-btn-outline ud-medical-btn"
                onClick={() =>
                  onNavigate?.("medical-chat")
                }
              >

                <ShieldPlus
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <span>Click Here</span>

                <ArrowRight
                  strokeWidth={2}
                  aria-hidden="true"
                />

              </button>

            </div>

            <button
              type="button"
              className="ud-medical-art"
              aria-label="Open Medical Assistant"
              onClick={() =>
                onNavigate?.("medical-chat")
              }
            >

              <img
                src={MedicalAssistantReference}
                alt="Medical Assistant"
                draggable="false"
              />

            </button>

          </section>

        </section>


        {/* ---------------------------------------------------
            PRECAUTION OF THE WEEK | QUICK ACCESS
        --------------------------------------------------- */}

        <section className="ud-row3">

          <PreventiveMeasures
            disease={riskDisease}
            category={diseaseCategory}
            onMorePrecautions={() =>
              onNavigate?.("precautions")
            }
          />

          <QuickAccess
            onNavigate={onNavigate}
          />

        </section>


        {/* ---------------------------------------------------
            INFO BAR
        --------------------------------------------------- */}

        <div className="ud-info">

          <Info aria-hidden="true" />

          <span>
            Stay safe, stay informed. Follow precautions
            and protect yourself and your loved ones.
          </span>

        </div>

      </div>

    </div>
  );
}
