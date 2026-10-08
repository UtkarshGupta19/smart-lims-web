export const metadata = {
  title: 'Smart-LIMS | CCSE0303A Prototype',
  description: 'Group 101 OS Project Prototype',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        />
      </head>
      <body style={{ backgroundColor: '#f8fafc', padding: '30px 15px' }}>
        {children}
      </body>
    </html>
  );
}