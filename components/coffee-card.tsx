"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CafeItem, SortKey } from "@/lib/coffee-data"

const TILT_MAX = 9
const TILT_SPRING = { stiffness: 300, damping: 28 } as const
const GLOW_SPRING = { stiffness: 180, damping: 22 } as const

const ACCENT_COLORS: Record<string, string> = {
  "always-bagel": "#f59e0b",
  "teehev": "#a78bfa",
  "starbucks-reserve-magok": "#34d399",
  "cafe-woodjin": "#60a5fa",
  "blctd-magok": "#f472b6",
  "test-cafe": "#60a5fa",
}

type CoffeeCardProps = CafeItem & {
  activeSort?: SortKey
  dimmed?: boolean
  onHoverStart?: () => void
  onHoverEnd?: () => void
}

export function CoffeeCard({
  id,
  name,
  image,
  menuName,
  rating,
  reviewCount,
  distanceM,
  recommendation,
  activeSort,
  dimmed = false,
  onHoverStart,
  onHoverEnd,
}: CoffeeCardProps) {
  const cardRef = useRef<HTMLLIElement>(null)
  const color = ACCENT_COLORS[id] ?? "#60a5fa"
  const distanceLabel = distanceM >= 1000 ? `${(distanceM / 1000).toFixed(1)}km` : `${distanceM}m`
  const reviewLabel = reviewCount.toLocaleString()

  const normX = useMotionValue(0.5)
  const normY = useMotionValue(0.5)
  const rawRotateX = useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX])
  const rawRotateY = useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX])
  const rotateX = useSpring(rawRotateX, TILT_SPRING)
  const rotateY = useSpring(rawRotateY, TILT_SPRING)
  const glowOpacity = useSpring(0, GLOW_SPRING)

  const handleMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    normX.set((e.clientX - rect.left) / rect.width)
    normY.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseEnter = () => {
    glowOpacity.set(1)
    onHoverStart?.()
  }

  const handleMouseLeave = () => {
    normX.set(0.5)
    normY.set(0.5)
    glowOpacity.set(0)
    onHoverEnd?.()
  }

  return (
    <motion.li
      ref={cardRef}
      animate={{ scale: dimmed ? 0.97 : 1, opacity: dimmed ? 0.5 : 1 }}
      className="group relative flex overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:border-white/6 dark:bg-white/3 dark:shadow-none transition-[border-color] duration-300 hover:border-zinc-300 dark:hover:border-white/14 min-h-[140px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {/* Static accent tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 20% 20%, ${color}14, transparent 65%)` }}
      />

      {/* Hover glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(ellipse at 20% 20%, ${color}2e, transparent 65%)`,
        }}
      />

      {/* Shimmer sweep */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[55%] -translate-x-full -skew-x-12 bg-linear-to-r from-transparent via-white/4.5 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]"
      />

      {/* Image */}
      <div className="relative shrink-0 w-[120px] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="120px"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-between p-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-black uppercase tracking-tight leading-tight text-zinc-900 dark:text-white">
              {name}
            </span>
            <Badge
              data-testid="distance"
              variant={activeSort === "distance" ? "default" : "outline"}
              className={cn(
                "shrink-0 border-[2px] border-foreground font-bold uppercase tracking-widest text-[10px]",
                activeSort === "distance" && "bg-foreground text-background"
              )}
            >
              {distanceLabel}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className="border-[2px] border-foreground font-black text-[13px] gap-1 px-2"
            >
              <Star className="size-3 fill-foreground" />
              <span data-testid="rating">{rating}</span>
            </Badge>

            <span
              data-testid="review-count"
              className={cn(
                "text-xs border-[2px] px-2 py-0.5 font-bold tracking-wide",
                activeSort === "popularity"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground"
              )}
            >
              {reviewLabel}
            </span>

            <Badge
              variant="outline"
              data-testid="menu-name"
              className="border-[2px] border-border font-bold uppercase text-[10px] tracking-wide"
            >
              {menuName}
            </Badge>
          </div>
        </div>

        <p
          data-testid="recommendation"
          className="text-[10px] text-muted-foreground border-t border-dashed border-border pt-1.5 mt-1.5 leading-relaxed"
        >
          {recommendation}
        </p>
      </div>

      {/* Accent bottom line */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
        style={{ background: `linear-gradient(to right, ${color}80, transparent)` }}
      />
    </motion.li>
  )
}
