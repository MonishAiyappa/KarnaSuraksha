import { useState } from "react";

import {
  BarChart3,
  Bell,
  BriefcaseMedical,
  ChevronDown,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  Menu,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import LocationSelector from "../../components/LocationSelector";

import emblem from "../../assets/landing/emblem.png";

import "./UserDashboard.css";


// ============================================================
// NAVIGATION GROUPS
// ============================================================

const GROUPS = [
  {
    label: null,
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "SURVEILLANCE",
    items: [
      { key: "risk-map", label: "Disease Risk Map", icon: Map },
      { key: "analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "HEALTH & SAFETY",
    items: [
      { key: "precautions", label: "Precautionary Measures", icon: ShieldCheck },
    ],
  },
  {
    label: "COMMUNICATION",
    items: [
      { key: "notifications", label: "Notifications", icon: Bell },
      { key: "medical-chat", label: "Medical Assistant", icon: BriefcaseMedical },
      { key: "home-relief", label: "Home Relief", icon: HeartPulse },
    ],
  },
];


// ============================================================
// BRAND (emblem + name)
// ============================================================

function Brand({ onClick }) {

  return (

    <button
      type="button"
      className="ud-brand"
      onClick={onClick}
      aria-label="Karna Suraksha - Dashboard"
    >

      <img
        src={emblem}
        alt=""
        draggable="false"
      />

      <span>

        <strong>Karna Suraksha</strong>

        <small>Disease Surveillance Platform</small>

      </span>

    </button>
  );
}


// ============================================================
// NAVIGATION BODY (used by the laptop/tablet sidebar and the phone menu)
// ============================================================

function NavBody({
  activePage,
  go,
  onExit,
  selectedLocation,
  defaultLocation,
  onLocationChange,
  onResetToDefault,
}) {

  const [
    locationExpanded,
    setLocationExpanded,
  ] = useState(false);


  return (

    <>

      <nav
        className="ud-nav"
        aria-label="User navigation"
      >

        {GROUPS.map((group, index) => (

          <div
            key={group.label || `group-${index}`}
            className="ud-nav-group"
          >

            {group.label && (
              <p className="ud-nav-label">
                {group.label}
              </p>
            )}

            {group.items.map(({ key, label, icon: Icon }) => {

              const active = activePage === key;

              return (

                <button
                  key={key}
                  type="button"
                  className={`ud-nav-item${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => {
                    setLocationExpanded(false);
                    go(key);
                  }}
                >

                  <Icon
                    strokeWidth={active ? 2.1 : 1.8}
                    aria-hidden="true"
                  />

                  <span>{label}</span>

                </button>

              );
            })}

          </div>

        ))}


        {/* LOCATION */}

        <div className="ud-nav-group">

          <p className="ud-nav-label">
            LOCATION
          </p>

          <button
            type="button"
            className={`ud-nav-item${locationExpanded ? " is-open" : ""}`}
            aria-expanded={locationExpanded}
            onClick={() =>
              setLocationExpanded((value) => !value)
            }
          >

            <MapPin
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span className="ud-grow">
              Location
            </span>

            <ChevronDown
              className="ud-chevron"
              aria-hidden="true"
            />

          </button>


          {locationExpanded && (

            <div className="ud-location-panel">

              <LocationSelector
                value={selectedLocation}
                onChange={onLocationChange}
              />

              {selectedLocation?.talukId && (

                <div className="ud-location-now">

                  <p>Currently Monitoring</p>

                  <strong>
                    {selectedLocation.talukName}
                  </strong>

                  <span>
                    {selectedLocation.districtName}
                    {", "}
                    {selectedLocation.stateName}
                  </span>

                </div>

              )}

              {defaultLocation?.talukId &&
                selectedLocation?.talukId !==
                  defaultLocation.talukId && (

                  <button
                    type="button"
                    className="ud-location-reset"
                    onClick={onResetToDefault}
                  >
                    Reset to My Default Location
                  </button>

                )}

            </div>

          )}

        </div>

      </nav>


      <div className="ud-logout-wrap">

        <button
          type="button"
          className="ud-nav-item ud-logout"
          onClick={onExit}
        >

          <LogOut
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>Logout</span>

        </button>

      </div>

    </>
  );
}


// ============================================================
// SIDEBAR (laptop + tablet)  +  MENU PANEL (phone)
// ============================================================

export default function UserSidebar({
  activePage,
  onNavigate,
  onExit,
  selectedLocation,
  defaultLocation,
  onLocationChange,
  onResetToDefault,
  menuOpen = false,
  onCloseMenu,
}) {

  const go = (page) => {

    onNavigate?.(page);

    onCloseMenu?.();
  };

  const navProps = {
    activePage,
    go,
    onExit,
    selectedLocation,
    defaultLocation,
    onLocationChange,
    onResetToDefault,
  };


  return (

    <>

      {/* LAPTOP + TABLET */}

      <aside className="ud-sidebar">

        <div className="ud-side-inner">

          <Brand onClick={() => go("dashboard")} />

          <NavBody {...navProps} />

        </div>

      </aside>


      {/* PHONE MENU */}

      <div
        className={`ud-drawer${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
      >

        <button
          type="button"
          className="ud-drawer-scrim"
          onClick={onCloseMenu}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
        />

        <div className="ud-drawer-panel">

          <div className="ud-drawer-head">

            <Brand onClick={() => go("dashboard")} />

            <button
              type="button"
              className="ud-drawer-close"
              onClick={onCloseMenu}
              aria-label="Close menu"
              tabIndex={menuOpen ? 0 : -1}
            >
              <X aria-hidden="true" />
            </button>

          </div>

          <NavBody {...navProps} />

        </div>

      </div>

    </>
  );
}


// ============================================================
// PHONE TOP BAR (logo, notifications, user menu)
// ============================================================

export function UserPhoneBar({
  username,
  onNavigate,
  menuOpen = false,
  onToggleMenu,
}) {

  return (

    <header className="ud-phonebar">

      <Brand
        onClick={() => onNavigate?.("dashboard")}
      />

      {/* USER PROFILE CHIP (replaces the bell) */}
      <button
        type="button"
        className="ud-user-chip ud-phonebar-profile"
        onClick={() => onNavigate?.("dashboard")}
        aria-label="User profile"
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

      </button>

      {/* HAMBURGER MENU TOGGLE (three dashes) */}
      <button
        type="button"
        className="ud-hamburger"
        onClick={onToggleMenu}
        aria-expanded={menuOpen}
        aria-label="Open menu"
      >
        <Menu
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>

    </header>
  );
}
