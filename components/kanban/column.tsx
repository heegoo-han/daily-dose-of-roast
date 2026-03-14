"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBoard } from "@/hooks/use-board";
import { validateCardTitle } from "@/lib/kanban-utils";
import type { Card as CardType, ColumnId } from "@/lib/kanban-types";
import { COLUMN_TITLES } from "@/lib/kanban-types";
import { CardItem } from "./card-item";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Plus } from "lucide-react";

interface ColumnProps {
  columnId: ColumnId;
  cards: CardType[];
}

export function Column({ columnId, cards }: ColumnProps) {
  const { dispatch } = useBoard();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    return dropTargetForElements({
      element: el,
      getData: () => ({ columnId }),
      onDragEnter: () => setIsDragOver(true),
      onDragLeave: () => setIsDragOver(false),
      onDrop: () => setIsDragOver(false),
    });
  }, [columnId]);

  const handleAdd = () => {
    const err = validateCardTitle(inputValue);
    if (err) {
      setError(err);
      return;
    }
    dispatch({ type: "ADD_CARD", payload: { title: inputValue.trim(), column: columnId } });
    setInputValue("");
    setError(null);
  };

  return (
    <div
      ref={dropRef}
      data-testid={`column-${columnId}`}
      data-column-id={columnId}
      className={`flex flex-col gap-3 rounded-xl bg-muted/50 p-3 min-h-[200px] ${isDragOver ? "ring-2 ring-primary/50" : ""}`}
    >
      <h2 className="text-sm font-semibold">{COLUMN_TITLES[columnId]}</h2>
      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
      <div className="mt-auto grid gap-1.5">
        <div className="flex gap-1.5">
          <Input
            placeholder="카드 제목 입력..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            aria-label={`${COLUMN_TITLES[columnId]} 카드 추가`}
          />
          <Button variant="outline" size="icon" onClick={handleAdd} aria-label="카드 추가">
            <Plus />
          </Button>
        </div>
        {error && (
          <p className="text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
