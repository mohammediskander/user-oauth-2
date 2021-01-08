import Express from "express";
import { Application } from "express";
import Router from "./utils/Router";
import ControllerBase from "./utils/ControllerBase";
import { name as Name } from "../package.json";
import path from "path";
import mongoose from "mongoose";

interface AppDelegate {}

type MiddleWares = {
  forEach: (arg0: (middleWare: any) => void) => void;
};

interface ApplicationInitialization {
  port: number;
  middleWares: MiddleWares;
  controllers: ControllerBase[];
  mongoURI: string;
}

export default class App {
  public app: Application;
  public port: number;
  private mongoose: typeof mongoose;
  private mongoURI: string;

  public static shared?: App;
  public delegate: AppDelegate;

  constructor(init: ApplicationInitialization) {
    this.app = Express();
    this.port = init.port;
    this.mongoose = mongoose;
    this.mongoURI = init.mongoURI;

    this.middleWares(init.middleWares);
    this.assets();

    this.routes(init.controllers);
  }

  private middleWares(middleWares: MiddleWares) {
    middleWares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }

  private routes(controllers: ControllerBase[]) {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });

    this.app.use(Router.handlePageNotFound);
    this.app.use(Router.handleErrors);
  }

  private assets() {
    this.app.use(Express.static("public"));
    // this.app.set("public", path.join(__dirname, "public"));
    // this.app.use(Express.static("views"));
    // view engine setup
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "hbs");
  }

  public listen() {
    this.mongoose
      .connect(this.mongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.clear();
        console.log(`MongoDB Connected Successfully!`);

        console.log(`Connected to port ${this.port}..`);
        this.app.listen(this.port, () => {
          console.log(`Connected!`);
          console.log(`[${Name}] listening on port ${this.port}`);
        });
      });
  }
}
