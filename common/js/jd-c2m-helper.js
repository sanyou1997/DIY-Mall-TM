/**
 * 京东 C2M 定制器前端工具模块
 * @desc 封装京东小程序定制流程相关的工具方法:
 *       - 启动参数管理 (customInstanceId, userId, skuId)
 *       - 合规检测 (红盾 API)
 *       - 定制信息提交 (addCartForeignGold)
 *       - 京东购物车/立即购买 SDK 调用
 *       - 京东原生页面跳转
 */

/**
 * 延迟获取 app 实例，避免模块加载时 getApp() 返回 undefined
 */
function getAppInstance() {
  return getApp();
}

// ========== 1. 平台判断 ==========

export function isJdPlatform() {
  // #ifdef MP-JD
  return true;
  // #endif
  // #ifndef MP-JD
  return false;
  // #endif
}

// ========== 2. 启动参数管理 ==========

/**
 * 存储京东启动参数到 globalData + storage
 * @param {Object} options - onLoad/onLaunch 的 options
 * @returns {Object} { customInstanceId, userId, skuId }
 */
export function storeJdLaunchParams(options) {
  const params = {
    customInstanceId: options.customInstanceId || options.custom_instance_id || '',
    userId: options.userId || options.user_id || '',
    skuId: options.skuId || options.sku_id || '',
    customParams: options.customParams || options.custom_params || null,
  };

  try {
    uni.setStorageSync('jd_c2m_params', JSON.stringify(params));
  } catch (e) {
    console.warn('[JD C2M] Failed to persist params:', e);
  }

  const app = getAppInstance();
  if (app && app.globalData) {
    app.globalData.jd_c2m_params = params;
  }

  return params;
}

/**
 * 读取京东 C2M 参数
 * @returns {Object} { customInstanceId, userId, skuId }
 */
export function getJdC2mParams() {
  const app = getAppInstance();
  if (app && app.globalData && app.globalData.jd_c2m_params) {
    return app.globalData.jd_c2m_params;
  }
  try {
    const raw = uni.getStorageSync('jd_c2m_params');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (app && app.globalData) {
        app.globalData.jd_c2m_params = parsed;
      }
      return parsed;
    }
  } catch (e) {
    console.warn('[JD C2M] Failed to read params:', e);
  }
  return { customInstanceId: '', userId: '', skuId: '' };
}

// ========== 2.5 获取定制会话 ID ==========

/**
 * 调用后端获取京东定制凭证 (customInstanceId + userId)
 * 当京东启动参数中未携带 customInstanceId 时，需主动向 JOS 申请
 * 后端使用当前登录用户的 jd_openid 作为 rawUserKey
 * @param {string} skuId - 商品 SKU ID
 * @returns {Promise<{customInstanceId: string, userId: string}>}
 */
export function fetchCustomInstanceId(skuId) {
  const app = getAppInstance();
  return new Promise((resolve, reject) => {
    uni.request({
      url: app.globalData.get_request_url('getc2minstanceid', 'cart'),
      method: 'POST',
      data: {
        sku_id: String(skuId),
        ...getCommonRequestParams(),
      },
      withCredentials: true,
      success: (res) => {
        if (res.data && res.data.code === 0 && res.data.data) {
          const d = res.data.data;
          // 后端已从 JOS returnType.data 中提取，直接读取
          const customInstanceId = d.customInstanceId || d.custom_instance_id || '';
          const userId = d.userId || d.user_id || '';
          if (customInstanceId) {
            resolve({ customInstanceId: String(customInstanceId), userId: String(userId) });
          } else {
            console.warn('[JD C2M] getCustomInstanceId response:', d);
            reject(new Error('获取定制会话ID失败：返回为空'));
          }
        } else {
          reject(new Error(res.data && res.data.msg ? res.data.msg : '获取定制会话ID失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      },
    });
  });
}

// ========== 2.6 获取 SKU 京东价格 ==========

/**
 * 调用后端获取 JD SKU 京东价 (jdPrice)
 * 用于在 displayCustomInfo 中显示"定制费"
 * @param {string} skuId - 商品 SKU ID
 * @returns {Promise<number>} 京东价（数值），失败时 fallback 为 0
 */
export function fetchSkuPrice(skuId) {
  const app = getAppInstance();
  return new Promise((resolve) => {
    uni.request({
      url: app.globalData.get_request_url('getskuprice', 'cart'),
      method: 'POST',
      data: {
        sku_id: String(skuId),
        ...getCommonRequestParams(),
      },
      withCredentials: true,
      success: (res) => {
        if (res.data && res.data.code === 0 && res.data.data && res.data.data.jd_price) {
          resolve(Number(res.data.data.jd_price));
        } else {
          console.warn('[JD C2M] fetchSkuPrice: unexpected response', res.data);
          resolve(0); // fallback: 不显示错误价格
        }
      },
      fail: (err) => {
        console.warn('[JD C2M] fetchSkuPrice request failed:', err);
        resolve(0); // fallback: 不显示错误价格
      },
    });
  });
}

// ========== 3. 合规检测 ==========

/**
 * 调用后端合规检测接口 (红盾 API)
 * @param {string} text - 待检测文本
 * @param {string[]} imageUrls - 待检测图片 URL 数组
 * @returns {Promise<{passed: boolean, reason: string}>}
 */
export function checkCompliance(text, imageUrls) {
  const app = getAppInstance();
  return new Promise((resolve) => {
    uni.request({
      url: app.globalData.get_request_url('checkcompliance', 'braceletworks'),
      method: 'POST',
      data: {
        text: text || '',
        image_urls: JSON.stringify(imageUrls || []),
        ...getCommonRequestParams(),
      },
      withCredentials: true,
      success: (res) => {
        if (res.data && res.data.code === 0 && res.data.data) {
          // 合规检测通过 (code=0, passed=true)
          resolve({
            passed: res.data.data.passed !== false,
            reason: res.data.data.reason || '',
          });
        } else if (res.data && res.data.code !== 0 && res.data.data) {
          // 合规检测明确返回不通过 (code=-1)
          resolve({
            passed: false,
            reason: res.data.data.reason || res.data.msg || '合规检测未通过',
          });
        } else {
          // 接口格式异常时放行，避免阻塞正常业务
          console.warn('[JD C2M] Compliance check response error:', res.data);
          resolve({ passed: true, reason: '' });
        }
      },
      fail: (err) => {
        console.warn('[JD C2M] Compliance check request failed:', err);
        resolve({ passed: true, reason: '' });
      },
    });
  });
}

// ========== 4. 提交定制信息 ==========

/**
 * 调用后端 cart/jdc2mcart 提交定制信息到京东
 * 后端会调用 JOS addCartForeignGold，返回 custom_info_id
 * @param {Object} params - 定制参数
 * @returns {Promise<{custom_info_id: string}>}
 */
export function submitJdCart(params) {
  const app = getAppInstance();
  return new Promise((resolve, reject) => {
    uni.request({
      url: app.globalData.get_request_url('jdc2mcart', 'cart'),
      method: 'POST',
      data: {
        ...params,
        ...getCommonRequestParams(),
      },
      withCredentials: true,
      success: (res) => {
        if (res.data && res.data.code === 0 && res.data.data) {
          resolve(res.data.data);
        } else {
          reject(new Error(res.data && res.data.msg ? res.data.msg : '定制信息提交失败'));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      },
    });
  });
}

// ========== 5. 加入京东购物车 ==========

/**
 * 调用京东小程序 SDK 将定制商品加入购物车
 * @param {string} skuId - 商品 SKU ID
 * @param {string} customInfoId - addCartForeignGold 返回的定制 ID (即 customAttrId)
 * @param {number} num - 数量
 * @returns {Promise}
 */
export function addToJdCart(skuId, customInfoId, num) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-JD
    if (typeof jd === 'undefined' || !jd.mpCommonRequest) {
      reject(new Error('京东小程序 SDK 不可用'));
      return;
    }
    jd.mpCommonRequest({
      method: 'post',
      functionId: 'miniAppAddCart',
      data: {
        skuInfos: [
          {
            skuId: String(skuId),
            checkType: 1,
            num: num || 1,
            customAttrId: String(customInfoId),
          },
        ],
      },
      success(res) {
        console.log('[JD C2M] miniAppAddCart success:', res);
        resolve(res);
      },
      fail(e) {
        console.error('[JD C2M] miniAppAddCart fail:', e);
        reject(new Error(e.errMsg || '加入购物车失败'));
      },
    });
    // #endif
    // #ifndef MP-JD
    reject(new Error('非京东平台，无法调用加购接口'));
    // #endif
  });
}

// ========== 6. 立即购买 ==========

/**
 * 调用京东 C2M 立即购买插件
 * 需先在京东小程序控制台申请插件，并在 manifest.json 中声明
 * @param {string} skuId - 商品 SKU ID
 * @param {string} customInfoId - 定制 ID
 * @param {number} num - 数量
 */
export function jdBuyNow(skuId, customInfoId, num) {
  // #ifdef MP-JD
  try {
    const plugin = requirePlugin('c2mBuyPlugin');
    plugin.toPay({
      skuId: String(skuId),
      num: num || 1,
      customAttrId: String(customInfoId),
    });
  } catch (e) {
    console.error('[JD C2M] plugin.toPay failed:', e);
    uni.showToast({ title: '立即购买插件未就绪', icon: 'none' });
  }
  // #endif
}

// ========== 7. 跳转京东原生页面 ==========

/**
 * 跳转京东原生购物车页面
 * 用户可通过系统返回按钮回到小程序 (触发 onShow)
 */
export function navigateToJdCart() {
  // #ifdef MP-JD
  if (typeof jd !== 'undefined' && jd.navigateToNative) {
    jd.navigateToNative({
      dataParam: {
        url: 'openapp.jdmobile://virtual',
        params: {
          category: 'jump',
          des: 'cart',
          param: {},
        },
      },
      success(res) {
        console.log('[JD C2M] navigateToNative cart success:', res);
      },
      fail(e) {
        console.warn('[JD C2M] navigateToNative cart fail:', e);
      },
    });
  }
  // #endif
}

// ========== 内部工具 ==========

/**
 * 获取公共请求参数 (token、platform 等)
 */
function getCommonRequestParams() {
  const app = getAppInstance();
  const params = {
    application: 'app',
    application_client_type: 'jd',
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
