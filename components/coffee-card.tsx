import Image from "next/image"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CafeItem, SortKey } from "@/lib/coffee-data"

type CoffeeCardProps = CafeItem & {
  activeSort?: SortKey
}

export function CoffeeCard({
  name,
  image,
  menuName,
  rating,
  reviewCount,
  distanceM,
  recommendation,
  activeSort,
}: CoffeeCardProps) {
  const distanceLabel = distanceM >= 1000 ? `${(distanceM / 1000).toFixed(1)}km` : `${distanceM}m`
  const reviewLabel = reviewCount.toLocaleString()

  return (
    <li className="flex border-[3px] border-foreground bg-background shadow-[6px_6px_0_hsl(var(--border))] overflow-hidden min-h-[140px]">
      {/* 이미지 */}
      <div className="relative shrink-0 w-[120px] border-r-[3px] border-foreground bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="120px"
          onError={undefined}
        />
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col justify-between p-3">
        <div className="flex flex-col gap-2">
          {/* 가게명 + 거리 */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-black uppercase tracking-tight leading-tight">
              {name}
            </span>
            <Badge
              data-testid="distance"
              variant={activeSort === "distance" ? "default" : "outline"}
              className={cn(
                "shrink-0 border-[2px] border-foreground font-bold uppercase tracking-widest text-[10px]",
                activeSort === "distance" && "bg-foreground text-background"
              )}
            >
              {distanceLabel}
            </Badge>
          </div>

          {/* 평점 + 리뷰 수 + 메뉴 */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className="border-[2px] border-foreground font-black text-[13px] gap-1 px-2"
            >
              <Star className="size-3 fill-foreground" />
              <span data-testid="rating">{rating}</span>
            </Badge>

            <span
              data-testid="review-count"
              className={cn(
                "text-xs border-[2px] px-2 py-0.5 font-bold tracking-wide",
                activeSort === "popularity"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground"
              )}
            >
              {reviewLabel}
            </span>

            <Badge
              variant="outline"
              data-testid="menu-name"
              className="border-[2px] border-border font-bold uppercase text-[10px] tracking-wide"
            >
              {menuName}
            </Badge>
          </div>
        </div>

        {/* 추천이유 */}
        <p
          data-testid="recommendation"
          className="text-[10px] text-muted-foreground border-t border-dashed border-border pt-1.5 mt-1.5 leading-relaxed"
        >
          {recommendation}
        </p>
      </div>
    </li>
  )
}
