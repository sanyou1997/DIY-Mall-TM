/**
 * 手串布局/尺寸计算（与 pages/bracelet/bracelet.vue 保持同源）
 * - 仅负责几何与布局，不包含拖拽/交互，不包含图片加载
 */

function toInt(value) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : 0;
}

function toFloat(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export function isPendantAccessory(item) {
  if (!item || !item.isAccessory) return false;
  const type = String(item.types || item.type || '').trim();
  return type === '提溜/吊坠';
}

export function getAccessoryTotalHeight(item) {
  return toFloat(item?.height);
}

export function getAccessoryTotalWidth(item) {
  return toInt(item?.width);
}

// 投影宽度（穿孔宽度/珠子直径），单位 mm
export function getProjectedWidth(item, opts = {}) {
  const pendantScale = typeof opts.pendantScale === 'number' ? opts.pendantScale : 1.0;
  const base = toInt(item?.size);
  return isPendantAccessory(item) ? base * pendantScale : base;
}

export function getActualItemSize(item) {
  if (item?.isAccessory) {
    // 配件使用穿孔宽度来计算角度（size 和 width 中较小的值）
    // 兼容 CSV 数据中穿孔宽度可能在 size 或 width 字段的情况
    const sizeVal = toFloat(item?.size) || 999;
    const widthVal = toFloat(item?.width) || 999;
    const holeWidth = Math.min(sizeVal, widthVal);
    return holeWidth < 999 ? holeWidth : toInt(item?.width);
  }
  return toInt(item?.size);
}

export function calculateAngleBetweenItems(item1, item2, scale, opts = {}) {
  const circleRadius = typeof opts.radius === 'number' ? opts.radius : 80;
  const pendantScale = typeof opts.pendantScale === 'number' ? opts.pendantScale : 1.0;

  const isPendant1 = isPendantAccessory(item1);
  const isPendant2 = isPendantAccessory(item2);

  let size1, size2;
  if (isPendant1) {
    // 吊坠使用穿孔宽度计算角度，这样相邻珠子会贴近吊坠穿孔点，消除视觉间隙
    const sizeVal = toFloat(item1?.size) || 999;
    const widthVal = toFloat(item1?.width) || 999;
    const holeWidth = Math.min(sizeVal, widthVal);
    size1 = (holeWidth < 999 ? holeWidth : getAccessoryTotalWidth(item1)) * pendantScale;
  } else {
    size1 = getActualItemSize(item1);
  }

  if (isPendant2) {
    const sizeVal = toFloat(item2?.size) || 999;
    const widthVal = toFloat(item2?.width) || 999;
    const holeWidth = Math.min(sizeVal, widthVal);
    size2 = (holeWidth < 999 ? holeWidth : getAccessoryTotalWidth(item2)) * pendantScale;
  } else {
    size2 = getActualItemSize(item2);
  }

  const pixelSize1 = size1 * scale;
  const pixelSize2 = size2 * scale;
  const effectiveDistance = (pixelSize1 + pixelSize2) / 2;
  const sinValue = Math.min(effectiveDistance / (2 * circleRadius), 1);
  return 2 * Math.asin(sinValue);
}

export function calculateTotalAngle(items = [], opts = {}) {
  const scale = typeof opts.scale === 'number' ? opts.scale : 1.0;
  const n = items.length;
  if (!n) return 0;

  if (n === 1) {
    const item = items[0];
    let size;
    if (isPendantAccessory(item)) {
      // 吊坠使用穿孔宽度计算角度
      const sizeVal = toFloat(item.size) || 999;
      const widthVal = toFloat(item.width) || 999;
      const holeWidth = Math.min(sizeVal, widthVal);
      const pendantScale = opts.pendantScale || 1.0;
      size = (holeWidth < 999 ? holeWidth : getAccessoryTotalWidth(item)) * pendantScale;
    } else {
      size = getProjectedWidth(item, opts);
    }
    const radius = typeof opts.radius === 'number' ? opts.radius : 80;
    return 2 * Math.asin((size * scale) / (2 * radius));
  }

  let totalAngle = 0;
  for (let i = 0; i < n; i++) {
    const a = items[i];
    const b = items[(i + 1) % n];
    totalAngle += calculateAngleBetweenItems(a, b, scale, opts);
  }
  return totalAngle;
}

export function computeDefaultScale(items = [], opts = {}) {
  if (!items.length) return 2;
  const radius = typeof opts.radius === 'number' ? opts.radius : 80;
  const defaultPerimeter = typeof opts.defaultPerimeter === 'number' ? opts.defaultPerimeter : 130;
  const beadSize = toInt(items[0]?.size);
  const actualCircumferenceMM = defaultPerimeter + Math.PI * beadSize;
  const displayCircumferencePX = 2 * Math.PI * radius;
  return displayCircumferencePX / actualCircumferenceMM;
}

export function computeBeadScale(items = [], opts = {}) {
  if (items.length < 2) return computeDefaultScale(items, opts);
  const defaultScale = computeDefaultScale(items, opts);
  const totalAngle = calculateTotalAngle(items, { ...opts, scale: defaultScale });
  const FULL = 2 * Math.PI;
  if (totalAngle > FULL) {
    return (FULL / totalAngle) * defaultScale;
  }
  return defaultScale;
}

/**
 * 计算珠子/配件布局位置（同 bracelet.vue 的 drawBraceletWithDrag 布局部分）
 * @returns {Object} { scale, positions, shouldUseTangent }
 */
export function computeBraceletPositions(items = [], opts = {}) {
  const canvasSize = typeof opts.canvasSize === 'number' ? opts.canvasSize : 300;
  const centerX = typeof opts.centerX === 'number' ? opts.centerX : canvasSize / 2;
  const centerY = typeof opts.centerY === 'number' ? opts.centerY : canvasSize / 2;
  const radius = typeof opts.radius === 'number' ? opts.radius : 80;
  const startAngle = typeof opts.startAngle === 'number' ? opts.startAngle : 0;
  const holeRatio = typeof opts.holeRatio === 'number' ? opts.holeRatio : 0.10;
  const pendantScale = typeof opts.pendantScale === 'number' ? opts.pendantScale : 1.0;

  const n = items.length;
  const positions = [];
  if (!n) return { scale: computeBeadScale(items, { ...opts, radius }), positions, shouldUseTangent: false };

  const scale = computeBeadScale(items, { ...opts, radius, pendantScale });
  const FULL = 2 * Math.PI;
  const totalAngleIfTangent = calculateTotalAngle(items, { ...opts, radius, pendantScale, scale });
  const shouldUseTangent = totalAngleIfTangent >= (FULL * 0.99);

  let x, y, displayRadius, displayWidth, displayHeight, rotationAngle;

  if (n === 1) {
    const currentItem = items[0];
    const isPendant = isPendantAccessory(currentItem);
    const angle = startAngle;

    if (isPendant) {
      const totalHeight = getAccessoryTotalHeight(currentItem) * pendantScale;
      const totalWidth = getAccessoryTotalWidth(currentItem) * pendantScale;
      const scaledHeight = totalHeight * scale;
      const scaledWidth = totalWidth * scale;
      const holeX = centerX + radius * Math.cos(angle);
      const holeY = centerY + radius * Math.sin(angle);
      const topToHole = scaledHeight * holeRatio;
      const centerOffsetFromHole = scaledHeight / 2 - topToHole;
      x = holeX + centerOffsetFromHole * Math.cos(angle);
      y = holeY + centerOffsetFromHole * Math.sin(angle);
      displayRadius = scaledHeight / 2;
      displayWidth = scaledWidth;
      displayHeight = scaledHeight;
      rotationAngle = angle - Math.PI / 2;
    } else {
      x = centerX + radius * Math.cos(angle);
      y = centerY + radius * Math.sin(angle);
      if (currentItem.isAccessory) {
        const totalWidth = getAccessoryTotalWidth(currentItem);
        const totalHeight = getAccessoryTotalHeight(currentItem);
        if (totalHeight > totalWidth) {
          // 高>宽的配件：按 height × height 正方形显示，碰撞半径仍用 width
          const displayDim = totalHeight * scale;
          displayHeight = displayDim;
          displayWidth = displayDim;
          displayRadius = totalWidth * scale / 2;
        } else {
          // 宽>=高的配件：按 width × width 正方形显示
          const displayDim = totalWidth * scale;
          displayHeight = displayDim;
          displayWidth = displayDim;
          displayRadius = displayDim / 2;
        }
        rotationAngle = angle + Math.PI / 2;
      } else {
        const beadSize = toInt(currentItem.size) * scale;
        displayRadius = beadSize / 2;
        displayWidth = beadSize;
        displayHeight = beadSize;
        rotationAngle = angle + Math.PI / 2;
      }
    }

    positions.push({
      x, y,
      displayRadius,
      displayWidth,
      displayHeight,
      angle,
      rotationAngle,
      item: currentItem,
      isPendant,
    });

    return { scale, positions, shouldUseTangent };
  }

  if (shouldUseTangent) {
    let totalAngle = 0;
    const anglesPerItem = [];

    for (let i = 0; i < n; i++) {
      const item = items[i];
      const pendant = isPendantAccessory(item);
      let scaledWidth;
      if (pendant) {
        // 吊坠使用穿孔宽度计算角度
        const sizeVal = toFloat(item.size) || 999;
        const widthVal = toFloat(item.width) || 999;
        const holeWidth = Math.min(sizeVal, widthVal);
        scaledWidth = (holeWidth < 999 ? holeWidth : getAccessoryTotalWidth(item)) * pendantScale * scale;
      } else if (item.isAccessory) {
        scaledWidth = getAccessoryTotalWidth(item) * scale;
      } else {
        scaledWidth = toInt(item.size) * scale;
      }
      const itemAngle = 2 * Math.asin(scaledWidth / (2 * radius));
      anglesPerItem.push(itemAngle);
      totalAngle += itemAngle;
    }

    const angleScale = totalAngle > FULL ? (FULL / totalAngle) : 1;
    let currentAngle = startAngle;

    for (let i = 0; i < n; i++) {
      const currentItem = items[i];
      const pendant = isPendantAccessory(currentItem);
      const itemAngle = anglesPerItem[i] * angleScale;
      const angle = currentAngle + itemAngle / 2;

      if (pendant) {
        const totalHeight = getAccessoryTotalHeight(currentItem) * pendantScale;
        const totalWidth = getAccessoryTotalWidth(currentItem) * pendantScale;
        const scaledHeight = totalHeight * scale * angleScale;
        const scaledWidth = totalWidth * scale * angleScale;
        const holeX = centerX + radius * Math.cos(angle);
        const holeY = centerY + radius * Math.sin(angle);
        const topToHole = scaledHeight * holeRatio;
        const centerOffsetFromHole = scaledHeight / 2 - topToHole;
        x = holeX + centerOffsetFromHole * Math.cos(angle);
        y = holeY + centerOffsetFromHole * Math.sin(angle);
        displayRadius = scaledHeight / 2;
        displayWidth = scaledWidth;
        displayHeight = scaledHeight;
        rotationAngle = angle - Math.PI / 2;
      } else {
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
        if (currentItem.isAccessory) {
          const totalWidth = getAccessoryTotalWidth(currentItem);
          const totalHeight = getAccessoryTotalHeight(currentItem);
          if (totalHeight > totalWidth) {
            const displayDim = totalHeight * scale * angleScale;
            displayHeight = displayDim;
            displayWidth = displayDim;
            displayRadius = totalWidth * scale * angleScale / 2;
          } else {
            const displayDim = totalWidth * scale * angleScale;
            displayHeight = displayDim;
            displayWidth = displayDim;
            displayRadius = displayDim / 2;
          }
          rotationAngle = angle + Math.PI / 2;
        } else {
          const beadSize = toInt(currentItem.size) * scale;
          displayRadius = beadSize / 2;
          displayWidth = beadSize;
          displayHeight = beadSize;
          rotationAngle = angle + Math.PI / 2;
        }
      }

      positions.push({
        x, y,
        displayRadius,
        displayWidth,
        displayHeight,
        angle,
        rotationAngle,
        item: currentItem,
        isPendant: pendant,
      });

      currentAngle += itemAngle;
    }
  } else {
    const beadAngles = [];
    for (let i = 0; i < n; i++) {
      const item = items[i];
      const pendant = isPendantAccessory(item);
      let scaledWidth;
      if (pendant) {
        // 吊坠使用穿孔宽度计算角度
        const sizeVal = toFloat(item.size) || 999;
        const widthVal = toFloat(item.width) || 999;
        const holeWidth = Math.min(sizeVal, widthVal);
        scaledWidth = (holeWidth < 999 ? holeWidth : getAccessoryTotalWidth(item)) * pendantScale * scale;
      } else if (item.isAccessory) {
        scaledWidth = getAccessoryTotalWidth(item) * scale;
      } else {
        scaledWidth = toInt(item.size) * scale;
      }
      const itemAngle = 2 * Math.asin(scaledWidth / (2 * radius));
      beadAngles.push(itemAngle);
    }

    const totalBeadAngle = beadAngles.reduce((sum, a) => sum + a, 0);
    const totalGapAngle = FULL - totalBeadAngle;
    const gapAngle = totalGapAngle / n;

    let currentAngle = startAngle;
    for (let i = 0; i < n; i++) {
      const currentItem = items[i];
      const pendant = isPendantAccessory(currentItem);
      const angle = currentAngle + beadAngles[i] / 2;

      if (pendant) {
        const totalHeight = getAccessoryTotalHeight(currentItem) * pendantScale;
        const totalWidth = getAccessoryTotalWidth(currentItem) * pendantScale;
        const scaledHeight = totalHeight * scale;
        const scaledWidth = totalWidth * scale;
        const holeX = centerX + radius * Math.cos(angle);
        const holeY = centerY + radius * Math.sin(angle);
        const topToHole = scaledHeight * holeRatio;
        const centerOffsetFromHole = scaledHeight / 2 - topToHole;
        x = holeX + centerOffsetFromHole * Math.cos(angle);
        y = holeY + centerOffsetFromHole * Math.sin(angle);
        displayRadius = scaledHeight / 2;
        displayWidth = scaledWidth;
        displayHeight = scaledHeight;
        rotationAngle = angle - Math.PI / 2;
      } else {
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
        if (currentItem.isAccessory) {
          const totalWidth = getAccessoryTotalWidth(currentItem);
          const totalHeight = getAccessoryTotalHeight(currentItem);
          if (totalHeight > totalWidth) {
            const displayDim = totalHeight * scale;
            displayHeight = displayDim;
            displayWidth = displayDim;
            displayRadius = totalWidth * scale / 2;
          } else {
            const displayDim = totalWidth * scale;
            displayHeight = displayDim;
            displayWidth = displayDim;
            displayRadius = displayDim / 2;
          }
          rotationAngle = angle + Math.PI / 2;
        } else {
          const beadSize = toInt(currentItem.size) * scale;
          displayRadius = beadSize / 2;
          displayWidth = beadSize;
          displayHeight = beadSize;
          rotationAngle = angle + Math.PI / 2;
        }
      }

      positions.push({
        x, y,
        displayRadius,
        displayWidth,
        displayHeight,
        angle,
        rotationAngle,
        item: currentItem,
        isPendant: pendant,
      });

      currentAngle += beadAngles[i] + gapAngle;
    }
  }

  return { scale, positions, shouldUseTangent };
}

