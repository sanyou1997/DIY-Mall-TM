/**
 * 一键随机手串 — 算法层
 *
 * 输入：
 *  - preset   : preset-bracelets.js 中一项，含 skuSequence
 *  - menuData : bracelet.vue 已加载的菜单数据 (this.menuData) — 形如 {珠子:{type:{cat:[item,...]}}, 配件:{...}}
 *
 * 输出：
 *  - 一个 item 数组，可直接赋给 bracelet.vue 的 braceletItems
 *
 * 行为：
 *  1. 把 skuSequence 中每个 sku_id 查表换成完整 item 对象（找不到则跳过 + console.warn）
 *  2. 随机挑 2-4 个位置做"美观协调"替换：
 *     硬约束 — 同 size, 同 isAccessory, 同 outOfStock=否, sku!=自己
 *     软约束 — 优先同 colorTag；候选不足则放开到同 styleTag；再不足则任意
 *  3. 自动补足主珠数量直到圆环紧贴 (shouldUseTangent=true)：
 *     按原主珠 sequence 循环 push，配件始终保留在末尾
 *  4. 每个位置生成新 uniqueId（避免拖动时的 lerp map key 冲突，见 bracelet.vue 的 _dragLerpPositions 注释）
 *
 * 注：不导入 vue/uni，只接受纯数据，方便单测。
 */

import { computeBraceletPositions } from './bracelet-layout.js';

/** menuData 树形结构 → 扁平 item 数组（一次性，调用方可自缓存） */
export function flattenMenuData(menuData) {
  const out = [];
  if (!menuData) return out;
  Object.keys(menuData).forEach((level1) => {
    const l1Tree = menuData[level1] || {};
    Object.keys(l1Tree).forEach((level2) => {
      const l2Tree = l1Tree[level2] || {};
      Object.keys(l2Tree).forEach((level3) => {
        const arr = l2Tree[level3] || [];
        arr.forEach((it) => out.push(it));
      });
    });
  });
  return out;
}

function buildSkuIndex(items) {
  const map = Object.create(null);
  for (const it of items) {
    const sku = it && (it.sku_id || it.id);
    if (sku) map[sku] = it;
  }
  return map;
}

function newUniqueId() {
  // 与 bracelet.vue addMaterial 中保持一致：Date.now() + Math.random()
  return Date.now() + Math.random();
}

/** Fisher-Yates 取 n 个不同元素，不修改输入 */
function sampleN(arr, n) {
  if (n >= arr.length) return arr.slice();
  const a = arr.slice();
  const out = [];
  for (let i = 0; i < n && a.length; i++) {
    const idx = Math.floor(Math.random() * a.length);
    out.push(a.splice(idx, 1)[0]);
  }
  return out;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 缺货判断（CSV 解析后为布尔值，原始数据为 '是'，两者都兼容） */
function isOutOfStock(it) {
  if (!it) return true;
  const v = it.outOfStock;
  return v === true || String(v || '').trim() === '是' || String(v || '').trim() === 'true';
}

// ===== 吊坠衬珠规则 =====
// 提溜/吊坠两侧建议衬一颗 3mm 金/银小隔珠，方便配件灵活移动。
// 非 100% 强制：默认 80% 概率；预设里已有小隔珠（≤4mm）时尊重原构图不再添加。
const PENDANT_SPACER_GOLD = 'A2104K4041';    // 金色小隔珠 3mm ¥1
const PENDANT_SPACER_SILVER = 'PJ2004014-1'; // 银色小隔珠 3mm ¥1
const PENDANT_SPACER_PROB = 0.8;
const WARM_COLOR_TAGS = ['红', '橙', '黄', '金', '粉', '茶', '棕'];

function isPendantItem(it) {
  if (!it || !it.isAccessory) return false;
  const t = String(it.types || '').trim();
  return t.indexOf('提溜') >= 0 || t.indexOf('吊坠') >= 0;
}

/**
 * 给配件序列中的每个吊坠两侧衬小隔珠。
 * 金/银按整串主珠冷暖倾向选择（暖→金、冷→银、持平随机），首选缺货时换另一色。
 */
function decoratePendantsWithSpacers(mainBeads, accessories, skuIndex) {
  if (!accessories.some(isPendantItem)) return accessories;
  // 已有小隔珠（≤4mm 非吊坠配件）→ 尊重预设构图
  const hasSmallSpacer = accessories.some(
    (it) => !isPendantItem(it) && parseFloat(it.size) > 0 && parseFloat(it.size) <= 4
  );
  if (hasSmallSpacer) return accessories;
  if (Math.random() > PENDANT_SPACER_PROB) return accessories;

  let warm = 0;
  let cool = 0;
  mainBeads.forEach((it) => {
    const c = String((it && it.colorTag) || '').trim();
    if (!c) return;
    if (WARM_COLOR_TAGS.indexOf(c.charAt(0)) >= 0 || WARM_COLOR_TAGS.indexOf(c) >= 0) warm++;
    else cool++;
  });
  const preferGold = warm === cool ? Math.random() < 0.5 : warm > cool;
  const firstSku = preferGold ? PENDANT_SPACER_GOLD : PENDANT_SPACER_SILVER;
  const altSku = preferGold ? PENDANT_SPACER_SILVER : PENDANT_SPACER_GOLD;
  let spacer = skuIndex[firstSku];
  if (isOutOfStock(spacer)) spacer = skuIndex[altSku];
  if (isOutOfStock(spacer)) return accessories;

  const out = [];
  accessories.forEach((it) => {
    if (isPendantItem(it)) {
      out.push({ ...spacer, uniqueId: newUniqueId() });
      out.push(it);
      out.push({ ...spacer, uniqueId: newUniqueId() });
    } else {
      out.push(it);
    }
  });
  return out;
}

/**
 * 给一颗"被替换的原珠子"，在 allItems 中按软硬约束挑一颗替换
 * @returns 替换 item（不命中任何候选时返回 null）
 */
function pickReplacement(originalItem, allItems) {
  const origSku = originalItem.sku_id || originalItem.id;
  const origSize = String(originalItem.size || '').trim();
  const isAccessory = !!originalItem.isAccessory;
  // 硬约束过滤
  const hard = allItems.filter((it) => {
    if (!it) return false;
    if (!!it.isAccessory !== isAccessory) return false;
    if (String(it.size || '').trim() !== origSize) return false;
    if (String(it.outOfStock || '').trim() === '是') return false;
    const sku = it.sku_id || it.id;
    if (!sku || sku === origSku) return false;
    return true;
  });
  if (hard.length === 0) return null;

  // 软约束：同 colorTag → 同 styleTag → 任意
  const colorTag = String(originalItem.colorTag || '').trim();
  const styleTag = String(originalItem.styleTag || '').trim();
  let pool = colorTag ? hard.filter((it) => String(it.colorTag || '').trim() === colorTag) : [];
  if (pool.length === 0 && styleTag) {
    pool = hard.filter((it) => String(it.styleTag || '').trim() === styleTag);
  }
  if (pool.length === 0) pool = hard;

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * 把序列补到"紧贴圆环"（shouldUseTangent=true）
 * 策略：按主珠 sequence 循环 push 新主珠（保留预设节奏），配件始终在末尾
 * @param {Array} mainBeads - 已 resolved 的主珠数组（非配件，按预设原顺序）
 * @param {Array} accessories - 已 resolved 的配件数组（吊坠/隔珠等）
 * @returns {Array} 补足后的完整 item 数组
 */
function fillToTangent(mainBeads, accessories) {
  if (mainBeads.length === 0) return [...accessories];
  const filled = [...mainBeads];
  // 上限保护：防极端情况死循环（普通手串最多约 25 颗 6mm；50 颗肯定够）
  const MAX = 50;
  while (filled.length < MAX) {
    const test = [...filled, ...accessories];
    let res;
    try {
      res = computeBraceletPositions(test, { canvasSize: 300, radius: 80 });
    } catch (e) {
      console.warn('[bracelet-random] computeBraceletPositions failed during fill, stop', e);
      break;
    }
    if (res && res.shouldUseTangent) break;
    // 按原主珠 sequence 循环 push，保持色彩节奏
    const tpl = mainBeads[filled.length % mainBeads.length];
    filled.push({ ...tpl, uniqueId: newUniqueId() });
  }
  return [...filled, ...accessories];
}

/**
 * 主流程：preset → 完整 item 数组（含随机替换 + 撑满圆环）
 */
export function buildRandomBraceletItems(preset, menuData) {
  if (!preset || !Array.isArray(preset.skuSequence)) {
    console.warn('[bracelet-random] invalid preset', preset);
    return [];
  }
  const allItems = flattenMenuData(menuData);
  if (allItems.length === 0) {
    console.warn('[bracelet-random] menuData empty, abort');
    return [];
  }
  const skuIndex = buildSkuIndex(allItems);

  // 1. sku → item，过滤掉找不到 / 缺货的
  const resolved = [];
  for (const sku of preset.skuSequence) {
    const src = skuIndex[sku];
    if (!src) {
      console.warn('[bracelet-random] sku not found in menuData, skip:', sku);
      continue;
    }
    if (String(src.outOfStock || '').trim() === '是') {
      console.warn('[bracelet-random] sku out of stock, skip:', sku, src.name);
      continue;
    }
    resolved.push({ ...src, uniqueId: newUniqueId() });
  }
  if (resolved.length === 0) return [];

  // 2. 挑 2-4 个位置做替换（只在珠子位上替换，避免动到吊坠破坏构图）
  const beadIndices = [];
  for (let i = 0; i < resolved.length; i++) {
    if (!resolved[i].isAccessory) beadIndices.push(i);
  }
  // 数量取 min(2-4 随机, 可替换位数)
  const wanted = randInt(2, 4);
  const targetIndices = sampleN(beadIndices, Math.min(wanted, beadIndices.length));

  for (const idx of targetIndices) {
    const original = resolved[idx];
    const replacement = pickReplacement(original, allItems);
    if (!replacement) continue;
    resolved[idx] = { ...replacement, uniqueId: newUniqueId() };
  }

  // 3. 分离主珠/配件；吊坠两侧衬金/银小隔珠（概率性，便于吊坠灵活移动）；
  //    再按珠子尺寸自动补足直到紧贴圆环
  const mainBeads = resolved.filter((it) => !it.isAccessory);
  const accessories = decoratePendantsWithSpacers(
    mainBeads,
    resolved.filter((it) => !!it.isAccessory),
    skuIndex
  );
  return fillToTangent(mainBeads, accessories);
}

export default {
  flattenMenuData,
  buildRandomBraceletItems,
};
