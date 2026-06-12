"use client"

import { Suspense, useEffect, useRef } from "react"
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

// Rotatia de baza (cu fata la camera). Daca modelul apare cu spatele, schimba
// in Math.PI. Valori intermediare il intorc usor lateral.
const BASE_ROTATION_Y = 0

// Cat se roteste la scroll (radiani pe tot primul ecran de scroll). ~0.6 = ~34°
const SCROLL_ROTATION = 0.6

function Model() {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF(MODEL_PATH)
  const scrollProgress = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      // 0 sus de tot -> 1 dupa un ecran de scroll
      const p = Math.min(window.scrollY / window.innerHeight, 1)
      scrollProgress.current = p
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Nu se mai roteste singur. Tinta = baza + putin din scroll. Lerp = lin.
  useFrame(() => {
    if (group.current) {
      const target = BASE_ROTATION_Y + scrollProgress.current * SCROLL_ROTATION
      group.current.rotation.y +=
        (target - group.current.rotation.y) * 0.08
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
        {/* Float -> doar plutire subtila sus-jos, FARA rotire (sta cu fata) */}
        <Float speed={1.2} rotationIntensity={0} floatIntensity={0.5}>
          {/* Bounds incadreaza o singura data la montare (FARA observe -> nu mai
              reincadreaza la rotire/scroll, deci nu mai da zoom). margin mai mare
              = camera mai departe = model mai mic (~20% fata de inainte). */}
          <Bounds fit clip margin={1.375}>
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
