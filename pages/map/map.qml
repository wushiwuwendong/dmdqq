<view class="map-page">
  <canvas
    type="webgl"
    id="webgl"
    class="webgl"
    bindtouchstart="noop"
  ></canvas>

  <view class="hud">
    <text class="hud-nick">{{nickName}}</text>
    <text class="hud-hint">方向键移动角色</text>
  </view>

  <view class="dpad">
    <view class="dpad-row">
      <view
        class="key"
        data-dir="up"
        bindtouchstart="onDirStart"
        bindtouchend="onDirEnd"
        bindtouchcancel="onDirEnd"
      >上</view>
    </view>
    <view class="dpad-row">
      <view
        class="key"
        data-dir="left"
        bindtouchstart="onDirStart"
        bindtouchend="onDirEnd"
        bindtouchcancel="onDirEnd"
      >左</view>
      <view
        class="key"
        data-dir="down"
        bindtouchstart="onDirStart"
        bindtouchend="onDirEnd"
        bindtouchcancel="onDirEnd"
      >下</view>
      <view
        class="key"
        data-dir="right"
        bindtouchstart="onDirStart"
        bindtouchend="onDirEnd"
        bindtouchcancel="onDirEnd"
      >右</view>
    </view>
  </view>
</view>
