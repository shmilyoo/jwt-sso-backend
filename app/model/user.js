'use strict';

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, DATE, DATEONLY, BOOLEAN } = app.Sequelize;

  const User = db.defineModel(app, 'users', {
    username: { type: STRING, unique: true }, // 用户名
    password: { type: STRING }, // 密码
    name: { type: STRING, defaultValue: '' }, // 姓名
    sex: { type: INTEGER, defaultValue: 0 }, // 用户性别：1男性, 2女性, 0未知
    birth: { type: DATEONLY, defaultValue: '1970-01-01' }, // 生日
    active: { type: INTEGER, defaultValue: 1 }, // 账户状态: 0正常，1未激活,2禁用
    // age: INTEGER, // 年龄
    // avatar: STRING, // 头像
    // lastSignInAt: DATE, // 上次登录时间
  });

  return User;
};
