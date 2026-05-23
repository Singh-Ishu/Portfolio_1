import * as THREE from 'three'

export default class InteractionManager {
  constructor(renderer, camera, onHoverChange, onRedirect) {
    this.renderer = renderer
    this.camera = camera
    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2()
    this.hoverGroups = new Map()
    this.onHoverChange = onHoverChange
    this.onRedirect = onRedirect
    this.currentHoverGroup = null

    this.touchDownPos = new THREE.Vector2()
    this.holdTimeout = null
    this.isHolding = false
    this.touchGroupKey = null

    this.onPointerMove = this.onPointerMove.bind(this)
    this.onPointerLeave = this.onPointerLeave.bind(this)
    this.onPointerDown = this.onPointerDown.bind(this)
    this.onPointerUp = this.onPointerUp.bind(this)
    this.onClick = this.onClick.bind(this)

    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove)
    this.renderer.domElement.addEventListener('pointerleave', this.onPointerLeave)
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown)
    this.renderer.domElement.addEventListener('pointerup', this.onPointerUp)
    this.renderer.domElement.addEventListener('pointercancel', this.onPointerUp)
    this.renderer.domElement.addEventListener('click', this.onClick)
  }

  getHoverEntry(object) {
    let current = object
    while (current) {
      if (current.userData?.hoverEntry) {
        return current.userData.hoverEntry
      }
      current = current.parent
    }
    return null
  }

  registerHoverObject(object, groupKey) {
    const entry = {
      object,
      groupKey,
      basePosition: object.position.clone(),
      baseScale: object.scale.clone(),
      baseRotation: object.rotation.clone(),
      currentHover: 0,
    }

    object.userData.hoverEntry = entry
    object.userData.hoverGroupKey = groupKey

    if (!this.hoverGroups.has(groupKey)) {
      this.hoverGroups.set(groupKey, {
        entries: [],
        targetHover: 0,
      })
    }

    this.hoverGroups.get(groupKey).entries.push(entry)
    return entry
  }

  setHoveredGroup(groupKey) {
    let currentlyHovered = null
    this.hoverGroups.forEach((group, key) => {
      group.targetHover = key === groupKey ? 1 : 0
      if (key === groupKey) currentlyHovered = key
    })

    if (this.currentHoverGroup !== currentlyHovered) {
      this.currentHoverGroup = currentlyHovered
      if (this.onHoverChange) {
        this.onHoverChange(currentlyHovered)
      }
    }
  }

  onPointerMove(event) {
    if (event.pointerType === 'touch') {
      if (this.holdTimeout || this.isHolding) {
        const dx = event.clientX - this.touchDownPos.x
        const dy = event.clientY - this.touchDownPos.y
        if (Math.sqrt(dx * dx + dy * dy) > 10) {
          if (this.holdTimeout) {
            clearTimeout(this.holdTimeout)
            this.holdTimeout = null
          }
          if (this.isHolding) {
            this.setHoveredGroup(null)
            this.isHolding = false
          }
          this.touchGroupKey = null
        }
      }
      return
    }

    const rect = this.renderer.domElement.getBoundingClientRect()
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)

    this.raycaster.setFromCamera(this.pointer, this.camera)

    const candidates = []
    this.hoverGroups.forEach((group) => {
      group.entries.forEach((entry) => {
        candidates.push(entry.object)
      })
    })

    const intersections = this.raycaster.intersectObjects(candidates, true)
    const hitEntry = intersections.length > 0 ? this.getHoverEntry(intersections[0].object) : null

    this.setHoveredGroup(hitEntry ? hitEntry.groupKey : null)
    this.renderer.domElement.style.cursor = hitEntry ? 'pointer' : 'default'
  }

  onPointerDown(event) {
    if (event.pointerType !== 'touch') return

    const rect = this.renderer.domElement.getBoundingClientRect()
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)

    this.raycaster.setFromCamera(this.pointer, this.camera)

    const candidates = []
    this.hoverGroups.forEach((group) => {
      group.entries.forEach((entry) => {
        candidates.push(entry.object)
      })
    })

    const intersections = this.raycaster.intersectObjects(candidates, true)
    const hitEntry = intersections.length > 0 ? this.getHoverEntry(intersections[0].object) : null
    
    this.touchGroupKey = hitEntry ? hitEntry.groupKey : null
    this.touchDownPos.set(event.clientX, event.clientY)
    this.isHolding = false

    if (this.touchGroupKey) {
      this.holdTimeout = setTimeout(() => {
        this.isHolding = true
        this.setHoveredGroup(this.touchGroupKey)
      }, 400)
    }
  }

  onPointerUp(event) {
    if (event.pointerType !== 'touch') return

    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout)
      this.holdTimeout = null
    }

    if (this.isHolding) {
      this.setHoveredGroup(null)
      this.isHolding = false
      this.touchGroupKey = null
    } else {
      if (this.touchGroupKey && this.onRedirect) {
        this.onRedirect(this.touchGroupKey)
      }
      this.touchGroupKey = null
    }
  }

  onPointerLeave() {
    this.setHoveredGroup(null)
    this.renderer.domElement.style.cursor = 'default'
  }

    onClick() {
    let activeGroup = null
    this.hoverGroups.forEach((group, key) => {
      if (group.targetHover === 1) {
        activeGroup = key
      }
    })

    if (activeGroup && this.onRedirect) {
      this.onRedirect(activeGroup)
    }
  }

  getHeadHoverAmount() {
    const headGroup = this.hoverGroups.get('head-hologram')
    return headGroup
      ? headGroup.entries.find((entry) => entry.object.userData?.hoverRole === 'head')?.currentHover || 0
      : 0
  }

  update() {
    this.hoverGroups.forEach((group) => {
      group.entries.forEach((entry) => {
        entry.currentHover += (group.targetHover - entry.currentHover) * 0.12

        const hoverRole = entry.object.userData?.hoverRole || 'default'

        const liftAmount = hoverRole === 'head' ? 0.1
          : hoverRole === 'hologram-base' ? 0.018
            : hoverRole === 'book-3' ? 0.05
              : hoverRole === 'book-2' ? 0.035
                : hoverRole === 'book-1' ? 0.02
                  : 0.025

        const scaleAmount = hoverRole === 'head' ? 0.5
          : hoverRole === 'hologram-base' ? 0.02
            : 0.04

        const tiltAmount = hoverRole === 'book-3' ? 0.14
          : hoverRole === 'book-2' ? 0.1
            : hoverRole === 'book-1' ? 0.06
              : 0

        const tiltDirection = hoverRole === 'book-1' ? -1 : 1

        entry.object.position.x = entry.basePosition.x
        entry.object.position.y = entry.basePosition.y + entry.currentHover * liftAmount
        entry.object.position.z = entry.basePosition.z

        entry.object.scale.set(
          entry.baseScale.x * (1 + entry.currentHover * scaleAmount),
          entry.baseScale.y * (1 + entry.currentHover * scaleAmount),
          entry.baseScale.z * (1 + entry.currentHover * scaleAmount),
        )

        if (hoverRole.startsWith('book-')) {
          entry.object.rotation.x = entry.baseRotation.x + entry.currentHover * tiltAmount * 0.55
          entry.object.rotation.y = entry.baseRotation.y + entry.currentHover * tiltAmount * 0.2 * tiltDirection
          entry.object.rotation.z = entry.baseRotation.z + entry.currentHover * tiltAmount * tiltDirection
        }
      })
    })
  }

  dispose() {
    this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove)
    this.renderer.domElement.removeEventListener('pointerleave', this.onPointerLeave)
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown)
    this.renderer.domElement.removeEventListener('pointerup', this.onPointerUp)
    this.renderer.domElement.removeEventListener('pointercancel', this.onPointerUp)
    this.renderer.domElement.removeEventListener('click', this.onClick)
  }
}
