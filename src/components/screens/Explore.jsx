"use client";

import { useState, useEffect } from "react";
import { COLORS } from "@/data/foodData";
import Icon from "@/components/ui/Icon";
import FoodCard from "@/components/ui/FoodCard";
import Tag from "@/components/ui/Tag";
import Rat from "@/components/ui/RatingPill";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const Explore = ({ goDetail, filterKw }) => {
  const [search, setSearch] = useState(filterKw || "");
  const [chip, setChip] = useState("Semua");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (chip === "Budget <20k") params.set("max_budget", 20000);
        const res = await fetch(`${BASE_URL}/restaurants?${params.toString()}`);
        const json = await res.json();
        setRestaurants(json.data?.restaurants || []);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [search, chip]);

  // Filter open now on the client side
  const filtered = restaurants.filter((r) => {
    if (chip === "Terpopuler") return Number(r.rating) >= 4.5;
    if (chip === "Buka Sekarang") {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      return r.open_period?.includes(hhmm) ?? true;
    }
    return true;
  });

  const nearby = [...restaurants]
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, 4);

  const tagColor = (tag) => {
    if (!tag) return "";
    const t = tag.toLowerCase();
    if (t.includes("pagi") || t.includes("siang")) return "";
    if (t.includes("malam") || t.includes("murah") || t.includes("budget")) return "b";
    if (t.includes("legendaris") || t.includes("ikonik")) return "p";
    return "g";
  };

  return (
    <div
      style={{
        background: COLORS.cr,
        padding: "14px 20px 110px",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        minHeight: "100%",
      }}
    >
      <div
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: 27,
          fontWeight: 700,
          color: COLORS.tx,
          lineHeight: 1.15,
          marginBottom: 16,
        }}
      >
        Jelajahi
        <br />
        <em style={{ fontStyle: "italic", color: COLORS.am }}>Kuliner Yogya</em>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#fff",
            border: "1px solid rgba(180,140,100,0.28)",
            borderRadius: 50,
            padding: "11px 16px",
          }}
        >
          <Icon name="search" size={18} style={{ color: COLORS.tx3, flexShrink: 0 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              fontSize: 14,
              color: COLORS.tx,
              border: "none",
              background: "none",
              outline: "none",
              fontFamily: "inherit",
            }}
            placeholder="Cari makanan atau warung..."
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.tx3, padding: 0 }}
            >
              <Icon name="x" size={16} />
            </button>
          )}
          <Icon name="adjustments" size={18} style={{ color: COLORS.am, flexShrink: 0 }} />
        </div>
      </div>

      {/* Chips */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 2,
          scrollbarWidth: "none",
          marginBottom: 16,
        }}
      >
        {["Semua", "Terdekat", "Terpopuler", "Budget <20k", "Buka Sekarang"].map((c) => (
          <div
            key={c}
            onClick={() => setChip(c)}
            style={{
              flexShrink: 0,
              padding: "7px 15px",
              borderRadius: 50,
              fontSize: 13,
              fontWeight: 500,
              border: `1px solid ${chip === c ? COLORS.am : "rgba(180,140,100,0.28)"}`,
              background: chip === c ? COLORS.am : "#fff",
              color: chip === c ? "#fff" : COLORS.tx2,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {c}
          </div>
        ))}
      </div>

      {/* Nearby */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: COLORS.tx3,
          marginBottom: 12,
        }}
      >
        Teratas dari Database
      </div>
      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          scrollbarWidth: "none",
          marginBottom: 20,
        }}
      >
        {nearby.map((r) => (
          <div
            key={r.id}
            onClick={() => goDetail(r.id)}
            style={{
              flexShrink: 0,
              width: 155,
              background: "#fff",
              borderRadius: 16,
              border: "1px solid rgba(180,140,100,0.16)",
              padding: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>🍽️</div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 14,
                fontWeight: 600,
                color: COLORS.tx,
                marginBottom: 3,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {r.name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 6,
              }}
            >
              <Tag label={r.tags?.[0] || "Kuliner"} type={tagColor(r.tags?.[0])} />
              <Rat val={r.rating} />
            </div>
          </div>
        ))}
      </div>

      {/* List */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: COLORS.tx3,
          marginBottom: 12,
        }}
      >
        {search ? `${filtered.length} hasil ditemukan` : "Semua Kuliner"}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: COLORS.tx3 }}>
          Memuat data...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ fontSize: 14, color: COLORS.tx3 }}>
            Tidak ada hasil untuk pencarian ini
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((r) => (
            <FoodCard
              key={r.id}
              thumbBg={"#FAE8D8"}
              emoji={"🍽️"}
              name={r.name}
              place={r.open_period?.split(";")[0]?.replace("weekday:", "").trim() || "Yogyakarta"}
              tags={r.tags?.slice(0, 2).map((t) => [t, tagColor(t)]) || []}
              price={`⭐ ${r.rating}`}
              rating={r.rating}
              onClick={() => goDetail(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
