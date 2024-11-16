import express from 'express';
import userService = require('./wichtelService');
import { login } from '../models/models';

const wichtelRouter = express.Router();
wichtelRouter.post('/', addWichtelData);
wichtelRouter.get('/', getWichtelData);
wichtelRouter.get('/wichtelee', getWichtelee);

function addWichtelData(req: { body: login; }, res: { json: (arg0: any) => any; }, next: any) {
    userService.addWichtelData(req.body)
        .then((user: any) => res.json(user))
        .catch(next);
}
function getWichtelData(req: { body: any; }, res: { json: (arg0: any) => any; }, next: any) {
    userService.getWichtelData(req.body)
        .then((user: any) => res.json(user))
        .catch(next);
}
function getWichtelee(req: { body: any; }, res: { json: (arg0: any) => any; }, next: any) {
    userService.getWichtelee(req.body)
        .then((user: any) => res.json(user))
        .catch(next);
}

export default wichtelRouter;