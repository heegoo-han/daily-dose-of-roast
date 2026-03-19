"use client"

import { useEffect, useState } from "react"
import type { CafeItem } from "@/lib/coffee-data"
import { CAFES } from "@/lib/coffee-data"
import { fetchNearbyCafes, reverseGeocode } from "@/lib/overpass"

export type LocationInfo = {
  location: string
  locationDetail: string
}

export type CafeDataStatus = "idle" | "success" | "error" | "denied"

export type CafeDataState = {
  cafes: readonly CafeItem[]
  locationInfo: LocationInfo
  status: CafeDataStatus
}

const DEFAULT_LOCATION: LocationInfo = {
  location: "마곡동",
  locationDetail: "서울 강서구",
}

export function useCafeData(): CafeDataState {
  const [state, setState] = useState<CafeDataState>({
    cafes: CAFES,
    locationInfo: DEFAULT_LOCATION,
    status: "idle",
  })

  useEffect(() => {
    // jsdom(테스트) 또는 미지원 브라우저 → CAFES 폴백 유지
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lon } }) => {
        try {
          const [cafes, locationInfo] = await Promise.all([
            fetchNearbyCafes(lat, lon),
            reverseGeocode(lat, lon),
          ])
          setState({
            cafes: cafes.length > 0 ? cafes : CAFES,
            locationInfo,
            status: "success",
          })
        } catch {
          setState((s) => ({ ...s, status: "error" }))
        }
      },
      () => setState((s) => ({ ...s, status: "denied" }))
    )
  }, [])

  return state
}
