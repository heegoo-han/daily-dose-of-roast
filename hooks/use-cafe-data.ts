"use client"

import { useCallback, useEffect, useState } from "react"
import type { CafeItem } from "@/lib/coffee-data"
import { CAFES } from "@/lib/coffee-data"
import { fetchNearbyCafes, geocodeAddress, reverseGeocode } from "@/lib/overpass"

export type LocationInfo = {
  location: string
  locationDetail: string
}

export type CafeDataStatus = "idle" | "success" | "error" | "denied" | "searching" | "not-found"

export type CafeDataState = {
  cafes: readonly CafeItem[]
  locationInfo: LocationInfo
  status: CafeDataStatus
  searchByAddress: (query: string) => Promise<void>
}

const DEFAULT_LOCATION: LocationInfo = {
  location: "마곡동",
  locationDetail: "서울 강서구",
}

export function useCafeData(): CafeDataState {
  const [cafes, setCafes] = useState<readonly CafeItem[]>(CAFES)
  const [locationInfo, setLocationInfo] = useState<LocationInfo>(DEFAULT_LOCATION)
  const [status, setStatus] = useState<CafeDataStatus>("idle")

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lon } }) => {
        try {
          const [fetched, loc] = await Promise.all([
            fetchNearbyCafes(lat, lon),
            reverseGeocode(lat, lon),
          ])
          setCafes(fetched.length > 0 ? fetched : CAFES)
          setLocationInfo(loc)
          setStatus("success")
        } catch {
          setStatus("error")
        }
      },
      () => setStatus("denied")
    )
  }, [])

  const searchByAddress = useCallback(async (query: string) => {
    if (!query.trim()) return
    setStatus("searching")
    try {
      const coords = await geocodeAddress(query.trim())
      if (!coords) {
        setStatus("not-found")
        return
      }
      const [fetched, loc] = await Promise.all([
        fetchNearbyCafes(coords.lat, coords.lon),
        reverseGeocode(coords.lat, coords.lon),
      ])
      setCafes(fetched.length > 0 ? fetched : CAFES)
      setLocationInfo(loc)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }, [])

  return { cafes, locationInfo, status, searchByAddress }
}
