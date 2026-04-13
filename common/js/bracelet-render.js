/**
 * 通用手串绘制器
 * - 布局/尺寸：完全同源于 common/js/bracelet-layout.js（来源 pages/bracelet/bracelet.vue）
 * - 仅负责绘制，不包含拖拽/交互。
 */

import { computeBraceletPositions, computeBeadScale } from '@/common/js/bracelet-layout.js';

// 旧版渲染器在此文件内维护了自己的“吊坠/穿孔/宽高比”算法，容易与 bracelet.vue 漂移。
// 现在布局/尺寸已迁移到 common/js/bracelet-layout.js，保留本文件仅做绘制与路径映射。

function getBraceletStaticBase() {
  try {
    const app = (typeof getApp === 'function') ? getApp() : null;
    const base = app?.globalData?.data?.static_url || '';
    const normalized = String(base || '').replace(/\/+$/, '');
    return normalized ? `${normalized}/static/bracelet` : '';
  } catch (e) {
    return '';
  }
}

function mapBraceletStaticPath(raw) {
  const text = String(raw || '').trim();
  if (!text) return '';
  if (/^https?:\/\//i.test(text)) return text;
  // 兼容小程序本地文件与 base64
  if (text.startsWith('wxfile://')) return text;
  if (text.startsWith('data:image')) return text;
  const base = getBraceletStaticBase();
  const normalized = text.replace(/^\/+/, '');
  const mappings = [
    { prefix: 'static/beads/', dir: 'beads' },
    { prefix: 'static/accessories/', dir: 'accessories' },
    { prefix: 'static/bracelet/beads/', dir: 'beads' },
    { prefix: 'static/bracelet/accessories/', dir: 'accessories' },
  ];
  for (const { prefix, dir } of mappings) {
    if (normalized.startsWith(prefix)) {
      const rest = normalized.slice(prefix.length);
      return base ? `${base}/${dir}/${rest}` : `/${normalized}`;
    }
  }
  return text.startsWith('/') ? text : `/${text}`;
}

export { computeBeadScale };

/**
 * 绘制手串
 * @param {Object} params
 *  - ctx: canvasContext
 *  - items: array of beads/accessories
 *  - opts: { canvasSize, radius, stringColor, beadScale, aspectRatioConfig, holeOffsetConfig, imageScaleConfig, watermarkText, resolveImage }
 */
export function renderBraceletPreview({ ctx, items = [], opts = {} }) {
  const canvasSize = opts.canvasSize || 300;
  const centerX = canvasSize / 2;
  const centerY = canvasSize / 2;
  const radius = opts.radius || 100;
  const stringColor = opts.stringColor || '#ff0000';
  // 若外部指定 beadScale 则优先使用，否则按 bracelet.vue 逻辑自动计算
  const beadScale =
    typeof opts.beadScale === 'number'
      ? opts.beadScale
      : computeBeadScale(items, {
        radius,
        defaultPerimeter: opts.defaultPerimeter,
        pendantScale: opts.pendantScale,
      });
  const imageScaleConfig = opts.imageScaleConfig || { default: 1 };
  const resolveImage = opts.resolveImage || ((src) => Promise.resolve(src || ''));
  const watermarkText = opts.watermarkText || '';

  ctx.clearRect(0, 0, canvasSize, canvasSize);

  if (!items.length) {
    // 无珠子时只绘制圆环
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.setStrokeStyle(stringColor);
    ctx.setLineWidth(2);
    ctx.stroke();
    ctx.draw();
    return Promise.resolve();
  }

  const layout = computeBraceletPositions(items, {
    canvasSize,
    centerX,
    centerY,
    radius,
    defaultPerimeter: opts.defaultPerimeter,
    startAngle: typeof opts.startAngle === 'number' ? opts.startAngle : (2 * Math.PI / 3),
    holeRatio: typeof opts.holeRatio === 'number' ? opts.holeRatio : 0.10,
    pendantScale: typeof opts.pendantScale === 'number' ? opts.pendantScale : 1.0,
  });
  const scale = layout.scale;
  const positions = layout.positions || [];

  const drawTasks = positions.map((pos) => {
    const item = pos.item || {};
    // 优先使用 item._resolvedImage（已经过 resolveImage 处理的本地路径）
    const srcRaw = item._resolvedImage || item.imageMap || item.imagePath || (item.isAccessory ? '/static/accessories/diamonds.png' : '/static/beads/white.png');
    console.log('[bracelet-render] srcRaw:', srcRaw);
    // 如果已经是本地路径（jdfile:// 或 wxfile:// 或 http(s):// 或淘宝 resource://），直接使用，不经过 mapBraceletStaticPath
    // 注意：淘宝/支付宝小程序的 getImageInfo 返回的本地资源路径格式为 https://resource/...
    const isLocalPath = /^(jdfile|wxfile|https?):\/\//.test(srcRaw);
    const src = isLocalPath ? srcRaw : mapBraceletStaticPath(srcRaw);
    console.log('[bracelet-render] src after map:', src);
    return resolveImage(src).then((path) => ({ pos, path }));
  });

  return Promise.all(drawTasks).then((resolved) => {
    console.log('[bracelet-render] 开始绘制', resolved.length, '个珠子');

    // 先绘制手串圆环（确保圆环在珠子下面）
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.setStrokeStyle(stringColor);
    ctx.setLineWidth(2);
    ctx.stroke();

    // 绘制水印文字
    if (watermarkText) {
      ctx.setFillStyle('#550000');
      ctx.setFontSize(10);
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');
      ctx.fillText(watermarkText, centerX, centerY);
    }

    resolved.forEach(({ pos, path }, idx) => {
      const item = pos.item || {};
      // 跳过无效路径
      if (!path) {
        console.warn('[bracelet-render] 跳过绘制，path 为空:', item.name);
        // 绘制占位圆
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.displayRadius || 10, 0, 2 * Math.PI);
        ctx.setFillStyle(item.color || '#d4a574');
        ctx.fill();
        return;
      }
      console.log('[bracelet-render] 绑定绘制', idx, 'path:', path, 'pos:', pos.x.toFixed(1), pos.y.toFixed(1));
      const imgScale = item.imageScale || imageScaleConfig[item.category] || imageScaleConfig.default || 1;
      const imgHeight = (pos.displayHeight || pos.displayRadius * 2) * imgScale;
      const imgWidth = imgHeight;
      const drawX = pos.x - imgWidth / 2;
      const drawY = pos.y - imgHeight / 2;
      console.log('[bracelet-render] drawImage 参数: path=', path, 'x=', drawX.toFixed(1), 'y=', drawY.toFixed(1), 'w=', imgWidth.toFixed(1), 'h=', imgHeight.toFixed(1));
      try {
        // 不使用 save/restore 和 translate/rotate，直接绘制到目标位置
        // 这是为了排查 save/restore 可能导致的问题
        ctx.drawImage(path, drawX, drawY, imgWidth, imgHeight);
        console.log('[bracelet-render] drawImage 调用成功:', idx);
      } catch (e) {
        console.error('[bracelet-render] drawImage 异常:', e);
        // 绘制占位圆
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.displayRadius || 10, 0, 2 * Math.PI);
        ctx.setFillStyle(item.color || '#d4a574');
        ctx.fill();
      }
    });
    console.log('[bracelet-render] 调用 ctx.draw()');
    ctx.draw(false, () => {
      console.log('[bracelet-render] ctx.draw() 回调完成');
    });
  });
}
