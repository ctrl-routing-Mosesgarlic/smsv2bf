"use client"

import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
} from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"
import { cn } from "../lib/utils"

type StackingCardsProps = {
  children: ReactNode
  className?: string
  gap?: number
  pinTop?: number
}

type InjectedCardProps = {
  index: number
  count: number
  scrollYProgress: MotionValue<number>
  motionRange: number
  pinTop: number
}

export function StackingCards({
  children,
  className,
  gap = 24,
  pinTop = 24,
}: StackingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 639px)").matches,
  )
  const [cardHeights, setCardHeights] = useState<number[]>([])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useLayoutEffect(() => {
    if (!stackRef.current) return
    const cards = stackRef.current.children
    const heights = Array.from(cards).map((el) => el.scrollHeight)
    setCardHeights(heights)
  }, [children])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const count = Children.count(children)

  if (reducedMotion || isMobile) {
    return (
      <div ref={stackRef} className={cn("flex flex-col", className)} style={{ gap }}>
        {children}
      </div>
    )
  }

  const totalRunway =
    cardHeights.reduce((sum, h) => sum + h + gap, gap) + (cardHeights[0] || 2000)

  return (
    <div className={cn("relative", className)}>
      <div
        ref={containerRef}
        className="relative"
        style={{ height: totalRunway }}
      >
        <div ref={stackRef} className="sticky" style={{ top: pinTop }}>
          {Children.map(children, (child, i) => {
            const cardHeight = cardHeights[i] || 400
            const motionRange = cardHeight + gap

            if (isValidElement(child)) {
              return cloneElement<InjectedCardProps>(child, {
                index: i,
                count,
                scrollYProgress,
                motionRange,
                pinTop,
              })
            }
            return child
          })}
        </div>
      </div>
    </div>
  )
}

type StackingCardProps = {
  children: ReactNode
  className?: string
  index?: number
  count?: number
  scrollYProgress?: MotionValue<number>
  motionRange?: number
  pinTop?: number
}

export function StackingCard({
  children,
  className,
  index = 0,
  count = 1,
  scrollYProgress,
  motionRange = 0,
  pinTop = 24,
}: StackingCardProps) {
  const isFirst = index === 0
  const isLast = index === count - 1

  const fallbackProgress = useScroll({}).scrollYProgress
  const progress = scrollYProgress ?? fallbackProgress

  const start = index / count
  const end = (index + 1) / count

  const y = useTransform(progress, [start, end], [0, isFirst ? 0 : -motionRange])

  const zIndex = count - index

  return (
    <motion.div
      className={cn("relative", className)}
      style={{
        position: !isLast ? "sticky" : undefined,
        top: isFirst ? pinTop : 0,
        zIndex,
        y: isFirst ? 0 : y,
      }}
    >
      {children}
    </motion.div>
  )
}
