import './globals.css';

export const metadata = {
  title: "Deuda Check",
  description: "Consulta de deudores BCRA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  );
}