export const MOCK_RATINGS = [4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8]

export const MOCK_REVIEW_COUNTS = [43, 89, 124, 156, 231, 312, 445, 567, 720, 847]

export const MOCK_MENUS = [
  "아이스 아메리카노",
  "카페 라떼",
  "콜드브루",
  "플랫화이트",
  "카푸치노",
  "바닐라 라떼",
  "에스프레소",
  "더치커피",
  "오트 라떼",
  "시그니처 블렌드",
]

export const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=400&h=300&fit=crop&auto=format",
]

export const MOCK_RECOMMENDATIONS = [
  "조용한 분위기, 작업하기 좋은 공간",
  "넓은 좌석, 업무 미팅 최적",
  "오픈 테라스, 야외 좌석 있음",
  "스페셜티 원두 직접 로스팅",
  "디저트와 함께 즐기기 좋은 카페",
  "아늑한 인테리어, 오래 머물기 좋음",
  "빠른 서비스, 테이크아웃 특화",
  "현지 단골이 많은 동네 카페",
  "핸드드립 전문, 원두 선택 가능",
  "루프탑 뷰, 사진 명소",
]

export function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length]
}
