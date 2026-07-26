import { Brain, FileStack, Upload, BookOpen, Clock, Shield } from "lucide-react"

const features = [
  { icon: Brain, title: "Precision-trained AI", description: "Trained on millions of real documents. Spots key issues and builds strategic responses instantly.", large: true },
  { icon: FileStack, title: "Complete document drafts", description: "Motions, letters, complaints — formatted and ready for your review.", large: false },
  { icon: Upload, title: "Smart upload", description: "AI reads your filings and tailors your response.", large: false },
  { icon: BookOpen, title: "Verified sources", description: "References matched to your facts.", large: false },
  { icon: Clock, title: "24/7 access", description: "Help at 2 AM before a deadline.", large: false },
  { icon: Shield, title: "Built for pro se", description: "Plain-language guidance without a law degree.", large: true },
]

export function KeyFeatures() {
  return (
    <section id="features" className="section-dark section-pad">
      <div className="container-main">
        <div className="max-w-2xl">
          <span className="section-label">Features</span>
          <h2 className="section-title">Professional legal tools. Not professional prices.</h2>
          <p className="section-desc">Everything you need to move your case forward — in one platform.</p>
        </div>

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li key={f.title} className={`bento-card ${f.large ? "sm:col-span-2 lg:col-span-1 lg:row-span-1" : ""}`}>
              <f.icon className="h-9 w-9 text-brand" aria-hidden />
              <h3 className="mt-5 font-display text-2xl text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{f.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
