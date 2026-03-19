"use client"

import { useState } from "react"
import { NbHero } from "@/components/nb-hero"
import { SortBar } from "@/components/sort-bar"
import { CoffeeCard } from "@/components/coffee-card"
import { LocationSearch } from "@/components/location-search"
import { useCoffeeSort } from "@/hooks/use-coffee-sort"
import { useCafeData } from "@/hooks/use-cafe-data"

export default function CoffeePage() {
  const { cafes, locationInfo, status, searchByAddress } = useCafeData()
  const { sort, setSort, sortedCafes } = useCoffeeSort(cafes)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5">
        <NbHero
          location={locationInfo.location}
          locationDetail={locationInfo.locationDetail}
        />

        <LocationSearch onSearch={searchByAddress} status={status} />

        <SortBar sort={sort} onSortChange={setSort} />

        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground border-b-2 border-border pb-1">
          {sortedCafes.length} Cafés Near You
        </p>

        <ul
          role="list"
          className="flex flex-col gap-4 sm:grid sm:grid-cols-2"
        >
          {sortedCafes.map((cafe) => (
            <CoffeeCard
              key={cafe.id}
              {...cafe}
              activeSort={sort}
              dimmed={hoveredId !== null && hoveredId !== cafe.id}
              onHoverStart={() => setHoveredId(cafe.id)}
              onHoverEnd={() => setHoveredId(null)}
            />
          ))}
        </ul>
      </div>
    </main>
  )
}
