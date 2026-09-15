"use client"

import Link from "next/link"
import { Slot } from "./slot"
import { Reveal } from "./reveal"

const ITEMS: { title: string; body: string; img: string; href: string }[] = [
  { title: "Divorce & separation", body: "Petitions, responses, disclosures, agreements.", img: "situation-divorce.png", href: "/situations/divorce" },
  { title: "Custody & family", body: "Parenting plans, declarations, motions.", img: "situation-custody.png", href: "/situations/custody" },
  { title: "Housing & eviction", body: "Notices, answers, repair and deposit disputes.", img: "situation-housing.png", href: "/situations/housing" },
  { title: "Small claims", body: "Claims, evidence lists, judgment paperwork.", img: "situation-small-claims.png", href: "/situations/small-claims" },
  { title: "Civil disputes", body: "Complaints, answers, discovery, motions.", img: "situation-civil.png", href: "/situations/civil" },
  { title: "Immigration paperwork", body: "Forms, supporting documents, cover letters.", img: "situation-immigration.png", href: "/situations/immigration" },
]

export function Situations() {
  return (
    <section id="situations" className="relative bg-ground py-24 sm:py-32">
      <div className="cine-container">
        <Reveal>
          <p data-reveal className="cine-label mb-6">What we install for</p>
          <h2 data-reveal className="cine-h2 text-cream">
            Any U.S. state.
            <span className="cine-serif text-accent-light"> Any matter you can run yourself.</span>
          </h2>
        </Reveal>

        <Reveal className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {ITEMS.map((it) => (
            <Link key={it.title} href={it.href} data-reveal className="cine-card group relative overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                <Slot src={it.img} className="h-full w-full transition-transform duration-700 group-hover:scale-105" imgClassName="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ground via-ground/40 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="cine-h3 !text-xl text-cream">{it.title}</h3>
                <p className="mt-1 text-sm text-cream/60">{it.body}</p>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
