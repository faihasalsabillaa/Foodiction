"use client";

import { useState } from "react";
import { COLORS, FD } from "@/data/foodData";
import Icon from "@/components/ui/Icon";
import Tag from "@/components/ui/Tag";

// Detail
const Detail = ({ id, goBack, showToast, favs, toggleFav }) => {
  const [selStars, setSelStars] = useState(1);
  const [revText, setRevText] = useState("");
  const [revs, setRevs] = useState([
    {
      init: "RA",
      initBg: "#FBEAF0",
      initCol: "#B5345C",
      name: "Ratu Faiha",
      date: "2 hari lalu",
      stars: 5,
      body: "Gudegnya manis banget! Sangat recommended buat sarapan pagi. Antriannya memang panjang tapi worth it banget.",
    },
    {
      init: "YB",
      initBg: "#E5F0E5",
      initCol: "#2D6A2D",
      name: "Yohana Butar",
      date: "5 hari lalu",
      stars: 4,
      body: "Lokasinya strategis, porsi cukup dan rasanya autentik. Pelayannya ramah. Harga sesuai kualitas!",
    },
  ]);
  const d = FD[id];
  if (!d) return null;
  const isFav = favs.includes(id);
  const submitRev = () => {
    if (!revText.trim()) {
      showToast("Tulis ulasan dulu ya!");
      return;
    }
    setRevs([
      {
        init: "AU",
        initBg: COLORS.am2,
        initCol: COLORS.am3,
        name: "Kamu",
        date: "Baru saja",
        stars: selStars,
        body: revText,
      },
      ...revs,
    ]);
    setRevText("");
    showToast("Ulasan berhasil dikirim! ✓");
  };
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
          height: 230,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 88,
          position: "relative",
          overflow: "hidden",
          background: d.bg,
        }}
      >
        <button
          onClick={goBack}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            width: 38,
            height: 38,
            background: "#fff",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 12px rgba(90,50,20,0.08)",
            color: COLORS.tx,
            zIndex: 5,
          }}
        >
          <Icon name="arrow-left" size={19} />
        </button>
        <button
          onClick={() => {
            toggleFav(id);
            showToast(
              isFav ? "Dihapus dari favorit" : "Disimpan ke favoritmu! 🔖",
            );
          }}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 38,
            height: 38,
            background: "#fff",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 12px rgba(90,50,20,0.08)",
            zIndex: 5,
            color: isFav ? "#E53935" : COLORS.tx3,
          }}
        >
          <Icon name={isFav ? "heart-filled" : "heart"} size={19} />
        </button>
        <span
          style={{
            position: "relative",
            zIndex: 1,
            filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.15))",
          }}
        >
          {d.emoji}
        </span>
      </div>
      <div style={{ padding: 20 }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 26,
            fontWeight: 700,
            color: COLORS.tx,
            marginBottom: 5,
          }}
        >
          {d.name}
        </div>
        <div
          style={{
            fontSize: 13,
            color: COLORS.tx3,
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Icon name="map-pin" size={15} style={{ color: COLORS.am }} />{" "}
          {d.addr}
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          {d.tags.map(([l, t], i) => (
            <Tag key={i} label={l} type={t} />
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {[
            ["Rating", d.rating],
            ["Jarak", d.dist],
            ["Mulai dari", d.price],
          ].map(([l, v]) => (
            <div
              key={l}
              style={{
                background: COLORS.cr2,
                borderRadius: 10,
                padding: "12px 10px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: COLORS.tx,
                  marginBottom: 2,
                }}
              >
                {v}
              </div>
              <div style={{ fontSize: 11, color: COLORS.tx3 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[
            [`clock`, d.hours],
            ["tag", d.cat],
          ].map(([icon, txt]) => (
            <div
              key={txt}
              style={{
                flex: 1,
                background: "#fff",
                borderRadius: 10,
                border: "1px solid rgba(180,140,100,0.16)",
                padding: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                color: COLORS.tx2,
              }}
            >
              <Icon
                name={icon}
                size={16}
                style={{ color: COLORS.am, flexShrink: 0 }}
              />{" "}
              {txt}
            </div>
          ))}
        </div>
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.75,
            color: COLORS.tx2,
            marginBottom: 18,
          }}
        >
          {d.desc}
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[
            ["map-2", "Rute"],
            ["phone", "Hubungi"],
            ["share", "Bagikan"],
            ["bookmark", "Simpan"],
          ].map(([icon, label]) => (
            <button
              key={label}
              onClick={() => showToast(`${label}... ✓`)}
              style={{
                flex: 1,
                background: "#fff",
                border: "1px solid rgba(180,140,100,0.16)",
                borderRadius: 10,
                padding: 11,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                cursor: "pointer",
                fontSize: 10,
                fontWeight: 700,
                color: COLORS.tx2,
                fontFamily: "inherit",
                letterSpacing: ".02em",
                textTransform: "uppercase",
              }}
            >
              <Icon name={icon} size={20} style={{ color: COLORS.am }} />{" "}
              {label}
            </button>
          ))}
        </div>
        {/* Reviews */}
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
          Ulasan Pengunjung
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(180,140,100,0.16)",
            padding: 14,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#FAC775,#E07A3C)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              AU
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  onClick={() => setSelStars(s)}
                  style={{
                    fontSize: 22,
                    cursor: "pointer",
                    color: s <= selStars ? "#EF9F27" : "#D8CEC4",
                    lineHeight: 1,
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <textarea
            value={revText}
            onChange={(e) => setRevText(e.target.value)}
            rows={3}
            placeholder="Ceritakan pengalamanmu..."
            style={{
              width: "100%",
              border: "1px solid rgba(180,140,100,0.16)",
              borderRadius: 10,
              background: COLORS.cr,
              padding: 10,
              fontSize: 13,
              fontFamily: "inherit",
              color: COLORS.tx,
              resize: "none",
              outline: "none",
              marginBottom: 10,
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={submitRev}
            style={{
              width: "100%",
              background: COLORS.am,
              color: "#fff",
              border: "none",
              borderRadius: 50,
              padding: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Kirim Ulasan
          </button>
        </div>
        {revs.map((r, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid rgba(180,140,100,0.16)",
              padding: 14,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 7,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: r.initBg,
                  color: r.initCol,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {r.init}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.tx }}>
                {r.name}
              </span>
              <span
                style={{ fontSize: 11, color: COLORS.tx3, marginLeft: "auto" }}
              >
                {r.date}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#EF9F27", marginBottom: 5 }}>
              {"★".repeat(r.stars)}
              {"☆".repeat(5 - r.stars)}
            </div>
            <div style={{ fontSize: 13, color: COLORS.tx2, lineHeight: 1.65 }}>
              {r.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Detail;
