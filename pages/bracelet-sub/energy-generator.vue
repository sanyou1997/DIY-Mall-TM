<template>
  <view class="energy-page" :class="theme_view">
    <view class="hero">
      <view class="hero-title">生成今日能量手串</view>
      <view class="hero-sub">根据你的标签，自动搭配专属守护</view>
    </view>

    <view class="card">
      <view class="section-title">你的标签</view>
      <view class="field">
        <view class="field-label">幸运色</view>
        <view class="chip-group">
          <view
            v-for="item in luckyColorOptions"
            :key="item.value"
            :class="['chip color-chip', form.luckyColor === item.value ? 'active' : '']"
            @tap="form.luckyColor = item.value"
          >
            <view class="color-dot" :style="{ background: item.color }"></view>
            <text>{{ item.label }}</text>
          </view>
        </view>
      </view>

      <view class="field" v-if="styleOptions.length">
        <view class="field-label">风格类型</view>
        <view class="chip-group">
          <view
            v-for="item in styleOptions"
            :key="item"
            :class="['chip', form.style === item ? 'active' : '']"
            @tap="form.style = item"
          >
            {{ item }}
          </view>
        </view>
      </view>

      <view class="field">
        <view class="field-label">祝福愿望（可多选）</view>
        <view class="chip-group">
          <view
            v-for="item in wishOptions"
            :key="item"
            :class="['chip', form.wishes.includes(item) ? 'active' : '']"
            @tap="toggleWish(item)"
          >
            {{ item }}
          </view>
        </view>
      </view>

      <view class="field">
        <view class="field-label">手串对称</view>
        <view class="chip-group">
          <view
            v-for="item in symmetryOptions"
            :key="item.value"
            :class="['chip', form.symmetry === item.value ? 'active' : '']"
            @tap="form.symmetry = item.value"
          >
            {{ item.label }}
          </view>
        </view>
      </view>

      <view class="field">
        <view class="field-label">手围 (mm)：{{ form.wristSize }}</view>
        <slider
          class="wrist-slider"
          :value="form.wristSize"
          :min="110"
          :max="210"
          :step="1"
          activeColor="#8c7bff"
          backgroundColor="#e9e5f6"
          @changing="form.wristSize = $event.detail.value"
          @change="form.wristSize = $event.detail.value"
        />
      </view>

      <view class="field">
        <view class="field-label">主珠直径</view>
        <view class="chip-group">
          <view
            v-for="item in mainSizeOptions"
            :key="item.value"
            :class="['chip', form.mainSize === item.value ? 'active' : '']"
            @tap="form.mainSize = item.value"
          >
            {{ item.label }}
          </view>
        </view>
      </view>

      <view class="field">
        <view class="field-label">生肖</view>
        <view class="chip-group">
          <view
            v-for="item in zodiacOptions"
            :key="item"
            :class="['chip', form.zodiac === item ? 'active' : '']"
            @tap="form.zodiac = item"
          >
            {{ item }}
          </view>
        </view>
      </view>

      <view class="field">
        <view class="field-label">星座</view>
        <view class="chip-group">
          <view
            v-for="item in starOptions"
            :key="item"
            :class="['chip', form.star === item ? 'active' : '']"
            @tap="form.star = item"
          >
            {{ item }}
          </view>
        </view>
      </view>
    </view>

    <view class="action-row">
      <button class="btn primary" :disabled="generating" @tap="handleGenerate">
        {{ generating ? '生成中…' : '生成推荐' }}
      </button>
    </view>

    <view v-if="visibleParts.length" class="card">
      <view class="section-title">推荐方案</view>
      <view class="preview-block">
        <!-- #ifdef MP-ALIPAY -->
        <view class="energy-dom-preview">
          <view class="energy-dom-ring" :style="domRingStyle"></view>
          <image
            v-for="(p, idx) in previewLayoutItems"
            :key="'dom-'+idx"
            class="energy-dom-bead"
            :src="p.src"
            mode="aspectFit"
            :style="p.style"
          ></image>
        </view>
        <!-- #endif -->
        <!-- #ifndef MP-ALIPAY -->
        <canvas
          canvas-id="energyPreview"
          id="energyPreview"
          class="energy-canvas"
        ></canvas>
        <!-- #endif -->
      </view>
      <view class="summary">
        <view class="summary-title">{{ suggestTitle }}</view>
        <view class="summary-tags">
          <view class="summary-tag">估价 ¥{{ computedPrice }}</view>
          <view class="summary-tag">预期手围 {{ expectedWristSize }}</view>
        </view>
        <view class="summary-metrics">
          <view class="metric-item">珠子 {{ beadCount }}</view>
          <view class="metric-item">配件 {{ accessoryCount }}</view>
        </view>
        <view class="summary-desc" v-if="suggestDesc">{{ suggestDesc }}</view>
      </view>
      <view class="mini-list" v-if="visibleParts.length">
      <view class="mini-item" v-for="(p, idx) in visibleParts" :key="idx">
          <image
            class="mini-img"
            :src="getPartImage(p)"
            mode="aspectFit"
            @error="handlePartImageError(p)"
          ></image>
          <text class="mini-name">{{ p.name }}</text>
          <text class="mini-meta">{{ p.sizeLabel || p.size }}</text>
        </view>
      </view>
      <view class="action-row">
        <button class="btn secondary" @tap="applyToBracelet">应用到设计</button>
        <button class="btn secondary" @tap="handleGenerate">再来一条</button>
      </view>
      <view class="action-row">
        <button class="btn primary" :disabled="generatingWork" @tap="generateWorkAndGo">
          {{ generatingWork ? '生成中…' : '生成作品去下单' }}
        </button>
      </view>
    </view>

    <component-common ref="common"></component-common>
  </view>
</template>

<script>
const app = getApp();
import { renderBraceletPreview } from '@/common/js/bracelet-render.js';
// #ifdef MP-ALIPAY
import { computeBraceletPositions } from '@/common/js/bracelet-layout.js';
// #endif
// #ifdef MP-ALIPAY
import { taobaoRequest } from '@/common/js/taobao-cloud.js';
import { baseInfoCsvText } from '@/common/js/base-info-data.js';
import { getTmallImageUrl } from '@/common/js/tmall-image-map.js';
// #endif
export default {
  data() {
    return {
      theme_view: '',
      generating: false,
      generatingWork: false,
      previewCanvasSize: 300,
      previewRadiusRatio: 0.27,
      defaultPerimeter: 160,
      stringColor: '#ff0000',
      fallbackImage: '',
      // 与 bracelet.vue 对齐：吊坠额外缩放（让吊坠相对珠子更协调）
      PENDANT_SCALE: 0.80,
      form: {
        zodiac: '',
        star: '',
        wishes: ['随机'],
        luckyColor: 'random',
        style: '随机',
        mainSize: 10,
        symmetry: 'symmetric',
        wristSize: 160,
      },
      lastSelection: {
        zodiac: '',
        star: '',
        wishes: [],
        luckyColor: '',
        style: '',
      },
      generatedParts: [],
      hiddenParts: [],
      zodiacOptions: ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'],
      starOptions: ['白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手','摩羯','水瓶','双鱼'],
      wishOptions: ['澄心净念','金榜题名','睡个好觉','发大财','升职加薪','求桃花','万事顺遂','体健安泰','平安护佑','心想事成','随机'],
      styleOptions: ['极简百搭','能量疗愈','少女甜美','轻奢精致','自然森系','国风禅意','民族异域','随机'],
      luckyColorOptions: [
        { label: '粉色', value: '粉', color: '#FFC0CB' },
        { label: '黄色', value: '黄', color: '#FFD86A' },
        { label: '紫色', value: '紫', color: '#C6B4F5' },
        { label: '白色', value: '白', color: '#F5F5F5' },
        { label: '茶色', value: '茶', color: '#D4AF91' },
        { label: '随机', value: 'random', color: '#E0E0E0' },
      ],
      symmetryOptions: [
        { label: '对称', value: 'symmetric' },
        { label: '不对称', value: 'asymmetric' },
      ],
      mainSizeOptions: [
        { label: '6mm', value: 6 },
        { label: '8mm', value: 8 },
        { label: '10mm', value: 10 },
        { label: '12mm', value: 12 },
        { label: '14mm', value: 14 },
        { label: '随机', value: 'random' },
      ],
      materials: {},
      accessories: {},
      baseBeads: [],
      baseSpacers: [],
      basePendants: [],
      baseFlowerCaps: [],
      baseAccessories: [],
      baseStrings: [],
      imageScaleConfig: { 'default': 1.08 },
      baseInfoLoaded: false,
      // MP-ALIPAY：用 DOM 版预览替代 canvas，避免旧版 Canvas drawImage 远程 URL 延迟。
      previewLayoutItems: [],
    };
  },
  computed: {
    visibleParts() { return (this.generatedParts || []).filter(Boolean).filter((p) => !p.isHidden); },
    beadCount() { return this.visibleParts.filter((p) => !p.isAccessory).length; },
    accessoryCount() { return this.visibleParts.filter((p) => p.isAccessory).length; },
    computedPrice() { return this.visibleParts.reduce((sum, item) => sum + Number(item.priceNum || 0), 0); },
    expectedWristSize() { return this.calculateWristSize(this.visibleParts || []); },
    suggestTitle() {
      const selection = this.getDisplaySelection();
      if (selection.wishes.length) return `今日能量 · ${selection.wishes[0]}`;
      if (selection.star) return `今日能量 · ${selection.star}`;
      return '今日能量手串';
    },
    suggestDesc() {
      const selection = this.getDisplaySelection();
      const parts = [];
      if (selection.zodiac) parts.push(`生肖：${selection.zodiac}`);
      if (selection.star) parts.push(`星座：${selection.star}`);
      if (selection.wishes.length) parts.push(`愿望：${selection.wishes.join('、')}`);
      if (selection.luckyColor) parts.push(`幸运色：${this.luckyColorLabel(selection.luckyColor)}`);
      if (selection.style) parts.push(`风格：${selection.style}`);
      return parts.join(' | ');
    },
    // #ifdef MP-ALIPAY
    domRingStyle() {
      const cs = 620;
      const r = cs * (this.previewRadiusRatio || 0.27);
      const d = 2 * r;
      const off = (cs - d) / 2;
      return `left:${off}rpx;top:${off}rpx;width:${d}rpx;height:${d}rpx;border:2rpx solid ${this.stringColor};`;
    },
    // #endif
    selectionDesc() {
      const selection = this.getDisplaySelection();
      const parts = [];
      if (selection.luckyColor) parts.push(`幸运色：${this.luckyColorLabel(selection.luckyColor)}`);
      if (selection.style) parts.push(`风格：${selection.style}`);
      if (selection.wishes.length) parts.push(`愿望：${selection.wishes.join('、')}`);
      if (selection.zodiac) parts.push(`生肖：${selection.zodiac}`);
      if (selection.star) parts.push(`星座：${selection.star}`);
      return parts.join(' | ');
    },
  },
  onShow() {},
  onLoad() {
    try { this.theme_view = app?.globalData?.get_theme_value_view?.() || ''; } catch (e) { this.theme_view = ''; }
    this.fallbackImage = this.normalizeStaticAssetPath('/static/beads/兜底图片.png');
    this._imageCache = {};
    this.imageRetryMap = {};
    this._memoryWarningHandler = (res) => { this._imageCache = {}; this.imageRetryMap = {}; if (typeof wx !== 'undefined' && wx.triggerGC) wx.triggerGC(); };
    if (typeof uni !== 'undefined' && uni.onMemoryWarning) uni.onMemoryWarning(this._memoryWarningHandler);
    this.loadBaseInfo();
  },
  onReady() {},
  onUnload() { if (this._memoryWarningHandler && typeof uni !== 'undefined' && uni.offMemoryWarning) uni.offMemoryWarning(this._memoryWarningHandler); this._imageCache = null; this.imageRetryMap = null; this._previewCtx = null; this.generatedParts = []; this.hiddenParts = []; this._previewToken = null; },
  watch: { },
  methods: {
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
    isOnLoginPage() { try { const pages = getCurrentPages ? getCurrentPages() : []; const current = pages[pages.length - 1]; const route = current && (current.route || current.__route__); return route === 'pages/login/login'; } catch (e) { return false; } },
    navigateToLogin() { if (this.isOnLoginPage()) return; uni.navigateTo({ url: '/pages/login/login' }); },
    isUserLoggedIn() { const getter = app?.globalData?.get_user_cache_info; if (typeof getter === 'function') { const cached = getter.call(app.globalData); if (cached && Number(cached.id || cached.user_id || 0) > 0) return true; } const key = app?.globalData?.data?.cache_user_info_key || 'cache_shop_user_info_key'; const stored = uni.getStorageSync(key) || {}; if (stored && Number(stored.id || stored.user_id || 0) > 0) return true; return !!this.getToken(); },
    getToken() { return app?.globalData?.token || app?.globalData?.user_token || app?.globalData?.user?.token || app?.globalData?.user_info?.token || uni.getStorageSync('token') || uni.getStorageSync('user_token') || uni.getStorageSync('user_token_value') || ''; },
    buildImagePath(level1, imageName) { if (!imageName) return ''; const raw = String(imageName).trim(); if (!raw) return '';
      // #ifdef MP-ALIPAY
      // 淘宝/支付宝：优先走天猫 CDN 图片映射表（与 bracelet.vue 一致），
      // 避免使用 ostone.store 域名（非白名单会被下载失败）。
      { const tmallUrl = getTmallImageUrl(raw); if (tmallUrl) return tmallUrl; }
      // #endif const normalized = this.normalizeStaticAssetPath(raw); if (/^https?:\/\//i.test(normalized) || normalized.startsWith('/static/') || normalized.startsWith('/public/static/bracelet/')) return normalized; let cleaned = normalized.replace(/^\/+/, ''); if (cleaned.startsWith('static/')) return this.mapBraceletStaticPath(cleaned) || `/${cleaned}`; if (cleaned.startsWith('pages/bracelet/static/')) { cleaned = cleaned.replace(/^pages\/bracelet\/static\//, 'static/'); return this.mapBraceletStaticPath(cleaned) || `/${cleaned}`; } if (cleaned.includes('/')) return `/${cleaned}`; const baseRoot = this.getBraceletStaticBase(); const dir = level1 === '配件' ? 'accessories' : 'beads'; const base = baseRoot ? `${baseRoot}/${dir}/` : `/static/${dir}/`; const hasExt = /\.[a-zA-Z0-9]+$/.test(cleaned); return `${base}${cleaned}${hasExt ? '' : '.png'}`; },
    getBraceletStaticBase() { const base = app?.globalData?.data?.static_url || ''; const normalized = String(base || '').replace(/\/+$/, ''); return normalized ? `${normalized}/static/bracelet` : ''; },
    mapBraceletStaticPath(raw) { const text = String(raw || '').trim(); if (!text) return ''; if (/^https?:\/\//i.test(text)) return text; const base = this.getBraceletStaticBase(); const normalized = text.replace(/^\/+/, ''); const mappings = [{ prefix: 'static/beads/', dir: 'beads' }, { prefix: 'static/accessories/', dir: 'accessories' }, { prefix: 'static/bracelet/beads/', dir: 'beads' }, { prefix: 'static/bracelet/accessories/', dir: 'accessories' }]; for (const { prefix, dir } of mappings) { if (normalized.startsWith(prefix)) { const rest = normalized.slice(prefix.length); return base ? `${base}/${dir}/${rest}` : `/${normalized}`; } } return text.startsWith('/') ? text : `/${text}`; },
    normalizeStaticAssetPath(raw) { const text = String(raw || '').trim(); if (!text) return ''; if (/^https?:\/\//i.test(text)) return text; let normalized = text; if (normalized.startsWith('/pages/bracelet/static/')) normalized = normalized.replace('/pages/bracelet/static/', '/static/'); else if (normalized.startsWith('pages/bracelet/static/')) normalized = '/' + normalized.replace('pages/bracelet/static/', 'static/'); else if (normalized.startsWith('static/')) normalized = '/' + normalized; if (normalized.startsWith('/static/')) return this.mapBraceletStaticPath(normalized); return normalized; },
    loadBaseInfo() {
      // #ifdef MP-ALIPAY
      // 淘宝/支付宝：域名白名单受限，远程请求会被 taobaoRequest 劫持为云应用 /api.php 调用，
      // 因此直接使用打包进包体的嵌入 CSV，与 bracelet.vue 保持一致。
      try {
        console.log('[energy-generator] MP-ALIPAY: 使用嵌入CSV数据，长度', baseInfoCsvText ? baseInfoCsvText.length : 0);
        if (baseInfoCsvText && baseInfoCsvText.length) {
          const text = this.normalizeCsvText(baseInfoCsvText);
          const parsed = this.parseBaseInfoCsv(text);
          console.log('[energy-generator] MP-ALIPAY: 解析完成, beads:', parsed ? parsed.beads.length : 0);
          this.applyParsedBaseInfo(parsed);
          if (this.baseInfoLoaded && this.baseBeads.length) return;
        }
        console.warn('[energy-generator] MP-ALIPAY: 嵌入CSV数据无效');
        uni.showToast({ title: '素材加载失败，请重启小程序', icon: 'none', duration: 3000 });
      } catch (e) {
        console.error('[energy-generator] MP-ALIPAY: 嵌入CSV加载错误:', e);
        uni.showToast({ title: '素材加载失败，请重启小程序', icon: 'none', duration: 3000 });
      }
      return;
      // #endif

      // #ifdef MP-WEIXIN
      const fs = (typeof wx !== 'undefined' && wx.getFileSystemManager)
        ? wx.getFileSystemManager()
        : (typeof uni.getFileSystemManager === 'function' ? uni.getFileSystemManager() : null);
      if (fs) {
        const userPath = (typeof wx !== 'undefined' && wx.env && wx.env.USER_DATA_PATH)
          ? `${wx.env.USER_DATA_PATH}/base_info.csv` : '';
        const buildStaticUrl = (path) => {
          const base = app?.globalData?.data?.static_url || '';
          if (!base) return '';
          const cleanBase = base.endsWith('/') ? base : `${base}/`;
          return cleanBase + String(path || '').replace(/^\/+/, '');
        };
        const remoteUrls = [buildStaticUrl('static/bracelet/base_info.csv')].filter(Boolean);
        const tryRemote = (index) => {
          if (index >= remoteUrls.length) { this.tryLoadCsvFallbacks(); return; }
          this._request({
            url: remoteUrls[index], method: 'GET', responseType: 'arraybuffer', dataType: 'text',
            success: (res) => {
              if (res && res.data) {
                const text = this.normalizeCsvText(res.data);
                const parsed = this.parseBaseInfoCsv(text);
                this.applyParsedBaseInfo(parsed);
                if (this.baseInfoLoaded && this.baseBeads.length) {
                  if (userPath) { try { fs.writeFile({ filePath: userPath, data: text, encoding: 'utf-8' }); } catch (e) {} }
                  return;
                }
              }
              tryRemote(index + 1);
            },
            fail: () => tryRemote(index + 1),
          });
        };
        if (userPath) {
          fs.readFile({
            filePath: userPath, encoding: 'utf-8',
            success: (res) => {
              const parsed = this.parseBaseInfoCsv(res.data || '');
              this.applyParsedBaseInfo(parsed);
              if (this.baseInfoLoaded && this.baseBeads.length) return;
              tryRemote(0);
            },
            fail: () => tryRemote(0),
          });
        } else tryRemote(0);
        return;
      }
      // #endif

      // 非微信端（京东/支付宝等）：使用远程 URL 加载 CSV
      const buildStaticUrl = (path) => {
        const base = app?.globalData?.data?.static_url || 'https://ostone.store/';
        const cleanBase = base.endsWith('/') ? base : `${base}/`;
        return cleanBase + String(path || '').replace(/^\/+/, '');
      };
      // 多个备用 URL
      const urls = [
        buildStaticUrl('static/bracelet/base_info.csv'),
        buildStaticUrl('static/base_info.csv'),
        'https://ostone.store/static/bracelet/base_info.csv'
      ];
      console.log('[loadBaseInfo] 非微信端, urls:', urls);
      const tryNext = (index) => {
        if (index >= urls.length) {
          console.warn('[energy-generator] CSV加载全部失败');
          uni.showToast({ title: '素材加载失败，请检查网络后重试', icon: 'none', duration: 3000 });
          return;
        }
        console.log('[loadBaseInfo] 尝试加载:', urls[index]);
        this._request({
          url: urls[index], method: 'GET',
          dataType: 'text',
          responseType: 'text',
          success: (res) => {
            console.log('[loadBaseInfo] 请求成功, statusCode:', res.statusCode, 'dataLength:', res.data ? res.data.length : 0);
            if (res && res.data) {
              const text = this.normalizeCsvText(res.data);
              const parsed = this.parseBaseInfoCsv(text);
              console.log('[loadBaseInfo] 解析完成, beads:', parsed ? parsed.beads.length : 0);
              this.applyParsedBaseInfo(parsed);
              if (this.baseInfoLoaded && this.baseBeads.length) {
                console.log('[loadBaseInfo] 加载成功, baseBeads:', this.baseBeads.length);
                return;
              }
            }
            tryNext(index + 1);
          },
          fail: (err) => {
            console.error('[loadBaseInfo] 请求失败:', err);
            tryNext(index + 1);
          },
        });
      };
      tryNext(0);
    },
    parseBaseInfoCsv(text) { const lines = String(text || '').split(/\r?\n/).filter((l) => l.trim()); if (lines.length <= 1) return null; const header = this.parseCsvLine(lines.shift()).map((h) => String(h || '').replace(/^\uFEFF/, '').trim()); const idx = (key, fallback) => { const i = header.indexOf(key); return i >= 0 ? i : fallback; }; const idxFunc = idx('function', -1); const buildPath = typeof this.buildImagePath === 'function' ? this.buildImagePath.bind(this) : (level1, imageName) => { if (!imageName) return ''; const raw = String(imageName).trim(); if (!raw) return ''; let cleaned = raw.replace(/^\/+/, ''); if (/^https?:\/\//i.test(cleaned)) return cleaned; if (cleaned.startsWith('pages/bracelet/static/')) cleaned = cleaned.replace(/^pages\/bracelet\/static\//, 'static/'); const baseRoot = this.getBraceletStaticBase(); const dir = level1 === '配件' ? 'accessories' : 'beads'; if (cleaned.startsWith('static/')) { const mapped = this.mapBraceletStaticPath(cleaned); if (mapped) return mapped; } const hasExt = /\.[a-zA-Z0-9]+$/.test(cleaned); return baseRoot ? `${baseRoot}/${dir}/${cleaned}${hasExt ? '' : '.png'}` : `/static/${dir}/${cleaned}${hasExt ? '' : '.png'}`; }; const idxType = idx('type', 0); const idxCat = idx('categories', 1); const idxName = idx('name', 2); const idxSpec = idx('specification', 3); const idxSize = idx('size', 4); const idxWidth = idx('width', -1); const idxHeight = idx('height', -1); const idxPrice = idx('Price', idx('price', 5)); const idxImage = idx('imageMap', header.length - 1); const idxColor = idx('颜色', -1); const idxZodiac = idx('生肖标签', -1); const idxStar = idx('星座标签', -1); const idxWish = idx('祝福愿望', -1); const idxStyle = idx('风格类型', -1); const idxBackupPrice = idx('小程序中上串尺寸', 5); const idxSkuId = idx('sku_id', -1); const result = { beads: [], spacers: [], pendants: [], flowerCaps: [], accessories: [], strings: [] }; let idCounter = 1; for (const line of lines) { const cols = this.parseCsvLine(line); if (cols.length < 4) continue; const func = idxFunc >= 0 ? (cols[idxFunc] || '') : ''; const type = cols[idxType] || ''; const category = cols[idxCat] || ''; const name = cols[idxName] || ''; const sizeRaw = cols[idxSpec] || ''; const sizeValue = cols[idxSize] || ''; const width = idxWidth >= 0 ? (cols[idxWidth] || '') : ''; const height = idxHeight >= 0 ? (cols[idxHeight] || '') : ''; const priceStr = cols[idxPrice] || cols[idxBackupPrice] || ''; const imageName = cols[idxImage] || ''; const colorTag = idxColor >= 0 ? (cols[idxColor] || '') : ''; const zodiacTags = idxZodiac >= 0 ? this.parseTags(cols[idxZodiac]) : []; const starTags = idxStar >= 0 ? this.parseTags(cols[idxStar]) : []; const wishTags = idxWish >= 0 ? this.parseTags(cols[idxWish]) : []; const styleTag = idxStyle >= 0 ? (cols[idxStyle] || '') : ''; if (!category || !name) continue; const sizeMm = this.parseSizeMm(sizeValue); const priceNum = this.safeNumber(priceStr); const skuId = idxSkuId >= 0 ? (cols[idxSkuId] || '') : ''; const level1 = String(func || '').trim() === '配件' ? '配件' : '珠子'; const item = { id: String(skuId || '').trim() || idCounter++, sku_id: String(skuId || '').trim(), type, types: type, category, name, sizeMm, width, height, sizeLabel: sizeRaw || (sizeMm ? `${sizeMm}mm` : ''), priceNum, imagePath: imageName ? buildPath(level1, imageName) : '', colorTag, zodiacTags, starTags, wishTags, styleTag, colorHex: '#E0E0E0' }; const typeField = (type || '').trim(); const funcField = (func || '').trim(); if (typeField.includes('弹力绳') || (category || '').includes('弹力绳')) result.strings.push(item); else if (typeField.includes('提溜') || typeField.includes('吊坠')) { if (item.sizeMm) result.pendants.push(item); } else if (typeField === '花托' || (category || '').includes('花托')) { if (item.sizeMm) result.flowerCaps.push(item); } else if (typeField === '隔珠' || typeField === '隔片') { if (item.sizeMm) result.spacers.push(item); } else if (funcField === '配件') { if (item.sizeMm) result.accessories.push(item); } else { if (item.sizeMm) result.beads.push(item); } } return result; },
    applyParsedBaseInfo(parsed) { if (!parsed) return; this.baseBeads = parsed.beads || []; this.baseSpacers = parsed.spacers || []; this.basePendants = parsed.pendants || []; this.baseFlowerCaps = parsed.flowerCaps || []; this.baseAccessories = parsed.accessories || []; this.baseStrings = parsed.strings || []; const wishSet = new Set(); const styleSet = new Set(); const colorSet = new Set(); const allItems = [...this.baseBeads, ...this.baseSpacers, ...this.basePendants, ...this.baseFlowerCaps, ...this.baseAccessories, ...this.baseStrings]; allItems.forEach((item) => { (item.wishTags || []).forEach((w) => wishSet.add(w)); if (item.styleTag) styleSet.add(item.styleTag); const colorTokens = this.splitColorTokens(item.colorTag || ''); colorTokens.forEach((c) => colorSet.add(c)); }); const wishList = Array.from(wishSet); const styleList = Array.from(styleSet); const colorList = Array.from(colorSet).map((c) => ({ label: c, value: c, color: this.colorTokenToHex(c) })); if (!wishList.includes('随机')) wishList.push('随机'); if (!styleList.includes('随机')) styleList.push('随机'); if (!colorList.find((c) => c.value === 'random')) colorList.push({ label: '随机', value: 'random', color: '#E0E0E0' }); if (wishList.length) this.wishOptions = wishList; if (styleList.length) this.styleOptions = styleList; if (colorList.length) this.luckyColorOptions = colorList; this.baseInfoLoaded = true; },
    tryLoadCsvFallbacks() {
      const buildUrl = (path) => {
        const base = app?.globalData?.data?.static_url || 'https://ostone.store/';
        const cleanBase = base.endsWith('/') ? base : `${base}/`;
        return cleanBase + String(path || '').replace(/^\/+/, '');
      };
      const urls = [buildUrl('static/bracelet/base_info.csv'), buildUrl('static/base_info.csv')];
      const tryNext = (index) => {
        if (index >= urls.length) { console.warn('[energy-generator] CSV加载全部失败'); uni.showToast({ title: '素材加载失败，请检查网络后重试', icon: 'none', duration: 3000 }); return; }
        this._request({
          url: urls[index], method: 'GET',
          dataType: 'text',  // 避免自动 JSON 解析
          responseType: 'text',
          success: (res) => {
            if (!res || !res.data) return tryNext(index + 1);
            const text = this.normalizeCsvText(res.data);
            const parsed = this.parseBaseInfoCsv(text);
            this.applyParsedBaseInfo(parsed);
            if (!this.baseBeads.length) tryNext(index + 1);
          },
          fail: () => tryNext(index + 1),
        });
      };
      tryNext(0);
    },
    normalizeCsvText(data) { if (typeof data === 'string') return data; try { if (typeof TextDecoder !== 'undefined' && data instanceof ArrayBuffer) return new TextDecoder('utf-8').decode(new Uint8Array(data)); } catch (e) {} if (data instanceof ArrayBuffer) { const bytes = new Uint8Array(data); let result = ''; const chunk = 0x8000; for (let i = 0; i < bytes.length; i += chunk) result += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk)); return decodeURIComponent(escape(result)); } return String(data || ''); },
    parseCsvLine(line) { const out = []; let cur = ''; let inQuotes = false; for (let i = 0; i < line.length; i++) { const ch = line[i]; if (ch === '"') { const next = line[i + 1]; if (inQuotes && next === '"') { cur += '"'; i++; } else inQuotes = !inQuotes; } else if (ch === ',' && !inQuotes) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out.map((s) => s.trim()); },
    parseTags(value) { if (!value) return []; return String(value).replace(/^"+|"+$/g, '').replace(/[，、｜|]/g, ',').split(',').map((v) => v.trim().replace(/^"+|"+$/g, '')).filter(Boolean); },
    splitColorTokens(value) { if (!value) return []; return String(value).replace(/[+\/]/g, ',').replace(/，/g, ',').split(',').map((v) => v.trim()).filter(Boolean); },
    colorTokenToHex(token) { const map = { 白: '#F5F5F5', 透明: '#F5F5F5', 黑: '#2B2B2B', 灰: '#B8B8B8', 灰白: '#D9D9D9', 金: '#D4AF37', 银: '#C0C0C0', 黄: '#FFD86A', 金黄: '#E1B64C', 金橙: '#F4B183', 红: '#E15B5B', 深红: '#8B1E2D', 红粉: '#F29AB2', 玫红: '#D93C8E', 粉: '#FFC0CB', 蓝: '#6AA9FF', 深蓝: '#2F4B9A', 蓝绿: '#5DB7B7', 绿: '#66C58D', 棕: '#A67C52', 茶: '#B08A6C', 紫: '#A88AE8', 薰衣草紫: '#C9A7E8', 多彩: '#B6B6B6' }; return map[token] || '#E0E0E0'; },
    parseSizeMm(value) { if (!value) return null; const match = String(value).match(/(\d+(\.\d+)?)/); if (!match) return null; return Number(match[1]); },
    safeNumber(val) { const n = parseFloat(String(val).replace(/[^\d.]/g, '')); return isNaN(n) ? 0 : n; },
    toggleWish(item) { if (item === '随机') { this.form.wishes = ['随机']; return; } const idx = this.form.wishes.indexOf(item); if (idx >= 0) this.form.wishes.splice(idx, 1); else this.form.wishes.push(item); const randomIdx = this.form.wishes.indexOf('随机'); if (randomIdx >= 0 && this.form.wishes.length > 1) this.form.wishes.splice(randomIdx, 1); },
    luckyColorLabel(val) { const hit = this.luckyColorOptions.find((c) => c.value === val); return hit ? hit.label : val || ''; },
    handleGenerate() {
      if (!this.baseInfoLoaded) { uni.showToast({ title: '素材加载中，请稍后重试', icon: 'none' }); return; }
      if (!this.baseBeads.length) { uni.showToast({ title: '素材数据为空', icon: 'none' }); return; }
      // 清除缓存
      this.imageRetryMap = {};
      this._imageCache = {};
      this._previewToken = null; // 重置 token，确保新绘制不被跳过
      if (typeof wx !== 'undefined' && wx.triggerGC) wx.triggerGC();
      this.applyRandomSelections();
      this.generating = true;
      setTimeout(() => {
        const result = this.buildRecommendation();
        this.generatedParts = result.parts;
        this.hiddenParts = result.hidden || [];
        this.generating = false;
        uni.showToast({ title: '已生成', icon: 'none' });
        console.log('[handleGenerate] 数据已生成，parts数量:', this.generatedParts.length);
        // 打印前几个 part 的图片路径用于调试
        this.generatedParts.slice(0, 3).forEach((p, i) => {
          console.log('[handleGenerate] part', i, ':', p.name, 'isAccessory:', p.isAccessory, 'imagePath:', p.imagePath);
        });
        this.$nextTick(() => {
          console.log('[handleGenerate] nextTick 调用 drawPreview');
          // #ifdef MP-ALIPAY
          this.drawPreview();
          // #endif
          // #ifndef MP-ALIPAY
          setTimeout(() => { this.drawPreview(); }, 150);
          // #endif
        });
        setTimeout(() => { if (typeof wx !== 'undefined' && wx.triggerGC) wx.triggerGC(); }, 500);
      }, 80);
    },
    applyRandomSelections() { this.lastSelection = this.resolveSelection(); this.activeSelection = this.lastSelection; },
    resolveSelection() { const selection = { zodiac: this.form.zodiac || '', star: this.form.star || '', wishes: [], luckyColor: '', style: '' }; if (this.form.luckyColor && this.form.luckyColor !== 'random') selection.luckyColor = this.form.luckyColor; else { const candidates = (this.luckyColorOptions || []).filter((c) => c.value !== 'random'); if (candidates.length) selection.luckyColor = candidates[Math.floor(Math.random() * candidates.length)].value; } if (this.form.style && this.form.style !== 'random') selection.style = this.form.style; else { const candidates = (this.styleOptions || []).filter((c) => c !== '随机'); if (candidates.length) selection.style = candidates[Math.floor(Math.random() * candidates.length)]; } if (this.form.wishes.length && !this.form.wishes.includes('随机')) selection.wishes = this.form.wishes.slice(); else { const candidates = (this.wishOptions || []).filter((c) => c !== '随机'); if (candidates.length) selection.wishes = [candidates[Math.floor(Math.random() * candidates.length)]]; } return selection; },
    resolveMainSize(beads = []) { const selected = this.form.mainSize; if (!selected || selected === 'random') return null; const size = parseInt(selected); if (!size) return null; if (!Array.isArray(beads) || beads.length === 0) return size; return beads.some((b) => Number(b.sizeMm || b.size) === size) ? size : null; },
    getDisplaySelection() { if (this.lastSelection && (this.lastSelection.luckyColor || this.lastSelection.style || this.lastSelection.wishes.length || this.lastSelection.zodiac || this.lastSelection.star)) return this.lastSelection; return { zodiac: this.form.zodiac || '', star: this.form.star || '', wishes: (this.form.wishes || []).filter((w) => w !== '随机'), luckyColor: this.form.luckyColor === 'random' ? '' : (this.form.luckyColor || ''), style: this.form.style === 'random' ? '' : (this.form.style || '') }; },
    buildRecommendation() { const selection = this.activeSelection || this.resolveSelection(); const targetWishes = selection.wishes || []; const targetStyle = selection.style || ''; const targetLuckyColor = selection.luckyColor || ''; const isSymmetric = this.form.symmetry === 'symmetric'; const beadCandidates = this.filterByPreference(this.baseBeads, { wishes: targetWishes, style: targetStyle, luckyColor: targetLuckyColor }); const candidatePool = beadCandidates.length ? beadCandidates : this.baseBeads; const preferredFamily = this.normalizeLuckyColorFamily(targetLuckyColor); const dominantFamily = this.pickDominantColorFamily(candidatePool, preferredFamily); const familyBeads = this.filterByColorFamily(candidatePool, dominantFamily); const limitedBeads = this.limitCategories(familyBeads.length ? familyBeads : candidatePool, 3); let sizeChoices = []; const preferredMainSize = this.resolveMainSize(limitedBeads); if (preferredMainSize) sizeChoices = [preferredMainSize]; else sizeChoices = this.chooseMainSizes(limitedBeads); let mainPool = this.filterBySizes(limitedBeads, sizeChoices); if (!mainPool.length) { sizeChoices = this.chooseMainSizes(limitedBeads); mainPool = this.filterBySizes(limitedBeads, sizeChoices); } const accentPool = mainPool.length > 1 ? mainPool : limitedBeads; const beadStyle = this.pickDominantStyle(mainPool); const beadCount = this.computeBeadCount(sizeChoices[0], this.form.wristSize || this.defaultPerimeter); const halfCount = isSymmetric ? Math.floor(beadCount / 2) : beadCount; let parts = []; const accentInterval = this.randInRange(4, 7); const accentStart = this.randInRange(0, accentInterval - 1); for (let i = 0; i < halfCount; i++) { const useAccent = accentPool.length > 1 && (i - accentStart) % accentInterval === 0; const beadItem = useAccent ? this.pickOne(accentPool) : this.pickOne(mainPool); if (beadItem) parts.push(this.createItem(beadItem, false)); } if (preferredFamily) this.enforceColorMajority(parts, preferredFamily, mainPool, limitedBeads, 0.5); let centerPart = null; if (isSymmetric && beadCount % 2 === 1) { const centerBead = this.pickOne(mainPool.length ? mainPool : limitedBeads); if (centerBead) centerPart = this.createItem(centerBead, false); } const accessories = []; const _accPrefs = { wishes: targetWishes, style: beadStyle || targetStyle, luckyColor: targetLuckyColor }; const _beadCountForLimit = parts.filter(p => !p.isAccessory).length; const _maxRepeatable = Math.max(1, Math.floor(_beadCountForLimit / 4)); let _repeatableCount = 0; if (this.basePendants.length && Math.random() > 0.55) { const pendantItem = this.pickAccessoryByPreference(this.basePendants, _accPrefs); if (pendantItem) { const pendant = this.createItem(pendantItem, true); if (isSymmetric) centerPart = pendant; else { parts.splice(0, 0, pendant); accessories.push(pendant); } } } if (this.baseFlowerCaps.length && Math.random() > 0.35 && _repeatableCount + 2 <= _maxRepeatable) { const flowerItem = this.pickAccessoryByPreference(this.baseFlowerCaps, _accPrefs); if (flowerItem && parts.length >= 3) { const insertIndex = Math.floor(parts.length / 2); const bead = parts[insertIndex]; const left = this.createItem(flowerItem, true); const right = this.createItem(flowerItem, true); parts.splice(insertIndex, 1, left, bead, right); accessories.push(left, right); _repeatableCount += 2; } } if (this.baseSpacers.length && Math.random() > 0.25 && _repeatableCount < _maxRepeatable) { const spacerItem = this.pickAccessoryByPreference(this.baseSpacers, _accPrefs); if (spacerItem) { const _added = this.insertSpacers(parts, spacerItem, accessories, _maxRepeatable - _repeatableCount); _repeatableCount += _added; } } if (this.baseAccessories.length) { const _pool = this.filterByPreference(this.baseAccessories, _accPrefs); const _src = _pool.length ? _pool : this.baseAccessories; const _gemPool = _src.filter(a => this.getAccessorySubType(a) === 'gem'); const _ringPool = _src.filter(a => this.getAccessorySubType(a) === 'ring'); const _metalPool = _src.filter(a => this.getAccessorySubType(a) === 'metal'); const _spacerPool = _src.filter(a => this.getAccessorySubType(a) === 'spacer'); const _otherPool = _src.filter(a => { const st = this.getAccessorySubType(a); return st !== 'gem' && st !== 'ring' && st !== 'metal' && st !== 'spacer'; }); if (_gemPool.length && Math.random() > 0.4) { const pick = this.pickOne(_gemPool); if (pick) { const gemItem = this.createItem(pick, true); if (isSymmetric) { if (!centerPart || !centerPart.isAccessory) { centerPart = gemItem; accessories.push(gemItem); } } else { parts.push(gemItem); accessories.push(gemItem); if (Math.random() > 0.5) { const pick2 = this.pickOne(_gemPool); if (pick2) { const g2 = this.createItem(pick2, true); parts.push(g2); accessories.push(g2); } } } } } if (_ringPool.length && Math.random() > 0.5) { const pick = this.pickOne(_ringPool); if (pick) { const item = this.createItem(pick, true); parts.push(item); accessories.push(item); } } if (_metalPool.length && _repeatableCount < _maxRepeatable) { const pick = this.pickOne(_metalPool); if (pick) { const metalItem = this.createItem(pick, true); if (isSymmetric) { if (!centerPart || !centerPart.isAccessory) { centerPart = metalItem; accessories.push(metalItem); _repeatableCount++; } } else { parts.push(metalItem); accessories.push(metalItem); _repeatableCount++; if (Math.random() > 0.5 && _repeatableCount < _maxRepeatable) { const pick2 = this.pickOne(_metalPool); if (pick2) { const m2 = this.createItem(pick2, true); parts.push(m2); accessories.push(m2); _repeatableCount++; } } } } } if (_spacerPool.length && _repeatableCount < _maxRepeatable) { const _spacerBudget = _maxRepeatable - _repeatableCount; const _spacerPick = this.pickOne(_spacerPool); if (_spacerPick) { const _spAdded = this.insertSpacers(parts, _spacerPick, accessories, _spacerBudget); _repeatableCount += _spAdded; } } if (_otherPool.length && accessories.length < (isSymmetric ? 3 : 4)) { const pick = this.pickOne(_otherPool); if (pick) { const item = this.createItem(pick, true); parts.push(item); accessories.push(item); } } } const adjusted = this.adjustPartsToWrist(parts, centerPart, mainPool.length ? mainPool : limitedBeads, this.form.wristSize || this.defaultPerimeter || 160, isSymmetric); parts = adjusted.parts; centerPart = adjusted.centerPart; const hidden = []; const stringItem = this.pickAccessoryByPreference(this.baseStrings, { wishes: targetWishes, style: beadStyle || targetStyle, luckyColor: targetLuckyColor }); if (stringItem) hidden.push({ ...this.createItem(stringItem, true), isHidden: true }); if (isSymmetric) { const symmetricParts = this.makeSymmetric(parts, centerPart); return { parts: symmetricParts.filter(Boolean), hidden }; } return { parts: parts.filter(Boolean), hidden }; },
    adjustPartsToWrist(parts, centerPart, beadPool, targetWrist, isSymmetric) { const minWrist = targetWrist - 5; const maxWrist = targetWrist + 5; const pool = beadPool || []; let workingParts = (parts || []).slice(); let workingCenter = centerPart || null; const buildItems = () => (isSymmetric ? this.makeSymmetric(workingParts, workingCenter) : workingParts); for (let i = 0; i < 60; i++) { const items = buildItems(); const wristValue = this.calculateWristValue(items); if (wristValue >= minWrist && wristValue <= maxWrist) return { parts: workingParts, centerPart: workingCenter }; if (wristValue < minWrist) { const pick = this.pickOne(pool); if (!pick) break; workingParts.push(this.createItem(pick, false)); continue; } if (wristValue > maxWrist) { const removed = this.removeLastBead(workingParts); if (!removed) break; continue; } } let best = { parts: workingParts, centerPart: workingCenter }; let bestDiff = Math.abs(this.calculateWristValue(buildItems()) - targetWrist); for (let i = 0; i < 20; i++) { const items = buildItems(); const wristValue = this.calculateWristValue(items); const diff = Math.abs(wristValue - targetWrist); if (diff < bestDiff) { best = { parts: workingParts, centerPart: workingCenter }; bestDiff = diff; } if (wristValue < minWrist) { const pick = this.pickOne(pool); if (!pick) break; workingParts.push(this.createItem(pick, false)); } else if (wristValue > maxWrist) { const removed = this.removeLastBead(workingParts); if (!removed) break; } else return { parts: workingParts, centerPart: workingCenter }; } return best; },
    removeLastBead(parts) { if (!parts || !parts.length) return false; for (let i = parts.length - 1; i >= 0; i--) { if (!parts[i].isAccessory) { parts.splice(i, 1); return true; } } return false; },
    enforceColorMajority(parts, family, preferredPool, fallbackPool, minRatio = 0.5) { const beadIndexes = []; let matchCount = 0; parts.forEach((item, idx) => { if (item && !item.isAccessory) { beadIndexes.push(idx); if (this.getItemColorFamily(item) === family) matchCount += 1; } }); const total = beadIndexes.length; if (!total) return; const target = Math.ceil(total * minRatio); if (matchCount >= target) return; const poolBase = (preferredPool || []).length ? preferredPool : (fallbackPool || []); const matchingPool = poolBase.filter((item) => this.getItemColorFamily(item) === family); if (!matchingPool.length) return; const need = target - matchCount; let replaced = 0; for (const idx of beadIndexes) { if (replaced >= need) break; const current = parts[idx]; if (this.getItemColorFamily(current) === family) continue; const pick = this.pickOne(matchingPool); if (pick) { parts[idx] = this.createItem(pick, false); replaced += 1; } } },
    makeSymmetric(halfParts, centerPart = null) { const firstHalf = (halfParts || []).filter(Boolean); const mirrored = firstHalf.slice().reverse().map((item) => this.cloneItem(item)); const result = firstHalf.slice(); if (centerPart) result.push(centerPart); return result.concat(mirrored); },
    cloneItem(item) { return { ...item, uniqueId: Date.now() + Math.random() }; },
    filterByPreference(list, target) { let pool = list.slice(); const hasLucky = target.luckyColor && target.luckyColor !== 'random'; const hasStyle = target.style && target.style !== 'random'; const hasWish = target.wishes && target.wishes.length && !target.wishes.includes('随机'); if (hasLucky) { const next = pool.filter((item) => this.luckyColorMatches(item.colorTag || '', target.luckyColor)); if (next.length) pool = next; } if (hasStyle) { const next = pool.filter((item) => item.styleTag && item.styleTag.includes(target.style)); if (next.length) pool = next; } if (hasWish) { const next = pool.filter((item) => (item.wishTags || []).some((w) => target.wishes.includes(w))); if (next.length) pool = next; } return pool; },
    pickAccessoryByPreference(list, target) { const preferred = this.filterByPreference(list, target); return this.pickOne(preferred.length ? preferred : list); },
    computeBeadCount(sizeMm, targetWrist) { const size = sizeMm || 8; const wrist = targetWrist || this.defaultPerimeter || 160; const targetCount = Math.round(wrist / size + Math.PI); const minCount = Math.ceil((wrist - 5) / size + Math.PI); const maxCount = Math.floor((wrist + 5) / size + Math.PI); const boundedMin = Math.max(14, minCount); const boundedMax = Math.min(24, maxCount); const clamped = Math.min(boundedMax, Math.max(boundedMin, targetCount)); return clamped; },
    chooseMainSizes(list) { const sizeMap = {}; list.forEach((item) => { if (item.sizeMm) { if (!sizeMap[item.sizeMm]) sizeMap[item.sizeMm] = []; sizeMap[item.sizeMm].push(item); } }); const sizes = Object.keys(sizeMap).map((s) => Number(s)).filter((n) => !isNaN(n)); if (!sizes.length) return [8]; const preferred = sizes.filter((s) => s === 8 || s === 10); const pickPreferred = preferred.length ? preferred : sizes; const main = pickPreferred[Math.floor(Math.random() * pickPreferred.length)]; const secondaryCandidates = sizes.filter((s) => s !== main); if (!secondaryCandidates.length || Math.random() < 0.6) return [main]; const secondary = secondaryCandidates[Math.floor(Math.random() * secondaryCandidates.length)]; return [main, secondary]; },
    filterBySizes(list, sizeChoices) { return list.filter((item) => sizeChoices.includes(item.sizeMm)); },
    limitCategories(list, maxCount) { const byCat = {}; list.forEach((item) => { const cat = item.category || 'default'; if (!byCat[cat]) byCat[cat] = []; byCat[cat].push(item); }); const cats = Object.keys(byCat); if (cats.length <= maxCount) return list; const shuffled = cats.sort(() => Math.random() - 0.5).slice(0, maxCount); return list.filter((item) => shuffled.includes(item.category || 'default')); },
    normalizeLuckyColorFamily(val) { if (!val) return ''; const map = { pink: '粉', yellow: '黄', purple: '紫', white: '白', brown: '棕' }; return map[val] || val; },
    pickDominantColorFamily(list, preferred) { if (preferred) return preferred; const counter = {}; list.forEach((item) => { const family = this.getItemColorFamily(item); if (family) counter[family] = (counter[family] || 0) + 1; }); const families = Object.keys(counter); if (!families.length) return ''; families.sort((a, b) => counter[b] - counter[a]); return families[0]; },
    filterByColorFamily(list, family) { if (!family) return list; return list.filter((item) => this.getItemColorFamily(item) === family); },
    getItemColorFamily(item) { const tokens = this.splitColorTokens(item.colorTag || ''); for (const t of tokens) { const family = this.colorTokenToFamily(t); if (family) return family; } return ''; },
    colorTokenToFamily(token) { const map = { 白: '白', 透明: '白', 灰: '灰', 灰白: '灰', 黑: '黑', 蓝: '蓝', 深蓝: '蓝', 蓝灰: '蓝', 蓝绿: '绿', 绿: '绿', 黄: '黄', 金: '黄', 金黄: '黄', 金棕: '棕', 金橙: '黄', 红: '红', 深红: '红', 红粉: '粉', 玫红: '粉', 粉: '粉', 紫: '紫', 薰衣草紫: '紫', 茶: '棕', 棕: '棕', 多彩: '多彩' }; return map[token] || ''; },
    pickDominantStyle(list) { const counter = {}; list.forEach((item) => { const style = item.styleTag || ''; if (style) counter[style] = (counter[style] || 0) + 1; }); const styles = Object.keys(counter); if (!styles.length) return ''; styles.sort((a, b) => counter[b] - counter[a]); return styles[0]; },
    pickByMatch(list, target) { const scored = list.map((item) => ({ item, score: this.matchScore(item, target) })); scored.sort((a, b) => b.score - a.score); const topScore = scored.length ? scored[0].score : 0; if (topScore <= 0) return []; return scored.filter((s) => s.score >= topScore).map((s) => s.item); },
    pickAccessoryByMatch(list, target) { if (!list.length) return null; const scored = list.map((item) => ({ item, score: this.matchScore(item, target) })); scored.sort((a, b) => b.score - a.score); const hit = scored[0] && scored[0].score > 0 ? scored[0].item : null; return hit || this.pickOne(list); },
    matchScore(item, target) { let score = 0; if (target.wishes && target.wishes.length) { const hasWish = (item.wishTags || []).some((w) => target.wishes.includes(w)); if (hasWish) score += 4; } if (target.style && item.styleTag && item.styleTag.includes(target.style)) score += 4; if (target.luckyColor && this.luckyColorMatches(item.colorTag || '', target.luckyColor)) score += 5; if (target.zodiac && (item.zodiacTags || []).includes(target.zodiac)) score += 1; if (target.star && (item.starTags || []).includes(target.star)) score += 1; return score; },
    luckyColorMatches(colorTag, luckyVal) { if (!luckyVal) return false; if (!colorTag) return false; if (String(colorTag).includes(luckyVal)) return true; const tokens = this.splitColorTokens(colorTag); return tokens.includes(luckyVal); },
    pickOne(list) { if (!list.length) return null; return list[Math.floor(Math.random() * list.length)]; },
    insertSpacers(parts, spacerItem, accessories = [], maxCount) { const budget = typeof maxCount === 'number' ? maxCount : Infinity; let added = 0; const maxConsecutive = 2; let consecutive = 0; const interval = this.randInRange(4, 7); const start = this.randInRange(0, interval - 1); for (let i = 0; i < parts.length; i++) { if (added >= budget) break; if (i > 0 && (i - start) % interval === 0 && consecutive < maxConsecutive) { const spacer = this.createItem(spacerItem, true); parts.splice(i, 0, spacer); accessories.push(spacer); consecutive += 1; added += 1; } else if (!parts[i].isAccessory) consecutive = 0; } return added; },
    randInRange(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
    createItem(item, isAccessory) { const fallback = this.fallbackImage || this.normalizeStaticAssetPath('/static/beads/兜底图片.png'); const sizeLabel = item.sizeLabel || (item.sizeMm ? `${item.sizeMm}mm` : (item.size ? `${item.size}` : '8mm')); const sizeNumeric = item.sizeMm || this.parseSizeMm(sizeLabel) || this.parseSizeMm(item.size) || 8; const imagePath = item.imagePath || item.imageMap || fallback; const imageMap = item.imageMap || item.imagePath || fallback; const width = item.width || ''; const height = item.height || ''; const safeWidth = (isAccessory && !width) ? String(sizeNumeric) : String(width || ''); const safeHeight = (isAccessory && !height) ? String(sizeNumeric) : String(height || ''); return { id: item.sku_id || item.id || 0, sku_id: item.sku_id || '', types: item.types || item.type || '', type: item.type || item.types || '', name: item.name, color: item.colorHex || '#E0E0E0', price: item.priceNum ? `¥${item.priceNum}` : '', priceNum: item.priceNum || 0, size: String(sizeNumeric), sizeLabel, category: item.category, width: safeWidth, height: safeHeight, qty: 1, isAccessory, imageScale: this.imageScaleConfig[item.category] || this.imageScaleConfig.default, imagePath: imagePath || fallback, imageMap: imageMap || fallback, uniqueId: Date.now() + Math.random() }; },
    applyToBracelet() { if (!this.visibleParts.length) { uni.showToast({ title: '请先生成方案', icon: 'none' }); return; } const payload = { design_parts: this.normalizePartsForBracelet(this.visibleParts), design_hidden_parts: this.normalizePartsForBracelet(this.hiddenParts), design_title: this.suggestTitle, design_desc: this.suggestDesc, design_price: this.computedPrice }; try { uni.setStorageSync('bracelet_restore', payload); } catch (e) { console.error('[applyToBracelet] setStorageSync fail', e); }
      // #ifdef MP-JD
      // 京东小程序没有 tabBar，直接使用 navigateTo
      uni.navigateTo({ url: '/pages/bracelet/bracelet', success: () => uni.showToast({ title: '已应用到设计', icon: 'success' }), fail: (err) => { console.error('[applyToBracelet] navigateTo fail', err); uni.redirectTo({ url: '/pages/bracelet/bracelet' }); } });
      // #endif
      // #ifndef MP-JD
      uni.switchTab({ url: '/pages/bracelet/bracelet', success: () => uni.showToast({ title: '已应用到设计', icon: 'success' }), fail: () => uni.navigateTo({ url: '/pages/bracelet/bracelet' }) });
      // #endif
    },
    generateWorkAndGo() {
    if (this.generatingWork) return;
    if (!this.visibleParts.length) { uni.showToast({ title: '请先生成方案', icon: 'none' }); return; }
    if (!this.isUserLoggedIn()) { uni.showToast({ title: '请先登录', icon: 'none' }); this.navigateToLogin(); return; }
    this.generatingWork = true;
    const resetGenerating = () => { this.generatingWork = false; };
    const normalizedParts = this.normalizePartsForBracelet(this.visibleParts);
    console.log('[generateWorkAndGo] visibleParts:', this.visibleParts.length, 'computedPrice:', this.computedPrice);
    console.log('[generateWorkAndGo] normalizedParts sample:', normalizedParts.length > 0 ? JSON.stringify(normalizedParts[0]) : 'empty');
    const workData = {
      work_id: 'local_' + Date.now(),
      design_parts: normalizedParts,
      design_title: this.suggestTitle,
      design_desc: this.suggestDesc,
      design_price: this.computedPrice
    };
    console.log('[generateWorkAndGo] workData.design_price:', workData.design_price);
    const goNext = (imagePath) => {
      console.log('[generateWorkAndGo] goNext imagePath:', imagePath);
      workData.image_url = imagePath || '';
      workData.design_image_url = imagePath || '';
      workData.design_image = imagePath || '';
      // 京东小程序：同时存入 storage 作为备份
      try { uni.setStorageSync('work_detail_data', workData); } catch (e) {}
      let channel = null;
      uni.navigateTo({
        url: '/pages/bracelet-sub/work-detail',
        success: (navRes) => {
          channel = navRes.eventChannel || null;
          console.log('[generateWorkAndGo] eventChannel available:', !!channel);
          if (channel) channel.emit('work-data', workData);
        }
      });
      this.saveWorkRemote(workData).then((result) => {
        if (!this.isUserLoggedIn()) { resetGenerating(); return; }
        if (result && result.work_id) workData.work_id = result.work_id;
        if (result && result.image_url) {
          workData.image_url = result.image_url;
          workData.design_image_url = result.image_url;
          workData.design_image = result.image_url;
        }
        if (channel) channel.emit('work-saved', workData);
        resetGenerating();
      }).catch(() => resetGenerating());
    };
    this.drawPreview();
    const capture = () => {
      if (typeof uni.canvasToTempFilePath !== 'function') {
        console.log('[generateWorkAndGo] canvasToTempFilePath not available');
        goNext('');
        return;
      }
      uni.canvasToTempFilePath({
        canvasId: 'energyPreview',
        quality: 0.9,
        success: (res) => {
          console.log('[generateWorkAndGo] canvasToTempFilePath success:', res.tempFilePath);
          goNext(res.tempFilePath);
        },
        fail: (err) => {
          console.error('[generateWorkAndGo] canvasToTempFilePath fail:', err);
          goNext('');
        }
      }, this);
    };
    setTimeout(capture, 50);
  },
    saveWorkRemote(workData) { return new Promise((resolve) => { const sendSave = (imageBase64) => { if (imageBase64) workData.design_image_base64 = imageBase64; else if (workData.design_image && String(workData.design_image).startsWith('data:image')) workData.design_image_base64 = workData.design_image; const payload = { creator: this.getCurrentUserName(), work_id: workData.work_id, design_title: workData.design_title || '我的手串', design_desc: workData.design_desc, design_price: workData.design_price, design_parts: JSON.stringify(workData.design_parts || []), ...this.getCommonParams() }; if (workData.design_image_base64) payload.design_image_base64 = workData.design_image_base64; else if (workData.design_image_url) payload.design_image_url = workData.design_image_url; const commonParams = this.getCommonParams(); const tokenQuery = commonParams.token ? `&token=${encodeURIComponent(commonParams.token)}` : ''; const url = app.globalData.get_request_url('save', 'braceletworks') + tokenQuery; this._request({ url, method: 'POST', data: payload, withCredentials: true, success: (resp) => { if (resp.data && resp.data.code === 0) { const data = resp.data.data || {}; const rid = data.work_id || null; const imageUrl = data.image_url || ''; resolve({ work_id: rid, image_url: imageUrl }); } else if (resp.data && /绑定.*手机/.test(resp.data.msg || '')) { app.globalData.showToast('请先绑定手机后再生成作品'); this.navigateToLogin(); resolve(null); } else if (resp.data && (resp.data.code === -1001 || resp.data.code === -400)) { if (!this.isUserLoggedIn()) { try { uni.setStorageSync('pending_work_save', workData); } catch (e) {} this.navigateToLogin(); } resolve(null); } else resolve(null); }, fail: () => resolve(null) }); }; if (workData.design_image && String(workData.design_image).startsWith('data:image')) { sendSave(workData.design_image); return; } try { if (typeof uni.getFileSystemManager === 'function' && workData.design_image) { const fs = uni.getFileSystemManager(); fs.readFile({ filePath: workData.design_image, encoding: 'base64', success: (res) => sendSave('data:image/png;base64,' + res.data), fail: () => fetchAsArrayBufferAndSend() }); return; } } catch (e) {} const fetchAsArrayBufferAndSend = () => { if (!workData.design_image) { sendSave(''); return; } uni.request({ url: workData.design_image, method: 'GET', responseType: 'arraybuffer', success: (res) => { try { const base64 = uni.arrayBufferToBase64(res.data); sendSave('data:image/png;base64,' + base64); } catch (err) { sendSave(''); } }, fail: () => sendSave('') }); }; fetchAsArrayBufferAndSend(); }); },
    getCurrentUserName() { const user = app?.globalData?.user || app?.globalData?.user_info || {}; return user.nick_name || user.nickname || user.user_name || user.username || ''; },
    getCommonParams() { const token = app?.globalData?.token || app?.globalData?.user_token || app?.globalData?.user?.token || app?.globalData?.user_info?.token || uni.getStorageSync('token') || uni.getStorageSync('user_token') || uni.getStorageSync('user_token_value') || ''; const params = { application: 'app', application_client_type: app?.globalData?.client_type || 'h5', ajax: 'ajax' }; if (token) params.token = token; return params; },
    normalizePartsForBracelet(parts = []) { const fallback = this.fallbackImage || this.normalizeStaticAssetPath('/static/beads/兜底图片.png'); return (parts || []).map((item) => { const sizeLabel = item.sizeLabel || (item.size ? `${item.size}` : '8mm'); const sizeNumeric = this.parseSizeMm(sizeLabel) || this.parseSizeMm(item.size) || 8; const imageMap = item.imageMap || item.imagePath || fallback; const imagePath = item.imagePath || item.imageMap || fallback; const skuId = item.sku_id || ''; return { ...item, id: skuId, sku_id: skuId, size: String(sizeNumeric), sizeLabel, imageMap: imageMap || fallback, imagePath: imagePath || fallback }; }); },
	drawPreview() {
    console.log('[drawPreview] 开始, visibleParts.length=', this.visibleParts.length, 'generatedParts.length=', this.generatedParts.length);
    // #ifdef MP-ALIPAY
    // 淘宝/支付宝：直接用 DOM <image> 渲染，不走 canvas，绕开旧版 Canvas 的远程图延迟。
    this._computeDomPreviewLayout();
    return;
    // #endif
    if (!this.visibleParts.length) {
      console.warn('[drawPreview] 没有可见的珠子，跳过绘制');
      return;
    }
    const token = Date.now();
    this._previewToken = token;
    console.log('[drawPreview] 新 token:', token);

    const renderWithSize = async (size) => {
      console.log('[renderWithSize] 开始, size=', size, 'token=', token, 'currentToken=', this._previewToken);
      if (this._previewToken !== token) {
        console.warn('[renderWithSize] token 过期，取消绘制, expected:', token, 'actual:', this._previewToken);
        return;
      }

      const radius = size * (this.previewRadiusRatio || 0.33);
      this._previewCtx = uni.createCanvasContext('energyPreview', this);
      const ctx = this._previewCtx;
      console.log('[renderWithSize] ctx 创建完成, ctx=', !!ctx);

      if (!ctx) {
        console.error('[renderWithSize] ctx 为空，无法绘制');
        return;
      }

      const items = await this.preparePreviewItems();
      console.log('[renderWithSize] items 准备完成, 数量=', items.length);
      if (this._previewToken !== token) {
        console.warn('[renderWithSize] token 过期（准备数据后），取消绘制');
        return;
      }

      try {
        console.log('[renderWithSize] 调用 renderBraceletPreview');
        await renderBraceletPreview({
          ctx,
          items,
          opts: {
            canvasSize: size,
            radius,
            stringColor: this.stringColor,
            defaultPerimeter: this.defaultPerimeter,
            pendantScale: this.PENDANT_SCALE,
            aspectRatioConfig: this.aspectRatioConfig || {},
            holeOffsetConfig: this.holeOffsetConfig || {},
            imageScaleConfig: this.imageScaleConfig || {},
            watermarkText: '一生一石',
            resolveImage: (src) => {
              let cleanedSrc = src || '';
              if (cleanedSrc.startsWith('/wxfile://')) {
                cleanedSrc = cleanedSrc.substring(1);
              }
              // #ifdef MP-JD
              if (/^https?:\/\//i.test(cleanedSrc)) {
                return new Promise((resolve) => {
                  uni.downloadFile({
                    url: cleanedSrc,
                    success: (res) => {
                      if (res.statusCode === 200 && res.tempFilePath) {
                        console.log('[resolveImage JD] 下载成功:', cleanedSrc.slice(-30), '->', res.tempFilePath);
                        resolve(res.tempFilePath);
                      } else {
                        console.warn('[resolveImage JD] 下载状态非200:', res.statusCode);
                        resolve(cleanedSrc);
                      }
                    },
                    fail: (err) => {
                      console.error('[resolveImage JD] 下载失败:', err);
                      resolve(cleanedSrc);
                    }
                  });
                });
              }
              // #endif
              // #ifdef MP-ALIPAY
              console.log('[resolveImage ALIPAY] 使用预加载路径:', cleanedSrc ? cleanedSrc.slice(-40) : 'null');
              // #endif
              return Promise.resolve(cleanedSrc);
            }
          }
        });
        console.log('[renderWithSize] renderBraceletPreview 调用完成');
      } catch (err) {
        console.error('[renderWithSize] renderBraceletPreview 失败:', err);
      }
    };

    // #ifdef MP-ALIPAY
    // 淘宝/支付宝 IDE 中 selectorQuery 对 .energy-canvas 常年返回 null，
    // 但 canvas 的 CSS 尺寸是固定的 620rpx，直接用缓存尺寸或默认值，免得白等 600ms。
    renderWithSize(this.previewCanvasSize || 300);
    // #endif
    // #ifndef MP-ALIPAY
    const tryQuery = (retryCount = 0) => {
      const query = uni.createSelectorQuery().in(this);
      query.select('.energy-canvas').boundingClientRect((res) => {
        console.log('[drawPreview] boundingClientRect 回调, res=', res, 'retry=', retryCount);
        if (!res || !res.width) {
          if (retryCount < 5) {
            console.log('[drawPreview] 元素未就绪，延迟重试');
            setTimeout(() => tryQuery(retryCount + 1), 100);
            return;
          }
          console.warn('[drawPreview] 元素查询失败，使用默认尺寸');
        }
        const size = (res && res.width) ? Math.round(res.width) : (this.previewCanvasSize || 300);
        if (res && res.width) {
          this.previewCanvasSize = size;
        }
        renderWithSize(size);
      }).exec();
    };
    tryQuery();
    // #endif
  },
  // #ifdef MP-ALIPAY
  _computeDomPreviewLayout() {
    const items = (this.visibleParts || []).filter(Boolean);
    if (!items.length) { this.previewLayoutItems = []; return; }
    const cs = 620; // 与 .energy-dom-preview 宽高一致（单位 rpx）
    const layout = computeBraceletPositions(items, {
      canvasSize: cs,
      centerX: cs / 2,
      centerY: cs / 2,
      radius: cs * (this.previewRadiusRatio || 0.27),
      defaultPerimeter: this.defaultPerimeter,
      startAngle: (2 * Math.PI) / 3,
      holeRatio: 0.10,
      pendantScale: this.PENDANT_SCALE,
    });
    const positions = layout.positions || [];
    const scaleCfg = this.imageScaleConfig || { default: 1 };
    const fallback = this.fallbackImage || this.normalizeStaticAssetPath('/static/beads/兜底图片.png');
    const RAD2DEG = 180 / Math.PI;
    const layoutItems = positions.map((pos) => {
      const item = pos.item || {};
      const imgScale = item.imageScale || scaleCfg[item.category] || scaleCfg.default || 1;
      const imgH = (pos.displayHeight || (pos.displayRadius || 0) * 2) * imgScale;
      const imgW = imgH;
      const left = pos.x - imgW / 2;
      const top = pos.y - imgH / 2;
      const rotDeg = (pos.rotationAngle || 0) * RAD2DEG;
      const src = item._resolvedImage || item.imageMap || item.imagePath || fallback;
      return {
        src,
        style:
          `left:${left.toFixed(2)}rpx;top:${top.toFixed(2)}rpx;` +
          `width:${imgW.toFixed(2)}rpx;height:${imgH.toFixed(2)}rpx;` +
          `transform:rotate(${rotDeg.toFixed(2)}deg);transform-origin:center center;`,
      };
    });
    this.previewLayoutItems = layoutItems;
    console.log('[drawPreview] DOM 预览布局完成, count=', layoutItems.length);
  },
  // #endif
	async preparePreviewItems() {
    const fallback = this.fallbackImage || this.normalizeStaticAssetPath('/static/beads/兜底图片.png');
    const items = (this.visibleParts || []).filter(Boolean).map((item) => ({ ...item }));
    console.log('[preparePreviewItems] 开始处理', items.length, '个珠子');

    // 先收集所有唯一的图片 URL，避免重复下载
    const urlToLocalPath = {};
    const uniqueUrls = [];
    items.forEach((item) => {
      const src = item.imageMap || item.imagePath || fallback;
      if (!urlToLocalPath[src]) {
        urlToLocalPath[src] = null; // 占位
        uniqueUrls.push(src);
      }
    });
    console.log('[preparePreviewItems] 唯一图片数:', uniqueUrls.length);

    // 串行下载图片（避免京东小程序并发限制）
    // #ifdef MP-ALIPAY
    // 淘宝/支付宝：旧版 Canvas 的 ctx.drawImage(httpsUrl) 会在 ctx.draw() 之后才
    // 异步去下载图片，体验上要等十几秒。用 uni.downloadFile 并行预下载到本地
    // tempFilePath，再丢给 canvas。每张加 5s 超时，防止 Promise.all 被某张卡住。
    const DL_TIMEOUT_MS = 5000;
    let dlDone = 0;
    const total = uniqueUrls.length;
    await Promise.all(uniqueUrls.map((src, idx) => new Promise((resolve) => {
      if (!/^https?:\/\//i.test(src)) { urlToLocalPath[src] = src; return resolve(); }
      let settled = false;
      const done = (path, note) => {
        if (settled) return;
        settled = true;
        urlToLocalPath[src] = path;
        dlDone += 1;
        console.log('[preparePreviewItems] ALIPAY 下载', dlDone, '/', total, note, src.slice(-30));
        resolve();
      };
      const timer = setTimeout(() => done(src, 'TIMEOUT'), DL_TIMEOUT_MS);
      uni.downloadFile({
        url: src,
        success: (res) => {
          clearTimeout(timer);
          if (res && res.statusCode === 200 && res.tempFilePath) done(res.tempFilePath, 'OK');
          else done(src, 'STATUS ' + (res && res.statusCode));
        },
        fail: (err) => {
          clearTimeout(timer);
          done(src, 'FAIL ' + (err && err.errMsg || ''));
        },
      });
    })));
    console.log('[preparePreviewItems] ALIPAY 并行下载完成, 共', total);
    // #endif
    // #ifndef MP-ALIPAY
    for (let i = 0; i < uniqueUrls.length; i++) {
      const src = uniqueUrls[i];
      console.log('[preparePreviewItems] 下载', i + 1, '/', uniqueUrls.length, ':', src ? src.slice(-40) : 'null');
      try {
        const info = await this.resolveImage(src);
        const resolved = (info && info.path) ? info.path : fallback;
        urlToLocalPath[src] = resolved;
        console.log('[preparePreviewItems] 下载成功:', resolved ? resolved.slice(-40) : 'null');
      } catch (err) {
        console.error('[preparePreviewItems] 下载失败:', err);
        urlToLocalPath[src] = fallback;
      }
    }
    // #endif

    // 将本地路径赋值给每个 item
    items.forEach((item, idx) => {
      const src = item.imageMap || item.imagePath || fallback;
      const resolved = urlToLocalPath[src] || fallback;
      item._resolvedImage = resolved;
      item._imgAspectRatio = 1.0;
      item.imageMap = resolved;
      item.imagePath = resolved;
      console.log('[preparePreviewItems] item', idx, '最终路径:', resolved);
    });

    console.log('[preparePreviewItems] 全部完成');
    return items;
  },
	resolveImage(src) { return new Promise((resolve) => { const fallback = this.fallbackImage || this.normalizeStaticAssetPath('/static/beads/兜底图片.png'); const normalized = this.normalizeStaticAssetPath(src || '') || fallback; if (!normalized) { return resolve({ path: fallback, ratio: 1.0 }); } if (!this._imageCache) this._imageCache = {}; const cached = this._imageCache[normalized]; if (cached) { return resolve(cached); } const canvasSrc = normalized; const cacheAndResolve = (path, ratio = 1.0) => { const result = { path, ratio }; const keys = Object.keys(this._imageCache); if (keys.length >= 100) { keys.slice(0, 50).forEach(k => delete this._imageCache[k]); } this._imageCache[normalized] = result; resolve(result); }; const tryDownloadFirst = /^https?:\/\//i.test(canvasSrc); if (tryDownloadFirst) { uni.downloadFile({ url: canvasSrc, success: (dlRes) => { if (dlRes.statusCode === 200 && dlRes.tempFilePath) { uni.getImageInfo({ src: dlRes.tempFilePath, success: (info) => { const w = Number(info.width || 0); const h = Number(info.height || 0); const ratio = (w > 0 && h > 0) ? (w / h) : 1.0; cacheAndResolve(dlRes.tempFilePath, ratio); }, fail: () => cacheAndResolve(dlRes.tempFilePath, 1.0) }); } else { cacheAndResolve(canvasSrc, 1.0); } }, fail: () => cacheAndResolve(canvasSrc, 1.0) }); } else { uni.getImageInfo({ src: canvasSrc, success: (res) => { let path = res.path || res.tempFilePath || canvasSrc || fallback; if (path && !/^(https?:\/\/|wxfile:\/\/)/.test(path)) { if (!path.startsWith('/')) { path = `/${path}`; } } const w = Number(res.width || 0); const h = Number(res.height || 0); const ratio = (w > 0 && h > 0) ? (w / h) : 1.0; cacheAndResolve(path, ratio); }, fail: (err) => { console.error('[resolveImage] fail:', canvasSrc, err); cacheAndResolve(normalized || fallback, 1.0); } }); } }); },
	getPartImage(item) { const raw = (item && (item.imageMap || item.imagePath)) || ''; return this.normalizeStaticAssetPath(raw) || this.fallbackImage || this.normalizeStaticAssetPath('/static/beads/兜底图片.png'); },
    handlePartImageError(item) {
		if (!item) return;
		const itemId = item.uniqueId || item.id || item.sku_id || item.name || 'unknown';
		if (!this.imageRetryMap) this.imageRetryMap = {};
		const retryInfo = this.imageRetryMap[itemId] || { retryCount: 0, lastRetryTime: 0 };
		const now = Date.now();
		if (now - retryInfo.lastRetryTime < 100) return;
		retryInfo.retryCount += 1;
		retryInfo.lastRetryTime = now;
		this.imageRetryMap[itemId] = retryInfo;
		const originalImage = item._originalImageMap || item.imageMap;
		if (!item._originalImageMap) item._originalImageMap = item.imageMap;
		if (retryInfo.retryCount <= 2) {
			const retryDelay = retryInfo.retryCount * 1000;
			console.log(`[energy] Image retry ${retryInfo.retryCount}/2 for ${item.name}`);
			setTimeout(() => {
				const sep = originalImage.includes('?') ? '&' : '?';
				item.imageMap = `${originalImage}${sep}_retry=${retryInfo.retryCount}&_t=${now}`;
				this.$forceUpdate();
			}, retryDelay);
		} else {
			console.warn(`[energy] Image failed 3 times for ${item.name}`);
			const fallback = this.fallbackImage || this.normalizeStaticAssetPath('/static/beads/兜底图片.png');
			item.imageMap = fallback;
			item.imagePath = fallback;
		}
	},
    calculateWristSize(items = []) { if (!items.length) return '0mm'; const beadSize = parseInt(items[0].size) || 8; const totalAngle = this.calculateTotalAngle(items); const fullCircle = 2 * Math.PI; const baseWrist = this.form.wristSize || this.defaultPerimeter || 160; const actualCircumference = baseWrist + Math.PI * beadSize; const totalWidth = items.reduce((sum, item) => sum + this.getProjectedWidth(item, 0), 0); const fullnessRatio = totalWidth / actualCircumference; if (totalAngle > fullCircle || fullnessRatio > 1.05) { let wrist; if (this.isUniformSize(items)) wrist = (items.length - Math.PI) * beadSize; else { const maxWidth = Math.max(...items.map((item) => this.getProjectedWidth(item, 0))); wrist = totalWidth - Math.PI * maxWidth; } return `${Math.round(wrist * 10) / 10}mm`; } if (fullnessRatio >= 0.95 && fullnessRatio <= 1.05) return `${baseWrist}mm`; if (fullnessRatio < 0.95) return '过小'; return `${baseWrist}mm`; },
    calculateWristValue(items = []) { if (!items.length) return 0; const beadSize = parseInt(items[0].size) || 8; const totalAngle = this.calculateTotalAngle(items); const fullCircle = 2 * Math.PI; const baseWrist = this.form.wristSize || this.defaultPerimeter || 160; const actualCircumference = baseWrist + Math.PI * beadSize; const totalWidth = items.reduce((sum, item) => sum + this.getProjectedWidth(item, 0), 0); const fullnessRatio = totalWidth / actualCircumference; if (totalAngle > fullCircle || fullnessRatio > 1.05) { if (this.isUniformSize(items)) return (items.length - Math.PI) * beadSize; const maxWidth = Math.max(...items.map((item) => this.getProjectedWidth(item, 0))); return totalWidth - Math.PI * maxWidth; } if (fullnessRatio < 0.95) { const maxWidth = Math.max(...items.map((item) => this.getProjectedWidth(item, 0))); return Math.max(0, totalWidth - Math.PI * maxWidth); } return baseWrist; },
    isUniformSize(items = []) { if (items.length < 2) return true; const firstSize = parseInt(items[0].size) || 0; return items.every((item) => (parseInt(item.size) || 0) === firstSize); },
    computeDefaultScale(items = []) { if (!items.length) return 2; const radius = 80; const beadSize = parseInt(items[0].size) || 8; const actualCircumference = this.defaultPerimeter + Math.PI * beadSize; const displayCircumference = 2 * Math.PI * radius; return displayCircumference / actualCircumference; },
    computeBeadScale(items = []) { if (items.length < 2) return this.computeDefaultScale(items); const defaultScale = this.computeDefaultScale(items); const totalAngle = this.calculateTotalAngle(items, defaultScale); const full = 2 * Math.PI; if (totalAngle > full) return (full / totalAngle) * defaultScale; return defaultScale; },
    calculateTotalAngle(items = [], scale = null) { let totalAngle = 0; let currentAngle = 0; const useScale = scale !== null ? scale : this.computeDefaultScale(items); const n = items.length; if (!n) return 0; for (let i = 0; i < n; i++) { const item1 = items[i]; const item2 = items[(i + 1) % n]; const angle = this.calculateAngleBetweenItems(item1, item2, useScale, currentAngle); totalAngle += angle; currentAngle += angle; } return totalAngle; },
    calculateAngleBetweenItems(item1, item2, scale, angle1) { const circleRadius = 80; const width1 = this.getProjectedWidth(item1, angle1); const width2 = this.getProjectedWidth(item2, angle1); let effectiveDistance; const isPendant1 = this.isPendantAccessory(item1); const isPendant2 = this.isPendantAccessory(item2); if (!isPendant1 && !isPendant2) { const hole1 = this.getHoleOffset(item1); const hole2 = this.getHoleOffset(item2); effectiveDistance = (width1 * hole1.x) + (width2 * (1 - hole2.x)); } else effectiveDistance = (width1 + width2) / 2; const chordLength = effectiveDistance * scale; const sinValue = Math.min(chordLength / (2 * circleRadius), 1); return 2 * Math.asin(sinValue); },
    isPendantAccessory(item) { if (!item || !item.isAccessory) return false; const pendantCategories = ['宝石滴溜', '异域风格', '中华文化']; return pendantCategories.includes(item.category); },
    getPendantMainBeadRatio(item) { if (!this.isPendantAccessory(item)) return 1.0; const category = item.category; const name = item.name; const cfg = { '宝石滴溜': { '南红隔珠荔枝冻蝴蝶滴溜': 0.60, default: 0.60 }, '异域风格': { default: 0.45 }, '中华文化': { default: 0.45 } }; if (cfg[category]) return cfg[category][name] || cfg[category].default || 0.42; return 0.42; },
    getAccessoryTotalHeight(item) { const mainSize = parseInt(item.size) || 0; if (!this.isPendantAccessory(item)) return mainSize; const ratio = this.getPendantMainBeadRatio(item); return ratio ? mainSize / ratio : mainSize; },
    getAccessoryTotalWidth(item) { const height = this.getAccessoryTotalHeight(item); return height; },
    getHoleOffset(item) { if (!item || !item.isAccessory) return { x: 0.5, y: 0 }; if (this.isPendantAccessory(item)) return { x: 0.5, y: 0 }; const cfg = { '异域风格': { default: { x: 0.5, y: 0.15 } }, '中华文化': { default: { x: 0.5, y: 0.12 } } }; if (cfg[item.category] && cfg[item.category].default) return cfg[item.category].default; return { x: 0.5, y: 0 }; },
    getProjectedWidth(item, angle) { const baseSize = parseInt(item.size) || 0; if (!item.isAccessory) return baseSize; return this.getAccessoryTotalWidth(item); },
    getAccessorySubType(item) { if (!item) return 'other'; const t = (item.type || item.types || '') + (item.category || ''); if (t.includes('宝石')) return 'gem'; if (t.includes('跑环')) return 'ring'; if (t.includes('金属') || t.includes('花托')) return 'metal'; if (t.includes('隔珠') || t.includes('隔片')) return 'spacer'; return 'other'; }
  }
};
</script>

<style scoped>
.energy-page { min-height: 100vh; background: radial-gradient(120% 100% at 10% 0%, #fff6eb 0%, #fbf6ef 45%, #ffffff 100%); padding: 30rpx 26rpx 56rpx; box-sizing: border-box; }
.hero { padding: 30rpx 30rpx; border-radius: 26rpx; background: linear-gradient(135deg, #2b1f16 0%, #5a4026 45%, #b28a4f 100%); color: #fff; box-shadow: 0 20rpx 40rpx rgba(36, 24, 52, 0.35); margin-bottom: 24rpx; border: 1rpx solid rgba(255, 255, 255, 0.18); }
.hero-title { font-size: 38rpx; font-weight: 700; letter-spacing: 1rpx; }
.hero-sub { margin-top: 8rpx; font-size: 26rpx; opacity: 0.88; }
.card { background: #ffffff; border-radius: 24rpx; padding: 26rpx; box-shadow: 0 18rpx 36rpx rgba(32, 22, 52, 0.08); margin-bottom: 20rpx; border: 1rpx solid rgba(172, 150, 110, 0.18); }
.section-title { font-size: 30rpx; font-weight: 700; margin-bottom: 16rpx; color: #2a1f3a; position: relative; padding-left: 16rpx; }
.section-title::before { content: ''; position: absolute; left: 0; top: 6rpx; width: 6rpx; height: 26rpx; border-radius: 6rpx; background: linear-gradient(180deg, #c8a86b, #8c6a3a); }
.field { margin-top: 14rpx; padding-bottom: 0; border-bottom: none; }
.field-label { font-size: 26rpx; color: #5d536b; margin-bottom: 10rpx; }
.chip-group { display: flex; flex-wrap: wrap; gap: 12rpx; }
.wrist-slider { margin-top: 8rpx; }
.chip { padding: 12rpx 20rpx; border-radius: 999rpx; background: #f8f5ff; color: #4a3f60; border: 1rpx solid rgba(140, 118, 76, 0.15); font-size: 26rpx; box-shadow: 0 8rpx 16rpx rgba(90, 70, 110, 0.08); }
.chip.active { background: linear-gradient(135deg, #6c4f2a 0%, #b28a4f 60%, #e3c58c 100%); color: #fff; border-color: rgba(255, 255, 255, 0.35); box-shadow: 0 12rpx 22rpx rgba(82, 60, 32, 0.35); }
.color-chip { display: inline-flex; align-items: center; gap: 10rpx; }
.color-dot { width: 20rpx; height: 20rpx; border-radius: 50%; border: 2rpx solid #fff; box-shadow: 0 0 0 1rpx rgba(0,0,0,0.06); }
.action-row { display: flex; gap: 14rpx; margin: 14rpx 0 8rpx; }
.btn { flex: 1; padding: 20rpx; border-radius: 18rpx; font-size: 28rpx; font-weight: 600; border: none; }
.btn.secondary { border-radius: 999rpx; background: linear-gradient(135deg, #f6f1e9, #fff8ef); color: #5a4a35; border: 1rpx solid rgba(172, 150, 110, 0.28); box-shadow: 0 10rpx 22rpx rgba(132, 96, 58, 0.15); }
.btn.primary { border-radius: 22rpx; background: linear-gradient(135deg, #3b2d1f 0%, #8c6a3a 55%, #c8a86b 100%); color: #fff; box-shadow: 0 18rpx 34rpx rgba(63, 46, 24, 0.35); }
.btn.ghost { background: #fff; border: 1rpx solid #e6e0f4; color: #4b3e63; }
.summary { background: #fff8ef; border-radius: 18rpx; padding: 18rpx; color: #2b2442; margin-bottom: 14rpx; border: 1rpx solid rgba(172, 150, 110, 0.18); }
.summary-title { font-size: 30rpx; font-weight: 700; color: #2b2442; }
.summary-tags { margin-top: 8rpx; display: flex; flex-wrap: wrap; gap: 10rpx; }
.summary-tag { padding: 8rpx 16rpx; border-radius: 999rpx; background: #ffffff; border: 1rpx solid rgba(172, 150, 110, 0.22); color: #5a4a35; font-size: 24rpx; box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.05); }
.preview-block { display: flex; justify-content: center; margin-bottom: 12rpx; }
.energy-canvas { width: 620rpx; height: 620rpx; display: block; margin: 0 auto; background: transparent; border-radius: 0; box-shadow: none; border: none; }
.energy-dom-preview { position: relative; width: 620rpx; height: 620rpx; margin: 0 auto; background: transparent; }
.energy-dom-ring { position: absolute; border-radius: 50%; box-sizing: border-box; }
.energy-dom-bead { position: absolute; }
.summary-meta { margin-top: 4rpx; color: #6d6880; font-size: 24rpx; }
.summary-metrics { margin-top: 8rpx; display: flex; gap: 14rpx; flex-wrap: wrap; }
.metric-item { padding: 8rpx 14rpx; border-radius: 999rpx; background: #f6efe4; color: #5a4a35; font-size: 24rpx; }
.summary-desc { margin-top: 8rpx; color: #5a4a35; font-size: 24rpx; line-height: 1.5; }
.mini-list { display: flex; flex-wrap: wrap; gap: 12rpx; padding: 6rpx 0 4rpx; }
.mini-item { width: 92rpx; display: flex; flex-direction: column; align-items: center; gap: 4rpx; }
.mini-img { width: 80rpx; height: 80rpx; border-radius: 14rpx; background: #fbf6ef; box-shadow: inset 0 0 0 1rpx rgba(140, 118, 76, 0.2); }
.mini-name { font-size: 20rpx; color: #5a4a35; text-align: center; }
.mini-meta { font-size: 18rpx; color: #8b7a62; text-align: center; }
</style>
