"use client";

import { useState } from "react";
import { COLORS } from "@/data/foodData";
import Icon from "@/components/ui/Icon";

// Login
const Login = ({ onLogin }) => {
  const [tab, setTab] = useState("masuk");
  const [showPw, setShowPw] = useState(false);
  const [pwStr, setPwStr] = useState(0);
  const checkPw = (v) => {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    setPwStr(s);
  };
  const segCol = (i) => {
    if (pwStr === 0) return "#E0D5C8";
    if (i < pwStr) {
      if (pwStr <= 1) return "#E53935";
      if (pwStr <= 2) return "#F5A623";
      return "#43A047";
    }
    return "#E0D5C8";
  };
  const inp = {
    border: "1px solid rgba(180,140,100,0.28)",
    borderRadius: 10,
    background: COLORS.cr,
    padding: "12px 14px",
    fontSize: 14,
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    color: COLORS.tx,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        background: COLORS.cr,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      <div
        style={{
          background: "linear-gradient(160deg,#1A0E08,#6B2C0A)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 0 28px",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
          minHeight: 180,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(245,162,98,.08)",
            top: -80,
            right: -60,
          }}
        />
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 38,
            fontWeight: 700,
            color: "#fff",
            position: "relative",
            zIndex: 1,
          }}
        >
          Food<em style={{ fontStyle: "italic", color: COLORS.am4 }}>iction</em>
        </div>
        <div
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,.5)",
            position: "relative",
            zIndex: 1,
            marginTop: 4,
          }}
        >
          Selamat datang kembali 👋
        </div>
      </div>
      <div style={{ flex: 1, padding: "28px 24px", overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            background: COLORS.cr2,
            borderRadius: 50,
            padding: 4,
            marginBottom: 24,
          }}
        >
          {["masuk", "daftar"].map((t) => (
            <div
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: 9,
                textAlign: "center",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: 50,
                transition: "all .15s",
                background: tab === t ? "#fff" : "transparent",
                color: tab === t ? COLORS.tx : COLORS.tx3,
                boxShadow:
                  tab === t ? "0 2px 12px rgba(90,50,20,0.08)" : "none",
              }}
            >
              {t === "masuk" ? "Masuk" : "Daftar"}
            </div>
          ))}
        </div>
        {tab === "masuk" ? (
          <>
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.tx2,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Email
              </label>
              <input style={inp} type="email" placeholder="contoh@email.com" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.tx2,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...inp, paddingRight: 44 }}
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: COLORS.tx3,
                  }}
                >
                  <Icon name={showPw ? "eye-off" : "eye"} size={18} />
                </button>
              </div>
            </div>
            <div
              style={{
                textAlign: "right",
                fontSize: 12,
                color: COLORS.am,
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: 14,
              }}
            >
              Lupa password?
            </div>
            <button
              onClick={onLogin}
              style={{
                width: "100%",
                background: COLORS.am,
                color: "#fff",
                border: "none",
                borderRadius: 50,
                padding: 14,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontFamily: "inherit",
              }}
            >
              Masuk <Icon name="arrow-right" size={16} />
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "18px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(180,140,100,0.28)",
                }}
              />
              <span
                style={{ fontSize: 12, color: COLORS.tx3, fontWeight: 500 }}
              >
                atau
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(180,140,100,0.28)",
                }}
              />
            </div>
            <button
              onClick={onLogin}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: 12,
                border: "1px solid rgba(180,140,100,0.28)",
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 600,
                color: COLORS.tx,
                background: "#fff",
                cursor: "pointer",
                width: "100%",
                fontFamily: "inherit",
                marginBottom: 10,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.34-8.16 2.34-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              Lanjut dengan Google
            </button>
            <div
              style={{ textAlign: "center", fontSize: 13, color: COLORS.tx3 }}
            >
              Belum punya akun?{" "}
              <span
                onClick={() => setTab("daftar")}
                style={{ color: COLORS.am, fontWeight: 600, cursor: "pointer" }}
              >
                Daftar gratis
              </span>
            </div>
          </>
        ) : (
          <>
            {[
              ["Nama Lengkap", "text", "Nama kamu"],
              ["Email", "email", "contoh@email.com"],
            ].map(([l, t, p]) => (
              <div key={l} style={{ marginBottom: 14 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLORS.tx2,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {l}
                </label>
                <input style={inp} type={t} placeholder={p} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.tx2,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...inp, paddingRight: 44 }}
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 karakter"
                  onChange={(e) => checkPw(e.target.value)}
                />
                <button
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: COLORS.tx3,
                  }}
                >
                  <Icon name={showPw ? "eye-off" : "eye"} size={18} />
                </button>
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 3,
                      borderRadius: 2,
                      background: segCol(i),
                      transition: "background .3s",
                    }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={onLogin}
              style={{
                width: "100%",
                background: COLORS.am,
                color: "#fff",
                border: "none",
                borderRadius: 50,
                padding: 14,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontFamily: "inherit",
                marginTop: 4,
              }}
            >
              Buat Akun <Icon name="arrow-right" size={16} />
            </button>
            <div
              style={{
                textAlign: "center",
                fontSize: 13,
                color: COLORS.tx3,
                marginTop: 16,
              }}
            >
              Sudah punya akun?{" "}
              <span
                onClick={() => setTab("masuk")}
                style={{ color: COLORS.am, fontWeight: 600, cursor: "pointer" }}
              >
                Masuk
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
