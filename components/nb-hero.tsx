import { MapPin } from "lucide-react"

type NbHeroProps = {
  location: string
  locationDetail?: string
}

export function NbHero({ location, locationDetail }: NbHeroProps) {
  return (
    <header className="bg-foreground border-[3px] border-foreground shadow-[6px_6px_0_hsl(var(--border))] px-5 py-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-background/60 mb-1">
            ☕ Find Your Cup
          </p>
          <h1 className="text-4xl font-black leading-none tracking-tight text-background">
            COFFEE
            <br />
            NOW
          </h1>
        </div>
        <div className="border-2 border-background/60 px-2.5 py-1.5 mt-1">
          <div className="flex items-center gap-1">
            <MapPin className="size-3 text-background" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-background">
              {location}
            </span>
          </div>
          {locationDetail ? (
            <p className="text-[9px] text-background/50 mt-0.5">{locationDetail}</p>
          ) : null}
        </div>
      </div>
    </header>
  )
}
