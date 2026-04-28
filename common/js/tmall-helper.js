/**
 * 天猫/淘宝 C2B 定制器前端工具模块
 * 严格对齐《新版C2B定制》官方文档 2024-03-26 版本：
 *   - 启动参数：itemId / skuId / tradeToken / buyNow / quantity
 *   - 插件：openTrade（provider 3000000003647041）
 *   - 方法：saveOrderForCustom（立即购买）、addCartForCustom（加入购物车）
 *   - customization 结构：{ pic: [{id,url}], text: [{id,key,content}] }
 */

function getAppInstance() {
  return getApp();
}

export function isTmallPlatform() {
  // #ifdef MP-ALIPAY
  return true;
  // #endif
  // #ifndef MP-ALIPAY
  return false;
  // #endif
}

// ========== 启动参数管理 ==========

export function storeTmallLaunchParams(options) {
  const buyNowRaw = options.buyNow;
  const quantityRaw = options.quantity;
  // tradeToken 优先取 options.tradeToken（淘宝下单官方字段），只在没有的情况下
  // 才回退到 tradeParamsToken / trade_token
  const params = {
    itemId: options.itemId || options.item_id || '',
    skuId: options.skuId || options.sku_id || '',
    tradeToken: options.tradeToken || options.trade_token || options.tradeParamsToken || '',
    buyNow: buyNowRaw === true || buyNowRaw === 'true' || buyNowRaw === 1 || buyNowRaw === '1',
    quantity: Number(quantityRaw) > 0 ? Number(quantityRaw) : 1,
  };
  console.log('[Tmall C2B] 启动参数原始 keys:', Object.keys(options || {}).join(','));
  console.log('[Tmall C2B] 启动参数解析结果: itemId=' + params.itemId
    + ', skuId=' + params.skuId
    + ', tradeTokenLen=' + (params.tradeToken || '').length
    + ', buyNow=' + params.buyNow
    + ', 原始 tradeToken/tradeParamsToken 是否都存在: tradeToken=' + !!options.tradeToken
    + ' tradeParamsToken=' + !!options.tradeParamsToken);

  try {
    uni.setStorageSync('tmall_c2b_params', JSON.stringify(params));
  } catch (e) {
    console.warn('[Tmall C2B] Failed to persist params:', e);
  }

  const app = getAppInstance();
  if (app && app.globalData) {
    app.globalData.tmall_c2b_params = params;
  }

  return params;
}

export function getTmallParams() {
  const app = getAppInstance();
  if (app && app.globalData && app.globalData.tmall_c2b_params) {
    return app.globalData.tmall_c2b_params;
  }
  try {
    const raw = uni.getStorageSync('tmall_c2b_params');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (app && app.globalData) {
        app.globalData.tmall_c2b_params = parsed;
      }
      return parsed;
    }
  } catch (e) {
    console.warn('[Tmall C2B] Failed to read params:', e);
  }
  return { itemId: '', skuId: '', tradeToken: '', buyNow: false, quantity: 1 };
}

// ========== 改价接口：taobao.miniapp.advanced.tradeinfo.price.modify ==========
// 前端调后端 /cart/tmallprice，后端代调淘宝改价接口返回 price_key

function getCommonRequestParams() {
  const app = getAppInstance();
  const params = {
    application: 'app',
    application_client_type: 'alipay',
    ajax: 'ajax',
  };
  const token =
    (app && app.globalData && app.globalData.token) ||
    uni.getStorageSync('token') ||
    uni.getStorageSync('user_token') ||
    '';
  if (token) {
    params.token = token;
  }
  return params;
}

export function fetchTmallPriceKey(itemId, designPrice) {
  const app = getAppInstance();
  const priceFen = Math.round(Number(designPrice) * 100);
  const requestData = {
    item_id: String(itemId),
    price: priceFen,
    ...getCommonRequestParams(),
  };
  console.log('[Tmall C2B] fetchTmallPriceKey 请求:', JSON.stringify(requestData));
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn, val) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(val);
    };
    const timer = setTimeout(() => {
      finish(reject, new Error('改价接口超时(15秒无响应)，请检查后端 cart/tmallprice 接口'));
    }, 15000);
    const options = {
      url: app.globalData.get_request_url('tmallprice', 'cart'),
      method: 'POST',
      data: requestData,
      withCredentials: true,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        console.log('[Tmall C2B] fetchTmallPriceKey 响应:', JSON.stringify(res && res.data));
        const body = res && res.data;
        if (body && body.code === 0 && body.data && body.data.price_key) {
          finish(resolve, String(body.data.price_key));
          return;
        }
        // 失败时把后端实际返回的内容全部塞到错误信息里，方便真机调试
        let detail = '';
        if (!body) {
          detail = 'body 为空';
        } else if (typeof body !== 'object') {
          const raw = String(body).substring(0, 300);
          detail = '非 JSON 响应: ' + raw;
        } else {
          const snippet = [];
          if (body.code !== undefined) snippet.push('code=' + body.code);
          if (body.msg) snippet.push('msg=' + body.msg);
          // 关键：把整个 data 对象 dump 出来
          if (body.data === undefined) {
            snippet.push('data 缺失');
          } else {
            try {
              snippet.push('data=' + JSON.stringify(body.data).substring(0, 300));
            } catch (e) {
              snippet.push('data=' + String(body.data).substring(0, 300));
            }
          }
          detail = snippet.join(', ') || JSON.stringify(body).substring(0, 300);
        }
        finish(reject, new Error('改价接口失败: ' + detail));
      },
      fail: (err) => {
        console.error('[Tmall C2B] fetchTmallPriceKey 网络错误:', err);
        let detail = '';
        try {
          detail = err && (err.errorMessage || err.errMsg || err.message || JSON.stringify(err));
        } catch (e) {}
        finish(reject, new Error('改价接口网络错误: ' + (detail || '无详情')));
      },
    };
    // #ifdef MP-ALIPAY
    try {
      const { taobaoRequest } = require('@/common/js/taobao-cloud.js');
      const cloud = app.cloud || (app.globalData && app.globalData.cloud);
      if (cloud && cloud.application) {
        taobaoRequest(options);
        return;
      }
    } catch (e) {}
    // #endif
    uni.request(options);
  });
}

// ========== openTrade 插件 ==========

function getTradePlugin() {
  // #ifdef MP-ALIPAY
  try {
    const plugin = requirePlugin('openTrade');
    if (plugin) return plugin;
  } catch (e) {
    console.error('[Tmall C2B] requirePlugin("openTrade") failed:', e);
  }
  // #endif
  return null;
}

// 把任意 error 对象转成可读字符串（优先展示可读文案，然后错误码，最后兜底 JSON）
function formatPluginError(e, fallback) {
  if (!e) return fallback;
  try {
    const parts = [];
    // 先拿可读的错误文案（淘宝插件实际返回的是 errorMsg，不是 errorMessage）
    if (e.errorMsg) parts.push(String(e.errorMsg));
    else if (e.errorMessage) parts.push(String(e.errorMessage));
    else if (e.msg) parts.push(String(e.msg));
    else if (e.message) parts.push(String(e.message));
    // 再拼错误码
    if (e.errorCode !== undefined) parts.push('[' + e.errorCode + ']');
    else if (e.error !== undefined) parts.push('[error=' + e.error + ']');
    else if (e.code !== undefined) parts.push('[code=' + e.code + ']');
    if (parts.length) return parts.join(' ');
    // 无已知字段，整包 stringify
    const dump = JSON.stringify(e);
    if (dump && dump !== '{}') return dump;
  } catch (err) {}
  return fallback;
}

// ========== 立即购买：saveOrderForCustom ==========

export function tmallBuyNow({ itemId, skuId, quantity, tradeToken, customization, priceKey }) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-ALIPAY
    const plugin = getTradePlugin();
    if (!plugin || typeof plugin.saveOrderForCustom !== 'function') {
      reject(new Error('openTrade 插件未就绪或无 saveOrderForCustom 方法'));
      return;
    }
    const numItemId = Number(itemId);
    if (!numItemId || isNaN(numItemId)) {
      reject(new Error('itemId 无效: ' + itemId));
      return;
    }
    if (!tradeToken) {
      reject(new Error('tradeToken 为空, 必须从淘宝商品详情页的"立即定制"入口进入'));
      return;
    }
    const payload = {
      itemId: numItemId,
      quantity: Number(quantity) > 0 ? Number(quantity) : 1,
      tradeToken: String(tradeToken),
      customization,
    };
    const numSkuId = Number(skuId);
    if (numSkuId && !isNaN(numSkuId)) {
      payload.skuId = numSkuId;
    }
    if (priceKey) {
      payload.priceKey = String(priceKey);
    }
    console.log('[Tmall C2B] saveOrderForCustom 入参:', JSON.stringify(payload));
    plugin.saveOrderForCustom({
      ...payload,
      success(res) {
        console.log('[Tmall C2B] saveOrderForCustom success:', JSON.stringify(res));
        resolve(res);
      },
      fail(e) {
        console.error('[Tmall C2B] saveOrderForCustom fail 原始对象:', e);
        try { console.error('[Tmall C2B] saveOrderForCustom fail JSON:', JSON.stringify(e)); } catch (err) {}
        reject(new Error(formatPluginError(e, '立即购买失败(插件未返回具体错误)')));
      },
    });
    // #endif
    // #ifndef MP-ALIPAY
    reject(new Error('非淘宝平台，无法调用立即购买'));
    // #endif
  });
}

// ========== 加入购物车：addCartForCustom ==========

export function addToTmallCart({ itemId, skuId, price, quantity, tradeToken, customization }) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-ALIPAY
    const plugin = getTradePlugin();
    if (!plugin || typeof plugin.addCartForCustom !== 'function') {
      reject(new Error('openTrade 插件未就绪或无 addCartForCustom 方法'));
      return;
    }
    const numItemId = Number(itemId);
    if (!numItemId || isNaN(numItemId)) {
      reject(new Error('itemId 无效: ' + itemId));
      return;
    }
    if (!tradeToken) {
      reject(new Error('tradeToken 为空, 必须从淘宝商品详情页的"立即定制"入口进入'));
      return;
    }
    const payload = {
      itemId: numItemId,
      quantity: Number(quantity) > 0 ? Number(quantity) : 1,
      tradeToken: String(tradeToken),
      customization,
    };
    const numSkuId = Number(skuId);
    if (numSkuId && !isNaN(numSkuId)) {
      payload.skuId = numSkuId;
    }
    if (price !== undefined && price !== null && !Number.isNaN(Number(price))) {
      payload.price = Number(price);
    }
    console.log('[Tmall C2B] addCartForCustom 入参:', JSON.stringify(payload));
    plugin.addCartForCustom({
      ...payload,
      success(res) {
        console.log('[Tmall C2B] addCartForCustom success:', JSON.stringify(res));
        resolve(res);
      },
      fail(e) {
        console.error('[Tmall C2B] addCartForCustom fail 原始对象:', e);
        try { console.error('[Tmall C2B] addCartForCustom fail JSON:', JSON.stringify(e)); } catch (err) {}
        reject(new Error(formatPluginError(e, '加入购物车失败(插件未返回具体错误)')));
      },
    });
    // #endif
    // #ifndef MP-ALIPAY
    reject(new Error('非淘宝平台，无法调用加入购物车'));
    // #endif
  });
}
