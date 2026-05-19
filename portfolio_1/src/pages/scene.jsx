import { useEffect, useRef } from 'react'
import SceneManager from '../components/ThreeScene/SceneManager.js'

export default function Scene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const sceneManager = new SceneManager(mount)

    return () => {
      sceneManager.dispose()
    }
  }, [])

  return <div ref={mountRef} className="scene-shell" style={{ width: '100%', height: '100vh' }} />
}
