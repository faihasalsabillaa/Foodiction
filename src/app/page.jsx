"use client";

import { useState, useEffect, useRef } from "react";
import { COLORS } from "@/data/foodData";
import Icon from "@/components/ui/Icon";
import Toast from "@/components/ui/Toast";
import Splash from "@/components/screens/Splash";
import Onboarding from "@/components/screens/Onboarding";
import Login from "@/components/screens/Login";
import Home from "@/components/screens/Home";
import Explore from "@/components/screens/Explore";
import Reco from "@/components/screens/Reco";
import Saved from "@/components/screens/Saved";
import Detail from "@/components/screens/Detail";
import Profile from "@/components/screens/Profile";
import EditProfile from "@/components/screens/EditProfile";

const APP_SCREENS = ["home", "explore", "reco", "saved", "profile"];

function readRouteFromUrl() {
  if (typeof window === "undefined")
    return { screen: "home", detailId: null, filterKw: "" };

  const rawHash = window.location.hash.replace("#", "");
  const [routeName = "home", queryString = ""] = rawHash.split("?");
  const params = new URLSearchParams(queryString);

  if (routeName === "detail") {
    return {
      screen: "detail",
      detailId: params.get("id") || "gudeg",
      filterKw: "",
    };
  }

  if (routeName === "edit-profile") {
    return { screen: "editprofile", detailId: null, filterKw: "" };
  }

  if (routeName === "explore") {
    return {
      screen: "explore",
      detailId: null,
      filterKw: params.get("kw") || "",
    };
  }

  if (APP_SCREENS.includes(routeName)) {
    return { screen: routeName, detailId: null, filterKw: "" };
  }

  return { screen: "home", detailId: null, filterKw: "" };
}

function routeToHash(route) {
  if (route.screen === "detail")
    return `#detail?id=${encodeURIComponent(route.detailId || "gudeg")}`;
  if (route.screen === "editprofile") return "#edit-profile";
  if (route.screen === "explore" && route.filterKw)
    return `#explore?kw=${encodeURIComponent(route.filterKw)}`;
  return `#${route.screen || "home"}`;
}

// ─────────────── APP ───────────────
export default function App() {
  const [phase, setPhase] = useState("splash"); // splash → ob → login → app
  const [screen, setScreen] = useState("home");
  const [detailId, setDetailId] = useState(null);
  const [prevScreen, setPrevScreen] = useState("home");
  const [filterKw, setFilterKw] = useState("");
  const [favs, setFavs] = useState([]);
  const [toast, setToast] = useState({ msg: "", visible: false });
  const [userName, setUserName] = useState("Aufaa Azzahra");
  const [userInitials, setUserInitials] = useState("AU");
  const toastTimeout = useRef(null);

  // Clock & greeting
  const [now, setNow] = useState(new Date());

  const applyRoute = (route) => {
    setScreen(route.screen || "home");
    setDetailId(route.detailId || null);
    setFilterKw(route.filterKw || "");
  };

  const navigate = (route, options = {}) => {
    const normalizedRoute = {
      screen: route.screen || "home",
      detailId: route.detailId || null,
      filterKw: route.filterKw || "",
    };

    if (typeof window !== "undefined") {
      const method = options.replace ? "replaceState" : "pushState";
      window.history[method](
        { foodictionRoute: normalizedRoute },
        "",
        routeToHash(normalizedRoute),
      );
    }

    applyRoute(normalizedRoute);
  };

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Initial boot. This prevents refresh/back from always returning to onboarding/login.
  useEffect(() => {
    const t = setTimeout(() => {
      const loggedIn =
        window.localStorage.getItem("foodiction_logged_in") === "true";
      const hasStarted =
        window.localStorage.getItem("foodiction_has_started") === "true";

      if (loggedIn) {
        setPhase("app");
        const route = readRouteFromUrl();
        navigate(route, { replace: true });
        return;
      }

      if (hasStarted) {
        setPhase("login");
        window.history.replaceState({ foodictionPhase: "login" }, "", "#login");
        return;
      }

      setPhase("ob");
      window.history.replaceState(
        { foodictionPhase: "onboarding" },
        "",
        "#onboarding",
      );
    }, 900);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Browser Back/Forward support for the in-app screens.
  useEffect(() => {
    const syncFromBrowser = () => {
      const loggedIn =
        window.localStorage.getItem("foodiction_logged_in") === "true";
      const rawHash = window.location.hash.replace("#", "");

      if (loggedIn) {
        setPhase("app");
        if (rawHash === "login" || rawHash === "onboarding") {
          navigate({ screen: "home" }, { replace: true });
          return;
        }
        applyRoute(readRouteFromUrl());
        return;
      }

      if (rawHash === "onboarding") setPhase("ob");
      else setPhase("login");
    };

    window.addEventListener("popstate", syncFromBrowser);
    window.addEventListener("hashchange", syncFromBrowser);
    return () => {
      window.removeEventListener("popstate", syncFromBrowser);
      window.removeEventListener("hashchange", syncFromBrowser);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hr = now.getHours();
  const greeting =
    hr < 11
      ? "Selamat pagi,"
      : hr < 15
        ? "Selamat siang,"
        : hr < 18
          ? "Selamat sore,"
          : hr < 22
            ? "Selamat malam,"
            : "Masih lapar?";
  const timeLbl =
    hr < 11
      ? "Sarapan"
      : hr < 15
        ? "Makan Siang"
        : hr < 18
          ? "Camilan Sore"
          : hr < 22
            ? "Makan Malam"
            : "Larut Malam";
  const timePill =
    hr < 11
      ? "Pagi ini"
      : hr < 15
        ? "Siang ini"
        : hr < 18
          ? "Sore ini"
          : hr < 22
            ? "Malam ini"
            : "Larut malam";
  const recoMsg =
    hr < 11
      ? "Pagi ini cocok buat sarapan berat. <em>Gudeg atau Soto</em> jadi pilihan terbaik untuk energi harianmu."
      : hr < 15
        ? "Siang hari, saatnya makan besar. <em>Soto atau Bakmi</em> pilihan sempurna untuk tenaga siang hari."
        : hr < 18
          ? "Sore hari yang santai. <em>Wedang Uwuh</em> atau camilan angkringan cocok menemani sore kamu."
          : hr < 22
            ? "Malam ini, <em>Angkringan Lek Man</em> jadi pilihan top — murah, meriah, dan paling dekat dari lokasimu."
            : "Larut malam, <em>Angkringan</em> tetap setia menemanimu. Buka sampai dini hari!";

  const showToast = (msg) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ msg, visible: true });
    toastTimeout.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      2500,
    );
  };

  const startLogin = () => {
    window.localStorage.setItem("foodiction_has_started", "true");
    setPhase("login");
    window.history.replaceState({ foodictionPhase: "login" }, "", "#login");
  };

  const finishLogin = () => {
    window.localStorage.setItem("foodiction_has_started", "true");
    window.localStorage.setItem("foodiction_logged_in", "true");
    setPhase("app");
    navigate({ screen: "home" }, { replace: true });
  };

  const goDetail = (id) => {
    setPrevScreen(screen);
    navigate({ screen: "detail", detailId: id });
  };

  const goBack = () =>
    navigate({ screen: prevScreen || "home" }, { replace: true });
  const goExplore = (kw = "") =>
    navigate({ screen: "explore", filterKw: kw || "" });
  const goReco = () => navigate({ screen: "reco" });
  const goProfile = () => navigate({ screen: "profile" });
  const goEdit = () => {
    setPrevScreen(screen);
    navigate({ screen: "editprofile" });
  };
  const goLogout = () => {
    window.localStorage.removeItem("foodiction_logged_in");
    setPhase("login");
    setScreen("home");
    setDetailId(null);
    window.history.replaceState({ foodictionPhase: "login" }, "", "#login");
  };
  const toggleFav = (id) =>
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const NAV = ["home", "explore", "reco", "saved", "profile"];
  const navIcons = ["home", "compass", "sparkles", "bookmark", "user-circle"];
  const navLabels = ["Beranda", "Jelajahi", "Untukmu", "Tersimpan", "Profil"];

  if (phase === "splash")
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}
      >
        <Splash />
      </div>
    );

  if (phase === "ob")
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}
      >
        <Onboarding onDone={startLogin} />
      </div>
    );

  if (phase === "login")
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}
      >
        <Login onLogin={finishLogin} />
      </div>
    );

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#D9CFC3",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        position: "relative",
      }}
    >
      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
        }}
      >
        {screen === "home" && (
          <Home
            goDetail={goDetail}
            goExplore={goExplore}
            goReco={goReco}
            goProfile={goProfile}
            userInitials={userInitials}
            greeting={greeting}
            timeLbl={`${timeLbl} · Rekomendasi untukmu`}
          />
        )}
        {screen === "explore" && (
          <Explore goDetail={goDetail} filterKw={filterKw} key={filterKw} />
        )}
        {screen === "reco" && (
          <Reco showToast={showToast} recoMsg={recoMsg} timePill={timePill} />
        )}
        {screen === "saved" && <Saved goDetail={goDetail} />}
        {screen === "detail" && (
          <Detail
            id={detailId}
            goBack={goBack}
            showToast={showToast}
            favs={favs}
            toggleFav={toggleFav}
          />
        )}
        {screen === "profile" && (
          <Profile
            goEdit={goEdit}
            goLogout={goLogout}
            showToast={showToast}
            userInitials={userInitials}
            userName={userName}
          />
        )}
        {screen === "editprofile" && (
          <EditProfile
            goBack={goBack}
            showToast={showToast}
            userInitials={userInitials}
            setUserName={setUserName}
            setUserInitials={setUserInitials}
          />
        )}
      </div>

      {/* Bottom nav */}
      {!["detail", "editprofile"].includes(screen) && (
        <nav
          style={{
            height: 76,
            background: "#fff",
            borderTop: "1px solid rgba(180,140,100,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 6px 10px",
            flexShrink: 0,
            zIndex: 50,
          }}
        >
          {NAV.map((s, i) => {
            const active = screen === s;
            return (
              <button
                type="button"
                key={s}
                onClick={() => navigate({ screen: s })}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  padding: "8px 4px",
                  cursor: "pointer",
                  borderRadius: 12,
                  border: "none",
                  background: "none",
                  position: "relative",
                }}
              >
                {(s === "reco" || s === "saved") && (
                  <div
                    style={{
                      position: "absolute",
                      top: 7,
                      right: "calc(50% - 15px)",
                      width: 5,
                      height: 5,
                      background: COLORS.am,
                      borderRadius: "50%",
                    }}
                  />
                )}
                <span style={{ color: active ? COLORS.am : COLORS.tx3 }}>
                  <Icon name={navIcons[i]} size={23} />
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: active ? COLORS.am : COLORS.tx3,
                  }}
                >
                  {navLabels[i]}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      <Toast msg={toast.msg} visible={toast.visible} />
    </div>
  );
}
