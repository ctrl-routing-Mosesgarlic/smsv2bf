"use client"

import { useRef, useState, useEffect, Children, type ReactNode } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { cn } from "../lib/utils"

type StackingCardsProps = {
  children: ReactNode
  className?: string
}

export function StackingCards({ children, className }: StackingCardsProps) {
  const container = useRef<HTMLDivElement>(null)
  const [navbarHeight, setNavbarHeight] = useState(0)

  useEffect(() => {
    const navbar = document.querySelector("[class*='fixed'][class*='top-0']")
    if (navbar) setNavbarHeight(navbar.getBoundingClientRect().height + 12)
  }, [])

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  })

  const count = Children.count(children)

  return (
    <div
      ref={container}
      className={cn("relative flex flex-col items-center", className)}
    >
      {Children.map(children, (child, i) => {
        const targetScale = Math.max(0.5, 1 - (count - i - 1) * 0.1)

        return (
          <StackingCard
            key={i}
            index={i}
            progress={scrollYProgress}
            range={[i * (1 / count), 1]}
            targetScale={targetScale}
            navbarHeight={navbarHeight}
          >
            {child}
          </StackingCard>
        )
      })}
    </div>
  )
}

type StackingCardProps = {
  children: ReactNode
  index: number
  progress: any
  range: [number, number]
  targetScale: number
  navbarHeight: number
}

function StackingCard({
  children,
  index,
  progress,
  range,
  targetScale,
  navbarHeight,
}: StackingCardProps) {
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div
      className="sticky mb-8 flex w-full items-center justify-center"
      style={{ top: navbarHeight }}
    >
      <motion.div
        style={{
          scale,
        }}
        className="w-full origin-top"
      >
        {children}
      </motion.div>
    </div>
  )
}
