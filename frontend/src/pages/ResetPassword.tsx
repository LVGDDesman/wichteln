import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { AuthCard } from "../components/AuthCard"
import { Alert, Button, TextField } from "../components/ui"
import { resetPassword } from "../lib/api"
import { field, useErrorMessage, useSubmit } from "../lib/hooks"
import { linkClass } from "../lib/styles"

export default function ResetPassword() {
  const { t } = useTranslation()
  const [sent, setSent] = useState(false)
  const { pending, error, onSubmit } = useSubmit(async (form) => {
    await resetPassword(field(form, "email"))
    setSent(true)
  })
  const message = useErrorMessage(error)

  return (
    <AuthCard
      title={t("reset.title")}
      footer={
        <Link to="/login" className={linkClass}>
          {t("reset.back")}
        </Link>
      }
    >
      {sent ? (
        <Alert tone="success">{t("reset.sent")}</Alert>
      ) : (
        <form className="space-y-5" onSubmit={onSubmit}>
          <p className="text-sm">{t("reset.intro")}</p>
          <TextField label={t("field.email")} name="email" type="email" autoComplete="email" required autoFocus />
          <Alert>{message}</Alert>
          <Button type="submit" loading={pending}>
            {t("reset.submit")}
          </Button>
        </form>
      )}
    </AuthCard>
  )
}
