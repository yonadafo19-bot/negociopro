export const metadata = {
  title: 'NegociPro — ERP Minimarket LATAM',
  description: 'Sistema de gestión para minimarkets — Ventas, Stock, Fiados, Contactos',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, background: '#1C2130' }}>
        {children}
      </body>
    </html>
  )
}
