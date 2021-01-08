import * as Express from "express";
import {
  Request as ERequest,
  Response as EResponse,
  NextFunction as ENextFunction,
} from "express";
import ControllerBase from "../utils/ControllerBase";
import User from "../models/User";
import Client from "../models/Client";
import Crypto from "crypto";

export default class ClientController implements ControllerBase {
  init() {
    throw new Error("Method not implemented.");
  }
  router: Express.Router;
  path: string;
}
