import { externalUser, login, User } from "../models/models"
import DataBaseInstance from "../services/databaseService"
import Authenticator from "../services/authenticatorService"
import EmailServiceInstance from "../services/emailService"

export async function createUser(user: User): Promise<externalUser> {
  if (await DataBaseInstance.userExists(user.username, user.email)) {
    throw new Error("User exists!")
  }
  const hash = Authenticator.hashPassword(user.password)
  user.id = await DataBaseInstance.createUser(user.username, user.email, hash)
  const loginData: login = { username: user.username, password: user.password }

  return await authenticate(loginData)
}

export async function authenticate(userData: login): Promise<externalUser> {
  let { username, password } = userData
  const user: User = await DataBaseInstance.getUser(username)

  if (!user) throw new Error("Username or password is incorrect")
  if (!Authenticator.authenticate(password, user.password))
    throw new Error("Username or password is incorrect")

  const token = Authenticator.createJWT(String(user.id))

  return {
    ...cleanUser(user),
    token,
  }
}

export async function getUser(req: any): Promise<externalUser> {
  return await DataBaseInstance.getUserData(req.auth.userId)
}

export async function updateUser(req: any) {
  const id = req.auth.userId
  const oldUser: User = await DataBaseInstance.getUserById(id)
  const {
    username = oldUser.username,
    email = oldUser.email,
    password = oldUser.password,
  } = req.body
  const newUser: User = { id, username, email, password }
  if (password != oldUser.password) {
    newUser.password = Authenticator.hashPassword(password)
  }
  if (
    await DataBaseInstance.userExists(
      newUser.email,
      newUser.username,
      newUser.id
    )
  ) {
    throw new Error("Username/Email already taken!")
  }
  await DataBaseInstance.updateUser(newUser)
}
export async function deleteUser(req: any) {
  const id = req.auth.userId
  await DataBaseInstance.deleteUser(id)
}

export async function resetPassword(req: any) {
  const email: string = req.email
  let user: User = await DataBaseInstance.getUser(email)
  if (!user) throw Error("Email does not exist!")
  const passwords: Array<string> = require("../passwords.json")
  let password: string = ""
  for (let i: number = 0; i < 3; i++) {
    password += passwords[Math.floor(Math.random() * passwords.length)]
  }
  user.password = Authenticator.hashPassword(password)

  await DataBaseInstance.updateUser(user)
  await EmailServiceInstance.sendResetEmail(user, password)
}

// helper functions

function cleanUser(user: User) {
  const { id, password, ...userWithoutPassword } = user
  return userWithoutPassword
}
