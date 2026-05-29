"use client";

import { useState } from "react";
import { COLORS } from "@/data/foodData";
import Icon from "@/components/ui/Icon";

// Profile
const Profile = ({ goEdit, goLogout, showToast, userInitials, userName }) => {
  const [budget, setBudget] = useState(50);
  const [prefs, setPrefs] = useState([true, false, true, false, true, false]);
  const prefItems = [
    ["🌶️", "Pedas"],
    ["🍬", "Manis"],
    ["🧂", "Gurih"],
    ["🍋", "Asam"],
    ["🥘", "Berkuah"],
    ["🥗", "Vegetarian"],
  ];
  return (
    <div
      style={{
        background: COLORS.cr,
        paddingBottom: 110,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        minHeight: "100%",
      }}
    >
      <div
        style={{
          height: 150,
          background: "linear-gradient(145deg,#1A0E08,#6B2C0A)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 70% 30%,rgba(245,162,98,.12) 0%,transparent 60%)",
          }}
        />
      </div>
      <div
        style={{
          background: "#fff",
          margin: "-44px 20px 0",
          borderRadius: 16,
          border: "1px solid rgba(180,140,100,0.16)",
          padding: 16,
          display: "flex",
          alignItems: "flex-end",
          gap: 14,
          marginBottom: 16,
          position: "relative",
          zIndex: 2,
          boxShadow: "0 2px 12px rgba(90,50,20,0.08)",
        }}
      >
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#FAC775,#E07A3C)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 700,
            color: "#fff",
            border: "3px solid #fff",
            flexShrink: 0,
          }}
        >
          {userInitials}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 21,
              fontWeight: 700,
              color: COLORS.tx,
              marginBottom: 3,
            }}
          >
            {userName}
          </div>
          <div
            style={{
              fontSize: 12,
              color: COLORS.tx3,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Icon name="map-pin" size={12} style={{ color: COLORS.am }} />{" "}
            Yogyakarta · Member 2024
          </div>
        </div>
        <button
          onClick={goEdit}
          style={{
            background: COLORS.am2,
            color: COLORS.am3,
            border: "1px solid rgba(212,105,30,.2)",
            borderRadius: 50,
            padding: "7px 14px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            flexShrink: 0,
          }}
        >
          <Icon name="pencil" size={12} /> Edit Profil
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
          padding: "0 20px",
          marginBottom: 20,
        }}
      >
        {[
          ["24", "Ulasan"],
          ["18", "Tersimpan"],
          ["312", "Check-in"],
        ].map(([v, l]) => (
          <div
            key={l}
            style={{
              background: "#fff",
              borderRadius: 10,
              border: "1px solid rgba(180,140,100,0.16)",
              padding: "14px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 24,
                fontWeight: 700,
                color: COLORS.tx,
              }}
            >
              {v}
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: COLORS.tx3,
                letterSpacing: ".05em",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>
      {/* Preferences */}
      <div style={{ padding: "0 20px", marginBottom: 20 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: COLORS.tx3,
            marginBottom: 10,
          }}
        >
          Preferensi Rasa
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 8,
          }}
        >
          {prefItems.map(([emoji, label], i) => (
            <div
              key={i}
              onClick={() =>
                setPrefs((p) => p.map((v, j) => (j === i ? !v : v)))
              }
              style={{
                background: prefs[i] ? COLORS.am2 : "#fff",
                borderRadius: 10,
                border: `1px solid ${prefs[i] ? "rgba(212,105,30,.3)" : "rgba(180,140,100,0.16)"}`,
                padding: "12px 8px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all .15s",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{emoji}</div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: prefs[i] ? COLORS.am3 : COLORS.tx3,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Budget */}
      <div style={{ padding: "0 20px", marginBottom: 20 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: COLORS.tx3,
            marginBottom: 10,
          }}
        >
          Budget Harian
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(180,140,100,0.16)",
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 13, color: COLORS.tx2, fontWeight: 500 }}>
              Maksimum per hari
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.tx }}>
              Rp {budget}.000
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            style={{ width: "100%", marginBottom: 7, accentColor: COLORS.am }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: COLORS.tx3,
            }}
          >
            <span>Rp 10k</span>
            <span>Rp 200k</span>
          </div>
        </div>
      </div>
      <div style={{ padding: "0 20px", marginBottom: 20 }}>
        <button
          onClick={() => showToast("Preferensi berhasil disimpan! ✓")}
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
          <Icon name="save" size={16} /> Simpan Preferensi
        </button>
      </div>
      <div style={{ paddingBottom: 20 }}>
        {[
          ["user-edit", "Edit Profil", () => goEdit()],
          ["bell", "Notifikasi", () => showToast("Pengaturan notifikasi 🔔")],
          [
            "map-pin",
            "Lokasi & Jarak",
            () => showToast("Pengaturan lokasi 📍"),
          ],
          [
            "shield",
            "Privasi & Keamanan",
            () => showToast("Pengaturan privasi 🔒"),
          ],
        ].map(([icon, label, fn]) => (
          <div
            key={label}
            onClick={fn}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 20px",
              borderBottom: "1px solid rgba(180,140,100,0.16)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 11,
                background: COLORS.am2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.am,
                flexShrink: 0,
              }}
            >
              <Icon name={icon} size={19} />
            </div>
            <span
              style={{
                flex: 1,
                fontSize: 14,
                color: COLORS.tx,
                fontWeight: 500,
              }}
            >
              {label}
            </span>
            <Icon
              name="chevron-right"
              size={18}
              style={{ color: COLORS.tx3 }}
            />
          </div>
        ))}
        <div
          onClick={goLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 20px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: "#FBEAF0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#B5345C",
              flexShrink: 0,
            }}
          >
            <Icon name="logout" size={19} />
          </div>
          <span
            style={{ flex: 1, fontSize: 14, color: "#B5345C", fontWeight: 500 }}
          >
            Keluar
          </span>
          <Icon name="chevron-right" size={18} style={{ color: COLORS.tx3 }} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
