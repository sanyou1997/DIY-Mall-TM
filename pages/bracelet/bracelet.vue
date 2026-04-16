<template>
    <view :class="['bracelet-page', theme_view]">
					
		<view class="bracelet-shell">
			<!-- 教程弹窗 -->
			<view class="tutorial-overlay" v-if="showTutorial" @click="closeTutorial">
				<view class="tutorial-card" @click.stop>
					<view class="tutorial-header">
						<text class="tutorial-title">使用教程</text>
						<view class="tutorial-close" @click="closeTutorial">
							<text class="tutorial-close-icon">×</text>
						</view>
					</view>
					<scroll-view class="tutorial-body" scroll-y>
					<view class="tutorial-inner">
						<view class="tutorial-section">
							<view class="tutorial-section-header">
								<text class="tutorial-section-icon">🎯</text>
								<text class="tutorial-section-title">基本操作</text>
							</view>
							<view class="tutorial-list">
								<view class="tutorial-row">
									<text class="tutorial-badge">点击添加</text>
									<text class="tutorial-desc">在底部材质区点击珠子或配件</text>
								</view>
								<view class="tutorial-row">
									<text class="tutorial-badge">长按预览</text>
									<text class="tutorial-desc">长按材质卡片查看详细信息</text>
								</view>
								<view class="tutorial-row">
									<text class="tutorial-badge">拖拽排序</text>
									<text class="tutorial-desc">在预览区长按珠子可调整位置</text>
								</view>
								<view class="tutorial-row">
									<text class="tutorial-badge">拖出删除</text>
									<text class="tutorial-desc">将珠子拖到圆环外部即可删除</text>
								</view>
							</view>
						</view>

						<view class="tutorial-divider"></view>

						<view class="tutorial-section">
							<view class="tutorial-section-header">
								<text class="tutorial-section-icon">🔧</text>
								<text class="tutorial-section-title">工具栏</text>
							</view>
							<view class="tutorial-grid">
								<view class="tutorial-grid-item">
									<text class="tutorial-grid-icon">↶ ↷</text>
									<text class="tutorial-grid-label">撤销/重做</text>
								</view>
								<view class="tutorial-grid-item">
									<text class="tutorial-grid-icon">↺ ↻</text>
									<text class="tutorial-grid-label">旋转手串</text>
								</view>
								<view class="tutorial-grid-item">
									<text class="tutorial-grid-icon">✨</text>
									<text class="tutorial-grid-label">生成推荐</text>
								</view>
								<view class="tutorial-grid-item">
									<text class="tutorial-grid-icon">▦</text>
									<text class="tutorial-grid-label">我的作品</text>
								</view>
								<view class="tutorial-grid-item">
									<text class="tutorial-grid-icon">✕</text>
									<text class="tutorial-grid-label">清空重来</text>
								</view>
								<view class="tutorial-grid-item">
									<text class="tutorial-grid-icon">√</text>
									<text class="tutorial-grid-label">完成下单</text>
								</view>
							</view>
						</view>

						<view class="tutorial-divider"></view>

						<view class="tutorial-section">
							<view class="tutorial-section-header">
								<text class="tutorial-section-icon">🔍</text>
								<text class="tutorial-section-title">筛选搜索</text>
							</view>
							<view class="tutorial-list">
								<view class="tutorial-row">
									<text class="tutorial-badge">分类</text>
									<text class="tutorial-desc">顶部切换「珠子」和「配件」两大类</text>
								</view>
								<view class="tutorial-row">
									<text class="tutorial-badge">筛选</text>
									<text class="tutorial-desc">按材质、颜色、尺寸、价格、寓意筛选</text>
								</view>
								<view class="tutorial-row">
									<text class="tutorial-badge">搜索</text>
									<text class="tutorial-desc">点击 🔍 图标可按名称快速查找</text>
								</view>
							</view>
						</view>

						<view class="tutorial-divider"></view>

						<view class="tutorial-section">
							<view class="tutorial-section-header">
								<text class="tutorial-section-icon">💡</text>
								<text class="tutorial-section-title">小贴士</text>
							</view>
							<view class="tutorial-tips">
								<text class="tutorial-tip">顶部标签栏实时显示手围、价格、珠子数等信息</text>
								<text class="tutorial-tip">不同尺寸的珠子可自由混搭组合</text>
								<text class="tutorial-tip">设计大赛入口可参加创意作品评选活动</text>
							</view>
						</view>

						<view class="tutorial-divider"></view>

						<view class="tutorial-section">
							<view class="tutorial-section-header">
								<text class="tutorial-section-icon">📏</text>
								<text class="tutorial-section-title">手围尺寸参考表</text>
							</view>
							<view class="tutorial-tip" style="margin-bottom: 12rpx; font-size: 22rpx; color: #999;">根据身高体重查手围(cm)，可左右滑动查看</view>
							<view class="size-table-wrap">
								<!-- 固定的身高列 -->
								<view class="size-fixed-col">
									<view class="size-corner"><text class="size-th">体重→\n身高↓</text></view>
									<view class="size-frow"><text class="size-fc">140</text></view>
									<view class="size-frow size-frow-alt"><text class="size-fc">145</text></view>
									<view class="size-frow"><text class="size-fc">150</text></view>
									<view class="size-frow size-frow-alt"><text class="size-fc">155</text></view>
									<view class="size-frow"><text class="size-fc">160</text></view>
									<view class="size-frow size-frow-alt"><text class="size-fc">165</text></view>
									<view class="size-frow"><text class="size-fc">170</text></view>
									<view class="size-frow size-frow-alt"><text class="size-fc">175</text></view>
									<view class="size-frow"><text class="size-fc">180</text></view>
									<view class="size-frow size-frow-alt"><text class="size-fc">185</text></view>
									<view class="size-frow"><text class="size-fc">190</text></view>
								</view>
								<!-- 可滚动的数据区 -->
								<scroll-view class="size-scroll" scroll-x>
									<view class="size-scroll-inner">
										<!-- 表头：体重 -->
										<view class="size-hrow">
											<text class="size-hc">35</text><text class="size-hc">40</text><text class="size-hc">45</text><text class="size-hc">50</text><text class="size-hc">55</text><text class="size-hc">60</text><text class="size-hc">65</text><text class="size-hc">70</text><text class="size-hc">75</text><text class="size-hc">80</text><text class="size-hc">85</text><text class="size-hc">90</text><text class="size-hc">95</text><text class="size-hc">100</text>
										</view>
										<!-- 140cm -->
										<view class="size-drow">
											<text class="size-dc">14</text><text class="size-dc">14</text><text class="size-dc">14</text><text class="size-dc">14</text><text class="size-dc">15</text><text class="size-dc">15</text><text class="size-dc">15</text><text class="size-dc">16</text><text class="size-dc">16</text><text class="size-dc">16</text><text class="size-dc">17</text><text class="size-dc">17</text><text class="size-dc">17</text><text class="size-dc">18</text>
										</view>
										<!-- 145cm -->
										<view class="size-drow size-drow-alt">
											<text class="size-dc">14</text><text class="size-dc">14</text><text class="size-dc">15</text><text class="size-dc">15</text><text class="size-dc">15</text><text class="size-dc">16</text><text class="size-dc">16</text><text class="size-dc">16</text><text class="size-dc">17</text><text class="size-dc">17</text><text class="size-dc">17</text><text class="size-dc">18</text><text class="size-dc">18</text><text class="size-dc">18</text>
										</view>
										<!-- 150cm -->
										<view class="size-drow">
											<text class="size-dc">14</text><text class="size-dc">15</text><text class="size-dc">15</text><text class="size-dc">15</text><text class="size-dc">16</text><text class="size-dc">16</text><text class="size-dc">17</text><text class="size-dc">17</text><text class="size-dc">17</text><text class="size-dc">18</text><text class="size-dc">18</text><text class="size-dc">18</text><text class="size-dc">19</text><text class="size-dc">19</text>
										</view>
										<!-- 155cm -->
										<view class="size-drow size-drow-alt">
											<text class="size-dc">15</text><text class="size-dc">15</text><text class="size-dc">15</text><text class="size-dc">16</text><text class="size-dc">16</text><text class="size-dc">17</text><text class="size-dc">17</text><text class="size-dc">18</text><text class="size-dc">18</text><text class="size-dc">18</text><text class="size-dc">19</text><text class="size-dc">19</text><text class="size-dc">19</text><text class="size-dc">20</text>
										</view>
										<!-- 160cm -->
										<view class="size-drow">
											<text class="size-dc">15</text><text class="size-dc">15</text><text class="size-dc">16</text><text class="size-dc">16</text><text class="size-dc">17</text><text class="size-dc">17</text><text class="size-dc">18</text><text class="size-dc">18</text><text class="size-dc">19</text><text class="size-dc">19</text><text class="size-dc">19</text><text class="size-dc">20</text><text class="size-dc">20</text><text class="size-dc">20</text>
										</view>
										<!-- 165cm -->
										<view class="size-drow size-drow-alt">
											<text class="size-dc">15</text><text class="size-dc">16</text><text class="size-dc">16</text><text class="size-dc">17</text><text class="size-dc">17</text><text class="size-dc">18</text><text class="size-dc">18</text><text class="size-dc">19</text><text class="size-dc">19</text><text class="size-dc">20</text><text class="size-dc">20</text><text class="size-dc">20</text><text class="size-dc">21</text><text class="size-dc">21</text>
										</view>
										<!-- 170cm -->
										<view class="size-drow">
											<text class="size-dc">16</text><text class="size-dc">16</text><text class="size-dc">17</text><text class="size-dc">17</text><text class="size-dc">18</text><text class="size-dc">18</text><text class="size-dc">19</text><text class="size-dc">19</text><text class="size-dc">20</text><text class="size-dc">20</text><text class="size-dc">21</text><text class="size-dc">21</text><text class="size-dc">21</text><text class="size-dc">22</text>
										</view>
										<!-- 175cm -->
										<view class="size-drow size-drow-alt">
											<text class="size-dc">16</text><text class="size-dc">17</text><text class="size-dc">17</text><text class="size-dc">18</text><text class="size-dc">18</text><text class="size-dc">19</text><text class="size-dc">19</text><text class="size-dc">20</text><text class="size-dc">20</text><text class="size-dc">21</text><text class="size-dc">21</text><text class="size-dc">22</text><text class="size-dc">22</text><text class="size-dc">22</text>
										</view>
										<!-- 180cm -->
										<view class="size-drow">
											<text class="size-dc">17</text><text class="size-dc">17</text><text class="size-dc">18</text><text class="size-dc">18</text><text class="size-dc">19</text><text class="size-dc">19</text><text class="size-dc">20</text><text class="size-dc">20</text><text class="size-dc">21</text><text class="size-dc">21</text><text class="size-dc">22</text><text class="size-dc">22</text><text class="size-dc">23</text><text class="size-dc">23</text>
										</view>
										<!-- 185cm -->
										<view class="size-drow size-drow-alt">
											<text class="size-dc">17</text><text class="size-dc">18</text><text class="size-dc">18</text><text class="size-dc">19</text><text class="size-dc">19</text><text class="size-dc">20</text><text class="size-dc">20</text><text class="size-dc">21</text><text class="size-dc">21</text><text class="size-dc">22</text><text class="size-dc">22</text><text class="size-dc">23</text><text class="size-dc">23</text><text class="size-dc">24</text>
										</view>
										<!-- 190cm -->
										<view class="size-drow">
											<text class="size-dc">18</text><text class="size-dc">18</text><text class="size-dc">19</text><text class="size-dc">19</text><text class="size-dc">20</text><text class="size-dc">20</text><text class="size-dc">21</text><text class="size-dc">21</text><text class="size-dc">22</text><text class="size-dc">22</text><text class="size-dc">23</text><text class="size-dc">23</text><text class="size-dc">24</text><text class="size-dc">24</text>
										</view>
									</view>
								</scroll-view>
							</view>
							<view class="size-table-note">
								<text class="tutorial-tip">* 实际手围因骨架大小有差异，建议以软尺实测为准</text>
							</view>
						</view>

						<view class="tutorial-slogan">
							<text class="tutorial-slogan-text">真材实料，源头直供，20年晶石老品牌品质保证</text>
						</view>
					</view>
					</scroll-view>
				</view>
			</view>

			<!-- 提示标签行（悬浮在画布上方） -->
			<view class="tags-row" :style="{ top: (statusBarHeight - 10) + 'px' }">
				<view class="tag-item">
					<text class="tag-label">手围</text>
					<text class="tag-value">{{ wristSize }}</text>
				</view>
				<view class="tag-item">
					<text class="tag-label">价格</text>
					<text class="tag-value">¥{{ totalPrice }}.0</text>
				</view>
				<view class="tag-item">
					<text class="tag-label">珠子数</text>
					<text class="tag-value">{{ beadCount }}</text>
				</view>
				<view class="tag-item">
					<text class="tag-label">配件数</text>
					<text class="tag-value">{{ accessoryCount }}</text>
				</view>
			</view>
					
			<!-- 手串预览区 -->
			<view class="preview-section" :style="{ marginTop: (statusBarHeight + 100) + 'px' }">
				<!-- 画布容器（控制按钮直接绘制在 Canvas 上，见 _drawCanvasButtons） -->
				<view class="canvas-wrapper"
					@touchstart.stop="handleTouchStart"
					@touchmove.stop.prevent="handleTouchMove"
					@touchend.stop="handleTouchEnd"
					@touchcancel.stop="handleTouchEnd"
				>
					<!-- #ifdef MP-WEIXIN -->
					<canvas
						v-if="!showFireworks"
						type="2d"
						id="braceletCanvas"
						class="bracelet-canvas"
						:hidden="pageHidden || showTutorial || !!previewMaterial"
					></canvas>
					<!-- #endif -->
					<!-- #ifdef MP-ALIPAY -->
					<!-- 不设 type="2d"：Skia 渲染层下 my.createCanvas 在真机预览/生产模式极不稳定，
					     且旧版 uni.createCanvasContext 和 Skia 不兼容（画面空白）。
					     去掉后 canvas 走传统非 Skia 渲染，旧版 API 完全可用。 -->
					<canvas
						canvas-id="braceletCanvas"
						id="braceletCanvas"
						class="bracelet-canvas"
						:hidden="showFireworks || pageHidden || showTutorial || !!previewMaterial"
					></canvas>
					<!-- 触摸捕获层：旧版 canvas 的触摸事件不稳定，用覆盖层统一处理 -->
					<view
						v-if="!showFireworks && !pageHidden && !showTutorial && !previewMaterial"
						class="canvas-touch-layer"
						@touchstart.stop="handleTouchStart"
						@touchmove.stop.prevent="handleTouchMove"
						@touchend.stop="handleTouchEnd"
						@touchcancel.stop="handleTouchEnd"
					></view>
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN || MP-ALIPAY -->
					<canvas
						v-if="!showFireworks"
						canvas-id="braceletCanvas"
						id="braceletCanvas"
						class="bracelet-canvas"
						:hidden="pageHidden || showTutorial || !!previewMaterial"
						@touchstart="handleTouchStart"
						@touchmove="handleTouchMove"
						@touchend="handleTouchEnd"
						@touchcancel="handleTouchEnd"
					></canvas>
					<!-- #endif -->
				</view>
			</view>
					
			<!-- 底部工具栏（位于 Canvas 下方，不与原生层重叠，无需 cover-view） -->
			<view class="bottom-toolbar">
				<view class="tool-item contest compact" @click="openContest">
					<view class="contest-text">
						<text>设计</text>
						<text>大赛</text>
					</view>
				</view>
				<view class="tool-item ai-generate" @click="openEnergyGenerator">
					<text class="tool-icon">✨</text>
					<text class="tool-text">生成推荐</text>
				</view>
				<view class="tool-item energy" @click="openMyWorks">
					<text class="tool-icon">▦</text>
					<text class="tool-text">我的作品</text>
				</view>
				<view class="tool-item complete wide" :class="{ 'is-processing': isProcessingCart }" @click="handleComplete">
					<text class="tool-icon">{{ isProcessingCart ? '⏳' : '√' }}</text>
					<!-- #ifdef MP-JD -->
					<text class="tool-text">{{ isProcessingCart ? '处理中…' : '确认定制' }}</text>
					<!-- #endif -->
					<!-- #ifndef MP-JD -->
					<text class="tool-text">{{ isProcessingCart ? '处理中…' : '完成' }}</text>
					<!-- #endif -->
				</view>
			</view>
					
			<!-- 材质选择区 -->
			<view class="material-section">
				<!-- 顶部统一行：L1切换 + 分类方式 + 搜索 -->
				<view class="section-header-row">
					<view class="level1-toggle">
						<view
							class="level1-toggle-item"
							:class="{ active: selectedLevel1 === '珠子' }"
							@click="selectLevel1('珠子')"
						>珠子</view>
						<view
							class="level1-toggle-item"
							:class="{ active: selectedLevel1 === '配件' }"
							@click="selectLevel1('配件')"
						>配件</view>
					</view>

					<!-- 分类方式下拉 -->
					<view class="groupby-dropdown">
						<view class="groupby-trigger" @click="showGroupByDropdown = !showGroupByDropdown">
							<text class="groupby-label">{{ groupByLabel }}</text>
							<text class="groupby-arrow">{{ showGroupByDropdown ? '▲' : '▼' }}</text>
						</view>
						<view v-if="showGroupByDropdown" class="groupby-popup">
							<view v-for="opt in groupByOptions" :key="opt.key"
								class="groupby-option"
								:class="{ active: groupBy === opt.key }"
								@click="selectGroupBy(opt.key); showGroupByDropdown = false">
								<text>{{ groupBy === opt.key ? '✓ ' : '' }}{{ opt.label }}</text>
							</view>
						</view>
					</view>

					<!-- 搜索框（默认展开） -->
					<view class="search-inline">
						<text class="search-icon-flat">⌕</text>
						<input
							class="search-inline-input"
							type="text"
							placeholder="搜索..."
							:value="searchKeyword"
							@input="handleSearch"
							placeholder-class="search-placeholder"
						/>
						<text v-if="searchKeyword.trim()" class="search-clear" @click="clearSearch">×</text>
					</view>
				</view>

				<view class="menu-content-wrapper">

					<!-- 二级+三级菜单（左侧栏） -->
					<view class="vertical-menu">
						<view class="vertical-menu-section">
							<scroll-view class="vertical-scroll" scroll-y :scroll-into-view="l2ScrollIntoView">
								<view class="vertical-list">
									<view v-for="(types, l2Idx) in level2Options" :key="types">
										<view
											class="vertical-item level3-item"
											:id="'l2tab-' + l2Idx"
											:class="{ active: selectedLevel2 === types }"
											@click="scrollToLevel2(types, l2Idx)"
										>
											{{ types }}
										</view>
										<!-- L3 折叠子项：仅当前活跃的 L2 展开，且 groupBy === material -->
										<view v-if="selectedLevel2 === types && groupBy === 'material'"
											class="l3-collapse-list">
											<view v-for="(cat, catIdx) in getLevel3OptionsForType(types)"
												:key="cat"
												:id="'l3tab-' + l2Idx + '-' + catIdx"
												class="l3-collapse-item"
												:class="{ active: selectedLevel3 === cat }"
												@click.stop="scrollToLevel3(types, cat, l2Idx, catIdx)"
											>
												{{ cat }}
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</view>
					</view>

					<view class="right-content">
			
				<!-- 材质列表 -->
				<scroll-view class="material-list" scroll-y
					:scroll-into-view="scrollToId"
					:scroll-with-animation="scrollWithAnimation"
					@scroll="onMaterialScroll"
					@scrolltolower="loadMoreMaterials"
					:lower-threshold="150">

					<!-- 无限流模式：所有 L2 类别连续排列 -->
					<block v-if="isGroupedMode">
						<block v-for="section in allSections" :key="section.sectionId">
							<!-- L2 标题 -->
							<view v-if="section.type === 'l2-header'"
								:id="section.sectionId" class="l2-section-header">
								{{ section.label }}
							</view>
							<!-- L3 子分组（按材质模式） -->
							<view v-if="section.type === 'l3-section'"
								:id="section.sectionId" class="material-section-group">
								<view class="section-header">{{ section.label }}</view>
								<view class="material-grid" v-if="section.items.length > 0">
									<view v-for="material in section.items" :key="material.id"
										class="material-card"
										@click="addToBracelet(material)"
										@longpress.stop="showMaterialPreview(material)"
										@touchend="hideMaterialPreview"
										@touchcancel="hideMaterialPreview">
										<view class="material-preview">
											<view v-if="selectedLevel1 === '配件'" class="charm-display">
												<image class="accessory-preview-img"
													:style="'width:' + getBeadDisplaySizePx(material) + 'px;height:' + getBeadDisplaySizePx(material) + 'px'"
													:src="getMaterialImage(material)"
													mode="aspectFit"
													lazy-load
													@error="handleMaterialImageError(material)"></image>
											</view>
											<image v-else class="bead-preview-img"
												:style="'width:' + getBeadDisplaySizePx(material) + 'px;height:' + getBeadDisplaySizePx(material) + 'px'"
												:src="getMaterialImage(material)"
												mode="aspectFit"
												lazy-load
												@error="handleMaterialImageError(material)"></image>
										</view>
										<view class="material-name">{{ material.name }}</view>
										<view class="material-size">{{ material.sizeLabel || material.size }} - ¥{{ material.priceNum }}</view>
									</view>
								</view>
							</view>
							<!-- 平铺区（按颜色/尺寸/价格/寓意/风格） -->
							<view v-if="section.type === 'flat-section'"
								:id="section.sectionId" class="material-section-group">
								<view class="material-grid" v-if="section.items.length > 0">
									<view v-for="material in section.items" :key="material.id"
										class="material-card"
										@click="addToBracelet(material)"
										@longpress.stop="showMaterialPreview(material)"
										@touchend="hideMaterialPreview"
										@touchcancel="hideMaterialPreview">
										<view class="material-preview">
											<view v-if="selectedLevel1 === '配件'" class="charm-display">
												<image class="accessory-preview-img"
													:style="'width:' + getBeadDisplaySizePx(material) + 'px;height:' + getBeadDisplaySizePx(material) + 'px'"
													:src="getMaterialImage(material)"
													mode="aspectFit"
													lazy-load
													@error="handleMaterialImageError(material)"></image>
											</view>
											<image v-else class="bead-preview-img"
												:style="'width:' + getBeadDisplaySizePx(material) + 'px;height:' + getBeadDisplaySizePx(material) + 'px'"
												:src="getMaterialImage(material)"
												mode="aspectFit"
												lazy-load
												@error="handleMaterialImageError(material)"></image>
										</view>
										<view class="material-name">{{ material.name }}</view>
										<view class="material-size">{{ material.sizeLabel || material.size }} - ¥{{ material.priceNum }}</view>
									</view>
								</view>
							</view>
						</block>
						<view v-if="hasMoreMaterials" class="load-more-hint">加载更多...</view>
					</block>

					<!-- 搜索模式：平铺 -->
					<block v-else>
						<view class="material-grid">
							<view v-for="material in currentMaterials" :key="material.id"
								class="material-card"
								@click="addToBracelet(material)"
								@longpress.stop="showMaterialPreview(material)"
								@touchend="hideMaterialPreview"
								@touchcancel="hideMaterialPreview">
								<view class="material-preview">
									<view v-if="selectedLevel1 === '配件'" class="charm-display">
										<image class="accessory-preview-img"
											:style="'width:' + getBeadDisplaySizePx(material) + 'px;height:' + getBeadDisplaySizePx(material) + 'px'"
											:src="getMaterialImage(material)"
											mode="aspectFit"
											lazy-load
											@error="handleMaterialImageError(material)"></image>
									</view>
									<image v-else class="bead-preview-img"
										:style="'width:' + getBeadDisplaySizePx(material) + 'px;height:' + getBeadDisplaySizePx(material) + 'px'"
										:src="getMaterialImage(material)"
										mode="aspectFit"
										lazy-load
										@error="handleMaterialImageError(material)"></image>
								</view>
								<view class="material-name">{{ material.name }}</view>
								<view class="material-size">{{ material.sizeLabel || material.size }} - ¥{{ material.priceNum }}</view>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>	
		</view>
			</view>
		</view>
		<!-- 长按图片预览 -->
		<view v-if="previewMaterial" class="pv-overlay" @touchend="hideMaterialPreview">
			<view class="pv-card" @touchend.stop>
				<view class="pv-hero">
					<image class="pv-img" :src="getMaterialImage(previewMaterial)" mode="aspectFit"></image>
				</view>
				<view class="pv-body">
					<text class="pv-name">{{ previewMaterial.name }}</text>
					<view class="pv-meta">
						<text class="pv-size">{{ previewMaterial.sizeLabel || previewMaterial.size }}</text>
						<text class="pv-dot" v-if="previewMaterial.priceNum">·</text>
						<text class="pv-price" v-if="previewMaterial.priceNum">¥{{ previewMaterial.priceNum }}</text>
					</view>
					<view v-if="previewMaterial.styleTag || previewMaterial.wishTag" class="pv-tags">
						<text v-if="previewMaterial.styleTag" class="pv-tag pv-tag--style">{{ previewMaterial.styleTag }}</text>
						<text v-if="previewMaterial.wishTag" class="pv-tag pv-tag--wish">{{ previewMaterial.wishTag }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 烟花 + 彩带庆祝特效遮罩 -->
		<view v-if="showFireworks" class="fireworks-overlay">
			<!-- 中央光晕 -->
			<view class="fw-glow"></view>

			<!-- 6 组烟花 -->
			<view class="firework fw-1">
				<view class="particle p-1"></view><view class="particle p-2"></view><view class="particle p-3"></view>
				<view class="particle p-4"></view><view class="particle p-5"></view><view class="particle p-6"></view>
				<view class="particle p-7"></view><view class="particle p-8"></view><view class="particle p-9"></view>
				<view class="particle p-10"></view><view class="particle p-11"></view><view class="particle p-12"></view>
			</view>
			<view class="firework fw-2">
				<view class="particle p-1"></view><view class="particle p-2"></view><view class="particle p-3"></view>
				<view class="particle p-4"></view><view class="particle p-5"></view><view class="particle p-6"></view>
				<view class="particle p-7"></view><view class="particle p-8"></view><view class="particle p-9"></view>
				<view class="particle p-10"></view><view class="particle p-11"></view><view class="particle p-12"></view>
			</view>
			<view class="firework fw-3">
				<view class="particle p-1"></view><view class="particle p-2"></view><view class="particle p-3"></view>
				<view class="particle p-4"></view><view class="particle p-5"></view><view class="particle p-6"></view>
				<view class="particle p-7"></view><view class="particle p-8"></view><view class="particle p-9"></view>
				<view class="particle p-10"></view><view class="particle p-11"></view><view class="particle p-12"></view>
			</view>
			<view class="firework fw-4">
				<view class="particle p-1"></view><view class="particle p-2"></view><view class="particle p-3"></view>
				<view class="particle p-4"></view><view class="particle p-5"></view><view class="particle p-6"></view>
				<view class="particle p-7"></view><view class="particle p-8"></view><view class="particle p-9"></view>
				<view class="particle p-10"></view><view class="particle p-11"></view><view class="particle p-12"></view>
			</view>
			<view class="firework fw-5">
				<view class="particle p-1"></view><view class="particle p-2"></view><view class="particle p-3"></view>
				<view class="particle p-4"></view><view class="particle p-5"></view><view class="particle p-6"></view>
				<view class="particle p-7"></view><view class="particle p-8"></view><view class="particle p-9"></view>
				<view class="particle p-10"></view><view class="particle p-11"></view><view class="particle p-12"></view>
			</view>
			<view class="firework fw-6">
				<view class="particle p-1"></view><view class="particle p-2"></view><view class="particle p-3"></view>
				<view class="particle p-4"></view><view class="particle p-5"></view><view class="particle p-6"></view>
				<view class="particle p-7"></view><view class="particle p-8"></view><view class="particle p-9"></view>
				<view class="particle p-10"></view><view class="particle p-11"></view><view class="particle p-12"></view>
			</view>

			<!-- 彩带（20 条，从顶部飘落） -->
			<view class="confetti c-1"></view><view class="confetti c-2"></view>
			<view class="confetti c-3"></view><view class="confetti c-4"></view>
			<view class="confetti c-5"></view><view class="confetti c-6"></view>
			<view class="confetti c-7"></view><view class="confetti c-8"></view>
			<view class="confetti c-9"></view><view class="confetti c-10"></view>
			<view class="confetti c-11"></view><view class="confetti c-12"></view>
			<view class="confetti c-13"></view><view class="confetti c-14"></view>
			<view class="confetti c-15"></view><view class="confetti c-16"></view>
			<view class="confetti c-17"></view><view class="confetti c-18"></view>
			<view class="confetti c-19"></view><view class="confetti c-20"></view>

			<!-- 星星闪烁 -->
			<view class="sparkle sp-1"></view><view class="sparkle sp-2"></view>
			<view class="sparkle sp-3"></view><view class="sparkle sp-4"></view>
			<view class="sparkle sp-5"></view><view class="sparkle sp-6"></view>
			<view class="sparkle sp-7"></view><view class="sparkle sp-8"></view>

			<!-- 成就文字 + 加载 -->
			<view class="fw-center">
				<text class="fw-title">完成啦</text>
				<view class="fw-loading-row">
					<view class="fw-spinner"></view>
					<text class="fw-text">{{ savingProgress || '生成中...' }}</text>
				</view>
			</view>
		</view>

        <!-- 公共 -->
        <component-common ref="common" @onFooterHeight="footer_height_value_event" :propIsFooterSeat="false"></component-common>
    </view>
</template>



<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentPopup from '@/components/popup/popup';
	import { computeBraceletPositions } from '@/common/js/bracelet-layout.js';
	// #ifdef MP-ALIPAY
	import { getTmallImageUrl } from '@/common/js/tmall-image-map.js';
	import { baseInfoCsvText } from '@/common/js/base-info-data.js';
	import { taobaoRequest } from '@/common/js/taobao-cloud.js';
	// #endif
export default {
	data() {
		return {
			// 作品信息（用于从购物车/详情回填）
			workId: null,
			workTitle: '',
			workDesc: '',
			workPrice: '',

			braceletItems: [],
			stringColor: 'rgba(60, 60, 60, 0.3)', // 深灰半透明-模拟水晶绳
			// beadPositions 已移至非响应式属性（onLoad 中初始化），避免每帧 Vue reactive setter 开销
			// 撤销/重做：实际栈 _undoStack/_redoStack 在 onLoad 初始化（非响应式），
			// 此处仅保留布尔标志供模板 :class 绑定
			canUndo: false,
			canRedo: false,
			// 手串旋转角度（弧度）
			braceletRotation: 0,
			isProcessingCart: false ,// 👈 防重锁
			showFireworks: false, // 烟花庆祝特效
			savingProgress: '', // 烟花期间保存进度提示
			pageHidden: false,   // 页面隐藏时隐藏 Canvas（避免原生层悬浮）
			isProcessingSave: false, // 保存作品防重
			// currentDragZone 已移至非响应式属性（created 中初始化）
			defaultPerimeter: 130, //默认初始手围
			pendingCompleteChecking: false,
			pendingCompleteRetryCount: 0,
			pendingCompleteTimer: null,
			loginRedirectingAt: 0,
			
			canvasAlive: true,     // 淘宝 type="2d" 原生组件生命周期控制（页面返回时需销毁重建）
			canvasGeneration: 0,   // 递增 key，强制 Vue 创建全新 canvas 元素（不复用旧 DOM）
			alipayCanvasStyle: '',  // 淘宝 Canvas 2D 成功时锁定显示尺寸
			// 固定的显示参数
			CANVAS_W: 360,  // 画布逻辑宽度（比高度宽，为两侧按钮留空间）
			CANVAS_H: 300,  // 画布逻辑高度
			FIXED_CIRCLE_RADIUS: 80,
			
			HOLE_RATIO: 0.10,
			PENDANT_SCALE: 0.80,
			
			// 三级菜单相关
			
			selectedLevel1: '珠子', // 一级菜单:珠子/配件
			selectedLevel2: '', // 二级菜单:type
			selectedLevel3: '', // 三级菜单:category

			// 筛选维度：material(按材质) | color(按颜色) | size(按尺寸) | price(按价格) | wish(按寓意)
			groupBy: 'material',

			// 滚动定位 & 懒加载
			scrollToId: '',              // scroll-into-view 目标 section ID
			scrollWithAnimation: true,   // 滚动时是否带动画
			materialDisplayLimit: 40,    // 懒渲染：当前显示的最大项目数
			l3ScrollIntoView: '',        // L3 标签栏的 scroll-into-view
			l2ScrollIntoView: '',        // L2 标签栏的 scroll-into-view

			searchKeyword: '', // 搜索关键词
			searchExpanded: false, // 搜索框是否展开
			showGroupByDropdown: false, // 分类方式下拉是否展开

			// 固定的寓意选项列表（与 energy-generator.vue 保持一致）
			wishOptions: ['澄心净念','金榜题名','睡个好觉','发大财','升职加薪','求桃花','万事顺遂','体健安泰','平安护佑','心想事成'],
			styleOptions: ['极简百搭','能量疗愈','少女甜美','轻奢精致','自然森系','国风禅意','民族异域'],

			// 数据结构:{ '珠子': { 'type1': { 'category1': [...], ... }, ... }, '配件': {...} }
			menuData: {
				'珠子': {},
				'配件': {}
			},
			categories: [],
			accessoryCategories: [],
			
			materials: {},
			// 配件数据
			accessories: {},
			
			
			//图片缩放系数
			imageScaleConfig: {
				'default': 1.0,
			},
			fallbackImage: '',
			// 图片重试机制：跟踪每个材质的加载失败次数
			// 格式：{ [material.id]: { retryCount, lastRetryTime } }
			imageRetryMap: {},
			// 注意：图片解析缓存不要放在 data 里（会被 setData 同步到渲染层，key 含 "/" 时容易触发底层异常）
			// 使用非响应式字段 this._imageResolveCache 代替
			// logo 本地路径缓存（非响应式，避免频繁 getImageInfo）
			// 使用 this._braceletLogoPath
			
			// 拖拽状态已移至非响应式属性（created 中初始化），避免高频 setter 开销
			debugMode: false, // 开启调试模式
			cachedCanvasOffset: null, // 缓存 canvas 位置
			// 长按预览
			previewMaterial: null, // 正在预览的材质对象，null=隐藏

			// 教程弹窗
			showTutorial: false,

			// 安全区适配
			statusBarHeight: 0, // px, from uni.getSystemInfoSync()

			// 淘宝/天猫小程序图片 CDN 配置
			// 图片上传到天猫后台后，替换此前缀为实际的天猫 CDN 地址
			// 例如: 'https://img.alicdn.com/imgextra/xxx/'
			tmallImageBaseUrl: '',
		}
	  },
	  
		computed: {
			// 当前二级菜单列表(type 列表，来自 CSV 第1列)
			level2Options() {
				const level1 = this.selectedLevel1;

				// 搜索模式下不显示分类菜单
				if (this.searchKeyword.trim()) {
					return [];
				}

				// 按材质分组（默认）
				if (this.groupBy === 'material') {
					return Object.keys(this.menuData[level1] || {});
				}

				// 其他维度分组：先获取一级分类下的所有物品
				const allItems = this.getAllItemsForLevel1(level1);

				// 按颜色分组
				if (this.groupBy === 'color') {
					const colorSet = new Set();
					allItems.forEach(item => {
						if (item.colorTag && item.colorTag.trim()) {
							colorSet.add(item.colorTag.trim());
						}
					});
					return Array.from(colorSet).sort();
				}

				// 按尺寸分组
				if (this.groupBy === 'size') {
					const sizeSet = new Set();
					allItems.forEach(item => {
						if (item.size && item.size.trim()) {
							sizeSet.add(item.size.trim());
						}
					});
					return Array.from(sizeSet).sort((a, b) => {
						const numA = parseFloat(a) || 0;
						const numB = parseFloat(b) || 0;
						return numA - numB;
					}).map(size => size + 'mm');  // 添加 'mm' 后缀
				}

				// 按价格区间分组
				if (this.groupBy === 'price') {
					return ['0-20', '20-50', '50-100', '100以上'];
				}

				// 按寓意分组（使用固定的寓意选项列表）
				if (this.groupBy === 'wish') {
					return this.wishOptions || [];
				}

				// 按风格分组（使用固定的风格选项列表）
				if (this.groupBy === 'style') {
					return this.styleOptions || [];
				}

				return [];
			},
						
			// 当前三级菜单列表(categories 列表，来自 CSV 第2列)
			level3Options() {
				if (!this.selectedLevel2) return [];

				// 按材质分组（默认）：三级显示 category
				if (this.groupBy === 'material') {
					const typeData = this.menuData[this.selectedLevel1]?.[this.selectedLevel2];
					return Object.keys(typeData || {});
				}

				// 其他维度分组：三级显示材质类型 (type)
				const itemsInLevel2 = this.getItemsForLevel2();
				const typeSet = new Set();
				itemsInLevel2.forEach(item => {
					if (item.types && item.types.trim()) {
						typeSet.add(item.types.trim());
					}
				});

				return Array.from(typeSet).sort();
			},
			// 当前分类的材质列表
			currentMaterials() {
				// 搜索模式：全局搜索
				if (this.searchKeyword.trim()) {
					const keyword = this.searchKeyword.trim().toLowerCase();
					let allMaterials  = [];

					// 遍历所有一级菜单
					Object.keys(this.menuData).forEach(level1 => {
					  Object.keys(this.menuData[level1] || {}).forEach(level2 => {
					    Object.keys(this.menuData[level1][level2] || {}).forEach(level3 => {
					      const materials = this.menuData[level1][level2][level3] || [];
					      const filtered = materials.filter(item =>
					        item.name.toLowerCase().includes(keyword) ||
					        (item.size && item.size.toLowerCase().includes(keyword)) ||
					        (item.colorTag && item.colorTag.toLowerCase().includes(keyword)) ||
					        (item.wishTag && item.wishTag.toLowerCase().includes(keyword)) ||
					        (item.styleTag && item.styleTag.toLowerCase().includes(keyword)) ||
					        (item.zodiacTag && item.zodiacTag.toLowerCase().includes(keyword)) ||
					        (item.starTag && item.starTag.toLowerCase().includes(keyword))
					      );
					      allMaterials = allMaterials.concat(filtered);
					    });
					  });
					});

					return allMaterials;
				}

				// 正常分类模式
				if (!this.selectedLevel2) return [];

				// 按材质分组：返回 L2 下所有 L3 的全部项目（扁平）
				if (this.groupBy === 'material') {
					const l2Data = this.menuData[this.selectedLevel1]?.[this.selectedLevel2] || {};
					const items = [];
					Object.keys(l2Data).forEach(cat => {
						items.push(...(l2Data[cat] || []));
					});
					return items;
				}

				// 其他维度分组：直接返回二级分类下的所有物品
				return this.getItemsForLevel2();
			},

			// 无限流：遍历所有 L2 类别，每个 L2 带标题头 + 内容区（带懒渲染限制）
			allSections() {
				if (this.searchKeyword.trim()) return [];
				const level1 = this.selectedLevel1;
				const l2List = this.level2Options;
				if (l2List.length === 0) return [];

				const sections = [];
				let remaining = this.materialDisplayLimit;

				for (let l2Idx = 0; l2Idx < l2List.length; l2Idx++) {
					const l2Name = l2List[l2Idx];
					if (remaining <= 0) break;

					// L2 标题节
					sections.push({
						type: 'l2-header',
						sectionId: 'l2-sec-' + l2Idx,
						label: l2Name,
						l2Index: l2Idx,
					});

					if (this.groupBy === 'material') {
						// 按材质：L2 下有 L3 子分组
						const l2Data = this.menuData[level1]?.[l2Name] || {};
						const cats = Object.keys(l2Data);
						for (let l3Idx = 0; l3Idx < cats.length; l3Idx++) {
							if (remaining <= 0) break;
							const cat = cats[l3Idx];
							const allItems = l2Data[cat] || [];
							const count = Math.min(allItems.length, Math.max(0, remaining));
							remaining -= count;
							sections.push({
								type: 'l3-section',
								sectionId: 'l3-sec-' + l2Idx + '-' + l3Idx,
								label: cat,
								l2Name: l2Name,
								l2Index: l2Idx,
								l3Index: l3Idx,
								items: allItems.slice(0, count),
								total: allItems.length,
							});
						}
					} else {
						// 非按材质：L2 下直接平铺
						const items = this._getItemsForLevel2Value(l2Name);
						const count = Math.min(items.length, Math.max(0, remaining));
						remaining -= count;
						sections.push({
							type: 'flat-section',
							sectionId: 'flat-sec-' + l2Idx,
							label: l2Name,
							l2Name: l2Name,
							l2Index: l2Idx,
							items: items.slice(0, count),
							total: items.length,
						});
					}
				}
				return sections;
			},

			// 当前分类方式的显示标签
			groupByLabel() {
				if (this.selectedLevel1 === '配件') {
					const map = { material: '按功能', price: '按价格', style: '按风格' };
					return map[this.groupBy] || '按功能';
				}
				const map = { material: '按材质', color: '按颜色', size: '按尺寸', price: '按价格', wish: '按寓意', style: '按风格' };
				return map[this.groupBy] || '按材质';
			},

			// 当前可选的分类方式列表
			groupByOptions() {
				if (this.selectedLevel1 === '配件') {
					return [
						{ key: 'material', label: '按功能' },
						{ key: 'price', label: '按价格' },
						{ key: 'style', label: '按风格' }
					];
				}
				return [
					{ key: 'material', label: '按材质' },
					{ key: 'color', label: '按颜色' },
					{ key: 'size', label: '按尺寸' },
					{ key: 'price', label: '按价格' },
					{ key: 'wish', label: '按寓意' },
					{ key: 'style', label: '按风格' }
				];
			},

			// 是否处于无限流分组模式（非搜索状态下都用 allSections 渲染）
			isGroupedMode() {
				return !this.searchKeyword.trim() && this.level2Options.length > 0;
			},

			// 是否还有更多项目可加载
			hasMoreMaterials() {
				if (!this.isGroupedMode) return false;
				// 检查已渲染 section 是否有截断的
				if (this.allSections.some(s => s.type !== 'l2-header' && s.items && s.total && s.items.length < s.total)) {
					return true;
				}
				// 检查是否还有未渲染的 L2 分类（remaining 恰好用完时 allSections 不含后续 L2）
				const renderedL2Count = this.allSections.filter(s => s.type === 'l2-header').length;
				return renderedL2Count < this.level2Options.length;
			},

			// 总价格
			totalPrice() {
				const result = this.braceletItems.reduce((sum, item) => {
					const priceNum = Number(item.priceNum) || 0;
					return sum + priceNum;
				}, 0);
				return result;
			},
		  
			// 珠子数量
			beadCount() {
				return this.braceletItems.filter(item => !item.isAccessory).length;
			},
			
			// 配件数量
			accessoryCount() {
				return this.braceletItems.filter(item => item.isAccessory).length;
			},
			
			// 判断是否同尺寸
			isUniformSize() {
				if (this.braceletItems.length < 2) return true;
				const firstSize = parseInt(this.braceletItems[0].size);
			    return this.braceletItems.every(item => parseInt(item.size) === firstSize);
			},
			
			// 计算动态缩放比例（基于实际圆周长）
			defaultScale() {
				if (this.braceletItems.length === 0) return 2;

				const beadSize = parseInt(this.braceletItems[0].size);
				// 实际圆的周长 = 手围 + π × realSize
				const actualCircumferenceMM = this.defaultPerimeter + Math.PI * beadSize;
				// 显示圆的周长（像素）
				const displayCircumferencePX = 2 * Math.PI * this.FIXED_CIRCLE_RADIUS;
				// 缩放比例 = 显示周长 / 实际周长
				const scale = displayCircumferencePX / actualCircumferenceMM;

				return scale;
			},
			
			// 计算手围(圆的内周长,单位mm)
			wristSize() {
				if (this.braceletItems.length === 0) return '0mm';
				
				// 计算圆心角总和
				const totalAngle = this.calculateTotalAngle();
			    const FULL_CIRCLE = 2 * Math.PI;
				
				//珠子直径
				const beadSize = parseInt(this.braceletItems[0].size);
				// 圆的实际周长 = 默认手围 + π × 珠子直径
				const actualCircumference = this.defaultPerimeter + Math.PI * beadSize;
				// 计算所有配件的总宽度
			    const totalWidth = this.braceletItems.reduce((sum, item, index) => {
					const width = this.getProjectedWidth(item);
					return sum + width;
			    }, 0);
				// 比较总宽度与圆的实际内周长
				const fullnessRatio = totalWidth / actualCircumference;
				
				// 情况三：珠子排满圆后再加珠子
				if (totalAngle > FULL_CIRCLE || fullnessRatio > 1.05) {
					let wrist;
					if (this.isUniformSize) {
						// 同规格珠子：手围 = (珠子数 - π) * 珠子直径
						wrist = (this.beadCount - Math.PI) * beadSize;
					} else {
						// 不同规格珠子：手围 = 总直径 - π * 最大珠子直径
						const maxWidth  = Math.max(...this.braceletItems.map(item => this.getProjectedWidth(item)));
						wrist = totalWidth - Math.PI * maxWidth;
					}
					return Math.round(wrist * 10) / 10 + 'mm';
				}
				
				// 情况一：珠子正好排满圆
				if (fullnessRatio >= 0.95 && fullnessRatio <= 1.05) {
					return this.defaultPerimeter + 'mm';
				} else if (fullnessRatio < 0.95) {
					// 情况二：珠子没有排满圆
					return '过小';
				}
				
				return this.defaultPerimeter + 'mm';
			},
			
			// 计算缩放比例
			beadScale() {
				if (this.braceletItems.length < 2) return this.defaultScale;
				
				// 先用defaultScale计算角度
				const totalAngle = this.calculateTotalAngle(this.defaultScale);
				const FULL_CIRCLE = 2 * Math.PI;
				
				// 情况三：需要缩放使珠子刚好填满一圈
				if (totalAngle > FULL_CIRCLE) {
					const scale = (FULL_CIRCLE / totalAngle) * this.defaultScale;
					return scale;
				}
				
				// 情况一和二：使用基础缩放
				return this.defaultScale;
			},
			
			// 获取实际最大珠子的直径
			maxRealBeadDiameter() {
			    if (this.braceletItems.length === 0) return 0;
			    const maxSize = Math.max(...this.braceletItems.map(item => parseInt(item.size)));
			    return maxSize;
			},
			
			// 获取最大珠子的直径
			maxBeadDiameter() {
			    return this.maxRealBeadDiameter * this.beadScale;
			},
			
			// 三个区域的半径范围
			zoneRadii() {
			    const baseRadius = this.FIXED_CIRCLE_RADIUS; // 100
			    const maxDiameter = this.maxBeadDiameter;
			    
			    return {
			        // 区域1：内圆（半径 < 基准半径 - 最大珠子直径）
			        zone1Max: baseRadius - maxDiameter,
			        // 区域2：圆环（基准半径 - 最大珠子直径 <= 半径 <= 基准半径 + 最大珠子直径）
			        zone2Min: baseRadius - maxDiameter,
			        zone2Max: baseRadius + maxDiameter,
			        // 区域3：外圆（半径 > 基准半径 + 最大珠子直径）
			        zone3Min: baseRadius + maxDiameter
			    };
			}
		  
		},
	  
		onLoad(options) {
			console.log('[bracelet] onLoad 开始执行');
			// #ifdef MP-JD
			// 京东 C2M 定制：解析并存储入口参数
			if (options && (options.customInstanceId || options.custom_instance_id || options.skuId || options.sku_id)) {
				this._jdC2mParams = {
					customInstanceId: options.customInstanceId || options.custom_instance_id || '',
					userId: options.userId || options.user_id || '',
					skuId: options.skuId || options.sku_id || '',
				};
				try {
					uni.setStorageSync('jd_c2m_params', JSON.stringify(this._jdC2mParams));
				} catch (e) {}
				if (getApp() && getApp().globalData) {
					getApp().globalData.jd_c2m_params = this._jdC2mParams;
				}
				console.log('[JD C2M] bracelet onLoad params:', this._jdC2mParams);
			} else {
				// 尝试从 storage 恢复（App onLaunch 已存储）
				try {
					const raw = uni.getStorageSync('jd_c2m_params');
					if (raw) this._jdC2mParams = JSON.parse(raw);
				} catch (e) {}
			}
			// #endif

			// 拖拽状态：非响应式，避免 touchmove 高频触发 Vue setter
			this.dragging = false;
			this.draggedIndex = -1;
			this.draggedPosition = { x: 0, y: 0 };
			this.swapTargetIndex = -1;
			this.currentDragZone = null;
			// 布局位置：非响应式，模板不依赖，每帧绘制时更新
			this.beadPositions = [];
			// 撤销/重做栈：非响应式（快照数据量大，放 data 会触发深度 reactive）
			this._undoStack = [];
			this._redoStack = [];
			// Canvas 2D 相关：非响应式
			this._cachedCtx = null;          // 2D context
			this._canvasNode = null;         // Canvas DOM 节点
			this._canvasReady = false;       // Canvas 2D 是否就绪
			this._canvasDpr = 1;             // 设备像素比
			this._rafId = null;              // requestAnimationFrame ID
			this._isLegacyCanvas = false;    // 是否使用旧版 Canvas API（京东/支付宝等）
			this._legacyDprScale = 1;        // 旧版 Canvas DPR 缩放倍数
			this._alipayPageHasHidden = false; // 淘宝页面是否经历过 onHide（用于 onShow 时重建 canvas）
			this._alipayCanvasInitDone = false; // 淘宝 canvas 是否已初始化
			this._imageObjectCache = {};     // Map<cacheKey, Image> Canvas 2D Image 对象缓存
			this._imageLoadingMap = {};      // Map<cacheKey, Promise<Image>> 正在加载的图片
			this._logoImageObj = null;       // Logo Image 对象
			this._fullRedrawPending = false; // 全量重绘标记
			this._isExporting = false;       // 导出图片时跳过按钮绘制
			this._flyInIndex = -1;           // 飞入动画珠子索引（-1 = 无飞入）
			this._flyInFrame = 0;            // 飞入动画当前帧
			this._flyInTotalFrames = 10;     // 飞入动画总帧数（~250ms）
			// 布局计算缓存（避免每帧重算 computeBraceletPositions）
			this._layoutCache = null;        // { positions, scale }
			this._layoutCacheKey = '';        // 缓存指纹
			// 滚动定位相关（非响应式）
			this._isClickScrolling = false;
			this._scrollDebounce = null;
			this._sectionTops = [];
			this._cacheGeneration = 0;
			this._scrollViewHeight = 0;

			// 获取状态栏高度，用于安全区适配
			try {
				const sysInfo = uni.getSystemInfoSync();
				this.statusBarHeight = sysInfo.statusBarHeight || 0;
				this._canvasDpr = sysInfo.pixelRatio || 2;
			} catch (e) {
				this.statusBarHeight = 0;
				this._canvasDpr = 2;
			}

			// 记录 work_id（从地址栏或上个页面传递）
			this.workId = (options && options.work_id) ? options.work_id : null;
			this.fallbackImage = this.normalizeStaticAssetPath('/static/beads/兜底图片.png');
			this._braceletLogoPath = '';
			this._isUndoRedoing = false; // 撤销/重做时跳过 pushUndoState

			//加载csv数据
			this.loadBaseInfoFromCSV();

			// 启动时异步校验持久化图片缓存（不阻塞页面渲染）
			this.$nextTick(() => {
				setTimeout(() => this._validatePersistentImageCache(), 2000);
			});

			// 事件通道回填
			const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel();
			if (eventChannel && eventChannel.on) {
				eventChannel.on('work-data', (payload) => {
					this.applyIncomingWork(payload);
				});
			}

			// 如果直接带 work_id 进入页面（如购物车跳转），尝试拉取详情回填
			if (this.workId && !String(this.workId).startsWith('local_')) {
				this.fetchWorkDetail(this.workId);
			}

			// 兜底：从缓存恢复（例如 switchTab 无法使用 eventChannel 的场景）
			try {
				const restore = uni.getStorageSync('bracelet_restore');
				if (restore) {
					this.applyIncomingWork(restore);
					uni.removeStorageSync('bracelet_restore');
				}
			} catch (e) {
				console.warn('read bracelet_restore fail', e);
			}
		},
	  
		onReady() {
			// #ifdef MP-WEIXIN
			// 微信小程序：Canvas 2D 初始化
			this._initCanvas2D();
			// #endif
			// #ifdef MP-ALIPAY
			// 淘宝：不再用 type="2d" Skia canvas，走旧版 Canvas API。
			// 延迟 500ms 确保 canvas DOM 原生层完全就绪后再创建 context，
			// 否则 uni.createCanvasContext 可能返回空壳 context 导致 draw 无效。
			setTimeout(() => {
				if (!this._canvasReady) {
					console.log('[bracelet] onReady 500ms 后初始化旧版 Canvas');
					this._initAlipayLegacy();
				}
			}, 500);
			// #endif
			// #ifndef MP-WEIXIN || MP-ALIPAY
			// 其他平台（京东等）：使用旧版 Canvas API
			this._initCanvasLegacy();
			// #endif
		},

		//确保没登录的用户点击加购后，登录完成后自动完成加购
		onShow() {
				  // 安全重置：防止 isProcessingCart 卡死导致"完成"按钮失效
				  this.isProcessingCart = false;
				  this.showFireworks = false;

				  const pending = uni.getStorageSync('pending_cart_action');
				  if (pending && pending.type === 'add_bracelet' && this.isUserLoggedIn()) {
					uni.removeStorageSync('pending_cart_action');
					this.goods_cart_event();
				  }

				  // 登录后自动续保存待办作品（仅已登录时处理，防止未登录自动跳转）
				  const pendingSave = uni.getStorageSync('pending_work_save');
				  if (pendingSave && !this.isProcessingSave && this.isUserLoggedIn()) {
					  uni.removeStorageSync('pending_work_save');
					  this.isProcessingSave = true;
					  this.saveWorkRemote(pendingSave).finally(() => {
						  this.isProcessingSave = false;
					  });
				  }
				  // 若从 tabbar 切换回来，尝试读取缓存的设计还原（switchTab 不会触发 onLoad）
				  try {
					  const restore = uni.getStorageSync('bracelet_restore');
					  if (restore) {
							  this.applyIncomingWork(restore);
						  uni.removeStorageSync('bracelet_restore');
					  }
				  } catch (e) {
					  console.warn('onShow read bracelet_restore fail', e);
				  }
				  // 登录后不自动继续完成，避免登录页反复跳转
				  const pendingComplete = uni.getStorageSync('pending_complete_action');
				  if (pendingComplete && this.isUserLoggedIn()) {
					  uni.removeStorageSync('pending_complete_action');
				  }

				  // 从其他页面返回时恢复 Canvas 显示
				  this.pageHidden = false;
				  this._isExporting = false; // 安全重置，防止导出异常后卡住

				  // #ifdef MP-ALIPAY
				  // 淘宝旧版 canvas（非 Skia）：页面回到前台后重绘
				  this.$nextTick(() => {
					  if (this._canvasReady && this._cachedCtx) {
						  this.requestFullRedraw();
					  } else if (!this.showFireworks) {
						  this._initAlipayLegacy();
					  }
				  });
				  // #endif
				  // #ifndef MP-ALIPAY
				  if (this._canvasReady) {
					  this.requestFullRedraw();
				  } else if (!this.showFireworks) {
					  this._initCanvas2D();
				  }
				  // #endif
				},

		// 页面隐藏时立即隐藏 Canvas 原生层（避免跳转时悬浮于新页面上方）
		onHide() {
			this.pageHidden = true;
			if (this._rafId) {
				this._cancelAnimationFrame(this._rafId);
				this._rafId = null;
			}
			// 注意：MP-ALIPAY 下不要清 _canvasNode / _cachedCtx / _canvasReady。
			// 淘宝 type="2d" canvas 只允许对同一个 DOM 元素调用一次 my.createCanvas，
			// 第二次会 1000ms 超时或返回无效对象。保留现有 ctx 引用，onShow 时直接 redraw，
			// 让 Skia 把画面重新渲染出来。
		},

		// 页面卸载时清理资源，防止内存泄漏
		onUnload() {

			// 取消 requestAnimationFrame
			if (this._rafId) {
				this._cancelAnimationFrame(this._rafId);
				this._rafId = null;
			}

			// 清理定时器
			if (this.pendingCompleteTimer) {
				clearTimeout(this.pendingCompleteTimer);
				this.pendingCompleteTimer = null;
			}
			if (this._materialPreloadTimer) {
				clearTimeout(this._materialPreloadTimer);
				this._materialPreloadTimer = null;
			}

			// 清理图片缓存
			this._imageObjectCache = {};
			this._imageLoadingMap = {};
			this._imageResolveCache = null;

			// 清理大数组
			this.braceletItems = [];
			this.beadPositions = [];
			this._undoStack = [];
			this._redoStack = [];
			this.imageRetryMap = {};

			// 清理 Canvas 2D 相关
			this._dragCache = null;
			this._transitionFrom = null;
			this._transitionTarget = null;
			this._cachedCtx = null;
			this._canvasNode = null;
			this._canvasReady = false;
			this._logoImageObj = null;
			this._fullRedrawPending = false;
			this._flyInIndex = -1;

			// 其他状态
			this._sectionTops = [];
			this._cacheGeneration = 0;
			if (this._scrollDebounce) clearTimeout(this._scrollDebounce);
			this._scrollDebounce = null;
			this._isClickScrolling = false;

		},


		watch: {
			// showFireworks 从 true → false 时，v-if 重建了 canvas DOM 元素，
			// 必须重新获取 node + context，否则后续绘制指向已销毁的旧元素
			showFireworks(val, oldVal) {
				if (oldVal && !val) {
					// #ifndef MP-ALIPAY
					// 微信等平台：v-if 销毁/重建了 canvas DOM，需重新获取节点
					this._canvasReady = false;
					this._cachedCtx = null;
					this._canvasNode = null;
					this.$nextTick(() => {
						setTimeout(() => {
							this._initCanvas2D();
						}, 50);
					});
					// #endif
					// #ifdef MP-ALIPAY
					// 淘宝：canvas 始终保留在 DOM 中（:hidden 控制），无需重建
					// 只需重绘即可
					if (this._canvasReady) {
						this.requestFullRedraw();
					}
					// #endif
				}
			},
			braceletItems: {
				handler() {
					// 不要 deep watch：否则给 item 写入 _resolvedImage 等临时字段会触发级联重绘，导致非常卡
					this.requestFullRedraw();
				},
				deep: false
			},
			// 素材列表变化时预加载前10张图片到 canvas 缓存，
			// 用户点击时图片已就绪，消除首次飞入的网络等待（debounce 500ms）
			currentMaterials(materials) {
				if (this._materialPreloadTimer) clearTimeout(this._materialPreloadTimer);
				this._materialPreloadTimer = setTimeout(() => {
					if (Array.isArray(materials)) {
						materials.slice(0, 20).forEach(m => {
							const rawImg = (m.imageMap || m.imagePath) || '';
							if (rawImg) this.resolveImageForCanvas(rawImg);
						});
					}
					// 分组模式下重新缓存 section 位置
					if (this.isGroupedMode) {
						this.cacheSectionPositions();
					}
				}, 500);
			},
			// allSections 变化时预加载所有已渲染 section 的珠子图片到 Canvas 缓存，
			// 比 scroll-position 方案更可靠（不依赖 _sectionTops 时序）
			allSections(sections) {
				if (this._allSectionsPreloadTimer) clearTimeout(this._allSectionsPreloadTimer);
				this._allSectionsPreloadTimer = setTimeout(() => {
					if (!Array.isArray(sections)) return;
					sections.forEach(sec => {
						if (!sec.items) return;
						sec.items.forEach(m => {
							const rawImg = (m.imageMap || m.imagePath) || '';
							if (rawImg) this.resolveImageForCanvas(rawImg);
						});
					});
				}, 100);
			}
		},

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
			/**
			 * 微信/支付宝/淘宝小程序：Canvas 2D 初始化
			 * 获取 canvas 节点 + 2D context，通过 DPR 缩放实现高清渲染
			 */
			_initCanvas2D(retryCount) {
				retryCount = retryCount || 0;
				const self = this;

				// Canvas 2D 节点获取成功后的统一设置
				const setupCanvas2D = (canvas) => {
					const dpr = self._canvasDpr;
					canvas.width = self.CANVAS_W * dpr;
					canvas.height = self.CANVAS_H * dpr;

					const ctx = canvas.getContext('2d');
					ctx.scale(dpr, dpr);

					self._canvasNode = canvas;
					self._cachedCtx = ctx;
					self._canvasReady = true;
					self._isLegacyCanvas = false;

					// 缓存 canvas 位置信息（用于触摸坐标转换）
					self._cacheCanvasOffset();

					// 预加载 Logo
					self._loadLogoForCanvas(canvas);

					// 首次绘制
					self.requestFullRedraw();
				};

				// Canvas 2D 获取失败的处理：重试或回退旧版
				const onFail = (reason) => {
					// 如果在重试期间 Canvas 已经由另一条路径（如 @ready）成功初始化，则跳过
					if (self._canvasReady) {
						console.log('Canvas 2D 重试中止：已由其他路径成功初始化');
						return;
					}
					if (retryCount < 3) {
						console.warn('Canvas 2D 第' + (retryCount + 1) + '次获取失败(' + reason + ')，200ms 后重试');
						setTimeout(() => self._initCanvas2D(retryCount + 1), 200);
						return;
					}
					console.error('Canvas 2D 获取失败（已重试3次），回退到旧版 Canvas API');
					self._initCanvasLegacy();
				};

				// #ifdef MP-ALIPAY
				// 支付宝/淘宝：使用原生 my.createSelectorQuery + .node() 获取 Canvas 2D 节点
				if (typeof my !== 'undefined' && my.createSelectorQuery) {
					const query = my.createSelectorQuery();
					query.select('#braceletCanvas').node().exec((res) => {
						const canvas = res && res[0];
						if (!canvas || typeof canvas.getContext !== 'function') {
							onFail('alipay node() 返回无效');
							return;
						}
						setupCanvas2D(canvas);
					});
					return;
				}
				// #endif

				// 微信及其他平台：使用 uni API + fields({ node: true })
				const query = uni.createSelectorQuery().in(this);
				query.select('#braceletCanvas')
					.fields({ node: true, size: true })
					.exec((res) => {
						const canvas = res && res[0] && res[0].node;
						if (!canvas || typeof canvas.getContext !== 'function') {
							onFail('fields({node:true}) 返回无效');
							return;
						}
						setupCanvas2D(canvas);
					});
			},

			/**
			 * 淘宝 canvas 元素 @ready 事件回调（DOM 就绪后触发）
			 * 淘宝文档：同层渲染 Canvas 请在 Canvas 标签上绑定 onReady 事件以保证时序
			 */
			onAlipayCanvasReady() {
				// 淘宝 Skia canvas 在 :hidden 切换 (true→false) 后会重新触发 @ready。
				// 如果 canvas 已经初始化成功（_canvasReady + _cachedCtx 都在），
				// 只需要 redraw，绝对不能再调 my.createCanvas（二次调用会 1000ms 挂死）。
				if (this._canvasReady && this._cachedCtx) {
					console.log('[bracelet] canvas @ready 触发，canvas 已就绪，仅 redraw');
					this.$nextTick(() => this.requestFullRedraw());
					return;
				}
				// 如果页面在后台（pageHidden=true），canvas 处于 :hidden 状态，
				// 淘宝 Skia 不允许在 hidden 状态下 my.createCanvas（会 1000ms 超时挂死）。
				// 延迟到 onShow 时再初始化。
				if (this.pageHidden) {
					console.log('[bracelet] canvas @ready 触发，但页面 hidden，等 onShow 再 init');
					this._alipayCanvasInitDone = false; // 确保 onShow 能触发 init
					return;
				}
				if (this._alipayCanvasInitDone) return; // 正在初始化中，防并发
				this._alipayCanvasInitDone = true;
				console.log('[bracelet] canvas @ready 触发，200ms 后初始化 Canvas 2D');
				// @ready 在 [APPX][Page][Ready] 之前触发，需等待原生 Skia 渲染目标完全创建
				setTimeout(() => { this._initAlipayCanvas(); }, 200);
			},

			/**
			 * 淘宝/支付宝小程序 Canvas 初始化
			 * 前提：canvas 元素必须有 type="2d" 属性，否则 Taobao 不会创建 Skia 渲染层，
			 * my.createCanvas 内部访问 lastElementChild 时会抛出 null 异常。
			 */
			_initAlipayCanvas() {
				const self = this;

				if (typeof my === 'undefined' || typeof my.createCanvas !== 'function') {
					this._initAlipayLegacy();
					return;
				}

				// 1000ms 超时保护（应对 success/fail 回调永不触发的情况）
				let callbackFired = false;
				const timeoutId = setTimeout(function() {
					if (!callbackFired) {
						callbackFired = true;
						console.warn('[bracelet] my.createCanvas 1000ms 超时，回退旧版');
						self._initAlipayLegacy();
					}
				}, 1000);

				try {
					my.createCanvas({
						id: 'braceletCanvas',
						success: function(canvas) {
							if (callbackFired) return;
							callbackFired = true;
							clearTimeout(timeoutId);
							if (!canvas || typeof canvas.getContext !== 'function') {
								console.warn('[bracelet] my.createCanvas 返回无效对象，回退旧版');
								self._initAlipayLegacy();
								return;
							}
							// Taobao Skia Canvas (type="2d")：canvas.width 单位为物理像素，同时控制显示尺寸
							// 必须设为 CSS显示尺寸 × DPR，才能使 canvas 显示尺寸正好等于 720rpx×600rpx
							// 同时获得高分辨率 buffer（DPR 倍率），消除模糊
							let sw = 375, dpr = 2;
							try {
								const si = uni.getSystemInfoSync();
								sw = si.screenWidth || 375;
								dpr = si.pixelRatio || 2;
							} catch(e) {}
							const displayW = Math.round(720 * sw / 750);
							const displayH = Math.round(600 * sw / 750);
							const bufferW = Math.round(displayW * dpr);
							const bufferH = Math.round(displayH * dpr);
							canvas.width = bufferW;
							canvas.height = bufferH;
							const ctx = canvas.getContext('2d');
							// 重置变换矩阵：防止重新初始化时（如 onHide → onShow 触发的二次 init）
							// 之前的 ctx.scale 在 Skia canvas 上没被 canvas.width 清空，导致累计缩放。
							try { ctx.setTransform(1, 0, 0, 1, 0, 0); } catch (e) {}
							// 缩放使绘图坐标系仍为 CANVAS_W × CANVAS_H（物理像素空间）
							ctx.scale(bufferW / self.CANVAS_W, bufferH / self.CANVAS_H);

							console.log('[bracelet] 淘宝 Canvas 2D 成功 buffer=' + bufferW + 'x' + bufferH +
								' display=' + displayW + 'x' + displayH + ' dpr=' + dpr);

							self._canvasNode = canvas;
							self._cachedCtx = ctx;
							self._canvasReady = true;
							self._isLegacyCanvas = false;
							self._legacyDprScale = 1;
							self._cacheCanvasOffset();
							self._loadLogoForCanvas(canvas);
							self.requestFullRedraw();
						},
						fail: function(err) {
							if (callbackFired) return;
							callbackFired = true;
							clearTimeout(timeoutId);
							console.warn('[bracelet] my.createCanvas 失败，回退旧版', err);
							self._initAlipayLegacy();
						}
					});
				} catch(e) {
					clearTimeout(timeoutId);
					callbackFired = true;
					console.warn('[bracelet] my.createCanvas 异常，回退旧版:', e.message);
					self._initAlipayLegacy();
				}
			},

			/**
			 * 淘宝旧版 Canvas 回退（无 DPR，保证功能正确）
			 */
			_initAlipayLegacy() {
				console.log('[bracelet] 淘宝旧版 Canvas 初始化（无 DPR）');
				const ctx = uni.createCanvasContext('braceletCanvas', this);
				if (!ctx) {
					console.error('[bracelet] 淘宝旧版 Canvas 上下文获取失败');
					return;
				}
				this._cachedCtx = ctx;
				this._canvasNode = null;
				this._canvasReady = true;
				this._isLegacyCanvas = true;
				this._legacyDprScale = 1;
				this._cacheCanvasOffset();
				this._loadLogoForCanvasLegacy();
				this.requestFullRedraw();
			},

			/**
			 * 京东/其他平台：旧版 Canvas API 初始化
			 */
			_initCanvasLegacy() {
				const ctx = uni.createCanvasContext('braceletCanvas', this);
				if (!ctx) {
					console.error('Canvas Legacy 上下文获取失败');
					return;
				}

				this._cachedCtx = ctx;
				this._canvasNode = null; // 旧版 API 无 canvas 节点对象
				this._canvasReady = true;
				this._isLegacyCanvas = true;

				// 缓存 canvas 位置信息
				this._cacheCanvasOffset();

				// 预加载 Logo（旧版 API 不需要传 canvas 节点）
				this._loadLogoForCanvasLegacy();

				// 首次绘制
				this.requestFullRedraw();
			},

			/**
			 * 缓存 canvas 位置信息（用于触摸坐标转换）
			 * 始终从 wrapper 尺寸 + CSS 布局常量推算 canvas 实际视觉位置。
			 * 不依赖 canvas 元素的 boundingClientRect（京东返回 width=0，
			 * 且 position:relative 偏移在不同平台行为不一致）。
			 *
			 * CSS 布局常量：
			 *   .canvas-wrapper: height=620rpx, align-items=flex-end, justify-content=center
			 *   .bracelet-canvas: 720rpx × 600rpx, position:relative, top:-60rpx
			 *   → canvas 布局顶部 = 620-600 = 20rpx from wrapper top
			 *   → canvas 视觉顶部 = 20-60 = -40rpx from wrapper top
			 */
			_cacheCanvasOffset(retryCount = 0) {
				const MAX_RETRIES = 8;
				const RETRY_DELAY = 150; // ms

				// #ifdef MP-ALIPAY
				// 支付宝小程序：使用原生 my.createSelectorQuery API
				if (typeof my !== 'undefined' && my.createSelectorQuery) {
					const query = my.createSelectorQuery();
					query.select('#braceletCanvas').boundingClientRect();
					query.select('.canvas-wrapper').boundingClientRect();
					query.exec((res) => {
						this._processSelectorResult(res, retryCount, MAX_RETRIES, RETRY_DELAY);
					});
					return;
				}
				// #endif

				const q = uni.createSelectorQuery().in(this);
				// 同时查询 canvas 和 wrapper，优先使用 canvas 的位置（更准确）
				q.select('#braceletCanvas').boundingClientRect();
				q.select('.canvas-wrapper').boundingClientRect();
				q.exec((res) => {
					this._processSelectorResult(res, retryCount, MAX_RETRIES, RETRY_DELAY);
				});
			},

			/**
			 * 处理选择器查询结果
			 */
			_processSelectorResult(res, retryCount, MAX_RETRIES, RETRY_DELAY) {
				const cvRect = res && res[0];
				const wrRect = res && res[1];

				// 优先使用 canvas 元素的位置（如果可用且有效）
				if (cvRect && cvRect.width > 0 && cvRect.height > 0) {
					this.cachedCanvasOffset = {
						left: cvRect.left,
						top: cvRect.top,
						width: cvRect.width,
						height: cvRect.height,
					};
					return;
				}

				// 其次使用 wrapper 位置 + CSS 常量推算
				if (wrRect && wrRect.width > 0) {
					// 从 wrapper rect + CSS 布局常量推算 canvas 实际位置
					const rpxToPx = wrRect.height / 620; // wrapper 高度固定 620rpx
					const canvasW = 720 * rpxToPx;
					const canvasH = 600 * rpxToPx;
					const canvasLeft = wrRect.left + (wrRect.width - canvasW) / 2;

					// canvas 视觉顶部 = wrapper.top + (20-60)rpx = wrapper.top - 40rpx
					// (flex-end 布局偏移 20rpx - position:relative top:-60rpx)
					const canvasTop = wrRect.top + (-40) * rpxToPx;

					this.cachedCanvasOffset = {
						left: canvasLeft,
						top: canvasTop,
						width: canvasW,
						height: canvasH,
					};
					return;
				}

				// 都失败了，重试或兜底
				if (retryCount < MAX_RETRIES) {
					console.warn('[bindinding] _cacheCanvasOffset failed, retry', retryCount + 1, '/', MAX_RETRIES,
						'cvRect:', JSON.stringify(cvRect), 'wrRect:', JSON.stringify(wrRect));
					setTimeout(() => {
						this._cacheCanvasOffset(retryCount + 1);
					}, RETRY_DELAY);
				} else {
					// 选择器查询彻底失败，使用屏幕信息兜底计算
					console.warn('[bindinding] _cacheCanvasOffset fallback to screen calculation');
					this._cacheCanvasOffsetFallback();
				}
			},

			/**
			 * 选择器查询失败时的兜底方案：基于屏幕信息和 CSS 布局常量计算 canvas 位置
			 * 仅适用于支付宝等 createSelectorQuery 不可靠的平台
			 */
			_cacheCanvasOffsetFallback() {
				const sysInfo = uni.getSystemInfoSync();
				const screenWidth = sysInfo.windowWidth || sysInfo.screenWidth || 375;
				const rpxToPx = screenWidth / 750;

				// CSS 布局常量（参见 <style> 部分）：
				// .preview-section: marginTop = statusBarHeight + 100px, flex, align-items=center
				// .canvas-wrapper: width=100%, height=620rpx, max-width=860rpx, margin-top=60rpx, align-items=flex-end
				// .bracelet-canvas: 720rpx × 600rpx, position:relative, top=-60rpx

				const wrapperMarginTop = 60 * rpxToPx;
				const wrapperHeight = 620 * rpxToPx;
				const canvasW = 720 * rpxToPx;
				const canvasH = 600 * rpxToPx;

				// wrapper 水平居中
				const wrapperWidth = Math.min(screenWidth, 860 * rpxToPx);
				const wrapperLeft = (screenWidth - wrapperWidth) / 2;
				const canvasLeft = wrapperLeft + (wrapperWidth - canvasW) / 2;

				// 垂直位置计算：
				// 1. preview-section 顶部 = statusBarHeight + 100px
				// 2. canvas-wrapper 有 margin-top: 60rpx
				// 3. canvas 在 wrapper 内 flex-end 对齐，布局顶部 = wrapperHeight - canvasH = 20rpx
				// 4. canvas 有 top: -60rpx 的 relative 偏移
				const previewTop = this.statusBarHeight + 100;
				const wrapperTop = previewTop + wrapperMarginTop;
				const canvasLayoutTop = wrapperTop + (wrapperHeight - canvasH); // flex-end: +20rpx
				const canvasTop = canvasLayoutTop + (-60) * rpxToPx; // top: -60rpx

				this.cachedCanvasOffset = {
					left: canvasLeft,
					top: canvasTop,
					width: canvasW,
					height: canvasH,
				};
			},

			/**
			 * 兼容的 requestAnimationFrame 封装
			 * - Canvas 2D (微信): 使用 canvas.requestAnimationFrame
			 * - 旧版 API (京东等): 使用 setTimeout 模拟
			 */
			_requestAnimationFrame(callback) {
				if (this._canvasNode && this._canvasNode.requestAnimationFrame) {
					return this._canvasNode.requestAnimationFrame(callback);
				}
				// 旧版 API 回退：使用 setTimeout 模拟 ~16ms 帧率
				return setTimeout(callback, 16);
			},

			/**
			 * 兼容的 cancelAnimationFrame 封装
			 */
			_cancelAnimationFrame(id) {
				if (this._canvasNode && this._canvasNode.cancelAnimationFrame) {
					this._canvasNode.cancelAnimationFrame(id);
				} else {
					clearTimeout(id);
				}
			},

			/**
			 * 旧版 Canvas API 的 Logo 预加载（京东/支付宝等平台）
			 */
			_loadLogoForCanvasLegacy() {
				const logoPath = '/static/logo/logo.png';
				this._braceletLogoPath = logoPath;
				this._logoImageObj = { src: logoPath, _loaded: true, _isPath: true };
				this.requestFullRedraw();
			},

			openTutorial() {
				this.showTutorial = true;
			},
			closeTutorial() {
				this.showTutorial = false;
				// canvas 由 hidden 控制显隐，关闭弹窗后恢复显示并刷新内容
				this.$nextTick(() => this.requestFullRedraw());
			},
			getImageResolveCache() {
				if (!this._imageResolveCache || typeof this._imageResolveCache !== 'object') {
					this._imageResolveCache = Object.create(null);
				}
				// 内存优化：缓存超过 80 项时清理最老的 40 项（LRU 简化版）
				const keys = Object.keys(this._imageResolveCache);
				if (keys.length > 80) {
					// 简单 FIFO 清理（真正 LRU 需要额外数据结构，此处优先简单实现）
					keys.slice(0, 40).forEach(k => delete this._imageResolveCache[k]);
				}
				return this._imageResolveCache;
			},
			getPersistentImageCache() {
				// 仅用于微信小程序：把远程图片保存到本地文件系统，跨会话复用
				// 返回 { map, save(map) }
				const key = 'bracelet_persistent_img_cache_v1';
				let map = {};
				try {
					map = uni.getStorageSync(key) || {};
				} catch (e) {
					map = {};
				}
				const save = (next) => {
					try {
						uni.setStorageSync(key, next || {});
					} catch (e) {}
				};
				return { map, save, key };
			},
			isOnLoginPage() {
				try {
					const pages = getCurrentPages ? getCurrentPages() : [];
					const current = pages[pages.length - 1];
					const route = current && (current.route || current.__route__);
					return route === 'pages/login/login';
				} catch (e) {
					return false;
				}
			},
			// 跳转前先隐藏 Canvas 原生层，避免悬浮闪烁
			_navigateAway(fn) {
				this.pageHidden = true;
				if (this._rafId) {
					this._cancelAnimationFrame(this._rafId);
					this._rafId = null;
				}
				this.$nextTick(() => {
					setTimeout(() => {
						try { fn(); } catch (e) {
							console.warn('_navigateAway callback error', e);
							this.pageHidden = false;
							this.requestFullRedraw();
						}
					}, 30); // 等待原生 Canvas 层响应 hidden 绑定
				});
			},
			navigateToLogin() {
				if (this.isOnLoginPage()) return;
				const now = Date.now();
				if (now - this.loginRedirectingAt < 1500) return;
				this.loginRedirectingAt = now;
				this._navigateAway(() => {
					uni.navigateTo({
						url: '/pages/login/login',
						fail: () => { this.pageHidden = false; this.requestFullRedraw(); }
					});
				});
			},
			tryResumePendingComplete() {
				const pendingComplete = uni.getStorageSync('pending_complete_action');
				if (!pendingComplete || this.isProcessingCart) return;

				if (this.isUserLoggedIn()) {
					uni.removeStorageSync('pending_complete_action');
					this.pendingCompleteRetryCount = 0;
					this.pendingCompleteChecking = false;
					if (this.pendingCompleteTimer) {
						clearTimeout(this.pendingCompleteTimer);
						this.pendingCompleteTimer = null;
					}
					// 轻微延迟确保登录态与页面渲染已就绪
					setTimeout(() => this.handleComplete(), 200);
					return;
				}

				if (this.pendingCompleteChecking) return;
				this.pendingCompleteChecking = true;
				this.pendingCompleteRetryCount = 0;

				const retry = () => {
					if (this.isUserLoggedIn()) {
						uni.removeStorageSync('pending_complete_action');
						this.pendingCompleteRetryCount = 0;
						this.pendingCompleteChecking = false;
						this.pendingCompleteTimer = null;
						setTimeout(() => this.handleComplete(), 200);
						return;
					}
					this.pendingCompleteRetryCount += 1;
					if (this.pendingCompleteRetryCount >= 5) {
						this.pendingCompleteChecking = false;
						this.pendingCompleteTimer = null;
						return;
					}
					this.pendingCompleteTimer = setTimeout(retry, 200);
				};

				this.pendingCompleteTimer = setTimeout(retry, 200);
			},
			
			//读取并解析CSV文件
			async loadBaseInfoFromCSV() {
				this.isLoadingCSV = true;
				this.csvLoadError = null;
				try {
					// #ifdef MP-WEIXIN
					const fs = (typeof wx !== 'undefined' && wx.getFileSystemManager)
						? wx.getFileSystemManager()
						: (typeof uni.getFileSystemManager === 'function' ? uni.getFileSystemManager() : null);
					if (fs) {
						const userPath = (typeof wx !== 'undefined' && wx.env && wx.env.USER_DATA_PATH)
							? `${wx.env.USER_DATA_PATH}/base_info.csv`
							: '';
						const buildStaticUrl = (path) => {
							const base = app?.globalData?.data?.static_url || '';
							if (!base) return '';
							const cleanBase = base.endsWith('/') ? base : `${base}/`;
							return cleanBase + String(path || '').replace(/^\/+/, '');
						};
						const remoteUrls = [
							buildStaticUrl('static/bracelet/base_info.csv'),
						].filter(Boolean);

						const tryRemote = (index) => {
							if (index >= remoteUrls.length) {
							console.warn('[bracelet] CSV remote all failed, fallback data used.');
								this.useFallbackData();
								return;
							}
								this._request({
								url: remoteUrls[index],
								method: 'GET',
								responseType: 'arraybuffer',
								dataType: 'text',
								success: (res) => {
									if (res && res.data) {
										const text = this.normalizeCsvText(res.data);
										const count = this.parseCSVData(text);
										if (count > 0) {
											if (userPath) {
												try {
													fs.writeFile({
														filePath: userPath,
														data: text,
														encoding: 'utf-8',
													});
												} catch (e) {}
											}
											return;
										}
									}
									tryRemote(index + 1);
								},
							fail: (err) => {
								console.warn('[bracelet] CSV remote request failed:', remoteUrls[index], err);
								tryRemote(index + 1);
							},
							});
						};

						if (userPath) {
							fs.readFile({
								filePath: userPath,
								encoding: 'utf-8',
								success: (res) => {
									const count = this.parseCSVData(res.data || '');
									if (count > 0) {
										return;
									}
								console.warn('[bracelet] CSV cache empty/invalid, try remote.');
									tryRemote(0);
								},
							fail: (err) => {
								console.warn('[bracelet] CSV cache read failed:', userPath, err);
								tryRemote(0);
							},
							});
						} else {
							tryRemote(0);
						}
						return;
					}
					// #endif

					// #ifdef MP-ALIPAY
					// 淘宝/支付宝小程序：直接使用嵌入的CSV数据（淘宝禁止配置域名白名单）
					console.log('[bracelet] MP-ALIPAY: 直接使用嵌入CSV数据');
					this._loadEmbeddedCsvData();
					return;
					// #endif

					// 非微信/非淘宝端（京东等）：使用远程 URL 加载 CSV
					// #ifndef MP-ALIPAY
					const app = getApp();
					const buildStaticUrl = (path) => {
						const base = app?.globalData?.data?.static_url || 'https://ostone.store/';
						const cleanBase = base.endsWith('/') ? base : `${base}/`;
						return cleanBase + String(path || '').replace(/^\/+/, '');
					};
					const urls = [buildStaticUrl('static/bracelet/base_info.csv')];
					const tryNext = (index) => {
						if (index >= urls.length) {
							this.useFallbackData();
							return;
						}
						this._request({
							url: urls[index],
							method: 'GET',
							success: (res) => {
								if (res && res.data) {
									const text = this.normalizeCsvText(res.data);
									const count = this.parseCSVData(text);
									if (count > 0) return;
								}
								tryNext(index + 1);
							},
							fail: () => tryNext(index + 1)
						});
					};
					tryNext(0);
					// #endif
				} catch (e) {
					console.error('loadBaseInfoFromCSV error:', e);
					this.useFallbackData();
				}
			},
			
			normalizeCsvText(data) {
				if (typeof data === 'string') return data;

				// 尝试使用 TextDecoder
				try {
					if (typeof TextDecoder !== 'undefined') {
						let buffer = data;
						if (!(data instanceof ArrayBuffer) && data?.buffer instanceof ArrayBuffer) {
							buffer = data.buffer;
						}
						if (buffer instanceof ArrayBuffer) {
							return new TextDecoder('utf-8').decode(new Uint8Array(buffer));
						}
					}
				} catch (e) { /* ignore */ }

				// 手动解码 ArrayBuffer
				if (data instanceof ArrayBuffer || (data?.buffer instanceof ArrayBuffer)) {
					const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array(data.buffer);
					let result = '';
					const chunk = 0x8000;
					for (let i = 0; i < bytes.length; i += chunk) {
						result += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
					}
					try {
						return decodeURIComponent(escape(result));
					} catch (e) {
						return result;
					}
				}

				return String(data || '');
			},
			
			/**
			 * 解析CSV数据并填充到 materials 和 accessories
			 */
			parseCSVData(csvText) {
				// 按行分割
				const lines = csvText.split('\n').filter(line => line.trim());
				// 跳过表头（第一行）
				const dataLines = lines.slice(1);
				// 初始化空对象
				const newMenuData = {
					'珠子': {},
					'配件': {},
				};
				let itemCount = 0;
				dataLines.forEach((line, index) => {
					try {
						// 分割CSV行
						const columns = this.parseCSVLine(line);
						if (columns.length < 9) {
							console.warn(`行 ${index + 2} 数据不完整:`, line);
							return;
						}
						const [
							func,
							type,
							category,
							name,
							specification,
							sizeValue,    //珠子：直径      吊坠：穿孔宽度
							width,
							height,
							sizeRemark,
							priceValue,
							priceRemark,
							imageMap,
							colorTag,
							zodiacTag,
							starTag,
							wishTag,
							styleTag,
							skuId,
						] = columns;
						if (!func || !type || !category || !name || !imageMap) {
							console.warn(`行 ${index + 2} 关键字段缺失:`, line);
							return;
						}
						const level1 = String(func || '').trim() === '配件' ? '配件' : '珠子';
						const sizeText = String(specification || '').trim() || String(sizeValue || '').trim();
						const sizeNum = String(sizeValue || '').trim();
						const priceNum = priceValue;
						// 构建数据对象
						const item = {
							id: String(skuId || '').trim(),
							sku_id: String(skuId || '').trim(),
							name: String(name).trim(),
							size: sizeNum,
							width: String(width || '').trim(),
							height: String(height || '').trim(),
							sizeLabel: sizeText,
							price: `¥${priceValue || ''}`,
							priceNum: priceNum,
							imageMap: this.buildImagePath(level1, String(imageMap).trim()),
							types: String(type || '').trim(),
							category: String(category || '').trim(),
							colorTag: String(colorTag || '').trim(),
							zodiacTag: String(zodiacTag || '').trim(),
							starTag: String(starTag || '').trim(),
							wishTag: String(wishTag || '').trim(),
							styleTag: String(styleTag || '').trim(),
						};
						const level2 = item.types;
						const level3 = item.category;
						if (!newMenuData[level1][level2]) {
							newMenuData[level1][level2] = {};
						}
						if (!newMenuData[level1][level2][level3]) {
							newMenuData[level1][level2][level3] = [];
						}
						
						newMenuData[level1][level2][level3].push(item);
						itemCount += 1;
				
					} catch (e) {
						console.error(`解析行 ${index + 2} 失败:`, e, line);
					}
				});
				if (!itemCount) {
					return 0;
				}
				// 更新data
				this.menuData = newMenuData;
				this.materials = newMenuData['珠子'] || {};
				this.accessories = newMenuData['配件'] || {};
				// 更新分类列表
				this.categories = Object.keys(this.materials || {});
				this.accessoryCategories = Object.keys(this.accessories || {});
						
				// 设置默认选中：珠子 - 水晶 - 第一个L3（与滚动位置一致）
				if (this.level2Options.length > 0) {
					this.selectedLevel2 = this.level2Options.includes('水晶') ? '水晶' : this.level2Options[0];
					if (this.level3Options.length > 0) {
						this.selectedLevel3 = this.level3Options[0];
					}
				}
				return itemCount;
			},
			
			/**
			 * 解析CSV行（处理字段内可能包含逗号的情况）
			 */
			parseCSVLine(line) {
				const result = [];
				let current = '';
				let inQuotes = false;
				for (let i = 0; i < line.length; i++) {
					const char = line[i];
					if (char === '"') {
						inQuotes = !inQuotes;
					} else if (char === ',' && !inQuotes) {
						result.push(current);
						current = '';
					} else {
						current += char;
					}
				}
				result.push(current);
				return result.map(field => field.trim());
			},
			
			buildImagePath(level1, imageName) {
				if (!imageName) return '';
				const raw = String(imageName).trim();
				if (!raw) return '';

				// #ifdef MP-ALIPAY
				// 淘宝/支付宝小程序：优先使用天猫 CDN 图片映射表
				const tmallUrl = getTmallImageUrl(raw);
				if (tmallUrl) {
					return tmallUrl;
				}
				// 如果映射表中没有，且配置了 tmallImageBaseUrl，则尝试拼接
				if (this.tmallImageBaseUrl) {
					const baseUrl = this.tmallImageBaseUrl.replace(/\/+$/, '');
					let fileName = raw;
					if (fileName.includes('/')) {
						fileName = fileName.split('/').pop();
					}
					if (!/\.[a-zA-Z0-9]+$/.test(fileName)) {
						fileName = `${fileName}.png`;
					}
					return `${baseUrl}/${fileName}`;
				}
				// #endif

				const normalized = this.normalizeStaticAssetPath(raw);
				// 已是完整 URL / static 路径则直接返回
				if (
					/^https?:\/\//i.test(normalized)
					|| normalized.startsWith('/static/')
					|| normalized.startsWith('/public/static/bracelet/')
				) {
					return normalized;
				}
				// 如果已经带路径前缀，保持原样
				const cleaned = normalized.replace(/^\/+/, '');
				if (cleaned.includes('/')) {
					// 目录路径但没带扩展名时，默认补 .png（CSV/后台经常只给"文件名"）
					const split = cleaned.split(/([?#].*)/); // 保留 query/hash
					let pathPart = split[0] || '';
					const suffixPart = split[1] || '';
					if (pathPart && !/\.[a-zA-Z0-9]+$/.test(pathPart)) {
						pathPart = `${pathPart}.png`;
					}
					const withExt = `${pathPart}${suffixPart}`;
					if (withExt.startsWith('static/')) {
						return this.mapBraceletStaticPath(withExt) || `/${withExt}`;
					}
					return withExt.startsWith('/') ? withExt : `/${withExt}`;
				}
				const baseRoot = this.getBraceletStaticBase();
				const dir = level1 === '配件' ? 'accessories' : 'beads';
				const base = baseRoot ? `${baseRoot}/${dir}/` : `/static/${dir}/`;
				const hasExt = /\.[a-zA-Z0-9]+$/.test(cleaned);
				return `${base}${cleaned}${hasExt ? '' : '.png'}`;
			},
			getBraceletStaticBase() {
				const base = app?.globalData?.data?.static_url || '';
				const normalized = String(base || '').replace(/\/+$/, '');
				return normalized ? `${normalized}/static/bracelet` : '';
			},
			mapBraceletStaticPath(raw) {
				const text = String(raw || '').trim();
				if (!text) return '';
				if (/^https?:\/\//i.test(text)) return text;
				const base = this.getBraceletStaticBase();
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
			},
			normalizeStaticAssetPath(raw) {
				const text = String(raw || '').trim();
				if (!text) return '';
				if (/^https?:\/\//i.test(text)) return text;
				let normalized = text;
				// 后端有时会返回 "shop/static/..."（无协议、无前导 /），这里统一归一化
				if (/^\/?shop\/static\//i.test(normalized)) {
					const base = String(app?.globalData?.data?.static_url || '').replace(/\/+$/, '');
					const rel = normalized.replace(/^\/+/, '');
					normalized = base ? `${base}/${rel}` : `/${rel}`;
				}
				if (normalized.startsWith('/pages/bracelet/static/')) {
					normalized = normalized.replace('/pages/bracelet/static/', '/static/');
				} else if (normalized.startsWith('pages/bracelet/static/')) {
					normalized = '/' + normalized.replace('pages/bracelet/static/', 'static/');
				} else if (normalized.startsWith('static/')) {
					normalized = '/' + normalized;
				}
				// 对 /static... 或相对路径：若没带扩展名，默认补 .png（避免 “白水晶圆珠” 这种）
				const split = normalized.split(/([?#].*)/);
				const pathPart = split[0] || '';
				const suffixPart = split[1] || '';
				if (pathPart && !/\.[a-zA-Z0-9]+$/.test(pathPart)) {
					normalized = `${pathPart}.png${suffixPart}`;
				}
				if (normalized.startsWith('/static/')) {
					return this.mapBraceletStaticPath(normalized);
				}
				return normalized;
			},

			// #ifdef MP-ALIPAY
			/**
			 * 淘宝/支付宝小程序：使用嵌入的 CSV 数据作为兜底
			 */
			_loadEmbeddedCsvData() {
				console.log('[bracelet] MP-ALIPAY: 使用嵌入CSV数据');
				try {
					const hasData = baseInfoCsvText && baseInfoCsvText.length > 0;
					console.log('[bracelet] MP-ALIPAY: 嵌入数据长度', hasData ? baseInfoCsvText.length : 0);
					if (hasData) {
						const count = this.parseCSVData(baseInfoCsvText);
						console.log('[bracelet] MP-ALIPAY: 嵌入数据解析', count, '条');
						if (count > 0) {
							this.isLoadingCSV = false;
							return;
						}
					}
					console.warn('[bracelet] MP-ALIPAY: 嵌入数据无效，使用硬编码数据');
					this.useFallbackData();
				} catch (e) {
					console.error('[bracelet] MP-ALIPAY: 嵌入CSV加载错误:', e);
					this.useFallbackData();
				}
			},
			// #endif

			/**
			 * 使用备用数据（原有硬编码数据）
			 */
			useFallbackData() {
				// 珠子数据
				this.materials = {
					'白水晶': [
						{ id: 1, name: '净体白水晶', price: '¥3', priceNum: 3, size: '6mm', imageMap: '/static/beads/白水晶圆珠.png'},
						{ id: 2, name: '净体白水晶', price: '¥5', priceNum: 5, size: '8mm' , imageMap: '/static/beads/白水晶圆珠.png'},
						{ id: 3, name: '净体白水晶', price: '¥10', priceNum: 10, size: '10mm' , imageMap: '/static/beads/白水晶圆珠.png'},
						{ id: 4, name: '净体白水晶', price: '¥15', priceNum: 15, size: '12mm' , imageMap: '/static/beads/白水晶圆珠.png'},
						{ id: 5, name: '奶白晶', price: '¥4', priceNum: 4, size: '8mm' , imageMap: '/static/beads/白水晶圆珠.png'},
						{ id: 6, name: '奶白晶', price: '¥8', priceNum: 8, size: '10mm' , imageMap: '/static/beads/白水晶圆珠.png'},
					],
					'紫水晶': [
						{ id: 7, name: '紫水晶', price: '¥15', priceNum: 15, size: '8mm' , imageMap: '/static/beads/深色乌拉圭紫水晶.png'},
						{ id: 8, name: '紫水晶', price: '¥20', priceNum: 20, size: '10mm' , imageMap: '/static/beads/深色乌拉圭紫水晶.png'},
						{ id: 9, name: '紫水晶', price: '¥20', priceNum: 20, size: '12mm' , imageMap: '/static/beads/深色乌拉圭紫水晶.png'},
						{ id: 10, name: '紫水晶', price: '¥20', priceNum: 20, size: '14mm' , imageMap: '/static/beads/深色乌拉圭紫水晶.png'},
						{ id: 11, name: '深紫水晶', price: '¥25', priceNum: 25, size: '10mm' , imageMap: '/static/beads/深色乌拉圭紫水晶.png'},
					],
						
					'黄水晶': [
						{ id: 12, name: '黄水晶', price: '¥12', priceNum: 12, size: '8mm' , imageMap: '/static/beads/柠檬黄黄水晶.png'},
						{ id: 13, name: '黄水晶', price: '¥18', priceNum: 18, size: '10mm' , imageMap: '/static/beads/柠檬黄黄水晶.png'},
					],
						
					'粉水晶': [
						{ id: 14, name: '粉水晶', price: '¥13', priceNum: 13, size: '8mm' , imageMap: '/static/beads/星光马粉.png'},
						{ id: 15, name: '粉水晶', price: '¥20', priceNum: 20, size: '10mm' , imageMap: '/static/beads/星光马粉.png'},
					],
						
					'茶水晶': [
						{ id: 16, name: '茶水晶', price: '¥10', priceNum: 10, size: '8mm' , imageMap: '/static/beads/茶水晶圆珠.png'},
						{ id: 17, name: '茶水晶', price: '¥15', priceNum: 15, size: '10mm' , imageMap: '/static/beads/茶水晶圆珠.png'},
					],
				};
				
				// 配件数据
				this.accessories = {
					'异形': [
						{ id: 101, name: '白水晶Kitty猫', price: '¥18', priceNum: 18, size: '10mm' , imageMap: '/static/accessories/diamonds.png'},
						{ id: 102, name: '白水晶双尖', price: '¥18', priceNum: 18, size: '10mm', imageMap: '/static/accessories/diamonds.png'},
						{ id: 103, name: '白水晶刻面方糖', price: '¥10', priceNum: 10, size: '10mm' , imageMap: '/static/accessories/diamonds.png'},
						{ id: 104, name: '白水晶药片珠', price: '¥5', priceNum: 5, size: '10mm' , imageMap: '/static/accessories/diamonds.png'},
					],
						
					'隔珠': [
						{ id: 201, name: '红玛瑙盘珠小', price: '¥2', priceNum: 2, size: '3mm' , imageMap: '/static/accessories/diamonds.png'},
						{ id: 202, name: '红玛瑙盘珠大', price: '¥2.5', priceNum: 2.5, size: '4mm' , imageMap: '/static/accessories/diamonds.png'},
						{ id: 203, name: '金色隔珠', price: '¥3', priceNum: 3, size: '4mm' , imageMap: '/static/accessories/diamonds.png'},
						{ id: 204, name: '银色隔珠', price: '¥3', priceNum: 3, size: '4mm' , imageMap: '/static/accessories/diamonds.png'},
					],
						
					'跑环': [
						{ id: 301, name: '银色跑环', price: '¥5', priceNum: 5, size: '10mm' , imageMap: '/static/accessories/diamonds.png'},
						{ id: 302, name: '金色跑环', price: '¥6', priceNum: 6, size: '10mm' , imageMap: '/static/accessories/diamonds.png'},
					],
						
					'卡扣': [
						{ id: 401, name: '莲花卡扣', price: '¥15', priceNum: 15, size: '10mm' , imageMap: '/static/accessories/diamonds.png'},
						{ id: 402, name: '平安扣', price: '¥20', priceNum: 20, size: '10mm' , imageMap: '/static/accessories/diamonds.png'},
						{ id: 403, name: '小葫芦', price: '¥12', priceNum: 12, size: '10mm' , imageMap: '/static/accessories/diamonds.png'},
					],
						
				};
						
				this.categories = Object.keys(this.materials);
				this.accessoryCategories = Object.keys(this.accessories);
				
				// 兼容当前三级菜单结构
				this.menuData = {
					'珠子': { '默认': this.materials },
					'配件': { '默认': this.accessories },
				};
						
				if (this.level2Options.length > 0) {
					this.selectedLevel2 = this.level2Options[0];
					if (this.level3Options.length > 0) {
						this.selectedLevel3 = this.level3Options[0];
					}
				}

				if (this.categories.length > 0) {
					this.selectedCategory = this.categories[0];
				}

				// 确保加载状态结束
				this.isLoadingCSV = false;
			},

			// 将已有作品数据回填到画布
			applyIncomingWork(payload = {}) {
				if (!payload) return;
				this.workId = payload.work_id || this.workId;
				this.workTitle = payload.design_title || this.workTitle;
				this.workDesc = payload.design_desc || this.workDesc;
				this.workPrice = payload.design_price || this.workPrice;

				const parts = this.normalizeDesignParts(payload.design_parts);
				if (Array.isArray(parts)) {
					this.braceletItems = parts;
				}
				// 加载外部设计时重置撤销/重做历史
				this._undoStack = [];
				this._redoStack = [];
				this.canUndo = false;
				this.canRedo = false;
				this.braceletRotation = 0;
				// switchTab 恢复时确保画布已就绪再绘制
				this.$nextTick(() => {
					setTimeout(() => this.requestFullRedraw(), 16);
				});
			},

			// 解析设计明细，兼容字符串/HTML 实体，并统一使用 sku_id
			normalizeDesignParts(raw) {
				if (!raw) return [];
				if (Array.isArray(raw)) return raw.map((item) => this.normalizePartSkuId(item));
				let text = String(raw);
				if (!text.trim()) return [];
				// 处理 &quot; 等实体
				text = text.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
				try {
					let parsed = JSON.parse(text);
					// 如果解析结果是字符串，再尝试二次解析
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
				const skuId = item.sku_id || item.id || '';
				const sizeLabel = item.sizeLabel || item.size || '';
				// 优先从 item.size 取数字：吊坠/配件的 sizeLabel 常为 '15*12mm' 规格，
				// parseSizeNumber 会错误地取到 15 而非真正的穿孔宽度，覆盖 item.size。
				const sizeNum = this.parseSizeNumber(item.size) || this.parseSizeNumber(sizeLabel);
				const sizeText = sizeNum ? String(sizeNum) : String(item.size || '');
				const fallback = this.fallbackImage || this.normalizeStaticAssetPath('/static/beads/兜底图片.png');
				const imageMap = this.normalizeStaticAssetPath(item.imageMap || item.imagePath || '');
				const imagePath = this.normalizeStaticAssetPath(item.imagePath || item.imageMap || '');
				const normalized = {
					...item,
					id: skuId,
					sku_id: skuId,
					size: sizeText,
					sizeLabel: sizeLabel || (sizeText ? `${sizeText}mm` : ''),
					imageMap: imageMap || fallback,
					imagePath: imagePath || fallback,
					imageScale: item.imageScale || this.imageScaleConfig[item.category] || this.imageScaleConfig.default,
					uniqueId: item.uniqueId || (Date.now() + Math.random()),
				};
				// 配件缺失宽高时，用尺寸兜底，避免缩放异常
				if (normalized.isAccessory) {
					const safeSize = sizeText || '0';
					if (!normalized.width) normalized.width = safeSize;
					if (!normalized.height) normalized.height = safeSize;
				}
				return normalized;
			},
			parseSizeNumber(value) {
				const match = String(value || '').match(/(\d+(\.\d+)?)/);
				return match ? Number(match[1]) : 0;
			},

			// 根据 work_id 拉取作品详情并回填
			fetchWorkDetail(workId) {
				if (!workId) return;
				const params = Object.assign({}, this.getCommonParams(), { work_id: workId });
				this._request({
					url: app.globalData.get_request_url('detail', 'braceletworks'),
					method: 'GET',
					data: params,
					withCredentials: true,
					success: (res) => {
						if (res.data && res.data.code === 0 && res.data.data) {
							this.applyIncomingWork(res.data.data);
						} else {
							console.warn('fetchWorkDetail fail', res.data);
						}
					},
					fail: (err) => console.error('fetchWorkDetail error', err),
				});
			},

		// 切换一级菜单
		selectLevel1(level) {
			this.selectedLevel1 = level;

			// 切换一级分类时，重置为按材质分组
			this.groupBy = 'material';
			this.materialDisplayLimit = 40;
			this.scrollToId = '';
			this._sectionTops = [];
			this.scrollWithAnimation = false;

			// 使用 $nextTick 确保 level2Options 已更新
			this.$nextTick(() => {
				// 自动选择默认的二级选项（按材质时默认选"水晶"）
				this.selectedLevel2 = this.getDefaultLevel2Option('material');

				// 再次使用 $nextTick 确保 level3Options 已更新
				this.$nextTick(() => {
					if (this.level3Options.length > 0) {
						this.selectedLevel3 = this.level3Options[0];
					} else {
						this.selectedLevel3 = '';
					}
					this.scrollWithAnimation = true;
					this.cacheSectionPositions();
				});
			});

			this.searchKeyword = '';
		},
				
		// 点击二级标签 → 滚动定位到对应 L2 section
		scrollToLevel2(l2Name, l2Idx) {
			this.ensureLevel2Rendered(l2Idx);
			this._isClickScrolling = true;
			this.scrollWithAnimation = true;
			this.scrollToId = '';
			this.$nextTick(() => {
				this.scrollToId = 'l2-sec-' + l2Idx;
				this.selectedLevel2 = l2Name;
				if (this.groupBy === 'material') {
					const l3opts = this.getLevel3OptionsForType(l2Name);
					this.selectedLevel3 = l3opts.length > 0 ? l3opts[0] : '';
				}
				setTimeout(() => { this._isClickScrolling = false; }, 600);
			});
		},

		// 点击三级标签 → 滚动定位到对应 L3 section
		scrollToLevel3(l2Name, cat, l2Idx, l3Idx) {
			this.ensureLevel3Rendered(l2Idx, l3Idx);
			this._isClickScrolling = true;
			this.scrollWithAnimation = true;
			this.scrollToId = '';
			this.$nextTick(() => {
				this.scrollToId = 'l3-sec-' + l2Idx + '-' + l3Idx;
				this.selectedLevel2 = l2Name;
				this.selectedLevel3 = cat;
				setTimeout(() => { this._isClickScrolling = false; }, 600);
			});
		},
				
		selectCategory(cat) {
			this.selectedCategory = cat;
		},

		// 获取指定 L2 type 下的 L3 选项列表
		getLevel3OptionsForType(type) {
			if (this.groupBy !== 'material') return [];
			const typeData = this.menuData[this.selectedLevel1]?.[type];
			return Object.keys(typeData || {});
		},

		// 确保目标 L2 section 的 items 已渲染（懒加载场景）
		ensureLevel2Rendered(targetL2Idx) {
			const level1 = this.selectedLevel1;
			const l2List = this.level2Options;
			let needed = 0;
			for (let i = 0; i <= targetL2Idx && i < l2List.length; i++) {
				const l2Name = l2List[i];
				if (this.groupBy === 'material') {
					const l2Data = this.menuData[level1]?.[l2Name] || {};
					Object.values(l2Data).forEach(arr => { needed += arr.length; });
				} else {
					needed += this._getItemsForLevel2Value(l2Name).length;
				}
			}
			if (this.materialDisplayLimit < needed) {
				this.materialDisplayLimit = needed + 10;
			}
		},

		// 确保目标 L3 section 的 items 已渲染
		ensureLevel3Rendered(targetL2Idx, targetL3Idx) {
			const level1 = this.selectedLevel1;
			const l2List = this.level2Options;
			let needed = 0;
			for (let i = 0; i < l2List.length; i++) {
				if (this.groupBy === 'material') {
					const l2Data = this.menuData[level1]?.[l2List[i]] || {};
					const cats = Object.keys(l2Data);
					for (let j = 0; j < cats.length; j++) {
						needed += (l2Data[cats[j]] || []).length;
						if (i === targetL2Idx && j === targetL3Idx) {
							if (this.materialDisplayLimit < needed) this.materialDisplayLimit = needed + 10;
							return;
						}
					}
				} else {
					needed += this._getItemsForLevel2Value(l2List[i]).length;
					if (i === targetL2Idx) {
						if (this.materialDisplayLimit < needed) this.materialDisplayLimit = needed + 10;
						return;
					}
				}
			}
		},

		// 材质列表滚动事件 → 检测当前 section，更新 L2/L3 选中
		onMaterialScroll(e) {
			if (this._isClickScrolling) return;
			if (this._scrollDebounce) clearTimeout(this._scrollDebounce);
			this._scrollDebounce = setTimeout(() => {
				this.detectActiveSection(e.detail.scrollTop);
			}, 80);
		},

		// 根据 scrollTop 确定当前可见的 L2 和 L3 section
		detectActiveSection(scrollTop) {
			if (!this._sectionTops || this._sectionTops.length === 0) {
				this.cacheSectionPositions();
				return;
			}
			// 当 section 滑到可见区域中下部（约 40% 处）即切换标签
			const threshold = (this._scrollViewHeight || 0) * 0.4;
			let newL2 = null;
			let newL3 = null;
			for (const sec of this._sectionTops) {
				if (scrollTop >= sec.offset - threshold) {
					if (sec.type === 'l2-header') {
						newL2 = sec.l2Name;
						newL3 = null;
					} else if (sec.type === 'l3-section') {
						newL2 = sec.l2Name;
						newL3 = sec.label;
					} else if (sec.type === 'flat-section') {
						newL2 = sec.l2Name;
					}
				}
			}
			if (newL2 && this.selectedLevel2 !== newL2) {
				this.selectedLevel2 = newL2;
				const l2Idx = this.level2Options.indexOf(newL2);
				if (l2Idx !== -1) {
					this.l2ScrollIntoView = '';
					this.$nextTick(() => {
						this.$nextTick(() => { this.l2ScrollIntoView = 'l2tab-' + l2Idx; });
					});
				}
			}
			if (newL3 !== null && this.selectedLevel3 !== newL3) {
				this.selectedLevel3 = newL3;
			}
		},

		// 用 SelectorQuery 查询所有 section 的位置并缓存
		cacheSectionPositions() {
			const gen = ++this._cacheGeneration;
			this.$nextTick(() => {
				setTimeout(() => {
					if (gen !== this._cacheGeneration) return;
					const query = uni.createSelectorQuery().in(this);
					query.select('.material-list').boundingClientRect();
					query.selectAll('.l2-section-header, .material-section-group').boundingClientRect();
					query.exec(res => {
						if (gen !== this._cacheGeneration) return;
						if (!res || !res[0] || !res[1] || res[1].length === 0) return;
						this._scrollViewHeight = res[0].height || 0;
						const firstTop = res[1][0].top;
						const rendered = this.allSections;
						this._sectionTops = res[1].map((r, i) => {
							const sec = rendered[i];
							if (!sec) return null;
							return {
								type: sec.type,
								l2Name: sec.type === 'l2-header' ? sec.label : sec.l2Name,
								label: sec.label,
								offset: r.top - firstTop
							};
						}).filter(Boolean);
					});
				}, 200);
			});
		},

		// scroll-view 触底加载更多
		loadMoreMaterials() {
			if (!this.hasMoreMaterials) return;
			this.materialDisplayLimit += 40;
			this.$nextTick(() => this.cacheSectionPositions());
		},

		/**
		 * 获取一级分类下的所有物品（扁平化）
		 */
		getAllItemsForLevel1(level1) {
			const items = [];
			const level1Data = this.menuData[level1] || {};

			Object.keys(level1Data).forEach(type => {
				Object.keys(level1Data[type] || {}).forEach(category => {
					const categoryItems = level1Data[type][category] || [];
					items.push(...categoryItems);
				});
			});

			return items;
		},

		/**
		 * 解析标签字符串，支持多种分隔符（逗号、中文逗号、顿号、竖线、分号）
		 */
		parseTags(value) {
			if (!value) return [];
			return String(value)
				.replace(/^"+|"+$/g, '')
				.replace(/[，、｜|;；]/g, ',')
				.split(',')
				.map(v => v.trim().replace(/^"+|"+$/g, ''))
				.filter(Boolean);
		},

		/**
		 * 获取指定二级分类值对应的物品列表（参数化版本）
		 */
		_getItemsForLevel2Value(level2Value) {
			const level1 = this.selectedLevel1;
			const allItems = this.getAllItemsForLevel1(level1);

			if (this.groupBy === 'color') {
				return allItems.filter(item => item.colorTag === level2Value);
			}
			if (this.groupBy === 'size') {
				const sizeValue = level2Value.replace('mm', '');
				return allItems.filter(item => item.size === sizeValue);
			}
			if (this.groupBy === 'price') {
				return allItems.filter(item => {
					const price = item.priceNum || 0;
					if (level2Value === '0-20') return price >= 0 && price < 20;
					if (level2Value === '20-50') return price >= 20 && price < 50;
					if (level2Value === '50-100') return price >= 50 && price < 100;
					if (level2Value === '100以上') return price >= 100;
					return false;
				});
			}
			if (this.groupBy === 'wish') {
				return allItems.filter(item => {
					if (!item.wishTag) return false;
					return this.parseTags(item.wishTag).includes(level2Value);
				});
			}
			if (this.groupBy === 'style') {
				return allItems.filter(item => {
					if (!item.styleTag) return false;
					return this.parseTags(item.styleTag).includes(level2Value);
				});
			}
			return [];
		},

		/**
		 * 获取当前选中二级分类对应的物品列表
		 */
		getItemsForLevel2() {
			if (!this.selectedLevel2) return [];
			if (this.groupBy === 'material') return [];
			return this._getItemsForLevel2Value(this.selectedLevel2);
		},

		/**
		 * 切换分组维度
		 */
		selectGroupBy(groupType) {
			if (this.groupBy === groupType) return;

			this.groupBy = groupType;
			this.materialDisplayLimit = 40;
			this.scrollToId = '';
			this._sectionTops = [];
			this.scrollWithAnimation = false;

			this.$nextTick(() => {
				this.selectedLevel2 = this.level2Options.length > 0 ? this.level2Options[0] : '';
				this.selectedLevel3 = '';

				if (groupType === 'material' && this.level3Options.length > 0) {
					this.selectedLevel3 = this.level3Options[0];
				}
				this.$nextTick(() => {
					this.scrollWithAnimation = true;
					this.cacheSectionPositions();
				});
			});
		},

		/**
		 * 获取指定分组类型的默认二级选项
		 */
		getDefaultLevel2Option(groupType) {
			const options = this.level2Options;
			if (options.length === 0) return '';

			// 定义每种分组方式的默认选项
			const defaultOptions = {
				'material': '水晶',
				'color': '白',
				'size': '10mm',
				'price': '0-20',
				'wish': '',
				'style': '',
			};

			const defaultOption = defaultOptions[groupType] || '';

			// 如果列表中包含默认选项，返回它；否则返回第一个
			return options.includes(defaultOption) ? defaultOption : options[0];
		},

		// 展开搜索框
		expandSearch() {
			this.searchExpanded = true;
		},

		// 收起搜索框
		collapseSearch() {
			this.searchExpanded = false;
			this.searchKeyword = '';
		},

		// 清空搜索
		clearSearch() {
			this.searchKeyword = '';
		},

		// 更新搜索关键词
		handleSearch(e) {
			const keyword = e.detail.value;
			this.searchKeyword = keyword;
			
			// 如果有搜索关键词，尝试找到对应的分类并自动切换
			if (keyword.trim()) {
				this.autoSwitchToMatchingCategory(keyword);
			}
		},
		
		// 自动切换到匹配的类别
		autoSwitchToMatchingCategory(keyword) {
			const searchKey = keyword.trim().toLowerCase();
			let found = false;
			
			// 优先在珠子中搜索
			for (const level2 in this.menuData['珠子']) {
				for (const level3 in this.menuData['珠子'][level2]) {
					const materials = this.menuData['珠子'][level2][level3] || [];
					const match = materials.find(item => 
					  item.name.toLowerCase().includes(searchKey)
					);
				  
					if (match) {
						this.selectedLevel1 = '珠子';
						this.selectedLevel2 = level2;
						this.selectedLevel3 = level3;
						found = true;
						break;
					}
				}
				if (found) break;
			}
			
			// 如果在珠子中没找到，在配件中搜索
			if (!found) {
				for (const level2 in this.menuData['配件']) {
					for (const level3 in this.menuData['配件'][level2]) {
						const materials = this.menuData['配件'][level2][level3] || [];
						const match = materials.find(item => 
						  item.name.toLowerCase().includes(searchKey)
						);
						
						if (match) {
							this.selectedLevel1 = '配件';
							this.selectedLevel2 = level2;
							this.selectedLevel3 = level3;
							found = true;
							break;
						}
					}
					if (found) break;
				}
			}
		},
		
		//触摸开始
		handleTouchStart(e) {
			// 去重：canvas bindtouchstart 和 wrapper catchtouchstart 可能双触发
			// 京东小程序中两次事件间隔可能超过50ms，增大阈值到350ms
			const ts = e.timeStamp || Date.now();
			if (this._lastTouchStartTs && Math.abs(ts - this._lastTouchStartTs) < 350) return;
			this._lastTouchStartTs = ts;

			const touch = e.touches[0];

			// 检测坐标类型：
			// - 微信小程序：提供 clientX/pageX（视口坐标）
			// - 京东小程序真机 canvas 事件：只提供 touch.x/y（canvas 本地坐标，已是绘图坐标系）
			// - 淘宝/支付宝小程序：
			//   - 旧版 Canvas（CanvasTouch）：x/y 是相对于 Canvas 左上角的坐标
			//   - 同层渲染 Canvas：x/y 是相对于屏幕左上角的坐标
			const hasClientCoords = typeof touch.clientX === 'number';
			const hasPageCoords = typeof touch.pageX === 'number';
			const hasXY = typeof touch.x === 'number';

			let touchX, touchY;
			let coordType = 'unknown';

			// #ifdef MP-ALIPAY
			// 淘宝/支付宝小程序：优先使用 x/y 坐标（Canvas 本地坐标）
			// 因为旧版 Canvas 的 CanvasTouch 返回的 x/y 是相对于 Canvas 左上角的坐标
			if (hasXY) {
				touchX = touch.x;
				touchY = touch.y;
				coordType = 'xy';
			} else if (hasClientCoords) {
				touchX = touch.clientX;
				touchY = touch.clientY;
				coordType = 'client';
			} else if (hasPageCoords) {
				touchX = touch.pageX;
				touchY = touch.pageY;
				coordType = 'page';
			} else {
				console.error('[bindinding] 无法获取触摸坐标:', touch);
				return;
			}
			// #endif
			// #ifndef MP-ALIPAY
			// 其他平台：优先使用 clientX/pageX（视口坐标）
			if (hasClientCoords) {
				touchX = touch.clientX;
				touchY = touch.clientY;
				coordType = 'client';
			} else if (hasPageCoords) {
				touchX = touch.pageX;
				touchY = touch.pageY;
				coordType = 'page';
			} else if (hasXY) {
				touchX = touch.x;
				touchY = touch.y;
				coordType = 'xy';
			} else {
				console.error('[bindinding] 无法获取触摸坐标:', touch);
				return;
			}
			// #endif

			// 判断是否为视口坐标（需要减去 canvas 偏移）
			// xy 坐标在淘宝小程序中可能是 Canvas 本地坐标（旧版）或屏幕坐标（同层渲染）
			const hasViewportCoords = coordType === 'client' || coordType === 'page';

			//  使用缓存的 canvas 位置，避免异步查询
			if(!this.cachedCanvasOffset) {
				console.error('❌ Canvas offset 未缓存，重新查询');
				this._cacheCanvasOffset();
				// 等待重试机制完成后再处理触摸，最多等待 600ms (5次重试 × 100ms)
				const checkAndProcess = (attempts = 0) => {
					if (this.cachedCanvasOffset) {
						this.processTouchStart(touchX, touchY, hasViewportCoords, coordType);
					} else if (attempts < 6) {
						setTimeout(() => checkAndProcess(attempts + 1), 100);
					}
				};
				setTimeout(() => checkAndProcess(), 100);
			} else {
				this.processTouchStart(touchX, touchY, hasViewportCoords, coordType);
			}
		},
		
		processTouchStart(touchX, touchY, hasViewportCoords, coordType) {
		    const offset = this.cachedCanvasOffset;
		    // 坐标转换为 canvas 绘图坐标（0~CANVAS_W, 0~CANVAS_H）
		    let x, y;
		    const scaleX = this.CANVAS_W / offset.width;
		    const scaleY = this.CANVAS_H / offset.height;
		    if (this._isLegacyCanvas) {
		        // #ifdef MP-ALIPAY
		        // 淘宝 type="2d" canvas 同层渲染下 touch.x/y 是屏幕坐标，
		        // 需要视口→canvas 坐标转换
		        x = (touchX - offset.left) * scaleX;
		        y = (touchY - offset.top) * scaleY;
		        // #endif
		        // #ifndef MP-ALIPAY
		        if (hasViewportCoords) {
		            // 视口坐标：减去 canvas 偏移，再缩放到绘图坐标系
		            x = (touchX - offset.left) * scaleX;
		            y = (touchY - offset.top) * scaleY;
		        } else {
		            // canvas 本地坐标（JD 真机）：直接使用，JD 返回的已经是绘图坐标系
		            x = touchX;
		            y = touchY;
		        }
		        // #endif
		    } else {
		        // Canvas 2D (微信)：视口坐标 → 逻辑坐标系
		        x = (touchX - offset.left) * scaleX;
		        y = (touchY - offset.top) * scaleY;
		    }

		    // 优先检测画布内按钮点击
		    if (this._handleCanvasButtonTap(x, y)) return;

		    const clickedIndex = this.detectBeadClick(x, y);
		    if (clickedIndex !== -1) {
		        this.dragging = true;
		        this.draggedIndex = clickedIndex;
		        this.draggedPosition = { x, y };

		        // 取消进行中的平滑过渡和飞入动画
		        this._transitionFrom = null;
		        this._flyInIndex = -1;
		        this._transitionTarget = null;

		        // 缓存当前布局和 Image 对象，拖拽期间不再重算
		        this._dragCache = {
		            positions: this.beadPositions,
		            imageObjects: this.beadPositions.map((pos) => {
		                const raw = (pos.item && (pos.item.imageMap || pos.item.imagePath)) || this.fallbackImage;
		                const key = this.normalizeCanvasImageSrc(raw) || raw;
		                return this._imageObjectCache[key] || null;
		            }),
		        };
		    }
		},
		
		//触摸移动 — 不节流，每次都更新位置；draw lock 自然限频
		handleTouchMove(e) {
			if (!this.dragging) return;
			// 去重：防止 canvas 和 wrapper 双触发
			const ts = e.timeStamp || Date.now();
			if (this._lastTouchMoveTs && Math.abs(ts - this._lastTouchMoveTs) < 10) return;
			this._lastTouchMoveTs = ts;

			const touch = e.touches[0];
			const hasClientCoords = typeof touch.clientX === 'number';
			const hasPageCoords = typeof touch.pageX === 'number';
			const hasXY = typeof touch.x === 'number';

			let touchX, touchY;
			let coordType = 'unknown';

			// #ifdef MP-ALIPAY
			// 淘宝/支付宝小程序：优先使用 x/y 坐标（Canvas 本地坐标）
			if (hasXY) {
				touchX = touch.x;
				touchY = touch.y;
				coordType = 'xy';
			} else if (hasClientCoords) {
				touchX = touch.clientX;
				touchY = touch.clientY;
				coordType = 'client';
			} else if (hasPageCoords) {
				touchX = touch.pageX;
				touchY = touch.pageY;
				coordType = 'page';
			} else {
				return;
			}
			// #endif
			// #ifndef MP-ALIPAY
			// 其他平台：优先使用 clientX/pageX（视口坐标）
			if (hasClientCoords) {
				touchX = touch.clientX;
				touchY = touch.clientY;
				coordType = 'client';
			} else if (hasPageCoords) {
				touchX = touch.pageX;
				touchY = touch.pageY;
				coordType = 'page';
			} else if (hasXY) {
				touchX = touch.x;
				touchY = touch.y;
				coordType = 'xy';
			} else {
				return;
			}
			// #endif

			if (this.cachedCanvasOffset) {
				const offset = this.cachedCanvasOffset;
				const scaleX = this.CANVAS_W / offset.width;
				const scaleY = this.CANVAS_H / offset.height;
				let x, y;

				if (this._isLegacyCanvas) {
					// #ifdef MP-ALIPAY
					// 淘宝 type="2d" canvas 同层渲染下 touch.x/y 是屏幕坐标，
					// 需要视口→canvas 坐标转换（与 processTouchStart 一致）
					x = (touchX - offset.left) * scaleX;
					y = (touchY - offset.top) * scaleY;
					// #endif
					// #ifndef MP-ALIPAY
					if (coordType === 'client' || coordType === 'page') {
						x = touchX - offset.left;
						y = touchY - offset.top;
					} else {
						// JD 真机：直接使用
						x = touchX;
						y = touchY;
					}
					// #endif
				} else {
					// Canvas 2D (微信)
					x = (touchX - offset.left) * scaleX;
					y = (touchY - offset.top) * scaleY;
				}

				// 直接写入非响应式属性，无 Vue setter 开销
				this.draggedPosition.x = x;
				this.draggedPosition.y = y;

				this.currentDragZone = this.detectZone(x, y);
				this.swapTargetIndex = -1;
				this.scheduleDragFrame(); // rAF 自然合并，总是绘制最新位置
			}
		},
		
		//触摸结束
		handleTouchEnd(e) {
			if (!this.dragging) return;
			this._dragCache = null; // 清除拖拽缓存
			
			// 获取当前区域
			const zone = this.currentDragZone || 2; // 默认区域2
			
			if (zone === 3) {
				// 区域3：删除珠子
				this.pushUndoState();
				const deletedItem = this.braceletItems[this.draggedIndex];
				this.braceletItems.splice(this.draggedIndex, 1);
				
				uni.showToast({
				    title: `已删除 ${deletedItem.name}`,
				    icon: 'none',
				    duration: 1500
				});
				
			} else if (zone === 1) {
				//区域1：珠子回到原位（不做任何操作）
				uni.showToast({
				    title: '已取消',
				    icon: 'none',
				    duration: 1000
				});
				
			} else if (zone === 2) {
				const centerX = this.CANVAS_W / 2;
				const centerY = this.CANVAS_H / 2;
				const dragX = this.draggedPosition.x;
				const dragY = this.draggedPosition.y;
				
				// 计算拖动点相对于圆心的角度
				const dragAngle = Math.atan2(dragY - centerY, dragX - centerX);
				// 标准化到 [0, 2π]
				let normalizedDragAngle = dragAngle < 0 ? dragAngle + 2 * Math.PI : dragAngle;
				// 获取所有珠子的角度信息（排除被拖动的珠子）
				const beadAngles = [];
				
				for (let i = 0; i < this.beadPositions.length; i++) {
					if (i === this.draggedIndex) continue;
					
					const pos = this.beadPositions[i];
					const angle = Math.atan2(pos.y - centerY, pos.x - centerX);
					const normalized = angle < 0 ? angle + 2 * Math.PI : angle;
					
					beadAngles.push({
						index: i,
						angle: normalized,
						distance: Math.sqrt(
							Math.pow(dragX - pos.x, 2) + 
							Math.pow(dragY - pos.y, 2)
						)
					});
				}
				if (beadAngles.length === 0) {
					// 只有一个珠子（被拖动的珠子），不需要重新排序
					uni.showToast({
						title: '已取消',
						icon: 'none',
						duration: 1000
					});
				} else {
					// 按角度排序
					beadAngles.sort((a, b) => a.angle - b.angle);
					            
		            // 查找拖动点应该插入的位置
		            let insertIndex = -1;
					            
					// 方法1：找到距离拖动点最近的角度
		            let minAngleDiff = Infinity;
		            let nearestBeadIndex = -1;
					            
		            for (const bead of beadAngles) {
		                let angleDiff = Math.abs(bead.angle - normalizedDragAngle);
		                // 处理环形边界
		                if (angleDiff > Math.PI) {
		                    angleDiff = 2 * Math.PI - angleDiff;
		                }
					                
		                if (angleDiff < minAngleDiff) {
		                    minAngleDiff = angleDiff;
		                    nearestBeadIndex = bead.index;
		                }
		            }
					            
		            if (nearestBeadIndex !== -1) {
		                // 找到最近的珠子后，判断拖动点相对于这个珠子的位置
		                const nearestBead = beadAngles.find(b => b.index === nearestBeadIndex);
				                
		                // 方法2：判断拖动点应该插入到哪个珠子的前面
		                // 将拖动角度和所有珠子的角度放在同一个数组中排序
					    const allAngles = beadAngles.map(b => ({
		                    index: b.index,
		                    angle: b.angle,
		                    type: 'bead'
		                }));
					                
		                // 添加拖动点的角度
		                allAngles.push({
	                    index: -1, // 表示拖动点
	                    angle: normalizedDragAngle,
	                    type: 'drag'
		                });
					                
					     // 按角度排序
					    allAngles.sort((a, b) => a.angle - b.angle);
					                
					    // 找到拖动点在排序后的位置
					    const dragPosition = allAngles.findIndex(item => item.type === 'drag');
					                
					    if (dragPosition !== -1) {
					        // 计算应该插入到哪个珠子之前
					        // 在拖动点之后的下一个珠子就是插入位置
					        let nextBeadPosition = (dragPosition + 1) % allAngles.length;
					                    
					        // 循环查找下一个真正的珠子（跳过拖动点自己）
				            while (allAngles[nextBeadPosition].type !== 'bead') {
		                        nextBeadPosition = (nextBeadPosition + 1) % allAngles.length;
					        }
					                    
			                const insertBeforeBead = allAngles[nextBeadPosition];
		                    insertIndex = insertBeforeBead.index;
					                    
					        // 确保insertIndex是有效的索引
					        if (insertIndex < 0 || insertIndex >= this.braceletItems.length) {
					            insertIndex = this.braceletItems.length; // 插入到最后
					        }
					    }
					}
					            
					if (insertIndex !== -1 && insertIndex !== this.draggedIndex) {
					    // 执行插入操作
						this.pushUndoState();
						const draggedItem = this.braceletItems[this.draggedIndex];
						
						// 1. 从原位置移除
						this.braceletItems.splice(this.draggedIndex, 1);
						
						// 2. 计算插入位置
			            // 如果原位置在目标位置之前，移除后目标索引需要-1
		                let adjustedInsertIndex = insertIndex;
					    if (this.draggedIndex < insertIndex) {
		                    adjustedInsertIndex--;
					    }
					                
					    // 确保索引在有效范围内
					    if (adjustedInsertIndex < 0) {
			                adjustedInsertIndex = 0;
		                } else if (adjustedInsertIndex > this.braceletItems.length) {
		                    adjustedInsertIndex = this.braceletItems.length;
						}
						
						// 3. 插入到新位置
		                this.braceletItems.splice(adjustedInsertIndex, 0, draggedItem);
						
						uni.showToast({
		                    title: `已移动到位置 ${adjustedInsertIndex + 1}`,
							icon: 'none',
							duration: 1000
						});
					} else {
						// 没有找到合适的插入位置，或者位置没变化
						uni.showToast({
						    title: '已取消',
						    icon: 'none',
						    duration: 1000
						});
					}
				}
				
			}
			
			// 重置拖动状态
			this.dragging = false;
			this.draggedIndex = -1;
			this.swapTargetIndex = -1;
			this.currentDragZone = null;
			this.requestFullRedraw();
		},
		
		/**
		* 检测拖动点在哪个区域
		* @param {number} x - 拖动点的 x 坐标
		* @param {number} y - 拖动点的 y 坐标
		* @returns {1|2|3} - 返回区域编号
		*/
	    detectZone(x, y) {
			const centerX = this.CANVAS_W / 2;
			const centerY = this.CANVAS_H / 2;
        
			// 计算拖动点到圆心的距离
			const distance = Math.sqrt(
				Math.pow(x - centerX, 2) + 
				Math.pow(y - centerY, 2)
			);
        
			const zones = this.zoneRadii;
        
			if (distance < zones.zone1Max) {
				return 1; // 内圆
			} else if (distance <= zones.zone2Max) {
				return 2; // 圆环
			} else {
				return 3; // 外圆
			}
		},
		
		detectBeadClick(clickX, clickY) {
			//  反向遍历，优先检测后绘制的珠子（避免被覆盖的珠子被误检）
			for (let i = this.beadPositions.length - 1; i >= 0; i--) {
			        const pos = this.beadPositions[i];
			        const distance = Math.sqrt(
			            Math.pow(clickX - pos.x, 2) + 
			            Math.pow(clickY - pos.y, 2)
			        );
			        
			        const hitRadius = pos.displayRadius + 10; // 增加10像素的触摸容错
			        
			        if (distance <= hitRadius) {
			            return i;
			        }
			    }
			return -1;
		},
		
		/* 清除手串 */
		handleClear() {
			if (this.braceletItems.length === 0) return;

			const doClear = () => {
				this._transitionFrom = null;
				this._transitionTarget = null;
				this._flyInIndex = -1;
				this.pushUndoState();
				this.braceletItems = [];
				this.beadPositions = [];
				this.braceletRotation = 0;
				this.imageRetryMap = {};
				this._dragCache = null;
				this._imageObjectCache = {};
				this._imageLoadingMap = {};
				this.$nextTick(() => this.requestFullRedraw());
				uni.showToast({ title: '已清空', icon: 'success' });
			};
			// #ifdef MP-ALIPAY
			// 淘宝 C2B 真机不支持 uni.showModal（API 不存在），用 my.confirm 替代
			if (typeof my !== 'undefined' && typeof my.confirm === 'function') {
				my.confirm({
					title: '确认清空',
					content: '确定要清空所有珠子吗?',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					success: (res) => { if (res.confirm) doClear(); },
				});
			} else {
				doClear(); // fallback: 直接清空
			}
			return;
			// #endif
			// #ifndef MP-ALIPAY
			uni.showModal({
				title: '确认清空',
				content: '确定要清空所有珠子吗?',
				success: (res) => { if (res.confirm) doClear(); },
			});
			// #endif
		},

		/* 撤销/重做 —— 快照当前 braceletItems */
		pushUndoState() {
			if (this._isUndoRedoing) return;
			const snapshot = this.braceletItems.map(item => ({ ...item }));
			this._undoStack.push(snapshot);
			this._redoStack = [];
			// 限制栈深度，防止内存膨胀（真机内存有限，20 足够）
			if (this._undoStack.length > 20) {
				this._undoStack.shift();
			}
			this.canUndo = this._undoStack.length > 0;
			this.canRedo = false;
		},

		undo() {
			if (this._undoStack.length === 0) return;
			this._transitionFrom = null;
			this._transitionTarget = null;
			this._flyInIndex = -1;

			const currentState = this.braceletItems.map(item => ({ ...item }));
			this._redoStack.push(currentState);
			try {
				this._isUndoRedoing = true;
				this.braceletItems = this._undoStack.pop();
			} finally {
				this._isUndoRedoing = false;
			}
			this.canUndo = this._undoStack.length > 0;
			this.canRedo = this._redoStack.length > 0;
			this.$nextTick(() => this.requestFullRedraw());
		},

		redo() {
			if (this._redoStack.length === 0) return;
			this._transitionFrom = null;
			this._transitionTarget = null;
			this._flyInIndex = -1;

			const currentState = this.braceletItems.map(item => ({ ...item }));
			this._undoStack.push(currentState);
			try {
				this._isUndoRedoing = true;
				this.braceletItems = this._redoStack.pop();
			} finally {
				this._isUndoRedoing = false;
			}
			this.canUndo = this._undoStack.length > 0;
			this.canRedo = this._redoStack.length > 0;
			this.$nextTick(() => this.requestFullRedraw());
		},

		/* 旋转手串（direction: 1 顺时针, -1 逆时针，每次 15°） */
		rotateBracelet(direction) {
			this.braceletRotation += (Math.PI / 12) * direction;
			// 归一化到 [0, 2π) 防止浮点数无限增长
			const TWO_PI = 2 * Math.PI;
			this.braceletRotation = ((this.braceletRotation % TWO_PI) + TWO_PI) % TWO_PI;
			this.requestFullRedraw();
		},

		/* 完成设计 */
		handleComplete() {
			if (this.braceletItems.length === 0) {
				uni.showToast({ title: '请先添加珠子', icon: 'none' });
				return;
			}
			// #ifndef MP-ALIPAY
			if (!this.isUserLoggedIn()) {
				// 未登录时先引导登录，并缓存当前设计
				try {
					uni.setStorageSync('pending_complete_action', { type: 'complete_bracelet', ts: Date.now() });
					uni.setStorageSync('bracelet_restore', {
						work_id: 'local_' + Date.now(),
						design_title: '我的手串',
						design_desc: `珠子 ${this.beadCount} 颗，估计 ¥${this.totalPrice}`,
						design_price: this.totalPrice,
						design_parts: this.braceletItems,
					});
				} catch (e) {}
				this.navigateToLogin();
				return;
			}
			// #endif
			if (this.isProcessingCart) return;
			this.isProcessingCart = true;
			// 烟花将在 canvas 导出完成后显示（见 doExport），避免 native canvas 遮挡

			const finishWork = () => {
				let navigated = false;
				// 平台判断
				let platform = '';
				try {
					const sys = uni.getSystemInfoSync ? uni.getSystemInfoSync() : {};
					platform = (sys.platform || '').toLowerCase();
				} catch (e) {
					platform = '';
				}
				const safeGoNext = (imagePath) => {
					if (navigated) return;
					navigated = true;
					// showFireworks 在 doExport 中设置（canvas 导出后才显示烟花）

					const proceed = (img) => {
						const workData = {
							work_id: 'local_' + Date.now(),
							design_image: img,
							image_url: img,
							design_image_url: img,
							design_title: '我的手串',
							design_desc: `珠子 ${this.beadCount} 颗，估计 ¥${this.totalPrice}`,
							design_price: this.totalPrice,
							// 将单价一并传递，兼容 priceNum/price 字段
							design_parts: this.braceletItems.map(item => ({
								...item,
								// 使用 sku_id 作为组件标识
								id: item.sku_id,
								sku_id: item.sku_id,
								price: item.priceNum ?? item.price ?? 0,
								priceNum: item.priceNum ?? item.price ?? 0,
								qty: item.qty || 1,
							}))
						};
						// #ifdef MP-JD
						// 附带京东 C2M 参数到 workData
						if (this._jdC2mParams) {
							workData.jd_c2m_params = this._jdC2mParams;
						} else {
							try {
								const raw = uni.getStorageSync('jd_c2m_params');
								if (raw) workData.jd_c2m_params = JSON.parse(raw);
							} catch (e) {}
						}
						// #endif

						// 检查是否是 blob URL（京东小程序返回）
						const isBlobUrl = img && img.startsWith('blob:');

						const doNavigate = () => {
							// 兜底：将 workData 存入 storage，防止 eventChannel 不可用（京东等平台）
							try {
								uni.setStorageSync('work_detail_data', JSON.stringify(workData));
							} catch (e) {
								console.warn('存储 workData 到 storage 失败', e);
							}
							uni.navigateTo({
								url: '/pages/bracelet-sub/work-detail',
								success: (navRes) => {
									if (navRes.eventChannel) {
										navRes.eventChannel.emit('work-data', workData);
									}
									this.showFireworks = false;
									this.isProcessingCart = false;
								},
								fail: (err) => {
									console.error('navigateTo work-detail 失败', err);
									this.showFireworks = false;
									this.isProcessingCart = false;
									uni.showToast({ title: '跳转失败', icon: 'none' });
								}
							});
						};

						if (isBlobUrl) {
							// blob URL 无法直接显示，等待服务端返回图片 URL 后再跳转
							this.saveWorkRemote(workData, true).then((result) => {
								if (result && typeof result === 'object') {
									// 服务端返回了完整数据，包含 image_url
									if (result.image_url) {
										workData.image_url = result.image_url;
										workData.design_image = result.image_url;
										workData.design_image_url = result.image_url;
									}
									if (result.work_id) {
										workData.work_id = result.work_id;
									}
								} else if (result) {
									// 只返回了 work_id
									workData.work_id = result;
								}
								doNavigate();
							}).catch(() => {
								// 即使上传失败也跳转（图片可能显示不了）
								doNavigate();
							});
						} else {
							// 等待 saveWorkRemote 完成并更新 image_url，同时保持烟花最小展示时间
							const minDelay = new Promise(r => setTimeout(r, 1500));
							// 1.5s 后如果还没完成，显示保存进度提示
							const progressTimer = setTimeout(() => {
								this.savingProgress = '正在保存设计图…';
							}, 1500);
							const saveResult = this.saveWorkRemote(workData, true).then((result) => {
								if (result && typeof result === 'object') {
									if (result.image_url) {
										workData.image_url = result.image_url;
										workData.design_image = result.image_url;
										workData.design_image_url = result.image_url;
									}
									if (result.work_id) {
										workData.work_id = result.work_id;
									}
								}
							}).catch(() => {});
							// 15秒兜底：即使保存未完成也跳转，防止页面永久卡住
							const maxWait = new Promise(r => setTimeout(r, 15000));
							Promise.race([
								Promise.all([minDelay, saveResult]),
								maxWait
							]).then(() => {
								clearTimeout(progressTimer);
								this.savingProgress = '';
								doNavigate();
							});
						}
					};

					if (imagePath) {
						proceed(imagePath);
					} else {
						// 没拿到文件路径，尝试直接获取 canvas base64
						this.captureCanvasBase64().then((b64) => {
							proceed(b64 || '');
						}).catch(() => {
							proceed('');
						});
					}
				};
				
				// 若 canvasToTempFilePath 失败或超时，通过 canvasGetImageData 直接读取像素数据
				const captureViaPixelData = () => {
					const cropX = (this.CANVAS_W - this.CANVAS_H) / 2;
					const pxScale = (this._isLegacyCanvas && this._legacyDprScale > 1) ? this._legacyDprScale : 1;
					if (this._isLegacyCanvas) {
						// 旧版 Canvas: canvasGetImageData 读内存缓冲区（不依赖可见性）
						uni.canvasGetImageData({
							canvasId: 'braceletCanvas',
							x: cropX * pxScale, y: 0,
							width: this.CANVAS_H * pxScale, height: this.CANVAS_H * pxScale,
							success: (res) => {
								try {
									const base64 = this._rgbaToBase64Png(res.data, res.width, res.height);
									this.requestFullRedraw();
									goNext(base64);
								} catch (e) {
									console.error('[bindinding] captureViaPixelData _rgbaToBase64Png failed', e);
									this.requestFullRedraw();
									goNext('');
								}
							},
							fail: (err) => {
								console.error('[bindinding] captureViaPixelData canvasGetImageData failed', err);
								this.requestFullRedraw();
								goNext('');
							}
						}, this);
					} else {
						// Canvas 2D: toDataURL 直接读取
						this.captureCanvasBase64().then((b64) => {
							this.requestFullRedraw();
							goNext(b64 || '');
						});
					}
				};

				// 若 canvas 导出长时间无响应，用像素数据兜底（保证有图）
				let exportSettled = false; // 防止 toTempFilePath 延迟回调 + fallbackTimer 双重触发
				const fallbackTimer = setTimeout(() => {
					if (exportSettled) return;
					console.warn('canvasToTempFilePath 超时，尝试 canvasGetImageData 兜底');
					this._isExporting = false;
					captureViaPixelData();
				}, 3000);

				const goNext = (imagePath) => {
					if (exportSettled) return; // 已经处理过，忽略后续回调
					exportSettled = true;
					clearTimeout(fallbackTimer);
					// 图片已捕获，现在安全地显示烟花（v-if 移除 canvas，native 层消失）
					this.showFireworks = true;
					safeGoNext(imagePath);
				};
				
				// H5/PC 或无 canvasToTempFilePath 直接跳过导出，避免未实现 API
				if (
					typeof uni.canvasToTempFilePath !== 'function'
				) {
					this._isExporting = false;
					this.requestFullRedraw();
					goNext('');
				return;
			}
		  
				// 导出正方形图片（裁剪掉两侧按钮区域，仅保留手串）
				// Canvas 2D toTempFilePath 的 x/y/width/height 使用 CSS 逻辑像素坐标
				// destWidth/destHeight 控制输出分辨率，乘以 DPR 获得高清图
				const dpr = this._canvasDpr;
				const cropX = (this.CANVAS_W - this.CANVAS_H) / 2; // (360-300)/2 = 30

				// 构建导出参数：Canvas 2D 使用 canvas 参数，旧版使用 canvasId
				// JPEG 比 PNG 小 80-90%（手串图无透明需求），800px 足够显示和打印
				// 旧版 Canvas + DPR 属性放大时，crop 坐标需乘以 _legacyDprScale
				// （canvasToTempFilePath 使用 buffer 属性坐标系，不受 ctx.scale 影响）
				const legacyScale = (this._isLegacyCanvas && this._legacyDprScale > 1) ? this._legacyDprScale : 1;
				const destSize = Math.min(this.CANVAS_H * dpr, 800);
				const exportParams = {
					x: cropX * legacyScale,
					y: 0,
					width: this.CANVAS_H * legacyScale,
					height: this.CANVAS_H * legacyScale,
					destWidth: destSize,
					destHeight: destSize,
					fileType: 'jpg',
					quality: 0.9,
					success: (res) => {
						const tempPath = res.tempFilePath || '';
						// 京东小程序可能返回 blob URL，无法直接使用
						// 如果是 blob URL，尝试通过 getFileSystemManager 读取并转换为 base64
						// 淘宝/支付宝小程序：tempFilePath 在跳转新页后可能无效，先进行 base64 转换
			// #ifdef MP-ALIPAY
			if (tempPath) {
				console.log('[bracelet] canvasToTempFilePath 成功，tempPath:', tempPath.substring(0, 60));
				this._isExporting = false;
				this.requestFullRedraw();
				goNext(tempPath);
				return;
			}
			// #endif
			if (tempPath.startsWith('blob:') && this._isLegacyCanvas) {
							this._convertBlobToBase64(tempPath, (base64) => {
								this._isExporting = false;
								this.requestFullRedraw();
								goNext(base64 || tempPath);
							});
						} else {
							this._isExporting = false;
							this.requestFullRedraw();
							goNext(tempPath);
						}
					},
					fail: (err) => {
						console.error('导出图片失败，尝试像素数据兜底', err);
						this._isExporting = false;
						captureViaPixelData();
					},
					complete: () => {}
				};

				// #ifdef MP-ALIPAY
				// 淘宝：全新参数对象（避免遗留的 crop 坐标干扰），导出完整画布
				// _isExporting=true 已隐藏按钮，比例 6:5 可接受
				uni.canvasToTempFilePath({
					canvasId: 'braceletCanvas',
					destWidth: 600,
					destHeight: 500,
					fileType: 'jpg',
					quality: 0.9,
					success: exportParams.success,
					fail: exportParams.fail
				}, this);
				// #endif
				// #ifdef MP-WEIXIN
				// 微信 Canvas 2D 使用 canvas 节点对象；旧版使用 canvasId
				if (this._isLegacyCanvas) {
					exportParams.canvasId = 'braceletCanvas';
				} else {
					exportParams.canvas = this._canvasNode;
				}
				uni.canvasToTempFilePath(exportParams, this);
				// #endif
				// #ifndef MP-WEIXIN || MP-ALIPAY
				exportParams.canvasId = 'braceletCanvas';
				uni.canvasToTempFilePath(exportParams, this);
				// #endif
			};

			// 导出前绘制无按钮画面（_isExporting 令 _drawCanvasButtons 跳过）
			this._isExporting = true;
			const doExport = () => {
				// canvas 仍需存在以供 canvasToTempFilePath / canvasGetImageData 读取
				this.$nextTick(() => finishWork());
			};
			try {
				if (this._isLegacyCanvas) {
					// 旧版 Canvas：draw() 回调在京东小程序不可靠，使用 setTimeout 兜底
					this._drawBraceletSync();
					// 等待 draw() 完成（京东小程序 draw 回调不工作，用定时器兜底）
					setTimeout(doExport, 300);
				} else {
					// Canvas 2D：同步绘制，无需等待
					this._drawBraceletSync();
					doExport();
				}
			} catch (e) {
				console.error('导出绘制失败', e);
				this._isExporting = false;
				this.requestFullRedraw();
			}
		},

		// 将 blob URL 转换为 base64（京东小程序兜底）
		// 由于京东小程序的 canvasToTempFilePath 返回 blob URL，无法直接使用
		// 尝试使用 canvasGetImageData 获取像素数据并转换
		_convertBlobToBase64(blobUrl, callback) {
			const cropX = (this.CANVAS_W - this.CANVAS_H) / 2;
			const dpr = this._canvasDpr || 1;
			const pxScale = (this._isLegacyCanvas && this._legacyDprScale > 1) ? this._legacyDprScale : 1;
			// 尝试使用 uni.canvasGetImageData 获取图像数据
			uni.canvasGetImageData({
				canvasId: 'braceletCanvas',
				x: cropX * pxScale,
				y: 0,
				width: this.CANVAS_H * pxScale,
				height: this.CANVAS_H * pxScale,
				success: (res) => {
					try {
						// 将 RGBA 数据转换为 base64 PNG
						const base64 = this._rgbaToBase64Png(res.data, res.width, res.height);
						callback(base64);
					} catch (e) {
						console.error('[bindinding] rgbaToBase64Png failed', e);
						callback(blobUrl); // 失败时返回原始 blob URL
					}
				},
				fail: (err) => {
					console.error('[bindinding] canvasGetImageData failed', err);
					callback(blobUrl); // 失败时返回原始 blob URL
				}
			}, this);
		},

		// 将 RGBA 数据转换为 BMP 格式的 base64 data URL
		// BMP 格式比 PNG 简单，不需要压缩，适合在小程序中使用
		_rgbaToBase64Png(data, width, height) {
			try {
				// BMP 文件结构：文件头(14) + 信息头(40) + 像素数据
				const rowSize = Math.floor((24 * width + 31) / 32) * 4; // 每行字节数（4字节对齐）
				const pixelDataSize = rowSize * height;
				const fileSize = 54 + pixelDataSize;

				const buffer = new ArrayBuffer(fileSize);
				const view = new DataView(buffer);

				// BMP 文件头 (14 bytes)
				view.setUint8(0, 0x42); // 'B'
				view.setUint8(1, 0x4D); // 'M'
				view.setUint32(2, fileSize, true); // 文件大小
				view.setUint32(6, 0, true); // 保留
				view.setUint32(10, 54, true); // 像素数据偏移

				// BMP 信息头 (40 bytes)
				view.setUint32(14, 40, true); // 信息头大小
				view.setInt32(18, width, true); // 宽度
				view.setInt32(22, -height, true); // 高度（负值表示从上到下）
				view.setUint16(26, 1, true); // 颜色平面数
				view.setUint16(28, 24, true); // 每像素位数 (RGB)
				view.setUint32(30, 0, true); // 压缩方式
				view.setUint32(34, pixelDataSize, true); // 像素数据大小
				view.setUint32(38, 2835, true); // 水平分辨率
				view.setUint32(42, 2835, true); // 垂直分辨率
				view.setUint32(46, 0, true); // 调色板颜色数
				view.setUint32(50, 0, true); // 重要颜色数

				// 像素数据 (BGR 格式，从上到下)
				const uint8 = new Uint8Array(buffer);
				for (let y = 0; y < height; y++) {
					for (let x = 0; x < width; x++) {
						const srcIdx = (y * width + x) * 4; // RGBA
						const dstIdx = 54 + y * rowSize + x * 3; // BGR
						uint8[dstIdx] = data[srcIdx + 2]; // B
						uint8[dstIdx + 1] = data[srcIdx + 1]; // G
						uint8[dstIdx + 2] = data[srcIdx]; // R
					}
				}

				// 转换为 base64
				const base64 = uni.arrayBufferToBase64(buffer);
				return 'data:image/bmp;base64,' + base64;
			} catch (e) {
				console.error('[bindinding] _rgbaToBase64Png failed', e);
				return '';
			}
		},

		// 查看我的作品列表
		openMyWorks() {
			if (!this.isUserLoggedIn()) {
				uni.navigateTo({ url: '/pages/login/login' });
				return;
			}
			this._navigateAway(() => {
				uni.navigateTo({
					url: '/pages/bracelet-sub/my-works',
					fail: () => { this.pageHidden = false; this.requestFullRedraw(); }
				});
			});
		},

		// 打开设计大赛
		openContest() {
			this._navigateAway(() => {
				uni.navigateTo({
					url: '/pages/bracelet-sub/contest',
					fail: () => { this.pageHidden = false; this.requestFullRedraw(); }
				});
			});
		},

		// 打开今日能量手串自动生成页
		openEnergyGenerator() {
			this._navigateAway(() => {
				uni.navigateTo({
					url: '/pages/bracelet-sub/energy-generator',
					fail: (err) => {
						console.warn('openEnergyGenerator navigate fail', err);
						this.pageHidden = false;
						this.requestFullRedraw();
						uni.showToast({ title: '打开失败，请重新编译后重试', icon: 'none' });
					}
				});
			});
		},
	    
		// 将作品信息同步到后端（统一走 braceletworks/save，图片通过 base64 一次提交）
		saveWorkRemote(workData, skipLoginRedirect = false) {
			return new Promise((resolve) => {
				this.syncToken();
				// 保存前检查 token，没有则先跳登录
				const token = this.getToken();
				if (!token && !skipLoginRedirect) {
					console.log('[saveWorkRemote] token 为空，跳转登录');
					try { uni.setStorageSync('pending_work_save', workData); } catch (e) {}
					this.navigateToLogin();
					resolve(null);
					return;
				}
				const sendSave = (imageBase64) => {
					if (imageBase64) {
						workData.design_image_base64 = imageBase64;
					} else if (workData.design_image && String(workData.design_image).startsWith('data:image')) {
						workData.design_image_base64 = workData.design_image;
					}
					const payload = {
						creator: this.getCurrentUserName(),
						work_id: workData.work_id,
						design_title: workData.design_title || '我的手串',
						design_desc: workData.design_desc,
						design_price: workData.design_price,
						bead_count: this.beadCount,
						design_parts: JSON.stringify(workData.design_parts || []),
						...this.getCommonParams(),
					};
					if (workData.design_image_base64) {
						payload.design_image_base64 = workData.design_image_base64;
					} else if (workData.design_image_url) {
						payload.design_image_url = workData.design_image_url;
					}
					// 使用全局请求构造，确保与登录域名一致，携带 Cookie/Token；同时把 token 追加到 url，兼容部分后端 JSON 体不解析 token 的情况
					const commonParams = this.getCommonParams();
					const tokenQuery = commonParams.token ? `&token=${encodeURIComponent(commonParams.token)}` : '';
					const url = app.globalData.get_request_url('save', 'braceletworks') + tokenQuery;
					console.log('[saveWorkRemote] 请求 URL:', url);

					const handleSuccess = (resp) => {
						const data = resp.data || resp;
						if (data && data.code === 0) {
							resolve(data.data || {});
						} else if (data && /绑定.*手机/.test(data.msg || '')) {
							try { uni.removeStorageSync('pending_complete_action'); } catch (e) {}
							app.globalData.showToast('请先绑定手机后再完成设计');
							this.navigateToLogin();
							resolve(null);
						} else if (data && (data.code === -1001 || data.code === -400)) {
							if (!skipLoginRedirect) {
								try { uni.setStorageSync('pending_work_save', workData); } catch (e) {}
								this.navigateToLogin();
							}
							resolve(null);
						} else {
							console.warn('保存作品失败：', data);
							resolve(null);
						}
					};

					const handleFail = (err) => {
						console.error('保存作品请求失败', err);
						resolve(null);
					};

					this._request({
						url,
						method: 'POST',
						data: payload,
						withCredentials: true,
						timeout: 120000,
						success: handleSuccess,
						fail: handleFail
					});
				};

				// 如果已有 base64（H5 某些端 canvasToTempFilePath 直接返回 base64）
				// 淘宝小程序不在此处理，走下方 uploadFile 路径绕过云网关
				// #ifndef MP-ALIPAY
				if (workData.design_image && String(workData.design_image).startsWith('data:image')) {
					sendSave(workData.design_image);
					return;
				}
				// #endif

				// 根据文件路径推断 mime type（导出现在是 jpg）
				const guessMime = (p) => {
					const ext = String(p).split('.').pop().toLowerCase();
					return (ext === 'jpg' || ext === 'jpeg') ? 'image/jpeg' : 'image/png';
				};

				// H5/无法读取文件系统时，尝试以 arraybuffer 方式拉取再转 base64
				const fetchAsArrayBufferAndSend = () => {
					if (!workData.design_image) {
						sendSave('');
						return;
					}
					uni.request({
						url: workData.design_image,
						method: 'GET',
						responseType: 'arraybuffer',
						success: (res) => {
							try {
								const base64 = uni.arrayBufferToBase64(res.data);
								const mime = guessMime(workData.design_image);
								sendSave('data:' + mime + ';base64,' + base64);
							} catch (err) {
								console.error('arraybuffer 转 base64 失败', err);
								sendSave('');
							}
						},
						fail: () => sendSave('')
					});
				};

				// 优先读取本地文件 base64（小程序/App 支持）
				// #ifdef MP-JD
				// 京东小程序使用 jd.getFileSystemManager
				try {
					if (typeof jd !== 'undefined' && typeof jd.getFileSystemManager === 'function' && workData.design_image) {
						console.log('[saveWorkRemote] 使用 jd.getFileSystemManager 读取文件:', workData.design_image);
						const fs = jd.getFileSystemManager();
						fs.readFile({
							filePath: workData.design_image,
							encoding: 'base64',
							success: (res) => {
								console.log('[saveWorkRemote] jd readFile success, data length:', res.data ? res.data.length : 0);
								const mime = guessMime(workData.design_image);
								sendSave('data:' + mime + ';base64,' + res.data);
							},
							fail: (err) => {
								console.warn('[saveWorkRemote] jd readFile fail:', err);
								// 京东小程序 fallback: 使用 uni.uploadFile 直接上传文件
								if (workData.design_image && !workData.design_image.startsWith('http') && !workData.design_image.startsWith('data:')) {
									console.log('[saveWorkRemote] 尝试使用 uni.uploadFile 直接上传');
									const commonParams = this.getCommonParams();
									const tokenQuery = commonParams.token ? `&token=${encodeURIComponent(commonParams.token)}` : '';
									const uploadUrl = app.globalData.get_request_url('save', 'braceletworks') + tokenQuery;
									uni.uploadFile({
										url: uploadUrl,
										filePath: workData.design_image,
										name: 'design_image_file',
										formData: {
											creator: this.getCurrentUserName(),
											work_id: workData.work_id || '',
											design_title: workData.design_title || '我的手串',
											design_desc: workData.design_desc || '',
											design_price: String(workData.design_price || 0),
											bead_count: String(this.beadCount || 0),
											design_parts: JSON.stringify(workData.design_parts || []),
											...commonParams,
										},
										success: (uploadRes) => {
											try {
												const data = typeof uploadRes.data === 'string' ? JSON.parse(uploadRes.data) : uploadRes.data;
												console.log('[saveWorkRemote] uploadFile success:', data);
												if (data && data.code === 0 && data.data) {
													resolve(data.data);
												} else {
													console.warn('[saveWorkRemote] uploadFile response error:', data);
													resolve(null);
												}
											} catch (e) {
												console.error('[saveWorkRemote] uploadFile parse error:', e);
												resolve(null);
											}
										},
										fail: (uploadErr) => {
											console.error('[saveWorkRemote] uploadFile fail:', uploadErr);
											resolve(null);
										}
									});
								} else {
									fetchAsArrayBufferAndSend();
								}
							}
						});
						return;
					}
				} catch (e) {
					console.error('[saveWorkRemote] jd 读取图片base64失败', e);
				}
				// #endif

				// #ifdef MP-ALIPAY
				// 淘宝小程序：图片通过云网关以 base64 提交
				// 注意：云网关对 body 有一定大小限制，但当前 JPEG 质量 0.9 通常在限制内
				// 如果图片是本地文件路径，先读取为 base64
				{
					const designImage = workData.design_image || '';
					if (designImage && designImage.startsWith('data:image')) {
						// 已经是 base64，直接通过云网关发送
						console.log('[saveWorkRemote][ALIPAY] base64 图片，通过云网关发送，length:', designImage.length);
						sendSave(designImage);
					} else if (designImage && !designImage.startsWith('http')) {
						// 本地文件路径 → 读取为 base64 再发送
						console.log('[saveWorkRemote][ALIPAY] 读取本地文件转 base64:', designImage.substring(0, 60));
						try {
							const fs = uni.getFileSystemManager();
							fs.readFile({
								filePath: designImage,
								encoding: 'base64',
								success: (res) => {
									const mime = guessMime(designImage);
									sendSave('data:' + mime + ';base64,' + res.data);
								},
								fail: (err) => {
									console.warn('[saveWorkRemote][ALIPAY] readFile 失败:', err);
									sendSave('');
								}
							});
						} catch (e) {
							console.error('[saveWorkRemote][ALIPAY] 文件系统异常:', e);
							sendSave('');
						}
					} else {
						// 无图片或已是 http URL
						sendSave('');
					}
					return;
				}
				// #endif

				// #ifndef MP-JD
				// 微信小程序：读取本地文件转 base64 后上传
				try {
					if (typeof uni.getFileSystemManager === 'function' && workData.design_image) {
						const fs = uni.getFileSystemManager();
						fs.readFile({
							filePath: workData.design_image,
							encoding: 'base64',
							success: (res) => {
								const mime = guessMime(workData.design_image);
								sendSave('data:' + mime + ';base64,' + res.data);
							},
							fail: () => fetchAsArrayBufferAndSend()
						});
						return;
					}
				} catch (e) {
					console.error('读取图片base64失败', e);
				}
				// #endif

				fetchAsArrayBufferAndSend();
			});
		},
		
		// 获取当前用户昵称（可按需调整字段）
		getCurrentUserName() {
			const user = app?.globalData?.user || app?.globalData?.user_info || {};
			return user.nick_name || user.nickname || user.user_name || user.username || '';
		},
		getCommonParams() {
			const token = this.getToken();
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
		syncToken() {
			const t = this.getToken();
			if (t && (!app?.globalData?.token)) {
				app.globalData.token = t;
			}
		},
		buildApiUrl(path) {
			const qp = this.getCommonParams();
			const query = Object.keys(qp)
				.filter(k => qp[k] !== undefined && qp[k] !== null && qp[k] !== '')
				.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(qp[k])}`)
				.join('&');
			return `https://www.ostone.store/api.php?s=${path}${query ? '&' + query : ''}`;
		},
		// 直接从 canvas 获取 base64（Canvas 2D 支持 toDataURL）
		// 使用 JPEG 格式：比 PNG 小 80-90%，手串图无透明需求
		captureCanvasBase64() {
			return new Promise((resolve) => {
				if (!this._canvasNode) {
					resolve('');
					return;
				}
				try {
					// JPEG 0.9 品质，高 DPR buffer 下 PNG 可达数 MB，JPEG 通常 < 100KB
					const dataUrl = this._canvasNode.toDataURL('image/jpeg', 0.9);
					resolve(dataUrl || '');
				} catch (e) {
					resolve('');
				}
			});
		},
		getToken() {
			// 从 globalData 多种位置查找
			const t = app?.globalData?.token
				|| app?.globalData?.data?.token
				|| app?.globalData?.user_token
				|| app?.globalData?.user?.token
				|| app?.globalData?.user_info?.token
				|| '';
			if (t) return t;
			// 从 storage 缓存的用户信息中读取 token
			const cacheKey = app?.globalData?.data?.cache_user_info_key || app?.globalData?.cache_user_info_key || 'cache_shop_user_info_key';
			try {
				const cachedUser = uni.getStorageSync(cacheKey);
				if (cachedUser && cachedUser.token) return cachedUser.token;
			} catch (e) {}
			return uni.getStorageSync('token')
				|| uni.getStorageSync('user_token')
				|| uni.getStorageSync('user_token_value')
				|| '';
		},
		isUserLoggedIn() {
			const getter = app?.globalData?.get_user_cache_info;
			if (typeof getter === 'function') {
				const cached = getter.call(app.globalData);
				if (cached && Number(cached.id || cached.user_id || 0) > 0) {
					return true;
				}
			}
			const key = app?.globalData?.data?.cache_user_info_key || 'cache_shop_user_info_key';
			const stored = uni.getStorageSync(key) || {};
			if (stored && Number(stored.id || stored.user_id || 0) > 0) {
				return true;
			}
			return false;
		},
		
		//选择材质
		selectCategory(cat) {
			this.selectedCategory = cat;
		},
		
		addToBracelet(material) {
			if (this.braceletItems.length >= 40) {
				uni.showToast({ title: '珠子数量已达上限', icon: 'none' });
				return;
			}

			// 用 material 自身的分类信息（分组模式下 selectedLevel3 可能不对应当前珠子）
			const matCategory = material.category || material.types || this.selectedLevel3;
			const imageScale = this.imageScaleConfig[matCategory] || this.imageScaleConfig.default;
			const newItem = {
				...material,
				category: matCategory,
				isAccessory: this.selectedLevel1 === '配件',
				imageScale: imageScale,
				uniqueId: Date.now() + Math.random()
			};

			// 预解析图片（后台，不阻塞）
			const rawImg = (newItem.imageMap || newItem.imagePath) || '';
			this.resolveImageForCanvas(rawImg);

			// 保存旧位置用于平滑过渡
			this._transitionFrom = this.beadPositions.length > 0
				? this.beadPositions.map(p => ({ x: p.x, y: p.y, rotationAngle: p.rotationAngle }))
				: []; // 首颗珠子：无旧位置，但仍启用过渡帧以驱动飞入动画
			this._transitionFrame = 0;
			this._transitionTotalFrames = 6;
			this._transitionTarget = null;

			// 飞入动画：记录新珠子索引（无论珠子数量，飞入始终启用）
			this._flyInIndex = this.braceletItems.length; // push 前的 length = 新珠子的 index
			this._flyInFrame = 0;
			this._flyInTotalFrames = 18; // 18帧 ≈ 450ms，给图片加载留足时间

			this.pushUndoState();
			this.braceletItems.push(newItem);
		},

		/**
		 * 飞入动画：珠子从点击位置飞向手串落位点，到达后再写入数据
		 * @returns {boolean} 是否成功启动动画
		 */
		getMaterialImage(material) {
			const raw = (material && (material.imageMap || material.imagePath)) || '';
			return this.normalizeStaticAssetPath(raw) || this.fallbackImage;
		},

	// 根据珠子尺寸计算在选择区的显示大小
	getBeadDisplaySize(material) {
		// 配件类目使用固定尺寸
		if (material.isAccessory || this.selectedLevel1 === '配件') {
			return { width: '60px', height: '60px' };
		}

		// 基准尺寸：12mm 珠子显示为 60px
		const baseSize = 12;  // mm
		const baseDisplaySize = 60;  // px

		// 解析珠子尺寸（如 "8" → 8, "12" → 12）
		const actualSize = parseFloat(material.size || material.sizeValue || baseSize);

		// 按比例计算显示尺寸
		const displaySize = (actualSize / baseSize) * baseDisplaySize;

		// 限制范围：最小 30px，最大 80px
		const clampedSize = Math.max(30, Math.min(80, displaySize));

		return {
			width: `${clampedSize}px`,
			height: `${clampedSize}px`
		};
	},
	// 返回纯数值，供模板字符串拼接（微信小程序 :style 不支持函数调用返回对象）
	getBeadDisplaySizePx(material) {
		if (material.isAccessory || this.selectedLevel1 === '配件') {
			return 60;
		}
		const baseSize = 12;
		const baseDisplaySize = 60;
		const actualSize = parseFloat(material.size || material.sizeValue || baseSize);
		const displaySize = (actualSize / baseSize) * baseDisplaySize;
		return Math.max(30, Math.min(80, displaySize));
	},
		normalizeCanvasImageSrc(src) {
			const normalized = this.normalizeStaticAssetPath(src || '');
			if (!normalized) return '';
			if (/^https?:\/\//i.test(normalized)) return normalized;
			// 小程序 canvas 对中文路径更稳妥的做法是 encodeURI
			return encodeURI(normalized);
		},
		resolveLogoForCanvas(src) {
			return new Promise((resolve) => {
				const fallback = '/static/logo/logo.png';
				const raw = String(src || '').trim() || fallback;
				const localPath = this.normalizeStaticAssetPath(raw) || fallback;
				const candidates = [];
				if (localPath) {
					candidates.push(localPath.startsWith('/') ? localPath : `/${localPath}`);
				}
				const cache = this.getImageResolveCache();
				const tryNext = (idx) => {
					if (idx >= candidates.length) return resolve('');
					const candidate = candidates[idx];
					const cacheKey = /^https?:\/\//i.test(candidate)
						? candidate
						: this.normalizeCanvasImageSrc(candidate);
					if (!cacheKey) return resolve('');
					if (cache[cacheKey]) {
						return resolve(cache[cacheKey]);
					}
					uni.getImageInfo({
						src: cacheKey,
						success: (res) => {
							let path = res.path || res.tempFilePath || cacheKey;
							if (path && !/^https?:\/\//i.test(path) && !path.startsWith('wxfile://') && !path.startsWith('/')) {
								path = `/${path}`;
							}
							cache[cacheKey] = path;
							resolve(path);
						},
						fail: () => tryNext(idx + 1),
					});
				};
				tryNext(0);
			});
		},
		
		/**
		 * 图片加载失败处理：智能重试机制
		 * 1. 首次失败：延迟 1s 重试原图
		 * 2. 二次失败：延迟 2s 重试原图
		 * 3. 三次失败：使用本地兜底图（base64 或打包资源）
		 */
		handleMaterialImageError(material) {
			if (!material) return;

			const materialId = material.id || material.sku_id || JSON.stringify(material);
			const retryInfo = this.imageRetryMap[materialId] || { retryCount: 0, lastRetryTime: 0 };
			const now = Date.now();

			// 防止短时间内重复触发（100ms 内的重复事件忽略）
			if (now - retryInfo.lastRetryTime < 100) {
				return;
			}

			retryInfo.retryCount += 1;
			retryInfo.lastRetryTime = now;
			this.imageRetryMap[materialId] = retryInfo;

			const originalImage = material._originalImageMap || material.imageMap;
			if (!material._originalImageMap) {
				material._originalImageMap = material.imageMap; // 备份原始路径
			}

			// 重试策略
			if (retryInfo.retryCount <= 2) {
				// 前两次失败：延迟重试原图
				const retryDelay = retryInfo.retryCount * 1000; // 1s, 2s

				setTimeout(() => {
					// 强制刷新图片路径触发重新加载（加时间戳破缓存）
					const sep = originalImage.includes('?') ? '&' : '?';
					material.imageMap = `${originalImage}${sep}_retry=${retryInfo.retryCount}&_t=${now}`;
					this.$forceUpdate(); // 强制更新视图
				}, retryDelay);
			} else {
				// 第三次失败：使用本地兜底图
				console.warn(`[bracelet] Image load failed 3 times for ${material.name}, using fallback`);
				material.imageMap = this.fallbackImage;
				material.imagePath = this.fallbackImage;
			}
		},

		// 长按预览
		showMaterialPreview(material) {
			this.previewMaterial = material;
		},
		hideMaterialPreview() {
			this.previewMaterial = null;
			// canvas 由 hidden 控制显隐，关闭预览后恢复显示并刷新内容
			this.$nextTick(() => this.requestFullRedraw());
		},

		// Canvas 2D 图片加载：创建 Image 对象并缓存，替代旧的路径缓存
		loadImageObject(src) {
			const fallback = this.fallbackImage || this.normalizeStaticAssetPath('/static/beads/兜底图片.png');
			const cacheKey = this.normalizeCanvasImageSrc(src) || this.normalizeCanvasImageSrc(fallback) || fallback;

			// 已缓存且加载完成
			if (this._imageObjectCache[cacheKey] && (this._imageObjectCache[cacheKey].complete || this._imageObjectCache[cacheKey]._loaded)) {
				return Promise.resolve(this._imageObjectCache[cacheKey]);
			}
			// 正在加载中
			if (this._imageLoadingMap[cacheKey]) {
				return this._imageLoadingMap[cacheKey];
			}

			// canvas 未就绪时直接返回，不缓存到 _imageLoadingMap（避免无效 Promise 被复用导致永远无法加载）
			// 旧版 Canvas API 无 _canvasNode，但仍可正常加载
			if (!this._canvasNode && !this._isLegacyCanvas) {
				return Promise.resolve(null);
			}

			const promise = new Promise((resolve) => {
				// onFail: 可选回调，当图片加载失败时通知调用方（如清除持久化缓存坏记录）
				const doLoad = (localPath, onFail) => {
					// 旧版 Canvas API：不能使用 canvas.createImage()，需要下载图片到本地
					if (this._isLegacyCanvas) {
						// 判断是否为网络图片
						// 注意：淘宝/支付宝小程序的 getImageInfo 返回的本地资源路径格式为 https://resource/...
						// 这不是真正的网络URL，需要排除
						const isRemote = /^https?:\/\//i.test(localPath) && !/^https?:\/\/resource\//i.test(localPath);
						if (isRemote) {
							// #ifdef MP-ALIPAY
							// 淘宝/支付宝小程序：旧版 Canvas API 支持直接使用网络 URL 作为 drawImage 路径
							// downloadFile 可能因域名白名单问题无法正常回调，所以直接使用 URL
							const pathObj = { src: localPath, _loaded: true, _isPath: true };
							this._imageObjectCache[cacheKey] = pathObj;
							delete this._imageLoadingMap[cacheKey];
							resolve(pathObj);
							this.requestFullRedraw();
							return;
							// #endif

							// 网络图片：先下载到本地临时路径
							uni.downloadFile({
								url: localPath,
								success: (downloadRes) => {
									if (downloadRes.statusCode === 200 && downloadRes.tempFilePath) {
										const pathObj = { src: downloadRes.tempFilePath, _loaded: true, _isPath: true };
										this._imageObjectCache[cacheKey] = pathObj;
										delete this._imageLoadingMap[cacheKey];
										resolve(pathObj);
										this.requestFullRedraw();
									} else {
										console.warn('[bracelet] downloadFile invalid response:', localPath, downloadRes);
										if (onFail) onFail();
										delete this._imageLoadingMap[cacheKey];
										// 下载失败，直接 resolve(null) 让绘制使用占位圆
										resolve(null);
										this.requestFullRedraw();
									}
								},
								fail: (err) => {
									console.warn('[bracelet] downloadFile failed:', localPath, err);
									if (onFail) onFail();
									delete this._imageLoadingMap[cacheKey];
									// 京东等平台下载失败时，直接 resolve(null) 让绘制使用占位圆
									// 不再尝试加载 fallback（可能也会失败，导致无限循环）
									resolve(null);
									this.requestFullRedraw();
								}
							});
						} else {
							// 本地图片：直接使用路径（可能需要 getImageInfo 验证）
							uni.getImageInfo({
								src: localPath,
								success: (info) => {
									const pathObj = { src: info.path, _loaded: true, _isPath: true };
									this._imageObjectCache[cacheKey] = pathObj;
									delete this._imageLoadingMap[cacheKey];
									resolve(pathObj);
									this.requestFullRedraw();
								},
								fail: () => {
									// 本地图片 getImageInfo 失败，尝试直接使用路径
									const pathObj = { src: localPath, _loaded: true, _isPath: true };
									this._imageObjectCache[cacheKey] = pathObj;
									delete this._imageLoadingMap[cacheKey];
									resolve(pathObj);
									this.requestFullRedraw();
								}
							});
						}
						return;
					}

					const img = this._canvasNode.createImage();
					let settled = false;

					// 5秒超时保护：防止 createImage 既不 onload 也不 onerror 导致 Promise 永远挂起
					const timer = setTimeout(() => {
						if (settled) return;
						settled = true;
						console.warn('[bracelet] createImage timeout (5s):', localPath);
						if (onFail) onFail();
						delete this._imageLoadingMap[cacheKey];
						if (localPath !== fallback) {
							this.loadImageObject(fallback).then((fbImg) => {
								if (fbImg) this._imageObjectCache[cacheKey] = fbImg;
								resolve(fbImg);
								this.requestFullRedraw();
							});
						} else {
							resolve(null);
						}
					}, 5000);

					img.onload = () => {
						if (settled) return;
						settled = true;
						clearTimeout(timer);
						img._loaded = true;
						this._imageObjectCache[cacheKey] = img;
						delete this._imageLoadingMap[cacheKey];
						resolve(img);
						this.requestFullRedraw();
					};
					img.onerror = () => {
						if (settled) return;
						settled = true;
						clearTimeout(timer);
						if (onFail) onFail();
						delete this._imageLoadingMap[cacheKey];
						if (localPath !== fallback) {
							this.loadImageObject(fallback).then((fbImg) => {
								if (fbImg) this._imageObjectCache[cacheKey] = fbImg;
								resolve(fbImg);
								this.requestFullRedraw();
							});
						} else {
							resolve(null);
						}
					};
					img.src = localPath;
				};

				// target 用于实际加载（不 encodeURI），cacheKey 仅用于缓存索引
				let target = this.normalizeStaticAssetPath(src || "") || fallback;

				// #ifdef MP-ALIPAY
				// 淘宝/支付宝小程序：优先使用天猫 CDN 图片映射
				// 从 src 中提取文件名（支持完整路径和纯文件名）
				const srcStr = String(src || '');
				let imageName = srcStr;
				if (srcStr.includes('/')) {
					imageName = srcStr.split('/').pop();
				}
				// 确保有 .png 扩展名
				if (imageName && !/\.[a-zA-Z0-9]+$/.test(imageName)) {
					imageName = `${imageName}.png`;
				}
				const tmallUrl = getTmallImageUrl(imageName);
				if (tmallUrl) {
					target = tmallUrl;
				}
				// #endif

				// #ifdef MP-WEIXIN
				if (/^https?:\/\//i.test(target)) {
					// 检查持久化缓存（之前 downloadFile 保存的本地文件）
					const { map, save } = this.getPersistentImageCache();
					const hit = map && map[target];
					if (hit) {
						try {
							const fs = wx.getFileSystemManager();
							// 校验文件完整性：不仅检查存在，还要求文件大小 > 100 字节
							const stat = fs.statSync(hit);
							if (stat && stat.size > 100) {
								doLoad(hit, () => {
									// 加载失败：重新读取最新缓存再清除（避免闭包快照覆盖并发修改）
									this._clearPersistentCacheForUrl(target);
								});
								return;
							}
							// 文件过小（可能是截断/损坏），清除坏记录
							this._clearPersistentCacheForUrl(target);
						} catch (e) {
							// 文件不存在，清除坏记录
							this._clearPersistentCacheForUrl(target);
						}
					}

					// 优先用 getImageInfo：可复用 <image> 标签的系统图片缓存，
					// 珠子选择区已显示的图片无需重新下载，直接返回本地路径
					uni.getImageInfo({
						src: target,
						success: (info) => {
							const localPath = info.path || info.tempFilePath;
							if (localPath) {
								doLoad(localPath);
							} else {
								// getImageInfo 返回空路径，回退 downloadFile
								this._downloadAndCacheImage(target, map, save, doLoad, fallback);
							}
						},
						fail: () => {
							// getImageInfo 失败（首次加载等），回退 downloadFile
							this._downloadAndCacheImage(target, map, save, doLoad, fallback);
						}
					});
					return;
				}
				// #endif

				// #ifdef MP-ALIPAY
				// 淘宝/支付宝小程序：网络图片直接调用 doLoad（内部会直接使用 URL）
				// 注意：支付宝小程序的 getImageInfo 对天猫 CDN URL 可能挂起不回调，所以跳过
				if (/^https?:\/\//i.test(target)) {
					doLoad(target);
					return;
				}
				// #endif

				// 本地打包资源（/static/...）：先用 getImageInfo 解析为可用路径
				// Canvas 2D createImage() 在部分设备上不支持直接加载包资源路径
				// 对所有非 URL 本地路径走 getImageInfo（含 mapBraceletStaticPath 映射后的路径）
				if (!/^https?:\/\//i.test(target)) {
					uni.getImageInfo({
						src: target,
						success: (info) => {
							const resolved = info.path || info.tempFilePath || target;
							doLoad(resolved);
						},
						fail: () => doLoad(target) // 兜底直接尝试
					});
					return;
				}

				doLoad(target);
			});

			this._imageLoadingMap[cacheKey] = promise;
			return promise;
		},

		// downloadFile + saveFile 持久化缓存（getImageInfo 失败时的回退）
		_downloadAndCacheImage(url, map, save, doLoad, fallback) {
			const fs = (typeof wx !== 'undefined' && wx.getFileSystemManager) ? wx.getFileSystemManager() : null;
			uni.downloadFile({
				url,
				success: (dres) => {
					const tmpPath = dres && (dres.tempFilePath || dres.filePath);
					if (!tmpPath || !fs || typeof fs.saveFile !== 'function') {
						doLoad(tmpPath || url);
						return;
					}
					fs.saveFile({
						tempFilePath: tmpPath,
						success: (sres) => {
							const saved = sres && sres.savedFilePath;
							if (saved) {
								const next = map && typeof map === 'object' ? { ...map } : {};
								next[url] = saved;
								const keys = Object.keys(next);
								if (keys.length > 100) {
									const keep = keys.slice(-60);
									const pruned = {};
									keep.forEach(k => { pruned[k] = next[k]; });
									save(pruned);
								} else {
									save(next);
								}
								doLoad(saved);
							} else {
								doLoad(tmpPath);
							}
						},
						fail: () => doLoad(tmpPath)
					});
				},
				fail: () => doLoad(fallback || url)
			});
		},

		// Logo 专用加载：多重回退策略
		// Canvas 2D createImage() 在部分真机上不支持包资源路径（/static/...），
		// 而 logo 不走 CDN 映射（mapBraceletStaticPath 无 'static/logo/' 前缀），
		// 所以需要独立于 loadImageObject 的回退链。
		_loadLogoForCanvas(canvas) {
			if (!canvas) return;
			const tryLoad = (path) => new Promise((resolve) => {
				if (!path) return resolve(null);
				const img = canvas.createImage();
				img.onload = () => { img._loaded = true; resolve(img); };
				img.onerror = () => resolve(null);
				img.src = path;
			});
			// 方案1: getImageInfo 解析包资源 → 临时路径
			const viaImageInfo = () => new Promise((resolve) => {
				uni.getImageInfo({
					src: '/static/logo/logo.png',
					success: (info) => tryLoad(info.path || info.tempFilePath).then(resolve),
					fail: () => resolve(null)
				});
			});
			// 方案2: 直接加载包资源路径
			const viaDirect = () => tryLoad('/static/logo/logo.png');
			// 方案3: FileSystemManager 读为 base64
			const viaBase64 = () => new Promise((resolve) => {
				try {
					// #ifdef MP-WEIXIN
					const fs = wx.getFileSystemManager();
					fs.readFile({
						filePath: '/static/logo/logo.png',
						encoding: 'base64',
						success: (res) => tryLoad('data:image/png;base64,' + res.data).then(resolve),
						fail: () => resolve(null)
					});
					// #endif
					// #ifdef MP-ALIPAY
					if (typeof my !== 'undefined' && typeof my.getFileSystemManager === 'function') {
						const fs = my.getFileSystemManager();
						fs.readFile({
							filePath: '/static/logo/logo.png',
							encoding: 'base64',
							success: (res) => tryLoad('data:image/png;base64,' + res.data).then(resolve),
							fail: () => resolve(null)
						});
					} else {
						resolve(null);
					}
					// #endif
					// #ifndef MP-WEIXIN || MP-ALIPAY
					resolve(null);
					// #endif
				} catch (e) { resolve(null); }
			});
			viaImageInfo()
				.then(img => img || viaDirect())
				.then(img => img || viaBase64())
				.then(img => {
					if (img) {
						this._logoImageObj = img;
						this.requestFullRedraw();
					}
				});
		},

		// 兼容旧调用（watcher 预加载等）
		resolveImageForCanvas(src) {
			return this.loadImageObject(src);
		},

		async ensureResolvedImages() {
			const fallback = this.fallbackImage || this.normalizeStaticAssetPath('/static/beads/兜底图片.png');
			const tasks = [];
			(this.braceletItems || []).forEach((item) => {
				const raw = (item && (item.imageMap || item.imagePath)) || fallback;
				const cacheKey = this.normalizeCanvasImageSrc(raw) || raw;
				if (cacheKey && this._imageObjectCache[cacheKey] && (this._imageObjectCache[cacheKey].complete || this._imageObjectCache[cacheKey]._loaded)) return;
				tasks.push(this.loadImageObject(raw));
			});
			if (tasks.length) {
				await Promise.all(tasks);
			}
			// 定期清理缓存（非热路径），上限 150 避免预加载图片被提前淘汰
			const keys = Object.keys(this._imageObjectCache);
			if (keys.length > 150) {
				keys.slice(0, 60).forEach(k => delete this._imageObjectCache[k]);
			}
		},

		// 非阻塞图片加载：后台加载缺失图片，全部就绪后触发画布刷新
		_ensureImagesAndRefresh() {
			const fallback = this.fallbackImage || this.normalizeStaticAssetPath('/static/beads/兜底图片.png');
			const tasks = [];
			const now = Date.now();
			(this.braceletItems || []).forEach((item) => {
				const raw = (item && (item.imageMap || item.imagePath)) || fallback;
				const cacheKey = this.normalizeCanvasImageSrc(raw) || raw;
				if (cacheKey && this._imageObjectCache[cacheKey]
					&& (this._imageObjectCache[cacheKey].complete || this._imageObjectCache[cacheKey]._loaded)) {
					// 图片已加载成功，重置看门狗状态（以便下次重新进入时可再次触发）
					delete item._loadStartTime;
					delete item._forceRetried;
					return;
				}

				// 看门狗：记录首次加载开始时间
				if (!item._loadStartTime) {
					item._loadStartTime = now;
				}
				// 超过 8 秒仍未加载成功，清除持久化缓存并强制重试
				if (now - item._loadStartTime > 8000 && !item._forceRetried) {
					item._forceRetried = true;
					this._clearPersistentCacheForUrl(raw);
					// 清除内存中的 loading promise，强制重新加载
					delete this._imageLoadingMap[cacheKey];
				}

				tasks.push(this.loadImageObject(raw));
			});
			if (tasks.length) {
				Promise.all(tasks).then(() => {
					this.requestFullRedraw();
				});
			}
		},

		// 清除指定 URL 的持久化图片缓存记录（用于看门狗超时重试）
		_clearPersistentCacheForUrl(url) {
			try {
				const target = this.normalizeStaticAssetPath(url || '') || url;
				if (!/^https?:\/\//i.test(target)) return;
				const { map, save } = this.getPersistentImageCache();
				if (map && map[target]) {
					delete map[target];
					save(map);
				}
			} catch (e) { /* ignore */ }
		},

		// 启动时异步校验持久化图片缓存，清理不存在或损坏的条目
		_validatePersistentImageCache() {
			try {
				const { map, save } = this.getPersistentImageCache();
				if (!map || typeof map !== 'object') return;
				const fs = (typeof wx !== 'undefined' && wx.getFileSystemManager)
					? wx.getFileSystemManager() : null;
				if (!fs) return;
				let changed = false;
				const urls = Object.keys(map);
				for (const url of urls) {
					const path = map[url];
					try {
						const stat = fs.statSync(path);
						if (!stat || stat.size < 100) {
							delete map[url];
							changed = true;
						}
					} catch (e) {
						delete map[url];
						changed = true;
					}
				}
				if (changed) save(map);
			} catch (e) {
				console.warn('[bracelet] validatePersistentImageCache error', e);
			}
		},

		/**
		* 判断是否为吊坠类配件
		 */
		isPendantAccessory(item) {
			if (!item.isAccessory) return false;
			
			const type = String(item.types || '').trim();
			return type === '提溜/吊坠';
		},
		
		/**
		* 获取配件的实际总高度（mm）
		 */
		getAccessoryTotalHeight(item) {
			return parseFloat(item.height);
		},
		
		getAccessoryTotalWidth(item) {
			return parseInt(item.width);
		},
		
		//投影宽度，即穿孔宽度
		getProjectedWidth(item) {
			return parseInt(item.size);
		},
		
		getImageAspectRatio(item) {
			if (!item.isAccessory) return 1.0;
			
			const height = this.getAccessoryTotalHeight(item);
			const width = this.getAccessoryTotalWidth(item);
			const ratio = width / height;
			return ratio;
		},
		
		/**
		 * 计算穿孔点偏移量
		 * 固定穿孔点在图片10%位置
		 */
		calculateHoleOffset(item, displayHeight) {
		    const holeFromTop = displayHeight * this.HOLE_RATIO;
		    const centerFromTop = displayHeight / 2;
		    return centerFromTop - holeFromTop; // 中心向外偏移量
		},
		
		/**
		   * 计算两个相邻配件之间的圆心角
		   * @param {Object} item1 - 第一个配件 
		   * @param {Object} item2 - 第二个配件
		   * @param {number} scale - 缩放比例
		   */
		calculateAngleBetweenItems(item1, item2, scale) {
		    const circleRadius = this.FIXED_CIRCLE_RADIUS;
			const isPendant1 = this.isPendantAccessory(item1);
			const isPendant2 = this.isPendantAccessory(item2);
			
			let size1,size2;
			if (isPendant1) {
				size1 = parseInt(item1.size) * this.PENDANT_SCALE;
			} else {
				size1 = this.getActualItemSize(item1);
			}
			
			if (isPendant2) {
				size2 = parseInt(item2.size) * this.PENDANT_SCALE;
			} else {
				size2 = this.getActualItemSize(item2);
			}
			
			// 转换为像素
		    const pixelSize1 = size1 * scale;
		    const pixelSize2 = size2 * scale;
		    // 两个珠子之间的中心距离应该是它们的半径之和
			const effectiveDistance = (pixelSize1 + pixelSize2) / 2;
		    const sinValue = Math.min(effectiveDistance / (2 * circleRadius), 1);
			const angle = 2 * Math.asin(sinValue);

		    return angle;
		},
		
		getActualItemSize(item) {
		    if (item.isAccessory) {
		        // 对于配件，返回其实际宽度
				console.log("getAccessoryTotalWidth = " + this.getAccessoryTotalWidth(item) + "getAccessoryTotalHeight = " + this.getAccessoryTotalHeight(item))
		        return this.getAccessoryTotalWidth(item);
		    } else {
		        // 对于普通珠子，返回其直径
		        return parseInt(item.size) || 0;
		    }
		},
		
		// 计算所有珠子按原始大小相切排列时的总角度
		// scale参数：指定使用的缩放比例，默认使用defaultScale
		calculateTotalAngle(scale = null) {
			let totalAngle = 0;
			// 使用传入的缩放比例，如果没有则使用defaultScale
			const useScale = scale !== null ? scale : this.defaultScale;
			const n = this.braceletItems.length;
			if (n === 0) return 0;
			
			if (n === 1) {
			    const item = this.braceletItems[0];
				const isPendant = this.isPendantAccessory(item);
				
			    const size = this.getProjectedWidth(item) * useScale;
			    // 单个珠子占据的弧长对应的圆心角
			    const angle = 2 * Math.asin(size / (2 * this.FIXED_CIRCLE_RADIUS));
			    return angle;
			}
			
			for (let i = 0; i < n; i++) {
				const item1 = this.braceletItems[i];
				const item2 = this.braceletItems[(i + 1) % n];
				const angle = this.calculateAngleBetweenItems(item1, item2, useScale);
				totalAngle += angle;
			}
			return totalAngle;
		},
		
		// ========== Canvas 2D 画布内按钮（直接绘制在 Canvas 上，避免原生层遮挡） ==========

		// 按钮布局定义（canvas 逻辑坐标，CANVAS_W×CANVAS_H）
		_getCanvasButtons() {
			const cY = this.CANVAS_H / 2; // 垂直居中 = 150
			return [
				// 左侧 4 按钮（x=24，r=18，左边界 x-r=6，留出安全边距）
				{ id: 'tutorial', x: 24, y: cY - 66, r: 18, icon: '?',  label: '教程', action: 'openTutorial' },
				{ id: 'clear',    x: 24, y: cY - 22, r: 18, icon: '×',  label: '清空', action: 'handleClear' },
				{ id: 'redo',     x: 24, y: cY + 22, r: 18, icon: '↷',  label: '重做', action: 'redo', disabledWhen: () => !this.canRedo },
				{ id: 'undo',     x: 24, y: cY + 66, r: 18, icon: '↶',  label: '撤销', action: 'undo', disabledWhen: () => !this.canUndo },
				// 右侧 2 按钮（x=CANVAS_W-15，紧靠右边缘）
				{ id: 'rotateL',  x: this.CANVAS_W - 15, y: cY - 16, r: 12, icon: '↺', action: 'rotateBracelet', args: [-1] },
				{ id: 'rotateR',  x: this.CANVAS_W - 15, y: cY + 16, r: 12, icon: '↻', action: 'rotateBracelet', args: [1] },
			];
		},

		// 在 Canvas 上绘制控制按钮（ctx.restore() 之后调用，不受 clip 影响）
		_drawCanvasButtons(ctx) {
			if (this.showTutorial || this.previewMaterial || this._isExporting) return;

			const buttons = this._getCanvasButtons();
			const pressedId = this._pressedBtnId;
			const isLegacy = this._isLegacyCanvas;

			buttons.forEach(btn => {
				const disabled = btn.disabledWhen ? btn.disabledWhen() : false;
				const pressed = !disabled && pressedId === btn.id;
				const alpha = disabled ? 0.35 : 0.9;

				if (!isLegacy) ctx.save();

				if (pressed && !isLegacy) {
					// 按下态：外发光（仅 Canvas 2D 支持）
					ctx.shadowColor = 'rgba(244, 200, 160, 0.6)';
					ctx.shadowBlur = 8;
				}

				// 圆形背景
				ctx.beginPath();
				ctx.arc(btn.x, btn.y, btn.r, 0, 2 * Math.PI);
				if (pressed) {
					if (isLegacy) {
						// 旧版 Canvas 使用纯色
						ctx.setFillStyle('rgba(255, 225, 195, 0.92)');
						ctx.setStrokeStyle('rgba(220, 175, 140, 0.85)');
					} else {
						// 粉橙渐变填充
						const grad = ctx.createLinearGradient(btn.x - btn.r, btn.y - btn.r, btn.x + btn.r, btn.y + btn.r);
						grad.addColorStop(0, 'rgba(255, 225, 195, 0.92)');
						grad.addColorStop(1, 'rgba(244, 200, 170, 0.92)');
						ctx.fillStyle = grad;
						ctx.strokeStyle = 'rgba(220, 175, 140, 0.85)';
					}
				} else {
					if (isLegacy) {
						ctx.setFillStyle('rgba(255, 255, 255, ' + alpha + ')');
						ctx.setStrokeStyle('rgba(180, 170, 160, ' + (alpha * 0.7) + ')');
					} else {
						ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
						ctx.strokeStyle = 'rgba(180, 170, 160, ' + (alpha * 0.7) + ')';
					}
				}
				ctx.fill();

				if (!isLegacy) {
					ctx.shadowColor = 'transparent';
					ctx.shadowBlur = 0;
				}
				if (isLegacy) {
					ctx.setLineWidth(pressed ? 1 : 0.5);
				} else {
					ctx.lineWidth = pressed ? 1 : 0.5;
				}
				ctx.stroke();

				const textColor = pressed ? 'rgba(140, 75, 20, 0.95)' : 'rgba(80, 60, 40, ' + alpha + ')';
				if (isLegacy) {
					ctx.setFillStyle(textColor);
					ctx.setTextAlign('center');
				} else {
					ctx.textAlign = 'center';
					ctx.fillStyle = textColor;
				}

				if (btn.label) {
					// 有 label 的按钮：icon + label 都在圆内
					if (isLegacy) {
						ctx.setFontSize(btn.r * 0.82);
						ctx.setTextBaseline('middle');
						ctx.fillText(btn.icon, btn.x, btn.y - 4);
						ctx.setFontSize(8);
						ctx.fillText(btn.label, btn.x, btn.y + 9);
					} else {
						ctx.font = 'bold ' + (btn.r * 0.82) + 'px sans-serif';
						ctx.textBaseline = 'middle';
						ctx.fillText(btn.icon, btn.x, btn.y - 4);
						ctx.font = '8px sans-serif';
						ctx.fillText(btn.label, btn.x, btn.y + 9);
					}
				} else {
					// 无 label 的按钮（右侧旋转）：icon 居中
					if (isLegacy) {
						ctx.setFontSize(btn.r * 0.9);
						ctx.setTextBaseline('middle');
					} else {
						ctx.font = (btn.r * 0.9) + 'px sans-serif';
						ctx.textBaseline = 'middle';
					}
					ctx.fillText(btn.icon, btn.x, btn.y);
				}

				if (!isLegacy) ctx.restore();
			});
		},

		// 检测触摸点是否命中画布按钮，命中则执行操作
		_handleCanvasButtonTap(x, y) {
			if (this.showTutorial || this.previewMaterial) return false;

			const buttons = this._getCanvasButtons();
			const HIT_TOLERANCE = 6;

			for (const btn of buttons) {
				const dx = x - btn.x;
				const dy = y - btn.y;
				const hitRadius = btn.r + HIT_TOLERANCE;
				if (dx * dx + dy * dy <= hitRadius * hitRadius) {
					if (btn.disabledWhen && btn.disabledWhen()) return true;
					// 点击高亮反馈
					this._pressedBtnId = btn.id;
					this.requestFullRedraw();
					setTimeout(() => {
						this._pressedBtnId = null;
						this.requestFullRedraw();
					}, 150);
					if (btn.args) {
						this[btn.action](...btn.args);
					} else {
						this[btn.action]();
					}
					return true;
				}
			}
			return false;
		},

		// ========== Canvas 2D 绘制（同步渲染 + requestAnimationFrame 帧调度） ==========

		// 绘制背景、绳子、logo 的通用部分
		_drawCanvasBackground(ctx, canvasW, canvasH, centerX, centerY, radius) {
			// 旧版 Canvas DPR 缩放（draw() 后状态重置，每帧需重新 scale）
			// 属性放大 buffer 后，ctx.scale 将逻辑坐标(360×300)映射到 buffer(720×600 等)
			if (this._isLegacyCanvas && this._legacyDprScale > 1) {
				ctx.scale(this._legacyDprScale, this._legacyDprScale);
			}
			ctx.clearRect(0, 0, canvasW, canvasH);

			// 旧版 Canvas API 使用 setXxx 方法，Canvas 2D 使用属性赋值
			if (this._isLegacyCanvas) {
				ctx.setFillStyle('#f7f3f0');
			} else {
				ctx.fillStyle = '#f7f3f0';
			}
			ctx.fillRect(0, 0, canvasW, canvasH);

			// 【修复】旧版 Canvas：完全跳过 save/clip，因为京东小程序的 save() 会阻断后续绘图
			if (!this._isLegacyCanvas) {
				ctx.save();
				ctx.beginPath();
				ctx.rect(0, 0, canvasW, canvasH);
				ctx.clip();
			}

			// 3层绳子效果
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			if (this._isLegacyCanvas) {
				ctx.setStrokeStyle('rgba(50, 50, 50, 0.15)');
				ctx.setLineWidth(2);
			} else {
				ctx.strokeStyle = 'rgba(50, 50, 50, 0.15)';
				ctx.lineWidth = 2;
			}
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			if (this._isLegacyCanvas) {
				ctx.setStrokeStyle(this.stringColor);
				ctx.setLineWidth(1.2);
			} else {
				ctx.strokeStyle = this.stringColor;
				ctx.lineWidth = 1.2;
			}
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			if (this._isLegacyCanvas) {
				ctx.setStrokeStyle('rgba(255, 255, 255, 0.3)');
				ctx.setLineWidth(0.5);
			} else {
				ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
				ctx.lineWidth = 0.5;
			}
			ctx.stroke();

			// Logo
			// Logo 绘制：旧版 Canvas 用路径字符串，Canvas 2D 用 Image 对象
			const logoLoaded = this._logoImageObj && (this._logoImageObj.complete || this._logoImageObj._loaded);
			const canDrawLogo = logoLoaded && (!this._isLegacyCanvas || this._logoImageObj._isPath);

			if (canDrawLogo) {
				const logoSize = 36;
				const lx = centerX - logoSize / 2;
				const ly = centerY - logoSize / 2;
				if (this._logoImageObj._isPath) {
					// 旧版 Canvas API：drawImage 接受路径字符串
					ctx.drawImage(this._logoImageObj.src, lx, ly, logoSize, logoSize);
				} else {
					// Canvas 2D：drawImage 接受 Image 对象
					ctx.drawImage(this._logoImageObj, lx, ly, logoSize, logoSize);
				}
			} else {
				// Logo 未加载时的文字回退
				if (this._isLegacyCanvas) {
					ctx.setFillStyle('#8B4513');
					ctx.setFontSize(10);
					ctx.setTextAlign('center');
					ctx.setTextBaseline('middle');
				} else {
					ctx.fillStyle = '#550000';
					ctx.font = '10px sans-serif';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
				}
				ctx.fillText('一生一石', centerX, centerY);
			}
		},

		// 拖拽帧调度：合并到下一个 requestAnimationFrame
		scheduleDragFrame() {
			if (!this._canvasReady) return;
			if (this._rafId) return; // 已有排队帧，rAF 回调时使用最新 draggedPosition
			this._rafId = this._requestAnimationFrame(() => {
				this._rafId = null;
				// 若触摸已结束、requestFullRedraw 被阻塞，优先执行全量重绘
				if (this._fullRedrawPending) {
					this._fullRedrawPending = false;
					this._drawBraceletSync();
				} else {
					this._drawDragFrameSync();
				}
			});
		},

		// 拖拽专用同步绘制（无锁、无 ctx.draw、零延迟）
		_drawDragFrameSync() {
			const cache = this._dragCache;
			if (!cache || !this._canvasReady || !this._cachedCtx) return;

			const ctx = this._cachedCtx;
			const canvasW = this.CANVAS_W;
			const canvasH = this.CANVAS_H;
			const centerX = canvasW / 2;
			const centerY = canvasH / 2;
			const radius = this.FIXED_CIRCLE_RADIUS;

			this._drawCanvasBackground(ctx, canvasW, canvasH, centerX, centerY, radius);

			// 用缓存数据绘制珠子（零计算开销）
			cache.positions.forEach((pos, index) => {
				let drawX = pos.x;
				let drawY = pos.y;
				let drawRotation = pos.rotationAngle;

				if (index === this.draggedIndex) {
					drawX = this.draggedPosition.x;
					drawY = this.draggedPosition.y;
				}

				const imgObj = cache.imageObjects[index];
				const r = pos.displayRadius;
				const beadColor = pos.item.color || '#d4a574';

				// 检查是否可以绘制图片（Canvas 2D 使用 Image 对象，旧版使用路径字符串）
				const canDraw = imgObj && (imgObj.complete || imgObj._loaded) && (!this._isLegacyCanvas || imgObj._isPath);
				if (canDraw) {
					const imageScale = pos.item.imageScale || this.imageScaleConfig.default;
					// 非吊坠配件：高>宽用 displayHeight 正方形，宽>=高用 displayWidth 正方形
					// 吊坠和珠子：用 displayHeight 正方形绘制
					// layout 层已将配件的 displayWidth === displayHeight（正方形），此处统一用正方形绘制
					const isNonPendantAccessory = pos.item && pos.item.isAccessory && !pos.isPendant;
					let imgWidth, imgHeight;
					if (isNonPendantAccessory) {
						const dim = pos.displayHeight;
						imgWidth = dim * imageScale;
						imgHeight = dim * imageScale;
					} else {
						imgWidth = pos.displayHeight * imageScale;
						imgHeight = pos.displayHeight * imageScale;
					}
					ctx.save();
					ctx.translate(drawX, drawY);
					ctx.rotate(drawRotation);
					// 旧版 Canvas API：使用路径字符串绘制；Canvas 2D：使用 Image 对象
					if (imgObj._isPath) {
						ctx.drawImage(imgObj.src, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
					} else {
						ctx.drawImage(imgObj, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
					}
					ctx.restore();
				} else {
					// 回退：绘制纯色圆形
					ctx.beginPath();
					ctx.arc(drawX, drawY, r, 0, 2 * Math.PI);
					if (this._isLegacyCanvas) {
						ctx.setFillStyle(beadColor);
					} else {
						ctx.fillStyle = beadColor;
					}
					ctx.fill();
				}
			});

			// 旧版 Canvas 跳过了 save，所以也不需要 restore
			if (!this._isLegacyCanvas) {
				ctx.restore(); // 释放裁切区域
			}
			this._drawCanvasButtons(ctx);

			// 旧版 Canvas API 需要手动调用 draw() 将绑定命令刷新到画布
			if (this._isLegacyCanvas && this._cachedCtx) {
				this._cachedCtx.draw();
			}
		},

		// 请求全量重绘（从 watcher、undo、旋转等调用）
		requestFullRedraw() {
			if (this._isExporting) return; // 导出期间不调度重绘，避免干扰当前画面
			if (!this._canvasReady) return;
			this._fullRedrawPending = true;
			if (this._rafId) return;
			this._rafId = this._requestAnimationFrame(() => {
				this._rafId = null;
				if (this._fullRedrawPending) {
					this._fullRedrawPending = false;
					this._drawBraceletSync();
				}
			});
		},

		// 全量同步绘制（非 async：图片加载不阻塞绘制，未加载时用降级圆形）
		_drawBraceletSync() {
			if (!this._canvasReady || !this._cachedCtx) return;

			const ctx = this._cachedCtx;

			// 非阻塞图片加载：后台加载缺失图片，就绪后自动刷新画布
			if (!(this._transitionFrom && this._transitionTarget)) {
				this._ensureImagesAndRefresh();
			}

			const canvasW = this.CANVAS_W;
			const canvasH = this.CANVAS_H;
			const centerX = canvasW / 2;
			const centerY = canvasH / 2;
			const radius = this.FIXED_CIRCLE_RADIUS;

			this._drawCanvasBackground(ctx, canvasW, canvasH, centerX, centerY, radius);

	
			if (this.braceletItems.length === 0) {
				ctx.restore();
				this._drawCanvasButtons(ctx);
				// 旧版 Canvas API 需要手动调用 draw() 将命令刷新到画布
				if (this._isLegacyCanvas && this._cachedCtx) {
					this._cachedCtx.draw();
				}
				return;
			}

			// 过渡期间复用缓存的目标布局
			let positions, scale;
			if (this._transitionFrom && this._transitionTarget) {
				positions = this._transitionTarget.positions;
				scale = this._transitionTarget.scale;
			} else {
				// 布局缓存：避免每帧重算（拖拽、图片加载等触发重绘时数据未变）
				const itemsKey = this.braceletItems.map(b => (b.name || '') + (b.size || '')).join(',');
				const cacheKey = itemsKey + '|' + (this.braceletRotation || 0) + '|' + this.defaultPerimeter;
				if (this._layoutCacheKey === cacheKey && this._layoutCache) {
					positions = this._layoutCache.positions;
					scale = this._layoutCache.scale;
				} else {
					const layout = computeBraceletPositions(this.braceletItems, {
						canvasSize: canvasW,
						centerX,
						centerY,
						radius: this.FIXED_CIRCLE_RADIUS,
						defaultPerimeter: this.defaultPerimeter,
						startAngle: 2 * Math.PI / 3 + (this.braceletRotation || 0),
						holeRatio: this.HOLE_RATIO,
						pendantScale: this.PENDANT_SCALE || 1.0,
					});
					scale = layout.scale;
					positions = layout.positions || [];
					this._layoutCache = { positions, scale };
					this._layoutCacheKey = cacheKey;
				}
				if (this._transitionFrom && !this._transitionTarget) {
					this._transitionTarget = { positions, scale };
				}
			}

			this.beadPositions = positions.map((p) => {
				const size = parseInt(p.item?.size);
				return { ...p, originalSize: size, scaledSize: size * scale };
			});

			// 获取 Image 对象并绘制
			this.beadPositions.forEach((pos, index) => {
				let drawX = pos.x;
				let drawY = pos.y;
				let drawRotation = pos.rotationAngle;
				let flyScale = 1; // 飞入缩放系数

				// 平滑过渡插值（已有珠子从旧位置滑到新位置）
				if (this._transitionFrom && this._transitionFrame < this._transitionTotalFrames
					&& index < this._transitionFrom.length) {
					const old = this._transitionFrom[index];
					const t = (this._transitionFrame + 1) / this._transitionTotalFrames;
					const eased = t * (2 - t); // ease-out quad
					drawX = old.x + (drawX - old.x) * eased;
					drawY = old.y + (drawY - old.y) * eased;
					drawRotation = old.rotationAngle + (drawRotation - old.rotationAngle) * eased;
				}

				// 飞入动画（新增珠子从选择面板方向旋转飞入目标位置）
				if (this._flyInIndex === index && this._flyInFrame < this._flyInTotalFrames) {
					const t = this._flyInFrame / this._flyInTotalFrames;
					const eased = 1 - (1 - t) * (1 - t); // ease-out quad
					const startX = canvasW * 0.65;   // 偏右下方，模拟从选择面板飞出
					const startY = canvasH + 40;
					drawX = startX + (pos.x - startX) * eased;
					drawY = startY + (pos.y - startY) * eased;
					flyScale = 0.15 + 0.85 * eased;  // 从 15% 放大到 100%
					// 自转 1.5 圈（3π），随接近目标逐渐减速停到目标角度
					drawRotation = pos.rotationAngle * eased + (1 - eased) * Math.PI * 3;
				}

				if (index === this.draggedIndex) {
					drawX = this.draggedPosition.x;
					drawY = this.draggedPosition.y;
				}

				const raw = (pos.item && (pos.item.imageMap || pos.item.imagePath)) || this.fallbackImage;
				const cacheKey = this.normalizeCanvasImageSrc(raw) || raw || this.fallbackImage;
				const imgObj = this._imageObjectCache[cacheKey] || null;

				// 旧版 Canvas API 必须使用路径字符串，无法使用 Image 对象
				const canDraw = imgObj && (imgObj.complete || imgObj._loaded) && (!this._isLegacyCanvas || imgObj._isPath);

				if (canDraw) {
					const imageScale = pos.item.imageScale || this.imageScaleConfig.default;
					// 非吊坠配件使用实际宽高绘制矩形，吊坠和珠子绘制正方形
					const isNonPendantAccessory = pos.item && pos.item.isAccessory && !pos.isPendant;
					const imgWidth = (isNonPendantAccessory ? pos.displayWidth : pos.displayHeight) * imageScale * flyScale;
					const imgHeight = pos.displayHeight * imageScale * flyScale;
					ctx.save();
					ctx.translate(drawX, drawY);
					ctx.rotate(drawRotation);
					// 旧版 Canvas API：使用路径字符串绘制；Canvas 2D：使用 Image 对象
					if (imgObj._isPath) {
						ctx.drawImage(imgObj.src, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
					} else {
						ctx.drawImage(imgObj, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
					}
					ctx.restore();
				} else {
					// "生成中"脉冲光环效果（替代灰色兜底）
					const r = pos.displayRadius * flyScale;
					const isFlyingIn = (this._flyInIndex === index && this._flyInFrame < this._flyInTotalFrames);

					// 旧版 Canvas API 使用简化的静态圆形占位（避免 globalAlpha 兼容问题）
					if (this._isLegacyCanvas) {
						ctx.beginPath();
						ctx.arc(drawX, drawY, r, 0, 2 * Math.PI);
						ctx.setFillStyle(pos.item.color || '#d4a574');
						ctx.fill();
					} else {
						const phase = isFlyingIn
							? (this._flyInFrame / this._flyInTotalFrames)
							: ((Date.now() % 1200) / 1200);

						ctx.save();
						ctx.translate(drawX, drawY);
						if (isFlyingIn) ctx.rotate(drawRotation);

						// 底色：半透明柔和暖色 + 呼吸脉冲
						ctx.globalAlpha = 0.35 + 0.25 * Math.sin(phase * Math.PI * 2);
						ctx.beginPath();
						ctx.arc(0, 0, r, 0, 2 * Math.PI);
						ctx.fillStyle = pos.item.color || '#d4a574';
						ctx.fill();

						// 旋转光弧：120° 弧线沿圆周旋转
						ctx.globalAlpha = 0.6;
						ctx.beginPath();
						const sweep = phase * Math.PI * 2;
						ctx.arc(0, 0, r * 0.75, sweep, sweep + Math.PI * 0.67);
						ctx.strokeStyle = 'rgba(255, 220, 185, 0.8)';
						ctx.lineWidth = r * 0.18;
						ctx.lineCap = 'round';
						ctx.stroke();

						ctx.restore();
					}

					// 静态兜底时需要持续动画帧驱动重绘
					if (!isFlyingIn) this._needPlaceholderAnim = true;
				}
			});

			// 旧版 Canvas 跳过了 save，所以也不需要 restore
			if (!this._isLegacyCanvas) {
				ctx.restore(); // 释放裁切区域
			}
			this._drawCanvasButtons(ctx);

			// 过渡帧 + 飞入帧调度
			const transitionActive = this._transitionFrom && this._transitionFrame < this._transitionTotalFrames;
			const flyInActive = this._flyInIndex >= 0 && this._flyInFrame < this._flyInTotalFrames;

			if (transitionActive || flyInActive) {
				if (transitionActive) this._transitionFrame++;
				if (flyInActive) this._flyInFrame++;

				const transDone = !this._transitionFrom || this._transitionFrame >= this._transitionTotalFrames;
				const flyDone = this._flyInIndex < 0 || this._flyInFrame >= this._flyInTotalFrames;

				if (transDone && flyDone) {
					this._transitionFrom = null;
					this._transitionTarget = null;
					this._flyInIndex = -1;
				}
				// 统一调度下一帧（动画进行中继续驱动；刚结束时补一帧让 _needPlaceholderAnim 接管）
				this._rafId = this._requestAnimationFrame(() => {
					this._rafId = null;
					this._drawBraceletSync();
				});
			}

			// 兜底"生成中"光环动画需要持续 rAF 驱动重绘
			if (this._needPlaceholderAnim && !transitionActive && !flyInActive) {
				this._needPlaceholderAnim = false;
				this._rafId = this._requestAnimationFrame(() => {
					this._rafId = null;
					this._drawBraceletSync();
				});
			}

			// 旧版 Canvas API 需要手动调用 draw() 将绑定命令刷新到画布
			if (this._isLegacyCanvas && this._cachedCtx) {
				//console.log('[bindinding] final ctx.draw() for beads');
				this._cachedCtx.draw();
			}
		},

		//加入购物车
		  async goods_cart_event() {
		    // 登录不检查 token！H5 靠 Cookie 自动认证
		    const data = {
		      goods_id: 112, //定制产品的产品ID，后续要细化成具体的珠子
		      spec: '[]',
		      stock: this.totalPrice,
		      items: JSON.stringify({ items: this.braceletItems }),
		      // 传递定制组成，便于订单&ERP拿到具体明细
		      design_parts: JSON.stringify(this.braceletItems.map(item => ({
		        ...item,
		        // 使用 sku_id 作为组件标识
		        id: item.sku_id,
		        sku_id: item.sku_id,
		        price: item.priceNum ?? item.price ?? 0,
		        priceNum: item.priceNum ?? item.price ?? 0,
		        qty: item.qty || 1,
		      })))
		    };
		
		    this._request({
		      url: app.globalData.get_request_url('save', 'cart'),
		      method: 'POST',
		      data: data,
		      success: (res) => {
		        if (res.data.code === 0) {
		          app.globalData.showToast(res.data.msg, 'success');
		          app.globalData.update_cart_total();
		          setTimeout(() => {
		            this._navigateAway(() => {
		              uni.switchTab({
		                url: '/pages/cart/cart',
		                fail: () => { this.pageHidden = false; this.requestFullRedraw(); }
		              });
		            });
		          }, 800);
		        } else {
		          // 如果返回未登录（如 code: -1001）
		          if (res.data.code === -1001 || res.data.msg.includes('登录')) {
		            // 保存待办
		            uni.setStorageSync('pending_cart_action', {
		              type: 'add_bracelet',
		              items: this.braceletItems,
		              stock: this.totalPrice,
		            });
		            this.navigateToLogin();
		          } else {
		            app.globalData.showToast(res.data.msg);
		          }
		        }
		      },
		      fail: () => {
		        app.globalData.showToast(this.$t('common.internet_error_tips'));
		      }
		    });
		  }
	}
}
</script>

<style scoped>
.bracelet-page {
  --bg-gradient-start: var(--bracelet-bg-start, #f7f3f0);
  --bg-gradient-mid: var(--bracelet-bg-mid, #f9fbff);
  --bg-gradient-end: var(--bracelet-bg-end, #f4f1f7);
  --surface-1: var(--bracelet-surface-1, #FFFFFF);
  --surface-2: var(--bracelet-surface-2, #FFFAF5);
  --surface-3: var(--bracelet-surface-3, #FFF5F0);
  --text-primary: var(--bracelet-text-primary, #5A5A5A);
  --text-secondary: var(--bracelet-text-secondary, #9E9E9E);
  --text-on-accent: #6B4E3D;
  --accent-gold-pink: #F4D4BC;
  --accent-rose-gold: #E8B8A8;
  --accent-pale-pink: #FFE8DC;
  --accent-lightest: #FFF5F0;
  --border-light: rgba(244, 212, 188, 0.2);
  --border-medium: rgba(244, 212, 188, 0.35);
  --shadow-soft: 0 4rpx 16rpx rgba(244, 212, 188, 0.12);
  --shadow-medium: 0 6rpx 20rpx rgba(244, 212, 188, 0.18);
  font-family: "SF Pro Display", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  color: var(--text-primary);
  height: 100vh;
  overflow: hidden;
}

.bracelet-shell {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f3f0;
  color: var(--text-primary);
  padding: 0 20rpx 20rpx;
  box-sizing: border-box;
}

/* 提示标签行 */
.tags-row {
  position: fixed;
  /* top 由 JS inline style (statusBarHeight) 控制 */
  left: 12rpx;
  right: 12rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8rpx;
  padding: 12rpx 0;
  background: transparent;
  backdrop-filter: none;
  border-radius: 0;
  border: none;
  box-shadow: none;
  z-index: 2;
  pointer-events: none;
  min-height: 40rpx;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  white-space: nowrap;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(248, 245, 255, 0.96));
  color: #574a44;
  border: 1rpx solid rgba(234, 228, 220, 0.9);
  box-shadow: 0 8rpx 16rpx rgba(34, 24, 18, 0.08);
}
.tag-label {
  font-size: 22rpx;
  color: #8a7c76;
}
.tag-value {
  font-size: 26rpx;
  font-weight: 600;
  color: #3c2f2a;
}

/* 预览区 */
.preview-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 0;
  padding: 0;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  min-height: 0;
}

.canvas-wrapper {
  width: 100%;
  height: 620rpx;
  max-width: 860rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  z-index: 1;
  padding: 0;
  border-radius: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  margin-top: 60rpx;
}

.bracelet-canvas {
  width: 720rpx;
  height: 600rpx;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  position: relative;
  top: -60rpx;
}
/* 淘宝 MP-ALIPAY：透明触摸捕获层，精确覆盖 canvas 的视觉区域。
   canvas 在 flex-end wrapper 里的视觉位置：
     自然 top = (620rpx - 600rpx) = 20rpx → 加 position:relative;top:-60rpx → 视觉 top = -40rpx
   touch-layer 用 absolute 定位到相同位置 */
.canvas-touch-layer {
  position: absolute;
  width: 720rpx;
  height: 600rpx;
  left: 50%;
  transform: translateX(-50%);
  top: -40rpx; /* 与 canvas 的视觉 top 一致：(620-600) + (-60) = -40rpx */
  z-index: 10;
  background: transparent;
}

.canvas-wrapper:active .bracelet-canvas {
  box-shadow: none;
}

/* 底部工具栏 */
.bottom-toolbar {
  display: flex;
  gap: 10rpx;
  position: relative;
  transform: translateY(170rpx);
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  z-index: 10;
}

.tool-item {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  padding: 6rpx 8rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(245, 243, 250, 0.72));
  border: 1rpx solid rgba(228, 221, 214, 0.65);
  backdrop-filter: blur(10rpx);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.9), 0 12rpx 22rpx rgba(24, 18, 12, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.tool-item:active {
  transform: translateY(4rpx);
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.08);
}

.tool-item.energy {
  background: linear-gradient(135deg, rgba(244, 234, 255, 0.85), rgba(226, 236, 255, 0.85));
  color: #3b2c52;
  border: 1rpx solid rgba(212, 199, 255, 0.65);
  box-shadow: 0 14rpx 26rpx rgba(113, 84, 191, 0.18);
}
.tool-item.ai-generate {
  background: linear-gradient(145deg, #7e6bef, #8b7cf8 25%, #a8a0fb 50%, #8b7cf8 75%, #6c5ce7);
  color: #ffffff;
  font-weight: 700;
  border: 1rpx solid rgba(255, 255, 255, 0.25);
  border-top: 1rpx solid rgba(255, 255, 255, 0.5);
  border-bottom: 1rpx solid rgba(108, 92, 231, 0.6);
  box-shadow: 0 12rpx 28rpx rgba(139, 124, 248, 0.45),
              0 5rpx 10rpx rgba(126, 107, 239, 0.3),
              0 2rpx 4rpx rgba(0, 0, 0, 0.12),
              inset 0 2rpx 0 rgba(255, 255, 255, 0.35),
              inset 0 -3rpx 8rpx rgba(108, 92, 231, 0.2),
              0 0 18rpx rgba(139, 124, 248, 0.3);
  text-shadow: 0 0 8rpx rgba(255, 255, 255, 0.7),
               0 0 20rpx rgba(200, 190, 255, 0.6),
               0 1rpx 2rpx rgba(50, 30, 120, 0.4);
  position: relative;
  overflow: hidden;
}
.tool-item.ai-generate .tool-text,
.tool-item.ai-generate .tool-icon {
  position: relative;
  z-index: 2;
}
.tool-item.ai-generate::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(255, 255, 255, 0.15) 60deg,
    transparent 120deg,
    rgba(200, 190, 255, 0.1) 180deg,
    transparent 240deg,
    rgba(255, 255, 255, 0.12) 300deg,
    transparent 360deg);
  animation: ai-rotate 4s linear infinite;
  pointer-events: none;
}
.tool-item.ai-generate::after {
  content: '';
  position: absolute;
  bottom: -2rpx;
  left: 10%;
  right: 10%;
  height: 4rpx;
  background: linear-gradient(90deg,
    transparent, rgba(200, 190, 255, 0.9), #fff, rgba(200, 190, 255, 0.9), transparent);
  border-radius: 4rpx;
  pointer-events: none;
  animation: ai-glow-line 2s ease-in-out infinite;
}
@keyframes ai-rotate {
  to { transform: rotate(360deg); }
}
@keyframes ai-glow-line {
  0%, 100% { opacity: 0.5; left: 10%; right: 10%; }
  50% { opacity: 1; left: 5%; right: 5%; }
}

.tool-item.complete {
  flex: 1;
  background: linear-gradient(145deg, #F0C8A8, #D8A48E, #C4907A);
  color: #ffffff;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 12rpx 28rpx rgba(196, 144, 122, 0.4),
              0 4rpx 10rpx rgba(216, 164, 142, 0.25),
              inset 0 1rpx 0 rgba(255, 255, 255, 0.45),
              inset 0 -2rpx 6rpx rgba(180, 120, 96, 0.15);
  text-shadow: 0 1rpx 2rpx rgba(120, 70, 50, 0.2);
  position: relative;
  overflow: hidden;
}
.tool-item.complete::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0) 100%);
  border-radius: 999rpx 999rpx 0 0;
  pointer-events: none;
}
/* 按压反馈（:active 即时生效） */
.tool-item.complete:active {
  transform: scale(0.93);
  opacity: 0.85;
  transition: transform 0.1s ease, opacity 0.1s ease;
}
/* 处理中状态 */
.tool-item.complete.is-processing {
  opacity: 0.7;
  pointer-events: none;
  background: linear-gradient(145deg, #ccc, #bbb);
}
.tool-item.wide {
  flex: 1.2;
}
.tool-item.compact {
  flex: 0.7;
}
.tool-item.contest {
  flex: 0 0 66rpx;
  width: 66rpx;
  height: 66rpx;
  padding: 0;
  border-radius: 50%;
  background: linear-gradient(145deg, #c9922e, #d4a044 25%, #eacc6a 50%, #d4a044 75%, #b07a1a);
  color: #fff;
  border: 1rpx solid rgba(255, 255, 255, 0.25);
  border-top: 1rpx solid rgba(255, 235, 170, 0.55);
  border-bottom: 1rpx solid rgba(140, 90, 10, 0.5);
  box-shadow:
    0 12rpx 24rpx rgba(180, 122, 26, 0.4),
    0 5rpx 10rpx rgba(0, 0, 0, 0.12),
    inset 0 2rpx 0 rgba(255, 235, 170, 0.4),
    inset 0 -3rpx 8rpx rgba(140, 90, 10, 0.25),
    0 0 16rpx rgba(234, 204, 106, 0.3);
  position: relative;
  overflow: hidden;
}
.tool-item.contest::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(255, 240, 180, 0.2) 50deg,
    transparent 100deg,
    rgba(255, 255, 255, 0.12) 180deg,
    transparent 230deg,
    rgba(255, 240, 180, 0.15) 310deg,
    transparent 360deg);
  animation: contest-rotate 5s linear infinite;
  pointer-events: none;
}
.tool-item.contest::after {
  content: '';
  position: absolute;
  bottom: -1rpx;
  left: 15%;
  right: 15%;
  height: 3rpx;
  background: linear-gradient(90deg,
    transparent, rgba(255, 235, 170, 0.9), #fff, rgba(255, 235, 170, 0.9), transparent);
  border-radius: 4rpx;
  pointer-events: none;
  animation: contest-glow-line 2.5s ease-in-out infinite;
}
@keyframes contest-rotate {
  to { transform: rotate(360deg); }
}
@keyframes contest-glow-line {
  0%, 100% { opacity: 0.4; left: 15%; right: 15%; }
  50% { opacity: 1; left: 8%; right: 8%; }
}
.contest-text {
  display: flex;
  flex-direction: column;
  gap: 0rpx;
  font-size: 16rpx;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: 1rpx;
  text-align: center;
  align-items: center;
  text-shadow: 0 0 8rpx rgba(255, 255, 255, 0.6),
               0 0 16rpx rgba(255, 235, 170, 0.5),
               0 1rpx 2rpx rgba(80, 50, 0, 0.4);
  position: relative;
  z-index: 2;
}

.tool-icon {
  font-size: 20rpx;
}

.tool-text {
  font-size: 20rpx;
  font-weight: 600;
  min-width: 0;
  line-height: 1.25;
  white-space: normal;
  word-break: break-all;
  text-align: center;
}

/* 材质选择区 */
.material-section {
  flex: 0 0 50vh;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.92);
  border: 1rpx solid #efe7e0;
  border-radius: 28rpx 28rpx 0 0;
  box-shadow: 0 18rpx 38rpx rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 3;
  transform: translateY(180rpx);
  padding-top: 4rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 50rpx);
  overflow: hidden;
}

/* 顶部统一行：L1切换 + 分类 + 搜索 */
.section-header-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 12rpx 8rpx 0;
  border-bottom: 1rpx solid #f0ebe6;
  flex-shrink: 0;
}

/* 一级标签切换器 — 宽度与下方 vertical-menu 内容区对齐 */
.level1-toggle {
  display: flex;
  align-items: center;
  background: #ebebeb;
  border-radius: 20rpx;
  padding: 4rpx;
  height: 56rpx;
  width: calc(25% - 24rpx);
  flex: 0 0 calc(25% - 24rpx);
  box-sizing: border-box;
  margin-left: 12rpx;
}
.level1-toggle-item {
  flex: 1;
  padding: 0;
  border-radius: 16rpx;
  font-size: 24rpx;
  font-weight: 500;
  text-align: center;
  color: #888;
  background: transparent;
  transition: all 0.25s ease;
  white-space: nowrap;
  height: 100%;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.level1-toggle-item.active {
  background: linear-gradient(145deg, #F4D4BC, #E8B8A8);
  color: #4a2e1e;
  font-weight: 700;
  box-shadow: 0 2rpx 8rpx rgba(232, 184, 168, 0.3);
}

/* 分类方式下拉 */
.groupby-dropdown {
  position: relative;
  flex-shrink: 0;
}
.groupby-trigger {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 0 16rpx;
  height: 56rpx;
  border-radius: 20rpx;
  background: rgba(244, 212, 188, 0.2);
  border: 1rpx solid rgba(244, 212, 188, 0.3);
  box-sizing: border-box;
  transition: all 0.2s ease;
}
.groupby-trigger:active {
  background: rgba(244, 212, 188, 0.35);
}
.groupby-label {
  font-size: 24rpx;
  font-weight: 500;
  color: #5a3e2e;
  white-space: nowrap;
  line-height: 1.5;
}
.groupby-arrow {
  font-size: 14rpx;
  color: #5a3e2e;
}
.groupby-popup {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
  border: 1rpx solid #f0ebe6;
  z-index: 20;
  min-width: 160rpx;
  overflow: hidden;
}
.groupby-option {
  padding: 14rpx 20rpx;
  font-size: 20rpx;
  color: #666;
  white-space: nowrap;
  transition: background 0.15s;
}
.groupby-option:active {
  background: #f5f5f5;
}
.groupby-option.active {
  color: #5a3e2e;
  font-weight: 600;
  background: rgba(244, 212, 188, 0.15);
}

/* 搜索区域容器 */
/* 内联搜索框（默认展开） */
.search-inline {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
  padding: 0 16rpx;
  height: 56rpx;
  box-sizing: border-box;
  border: 1rpx solid rgba(0, 0, 0, 0.04);
}
.search-icon-flat {
  font-size: 26rpx;
  color: #b08968;
  font-weight: 600;
  flex-shrink: 0;
}
.search-inline-input {
  flex: 1;
  min-width: 0;
  font-size: 22rpx;
  color: var(--text-primary);
  background: transparent;
  border: none;
  font-weight: 400;
}

.search-placeholder {
  color: var(--text-secondary);
  font-weight: 400;
}

.search-clear {
  font-size: 40rpx;
  color: var(--text-secondary);
  padding: 0 10rpx;
  line-height: 1;
  transition: color 0.2s;
  position: relative;
  z-index: 1;
}

.search-clear:active {
  color: var(--accent-rose-gold);
}

.search-close {
  font-size: 24rpx;
  font-weight: 600;
  color: var(--accent-rose-gold);
  padding: 9rpx 18rpx;
  background: linear-gradient(145deg, #FFF5ED, #FFE8DC);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  border-radius: 26rpx;
  white-space: nowrap;
  box-shadow: 0 2rpx 8rpx rgba(244, 212, 188, 0.12),
              0 1rpx 3rpx rgba(232, 184, 168, 0.08),
              inset 0 1rpx 0 rgba(255, 255, 255, 0.65),
              inset 0 -1rpx 2rpx rgba(244, 212, 188, 0.08);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.search-close::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg,
    rgba(255, 255, 255, 0.4),
    rgba(255, 255, 255, 0));
  border-radius: 26rpx 26rpx 0 0;
  pointer-events: none;
}

.search-close:active {
  background: linear-gradient(145deg, #FFE8DC, #FFD9CE);
  transform: scale(0.96);
  box-shadow: 0 1rpx 4rpx rgba(244, 212, 188, 0.1),
              inset 0 1rpx 0 rgba(255, 255, 255, 0.5),
              inset 0 1rpx 4rpx rgba(244, 212, 188, 0.12);
}


/* L3 折叠子菜单（嵌在 L2 下方） */
.l3-collapse-list {
  padding: 4rpx 0 8rpx;
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.l3-collapse-item {
  padding: 6rpx 0;
  font-size: 18rpx;
  font-weight: 400;
  color: #999;
  background: #ffffff;
  text-align: center;
  transition: all 0.15s ease;
  line-height: 1.4;
}

.l3-collapse-item.active {
  color: #5a3e2e;
  font-weight: 600;
  background: rgba(244, 212, 188, 0.35);
}

/* section 分组标题 */
.material-section-group {
  margin-bottom: 4rpx;
}
.l2-section-header {
  font-size: 26rpx;
  font-weight: 700;
  color: #5a4a6a;
  padding: 14rpx 12rpx 8rpx;
  margin-top: 8rpx;
  border-left: 6rpx solid #b8a0d0;
  background: linear-gradient(90deg, rgba(200, 180, 220, 0.15), transparent);
}
.l2-section-header:first-child {
  margin-top: 0;
}
.section-header {
  font-size: 22rpx;
  font-weight: 600;
  color: #5a3e2e;
  padding: 8rpx 12rpx 4rpx;
  background: rgba(244, 212, 188, 0.15);
  border-left: 4rpx solid #F4D4BC;
}
.load-more-hint {
  text-align: center;
  padding: 16rpx;
  font-size: 22rpx;
  color: #999;
}

.menu-content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: row;
    height: auto;
    min-height: 0; 
}

.vertical-menu {
    width: 25%;
    flex: 0 0 25%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    border-right: 1rpx solid var(--border-soft);
    box-sizing: border-box;
    overflow: hidden;
}

.vertical-menu-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 20rpx 0;
}

.vertical-scroll {
    flex: 1;
    min-height: 0;
}

.vertical-list {
    padding: 0 12rpx;
}

.vertical-item {
    margin-bottom: 10rpx;
    border-radius: 16rpx;
    transition: all 0.2s ease;
    overflow: hidden;
}

.vertical-item.level3-item {
    padding: 17rpx 12rpx;
    font-size: 24rpx;
    font-weight: 500;
    text-align: center;
    color: var(--text-secondary);
    white-space: normal;
    word-break: keep-all;
    line-height: 1.5;
    background: #f3f3f3;
    border: none;
    box-shadow: none;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.vertical-item.level3-item::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 45%;
    background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.4),
        rgba(255, 255, 255, 0));
    pointer-events: none;
}

.right-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}


.right-content .material-list {
    flex: 1;
    min-height: 0;
}

.vertical-item.level3-item.active {
    background: linear-gradient(145deg, #F4D4BC, #E8B8A8);
    color: var(--text-on-accent);
    font-weight: 700;
    text-shadow: 0 1rpx 2rpx rgba(255, 255, 255, 0.5);
    border-color: rgba(255, 255, 255, 0.35);
    box-shadow: 0 5rpx 16rpx rgba(244, 212, 188, 0.3),
                0 2rpx 7rpx rgba(232, 184, 168, 0.22),
                inset 0 1rpx 0 rgba(255, 255, 255, 0.5),
                inset 0 -2rpx 6rpx rgba(232, 184, 168, 0.16);
    transform: translateX(3rpx);
}

.vertical-item.level3-item.active::after {
    background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.55),
        rgba(255, 255, 255, 0));
}

.level3-item.active {
  background: linear-gradient(135deg, var(--accent-rose), var(--accent-blush));
  box-shadow: 0 10rpx 18rpx rgba(223, 156, 151, 0.28);
}

.material-list {
  flex: 1;
  padding: 6rpx 6rpx 200rpx;
  overflow-y: auto;
  background: linear-gradient(180deg, rgba(246, 244, 248, 0.4), rgba(255, 255, 255, 0.9));
}

.material-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(104rpx, 1fr));
  gap: 4rpx;
  animation: fadeIn 0.3s ease;
  }
  
  
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.material-card {
  background: linear-gradient(160deg, var(--surface-1), var(--surface-2));
  border: 1rpx solid #efeaf2;
  border-radius: 12rpx;
  padding: 6rpx 4rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100rpx;
  box-shadow: 0 14rpx 24rpx rgba(0, 0, 0, 0.05);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  animation: floatIn 0.4s ease;
}

.material-card:hover {
  transform: translateY(-8rpx);
  box-shadow: 0 18rpx 30rpx rgba(0, 0, 0, 0.07);
  border-color: #e7d9ff;
}

.material-card:active {
  transform: scale(0.98);
}

.material-preview {
  width: 80%;
  aspect-ratio: 1;
  border-radius: 6rpx;
  margin-bottom: 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 30% 30%, #fff5ef, #f6f3ff);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.9), 0 10rpx 18rpx rgba(0, 0, 0, 0.06);
}

.charm-display {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.accessory-preview-img {
  border-radius: 50%;
  width: 110rpx;
  height: 110rpx;
  box-shadow: 0 8rpx 14rpx rgba(255, 0, 0, 0.1);
}

.bead-preview-img {
  border-radius: 100%;
  width: 110rpx;
  height: 110rpx;
  box-shadow: 0 8rpx 14rpx rgba(255, 0, 0, 0.1);
}

.material-name {
  font-size: 24rpx;
  color: #2c2830;
  font-weight: 600;
  text-align: center;
  margin-bottom: 6rpx;
}

.material-size {
  font-size: 22rpx;
  color: #7c7685;
  text-align: center;
}

/* 细节：滚动条与响应 */
.material-list::-webkit-scrollbar {
  width: 6rpx;
}

.vertical-scroll::-webkit-scrollbar {
  width: 6rpx;
}

.material-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 999rpx;
}

.vertical-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 999rpx;
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(16rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 960px) {
  .container {
    max-width: 1180px;
    margin: 0 auto;
  }

  .canvas-wrapper {
    max-width: 920rpx;
  }
}

@media (max-width: 750px) {
  .vertical-menu {
    width: 25%;
    flex-basis: 25%;
  }

  .vertical-item.level3-item {
    font-size: 24rpx;
    padding: 14rpx 10rpx;
  }
      
  .material-grid {
    grid-template-columns: repeat(auto-fill, minmax(160rpx, 1fr));
  }
}

/* 长按预览卡片 */
.pv-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8rpx);
}
.pv-card {
  width: 600rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  overflow: hidden;
  box-shadow: 0 16rpx 60rpx rgba(0, 0, 0, 0.18), 0 0 0 1rpx rgba(255, 255, 255, 0.6) inset;
  animation: pvIn 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes pvIn {
  from { transform: scale(0.85) translateY(20rpx); opacity: 0; }
  to   { transform: scale(1) translateY(0); opacity: 1; }
}
.pv-hero {
  flex-shrink: 0;
  width: 220rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #f8f4f0 0%, #ede6df 100%);
}
.pv-img {
  width: 160rpx;
  height: 160rpx;
}
.pv-body {
  flex: 1;
  padding: 24rpx 28rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}
.pv-name {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.35;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pv-meta {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 14rpx;
}
.pv-size {
  font-size: 24rpx;
  color: #8c8c8c;
  letter-spacing: 0.5rpx;
}
.pv-dot {
  font-size: 20rpx;
  color: #ccc;
}
.pv-price {
  font-size: 28rpx;
  font-weight: 700;
  color: #cf4a2c;
  letter-spacing: -0.5rpx;
}
.pv-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}
.pv-tag {
  display: inline-block;
  font-size: 20rpx;
  padding: 4rpx 14rpx;
  border-radius: 6rpx;
  line-height: 1.5;
  letter-spacing: 0.5rpx;
}
.pv-tag--style {
  background: rgba(124, 58, 156, 0.08);
  color: #7c3a9c;
}
.pv-tag--wish {
  background: rgba(198, 122, 26, 0.08);
  color: #b06c18;
}

/* ===== 教程弹窗 ===== */
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tutorial-card {
  width: 88%;
  max-height: 78vh;
  background: #fffcfa;
  border-radius: 28rpx;
  overflow: hidden;
  box-shadow: 0 16rpx 48rpx rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
}
.tutorial-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 36rpx 24rpx;
  background: linear-gradient(135deg, #faf6f2, #f5f0fa);
  border-bottom: 1rpx solid #efe8e0;
}
.tutorial-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #3c2f2a;
  letter-spacing: 2rpx;
}
.tutorial-close {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
}
.tutorial-close-icon {
  font-size: 36rpx;
  color: #8a7c76;
  line-height: 1;
}
.tutorial-body {
  flex: 1;
  padding: 0;
  max-height: 65vh;
}
.tutorial-inner {
  padding: 24rpx 36rpx 36rpx;
}

/* -- section -- */
.tutorial-section {
  margin-bottom: 8rpx;
}
.tutorial-section-header {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 18rpx;
}
.tutorial-section-icon {
  font-size: 30rpx;
  line-height: 1;
}
.tutorial-section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #4a3c36;
  letter-spacing: 1rpx;
}
.tutorial-divider {
  height: 1rpx;
  background: linear-gradient(90deg, transparent, #e8ddd5, transparent);
  margin: 8rpx 0 20rpx;
}

/* -- list rows (基本操作 / 筛选搜索) -- */
.tutorial-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.tutorial-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 14rpx 18rpx;
  background: #fff;
  border-radius: 14rpx;
  border: 1rpx solid #f0ebe6;
}
.tutorial-badge {
  font-size: 22rpx;
  font-weight: 600;
  color: #6b4e3d;
  background: linear-gradient(135deg, #fff5ef, #f5eefc);
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  white-space: nowrap;
  flex-shrink: 0;
  line-height: 1.7;
}
.tutorial-desc {
  font-size: 24rpx;
  color: #6e635c;
  line-height: 1.7;
}

/* -- grid (工具栏) -- */
.tutorial-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}
.tutorial-grid-item {
  width: calc(33.33% - 10rpx);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  padding: 18rpx 0;
  background: #fff;
  border-radius: 14rpx;
  border: 1rpx solid #f0ebe6;
}
.tutorial-grid-icon {
  font-size: 32rpx;
  color: #7a6050;
  line-height: 1;
}
.tutorial-grid-label {
  font-size: 22rpx;
  color: #6e635c;
  line-height: 1.4;
}

/* -- tips (小贴士) -- */
.tutorial-tips {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 16rpx 20rpx;
  background: linear-gradient(135deg, #fef9f4, #f8f4fd);
  border-radius: 14rpx;
  border: 1rpx solid #f0ebe6;
}
.tutorial-tip {
  font-size: 23rpx;
  color: #6e635c;
  line-height: 1.7;
  padding-left: 24rpx;
  position: relative;
}
.tutorial-tip::before {
  content: '·';
  position: absolute;
  left: 4rpx;
  font-weight: 700;
  color: #c4a98c;
}
/* 尺寸参考表 — 左列固定 + 右侧横向滚动 */
.size-table-wrap {
  display: flex;
  border-radius: 12rpx;
  overflow: hidden;
  border: 1rpx solid #e8ddd4;
}
/* 固定身高列 */
.size-fixed-col {
  flex-shrink: 0;
  width: 80rpx;
  border-right: 1rpx solid #e0d6cc;
  z-index: 2;
}
.size-corner {
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8a7060, #a08878);
}
.size-th {
  font-size: 17rpx;
  color: #fff;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  white-space: pre-line;
}
.size-frow {
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fef9f4;
  border-top: 1rpx solid #f0e8e0;
}
.size-frow-alt {
  background: #fff;
}
.size-fc {
  font-size: 20rpx;
  font-weight: 600;
  color: #6b4e3d;
}
/* 可滚动数据区 */
.size-scroll {
  flex: 1;
  overflow: hidden;
}
.size-scroll-inner {
  display: inline-flex;
  flex-direction: column;
  min-width: 100%;
}
/* 表头行 — 体重 */
.size-hrow {
  display: flex;
  height: 60rpx;
  background: linear-gradient(135deg, #a08878, #8a7060);
}
.size-hc {
  width: 68rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19rpx;
  color: #fff;
  font-weight: 700;
}
/* 数据行 */
.size-drow {
  display: flex;
  height: 48rpx;
  background: #fff;
  border-top: 1rpx solid #f0e8e0;
}
.size-drow-alt {
  background: #faf6f2;
}
.size-dc {
  width: 68rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #5a4a3a;
}
.size-table-note {
  margin-top: 12rpx;
}
.size-table-note .tutorial-tip {
  font-size: 20rpx;
  color: #aaa;
}

.tutorial-slogan {
  margin-top: 20rpx;
  padding: 20rpx 24rpx;
  text-align: center;
  background: linear-gradient(135deg, #fdf6f0, #f6f0fa);
  border-radius: 14rpx;
  border: 1rpx solid #efe8e0;
}
.tutorial-slogan-text {
  font-size: 22rpx;
  font-weight: 700;
  color: #8a7060;
  line-height: 1.7;
  letter-spacing: 1rpx;
}

/* ========== 烟花 + 彩带庆祝特效 ========== */
.fireworks-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(ellipse at 50% 40%, rgba(80, 55, 10, 0.92), rgba(30, 18, 0, 0.9));
  z-index: 9999;
  overflow: hidden;
}

/* 中央光晕脉冲 */
.fw-glow {
  position: absolute;
  top: 35%; left: 50%;
  width: 400rpx; height: 400rpx;
  margin-left: -200rpx; margin-top: -200rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.2), rgba(255, 180, 50, 0.1), transparent 70%);
  animation: glow-pulse 2s ease-in-out infinite;
}
@keyframes glow-pulse {
  0%, 100% { transform: scale(0.8); opacity: 0.4; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

/* === 烟花 === */
.firework { position: absolute; width: 0; height: 0; }
.fw-1 { top: 15%; left: 20%; }
.fw-2 { top: 10%; left: 70%; }
.fw-3 { top: 28%; left: 50%; }
.fw-4 { top: 18%; left: 85%; }
.fw-5 { top: 32%; left: 12%; }
.fw-6 { top: 8%;  left: 45%; }

.particle {
  position: absolute;
  width: 10rpx; height: 10rpx;
  border-radius: 50%;
  opacity: 0;
  top: 0; left: 0;
  box-shadow: 0 0 6rpx currentColor;
}

/* 12 方向粒子 (R=160rpx) */
.p-1  { color: #FFD700; background: #FFD700; animation: ex-0 1.6s ease-out infinite; }
.p-2  { color: #FF6B9D; background: #FF6B9D; animation: ex-30 1.6s ease-out infinite; }
.p-3  { color: #a855f7; background: #a855f7; animation: ex-60 1.6s ease-out infinite; }
.p-4  { color: #FF4500; background: #FF4500; animation: ex-90 1.6s ease-out infinite; }
.p-5  { color: #00E5FF; background: #00E5FF; animation: ex-120 1.6s ease-out infinite; }
.p-6  { color: #FFD700; background: #FFD700; animation: ex-150 1.6s ease-out infinite; }
.p-7  { color: #FF8A65; background: #FF8A65; animation: ex-180 1.6s ease-out infinite; }
.p-8  { color: #E040FB; background: #E040FB; animation: ex-210 1.6s ease-out infinite; }
.p-9  { color: #FFFFFF; background: #FFFFFF; animation: ex-240 1.6s ease-out infinite; }
.p-10 { color: #76FF03; background: #76FF03; animation: ex-270 1.6s ease-out infinite; }
.p-11 { color: #FF6B9D; background: #FF6B9D; animation: ex-300 1.6s ease-out infinite; }
.p-12 { color: #40C4FF; background: #40C4FF; animation: ex-330 1.6s ease-out infinite; }

.fw-1 .particle { animation-delay: 0s; }
.fw-2 .particle { animation-delay: 0.5s; }
.fw-3 .particle { animation-delay: 1.0s; }
.fw-4 .particle { animation-delay: 1.5s; }
.fw-5 .particle { animation-delay: 2.0s; }
.fw-6 .particle { animation-delay: 2.5s; }

/* 12 方向爆炸 (R=160rpx) */
@keyframes ex-0   { 0% { opacity:1; transform: translate(0,0) scale(1.5); } 15% { opacity:1; } 100% { opacity:0; transform: translate(0,-160rpx) scale(0); } }
@keyframes ex-30  { 0% { opacity:1; transform: translate(0,0) scale(1.5); } 15% { opacity:1; } 100% { opacity:0; transform: translate(80rpx,-139rpx) scale(0); } }
@keyframes ex-60  { 0% { opacity:1; transform: translate(0,0) scale(1.5); } 15% { opacity:1; } 100% { opacity:0; transform: translate(139rpx,-80rpx) scale(0); } }
@keyframes ex-90  { 0% { opacity:1; transform: translate(0,0) scale(1.5); } 15% { opacity:1; } 100% { opacity:0; transform: translate(160rpx,0) scale(0); } }
@keyframes ex-120 { 0% { opacity:1; transform: translate(0,0) scale(1.5); } 15% { opacity:1; } 100% { opacity:0; transform: translate(139rpx,80rpx) scale(0); } }
@keyframes ex-150 { 0% { opacity:1; transform: translate(0,0) scale(1.5); } 15% { opacity:1; } 100% { opacity:0; transform: translate(80rpx,139rpx) scale(0); } }
@keyframes ex-180 { 0% { opacity:1; transform: translate(0,0) scale(1.5); } 15% { opacity:1; } 100% { opacity:0; transform: translate(0,160rpx) scale(0); } }
@keyframes ex-210 { 0% { opacity:1; transform: translate(0,0) scale(1.5); } 15% { opacity:1; } 100% { opacity:0; transform: translate(-80rpx,139rpx) scale(0); } }
@keyframes ex-240 { 0% { opacity:1; transform: translate(0,0) scale(1.5); } 15% { opacity:1; } 100% { opacity:0; transform: translate(-139rpx,80rpx) scale(0); } }
@keyframes ex-270 { 0% { opacity:1; transform: translate(0,0) scale(1.5); } 15% { opacity:1; } 100% { opacity:0; transform: translate(-160rpx,0) scale(0); } }
@keyframes ex-300 { 0% { opacity:1; transform: translate(0,0) scale(1.5); } 15% { opacity:1; } 100% { opacity:0; transform: translate(-139rpx,-80rpx) scale(0); } }
@keyframes ex-330 { 0% { opacity:1; transform: translate(0,0) scale(1.5); } 15% { opacity:1; } 100% { opacity:0; transform: translate(-80rpx,-139rpx) scale(0); } }

/* === 彩带 === */
.confetti {
  position: absolute;
  top: -20rpx;
  opacity: 0;
}
/* 20 条彩带：不同颜色、位置、大小、延迟 */
.c-1  { left: 5%;  width: 12rpx; height: 40rpx; background: #FFD700; border-radius: 4rpx; animation: confetti-fall 3.2s 0.1s ease-in infinite; }
.c-2  { left: 12%; width: 8rpx;  height: 32rpx; background: #FF6B9D; border-radius: 50%; animation: confetti-fall 2.8s 0.3s ease-in infinite; }
.c-3  { left: 20%; width: 14rpx; height: 6rpx;  background: #a855f7; border-radius: 2rpx; animation: confetti-fall 3.5s 0.0s ease-in infinite; }
.c-4  { left: 28%; width: 10rpx; height: 36rpx; background: #00E5FF; border-radius: 4rpx; animation: confetti-fall 3.0s 0.6s ease-in infinite; }
.c-5  { left: 35%; width: 8rpx;  height: 8rpx;  background: #FF4500; border-radius: 50%; animation: confetti-fall 2.6s 0.2s ease-in infinite; }
.c-6  { left: 42%; width: 14rpx; height: 44rpx; background: #FFD700; border-radius: 4rpx; animation: confetti-fall 3.4s 0.8s ease-in infinite; }
.c-7  { left: 50%; width: 10rpx; height: 10rpx; background: #76FF03; border-radius: 50%; animation: confetti-fall 2.9s 0.4s ease-in infinite; }
.c-8  { left: 58%; width: 12rpx; height: 38rpx; background: #E040FB; border-radius: 4rpx; animation: confetti-fall 3.1s 0.1s ease-in infinite; }
.c-9  { left: 65%; width: 8rpx;  height: 30rpx; background: #FF6B9D; border-radius: 2rpx; animation: confetti-fall 3.6s 0.7s ease-in infinite; }
.c-10 { left: 72%; width: 14rpx; height: 6rpx;  background: #FFD700; border-radius: 50%; animation: confetti-fall 2.7s 0.5s ease-in infinite; }
.c-11 { left: 80%; width: 10rpx; height: 42rpx; background: #40C4FF; border-radius: 4rpx; animation: confetti-fall 3.3s 0.2s ease-in infinite; }
.c-12 { left: 88%; width: 12rpx; height: 8rpx;  background: #FF8A65; border-radius: 2rpx; animation: confetti-fall 2.5s 0.9s ease-in infinite; }
.c-13 { left: 95%; width: 8rpx;  height: 34rpx; background: #a855f7; border-radius: 4rpx; animation: confetti-fall 3.0s 0.3s ease-in infinite; }
.c-14 { left: 8%;  width: 10rpx; height: 10rpx; background: #FFFFFF; border-radius: 50%; animation: confetti-fall 3.4s 1.0s ease-in infinite; }
.c-15 { left: 18%; width: 14rpx; height: 42rpx; background: #FFD700; border-radius: 4rpx; animation: confetti-fall 2.8s 0.6s ease-in infinite; }
.c-16 { left: 32%; width: 8rpx;  height: 6rpx;  background: #E040FB; border-radius: 2rpx; animation: confetti-fall 3.2s 1.1s ease-in infinite; }
.c-17 { left: 48%; width: 12rpx; height: 38rpx; background: #00E5FF; border-radius: 4rpx; animation: confetti-fall 2.6s 0.4s ease-in infinite; }
.c-18 { left: 62%; width: 10rpx; height: 10rpx; background: #76FF03; border-radius: 50%; animation: confetti-fall 3.5s 0.8s ease-in infinite; }
.c-19 { left: 78%; width: 14rpx; height: 44rpx; background: #FF4500; border-radius: 4rpx; animation: confetti-fall 2.9s 0.2s ease-in infinite; }
.c-20 { left: 92%; width: 8rpx;  height: 32rpx; background: #FF6B9D; border-radius: 2rpx; animation: confetti-fall 3.1s 1.2s ease-in infinite; }

@keyframes confetti-fall {
  0%   { opacity: 0; transform: translateY(0) rotate(0deg); }
  10%  { opacity: 1; }
  100% { opacity: 0.3; transform: translateY(110vh) rotate(720deg); }
}

/* === 星星闪烁 === */
.sparkle {
  position: absolute;
  width: 6rpx; height: 6rpx;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10rpx 4rpx rgba(255, 255, 255, 0.6);
  opacity: 0;
  animation: sparkle-blink 1.2s ease-in-out infinite;
}
.sp-1 { top: 12%; left: 15%; animation-delay: 0s; }
.sp-2 { top: 8%;  left: 55%; animation-delay: 0.3s; }
.sp-3 { top: 25%; left: 80%; animation-delay: 0.6s; }
.sp-4 { top: 38%; left: 35%; animation-delay: 0.9s; }
.sp-5 { top: 20%; left: 92%; animation-delay: 0.15s; }
.sp-6 { top: 5%;  left: 40%; animation-delay: 0.45s; }
.sp-7 { top: 42%; left: 65%; animation-delay: 0.75s; }
.sp-8 { top: 15%; left: 8%;  animation-delay: 1.05s; }

@keyframes sparkle-blink {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.5); }
}

/* === 成就文字 + 加载 === */
.fw-center {
  position: absolute;
  top: 42%; left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  z-index: 2;
}
.fw-title {
  font-size: 44rpx;
  font-weight: 800;
  color: #FFD700;
  text-shadow:
    0 0 20rpx rgba(255, 215, 0, 0.6),
    0 0 40rpx rgba(255, 215, 0, 0.3),
    0 4rpx 8rpx rgba(0, 0, 0, 0.4);
  letter-spacing: 4rpx;
  animation: title-appear 0.6s ease-out forwards;
}
@keyframes title-appear {
  0% { opacity: 0; transform: scale(0.5) translateY(40rpx); }
  60% { opacity: 1; transform: scale(1.1) translateY(-8rpx); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
.fw-loading-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.fw-spinner {
  width: 32rpx; height: 32rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.2);
  border-top-color: #FFD700;
  border-radius: 50%;
  animation: fw-spin 0.8s linear infinite;
}
@keyframes fw-spin { to { transform: rotate(360deg); } }
.fw-text {
  color: rgba(255, 255, 255, 0.85);
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 2rpx;
}

</style>