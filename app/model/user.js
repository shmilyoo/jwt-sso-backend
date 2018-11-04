'use strict';

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, CHAR } = app.Sequelize;

  const User = db.defineModel(app, 'user', {
    username: { type: STRING(16), unique: true }, // 用户名
    password: { type: STRING }, // 密码
    name: { type: STRING(8), defaultValue: '' }, // 姓名
    sex: { type: INTEGER.UNSIGNED, defaultValue: 0 }, // 用户性别：1男性, 2女性, 0未知
    birthday: { type: INTEGER, defaultValue: 0 }, // 生日 utc时间戳 0默认'1970-01-01',int会有2038问题，可以用bigint
    active: { type: INTEGER, defaultValue: 1 }, // 账户状态: 0正常，1未激活,2禁用
    dept_id: { type: CHAR(32), defaultValue: '0' },
    nation: { type: STRING(8), defaultValue: '' }, // 民族
    id_card: { type: STRING(32), defaultValue: '' }, // 身份证号
    id_card2: { type: STRING(32), defaultValue: '' }, // 第二个证件号
    native_place: { type: STRING(16), defaultValue: '' }, // 籍贯
    phone: { type: STRING(32), defaultValue: '' },
    married: { type: BOOLEAN, defaultValue: false }, // 婚否
  });

  User.associate = function() {
    User.belongsTo(app.model.Dept, {
      as: 'dept',
      foreignKey: 'dept_id',
      constraints: false,
    });
    User.belongsToMany(app.model.Sso, {
      as: 'ssos',
      constraints: false,
      through: app.model.UserSso,
      foreignKey: 'user_id',
      otherKey: 'sso_id',
    });
    User.hasMany(app.model.UserBind, {
      as: 'binds',
      foreignKey: 'user_id',
      constraints: false,
    });
    // User.hasMany(app.model.Exp, {
    //   as: 'educations',
    //   foreignKey: 'user_id',
    //   constraints: false,
    //   scope: {
    //     type: 'education',
    //   },
    // });
    // User.hasMany(app.model.Exp, {
    //   as: 'works',
    //   foreignKey: 'user_id',
    //   constraints: false,
    //   scope: {
    //     type: 'work',
    //   },
    // });
  };

  return User;
};
