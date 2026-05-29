export const COLORS = {
  cr: "#F9F5EF",
  cr2: "#F0E9DF",
  wh: "#FFFFFF",
  am: "#D4691E",
  am2: "#FBEDDF",
  am3: "#A84C0F",
  am4: "#F5A262",
  gn: "#2D6A2D",
  gn2: "#E5F0E5",
  tx: "#1E1410",
  tx2: "#6B5744",
  tx3: "#9C8877",
};

export const FD = {
  gudeg: {
    emoji: "🍛",
    bg: "linear-gradient(135deg,#FAE8D8,#F5C9A0)",
    name: "Gudeg Bu Tjitro",
    addr: "Jl. Bugisan Selatan · Buka 06.00–14.00",
    hours: "06.00 – 14.00",
    cat: "Gudeg · Tradisional",
    rating: "4.8",
    dist: "1.2 km",
    price: "Rp 25k",
    tags: [
      ["Pagi", ""],
      ["Ikonik", "g"],
      ["Legendaris", "p"],
    ],
    desc: "Salah satu warung gudeg legendaris di Yogyakarta sejak 1925. Gudeg manis khas keraton dengan nangka muda yang dimasak semalaman menggunakan kayu bakar. Menjadi destinasi wajib wisata kuliner Yogya.",
  },
  angkringan: {
    emoji: "🍢",
    bg: "linear-gradient(135deg,#FFF3E0,#FFDAB0)",
    name: "Angkringan Lek Man",
    addr: "Jl. Mangkubumi, dekat Tugu · Buka 17.00–01.00",
    hours: "17.00 – 01.00",
    cat: "Angkringan · Street Food",
    rating: "4.9",
    dist: "0.4 km",
    price: "Rp 3k",
    tags: [
      ["Malam", ""],
      ["Murah", "b"],
      ["Ikonik", "g"],
    ],
    desc: "Angkringan paling ikonik dekat Tugu Yogyakarta. Tempatnya nyaman di pinggir jalan, cocok buat nongkrong sambil menikmati kopi jos dan nasi kucing khas Yogya.",
  },
  bakmi: {
    emoji: "🍜",
    bg: "linear-gradient(135deg,#E8F5EE,#B8E0CB)",
    name: "Bakmi Jawa Mbah Gito",
    addr: "Jl. Kaliurang KM 5 · Buka 17.00–23.00",
    hours: "17.00 – 23.00",
    cat: "Bakmi Jawa · Mi",
    rating: "4.6",
    dist: "0.8 km",
    price: "Rp 18k",
    tags: [
      ["Malam", ""],
      ["Ramah Budget", "b"],
    ],
    desc: "Bakmi Jawa tradisional dengan bumbu rempah yang kaya. Dimasak menggunakan arang untuk cita rasa smoky yang khas. Sudah berdiri lebih dari 40 tahun.",
  },
  soto: {
    emoji: "🥣",
    bg: "linear-gradient(135deg,#F3EEFF,#D4C8F5)",
    name: "Soto Kadipiro",
    addr: "Jl. Wates KM 1 · Buka 07.00–16.00",
    hours: "07.00 – 16.00",
    cat: "Soto · Sup Tradisional",
    rating: "4.7",
    dist: "2.1 km",
    price: "Rp 20k",
    tags: [
      ["Pagi", ""],
      ["Legendaris", "p"],
    ],
    desc: "Soto ayam bening legendaris sejak 1921. Kuahnya segar dan gurih, dengan suwiran ayam kampung yang empuk. Wajib coba sate ususnya yang menjadi signature dish.",
  },
  wedang: {
    emoji: "☕",
    bg: "linear-gradient(135deg,#FBEAF0,#F5C0D5)",
    name: "Wedang Uwuh Keraton",
    addr: "Alun-Alun Kidul · Buka 08.00–22.00",
    hours: "08.00 – 22.00",
    cat: "Minuman · Herbal",
    rating: "4.5",
    dist: "3.0 km",
    price: "Rp 8k",
    tags: [
      ["Minuman", ""],
      ["Herbal", "g"],
    ],
    desc: "Minuman rempah tradisional Yogyakarta yang menghangatkan tubuh. Terbuat dari campuran jahe, cengkeh, kayu manis, dan berbagai rempah pilihan.",
  },
};

export const SEARCH_INDEX = Object.entries(FD).map(([id, d]) => ({
  id,
  name: d.name,
  emoji: d.emoji,
  bg: d.bg,
  place: d.addr.split("·")[0].trim(),
  price: d.price,
  keywords:
    d.cat.toLowerCase() +
    " " +
    d.tags
      .map((t) => t[0])
      .join(" ")
      .toLowerCase(),
}));
