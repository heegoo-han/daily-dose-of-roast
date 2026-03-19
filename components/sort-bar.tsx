import { Star, Navigation, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SortKey } from "@/lib/coffee-data"

const SORT_OPTIONS: { key: SortKey; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "rating", label: "평점 순", Icon: Star },
  { key: "distance", label: "거리 순", Icon: Navigation },
  { key: "popularity", label: "인기 순", Icon: Flame },
]

type SortBarProps = {
  sort: SortKey
  onSortChange: (sort: SortKey) => void
}

export function SortBar({ sort, onSortChange }: SortBarProps) {
  return (
    <div className="flex gap-2" role="group" aria-label="정렬 기준">
      {SORT_OPTIONS.map(({ key, label, Icon }) => {
        const isActive = sort === key
        return (
          <Button
            key={key}
            variant="outline"
            size="sm"
            aria-pressed={isActive}
            onClick={() => onSortChange(key)}
            className={cn(
              "border-[2px] border-foreground font-bold uppercase tracking-wide text-[11px]",
              isActive
                ? "bg-foreground text-background hover:bg-foreground hover:text-background"
                : "bg-background text-foreground"
            )}
          >
            <Icon className="size-3" />
            {label}
          </Button>
        )
      })}
    </div>
  )
}
