import { useTranslation } from "react-i18next"
import { Alert, PageSpinner } from "../../components/ui"
import { getStatus } from "../../lib/api"
import { useAsync, useErrorMessage } from "../../lib/hooks"
import { LockedCard, PendingCard } from "./LockedCard"
import { WichteleeCard } from "./WichteleeCard"
import { WishCard } from "./WishCard"

export default function Wichteln() {
  const { t } = useTranslation()
  const status = useAsync(getStatus)
  const message = useErrorMessage(status.error)

  if (status.status === "loading") return <PageSpinner />
  if (!status.data) {
    return (
      <div className="mx-auto max-w-md pt-10">
        <Alert>{message}</Alert>
      </div>
    )
  }

  const { over, drawn, enddate } = status.data
  return (
    <>
      <h1 className="pt-6 pb-10 text-center text-4xl font-bold">
        {over ? t("wichteln.titleAfter") : t("wichteln.titleBefore")}
      </h1>
      <section className="mx-auto grid w-fit grid-cols-1 justify-items-center gap-x-14 gap-y-12 md:grid-cols-2">
        <WishCard locked={over} />
        {/* after the draw the wichtelee is what matters – show it first on mobile */}
        <div className={over ? "max-md:order-first" : ""}>
          {!over ? <LockedCard enddate={enddate} onReached={status.reload} /> : drawn ? <WichteleeCard /> : <PendingCard />}
        </div>
      </section>
    </>
  )
}
