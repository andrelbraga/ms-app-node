import { ServiceContext } from '../typings';
import jsonwebtoken from 'jsonwebtoken';
import { Logger as logger } from '../config/logger';

export class AuthService {
  private readonly keycloakIntegration: ServiceContext['keycloakIntegration'];
  private readonly accessManagerIntegration: ServiceContext['accessManagerIntegration'];
  protected accessTokens = new Map();

  constructor(context: ServiceContext) {
    this.accessManagerIntegration = context.accessManagerIntegration;
    this.keycloakIntegration = context.keycloakIntegration;
  }
  async getAccessGroup(userToken: any) {
    const decodedToken: any = jsonwebtoken.decode(userToken);
    let accessGroup = '';

    if (decodedToken !== null) {
      const { groups } = decodedToken;
      accessGroup = groups;
    }
    return accessGroup[0];
  }
  async getClientCredentials(scopes?: any) {
    try {
      const response = await this.keycloakIntegration.getClientCredentials(
        scopes,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getScopes(accessGroup: any, applicationToken: any) {
    const scopes = await this.accessManagerIntegration.getScopes(
      accessGroup,
      applicationToken,
    );
    return scopes.data;
  }
  async verifyToken(accessGroup: any) {
    try {
      return this.accessTokens.has(accessGroup);
    } catch (error) {
      throw error;
    }
  }
  async storeToken(
    accessGroup: any,
    scopedApplicationToken: any,
    expirationTime: any,
  ) {
    try {
      const timer = Math.ceil(expirationTime * 1000 * 0.9);
      const deleteToken = () => {
        this.accessTokens.delete(accessGroup);
        logger.info(`A token with ${accessGroup} key has been deleted`);
      };

      this.accessTokens.set(accessGroup, scopedApplicationToken);
      logger.info(`A token with ${accessGroup} key has been created`);

      setTimeout(() => {
        deleteToken();
      }, timer);
    } catch (error) {
      throw error;
    }
  }
  async getStoredToken(accessGroup: any) {
    try {
      return this.accessTokens.get(accessGroup);
    } catch (error) {
      throw error;
    }
  }
  async addScopeProperty(responseData: any, scopes: any) {
    Object.defineProperty(responseData, 'scope', {
      value: scopes,
      enumerable: true,
    });
    return responseData;
  }
  async addScopesIntoResponse(response: any) {
    try {
      const { access_token: userToken } = response;
      const accessGroup = await this.getAccessGroup(userToken);
      const verifyTokenByDefault = await this.verifyToken('default');
      let applicationToken;
      let expirationTime;

      if (!verifyTokenByDefault) {
        const clientCredentials = await this.getClientCredentials();
        const { access_token, expires_in } = clientCredentials;
        applicationToken = access_token;
        expirationTime = expires_in;
        await this.storeToken('default', applicationToken, expirationTime);
      } else {
        applicationToken = await this.getStoredToken('default');
      }
      const scopes = await this.getScopes(accessGroup, applicationToken);
      const scopedResponse = await this.addScopeProperty(response, scopes);
      return scopedResponse;
    } catch (error) {
      throw error;
    }
  }
}
