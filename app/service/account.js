'use strict';

const Service = require('egg').Service;

class AccountService extends Service {
  async checkUserPasswd(username, password) {
    username = username.toLowerCase();
    password = await this.service.common.getCryptoPasswd(password, username);
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    const user = await this.ctx.model.User.findOne({
      attributes: [ 'username', 'password', 'active' ],
      where: { username, password },
    });
    return user;
  }
}

module.exports = AccountService;
