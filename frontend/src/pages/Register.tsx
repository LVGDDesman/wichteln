import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { AuthCard } from "../components/AuthCard"
import { Alert, Button, TextField } from "../components/ui"
import { register } from "../lib/api"
import { field, useErrorMessage, useSubmit } from "../lib/hooks"
import { linkClass } from "../lib/styles"

export default function Register() {
  const { t } = useTranslation()
  const { pending, error, onSubmit } = useSubmit((form) =>
    register(field(form, "username"), field(form, "email"), String(form.get("password")))
  )
  const message = useErrorMessage(error, { 403: "register.closed", 409: "register.exists" })

  return (
    <AuthCard
      title={t("register.title")}
      footer={
        <>
          {t("register.hasAccount")}{" "}
          <Link to="/login" className={linkClass}>
            {t("register.toLogin")}
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <TextField label={t("field.email")} name="email" type="email" autoComplete="email" required autoFocus />
        <TextField
          label={t("field.username")}
          name="username"
          autoComplete="username"
          required
          minLength={2}
          maxLength={64}
        />
        <TextField
          label={t("field.password")}
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          maxLength={128}
        />
        <Alert>{message}</Alert>
        <Button type="submit" loading={pending}>
          {t("register.submit")}
        </Button>
      </form>
    </AuthCard>
  )
}
