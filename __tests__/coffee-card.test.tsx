import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { CoffeeCard } from "@/components/coffee-card"
import type { CafeItem } from "@/lib/coffee-data"

const mockCafe: CafeItem = {
  id: "test-cafe",
  name: "테스트 카페",
  image: "/test.jpg",
  menuName: "아이스 아메리카노",
  rating: 4.8,
  reviewCount: 1200,
  distanceM: 150,
  recommendation: "원두 직접 로스팅, 산미 없는 진한 맛",
}

describe("CoffeeCard", () => {
  it("모든 핵심 필드를 렌더링한다", () => {
    render(<ul><CoffeeCard {...mockCafe} /></ul>)
    expect(screen.getByRole("img")).toBeInTheDocument()
    expect(screen.getByTestId("menu-name")).toHaveTextContent("아이스 아메리카노")
    expect(screen.getByTestId("rating")).toHaveTextContent("4.8")
    expect(screen.getByTestId("distance")).toHaveTextContent("150m")
    expect(screen.getByTestId("recommendation")).toHaveTextContent("원두 직접 로스팅")
    expect(screen.getByTestId("review-count")).toHaveTextContent("1,200")
  })

  it("activeSort='popularity'일 때 리뷰 수가 반전 배경으로 표시된다", () => {
    render(<ul><CoffeeCard {...mockCafe} activeSort="popularity" /></ul>)
    const reviewBadge = screen.getByTestId("review-count")
    expect(reviewBadge.className).toMatch(/bg-foreground/)
    expect(reviewBadge.className).toMatch(/text-background/)
  })

  it("activeSort='distance'일 때 거리 태그가 반전 배경으로 표시된다", () => {
    render(<ul><CoffeeCard {...mockCafe} activeSort="distance" /></ul>)
    const distanceBadge = screen.getByTestId("distance")
    expect(distanceBadge.className).toMatch(/bg-foreground/)
  })

  it("distanceM이 1000 이상이면 km 단위로 표시된다", () => {
    render(<ul><CoffeeCard {...mockCafe} distanceM={1500} /></ul>)
    expect(screen.getByTestId("distance")).toHaveTextContent("1.5km")
  })
})
