/**
 * 淘宝小程序云应用调用封装
 * 使用 cloud.application.httpRequest 调用聚石塔后端
 */

// 云应用 ID
const CLOUD_APP_ID = '59508';

// 后端 API 基础路径
const API_BASE_PATH = '/api.php';

/**
 * 初始化云 SDK
 * 需要在 App.vue 的 onLaunch 中调用
 */
export function initCloud() {
  // #ifdef MP-ALIPAY
  try {
    const cloudModule = require('@tbmp/mp-cloud-sdk');
    const cloud = cloudModule.default || cloudModule;
    cloud.init({
      env: 'online' // 正式环境
    });
    console.log('[taobao-cloud] cloud SDK 初始化成功');
    return cloud;
  } catch (e) {
    console.error('[taobao-cloud] cloud SDK 初始化失败:', e);
    return null;
  }
  // #endif
  return null;
}

/**
 * 获取 cloud 实例
 */
export function getCloud() {
  // #ifdef MP-ALIPAY
  try {
    const app = getApp();
    const cloud = app?.cloud || app?.globalData?.cloud || app?.$vm?.cloud;
    if (cloud) {
      return cloud;
    }
    console.warn('[taobao-cloud] App 上没有 cloud 实例');
    return null;
  } catch (e) {
    console.error('[taobao-cloud] 获取 cloud 实例失败:', e);
    return null;
  }
  // #endif
  return null;
}

/**
 * 调用云应用 HTTP 接口
 * @param {Object} options - 请求配置
 * @param {string} options.action - API 动作名
 * @param {string} options.controller - API 控制器名
 * @param {Object} options.data - 请求数据
 * @param {string} options.method - 请求方法，默认 POST
 * @param {string} options.plugins - 插件名（可选）
 * @param {string} options.group - 分组名，默认 api
 * @returns {Promise} - 返回 Promise
 */
export async function cloudRequest(options) {
  const { action = 'index', controller = 'index', data = {}, method = 'POST', plugins, group = 'api', urlQueryParams = {} } = options;

  console.log('[cloudRequest] 调用云应用, action:', action, 'controller:', controller);

  // #ifdef MP-ALIPAY
  const cloud = getCloud();
  if (!cloud || !cloud.application) {
    console.error('[cloudRequest] cloud 实例不可用');
    throw new Error('云服务不可用');
  }

  // 构建请求路径
  let path = `/${group}.php`;

  // 构建 URL 参数
  let params = {
    s: `${controller}/${action}`,
    ajax: 'ajax',
    application_client_type: 'alipay'
  };

  // 如果是插件请求
  if (plugins) {
    params = {
      s: 'plugins/index',
      pluginsname: plugins,
      pluginscontrol: controller,
      pluginsaction: action,
      ajax: 'ajax'
    };
  }

  // 合并 URL 中的 query 参数（token、uuid 等）到 params，确保 PHP 的 $_GET 能读到
  // 不覆盖已有的 s、ajax 等路由参数
  if (urlQueryParams && typeof urlQueryParams === 'object') {
    Object.keys(urlQueryParams).forEach(k => {
      if (!params.hasOwnProperty(k)) {
        params[k] = urlQueryParams[k];
      }
    });
  }

  // GET：数据放 params
  // POST：数据编码为 URL-encoded 字符串放 body（与登录接口一致的格式，确保云网关能转发）
  let requestBody = '';
  if (method === 'GET' && data) {
    Object.assign(params, data);
  } else if (method === 'POST' && data) {
    const parts = [];
    Object.keys(data).forEach(key => {
      const val = data[key];
      if (val === undefined || val === null) return;
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
    });
    requestBody = parts.join('&');
  }

  console.log('[cloudRequest] path:', path);
  console.log('[cloudRequest] params:', JSON.stringify(params));
  console.log('[cloudRequest] body length:', requestBody.length);

  try {
    const result = await cloud.application.httpRequest({
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      params: params,
      body: requestBody,
      exts: {
        cloudAppId: CLOUD_APP_ID,
        timeout: 120000
      }
    });

    console.log('[cloudRequest] 响应:', JSON.stringify(result).substring(0, 300));

    // 云 SDK 的 httpRequest 返回值可能是：
    // 1. 后端原始 JSON（已自动解包），如 { total:19, list:[...] } 或 { code:0, data:{...} }
    // 2. { data: 后端JSON } 多包了一层
    // 需要返回与 uni.request success 兼容的格式: { data: 后端原始JSON }
    let backendJson = result;
    // 如果云 SDK 多包了一层 data 且内层有 code 字段，说明内层才是后端原始响应
    if (result && result.data !== undefined && (result.data.code !== undefined || result.data.list !== undefined)) {
      backendJson = result.data;
    }
    // 如果 backendJson 没有 code 字段，说明云网关已解包了 { code:0, data:{...} }
    // 需要重新包装成 { code: 0, data: backendJson } 以兼容前端逻辑
    // 但空对象 {} 不包装为成功（可能是 PHP exit() 返回的错误被云网关吞掉了）
    if (backendJson && typeof backendJson === 'object' && backendJson.code === undefined && backendJson.msg === undefined) {
      // 空对象 {} 对部分 action（如 delete）其实是成功的"无数据"响应，
      // 此处统一当成功处理，让调用方按自己的逻辑判断。不要伪造出带"登录"字样的 msg，
      // 否则会被前端的登录失败判分支误触发跳转登录页。
      backendJson = { code: 0, data: backendJson };
    }
    return { data: backendJson };
  } catch (error) {
    console.error('[cloudRequest] 请求失败:', error);
    throw error;
  }
  // #endif

  throw new Error('非淘宝小程序环境');
}

/**
 * 封装为类似 uni.request 的接口
 * @param {Object} options - 请求配置，兼容 uni.request 格式
 */
export function taobaoRequest(options) {
  const { url, data, method = 'POST', success, fail, complete } = options;

  // 解析 URL 提取 action 和 controller
  // URL 格式: http://xxx/api.php?s=controller/action&...
  let action = 'index';
  let controller = 'index';
  let plugins = null;
  let group = 'api';

  // 用正则手动解析 URL 参数，避免依赖小程序环境不支持的 new URL()
  try {
    const getParam = (str, key) => {
      const m = str.match(new RegExp('[?&]' + key + '=([^&]*)'));
      return m ? decodeURIComponent(m[1]) : null;
    };

    const sParam = getParam(url, 's');
    if (sParam) {
      const parts = sParam.split('/');
      if (parts.length >= 2) {
        controller = parts[0];
        action = parts[1];
      }
    }

    // 检查是否是插件请求
    const pluginsName = getParam(url, 'pluginsname');
    if (pluginsName) {
      plugins = pluginsName;
      controller = getParam(url, 'pluginscontrol') || controller;
      action = getParam(url, 'pluginsaction') || action;
    }

    // 提取 group（根据路径中的 php 文件名）
    if (url.includes('api.php')) {
      group = 'api';
    } else if (url.includes('index.php')) {
      group = 'index';
    }
  } catch (e) {
    console.warn('[taobaoRequest] URL 解析失败，使用原始数据:', e);
  }

  // 提取 URL 中的所有 query 参数（token、uuid 等），合并到 cloudRequest 的 params
  // 确保 PHP 的 input() / $_GET 能读到这些参数
  const urlQueryParams = {};
  try {
    const qIndex = url.indexOf('?');
    if (qIndex >= 0) {
      const qs = url.substring(qIndex + 1);
      qs.split('&').forEach(pair => {
        const [k, v] = pair.split('=');
        if (k) urlQueryParams[decodeURIComponent(k)] = v ? decodeURIComponent(v) : '';
      });
    }
  } catch (e) {}

  console.log('[taobaoRequest] 解析结果: controller=', controller, 'action=', action, 'plugins=', plugins);

  cloudRequest({
    action,
    controller,
    data,
    urlQueryParams,
    method,
    plugins,
    group
  }).then((res) => {
    if (typeof success === 'function') {
      success(res);
    }
  }).catch((err) => {
    if (typeof fail === 'function') {
      fail(err);
    }
  }).finally(() => {
    if (typeof complete === 'function') {
      complete();
    }
  });
}

export default {
  initCloud,
  getCloud,
  cloudRequest,
  taobaoRequest,
  CLOUD_APP_ID
};
