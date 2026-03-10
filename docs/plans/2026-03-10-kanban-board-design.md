# Kanban Board Design

## Overview

Trello 스타일의 칸반 Todo 앱. 단일 페이지(`/`)에서 3개 고정 칼럼(Todo, In Progress, Done) 보드를 제공한다.

## 기술 스택

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui (기존 컴포넌트 활용)
- `@atlaskit/pragmatic-drag-and-drop` (드래그 앤 드롭)
- `useReducer` + Context (상태 관리)
- localStorage (데이터 유지)
- Vitest + React Testing Library (테스트)

## 데이터 모델

```typescript
type Priority = "high" | "medium" | "low"
type ColumnId = "todo" | "in-progress" | "done"

interface Card {
  id: string           // crypto.randomUUID()
  title: string
  priority: Priority
  tags: string[]
  columnId: ColumnId
  order: number        // 칼럼 내 정렬 순서
  createdAt: number    // timestamp
}

interface BoardState {
  cards: Card[]
  searchQuery: string
  priorityFilter: Priority | null
  tagFilter: string | null
  darkMode: boolean
}
```

## 상태 관리

- `useReducer`로 `BoardState`를 관리하는 `BoardContext` 하나
- 리듀서 액션: `ADD_CARD`, `DELETE_CARD`, `UPDATE_CARD`, `MOVE_CARD`, `REORDER_CARD`, `SET_SEARCH`, `SET_PRIORITY_FILTER`, `SET_TAG_FILTER`, `TOGGLE_DARK_MODE`
- `cards` 배열을 flat하게 관리, 칼럼별 카드는 `columnId` 필터 + `order` 정렬로 파생
- localStorage 동기화는 `useEffect`에서 처리

## 컴포넌트 구조

```
app/page.tsx (서버 컴포넌트)
│
└─ KanbanBoard (클라이언트, BoardProvider 래핑)
   ├─ BoardHeader
   │   ├─ 검색 Input
   │   ├─ 우선순위 필터 Select
   │   ├─ 태그 필터 Select
   │   ├─ 다크모드 토글 Button
   │   └─ "+ 카드 추가" Button → CardFormModal
   │
   ├─ ColumnList (가로 flex)
   │   └─ Column × 3
   │       ├─ 칼럼 헤더 (이름 + 카드 수)
   │       └─ CardList (드롭 영역)
   │           └─ CardItem × N (드래그 가능)
   │               ├─ 제목
   │               ├─ 우선순위 Badge
   │               └─ 태그 Badge[]
   │
   └─ CardFormModal (추가/편집 공용)
       ├─ 제목 Input (필수)
       ├─ 우선순위 Select
       ├─ 태그 Input (자유 입력 + 자동완성)
       └─ 저장/삭제/취소 Button
```

### 주요 결정사항

- `CardFormModal`은 추가와 편집 공용 (카드 ID 유무로 구분)
- 새 카드는 항상 Todo 칼럼에 추가 (모달에서 칼럼 선택 없음)
- 기존 shadcn/ui 활용: `Button`, `Input`, `Select`, `Badge`, `Card`, `AlertDialog`
- 우선순위 색상: High=빨강, Medium=노랑, Low=초록

## 드래그 앤 드롭

### `@atlaskit/pragmatic-drag-and-drop` 적용

- **CardItem**: `draggable()` — 드래그 소스
- **CardList**: `dropTargetForElements()` — 칼럼을 드롭 타겟
- **CardItem**: `dropTargetForElements()` — 칼럼 내 순서 재배치, `closestEdge`로 삽입 위치 판별

### 동작 흐름

1. 드래그 시작 → 카드 opacity 감소
2. 호버 → 드롭 인디케이터 (삽입 위치 라인)
3. 드롭 → `MOVE_CARD` 또는 `REORDER_CARD` 디스패치
4. `order` 값 재계산

### 빈 칼럼 처리

- 카드가 없는 칼럼에도 드롭 가능하도록 칼럼 자체가 드롭 타겟

## 검색 & 필터

- `searchQuery`: 대소문자 무시 부분 매칭
- `priorityFilter`, `tagFilter`: 독립 적용, 모두 설정 시 AND 조건
- 필터링은 `useMemo`로 파생값 계산, 원본 `cards` 불변
- 필터 적용 시 해당하지 않는 카드 숨김, 칼럼은 항상 표시

## 다크모드

- `<html>`에 `dark` 클래스 토글, Tailwind `dark:` 유틸리티 활용
- localStorage 별도 키(`kanban-dark-mode`)로 저장하여 초기 로딩 깜빡임 방지

## 데이터 유지

- `kanban-board`: 카드 데이터
- `kanban-dark-mode`: 다크모드 설정
- 저장: 디스패치 후 `useEffect`에서 저장
- 로딩: `BoardProvider` 초기화 시 localStorage에서 읽기
- localStorage 비어있으면 빈 보드로 시작
