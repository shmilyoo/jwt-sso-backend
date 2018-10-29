'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');

class AuthController extends Controller {
  async login() {
    const ctx = this.ctx;
    const {
      username,
      password,
      remember,
      from,
      redirect,
      token,
    } = ctx.request.body;
    const sso = await this.service.sso.getSsoFromSymbol(from);
    if (!sso) {
      ctx.body = ctx.helper.getRespBody(
        false,
        '系统中找不到注册的第三方系统,请联系系统管理员'
      );
    }
    // 成功返回true，失败返回error message
    const check = await this.service.auth.checkAuthToken(sso.code, token);
    if (check !== true) {
      // 验证token失败
      ctx.body = ctx.helper.getRespBody(false, check);
      return;
    }
    // sso第三方系统存在，token有效，继续验证用户登录，并增加用户验证授权表的相关行
    const user = await ctx.service.auth.getUserWithAuth(
      username,
      password,
      sso.id
    );
    if (!user) {
      ctx.body = ctx.helper.getRespBody(false, '用户名密码不正确');
      return;
    }
    if (user.active !== 0) {
      ctx.body = ctx.helper.getRespBody(false, '用户没有激活或被禁用');
      return;
    }
    if (user.ssos.length === 0) {
      // 此用户尚未对此第三方系统授权，在此增加授权表条目
      await ctx.model.UserSso.create({
        user_id: user.id,
        sso_id: sso.id,
      });
      // user.ssos.push(sso);
    }
    // 更新缓存，更新cookie
    const [ expires, maxAge ] = ctx.helper.getExpiresAndMaxAge('week', 1);
    await ctx.service.account.setCache(user, maxAge, remember, sso.symbol);
    await ctx.service.account.setCookie(user, maxAge, expires, remember);
    const tokenReply = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 15,
        authType: 'sso',
        user: { id: user.id, active: user.active },
        remember,
      },
      sso.code
    );
    // location用来302重定向，redirect用来保留url query
    ctx.body = ctx.helper.getRespBody(true, {
      token: tokenReply,
      redirect,
    });
  }
}

module.exports = AuthController;
