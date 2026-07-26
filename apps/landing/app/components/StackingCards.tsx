"use client"

import { useRef, Children } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "../lib/utils"

gsap.registerPlugin(ScrollTrigger)

type StackingCardsProps = {
  children: React.ReactNode
  className?: string
}

export function StackingCards({ children, className }: StackingCardsProps) {
  const container = useRef<HTMLDivElement>(null)
  const cardsContainer = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    () => {
      const cards = cardRefs.current
      const totalCards = cards.length
      if (totalCards === 0) return

      gsap.set(cards.slice(1), { y: "100%" })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      })

      for (let i = 0; i < totalCards - 1; i++) {
        const current = cards[i]
        const next = cards[i + 1]
        if (!current || !next) continue

        tl.to(
          current,
          { scale: 0.7, rotation: 3, duration: 1, ease: "none" },
          i,
        )
        tl.to(next, { y: "0%", duration: 1, ease: "none" }, i)
      }
    },
    { scope: container },
  )

  return (
    <div ref={container} className={cn("relative", className)}>
      <div
        ref={cardsContainer}
        className="relative h-[90vh] w-full overflow-hidden"
      >
        {Children.map(children, (child, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="h-full w-full">{child}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
