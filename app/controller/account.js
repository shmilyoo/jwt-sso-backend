'use strict';

const Controller = require('egg').Controller;
const jwt = require('jwt-simple');

class AccountController extends Controller {
  async reg() {
    const { ctx, config } = this;
    const body = ctx.request.body;
    let { username, password } = body;
    username = username.toLowerCase();
    if (config.usernameBlackList.includes(username)) {
      ctx.body = ctx.helper.getRespBody(false, '非法的用户名');
    } else {
      password = await this.service.common.getCryptoPasswd(password, username);
      await ctx.model.User.create({ username, password });
      ctx.body = ctx.helper.getRespBody(true, { username });
    }
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

  /**
   * //用户首次加载网页，若本地有cookie，则发送认证请求到服务器
   * 暂时取消此方法，相关功能在中间件实现
   */
  async auth() {
    const ctx = this.ctx;
    // 获取client的cookie uid user active,根据uid获取redis中设置，与user和active比较
    // 若一致则返回正常，不一致则返回未授权并清空客户端cookie
    const id = ctx.helper.getCookie('uid');
    const username = ctx.helper.getCookie('username');
    const active = Number.parseInt(ctx.helper.getCookie('active'));
    const authInfo = JSON.parse(await ctx.app.redis.get(`sso-user-${id}`));
    if (
      authInfo &&
      authInfo.username === username &&
      authInfo.active === active
    ) {
      ctx.body = ctx.helper.getRespBody(true);
    } else {
      // 验证失败，清除cookie，返回401错误
      ctx.helper.setCookie('uid', '');
      ctx.helper.setCookie('username', '');
      ctx.helper.setCookie('active', '');
      ctx.status = 401;
      ctx.body = ctx.helper.getRespBody(false, '用户认证失败');
    }
  }

  async basicInfo() {
    const ctx = this.ctx;
    // const {} = ctx.request.body;
    const userId = ctx.user.id;
    const userInfo = await ctx.service.account.getBasicInfo(userId);
    ctx.body = ctx.helper.getRespBody(
      !!userInfo,
      userInfo ? userInfo : '找不到对应的用户信息'
    );
  }

  async updateBasicInfo() {
    const ctx = this.ctx;
    const {
      birthday,
      married,
      sex,
      id_card,
      id_card2,
      name,
      nation,
      native_place,
      phone,
      dept: { id: dept_id },
    } = ctx.request.body;
    const userId = ctx.user.id;
    // const birthday = Number.parseInt(_birthday) || 0;
    // const married = _married === 'true';
    // const sex = Number.parseInt(_sex) || 0;
    const response = await ctx.model.User.update(
      {
        birthday,
        married,
        sex,
        id_card,
        id_card2,
        name,
        nation,
        native_place,
        phone,
        dept_id,
        active: 0, // 未激活用户在完善基本信息后完成激活
      },
      { where: { id: userId } }
    );
    if (response && response.length > 0 && response[0] > 0) {
      ctx.body = ctx.helper.getRespBody(true);
    } else {
      ctx.body = ctx.helper.getRespBody(false, '更新失败');
    }
  }

  async getExp() {
    const ctx = this.ctx;
    const type = ctx.params.type;
    if (type !== 'work' && type !== 'education') throw '错误的请求类别';
    const response = await ctx.model.Exp.findAll({
      attributes: [ 'from', 'to', 'content' ],
      where: { user_id: ctx.user.id, type },
      raw: true,
    });
    ctx.body = ctx.helper.getRespBody(true, response);
  }

  async setExp() {
    const ctx = this.ctx;
    const type = ctx.params.type;
    if (type !== 'work' && type !== 'education') throw '错误的请求类别';
    const userId = ctx.user.id;
    const values = ctx.request.body;
    values.forEach(exp => {
      exp.type = type;
      exp.to = exp.to || null;
      exp.user_id = userId;
    });
    const transaction = await ctx.model.transaction();
    try {
      await ctx.model.Exp.destroy({
        where: { user_id: userId, type },
        transaction,
      });
      await ctx.model.Exp.bulkCreate(values, { transaction });
      await transaction.commit();
      const newExps = await ctx.model.Exp.findAll({
        where: { user_id: userId, type },
        order: [ 'from' ],
        attributes: [ 'from', 'to', 'content' ],
        raw: true,
      });
      ctx.body = ctx.helper.getRespBody(true, newExps);
    } catch (error) {
      await transaction.rollback();
      ctx.body = ctx.helper.getRespBody(false, `保存失败-${error.message}`);
    }
  }

  async login() {
    const ctx = this.ctx;
    const body = ctx.request.body;
    const { username, password, remember } = body;
    // remember = remember === 'true'; // qs编码的form格式bodyparser解析boolean为string
    const user = await ctx.service.account.checkUserPasswd(username, password);
    if (user) {
      // 登录认证通过，设置cookie，服务端session
      const [ expires, maxAge ] = ctx.helper.getExpiresAndMaxAge('week', 1);
      await ctx.server.account.setCache(user, maxAge, remember);
      await ctx.service.account.setCookie(user, maxAge, expires, remember);
      // todo 修改redis本地缓存信息
      ctx.body = ctx.helper.getRespBody(true, {
        id: user.id,
        username: user.username,
        active: user.active,
      });
    } else {
      ctx.body = ctx.helper.getRespBody(false, '用户名或密码不正确');
    }
  }

  async logout() {
    const ctx = this.ctx;
    await ctx.app.redis.del(`sso-user-${ctx.user.id}`);
    ctx.helper.setCookie('uid', '');
    ctx.helper.setCookie('username', '');
    ctx.helper.setCookie('active', '');
    ctx.body = ctx.helper.getRespBody(true);
  }
}

module.exports = AccountController;
