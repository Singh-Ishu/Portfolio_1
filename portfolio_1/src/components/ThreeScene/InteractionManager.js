import * as THREE from 'three'

export default class InteractionManager {
  constructor(renderer, camera, onHoverChange) {
    this.renderer = renderer
    this.camera = camera
    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2()
    this.hoverGroups = new Map()
    this.onHoverChange = onHoverChange
    this.currentHoverGroup = null

    this.onPointerMove = this.onPointerMove.bind(this)
    this.onPointerLeave = this.onPointerLeave.bind(this)
    this.onClick = this.onClick.bind(this)

    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove)
    this.renderer.domElement.addEventListener('pointerleave', this.onPointerLeave)
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

  onPointerLeave() {
    this.setHoveredGroup(null)
    this.renderer.domElement.style.cursor = 'default'
  }

  onClick() {
    // Currently just logs the clicked object group. Ready for routing.
    let activeGroup = null
    this.hoverGroups.forEach((group, key) => {
      if (group.targetHover === 1) {
        activeGroup = key
      }
    })

    if (activeGroup) {
      console.log(`Clicked on group: ${activeGroup}`)
      // Here you could emit an event or call a callback to redirect
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
    this.renderer.domElement.removeEventListener('click', this.onClick)
  }
}
