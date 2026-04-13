# 一生一石 DIY 手串微信小程序 — 前端

## 项目概览

- **框架**: uni-app (Vue 2) + WeChat Mini Program
- **后端 API**: `https://ostone.store/`
- **微信 AppID**: `wxff89242f98d3b6d7`
- **核心功能**: Canvas 2D 手串 DIY 设计器 + 电商下单

## 目录结构

```
front-end/
├── pages/
│   ├── bracelet/bracelet.vue          # 核心：Canvas 2D 手串设计器（~5700行）
│   ├── bracelet-sub/
│   │   ├── work-detail.vue            # 作品详情/下单页
│   │   ├── my-works.vue               # 我的作品列表
│   │   ├── contest.vue                # 设计大赛
│   │   └── energy-generator.vue       # AI 能量手串生成
│   ├── index/                         # 首页
│   ├── cart/                          # 购物车（使用 components/cart/cart.vue）
│   ├── goods-detail/                  # 商品详情
│   ├── buy/                           # 下单页
│   ├── login/                         # 登录
│   └── user/                          # 用户中心
├── common/js/
│   ├── bracelet-layout.js             # 纯几何布局算法（无渲染）
│   ├── bracelet-render.js             # Canvas 绘图工具（导入 bracelet-layout）
│   └── lib/base64.js                  # Base64 编解码
├── components/                        # 40+ 共享组件
├── static/                            # 图标、图片、Logo
└── unpackage/dist/build/mp-weixin/    # 微信小程序构建产物
```

## 手串设计器架构 (bracelet.vue)

### Canvas 坐标系

| 参数 | 值 | 说明 |
|------|-----|------|
| `CANVAS_W` | 360 | 画布逻辑宽度（CSS 像素） |
| `CANVAS_H` | 300 | 画布逻辑高度 |
| 圆心 | (180, 150) | `CANVAS_W/2, CANVAS_H/2` |
| `FIXED_CIRCLE_RADIUS` | 80 | 手串环半径（像素） |
| DPR 缩放 | `ctx.scale(dpr, dpr)` | 绘图使用逻辑坐标，buffer 为 `W*dpr × H*dpr` |

CSS 尺寸：`.bracelet-canvas { width: 720rpx; height: 600rpx; }`

### Canvas 按钮布局

- 左侧按钮：x=18, r=18（撤销/重做）
- 右侧按钮：x=345, r=12（旋转）
- 导出时通过 `_isExporting` 标记跳过按钮绘制

### 图片导出（正方形裁剪）

```
裁剪区域：x=30 → x=330（居中 300×300）
cropX = (CANVAS_W - CANVAS_H) / 2 = 30
```

**重要**：`canvasToTempFilePath` 的 `x/y/width/height` 使用 **CSS 逻辑像素**，不乘 DPR。`destWidth/destHeight` 乘 DPR 控制输出分辨率。

### 页面跳转 Canvas 悬浮处理

Canvas 2D 是微信原生组件，层级高于 WebView。跳转时需提前隐藏：

- `pageHidden` 数据字段绑定到 canvas `:hidden`
- `_navigateAway(fn)` 包装所有 `navigateTo`/`switchTab` 调用
- `onHide()` 暂停 RAF + 隐藏 Canvas
- `onShow()` 恢复显示 + 重绘

### 非响应式字段（避免 Vue setter 开销）

在 `created()` 中初始化，不在 `data()` 中：

```
_canvasNode, _cachedCtx, _canvasDpr
_undoStack, _redoStack
_imageResolveCache, _imageLoadingMap
_logoImageObj, _isExporting
_rafId, _fullRedrawPending
_flyInIndex, _flyInFrame, _flyInTotalFrames
_transitionFrom, _transitionTarget, _transitionFrame, _transitionTotalFrames
```

### 绘制循环

- `_drawBraceletSync()` — 全量同步绘制（背景 → 珠子 → 按钮）
- `_drawDragFrameSync()` — 拖拽时轻量绘制（复用缓存位置）
- `requestFullRedraw()` — 通过 `requestAnimationFrame` 调度全量重绘
- `scheduleDragFrame()` — 拖拽帧调度

## 数据流：设计 → 下单

```
bracelet.vue                           work-detail.vue
    │                                       │
    ├─ handleComplete()                     │
    │   ├─ _isExporting = true              │
    │   ├─ _drawBraceletSync() (无按钮)      │
    │   ├─ canvasToTempFilePath (300×300)    │
    │   ├─ 构建 workData                     │
    │   ├─ saveWorkRemote() (异步上传)        │
    │   └─ navigateTo + eventChannel ───────→ applyWorkData()
    │                                       ├─ 展示图片 + 组成明细
    │                                       ├─ handleAddCart() → cart API
    │                                       ├─ handleBuyNow() → buy 页面
    │                                       ├─ handleAiInterpret() → AI 报告
    │                                       └─ handleEditAgain() → 返回编辑
```

### workData 结构

```js
{
  work_id: 'local_xxx' | 服务端ID,
  design_image: tempFilePath,
  image_url: tempFilePath | 服务端URL,
  design_title: '我的手串',
  design_desc: '珠子 N 颗，估计 ¥X',
  design_price: Number,
  design_parts: [{ name, size, sku_id, price, priceNum, qty, ... }]
}
```

## 布局算法 (bracelet-layout.js)

纯几何计算库，`computeBraceletPositions(items, opts)` 返回：

```js
{ scale, positions[], shouldUseTangent }
```

- **间隙模式** (`shouldUseTangent=false`)：珠子总角度 < 2π，剩余弧度均分为间隙
- **切线模式** (`shouldUseTangent=true`)：珠子填满 >99% 圆周，相邻珠子紧贴

支持吊坠/配件（`isPendantAccessory`）的特殊尺寸和位置处理。

## 后端 API

| 接口 | 路径 | 方法 |
|------|------|------|
| 保存作品 | `braceletworks/save` | POST |
| 作品详情 | `braceletworks/detail` | GET |
| AI 解读 | `braceletworks/aireport` | POST |
| 参赛 | `braceletcontest/join` | POST |
| 购物车 | `cart/save` | POST |

定制商品 `goods_id` 默认为 `117`。

## 开发注意事项

- **Canvas 2D 坐标**：绘图用逻辑像素（0-360, 0-300），`ctx.scale(dpr)` 映射到 buffer。导出裁剪参数用 CSS 像素，不乘 DPR。
- **原生组件层级**：Canvas 2D 渲染层级高于 WebView，页面跳转前必须先隐藏。
- **大文件**：`bracelet.vue` 约 5700 行，包含画布初始化、触摸交互、拖拽排序、动画、菜单、导出等所有逻辑。
- **构建产物**：`unpackage/dist/` 目录包含微信小程序编译输出，已被 git 跟踪。
- **Tabbar 页面**：`bracelet` 是 tabbar 页（第3个），从其他页面返回时走 `switchTab`，无法使用 `eventChannel`，靠 `localStorage` (`bracelet_restore`) 传递数据。
- **图片上传**：本地 tempFilePath 先读为 base64，通过 `braceletworks/save` 的 `design_image_base64` 字段上传，服务端返回 `image_url`。
