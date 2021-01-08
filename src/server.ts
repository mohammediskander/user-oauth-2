import App from "./App";

import bodyParser from "body-parser";
import dotENV from "dotenv";
import Morgan from "morgan";
import Helmet from "helmet";
import Cors from "cors";

import AuthController from "./controllers/AuthController";
import UserController from "./controllers/UserController";

dotENV.config();

var whitelist = ["http://localhost:3000"];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

const app = new App({
  port: 4000,
  controllers: [new UserController(), new AuthController()],
  middleWares: [
    Cors(corsOptionsDelegate),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    Morgan("common"),
    Helmet(),
  ],
  mongoURI: "mongodb://localhost/nafadh-fake",
});

app.listen();
