import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { Suspense, useEffect, useRef } from "react"
import { Box3, DoubleSide, Vector3 } from "three"

const modelCenters = new Map()

const models = [
  { path: "/book1.glb" },
  { path: "/book2.glb" },
  { path: "/book3.glb" },
  { path: "/certificate.glb" },
  { path: "/head.glb" },
  { path: "/hologram.glb" },
  { path: "/pendulum.glb" },
  { path: "/phone.glb" },
  { path: "/phone_cable.glb" },
  { path: "/resume.glb" },
  { path: "/table.glb" },
]

function Model({ path }) {
  const { scene } = useGLTF(path)
  const groupRef = useRef()

  useEffect(() => {
    const box = new Box3().setFromObject(scene)
    const center = box.getCenter(new Vector3())

    modelCenters.set(path, center)

    if (path !== "/head.glb") return

    scene.position.sub(center)
  }, [path, scene])

  useFrame(({ clock }) => {
    if (path !== "/head.glb" || !groupRef.current) return

    const t = clock.getElapsedTime()
    const bob = Math.sin(t * 1.2) * 0.01
    const hologramCenter = modelCenters.get("/hologram.glb")

    if (hologramCenter) {
      groupRef.current.position.set(
        hologramCenter.x,
        hologramCenter.y + 0.15 + bob,
        hologramCenter.z,
      )
    } else {
      groupRef.current.position.y = 0.15 + bob
    }

    groupRef.current.rotation.y = (t * 0.7) % (Math.PI * 2)
    groupRef.current.rotation.x = Math.sin(t * 0.9) * 0.06
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

function SpotLight() {
  const lightRef = useRef()

  useEffect(() => {
    if (!lightRef.current) return
    lightRef.current.target.position.set(0, 0, 0)
    lightRef.current.target.updateMatrixWorld()
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

models.forEach((model) => {
  useGLTF.preload(model.path)
})

export default function Scene() {
  return (
    <div className="scene-shell">
      <Canvas camera={{ position: [0.34821, 0.80187, 1.6626], fov: 35 }}>
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
