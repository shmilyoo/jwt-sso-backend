'use strict';
// 项目中在helper中定义一些不需要app/ctx等上下文的帮助函数,但会在app/ctx中调用

module.exports = {
  /**
   *
   * @param {boolean} success 返回请求是否成功
   * @param {Object} dataOrError success为true时为object，false时为错误描述字符串
   * @return {object} {success:true,{...data}}或者{success:false,error:string}
   */
  getRespBody(success, dataOrError) {
    return success
      ? { success, data: dataOrError }
      : { success, error: dataOrError };
  },
};
