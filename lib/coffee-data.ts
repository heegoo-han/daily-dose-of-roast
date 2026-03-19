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
    id: "bluebottle-hongdae",
    name: "블루보틀 홍대",
    image: "/images/cafes/bluebottle.jpg",
    menuName: "아이스 아메리카노",
    rating: 4.8,
    reviewCount: 1200,
    distanceM: 150,
    recommendation: "원두 직접 로스팅, 산미 없는 진한 맛",
  },
  {
    id: "starbucks-yeonnam",
    name: "스타벅스 연남",
    image: "/images/cafes/starbucks.jpg",
    menuName: "카페 라떼",
    rating: 4.7,
    reviewCount: 980,
    distanceM: 350,
    recommendation: "편안한 분위기, 넓은 좌석 다수",
  },
  {
    id: "fritz-coffee",
    name: "프릳츠 커피",
    image: "/images/cafes/fritz.jpg",
    menuName: "에스프레소",
    rating: 4.6,
    reviewCount: 756,
    distanceM: 520,
    recommendation: "스페셜티 원두, 독특한 플로럴 풍미",
  },
  {
    id: "intelligentsia",
    name: "인텔리전시아",
    image: "/images/cafes/intelligentsia.jpg",
    menuName: "플랫 화이트",
    rating: 4.5,
    reviewCount: 432,
    distanceM: 680,
    recommendation: "다양한 브루잉 방식, 매일 신선 입고",
  },
  {
    id: "coffee-libre",
    name: "커피리브레",
    image: "/images/cafes/libre.jpg",
    menuName: "드립 커피",
    rating: 4.3,
    reviewCount: 300,
    distanceM: 800,
    recommendation: "직수입 원두, 계절별 한정 메뉴 운영",
  },
]
