export type SortKey = "rating" | "distance" | "popularity"

export type CafeItem = {
  id: string
  name: string
  image: string
  menuName: string
  rating: number
  reviewCount: number
  distanceM: number
  recommendation: string
}

export const CAFES: readonly CafeItem[] = [
  {
    id: "always-bagel",
    name: "올웨이즈 베이글",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop&auto=format",
    menuName: "시금치 리코타 베이글",
    rating: 4.6,
    reviewCount: 312,
    distanceM: 350,
    recommendation: "천연발효종 베이글, 방부제 무첨가 건강한 맛",
  },
  {
    id: "teehev",
    name: "떼헤브",
    image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&h=300&fit=crop&auto=format",
    menuName: "까눌레",
    rating: 4.2,
    reviewCount: 43,
    distanceM: 800,
    recommendation: "르꼬르동블루 출신 파티셰의 정통 프랑스 디저트",
  },
  {
    id: "starbucks-reserve-magok",
    name: "스타벅스 리저브 마곡",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400&h=300&fit=crop&auto=format",
    menuName: "오트 콜드 브루",
    rating: 4.1,
    reviewCount: 847,
    distanceM: 600,
    recommendation: "강서구 유일 리저브 매장, 넓은 2층 좌석 업무 미팅 최적",
  },
  {
    id: "cafe-woodjin",
    name: "카페 우드진",
    image: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=300&fit=crop&auto=format",
    menuName: "우디슈페너",
    rating: 4.1,
    reviewCount: 156,
    distanceM: 500,
    recommendation: "캠핑 감성 야외 테라스, 오피스 상권 속 힐링 공간",
  },
  {
    id: "blctd-magok",
    name: "BLCTD 마곡",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=300&fit=crop&auto=format",
    menuName: "베리굿!커피",
    rating: 4.1,
    reviewCount: 89,
    distanceM: 650,
    recommendation: "티라미슈·바나나푸딩 시그니처 디저트와 커피를 함께",
  },
]
