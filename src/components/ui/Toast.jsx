import { COLORS } from "@/data/foodData";
import Icon from "./Icon";

// ── Toast ──
const Toast = ({ msg, visible }) => (
  <div
    style={{
      position: "fixed",
      bottom: 24,
      left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
      opacity: visible ? 1 : 0,
      transition: "all .22s ease",
      background: "#1E1410",
      color: "#fff",
      borderRadius: 14,
      padding: "13px 20px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 13,
      fontWeight: 500,
      zIndex: 1000,
      boxShadow: "0 8px 28px rgba(90,50,20,0.18)",
      pointerEvents: "none",
      whiteSpace: "nowrap",
    }}
  >
    <Icon name="circle-check" size={18} style={{ color: COLORS.am4 }} /> {msg}
  </div>
);

export default Toast;
