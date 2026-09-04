import { ImageResponse } from "next/og"
import { SITE_TAGLINE } from "@/lib/site-config"

export const alt = "Ask AI Legal — We install. You work from home."

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
            color: "#FBB034",
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
          {`We do the install · custom quote · work from home`}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 18,
            color: "#9ca3af",
            marginTop: 32,
          }}
        >
          Not a law firm · Tools you use from home
        </div>
      </div>
    ),
    { ...size }
  )
}
