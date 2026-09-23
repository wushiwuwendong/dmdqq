const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    nickLetter: 'Q',
    canIUse: qq.canIUse('button.open-type.getUserInfo')
  },

  onLoad() {
    if (app.globalData.userInfo) {
      this.applyUserInfo(app.globalData.userInfo)
      return
    }

    qq.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          qq.getUserInfo({
            success: (infoRes) => {
              this.applyUserInfo(infoRes.userInfo)
            }
          })
        }
      }
    })

    app.userInfoReadyCallback = (res) => {
      this.applyUserInfo(res.userInfo)
    }
  },

  applyUserInfo(userInfo) {
    if (!userInfo) return
    app.globalData.userInfo = userInfo
    const nick = userInfo.nickName || 'Q'
    this.setData({
      userInfo,
      hasUserInfo: true,
      nickLetter: nick.charAt(0)
    })
  },

  getUserInfo(e) {
    const userInfo = e.detail && e.detail.userInfo
    if (!userInfo) {
      qq.showToast({ title: '需要授权才能进入', icon: 'none' })
      return
    }
    this.applyUserInfo(userInfo)
  },

  fallbackGetUserInfo() {
    qq.getUserInfo({
      success: (res) => {
        this.applyUserInfo(res.userInfo)
      },
      fail: () => {
        qq.showToast({ title: '授权失败，可试用模拟登录', icon: 'none' })
      }
    })
  },

  useMockUser() {
    this.applyUserInfo({
      nickName: '模拟QQ用户',
      avatarUrl: '',
      gender: 0,
      city: '',
      province: '',
      country: 'CN'
    })
    qq.showToast({ title: '已使用模拟账号', icon: 'success' })
  },

  enterMap() {
    if (!this.data.hasUserInfo) {
      qq.showToast({ title: '请先授权登录', icon: 'none' })
      return
    }
    qq.navigateTo({ url: '/pages/map/map' })
  }
})
