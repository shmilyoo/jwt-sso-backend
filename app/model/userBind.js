'use strict';
// 第三方系统A可以直接注册登录，登陆后，用户需要绑定sso用户进行实名，这里存储了这个绑定关系。
// 第三方用户在本系统内进行绑定，然后申请。用户需要到sso进行允许绑定操作。

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, CHAR, BOOLEAN } = app.Sequelize;

  const UserBind = db.defineModel(app, 'user_bind', {
    user_id: { type: CHAR(32), unique: 'userBindUnique' },
    sso_symbol: { type: CHAR(16), unique: 'userBindUnique' }, // 系统symbol,对应sso表
    sso_username: { type: STRING(16) }, // 第三方系统的用户名
    agreed: { type: BOOLEAN, defaultValue: false }, // sso 系统用户是否已经同意授权绑定
  });

  UserBind.associate = function() {
    UserBind.belongsTo(app.model.User, {
      as: 'user',
      foreignKey: 'user_id',
      constraints: false,
    });
  };

  return UserBind;
};
