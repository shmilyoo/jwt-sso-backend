'use strict';

const Controller = require('egg').Controller;
const jwt = require('jwt-simple');

class AccountController extends Controller {
  async reg() {
    const ctx = this.ctx;
    const body = ctx.request.body;
    let { username, password } = body;
    username = username.toLowerCase();
    password = await this.service.common.getCryptoPasswd(password, username);
    await ctx.model.User.create({ username, password });
    ctx.body = ctx.helper.getRespBody(true, { username });
    // ctx.body = { success: true, username };
  }

  /**
   * 用户注册时后台异步验证用户名是否已经占用/是否可用
   */
  async checkUser() {
    const ctx = this.ctx;
    const username = ctx.params.username.toLowerCase();
    const user = await ctx.model.User.findOne({ where: { username } });
    ctx.body = ctx.helper.getRespBody(true, {
      isNameExist: !!user,
    });
  }

  async getInfo() {
    const ctx = this.ctx;
    console.log('get info');
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
    ctx.body = ctx.helper.getRespBody(false, 'no user');
  }

  async login() {
    const ctx = this.ctx;
    const body = ctx.request.body;
    let { username, password } = body;
    username = username.toLowerCase();
    password = await this.service.common.getCryptoPasswd(password, username);
    const user = await ctx.model.User.findOne({
      attributes: [ 'username', 'password', 'active' ],
      where: { username, password },
    });
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
    if (user) {
      const token = jwt.encode(
        { username, active: user.active },
        this.config.jwtSecrect
      );
      // 修改redis本地缓存信息
      ctx.body = ctx.helper.getRespBody(true, {
        username: user.username,
        active: user.active,
        token,
      });
    } else {
      ctx.body = ctx.helper.getRespBody(false, '用户名或密码不正确');
    }
  }
}

module.exports = AccountController;
