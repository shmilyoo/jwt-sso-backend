'use strict';

const db = require('../db');

module.exports = app => {
  const { STRING, INTEGER, CHAR } = app.Sequelize;

  const Exp = db.defineModel(app, 'exp', {
    user_id: { type: CHAR(32) },
    type: { type: STRING(16) }, // 类别，education or work
    from: { type: INTEGER }, // 起始日期
    to: { type: INTEGER, allowNull: true }, // 结束日期 null 代表至今
    content: { type: STRING(64) }, // 经历内容
  });

  Exp.associate = function() {
    Exp.belongsTo(app.model.User, {
      constrains: false,
      foreignKey: 'user_id',
    });
  };

  return Exp;
};
