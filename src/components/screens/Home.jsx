import { COLORS } from "@/data/foodData";
import Icon from "@/components/ui/Icon";
import FoodCard from "@/components/ui/FoodCard";

// Home
const Home = ({
  goDetail,
  goExplore,
  goReco,
  goProfile,
  userInitials,
  greeting,
  timeLbl,
}) => (
  <div
    style={{
      background: COLORS.cr,
      paddingBottom: 24,
      fontFamily: "'Plus Jakarta Sans',sans-serif",
      minHeight: "100%",
    }}
  >
    <div style={{ padding: "14px 20px 0", marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: COLORS.tx3, marginBottom: 2 }}>
            {greeting}
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 27,
              fontWeight: 700,
              color: COLORS.tx,
              lineHeight: 1.15,
            }}
          >
            Mau makan
            <br />
            apa hari ini?{" "}
            <em style={{ fontStyle: "italic", color: COLORS.am }}>✨</em>
          </div>
        </div>
        <div
          onClick={goProfile}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#FAC775,#E07A3C)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            border: "2px solid #fff",
            boxShadow: "0 0 0 1px rgba(180,140,100,0.28)",
          }}
        >
          {userInitials}
        </div>
      </div>
      <div
        onClick={goExplore}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#fff",
          border: "1px solid rgba(180,140,100,0.28)",
          borderRadius: 50,
          padding: "11px 16px",
          cursor: "pointer",
        }}
      >
        <Icon name="search" size={18} style={{ color: COLORS.tx3 }} />
        <span style={{ flex: 1, fontSize: 14, color: COLORS.tx3 }}>
          Cari makanan atau warung...
        </span>
        <Icon name="adjustments" size={18} style={{ color: COLORS.am }} />
      </div>
    </div>
    <div style={{ padding: "0 20px", marginBottom: 14 }}>
      <div
        onClick={goReco}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: COLORS.am2,
          border: "1px solid rgba(212,105,30,.2)",
          borderRadius: 50,
          padding: "5px 12px",
          fontSize: 12,
          fontWeight: 500,
          color: COLORS.am3,
          cursor: "pointer",
        }}
      >
        <Icon name="clock" size={13} style={{ color: COLORS.am3 }} /> {timeLbl}{" "}
        <Icon name="chevron-right" size={13} />
      </div>
    </div>
    {/* Hero */}
    <div
      onClick={() => goDetail("gudeg")}
      style={{
        background:
          "linear-gradient(135deg,#1A0E08 0%,#5C2A10 55%,#8A3D18 100%)",
        borderRadius: 22,
        padding: "20px 20px 18px",
        margin: "0 20px 18px",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 80% 20%,rgba(245,162,98,.12) 0%,transparent 60%)",
        }}
      />
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: COLORS.am4,
          marginBottom: 5,
          position: "relative",
          zIndex: 1,
        }}
      >
        ✦ Kuliner Legendaris
      </div>
      <div
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: 26,
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.2,
          marginBottom: 14,
          position: "relative",
          zIndex: 1,
        }}
      >
        Gudeg Bu Tjitro
        <br />
        <em style={{ fontStyle: "italic", color: COLORS.am4 }}>sejak 1925</em>
      </div>
      <button
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: COLORS.am,
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
          padding: "9px 16px",
          borderRadius: 50,
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          position: "relative",
          zIndex: 1,
        }}
      >
        Lihat Detail <Icon name="arrow-right" size={14} />
      </button>
      <div
        style={{
          position: "absolute",
          right: 16,
          bottom: 10,
          fontSize: 60,
          opacity: 0.85,
          lineHeight: 1,
        }}
      >
        🍛
      </div>
    </div>
    {/* Categories */}
    <div style={{ padding: "0 20px", marginBottom: 20 }}>
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
        Jelajahi Kategori
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
        }}
      >
        {[
          ["🌅", "Sarapan"],
          ["☀️", "Siang"],
          ["🌙", "Malam"],
          ["🍢", "Angkringan"],
          ["🍛", "Gudeg"],
          ["🍜", "Bakmi Jawa"],
          ["☕", "Wedang"],
          ["🏷️", "Budget"],
        ].map(([e, n]) => (
          <div
            key={n}
            onClick={() => goExplore(n)}
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid rgba(180,140,100,0.16)",
              padding: "12px 8px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all .15s",
            }}
            onMouseEnter={(ev) => {
              ev.currentTarget.style.background = COLORS.am2;
            }}
            onMouseLeave={(ev) => {
              ev.currentTarget.style.background = "#fff";
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 5 }}>{e}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.tx2 }}>
              {n}
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Editor picks */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        marginBottom: 12,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: COLORS.tx3,
        }}
      >
        Pilihan Editor
      </span>
      <button
        onClick={goExplore}
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: COLORS.am,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Lihat semua
      </button>
    </div>
    <div
      style={{
        display: "flex",
        gap: 12,
        overflowX: "auto",
        padding: "0 20px 4px",
        scrollbarWidth: "none",
        marginBottom: 18,
      }}
    >
      {[
        [
          "angkringan",
          "#FFF3E0",
          "🍢",
          "Angkringan Lek Man",
          "🔥 Hits",
          "4.9",
          "0.4 km",
        ],
        [
          "bakmi",
          "#E8F5EE",
          "🍜",
          "Bakmi Mbah Gito",
          "🌙 Malam",
          "4.6",
          "0.8 km",
        ],
        [
          "soto",
          "#F3EEFF",
          "🥣",
          "Soto Kadipiro",
          "🏆 Legendaris",
          "4.7",
          "2.1 km",
        ],
        [
          "wedang",
          "#FBEAF0",
          "☕",
          "Wedang Uwuh Keraton",
          "🌿 Herbal",
          "4.5",
          "3.0 km",
        ],
      ].map(([id, bg, emoji, name, badge, rat, dist]) => (
        <div
          key={id}
          onClick={() => goDetail(id)}
          style={{
            flexShrink: 0,
            width: 152,
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(180,140,100,0.16)",
            overflow: "hidden",
            cursor: "pointer",
            transition: "box-shadow .15s,transform .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 2px 12px rgba(90,50,20,0.08)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.transform = "";
          }}
        >
          <div
            style={{
              height: 100,
              background: bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              position: "relative",
            }}
          >
            {emoji}
            <span
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 20,
                background: "rgba(255,255,255,.92)",
                color: COLORS.tx,
              }}
            >
              {badge}
            </span>
          </div>
          <div style={{ padding: "10px 12px 12px" }}>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 15,
                fontWeight: 600,
                color: COLORS.tx,
                marginBottom: 4,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: COLORS.tx3,
              }}
            >
              <span style={{ color: "#EF9F27" }}>★</span> {rat} · {dist}
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* Trending */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        marginBottom: 12,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: COLORS.tx3,
        }}
      >
        Trending Sekarang
      </span>
      <button
        onClick={goExplore}
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: COLORS.am,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Lihat semua
      </button>
    </div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "0 20px",
      }}
    >
      {[
        [
          "gudeg",
          "#FAE8D8",
          "🍛",
          "Gudeg Bu Tjitro",
          "Jl. Bugisan Selatan",
          [
            ["Pagi", ""],
            ["Ikonik", "g"],
          ],
          "Rp 25k",
          "4.8",
        ],
        [
          "angkringan",
          "#FFF3E0",
          "🍢",
          "Angkringan Lek Man",
          "Jl. Mangkubumi, dekat Tugu",
          [
            ["Malam", ""],
            ["Murah", "b"],
          ],
          "Rp 5k",
          "4.9",
        ],
        [
          "bakmi",
          "#E8F5EE",
          "🍜",
          "Bakmi Jawa Mbah Gito",
          "Jl. Kaliurang KM 5",
          [
            ["Malam", ""],
            ["Budget", "b"],
          ],
          "Rp 18k",
          "4.6",
        ],
      ].map(([id, bg, emoji, name, place, tags, price, rat]) => (
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
  </div>
);

export default Home;
