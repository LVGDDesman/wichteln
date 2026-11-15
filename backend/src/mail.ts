import nodemailer from "nodemailer"
import { config } from "./config.ts"

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.tls,
  auth: { user: config.mail.user, pass: config.mail.password },
})

const from = `"${config.mail.username}" <${config.mail.user}>`

interface Recipient {
  username: string
  email: string
}

export async function sendPasswordReset(user: Recipient, password: string) {
  await transporter.sendMail({
    from,
    to: user.email,
    subject: "Du kommst auf die Liste der Unartigen!",
    text: `Hallo ${user.username},

dein neues Passwort ist: ${password}
Bitte ändere es nach dem Einloggen.

Tschüssi,
Dein Santa`,
  })
}

export async function sendWichtelee(user: Recipient, wichteleeName: string) {
  await transporter.sendMail({
    from,
    to: user.email,
    subject: "🎁 Die Wichtel wurden ausgelost!",
    text: `Hallo ${user.username},

die Lose sind gezogen – du beschenkst dieses Jahr: ${wichteleeName}

Was sich ${wichteleeName} wünscht und wohin das Geschenk gehen soll, siehst du, wenn du dich einloggst.

Tschüssi,
Dein Santa`,
  })
}
