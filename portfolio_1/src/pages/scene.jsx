import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const MODEL_URLS = [
  // '/table.glb',
  // '/book1.glb',
  // '/book2.glb',
  // '/book3.glb',
  // '/resume.glb',
  '/certificate.glb',
  // '/phone.glb',
  // '/phone_cable.glb',
  // '/hologram_base.glb',
  '/pendulum.glb',
  // '/hologram_head.glb',
]

export default function Scene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#000000')

    const camera = new THREE.PerspectiveCamera(28.6, window.innerWidth / window.innerHeight, 0.1, 1000)

    camera.position.set(0.34821, 0.80187, 1.6626)

    const euler = new THREE.Euler(
      THREE.MathUtils.degToRad(69.25),
      THREE.MathUtils.degToRad(-0.000217),
      THREE.MathUtils.degToRad(11.179),
      'XYZ',
    )
    camera.quaternion.setFromEuler(euler)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NoToneMapping
    renderer.toneMappingExposure = 1
    renderer.shadowMap.enabled = false
    mount.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = true
    controls.target.set(0, 0, 0)
    controls.update()

    const root = new THREE.Group()
    scene.add(root)

    // Remove ambient light at 0.5, add proper lighting
    const ambient = new THREE.AmbientLight('#1a1a1a', 0.3) // dark ambient
    scene.add(ambient)

    // Main key light (from upper left in your Blender scene)
    const keyLight = new THREE.DirectionalLight('#ffe8d0', 1.2)
    keyLight.position.set(-5, 8, 5)
    scene.add(keyLight)

    // Fill light (softer, from right)
    const fillLight = new THREE.DirectionalLight('#b8c8ff', 0.4)
    fillLight.position.set(5, 3, 2)
    scene.add(fillLight)

    // Rim light (back right)
    const rimLight = new THREE.DirectionalLight('#ffd9b0', 0.6)
    rimLight.position.set(3, 5, -4)
    scene.add(rimLight)

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')

    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    let resizeObserver
    let cancelled = false

    const render = () => {
      renderer.render(scene, camera)
    }

    const loadModel = (url) =>
      new Promise((resolve, reject) => {
        loader.load(
          url,
          (gltf) => {
            if (cancelled) {
              resolve(null)
              return
            }

            const model = gltf.scene
            const isTable = url.includes('table')
            
            model.traverse((node) => {
              if (!node.isMesh) return

              node.castShadow = false
              node.receiveShadow = false

              if (!isTable) {
                const processMaterial = (mat) => {
                  if (url.includes('hologram_head')) {
                    // Custom hologram material to hide baking/compression artifacts
                    return new THREE.MeshStandardMaterial({
                      color: 0x4488ff,
                      emissive: 0x1144ff,
                      emissiveIntensity: 0.5,
                      transparent: true,
                      opacity: 0.75,
                      roughness: 0.2,
                      metalness: 0.2,
                      side: THREE.DoubleSide,
                      blending: THREE.AdditiveBlending,
                      depthWrite: false
                    })
                  }

                  const texture = mat.emissiveMap || mat.map
                  if (texture) {
                    texture.colorSpace = THREE.SRGBColorSpace
                    return new THREE.MeshBasicMaterial({
                      map: texture,
                      side: THREE.DoubleSide,
                      transparent: mat.transparent || false,
                      opacity: mat.opacity !== undefined ? mat.opacity : 1,
                      alphaTest: mat.alphaTest || 0
                    })
                  }
                  
                  // Fallback to original material if no baked texture
                  mat.side = THREE.DoubleSide
                  return mat
                }

                if (Array.isArray(node.material)) {
                  node.material = node.material.map(processMaterial)
                } else if (node.material) {
                  node.material = processMaterial(node.material)
                }
              } else {
                if (Array.isArray(node.material)) {
                  node.material.forEach((material) => {
                    material.side = THREE.DoubleSide
                    material.needsUpdate = true
                  })
                } else if (node.material) {
                  node.material.side = THREE.DoubleSide
                  node.material.needsUpdate = true
                }
              }
            })

            scene.add(model)
            render()
            resolve(model)
          },
          undefined,
          reject,
        )
      })

    Promise.all(MODEL_URLS.map(loadModel)).catch((error) => {
      console.error('Failed to load one or more GLB models:', error)
    })

    const animate = () => {
      controls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      render()
    }

    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(mount)
    onResize()

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
      controls.dispose()
      dracoLoader.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="scene-shell" />
}