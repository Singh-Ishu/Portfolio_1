import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SceneManager from '../components/ThreeScene/SceneManager.js'

export default function Scene() {
  const mountRef = useRef(null)
  const [hoverText, setHoverText] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const handleHover = (groupKey) => {
      let text = null
      switch (groupKey) {
        case '/phone.glb':
        case '/phone_cable.glb':
          text = 'Contact me'
          break
        case '/certificate.glb':
          text = 'Certifications'
          break
        case 'head-hologram':
          text = 'About Me'
          break
        case '/pendulum.glb':
          text = 'Projects'
          break
        case 'books':
          text = 'Tech Stacks'
          break
        case '/resume.glb':
          text = 'My Resume'
          break
        default:
          text = null
      }
      setHoverText(text)
    }

    const handleRedirect = (groupKey) => {
      switch (groupKey) {
        case '/phone.glb':
        case '/phone_cable.glb':
          navigate('/contact')
          break
        case '/certificate.glb':
          navigate('/certifications')
          break
        case 'head-hologram':
          navigate('/about')
          break
        case '/pendulum.glb':
          navigate('/projects')
          break
        case 'books':
          navigate('/tech-stack')
          break
        case '/resume.glb':
          navigate('/resume')
          break
        default:
          break
      }
    }

    const sceneManager = new SceneManager(mount, handleHover, handleRedirect)

    return () => {
      sceneManager.dispose()
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <div ref={mountRef} className="scene-shell" style={{ width: '100%', height: '100%' }} />
      {hoverText && (
        <div
          style={{
            position: 'absolute',
            left: mousePos.x + 15,
            top: mousePos.y + 15,
            pointerEvents: 'none',
            color: '#fff',
            background: 'rgba(0, 0, 0, 0.75)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            zIndex: 50,
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transform: 'translate(0, 0)',
            transition: 'opacity 0.15s ease-in-out',
          }}
        >
          {hoverText}
        </div>
      )}
    </div>
  )
}
