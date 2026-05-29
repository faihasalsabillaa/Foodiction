# Foodiction Next.js Scalable Frontend

Refactor dari prototype satu file menjadi struktur Next.js App Router yang lebih scalable tanpa mengubah desain visual utama.

## Run

```bash
npm install
npm run dev
```

## Struktur utama

- `src/app/page.jsx` — state navigation utama prototype
- `src/components/screens/` — tiap screen dipisah: Home, Explore, Reco, Saved, Detail, Profile, EditProfile, Login, Onboarding, Splash
- `src/components/ui/` — reusable UI: Icon, FoodCard, Tag, RatingPill, Toast
- `src/data/foodData.js` — dummy data kuliner, warna, dan search index
