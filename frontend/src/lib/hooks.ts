import { useCallback, useEffect, useState, useTransition, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { ApiError } from "./api"

type AsyncState<T> =
  | { status: "loading"; data?: undefined; error?: undefined }
  | { status: "success"; data: T; error?: undefined }
  | { status: "error"; data?: undefined; error: unknown }

/** Loads data once on mount; `reload()` fetches again. `load` must be stable. */
export function useAsync<T>(load: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" })
  const [generation, setGeneration] = useState(0)

  useEffect(() => {
    let active = true
    load().then(
      (data) => active && setState({ status: "success", data }),
      (error) => active && setState({ status: "error", error })
    )
    return () => {
      active = false
    }
  }, [load, generation])

  const reload = useCallback(() => setGeneration((g) => g + 1), [])
  return { ...state, reload, setData: (data: T) => setState({ status: "success", data }) }
}

/** Form submit handler with pending + error state. */
export function useSubmit(action: (form: FormData) => Promise<void>) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<unknown>(null)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      try {
        await action(form)
      } catch (err) {
        setError(err)
      }
    })
  }

  return { pending, error, onSubmit }
}

/**
 * Turns an API error into a translated message. `byStatus` maps HTTP status
 * codes to translation keys for the cases a form wants to explain itself.
 */
export function useErrorMessage(error: unknown, byStatus: Record<number, string> = {}) {
  const { t } = useTranslation()
  if (!error) return null
  if (error instanceof ApiError) {
    if (byStatus[error.status]) return t(byStatus[error.status])
    if (error.status === 0) return t("error.network")
    if (error.status === 400) return t("error.invalid")
  }
  return t("error.generic")
}

/** Current time, updated every `intervalMs`. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

export const field = (form: FormData, name: string) => String(form.get(name) ?? "").trim()
