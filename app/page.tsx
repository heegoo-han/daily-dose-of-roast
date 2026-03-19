"use client"

import { NbHero } from "@/components/nb-hero"
import { SortBar } from "@/components/sort-bar"
import { CoffeeCard } from "@/components/coffee-card"
import { useCoffeeSort } from "@/hooks/use-coffee-sort"
import { CAFES } from "@/lib/coffee-data"

export default function CoffeePage() {
  const { sort, setSort, sortedCafes } = useCoffeeSort(CAFES)

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5">
        <NbHero location="마곡동" locationDetail="서울 강서구" />

        <SortBar sort={sort} onSortChange={setSort} />

        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground border-b-2 border-border pb-1">
          {sortedCafes.length} Cafés Near You
        </p>

        <ul
          role="list"
          className="flex flex-col gap-4 sm:grid sm:grid-cols-2"
        >
          {sortedCafes.map((cafe) => (
            <CoffeeCard key={cafe.id} {...cafe} activeSort={sort} />
          ))}
        </ul>
      </div>
    </main>
  )
}
