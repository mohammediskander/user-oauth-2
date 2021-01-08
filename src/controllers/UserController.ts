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
import Utils from "../utils";

export default class UserController implements ControllerBase {
  public init() {
    this.router.post("/new", this.createUser);
    this.router.post("/user");
    this.router.get(
      "/get-details",
      this.oauth.authenticate(),
      this.getUserDetails
    );
    // this.router.get("/get-all", this.oauth.)
  }

  public router: Express.Router = Express.Router();
  public path: string = "/users";

  constructor() {
    this.init();
  }

  public oauth = Utils.shared.oauth;

  private getUserDetails = (
    request: ERequest,
    response: EResponse,
    next: ENextFunction
  ) => {
    let { token } = response.locals.oauth;

    User.findById(token.user._id)
      .then((user) => {
        if (user) {
          response.json(user);
        } else {
          response.status(404);
          next(new Error("userNotFound"));
        }
      })
      .catch((error) => {
        next(error);
      });
  };

  private createUser = (
    request: ERequest,
    response: EResponse,
    next: ENextFunction
  ) => {
    const {
      nationalId,
      fullName,
      username,
      password,
      phoneNumber,
      birthDate,
    }: {
      nationalId: string;
      fullName: string;
      username: string;
      password: string;
      phoneNumber: string;
      birthDate: number;
    } = request.body;

    User.findOne({
      $or: [
        {
          nationalId: nationalId,
        },
        {
          username: username,
        },
        {
          phoneNumber: phoneNumber,
        },
      ],
    }).then((user) => {
      if (user) {
        response.status(400);
        next(new Error("userAlreadyExist"));
      } else {
        new User({
          nationalId,
          fullName,
          username,
          password,
          phoneNumber,
          birthDate: new Date(birthDate),
        })
          .save()
          .then((user) => {
            if (user) {
              new Client({
                clientId: Crypto.randomBytes(16).toString("hex"),
                clientSecret: Crypto.randomBytes(16).toString("hex"),
                user: user._id,
                redirectUris: [],
                grants: [
                  "authorization_code",
                  "client_credentials",
                  "refresh_token",
                  "password",
                ],
              })
                .save()
                .then((client) => {
                  response.json({
                    client: client,
                    user: user,
                  });
                });
            } else {
              response.status(402);
              next(new Error("cannotCreateUser"));
            }
          })
          .catch((error) => {
            response.status(400);
            next(error);
          });
      }
    });
  };
}
