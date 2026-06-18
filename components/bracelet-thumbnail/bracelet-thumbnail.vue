<template>
  <view class="bt-wrap" :style="wrapStyle">
    <view class="bt-ring" :style="ringStyle"></view>
    <image
      v-for="(p, idx) in layoutItems"
      :key="idx"
      class="bt-bead"
      :src="p.src"
      mode="aspectFit"
      :style="p.style"
    ></image>
  </view>
</template>

<script>
import { computeBraceletPositions } from '@/common/js/bracelet-layout.js';
// #ifdef MP-ALIPAY
import { getTmallImageUrl } from '@/common/js/tmall-image-map.js';
// #endif

const FALLBACK_IMAGE = '/static/beads/兜底图片.png';

export default {
  name: 'bracelet-thumbnail',
  props: {
    // 接受 Array 或 JSON 字符串（服务端有时把 design_parts 双编码成字符串）
    parts: { type: [Array, String], default: () => [] },
    size: { type: Number, default: 620 },
    ringColor: { type: String, default: '#ff0000' },
    radiusRatio: { type: Number, default: 0.27 },
    defaultPerimeter: { type: Number, default: 160 },
    pendantScale: { type: Number, default: 0.80 },
    imageScaleDefault: { type: Number, default: 1.08 },
    ringWidthRpx: { type: Number, default: 2 },
  },
  computed: {
    wrapStyle() {
      return `width:${this.size}rpx;height:${this.size}rpx;`;
    },
    ringStyle() {
      const cs = this.size;
      const r = cs * (this.radiusRatio || 0.27);
      const d = 2 * r;
      const off = (cs - d) / 2;
      return `left:${off}rpx;top:${off}rpx;width:${d}rpx;height:${d}rpx;`
        + `border:${this.ringWidthRpx}rpx solid ${this.ringColor};`;
    },
    normalizedParts() {
      // 兼容 Array / JSON 字符串 / 双编码的 JSON 字符串
      const raw = this.parts;
      if (!raw) return [];
      if (Array.isArray(raw)) return raw;
      if (typeof raw === 'string') {
        let text = raw.trim();
        if (!text) return [];
        text = text.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        try {
          let parsed = JSON.parse(text);
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch (e) {}
          }
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.warn('[bracelet-thumbnail] 解析 parts 字符串失败:', e && e.message);
          return [];
        }
      }
      return [];
    },
    layoutItems() {
      const items = this.normalizedParts.filter((p) => p && !p.isHidden);
      if (!items.length) return [];
      const cs = this.size;
      let layout;
      try {
        layout = computeBraceletPositions(items, {
          canvasSize: cs,
          centerX: cs / 2,
          centerY: cs / 2,
          radius: cs * (this.radiusRatio || 0.27),
          defaultPerimeter: this.defaultPerimeter,
          startAngle: (2 * Math.PI) / 3,
          holeRatio: 0.10,
          pendantScale: this.pendantScale,
        });
      } catch (e) {
        console.warn('[bracelet-thumbnail] computeBraceletPositions 失败:', e && e.message);
        return [];
      }
      const positions = (layout && layout.positions) || [];
      const RAD2DEG = 180 / Math.PI;
      return positions.map((pos) => {
        const item = pos.item || {};
        const imgScale = item.imageScale || this.imageScaleDefault || 1;
        const imgH = (pos.displayHeight || (pos.displayRadius || 0) * 2) * imgScale;
        const imgW = imgH;
        const left = pos.x - imgW / 2;
        const top = pos.y - imgH / 2;
        const rotDeg = (pos.rotationAngle || 0) * RAD2DEG;
        const src = this.resolveSrc(item);
        return {
          src,
          style: `left:${left.toFixed(2)}rpx;top:${top.toFixed(2)}rpx;`
            + `width:${imgW.toFixed(2)}rpx;height:${imgH.toFixed(2)}rpx;`
            + `transform:rotate(${rotDeg.toFixed(2)}deg);transform-origin:center center;`,
        };
      });
    },
  },
  methods: {
    resolveSrc(item) {
      const raw = item && (item.imageMap || item.imagePath || '');
      // #ifdef MP-ALIPAY
      // 淘宝/支付宝：优先用天猫 CDN 映射表把文件名/路径转成 alicdn URL
      if (raw) {
        const mapped = getTmallImageUrl(raw);
        if (mapped) return mapped;
      }
      // 再尝试用 name 字段查（CSV 解析有时把 name 当文件名）
      if (item && item.name) {
        const mapped2 = getTmallImageUrl(item.name + '.png');
        if (mapped2) return mapped2;
      }
      // #endif
      // 已经是 http(s) 或本地 static 路径就直接用
      if (raw && (/^https?:\/\//i.test(raw) || raw.startsWith('/static/'))) {
        return raw;
      }
      return FALLBACK_IMAGE;
    },
  },
};
</script>

<style scoped>
.bt-wrap {
  position: relative;
  display: block;
  background: transparent;
  overflow: hidden;
}
.bt-ring {
  position: absolute;
  border-radius: 50%;
  box-sizing: border-box;
  pointer-events: none;
}
.bt-bead {
  position: absolute;
  background: transparent;
}
</style>
