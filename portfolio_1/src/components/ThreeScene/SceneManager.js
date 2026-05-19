import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'

import InteractionManager from './InteractionManager.js'
import ModelLoader from './ModelLoader.js'

export default class SceneManager {
  constructor(container) {
    this.container = container
    this.animationId = null
    this.init()
  }

  init() {
    this.setupScene()
    this.setupCamera()
    this.setupRenderer()
    this.setupPostProcessing()
    this.setupControls()
    this.setupLights()

    this.interactionManager = new InteractionManager(this.renderer, this.camera)
    
    this.modelLoader = new ModelLoader(this.scene, this.interactionManager, () => this.render())
    this.modelLoader.loadAll()

    this.resizeObserver = new ResizeObserver(this.onResize)
    this.resizeObserver.observe(this.container)
    this.onResize()

    this.animate()
  }

  setupScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('#000000')
    this.root = new THREE.Group()
    this.scene.add(this.root)
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(28.6, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.set(0.34821, 0.80187, 1.6626)

    const euler = new THREE.Euler(
      THREE.MathUtils.degToRad(69.25),
      THREE.MathUtils.degToRad(-0.000217),
      THREE.MathUtils.degToRad(11.179),
      'XYZ',
    )
    this.camera.quaternion.setFromEuler(euler)
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1
    this.renderer.shadowMap.enabled = false
    
    this.container.appendChild(this.renderer.domElement)
  }

  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer)
    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.2,
      0.85,
      0.85,
    )
    this.composer.addPass(bloomPass)

    const caPass = new ShaderPass(RGBShiftShader)
    caPass.uniforms['amount'].value = 0.001
    this.composer.addPass(caPass)

    const vignettePass = new ShaderPass(VignetteShader)
    vignettePass.uniforms['darkness'].value = 0.8
    this.composer.addPass(vignettePass)
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.enablePan = false
    this.controls.minAzimuthAngle = THREE.MathUtils.degToRad(-20)
    this.controls.maxAzimuthAngle = THREE.MathUtils.degToRad(20)
    this.controls.minPolarAngle = THREE.MathUtils.degToRad(60)
    this.controls.maxPolarAngle = THREE.MathUtils.degToRad(80)
    this.controls.minDistance = 1.5
    this.controls.maxDistance = 3
    this.controls.target.set(0, 0, 0)
    this.controls.update()
  }

  setupLights() {
    const ambient = new THREE.AmbientLight('#1a1a1a', 0.3)
    this.scene.add(ambient)
    
    const keyLight = new THREE.DirectionalLight('#ffe8d0', 1.2)
    keyLight.position.set(-5, 8, 5)
    this.scene.add(keyLight)
    
    const fillLight = new THREE.DirectionalLight('#b8c8ff', 0.4)
    fillLight.position.set(5, 3, 2)
    this.scene.add(fillLight)
    
    const rimLight = new THREE.DirectionalLight('#ffd9b0', 0.6)
    rimLight.position.set(3, 5, -4)
    this.scene.add(rimLight)
  }

  onResize = () => {
    if (!this.container) return
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.composer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.render()
  }

  render() {
    if (this.composer) {
      this.composer.render()
    }
  }

  animate = () => {
    this.controls.update()
    
    this.interactionManager.update()
    
    const headHoverAmount = this.interactionManager.getHeadHoverAmount()
    this.modelLoader.update(headHoverAmount)

    this.render()
    this.animationId = requestAnimationFrame(this.animate)
  }

  dispose() {
    cancelAnimationFrame(this.animationId)
    
    this.resizeObserver?.disconnect()
    
    this.interactionManager.dispose()
    this.modelLoader.dispose()
    
    this.controls.dispose()
    this.renderer.dispose()
    this.composer.dispose()
    
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement)
    }
  }
}
