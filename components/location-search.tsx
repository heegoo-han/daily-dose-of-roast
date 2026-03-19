"use client"

import { useState } from "react"
import { Search, Loader2, MapPinOff, TriangleAlert } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CafeDataStatus } from "@/hooks/use-cafe-data"

interface LocationSearchProps {
  onSearch: (query: string) => Promise<void>
  status: CafeDataStatus
}

const STATUS_MESSAGES: Partial<Record<CafeDataStatus, { icon: React.ReactNode; text: string }>> = {
  denied: {
    icon: <MapPinOff className="size-3.5" />,
    text: "위치 권한이 없어 샘플 데이터를 표시합니다",
  },
  "not-found": {
    icon: <TriangleAlert className="size-3.5" />,
    text: "위치를 찾을 수 없습니다. 다시 입력해 주세요",
  },
  error: {
    icon: <TriangleAlert className="size-3.5" />,
    text: "카페 정보를 불러오지 못했습니다",
  },
}

export function LocationSearch({ onSearch, status }: LocationSearchProps) {
  const [value, setValue] = useState("")
  const isSearching = status === "searching"
  const message = STATUS_MESSAGES[status]

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!value.trim() || isSearching) return
    await onSearch(value.trim())
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="위치 검색 (예: 홍대, 강남역, 부산 서면)"
            className="pl-9"
            disabled={isSearching}
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={isSearching || !value.trim()}
          className="shrink-0"
        >
          {isSearching ? (
            <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
          ) : (
            <Search className="size-4" data-icon="inline-start" />
          )}
          {isSearching ? "검색 중" : "검색"}
        </Button>
      </form>

      {message && (
        <p
          className={cn(
            "flex items-center gap-1.5 text-xs",
            status === "denied" || status === "error" || status === "not-found"
              ? "text-muted-foreground"
              : "text-foreground"
          )}
        >
          {message.icon}
          {message.text}
        </p>
      )}
    </div>
  )
}
