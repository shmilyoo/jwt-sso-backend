'use strict';

const Controller = require('egg').Controller;
const generateUUID = require('../utils').generateUUID;

class HomeController extends Controller {
  async index() {
    this.app;
    this.ctx.session.aaa = { bb: 12 };
    this.ctx.session.bbb = { bbbbb: 1223 };
    this.ctx.body = { id: generateUUID() };
    this.ctx.logger.info(this.app.config.env);
    this.ctx.logger.info(process.pid);
  }
}

module.exports = HomeController;
