"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { WALKTHROUGH_VIDEO_ID } from "@/lib/site-config"

/** YouTube preview. The player loads only after a click, so nothing from YouTube runs before that. */
export function SeeDifference() {
  const [playing, setPlaying] = useState(false)

  return (
    <section id="demo" className="relative scroll-mt-20 bg-ground py-8 sm:py-12" aria-labelledby="demo-title">
      <div className="cine-container">
        <h2 id="demo-title" className="cine-h2 text-cream">
          See the <span className="cine-serif text-accent-light">difference.</span>
        </h2>
        <p className="cine-body mt-4 max-w-2xl">A short preview of the workspace on YouTube.</p>
        <div className="mt-6 max-w-3xl overflow-hidden rounded-2xl border border-cream/10 bg-black shadow-2xl">
          {playing ? (
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube-nocookie.com/embed/${WALKTHROUGH_VIDEO_ID}?autoplay=1&rel=0`}
              title="Ask AI Legal preview video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group relative block aspect-video w-full"
              aria-label="Play the preview video"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/samples/video-preview.jpg" alt="" className="h-full w-full object-cover" loading="lazy" />
              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-ground shadow-xl transition-transform group-hover:scale-110">
                <Play className="ml-1 h-7 w-7 fill-current" aria-hidden />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
