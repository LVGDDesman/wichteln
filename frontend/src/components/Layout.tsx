import { useTranslation } from "react-i18next"
import { Link, NavLink, Navigate, Outlet } from "react-router"
import santa from "../assets/santa.svg"
import { logout } from "../lib/api"
import { useToken } from "../lib/session"

function LanguageToggle() {
  const { t, i18n } = useTranslation()
  const depp = i18n.language === "depp"
  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(depp ? "de" : "depp")}
      aria-label={t("nav.language")}
      aria-pressed={depp}
      title={t("nav.language")}
      className="cursor-pointer rounded-full p-1 text-2xl transition-transform hover:scale-125"
    >
      {depp ? "🤣" : "😐"}
    </button>
  )
}

function Header() {
  const { t } = useTranslation()
  const token = useToken()
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors hover:bg-white/50 ${isActive ? "bg-white/40" : ""}`

  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
      <Link to="/" className="flex items-center gap-2 text-lg font-bold">
        <img src={santa} alt="" className="size-9" />
        <span className="max-sm:sr-only">Wichteln</span>
      </Link>
      {token && (
        <nav className="flex items-center gap-1">
          <NavLink to="/wichteln" className={navClass}>
            {t("nav.wichteln")}
          </NavLink>
          <NavLink to="/konto" className={navClass}>
            {t("nav.account")}
          </NavLink>
          <button type="button" onClick={logout} className={`${navClass({ isActive: false })} cursor-pointer`}>
            {t("nav.logout")}
          </button>
        </nav>
      )}
    </header>
  )
}

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 px-4 pb-10">
        <Outlet />
      </main>
      <footer className="flex justify-end px-4 py-2">
        <LanguageToggle />
      </footer>
    </div>
  )
}

/** Only for logged-in users, otherwise redirect to login. */
export function RequireAuth() {
  return useToken() ? <Outlet /> : <Navigate to="/login" replace />
}

/** Only for guests (login, register …), otherwise go to the app. */
export function GuestOnly() {
  return useToken() ? <Navigate to="/wichteln" replace /> : <Outlet />
}
