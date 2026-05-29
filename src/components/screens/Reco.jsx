"use client";

import { useMemo, useState } from "react";
import { COLORS } from "@/data/foodData";
import Icon from "@/components/ui/Icon";
import Tag from "@/components/ui/Tag";
import Rat from "@/components/ui/RatingPill";

const FONT_DISPLAY = "\'Cormorant Garamond\', serif";
const FONT_BODY = "\'Plus Jakarta Sans\', sans-serif";

const CONTEXTS = [
  {
    id: "balanced",
    label: "Smart Pick",
    icon: "sparkles",
    title: "Pilihan paling aman untuk hari ini",
    subtitle: "Seimbang antara rating, jarak, harga, dan jam buka.",
    accent: COLORS.am,
  },
  {
    id: "nearby",
    label: "Dekat UGM",
    icon: "map-pin",
    title: "Cepat sampai, cocok saat jadwal padat",
    subtitle: "Fokus ke tempat yang dekat dan mudah dijangkau.",
    accent: "#2D6A2D",
  },
  {
    id: "budget",
    label: "Budget Hemat",
    icon: "dollar",
    title: "Tetap kenyang tanpa boros",
    subtitle: "Pilihan murah, cocok untuk mahasiswa dan makan harian.",
    accent: "#4356AF",
  },
  {
    id: "comfort",
    label: "Comfort Food",
    icon: "flame",
    title: "Rasa gurih, hangat, dan satisfying",
    subtitle: "Untuk saat kamu ingin makanan yang lebih comforting.",
    accent: "#A84C0F",
  },
];

const PICKS = {
  balanced: [
    {
      id: "gudeg",
      rank: "01",
      emoji: "🍛",
      name: "Gudeg Bu Tjitro",
      reason: "Paling cocok untuk first-time culinary discovery di Yogya.",
      distance: "1.2 km",
      time: "06.00–14.00",
      price: "Rp 25k",
      rating: "4.8",
      bg: "linear-gradient(135deg,#FAE8D8,#F5C9A0)",
      tags: [
        ["Ikonik", "g"],
        ["Tradisional", "p"],
      ],
    },
    {
      id: "bakmi",
      rank: "02",
      emoji: "🍜",
      name: "Bakmi Jawa Mbah Gito",
      reason: "Pilihan gurih untuk makan malam dengan rasa khas arang.",
      distance: "0.8 km",
      time: "17.00–23.00",
      price: "Rp 18k",
      rating: "4.6",
      bg: "linear-gradient(135deg,#E8F5EE,#B8E0CB)",
      tags: [
        ["Malam", ""],
        ["Gurih", "b"],
      ],
    },
    {
      id: "angkringan",
      rank: "03",
      emoji: "🍢",
      name: "Angkringan Lek Man",
      reason: "Tempat santai, murah, dan kuat secara local experience.",
      distance: "0.4 km",
      time: "17.00–01.00",
      price: "Rp 5k",
      rating: "4.9",
      bg: "linear-gradient(135deg,#FFF3E0,#FFDAB0)",
      tags: [
        ["Murah", "b"],
        ["Nongkrong", "g"],
      ],
    },
  ],
  nearby: [
    {
      id: "angkringan",
      rank: "01",
      emoji: "🍢",
      name: "Angkringan Lek Man",
      reason: "Paling dekat dari area UGM dan tetap buka sampai malam.",
      distance: "0.4 km",
      time: "17.00–01.00",
      price: "Rp 5k",
      rating: "4.9",
      bg: "linear-gradient(135deg,#FFF3E0,#FFDAB0)",
      tags: [
        ["Terdekat", "b"],
        ["Murah", "g"],
      ],
    },
    {
      id: "bakmi",
      rank: "02",
      emoji: "🍜",
      name: "Bakmi Jawa Mbah Gito",
      reason: "Dekat, hangat, dan cocok untuk makan santai setelah kelas.",
      distance: "0.8 km",
      time: "17.00–23.00",
      price: "Rp 18k",
      rating: "4.6",
      bg: "linear-gradient(135deg,#E8F5EE,#B8E0CB)",
      tags: [
        ["Dekat", "b"],
        ["Dinner", ""],
      ],
    },
    {
      id: "gudeg",
      rank: "03",
      emoji: "🍛",
      name: "Gudeg Bu Tjitro",
      reason: "Jarak masih aman untuk kuliner khas Yogya yang ikonik.",
      distance: "1.2 km",
      time: "06.00–14.00",
      price: "Rp 25k",
      rating: "4.8",
      bg: "linear-gradient(135deg,#FAE8D8,#F5C9A0)",
      tags: [
        ["Ikonik", "g"],
        ["Pagi", ""],
      ],
    },
  ],
  budget: [
    {
      id: "angkringan",
      rank: "01",
      emoji: "🍢",
      name: "Angkringan Lek Man",
      reason: "Best value: murah, banyak pilihan, dan cocok buat nongkrong.",
      distance: "0.4 km",
      time: "17.00–01.00",
      price: "Rp 5k",
      rating: "4.9",
      bg: "linear-gradient(135deg,#FFF3E0,#FFDAB0)",
      tags: [
        ["Value Deal", "b"],
        ["Hemat", "g"],
      ],
    },
    {
      id: "wedang",
      rank: "02",
      emoji: "☕",
      name: "Wedang Uwuh Keraton",
      reason: "Pilihan ringan dan murah untuk refresh tanpa makan besar.",
      distance: "3.0 km",
      time: "08.00–22.00",
      price: "Rp 8k",
      rating: "4.5",
      bg: "linear-gradient(135deg,#FBEAF0,#F5C0D5)",
      tags: [
        ["Minuman", ""],
        ["Herbal", "g"],
      ],
    },
    {
      id: "bakmi",
      rank: "03",
      emoji: "🍜",
      name: "Bakmi Jawa Mbah Gito",
      reason: "Masih ramah budget untuk makanan yang lebih mengenyangkan.",
      distance: "0.8 km",
      time: "17.00–23.00",
      price: "Rp 18k",
      rating: "4.6",
      bg: "linear-gradient(135deg,#E8F5EE,#B8E0CB)",
      tags: [
        ["Worth It", "b"],
        ["Gurih", ""],
      ],
    },
  ],
  comfort: [
    {
      id: "bakmi",
      rank: "01",
      emoji: "🍜",
      name: "Bakmi Jawa Mbah Gito",
      reason: "Rasa gurih dan smoky paling cocok untuk comfort food.",
      distance: "0.8 km",
      time: "17.00–23.00",
      price: "Rp 18k",
      rating: "4.6",
      bg: "linear-gradient(135deg,#E8F5EE,#B8E0CB)",
      tags: [
        ["Comfort", "p"],
        ["Gurih", "b"],
      ],
    },
    {
      id: "soto",
      rank: "02",
      emoji: "🥣",
      name: "Soto Kadipiro",
      reason: "Kuah hangat dan ringan, enak untuk recharge tenaga.",
      distance: "2.1 km",
      time: "07.00–16.00",
      price: "Rp 20k",
      rating: "4.7",
      bg: "linear-gradient(135deg,#F3EEFF,#D4C8F5)",
      tags: [
        ["Hangat", ""],
        ["Legendaris", "p"],
      ],
    },
    {
      id: "gudeg",
      rank: "03",
      emoji: "🍛",
      name: "Gudeg Bu Tjitro",
      reason: "Manis gurih khas Yogya, cocok kalau ingin rasa tradisional.",
      distance: "1.2 km",
      time: "06.00–14.00",
      price: "Rp 25k",
      rating: "4.8",
      bg: "linear-gradient(135deg,#FAE8D8,#F5C9A0)",
      tags: [
        ["Tradisional", "g"],
        ["Ikonik", "p"],
      ],
    },
  ],
};

const ITINERARY = {
  balanced: [
    "11.30",
    "Gudeg Bu Tjitro",
    "Makan siang khas Yogya yang aman untuk semua selera.",
  ],
  nearby: [
    "18.30",
    "Angkringan Lek Man",
    "Stop cepat setelah aktivitas kampus, dekat dan murah.",
  ],
  budget: [
    "20.00",
    "Angkringan Lek Man",
    "Ambil nasi kucing + sate-satean, budget tetap aman.",
  ],
  comfort: [
    "19.00",
    "Bakmi Jawa Mbah Gito",
    "Cari menu hangat dan gurih untuk tutup hari.",
  ],
};

const Reco = ({ showToast, recoMsg, timePill }) => {
  const [active, setActive] = useState("balanced");
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState([]);

  const context = CONTEXTS.find((item) => item.id === active) || CONTEXTS[0];
  const picks = PICKS[active] || PICKS.balanced;
  const selectedPick = selected || picks[0];
  const plan = ITINERARY[active] || ITINERARY.balanced;

  const matchScore = useMemo(() => {
    const score = { balanced: 92, nearby: 89, budget: 94, comfort: 91 };
    return score[active] || 90;
  }, [active]);

  const chooseContext = (id) => {
    setActive(id);
    setSelected(null);
  };

  const choosePick = (pick) => {
    setSelected(pick);
  };

  const toggleSave = (id) => {
    setSaved((current) => {
      const exists = current.includes(id);
      if (showToast)
        showToast(
          exists
            ? "Dihapus dari pilihan hari ini"
            : "Disimpan ke pilihan hari ini",
        );
      return exists ? current.filter((item) => item !== id) : [...current, id];
    });
  };

  return (
    <div
      style={{
        background: COLORS.cr,
        padding: "20px 20px 110px",
        fontFamily: FONT_BODY,
        minHeight: "100%",
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: COLORS.am2,
            border: "1px solid rgba(212,105,30,.18)",
            borderRadius: 50,
            padding: "6px 12px",
            color: COLORS.am3,
            fontSize: 11,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          <Icon name="sparkles" size={13} /> Personal food assistant
        </div>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 31,
            fontWeight: 700,
            color: COLORS.tx,
            lineHeight: 1.08,
            marginBottom: 6,
          }}
        >
          Untuk
          <br />
          <em style={{ fontStyle: "italic", color: COLORS.am }}>
            Kamu Hari Ini
          </em>
        </div>
        <div style={{ fontSize: 13, color: COLORS.tx3, lineHeight: 1.6 }}>
          Pilih konteks makanmu, lalu Foodiction bantu susun rekomendasi terbaik
          tanpa pindah halaman.
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {CONTEXTS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => chooseContext(item.id)}
              style={{
                border: `1px solid ${isActive ? item.accent : "rgba(180,140,100,0.16)"}`,
                background: isActive ? "#fff" : "rgba(255,255,255,.72)",
                borderRadius: 16,
                padding: 13,
                textAlign: "left",
                cursor: "pointer",
                boxShadow: isActive ? "0 8px 24px rgba(90,50,20,0.10)" : "none",
                fontFamily: "inherit",
                transition: "all .16s ease",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive ? item.accent : COLORS.cr2,
                  color: isActive ? "#fff" : COLORS.tx2,
                  marginBottom: 9,
                }}
              >
                <Icon name={item.icon} size={17} />
              </div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 17,
                  fontWeight: 700,
                  color: COLORS.tx,
                  lineHeight: 1.05,
                  marginBottom: 5,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 10.5,
                  fontWeight: 500,
                  color: COLORS.tx3,
                  lineHeight: 1.45,
                }}
              >
                {item.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      <div
        style={{
          background: "linear-gradient(135deg,#1A0E08 0%,#5C2A10 100%)",
          borderRadius: 22,
          padding: 18,
          marginBottom: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -34,
            top: -40,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(245,162,98,.10)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 18,
            bottom: 12,
            fontSize: 56,
            opacity: 0.22,
          }}
        >
          {selectedPick.emoji}
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: COLORS.am4,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icon name="sparkles" size={14} style={{ color: COLORS.am4 }} />{" "}
              AI Match Score
            </div>
            <div
              style={{
                background: "rgba(255,255,255,.12)",
                border: "1px solid rgba(255,255,255,.12)",
                color: "#fff",
                borderRadius: 50,
                padding: "5px 10px",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {matchScore}%
            </div>
          </div>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.25,
              marginBottom: 7,
            }}
          >
            {context.title}
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "rgba(255,255,255,.68)",
              lineHeight: 1.65,
            }}
          >
            {timePill ? `${timePill}: ` : ""}
            {selectedPick.reason}
          </div>
          {recoMsg && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 14,
                background: "rgba(255,255,255,.08)",
                color: "rgba(255,255,255,.82)",
                fontFamily: FONT_DISPLAY,
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1.35,
              }}
              dangerouslySetInnerHTML={{ __html: recoMsg }}
            />
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr .95fr",
          gap: 10,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(180,140,100,0.16)",
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: COLORS.tx3,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              marginBottom: 9,
            }}
          >
            Mini plan
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: COLORS.am2,
                color: COLORS.am,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 12,
              }}
            >
              {plan[0]}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: COLORS.tx,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {plan[1]}
              </div>
              <div
                style={{ fontSize: 11, color: COLORS.tx3, lineHeight: 1.45 }}
              >
                {plan[2]}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(180,140,100,0.16)",
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: COLORS.tx3,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              marginBottom: 9,
            }}
          >
            Decision
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <Icon name="circle-check" size={18} style={{ color: COLORS.gn }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.tx }}>
              Go now
            </span>
          </div>
          <div style={{ fontSize: 11, color: COLORS.tx3, lineHeight: 1.5 }}>
            Rating tinggi, budget masuk, dan masih relevan dengan konteksmu.
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 21,
              fontWeight: 700,
              color: COLORS.tx,
            }}
          >
            Top Picks
          </div>
          <div style={{ fontSize: 12, color: COLORS.tx3 }}>
            Tap card untuk lihat preview di halaman ini
          </div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, color: COLORS.am }}>
          {picks.length} pilihan
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {picks.map((pick) => {
          const isSelected = selectedPick.id === pick.id;
          const isSaved = saved.includes(pick.id);
          return (
            <button
              type="button"
              key={`${active}-${pick.id}`}
              onClick={() => choosePick(pick)}
              style={{
                background: "#fff",
                borderRadius: 18,
                border: `1px solid ${isSelected ? COLORS.am : "rgba(180,140,100,0.16)"}`,
                padding: 13,
                display: "flex",
                gap: 12,
                cursor: "pointer",
                position: "relative",
                textAlign: "left",
                fontFamily: "inherit",
                boxShadow: isSelected
                  ? "0 8px 24px rgba(90,50,20,0.10)"
                  : "none",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 14,
                  background: pick.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  flexShrink: 0,
                }}
              >
                {pick.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{ fontSize: 10, fontWeight: 900, color: COLORS.am }}
                  >
                    {pick.rank}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: 17,
                      fontWeight: 700,
                      color: COLORS.tx,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {pick.name}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: COLORS.tx3,
                    lineHeight: 1.4,
                    marginBottom: 7,
                  }}
                >
                  {pick.reason}
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {pick.tags.map(([label, type], i) => (
                    <Tag key={i} label={label} type={type} />
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                <Rat val={pick.rating} />
                <span
                  style={{ fontSize: 12, fontWeight: 800, color: COLORS.tx }}
                >
                  {pick.price}
                </span>
                <span style={{ fontSize: 10, color: COLORS.tx3 }}>
                  {pick.distance}
                </span>
              </div>
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 18,
                    boxShadow: "inset 0 0 0 1px rgba(212,105,30,.18)",
                    pointerEvents: "none",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1px solid rgba(180,140,100,0.16)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: selectedPick.bg,
            height: 112,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 54,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "rgba(255,255,255,.86)",
              color: COLORS.tx,
              borderRadius: 50,
              padding: "5px 10px",
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            Preview pilihan
          </div>
          {selectedPick.emoji}
        </div>
        <div style={{ padding: 15 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLORS.tx,
                  lineHeight: 1.1,
                }}
              >
                {selectedPick.name}
              </div>
              <div style={{ fontSize: 12, color: COLORS.tx3, marginTop: 4 }}>
                {selectedPick.time} · {selectedPick.distance}
              </div>
            </div>
            <Rat val={selectedPick.rating} />
          </div>
          <div
            style={{
              fontSize: 13,
              color: COLORS.tx2,
              lineHeight: 1.65,
              marginBottom: 13,
            }}
          >
            {selectedPick.reason} Cocok untuk kamu karena match dengan konteks{" "}
            <b>{context.label}</b> dan preferensi kuliner lokal Yogyakarta.
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}
          >
            <button
              type="button"
              onClick={() => toggleSave(selectedPick.id)}
              style={{
                border: "none",
                background: saved.includes(selectedPick.id)
                  ? COLORS.am
                  : COLORS.am2,
                color: saved.includes(selectedPick.id) ? "#fff" : COLORS.am3,
                borderRadius: 50,
                padding: "12px 10px",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <Icon name="bookmark" size={15} />{" "}
              {saved.includes(selectedPick.id) ? "Tersimpan" : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() =>
                showToast && showToast("Rencana makan berhasil dibuat")
              }
              style={{
                border: "1px solid rgba(180,140,100,0.28)",
                background: "#fff",
                color: COLORS.tx2,
                borderRadius: 50,
                padding: "12px 10px",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <Icon name="clock" size={15} /> Buat Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reco;
