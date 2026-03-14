"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Priority } from "@/lib/kanban-types";

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  priorityFilter: Priority | "all";
  onPriorityFilterChange: (value: Priority | "all") => void;
  tagFilter: string;
  onTagFilterChange: (value: string) => void;
  availableTags: string[];
}

export function Toolbar({
  search,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  tagFilter,
  onTagFilterChange,
  availableTags,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        placeholder="카드 검색..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="카드 검색"
        className="w-60"
      />
      <Select value={priorityFilter} onValueChange={(v) => onPriorityFilterChange(v as Priority | "all")}>
        <SelectTrigger aria-label="우선순위 필터">
          <SelectValue placeholder="우선순위" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 우선순위</SelectItem>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
        </SelectContent>
      </Select>
      <Select value={tagFilter} onValueChange={onTagFilterChange}>
        <SelectTrigger aria-label="태그 필터">
          <SelectValue placeholder="태그" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 태그</SelectItem>
          {availableTags.map((tag) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
