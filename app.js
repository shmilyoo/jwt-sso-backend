'use strict';

module.exports = app => {
  app.logger.info('应用启动，进程id： ' + process.pid);
  if (app.config.env === 'local' || app.config.env === 'unittest') {
    app.beforeStart(async () => {
      app.logger.info('开始同步数据库表');
      await app.model.sync({ force: true });
      const user1 = app.model.User.create({
        username: 'aaaa',
        password: 'aaaa',
        name: '张三',
        sex: 1,
        birth: '1982-10-11',
        active: 0,
      });
      const user2 = app.model.User.create({
        username: 'bbbb',
        password: 'bbbb',
        name: '李四',
        sex: 2,
        birth: '1999-03-11',
        active: 1,
      });
      const user3 = app.model.User.create({
        username: 'cccc',
        password: 'cccc',
        name: '李峰',
        sex: 2,
        birth: '1989-03-11',
        active: 2,
      });
      app.logger.info('同步数据库表完毕');
    });
  }
};
