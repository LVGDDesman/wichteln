import { useTranslation } from "react-i18next"
import cardImage from "../../assets/cards/XmasCard.webp"
import { Alert, IllustratedCard, Spinner } from "../../components/ui"
import { getWichtelee } from "../../lib/api"
import { useAsync, useErrorMessage } from "../../lib/hooks"

export function WichteleeCard() {
  const { t } = useTranslation()
  const wichtelee = useAsync(getWichtelee)
  const message = useErrorMessage(wichtelee.error, { 404: "wichteln.notDrawn" })

  return (
    <IllustratedCard image={cardImage} contentTop="55%">
      {wichtelee.status === "loading" && (
        <div className="m-auto text-xmasprim">
          <Spinner />
        </div>
      )}
      {message && <Alert>{message}</Alert>}
      {wichtelee.data && (
        <div className="flex h-full flex-col gap-3 overflow-y-auto">
          <section>
            <h2 className="text-sm font-semibold">
              {t("wichteln.wichteleeWishes", { name: wichtelee.data.username })}
            </h2>
            <p className="mt-1 text-lg/6 font-bold break-words whitespace-pre-line">
              {wichtelee.data.wish || <span className="font-normal italic">{t("wichteln.noWish")}</span>}
            </p>
          </section>
          <section>
            <h2 className="text-sm font-semibold">{t("wichteln.sendTo")}</h2>
            <p className="mt-1 break-words whitespace-pre-line">
              {wichtelee.data.address || <span className="italic">{t("wichteln.noAddress")}</span>}
            </p>
          </section>
        </div>
      )}
    </IllustratedCard>
  )
}
