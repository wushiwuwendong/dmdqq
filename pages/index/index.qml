<view class="page">
  <view class="hero">
    <text class="brand">辅助地图</text>
    <text class="sub">授权 QQ 信息后进入场景</text>
  </view>

  <view class="card" wx:if="{{hasUserInfo}}">
    <image class="avatar" wx:if="{{userInfo.avatarUrl}}" src="{{userInfo.avatarUrl}}" mode="aspectFill"></image>
    <view class="avatar placeholder" wx:else>
      <text class="avatar-letter">{{nickLetter}}</text>
    </view>
    <text class="nick">{{userInfo.nickName}}</text>
    <text class="tip">已获取 QQ 昵称，可进入地图</text>
    <button class="btn primary" bindtap="enterMap">进入场景地图</button>
  </view>

  <view class="card" wx:else>
    <text class="tip">点击下方按钮授权登录，昵称将显示在场景角色上方</text>
    <button
      class="btn primary"
      wx:if="{{canIUse}}"
      open-type="getUserInfo"
      bindgetuserinfo="getUserInfo"
    >QQ 授权登录</button>
    <button class="btn primary" wx:else bindtap="fallbackGetUserInfo">QQ 授权登录</button>
    <button class="btn ghost" bindtap="useMockUser">模拟登录（开发调试）</button>
  </view>
</view>
