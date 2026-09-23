/**
 * 简单场景：地面地图 + 障碍几何体 + 带昵称的玩家方块
 * 注意：threejs-miniprogram 要求 WebGLRenderer 不传 canvas，
 * 由 createScopedThreejs 绑定当前画布，重复传入会导致黑屏。
 */
function createLabelTexture(THREE, text) {
  try {
    const width = 256
    const height = 64
    if (typeof qq === 'undefined' || !qq.createOffscreenCanvas) return null

    const canvas = qq.createOffscreenCanvas({ type: '2d', width, height })
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
    roundRect(ctx, 8, 8, width - 16, height - 16, 12)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 28px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText((text || '玩家').slice(0, 10), width / 2, height / 2)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  } catch (e) {
    console.warn('createLabelTexture failed', e)
    return null
  }
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function createScene(THREE, canvas, options) {
  const nickName = (options && options.nickName) || '玩家'
  const width = Math.max(1, canvas.width || 300)
  const height = Math.max(1, canvas.height || 500)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87b7d9)

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
  camera.position.set(0, 12, 14)
  camera.lookAt(0, 0, 0)

  // 关键：不要传 canvas，交给 createScopedThreejs 的作用域
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  try {
    const sys = (typeof qq !== 'undefined' ? qq : wx).getSystemInfoSync()
    renderer.setPixelRatio(sys.pixelRatio || 1)
  } catch (e) {
    renderer.setPixelRatio(1)
  }
  renderer.setSize(width, height)

  const ground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(40, 40),
    new THREE.MeshBasicMaterial({ color: 0x4caf70 })
  )
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)

  try {
    const grid = new THREE.GridHelper(40, 20, 0x2e7d4f, 0x3d9a5f)
    grid.position.y = 0.02
    scene.add(grid)
  } catch (e) {}

  const obstacles = [
    { x: -4, z: -3, w: 2, h: 2, d: 2, c: 0x8d6e63 },
    { x: 5, z: -5, w: 3, h: 1.5, d: 2, c: 0xa1887f },
    { x: -7, z: 4, w: 2.5, h: 3, d: 2.5, c: 0x6d4c41 },
    { x: 6, z: 5, w: 2, h: 2.2, d: 2, c: 0x8d6e63 },
    { x: 0, z: -8, w: 4, h: 1.2, d: 1.5, c: 0xbcaaa4 }
  ]
  obstacles.forEach((o) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(o.w, o.h, o.d),
      new THREE.MeshBasicMaterial({ color: o.c })
    )
    mesh.position.set(o.x, o.h / 2, o.z)
    scene.add(mesh)
  })

  const player = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1.4, 1),
    new THREE.MeshBasicMaterial({ color: 0x12b7f5 })
  )
  player.position.set(0, 0.7, 0)
  scene.add(player)

  try {
    const labelTexture = createLabelTexture(THREE, nickName)
    if (labelTexture) {
      const nameSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: labelTexture,
          transparent: true,
          depthTest: false
        })
      )
      nameSprite.scale.set(3.2, 0.8, 1)
      nameSprite.position.set(0, 2.2, 0)
      player.add(nameSprite)
    }
  } catch (e) {}

  const bounds = 18
  const speed = 0.12
  const keys = { up: false, down: false, left: false, right: false }

  function setDirection(dir, pressed) {
    if (Object.prototype.hasOwnProperty.call(keys, dir)) {
      keys[dir] = !!pressed
    }
  }

  function update() {
    let dx = 0
    let dz = 0
    if (keys.left) dx -= 1
    if (keys.right) dx += 1
    if (keys.up) dz -= 1
    if (keys.down) dz += 1

    if (dx !== 0 || dz !== 0) {
      const len = Math.sqrt(dx * dx + dz * dz)
      dx = (dx / len) * speed
      dz = (dz / len) * speed
      player.position.x = clamp(player.position.x + dx, -bounds, bounds)
      player.position.z = clamp(player.position.z + dz, -bounds, bounds)
    }

    camera.position.x = player.position.x
    camera.position.y = 12
    camera.position.z = player.position.z + 14
    camera.lookAt(player.position.x, 0.5, player.position.z)
    renderer.render(scene, camera)
  }

  function dispose() {
    try {
      renderer.dispose()
    } catch (e) {}
  }

  update()
  return { update, setDirection, dispose, player }
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

module.exports = {
  createScene
}
