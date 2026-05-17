
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, useGLTF } from "@react-three/drei"
import { Suspense } from "react"

function CertificateModel() {
  const { scene } = useGLTF("/certificate.glb")

  return <primitive object={scene} scale={1.5} />
}

useGLTF.preload("/certificate.glb")

export default function Scene() {
  return (
    <div className="scene-shell">
      <Canvas camera={{ position: [0, 1.2, 4], fov: 45 }}>
        <color attach="background" args={["#0f172a"]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 4, 2]} intensity={2.5} />
        <Suspense fallback={null}>
          <CertificateModel />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={2} maxDistance={8} />
      </Canvas>
    </div>
  )
}
