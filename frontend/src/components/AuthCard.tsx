import type { ReactNode } from "react"
import santa from "../assets/santa.svg"
import { Panel } from "./ui"

export function AuthCard({ title, children, footer }: { title: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-sm pt-4 sm:pt-10">
      <img src={santa} alt="" className="mx-auto h-32 w-auto drop-shadow-md sm:h-40" />
      <h1 className="mt-6 mb-6 text-center text-2xl/9 font-bold tracking-tight">{title}</h1>
      <Panel>{children}</Panel>
      {footer && <p className="mt-8 text-center text-sm/6">{footer}</p>}
    </div>
  )
}

