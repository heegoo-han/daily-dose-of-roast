import type { CafeItem } from "./coffee-data"
import { pick, MOCK_RATINGS, MOCK_REVIEW_COUNTS, MOCK_MENUS, MOCK_IMAGES, MOCK_RECOMMENDATIONS } from "./mock-pool"

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

interface OverpassElement {
  id: number
  lat: number
  lon: number
  tags: Record<string, string>
}

export async function fetchNearbyCafes(
  lat: number,
  lon: number,
  radiusM = 600
): Promise<CafeItem[]> {
  const query = `[out:json][timeout:15];node["amenity"="cafe"](around:${radiusM},${lat},${lon});out body;`
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

  const res = await fetch(url)
  if (!res.ok) throw new Error("Overpass API 오류")

  const data = await res.json()
  const elements: OverpassElement[] = data.elements ?? []

  return elements
    .filter((el) => el.tags?.name)
    .slice(0, 8)
    .map((el) => {
      const seed = el.id % 97
      return {
        id: String(el.id),
        name: el.tags.name,
        distanceM: haversine(lat, lon, el.lat, el.lon),
        rating: pick(MOCK_RATINGS, seed),
        reviewCount: pick(MOCK_REVIEW_COUNTS, seed + 1),
        menuName: pick(MOCK_MENUS, seed + 2),
        image: pick(MOCK_IMAGES, seed + 3),
        recommendation: pick(MOCK_RECOMMENDATIONS, seed + 4),
      }
    })
}

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<{ location: string; locationDetail: string }> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ko`
  const res = await fetch(url, {
    headers: { "User-Agent": "coffee-finder-app/1.0" },
  })
  if (!res.ok) throw new Error("Nominatim 오류")

  const data = await res.json()
  const addr = data.address ?? {}
  const location =
    addr.suburb ?? addr.neighbourhood ?? addr.quarter ?? addr.village ?? "현재 위치"
  const locationDetail =
    addr.city_district ?? addr.county ?? addr.city ?? ""

  return { location, locationDetail }
}
