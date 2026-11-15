import { createApp } from "./app.ts"
import { config } from "./config.ts"
import { closeDb, migrate } from "./db.ts"
import { scheduleDraw } from "./wichtel/wichtelService.ts"

await migrate()

const server = createApp().listen(config.port, () => {
  console.log(`🎄 Wichteln backend listening on port ${config.port}`)
})

scheduleDraw()

function shutdown(signal: string) {
  console.log(`${signal} received, shutting down…`)
  server.close(() => {
    closeDb().finally(() => process.exit(0))
  })
}
process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)
