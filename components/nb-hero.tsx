"use client"

import { MapPin } from "lucide-react"
import { motion } from "motion/react"
import BeamsBackground from "@/components/kokonutui/beams-background"

type NbHeroProps = {
  location: string
  locationDetail?: string
}

export function NbHero({ location, locationDetail }: NbHeroProps) {
  return (
    <div className="relative h-52 overflow-hidden rounded-2xl">
      <BeamsBackground intensity="medium" className="absolute inset-0 h-52 min-h-0">
        <div className="flex h-52 flex-col items-center justify-center gap-3 px-4 text-center">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5"
          >
            <MapPin className="size-3.5 text-neutral-500 dark:text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest dark:text-neutral-400">
              {locationDetail}
            </span>
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-bold text-4xl text-neutral-900 tracking-tighter dark:text-white"
          >
            {location}{" "}
            <span className="text-indigo-600 dark:text-indigo-400">커피</span>
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs text-neutral-400 dark:text-neutral-500"
          >
            ☕ 근처 카페를 찾아보세요
          </motion.p>
        </div>
      </BeamsBackground>
    </div>
  )
}
