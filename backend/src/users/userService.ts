import { externalUser, login, User } from "../models/models";
import DataBaseInstance from "../services/databaseService";
import Authenticator from "../services/authenticatorService";

export async function createUser(user: User): Promise<externalUser> {
  if (await DataBaseInstance.userExists(user.username, user.email)) {
    throw new Error("User exists!");
  }
  const hash = Authenticator.hashPassword(user.password);
  user.id = await DataBaseInstance.createUser(user.username, user.email, hash);
  const loginData: login = { email: user.email, password: user.password };
  return await authenticate(loginData);
}

export async function authenticate(userData: login): Promise<externalUser> {
  let { email, password } = userData;
  const user: User = await DataBaseInstance.getUser(email);

  if (!user) throw "Username or password is incorrect";
  if (!Authenticator.authenticate(password, user.password))
    throw "Username or password is incorrect";

  const token = Authenticator.createJWT(String(user.id));

  return {
    ...cleanUser(user),
    token,
  };
}

export async function getUser(req: any): Promise<externalUser> {
  return await DataBaseInstance.getUserData(req.auth.userId);
}

export async function updateUser(req: any) {
  const id = req.auth.userId;
  const oldUser: User = await DataBaseInstance.getUserById(id);
  const {
    username = oldUser.username,
    email = oldUser.email,
    password = oldUser.password,
  } = req.body;
  const newUser: User = { id, username, email, password };
  if (password != oldUser.password) {
    newUser.password = Authenticator.hashPassword(password);
  }
  if (
    await DataBaseInstance.userExists(
      newUser.email,
      newUser.username,
      newUser.id
    )
  ) {
    throw new Error("Username/Email already taken!");
  }
  await DataBaseInstance.updateUser(newUser);
}

export async function deleteUser(req: any) {
  const id = req.auth.userId;
  await DataBaseInstance.deleteUser(id);
}

// helper functions

function cleanUser(user: User) {
  const { id, password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
