import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Punta Cana Excursions - Sanity Studio",
  description: "Punta Cana Excursions - Sanity Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
