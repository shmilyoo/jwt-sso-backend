'use strict';

exports.keys = 'jwt-sso-backend_1534471453595_4522';
exports.middleware = [];
exports.sequelize = {
  dialect: 'mysql',
  hostname: 'localhost',
  port: 3306,
  database: 'sso',
  username: 'root',
  password: 'root',
};
exports.redis = {
  client: {
    host: '127.0.0.1',
    port: 6379,
    password: null,
    db: '0',
  },
  agent: true,
};
exports.logger = {
  dir: '/var/log/jwt-sso-backend',
};
exports.security = {
  csrf: {
    enable: false,
  },
};
exports.cors = {
  origin: 'http://localhost:3000',
  credentials: true,
  allowMethods: 'GET,POST,PUT,HEAD,DELETE,OPTIONS',
};
exports.onerror = {
  all(err, ctx) {
    ctx.body = { success: false, error: `服务端错误，${err.message}` };
    ctx.status = 200;
  },
};
exports.jwtSecrect = 'qwert12345yuiop54321';
exports.salt = 'dsioiwerfdsafsdkl#4343@kfd'; // 用户密码加盐 md5(md5-password+salt)

const a = {
  config: {
    transformRequest: {},
    transformResponse: {},
    timeout: 3000,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    withCredentials: true,
    method: 'post',
    url: 'http://localhost:7001/dept/add',
    data: 'name=fsdfdsfds&symbol=fdsf&parentId=0',
    baseURL: 'http://localhost:7001',
  },
  request: {},
  response: {
    data: {
      success: false,
      error: '服务端错误，notNull Violation: dept.intro cannot be null',
    },
    status: 302,
    statusText: 'Found',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    config: {
      transformRequest: {},
      transformResponse: {},
      timeout: 3000,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      maxContentLength: -1,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: true,
      method: 'post',
      url: 'http://localhost:7001/dept/add',
      data: 'name=fsdfdsfds&symbol=fdsf&parentId=0',
      baseURL: 'http://localhost:7001',
    },
    request: {},
  },
};
