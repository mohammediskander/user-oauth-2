import { Router as ERouter } from "express";

interface ControllerBase {
  init(): any;
  router: ERouter;
  path: string;
}

export default ControllerBase;
