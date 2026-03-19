# Coffee Finder 구현 계획

## Architecture Decisions

| 결정 사항 | 선택 | 사유 |
|-----------|------|------|
| 정렬 상태 관리 | `useState<'rating' \| 'distance' \| 'popularity'>` | 목업 앱, 새로고침 시 초기화 허용, 구조 단순화 |
| 데이터 소스 | `lib/coffee-data.ts` 정적 목업 모듈 | API 없음, 테스트에서 동일 데이터 import 가능 |
| 카드 스타일링 | 커스텀 `CoffeeCard` 컴포넌트 (shadcn Card 미사용) | Neo-Brutalism hard shadow/thick border는 CSS variable 조정만으론 불가, shadcn Card 기본 스타일 override 금지 규칙 준수 |
| 정렬 로직 | `useCoffeeSort` 커스텀 훅 | 정렬 상태 + 정렬된 배열 파생을 한 곳에서 관리, 단위 테스트 분리 가능 |

---

## Required Skills

| 스킬 | 용도 |
|------|------|
| `vercel-react-best-practices` | 컴포넌트 리렌더링 최적화, 파생 상태 패턴, 불변 정렬 |
| `web-design-guidelines` | 접근성(aria-pressed, aria-label), 색상 대비, 모바일 터치 타겟 |
| `shadcn` | Badge 컴포넌트 사용 규칙, 아이콘 사용 규칙 |

---

## UI Components

### 설치 필요

없음 — 기존 컴포넌트(`badge.tsx`, `button.tsx`)와 커스텀 컴포넌트로 구성

### 커스텀 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| `components/coffee-card.tsx` | Neo-Brutalism 카드 (이미지·가게명·평점·거리·메뉴·추천이유) |
| `components/sort-bar.tsx` | 정렬 버튼 3개 토글 바 (평점·거리·인기) |
| `components/nb-hero.tsx` | 반전 배경 앱 헤더 (COFFEE NOW + 위치) |
| `lib/coffee-data.ts` | 목업 데이터 배열 + `CafeItem` 타입 정의 |
| `hooks/use-coffee-sort.ts` | 정렬 상태 + 파생 정렬 배열 반환 훅 |

---

## 실행 프로토콜

- 각 task 시작 전, **참조 규칙**에 나열된 파일을 반드시 읽고 규칙을 준수하며 구현한다

---

## Tasks

### Task 1: 목업 데이터 모듈 생성

- **시나리오**: 선행 작업 (spec 테스트가 이 데이터를 import함)
- **참조 규칙**: `.claude/skills/vercel-react-best-practices/rules/js-tosorted-immutable.md`
- **구현 대상**: `lib/coffee-data.ts` — `CafeItem` 타입 + 5개 목업 카페 배열
- **수용 기준**:
  - [ ] `CafeItem` 타입에 `id`, `name`, `image`, `menuName`, `rating`, `reviewCount`, `distanceM`, `recommendation` 필드가 있다
  - [ ] 배열 내 첫 번째 항목의 `rating`이 `4.8`, `distanceM`이 `150`, `reviewCount`가 `1200`이다
  - [ ] 배열이 `as const` 또는 `readonly`로 선언되어 외부에서 변경 불가다
- **커밋**: `feat: add coffee-finder mock data module`

---

### Task 2: spec 테스트 생성

- **시나리오**: COFFEE-001, COFFEE-002, COFFEE-003, COFFEE-004, COFFEE-005
- **참조 규칙**: `artifacts/coffee-finder/spec.md`, `artifacts/spec.yaml`
- **구현 대상**: `__tests__/coffee-finder.spec.test.tsx` — spec.yaml 5개 시나리오를 수용 기준 테스트로 작성 (초기 실행 시 Red)
- **수용 기준**:
  - [ ] COFFEE-001: 페이지 렌더링 시 카드 5개 존재, 첫 카드 평점 "4.8"이 두 번째 "4.7"보다 앞에 위치
  - [ ] COFFEE-002: "평점 순" 버튼이 `aria-pressed="true"` 상태로 렌더링됨
  - [ ] COFFEE-003: "거리 순" 버튼 클릭 → 첫 카드 "150m", 마지막 카드 "800m"
  - [ ] COFFEE-004: "인기 순" 버튼 클릭 → 첫 카드 리뷰 "1,200", 마지막 카드 "300"
  - [ ] COFFEE-005: 첫 카드에 이미지·"아이스 아메리카노"·"4.8"·"150m"·"원두 직접 로스팅" 텍스트 모두 존재
  - [ ] `bun run test` 실행 시 5개 테스트 모두 Red(실패) 상태 확인
- **커밋**: `test: add coffee-finder spec tests (red)`

---

### Task 3: 정렬 훅 구현

- **시나리오**: COFFEE-002, COFFEE-003, COFFEE-004
- **참조 규칙**:
  - `.claude/skills/vercel-react-best-practices/rules/rerender-derived-state-no-effect.md`
  - `.claude/skills/vercel-react-best-practices/rules/js-tosorted-immutable.md`
  - `.claude/skills/vercel-react-best-practices/rules/rerender-derived-state.md`
- **구현 대상**: `hooks/use-coffee-sort.ts` + `__tests__/use-coffee-sort.test.ts`
- **수용 기준**:
  - [ ] `useCoffeeSort(cafes)` → `{ sort, setSort, sortedCafes }` 반환
  - [ ] 기본 `sort`가 `'rating'`이고 `sortedCafes[0].rating === 4.8`
  - [ ] `setSort('distance')` 후 `sortedCafes[0].distanceM === 150`, `sortedCafes[4].distanceM === 800`
  - [ ] `setSort('popularity')` 후 `sortedCafes[0].reviewCount === 1200`, `sortedCafes[4].reviewCount === 300`
  - [ ] `sortedCafes`는 원본 배열을 변경하지 않음 (`toSorted()` 사용)
  - [ ] `bun run test` 실행 시 훅 단위 테스트 Green
- **커밋**: `feat: add useCoffeeSort hook`

---

### Task 4: CoffeeCard 컴포넌트 구현

- **시나리오**: COFFEE-005
- **참조 규칙**:
  - `.claude/skills/vercel-react-best-practices/rules/rerender-no-inline-components.md`
  - `.claude/skills/shadcn/rules/composition.md`
  - `.claude/skills/shadcn/rules/styling.md`
  - `.claude/skills/shadcn/rules/icons.md`
- **구현 대상**: `components/coffee-card.tsx` + `__tests__/coffee-card.test.tsx`
- **수용 기준**:
  - [ ] `CafeItem` props를 받아 가게명·평점·거리·대표메뉴·추천이유를 렌더링
  - [ ] `activeSort?: 'rating' | 'distance' | 'popularity'` prop을 추가로 받아 정렬 상태에 따른 강조 렌더링 지원
  - [ ] 이미지 영역: `next/image`로 렌더링, `alt`에 가게명 포함
  - [ ] 평점 뱃지: `shadcn Badge` 컴포넌트 + lucide `Star` 아이콘
  - [ ] 리뷰 수: `activeSort === 'popularity'`일 때 반전 뱃지(`bg-foreground text-background`)로 렌더링, 그 외에는 보조 텍스트
  - [ ] 거리 태그: `activeSort === 'distance'`일 때 반전 뱃지로 렌더링, 그 외에는 기본 아웃라인
  - [ ] 메뉴 태그: `shadcn Badge` 컴포넌트
  - [ ] Neo-Brutalism 스타일: `border-[3px] border-foreground shadow-[6px_6px_0_theme(colors.border)]` CSS 클래스
  - [ ] 단위 테스트: `activeSort='popularity'` → 리뷰 수 반전 뱃지 렌더링, `activeSort='distance'` → 거리 태그 반전 렌더링 확인
- **커밋**: `feat: add CoffeeCard component`

---

### Task 5: SortBar 컴포넌트 구현

- **시나리오**: COFFEE-002, COFFEE-003, COFFEE-004
- **참조 규칙**:
  - `.claude/skills/vercel-react-best-practices/rules/rendering-conditional-render.md`
  - `.claude/skills/shadcn/rules/composition.md`
- **구현 대상**: `components/sort-bar.tsx` + `__tests__/sort-bar.test.tsx`
- **수용 기준**:
  - [ ] `sort`, `onSortChange` props를 받아 버튼 3개(평점 순·거리 순·인기 순) 렌더링
  - [ ] 활성 버튼에 `aria-pressed="true"`, 비활성 버튼에 `aria-pressed="false"` 설정
  - [ ] 활성 버튼은 반전 배경(`bg-foreground text-background`) 스타일 적용
  - [ ] 버튼 클릭 시 `onSortChange` 콜백 호출 — `sort` 값을 그대로 `CoffeeCard`의 `activeSort` prop으로 전달
  - [ ] 단위 테스트: `sort='distance'` prop → "거리 순" 버튼 `aria-pressed="true"` 확인
- **커밋**: `feat: add SortBar component`

---

### Task 6: NbHero 컴포넌트 구현

- **시나리오**: 선행 작업 (페이지 레이아웃)
- **참조 규칙**:
  - `.claude/skills/vercel-react-best-practices/rules/rendering-hoist-jsx.md`
  - `.claude/skills/shadcn/rules/icons.md`
- **구현 대상**: `components/nb-hero.tsx`
- **수용 기준**:
  - [ ] 반전 배경(`bg-foreground`) + "COFFEE NOW" 대형 텍스트
  - [ ] lucide `MapPin` 아이콘 + 위치 텍스트(props로 주입)
  - [ ] `border-[3px] border-foreground shadow-[6px_6px_0_theme(colors.border)]` 스타일
- **커밋**: `feat: add NbHero component`

---

### Task 7: 페이지 통합 및 전체 테스트 Green

- **시나리오**: COFFEE-001, COFFEE-002, COFFEE-003, COFFEE-004, COFFEE-005
- **참조 규칙**:
  - `.claude/skills/vercel-react-best-practices/rules/rerender-no-inline-components.md`
  - `.claude/skills/vercel-react-best-practices/rules/rendering-conditional-render.md`
  - `web-design-guidelines` (접근성 검토: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)
- **구현 대상**: `app/page.tsx` — `NbHero` + `SortBar` + `useCoffeeSort` + `CoffeeCard` 목록 조합
- **수용 기준**:
  - [ ] `bun run test` 실행 시 spec 테스트 5개(`coffee-finder.spec.test.tsx`) 모두 Green
  - [ ] 모바일(375px) 뷰에서 카드 1열, 데스크톱(1280px)에서 2열 그리드
  - [ ] 정렬 전환 시 카드 순서 변경 확인 (COFFEE-002, 003, 004 통과)
  - [ ] `<main>` 랜드마크 + 카드 목록에 `role="list"` 설정
- **커밋**: `feat: implement coffee-finder page`

---

## 미결정 사항

없음
