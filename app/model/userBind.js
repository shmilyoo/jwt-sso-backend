'use strict';
// 第三方系统A可以直接注册登录，登陆后，用户需要绑定sso用户进行实名，这里存储了这个绑定关系。
// 第三方用户在本系统内进行绑定，然后申请。用户需要到sso进行允许绑定操作。

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, CHAR, BOOLEAN } = app.Sequelize;

  const UserSso = db.defineModel(app, 'user_bind', {
    user_id: { type: CHAR(32) },
    sys_id: { type: CHAR(32) }, // 系统id,对应sso表
    sys_user_id: { type: CHAR(32) }, // 系统对应user的id，用于系统注册用户绑定sso用户
    sys_user_name: { type: STRING(16) }, // 系统的用户名
    agreed: { type: BOOLEAN, defaultValue: false }, // sso 系统用户是否已经同意授权绑定
  });

  return UserSso;
};
