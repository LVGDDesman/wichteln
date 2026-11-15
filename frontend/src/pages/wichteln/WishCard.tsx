import { useState } from "react"
import { useTranslation } from "react-i18next"
import cardImage from "../../assets/cards/XmasCard.webp"
import greyCardImage from "../../assets/cards/XmasCardGrey.webp"
import { Alert, Button, IllustratedCard, Spinner, TextField } from "../../components/ui"
import { getWichtelData, saveWichtelData } from "../../lib/api"
import { field, useAsync, useErrorMessage, useSubmit } from "../../lib/hooks"

export function WishCard({ locked }: { locked: boolean }) {
  const { t } = useTranslation()
  const data = useAsync(getWichtelData)
  const [dirty, setDirty] = useState(false)

  const { pending, error, onSubmit } = useSubmit(async (form) => {
    data.setData(await saveWichtelData({ wish: field(form, "wish"), address: field(form, "address") }))
    setDirty(false)
  })
  const message = useErrorMessage(error ?? data.error, { 403: "wichteln.locked" })

  const hasWish = Boolean(data.data?.wish)
  const label = locked
    ? t("wichteln.locked")
    : !hasWish
      ? t("wichteln.submit")
      : dirty
        ? t("wichteln.update")
        : t("wichteln.saved")

  return (
    <IllustratedCard image={locked ? greyCardImage : cardImage} contentTop="55%">
      {data.status === "loading" ? (
        <div className="m-auto text-xmasprim">
          <Spinner />
        </div>
      ) : (
        <form className="flex h-full flex-col gap-2.5" onSubmit={onSubmit} onInput={() => setDirty(true)}>
          <TextField
            label={t("field.wish")}
            name="wish"
            defaultValue={data.data?.wish ?? ""}
            disabled={locked}
            required
            maxLength={2000}
          />
          <TextField
            label={t("field.address")}
            name="address"
            defaultValue={data.data?.address ?? ""}
            disabled={locked}
            autoComplete="street-address"
            maxLength={500}
          />
          <div className="mt-auto space-y-2">
            {message && <Alert>{message}</Alert>}
            <Button type="submit" loading={pending} disabled={locked || (hasWish && !dirty)}>
              {label}
            </Button>
          </div>
        </form>
      )}
    </IllustratedCard>
  )
}
