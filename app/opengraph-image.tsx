import { ImageResponse } from "next/og"
import { CASE_FILE_REVIEW_PRICE_DISPLAY, SITE_TAGLINE } from "@/lib/site-config"

export const alt = "Ask AI Legal — We stand with you"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0c1929",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 600,
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          Ask AI Legal
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#C5A059",
            marginTop: 20,
            fontStyle: "italic",
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#d1d5db",
            marginTop: 48,
            textAlign: "center",
            lineHeight: 1.45,
            maxWidth: 920,
          }}
        >
          {`We stand with you · ${CASE_FILE_REVIEW_PRICE_DISPLAY} case review assessment · hands-on support`}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 18,
            color: "#9ca3af",
            marginTop: 32,
          }}
        >
          Not a law firm · Document preparation only
        </div>
      </div>
    ),
    { ...size }
  )
}
