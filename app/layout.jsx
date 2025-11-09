import "./globals.css";

export const metadata = {
  title: "StepWise — Shoes",
  description: "Student shoe store MVP"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans" }}>
        {children}
      </body>
    </html>
  );
}
