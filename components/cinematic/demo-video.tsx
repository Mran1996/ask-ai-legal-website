import { DEMO_VIDEO, DEMO_VIDEO_READY } from "@/lib/demo-video"

/** Product walkthrough. Renders nothing until lib/demo-video.ts points at a real video + captions. */
export function DemoVideo() {
  if (!DEMO_VIDEO_READY) return null

  return (
    <section id="demo" className="relative scroll-mt-20 bg-ground py-20 sm:py-28" aria-labelledby="demo-title">
      <div className="cine-container">
        <p className="cine-label mb-6">Product walkthrough</p>
        <h2 id="demo-title" className="cine-h2 text-cream">
          {DEMO_VIDEO.title}
        </h2>
        <p className="cine-body mt-6 max-w-2xl">{DEMO_VIDEO.description}</p>
        <div className="mt-10 overflow-hidden rounded-2xl border border-cream/10 bg-black shadow-2xl">
          <video
            className="aspect-video w-full"
            controls
            playsInline
            preload="metadata"
            poster={DEMO_VIDEO.poster || undefined}
          >
            <source src={DEMO_VIDEO.src} type="video/mp4" />
            <track kind="captions" src={DEMO_VIDEO.captions} srcLang="en" label={DEMO_VIDEO.captionsLabel} default />
            Your browser can&apos;t play this video.
          </video>
        </div>
      </div>
    </section>
  )
}
