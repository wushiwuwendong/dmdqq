/**
 * 简单场景：地面地图 + 障碍几何体 + 带昵称的玩家方块
 */
function createLabelTexture(THREE, text) {
  const width = 256
  const height = 64
  let canvas = null
  let ctx = null

  if (typeof qq !== 'undefined' && qq.createOffscreenCanvas) {
    try {
      canvas = qq.createOffscreenCanvas({ type: '2d', width, height })
      ctx = canvas.getContext('2d')
    } catch (e) {
      canvas = null
    }
  }

  if (!ctx && typeof document !== 'undefined') {
    canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    ctx = canvas.getContext('2d')
  }

  if (!ctx) {
    return null
  }

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
  roundRect(ctx, 8, 8, width - 16, height - 16, 12)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 28px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const label = (text || '玩家').slice(0, 10)
  ctx.fillText(label, width / 2, height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
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
  const width = (options && options.width) || canvas.width
  const height = (options && options.height) || canvas.height
  const pixelRatio = Math.min(2, (options && options.pixelRatio) || 1)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87b7d9)
  scene.fog = new THREE.Fog(0x87b7d9, 18, 42)

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
  camera.position.set(0, 12, 14)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false
  })
  renderer.setPixelRatio(pixelRatio)
  renderer.setSize(width, height, false)

  const ambient = new THREE.AmbientLight(0xffffff, 0.7)
  scene.add(ambient)
  const dir = new THREE.DirectionalLight(0xffffff, 0.65)
  dir.position.set(8, 16, 6)
  scene.add(dir)

  // 地面地图
  const ground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(40, 40),
    new THREE.MeshLambertMaterial({ color: 0x4caf70 })
  )
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)

  const grid = new THREE.GridHelper(40, 20, 0x2e7d4f, 0x3d9a5f)
  grid.position.y = 0.01
  scene.add(grid)

  // 地图障碍几何体
  const obstacleMat = new THREE.MeshLambertMaterial({ color: 0x8d6e63 })
  const obstacles = [
    { x: -4, z: -3, w: 2, h: 2, d: 2 },
    { x: 5, z: -5, w: 3, h: 1.5, d: 2 },
    { x: -7, z: 4, w: 2.5, h: 3, d: 2.5 },
    { x: 6, z: 5, w: 2, h: 2.2, d: 2 },
    { x: 0, z: -8, w: 4, h: 1.2, d: 1.5 }
  ]
  obstacles.forEach((o) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(o.w, o.h, o.d),
      obstacleMat.clone()
    )
    mesh.position.set(o.x, o.h / 2, o.z)
    scene.add(mesh)
  })

  // 玩家角色（几何体）
  const player = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1.4, 1),
    new THREE.MeshLambertMaterial({ color: 0x12b7f5 })
  )
  player.position.set(0, 0.7, 0)
  scene.add(player)

  // 昵称精灵
  const labelTexture = createLabelTexture(THREE, nickName)
  let nameSprite = null
  if (labelTexture) {
    const spriteMat = new THREE.SpriteMaterial({
      map: labelTexture,
      transparent: true,
      depthTest: false
    })
    nameSprite = new THREE.Sprite(spriteMat)
    nameSprite.scale.set(3.2, 0.8, 1)
    nameSprite.position.set(0, 2.2, 0)
    player.add(nameSprite)
  }

  const bounds = 18
  const speed = 0.12
  const keys = { up: false, down: false, left: false, right: false }

  function setDirection(dir, pressed) {
    if (keys.hasOwnProperty(dir)) {
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
    camera.position.z = player.position.z + 14
    camera.lookAt(player.position.x, 0.5, player.position.z)

    renderer.render(scene, camera)
  }

  function resize(w, h, pixelRatio) {
    canvas.width = w
    canvas.height = h
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(2, pixelRatio || 1))
    renderer.setSize(w, h, false)
  }

  function dispose() {
    renderer.dispose()
  }

  return { update, setDirection, resize, dispose, player }
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

module.exports = {
  createScene
}
