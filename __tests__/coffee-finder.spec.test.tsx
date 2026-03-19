/**
 * Coffee Finder Spec Tests
 * spec.yaml 시나리오에서 파생 — 수정 금지
 *
 * COFFEE-001: 커피 가게 목록 초기 표시
 * COFFEE-002: 평점 순 정렬
 * COFFEE-003: 거리 순 정렬
 * COFFEE-004: 인기 순 정렬
 * COFFEE-005: 카드에 핵심 정보 모두 표시
 */
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import CoffeePage from "@/app/page"

describe("COFFEE-001: 커피 가게 목록 초기 표시", () => {
  it("페이지 로드 시 카드 5개가 평점 높은 순으로 표시된다", () => {
    render(<CoffeePage />)

    const cards = screen.getAllByRole("listitem")
    expect(cards).toHaveLength(5)

    const ratings = cards.map((card) =>
      parseFloat(within(card).getByTestId("rating").textContent ?? "0")
    )
    expect(ratings[0]).toBeGreaterThanOrEqual(ratings[1])
    expect(ratings[0]).toBe(4.6)
    expect(ratings[1]).toBe(4.2)
  })

  it("기본 정렬 레이블이 '평점 순'으로 표시된다", () => {
    render(<CoffeePage />)

    const ratingBtn = screen.getByRole("button", { name: /평점 순/ })
    expect(ratingBtn).toHaveAttribute("aria-pressed", "true")
  })
})

describe("COFFEE-002: 평점 순 정렬", () => {
  it("평점 순 버튼 클릭 시 평점 높은 순으로 정렬되고 버튼이 활성화된다", async () => {
    const user = userEvent.setup()
    render(<CoffeePage />)

    await user.click(screen.getByRole("button", { name: /인기 순/ }))
    await user.click(screen.getByRole("button", { name: /평점 순/ }))

    const cards = screen.getAllByRole("listitem")
    const firstRating = parseFloat(within(cards[0]).getByTestId("rating").textContent ?? "0")
    const secondRating = parseFloat(within(cards[1]).getByTestId("rating").textContent ?? "0")
    expect(firstRating).toBe(4.6)
    expect(secondRating).toBe(4.2)

    expect(screen.getByRole("button", { name: /평점 순/ })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: /인기 순/ })).toHaveAttribute("aria-pressed", "false")
  })
})

describe("COFFEE-003: 거리 순 정렬", () => {
  it("거리 순 버튼 클릭 시 가까운 순으로 정렬되고 버튼이 활성화된다", async () => {
    const user = userEvent.setup()
    render(<CoffeePage />)

    await user.click(screen.getByRole("button", { name: /거리 순/ }))

    const cards = screen.getAllByRole("listitem")
    expect(within(cards[0]).getByTestId("distance")).toHaveTextContent("350m")
    expect(within(cards[4]).getByTestId("distance")).toHaveTextContent("800m")

    expect(screen.getByRole("button", { name: /거리 순/ })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: /평점 순/ })).toHaveAttribute("aria-pressed", "false")
  })
})

describe("COFFEE-004: 인기 순 정렬", () => {
  it("인기 순 버튼 클릭 시 리뷰 많은 순으로 정렬되고 버튼이 활성화된다", async () => {
    const user = userEvent.setup()
    render(<CoffeePage />)

    await user.click(screen.getByRole("button", { name: /인기 순/ }))

    const cards = screen.getAllByRole("listitem")
    expect(within(cards[0]).getByTestId("review-count")).toHaveTextContent("847")
    expect(within(cards[4]).getByTestId("review-count")).toHaveTextContent("43")

    expect(screen.getByRole("button", { name: /인기 순/ })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: /평점 순/ })).toHaveAttribute("aria-pressed", "false")
  })
})

describe("COFFEE-005: 카드에 핵심 정보 모두 표시", () => {
  it("첫 번째 카드에 이미지·메뉴·평점·거리·추천이유가 모두 표시된다", () => {
    render(<CoffeePage />)

    const cards = screen.getAllByRole("listitem")
    const firstCard = cards[0]

    expect(within(firstCard).getByRole("img")).toBeInTheDocument()
    expect(within(firstCard).getByTestId("menu-name")).toHaveTextContent("시금치 리코타 베이글")
    expect(within(firstCard).getByTestId("rating")).toHaveTextContent("4.6")
    expect(within(firstCard).getByTestId("distance")).toHaveTextContent("350m")
    expect(within(firstCard).getByTestId("recommendation")).toHaveTextContent("천연발효종 베이글")
  })
})
