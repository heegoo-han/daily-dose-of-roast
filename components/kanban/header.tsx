"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useBoard } from "@/hooks/use-board";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { serializeBoard, deserializeBoard } from "@/lib/kanban-utils";
import { Moon, Sun, Download, Upload } from "lucide-react";

export function Header() {
  const { state, dispatch } = useBoard();
  const { isDark, toggle } = useDarkMode();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = serializeBoard(state);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kanban-board.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const board = deserializeBoard(text);
      if (board) {
        dispatch({ type: "SET_BOARD", payload: { cards: board.cards } });
      } else {
        alert("올바른 JSON 파일이 아닙니다");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-xl font-bold">Kanban Board</h1>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleExport} aria-label="내보내기">
          <Download />
          내보내기
        </Button>
        <Button variant="outline" size="sm" onClick={handleImport} aria-label="가져오기">
          <Upload />
          가져오기
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
          data-testid="file-input"
        />
        <Button variant="outline" size="icon" onClick={toggle} aria-label="다크모드 토글">
          {isDark ? <Sun /> : <Moon />}
        </Button>
      </div>
    </header>
  );
}
