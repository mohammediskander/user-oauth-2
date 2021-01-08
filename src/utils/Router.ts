import * as Express from "express";
import {
  Request as ERequest,
  Response as EResponse,
  NextFunction as ENextFunction,
} from "express";
import ControllerBase from "./ControllerBase";

class Router {
  static handlePageNotFound = (
    request: ERequest,
    response: EResponse,
    next: ENextFunction
  ) => {
    response.status(404);
    next(new Error("pageNotFound"));
  };

  static handleErrors = (
    error: Error,
    request: ERequest,
    response: EResponse,
    next: ENextFunction
  ) => {
    let statusCode: number;

    if (response.statusCode === 200) {
      statusCode = 500;
    } else {
      statusCode = response.statusCode;
    }

    response.status(statusCode);

    let body: { name: string; message: string; stack?: any } = {
      name: error.name,
      message: error.message,
    };

    if (process.env.NODE_ENV === "production") {
      body.stack = error.stack;
    }

    response.json(body);
  };
}

export default Router;
