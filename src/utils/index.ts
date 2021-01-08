import OAuthServer from "express-oauth-server";
import Model from "./model";

export default class Utils {
  public static shared: Utils = new Utils();

  public oauth = new OAuthServer({ model: new Model() });
}
