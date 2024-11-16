import express from 'express';
import userService = require('./userService');
import { externalUser, login } from '../models/models';

const userRouter = express.Router();
userRouter.post('/authenticate', authenticate);
userRouter.get('/', getUser);
userRouter.post('/create', createUser);
userRouter.post('/update', updateUser);
userRouter.post('/delete', deleteUser);


function createUser(req: { body: any; }, res: { status: any; json: (arg0: any) => any; }, next: any) {
    userService.createUser(req.body)
        .then((user: externalUser) => res.status(201).json(user))
        .catch(next);
}

function authenticate(req: { body: login; }, res: {
    status: any; json: (arg0: any) => any;
}, next: any) {
    userService.authenticate(req.body)
        .then((user: externalUser) => res.json(user))
        .catch(next);
}

function getUser(req: { body: any; }, res: { json: (arg0: any) => any; }, next: any) {
    userService.getUser(req.body)
        .then((user: any) => res.json(user))
        .catch(next);
}

function updateUser(req: { body: any; }, res: { json: (arg0: any) => any; }, next: any) {
    userService.updateUser(req.body)
        .then((user: any) => res.json(user))
        .catch(next);
}
function deleteUser(req: { body: any; }, res: { json: (arg0: any) => any; }, next: any) {
    userService.deleteUser(req.body)
        .then((user: any) => res.json(user))
        .catch(next);
}

export default userRouter;