'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/test', controller.home.test);
  router.get('/account/check/:username', controller.account.checkUser);
  router.get('/account/info/:username', controller.account.getInfo);
  router.post('/account/login', controller.account.login);
  router.post('/account/reg', controller.account.reg);
  router.get('/dept/all', controller.dept.getAll);
  router.post('/dept/add', controller.dept.addDept);
  router.get('/dept/:id', controller.dept.getDept);
  router.get('/dept/check-symbol/:symbol', controller.dept.checkSymbol);
  router.post('/dept/update', controller.dept.updateDept);
  router.post('/dept/delete', controller.dept.deleteDept);
  router.post('/dept/move', controller.dept.moveDept);
};
