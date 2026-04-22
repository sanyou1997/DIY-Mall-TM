<template>
    <view class="work-detail" :class="theme_view" :style="{ paddingTop: (statusBarHeight + 10) + 'px' }">
      <view v-if="loading" class="loading loading-mask">
        <view class="loading-card">
          <view class="loading-spinner"></view>
          <text class="loading-text">生成中</text>
          <view class="loading-dots">
            <text class="dot"></text>
            <text class="dot"></text>
            <text class="dot"></text>
          </view>
          <text class="loading-tip">正在生成作品，请稍候片刻</text>
        </view>
      </view>
      <view v-if="actionMsg" class="loading loading-mask">
        <view class="loading-card">
          <view class="loading-spinner"></view>
          <text class="loading-text">{{ actionMsg }}</text>
          <view class="loading-dots">
            <text class="dot"></text>
            <text class="dot"></text>
            <text class="dot"></text>
          </view>
          <text class="loading-tip">正在处理图片并提交，请稍候</text>
        </view>
      </view>
      <view>
        <view v-if="showSharedBanner" class="shared-banner">
          <text class="shared-label">由</text>
          <text class="shared-name">{{ sharedAuthorName }}</text>
          <text class="shared-label">分享的作品</text>
        </view>
        <view class="hero">
          <!-- 主图显示策略：
               1. 有 http(s) image_url 且未失败 → 用 <image>（最准确，服务端真实截图）
               2. 其他所有情况（data URI / 空 / 加载失败 / 长 base64）→ 用 <bracelet-thumbnail>
               淘宝小程序的 <image> 对很长的 data URI 经常静默失败（不触发 @error），
               而 data URI 出现意味着 saveWorkRemote 没成功，走 DOM 重绘反而最稳。 -->
          <image
            v-if="shouldUseImageTag"
            class="hero-img"
            :src="displayImage"
            mode="widthFix"
            @load="handleHeroLoaded"
            @error="onHeroImgError"
          ></image>
          <bracelet-thumbnail
            v-else
            :parts="parts"
            :size="620"
          ></bracelet-thumbnail>
        </view>
  
        <view class="card work-card">
          <view class="title">{{ work.design_title || '我的手串' }}</view>
          <view class="desc" v-if="work.design_desc">{{ work.design_desc }}</view>
          <view class="meta-row">
            <view class="price-block">
              <text class="price-label">参考价</text>
              <text class="price-value">¥{{ displayPrice }}</text>
            </view>
            <text class="tips">实际以结算价为准</text>
          </view>
          <view class="stats-row" v-if="parts.length">
            <view class="stat-chip">
              <text class="stat-label">珠子</text>
              <text class="stat-val">{{ beadCount }}</text>
            </view>
            <view class="stat-chip" v-if="accessoryCount > 0">
              <text class="stat-label">配件</text>
              <text class="stat-val">{{ accessoryCount }}</text>
            </view>
            <view class="stat-chip">
              <text class="stat-label">手围</text>
              <text class="stat-val">{{ estimatedWristSize }}</text>
            </view>
            <view class="stat-chip">
              <text class="stat-label">总计</text>
              <text class="stat-val">{{ totalCount }}件</text>
            </view>
          </view>
        </view>
  
        <view class="card" v-if="groupedParts.length">
          <view class="card-title">组成明细</view>
          <view v-for="(p, i) in groupedParts" :key="i" class="part-row">
            <image class="part-thumb" :src="p.image_url" mode="aspectFill"></image>
            <view class="part-info">
            <view class="part-name">{{ p.name }} · {{ p.size }}</view>
              <view class="part-meta">× {{ p.qty }}</view>
            </view>
            <view class="part-price">¥{{ p.subtotalText }}</view>
          </view>
        </view>
  
        <view class="actions card">
          <!-- #ifndef MP-JD -->
          <button class="btn ai full" @tap="handleAiInterpret" :disabled="aiLoading">
            {{ aiLoading ? '生成中…' : '✨ 生成AI解读' }}
          </button>
          <view class="actions-row">
            <button class="btn ghost small" @tap="handleEditAgain">修改</button>
            <button v-if="!fromContest" class="btn ghost small" @tap="handleJoinContest">参赛</button>
          </view>
          <view class="actions-row actions-buy">
            <!-- #ifdef MP-ALIPAY -->
            <button class="btn action buy" @tap="handleTmallBuyNow" :disabled="actionLoading">{{ actionLoading ? '提交中…' : '立即购买' }}</button>
            <!-- #endif -->
            <!-- #ifndef MP-ALIPAY -->
            <button class="btn action buy" @tap="handleBuyNow" :disabled="actionLoading">{{ actionLoading ? '提交中…' : '立即购买' }}</button>
            <!-- #endif -->
          </view>
          <!-- #endif -->
          <!-- #ifdef MP-JD -->
          <view class="actions-row">
            <button class="btn ghost small" @tap="handleEditAgain">修改设计</button>
          </view>
          <view class="actions-row actions-buy">
            <button class="btn action cart" @tap="handleJdConfirm('cart')" :disabled="jdSubmitting">{{ jdSubmitting ? '提交中…' : '加入购物车' }}</button>
            <button class="btn action buy" @tap="handleJdConfirm('buy')" :disabled="jdSubmitting">{{ jdSubmitting ? '提交中…' : '立即购买' }}</button>
          </view>
          <!-- #endif -->
        </view>

        <!-- AI 解读弹层 -->
        <view v-if="aiCardVisible" class="ai-modal">
          <view class="ai-card">
            <view class="ai-card-header">
              <text class="ai-title">手串性格报告</text>
              <text class="ai-close" @tap="closeAiCard">✕</text>
            </view>
            <view class="ai-card-body">
              <view class="ai-image">
                <image
                  v-if="shouldUseImageTag && !aiImgFailed"
                  :src="displayImage"
                  mode="aspectFill"
                  @error="onAiImgError"
                ></image>
                <view v-else class="ai-image-fallback">
                  <bracelet-thumbnail
                    :parts="parts"
                    :size="520"
                  ></bracelet-thumbnail>
                </view>
              </view>
              <view class="ai-report-box">
                <view class="ai-report-title">AI 性格解读</view>
                <view class="ai-report">{{ aiReport || '生成中…' }}</view>
              </view>
              <view class="ai-footer">
                <view class="ai-qrcode">
                  <w-qrcode
                    v-if="qrOptions.code"
                    ref="aiQrcode"
                    :options="qrOptions"
                    @generate="onQrGenerated"
                  />
                  <text class="qr-tip">扫码复刻同款</text>
                </view>
                <view class="ai-actions">
                <button
                  v-if="isWeixinMiniProgram"
                  class="btn share"
                  open-type="share"
                >分享</button>
                <button
                  v-else
                  class="btn share"
                  @tap="handleShare"
                >分享</button>
                  <button class="btn primary" :disabled="aiCardGenerating" @tap="savePersonaCard">
                    {{ aiCardGenerating ? '生成中…' : '保存性格卡' }}
                  </button>
                  <button class="btn ghost" @tap="closeAiCard">关闭</button>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 隐藏画布用于生成分享卡 -->
        <canvas canvas-id="aiPoster" id="aiPoster" class="hidden-canvas"></canvas>

        <!-- 参赛信息填写弹层 -->
        <view v-if="contestVisible" class="contest-modal">
          <view class="contest-card">
            <view class="contest-header">
              <text class="contest-title">参赛信息</text>
              <text class="contest-close" @tap="closeContestForm">✕</text>
            </view>
            <view class="contest-body">
              <view class="contest-field">
                <text class="contest-label">作品名称</text>
                <input
                  class="contest-input"
                  type="text"
                  :value="contestTitle"
                  placeholder="请输入作品名称"
                  @input="onContestTitleInput"
                />
              </view>
              <view class="contest-field">
                <text class="contest-label">作者</text>
                <input
                  class="contest-input"
                  type="text"
                  :value="contestAuthor"
                  placeholder="请输入作者"
                  @input="onContestAuthorInput"
                />
              </view>
              <view class="contest-actions">
                <button class="btn ghost" @tap="closeContestForm">取消</button>
                <button class="btn primary" @tap="submitContest">确认参赛</button>
              </view>
            </view>
          </view>
        </view>
      <!-- 淘宝加购插件已移除，仅保留直接购买流程 -->

      <!-- #ifdef MP-JD -->
      <!-- 京东定制协议确认弹窗 -->
      <view v-if="showJdAgreement" class="jd-agreement-modal" @tap.self="showJdAgreement = false">
        <view class="jd-agreement-card">
          <view class="jd-agreement-header">
            <text class="jd-agreement-title">定制确认</text>
          </view>
          <view class="jd-agreement-body">
            <text class="jd-agreement-text">
              您即将确认定制方案。定制商品为个性化定制，确认后将提交至京东购物车。定制商品一经生产不支持无理由退换，请确认设计方案无误。
            </text>
            <view class="jd-agreement-summary">
              <text>设计：{{ work.design_title || '我的手串' }}</text>
              <text>价格：¥{{ displayPrice }}</text>
              <text>珠子：{{ beadCount }}颗</text>
            </view>
          </view>
          <view class="jd-agreement-actions">
            <button class="btn ghost" @tap="showJdAgreement = false">取消</button>
            <button class="btn action buy" @tap="submitJdCustomization" :disabled="jdSubmitting">
              {{ jdSubmitting ? '提交中…' : '确认提交' }}
            </button>
          </view>
        </view>
      </view>
      <!-- #endif -->

      </view>
    </view>
  </template>

  <script>
  const app = getApp();
  import base64 from '@/common/js/lib/base64.js';
  import WQrcode from '@/uni_modules/wmf-code/components/w-qrcode/w-qrcode.vue';
  // #ifdef MP-JD
  import { checkCompliance, submitJdCart, addToJdCart, jdBuyNow, navigateToJdCart, getJdC2mParams, fetchCustomInstanceId } from '@/common/js/jd-c2m-helper.js';
  // #endif
  // #ifdef MP-ALIPAY
  import { taobaoRequest } from '@/common/js/taobao-cloud.js';
  import { getTmallParams } from '@/common/js/tmall-helper.js';
  // #endif
  export default {
    components: { WQrcode },
    data() {
      return {
        theme_view: '', // 主题样式类名，onLoad 时再取全局，避免取值异常导致 data 失败
        loading: true,
        imageReady: false,
        heroImageUrl: '',
        actionLoading: false,
        actionMsg: '',
        aiLoading: false,
        aiReport: '',
        aiCardVisible: false,
        aiCardGenerating: false,
        sharePosterLoading: false,
        qrOptions: {},
        workId: null,
        work: {},
        parts: [],
        goods_id: 117, // 定制商品占位 ID
        contestVisible: false,
        contestTitle: '',
        contestAuthor: '',
        fromContest: false,
        contestAuthorFromList: '',
        incomingReferrer: '',
        isWeixinMiniProgram: false,
        // 主图/AI 图加载失败标志：失败后切到 <bracelet-thumbnail> DOM 重绘兜底
        heroImgFailed: false,
        aiImgFailed: false,
        statusBarHeight: 0,
        // #ifdef MP-ALIPAY
        // 购物车功能已移除，仅保留直接购买
        // #endif
        // #ifdef MP-JD
        jdSubmitting: false,
        jdComplianceChecking: false,
        showJdAgreement: false,
        jdC2mParams: {},
        jdConfirmMode: 'cart', // 'cart' 或 'buy'
        jdDesignImageUrl: '',
        // #endif
      };
    },
    onLoad(options) {
      // 获取状态栏高度，用于避开刘海屏/挖孔屏
      try {
        const sysInfo = uni.getSystemInfoSync();
        this.statusBarHeight = sysInfo.statusBarHeight || 0;
      } catch (e) {}
      // 兜底获取主题，避免 data 初始化时报错导致 theme_view 未注册
      try {
        this.theme_view = app?.globalData?.get_theme_value_view?.() || '';
      } catch (e) {
        this.theme_view = '';
      }
      // 关闭上一页可能残留的系统 loading，避免遮挡自定义动画
      if (uni.hideLoading) {
        try { uni.hideLoading(); } catch (e) {}
      }

      this.workId = options.work_id || null;
      if (options.goods_id) {
        this.goods_id = Number(options.goods_id) || this.goods_id;
      }
      this.fromContest = String(options.from_contest || '') === '1';
      this.contestAuthorFromList = options.contest_author ? decodeURIComponent(options.contest_author) : '';
      this.incomingReferrer = options.referrer || '';
      this.isWeixinMiniProgram = this.getIsWeixinMiniProgram();

      // #ifdef MP-ALIPAY
      // 初始化淘宝加购插件
      try {
        const plugin = requirePlugin('myPlugin');
        if (plugin && typeof plugin.getData === 'function') {
          plugin.getData();
        }
      } catch (e) {
        console.warn('[Tmall Cart] plugin init error:', e);
      }
      // #endif

      // #ifdef MP-JD
      // 读取京东 C2M 参数
      try {
        const raw = uni.getStorageSync('jd_c2m_params');
        if (raw) this.jdC2mParams = JSON.parse(raw);
      } catch (e) {}
      // #endif

      // 开启分享菜单（小程序），若宿主未实现则忽略
      if (uni.showShareMenu) {
        try {
          uni.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        } catch (e) {
          console.warn('showShareMenu not implemented in this runtime', e);
        }
      }

      const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel();
      let eventChannelAvailable = false;
      if (eventChannel && eventChannel.on) {
        eventChannelAvailable = true;
        eventChannel.on('work-data', (data) => {
          this.applyWorkData(data);
          // 清除 storage 中的备用数据
          try { uni.removeStorageSync('work_detail_data'); } catch (e) {}
        });
        eventChannel.on('work-saved', (data) => {
          this.applyWorkSaved(data);
        });
      }
      // 如果有 work_id 则走接口加载；否则等待 eventChannel 数据
      if (this.workId && !String(this.workId).startsWith('local_')) {
        this.fetchDetail();
      } else {
        // 没有 work_id 且可能通过 eventChannel 直接渲染
        this.loading = false;
        // 兜底：若 eventChannel 不可用（京东等平台），尝试从 storage 读取
        if (!eventChannelAvailable) {
          this.$nextTick(() => {
            this.tryLoadFromStorage();
          });
        } else {
          // eventChannel 可用但可能数据延迟到达，设置超时兜底
          setTimeout(() => {
            if (!this.work.design_image && !this.work.image_url) {
              this.tryLoadFromStorage();
            }
          }, 500);
        }
      }
    },
    onShow() {
      // 再次兜底关闭系统 loading（部分端会延迟显示）
      if (uni.hideLoading) {
        try { uni.hideLoading(); } catch (e) {}
      }
      this.isWeixinMiniProgram = this.getIsWeixinMiniProgram();
    },
    onPullDownRefresh() {
      this.fetchDetail(true);
    },
    methods: {
      handleNeedLogin() {
        // #ifdef MP-ALIPAY
        const appInst = getApp();
        const cloud = appInst?.cloud || appInst?.globalData?.cloud;
        if (cloud && cloud.application) {
          appInst.globalData.taobao_cloud_login(this, 'onLoad', this.$mp && this.$mp.query || {}, {});
          return;
        }
        // #endif
        uni.navigateTo({ url: '/pages/login/login' });
      },
      _request(options) {
        // #ifdef MP-ALIPAY
        try {
          const app = getApp();
          const cloud = app?.cloud || app?.globalData?.cloud;
          if (cloud && cloud.application) {
            taobaoRequest(options);
            return;
          }
        } catch (e) {}
        // #endif
        uni.request(options);
      },
      getIsWeixinMiniProgram() {
        try {
          const sys = uni.getSystemInfoSync ? uni.getSystemInfoSync() : {};
          if (sys.uniPlatform) {
            return sys.uniPlatform === 'mp-weixin';
          }
          return typeof wx !== 'undefined' && !!wx.showShareMenu;
        } catch (e) {
          return false;
        }
      },
      ensureAlbumPermission() {
        return new Promise((resolve) => {
          if (!this.isWeixinMiniProgram || typeof uni.getSetting !== 'function') {
            return resolve(true);
          }
          uni.getSetting({
            success: (res) => {
              const granted = res.authSetting && res.authSetting['scope.writePhotosAlbum'];
              if (granted) return resolve(true);
              if (typeof uni.authorize !== 'function') return resolve(false);
              uni.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => resolve(true),
                fail: () => {
                  if (typeof uni.showModal === 'function') {
                    uni.showModal({
                      title: '需要相册权限',
                      content: '请在设置中开启保存到相册权限',
                      confirmText: '去设置',
                      success: (r) => {
                        if (r.confirm && typeof uni.openSetting === 'function') {
                          uni.openSetting({
                            success: () => resolve(true),
                            fail: () => resolve(false),
                          });
                        } else {
                          resolve(false);
                        }
                      }
                    });
                  } else {
                    resolve(false);
                  }
                }
              });
            },
            fail: () => resolve(false),
          });
        });
      },
      // 兜底：从 storage 读取 workData（eventChannel 不可用时）
      tryLoadFromStorage() {
        try {
          const stored = uni.getStorageSync('work_detail_data');
          if (stored) {
            const data = typeof stored === 'string' ? JSON.parse(stored) : stored;
            if (data && (data.design_image || data.image_url || data.design_parts)) {
              console.log('[work-detail] 从 storage 恢复 workData');
              this.applyWorkData(data);
              // 读取后清除，避免重复使用
              uni.removeStorageSync('work_detail_data');
            }
          }
        } catch (e) {
          console.warn('[work-detail] 从 storage 读取 workData 失败', e);
        }
      },
      applyWorkData(data) {
        if (!data) return;
        console.log('[work-detail] applyWorkData called, image_url=', data.image_url, 'design_image=', data.design_image);
        // 切换作品时重置图片加载失败标志，让新作品有机会先试 <image>
        this.heroImgFailed = false;
        this.aiImgFailed = false;
        const safeImageUrl = data.image_url || data.design_image || this.work.image_url || '';
        console.log('[work-detail] safeImageUrl=', safeImageUrl);
        const parts = this.normalizeDesignParts(data.design_parts);
        this.work = {
          ...data,
          // 仅使用接口 image_url
          design_image: safeImageUrl || '',
          image_url: safeImageUrl || '',
          design_image_url: safeImageUrl || ''
        };
        if (data.goods_id) {
          this.goods_id = Number(data.goods_id) || this.goods_id;
        }
        this.parts = parts;
        if (!this.workId && data.work_id) {
          this.workId = data.work_id;
        }
        this.syncHeroLoading(safeImageUrl);
        // #ifdef MP-JD
        if (data.jd_c2m_params) {
          this.jdC2mParams = data.jd_c2m_params;
        }
        // #endif
      },
      applyWorkSaved(data) {
        if (!data) return;
        // 淘宝小程序：如果本地已经有 data URI（canvas 截图的 base64），保留它不覆盖 ——
        // 服务端返回的 https://ostone.store/... 受图片白名单限制无法在 <image> 里渲染。
        // 其他字段（work_id / price / design_parts）正常合并。
        const existingIsDataUri = this.work && typeof this.work.image_url === 'string'
          && this.work.image_url.startsWith('data:');
        // #ifdef MP-ALIPAY
        const preferLocal = existingIsDataUri;
        // #endif
        // #ifndef MP-ALIPAY
        const preferLocal = false;
        // #endif
        const serverUrl = data.image_url || data.design_image_url || data.design_image || '';
        const safeImageUrl = preferLocal
          ? this.work.image_url
          : (serverUrl || this.work.image_url || '');
        if (data.design_parts) {
          this.parts = this.normalizeDesignParts(data.design_parts);
        }
        this.work = {
          ...this.work,
          ...data,
          design_image: safeImageUrl || this.work.design_image || '',
          image_url: safeImageUrl || this.work.image_url || '',
          design_image_url: safeImageUrl || this.work.design_image_url || '',
        };
        if (data.goods_id) {
          this.goods_id = Number(data.goods_id) || this.goods_id;
        }
        if (!this.workId && data.work_id) {
          this.workId = data.work_id;
        }
        if (safeImageUrl) {
          this.syncHeroLoading(safeImageUrl);
        }
      },
      fetchDetail(isPull = false) {
        if (!this.workId) {
          app.globalData.showToast('缺少作品ID');
          return;
        }
        this.loading = true;
        this.imageReady = false;
        this._request({
          url: app.globalData.get_request_url('detail', 'braceletworks'),
          method: 'GET',
          data: {
            work_id: this.workId,
            referrer: this.incomingReferrer || 0,
            from_contest: this.fromContest ? 1 : 0,
            ...this.getCommonParams(),
          },
          withCredentials: true,
          success: (res) => {
            if (res.data.code === 0) {
              const data = res.data.data || {};
              const safeImageUrl = data.image_url || '';
              const parts = this.normalizeDesignParts(data.design_parts);
              this.work = {
                ...data,
                // 接口返回时强制使用接口 image_url 作为展示/提交
                design_image: safeImageUrl || '',
                image_url: safeImageUrl || '',
                design_image_url: safeImageUrl || ''
              };
              this.parts = parts;
              this.syncHeroLoading(safeImageUrl);
            } else {
              const msg = res.data.msg || '加载失败';
              const code = res.data.code;
              if (code === -1001 || code === -400 || (msg && msg.includes('登录'))) {
                this.handleNeedLogin();
              } else {
                app.globalData.showToast(msg);
              }
              this.loading = false;
            }
          },
          fail: () => app.globalData.showToast(this.$t('common.internet_error_tips')),
          complete: () => {
            if (isPull) uni.stopPullDownRefresh();
          },
        });
      },
      syncHeroLoading(imageUrl) {
        const cleaned = imageUrl && String(imageUrl).trim();
        const hasImage = !!cleaned;
        if (!hasImage) {
          this.loading = false;
          this.imageReady = true;
          this.heroImageUrl = '';
          return;
        }
        if (cleaned === this.heroImageUrl) {
          this.imageReady = true;
          this.loading = false;
          return;
        }
        if (this.imageReady && this.heroImageUrl) {
          // 已有可见图片时，不再显示"生成中"遮罩
          this.heroImageUrl = cleaned;
          this.loading = false;
          return;
        }
        this.heroImageUrl = cleaned;
        this.loading = true;
        this.imageReady = false;
      },
      handleHeroLoaded() {
        this.imageReady = true;
        this.loading = false;
      },
      onHeroImgError() {
        console.warn('[work-detail] 主图加载失败，切换到 bracelet-thumbnail 组件兜底渲染');
        this.heroImgFailed = true;
        this.imageReady = true;
        this.loading = false;
      },
      onAiImgError() {
        console.warn('[work-detail] AI 卡图加载失败，切换到 bracelet-thumbnail 组件兜底渲染');
        this.aiImgFailed = true;
      },
      handleEditAgain() {
        console.log('[work-detail] handleEditAgain called');
        const parts = this.normalizeDesignParts(this.parts);
        const workData = {
          work_id: this.workId,
          design_parts: parts,
          design_title: this.work.design_title,
          design_desc: this.work.design_desc,
          design_price: this.work.design_price,
        };
        // 兜底存储，防止 switchTab 无法携带 eventChannel
        try {
          uni.setStorageSync('bracelet_restore', workData);
          console.log('[work-detail] bracelet_restore saved');
        } catch (e) {
          console.warn('setStorageSync bracelet_restore fail', e);
        }
        // #ifdef MP-JD
        // 京东小程序没有 tabBar，直接使用 navigateTo
        uni.navigateTo({
          url: '/pages/bracelet/bracelet',
          success: () => console.log('[work-detail] navigateTo bracelet success'),
          fail: (err) => {
            console.error('[work-detail] navigateTo bracelet fail', err);
            uni.redirectTo({
              url: '/pages/bracelet/bracelet',
              fail: (e2) => {
                console.error('[work-detail] redirectTo bracelet fail', e2);
                uni.showToast({ title: '无法打开编辑页', icon: 'none' });
              }
            });
          }
        });
        // #endif
        // #ifndef MP-JD
        // bracelet 页面是 tabbar，优先使用 switchTab，事件通道无法使用，靠本地缓存还原
        uni.switchTab({
          url: '/pages/bracelet/bracelet',
          fail: (err) => {
            console.error('switchTab bracelet 失败，尝试 navigateTo', err);
            uni.navigateTo({
              url: `/pages/bracelet/bracelet${this.workId ? '?work_id=' + this.workId : ''}`,
              fail: (e2) => {
                console.error('navigateTo bracelet 也失败', e2);
                uni.showToast({ title: '无法打开编辑页', icon: 'none' });
              }
            });
          }
        });
        // #endif
      },
      handleJoinContest() {
        this.contestTitle = this.work.design_title || '我的手串';
        this.contestAuthor = this.work.creator || this.currentUserName || '匿名';
        this.contestVisible = true;
      },
      closeContestForm() {
        this.contestVisible = false;
      },
      async submitContest() {
        const title = (this.contestTitle || '').trim() || '我的手串';
        const author = (this.contestAuthor || '').trim() || '匿名';
        if (this.countChineseChars(title) > 8) {
          app.globalData.showToast('作品名称不超过8个字');
          return;
        }
        if (this.countChineseChars(author) > 8) {
          app.globalData.showToast('作者名称不超过8个字');
          return;
        }
        let imageUrl = this.displayImage;
        imageUrl = await this.ensureDesignImageUrl(imageUrl);
        // 淘宝小程序下 image_url 可能为空（canvas 截图受限 + 服务端保存返回空 url），
        // 这种情况下仍允许参赛：contest 列表会用 design_parts 本地 DOM 重绘显示。
        // 但需要保证作品本身有 parts 数据，否则列表页就真的什么都显示不出来了。
        if (!imageUrl && (!this.parts || this.parts.length === 0)) {
          app.globalData.showToast('作品数据异常，无法参赛');
          return;
        }
        await this.ensureShareWorkId();
        const payload = {
          work_id: this.workId || this.work.work_id || '',
          title,
          price: Number(this.work.design_price || this.displayPrice || 0),
          image_url: imageUrl,
          author,
          ...this.getCommonParams(),
        };
        this._request({
          url: app.globalData.get_request_url('join', 'braceletcontest'),
          method: 'POST',
          data: payload,
          withCredentials: true,
          success: (res) => {
            if (res.data && res.data.code === 0) {
              const entryId = res.data.data && res.data.data.entry_id;
              this.contestVisible = false;
              uni.navigateTo({
                url: `/pages/bracelet-sub/contest?highlight_id=${encodeURIComponent(entryId || '')}`,
              });
            } else if (res.data && (res.data.code === -1001 || (res.data.msg || '').includes('登录'))) {
              uni.navigateTo({ url: '/pages/login/login' });
            } else {
              app.globalData.showToast((res.data && res.data.msg) || '参赛失败');
            }
          },
          fail: () => app.globalData.showToast(this.$t('common.internet_error_tips')),
        });
      },
      onContestTitleInput(e) {
        const text = (e.detail && e.detail.value) || '';
        this.contestTitle = this.enforceChineseLimit(text, 8);
      },
      onContestAuthorInput(e) {
        const text = (e.detail && e.detail.value) || '';
        this.contestAuthor = this.enforceChineseLimit(text, 8);
      },
      enforceChineseLimit(text, maxLen) {
        if (!text) return '';
        const chars = Array.from(String(text));
        let count = 0;
        let result = '';
        for (const ch of chars) {
          if (this.isChineseChar(ch)) {
            if (count + 1 > maxLen) break;
            count += 1;
          }
          result += ch;
        }
        return result;
      },
      countChineseChars(text) {
        if (!text) return 0;
        return Array.from(String(text)).filter((ch) => this.isChineseChar(ch)).length;
      },
      isChineseChar(ch) {
        return /[\u4e00-\u9fa5]/.test(ch);
      },
      handleBuyNow() {
        this.submitOrderOrCart('buy');
      },
      // #ifdef MP-ALIPAY
      /**
       * 淘宝加购：设置插件数据并弹出加购浮层（openTrade 插件）
       * 数据格式: ["itemId_skuId_quantity", ...]
       */
      /**
       * 构建天猫 C2B 定制信息
       * @returns {{ pic: Array, text: Array }}
       */
      buildTmallCustomization() {
        const picUrl = this.work.image_url || this.work.design_image_url || this.displayImage || '';
        const pic = [];
        if (picUrl && (picUrl.startsWith('http://') || picUrl.startsWith('https://'))) {
          pic.push({ id: 1, url: picUrl });
        }

        const text = [];
        text.push({ id: 1, content: '作品名称:' + (this.work.design_title || '我的手串') });
        const price = Number(this.work.design_price || this.displayPrice || 0);
        text.push({ id: 2, content: '定制价格:¥' + price.toFixed(2) });

        if (this.groupedParts && this.groupedParts.length) {
          const partsSummary = this.groupedParts
            .map((p) => p.name + (p.size ? '(' + p.size + ')' : '') + '×' + p.qty)
            .join('、');
          text.push({ id: 3, content: '组成明细:' + partsSummary });
        }

        if (this.workId) {
          text.push({ id: 4, content: '作品ID:' + this.workId });
        }

        return { pic, text };
      },
      /**
       * 天猫下单：枚举插件可用方法并尝试下单
       */
      handleTmallBuyNow() {
        if (this.actionLoading) return;

        const tmallParams = getTmallParams();
        const tradeToken = tmallParams.tradeToken || '';
        if (!tradeToken) {
          uni.showToast({ title: '无交易凭证，请从商品页进入', icon: 'none' });
          return;
        }

        const itemId = String(tmallParams.itemId || '');
        const skuId = tmallParams.skuId || '0';
        const self = this;

        this.actionLoading = true;

        my.tb.confirmOrder({
          itemId: itemId,
          skuId: skuId,
          quantity: 1,
          tradeToken: tradeToken,
          tradeExToken: tradeToken,
        }).then(function(res) {
          console.log('[Tmall C2B] confirmOrder success:', JSON.stringify(res));
          self.actionLoading = false;
        }).catch(function(e) {
          console.error('[Tmall C2B] confirmOrder fail:', JSON.stringify(e));
          self.actionLoading = false;
          uni.showToast({ title: (e.errorMessage || e.message || '下单失败'), icon: 'none', duration: 3000 });
        });
      },
      // #endif

      async handleAiInterpret() {
        if (this.aiLoading) return;
        if (!this.parts || !this.parts.length) {
          app.globalData.showToast('请先完成 DIY 设计');
          return;
        }
        this.aiLoading = true;
        const payload = {
          work_id: this.workId,
          design_title: this.work.design_title,
          design_desc: this.work.design_desc,
          design_price: Number(this.work.design_price || this.displayPrice || 0),
          design_parts: JSON.stringify(this.parts),
          ...this.getCommonParams(),
        };
        const requestUrl = app.globalData.get_request_url('aireport', 'braceletworks');
        const handleSuccess = (res) => {
          // 云 SDK 响应可能包含额外嵌套：result → { data: backendJSON } 或 { data: { data: backendJSON } }
          let data = res?.data || res;
          // 若当前层无 code 字段，但 data.data 有，说明多包了一层
          if (data !== null && typeof data === 'object' && data.code === undefined && data.data !== undefined) {
            data = data.data;
          }
          console.log('[AI Interpret] response:', JSON.stringify(data));
          if (data.code === 0) {
            this.aiReport = data.data.report || '';
            this.aiCardVisible = true;
            this.ensureShareWorkId().finally(() => {
              this.qrOptions = {
                code: this.getWorkSharePath(),
                size: 220,
                bgColor: '#FFFFFF',
                color: ['#000000'],
              };
            });
          } else if (data.code === -1001 || (data.msg || '').includes('登录')) {
            uni.navigateTo({ url: '/pages/login/login' });
          } else {
            app.globalData.showToast(data.msg || '生成失败');
          }
        };
        const handleFail = (err) => {
          console.error('[AI Interpret] request fail:', JSON.stringify(err));
          app.globalData.showToast('AI请求失败: ' + (err.errMsg || '网络错误'));
        };
        const handleComplete = () => { this.aiLoading = false; };

        console.log('[AI Interpret] requesting:', requestUrl, 'payload keys:', Object.keys(payload));
        this._request({
          url: requestUrl,
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: payload,
          timeout: 120000,
          success: (res) => {
            console.log('[AI Interpret] statusCode:', res.statusCode, 'data:', JSON.stringify(res.data).substring(0, 200));
            if (!res.statusCode || (res.statusCode >= 200 && res.statusCode < 300)) {
              handleSuccess(res);
            } else {
              app.globalData.showToast('服务器错误 ' + res.statusCode);
            }
          },
          fail: handleFail,
          complete: handleComplete,
        });
      },

      onQrGenerated() {
        // 预留：二维码生成完成事件
      },

      closeAiCard() {
        this.aiCardVisible = false;
      },

      async savePersonaCard() {
        if (!this.aiReport) {
          app.globalData.showToast('请先生成解读');
          return;
        }
        this.aiCardGenerating = true;
        try {
          const qrImg = await (this.$refs.aiQrcode && this.$refs.aiQrcode.GetCodeImg ? this.$refs.aiQrcode.GetCodeImg() : null);
          const qrPath = qrImg?.tempFilePath || qrImg?.path || qrImg?.img?.tempFilePath || qrImg?.img?.path || '';
          const heroPath = await this.getLocalImagePath(this.displayImage);
          await this.drawPoster(qrPath, heroPath);
        } catch (e) {
          console.error('savePersonaCard error', e);
          app.globalData.showToast('生成失败，请重试');
        } finally {
          this.aiCardGenerating = false;
        }
      },

      async drawPoster(qrPath, heroPath) {
        const posterW = uni.upx2px(700);
        const posterH = uni.upx2px(1400);
        const ctx = uni.createCanvasContext('aiPoster', this);

        // 背景
        ctx.setFillStyle('#f7f3ef');
        ctx.fillRect(0, 0, posterW, posterH);

        // 布局常量
        const pad = 20;
        const innerPad = 20;
        const sectionGap = 20;
        const cardX = pad;
        const cardY = pad;
        const cardW = posterW - pad * 2;
        const cardH = posterH - pad * 2;

        // 卡片背景（先绘制，内容覆盖其上）
        this.drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 16, '#ffffff');

        let cursorY = cardY + innerPad;

        // 标题
        ctx.setFillStyle('#1f1a14');
        ctx.setFontSize(20);
        ctx.fillText(this.work.design_title || '我的手串', cardX + innerPad, cursorY + 20);
        cursorY += 36;

        // 主图（限制最大尺寸，避免挤占文字和二维码空间）
        const imageMaxSize = Math.min(cardW - innerPad * 2, uni.upx2px(500));
        if (heroPath) {
          this.drawRoundedRect(ctx, cardX + innerPad, cursorY, imageMaxSize, imageMaxSize, 12, '#f6f1ea');
          ctx.drawImage(heroPath, cardX + innerPad, cursorY, imageMaxSize, imageMaxSize);
        }
        cursorY += imageMaxSize + sectionGap;

        // 解读文本（最多 6 行，超出截断加省略号）
        ctx.setFillStyle('#3a2f24');
        ctx.setFontSize(15);
        const textH = this.drawMultilineText(ctx, this.aiReport, cardX + innerPad, cursorY, cardW - innerPad * 2, 22, 6);
        cursorY += (textH || 0) + sectionGap;

        // 二维码（紧跟文字下方，非固定底部定位）
        if (qrPath) {
          const qrSize = uni.upx2px(170);
          const qrX = cardX + innerPad + 2;
          this.drawRoundedRect(ctx, qrX - 8, cursorY - 8, qrSize + 16, qrSize + 16, 12, '#faf7f2');
          ctx.drawImage(qrPath, qrX, cursorY, qrSize, qrSize);
          ctx.setFillStyle('#7a6a58');
          ctx.setFontSize(12);
          ctx.fillText('扫码复刻同款', qrX + 8, cursorY + qrSize + 18);
        }

        // 署名（锚定卡片底部）
        ctx.setFillStyle('#9a8d7f');
        ctx.setFontSize(12);
        ctx.fillText('AI 性格解读', cardX + cardW - 110, cardY + cardH - 18);

        ctx.draw(false, () => {
          this.exportCanvasImage(posterW, posterH);
        });
      },
      exportCanvasImage(posterW, posterH) {
        if (typeof uni.canvasToTempFilePath === 'function') {
          uni.canvasToTempFilePath({
            canvasId: 'aiPoster',
            width: posterW,
            height: posterH,
            destWidth: posterW * 2,
            destHeight: posterH * 2,
            success: (res) => {
              const path = res.tempFilePath;
              this.saveImageToAlbumOrPreview(path);
            },
            fail: () => app.globalData.showToast('生成失败'),
          }, this);
          return;
        }
        // H5 兜底：直接导出 dataURL 并下载/预览
        try {
          if (typeof document !== 'undefined') {
            const canvas = document.getElementById('aiPoster');
            if (canvas && canvas.toDataURL) {
              const dataUrl = canvas.toDataURL('image/png');
              this.saveImageToAlbumOrPreview(dataUrl);
              return;
            }
          }
        } catch (e) {
          console.warn('exportCanvasImage h5 fail', e);
        }
        app.globalData.showToast('当前环境不支持生成图片');
      },
      async saveImageToAlbumOrPreview(path) {
        if (!path) {
          app.globalData.showToast('生成失败');
          return;
        }
        if (this.isWeixinMiniProgram) {
          const ok = await this.ensureAlbumPermission();
          if (!ok) {
            app.globalData.showToast('未授权保存到相册');
            return;
          }
        }
        // H5 兜底：可下载或预览
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          try {
            if (path.startsWith('data:image')) {
              const link = document.createElement('a');
              link.href = path;
              link.download = `bracelet-card-${Date.now()}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              return;
            }
          } catch (e) {
            // ignore and fallback to preview
          }
        }
        if (typeof uni.saveImageToPhotosAlbum === 'function') {
          uni.saveImageToPhotosAlbum({
            filePath: path,
            success: () => app.globalData.showToast('已保存到相册', 'success'),
            fail: () => {
              // 保存失败时提供预览兜底
              if (typeof uni.previewImage === 'function') {
                uni.previewImage({ urls: [path] });
              } else {
                app.globalData.showToast('保存失败');
              }
            },
          });
          return;
        }
        if (typeof uni.previewImage === 'function') {
          uni.previewImage({ urls: [path] });
          return;
        }
        app.globalData.showToast('当前环境不支持保存');
      },

      drawMultilineText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
        if (!text) return 0;
        const chars = text.split('');
        let line = '';
        let offsetY = y;
        let lineCount = 0;
        const limit = maxLines || Infinity;
        for (let i = 0; i < chars.length; i++) {
          const testLine = line + chars[i];
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && i > 0) {
            lineCount++;
            if (lineCount >= limit) {
              ctx.fillText(this.truncateLineToFit(ctx, line, maxWidth, '...'), x, offsetY);
              return offsetY - y + lineHeight;
            }
            ctx.fillText(line, x, offsetY);
            line = chars[i];
            offsetY += lineHeight;
          } else {
            line = testLine;
          }
        }
        if (line) {
          lineCount++;
          if (lineCount > limit) {
            ctx.fillText(this.truncateLineToFit(ctx, line, maxWidth, '...'), x, offsetY);
          } else {
            ctx.fillText(line, x, offsetY);
          }
        }
        return offsetY - y + lineHeight;
      },

      truncateLineToFit(ctx, text, maxWidth, suffix) {
        const suffixWidth = ctx.measureText(suffix).width;
        let truncated = '';
        for (const ch of text.split('')) {
          if (ctx.measureText(truncated + ch).width + suffixWidth > maxWidth) {
            return truncated + suffix;
          }
          truncated += ch;
        }
        return text;
      },

      drawRoundedRect(ctx, x, y, width, height, radius, fillColor) {
        const r = Math.min(radius, width / 2, height / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + width, y, x + width, y + height, r);
        ctx.arcTo(x + width, y + height, x, y + height, r);
        ctx.arcTo(x, y + height, x, y, r);
        ctx.arcTo(x, y, x + width, y, r);
        ctx.closePath();
        if (fillColor) {
          ctx.setFillStyle(fillColor);
          ctx.fill();
        }
      },

      getWorkSharePath() {
        const wid = this.workId || this.work.work_id || '';
        const referrer = this.getReferrerId();
        const query = `work_id=${encodeURIComponent(wid)}${referrer ? `&referrer=${referrer}` : ''}`;
        const path = `/pages/bracelet-sub/work-detail?${query}`;
        const base = (app?.globalData?.data?.static_url || app?.globalData?.data?.request_url || '').replace(/\/+$/, '');
        // H5 使用 hash 路由，生成可直接访问的绝对地址，扫码即可跳转
        return `${base}/h5/#${path}`;
      },

      getReferrerId() {
        const fromCache = app?.globalData?.get_user_cache_info?.('id');
        if (fromCache) return Number(fromCache) || 0;
        const user = app?.globalData?.get_user_cache_info?.() || app?.globalData?.user || app?.globalData?.user_info || {};
        return Number(user.id || user.user_id || user.uid || 0) || 0;
      },

      getLocalImagePath(url) {
        return new Promise((resolve) => {
          if (!url) return resolve('');
          uni.getImageInfo({
            src: url,
            success: (res) => resolve(res.path || res.tempFilePath || ''),
            fail: () => resolve(''),
          });
        });
      },

      async submitOrderOrCart(mode) {
        this.actionLoading = true;
        this.actionMsg = '正在下单';
        const price = Number(this.work.design_price || this.displayPrice || 0);
        let designImageUrl = this.work.image_url || '';
        designImageUrl = await this.ensureDesignImageUrl(designImageUrl);

        if (!designImageUrl) {
          this.actionLoading = false;
          this.actionMsg = '';
          app.globalData.showToast('图片处理失败，请重试');
          return;
        }

        // 直接下单：构造 buy 页面所需参数并跳转
        const spec_for_buy = [];
        const goodsData = [{
          goods_id: this.goods_id,
          stock: 1,
          spec: spec_for_buy,
          design_price: price,
          design_image_url: designImageUrl,
          design_title: this.work.design_title,
          design_desc: this.work.design_desc,
          design_parts: this.normalizeDesignParts(this.parts),
          work_id: this.workId,
        }];
        const encoded = base64.encode(JSON.stringify({
          buy_type: 'goods',
          goods_data: goodsData,
        }));
        const targetUrl = `/pages/buy/buy?data=${encodeURIComponent(encoded)}`;
        uni.navigateTo({
          url: targetUrl,
          complete: () => {
            this.actionLoading = false;
            this.actionMsg = '';
          }
        });
      },

      // #ifdef MP-JD
      /**
       * 京东定制确认入口
       * @param {string} mode - 'cart' 或 'buy'
       */
      handleJdConfirm(mode) {
        if (this.jdSubmitting) return;
        this.jdConfirmMode = mode;
        // 立即显示确认弹窗，不做任何异步操作
        this.showJdAgreement = true;
      },

      /**
       * 用户确认协议后提交定制信息到京东
       */
      async submitJdCustomization() {
        if (this.jdSubmitting) return;
        this.jdSubmitting = true;
        this.showJdAgreement = false;
        this.actionMsg = '正在准备设计图…';

        try {
          // 1. 确保设计图 URL 可用（在过渡界面中执行，用户无感等待）
          let designImageUrl = this.work.image_url || '';
          designImageUrl = await this.ensureDesignImageUrl(designImageUrl);
          if (!designImageUrl) {
            // 允许使用空图继续（JD jdfile:// 路径可能无法读取）
            designImageUrl = '';
          }
          this.jdDesignImageUrl = designImageUrl;

          const c2mParams = this.jdC2mParams || getJdC2mParams();
          const price = Number(this.work.design_price || this.displayPrice || 0);
          // skuId 必须是京东真实 SKU ID，不能用内部 goods_id
          const skuId = c2mParams.skuId || '10211569055230';

          // 2. 尝试前端获取 customInstanceId（非必须，后端也会兜底自动获取）
          this.actionMsg = '正在获取定制凭证…';
          let customInstanceId = c2mParams.customInstanceId || '';
          if (!customInstanceId) {
            try {
              const credential = await fetchCustomInstanceId(skuId);
              customInstanceId = credential.customInstanceId;
              // 回写到 c2mParams 和 storage
              c2mParams.customInstanceId = customInstanceId;
              if (credential.userId) {
                c2mParams.userId = credential.userId;
              }
              this.jdC2mParams = Object.assign({}, c2mParams);
              try { uni.setStorageSync('jd_c2m_params', JSON.stringify(c2mParams)); } catch (e) {}
            } catch (idErr) {
              // 前端获取失败不阻断，后端 SubmitCustomization 会自动补全
              console.warn('[JD C2M] fetchCustomInstanceId failed, backend will fallback:', idErr.message);
            }
          }

          // 构建展示信息（官方要求 Map<String,String> 扁平 key-value 对象）
          // 使用 groupedParts 聚合同类珠子，避免同名覆盖
          // value 中包含配件小计价格（JD 不支持独立 price 字段，只能写在 value 里）
          // 注意："定制费"由后端 SubmitCustomization 自动注入（调 GetSkuPrice 获取 SKU 底价）
          const displayCustomInfo = {};
          this.groupedParts.forEach(p => {
            if (p.name) {
              const sizeStr = p.size || '';
              const priceInfo = p.subtotal > 0 ? ` ¥${p.subtotalText}` : '';
              displayCustomInfo[p.name] = `${sizeStr} x${p.qty}${priceInfo}`;
            }
          });

          const payload = {
            goods_id: skuId,
            action_type: this.jdConfirmMode === 'buy' ? 2 : 1,
            custom_instance_id: customInstanceId,  // 可能为空，后端会兜底
            user_id: c2mParams.userId || '',
            design_title: this.work.design_title || '我的手串',
            design_desc: this.work.design_desc || '',
            design_price: price,  // JD 附加定制费: SKU底价 + design_price = 最终价格
            design_parts: JSON.stringify(this.parts),
            design_image_url: this.jdDesignImageUrl || '',
            display_custom_info: JSON.stringify(displayCustomInfo),
            work_id: this.workId || '',
            count: 1,
            custom_params: c2mParams.customParams
              ? JSON.stringify(c2mParams.customParams) : '',
          };
          // 调试：打印即将提交的 design_image_url，确认是否为有效 https URL
          console.log('[JD C2M] submitJdCustomization payload.design_image_url=', payload.design_image_url);
          if (!payload.design_image_url || !payload.design_image_url.startsWith('http')) {
            console.warn('[JD C2M] design_image_url 为空或非 http(s)，购物车将显示默认商品图片');
          }

          // 3. 提交到后端（分阶段进度提示）
          this.actionMsg = '正在提交定制信息…';
          const progressMsgs = ['正在上传设计图…', '正在加入购物车…'];
          let msgIdx = 0;
          const progressTimer = setInterval(() => {
            if (msgIdx < progressMsgs.length) {
              this.actionMsg = progressMsgs[msgIdx++];
            }
          }, 3000);

          let result;
          try {
            result = await submitJdCart(payload);
          } finally {
            clearInterval(progressTimer);
          }
          // addCartForeignGold 成功即已加购，返回 redirect_url（跳转地址）
          console.log('[JD C2M] addCartForeignGold result:', result);

          if (this.jdConfirmMode === 'buy') {
            // 立即购买：尝试用 redirect_url 跳转，或 fallback 到插件
            app.globalData.showToast('定制方案已提交', 'success');
            if (result.redirect_url) {
              // 京东返回了中间页跳转地址，通过原生导航打开
              // #ifdef MP-JD
              if (typeof jd !== 'undefined' && jd.navigateToNative) {
                jd.navigateToNative({
                  dataParam: { url: result.redirect_url },
                  fail: () => jdBuyNow(skuId, result.custom_info_id || '', 1),
                });
              }
              // #endif
            } else if (result.custom_info_id) {
              setTimeout(() => jdBuyNow(skuId, result.custom_info_id, 1), 500);
            }
          } else {
            // 加购物车：addCartForeignGold 已成功提交定制信息
            const customInfoId = result.custom_info_id || '';

            // 方式 1（需商家授权后生效）：miniAppAddCart SDK
            if (customInfoId) {
              try {
                await addToJdCart(skuId, customInfoId, 1);
                app.globalData.showToast('已加入购物车', 'success');
                setTimeout(() => navigateToJdCart(), 500);
                return;
              } catch (cartErr) {
                console.warn('[JD C2M] miniAppAddCart failed (需商家授权):', cartErr);
              }
            }

            // 方式 2（当前可用）：提示成功并跳转购物车
            // miniAppAddCart 需商家授权，暂不可用；redirect_url 是网页地址，需 webview 打开
            // 定制信息已通过 addCartForeignGold 提交，直接提示成功并跳转购物车
            app.globalData.showToast('已加入购物车', 'success');
            setTimeout(() => navigateToJdCart(), 500);
          }
        } catch (e) {
          console.error('[JD C2M] submitJdCustomization failed:', e);
          const errMsg = e.message || '提交失败，请重试';
          const errorMap = {
            '商家授权未完成': '店铺授权未完成，请联系客服处理',
            'access_token': '店铺授权已过期，请联系客服处理',
            '定制会话ID失败': '获取定制凭证失败，请返回商品页重新进入',
            'custom instance': '定制凭证验证失败，请返回商品页重新进入',
            'validation failure': '定制凭证验证失败，请返回商品页重新进入',
          };
          let userMsg = errMsg;
          for (const [keyword, friendlyMsg] of Object.entries(errorMap)) {
            if (errMsg.toLowerCase().includes(keyword.toLowerCase())) {
              userMsg = friendlyMsg;
              break;
            }
          }
          app.globalData.showToast(userMsg);
        } finally {
          this.jdSubmitting = false;
          this.actionMsg = '';
        }
      },
      // #endif

      async ensureDesignImageUrl(imageUrl) {
        console.log('[work-detail] ensureDesignImageUrl called, imageUrl=', imageUrl);
        if (!imageUrl) return '';
        const url = String(imageUrl);
        if (url.startsWith('http://') || url.startsWith('https://')) {
          console.log('[work-detail] ensureDesignImageUrl: URL is already http(s), returning as-is');
          return url;
        }
        let base64 = '';
        if (url.startsWith('data:image')) {
          console.log('[work-detail] ensureDesignImageUrl: URL is data:image, using as-is');
          base64 = url;
        } else {
          // 压缩本地图片，减少上传体积
          console.log('[work-detail] ensureDesignImageUrl: compressing local image...');
          const compressedPath = await this.compressLocalImage(url);
          console.log('[work-detail] ensureDesignImageUrl: compressedPath=', compressedPath);

          // #ifdef MP-JD
          // 京东小程序：使用 jd.getFileSystemManager
          try {
            if (typeof jd !== 'undefined' && typeof jd.getFileSystemManager === 'function') {
              console.log('[work-detail] ensureDesignImageUrl: using jd.getFileSystemManager.readFile');
              const fs = jd.getFileSystemManager();
              base64 = await new Promise((resolve) => {
                fs.readFile({
                  filePath: compressedPath,
                  encoding: 'base64',
                  success: (res) => {
                    console.log('[work-detail] ensureDesignImageUrl: jd readFile success, data length=', res.data ? res.data.length : 0);
                    resolve('data:image/png;base64,' + res.data);
                  },
                  fail: (err) => {
                    console.log('[work-detail] ensureDesignImageUrl: jd readFile fail', err);
                    resolve('');
                  },
                });
              });
            }
          } catch (e) {
            console.log('[work-detail] ensureDesignImageUrl: jd readFile exception', e);
            base64 = '';
          }
          // #endif

          // #ifndef MP-JD
          try {
            if (typeof uni.getFileSystemManager === 'function') {
              console.log('[work-detail] ensureDesignImageUrl: using FileSystemManager.readFile');
              const fs = uni.getFileSystemManager();
              base64 = await new Promise((resolve) => {
                fs.readFile({
                  filePath: compressedPath,
                  encoding: 'base64',
                  success: (res) => {
                    console.log('[work-detail] ensureDesignImageUrl: readFile success, data length=', res.data ? res.data.length : 0);
                    resolve('data:image/png;base64,' + res.data);
                  },
                  fail: (err) => {
                    console.log('[work-detail] ensureDesignImageUrl: readFile fail', err);
                    resolve('');
                  },
                });
              });
            }
          } catch (e) {
            console.log('[work-detail] ensureDesignImageUrl: readFile exception', e);
            base64 = '';
          }
          // #endif

          // #ifndef MP-JD
          // 非京东小程序：尝试 uni.request 作为 fallback
          if (!base64) {
            console.log('[work-detail] ensureDesignImageUrl: trying uni.request fallback');
            try {
              base64 = await new Promise((resolve) => {
                uni.request({
                  url: compressedPath,
                  method: 'GET',
                  responseType: 'arraybuffer',
                  success: (res) => {
                    try {
                      const b64 = uni.arrayBufferToBase64(res.data);
                      console.log('[work-detail] ensureDesignImageUrl: request success, b64 length=', b64 ? b64.length : 0);
                      resolve('data:image/png;base64,' + b64);
                    } catch (e) {
                      console.log('[work-detail] ensureDesignImageUrl: arrayBufferToBase64 fail', e);
                      resolve('');
                    }
                  },
                  fail: (err) => {
                    console.log('[work-detail] ensureDesignImageUrl: request fail', err);
                    resolve('');
                  },
                });
              });
            } catch (e) {
              console.log('[work-detail] ensureDesignImageUrl: uni.request exception', e);
              base64 = '';
            }
          }
          // #endif
          // #ifdef MP-JD
          // 京东小程序：jdfile:// 路径无法通过 uni.request 读取
          // 改用 uni.uploadFile 直接上传本地文件（不需要先读成 base64）
          if (!base64) {
            console.log('[work-detail] ensureDesignImageUrl: base64 为空，尝试 uni.uploadFile 直接上传');
            try {
              const uploadUrl = await new Promise((resolve) => {
                const workId = parseInt(this.workId);
                uni.uploadFile({
                  url: app.globalData.get_request_url('save', 'braceletworks'),
                  filePath: compressedPath,
                  name: 'design_image_file',
                  formData: {
                    work_id: (Number.isInteger(workId) && workId > 0) ? String(workId) : '',
                    design_title: this.work.design_title || '我的手串',
                    design_desc: this.work.design_desc || '',
                    design_price: String(Number(this.work.design_price || this.displayPrice || 0)),
                    design_parts: JSON.stringify(this.normalizeDesignParts(this.parts) || []),
                    ...this.getCommonParams(),
                  },
                  success: (res) => {
                    try {
                      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                      console.log('[work-detail] ensureDesignImageUrl: uploadFile response', data);
                      if (data && data.code === 0 && data.data && data.data.image_url) {
                        if (data.data.work_id) {
                          this.workId = data.data.work_id;
                          if (this.work) {
                            this.work.work_id = data.data.work_id;
                          }
                        }
                        resolve(data.data.image_url);
                      } else {
                        resolve('');
                      }
                    } catch (e) {
                      console.log('[work-detail] ensureDesignImageUrl: uploadFile parse error', e);
                      resolve('');
                    }
                  },
                  fail: (err) => {
                    console.log('[work-detail] ensureDesignImageUrl: uploadFile fail', err);
                    resolve('');
                  },
                });
              });
              if (uploadUrl) {
                console.log('[work-detail] ensureDesignImageUrl: uploadFile 成功, url=', uploadUrl);
                return uploadUrl;
              }
            } catch (e) {
              console.log('[work-detail] ensureDesignImageUrl: uploadFile exception', e);
            }
          }
          // #endif
        }

        console.log('[work-detail] ensureDesignImageUrl: base64 ready, length=', base64 ? base64.length : 0);
        if (!base64) return '';

        const parts = this.normalizeDesignParts(this.parts);
        const workId = parseInt(this.workId);
        return await new Promise((resolve) => {
          this._request({
            url: app.globalData.get_request_url('save', 'braceletworks'),
            method: 'POST',
            timeout: 30000,
            data: {
              work_id: Number.isInteger(workId) && workId > 0 ? workId : undefined,
              design_title: this.work.design_title || '我的手串',
              design_desc: this.work.design_desc || '',
              design_price: Number(this.work.design_price || this.displayPrice || 0),
              design_parts: JSON.stringify(parts || []),
              design_image_base64: base64,
              ...this.getCommonParams(),
            },
            withCredentials: true,
            success: (res) => {
              if (res.data && res.data.code === 0 && res.data.data && res.data.data.image_url) {
                if (res.data.data.work_id) {
                  this.workId = res.data.data.work_id;
                  if (this.work) {
                    this.work.work_id = res.data.data.work_id;
                  }
                }
                resolve(res.data.data.image_url);
              } else {
                resolve('');
              }
            },
            fail: () => resolve(''),
          });
        });
      },
      async ensureShareWorkId() {
        const parts = this.normalizeDesignParts(this.parts);
        let designImageUrl = this.work.image_url || '';
        designImageUrl = await this.ensureDesignImageUrl(designImageUrl);
        const workId = parseInt(this.workId);
        return await new Promise((resolve) => {
          this._request({
            url: app.globalData.get_request_url('save', 'braceletworks'),
            method: 'POST',
            data: {
              work_id: Number.isInteger(workId) && workId > 0 ? workId : undefined,
              design_title: this.work.design_title || '我的手串',
              design_desc: this.work.design_desc || '',
              design_price: Number(this.work.design_price || this.displayPrice || 0),
              design_parts: JSON.stringify(parts || []),
              design_image_url: designImageUrl,
              ...this.getCommonParams(),
            },
            withCredentials: true,
            success: (res) => {
              if (res.data && res.data.code === 0 && res.data.data) {
                const data = res.data.data || {};
                if (data.work_id) {
                  this.workId = data.work_id;
                  if (this.work) {
                    this.work.work_id = data.work_id;
                  }
                }
                if (data.image_url) {
                  this.work.image_url = data.image_url;
                }
                resolve(true);
              } else {
                resolve(false);
              }
            },
            fail: () => resolve(false),
          });
        });
      },
      getCommonParams() {
        const token = app?.globalData?.token
          || app?.globalData?.user_token
          || app?.globalData?.user?.token
          || app?.globalData?.user_info?.token
          || uni.getStorageSync('token')
          || uni.getStorageSync('user_token')
          || uni.getStorageSync('user_token_value')
          || '';
        const params = {
          application: 'app',
          application_client_type: app?.globalData?.client_type || 'h5',
          ajax: 'ajax'
        };
        if (token) {
          params.token = token;
        }
        return params;
      },
      handleShare() {
        const title = this.work.design_title || '我的手串作品';
        const summary = this.work.design_desc || '';
        const url = this.getWorkSharePath();
        // H5 微信内：配置 JSSDK 分享信息
        if (typeof window !== 'undefined' && app?.globalData?.is_weixin_env?.()) {
          const wid = this.workId || this.work.work_id || '';
          app.globalData.page_share_handle({
            title,
            desc: summary,
            path: '/pages/bracelet-sub/work-detail',
            query: `work_id=${encodeURIComponent(wid)}`,
            img: this.work.design_image || this.displayImage || '',
          });
          app.globalData.showToast('请点击右上角进行分享', 'none');
          return;
        }
        // 微信小程序交由 open-type=share
        if (typeof wx !== 'undefined') {
          try {
            if (wx.showShareMenu) {
              wx.showShareMenu({ withShareTicket: true });
            }
          } catch (e) {}
          return;
        }
        // H5 优先使用 Web Share API
        if (typeof navigator !== 'undefined' && navigator.share) {
          navigator.share({ title, text: summary, url })
            .catch(() => {
              if (typeof uni !== 'undefined' && uni.setClipboardData) {
                uni.setClipboardData({
                  data: url,
                  success: () => app.globalData.showToast('链接已复制', 'none'),
                  fail: () => app.globalData.showToast('无法分享，请手动复制', 'none'),
                });
              } else if (typeof window !== 'undefined') {
                window.prompt('复制链接', url);
              }
            });
          return;
        }
        // 其他端兜底使用 uni.share
        if (typeof uni !== 'undefined' && uni.share) {
          uni.share({
            provider: 'weixin',
            type: 0,
            href: url,
            title,
            summary,
            imageUrl: this.work.design_image,
            success: () => app.globalData.showToast('已分享', 'none'),
            fail: () => app.globalData.showToast('分享失败', 'none'),
          });
          return;
        }
        if (typeof uni !== 'undefined' && uni.setClipboardData) {
          uni.setClipboardData({
            data: url,
            success: () => app.globalData.showToast('链接已复制', 'none'),
            fail: () => app.globalData.showToast('无法分享，请手动复制', 'none'),
          });
          return;
        }
        app.globalData.showToast('当前环境不支持分享', 'none');
      },

      handleSharePoster() {
        if (this.sharePosterLoading) return;
        this.sharePosterLoading = true;
        const payload = {
          goods_id: this.goods_id,
          is_refresh: 1,
          ...this.getCommonParams(),
        };
        this._request({
          url: app.globalData.get_request_url('goodsposter', 'distribution', 'distribution'),
          method: 'POST',
          data: payload,
          withCredentials: true,
          success: (res) => {
            if (res.data && res.data.code === 0 && res.data.data) {
              let posterUrl = res.data.data;
              if (!/^https?:\/\//.test(posterUrl)) {
                const base = (app?.globalData?.data?.static_url || app?.globalData?.data?.request_url || '').replace(/\/+$/, '');
                posterUrl = base ? `${base}${posterUrl}` : posterUrl;
              }
              if (typeof uni.previewImage === 'function') {
                uni.previewImage({ urls: [posterUrl] });
              } else {
                this.saveImageToAlbumOrPreview(posterUrl);
              }
            } else {
              app.globalData.showToast((res.data && res.data.msg) || '海报生成失败');
            }
          },
          fail: () => app.globalData.showToast(this.$t('common.internet_error_tips')),
          complete: () => {
            this.sharePosterLoading = false;
          },
        });
      },

      // 解析设计明细，兼容字符串/HTML 实体，并统一使用 sku_id
      normalizeDesignParts(raw) {
        if (!raw) return [];
        if (Array.isArray(raw)) {
          return raw.map((item) => this.normalizePartSkuId(item));
        }
        let text = String(raw);
        if (!text.trim()) return [];
        text = text.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        try {
          let parsed = JSON.parse(text);
          // 如果第一次解析得到字符串，再尝试二次解析
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch (e2) { /* ignore */ }
          }
          return Array.isArray(parsed) ? parsed.map((item) => this.normalizePartSkuId(item)) : [];
        } catch (e) {
          console.warn('design_parts parse failed', e);
          return [];
        }
      },
      // 统一 sku_id/id 字段
      normalizePartSkuId(item) {
        if (!item || typeof item !== 'object') return item;
        const skuId = item.sku_id;
        return { ...item, id: skuId, sku_id: skuId };
      },
      compressLocalImage(filePath) {
        return new Promise((resolve) => {
          if (!filePath || typeof uni.compressImage !== 'function') {
            return resolve(filePath);
          }
          const path = String(filePath);
          if (path.startsWith('http') || path.startsWith('data:image')) {
            return resolve(filePath);
          }
          uni.compressImage({
            src: filePath,
            quality: 70,
            success: (res) => resolve(res.tempFilePath || filePath),
            fail: () => resolve(filePath),
          });
        });
      },
    },
    computed: {
      currentUserId() {
        const user = app?.globalData?.user || app?.globalData?.user_info || {};
        const id = user.id || user.user_id || user.uid || 0;
        return Number(id) || 0;
      },
      currentUserName() {
        const user = app?.globalData?.user || app?.globalData?.user_info || {};
        return user.nick_name || user.nickname || user.user_name || user.username || '';
      },
      sharedAuthorName() {
        if (this.contestAuthorFromList) return this.contestAuthorFromList;
        return this.work.creator
          || this.work.user_name
          || this.work.nick_name
          || this.work.username
          || '匿名用户';
      },
      showSharedBanner() {
        if (this.fromContest) return true;
        return false;
      },
      // 展示用图片：本地/事件通道 > 接口返回 image_url
      // 过滤掉 blob URL（京东小程序不支持）
      displayImage() {
        const candidates = [
          this.work.image_url,
          this.work.design_image,
          this.work.design_image_url
        ];
        for (const url of candidates) {
          if (url && !url.startsWith('blob:')) {
            return url;
          }
        }
        // 如果所有 URL 都是 blob 或空，返回空字符串（图片区域会显示空白）
        return '';
      },
      // 是否用 <image> 标签加载主图：只有 http(s) URL 才用，
      // data URI / 空值都走 <bracelet-thumbnail> DOM 重绘兜底
      shouldUseImageTag() {
        if (this.heroImgFailed) return false;
        const url = this.displayImage || '';
        if (!url) return false;
        // 淘宝小程序 <image> 对长 data URI 经常静默失败，直接跳过
        if (url.startsWith('data:')) return false;
        return /^https?:\/\//i.test(url);
      },
      // 合并同类型配件（同名+同规格+同分类）
      groupedParts() {
        const map = {};
        (this.parts || []).forEach((p) => {
          const sizeLabel = p.sizeLabel || p.size || '';
          const key = `${p.name}|${sizeLabel}|${p.category}`;
          const rawPrice = p.priceNum ?? p.price ?? p.price_num ?? p.price_value ?? p.unit_price ?? 0;
          const priceNum = Number(rawPrice)
            || Number(String(rawPrice || '').replace(/[^\d.]/g, ''))
            || 0;
          const qty = Number(p.qty || p.count || p.num) || 1;
          const imageUrl = p.imageMap || p.imagePath || p.image_url || '';
          if (!map[key]) {
            map[key] = {
              name: p.name,
              size: sizeLabel,
              category: p.category,
              price: priceNum,
              qty: 0,
              image_url: imageUrl,
            };
          }
          map[key].qty += qty || 1;
        });
        return Object.values(map).map((item) => {
          const subtotal = item.price * item.qty;
          return { ...item, subtotal, subtotalText: subtotal.toFixed(2), priceText: item.price.toFixed(2) };
        });
      },
      displayPrice() {
        if (this.work.design_price) return this.work.design_price;
        if (this.work.price) return this.work.price;
        const sum = this.groupedParts.reduce((t, p) => t + (Number(p.subtotal) || 0), 0);
        return sum.toFixed(2);
      },
      beadCount() {
        return (this.parts || []).filter(p => !p.isAccessory).length;
      },
      accessoryCount() {
        return (this.parts || []).filter(p => !!p.isAccessory).length;
      },
      totalCount() {
        return (this.parts || []).length;
      },
      estimatedWristSize() {
        // 与设计页 bracelet.vue 保持一致：所有配件（珠子+配件）都参与手围计算
        const allItems = this.parts || [];
        if (allItems.length === 0) return '--';
        const sizes = allItems.map(b => parseInt(b.size || b.sizeLabel) || 0).filter(s => s > 0);
        if (sizes.length === 0) return '--';
        const totalDiameter = sizes.reduce((s, d) => s + d, 0);
        const maxDiameter = Math.max(...sizes);
        const isUniform = sizes.every(s => s === sizes[0]);
        let wrist;
        if (isUniform) {
          wrist = (sizes.length - Math.PI) * sizes[0];
        } else {
          wrist = totalDiameter - Math.PI * maxDiameter;
        }
        if (wrist <= 0) return '--';
        return Math.round(wrist) + 'mm';
      },
    },
    onShareAppMessage() {
      const wid = this.workId || this.work.work_id || '';
      const referrer = this.getReferrerId();
      const path = `/pages/bracelet-sub/work-detail?work_id=${wid}${referrer ? `&referrer=${referrer}` : ''}`;
      return {
        title: this.work.design_title || '我的手串作品',
        path,
        imageUrl: this.work.image_url || this.work.design_image || this.displayImage || '',
      };
    },
    onShareTimeline() {
      const wid = this.workId || this.work.work_id || '';
      const referrer = this.getReferrerId();
      const query = `work_id=${wid}${referrer ? `&referrer=${referrer}` : ''}`;
      return {
        title: this.work.design_title || '我的手串作品',
        query,
        imageUrl: this.work.image_url || this.work.design_image || this.displayImage || '',
      };
    },
  };
  </script>
  
  <style scoped>
/* ========== 页面容器 ========== */
.work-detail {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f0ea 0%, #f8f5f0 35%, #faf8f4 65%, #ffffff 100%);
  padding: 0 20rpx 36rpx;
  color: #2b2621;
}

/* ========== Loading 遮罩 ========== */
.loading { min-height: 60vh; display: flex; align-items: center; justify-content: center; padding: 40rpx 20rpx; color: #7c756f; }
.loading-mask { position: fixed; left: 0; top: 0; right: 0; bottom: 0; background: rgba(247, 243, 237, 0.95); z-index: 999; backdrop-filter: blur(6rpx); }
.loading-card {
  display: flex; flex-direction: column; align-items: center; gap: 16rpx;
  padding: 36rpx 40rpx; border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.95);
  border: 1rpx solid rgba(223, 206, 170, 0.45);
  box-shadow: 0 20rpx 48rpx rgba(64, 46, 26, 0.12), 0 4rpx 12rpx rgba(64, 46, 26, 0.06);
}
.loading-spinner {
  width: 60rpx; height: 60rpx; border-radius: 50%;
  border: 4rpx solid rgba(200, 164, 92, 0.2);
  border-top-color: rgba(185, 145, 70, 0.9);
  animation: spin 0.8s linear infinite;
}
.loading-text { font-size: 28rpx; font-weight: 600; color: #7a5b2b; letter-spacing: 2rpx; }
.loading-dots { display: flex; gap: 8rpx; align-items: center; }
.loading-dots .dot {
  width: 10rpx; height: 10rpx; border-radius: 50%;
  background: rgba(185, 145, 70, 0.7);
  animation: dot 1.2s infinite ease-in-out;
}
.loading-dots .dot:nth-child(2) { animation-delay: 0.2s; }
.loading-dots .dot:nth-child(3) { animation-delay: 0.4s; }
.loading-tip { font-size: 22rpx; color: rgba(92, 74, 52, 0.55); }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes dot { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }

/* ========== 分享横幅 ========== */
.shared-banner {
  display: flex; align-items: center; justify-content: center; gap: 8rpx;
  margin-bottom: 16rpx; padding: 12rpx 22rpx; border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.88);
  border: 1rpx solid rgba(223, 206, 170, 0.5);
  box-shadow: 0 8rpx 20rpx rgba(64, 46, 26, 0.08);
  backdrop-filter: blur(8rpx);
}
.shared-label { font-size: 22rpx; color: #9b8b7a; }
.shared-name { font-size: 24rpx; font-weight: 600; color: #3a2f24; }

/* ========== Hero 主图 ========== */
.hero {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.99), rgba(250, 247, 240, 0.98));
  border-radius: 28rpx; padding: 16rpx; margin-bottom: 20rpx;
  box-shadow: 0 8rpx 20rpx rgba(45, 34, 24, 0.06), 0 24rpx 52rpx rgba(45, 34, 24, 0.1);
  border: 1rpx solid rgba(235, 226, 210, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-img { width: 100%; border-radius: 22rpx; background: #f7f3ec; display: block; }

/* ========== 通用卡片 ========== */
.card {
  background: #fff; border-radius: 24rpx; padding: 24rpx; margin-bottom: 20rpx;
  box-shadow: 0 6rpx 16rpx rgba(45, 34, 24, 0.05), 0 20rpx 44rpx rgba(45, 34, 24, 0.08);
  border: 1rpx solid rgba(238, 230, 216, 0.7);
}

/* ========== 作品信息卡 ========== */
.work-card { padding: 26rpx; }
.title { font-size: 38rpx; font-weight: 700; margin-bottom: 10rpx; color: #2c231b; letter-spacing: 1rpx; line-height: 1.3; }
.desc { color: #6d635b; margin-bottom: 16rpx; line-height: 1.7; font-size: 26rpx; }
.meta-row { display: flex; align-items: center; justify-content: space-between; gap: 12rpx; margin-bottom: 16rpx; }
.price-block { display: flex; flex-direction: column; gap: 4rpx; }
.price-label { color: #9a8d7f; font-size: 22rpx; letter-spacing: 1rpx; }
.price-value { color: #8a6420; font-size: 42rpx; font-weight: 800; letter-spacing: 1rpx; }
.tips { color: #b0a598; font-size: 22rpx; }

/* ========== 统计信息行 ========== */
.stats-row {
  display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 4rpx;
}
.stat-chip {
  display: flex; align-items: center; gap: 6rpx;
  padding: 8rpx 18rpx; border-radius: 999rpx;
  background: linear-gradient(135deg, #faf6f0, #f2ece2);
  border: 1rpx solid rgba(215, 200, 175, 0.6);
  box-shadow: 0 2rpx 6rpx rgba(45, 34, 24, 0.04);
}
.stat-label {
  font-size: 22rpx; color: #9a8d7f; letter-spacing: 0.5rpx;
}
.stat-val {
  font-size: 24rpx; font-weight: 700; color: #5a4a36;
}

/* ========== 组成明细 ========== */
.card-title { font-weight: 700; margin-bottom: 16rpx; color: #2f261f; font-size: 28rpx; }
.part-row {
  display: flex; align-items: center; gap: 14rpx;
  padding: 14rpx 0; border-bottom: 1rpx solid rgba(236, 228, 214, 0.7);
}
.part-row:last-child { border-bottom: none; }
.part-thumb {
  width: 76rpx; height: 76rpx; border-radius: 16rpx;
  background: linear-gradient(135deg, #faf6f0, #f0e8dc);
  flex-shrink: 0;
  border: 1rpx solid rgba(228, 214, 191, 0.6);
}
.part-info { flex: 1; display: flex; flex-direction: column; gap: 4rpx; min-width: 0; }
.part-name { font-weight: 600; color: #2f261f; font-size: 26rpx; }
.part-meta { color: #8a7d71; font-size: 22rpx; }
.part-price { color: #8a6420; font-weight: 700; font-size: 26rpx; }

/* ========== 操作按钮 ========== */
.actions { display: flex; flex-direction: column; gap: 16rpx; }
.actions-row { display: flex; gap: 12rpx; }
.actions-buy { margin-top: 6rpx; }
/* 淘宝小程序提示 */
.taobao-tip { padding: 24rpx; background: #fff8e6; border-radius: 12rpx; margin-top: 16rpx; }
.taobao-tip .tip-text { color: #8a6d3b; font-size: 26rpx; line-height: 1.5; }
.btn {
  flex: 1; padding: 20rpx 0; border-radius: 16rpx;
  background: rgba(250, 248, 243, 0.95); color: #3a2f24;
  border: 1rpx solid rgba(230, 220, 200, 0.7);
  font-size: 28rpx; font-weight: 600; letter-spacing: 1rpx;
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
  text-align: center; line-height: 1.4;
  display: flex; align-items: center; justify-content: center;
}
.btn.action {
  border: none; color: #fff; border-radius: 999rpx;
  padding: 22rpx 0; font-size: 30rpx;
  box-shadow: 0 12rpx 28rpx rgba(44, 30, 16, 0.2), 0 4rpx 8rpx rgba(44, 30, 16, 0.1);
}
.btn.action.cart {
  background: linear-gradient(145deg, #e8c08a, #c99445, #b88743);
}
.btn.action.buy {
  background: linear-gradient(145deg, #dbb88e, #a87b48, #96693a);
}
.btn.primary {
  background: linear-gradient(135deg, #bda06b, #e7d1a7); color: #3b2a16;
  border: none; box-shadow: 0 12rpx 26rpx rgba(167, 129, 73, 0.25);
}
.btn.ghost {
  background: #fff; border: 1rpx solid rgba(225, 212, 188, 0.8); color: #5d5146;
}
.btn.ai {
  background: linear-gradient(145deg, #d4b580, #eacda0, #c9a468); color: #3b2a16;
  font-weight: 700; box-shadow: 0 10rpx 22rpx rgba(166, 127, 73, 0.22);
}
.btn.share {
  background: linear-gradient(135deg, #f2e6d2, #e7caa3); color: #7a4b12;
  font-weight: 600; box-shadow: 0 10rpx 22rpx rgba(164, 119, 60, 0.22);
}
.btn.small { flex: 1; padding: 14rpx 0; font-size: 24rpx; border-radius: 14rpx; }
.btn.full { flex: 0 0 100%; width: 100%; }

/* ========== AI 解读弹层 ========== */
.ai-modal {
  position: fixed; left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.55); display: flex;
  align-items: center; justify-content: center; z-index: 999; padding: 24rpx;
}
.ai-card {
  background: #fff; border-radius: 24rpx; width: 92%; max-width: 720rpx;
  padding: 24rpx; box-shadow: 0 16rpx 40rpx rgba(46, 32, 18, 0.2);
  border: 1rpx solid rgba(232, 222, 204, 0.7);
}
.ai-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14rpx; }
.ai-title { font-size: 32rpx; font-weight: 700; }
.ai-close { font-size: 32rpx; color: #999; padding: 8rpx; }
.ai-card-body { background: #faf7f2; border-radius: 18rpx; padding: 18rpx; }
.ai-image {
  position: relative; width: 100%; padding-top: 100%; border-radius: 14rpx;
  overflow: hidden; margin-bottom: 14rpx;
  background: linear-gradient(135deg, #fdfbfb, #f0ece6);
}
.ai-image image { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; }
.ai-image-fallback {
  position: absolute; left: 0; top: 0; right: 0; bottom: 0;
  display: flex; align-items: center; justify-content: center;
}
.ai-report-box {
  background: #fff; border-radius: 16rpx; padding: 16rpx;
  box-shadow: 0 6rpx 14rpx rgba(52, 36, 20, 0.06);
  margin-bottom: 14rpx; border: 1rpx solid rgba(236, 226, 206, 0.6);
}
.ai-report-title { font-size: 26rpx; color: #8a7a69; letter-spacing: 1rpx; margin-bottom: 8rpx; }
.ai-report { font-size: 30rpx; color: #2b2117; line-height: 1.7; white-space: pre-wrap; }
.ai-footer { display: flex; align-items: center; justify-content: space-between; gap: 12rpx; margin-top: 8rpx; flex-wrap: wrap; }
.ai-qrcode {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8rpx; padding: 16rpx; background: #fff; border-radius: 16rpx;
  box-shadow: 0 8rpx 18rpx rgba(48, 34, 20, 0.1);
  transform: scale(1.05); transform-origin: center;
  border: 1rpx solid rgba(230, 218, 196, 0.6);
}
.qr-tip { font-size: 22rpx; color: #847567; }
.ai-actions { display: flex; flex-direction: column; gap: 8rpx; flex: 1; }
.ai-actions .btn { width: 100%; padding: 14rpx; }
.hidden-canvas { position: absolute; left: -9999rpx; top: -9999rpx; width: 700rpx; height: 1400rpx; }

/* ========== 参赛弹层 ========== */
.contest-modal {
  position: fixed; left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.55); display: flex;
  align-items: center; justify-content: center; z-index: 999; padding: 24rpx;
}
.contest-card {
  background: #fff; border-radius: 24rpx; width: 90%; max-width: 680rpx;
  padding: 24rpx; box-shadow: 0 16rpx 40rpx rgba(46, 32, 18, 0.2);
  border: 1rpx solid rgba(232, 222, 204, 0.7);
}
.contest-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14rpx; }
.contest-title { font-size: 32rpx; font-weight: 700; }
.contest-close { font-size: 32rpx; color: #999; padding: 8rpx; }
.contest-body { display: flex; flex-direction: column; gap: 16rpx; }
.contest-field { display: flex; flex-direction: column; gap: 8rpx; }
.contest-label { font-size: 24rpx; color: #6f6255; font-weight: 500; }
.contest-input {
  height: 76rpx; border-radius: 14rpx; padding: 0 16rpx;
  border: 1rpx solid rgba(229, 219, 201, 0.7);
  background: #fbf8f3; font-size: 26rpx; color: #2f261f;
}
.contest-actions { display: flex; gap: 12rpx; margin-top: 8rpx; }

/* #ifdef MP-JD */
.jd-agreement-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.jd-agreement-card {
  background: #fff;
  border-radius: 24rpx;
  width: 85%;
  max-width: 600rpx;
  padding: 40rpx;
}
.jd-agreement-header {
  text-align: center;
  margin-bottom: 30rpx;
}
.jd-agreement-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}
.jd-agreement-body {
  margin-bottom: 30rpx;
}
.jd-agreement-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}
.jd-agreement-summary {
  margin-top: 20rpx;
  padding: 20rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
}
.jd-agreement-summary text {
  display: block;
  font-size: 26rpx;
  color: #333;
  line-height: 1.8;
}
.jd-agreement-actions {
  display: flex;
  gap: 20rpx;
}
.jd-agreement-actions .btn {
  flex: 1;
}
/* #endif */
</style>
