/**
 * QQ 小程序没有 canvas.node / WebGL，用 Canvas 2D 画俯视地图。
 * 世界坐标：以玩家为中心，屏幕中心为相机。
 */
function createMap2d(options) {
  const nickName = (options && options.nickName) || '玩家'
  const width = options.width || 375
  const height = options.height || 600
  const ctx = options.ctx

  const tile = 40
  const bounds = 12
  const speed = 0.18
  const player = { x: 0, y: 0, size: 0.7 }

  const obstacles = [
    { x: -3, y: -2, w: 1.5, h: 1.5, color: '#8d6e63' },
    { x: 4, y: -4, w: 2, h: 1.2, color: '#a1887f' },
    { x: -5, y: 3, w: 1.8, h: 2, color: '#6d4c41' },
    { x: 5, y: 4, w: 1.5, h: 1.5, color: '#8d6e63' },
    { x: 0, y: -6, w: 2.5, h: 1, color: '#bcaaa4' },
    { x: 2, y: 2, w: 1, h: 1, color: '#795548' }
  ]

  const keys = { up: false, down: false, left: false, right: false }

  function setDirection(dir, pressed) {
    if (Object.prototype.hasOwnProperty.call(keys, dir)) {
      keys[dir] = !!pressed
    }
  }

  function nudge(dir) {
    const step = 0.45
    if (dir === 'left') player.x = clamp(player.x - step, -bounds, bounds)
    if (dir === 'right') player.x = clamp(player.x + step, -bounds, bounds)
    if (dir === 'up') player.y = clamp(player.y - step, -bounds, bounds)
    if (dir === 'down') player.y = clamp(player.y + step, -bounds, bounds)
    draw()
  }

  function worldToScreen(wx, wy) {
    return {
      x: width / 2 + (wx - player.x) * tile,
      y: height / 2 + (wy - player.y) * tile
    }
  }

  function draw() {
    // 天空/背景
    ctx.setFillStyle('#87b7d9')
    ctx.fillRect(0, 0, width, height)

    // 地面大圆/矩形
    const groundPad = 20
    const g0 = worldToScreen(-groundPad, -groundPad)
    const g1 = worldToScreen(groundPad, groundPad)
    ctx.setFillStyle('#4caf70')
    ctx.fillRect(g0.x, g0.y, g1.x - g0.x, g1.y - g0.y)

    // 网格
    ctx.setStrokeStyle('#3d9a5f')
    ctx.setLineWidth(1)
    for (let i = -groundPad; i <= groundPad; i++) {
      const a = worldToScreen(i, -groundPad)
      const b = worldToScreen(i, groundPad)
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
      const c = worldToScreen(-groundPad, i)
      const d = worldToScreen(groundPad, i)
      ctx.beginPath()
      ctx.moveTo(c.x, c.y)
      ctx.lineTo(d.x, d.y)
      ctx.stroke()
    }

    // 障碍几何体
    obstacles.forEach((o) => {
      const p = worldToScreen(o.x - o.w / 2, o.y - o.h / 2)
      ctx.setFillStyle(o.color)
      ctx.fillRect(p.x, p.y, o.w * tile, o.h * tile)
      // 简单立体顶面
      ctx.setFillStyle('rgba(255,255,255,0.18)')
      ctx.fillRect(p.x, p.y, o.w * tile, Math.max(4, o.h * tile * 0.25))
    })

    // 玩家方块（屏幕中心）
    const pw = player.size * tile
    const px = width / 2 - pw / 2
    const py = height / 2 - pw / 2
    ctx.setFillStyle('#12b7f5')
    ctx.fillRect(px, py, pw, pw)
    ctx.setFillStyle('rgba(255,255,255,0.25)')
    ctx.fillRect(px, py, pw, pw * 0.3)

    // 昵称标签
    const label = (nickName || '玩家').slice(0, 10)
    const labelW = Math.max(60, label.length * 14 + 24)
    const labelH = 28
    const lx = width / 2 - labelW / 2
    const ly = py - labelH - 10
    ctx.setFillStyle('rgba(0,0,0,0.55)')
    ctx.fillRect(lx, ly, labelW, labelH)
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(14)
    ctx.setTextAlign('center')
    ctx.fillText(label, width / 2, ly + 20)

    ctx.draw()
  }

  function update() {
    let dx = 0
    let dy = 0
    if (keys.left) dx -= 1
    if (keys.right) dx += 1
    if (keys.up) dy -= 1
    if (keys.down) dy += 1

    if (dx !== 0 || dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy)
      dx = (dx / len) * speed
      dy = (dy / len) * speed
      player.x = clamp(player.x + dx, -bounds, bounds)
      player.y = clamp(player.y + dy, -bounds, bounds)
    }

    draw()
  }

  draw()
  return { update, setDirection, nudge, player }
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

module.exports = {
  createMap2d
}
