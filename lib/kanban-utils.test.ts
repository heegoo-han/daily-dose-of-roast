import { describe, it, expect } from "vitest";
import {
  validateCardTitle,
  getPriorityColor,
  isOverdue,
  calculateProgress,
  filterCards,
  serializeBoard,
  deserializeBoard,
} from "./kanban-utils";
import type { Card } from "./kanban-types";

describe("validateCardTitle", () => {
  it("returns error for empty title", () => {
    expect(validateCardTitle("")).toBe("제목을 입력해주세요");
  });
  it("returns error for whitespace-only title", () => {
    expect(validateCardTitle("   ")).toBe("제목을 입력해주세요");
  });
  it("returns null for valid title", () => {
    expect(validateCardTitle("회의록 작성")).toBeNull();
  });
});

describe("getPriorityColor", () => {
  it("returns red for High", () => {
    expect(getPriorityColor("High")).toBe("red");
  });
  it("returns yellow for Medium", () => {
    expect(getPriorityColor("Medium")).toBe("yellow");
  });
  it("returns green for Low", () => {
    expect(getPriorityColor("Low")).toBe("green");
  });
});

describe("isOverdue", () => {
  it("returns true when due date is before today", () => {
    expect(isOverdue("2026-03-13", new Date("2026-03-14"))).toBe(true);
  });
  it("returns false when due date is after today", () => {
    expect(isOverdue("2026-03-15", new Date("2026-03-14"))).toBe(false);
  });
  it("returns false when due date is today", () => {
    expect(isOverdue("2026-03-14", new Date("2026-03-14"))).toBe(false);
  });
  it("returns false when no due date", () => {
    expect(isOverdue(null)).toBe(false);
  });
});

describe("calculateProgress", () => {
  it("returns 0/3 when none completed", () => {
    expect(
      calculateProgress([
        { completed: false },
        { completed: false },
        { completed: false },
      ])
    ).toBe("0/3");
  });
  it("returns 2/3 when two completed", () => {
    expect(
      calculateProgress([
        { completed: true },
        { completed: true },
        { completed: false },
      ])
    ).toBe("2/3");
  });
  it("returns 3/3 when all completed", () => {
    expect(
      calculateProgress([
        { completed: true },
        { completed: true },
        { completed: true },
      ])
    ).toBe("3/3");
  });
});

describe("filterCards", () => {
  const cards: Card[] = [
    { id: "1", title: "회의록 작성", column: "todo", priority: "High", tags: ["버그"], dueDate: null, subtasks: [], order: 0 },
    { id: "2", title: "주간 보고서", column: "todo", priority: "Medium", tags: ["기능"], dueDate: null, subtasks: [], order: 1 },
    { id: "3", title: "코드 리뷰", column: "in-progress", priority: "Low", tags: ["버그"], dueDate: null, subtasks: [], order: 0 },
  ];

  it("filters by search text", () => {
    const result = filterCards(cards, { search: "회의" });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("회의록 작성");
  });

  it("returns all when search is empty", () => {
    const result = filterCards(cards, { search: "" });
    expect(result).toHaveLength(3);
  });

  it("filters by priority", () => {
    const result = filterCards(cards, { priority: "High" });
    expect(result).toHaveLength(1);
    expect(result[0].priority).toBe("High");
  });

  it("returns all when priority is 'all'", () => {
    const result = filterCards(cards, { priority: "all" });
    expect(result).toHaveLength(3);
  });

  it("filters by tag", () => {
    const result = filterCards(cards, { tag: "버그" });
    expect(result).toHaveLength(2);
  });

  it("returns all when tag is 'all'", () => {
    const result = filterCards(cards, { tag: "all" });
    expect(result).toHaveLength(3);
  });
});

describe("serializeBoard / deserializeBoard", () => {
  it("roundtrips board state", () => {
    const state = { cards: [{ id: "1", title: "test", column: "todo" as const, priority: "Medium" as const, tags: [], dueDate: null, subtasks: [], order: 0 }] };
    const json = serializeBoard(state);
    const result = deserializeBoard(json);
    expect(result).toEqual(state);
  });

  it("returns null for invalid JSON", () => {
    expect(deserializeBoard("not json")).toBeNull();
  });

  it("returns null for missing cards array", () => {
    expect(deserializeBoard('{"foo":"bar"}')).toBeNull();
  });

  it("returns null for invalid card structure", () => {
    expect(deserializeBoard('{"cards":[{"id":123}]}')).toBeNull();
  });
});
