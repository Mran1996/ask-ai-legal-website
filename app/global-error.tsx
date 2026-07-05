"use client"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#faf8f5", color: "#374151", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 600, color: "#0c1929" }}>Something went wrong</h1>
          <p style={{ marginTop: "1rem", maxWidth: "28rem" }}>
            The site hit a loading error. Please reload the page — if you were developing locally, run{" "}
            <code style={{ background: "#f0ebe3", padding: "0.125rem 0.375rem" }}>npm run dev:clean</code>.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "2rem",
              backgroundColor: "#c9a227",
              color: "#0c1929",
              border: "none",
              padding: "1rem 2rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
