"use client";

import { useState } from "react";
import { COLORS } from "@/data/foodData";
import Icon from "@/components/ui/Icon";

// Edit Profile
const EditProfile = ({
  goBack,
  showToast,
  userInitials,
  setUserName,
  setUserInitials,
}) => {
  const [name, setName] = useState("Aufaa Azzahra Aryawan");
  const [showPw, setShowPw] = useState(false);
  const save = () => {
    setUserName(name.split(" ")[0]);
    setUserInitials(
      name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    );
    showToast("Profil berhasil diperbarui! ✓");
    goBack();
  };
  const inp = {
    border: "1px solid rgba(180,140,100,0.28)",
    borderRadius: 10,
    background: COLORS.cr,
    padding: "12px 14px",
    fontSize: 14,
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    color: COLORS.tx,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
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
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 20px 20px",
          background: "#fff",
          borderBottom: "1px solid rgba(180,140,100,0.16)",
          marginBottom: 20,
        }}
      >
        <button
          onClick={goBack}
          style={{
            width: 34,
            height: 34,
            background: "#fff",
            borderRadius: "50%",
            border: "1px solid rgba(180,140,100,0.28)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.tx,
          }}
        >
          <Icon name="arrow-left" size={17} />
        </button>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.tx,
            flex: 1,
            textAlign: "center",
          }}
        >
          Edit Profil
        </div>
        <button
          onClick={save}
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: COLORS.am,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Simpan
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#FAC775,#E07A3C)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 700,
            color: "#fff",
            border: "3px solid #fff",
            boxShadow: "0 4px 16px rgba(212,105,30,.3)",
            marginBottom: 10,
            position: "relative",
            cursor: "pointer",
          }}
        >
          {userInitials}
          <div
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 26,
              height: 26,
              background: COLORS.am,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #fff",
            }}
          >
            <Icon name="camera" size={13} style={{ color: "#fff" }} />
          </div>
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: COLORS.am,
            cursor: "pointer",
          }}
        >
          Ubah Foto Profil
        </div>
      </div>
      <div style={{ padding: "0 20px" }}>
        {[
          ["Nama Lengkap", "text", name, (e) => setName(e.target.value)],
          ["Username", "text", "@aufaa.azzahra", null],
          ["Email", "email", "aufaa@email.com", null],
          ["Nomor HP", "tel", "0812-xxxx-xxxx", null],
        ].map(([label, type, val, onChange]) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: COLORS.tx2,
                display: "block",
                marginBottom: 6,
              }}
            >
              {label}
            </label>
            <input
              style={inp}
              type={type}
              defaultValue={val}
              onChange={onChange || undefined}
            />
          </div>
        ))}
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.tx2,
              display: "block",
              marginBottom: 6,
            }}
          >
            Kota
          </label>
          <select style={{ ...inp, appearance: "none", cursor: "pointer" }}>
            <option>Yogyakarta</option>
            <option>Sleman</option>
            <option>Bantul</option>
            <option>Gunungkidul</option>
          </select>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.tx2,
              display: "block",
              marginBottom: 6,
            }}
          >
            Bio
          </label>
          <textarea
            style={{ ...inp, resize: "none" }}
            rows={3}
            defaultValue="Food lover dari Yogyakarta 🍛 Suka explore kuliner lokal"
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.tx2,
              display: "block",
              marginBottom: 6,
            }}
          >
            Password Baru
          </label>
          <div style={{ position: "relative" }}>
            <input
              style={{ ...inp, paddingRight: 44 }}
              type={showPw ? "text" : "password"}
              placeholder="Kosongkan jika tidak ingin ubah"
            />
            <button
              onClick={() => setShowPw(!showPw)}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: COLORS.tx3,
              }}
            >
              <Icon name={showPw ? "eye-off" : "eye"} size={18} />
            </button>
          </div>
        </div>
        <button
          onClick={save}
          style={{
            width: "100%",
            background: COLORS.am,
            color: "#fff",
            border: "none",
            borderRadius: 50,
            padding: 14,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: "inherit",
            marginTop: 8,
            marginBottom: 120,
          }}
        >
          <Icon name="check" size={16} /> Simpan Perubahan
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
