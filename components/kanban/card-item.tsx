"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBoard } from "@/hooks/use-board";
import { getPriorityColor, isOverdue, calculateProgress } from "@/lib/kanban-utils";
import type { Card as CardType } from "@/lib/kanban-types";
import { CardDetailModal } from "./card-detail-modal";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Trash2, GripVertical } from "lucide-react";

interface CardItemProps {
  card: CardType;
}

const PRIORITY_BORDER: Record<string, string> = {
  red: "border-l-red-500",
  yellow: "border-l-yellow-500",
  green: "border-l-green-500",
};

export function CardItem({ card }: CardItemProps) {
  const { dispatch } = useBoard();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const el = dragRef.current;
    if (!el) return;
    return draggable({
      element: el,
      getInitialData: () => ({ cardId: card.id, column: card.column }),
    });
  }, [card.id, card.column]);

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(card.title);
  };

  const handleTitleSave = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== card.title) {
      dispatch({ type: "UPDATE_CARD", payload: { id: card.id, updates: { title: trimmed } } });
    }
    setIsEditing(false);
  };

  const handleCardBodyClick = () => {
    if (!isEditing) setShowDetail(true);
  };

  const priorityColor = getPriorityColor(card.priority);
  const overdue = isOverdue(card.dueDate);
  const hasSubtasks = card.subtasks.length > 0;

  return (
    <>
      <Card
        ref={dragRef}
        size="sm"
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
        className={`cursor-grab border-l-4 ${PRIORITY_BORDER[priorityColor]} ${overdue ? "ring-2 ring-red-500" : ""}`}
        data-overdue={overdue}
      >
        <CardHeader>
          <div className="flex items-center gap-1">
            <GripVertical className="size-4 text-muted-foreground shrink-0" />
            {isEditing ? (
              <Input
                ref={inputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                aria-label="카드 제목 편집"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <CardTitle
                onClick={handleTitleClick}
                className="cursor-text"
                role="button"
                aria-label={`카드 제목: ${card.title}`}
              >
                {card.title}
              </CardTitle>
            )}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.stopPropagation();
                setShowDelete(true);
              }}
              aria-label="삭제"
              className="ml-auto shrink-0"
            >
              <Trash2 />
            </Button>
          </div>
        </CardHeader>
        <CardContent onClick={handleCardBodyClick} className="cursor-pointer">
          <div className="flex flex-wrap gap-1">
            {card.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          {card.dueDate && (
            <div className={`text-xs mt-1 ${overdue ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
              {card.dueDate}
            </div>
          )}
          {hasSubtasks && (
            <div className="text-xs text-muted-foreground mt-1" data-testid="progress">
              {calculateProgress(card.subtasks)}
            </div>
          )}
        </CardContent>
      </Card>

      <CardDetailModal card={card} open={showDetail} onOpenChange={setShowDetail} />
      <DeleteConfirmDialog
        open={showDelete}
        onConfirm={() => {
          dispatch({ type: "DELETE_CARD", payload: { id: card.id } });
          setShowDelete(false);
        }}
        onCancel={() => setShowDelete(false)}
      />
    </>
  );
}
