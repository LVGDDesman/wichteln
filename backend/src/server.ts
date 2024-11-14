import express from "express";
import requestHandler from "./requests/requestHandler";
import Authenticator from "./services/authenticatorService"

const app = express();


app.use(express.json());


const baseurl = "/api"

app.get(baseurl + "/getUserData", (req, res) => {
  Authenticator.authenticate(req);
  res.json(requestHandler.getUserData(req));
});

app.get(baseurl + "/getWichtelee", (req, res) => {
  Authenticator.authenticate(req);
  res.json(requestHandler.getWichtelee(req));
});

app.post(baseurl + "/addUser", (req, res) => {
  Authenticator.authenticate(req);
  res.json(requestHandler.addUser(req));
});

app.post(baseurl + "/login", (req, res) => {
  res.json(requestHandler.login(req));
});

app.post(baseurl + "/deleteUser", (req, res) => {
  Authenticator.authenticate(req);
  res.json(requestHandler.deleteUser(req));
});
app.post(baseurl + "/addWichtelData", (req, res) => {
  Authenticator.authenticate(req);
  res.json(requestHandler.addWichtelData(req));
});
app.post(baseurl + "/editUserData", (req, res) => {
  Authenticator.authenticate(req);
  res.json(requestHandler.editUserData(req));
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});