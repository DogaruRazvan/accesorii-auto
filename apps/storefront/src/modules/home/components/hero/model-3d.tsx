"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  useGLTF,
  Environment,
  ContactShadows,
  Float,
  Bounds,
} from "@react-three/drei"
import * as THREE from "three"

// Modelul 3D: mini-market (CC-BY, volodymyr.hrynchyk). Schimbi modelul punand
// alt .glb in /public/models si schimband MODEL_PATH (sau prin env var).
const MODEL_PATH =
  process.env.NEXT_PUBLIC_HERO_MODEL || "/models/mini-market.glb"

function Model() {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF(MODEL_PATH)

  // Rotire lenta automata -> efectul "produs care se prezinta"
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.25
    }
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

export default function Model3D() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 6], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* Lumini -> volum si reflexii placute */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#10B981" />

      <Suspense fallback={null}>
        {/* Float -> plutire subtila sus-jos, look premium */}
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
          {/* Bounds -> incadreaza automat modelul indiferent de marimea lui */}
          <Bounds fit clip observe margin={1.1}>
            <Model />
          </Bounds>
        </Float>

        {/* Umbra moale sub model */}
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.35}
          scale={12}
          blur={2.6}
          far={4}
          color="#000000"
        />

        {/* Iluminare ambientala realista (HDRI built-in, fara fisier extern) */}
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}

// Preload -> modelul incepe sa se incarce devreme
useGLTF.preload(MODEL_PATH)
