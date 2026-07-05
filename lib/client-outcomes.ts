export type ClientOutcome = {
  id: string
  number: string
  title: string
  name: string
  location: string
  quote: string
  rating: number
  /** Portrait — diverse, professional headshot style */
  portrait: string
}

export const CLIENT_OUTCOMES: ClientOutcome[] = [
  {
    id: "marcus",
    number: "01",
    title: "Motion filed on time",
    name: "Marcus T.",
    location: "California",
    quote:
      "I was sure I'd need ten or fifteen thousand just to get started. One call, a clear quote, and two days later I had a motion I wasn't embarrassed to hand the clerk. My brother read it and asked which lawyer I'd hired.",
    rating: 5,
    portrait:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=faces",
  },
  {
    id: "denise",
    number: "02",
    title: "Post-conviction relief",
    name: "Denise R.",
    location: "Texas",
    quote:
      "I'm not a legal person — I just knew my son's case deserved another look. I told them our story, answered their questions, and they sent everything back ready to file. I didn't write a single legal sentence myself.",
    rating: 4.5,
    portrait:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=faces",
  },
  {
    id: "james",
    number: "03",
    title: "Civil complaint delivered",
    name: "James K.",
    location: "Georgia",
    quote:
      "Every attorney I called wanted money up front before they'd explain my options. Here I got a straight answer in twenty minutes: what they could do, what it would cost, and when I'd have it. One payment. No surprises.",
    rating: 4,
    portrait:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=faces",
  },
  {
    id: "elena",
    number: "04",
    title: "Family case documents",
    name: "Elena M.",
    location: "Florida",
    quote:
      "They walked me through what to upload and what to expect. The documents read like someone who actually knew our situation wrote them — because they did. I filed pro se with confidence for the first time.",
    rating: 5,
    portrait:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=faces",
  },
]
