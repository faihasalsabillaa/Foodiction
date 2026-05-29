"use client";

import { useState } from "react";
import { COLORS } from "@/data/foodData";
import Icon from "@/components/ui/Icon";

// Onboarding
const slides = [
  {
    ill: "🍛",
    title: (
      <>
        Temukan Kuliner{" "}
        <em style={{ fontStyle: "italic", color: COLORS.am }}>Yogya</em>{" "}
        Terbaikmu
      </>
    ),
    body: "Dari Gudeg legendaris hingga Angkringan tersembunyi — semua ada di Foodiction.",
  },
  {
    ill: "✨",
    title: (
      <>
        Rekomendasi{" "}
        <em style={{ fontStyle: "italic", color: COLORS.am }}>Cerdas</em>{" "}
        Untukmu
      </>
    ),
    body: "Sistem kami memahami waktu, budget, dan seleramu untuk menyajikan pilihan terbaik setiap saat.",
  },
  {
    ill: "📍",
    title: (
      <>
        Kuliner{" "}
        <em style={{ fontStyle: "italic", color: COLORS.am }}>Terdekat</em> dari
        Lokasimu
      </>
    ),
    body: "Temukan warung dan restoran di sekitarmu dengan mudah dan cepat.",
  },
];

const Onboarding = ({ onDone }) => {
  const [idx, setIdx] = useState(0);
  const next = () => {
    if (idx < 2) setIdx(idx + 1);
    else onDone();
  };
  return (
    <div
      style={{
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px 32px",
        }}
      >
        <div
          style={{
            fontSize: 90,
            marginBottom: 24,
            filter: "drop-shadow(0 8px 20px rgba(212,105,30,.2))",
          }}
        >
          {slides[idx].ill}
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 32,
            fontWeight: 700,
            color: COLORS.tx,
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 12,
          }}
        >
          {slides[idx].title}
        </div>
        <div
          style={{
            fontSize: 14,
            color: COLORS.tx2,
            textAlign: "center",
            lineHeight: 1.7,
          }}
        >
          {slides[idx].body}
        </div>
      </div>
      <div style={{ padding: "0 28px 36px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 7,
            marginBottom: 22,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: i === idx ? 22 : 7,
                height: 7,
                borderRadius: i === idx ? 4 : "50%",
                background: i === idx ? COLORS.am : "#E0D5C8",
                transition: "all .2s",
              }}
            />
          ))}
        </div>
        <button
          onClick={next}
          style={{
            width: "100%",
            background: COLORS.am,
            color: "#fff",
            border: "none",
            borderRadius: 50,
            padding: "14px 0",
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
          {idx < 2 ? "Lanjut" : "Mulai Sekarang"}{" "}
          <Icon name="arrow-right" size={16} />
        </button>
        <button
          onClick={onDone}
          style={{
            width: "100%",
            marginTop: 10,
            background: "transparent",
            color: COLORS.tx2,
            border: "1px solid rgba(180,140,100,0.28)",
            borderRadius: 50,
            padding: 13,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Masuk dengan akun yang ada
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
