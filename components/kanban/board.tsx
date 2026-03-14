"use client";

import { useState, useEffect, useMemo } from "react";
import { useBoard } from "@/hooks/use-board";
import { filterCards } from "@/lib/kanban-utils";
import type { ColumnId, Priority } from "@/lib/kanban-types";
import { Column } from "./column";
import { Header } from "./header";
import { Toolbar } from "./toolbar";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

const COLUMNS: ColumnId[] = ["todo", "in-progress", "done"];

export function Board() {
  const { state, dispatch, getColumnCards } = useBoard();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [tagFilter, setTagFilter] = useState<string>("all");

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const cardId = source.data.cardId as string;
        const sourceColumn = source.data.column as ColumnId;
        const targetColumnId = destination.data.columnId as ColumnId;

        if (!cardId || !targetColumnId) return;

        // Find the target card (if dropping on a card)
        const targetCardEl = destination.element.closest("[data-card-id]");
        const targetCardId = targetCardEl?.getAttribute("data-card-id");

        if (sourceColumn === targetColumnId) {
          // Reorder within column
          const columnCards = getColumnCards(targetColumnId);
          let toIndex = columnCards.length;
          if (targetCardId) {
            toIndex = columnCards.findIndex((c) => c.id === targetCardId);
          }
          dispatch({ type: "REORDER_CARD", payload: { id: cardId, toIndex } });
        } else {
          // Move to different column
          const columnCards = getColumnCards(targetColumnId);
          let toIndex = columnCards.length;
          if (targetCardId) {
            toIndex = columnCards.findIndex((c) => c.id === targetCardId);
          }
          dispatch({ type: "MOVE_CARD", payload: { id: cardId, toColumn: targetColumnId, toIndex } });
        }
      },
    });
  }, [dispatch, getColumnCards]);

  const filteredCards = useMemo(
    () => filterCards(state.cards, { search, priority: priorityFilter, tag: tagFilter }),
    [state.cards, search, priorityFilter, tagFilter]
  );

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    state.cards.forEach((c) => c.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [state.cards]);

  return (
    <div className="flex flex-col gap-4 p-4 max-w-6xl mx-auto">
      <Header />
      <Toolbar
        search={search}
        onSearchChange={setSearch}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        tagFilter={tagFilter}
        onTagFilterChange={setTagFilter}
        availableTags={availableTags}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <Column
            key={col}
            columnId={col}
            cards={filteredCards
              .filter((c) => c.column === col)
              .sort((a, b) => a.order - b.order)}
          />
        ))}
      </div>
    </div>
  );
}
