'use strict';

module.exports = app => {
  app.logger.info('应用启动，进程id： ' + process.pid);
  if (app.config.env === 'local' || app.config.env === 'unittest') {
    app.beforeStart(async () => {
      app.logger.info('开始同步数据库表');
      await app.model.sync({ force: true });

      const deptRoot = await app.model.Dept.create({
        id: 'c360d5f0ceef11e8b013f53754442dd4',
        symbol: 'jd',
        name: '基地',
        intro: '基地根节点',
        // parent: Array(33).join('0'),
        parent_id: '0',
        path: '',
        level: 1,
      });
      const deptChild = await app.model.Dept.create({
        symbol: '1jd',
        name: '思灵不',
        intro: '子节点思灵不',
        // parent: Array(33).join('0'),
        parent_id: 'c360d5f0ceef11e8b013f53754442dd4',
        path: 'jd-',
        order: 1,
        level: 2,
      });
      const deptChild1 = await app.model.Dept.create({
        symbol: '2jd',
        name: '哈哈发',
        intro: '子212121节点思灵不',
        // parent: Array(33).join('0'),
        parent_id: 'c360d5f0ceef11e8b013f53754442dd4',
        path: 'jd-',
        order: 2,
        level: 2,
      });
      const user1 = await app.model.User.create({
        username: 'aaaa',
        password: 'aaaa',
        name: '张三',
        sex: 1,
        birth: 12123443,
        active: 0,
        dept_id: 'c360d5f0ceef11e8b013f53754442dd4',
      });
      const user2 = await app.model.User.create({
        username: 'bbbb',
        password: 'bbbb',
        name: '李四',
        sex: 2,
        birth: 2323232,
        active: 1,
        dept_id: 'c360d5f0ceef11e8b013f53754442dd4',
      });
      const user3 = await app.model.User.create({
        username: 'cccc',
        password: 'cccc',
        name: '李峰',
        sex: 2,
        birth: 4333433,
        active: 2,
        dept_id: 'c360d5f0ceef11e8b013f53754442dd4',
      });
      const dddd = await app.model.User.create({
        username: 'dddd',
        password: 'bf535f977eab4e231277e6a24c1fc018',
        name: 'dd滴滴',
        nation: '汉族',
        married: true,
        sex: 2,
        birth: 4333433,
        id_card: 'card1',
        id_card2: 'card2',
        native_place: '安徽',
        phone: '232343434',
        active: 1,
        dept_id: '0',
      });

      app.logger.info('同步数据库表完毕');
      // const test = await app.model.Dept.findOne({
      //   where: { level: 1 },
      //   // limit: 1,
      //   include: [{ model: app.model.Dept, as: 'children' }],
      //   // raw: true,
      // });
      // console.log(test.get({ plain: true }));
      // await app.model.Dept.destroy({ where: { level: 1 } });
    });
  }
};
