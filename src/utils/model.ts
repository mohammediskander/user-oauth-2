import {
  default as AccessTokenModel,
  AccessToken,
} from "../models/AccessToken";
import Address from "../models/Address";
import {
  default as AuthorizationCodeModel,
  AuthorizationCode,
} from "../models/AuthorizationCode";
import { default as ClientModel, Client } from "../models/Client";
import { default as UserModel, User } from "../models/User";
import * as crypto from "crypto";
import OAuth2Server from "oauth2-server";
import { functionsIn } from "lodash";

export default class Model
  implements
    OAuth2Server.AuthorizationCodeModel,
    OAuth2Server.ClientCredentialsModel,
    OAuth2Server.PasswordModel,
    OAuth2Server.RefreshTokenModel {
  /**
   * Invoked to retrieve an existing access token previously saved through Model.saveToken().
   * @required
   * @param refreshToken The access token to retrieve.
   * @param callback Node-style callback to be used instead of the returned `Promise`.
   */
  getRefreshToken(
    refreshToken: string,
    callback?: OAuth2Server.Callback<OAuth2Server.RefreshToken>
  ): Promise<false | "" | 0 | OAuth2Server.RefreshToken> {
    console.log("getRefreshToken");
    return new Promise((resolve, reject) => {
      AccessTokenModel.findOne({ accessToken: refreshToken })
        .populate("user")
        .populate("client")
        .then((accessToken) => {
          let token: OAuth2Server.RefreshToken = {
            ...accessToken,
            client: accessToken.client as OAuth2Server.Client,
            user: accessToken.user as User,
          };
          callback(null, token);
          resolve(token);
        })
        .catch((error) => {
          callback(error, null);
          reject(error);
        });
    });
  }
  /**
   * Invoked to revoke a refresh token.
   * @required
   * @param token The token to be revoked.
   * @param callback Node-style callback to be used instead of the returned `Promise`.
   */
  revokeToken(
    token: OAuth2Server.Token | OAuth2Server.RefreshToken,
    callback?: OAuth2Server.Callback<boolean>
  ): Promise<boolean> {
    console.log("revokeToken");
    return new Promise((resolve, reject) => {
      AccessTokenModel.findOneAndDelete({
        accessToken: token.accessToken,
      })
        .then((accessToken) => {
          callback(null, accessToken.$isDeleted());
          resolve(accessToken.$isDeleted());
        })
        .catch();
    });
  }
  /**
   * Invoked to retrieve a user using a username/password combination.
   * @required
   * @param username The username of the user to retrieve.
   * @param password The user’s password.
   * @param callback Node-style callback to be used instead of the returned `Promise`.
   */
  getUser(
    username: string,
    password: string,
    callback?: OAuth2Server.Callback<false | "" | 0 | OAuth2Server.User>
  ): Promise<false | "" | 0 | OAuth2Server.User> {
    console.log("getUser");
    return new Promise((resolve, reject) => {
      const encryptedPassword = Model.encryptPassword(password);

      UserModel.findOne({ username: username, password: encryptedPassword })
        .then((user) => {
          callback(null, user);
          resolve(user);
        })
        .catch((error) => {
          callback(error, null);
          reject(error);
        });
    });
  }
  /**
   * Invoked to retrieve the user associated with the specified client.
   * @required
   * @param client The client to retrieve the associated user for.
   * @param callback Node-style callback to be used instead of the returned `Promise`.
   */
  getUserFromClient(
    client: OAuth2Server.Client,
    callback?: OAuth2Server.Callback<false | "" | 0 | OAuth2Server.User>
  ): Promise<false | "" | 0 | OAuth2Server.User> {
    console.log("getUserFromClient");
    return new Promise((resolve, reject) => {
      const userId = (client.user as User)._id;
      UserModel.findById(userId)
        .then((user) => {
          callback(null, user);
          resolve(user);
        })
        .catch((error) => {
          callback(error, null);
          reject(error);
        });
    });
  }
  /**
   * Invoked to retrieve an existing authorization code previously saved through Model.saveAuthorizationCode().
   * @required
   * @param authorizationCode The authorization code to retrieve.
   * @param callback Node-style callback to be used instead of the returned `Promise`.
   */
  getAuthorizationCode(
    authorizationCode: string,
    callback?: OAuth2Server.Callback<OAuth2Server.AuthorizationCode>
  ): Promise<false | "" | 0 | OAuth2Server.AuthorizationCode> {
    console.log("getAuthorizationCode");
    return new Promise((resolve, reject) => {
      AuthorizationCodeModel.findOne({
        authorizationCode: authorizationCode,
      })
        .populate("user")
        .populate("client")
        .then((_code) => {
          const code: OAuth2Server.AuthorizationCode = {
            authorizationCode: _code.authorizationCode,
            expiresAt: new Date(_code.expiresAt),
            redirectUri: _code.redirectUri,
            scope: _code.scope,
            client: _code.client as OAuth2Server.Client,
            user: _code.user as OAuth2Server.User,
          };

          callback(null, code);
          resolve(code);
        })
        .catch((error) => {
          callback(error, null);
          reject(error);
        });
    });
  }
  /**
   * Invoked to save an authorization code.
   * @required
   * @param code The code to be saved.
   * @param client The client associated with the authorization code.
   * @param user The user associated with the authorization code.
   * @param callback Node-style callback to be used instead of the returned `Promise`.
   */
  saveAuthorizationCode(
    code: Pick<
      OAuth2Server.AuthorizationCode,
      "scope" | "authorizationCode" | "expiresAt" | "redirectUri"
    >,
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
    callback?: OAuth2Server.Callback<OAuth2Server.AuthorizationCode>
  ): Promise<false | "" | 0 | OAuth2Server.AuthorizationCode> {
    console.log("saveAuthorizationCode");
    return new Promise((resolve, reject) => {
      new AuthorizationCodeModel({
        user: user._id,
        client: client._id,
        authorizationCode: code.authorizationCode,
        expiresAt: code.expiresAt,
        scope: code.scope,
        redirectUri: code.redirectUri,
      })
        .save()
        .then((_code) => {
          const code: OAuth2Server.AuthorizationCode = {
            authorizationCode: _code.authorizationCode,
            expiresAt: new Date(_code.expiresAt),
            redirectUri: _code.redirectUri,
            scope: _code.scope,
            client: _code.client as OAuth2Server.Client,
            user: _code.user as OAuth2Server.User,
          };

          callback(null, code);
          resolve(code);
        })
        .catch((error) => {
          callback(error, null);
          reject(error);
        });
    });
  }
  /**
   * Invoked to revoke an authorization code.
   * @required
   * @param code The return value.
   * @param callback Node-style callback to be used instead of the returned `Promise`.
   */
  revokeAuthorizationCode(
    code: OAuth2Server.AuthorizationCode,
    callback?: OAuth2Server.Callback<boolean>
  ): Promise<boolean> {
    console.log("revokeAuthorizationCode");
    return new Promise((resolve, reject) => {
      AuthorizationCodeModel.findOneAndDelete({
        authorizationCode: code.authorizationCode,
      })
        .then(async (code) => {
          let result = await AuthorizationCodeModel.findOne({
            authorizationCode: code.authorizationCode,
          });

          if (result) {
            callback(null, false);
            resolve(false);
          } else {
            callback(null, true);
            resolve(true);
          }
        })
        .catch((error) => {
          callback(error, null);
          reject(error);
        });
    });
  }
  /**
   * Invoked to retrieve a client using a client id or a client id/client secret combination, depending on the grant type.
   * @required
   * @param clientId The client id of the client to retrieve.
   * @param clientSecret The client secret of the client to retrieve. Can be `null`.
   * @param callback Node-style callback to be used instead of the returned `Promise`.
   */
  getClient(
    clientId: string,
    clientSecret: string,
    callback?: OAuth2Server.Callback<false | "" | 0 | OAuth2Server.Client>
  ): Promise<false | "" | 0 | OAuth2Server.Client> {
    console.log("getClient");
    return new Promise((resolve, reject) => {
      ClientModel.findOne({
        clientId: clientId,
      })
        .then((client) => {
          callback(null, client as OAuth2Server.Client);
          resolve(client as OAuth2Server.Client);
        })
        .catch((error) => {
          callback(error, null);
          reject(error);
        });
    });
  }
  /**
   * Invoked to save an access token and optionally a refresh token, depending on the grant type.
   * @required
   * @param token The token(s) to be saved.
   * @param client The client associated with the token(s).
   * @param user The user associated with the token(s).
   * @param callback Node-style callback to be used instead of the returned `Promise`.
   */
  saveToken(
    token: OAuth2Server.Token,
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
    callback?: OAuth2Server.Callback<OAuth2Server.Token>
  ): Promise<false | "" | 0 | OAuth2Server.Token> {
    console.log("saveToken");
    return new Promise((resolve, reject) => {
      new AccessTokenModel({
        user: user._id,
        client: client._id,
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        scope: token.scope,
      })
        .save()
        .then((accessToken) => {
          AccessTokenModel.findById(accessToken._id)
            .populate("user")
            .populate("client")
            .then((_token) => {
              let token: OAuth2Server.Token = {
                accessToken: _token.accessToken,
                accessTokenExpiresAt: _token.accessTokenExpiresAt,
                refreshToken: _token.refreshToken,
                refreshTokenExpiresAt: _token.refreshTokenExpiresAt,
                scope: _token.scope,
                client: _token.client as OAuth2Server.Client,
                user: _token.user as User,
              };
              callback(null, token);
              resolve(token);
            })
            .catch((error) => {
              callback(error, null);
              reject(error);
            });
        })
        .catch((error) => {
          callback(error, null);
          reject(error);
        });
    });
  }
  /**
   * Invoked to retrieve an existing access token previously saved through Model.saveToken().
   * @required
   * @param accessToken The access token to retrieve.
   * @param callback Node-style callback to be used instead of the returned `Promise`.
   */
  getAccessToken(
    accessToken: string,
    callback?: OAuth2Server.Callback<OAuth2Server.Token>
  ): Promise<false | "" | 0 | OAuth2Server.Token> {
    console.log("getAccessToken");
    return new Promise((resolve, reject) => {
      AccessTokenModel.findOne({ accessToken: accessToken })
        .populate("user")
        .populate("client")
        .then((_token) => {
          if (_token) {
            let token: OAuth2Server.Token = {
              accessToken: _token.accessToken,
              accessTokenExpiresAt: _token.accessTokenExpiresAt,
              refreshToken: _token.refreshToken,
              refreshTokenExpiresAt: _token.refreshTokenExpiresAt,
              scope: _token.scope,
              client: _token.client as OAuth2Server.Client,
              user: _token.user as User,
            };
            callback(null, token);
            resolve(token);
          } else {
            callback(new Error("tokenNotFound"), null);
            reject(new Error("tokenNotFound"));
          }
        })
        .catch((error) => {
          callback(error, null);
          reject(error);
        });
    });
  }
  /**
   * Invoked during request authentication to check if the provided access token was authorized the requested scopes.
   * @required
   * @param token The access token to test against
   * @param scope The required scopes.
   * @param callback Node-style callback to be used instead of the returned `Promise`.
   */
  verifyScope(
    token: OAuth2Server.Token,
    scope: string | string[],
    callback?: OAuth2Server.Callback<boolean>
  ): Promise<boolean> {
    console.log("verifyScope");
    return new Promise((resolve, reject) => {
      AccessTokenModel.findOne({
        scope: scope,
        accessToken: token.accessToken,
      })
        .then((accessToken) => {
          if (accessToken) {
            callback(null, true);
            resolve(true);
          } else {
            callback(null, false);
            resolve(false);
          }
        })
        .catch((error) => {
          callback(error, null);
          reject(error);
        });
    });
  }
  /**
   * Return the encrypted version of the given password using `crypto.pbkdf2`.
   * @param password The password to be encrypted.
   */
  private static encryptPassword = (password: string): string =>
    crypto
      .pbkdf2Sync(password, process.env.SALT, 10000, 32, "sha512")
      .toString("hex");
}
