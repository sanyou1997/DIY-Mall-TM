<template>
  <view class="contest-page" :class="theme_view">
    <view class="header">
      <view class="header-top">
        <view class="title-group">
          <view class="title">设计大赛</view>
          <text class="title-sub">热门作品享2%分红及现金大奖</text>
        </view>
        <button class="join-btn" @tap.stop="goDesign" @click="goDesign">点击参与DIY设计</button>
      </view>
      <view class="section-divider">
        <text>活动说明</text>
      </view>
      <view class="header-note">
        <text class="subtitle">每人每日可投参赛作品一票，月度结算，支持评论拉票</text>
      </view>
      <view class="sort-row">
        <button class="sort-btn" :class="{ active: sortMode === 'votes' }" @tap="setSort('votes')">按点赞</button>
        <button class="sort-btn" :class="{ active: sortMode === 'time' }" @tap="setSort('time')">按时间</button>
      </view>
    </view>

    <scroll-view class="list" scroll-y>
      <view v-if="!sortedEntries.length" class="empty">暂无参赛作品</view>
      <view class="grid">
        <view
          v-for="entry in sortedEntries"
          :key="entry.id"
          class="card"
          :class="{ highlight: highlightId === entry.id }"
        >
          <view class="card-main">
            <!-- 缩略图：优先加载服务端 image_url，失败时用 bracelet-thumbnail 组件重绘 -->
            <view class="thumb-wrap">
              <image
                v-if="!thumbFailed(entry) && entry.image_url"
                class="thumb"
                :src="entry.image_url"
                mode="aspectFill"
                @error="onThumbError(entry)"
              ></image>
              <bracelet-thumbnail
                v-else
                :parts="entry.design_parts || []"
                :size="180"
                :ring-width-rpx="1"
              ></bracelet-thumbnail>
            </view>
            <view class="info">
              <view class="name-row">
                <view class="name">{{ entry.title }}</view>
                <view class="stats-inline">
                  <text class="votes">👍 {{ entry.votes }}</text>
                  <text class="stat-dot">·</text>
                  <text class="comments-count">💬 {{ entry.comments.length }}</text>
                </view>
              </view>
              <view class="meta">
                <text class="author">作者 {{ entry.author }}</text>
                <text class="dot">·</text>
                <text class="time">{{ formatTime(entry.created_at) }}</text>
              </view>
              <view class="action-buttons">
                <button class="vote-btn" :disabled="!canVote(entry)" @tap="vote(entry)">
                  {{ canVote(entry) ? '投一票' : '今日已投' }}
                </button>
                <button class="copy-btn" @tap="openWorkDetail(entry)">做同款</button>
              </view>
            </view>
          </view>

          <view class="comments">
            <view class="comments-title">评论</view>
            <view v-if="!entry.comments.length" class="comment-empty">暂无评论</view>
            <scroll-view v-else class="comment-list" scroll-y>
              <view v-for="c in entry.comments" :key="c.id" class="comment-item">
                <text class="comment-user">{{ c.user }}</text>
                <text class="comment-content">{{ c.content }}</text>
              </view>
            </scroll-view>
            <view class="comment-input">
              <input
                class="input"
                type="text"
                placeholder="说点什么吧…"
                :value="commentDrafts[entry.id] || ''"
                @input="onCommentInput(entry.id, $event)"
              />
              <button class="send-btn" @tap="sendComment(entry)">发送</button>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
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
      entries: [],
      sortMode: 'votes',
      commentDrafts: {},
      highlightId: '',
      loading: false,
      // 记录 <image> 加载失败的作品 id，失败后切到 bracelet-thumbnail DOM 重绘
      // 不能用下划线开头（Vue 2 下 `_` / `$` 前缀的 data 字段不会被响应式代理）
      thumbFailedIds: {},
      // 记录正在拉 detail 的 entry id，避免重复请求
      detailFetchingIds: {},
    };
  },
  onShow() {},
  onLoad(options) {
    try {
      this.theme_view = app?.globalData?.get_theme_value_view?.() || '';
    } catch (e) {
      this.theme_view = '';
    }
    this.highlightId = options.highlight_id || '';
    this.loadEntries();
  },
  onPullDownRefresh() {
    this.loadEntries(true);
    uni.stopPullDownRefresh();
  },
  computed: {
    sortedEntries() {
      const list = (this.entries || []).slice();
      if (this.sortMode === 'time') {
        return list.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
      }
      return list.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    },
  },
  methods: {
    thumbFailed(entry) {
      const id = entry && entry.id;
      return !!(id && this.thumbFailedIds && this.thumbFailedIds[id]);
    },
    onThumbError(entry) {
      const id = entry && entry.id;
      if (!id) return;
      if (!this.thumbFailedIds) this.thumbFailedIds = {};
      if (this.thumbFailedIds[id]) return;
      this.thumbFailedIds = { ...this.thumbFailedIds, [id]: true };
      console.warn('[contest] 缩略图加载失败, id=', id, '切换到 DOM 重绘');
      // 如果列表接口没返 design_parts，按需拉一次 detail 补上（contest/lists 目前不返）
      if (!Array.isArray(entry.design_parts) || entry.design_parts.length === 0) {
        this.ensureDesignPartsLoaded(entry);
      }
    },
    ensureDesignPartsLoaded(entry) {
      const workId = entry && entry.work_id;
      if (!workId) return;
      if (this.detailFetchingIds[workId]) return; // 已在拉
      this.detailFetchingIds = { ...this.detailFetchingIds, [workId]: true };
      console.log('[contest] 拉取 work_id=', workId, '的 detail 以获取 design_parts');
      this._request({
        url: app.globalData.get_request_url('detail', 'braceletworks'),
        method: 'GET',
        data: {
          work_id: workId,
          ...this.getCommonParams(),
        },
        withCredentials: true,
        success: (res) => {
          if (res.data && res.data.code === 0 && res.data.data) {
            const parts = res.data.data.design_parts;
            if (Array.isArray(parts) && parts.length) {
              // 找到对应 entry 更新 design_parts，触发 bracelet-thumbnail 重绘
              const idx = this.entries.findIndex((e) => e.id === entry.id);
              if (idx >= 0) {
                const next = [...this.entries];
                next[idx] = { ...next[idx], design_parts: parts };
                this.entries = next;
                console.log('[contest] work_id=', workId, '的 design_parts 已补齐, 长度:', parts.length);
              }
            } else {
              console.warn('[contest] work_id=', workId, 'detail 响应里 design_parts 也为空');
            }
          } else {
            console.warn('[contest] 拉取 detail 失败:', res && res.data);
          }
        },
        fail: (err) => {
          console.error('[contest] 拉取 detail 请求失败:', err);
        },
        complete: () => {
          const next = { ...this.detailFetchingIds };
          delete next[workId];
          this.detailFetchingIds = next;
        },
      });
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
    goDesign() {
      // bracelet 是 tab 页，使用 switchTab 更稳
      uni.switchTab({
        url: '/pages/bracelet/bracelet',
        fail: () => {
          uni.navigateTo({ url: '/pages/bracelet/bracelet' });
        }
      });
    },
    loadEntries(isPull = false) {
      this.loading = true;
      this._request({
        url: app.globalData.get_request_url('lists', 'braceletcontest'),
        method: 'GET',
        data: {
          sort: this.sortMode,
          page: 1,
          page_size: 50,
          ...this.getCommonParams(),
        },
        withCredentials: true,
        success: (res) => {
          if (res.data && res.data.code === 0 && res.data.data) {
            const list = res.data.data.list || [];
            this.entries = list.map((item) => ({
              id: item.id,
              work_id: item.work_id || '',
              title: item.title || '我的手串',
              price: Number(item.price || 0),
              image_url: item.image_url || '',
              // design_parts 用于 <image> 加载失败时本地 DOM 重绘
              design_parts: Array.isArray(item.design_parts) ? item.design_parts : [],
              author: item.author || '匿名',
              created_at: item.created_at || Date.now(),
              votes: Number(item.votes || 0),
              comments: Array.isArray(item.comments) ? item.comments : [],
              voted_today: Number(item.voted_today || 0),
            }));
          } else {
            app.globalData.showToast((res.data && res.data.msg) || '加载失败');
          }
        },
        fail: () => app.globalData.showToast(this.$t('common.internet_error_tips')),
        complete: () => {
          this.loading = false;
          if (isPull) uni.stopPullDownRefresh();
        },
      });
    },
    setSort(mode) {
      this.sortMode = mode;
      this.loadEntries();
    },
    canVote(entry) {
      return !(entry && entry.voted_today);
    },
    vote(entry) {
      if (!this.canVote(entry)) {
        app.globalData.showToast('今日已投票');
        return;
      }
      this._request({
        url: app.globalData.get_request_url('vote', 'braceletcontest'),
        method: 'POST',
        data: {
          entry_id: entry.id,
          ...this.getCommonParams(),
        },
        withCredentials: true,
        success: (res) => {
          if (res.data && res.data.code === 0) {
            entry.votes = Number(res.data.data?.votes || entry.votes || 0);
            entry.voted_today = 1;
            app.globalData.showToast('已投票', 'success');
          } else if (res.data && (res.data.code === -1001 || (res.data.msg || '').includes('登录'))) {
            uni.navigateTo({ url: '/pages/login/login' });
          } else {
            app.globalData.showToast((res.data && res.data.msg) || '投票失败');
          }
        },
        fail: () => app.globalData.showToast(this.$t('common.internet_error_tips')),
      });
    },
    onCommentInput(entryId, e) {
      const value = e.detail.value || '';
      this.$set(this.commentDrafts, entryId, value);
    },
    sendComment(entry) {
      const text = (this.commentDrafts[entry.id] || '').trim();
      if (!text) {
        app.globalData.showToast('请输入评论内容');
        return;
      }
      this._request({
        url: app.globalData.get_request_url('comment', 'braceletcontest'),
        method: 'POST',
        data: {
          entry_id: entry.id,
          content: text,
          ...this.getCommonParams(),
        },
        withCredentials: true,
        success: (res) => {
          if (res.data && res.data.code === 0 && res.data.data && res.data.data.comment) {
            entry.comments = Array.isArray(entry.comments) ? entry.comments : [];
            entry.comments.unshift(res.data.data.comment);
            this.$set(this.commentDrafts, entry.id, '');
            app.globalData.showToast('评论成功', 'success');
          } else if (res.data && (res.data.code === -1001 || (res.data.msg || '').includes('登录'))) {
            uni.navigateTo({ url: '/pages/login/login' });
          } else {
            app.globalData.showToast((res.data && res.data.msg) || '评论失败');
          }
        },
        fail: () => app.globalData.showToast(this.$t('common.internet_error_tips')),
      });
    },
    openWorkDetail(entry) {
      const workId = entry.work_id || entry.workId || '';
      if (!workId) {
        app.globalData.showToast('缺少作品ID');
        return;
      }
      const author = entry.author || '';
      uni.navigateTo({
        url: `/pages/bracelet-sub/work-detail?work_id=${encodeURIComponent(workId)}&from_contest=1&contest_author=${encodeURIComponent(author)}`,
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
        ajax: 'ajax',
      };
      if (token) params.token = token;
      return params;
    },
    formatPrice(val) {
      const num = Number(val) || 0;
      return num.toFixed(2);
    },
    formatTime(ts) {
      const date = ts ? new Date(ts) : new Date();
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    },
  },
};
</script>

<style scoped>
.contest-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #fbfaf7 0%, #f6f3ef 45%, #f3f1ee 100%);
  padding: 20rpx 16rpx 30rpx;
  box-sizing: border-box;
  color: #2e2a25;
  font-family: "Inter", "Lora", "Playfair Display", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}
.header {
  background: linear-gradient(180deg, rgba(255, 252, 246, 0.98), rgba(247, 242, 234, 0.92));
  border-radius: 22rpx;
  padding: 16rpx 16rpx 14rpx;
  border: 1rpx solid rgba(214, 196, 160, 0.35);
  box-shadow: 0 16rpx 30rpx rgba(46, 42, 37, 0.08);
  margin-bottom: 14rpx;
}
.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  position: relative;
}
.title-group {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}
.title {
  font-size: 32rpx;
  font-weight: 700;
  color: #2d2721;
  letter-spacing: 2rpx;
}
.title-sub {
  font-size: 18rpx;
  letter-spacing: 3rpx;
  color: rgba(120, 96, 62, 0.55);
}
.join-btn {
  position: relative;
  z-index: 2;
  min-width: 180rpx;
  height: 52rpx;
  line-height: 52rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #b28945, #8a632f);
  color: #fffaf2;
  font-size: 20rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  border: 1rpx solid rgba(148, 102, 46, 0.65);
  box-shadow:
    inset 0 1rpx 2rpx rgba(255, 255, 255, 0.25),
    0 10rpx 18rpx rgba(120, 86, 45, 0.22);
}
.join-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 8rpx 18rpx rgba(120, 86, 45, 0.24);
}
.header-note {
  margin-top: 6rpx;
  padding: 6rpx 8rpx;
  border-radius: 12rpx;
  background: rgba(255, 255, 255, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
}
.join-note {
  font-size: 20rpx;
  color: rgba(122, 93, 51, 0.85);
  letter-spacing: 0.5rpx;
}
.subtitle {
  color: rgba(46, 42, 37, 0.55);
  font-size: 22rpx;
  text-align: center;
  width: 100%;
}
.section-divider {
  margin-top: 12rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  color: rgba(122, 93, 51, 0.7);
  font-size: 18rpx;
  letter-spacing: 2rpx;
}
.section-divider::before,
.section-divider::after {
  content: '';
  flex: 1;
  height: 1rpx;
  background: linear-gradient(90deg, transparent, rgba(200, 164, 92, 0.45));
}
.section-divider::after {
  background: linear-gradient(270deg, transparent, rgba(200, 164, 92, 0.45));
}
.sort-row {
  margin-top: 12rpx;
  display: flex;
  gap: 12rpx;
}
.sort-btn {
  flex: 1;
  height: 56rpx;
  line-height: 56rpx;
  border-radius: 999rpx;
  border: 1rpx solid rgba(200, 164, 92, 0.35);
  background: rgba(255, 255, 255, 0.85);
  font-size: 22rpx;
  color: #6b5b3e;
}
.sort-btn.active {
  background: linear-gradient(135deg, #e2c273, #c59a52);
  color: #fffaf2;
  border: none;
}
.list {
  max-height: calc(100vh - 240rpx);
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}
.card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(252, 250, 246, 0.96));
  border-radius: 22rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 24rpx 46rpx rgba(46, 42, 37, 0.12);
  border: 1rpx solid rgba(200, 164, 92, 0.24);
}
.card.highlight {
  border-color: rgba(200, 164, 92, 0.55);
  box-shadow: 0 24rpx 48rpx rgba(46, 42, 37, 0.16);
}
.card-main {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.thumb-wrap {
  width: 100%;
  height: 280rpx;
  border-radius: 16rpx;
  background: #f3f1ee;
  flex-shrink: 0;
  border: 1rpx solid rgba(200, 164, 92, 0.16);
  box-shadow: 0 12rpx 22rpx rgba(46, 42, 37, 0.12);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb-wrap > image {
  width: 100%;
  height: 100%;
  display: block;
}
.thumb {
  width: 100%;
  height: 280rpx;
  border-radius: 16rpx;
  background: #f3f1ee;
  flex-shrink: 0;
  border: 1rpx solid rgba(200, 164, 92, 0.16);
  box-shadow: 0 12rpx 22rpx rgba(46, 42, 37, 0.12);
}
.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  min-width: 0;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.name {
  flex: 1;
  font-size: 28rpx;
  font-weight: 600;
  color: #2d2721;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.stats-inline {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 20rpx;
  color: #7a6845;
  font-weight: 600;
  white-space: nowrap;
}
.meta {
  font-size: 21rpx;
  color: rgba(46, 42, 37, 0.6);
}
.dot {
  margin: 0 6rpx;
}
.action-buttons {
  margin-top: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10rpx;
}
.vote-btn {
  width: 100%;
  height: 56rpx;
  line-height: 56rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #e5c77a, #c89e58);
  color: #fffaf2;
  font-size: 21rpx;
  border: none;
  box-shadow: 0 10rpx 20rpx rgba(184, 145, 78, 0.28);
}
.vote-btn[disabled] {
  opacity: 0.6;
}
.copy-btn {
  width: 100%;
  height: 56rpx;
  line-height: 56rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.96);
  color: #7a6845;
  font-size: 21rpx;
  border: 1rpx solid rgba(200, 164, 92, 0.4);
  box-shadow: 0 8rpx 16rpx rgba(46, 42, 37, 0.08);
}
.comments {
  margin-top: 14rpx;
  padding-top: 12rpx;
  border-top: 1rpx dashed rgba(200, 164, 92, 0.25);
}
.comments-title {
  font-size: 22rpx;
  color: #7a6845;
  margin-bottom: 8rpx;
}
.comment-empty {
  color: rgba(46, 42, 37, 0.4);
  font-size: 18rpx;
}
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  max-height: 84rpx;
  padding-right: 6rpx;
}
.comment-item {
  font-size: 16rpx;
  color: rgba(46, 42, 37, 0.62);
  padding: 2rpx 0 6rpx;
  border-bottom: 1rpx solid rgba(200, 164, 92, 0.12);
}
.comment-item:last-child {
  border-bottom: none;
}
.comment-user {
  color: #b8914e;
  margin-right: 8rpx;
}
.comment-input {
  margin-top: 10rpx;
  display: flex;
  gap: 10rpx;
  align-items: center;
}
.input {
  flex: 1;
  height: 60rpx;
  border-radius: 12rpx;
  padding: 0 14rpx;
  background: #f9f7f4;
  border: 1rpx solid rgba(200, 164, 92, 0.2);
  font-size: 22rpx;
}
.send-btn {
  min-width: 120rpx;
  height: 60rpx;
  line-height: 60rpx;
  border-radius: 999rpx;
  background: #2d2721;
  color: #fff;
  font-size: 22rpx;
  border: none;
}
.empty {
  text-align: center;
  padding: 80rpx 0;
  color: rgba(46, 42, 37, 0.45);
}
</style>
