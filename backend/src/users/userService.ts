import jwt from 'jsonwebtoken';
import { externalUser, login, User } from '../models/models';
import DataBaseInstance from '../services/databaseService';
import Authenticator from '../services/authenticatorService';

export async function createUser(user: User): Promise<externalUser> {
    if (await DataBaseInstance.userExists(user.username, user.email)) {
        throw new Error("User exists!");
    }
    user.id = await DataBaseInstance.createUser(user.username, user.email, user.password);
    const loginData: login = { "email": user.email, "password": user.password }
    return await authenticate(loginData);
}

export async function authenticate(userData: login): Promise<externalUser> {
    let { email, password } = userData;
    const user: User = await DataBaseInstance.getUser(email);

    if (!user) throw 'Username or password is incorrect';
    if (!Authenticator.authenticate(password, user.password)) throw 'Username or password is incorrect';

    const token = Authenticator.createJWT(String(user.id), String(user.email));

    return {
        ...omitPassword(user),
        token
    };
};

export async function getUser(body: login) {
    throw new Error('Function not implemented.');
}





export async function updateUser(body: login) {
    throw new Error('Function not implemented.');
}


export async function deleteUser(body: login) {
    throw new Error('Function not implemented.');
}


// helper functions

function omitPassword(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

