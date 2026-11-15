import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import lockedImage from "../../assets/cards/Locked.webp"
import { IllustratedCard } from "../../components/ui"
import { useNow } from "../../lib/hooks"

/** Shown until the draw: end date with a live countdown. */
export function LockedCard({ enddate, onReached }: { enddate: string; onReached?: () => void }) {
  const { t } = useTranslation()
  const now = useNow()
  const end = new Date(enddate)
  const remaining = Math.max(0, end.getTime() - now)
  const reached = remaining === 0

  useEffect(() => {
    if (!reached || !onReached) return
    // give the backend a moment to run the draw
    const id = setTimeout(onReached, 3000)
    return () => clearTimeout(id)
  }, [reached, onReached])

  const s = Math.floor(remaining / 1000)
  const parts = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 }

  return (
    <IllustratedCard image={lockedImage} contentTop="62%">
      <div className="m-auto space-y-2 text-center">
        <p className="text-sm font-medium">{t("wichteln.drawOn")}</p>
        <p className="text-xl font-bold">
          {end.toLocaleString("de-DE", {
            dateStyle: "full",
            timeStyle: "short",
          })}
        </p>
        <p className="font-mono text-sm tabular-nums" aria-live="off">
          {reached ? t("wichteln.drawing") : t("wichteln.countdown", parts)}
        </p>
      </div>
    </IllustratedCard>
  )
}

/** Shown after the end date if the draw has not happened (yet). */
export function PendingCard() {
  const { t } = useTranslation()
  return (
    <IllustratedCard image={lockedImage} contentTop="62%">
      <p className="m-auto text-center font-medium">{t("wichteln.notDrawn")}</p>
    </IllustratedCard>
  )
}
