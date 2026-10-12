/**
 * Homepage product walkthrough ("See Ask AI Legal in action").
 *
 * The section and the hero's "Watch the demo" button stay hidden until `src` is set.
 * To publish the real walkthrough:
 *   1. Put the files in /public/demo/ (e.g. walkthrough.mp4, walkthrough-poster.jpg, walkthrough-en.vtt),
 *      or use full https URLs from a video host that serves MP4 directly.
 *   2. Fill in src, poster, and captions below (captions are WebVTT; required for accessibility).
 *   3. Rebuild and deploy.
 * Use only a real recording of the software with a sample (fictional) case — never a customer's files.
 */
export const DEMO_VIDEO = {
  src: "",
  poster: "",
  captions: "",
  captionsLabel: "English",
  title: "See Ask AI Legal in action",
  description:
    "Watch a sample case move from uploaded documents to source review, an editable draft, and a downloadable document.",
} as const

export const DEMO_VIDEO_READY = DEMO_VIDEO.src.length > 0 && DEMO_VIDEO.captions.length > 0
