"use client"

import { motion } from "motion/react"
import { useLayoutEffect, useRef, useState } from "react"
import { Star, Navigation, Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SortKey } from "@/lib/coffee-data"

const SORT_OPTIONS: { key: SortKey; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "rating", label: "평점 순", Icon: Star },
  { key: "distance", label: "거리 순", Icon: Navigation },
  { key: "popularity", label: "인기 순", Icon: Flame },
]

type SortBarProps = {
  sort: SortKey
  onSortChange: (sort: SortKey) => void
}

export function SortBar({ sort, onSortChange }: SortBarProps) {
  const [dimensions, setDimensions] = useState({ width: 0, left: 0 })
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const update = () => {
      const btn = buttonRefs.current.get(sort)
      const container = containerRef.current
      if (btn && container) {
        const rect = btn.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        setDimensions({
          width: rect.width,
          left: rect.left - containerRect.left,
        })
      }
    }
    requestAnimationFrame(update)
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [sort])

  return (
    <div
      ref={containerRef}
      className="relative flex gap-1 p-1 rounded-xl border bg-background"
      role="group"
      aria-label="정렬 기준"
    >
      <motion.div
        animate={{
          width: dimensions.width,
          x: dimensions.left,
          opacity: dimensions.width > 0 ? 1 : 0,
        }}
        className="absolute z-[1] rounded-lg bg-foreground"
        initial={false}
        style={{ height: "calc(100% - 8px)", top: "4px", left: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />

      {SORT_OPTIONS.map(({ key, label, Icon }) => {
        const isActive = sort === key
        return (
          <button
            key={key}
            ref={(el) => {
              if (el) buttonRefs.current.set(key, el)
              else buttonRefs.current.delete(key)
            }}
            aria-pressed={isActive}
            onClick={() => onSortChange(key)}
            className={cn(
              "relative z-[2] flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2",
              "text-sm font-bold uppercase tracking-wide transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
            type="button"
          >
            <Icon className="size-3" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
