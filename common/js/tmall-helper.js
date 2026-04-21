/**
 * 天猫/淘宝 C2B 定制器前端工具模块
 * @desc 封装天猫小程序（mp-alipay）定制流程相关的工具方法:
 *       - 启动参数管理 (tradeToken, itemId, skuId)
 *       - 改价接口调用 (taobao.miniapp.advanced.tradeinfo.price.modify → price_key)
 *       - openTrade 插件调用（多种方式兼容）
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

export function storeTmallLaunchParams(options) {
  const params = {
    tradeToken: options.tradeParamsToken || options.tradeToken || options.trade_token || '',
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

// ========== 3. 改价接口 ==========

export function fetchTmallPriceKey(itemId, designPrice) {
  const app = getAppInstance();
  const requestData = {
    item_id: String(itemId),
    price: Math.round(Number(designPrice) * 100),
    ...getCommonRequestParams(),
  };
  return new Promise((resolve, reject) => {
    const options = {
      url: app.globalData.get_request_url('tmallprice', 'cart'),
      method: 'POST',
      data: requestData,
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

// ========== 4. 获取插件并枚举可用方法 ==========

function getTradePlugin() {
  // #ifdef MP-ALIPAY
  try {
    const plugin = requirePlugin('myPlugin');
    if (plugin) {
      const methods = Object.keys(plugin).filter(k => typeof plugin[k] === 'function');
      console.log('[Tmall C2B] plugin methods:', methods.join(', '));
      return plugin;
    }
  } catch (e) {
    console.error('[Tmall C2B] requirePlugin failed:', e);
  }
  // #endif
  return null;
}

// ========== 5. 加入天猫购物车 ==========

export function addToTmallCart(itemId, skuId, tradeToken, customization, priceKey) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-ALIPAY
    const plugin = getTradePlugin();
    if (!plugin) {
      reject(new Error('openTrade 插件未就绪'));
      return;
    }

    const orderData = {
      itemId: String(itemId),
      skuId: skuId ? String(skuId) : undefined,
      quantity: 1,
      tradeToken: String(tradeToken),
      customization: customization,
      ...(priceKey ? { priceKey: String(priceKey) } : {}),
    };

    // 尝试多种方法名（不同插件版本API名不同）
    const methodNames = ['addCartForCustom', 'addCart', 'addItemToCart'];
    let called = false;
    for (const name of methodNames) {
      if (typeof plugin[name] === 'function') {
        console.log('[Tmall C2B] 调用插件方法:', name);
        plugin[name]({
          ...orderData,
          success(res) { resolve(res); },
          fail(e) { reject(new Error((e && e.errorMessage) || '加入购物车失败')); },
        });
        called = true;
        break;
      }
    }

    if (!called) {
      // 插件没有直接加购方法，尝试 setData 方式
      if (typeof plugin.setData === 'function') {
        console.log('[Tmall C2B] 使用 plugin.setData 加购');
        try {
          plugin.setData({ action: 'addCart', ...orderData });
          resolve({ msg: '已设置加购数据' });
        } catch (e) {
          reject(new Error('plugin.setData 失败: ' + (e.message || '')));
        }
      } else {
        const available = Object.keys(plugin).filter(k => typeof plugin[k] === 'function').join(', ');
        reject(new Error('插件无可用加购方法，可用方法: ' + available));
      }
    }
    // #endif
    // #ifndef MP-ALIPAY
    reject(new Error('非天猫平台，无法调用加购接口'));
    // #endif
  });
}

// ========== 6. 立即购买 ==========

export function tmallBuyNow(itemId, skuId, tradeToken, customization, priceKey) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-ALIPAY
    const plugin = getTradePlugin();
    if (!plugin) {
      reject(new Error('openTrade 插件未就绪'));
      return;
    }

    const orderData = {
      itemId: String(itemId),
      skuId: skuId ? String(skuId) : undefined,
      quantity: 1,
      tradeToken: String(tradeToken),
      customization: customization,
      ...(priceKey ? { priceKey: String(priceKey) } : {}),
    };

    // 尝试多种方法名
    const methodNames = ['saveOrderForCustom', 'saveOrder', 'tradeOrder', 'createOrder', 'tradePay'];
    let called = false;
    for (const name of methodNames) {
      if (typeof plugin[name] === 'function') {
        console.log('[Tmall C2B] 调用插件方法:', name);
        plugin[name]({
          ...orderData,
          success(res) { resolve(res); },
          fail(e) { reject(new Error((e && e.errorMessage) || '立即购买失败')); },
        });
        called = true;
        break;
      }
    }

    if (!called) {
      // 尝试 setData + 跳转插件交易页
      if (typeof plugin.setData === 'function') {
        console.log('[Tmall C2B] 使用 plugin.setData + 跳转');
        try {
          plugin.setData({ action: 'buy', ...orderData });
          // 跳转到插件交易确认页
          my.navigateTo({
            url: 'plugin://myPlugin/bindPage',
            success() { resolve({ msg: '已跳转交易页' }); },
            fail(e) {
              // 备用：直接跳淘宝商品详情
              my.tradePay && my.tradePay({
                orderStr: tradeToken,
                success(res) { resolve(res); },
                fail(e2) { reject(new Error('tradePay 失败: ' + (e2.errorMessage || ''))); },
              });
              if (!my.tradePay) {
                reject(new Error('跳转交易页失败: ' + (e.errorMessage || '')));
              }
            },
          });
        } catch (e) {
          reject(new Error('plugin.setData 失败: ' + (e.message || '')));
        }
      } else {
        const available = Object.keys(plugin).filter(k => typeof plugin[k] === 'function').join(', ');
        reject(new Error('插件无可用下单方法，可用方法: ' + available));
      }
    }
    // #endif
    // #ifndef MP-ALIPAY
    reject(new Error('非天猫平台，无法调用购买接口'));
    // #endif
  });
}

// ========== 内部工具 ==========

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
