import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  ClipboardList,
  FileText,
  HeartPulse,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import NotificationManager from "./notifications/NotificationManager";
import emblem from "../assets/landing/emblem.png";

import "./AgentShell.css";

const ICONS = {
  dashboard: LayoutDashboard,
  report: FileText,
  emerging: ShieldAlert,
  history: History,
  notifications: Bell,
};

export default function AgentShell({
  tabs = [],
  activeTab,
  onTabChange,
  onExit,
  notificationCount = 0,
  children,
}) {
  const { session } = useAuth();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  /*
   * Registered agent assignment.
   *
   * This comes from /agent/status and is the
   * authoritative source for the agent's
   * registered Taluk and District.
   */
  const [agentStatus, setAgentStatus] =
    useState(null);

  const profileRef =
    useRef(null);

  const fullName =
    session?.full_name ||
    session?.username ||
    "Agent";

  /*
   * Use the registered assignment returned
   * by /agent/status.
   *
   * Session values are retained only as
   * fallbacks for older login/session data.
   */
  const talukName =
    agentStatus?.taluk_name ||
    session?.taluk_name ||
    session?.taluk ||
    session?.assigned_taluk ||
    "Assigned Taluk";

  const districtName =
    agentStatus?.district_name ||
    session?.district_name ||
    session?.district ||
    session?.assigned_district ||
    "Assigned District";

  /* ==========================================================
     LOAD REGISTERED AGENT LOCATION
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadAgentAssignment =
      async () => {
        try {
          const data =
            await api.getAgentStatus();

          if (!cancelled) {
            setAgentStatus(data);
          }
        } catch (error) {
          console.error(
            "Unable to load agent assignment:",
            error
          );
        }
      };

    /*
     * Only try to load the status after
     * the logged-in session is available.
     */
    if (session?.username) {
      loadAgentAssignment();
    }

    return () => {
      cancelled = true;
    };
  }, [session?.username]);

  /* ==========================================================
     CLOSE PROFILE WHEN CLICKING OUTSIDE
  ========================================================== */

  useEffect(() => {
    const handlePointerDown =
      (event) => {
        if (
          profileRef.current &&
          !profileRef.current.contains(
            event.target
          )
        ) {
          setProfileOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      );
    };
  }, []);

  /* ==========================================================
     ESCAPE KEY
  ========================================================== */

  useEffect(() => {
    const handleEscape =
      (event) => {
        if (event.key === "Escape") {
          setMobileOpen(false);
          setProfileOpen(false);
        }
      };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* ==========================================================
     TAB SELECTION
  ========================================================== */

  const selectTab = (key) => {
    onTabChange?.(key);

    setMobileOpen(false);
    setProfileOpen(false);
  };

  /* ==========================================================
     LOGOUT
  ========================================================== */

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileOpen(false);

    onExit?.();
  };

  return (
    <div className="agent-shell">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="agent-header">

        {/* ===================================================
            BRAND
        =================================================== */}

        <div className="agent-brand">

          <img
            src={emblem}
            alt="Karna Suraksha"
            className="agent-brand-logo"
          />

          <div className="agent-brand-copy">

            <div className="agent-brand-name">
              Karna Suraksha
            </div>

            <div className="agent-brand-subtitle">
              Disease Surveillance Platform
            </div>

          </div>

        </div>

        {/* ===================================================
            HEADER RIGHT
        =================================================== */}

        <div className="agent-header-right">

          {/* =================================================
              AGENT PROFILE (Visible on desktop & mobile)
          ================================================= */}

          <div
            className="agent-profile"
            ref={profileRef}
          >

            <button
              type="button"
              className="agent-profile-button"
              onClick={() =>
                setProfileOpen(
                  (value) => !value
                )
              }
              aria-expanded={
                profileOpen
              }
              aria-haspopup="menu"
            >

              <div
                className="agent-avatar"
                aria-hidden="true"
              >
                <UserRound size={17} />
              </div>

              <div className="agent-profile-copy">

                <strong>
                  {fullName}
                </strong>

                <span>
                  Field Agent
                </span>

              </div>

              <ChevronDown
                size={16}
                className={`agent-chevron ${
                  profileOpen
                    ? "agent-chevron-open"
                    : ""
                }`}
              />

            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================= */}

            {profileOpen && (
              <div
                className="agent-profile-menu"
                role="menu"
              >

                {/* Agent identity */}

                <div className="agent-profile-menu-heading">

                  <strong>
                    {fullName}
                  </strong>

                  <span>
                    {session?.username ||
                      "Agent account"}
                  </span>

                </div>

                {/* Assignment */}

                <div className="agent-profile-menu-location">

                  <div className="agent-profile-assignment-item">

                    <span>
                      Assigned District
                    </span>

                    <strong>
                      {districtName}
                    </strong>

                  </div>

                  <div className="agent-profile-assignment-item">

                    <span>
                      Assigned Taluk
                    </span>

                    <strong>
                      {talukName}
                    </strong>

                  </div>

                </div>

                {/* Logout */}

                <button
                  type="button"
                  className="agent-profile-logout"
                  onClick={
                    handleLogout
                  }
                  role="menuitem"
                >

                  <LogOut size={16} />

                  <span>
                    Logout
                  </span>

                </button>

              </div>
            )}

          </div>

          {/* =================================================
              NOTIFICATIONS (Desktop)
          ================================================= */}

          <button
            type="button"
            className="agent-header-icon-button"
            onClick={() =>
              selectTab(
                "notifications"
              )
            }
            aria-label="Open notifications"
          >

            <Bell size={21} />

            {notificationCount >
              0 && (
              <span className="agent-notification-badge">
                {notificationCount >
                9
                  ? "9+"
                  : notificationCount}
              </span>
            )}

          </button>

          {/* Mobile divider */}
          <div className="agent-phone-divider" aria-hidden="true" />

          {/* Mobile menu hamburger */}

          <button
            type="button"
            className="agent-mobile-menu"
            onClick={() =>
              setMobileOpen(
                (value) => !value
              )
            }
            aria-label={
              mobileOpen
                ? "Close agent navigation"
                : "Open agent navigation"
            }
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

        </div>

      </header>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`agent-sidebar ${
          mobileOpen
            ? "agent-sidebar-open"
            : ""
        }`}
      >

        <nav
          className="agent-nav"
          aria-label="Agent portal navigation"
        >

          {tabs.map((tab) => {

            const Icon =
              tab.icon ||
              ICONS[tab.key] ||
              ClipboardList;

            const active =
              activeTab ===
              tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                className={`agent-nav-item ${
                  active
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectTab(
                    tab.key
                  )
                }
              >

                <Icon
                  size={20}
                  strokeWidth={2.2}
                />

                <span>
                  {tab.label}
                </span>

              </button>
            );
          })}

        </nav>

        {/* Sidebar illustration */}

        <div
          className="agent-sidebar-illustration"
          aria-hidden="true"
        >

          <div className="agent-mountain agent-mountain-one" />

          <div className="agent-mountain agent-mountain-two" />

          <div className="agent-tree agent-tree-one" />

          <div className="agent-tree agent-tree-two" />

          <div className="agent-tree agent-tree-three" />

        </div>

        <div className="agent-sidebar-message">

          <p>
            Healthy Communities
          </p>

          <p>
            Stronger Tomorrow
          </p>

        </div>

      </aside>

      {/* =====================================================
          MOBILE BACKDROP
      ===================================================== */}

      {mobileOpen && (
        <button
          type="button"
          className="agent-mobile-backdrop"
          aria-label="Close navigation"
          onClick={() =>
            setMobileOpen(false)
          }
        />
      )}

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="agent-main">

        <div className="agent-main-inner">

          {activeTab === "notifications" ? (
            <NotificationManager mode="agent" />
          ) : (
            children
          )}

        </div>

        <AgentFooter />

      </main>

    </div>
  );
}

/* ============================================================
   AGENT FOOTER
============================================================ */

const FOOTER_PILLARS = [
  { key: "safe", Icon: ShieldCheck, text: "Safe Communities" },
  { key: "health", Icon: HeartPulse, text: "Better Health" },
  { key: "together", Icon: Users, text: "Stronger Together" },
];

function AgentFooter() {
  return (
    <footer className="agent-footer">
      <div className="agent-footer-inner">
        <div className="agent-footer-brand">
          <img src={emblem} alt="Karna Suraksha" />
          <div>
            <strong>Karna Suraksha</strong>
            <small>Disease Surveillance Platform</small>
          </div>
        </div>

        <ul className="agent-footer-pillars">
          {FOOTER_PILLARS.map(({ key, Icon, text }) => (
            <li key={key}>
              <Icon size={18} />
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <p className="agent-footer-copy">
          © {new Date().getFullYear()} Karna Suraksha. All rights reserved.
        </p>

        <div className="agent-footer-social">
          <h3>Connect With Us</h3>
          <div>
            <a href="#" aria-label="Twitter" onClick={(e) => e.preventDefault()}>
              <FaTwitter className="agent-ico-desktop" />
              <FaXTwitter className="agent-ico-phone" />
            </a>
            <a href="#" aria-label="LinkedIn" onClick={(e) => e.preventDefault()}>
              <FaLinkedin />
            </a>
            <a href="#" aria-label="GitHub" onClick={(e) => e.preventDefault()}>
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}