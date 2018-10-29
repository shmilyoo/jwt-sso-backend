'use strict';
// 对每个用户来说，每个第三方系统进行单点登录均需要单独授权，增强安全性

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, CHAR, BOOLEAN } = app.Sequelize;

  const UserSso = db.defineModel(app, 'user_sso', {
    user_id: { type: CHAR(32) },
    sso_id: { type: CHAR(32) }, // 系统id,对应sso表
  });

  return UserSso;
};
