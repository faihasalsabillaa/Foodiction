"use client";

import { useState } from "react";
import { COLORS, SEARCH_INDEX } from "@/data/foodData";
import Icon from "@/components/ui/Icon";
import FoodCard from "@/components/ui/FoodCard";
import Tag from "@/components/ui/Tag";
import Rat from "@/components/ui/RatingPill";

// Explore
const Explore = ({ goDetail, filterKw }) => {
  const [search, setSearch] = useState(filterKw || "");
  const [chip, setChip] = useState(filterKw ? filterKw : "Semua");
  const [showDrop, setShowDrop] = useState(false);
  const allFoods = [
    [
      "gudeg",
      "#FAE8D8",
      "🍛",
      "Gudeg Bu Tjitro",
      "Jl. Bugisan Selatan · 1.2 km",
      [
        ["Pagi", ""],
        ["Ikonik", "g"],
      ],
      "Rp 25k",
      "4.8",
      "gudeg tradisional sarapan pagi legendaris",
    ],
    [
      "angkringan",
      "#FFF3E0",
      "🍢",
      "Angkringan Lek Man",
      "Jl. Mangkubumi · 0.4 km",
      [
        ["Malam", ""],
        ["Murah", "b"],
      ],
      "Rp 5k",
      "4.9",
      "angkringan street food malam murah",
    ],
    [
      "bakmi",
      "#E8F5EE",
      "🍜",
      "Bakmi Jawa Mbah Gito",
      "Jl. Kaliurang KM 5 · 0.8 km",
      [
        ["Malam", ""],
        ["Budget", "b"],
      ],
      "Rp 18k",
      "4.6",
      "bakmi jawa mi malam budget",
    ],
    [
      "soto",
      "#F3EEFF",
      "🥣",
      "Soto Kadipiro",
      "Jl. Wates KM 1 · 2.1 km",
      [
        ["Pagi", ""],
        ["Legendaris", "p"],
      ],
      "Rp 20k",
      "4.7",
      "soto sup tradisional pagi legendaris",
    ],
    [
      "wedang",
      "#FBEAF0",
      "☕",
      "Wedang Uwuh Keraton",
      "Alun-Alun Kidul · 3.0 km",
      [
        ["Minuman", ""],
        ["Herbal", "g"],
      ],
      "Rp 10k",
      "4.5",
      "wedang minuman herbal tradisional",
    ],
  ];
  const q = search.toLowerCase();
  const filtered = allFoods.filter(([id, , , name, place, , , , kw]) =>
    !q
      ? chip === "Semua" ||
        kw.includes(chip.toLowerCase()) ||
        name.toLowerCase().includes(chip.toLowerCase())
      : name.toLowerCase().includes(q) || kw.includes(q),
  );
  const dropResults = SEARCH_INDEX.filter(
    (r) =>
      q.length >= 2 &&
      (r.name.toLowerCase().includes(q) || r.keywords.includes(q)),
  );
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
          <Icon
            name="search"
            size={18}
            style={{ color: COLORS.tx3, flexShrink: 0 }}
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDrop(true);
            }}
            onBlur={() => setTimeout(() => setShowDrop(false), 150)}
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
              onClick={() => {
                setSearch("");
                setShowDrop(false);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: COLORS.tx3,
                padding: 0,
              }}
            >
              <Icon name="x" size={16} />
            </button>
          )}
          <Icon
            name="adjustments"
            size={18}
            style={{ color: COLORS.am, flexShrink: 0 }}
          />
        </div>
        {showDrop && dropResults.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              borderRadius: 16,
              border: "1px solid rgba(180,140,100,0.16)",
              overflow: "hidden",
              zIndex: 50,
              marginTop: 4,
              boxShadow: "0 8px 28px rgba(90,50,20,0.13)",
            }}
          >
            {dropResults.map((r) => (
              <div
                key={r.id}
                onMouseDown={() => {
                  goDetail(r.id);
                  setSearch("");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(180,140,100,0.16)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = COLORS.cr2)
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: r.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {r.emoji}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORS.tx,
                      marginBottom: 2,
                    }}
                  >
                    {r.name}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.tx3 }}>
                    {r.place} · {r.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
        {[
          "Semua",
          "Terdekat",
          "Terpopuler",
          "Budget <20k",
          "Buka Sekarang",
        ].map((c) => (
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
      {/* Nearby cards */}
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
        Terdekat dari Kamu
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
        {[
          ["angkringan", "🍢", "Angkringan Lek Man", "0.4 km", "Malam", "4.9"],
          ["bakmi", "🍜", "Bakmi Mbah Gito", "0.8 km", "Malam", "4.6"],
          ["gudeg", "🍛", "Gudeg Bu Tjitro", "1.2 km", "Pagi", "4.8"],
          ["soto", "🥣", "Soto Kadipiro", "2.1 km", "Pagi", "4.7"],
        ].map(([id, emoji, name, dist, tag, rat]) => (
          <div
            key={id}
            onClick={() => goDetail(id)}
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
            <div style={{ fontSize: 28, marginBottom: 6 }}>{emoji}</div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 14,
                fontWeight: 600,
                color: COLORS.tx,
                marginBottom: 3,
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.tx3,
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icon name="map-pin" size={11} style={{ color: COLORS.tx3 }} />{" "}
              {dist}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Tag label={tag} type="" />
              <Rat val={rat} />
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
        {q ? `${filtered.length} hasil ditemukan` : "Semua Kuliner"}
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 10, color: COLORS.tx3 }}>
            <Icon name="mood-empty" size={40} style={{ color: COLORS.tx3 }} />
          </div>
          <p style={{ fontSize: 14, color: COLORS.tx3 }}>
            Tidak ada hasil untuk pencarian ini
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(([id, bg, emoji, name, place, tags, price, rat]) => (
            <FoodCard
              key={id}
              thumbBg={bg}
              emoji={emoji}
              name={name}
              place={place}
              tags={tags}
              price={price}
              rating={rat}
              onClick={() => goDetail(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
