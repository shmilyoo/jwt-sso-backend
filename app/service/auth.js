'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const util = require('util');

class AuthService extends Service {
  async checkAuthToken(key, token) {
    const verify = util.promisify(jwt.verify);
    try {
      await verify(token, key);
      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return 'token已经过期，请从原系统重新进入';
      }
      if (error instanceof jwt.JsonWebTokenError) return 'token不正确';
      return `token验证发生未知错误，error:${error}`;
    }
  }

  async getUserWithAuth(username, password, sso_id) {
    username = username.toLowerCase();
    password = await this.service.common.getCryptoPasswd(password, username);
    const user = await this.ctx.model.User.findOne({
      include: [
        {
          model: this.ctx.model.Sso,
          as: 'ssos',
          where: { id: sso_id },
          required: false,
        },
      ],
      attributes: [ 'id', 'username', 'password', 'active' ],
      where: { username, password },
    });
    return user;
  }
}

module.exports = AuthService;
