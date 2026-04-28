"use client";

// Global error boundary — wraps the root html/body so it can render even if
// layout.tsx itself fails. Required by Next.js 14 App Router as the highest-
// level fallback. Pure presentational; no hooks/context outside React's
// built-in error boundary contract.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>Something went wrong</h1>
          <p style={{ marginTop: "0.5rem", color: "#666" }}>Please refresh or head back to the dashboard.</p>
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem" }}>
            <button onClick={reset} style={{ padding: "0.5rem 1rem", background: "#7c3aed", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}>
              Try again
            </button>
            <a href="/dashboard" style={{ padding: "0.5rem 1rem", border: "1px solid #ddd", borderRadius: "0.5rem", color: "#333", textDecoration: "none" }}>
              Dashboard
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
