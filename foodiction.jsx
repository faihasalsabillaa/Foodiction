import { useState, useEffect, useRef } from "react";

const COLORS = {
  cr: "#F9F5EF", cr2: "#F0E9DF", wh: "#FFFFFF",
  am: "#D4691E", am2: "#FBEDDF", am3: "#A84C0F", am4: "#F5A262",
  gn: "#2D6A2D", gn2: "#E5F0E5",
  tx: "#1E1410", tx2: "#6B5744", tx3: "#9C8877",
};

const FD = {
  gudeg: { emoji: "🍛", bg: "linear-gradient(135deg,#FAE8D8,#F5C9A0)", name: "Gudeg Bu Tjitro", addr: "Jl. Bugisan Selatan · Buka 06.00–14.00", hours: "06.00 – 14.00", cat: "Gudeg · Tradisional", rating: "4.8", dist: "1.2 km", price: "Rp 25k", tags: [["Pagi", ""], ["Ikonik", "g"], ["Legendaris", "p"]], desc: "Salah satu warung gudeg legendaris di Yogyakarta sejak 1925. Gudeg manis khas keraton dengan nangka muda yang dimasak semalaman menggunakan kayu bakar. Menjadi destinasi wajib wisata kuliner Yogya." },
  angkringan: { emoji: "🍢", bg: "linear-gradient(135deg,#FFF3E0,#FFDAB0)", name: "Angkringan Lek Man", addr: "Jl. Mangkubumi, dekat Tugu · Buka 17.00–01.00", hours: "17.00 – 01.00", cat: "Angkringan · Street Food", rating: "4.9", dist: "0.4 km", price: "Rp 3k", tags: [["Malam", ""], ["Murah", "b"], ["Ikonik", "g"]], desc: "Angkringan paling ikonik dekat Tugu Yogyakarta. Tempatnya nyaman di pinggir jalan, cocok buat nongkrong sambil menikmati kopi jos dan nasi kucing khas Yogya." },
  bakmi: { emoji: "🍜", bg: "linear-gradient(135deg,#E8F5EE,#B8E0CB)", name: "Bakmi Jawa Mbah Gito", addr: "Jl. Kaliurang KM 5 · Buka 17.00–23.00", hours: "17.00 – 23.00", cat: "Bakmi Jawa · Mi", rating: "4.6", dist: "0.8 km", price: "Rp 18k", tags: [["Malam", ""], ["Ramah Budget", "b"]], desc: "Bakmi Jawa tradisional dengan bumbu rempah yang kaya. Dimasak menggunakan arang untuk cita rasa smoky yang khas. Sudah berdiri lebih dari 40 tahun." },
  soto: { emoji: "🥣", bg: "linear-gradient(135deg,#F3EEFF,#D4C8F5)", name: "Soto Kadipiro", addr: "Jl. Wates KM 1 · Buka 07.00–16.00", hours: "07.00 – 16.00", cat: "Soto · Sup Tradisional", rating: "4.7", dist: "2.1 km", price: "Rp 20k", tags: [["Pagi", ""], ["Legendaris", "p"]], desc: "Soto ayam bening legendaris sejak 1921. Kuahnya segar dan gurih, dengan suwiran ayam kampung yang empuk. Wajib coba sate ususnya yang menjadi signature dish." },
  wedang: { emoji: "☕", bg: "linear-gradient(135deg,#FBEAF0,#F5C0D5)", name: "Wedang Uwuh Keraton", addr: "Alun-Alun Kidul · Buka 08.00–22.00", hours: "08.00 – 22.00", cat: "Minuman · Herbal", rating: "4.5", dist: "3.0 km", price: "Rp 8k", tags: [["Minuman", ""], ["Herbal", "g"]], desc: "Minuman rempah tradisional Yogyakarta yang menghangatkan tubuh. Terbuat dari campuran jahe, cengkeh, kayu manis, dan berbagai rempah pilihan." },
};

const SEARCH_INDEX = Object.entries(FD).map(([id, d]) => ({ id, name: d.name, emoji: d.emoji, bg: d.bg, place: d.addr.split("·")[0].trim(), price: d.price, keywords: d.cat.toLowerCase() + " " + d.tags.map(t => t[0]).join(" ").toLowerCase() }));

// ── SVG Icons ──
const Icon = ({ name, size = 18, style = {} }) => {
  const icons = {
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></>,
    "map-pin": <><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></>,
    "star-filled": <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke="none" />,
    heart: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
    "heart-filled": <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="currentColor" stroke="none" />,
    "arrow-left": <path d="m15 18-6-6 6-6" />,
    "arrow-right": <path d="m9 18 6-6-6-6" />,
    "chevron-right": <path d="m9 18 6-6-6-6" />,
    clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
    sparkles: <><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4M19 17v4M3 5h4M17 19h4" /></>,
    home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>,
    compass: <><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none" /></>,
    bookmark: <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />,
    "user-circle": <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" /></>,
    pencil: <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />,
    tag: <><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42Z" /><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" /></>,
    "map-2": <><path d="m3 7 6-3 6 3 6-3v13l-6 3-6-3-6 3V7" /><path d="M9 4v13M15 7v13" /></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>,
    "circle-check": <><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="m9 12 2 2 4-4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>,
    wifi: <><path d="M5 13a10 10 0 0 1 14 0M2 10a14 14 0 0 1 20 0M8 16a6 6 0 0 1 8 0" /><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" /></>,
    battery: <><path d="M6 7h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" /><path d="M20 11v2" /><path d="M8 11h6" strokeWidth="2.5" /></>,
    "user-edit": <><path d="M4 21v-1a4 4 0 0 1 4-4h4" /><circle cx="10" cy="8" r="4" /><path d="m21.5 15-5 5H13v-3.5l5-5 3.5 3.5Z" /></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    "eye-off": <><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></>,
    check: <polyline points="20 6 9 17 4 12" strokeWidth="2.5" />,
    camera: <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></>,
    adjustments: <><path d="M4 6h16M8 12h8M6 18h12" /><circle cx="8" cy="6" r="2" /><circle cx="16" cy="12" r="2" /><circle cx="10" cy="18" r="2" /></>,
    x: <path d="M18 6 6 18M6 6l12 12" />,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></>,
    "mood-empty": <><circle cx="12" cy="12" r="10" /><path d="M8 15h8" /><circle cx="9" cy="10" r="0.5" fill="currentColor" /><circle cx="15" cy="10" r="0.5" fill="currentColor" /></>,
    flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
    dollar: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  };
  const d = icons[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}>
      {d}
    </svg>
  );
};

// ── Tag component ──
const Tag = ({ label, type }) => {
  const styles = {
    "": { bg: "#FBEDDF", color: "#A84C0F" },
    g: { bg: "#E5F0E5", color: "#2D6A2D" },
    b: { bg: "#EEF2FF", color: "#4356AF" },
    p: { bg: "#F3EEFF", color: "#6A3FB5" },
  };
  const s = styles[type] || styles[""];
  return <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>{label}</span>;
};

// ── Rating pill ──
const Rat = ({ val }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, background: "#FFF4E4", color: "#B06000", padding: "3px 8px", borderRadius: 20 }}>
    <Icon name="star-filled" size={9} style={{ color: "#EF9F27" }} /> {val}
  </span>
);

// ── Food card (list item) ──
const FoodCard = ({ id, thumbBg, emoji, name, place, tags, price, rating, onClick }) => (
  <div onClick={onClick} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(180,140,100,0.16)", padding: 13, display: "flex", gap: 12, cursor: "pointer", transition: "box-shadow .15s,transform .15s" }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(90,50,20,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}>
    <div style={{ width: 60, height: 60, borderRadius: 12, background: thumbBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>{emoji}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: COLORS.tx, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
      <div style={{ fontSize: 12, color: COLORS.tx3, marginBottom: 6 }}>{place}</div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{tags.map(([l, t], i) => <Tag key={i} label={l} type={t} />)}</div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.tx }}>{price}</span>
      <Rat val={rating} />
    </div>
  </div>
);

// ── Toast ──
const Toast = ({ msg, visible }) => (
  <div style={{ position: "fixed", bottom: 24, left: "50%", transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`, opacity: visible ? 1 : 0, transition: "all .22s ease", background: "#1E1410", color: "#fff", borderRadius: 14, padding: "13px 20px", display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 500, zIndex: 1000, boxShadow: "0 8px 28px rgba(90,50,20,0.18)", pointerEvents: "none", whiteSpace: "nowrap" }}>
    <Icon name="circle-check" size={18} style={{ color: COLORS.am4 }} /> {msg}
  </div>
);

// ─────────────── SCREENS ───────────────

// Splash
const Splash = () => (
  <div style={{ background: "linear-gradient(160deg,#1A0E08 0%,#4A1E08 50%,#7A3010 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100%", gap: 0 }}>
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(255,255,255,.08)" }} />
      <div style={{ width: 130, height: 130, borderRadius: "50%", background: "linear-gradient(135deg,#E07A3C,#FAC775)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 62, boxShadow: "0 0 80px rgba(224,122,60,.55)", animation: "porb 3s ease-in-out infinite" }}>🍛</div>
    </div>
    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 700, color: "#fff", marginBottom: 6, letterSpacing: "-.5px" }}>Food<span style={{ color: COLORS.am4, fontStyle: "italic" }}>iction</span></div>
    <div style={{ fontSize: 14, color: "rgba(255,255,255,.5)", marginBottom: 40 }}>Kuliner Yogyakarta untuk Kamu</div>
    <div style={{ width: 140, height: 3, background: "rgba(255,255,255,.1)", borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", background: COLORS.am4, borderRadius: 2, animation: "sload 2s ease forwards" }} />
    </div>
    <style>{`@keyframes porb{0%,100%{transform:scale(1);box-shadow:0 0 80px rgba(224,122,60,.55)}50%{transform:scale(1.05);box-shadow:0 0 110px rgba(224,122,60,.75)}}@keyframes sload{0%{width:0}100%{width:100%}}`}</style>
  </div>
);

// Onboarding
const slides = [
  { ill: "🍛", title: <>Temukan Kuliner <em style={{ fontStyle: "italic", color: COLORS.am }}>Yogya</em> Terbaikmu</>, body: "Dari Gudeg legendaris hingga Angkringan tersembunyi — semua ada di Foodiction." },
  { ill: "✨", title: <>Rekomendasi <em style={{ fontStyle: "italic", color: COLORS.am }}>Cerdas</em> Untukmu</>, body: "Sistem kami memahami waktu, budget, dan seleramu untuk menyajikan pilihan terbaik setiap saat." },
  { ill: "📍", title: <>Kuliner <em style={{ fontStyle: "italic", color: COLORS.am }}>Terdekat</em> dari Lokasimu</>, body: "Temukan warung dan restoran di sekitarmu dengan mudah dan cepat." },
];

const Onboarding = ({ onDone }) => {
  const [idx, setIdx] = useState(0);
  const next = () => { if (idx < 2) setIdx(idx + 1); else onDone(); };
  return (
    <div style={{ background: "#fff", display: "flex", flexDirection: "column", minHeight: "100%", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 32px" }}>
        <div style={{ fontSize: 90, marginBottom: 24, filter: "drop-shadow(0 8px 20px rgba(212,105,30,.2))" }}>{slides[idx].ill}</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color: COLORS.tx, textAlign: "center", lineHeight: 1.2, marginBottom: 12 }}>{slides[idx].title}</div>
        <div style={{ fontSize: 14, color: COLORS.tx2, textAlign: "center", lineHeight: 1.7 }}>{slides[idx].body}</div>
      </div>
      <div style={{ padding: "0 28px 36px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 7, marginBottom: 22 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: i === idx ? 22 : 7, height: 7, borderRadius: i === idx ? 4 : "50%", background: i === idx ? COLORS.am : "#E0D5C8", transition: "all .2s" }} />)}
        </div>
        <button onClick={next} style={{ width: "100%", background: COLORS.am, color: "#fff", border: "none", borderRadius: 50, padding: "14px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
          {idx < 2 ? "Lanjut" : "Mulai Sekarang"} <Icon name="arrow-right" size={16} />
        </button>
        <button onClick={onDone} style={{ width: "100%", marginTop: 10, background: "transparent", color: COLORS.tx2, border: "1px solid rgba(180,140,100,0.28)", borderRadius: 50, padding: 13, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Masuk dengan akun yang ada</button>
      </div>
    </div>
  );
};

// Login
const Login = ({ onLogin }) => {
  const [tab, setTab] = useState("masuk");
  const [showPw, setShowPw] = useState(false);
  const [pwStr, setPwStr] = useState(0);
  const checkPw = v => { let s = 0; if (v.length >= 8) s++; if (/[A-Z]/.test(v)) s++; if (/[0-9]/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v)) s++; setPwStr(s); };
  const segCol = i => { if (pwStr === 0) return "#E0D5C8"; if (i < pwStr) { if (pwStr <= 1) return "#E53935"; if (pwStr <= 2) return "#F5A623"; return "#43A047"; } return "#E0D5C8"; };
  const inp = { border: "1px solid rgba(180,140,100,0.28)", borderRadius: 10, background: COLORS.cr, padding: "12px 14px", fontSize: 14, fontFamily: "'Plus Jakarta Sans',sans-serif", color: COLORS.tx, outline: "none", width: "100%", boxSizing: "border-box" };
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: COLORS.cr, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ background: "linear-gradient(160deg,#1A0E08,#6B2C0A)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "0 0 28px", position: "relative", overflow: "hidden", flexShrink: 0, minHeight: 180 }}>
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(245,162,98,.08)", top: -80, right: -60 }} />
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, fontWeight: 700, color: "#fff", position: "relative", zIndex: 1 }}>Food<em style={{ fontStyle: "italic", color: COLORS.am4 }}>iction</em></div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", position: "relative", zIndex: 1, marginTop: 4 }}>Selamat datang kembali 👋</div>
      </div>
      <div style={{ flex: 1, padding: "28px 24px", overflowY: "auto" }}>
        <div style={{ display: "flex", background: COLORS.cr2, borderRadius: 50, padding: 4, marginBottom: 24 }}>
          {["masuk", "daftar"].map(t => (
            <div key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: 9, textAlign: "center", fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 50, transition: "all .15s", background: tab === t ? "#fff" : "transparent", color: tab === t ? COLORS.tx : COLORS.tx3, boxShadow: tab === t ? "0 2px 12px rgba(90,50,20,0.08)" : "none" }}>
              {t === "masuk" ? "Masuk" : "Daftar"}
            </div>
          ))}
        </div>
        {tab === "masuk" ? (
          <>
            <div style={{ marginBottom: 14 }}><label style={{ fontSize: 12, fontWeight: 600, color: COLORS.tx2, display: "block", marginBottom: 6 }}>Email</label><input style={inp} type="email" placeholder="contoh@email.com" /></div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.tx2, display: "block", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}><input style={{ ...inp, paddingRight: 44 }} type={showPw ? "text" : "password"} placeholder="••••••••" /><button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: COLORS.tx3 }}><Icon name={showPw ? "eye-off" : "eye"} size={18} /></button></div>
            </div>
            <div style={{ textAlign: "right", fontSize: 12, color: COLORS.am, fontWeight: 600, cursor: "pointer", marginBottom: 14 }}>Lupa password?</div>
            <button onClick={onLogin} style={{ width: "100%", background: COLORS.am, color: "#fff", border: "none", borderRadius: 50, padding: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>Masuk <Icon name="arrow-right" size={16} /></button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}><div style={{ flex: 1, height: 1, background: "rgba(180,140,100,0.28)" }} /><span style={{ fontSize: 12, color: COLORS.tx3, fontWeight: 500 }}>atau</span><div style={{ flex: 1, height: 1, background: "rgba(180,140,100,0.28)" }} /></div>
            <button onClick={onLogin} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: 12, border: "1px solid rgba(180,140,100,0.28)", borderRadius: 50, fontSize: 14, fontWeight: 600, color: COLORS.tx, background: "#fff", cursor: "pointer", width: "100%", fontFamily: "inherit", marginBottom: 10 }}>
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.34-8.16 2.34-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>
              Lanjut dengan Google
            </button>
            <div style={{ textAlign: "center", fontSize: 13, color: COLORS.tx3 }}>Belum punya akun? <span onClick={() => setTab("daftar")} style={{ color: COLORS.am, fontWeight: 600, cursor: "pointer" }}>Daftar gratis</span></div>
          </>
        ) : (
          <>
            {[["Nama Lengkap", "text", "Nama kamu"], ["Email", "email", "contoh@email.com"]].map(([l, t, p]) => (
              <div key={l} style={{ marginBottom: 14 }}><label style={{ fontSize: 12, fontWeight: 600, color: COLORS.tx2, display: "block", marginBottom: 6 }}>{l}</label><input style={inp} type={t} placeholder={p} /></div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.tx2, display: "block", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}><input style={{ ...inp, paddingRight: 44 }} type={showPw ? "text" : "password"} placeholder="Min. 8 karakter" onChange={e => checkPw(e.target.value)} /><button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: COLORS.tx3 }}><Icon name={showPw ? "eye-off" : "eye"} size={18} /></button></div>
              <div style={{ display: "flex", gap: 4, marginTop: 5 }}>{[0, 1, 2, 3].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: segCol(i), transition: "background .3s" }} />)}</div>
            </div>
            <button onClick={onLogin} style={{ width: "100%", background: COLORS.am, color: "#fff", border: "none", borderRadius: 50, padding: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", marginTop: 4 }}>Buat Akun <Icon name="arrow-right" size={16} /></button>
            <div style={{ textAlign: "center", fontSize: 13, color: COLORS.tx3, marginTop: 16 }}>Sudah punya akun? <span onClick={() => setTab("masuk")} style={{ color: COLORS.am, fontWeight: 600, cursor: "pointer" }}>Masuk</span></div>
          </>
        )}
      </div>
    </div>
  );
};

// Home
const Home = ({ goDetail, goExplore, goReco, goProfile, userInitials, greeting, timeLbl }) => (
  <div style={{ background: COLORS.cr, paddingBottom: 24, fontFamily: "'Plus Jakarta Sans',sans-serif", minHeight: "100%" }}>
    <div style={{ padding: "14px 20px 0", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: COLORS.tx3, marginBottom: 2 }}>{greeting}</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 27, fontWeight: 700, color: COLORS.tx, lineHeight: 1.15 }}>Mau makan<br />apa hari ini? <em style={{ fontStyle: "italic", color: COLORS.am }}>✨</em></div>
        </div>
        <div onClick={goProfile} style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#FAC775,#E07A3C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", border: "2px solid #fff", boxShadow: "0 0 0 1px rgba(180,140,100,0.28)" }}>{userInitials}</div>
      </div>
      <div onClick={goExplore} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid rgba(180,140,100,0.28)", borderRadius: 50, padding: "11px 16px", cursor: "pointer" }}>
        <Icon name="search" size={18} style={{ color: COLORS.tx3 }} />
        <span style={{ flex: 1, fontSize: 14, color: COLORS.tx3 }}>Cari makanan atau warung...</span>
        <Icon name="adjustments" size={18} style={{ color: COLORS.am }} />
      </div>
    </div>
    <div style={{ padding: "0 20px", marginBottom: 14 }}>
      <div onClick={goReco} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: COLORS.am2, border: "1px solid rgba(212,105,30,.2)", borderRadius: 50, padding: "5px 12px", fontSize: 12, fontWeight: 500, color: COLORS.am3, cursor: "pointer" }}>
        <Icon name="clock" size={13} style={{ color: COLORS.am3 }} /> {timeLbl} <Icon name="chevron-right" size={13} />
      </div>
    </div>
    {/* Hero */}
    <div onClick={() => goDetail("gudeg")} style={{ background: "linear-gradient(135deg,#1A0E08 0%,#5C2A10 55%,#8A3D18 100%)", borderRadius: 22, padding: "20px 20px 18px", margin: "0 20px 18px", position: "relative", overflow: "hidden", cursor: "pointer" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 20%,rgba(245,162,98,.12) 0%,transparent 60%)" }} />
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: COLORS.am4, marginBottom: 5, position: "relative", zIndex: 1 }}>✦ Kuliner Legendaris</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 14, position: "relative", zIndex: 1 }}>Gudeg Bu Tjitro<br /><em style={{ fontStyle: "italic", color: COLORS.am4 }}>sejak 1925</em></div>
      <button style={{ display: "inline-flex", alignItems: "center", gap: 6, background: COLORS.am, color: "#fff", fontSize: 13, fontWeight: 700, padding: "9px 16px", borderRadius: 50, border: "none", cursor: "pointer", fontFamily: "inherit", position: "relative", zIndex: 1 }}>Lihat Detail <Icon name="arrow-right" size={14} /></button>
      <div style={{ position: "absolute", right: 16, bottom: 10, fontSize: 60, opacity: .85, lineHeight: 1 }}>🍛</div>
    </div>
    {/* Categories */}
    <div style={{ padding: "0 20px", marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: COLORS.tx3, marginBottom: 12 }}>Jelajahi Kategori</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {[["🌅", "Sarapan"], ["☀️", "Siang"], ["🌙", "Malam"], ["🍢", "Angkringan"], ["🍛", "Gudeg"], ["🍜", "Bakmi Jawa"], ["☕", "Wedang"], ["🏷️", "Budget"]].map(([e, n]) => (
          <div key={n} onClick={() => goExplore(n)} style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(180,140,100,0.16)", padding: "12px 8px", textAlign: "center", cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={ev => { ev.currentTarget.style.background = COLORS.am2; }} onMouseLeave={ev => { ev.currentTarget.style.background = "#fff"; }}>
            <div style={{ fontSize: 24, marginBottom: 5 }}>{e}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.tx2 }}>{n}</div>
          </div>
        ))}
      </div>
    </div>
    {/* Editor picks */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", marginBottom: 12 }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: COLORS.tx3 }}>Pilihan Editor</span>
      <button onClick={goExplore} style={{ fontSize: 12, fontWeight: 700, color: COLORS.am, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Lihat semua</button>
    </div>
    <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 20px 4px", scrollbarWidth: "none", marginBottom: 18 }}>
      {[["angkringan", "#FFF3E0", "🍢", "Angkringan Lek Man", "🔥 Hits", "4.9", "0.4 km"], ["bakmi", "#E8F5EE", "🍜", "Bakmi Mbah Gito", "🌙 Malam", "4.6", "0.8 km"], ["soto", "#F3EEFF", "🥣", "Soto Kadipiro", "🏆 Legendaris", "4.7", "2.1 km"], ["wedang", "#FBEAF0", "☕", "Wedang Uwuh Keraton", "🌿 Herbal", "4.5", "3.0 km"]].map(([id, bg, emoji, name, badge, rat, dist]) => (
        <div key={id} onClick={() => goDetail(id)} style={{ flexShrink: 0, width: 152, background: "#fff", borderRadius: 16, border: "1px solid rgba(180,140,100,0.16)", overflow: "hidden", cursor: "pointer", transition: "box-shadow .15s,transform .15s" }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(90,50,20,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}>
          <div style={{ height: 100, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, position: "relative" }}>
            {emoji}
            <span style={{ position: "absolute", top: 8, left: 8, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: "rgba(255,255,255,.92)", color: COLORS.tx }}>{badge}</span>
          </div>
          <div style={{ padding: "10px 12px 12px" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 600, color: COLORS.tx, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: COLORS.tx3 }}><span style={{ color: "#EF9F27" }}>★</span> {rat} · {dist}</div>
          </div>
        </div>
      ))}
    </div>
    {/* Trending */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", marginBottom: 12 }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: COLORS.tx3 }}>Trending Sekarang</span>
      <button onClick={goExplore} style={{ fontSize: 12, fontWeight: 700, color: COLORS.am, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Lihat semua</button>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 20px" }}>
      {[["gudeg", "#FAE8D8", "🍛", "Gudeg Bu Tjitro", "Jl. Bugisan Selatan", [["Pagi", ""], ["Ikonik", "g"]], "Rp 25k", "4.8"], ["angkringan", "#FFF3E0", "🍢", "Angkringan Lek Man", "Jl. Mangkubumi, dekat Tugu", [["Malam", ""], ["Murah", "b"]], "Rp 5k", "4.9"], ["bakmi", "#E8F5EE", "🍜", "Bakmi Jawa Mbah Gito", "Jl. Kaliurang KM 5", [["Malam", ""], ["Budget", "b"]], "Rp 18k", "4.6"]].map(([id, bg, emoji, name, place, tags, price, rat]) => (
        <FoodCard key={id} thumbBg={bg} emoji={emoji} name={name} place={place} tags={tags} price={price} rating={rat} onClick={() => goDetail(id)} />
      ))}
    </div>
  </div>
);

// Explore
const Explore = ({ goDetail, filterKw }) => {
  const [search, setSearch] = useState(filterKw || "");
  const [chip, setChip] = useState(filterKw ? filterKw : "Semua");
  const [showDrop, setShowDrop] = useState(false);
  const allFoods = [
    ["gudeg", "#FAE8D8", "🍛", "Gudeg Bu Tjitro", "Jl. Bugisan Selatan · 1.2 km", [["Pagi", ""], ["Ikonik", "g"]], "Rp 25k", "4.8", "gudeg tradisional sarapan pagi legendaris"],
    ["angkringan", "#FFF3E0", "🍢", "Angkringan Lek Man", "Jl. Mangkubumi · 0.4 km", [["Malam", ""], ["Murah", "b"]], "Rp 5k", "4.9", "angkringan street food malam murah"],
    ["bakmi", "#E8F5EE", "🍜", "Bakmi Jawa Mbah Gito", "Jl. Kaliurang KM 5 · 0.8 km", [["Malam", ""], ["Budget", "b"]], "Rp 18k", "4.6", "bakmi jawa mi malam budget"],
    ["soto", "#F3EEFF", "🥣", "Soto Kadipiro", "Jl. Wates KM 1 · 2.1 km", [["Pagi", ""], ["Legendaris", "p"]], "Rp 20k", "4.7", "soto sup tradisional pagi legendaris"],
    ["wedang", "#FBEAF0", "☕", "Wedang Uwuh Keraton", "Alun-Alun Kidul · 3.0 km", [["Minuman", ""], ["Herbal", "g"]], "Rp 10k", "4.5", "wedang minuman herbal tradisional"],
  ];
  const q = search.toLowerCase();
  const filtered = allFoods.filter(([id, , , name, place, , , , kw]) => !q ? (chip === "Semua" || kw.includes(chip.toLowerCase()) || name.toLowerCase().includes(chip.toLowerCase())) : (name.toLowerCase().includes(q) || kw.includes(q)));
  const dropResults = SEARCH_INDEX.filter(r => q.length >= 2 && (r.name.toLowerCase().includes(q) || r.keywords.includes(q)));
  return (
    <div style={{ background: COLORS.cr, padding: "14px 20px 110px", fontFamily: "'Plus Jakarta Sans',sans-serif", minHeight: "100%" }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 27, fontWeight: 700, color: COLORS.tx, lineHeight: 1.15, marginBottom: 16 }}>Jelajahi<br /><em style={{ fontStyle: "italic", color: COLORS.am }}>Kuliner Yogya</em></div>
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid rgba(180,140,100,0.28)", borderRadius: 50, padding: "11px 16px" }}>
          <Icon name="search" size={18} style={{ color: COLORS.tx3, flexShrink: 0 }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setShowDrop(true); }} onBlur={() => setTimeout(() => setShowDrop(false), 150)} style={{ flex: 1, fontSize: 14, color: COLORS.tx, border: "none", background: "none", outline: "none", fontFamily: "inherit" }} placeholder="Cari makanan atau warung..." />
          {search && <button onClick={() => { setSearch(""); setShowDrop(false); }} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.tx3, padding: 0 }}><Icon name="x" size={16} /></button>}
          <Icon name="adjustments" size={18} style={{ color: COLORS.am, flexShrink: 0 }} />
        </div>
        {showDrop && dropResults.length > 0 && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", borderRadius: 16, border: "1px solid rgba(180,140,100,0.16)", overflow: "hidden", zIndex: 50, marginTop: 4, boxShadow: "0 8px 28px rgba(90,50,20,0.13)" }}>
            {dropResults.map(r => (
              <div key={r.id} onMouseDown={() => { goDetail(r.id); setSearch(""); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid rgba(180,140,100,0.16)", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.cr2} onMouseLeave={e => e.currentTarget.style.background = ""}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{r.emoji}</div>
                <div><div style={{ fontSize: 13, fontWeight: 600, color: COLORS.tx, marginBottom: 2 }}>{r.name}</div><div style={{ fontSize: 11, color: COLORS.tx3 }}>{r.place} · {r.price}</div></div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Chips */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none", marginBottom: 16 }}>
        {["Semua", "Terdekat", "Terpopuler", "Budget <20k", "Buka Sekarang"].map(c => (
          <div key={c} onClick={() => setChip(c)} style={{ flexShrink: 0, padding: "7px 15px", borderRadius: 50, fontSize: 13, fontWeight: 500, border: `1px solid ${chip === c ? COLORS.am : "rgba(180,140,100,0.28)"}`, background: chip === c ? COLORS.am : "#fff", color: chip === c ? "#fff" : COLORS.tx2, cursor: "pointer", whiteSpace: "nowrap" }}>{c}</div>
        ))}
      </div>
      {/* Nearby cards */}
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: COLORS.tx3, marginBottom: 12 }}>Terdekat dari Kamu</div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", marginBottom: 20 }}>
        {[["angkringan", "🍢", "Angkringan Lek Man", "0.4 km", "Malam", "4.9"], ["bakmi", "🍜", "Bakmi Mbah Gito", "0.8 km", "Malam", "4.6"], ["gudeg", "🍛", "Gudeg Bu Tjitro", "1.2 km", "Pagi", "4.8"], ["soto", "🥣", "Soto Kadipiro", "2.1 km", "Pagi", "4.7"]].map(([id, emoji, name, dist, tag, rat]) => (
          <div key={id} onClick={() => goDetail(id)} style={{ flexShrink: 0, width: 155, background: "#fff", borderRadius: 16, border: "1px solid rgba(180,140,100,0.16)", padding: 12, cursor: "pointer" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{emoji}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, fontWeight: 600, color: COLORS.tx, marginBottom: 3 }}>{name}</div>
            <div style={{ fontSize: 11, color: COLORS.tx3, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}><Icon name="map-pin" size={11} style={{ color: COLORS.tx3 }} /> {dist}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><Tag label={tag} type="" /><Rat val={rat} /></div>
          </div>
        ))}
      </div>
      {/* List */}
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: COLORS.tx3, marginBottom: 12 }}>
        {q ? `${filtered.length} hasil ditemukan` : "Semua Kuliner"}
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 10, color: COLORS.tx3 }}><Icon name="mood-empty" size={40} style={{ color: COLORS.tx3 }} /></div>
          <p style={{ fontSize: 14, color: COLORS.tx3 }}>Tidak ada hasil untuk pencarian ini</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(([id, bg, emoji, name, place, tags, price, rat]) => (
            <FoodCard key={id} thumbBg={bg} emoji={emoji} name={name} place={place} tags={tags} price={price} rating={rat} onClick={() => goDetail(id)} />
          ))}
        </div>
      )}
    </div>
  );
};

// Reco
const Reco = ({ goDetail, recoMsg, timePill }) => (
  <div style={{ background: COLORS.cr, padding: "14px 20px 110px", fontFamily: "'Plus Jakarta Sans',sans-serif", minHeight: "100%" }}>
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: COLORS.tx, marginBottom: 4 }}>Untuk<br /><em style={{ fontStyle: "italic", color: COLORS.am }}>Kamu Hari Ini</em></div>
      <div style={{ fontSize: 13, color: COLORS.tx3 }}>Berdasarkan preferensi & waktu sekarang</div>
    </div>
    <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", marginBottom: 18 }}>
      {[[timePill, "clock", true], ["Dekat UGM", "map-pin", false], ["Budget Rp 50k", "dollar", false], ["Pedas & Gurih", "flame", false]].map(([label, icon, hl]) => (
        <div key={label} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", background: hl ? COLORS.am2 : "#fff", border: `1px solid ${hl ? "rgba(212,105,30,.22)" : "rgba(180,140,100,0.28)"}`, borderRadius: 50, fontSize: 12, fontWeight: 500, color: hl ? COLORS.am3 : COLORS.tx2 }}>
          <Icon name={icon} size={14} style={{ color: COLORS.am }} /> {label}
        </div>
      ))}
    </div>
    <div style={{ background: "linear-gradient(135deg,#1A0E08 0%,#5C2A10 100%)", borderRadius: 20, padding: 18, marginBottom: 18, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(245,162,98,.08)" }} />
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: COLORS.am4, marginBottom: 6, display: "flex", alignItems: "center", gap: 6, position: "relative", zIndex: 1 }}><Icon name="sparkles" size={14} style={{ color: COLORS.am4 }} /> Rekomendasi Cerdas</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 600, color: "#fff", lineHeight: 1.35, position: "relative", zIndex: 1 }} dangerouslySetInnerHTML={{ __html: recoMsg }} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[["gudeg", "#FAE8D8", "🍛", "Gudeg Bu Tjitro", "Jl. Bugisan Selatan · 1.2 km", [["Pagi", ""], ["Sesuai Preferensi", "g"]], "Rp 25k", "4.8", "#1", COLORS.am], ["soto", "#F3EEFF", "🥣", "Soto Kadipiro", "Jl. Wates KM 1 · 2.1 km", [["Pagi", ""], ["Budget Oke", "b"]], "Rp 20k", "4.7", "#2", "#6B5744"], ["angkringan", "#FFF3E0", "🍢", "Angkringan Lek Man", "Jl. Mangkubumi · 0.4 km", [["Paling Dekat", "b"]], "Rp 5k", "4.9", "#3", "#9C8877"]].map(([id, bg, emoji, name, place, tags, price, rat, rank, rankBg]) => (
        <div key={id} onClick={() => goDetail(id)} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(180,140,100,0.16)", padding: 14, display: "flex", gap: 12, cursor: "pointer", position: "relative" }}>
          <div style={{ position: "absolute", top: -1, right: 14, color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: "0 0 8px 8px", background: rankBg }}>{rank}</div>
          <div style={{ width: 60, height: 60, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0, marginTop: 6 }}>{emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: COLORS.tx, marginBottom: 3 }}>{name}</div>
            <div style={{ fontSize: 12, color: COLORS.tx3, marginBottom: 6 }}>{place}</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{tags.map(([l, t], i) => <Tag key={i} label={l} type={t} />)}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0, marginTop: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.tx }}>{price}</span>
            <Rat val={rat} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Saved
const Saved = ({ goDetail }) => {
  const [tab, setTab] = useState("Semua");
  return (
    <div style={{ background: COLORS.cr, padding: "14px 20px 110px", fontFamily: "'Plus Jakarta Sans',sans-serif", minHeight: "100%" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: COLORS.tx, marginBottom: 3 }}>Tersimpan</div>
        <div style={{ fontSize: 13, color: COLORS.tx3 }}>2 tempat favoritmu</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["Semua", "Dikunjungi", "Wishlist"].map(t => (
          <div key={t} onClick={() => setTab(t)} style={{ padding: "7px 16px", borderRadius: 50, fontSize: 13, fontWeight: 500, border: `1px solid ${tab === t ? COLORS.am : "rgba(180,140,100,0.28)"}`, background: tab === t ? COLORS.am : "#fff", color: tab === t ? "#fff" : COLORS.tx2, cursor: "pointer" }}>{t}</div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <FoodCard thumbBg="#FAE8D8" emoji="🍛" name="Gudeg Bu Tjitro" place="Jl. Bugisan Selatan" tags={[["Ikonik", "g"]]} price="Rp 25k" rating="4.8" onClick={() => goDetail("gudeg")} />
        <FoodCard thumbBg="#F3EEFF" emoji="🥣" name="Soto Kadipiro" place="Jl. Wates KM 1" tags={[["Legendaris", "p"]]} price="Rp 20k" rating="4.7" onClick={() => goDetail("soto")} />
      </div>
    </div>
  );
};

// Detail
const Detail = ({ id, goBack, showToast, favs, toggleFav }) => {
  const d = FD[id];
  if (!d) return null;
  const isFav = favs.includes(id);
  const [selStars, setSelStars] = useState(1);
  const [revText, setRevText] = useState("");
  const [revs, setRevs] = useState([
    { init: "RA", initBg: "#FBEAF0", initCol: "#B5345C", name: "Ratu Faiha", date: "2 hari lalu", stars: 5, body: "Gudegnya manis banget! Sangat recommended buat sarapan pagi. Antriannya memang panjang tapi worth it banget." },
    { init: "YB", initBg: "#E5F0E5", initCol: "#2D6A2D", name: "Yohana Butar", date: "5 hari lalu", stars: 4, body: "Lokasinya strategis, porsi cukup dan rasanya autentik. Pelayannya ramah. Harga sesuai kualitas!" },
  ]);
  const submitRev = () => { if (!revText.trim()) { showToast("Tulis ulasan dulu ya!"); return; } setRevs([{ init: "AU", initBg: COLORS.am2, initCol: COLORS.am3, name: "Kamu", date: "Baru saja", stars: selStars, body: revText }, ...revs]); setRevText(""); showToast("Ulasan berhasil dikirim! ✓"); };
  return (
    <div style={{ background: COLORS.cr, paddingBottom: 110, fontFamily: "'Plus Jakarta Sans',sans-serif", minHeight: "100%" }}>
      <div style={{ height: 230, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 88, position: "relative", overflow: "hidden", background: d.bg }}>
        <button onClick={goBack} style={{ position: "absolute", top: 16, left: 16, width: 38, height: 38, background: "#fff", borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(90,50,20,0.08)", color: COLORS.tx, zIndex: 5 }}><Icon name="arrow-left" size={19} /></button>
        <button onClick={() => { toggleFav(id); showToast(isFav ? "Dihapus dari favorit" : "Disimpan ke favoritmu! 🔖"); }} style={{ position: "absolute", top: 16, right: 16, width: 38, height: 38, background: "#fff", borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(90,50,20,0.08)", zIndex: 5, color: isFav ? "#E53935" : COLORS.tx3 }}><Icon name={isFav ? "heart-filled" : "heart"} size={19} /></button>
        <span style={{ position: "relative", zIndex: 1, filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.15))" }}>{d.emoji}</span>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: COLORS.tx, marginBottom: 5 }}>{d.name}</div>
        <div style={{ fontSize: 13, color: COLORS.tx3, marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}><Icon name="map-pin" size={15} style={{ color: COLORS.am }} /> {d.addr}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>{d.tags.map(([l, t], i) => <Tag key={i} label={l} type={t} />)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
          {[["Rating", d.rating], ["Jarak", d.dist], ["Mulai dari", d.price]].map(([l, v]) => (
            <div key={l} style={{ background: COLORS.cr2, borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: COLORS.tx, marginBottom: 2 }}>{v}</div>
              <div style={{ fontSize: 11, color: COLORS.tx3 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[[`clock`, d.hours], ["tag", d.cat]].map(([icon, txt]) => (
            <div key={txt} style={{ flex: 1, background: "#fff", borderRadius: 10, border: "1px solid rgba(180,140,100,0.16)", padding: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: COLORS.tx2 }}>
              <Icon name={icon} size={16} style={{ color: COLORS.am, flexShrink: 0 }} /> {txt}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.75, color: COLORS.tx2, marginBottom: 18 }}>{d.desc}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["map-2", "Rute"], ["phone", "Hubungi"], ["share", "Bagikan"], ["bookmark", "Simpan"]].map(([icon, label]) => (
            <button key={label} onClick={() => showToast(`${label}... ✓`)} style={{ flex: 1, background: "#fff", border: "1px solid rgba(180,140,100,0.16)", borderRadius: 10, padding: 11, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 10, fontWeight: 700, color: COLORS.tx2, fontFamily: "inherit", letterSpacing: ".02em", textTransform: "uppercase" }}>
              <Icon name={icon} size={20} style={{ color: COLORS.am }} /> {label}
            </button>
          ))}
        </div>
        {/* Reviews */}
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: COLORS.tx3, marginBottom: 12 }}>Ulasan Pengunjung</div>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(180,140,100,0.16)", padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#FAC775,#E07A3C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>AU</div>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4, 5].map(s => <span key={s} onClick={() => setSelStars(s)} style={{ fontSize: 22, cursor: "pointer", color: s <= selStars ? "#EF9F27" : "#D8CEC4", lineHeight: 1 }}>★</span>)}
            </div>
          </div>
          <textarea value={revText} onChange={e => setRevText(e.target.value)} rows={3} placeholder="Ceritakan pengalamanmu..." style={{ width: "100%", border: "1px solid rgba(180,140,100,0.16)", borderRadius: 10, background: COLORS.cr, padding: 10, fontSize: 13, fontFamily: "inherit", color: COLORS.tx, resize: "none", outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
          <button onClick={submitRev} style={{ width: "100%", background: COLORS.am, color: "#fff", border: "none", borderRadius: 50, padding: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Kirim Ulasan</button>
        </div>
        {revs.map((r, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(180,140,100,0.16)", padding: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: r.initBg, color: r.initCol, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{r.init}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.tx }}>{r.name}</span>
              <span style={{ fontSize: 11, color: COLORS.tx3, marginLeft: "auto" }}>{r.date}</span>
            </div>
            <div style={{ fontSize: 12, color: "#EF9F27", marginBottom: 5 }}>{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
            <div style={{ fontSize: 13, color: COLORS.tx2, lineHeight: 1.65 }}>{r.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Profile
const Profile = ({ goEdit, goLogout, showToast, userInitials, userName }) => {
  const [budget, setBudget] = useState(50);
  const [prefs, setPrefs] = useState([true, false, true, false, true, false]);
  const prefItems = [["🌶️", "Pedas"], ["🍬", "Manis"], ["🧂", "Gurih"], ["🍋", "Asam"], ["🥘", "Berkuah"], ["🥗", "Vegetarian"]];
  return (
    <div style={{ background: COLORS.cr, paddingBottom: 110, fontFamily: "'Plus Jakarta Sans',sans-serif", minHeight: "100%" }}>
      <div style={{ height: 150, background: "linear-gradient(145deg,#1A0E08,#6B2C0A)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 30%,rgba(245,162,98,.12) 0%,transparent 60%)" }} />
      </div>
      <div style={{ background: "#fff", margin: "-44px 20px 0", borderRadius: 16, border: "1px solid rgba(180,140,100,0.16)", padding: 16, display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 16, position: "relative", zIndex: 2, boxShadow: "0 2px 12px rgba(90,50,20,0.08)" }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#FAC775,#E07A3C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff", border: "3px solid #fff", flexShrink: 0 }}>{userInitials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 21, fontWeight: 700, color: COLORS.tx, marginBottom: 3 }}>{userName}</div>
          <div style={{ fontSize: 12, color: COLORS.tx3, display: "flex", alignItems: "center", gap: 4 }}><Icon name="map-pin" size={12} style={{ color: COLORS.am }} /> Yogyakarta · Member 2024</div>
        </div>
        <button onClick={goEdit} style={{ background: COLORS.am2, color: COLORS.am3, border: "1px solid rgba(212,105,30,.2)", borderRadius: 50, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}><Icon name="pencil" size={12} /> Edit Profil</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, padding: "0 20px", marginBottom: 20 }}>
        {[["24", "Ulasan"], ["18", "Tersimpan"], ["312", "Check-in"]].map(([v, l]) => (
          <div key={l} style={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(180,140,100,0.16)", padding: "14px 10px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: COLORS.tx }}>{v}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.tx3, letterSpacing: ".05em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      {/* Preferences */}
      <div style={{ padding: "0 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: COLORS.tx3, marginBottom: 10 }}>Preferensi Rasa</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {prefItems.map(([emoji, label], i) => (
            <div key={i} onClick={() => setPrefs(p => p.map((v, j) => j === i ? !v : v))} style={{ background: prefs[i] ? COLORS.am2 : "#fff", borderRadius: 10, border: `1px solid ${prefs[i] ? "rgba(212,105,30,.3)" : "rgba(180,140,100,0.16)"}`, padding: "12px 8px", textAlign: "center", cursor: "pointer", transition: "all .15s" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{emoji}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: prefs[i] ? COLORS.am3 : COLORS.tx3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Budget */}
      <div style={{ padding: "0 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: COLORS.tx3, marginBottom: 10 }}>Budget Harian</div>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(180,140,100,0.16)", padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: COLORS.tx2, fontWeight: 500 }}>Maksimum per hari</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.tx }}>Rp {budget}.000</span>
          </div>
          <input type="range" min="10" max="200" step="5" value={budget} onChange={e => setBudget(e.target.value)} style={{ width: "100%", marginBottom: 7, accentColor: COLORS.am }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.tx3 }}><span>Rp 10k</span><span>Rp 200k</span></div>
        </div>
      </div>
      <div style={{ padding: "0 20px", marginBottom: 20 }}>
        <button onClick={() => showToast("Preferensi berhasil disimpan! ✓")} style={{ width: "100%", background: COLORS.am, color: "#fff", border: "none", borderRadius: 50, padding: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}><Icon name="save" size={16} /> Simpan Preferensi</button>
      </div>
      <div style={{ paddingBottom: 20 }}>
        {[["user-edit", "Edit Profil", () => goEdit()], ["bell", "Notifikasi", () => showToast("Pengaturan notifikasi 🔔")], ["map-pin", "Lokasi & Jarak", () => showToast("Pengaturan lokasi 📍")], ["shield", "Privasi & Keamanan", () => showToast("Pengaturan privasi 🔒")]].map(([icon, label, fn]) => (
          <div key={label} onClick={fn} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid rgba(180,140,100,0.16)", cursor: "pointer" }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: COLORS.am2, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.am, flexShrink: 0 }}><Icon name={icon} size={19} /></div>
            <span style={{ flex: 1, fontSize: 14, color: COLORS.tx, fontWeight: 500 }}>{label}</span>
            <Icon name="chevron-right" size={18} style={{ color: COLORS.tx3 }} />
          </div>
        ))}
        <div onClick={goLogout} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", cursor: "pointer" }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: "#FBEAF0", display: "flex", alignItems: "center", justifyContent: "center", color: "#B5345C", flexShrink: 0 }}><Icon name="logout" size={19} /></div>
          <span style={{ flex: 1, fontSize: 14, color: "#B5345C", fontWeight: 500 }}>Keluar</span>
          <Icon name="chevron-right" size={18} style={{ color: COLORS.tx3 }} />
        </div>
      </div>
    </div>
  );
};

// Edit Profile
const EditProfile = ({ goBack, showToast, userInitials, setUserName, setUserInitials }) => {
  const [name, setName] = useState("Aufaa Azzahra Aryawan");
  const [showPw, setShowPw] = useState(false);
  const save = () => { setUserName(name.split(" ")[0]); setUserInitials(name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()); showToast("Profil berhasil diperbarui! ✓"); goBack(); };
  const inp = { border: "1px solid rgba(180,140,100,0.28)", borderRadius: 10, background: COLORS.cr, padding: "12px 14px", fontSize: 14, fontFamily: "'Plus Jakarta Sans',sans-serif", color: COLORS.tx, outline: "none", width: "100%", boxSizing: "border-box" };
  return (
    <div style={{ background: COLORS.cr, paddingBottom: 110, fontFamily: "'Plus Jakarta Sans',sans-serif", minHeight: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px 20px", background: "#fff", borderBottom: "1px solid rgba(180,140,100,0.16)", marginBottom: 20 }}>
        <button onClick={goBack} style={{ width: 34, height: 34, background: "#fff", borderRadius: "50%", border: "1px solid rgba(180,140,100,0.28)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.tx }}><Icon name="arrow-left" size={17} /></button>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: COLORS.tx, flex: 1, textAlign: "center" }}>Edit Profil</div>
        <button onClick={save} style={{ fontSize: 14, fontWeight: 600, color: COLORS.am, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Simpan</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg,#FAC775,#E07A3C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: "#fff", border: "3px solid #fff", boxShadow: "0 4px 16px rgba(212,105,30,.3)", marginBottom: 10, position: "relative", cursor: "pointer" }}>
          {userInitials}
          <div style={{ position: "absolute", bottom: 2, right: 2, width: 26, height: 26, background: COLORS.am, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}><Icon name="camera" size={13} style={{ color: "#fff" }} /></div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.am, cursor: "pointer" }}>Ubah Foto Profil</div>
      </div>
      <div style={{ padding: "0 20px" }}>
        {[["Nama Lengkap", "text", name, e => setName(e.target.value)], ["Username", "text", "@aufaa.azzahra", null], ["Email", "email", "aufaa@email.com", null], ["Nomor HP", "tel", "0812-xxxx-xxxx", null]].map(([label, type, val, onChange]) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.tx2, display: "block", marginBottom: 6 }}>{label}</label>
            <input style={inp} type={type} defaultValue={val} onChange={onChange || undefined} />
          </div>
        ))}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.tx2, display: "block", marginBottom: 6 }}>Kota</label>
          <select style={{ ...inp, appearance: "none", cursor: "pointer" }}>
            <option>Yogyakarta</option><option>Sleman</option><option>Bantul</option><option>Gunungkidul</option>
          </select>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.tx2, display: "block", marginBottom: 6 }}>Bio</label>
          <textarea style={{ ...inp, resize: "none" }} rows={3} defaultValue="Food lover dari Yogyakarta 🍛 Suka explore kuliner lokal" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.tx2, display: "block", marginBottom: 6 }}>Password Baru</label>
          <div style={{ position: "relative" }}>
            <input style={{ ...inp, paddingRight: 44 }} type={showPw ? "text" : "password"} placeholder="Kosongkan jika tidak ingin ubah" />
            <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: COLORS.tx3 }}><Icon name={showPw ? "eye-off" : "eye"} size={18} /></button>
          </div>
        </div>
        <button onClick={save} style={{ width: "100%", background: COLORS.am, color: "#fff", border: "none", borderRadius: 50, padding: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", marginTop: 8, marginBottom: 120 }}><Icon name="check" size={16} /> Simpan Perubahan</button>
      </div>
    </div>
  );
};

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
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
  const hr = now.getHours();
  const greeting = hr < 11 ? "Selamat pagi," : hr < 15 ? "Selamat siang," : hr < 18 ? "Selamat sore," : hr < 22 ? "Selamat malam," : "Masih lapar?";
  const timeLbl = hr < 11 ? "Sarapan" : hr < 15 ? "Makan Siang" : hr < 18 ? "Camilan Sore" : hr < 22 ? "Makan Malam" : "Larut Malam";
  const timePill = hr < 11 ? "Pagi ini" : hr < 15 ? "Siang ini" : hr < 18 ? "Sore ini" : hr < 22 ? "Malam ini" : "Larut malam";
  const recoMsg = hr < 11 ? "Pagi ini cocok buat sarapan berat. <em>Gudeg atau Soto</em> jadi pilihan terbaik untuk energi harianmu."
    : hr < 15 ? "Siang hari, saatnya makan besar. <em>Soto atau Bakmi</em> pilihan sempurna untuk tenaga siang hari."
      : hr < 18 ? "Sore hari yang santai. <em>Wedang Uwuh</em> atau camilan angkringan cocok menemani sore kamu."
        : hr < 22 ? "Malam ini, <em>Angkringan Lek Man</em> jadi pilihan top — murah, meriah, dan paling dekat dari lokasimu."
          : "Larut malam, <em>Angkringan</em> tetap setia menemanimu. Buka sampai dini hari!";

  // Splash timer
  useEffect(() => { const t = setTimeout(() => setPhase("ob"), 2200); return () => clearTimeout(t); }, []);

  const showToast = msg => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ msg, visible: true });
    toastTimeout.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  };

  const goDetail = id => { setPrevScreen(screen); setDetailId(id); setScreen("detail"); };
  const goBack = () => setScreen(prevScreen);
  const goExplore = (kw = "") => { setFilterKw(kw || ""); setScreen("explore"); };
  const goReco = () => setScreen("reco");
  const goProfile = () => setScreen("profile");
  const goEdit = () => { setPrevScreen(screen); setScreen("editprofile"); };
  const goLogout = () => { setPhase("login"); setScreen("home"); };
  const toggleFav = id => setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  const clockStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const NAV = ["home", "explore", "reco", "saved", "profile"];
  const navIcons = ["home", "compass", "sparkles", "bookmark", "user-circle"];
  const navLabels = ["Beranda", "Jelajahi", "Untukmu", "Tersimpan", "Profil"];

  if (phase === "splash") return (
    <div style={{ width: "100%", height: "100vh", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Splash />
    </div>
  );

  if (phase === "ob") return (
    <div style={{ width: "100%", height: "100vh", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Onboarding onDone={() => setPhase("login")} />
    </div>
  );

  if (phase === "login") return (
    <div style={{ width: "100%", height: "100vh", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Login onLogin={() => setPhase("app")} />
    </div>
  );

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: "#D9CFC3", fontFamily: "'Plus Jakarta Sans',sans-serif", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Status bar */}
      <div style={{ height: 50, padding: "16px 26px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: COLORS.cr, zIndex: 20 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.tx, letterSpacing: "-.3px" }}>{clockStr}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: COLORS.tx }}>
          <Icon name="wifi" size={16} /><span style={{ fontSize: 11, fontWeight: 700 }}>4G</span><Icon name="battery" size={16} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none" }}>
        {screen === "home" && <Home goDetail={goDetail} goExplore={goExplore} goReco={goReco} goProfile={goProfile} userInitials={userInitials} greeting={greeting} timeLbl={`${timeLbl} · Rekomendasi untukmu`} />}
        {screen === "explore" && <Explore goDetail={goDetail} filterKw={filterKw} key={filterKw} />}
        {screen === "reco" && <Reco goDetail={goDetail} recoMsg={recoMsg} timePill={timePill} />}
        {screen === "saved" && <Saved goDetail={goDetail} />}
        {screen === "detail" && <Detail id={detailId} goBack={goBack} showToast={showToast} favs={favs} toggleFav={toggleFav} />}
        {screen === "profile" && <Profile goEdit={goEdit} goLogout={goLogout} showToast={showToast} userInitials={userInitials} userName={userName} />}
        {screen === "editprofile" && <EditProfile goBack={goBack} showToast={showToast} userInitials={userInitials} setUserName={setUserName} setUserInitials={setUserInitials} />}
      </div>

      {/* Bottom nav */}
      {!["detail", "editprofile"].includes(screen) && (
        <nav style={{ height: 76, background: "#fff", borderTop: "1px solid rgba(180,140,100,0.16)", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 6px 10px", flexShrink: 0, zIndex: 50 }}>
          {NAV.map((s, i) => {
            const active = screen === s;
            return (
              <button key={s} onClick={() => setScreen(s)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 4px", cursor: "pointer", borderRadius: 12, border: "none", background: "none", position: "relative" }}>
                {(s === "reco" || s === "saved") && <div style={{ position: "absolute", top: 7, right: "calc(50% - 15px)", width: 5, height: 5, background: COLORS.am, borderRadius: "50%" }} />}
                <span style={{ color: active ? COLORS.am : COLORS.tx3 }}><Icon name={navIcons[i]} size={23} /></span>
                <span style={{ fontSize: 10, fontWeight: 600, color: active ? COLORS.am : COLORS.tx3 }}>{navLabels[i]}</span>
              </button>
            );
          })}
        </nav>
      )}

      <Toast msg={toast.msg} visible={toast.visible} />
    </div>
  );
}
