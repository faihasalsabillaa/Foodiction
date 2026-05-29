import { COLORS } from "@/data/foodData";

// Splash
const Splash = () => (
  <div
    style={{
      background: "linear-gradient(160deg,#1A0E08 0%,#4A1E08 50%,#7A3010 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100%",
      gap: 0,
    }}
  >
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 28,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      />
      <div
        style={{
          width: 130,
          height: 130,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#E07A3C,#FAC775)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 62,
          boxShadow: "0 0 80px rgba(224,122,60,.55)",
          animation: "porb 3s ease-in-out infinite",
        }}
      >
        🍛
      </div>
    </div>
    <div
      style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: 42,
        fontWeight: 700,
        color: "#fff",
        marginBottom: 6,
        letterSpacing: "-.5px",
      }}
    >
      Food<span style={{ color: COLORS.am4, fontStyle: "italic" }}>iction</span>
    </div>
    <div
      style={{ fontSize: 14, color: "rgba(255,255,255,.5)", marginBottom: 40 }}
    >
      Kuliner Yogyakarta untuk Kamu
    </div>
    <div
      style={{
        width: 140,
        height: 3,
        background: "rgba(255,255,255,.1)",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          background: COLORS.am4,
          borderRadius: 2,
          animation: "sload 2s ease forwards",
        }}
      />
    </div>
    <style>{`@keyframes porb{0%,100%{transform:scale(1);box-shadow:0 0 80px rgba(224,122,60,.55)}50%{transform:scale(1.05);box-shadow:0 0 110px rgba(224,122,60,.75)}}@keyframes sload{0%{width:0}100%{width:100%}}`}</style>
  </div>
);

export default Splash;
