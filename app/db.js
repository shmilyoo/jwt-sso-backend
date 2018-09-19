// 定义数据库表的一些规范
'use strict';

const { generateUUID } = require('./utils');

function defineModel(app, name, attributes) {
  const { UUID } = app.Sequelize;
  const attrs = {};
  for (const key in attributes) {
    const value = attributes[key];
    if (typeof value === 'object' && value.type) {
      value.allowNull = value.allowNull || false;
      attrs[key] = value;
    } else {
      attrs[key] = {
        type: value,
        allowNull: false,
      };
    }
  }
  attrs.id = {
    type: UUID,
    primaryKey: true,
    defaultValue: () => {
      return generateUUID();
    },
  };
  return app.model.define(name, attrs, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    version: true,
    freezeTableName: true,
  });
}

module.exports = { defineModel };
