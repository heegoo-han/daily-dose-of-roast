import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SortBar } from "@/components/sort-bar"

describe("SortBar", () => {
  it("3개 버튼을 렌더링한다", () => {
    render(<SortBar sort="rating" onSortChange={vi.fn()} />)
    expect(screen.getByRole("button", { name: /평점 순/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /거리 순/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /인기 순/ })).toBeInTheDocument()
  })

  it("sort='rating'이면 평점 순 버튼이 aria-pressed=true", () => {
    render(<SortBar sort="rating" onSortChange={vi.fn()} />)
    expect(screen.getByRole("button", { name: /평점 순/ })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: /거리 순/ })).toHaveAttribute("aria-pressed", "false")
    expect(screen.getByRole("button", { name: /인기 순/ })).toHaveAttribute("aria-pressed", "false")
  })

  it("sort='distance'이면 거리 순 버튼이 aria-pressed=true", () => {
    render(<SortBar sort="distance" onSortChange={vi.fn()} />)
    expect(screen.getByRole("button", { name: /거리 순/ })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: /평점 순/ })).toHaveAttribute("aria-pressed", "false")
  })

  it("버튼 클릭 시 onSortChange가 해당 key로 호출된다", async () => {
    const onSortChange = vi.fn()
    const user = userEvent.setup()
    render(<SortBar sort="rating" onSortChange={onSortChange} />)
    await user.click(screen.getByRole("button", { name: /거리 순/ }))
    expect(onSortChange).toHaveBeenCalledWith("distance")
  })
})
