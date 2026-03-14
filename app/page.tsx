import { BoardProvider } from "@/hooks/use-board";
import { Board } from "@/components/kanban/board";

export default function Page() {
  return (
    <BoardProvider>
      <Board />
    </BoardProvider>
  );
}
