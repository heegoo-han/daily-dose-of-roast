"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import type { Card, BoardState, BoardAction, ColumnId } from "@/lib/kanban-types";
import { generateId } from "@/lib/kanban-utils";

const STORAGE_KEY = "kanban-board";

function getInitialState(): BoardState {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.cards)) return parsed;
      }
    } catch {}
  }
  return { cards: [] };
}

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "ADD_CARD": {
      const { title, column } = action.payload;
      const columnCards = state.cards.filter((c) => c.column === column);
      const newCard: Card = {
        id: generateId(),
        title,
        column,
        priority: "Medium",
        tags: [],
        dueDate: null,
        subtasks: [],
        order: columnCards.length,
      };
      return { cards: [...state.cards, newCard] };
    }
    case "DELETE_CARD": {
      return { cards: state.cards.filter((c) => c.id !== action.payload.id) };
    }
    case "UPDATE_CARD": {
      return {
        cards: state.cards.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };
    }
    case "MOVE_CARD": {
      const { id, toColumn, toIndex } = action.payload;
      const card = state.cards.find((c) => c.id === id);
      if (!card) return state;

      const otherCards = state.cards.filter((c) => c.id !== id);
      const targetColumnCards = otherCards
        .filter((c) => c.column === toColumn)
        .sort((a, b) => a.order - b.order);

      targetColumnCards.splice(toIndex, 0, { ...card, column: toColumn });
      const reordered = targetColumnCards.map((c, i) => ({ ...c, order: i }));

      const result = otherCards
        .filter((c) => c.column !== toColumn)
        .concat(reordered);
      return { cards: result };
    }
    case "REORDER_CARD": {
      const { id, toIndex } = action.payload;
      const card = state.cards.find((c) => c.id === id);
      if (!card) return state;

      const columnCards = state.cards
        .filter((c) => c.column === card.column && c.id !== id)
        .sort((a, b) => a.order - b.order);

      columnCards.splice(toIndex, 0, card);
      const reordered = columnCards.map((c, i) => ({ ...c, order: i }));

      const otherCards = state.cards.filter((c) => c.column !== card.column);
      return { cards: [...otherCards, ...reordered] };
    }
    case "SET_BOARD": {
      return { cards: action.payload.cards };
    }
    default:
      return state;
  }
}

interface BoardContextValue {
  state: BoardState;
  dispatch: React.Dispatch<BoardAction>;
  getColumnCards: (column: ColumnId) => Card[];
}

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, undefined, getInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getColumnCards = useCallback(
    (column: ColumnId) =>
      state.cards.filter((c) => c.column === column).sort((a, b) => a.order - b.order),
    [state.cards]
  );

  return (
    <BoardContext.Provider value={{ state, dispatch, getColumnCards }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoard must be used within BoardProvider");
  return ctx;
}
