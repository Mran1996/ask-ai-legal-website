const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

type Fbq = {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  push: Fbq
  loaded: boolean
  version: string
}

let initialized = false

function canTrack(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function"
}

/** Load Meta Pixel once and fire initial PageView. No-op without env ID or duplicate calls. */
export function initMetaPixel(): void {
  if (typeof window === "undefined" || !PIXEL_ID || initialized) return

  if (window.fbq) {
    window.fbq("init", PIXEL_ID)
    window.fbq("track", "PageView")
    initialized = true
    return
  }

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args)
    } else {
      fbq.queue.push(args)
    }
  } as Fbq

  fbq.queue = []
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = "2.0"

  window.fbq = fbq
  if (!window._fbq) window._fbq = fbq

  const script = document.createElement("script")
  script.async = true
  script.src = "https://connect.facebook.net/en_US/fbevents.js"
  const first = document.getElementsByTagName("script")[0]
  first?.parentNode?.insertBefore(script, first)

  window.fbq("init", PIXEL_ID)
  window.fbq("track", "PageView")
  initialized = true
}

export function pixelPageView(): void {
  if (!canTrack()) return
  window.fbq!("track", "PageView")
}

export function pixelTrack(
  event: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!canTrack()) return
  if (params) {
    window.fbq!("track", event, params)
  } else {
    window.fbq!("track", event)
  }
}
