// ── Tag component ──
const Tag = ({ label, type }) => {
  const styles = {
    "": { bg: "#FBEDDF", color: "#A84C0F" },
    g: { bg: "#E5F0E5", color: "#2D6A2D" },
    b: { bg: "#EEF2FF", color: "#4356AF" },
    p: { bg: "#F3EEFF", color: "#6A3FB5" },
  };
  const s = styles[type] || styles[""];
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 20,
        background: s.bg,
        color: s.color,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};

export default Tag;
