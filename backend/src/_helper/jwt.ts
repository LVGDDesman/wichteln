import { expressjwt } from 'express-jwt';
const config = require('../../config.json');

function jwt() {
    const secret: string = config.jwt.secret;
    return expressjwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            config.api.baseurl +  '/user/authenticate',
            config.api.baseurl + '/user/create'
        ]
    });
}

export default jwt;