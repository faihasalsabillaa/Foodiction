"use client";

import { useState } from "react";
import { COLORS } from "@/data/foodData";
import FoodCard from "@/components/ui/FoodCard";

// Saved
const Saved = ({ goDetail }) => {
  const [tab, setTab] = useState("Semua");
  return (
    <div
      style={{
        background: COLORS.cr,
        padding: "14px 20px 110px",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        minHeight: "100%",
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 26,
            fontWeight: 700,
            color: COLORS.tx,
            marginBottom: 3,
          }}
        >
          Tersimpan
        </div>
        <div style={{ fontSize: 13, color: COLORS.tx3 }}>
          2 tempat favoritmu
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["Semua", "Dikunjungi", "Wishlist"].map((t) => (
          <div
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "7px 16px",
              borderRadius: 50,
              fontSize: 13,
              fontWeight: 500,
              border: `1px solid ${tab === t ? COLORS.am : "rgba(180,140,100,0.28)"}`,
              background: tab === t ? COLORS.am : "#fff",
              color: tab === t ? "#fff" : COLORS.tx2,
              cursor: "pointer",
            }}
          >
            {t}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <FoodCard
          thumbBg="#FAE8D8"
          emoji="🍛"
          name="Gudeg Bu Tjitro"
          place="Jl. Bugisan Selatan"
          tags={[["Ikonik", "g"]]}
          price="Rp 25k"
          rating="4.8"
          onClick={() => goDetail("gudeg")}
        />
        <FoodCard
          thumbBg="#F3EEFF"
          emoji="🥣"
          name="Soto Kadipiro"
          place="Jl. Wates KM 1"
          tags={[["Legendaris", "p"]]}
          price="Rp 20k"
          rating="4.7"
          onClick={() => goDetail("soto")}
        />
      </div>
    </div>
  );
};

export default Saved;
