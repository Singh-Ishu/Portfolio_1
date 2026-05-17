import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Suspense, useEffect, useRef } from "react"
import { DoubleSide } from "three"

const models = [
  { path: "/certificate.glb" },
  { path: "/phone.glb" },
  { path: "/phone_cable.glb" },
  { path: "/resume.glb" },
  { path: "/table.glb" },
  { path: "/pendulum.glb" },
]

function Model({ path }) {
  const { scene } = useGLTF(path)

  return <primitive object={scene} />
}

function SpotLight() {
  const lightRef = useRef()
  const flickerTimeout = useRef()

  const scheduleFlicker = () => {
    if (!lightRef.current) return

    const baseIntensity = 180
    const intensityVariation = Math.random() < 0.25
      ? -Math.random() * 140
      : Math.random() * 30 - 10

    lightRef.current.intensity = Math.max(0, baseIntensity + intensityVariation)
    const nextDelay = 50 + Math.random() * 450
    flickerTimeout.current = window.setTimeout(scheduleFlicker, nextDelay)
  }

  useEffect(() => {
    if (!lightRef.current) return
    lightRef.current.target.position.set(0, 0, 0)
    lightRef.current.target.updateMatrixWorld()
    scheduleFlicker()

    return () => window.clearTimeout(flickerTimeout.current)
  }, [])

  return (
    <>
      <spotLight
        ref={lightRef}
        position={[0, 14, 0]}
        intensity={180}
        angle={0.35}
        penumbra={1}
        decay={2}
        distance={50}
        castShadow
      />
      <mesh position={[0, 7, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[4, 14, 32, 1, true]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.12}
          side={DoubleSide}
        />
      </mesh>
    </>
  )
}

function CameraLogger() {
  const { camera } = useThree()

  useFrame(() => {
    const { x, y, z } = camera.position
    console.log(`Camera position: x=${x.toFixed(3)}, y=${y.toFixed(3)}, z=${z.toFixed(3)}`)
  })

  return null
}

models.forEach((model) => {
  useGLTF.preload(model.path)
})

export default function Scene() {
  return (
    <div className="scene-shell">
      <Canvas camera={{ position: [0.763, 1.402, 1.981], fov: 25 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0} />
        <SpotLight />
        <Suspense fallback={null}>
          {models.map((model) => (
            <Model key={model.path} {...model} />
          ))}
        </Suspense>
        
      </Canvas>
    </div>
  )
}
