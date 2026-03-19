import { useState } from "react"
import type { CafeItem, SortKey } from "@/lib/coffee-data"

type UseCoffeeSortReturn = {
  sort: SortKey
  setSort: (sort: SortKey) => void
  sortedCafes: CafeItem[]
}

export function useCoffeeSort(cafes: readonly CafeItem[]): UseCoffeeSortReturn {
  const [sort, setSort] = useState<SortKey>("rating")

  // sortedCafes는 렌더 중 파생 — useEffect/별도 state 불필요
  const sortedCafes = cafes.toSorted((a, b) => {
    if (sort === "rating") return b.rating - a.rating
    if (sort === "distance") return a.distanceM - b.distanceM
    return b.reviewCount - a.reviewCount
  })

  return { sort, setSort, sortedCafes }
}
