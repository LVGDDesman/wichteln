import { endDate, isOver } from "../config.ts"
import * as db from "../db.ts"
import { HttpError } from "../errors.ts"
import { sendWichtelee } from "../mail.ts"
import { assignCircle } from "./assign.ts"

export async function getStatus() {
  return {
    enddate: endDate().toISOString(),
    over: isOver(),
    drawn: await db.isDrawn(),
  }
}

export async function getWichtelData(id: number): Promise<db.WichtelData> {
  const data = await db.getWichtelData(id)
  if (!data) throw new HttpError(404, "User not found")
  return data
}

export async function setWichtelData(
  id: number,
  data: Partial<db.WichtelData>
): Promise<db.WichtelData> {
  if (isOver()) throw new HttpError(403, "Wishes are locked – the draw is over")
  await db.setWichtelData(id, data)
  return getWichtelData(id)
}

export async function getWichtelee(id: number): Promise<db.Wichtelee> {
  const wichtelee = await db.getWichtelee(id)
  if (!wichtelee) throw new HttpError(404, "No wichtelee drawn yet")
  return wichtelee
}

/** Runs the draw once the end date has passed. Safe to call repeatedly. */
export async function draw(): Promise<void> {
  if (!isOver()) {
    throw new HttpError(412, `It's not ${endDate().toISOString()} yet! Please wait…`)
  }

  let result
  try {
    result = await db.saveDraw(assignCircle)
  } catch (e) {
    if (e instanceof Error && e.message.includes("two participants")) {
      throw new HttpError(412, e.message)
    }
    throw e
  }
  if (!result.drawn) {
    throw new HttpError(409, "Wichteln has already been drawn. Try again next year!")
  }

  console.log(`🎲 Drew ${result.assignments.length} wichtel pairs`)

  const byId = new Map(result.users.map((u) => [u.id, u]))
  const mails = await Promise.allSettled(
    result.assignments.map((a) =>
      sendWichtelee(byId.get(a.id)!, byId.get(a.wichtelee)!.username)
    )
  )
  const failed = mails.filter((m) => m.status === "rejected")
  if (failed.length) {
    console.error(`✉️  ${failed.length} notification mail(s) failed`, failed)
  }
}

/**
 * Triggers the draw automatically at the end date. setTimeout is capped at
 * ~24.8 days, so long waits are split into several hops.
 */
export function scheduleDraw(): void {
  const MAX_DELAY = 2 ** 31 - 1
  const delay = endDate().getTime() - Date.now()

  if (delay > 0) {
    if (delay <= MAX_DELAY) console.log(`⏰ Draw scheduled for ${endDate().toISOString()}`)
    setTimeout(scheduleDraw, Math.min(delay, MAX_DELAY)).unref()
    return
  }

  db.isDrawn()
    .then((drawn) => (drawn ? undefined : draw()))
    .catch((e) => console.error("Automatic draw failed:", e))
}
