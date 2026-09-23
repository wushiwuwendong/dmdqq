// app.js
App({
  onLaunch() {
    const logs = qq.getStorageSync('logs') || []
    logs.unshift(Date.now())
    qq.setStorageSync('logs', logs)

    qq.login({
      success: () => {
        // res.code 可发给服务端换 openId；本 demo 仅用前端用户信息
      }
    })

    qq.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          qq.getUserInfo({
            success: (infoRes) => {
              this.globalData.userInfo = infoRes.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(infoRes)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
