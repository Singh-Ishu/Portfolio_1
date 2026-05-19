import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export const MODEL_URLS = [
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

export default class ModelLoader {
  constructor(scene, interactionManager, renderCallback) {
    this.scene = scene
    this.interactionManager = interactionManager
    this.renderCallback = renderCallback

    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('/draco/')

    this.loader = new GLTFLoader()
    this.loader.setDRACOLoader(this.dracoLoader)

    this.headModel = null
    this.headGlowMaterials = []
    this.cancelled = false
  }

  loadModel(url) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          if (this.cancelled) {
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
                const headMaterial = new THREE.MeshStandardMaterial({
                  color: 0x4488ff,
                  emissive: 0x1144ff,
                  emissiveIntensity: 0.5,
                  transparent: true,
                  opacity: 0.75,
                  roughness: 0.2,
                  metalness: 0.2,
                  side: THREE.DoubleSide,
                  blending: THREE.AdditiveBlending,
                  depthWrite: false,
                })
                this.headGlowMaterials.push(headMaterial)
                return headMaterial
              }

              const texture = mat.emissiveMap || mat.map
              if (texture) {
                texture.colorSpace = THREE.SRGBColorSpace
                return new THREE.MeshBasicMaterial({
                  map: texture,
                  side: THREE.DoubleSide,
                  transparent: mat.transparent || false,
                  opacity: mat.opacity !== undefined ? mat.opacity : 1,
                  alphaTest: mat.alphaTest || 0,
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

          if (url.includes('head')) {
            model.scale.set(0.8, 0.8, 0.8)
            model.updateMatrixWorld(true)

            const bounds = new THREE.Box3().setFromObject(model)
            const center = bounds.getCenter(new THREE.Vector3())

            const headWrapper = new THREE.Group()
            headWrapper.position.copy(center)
            model.position.sub(center)
            headWrapper.add(model)

            this.headModel = headWrapper
            this.headModel.position.x -= 0.02
            headWrapper.userData.hoverRole = 'head'
            this.scene.add(headWrapper)
            this.interactionManager.registerHoverObject(headWrapper, 'head-hologram')
          } else if (url.includes('table')) {
            this.scene.add(model)
          } else {
            this.scene.add(model)
            const hoverGroupKey = url.includes('book')
              ? 'books'
              : url.includes('hologram_base')
                ? 'head-hologram'
                : url

            if (url.includes('book1')) {
              model.userData.hoverRole = 'book-1'
            } else if (url.includes('book2')) {
              model.userData.hoverRole = 'book-2'
            } else if (url.includes('book3')) {
              model.userData.hoverRole = 'book-3'
            } else {
              model.userData.hoverRole = hoverGroupKey === 'head-hologram' ? 'hologram-base' : 'default'
            }
            this.interactionManager.registerHoverObject(model, hoverGroupKey)
          }

          if (this.renderCallback) this.renderCallback()
          resolve(model)
        },
        undefined,
        reject,
      )
    })
  }

  loadAll() {
    return Promise.all(MODEL_URLS.map((url) => this.loadModel(url))).catch((error) => {
      console.error('Failed to load one or more GLB models:', error)
    })
  }

  update(headHoverAmount) {
    if (this.headModel) {
      this.headModel.rotateY(0.02)
    }

    this.headGlowMaterials.forEach((material) => {
      material.emissiveIntensity = 0.5 + headHoverAmount * 1.6
      material.opacity = 0.75 + headHoverAmount * 0.1
    })
  }

  dispose() {
    this.cancelled = true
    this.dracoLoader.dispose()
  }
}
