import { COLORS } from "@/data/foodData";
import Tag from "./Tag";
import Rat from "./RatingPill";

// ── Food card (list item) ──
const FoodCard = ({
  id,
  thumbBg,
  emoji,
  name,
  place,
  tags,
  price,
  rating,
  onClick,
}) => (
  <div
    onClick={onClick}
    style={{
      background: "#fff",
      borderRadius: 16,
      border: "1px solid rgba(180,140,100,0.16)",
      padding: 13,
      display: "flex",
      gap: 12,
      cursor: "pointer",
      transition: "box-shadow .15s,transform .15s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "0 2px 12px rgba(90,50,20,0.08)";
      e.currentTarget.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "";
      e.currentTarget.style.transform = "";
    }}
  >
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: 12,
        background: thumbBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32,
        flexShrink: 0,
      }}
    >
      {emoji}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: 16,
          fontWeight: 600,
          color: COLORS.tx,
          marginBottom: 3,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {name}
      </div>
      <div style={{ fontSize: 12, color: COLORS.tx3, marginBottom: 6 }}>
        {place}
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {tags.map(([l, t], i) => (
          <Tag key={i} label={l} type={t} />
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
      <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.tx }}>
        {price}
      </span>
      <Rat val={rating} />
    </div>
  </div>
);

export default FoodCard;
