import { describe, it, expect, vi } from "vitest";
import { boardReducer } from "./use-board";
import type { BoardState, Card } from "@/lib/kanban-types";
import * as utils from "@/lib/kanban-utils";

let idCounter = 0;
vi.spyOn(utils, "generateId").mockImplementation(() => `test-id-${++idCounter}`);

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: "card-1",
    title: "Test Card",
    column: "todo",
    priority: "Medium",
    tags: [],
    dueDate: null,
    subtasks: [],
    order: 0,
    ...overrides,
  };
}

describe("boardReducer", () => {
  describe("ADD_CARD", () => {
    it("adds a card to the specified column", () => {
      const state: BoardState = { cards: [] };
      const result = boardReducer(state, {
        type: "ADD_CARD",
        payload: { title: "회의록 작성", column: "todo" },
      });
      expect(result.cards).toHaveLength(1);
      expect(result.cards[0].title).toBe("회의록 작성");
      expect(result.cards[0].column).toBe("todo");
      expect(result.cards[0].priority).toBe("Medium");
    });

    it("sets order to the end of column", () => {
      const state: BoardState = { cards: [makeCard({ order: 0 })] };
      const result = boardReducer(state, {
        type: "ADD_CARD",
        payload: { title: "New Card", column: "todo" },
      });
      expect(result.cards[1].order).toBe(1);
    });
  });

  describe("DELETE_CARD", () => {
    it("removes the card by id", () => {
      const state: BoardState = { cards: [makeCard()] };
      const result = boardReducer(state, {
        type: "DELETE_CARD",
        payload: { id: "card-1" },
      });
      expect(result.cards).toHaveLength(0);
    });

    it("does not affect other cards", () => {
      const state: BoardState = {
        cards: [makeCard(), makeCard({ id: "card-2", title: "Other" })],
      };
      const result = boardReducer(state, {
        type: "DELETE_CARD",
        payload: { id: "card-1" },
      });
      expect(result.cards).toHaveLength(1);
      expect(result.cards[0].id).toBe("card-2");
    });
  });

  describe("UPDATE_CARD", () => {
    it("updates card fields", () => {
      const state: BoardState = { cards: [makeCard()] };
      const result = boardReducer(state, {
        type: "UPDATE_CARD",
        payload: { id: "card-1", updates: { title: "Updated Title", priority: "High" } },
      });
      expect(result.cards[0].title).toBe("Updated Title");
      expect(result.cards[0].priority).toBe("High");
    });
  });

  describe("MOVE_CARD", () => {
    it("moves card to another column", () => {
      const state: BoardState = {
        cards: [makeCard({ id: "a", column: "todo", order: 0 })],
      };
      const result = boardReducer(state, {
        type: "MOVE_CARD",
        payload: { id: "a", toColumn: "in-progress", toIndex: 0 },
      });
      expect(result.cards.find((c) => c.id === "a")?.column).toBe("in-progress");
    });
  });

  describe("REORDER_CARD", () => {
    it("reorders cards within a column", () => {
      const state: BoardState = {
        cards: [
          makeCard({ id: "a", title: "A", order: 0 }),
          makeCard({ id: "b", title: "B", order: 1 }),
          makeCard({ id: "c", title: "C", order: 2 }),
        ],
      };
      const result = boardReducer(state, {
        type: "REORDER_CARD",
        payload: { id: "c", toIndex: 0 },
      });
      const sorted = result.cards.sort((a, b) => a.order - b.order);
      expect(sorted.map((c) => c.title)).toEqual(["C", "A", "B"]);
    });
  });

  describe("SET_BOARD", () => {
    it("replaces entire board state", () => {
      const state: BoardState = { cards: [makeCard()] };
      const newCards = [makeCard({ id: "new", title: "Imported" })];
      const result = boardReducer(state, {
        type: "SET_BOARD",
        payload: { cards: newCards },
      });
      expect(result.cards).toEqual(newCards);
    });
  });
});
