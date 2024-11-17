import express from "express";
import errorHandler from "./_helper/errorhandler";
import jwtauth from "./_helper/jwt";
import * as OpenApiValidator from 'express-openapi-validator';
import wichtelRouter from './wichtel/wichtelController';
import userRouter from "./users/userController";

const app = express();
const baseurl = "/api"

app.use(express.json());
app.use(jwtauth());
app.use(
  OpenApiValidator.middleware({
    apiSpec: './wichteln_api.yaml',
    validateRequests: true, 
    validateResponses: true, 
  }),
);

app.use(baseurl +'/user', userRouter);
app.use(baseurl + '/wichtel', wichtelRouter);


app.use(errorHandler);

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
