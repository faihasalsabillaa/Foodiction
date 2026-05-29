import Icon from "./Icon";

// ── Rating pill ──
const Rat = ({ val }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      fontSize: 11,
      fontWeight: 600,
      background: "#FFF4E4",
      color: "#B06000",
      padding: "3px 8px",
      borderRadius: 20,
    }}
  >
    <Icon name="star-filled" size={9} style={{ color: "#EF9F27" }} /> {val}
  </span>
);

export default Rat;
