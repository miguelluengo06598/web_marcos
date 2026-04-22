import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Gestion Patrimonial",
  description: "Portal de gestion patrimonial independiente",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}