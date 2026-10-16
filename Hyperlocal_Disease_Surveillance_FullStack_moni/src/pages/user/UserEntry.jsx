import {
  useRef,
  useState,
} from "react";

import {
  Eye,
  HeartPulse,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import LocationSelector from "../../components/LocationSelector";

import iconWeekly from "../../assets/ui/user-entry-icon-weekly.png";
import iconMap from "../../assets/ui/user-entry-icon-map.png";
import iconAlerts from "../../assets/ui/user-entry-icon-alerts.png";
import iconAssistant from "../../assets/ui/user-entry-icon-assistant.png";
import iconRelief from "../../assets/ui/user-entry-icon-relief.png";

import emblem from "../../assets/landing/emblem.png";

import "./UserEntry.css";


// ============================================================
// FEATURE HIGHLIGHTS (row of five icons under the headline)
// ============================================================

const FEATURES = [
  {
    key: "weekly",
    icon: iconWeekly,
    label: ["Weekly", "Health Updates"],
  },
  {
    key: "map",
    icon: iconMap,
    label: ["Community", "Risk Map"],
  },
  {
    key: "alerts",
    icon: iconAlerts,
    label: ["Precautions &", "Alerts"],
  },
  {
    key: "assistant",
    icon: iconAssistant,
    label: ["Medical", "Assistant"],
  },
  {
    key: "relief",
    icon: iconRelief,
    label: ["Home Relief"],
    note: "(Quick Support)",
  },
];


// ============================================================
// FOOTER PILLARS
// ============================================================

const PILLARS = [
  { key: "safe", Icon: ShieldCheck, text: "Safe Communities" },
  { key: "health", Icon: HeartPulse, text: "Better Health" },
  { key: "together", Icon: Users, text: "Stronger Together" },
];


// ============================================================
// USER ENTRY (User Portal login page)
//
// Laptop + tablet (720px and wider): the approved desktop design,
// scaled to the screen width.
// Phone (under 720px): the approved phone design (single column).
// Both are produced by the same markup - see UserEntry.css.
// ============================================================

export default function UserEntry({
  onEnter,
  onBack,
}) {

  const [username, setUsername] =
    useState("");

  const [location, setLocation] =
    useState(null);

  const [error, setError] =
    useState("");

  const nameRef = useRef(null);


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = (event) => {

    event.preventDefault();

    const cleanName =
      username.trim();


    if (!cleanName) {

      setError(
        "Please enter your name."
      );

      nameRef.current?.focus();

      return;
    }


    if (!location?.talukId) {

      setError(
        "Please select your State, District, and Taluk."
      );

      return;
    }


    setError("");

    onEnter({
      username: cleanName,
      defaultLocation: location,
    });
  };


  // Any edit clears a stale error message
  const handleLocationChange = (next) => {

    setLocation(next);

    if (error) {
      setError("");
    }
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="ku-page">

      {/* ====================================================
          STAGE (painted landscape + everything above the footer)
      ==================================================== */}

      <div className="ku-stage">

        <div className="ku-canvas">

          {/* ================================================
              HEADER
          ================================================ */}

          <header className="ku-header">

            <button
              type="button"
              className="ku-brand"
              onClick={onBack}
              aria-label="Karna Suraksha - back to home"
            >

              <img
                className="ku-brand-logo"
                src={emblem}
                alt=""
                draggable="false"
              />

              <span className="ku-brand-text">

                <span className="ku-brand-name">
                  Karna Suraksha
                </span>

                <span className="ku-brand-sub">
                  Disease Surveillance Platform
                </span>

              </span>

            </button>


            <p className="ku-tagline">

              <span>Safer Communities</span>

              <i aria-hidden="true" />

              <span>Healthier Tomorrow</span>

            </p>

          </header>


          {/* ================================================
              MAIN
          ================================================ */}

          <main className="ku-main">


            {/* --------------------------------------------
                MESSAGE + FEATURES
            -------------------------------------------- */}

            <section className="ku-hero">

              <h1 className="ku-headline">
                <span>Stay Informed.</span>
                <i aria-hidden="true" />
                <span>Stay Protected.</span>
                <i aria-hidden="true" />
                <span>Stay Healthy.</span>
              </h1>


              <p className="ku-lead">
                Access local health updates,
                community risk information,
                <br className="ku-br" />
                {" "}precautions and alerts — all in one place.
              </p>


              <ul className="ku-features">

                {FEATURES.map(
                  ({
                    key,
                    icon,
                    label,
                    note,
                  }) => (

                    <li
                      key={key}
                      className="ku-feature"
                    >

                      <span className="ku-feature-icon">
                        <img
                          src={icon}
                          alt=""
                          draggable="false"
                        />
                      </span>

                      <span className="ku-feature-label">

                        {label.map((line) => (
                          <span key={line}>
                            {line}
                          </span>
                        ))}

                        {note && (
                          <span className="ku-feature-note">
                            {note}
                          </span>
                        )}

                      </span>

                    </li>

                  )
                )}

              </ul>

            </section>


            {/* --------------------------------------------
                USER PORTAL CARD
            -------------------------------------------- */}

            <section
              className="ku-card"
              aria-labelledby="ku-card-title"
            >

              <div className="ku-card-head">

                <div
                  className="ku-avatar"
                  aria-hidden="true"
                >
                  <User
                    strokeWidth={1.9}
                  />
                </div>

                <h2 id="ku-card-title">
                  User Portal
                </h2>

              </div>


              <p className="ku-card-sub">
                Enter your name and select your default location to view
                <br className="ku-br" />
                {" "}disease surveillance data.
              </p>


              <form
                className="ku-form"
                onSubmit={handleSubmit}
                noValidate
              >

                {/* NAME */}

                <div className="ku-field">

                  <label htmlFor="ku-name">
                    Your Name
                  </label>

                  <div className="ku-input">

                    <User
                      className="ku-input-icon"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />

                    <input
                      id="ku-name"
                      ref={nameRef}
                      type="text"
                      value={username}
                      onChange={(event) => {

                        setUsername(
                          event.target.value
                        );

                        if (error) {
                          setError("");
                        }

                      }}
                      placeholder="e.g. Ramesh Kumar"
                      autoComplete="name"
                      maxLength={60}
                    />

                  </div>

                </div>


                {/* LOCATION */}

                <div className="ku-field ku-field-location">

                  {/* shown on phones only; on laptop/tablet this text is the State label */}
                  <span className="ku-field-title">
                    Your Default Location
                  </span>

                  <LocationSelector
                    variant="portal"
                    onChange={handleLocationChange}
                  />

                </div>


                {/* ERROR */}

                {error && (

                  <p
                    className="ku-error"
                    role="alert"
                  >
                    {error}
                  </p>

                )}


                {/* SUBMIT */}

                <button
                  type="submit"
                  className="ku-submit"
                >

                  <Eye
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  View Disease Surveillance

                </button>

              </form>

            </section>

          </main>

        </div>

      </div>


      {/* ====================================================
          FOOTER
      ==================================================== */}

      <footer className="ku-footer">

        <div className="ku-footer-inner">

          <div className="ku-footer-brand">

            <img
              src={emblem}
              alt=""
              draggable="false"
            />

            <div>

              <strong>Karna Suraksha</strong>

              <small>Disease Surveillance Platform</small>

            </div>

          </div>


          <ul className="ku-footer-pillars">

            {PILLARS.map(({ key, Icon, text }) => (

              <li key={key}>

                <Icon aria-hidden="true" />

                <span>{text}</span>

              </li>

            ))}

          </ul>


          <div className="ku-footer-social">

            <h3>Connect With Us</h3>

            <div>

              <a
                href="#"
                aria-label="Twitter"
                onClick={(event) => event.preventDefault()}
              >
                <FaTwitter className="ku-ico-desktop" />
                <FaXTwitter className="ku-ico-phone" />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                onClick={(event) => event.preventDefault()}
              >
                <FaLinkedin />
              </a>

              <a
                href="#"
                aria-label="GitHub"
                onClick={(event) => event.preventDefault()}
              >
                <FaGithub />
              </a>

            </div>

          </div>


          <p className="ku-footer-copy">
            © {new Date().getFullYear()} Karna Suraksha. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}
