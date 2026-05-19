import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// Post-Processing Imports
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'

const MODEL_URLS = [
  '/table.glb',
  '/book1.glb',
  '/book2.glb',
  '/book3.glb',
  '/resume.glb',
  '/certificate.glb',
  '/phone.glb',
  '/phone_cable.glb',
  '/hologram_base.glb',
  '/pendulum.glb',
  '/head.glb',
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

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping // Matches Blender Filmic
    renderer.toneMappingExposure = 1
    renderer.shadowMap.enabled = false
    mount.appendChild(renderer.domElement)

    // Post-Processing Setup
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // 1. Glare -> UnrealBloomPass (Resolution, Strength, Radius, Threshold)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.2, 
      0.85, 
      0.85  
    )
    composer.addPass(bloomPass)

    // 2. Chromatic Aberration -> RGBShiftShader
    const caPass = new ShaderPass(RGBShiftShader)
    caPass.uniforms['amount'].value = 0.001
    composer.addPass(caPass)

    // 3. Vignette -> VignetteShader
    const vignettePass = new ShaderPass(VignetteShader)
    // vignettePass.uniforms['offset'].value = 0.5
    vignettePass.uniforms['darkness'].value = 0.8
    composer.addPass(vignettePass)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minAzimuthAngle = THREE.MathUtils.degToRad(-20)
    controls.maxAzimuthAngle = THREE.MathUtils.degToRad(20)
    controls.minPolarAngle = THREE.MathUtils.degToRad(60)
    controls.maxPolarAngle = THREE.MathUtils.degToRad(80)
    controls.minDistance = 1.5
    controls.maxDistance = 3
    controls.target.set(0, 0, 0)
    controls.update()

    const root = new THREE.Group()
    scene.add(root)

    // Lights (Only affects standard materials like the unbaked hologram head)
    const ambient = new THREE.AmbientLight('#1a1a1a', 0.3) 
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight('#ffe8d0', 1.2)
    keyLight.position.set(-5, 8, 5)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight('#b8c8ff', 0.4)
    fillLight.position.set(5, 3, 2)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight('#ffd9b0', 0.6)
    rimLight.position.set(3, 5, -4)
    scene.add(rimLight)

    // Loaders
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/') // Ensure this path points to your draco folder in public/

    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    
    let resizeObserver
    let cancelled = false

    const render = () => {
      composer.render() // Using composer instead of renderer
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
            
            model.traverse((node) => {
              if (!node.isMesh) return

              node.castShadow = false
              node.receiveShadow = false

              const processMaterial = (mat) => {
                if (url.includes('head')) {
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

                // Convert all baked objects to MeshBasicMaterial
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
                
                mat.side = THREE.DoubleSide
                return mat
              }

              if (Array.isArray(node.material)) {
                node.material = node.material.map(processMaterial)
              } else if (node.material) {
                node.material = processMaterial(node.material)
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
      composer.render() // Using composer instead of renderer
      requestAnimationFrame(animate)
    }

    animate()

    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      composer.setSize(mount.clientWidth, mount.clientHeight) // Sync composer size
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
      composer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="scene-shell" style={{ width: '100%', height: '100vh' }} />
}