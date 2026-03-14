"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBoard } from "@/hooks/use-board";
import type { Card, Priority } from "@/lib/kanban-types";
import { generateId } from "@/lib/kanban-utils";
import { X, Plus } from "lucide-react";

interface CardDetailModalProps {
  card: Card;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CardDetailModal({ card, open, onOpenChange }: CardDetailModalProps) {
  const { dispatch } = useBoard();
  const [tagInput, setTagInput] = useState("");
  const [subtaskInput, setSubtaskInput] = useState("");

  const handlePriorityChange = (priority: Priority) => {
    dispatch({ type: "UPDATE_CARD", payload: { id: card.id, updates: { priority } } });
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "UPDATE_CARD",
      payload: { id: card.id, updates: { dueDate: e.target.value || null } },
    });
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (!tag || card.tags.includes(tag)) return;
    dispatch({
      type: "UPDATE_CARD",
      payload: { id: card.id, updates: { tags: [...card.tags, tag] } },
    });
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    dispatch({
      type: "UPDATE_CARD",
      payload: { id: card.id, updates: { tags: card.tags.filter((t) => t !== tag) } },
    });
  };

  const handleAddSubtask = () => {
    const title = subtaskInput.trim();
    if (!title) return;
    dispatch({
      type: "UPDATE_CARD",
      payload: {
        id: card.id,
        updates: {
          subtasks: [...card.subtasks, { id: generateId(), title, completed: false }],
        },
      },
    });
    setSubtaskInput("");
  };

  const handleToggleSubtask = (subtaskId: string) => {
    dispatch({
      type: "UPDATE_CARD",
      payload: {
        id: card.id,
        updates: {
          subtasks: card.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          ),
        },
      },
    });
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    dispatch({
      type: "UPDATE_CARD",
      payload: {
        id: card.id,
        updates: { subtasks: card.subtasks.filter((s) => s.id !== subtaskId) },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{card.title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Priority */}
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">우선순위</label>
            <Select value={card.priority} onValueChange={(v) => handlePriorityChange(v as Priority)}>
              <SelectTrigger aria-label="우선순위 선택">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">마감일</label>
            <Input
              type="date"
              value={card.dueDate ?? ""}
              onChange={handleDueDateChange}
              aria-label="마감일"
            />
          </div>

          {/* Tags */}
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">태그</label>
            <div className="flex gap-1.5 flex-wrap">
              {card.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`태그 ${tag} 삭제`}
                    className="ml-1"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-1.5">
              <Input
                placeholder="태그 입력..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                aria-label="태그 입력"
              />
              <Button variant="outline" size="sm" onClick={handleAddTag} aria-label="태그 추가">
                <Plus />
              </Button>
            </div>
          </div>

          {/* Subtasks */}
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">
              서브태스크 ({card.subtasks.filter((s) => s.completed).length}/{card.subtasks.length})
            </label>
            <div className="grid gap-1">
              {card.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => handleToggleSubtask(subtask.id)}
                    aria-label={`서브태스크 ${subtask.title}`}
                  />
                  <span className={subtask.completed ? "line-through text-muted-foreground" : ""}>
                    {subtask.title}
                  </span>
                  <button
                    onClick={() => handleRemoveSubtask(subtask.id)}
                    aria-label={`서브태스크 ${subtask.title} 삭제`}
                    className="ml-auto"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              <Input
                placeholder="서브태스크 입력..."
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                aria-label="서브태스크 입력"
              />
              <Button variant="outline" size="sm" onClick={handleAddSubtask} aria-label="서브태스크 추가">
                <Plus />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
