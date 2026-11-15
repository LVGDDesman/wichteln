import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { AuthCard } from "../components/AuthCard"
import { Alert, Button, TextField } from "../components/ui"
import { login } from "../lib/api"
import { field, useErrorMessage, useSubmit } from "../lib/hooks"
import { linkClass } from "../lib/styles"

export default function Login() {
  const { t } = useTranslation()
  const { pending, error, onSubmit } = useSubmit((form) =>
    login(field(form, "username"), String(form.get("password")))
  )
  const message = useErrorMessage(error, { 400: "login.failed", 401: "login.failed" })

  return (
    <AuthCard
      title={t("login.title")}
      footer={
        <>
          {t("login.noAccount")}{" "}
          <Link to="/register" className={linkClass}>
            {t("login.toRegister")}
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <TextField label={t("field.login")} name="username" autoComplete="username" required autoFocus />
        <TextField
          label={t("field.password")}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aside={
            <Link to="/passwort-vergessen" className={linkClass}>
              {t("login.forgot")}
            </Link>
          }
        />
        <Alert>{message}</Alert>
        <Button type="submit" loading={pending}>
          {t("login.submit")}
        </Button>
      </form>
    </AuthCard>
  )
}
