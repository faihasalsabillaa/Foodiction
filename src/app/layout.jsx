import "./globals.css";

export const metadata = {
  title: "Foodiction",
  description: "Kuliner Yogyakarta untuk Kamu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
