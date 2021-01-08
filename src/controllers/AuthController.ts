import * as Express from "express";
import {
  Request as ERequest,
  Response as EResponse,
  NextFunction as ENextFunction,
} from "express";
import ControllerBase from "../utils/ControllerBase";
import UserModel from "../models/User";
import Utils from "../utils";

export default class AuthController implements ControllerBase {
  public init() {
    this.router.post(
      "/access_token",
      this.oauth.token({
        requireClientAuthentication: { authorization_code: false },
      })
    );

    this.router.get("/authenticate", this.getAuthenticate);
    this.router.post("/authenticate");

    this.router.post(
      "/authenticate",
      async (request: ERequest, _response: EResponse, next: ENextFunction) => {
        request.body.user = await UserModel.findOne({
          username: request.body.username,
        });
        return next();
      },
      this.oauth.authorize({
        authenticateHandler: {
          handle: (request: ERequest) => {
            return request.body.user;
          },
        },
      })
    );
  }

  public oauth = Utils.shared.oauth;
  public router: Express.Router = Express.Router();
  public path: string = "/oauth2";

  constructor() {
    this.init();
  }

  private getAuthenticate = (
    request: ERequest,
    response: EResponse,
    next: ENextFunction
  ) => {
    return response.render("authenticate", {
      title: "Login via Fake OAuth2.0",
    });
  };

  private handleUser = async (
    request: ERequest,
    response: EResponse,
    next: ENextFunction
  ) => {
    request.body.user = await UserModel.findOne({
      username: request.body.username,
    });
    return next();
  };
}
