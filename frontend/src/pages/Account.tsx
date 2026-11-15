import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Alert, Button, PageSpinner, Panel, TextField } from "../components/ui"
import { deleteUser, getStatus, getUser, updateUser } from "../lib/api"
import { field, useAsync, useErrorMessage, useSubmit } from "../lib/hooks"

export default function Account() {
  const { t } = useTranslation()
  const user = useAsync(getUser)
  const status = useAsync(getStatus)
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const save = useSubmit(async (form) => {
    setSaved(false)
    const password = String(form.get("password") ?? "")
    const updated = await updateUser({
      username: field(form, "username"),
      email: field(form, "email"),
      ...(password && { password }),
    })
    user.setData(updated)
    setSaved(true)
  })
  const remove = useSubmit(() => deleteUser())

  const saveError = useErrorMessage(save.error, { 409: "account.taken" })
  const removeError = useErrorMessage(remove.error, { 403: "account.deleteLocked" })
  const loadError = useErrorMessage(user.error)

  if (user.status === "loading") return <PageSpinner />

  return (
    <div className="mx-auto max-w-md pt-6">
      <h1 className="mb-6 text-center text-3xl font-bold">{t("account.title")}</h1>
      <Alert>{loadError}</Alert>

      {user.data && (
        <Panel>
          <form className="space-y-5" onSubmit={save.onSubmit} onChange={() => setSaved(false)}>
            <TextField
              label={t("field.username")}
              name="username"
              defaultValue={user.data.username}
              autoComplete="username"
              required
              minLength={2}
              maxLength={64}
            />
            <TextField
              label={t("field.email")}
              name="email"
              type="email"
              defaultValue={user.data.email}
              autoComplete="email"
              required
            />
            <TextField
              label={t("field.newPassword")}
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              maxLength={128}
              hint={t("field.newPasswordHint")}
            />
            <Alert>{saveError}</Alert>
            {saved && <Alert tone="success">{t("account.saved")}</Alert>}
            <Button type="submit" loading={save.pending}>
              {t("account.save")}
            </Button>
          </form>
        </Panel>
      )}

      <div className="mt-10 space-y-3">
        {status.data?.over ? (
          <p className="text-center text-sm text-xmastext/70">{t("account.deleteLocked")}</p>
        ) : confirmDelete ? (
          <form className="space-y-3" onSubmit={remove.onSubmit}>
            <Alert>{t("account.deleteConfirm")}</Alert>
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>
                {t("account.cancel")}
              </Button>
              <Button type="submit" variant="danger" loading={remove.pending}>
                {t("account.deleteYes")}
              </Button>
            </div>
          </form>
        ) : (
          <Button type="button" variant="ghost" onClick={() => setConfirmDelete(true)}>
            {t("account.delete")}
          </Button>
        )}
        <Alert>{removeError}</Alert>
      </div>
    </div>
  )
}
