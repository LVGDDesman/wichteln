import express from "express";
import requestHandler from "./requests/requestHandler";
import Authenticator from "./services/authenticatorService"
import Properties from "./services/propertiesService";
import { Request, ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import DataBaseInstance from "./services/databaseService";
import { User } from "./models/models";

const secretKey = Properties.get("jwt.secret");
const app = express();
const baseurl = "/api"

app.use(express.json());


app.get(baseurl + "/getUserData", (req, res) => {
  requestHandler.getUserData(req, res);
});

app.get(baseurl + "/getWichtelee", (req, res) => {
  res.json(requestHandler.getWichtelee(req));
});

app.post(baseurl + "/addUser", async (req, res) => {
  requestHandler.addUser(req, res);
});

app.post(baseurl + "/login", (req, res) => {
  let { email, password } = req.body;
  const userPromise: Promise<User> = DataBaseInstance.getUser(email);
  userPromise.then((user: User) => {
    if (!user) {
      res.status(401).json({ error: 'Authentication failed' });
    } else if (!Authenticator.authenticate(password, user.hash)) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      const token = Authenticator.createJWT(String(user.id), user.email);
      res.json({ "id": user.id, "username": user.username, "token": token });
    }
  });
});

app.post(baseurl + "/deleteUser", (req, res) => {
  res.json(requestHandler.deleteUser(req));
});
app.post(baseurl + "/addWichtelData", (req, res) => {
  res.json(requestHandler.addWichtelData(req));
});
app.post(baseurl + "/editUserData", (req, res) => {
  res.json(requestHandler.editUserData(req));
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
