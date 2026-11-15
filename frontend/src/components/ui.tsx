import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react"
import { useId } from "react"

export function Spinner({ className = "size-6" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function PageSpinner() {
  return (
    <div className="flex justify-center py-24 text-xmasprim" role="status">
      <Spinner className="size-10" />
    </div>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  variant?: "primary" | "danger" | "ghost"
}

const variants = {
  primary: "bg-xmasprim hover:bg-xmasacc text-xmastext",
  danger: "bg-xmasred hover:bg-xmasred/85 text-white",
  ghost: "bg-white/40 hover:bg-white/70 text-xmastext",
}

export function Button({ loading, variant = "primary", className = "", children, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`flex min-h-9 w-full items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-xmasprim disabled:cursor-not-allowed disabled:opacity-70 ${variants[variant]} ${className}`}
    >
      {loading ? <Spinner className="size-5" /> : children}
    </button>
  )
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  /** Small element on the right of the label, e.g. a "forgot?" link */
  aside?: ReactNode
  hint?: string
}

export function TextField({ label, aside, hint, className = "", ...props }: TextFieldProps) {
  const id = useId()
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="block text-sm/6 font-medium">
          {label}
        </label>
        {aside && <div className="text-sm">{aside}</div>}
      </div>
      <input
        id={id}
        {...props}
        className="mt-1 block w-full rounded-md bg-xmassec/80 px-2 py-1.5 text-base shadow-sm ring-1 ring-xmasacc outline-none ring-inset placeholder:text-xmastext/40 focus:ring-2 focus:ring-xmasprim disabled:opacity-70 sm:text-sm/6"
      />
      {hint && <p className="mt-1 text-xs text-xmastext/60">{hint}</p>}
    </div>
  )
}

export function Alert({ tone = "error", children }: { tone?: "error" | "success"; children: ReactNode }) {
  if (!children) return null
  const styles = tone === "error" ? "bg-red-50 text-xmasred ring-red-200" : "bg-green-50 text-green-800 ring-green-200"
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`rounded-md px-3 py-2 text-sm ring-1 ${styles}`}>
      {children}
    </p>
  )
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white/60 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur sm:p-8 ${className}`}>
      {children}
    </div>
  )
}

/**
 * A card drawn on top of one of the illustrated card images. `contentTop`
 * is where the writable area of the illustration starts (in % of height).
 */
export function IllustratedCard({
  image,
  contentTop,
  children,
}: {
  image: string
  contentTop: string
  children: ReactNode
}) {
  return (
    <article
      className="relative aspect-[1443/2355] w-80 max-w-full overflow-hidden rounded-xl bg-cover bg-top shadow-md transition duration-500 hover:shadow-xl motion-safe:hover:scale-[1.03]"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-x-[7%] bottom-[4%] flex flex-col" style={{ top: contentTop }}>
        {children}
      </div>
    </article>
  )
}
