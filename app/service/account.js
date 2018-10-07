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
      attributes: [ 'id', 'username', 'password', 'active' ],
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

  async getExp() {}
}

module.exports = AccountService;
