import type { Card, Priority, BoardState } from "./kanban-types";

export function validateCardTitle(title: string): string | null {
  if (!title.trim()) return "제목을 입력해주세요";
  return null;
}

export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case "High":
      return "red";
    case "Medium":
      return "yellow";
    case "Low":
      return "green";
  }
}

export function isOverdue(dueDate: string | null, today?: Date): boolean {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  const now = today ?? new Date();
  due.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return due < now;
}

export function calculateProgress(subtasks: { completed: boolean }[]): string {
  const completed = subtasks.filter((s) => s.completed).length;
  return `${completed}/${subtasks.length}`;
}

export function filterCards(
  cards: Card[],
  filters: {
    search?: string;
    priority?: Priority | "all";
    tag?: string | "all";
  }
): Card[] {
  return cards.filter((card) => {
    if (filters.search && !card.title.includes(filters.search)) return false;
    if (filters.priority && filters.priority !== "all" && card.priority !== filters.priority)
      return false;
    if (filters.tag && filters.tag !== "all" && !card.tags.includes(filters.tag)) return false;
    return true;
  });
}

export function serializeBoard(state: BoardState): string {
  return JSON.stringify(state);
}

export function deserializeBoard(json: string): BoardState | null {
  try {
    const parsed = JSON.parse(json);
    if (!parsed || !Array.isArray(parsed.cards)) return null;
    for (const card of parsed.cards) {
      if (typeof card.id !== "string" || typeof card.title !== "string") return null;
      if (!["todo", "in-progress", "done"].includes(card.column)) return null;
    }
    return parsed as BoardState;
  } catch {
    return null;
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
