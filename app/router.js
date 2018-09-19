'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/account/reg', controller.account.reg);
  router.get('/account/check/:username', controller.account.checkUser);
  router.get('/account/info/:username', controller.account.getInfo);
  router.post('/account/login', controller.account.login);
};
