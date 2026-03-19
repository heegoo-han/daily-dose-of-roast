import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useCoffeeSort } from "@/hooks/use-coffee-sort"
import { CAFES } from "@/lib/coffee-data"

describe("useCoffeeSort", () => {
  it("기본 정렬이 평점 순이고 첫 번째 카페 평점이 4.8이다", () => {
    const { result } = renderHook(() => useCoffeeSort(CAFES))
    expect(result.current.sort).toBe("rating")
    expect(result.current.sortedCafes[0].rating).toBe(4.8)
    expect(result.current.sortedCafes[1].rating).toBe(4.7)
  })

  it("거리 순으로 변경하면 가장 가까운 카페가 첫 번째가 된다", () => {
    const { result } = renderHook(() => useCoffeeSort(CAFES))
    act(() => result.current.setSort("distance"))
    expect(result.current.sortedCafes[0].distanceM).toBe(150)
    expect(result.current.sortedCafes[4].distanceM).toBe(800)
  })

  it("인기 순으로 변경하면 리뷰 수 많은 카페가 첫 번째가 된다", () => {
    const { result } = renderHook(() => useCoffeeSort(CAFES))
    act(() => result.current.setSort("popularity"))
    expect(result.current.sortedCafes[0].reviewCount).toBe(1200)
    expect(result.current.sortedCafes[4].reviewCount).toBe(300)
  })

  it("정렬 후 원본 CAFES 배열이 변경되지 않는다", () => {
    const originalFirst = CAFES[0].id
    const { result } = renderHook(() => useCoffeeSort(CAFES))
    act(() => result.current.setSort("distance"))
    expect(CAFES[0].id).toBe(originalFirst)
  })
})
