/**
 * 天猫/淘宝 C2B 定制器前端工具模块
 * @desc 封装天猫小程序（mp-alipay）定制流程相关的工具方法:
 *       - 启动参数管理 (tradeToken, itemId, skuId)
 *       - 改价接口调用 (taobao.miniapp.advanced.tradeinfo.price.modify → price_key)
 *       - openTrade 插件调用 (addCartForCustom / saveOrderForCustom)
 *
 * 对标: jd-c2m-helper.js
 * JD C2M ↔ 天猫 C2B 映射:
 *   customInstanceId  →  tradeToken (URL 参数直接携带，无需后端接口)
 *   GetSkuPrice       →  fetchTmallPriceKey (→ price_key)
 *   addToJdCart       →  addToTmallCart (plugin.addCartForCustom)
 *   jdBuyNow          →  tmallBuyNow (plugin.saveOrderForCustom)
 */

/**
 * 延迟获取 app 实例，避免模块加载时 getApp() 返回 undefined
 */
function getAppInstance() {
  return getApp();
}

// ========== 1. 平台判断 ==========

export function isTmallPlatform() {
  // #ifdef MP-ALIPAY
  return true;
  // #endif
  // #ifndef MP-ALIPAY
  return false;
  // #endif
}

// ========== 2. 启动参数管理 ==========

/**
 * 存储天猫启动参数到 globalData + storage
 * tradeToken 由平台在用户从天猫商品页跳转时通过 URL 参数自动携带，无需调用后端接口
 * @param {Object} options - onLoad/onLaunch 的 options
 * @returns {Object} { tradeToken, itemId, skuId }
 */
export function storeTmallLaunchParams(options) {
  const params = {
    tradeToken: options.tradeToken || options.trade_token || '',
    itemId: options.itemId || options.item_id || '',
    skuId: options.skuId || options.sku_id || '',
  };

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

/**
 * 读取天猫 C2B 参数
 * @returns {Object} { tradeToken, itemId, skuId }
 */
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
  return { tradeToken: '', itemId: '', skuId: '' };
}

// ========== 3. 改价接口（对标 JD 的 fetchSkuPrice）==========

/**
 * 调用后端 cart/tmallprice，后端调用 TOP taobao.miniapp.advanced.tradeinfo.price.modify
 * 返回 price_key，用于传入 addCartForCustom / saveOrderForCustom
 * @param {string|number} itemId  - 天猫商品 num_iid
 * @param {number}        designPrice - 定制费（元），后端会换算为分
 * @returns {Promise<string>} price_key
 */
export function fetchTmallPriceKey(itemId, designPrice) {
  const app = getAppInstance();
  return new Promise((resolve, reject) => {
    uni.request({
      url: app.globalData.get_request_url('tmallprice', 'cart'),
      method: 'POST',
      data: {
        item_id: String(itemId),
        price: Math.round(Number(designPrice) * 100), // 元 → 分
        ...getCommonRequestParams(),
      },
      withCredentials: true,
      success: (res) => {
        if (res.data && res.data.code === 0 && res.data.data && res.data.data.price_key) {
          resolve(String(res.data.data.price_key));
        } else {
          const msg = (res.data && res.data.msg) ? res.data.msg : '获取改价凭证失败';
          console.warn('[Tmall C2B] fetchTmallPriceKey response:', res.data);
          reject(new Error(msg));
        }
      },
      fail: () => {
        reject(new Error('网络请求失败'));
      },
    });
  });
}

// ========== 4. 加入天猫购物车（对标 addToJdCart）==========

/**
 * 调用 openTrade 插件将定制商品加入天猫购物车
 * @param {string|number} itemId       - 天猫商品 num_iid
 * @param {string|number} skuId        - SKU ID
 * @param {string}        tradeToken   - 从 URL 参数获取的交易凭证
 * @param {Object}        customization - { pic: [{id, url}], text: [{id, key, content}] }
 * @param {string}        priceKey     - fetchTmallPriceKey 返回的改价凭证
 * @returns {Promise}
 */
export function addToTmallCart(itemId, skuId, tradeToken, customization, priceKey) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-ALIPAY
    let plugin;
    try {
      plugin = requirePlugin('myPlugin');
    } catch (e) {
      reject(new Error('openTrade 插件未就绪: ' + (e.message || '')));
      return;
    }
    plugin.addCartForCustom({
      itemId: String(itemId),
      skuId: skuId ? String(skuId) : undefined,
      quantity: 1,
      tradeToken: String(tradeToken),
      customization: customization,
      priceKey: String(priceKey),
      success(res) {
        console.log('[Tmall C2B] addCartForCustom success:', res);
        resolve(res);
      },
      fail(e) {
        console.error('[Tmall C2B] addCartForCustom fail:', e);
        reject(new Error((e && e.errorMessage) || '加入购物车失败'));
      },
    });
    // #endif
    // #ifndef MP-ALIPAY
    reject(new Error('非天猫平台，无法调用加购接口'));
    // #endif
  });
}

// ========== 5. 立即购买（对标 jdBuyNow）==========

/**
 * 调用 openTrade 插件立即购买定制商品
 * @param {string|number} itemId       - 天猫商品 num_iid
 * @param {string|number} skuId        - SKU ID
 * @param {string}        tradeToken   - 交易凭证
 * @param {Object}        customization - { pic: [...], text: [...] }
 * @param {string}        priceKey     - 改价凭证
 * @returns {Promise}
 */
export function tmallBuyNow(itemId, skuId, tradeToken, customization, priceKey) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-ALIPAY
    let plugin;
    try {
      plugin = requirePlugin('myPlugin');
    } catch (e) {
      reject(new Error('openTrade 插件未就绪: ' + (e.message || '')));
      return;
    }
    plugin.saveOrderForCustom({
      itemId: String(itemId),
      skuId: skuId ? String(skuId) : undefined,
      quantity: 1,
      tradeToken: String(tradeToken),
      customization: customization,
      priceKey: String(priceKey),
      success(res) {
        console.log('[Tmall C2B] saveOrderForCustom success:', res);
        resolve(res);
      },
      fail(e) {
        console.error('[Tmall C2B] saveOrderForCustom fail:', e);
        reject(new Error((e && e.errorMessage) || '立即购买失败'));
      },
    });
    // #endif
    // #ifndef MP-ALIPAY
    reject(new Error('非天猫平台，无法调用购买接口'));
    // #endif
  });
}

// ========== 内部工具 ==========

/**
 * 获取公共请求参数 (token、platform 等)
 * 对标 jd-c2m-helper.js 的 getCommonRequestParams，但 application_client_type 改为 alipay
 */
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
