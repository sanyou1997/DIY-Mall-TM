<template>
  <view class="my-works" :class="theme_view" :style="{ paddingTop: (statusBarHeight + 44) + 'px' }">
    <view v-if="loading" class="loading">加载中…</view>
    <view v-else-if="list.length === 0" class="empty">暂时没有作品，先去设计一个吧～</view>
    <template v-else>
      <view class="stats-bar">
        <view class="stat-item">
          <view class="stat-label">作品数</view>
          <view class="stat-value">{{ list.length }}</view>
        </view>
        <view class="divider"></view>
        <view class="stat-item">
          <view class="stat-label">估价合计</view>
          <view class="stat-value">¥{{ totalPrice }}</view>
        </view>
        <view class="stats-action">
          <button class="mini-btn ghost back-mini" @click="goDesign">返回设计</button>
        </view>
      </view>
      <scroll-view
        scroll-y
        class="list"
        enable-back-to-top
        @scrolltolower="loadMore"
        lower-threshold="120"
      >
        <view
          v-for="item in list"
          :key="item.id"
          class="work-row"
          @click="openWork(item)"
        >
          <view class="work-main">
          <!-- 缩略图：优先加载服务端 image_url。失败时 fallback 到组件用 design_parts 重绘，
               避免在淘宝白名单拦截/文件缺失/网络超时的情况下白板。 -->
          <view class="thumb-wrap">
            <image
              v-if="!thumbFailed(item) && item.image_url"
              class="thumb"
              :src="item.image_url"
              mode="aspectFill"
              @error="onThumbError(item)"
            ></image>
            <bracelet-thumbnail
              v-else
              :parts="item.design_parts || []"
              :size="180"
              :ring-width-rpx="1"
            ></bracelet-thumbnail>
          </view>
          <view class="info">
              <view class="title-row">
                <view class="title-actions">
            <view class="title">{{ item.title || '我的手串' }}</view>
                  <image
                    class="title-edit-icon"
                    mode="aspectFit"
                    src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%238a6f3d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 20h9'/><path d='M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z'/></svg>"
                    @click.stop="openEditTitle(item)"
                  ></image>
                </view>
                <view class="price">¥{{ formatPrice(item.price) }}</view>
              </view>
              <view class="meta counts" v-if="getPartCounts(item.design_parts).total">
                <text>珠子 {{ getPartCounts(item.design_parts).beads }}</text>
                <text> · 配件 {{ getPartCounts(item.design_parts).accessories }}</text>
            </view>
              <scroll-view
                v-if="formatParts(item.design_parts).length"
                class="parts-scroll"
                scroll-x
                show-scrollbar="false"
              >
                <view class="parts">
              <view
                v-for="(chip, idx) in formatParts(item.design_parts)"
                :key="idx"
                class="chip"
              >
                {{ chip }}
              </view>
            </view>
              </scroll-view>
            <view class="time" v-if="item.updated_at">更新 {{ item.updated_at }}</view>
          <view class="row-actions">
                <button class="mini-btn ghost" @click.stop="deleteWork(item)">删除</button>
                <button class="mini-btn contest" @click.stop="openContest(item)">参赛</button>
            <button class="mini-btn primary" @click.stop="orderWork(item)">下单</button>
              </view>
            </view>
          </view>
        </view>
        <view class="load-more" v-if="loadingMore">加载中…</view>
        <view class="load-more" v-else-if="noMore && list.length">已显示全部</view>
      </scroll-view>
      <view class="bottom-bar" v-if="list.length">
        <button class="back-btn" @click="goDesign">返回设计界面</button>
      </view>
    </template>

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
              placeholder="不超过8个字"
              @input="onContestTitleInput"
            />
          </view>
          <view class="contest-field">
            <text class="contest-label">作者</text>
            <input
              class="contest-input"
              type="text"
              :value="contestAuthor"
              placeholder="不超过8个字"
              @input="onContestAuthorInput"
            />
          </view>
          <view class="contest-actions">
            <button class="mini-btn ghost" @tap="closeContestForm">取消</button>
            <button class="mini-btn primary" @tap="submitContest">确认参赛</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 作品名称编辑弹层 -->
    <view v-if="editVisible" class="contest-modal">
      <view class="contest-card">
        <view class="contest-header">
          <text class="contest-title">编辑作品名称</text>
          <text class="contest-close" @tap="closeEditTitle">✕</text>
        </view>
        <view class="contest-body">
          <view class="contest-field">
            <text class="contest-label">作品名称</text>
            <input
              class="contest-input"
              type="text"
              :value="editTitle"
              maxlength="20"
              placeholder="请输入作品名称"
              @input="(e) => editTitle = e.detail.value"
            />
          </view>
          <view class="contest-actions">
            <button class="mini-btn ghost" @tap="closeEditTitle">取消</button>
            <button class="mini-btn primary" @tap="submitEditTitle">保存</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// #ifdef MP-ALIPAY
import { taobaoRequest } from '@/common/js/taobao-cloud.js';
// #endif
const app = getApp();
export default {
  data() {
    return {
      theme_view: '',
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight || 0,
      loading: true,
      list: [],
      page: 1,
      page_size: 50,
      defaultThumb: '/static/logo/logo.png',
      loadingMore: false,
      noMore: false,
      contestVisible: false,
      contestTitle: '',
      contestAuthor: '',
      contestWork: null,
      editVisible: false,
      editTitle: '',
      editWork: null,
      // 记录 <image> 加载失败的作品 id，失败后切换到 bracelet-thumbnail DOM 重绘
      // 不能用下划线开头（Vue 2 下 `_` / `$` 前缀的 data 字段不会被响应式代理）
      thumbFailedIds: {},
    };
  },
  onShow() {},
  onLoad() {
    try {
      this.theme_view = app?.globalData?.get_theme_value_view?.() || '';
    } catch (e) {
      this.theme_view = '';
    }
    this.fetchList();
  },
  onPullDownRefresh() {
    this.fetchList(true);
  },
  methods: {
    handleNeedLogin() {
      // #ifdef MP-ALIPAY
      // 淘宝：静默云登录后重新加载
      const cloud = app?.cloud || app?.globalData?.cloud;
      if (cloud && cloud.application) {
        app.globalData.taobao_cloud_login(this, 'loadList', {}, {});
        return;
      }
      // #endif
      uni.navigateTo({ url: '/pages/login/login' });
    },
    thumbFailed(item) {
      const id = item && (item.id || item.work_id);
      return !!(id && this.thumbFailedIds && this.thumbFailedIds[id]);
    },
    onThumbError(item) {
      const id = item && (item.id || item.work_id);
      if (!id) return;
      if (!this.thumbFailedIds) this.thumbFailedIds = {};
      if (this.thumbFailedIds[id]) return;
      // 触发响应式更新：重建对象（Vue 2 下必须替换引用）
      this.thumbFailedIds = { ...this.thumbFailedIds, [id]: true };
      console.warn('[my-works] 缩略图加载失败, work_id=', id, '切换到 DOM 重绘');
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
    fetchList(isPull = false) {
      if (isPull) {
        this.page = 1;
        this.noMore = false;
      }
      if (this.noMore && !isPull) return;
      if (isPull) {
        this.loading = true;
      } else {
        this.loadingMore = true;
      }
      this._request({
        url: app.globalData.get_request_url('lists', 'braceletworks'),
        method: 'GET',
        data: {
          page: this.page,
          page_size: this.page_size,
          ...this.getCommonParams(),
        },
        withCredentials: true,
        success: (res) => {
          if (res.data && res.data.code === 0 && res.data.data) {
            const newList = res.data.data.list || [];
            if (this.page === 1) {
              this.list = newList;
            } else {
              this.list = this.list.concat(newList);
            }
            // 判断是否还有更多
            if (!newList.length || newList.length < this.page_size) {
              this.noMore = true;
            } else {
              this.page += 1;
            }
          } else if (res.data && (res.data.code === -1001 || (res.data.msg || '').includes('登录'))) {
            this.handleNeedLogin();
          } else {
            app.globalData.showToast(res.data.msg || '加载失败');
          }
        },
        fail: () => app.globalData.showToast(this.$t('common.internet_error_tips')),
        complete: () => {
          this.loading = false;
          this.loadingMore = false;
          if (isPull) uni.stopPullDownRefresh();
        },
      });
    },
    formatPrice(val) {
      const num = Number(val) || 0;
      return num.toFixed(2);
    },
    normalizeParts(parts) {
      if (!parts) return [];
      if (Array.isArray(parts)) return parts;
      let text = String(parts || '').trim();
      if (!text) return [];
      text = text.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      try {
        let parsed = JSON.parse(text);
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed); } catch (e2) { /* ignore */ }
        }
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    },
    formatParts(parts) {
      const list = this.normalizeParts(parts);
      if (!Array.isArray(list) || list.length === 0) return [];
      const map = {};
      list.forEach((p) => {
        const sizeLabel = p.sizeLabel || p.size || '';
        const key = `${p.name || ''}|${sizeLabel}|${p.category || ''}`;
        if (!map[key]) {
          map[key] = {
            name: p.name || '',
            size: sizeLabel,
            category: p.category || '',
            qty: 0,
          };
        }
        map[key].qty += Number(p.qty) || 1;
      });
      return Object.values(map)
        .map((it) => `${it.name} ${it.size} ×${it.qty}`);
    },
    getPartCounts(parts) {
      const list = this.normalizeParts(parts);
      let beads = 0;
      let accessories = 0;
      list.forEach((p) => {
        const qty = Number(p.qty) || 1;
        if (p && p.isAccessory) {
          accessories += qty;
        } else {
          beads += qty;
        }
      });
      return { beads, accessories, total: beads + accessories };
    },
    openWork(item) {
      const workId = item.id || item.work_id;
      if (!workId) {
        app.globalData.showToast('缺少作品ID');
        return;
      }
      uni.navigateTo({
        url: `/pages/bracelet-sub/work-detail?work_id=${workId}`,
        success: (res) => {
          if (res.eventChannel) {
            // 传递基础数据用于快速展示，work-detail 仍会按需请求详情
            res.eventChannel.emit('work-data', {
              work_id: workId,
              design_title: item.title,
              design_desc: item.desc,
              design_price: item.price,
              design_parts: item.design_parts || [],
              image_url: item.image_url,
              design_image_url: item.image_url,
            });
          }
        },
      });
    },
    loadMore() {
      if (this.loading || this.loadingMore || this.noMore) return;
      this.fetchList(false);
    },
    orderWork(item) {
      const workId = item.id || item.work_id;
      if (!workId) {
        app.globalData.showToast('缺少作品ID');
        return;
      }
      // 直接进入 work-detail，用户可在详情页下单
      uni.navigateTo({
        url: `/pages/bracelet-sub/work-detail?work_id=${workId}`,
        success: (res) => {
          if (res.eventChannel) {
            res.eventChannel.emit('work-data', {
              work_id: workId,
              design_title: item.title,
              design_desc: item.desc,
              design_price: item.price,
              design_parts: item.design_parts || [],
              image_url: item.image_url,
              design_image_url: item.image_url,
            });
          }
        }
      });
    },
    openContest(item) {
      if (!item) return;
      this.contestWork = item;
      this.contestTitle = item.title || '我的手串';
      this.contestAuthor = this.getCurrentUserName() || '匿名';
      this.contestVisible = true;
    },
    closeContestForm() {
      this.contestVisible = false;
    },
    submitContest() {
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
      const item = this.contestWork;
      if (!item) {
        app.globalData.showToast('缺少参赛作品');
        return;
      }
      const workId = item.id || item.work_id;
      if (!workId) {
        app.globalData.showToast('缺少作品ID');
        return;
      }
      const imageUrl = item.image_url || '';
      // 淘宝小程序下 image_url 可能为空（canvas 截图受限），
      // 允许空 image_url 参赛，contest 列表用 design_parts DOM 重绘显示缩略图。
      if (!imageUrl && (!item.design_parts || (Array.isArray(item.design_parts) && item.design_parts.length === 0))) {
        app.globalData.showToast('作品数据异常，无法参赛');
        return;
      }
      this._request({
        url: app.globalData.get_request_url('join', 'braceletcontest'),
        method: 'POST',
        data: {
          work_id: workId,
          title,
          price: Number(item.price || 0),
          image_url: imageUrl,
          author,
          ...this.getCommonParams(),
        },
        withCredentials: true,
        success: (res) => {
          if (res.data && res.data.code === 0) {
            const entryId = res.data.data && res.data.data.entry_id;
            this.contestVisible = false;
            uni.navigateTo({
              url: `/pages/bracelet-sub/contest?highlight_id=${encodeURIComponent(entryId || '')}`,
            });
          } else if (res.data && (res.data.code === -1001 || (res.data.msg || '').includes('登录'))) {
            this.handleNeedLogin();
          } else {
            app.globalData.showToast((res.data && res.data.msg) || '参赛失败');
          }
        },
        fail: () => app.globalData.showToast(this.$t('common.internet_error_tips')),
      });
    },
    openEditTitle(item) {
      if (!item) return;
      this.editWork = item;
      this.editTitle = item.title || '我的手串';
      this.editVisible = true;
    },
    closeEditTitle() {
      this.editVisible = false;
    },
    submitEditTitle() {
      const title = (this.editTitle || '').trim();
      if (!title) {
        app.globalData.showToast('请输入作品名称');
        return;
      }
      const item = this.editWork;
      if (!item) {
        app.globalData.showToast('缺少作品');
        return;
      }
      const workId = item.id || item.work_id;
      if (!workId) {
        app.globalData.showToast('缺少作品ID');
        return;
      }
      const parts = this.normalizeParts(item.design_parts);
      this._request({
        url: app.globalData.get_request_url('save', 'braceletworks'),
        method: 'POST',
        data: {
          work_id: workId,
          design_title: title,
          design_desc: item.desc || item.design_desc || '',
          design_price: Number(item.price || 0),
          design_parts: JSON.stringify(parts || []),
          design_image_url: item.image_url || '',
          ...this.getCommonParams(),
        },
        withCredentials: true,
        success: (res) => {
          if (res.data && res.data.code === 0) {
            item.title = title;
            this.editVisible = false;
            app.globalData.showToast('已更新', 'success');
          } else if (res.data && (res.data.code === -1001 || (res.data.msg || '').includes('登录'))) {
            this.handleNeedLogin();
          } else {
            app.globalData.showToast((res.data && res.data.msg) || '更新失败');
          }
        },
        fail: () => app.globalData.showToast(this.$t('common.internet_error_tips')),
      });
    },
    deleteWork(item) {
      const workId = item.id || item.work_id;
      if (!workId) {
        app.globalData.showToast('缺少作品ID');
        return;
      }
      uni.showModal({
        title: '删除作品',
        content: '确定要删除该作品吗？删除后不可恢复。',
        success: (res) => {
          if (!res.confirm) return;
          this._request({
            url: app.globalData.get_request_url('delete', 'braceletworks'),
            method: 'POST',
            data: {
              work_id: workId,
              ...this.getCommonParams(),
            },
            withCredentials: true,
            success: (resp) => {
              if (resp.data && resp.data.code === 0) {
                this.list = this.list.filter((w) => (w.id || w.work_id) !== workId);
                app.globalData.showToast(resp.data.msg || '已删除', 'success');
              } else if (resp.data && (resp.data.code === -1001 || (resp.data.msg || '').includes('登录'))) {
                this.handleNeedLogin();
              } else {
                app.globalData.showToast((resp.data && resp.data.msg) || '删除失败');
              }
            },
            fail: () => app.globalData.showToast(this.$t('common.internet_error_tips')),
          });
        }
      });
    },
    goDesign() {
      // bracelet 页面为 tabbar，使用 switchTab
      uni.switchTab({
        url: '/pages/bracelet/bracelet',
        fail: () => {
          uni.navigateTo({ url: '/pages/bracelet/bracelet' });
        }
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
    getCurrentUserName() {
      const user = app?.globalData?.user || app?.globalData?.user_info || {};
      return user.nick_name || user.nickname || user.user_name || user.username || '';
    },
    getCommonParams() {
      const cachedUser = uni.getStorageSync(app?.globalData?.data?.cache_user_info_key || 'cache_shop_user_info_key') || {};
      const token = app?.globalData?.token
        || app?.globalData?.user_token
        || app?.globalData?.user?.token
        || app?.globalData?.user_info?.token
        || cachedUser.token
        || uni.getStorageSync('token')
        || uni.getStorageSync('user_token')
        || uni.getStorageSync('user_token_value')
        || '';
      const params = {
        application: 'app',
        application_client_type: app?.globalData?.application_client_type?.() || app?.globalData?.client_type || 'h5',
        ajax: 'ajax',
      };
      if (token) {
        params.token = token;
      }
      return params;
    },
  },
  computed: {
    totalPrice() {
      const sum = this.list.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
      return sum.toFixed(2);
    }
  }
};
</script>

<style scoped>
.my-works {
  min-height: 100vh;
  background: radial-gradient(circle at top, #fbfaf7 0%, #f6f3ef 45%, #f3f1ee 100%);
  padding: 20rpx 18rpx 28rpx;
  box-sizing: border-box;
  color: #2e2a25;
  font-family: "Inter", "Lora", "Playfair Display", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}
.loading,
.empty {
  padding: 100rpx 20rpx;
  text-align: center;
  color: rgba(46, 42, 37, 0.55);
}
.list {
  max-height: calc(100vh - 230rpx);
  padding-bottom: 48rpx;
}
.work-row {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  padding: 20rpx;
  margin-bottom: 18rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  border: 1rpx solid rgba(200, 164, 92, 0.18);
  box-shadow: 0 20rpx 42rpx rgba(46, 42, 37, 0.08);
  transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
}
.work-main {
  display: flex;
  gap: 18rpx;
  align-items: stretch;
}
.work-row:hover {
  transform: translateY(-4rpx) scale(1.01);
  border-color: rgba(200, 164, 92, 0.45);
  box-shadow: 0 28rpx 56rpx rgba(46, 42, 37, 0.16);
}
.thumb-wrap {
  width: 230rpx;
  height: 230rpx;
  border-radius: 20rpx;
  background: #f3f1ee;
  flex-shrink: 0;
  border: 1rpx solid rgba(200, 164, 92, 0.18);
  box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.6);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb-wrap .thumb,
.thumb-wrap > image {
  width: 100%;
  height: 100%;
  display: block;
}
.thumb {
  width: 230rpx;
  height: 230rpx;
  border-radius: 20rpx;
  background: #f3f1ee;
  flex-shrink: 0;
  border: 1rpx solid rgba(200, 164, 92, 0.18);
  box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.6);
}
.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  min-width: 0;
  min-height: 230rpx;
  max-height: 230rpx;
  overflow: hidden;
}
.title-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12rpx;
}
.title-actions {
  display: flex;
  align-items: center;
  gap: 8rpx;
  min-width: 0;
}
.price {
  color: #b8914e;
  font-size: 26rpx;
  font-weight: 600;
  white-space: nowrap;
}
.title-edit-icon {
  width: 28rpx;
  height: 28rpx;
  opacity: 0.85;
}
.row-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10rpx;
  margin-top: auto;
}
.mini-btn {
  flex: 1;
  min-width: 0;
  height: 56rpx;
  line-height: 56rpx;
  border-radius: 999rpx;
  border: 1rpx solid rgba(200, 164, 92, 0.35);
  font-size: 21rpx;
  padding: 0 12rpx;
  background: rgba(255, 255, 255, 0.8);
  color: #6b5b3e;
  letter-spacing: 1rpx;
  box-shadow: 0 10rpx 20rpx rgba(46, 42, 37, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.mini-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 6rpx 12rpx rgba(46, 42, 37, 0.12);
}
.mini-btn.primary {
  background: linear-gradient(135deg, #e2c273, #c59a52);
  color: #fffaf2;
  border: none;
  box-shadow: 0 16rpx 30rpx rgba(184, 145, 78, 0.35);
}
.mini-btn.contest {
  background: linear-gradient(135deg, rgba(178, 137, 69, 0.95), rgba(138, 99, 47, 0.95));
  color: #fffaf2;
  border: none;
  box-shadow: 0 14rpx 26rpx rgba(148, 102, 46, 0.28);
}
.mini-btn.ghost {
  background: rgba(255, 255, 255, 0.92);
  color: #8a6f3d;
  border: 1rpx solid rgba(200, 164, 92, 0.45);
  box-shadow: 0 10rpx 18rpx rgba(46, 42, 37, 0.08);
}
.title {
  font-size: 28rpx;
  font-weight: 600;
  color: #2d2721;
  letter-spacing: 1rpx;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta {
  color: #c3a06a;
  font-size: 21rpx;
  letter-spacing: 1rpx;
}
.meta.counts {
  color: rgba(46, 42, 37, 0.6);
}
.parts-scroll {
  margin-top: 6rpx;
  max-width: 100%;
}
.parts {
  display: inline-flex;
  gap: 10rpx;
  white-space: nowrap;
}
.chip {
  padding: 6rpx 14rpx;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(247, 242, 234, 0.95));
  border-radius: 999rpx;
  color: rgba(77, 59, 30, 0.82);
  font-size: 20rpx;
  border: 1rpx solid rgba(200, 164, 92, 0.35);
  box-shadow: 0 8rpx 16rpx rgba(46, 42, 37, 0.12);
}
.time {
  color: rgba(46, 42, 37, 0.5);
  font-size: 20rpx;
  letter-spacing: 1rpx;
}
.load-more {
  text-align: center;
  padding: 24rpx;
  color: rgba(46, 42, 37, 0.45);
  font-size: 22rpx;
  letter-spacing: 1rpx;
}
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 22rpx;
  margin-bottom: 18rpx;
  background: rgba(255, 255, 255, 0.88);
  border-radius: 20rpx;
  border: 1rpx solid rgba(200, 164, 92, 0.22);
  box-shadow: 0 18rpx 36rpx rgba(46, 42, 37, 0.08);
}
.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  text-align: center;
}
.stat-label {
  color: rgba(46, 42, 37, 0.55);
  font-size: 22rpx;
  letter-spacing: 1rpx;
}
.stat-value {
  color: #b8914e;
  font-size: 34rpx;
  font-weight: 600;
  letter-spacing: 1rpx;
}
.divider {
  width: 1rpx;
  height: 64rpx;
  background: linear-gradient(180deg, transparent, rgba(200, 164, 92, 0.6), transparent);
  margin: 0 12rpx;
}
.stats-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  margin-left: 12rpx;
}
.back-mini {
  min-width: 128rpx;
  height: 54rpx;
  line-height: 54rpx;
  font-size: 20rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, rgba(248, 232, 200, 0.95), rgba(202, 169, 108, 0.95));
  color: #3a2b19;
  border: 1rpx solid rgba(188, 148, 78, 0.6);
  box-shadow:
    inset 0 1rpx 2rpx rgba(255, 255, 255, 0.8),
    0 10rpx 18rpx rgba(148, 102, 46, 0.22);
}
.bottom-bar {
  position: relative;
  padding: 12rpx 0 8rpx;
  background: transparent;
  box-shadow: none;
  display: flex;
  justify-content: center;
}
.back-btn {
  width: 100%;
  max-width: 720rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: linear-gradient(135deg, #d8b66a, #b8914e);
  color: #fffaf2;
  border: none;
  border-radius: 18rpx;
  font-size: 26rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  border: 1rpx solid rgba(200, 164, 92, 0.5);
  box-shadow: 0 18rpx 34rpx rgba(184, 145, 78, 0.28);
}
.contest-modal { position: fixed; left: 0; top: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 24rpx; }
.contest-card { background: #fff; border-radius: 16rpx; width: 90%; max-width: 640rpx; padding: 16rpx; box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.14); }
.contest-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10rpx; }
.contest-title { font-size: 28rpx; font-weight: 600; }
.contest-close { font-size: 30rpx; color: #666; }
.contest-body { display: flex; flex-direction: column; gap: 10rpx; }
.contest-field { display: flex; flex-direction: column; gap: 6rpx; }
.contest-label { font-size: 22rpx; color: #6f6a7b; }
.contest-input { height: 60rpx; border-radius: 10rpx; padding: 0 12rpx; border: 1rpx solid #eee9f4; background: #faf9fd; font-size: 24rpx; }
.contest-actions { display: flex; gap: 10rpx; margin-top: 4rpx; }
.contest-actions .mini-btn { min-width: 140rpx; height: 56rpx; line-height: 56rpx; font-size: 22rpx; }
</style>
