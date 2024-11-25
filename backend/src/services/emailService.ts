import { User } from "../models/models"
import nodemailer, { Transporter } from "nodemailer"
const config = require("../../config.json")

let instance: any

class EmailService {
  transporter: Transporter
  username: string
  user: string
  constructor() {
    if (instance) {
      throw new Error("New instance cannot be created!!")
    }
    instance = this
    this.transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.tls,
      auth: {
        user: config.mail.user,
        pass: config.mail.password,
      },
    })
    this.username = config.mail.username
    this.user = config.mail.user
  }

  async sendResetEmail(user: User, password: string) {
    var message = {
      from: `"${this.username}" ${this.user}`,
      to: user.email,
      subject: "Du kommst auf die Liste der Unartigen!",
      text: `Hallo ${user.username},\n\nDein neues Passwort ist: ${password}\nBitte ändere es.\n\nTschüssi,\nDein Santa`,
    }
    this.transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log(error)
        throw error
      } else {
        console.log("Email sent: " + info.response)
      }
    })
  }
  async sendWichtelee(user: User, wichtelee: any) {
    var message = {
      from: `"${this.username}" ${this.user}`,
      to: user.email,
      subject: "Du kommst auf die Liste der Unartigen!",
      text: `Hallo ${user.username},\n\nDein Wichtelpartner ist ${wichtelee.name}\n\nTschüssi,\nDein Santa`,
    }
    this.transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log(error)
        throw error
      } else {
        console.log("Email sent: " + info.response)
      }
    })
  }
}
let EmailServiceInstance = Object.freeze(new EmailService())

export default EmailServiceInstance
