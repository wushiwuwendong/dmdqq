<view class="map-page" style="width: {{canvasWidth}}px; height: {{canvasHeight}}px;">
  <canvas
    canvas-id="mapCanvas"
    id="mapCanvas"
    class="map-canvas"
    style="width: {{canvasWidth}}px; height: {{canvasHeight}}px;"
    disable-scroll="true"
  ></canvas>

  <!-- canvas 是原生组件，普通 view 点不到，必须用 cover-view -->
  <cover-view class="hud">
    <cover-view class="hud-nick">{{nickName}}</cover-view>
    <cover-view class="hud-hint">{{hint}}</cover-view>
  </cover-view>

  <cover-view class="dpad">
    <cover-view class="dpad-row">
      <cover-view
        class="key"
        data-dir="up"
        catchtouchstart="onDirStart"
        catchtouchend="onDirEnd"
        catchtouchcancel="onDirEnd"
        catchtap="onDirTap"
      >上</cover-view>
    </cover-view>
    <cover-view class="dpad-row">
      <cover-view
        class="key"
        data-dir="left"
        catchtouchstart="onDirStart"
        catchtouchend="onDirEnd"
        catchtouchcancel="onDirEnd"
        catchtap="onDirTap"
      >左</cover-view>
      <cover-view
        class="key"
        data-dir="down"
        catchtouchstart="onDirStart"
        catchtouchend="onDirEnd"
        catchtouchcancel="onDirEnd"
        catchtap="onDirTap"
      >下</cover-view>
      <cover-view
        class="key"
        data-dir="right"
        catchtouchstart="onDirStart"
        catchtouchend="onDirEnd"
        catchtouchcancel="onDirEnd"
        catchtap="onDirTap"
      >右</cover-view>
    </cover-view>
  </cover-view>
</view>
