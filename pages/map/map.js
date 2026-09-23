const { createScopedThreejs } = require('../../libs/threejs-miniprogram/index.js')
const { createScene } = require('../../utils/scene.js')

const app = getApp()

Page({
  data: {
    nickName: '玩家'
  },

  _raf: 0,
  _sceneApi: null,
  _canvas: null,
  _running: false,

  onLoad() {
    const user = app.globalData.userInfo || {}
    const nickName = user.nickName || '游客'
    this.setData({ nickName })
  },

  onReady() {
    this.initThree()
  },

  onUnload() {
    this.stopLoop()
    if (this._sceneApi) {
      this._sceneApi.dispose()
      this._sceneApi = null
    }
  },

  onHide() {
    this.stopLoop()
  },

  onShow() {
    if (this._sceneApi && !this._running) {
      this.startLoop()
    }
  },

  initThree() {
    const query = qq.createSelectorQuery()
    query
      .select('#webgl')
      .node()
      .exec((res) => {
        if (!res || !res[0] || !res[0].node) {
          qq.showToast({ title: '画布初始化失败', icon: 'none' })
          return
        }

        const canvas = res[0].node
        const sys = qq.getSystemInfoSync()
        const dpr = sys.pixelRatio || 1
        const width = sys.windowWidth
        const height = sys.windowHeight

        canvas.width = width * dpr
        canvas.height = height * dpr

        const THREE = createScopedThreejs(canvas)
        this._canvas = canvas
        this._sceneApi = createScene(THREE, canvas, {
          nickName: this.data.nickName,
          pixelRatio: dpr,
          width,
          height
        })

        this.startLoop()
      })
  },

  startLoop() {
    if (!this._sceneApi || !this._canvas || this._running) return
    this._running = true
    const canvas = this._canvas
    const tick = () => {
      if (!this._running || !this._sceneApi) return
      this._sceneApi.update()
      this._raf = canvas.requestAnimationFrame(tick)
    }
    this._raf = canvas.requestAnimationFrame(tick)
  },

  stopLoop() {
    this._running = false
    if (this._canvas && this._raf) {
      this._canvas.cancelAnimationFrame(this._raf)
      this._raf = 0
    }
  },

  onDirStart(e) {
    const dir = e.currentTarget.dataset.dir
    if (this._sceneApi) this._sceneApi.setDirection(dir, true)
  },

  onDirEnd(e) {
    const dir = e.currentTarget.dataset.dir
    if (this._sceneApi) this._sceneApi.setDirection(dir, false)
  },

  noop() {}
})
