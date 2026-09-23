const { createMap2d } = require('../../utils/map2d.js')

const app = getApp()

Page({
  data: {
    nickName: '玩家',
    hint: '方向键移动角色',
    canvasWidth: 375,
    canvasHeight: 600
  },

  _timer: 0,
  _map: null,
  _running: false,

  onLoad() {
    const user = app.globalData.userInfo || {}
    const nickName = user.nickName || '游客'
    const sys = qq.getSystemInfoSync()
    this.setData({
      nickName,
      canvasWidth: Math.floor(sys.windowWidth || 375),
      canvasHeight: Math.floor(sys.windowHeight || 600)
    })
  },

  onReady() {
    // QQ 小程序：用旧版 canvas-id + createCanvasContext（无 .node / WebGL）
    setTimeout(() => this.initMap(), 50)
  },

  onUnload() {
    this.stopLoop()
    this._map = null
  },

  onHide() {
    this.stopLoop()
  },

  onShow() {
    if (this._map && !this._running) this.startLoop()
  },

  initMap() {
    try {
      const ctx = qq.createCanvasContext('mapCanvas', this)
      this._map = createMap2d({
        ctx,
        nickName: this.data.nickName,
        width: this.data.canvasWidth,
        height: this.data.canvasHeight
      })
      this.setData({ hint: '方向键移动角色' })
      this.startLoop()
    } catch (e) {
      console.error(e)
      this.setData({ hint: '地图初始化失败' })
      qq.showToast({ title: '地图初始化失败', icon: 'none' })
    }
  },

  startLoop() {
    if (!this._map || this._running) return
    this._running = true
    this._timer = setInterval(() => {
      if (this._running && this._map) this._map.update()
    }, 33)
  },

  stopLoop() {
    this._running = false
    if (this._timer) {
      clearInterval(this._timer)
      this._timer = 0
    }
  },

  onDirStart(e) {
    const dir = (e.currentTarget.dataset && e.currentTarget.dataset.dir) || ''
    if (dir && this._map) this._map.setDirection(dir, true)
  },

  onDirEnd(e) {
    const dir = (e.currentTarget.dataset && e.currentTarget.dataset.dir) || ''
    if (dir && this._map) this._map.setDirection(dir, false)
  },

  onDirTap(e) {
    const dir = (e.currentTarget.dataset && e.currentTarget.dataset.dir) || ''
    if (dir && this._map) this._map.nudge(dir)
  }
})
