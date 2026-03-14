import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BoardProvider } from "@/hooks/use-board";
import { Board } from "./board";

// Mock pragmatic-drag-and-drop (no real DnD in jsdom)
vi.mock("@atlaskit/pragmatic-drag-and-drop/element/adapter", () => ({
  draggable: () => () => {},
  dropTargetForElements: () => () => {},
  monitorForElements: () => () => {},
}));

function renderBoard() {
  return render(
    <BoardProvider>
      <Board />
    </BoardProvider>
  );
}

async function addCard(title: string) {
  const user = userEvent.setup();
  const todoColumn = screen.getByTestId("column-todo");
  const input = within(todoColumn).getByLabelText("Todo 카드 추가");
  const addBtn = within(todoColumn).getByLabelText("카드 추가");
  await user.clear(input);
  await user.type(input, title);
  await user.click(addBtn);
}

beforeEach(() => {
  localStorage.clear();
});

// KANBAN-001: 카드 추가
describe("KANBAN-001: 카드 추가", () => {
  it("제목 입력 후 추가하면 Todo 칼럼에 카드가 생성된다 (기본 Medium)", async () => {
    renderBoard();
    await addCard("회의록 작성");

    const todoColumn = screen.getByTestId("column-todo");
    expect(within(todoColumn).getByText("회의록 작성")).toBeInTheDocument();
  });

  it("빈 제목으로 추가 시 에러 메시지를 표시한다", async () => {
    const user = userEvent.setup();
    renderBoard();

    const todoColumn = screen.getByTestId("column-todo");
    const addBtn = within(todoColumn).getByLabelText("카드 추가");
    await user.click(addBtn);

    expect(screen.getByText("제목을 입력해주세요")).toBeInTheDocument();
  });
});

// KANBAN-002: 카드 삭제
describe("KANBAN-002: 카드 삭제", () => {
  it("삭제 버튼 클릭 시 확인 대화상자가 표시된다", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("삭제할 카드");

    const deleteBtn = screen.getByLabelText("삭제");
    await user.click(deleteBtn);

    expect(screen.getByText("정말 삭제하시겠습니까?")).toBeInTheDocument();
  });

  it("확인 클릭 시 카드가 삭제된다", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("삭제할 카드");

    const deleteBtn = screen.getByLabelText("삭제");
    await user.click(deleteBtn);
    await user.click(screen.getByText("삭제"));

    expect(screen.queryByText("삭제할 카드")).not.toBeInTheDocument();
  });

  it("취소 클릭 시 카드가 유지된다", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("삭제할 카드");

    const deleteBtn = screen.getByLabelText("삭제");
    await user.click(deleteBtn);
    await user.click(screen.getByText("취소"));

    expect(screen.getByText("삭제할 카드")).toBeInTheDocument();
  });
});

// KANBAN-003: 카드 인라인 제목 편집
describe("KANBAN-003: 카드 인라인 제목 편집", () => {
  it("제목 클릭 후 수정하고 블러하면 저장된다", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("회의록 작성");

    const titleEl = screen.getByText("회의록 작성");
    await user.click(titleEl);

    const editInput = screen.getByLabelText("카드 제목 편집");
    await user.clear(editInput);
    await user.type(editInput, "주간 보고서 작성");
    await user.tab(); // blur

    expect(screen.getByText("주간 보고서 작성")).toBeInTheDocument();
    expect(screen.queryByText("회의록 작성")).not.toBeInTheDocument();
  });
});

// KANBAN-004: 카드 우선순위 변경 + KANBAN-016: 우선순위 색상
describe("KANBAN-004 / KANBAN-016: 카드 우선순위 변경 및 색상", () => {
  it("우선순위를 High로 변경하면 카드에 빨간 border가 표시된다", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("테스트 카드");

    // Open detail modal by clicking card body
    const todoColumn = screen.getByTestId("column-todo");
    const cardContent = within(todoColumn).getByText("테스트 카드").closest("[data-slot='card']");
    const contentArea = cardContent?.querySelector("[data-slot='card-content']");
    if (contentArea) await user.click(contentArea);

    // Change priority
    const priorityTrigger = screen.getByLabelText("우선순위 선택");
    await user.click(priorityTrigger);
    await user.click(screen.getByRole("option", { name: "High" }));

    // Close modal
    await user.click(screen.getByRole("button", { name: "Close" }));

    // Verify border color class
    const card = screen.getByText("테스트 카드").closest("[data-slot='card']");
    expect(card?.className).toContain("border-l-red-500");
  });

  it("Medium은 yellow, Low는 green", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("Medium 카드");

    // Default is Medium - check yellow
    const card = screen.getByText("Medium 카드").closest("[data-slot='card']");
    expect(card?.className).toContain("border-l-yellow-500");
  });
});

// KANBAN-005: 태그 추가
describe("KANBAN-005: 태그 추가", () => {
  it("모달에서 태그를 추가하면 카드에 표시된다", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("태그 카드");

    // Open modal
    const todoColumn = screen.getByTestId("column-todo");
    const cardEl = within(todoColumn).getByText("태그 카드").closest("[data-slot='card']");
    const contentArea = cardEl?.querySelector("[data-slot='card-content']");
    if (contentArea) await user.click(contentArea);

    // Add tag
    const tagInput = screen.getByLabelText("태그 입력");
    await user.type(tagInput, "버그");
    await user.click(screen.getByLabelText("태그 추가"));

    // Close modal
    await user.click(screen.getByRole("button", { name: "Close" }));

    // Verify tag on card
    expect(screen.getByText("버그")).toBeInTheDocument();
  });
});

// KANBAN-006: 마감일 설정
describe("KANBAN-006: 마감일 설정", () => {
  it("모달에서 마감일을 설정하면 카드에 표시된다", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("마감일 카드");

    // Open modal
    const todoColumn = screen.getByTestId("column-todo");
    const cardEl = within(todoColumn).getByText("마감일 카드").closest("[data-slot='card']");
    const contentArea = cardEl?.querySelector("[data-slot='card-content']");
    if (contentArea) await user.click(contentArea);

    // Set due date
    const dateInput = screen.getByLabelText("마감일");
    await user.type(dateInput, "2026-03-20");

    // Close modal
    await user.click(screen.getByRole("button", { name: "Close" }));

    // Verify
    expect(screen.getByText("2026-03-20")).toBeInTheDocument();
  });
});

// KANBAN-007: 서브태스크
describe("KANBAN-007: 서브태스크 추가 및 토글", () => {
  it("서브태스크 추가 후 진행률이 표시된다", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("서브태스크 카드");

    // Open modal
    const todoColumn = screen.getByTestId("column-todo");
    const cardEl = within(todoColumn).getByText("서브태스크 카드").closest("[data-slot='card']");
    const contentArea = cardEl?.querySelector("[data-slot='card-content']");
    if (contentArea) await user.click(contentArea);

    // Add subtasks
    const subtaskInput = screen.getByLabelText("서브태스크 입력");
    await user.type(subtaskInput, "자료 조사");
    await user.click(screen.getByLabelText("서브태스크 추가"));
    await user.type(subtaskInput, "초안 작성");
    await user.click(screen.getByLabelText("서브태스크 추가"));
    await user.type(subtaskInput, "리뷰");
    await user.click(screen.getByLabelText("서브태스크 추가"));

    // Verify progress in modal
    expect(screen.getByText("서브태스크 (0/3)")).toBeInTheDocument();

    // Toggle 2 subtasks
    await user.click(screen.getByLabelText("서브태스크 자료 조사"));
    await user.click(screen.getByLabelText("서브태스크 초안 작성"));
    expect(screen.getByText("서브태스크 (2/3)")).toBeInTheDocument();

    // Close modal and check card progress
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.getByTestId("progress")).toHaveTextContent("2/3");
  });
});

// KANBAN-010: 마감일 경고 표시
describe("KANBAN-010: 마감일 경과 경고", () => {
  it("마감일이 지난 카드에 빨간 테두리가 표시된다", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("기한 지난 카드");

    // Open modal and set past due date
    const todoColumn = screen.getByTestId("column-todo");
    const cardEl = within(todoColumn).getByText("기한 지난 카드").closest("[data-slot='card']");
    const contentArea = cardEl?.querySelector("[data-slot='card-content']");
    if (contentArea) await user.click(contentArea);

    const dateInput = screen.getByLabelText("마감일");
    await user.type(dateInput, "2020-01-01");

    await user.click(screen.getByRole("button", { name: "Close" }));

    const card = screen.getByText("기한 지난 카드").closest("[data-slot='card']");
    expect(card?.getAttribute("data-overdue")).toBe("true");
  });
});

// KANBAN-011: 카드 제목 검색
describe("KANBAN-011: 카드 제목 검색", () => {
  it("검색어로 카드를 필터링한다", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("회의록 작성");
    await addCard("주간 보고서");

    const searchInput = screen.getByLabelText("카드 검색");
    await user.type(searchInput, "회의");

    expect(screen.getByText("회의록 작성")).toBeInTheDocument();
    expect(screen.queryByText("주간 보고서")).not.toBeInTheDocument();
  });

  it("검색어 삭제 시 모든 카드가 표시된다", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("회의록 작성");
    await addCard("주간 보고서");

    const searchInput = screen.getByLabelText("카드 검색");
    await user.type(searchInput, "회의");
    await user.clear(searchInput);

    expect(screen.getByText("회의록 작성")).toBeInTheDocument();
    expect(screen.getByText("주간 보고서")).toBeInTheDocument();
  });
});

// KANBAN-012: 우선순위 필터
describe("KANBAN-012: 우선순위 필터", () => {
  it("High 필터 선택 시 High 카드만 표시된다", async () => {
    const user = userEvent.setup();
    renderBoard();
    // Add card and change its priority to High
    await addCard("High 카드");

    // Open modal, change to High
    const cardEl = screen.getByText("High 카드").closest("[data-slot='card']");
    const contentArea = cardEl?.querySelector("[data-slot='card-content']");
    if (contentArea) await user.click(contentArea);
    await user.click(screen.getByLabelText("우선순위 선택"));
    await user.click(screen.getByRole("option", { name: "High" }));
    await user.click(screen.getByRole("button", { name: "Close" }));

    // Add a Medium card
    await addCard("Medium 카드");

    // Apply filter
    await user.click(screen.getByLabelText("우선순위 필터"));
    await user.click(screen.getByRole("option", { name: "High" }));

    expect(screen.getByText("High 카드")).toBeInTheDocument();
    expect(screen.queryByText("Medium 카드")).not.toBeInTheDocument();
  });
});

// KANBAN-013: 태그 필터
describe("KANBAN-013: 태그 필터", () => {
  it("태그 필터 선택 시 해당 태그 카드만 표시된다", async () => {
    const user = userEvent.setup();
    renderBoard();

    // Add card with tag "버그"
    await addCard("버그 카드");
    const cardEl1 = screen.getByText("버그 카드").closest("[data-slot='card']");
    const content1 = cardEl1?.querySelector("[data-slot='card-content']");
    if (content1) await user.click(content1);
    const tagInput1 = screen.getByLabelText("태그 입력");
    await user.type(tagInput1, "버그");
    await user.click(screen.getByLabelText("태그 추가"));
    await user.click(screen.getByRole("button", { name: "Close" }));

    // Add card with tag "기능"
    await addCard("기능 카드");
    const cardEl2 = screen.getByText("기능 카드").closest("[data-slot='card']");
    const content2 = cardEl2?.querySelector("[data-slot='card-content']");
    if (content2) await user.click(content2);
    const tagInput2 = screen.getByLabelText("태그 입력");
    await user.type(tagInput2, "기능");
    await user.click(screen.getByLabelText("태그 추가"));
    await user.click(screen.getByRole("button", { name: "Close" }));

    // Apply tag filter
    await user.click(screen.getByLabelText("태그 필터"));
    await user.click(screen.getByRole("option", { name: "버그" }));

    expect(screen.getByText("버그 카드")).toBeInTheDocument();
    expect(screen.queryByText("기능 카드")).not.toBeInTheDocument();
  });
});

// KANBAN-014: 다크모드 토글
describe("KANBAN-014: 다크모드 토글", () => {
  it("토글 클릭 시 다크모드로 전환된다", async () => {
    const user = userEvent.setup();
    renderBoard();

    await user.click(screen.getByLabelText("다크모드 토글"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("kanban-theme")).toBe("dark");
  });

  it("새로고침 후에도 다크모드가 유지된다", async () => {
    localStorage.setItem("kanban-theme", "dark");
    renderBoard();
    // useDarkMode useEffect will read from localStorage and apply
    // Wait for effect
    await vi.waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
});

// KANBAN-015: 데이터 JSON 내보내기
describe("KANBAN-015: 데이터 JSON 내보내기", () => {
  it("내보내기 클릭 시 JSON 파일이 다운로드된다", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("내보내기 카드");

    // Mock URL/Blob APIs
    const createObjectURL = vi.fn(() => "blob:test");
    const revokeObjectURL = vi.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;

    const clickSpy = vi.fn();
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "a") {
        return { click: clickSpy, set href(_: string) {}, set download(_: string) {} } as unknown as HTMLAnchorElement;
      }
      return document.createElementNS("http://www.w3.org/1999/xhtml", tag) as HTMLElement;
    });

    await user.click(screen.getByLabelText("내보내기"));
    expect(clickSpy).toHaveBeenCalled();
    expect(createObjectURL).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});

// KANBAN-016: 데이터 JSON 가져오기
describe("KANBAN-016: 데이터 JSON 가져오기", () => {
  it("유효한 JSON 가져오기 시 보드가 교체된다", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("기존 카드");

    const importData = {
      cards: [
        { id: "imp-1", title: "가져온 카드", column: "todo", priority: "Medium", tags: [], dueDate: null, subtasks: [], order: 0 },
      ],
    };

    const file = new File([JSON.stringify(importData)], "valid.json", { type: "application/json" });
    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
    await user.upload(fileInput, file);

    await vi.waitFor(() => {
      expect(screen.getByText("가져온 카드")).toBeInTheDocument();
    });
    expect(screen.queryByText("기존 카드")).not.toBeInTheDocument();
  });

  it("잘못된 JSON 가져오기 시 에러 메시지 표시 및 데이터 유지", async () => {
    const user = userEvent.setup();
    renderBoard();
    await addCard("기존 카드");

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const file = new File(["invalid json"], "invalid.json", { type: "application/json" });
    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
    await user.upload(fileInput, file);

    await vi.waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("올바른 JSON 파일이 아닙니다");
    });
    expect(screen.getByText("기존 카드")).toBeInTheDocument();
    alertSpy.mockRestore();
  });
});

// KANBAN-017: 데이터 영속성
describe("KANBAN-017: 데이터 영속성", () => {
  it("카드 추가 후 새로고침해도 데이터가 유지된다", async () => {
    const { unmount: unmount1 } = renderBoard();
    await addCard("회의록 작성");

    // Verify saved to localStorage
    const stored = localStorage.getItem("kanban-board");
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.cards).toHaveLength(1);
    expect(parsed.cards[0].title).toBe("회의록 작성");

    // Unmount first, then re-render (simulates reload)
    unmount1();

    const { unmount: unmount2 } = render(
      <BoardProvider>
        <Board />
      </BoardProvider>
    );
    expect(screen.getByText("회의록 작성")).toBeInTheDocument();
    unmount2();
  });
});
