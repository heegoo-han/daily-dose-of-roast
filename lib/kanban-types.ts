export type Priority = "High" | "Medium" | "Low";
export type ColumnId = "todo" | "in-progress" | "done";

export const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: "Todo",
  "in-progress": "In Progress",
  done: "Done",
};

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Card {
  id: string;
  title: string;
  column: ColumnId;
  priority: Priority;
  tags: string[];
  dueDate: string | null;
  subtasks: Subtask[];
  order: number;
}

export interface BoardState {
  cards: Card[];
}

export type BoardAction =
  | { type: "ADD_CARD"; payload: { title: string; column: ColumnId } }
  | { type: "DELETE_CARD"; payload: { id: string } }
  | { type: "UPDATE_CARD"; payload: { id: string; updates: Partial<Omit<Card, "id">> } }
  | { type: "MOVE_CARD"; payload: { id: string; toColumn: ColumnId; toIndex: number } }
  | { type: "REORDER_CARD"; payload: { id: string; toIndex: number } }
  | { type: "SET_BOARD"; payload: { cards: Card[] } };
