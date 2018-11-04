'use strict';

const Service = require('egg').Service;

class AccountService extends Service {
  async checkUserPasswd(username, password) {
    username = username.toLowerCase();
    password = await this.service.common.getCryptoPasswd(password, username);
    const user = await this.ctx.model.User.findOne({
      where: { username, password },
    });
    return user;
  }

  async getBasicInfo(id) {
    const user = await this.ctx.model.User.findOne({
      where: { id },
      attributes: [
        'name',
        'sex',
        'birthday',
        'dept_id',
        'nation',
        'id_card',
        'id_card2',
        'native_place',
        'phone',
        'married',
      ],
      raw: true,
    });
    if (!user) return null;
    const dept_id = user.dept_id;
    if (dept_id === '0') {
      // 用户初始化后未设置dept，默认为0
      user.dept = null;
    } else {
      const depts = await this.service.dept.getDeptWithAncestor(dept_id);
      const names = [];
      depts.forEach(dept => {
        names.push(dept.name);
      });
      user.dept = {
        id: dept_id,
        names: names.join('-'),
        name: names[names.length - 1],
      };
    }
    delete user.dept_id;
    return user;
  }

  /**
   * 设置sso用户缓存，用于标记用户已经授权且登录的第三方系统，并可以辅助统一退出
   * @param {object} user user对象，必须包含id，username，active属性
   * @param {number} maxAge 过期时间
   * @param {boolean} remember 是否记住用户
   * @param {string} ssoSymbol 第三方系统的符号
   */
  async setCache(user, maxAge, remember, ssoSymbol) {
    const userId = `sso:user:${user.id}`;
    const cacheStr = await this.ctx.app.redis.get(userId);
    const cache = JSON.parse(cacheStr) || {};
    cache.username = user.username;
    cache.active = user.active;
    if (!cache.auth) {
      cache.auth = [ ssoSymbol ];
    } else {
      !cache.auth.includes(ssoSymbol) && cache.auth.push(ssoSymbol);
    }
    await this.ctx.app.redis.set(
      userId,
      JSON.stringify(cache),
      'ex',
      remember ? maxAge / 1000 : 3600
    );
  }

  async setCookie(user, maxAge, expires, remember) {
    const ctx = this.ctx;
    ctx.helper.setCookie(
      'uid',
      user.id,
      remember ? { maxAge, expires, httpOnly: true } : { httpOnly: true }
    );
    ctx.helper.setCookie(
      'username',
      user.username,
      remember ? { maxAge, expires } : null
    );
    ctx.helper.setCookie(
      'active',
      `${user.active}`,
      remember ? { maxAge, expires } : null
    );
  }

  async getExp() {}
}

module.exports = AccountService;
