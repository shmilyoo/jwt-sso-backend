'use strict';

const Service = require('egg').Service;

class SsoService extends Service {
  async getAll() {
    const ssoList = await this.ctx.model.Sso.findAll({
      order: [ 'symbol' ],
      raw: true,
    });
    return ssoList;
  }

  async getSsoFromSymbol(symbol) {
    const sso = await this.ctx.model.Sso.findOne({
      where: { symbol },
    });
    return sso;
  }
}

module.exports = SsoService;
