"use client"

import { Suspense, useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"

const MODEL_PATH =
  process.env.NEXT_PUBLIC_HERO_MODEL || "/models/base_basic_pbr.glb"

// Tweak these to frame the model correctly for the new asset:
const MODEL_SCALE = 1.0     // increase if model appears too small
const MODEL_Y = 0           // shift model up/down in world units
const START_ROT_Y = 0.7     // ~40° profile angle at start
const CAMERA_Y = 1.5
const CAM_Z_START = 5.5     // wide shot (cinematic opening)
const CAM_Z_END = 4.0       // zoomed-in (end of animation)
const FOV = 42

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function CinematicModel() {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF(MODEL_PATH)
  const { camera } = useThree()
  const scrollP = useRef(0)

  useEffect(() => {
    camera.position.set(0, CAMERA_Y, CAM_Z_START)

    const onScroll = () => {
      // p: 0 at top → 1 after one full viewport of scroll (matches the 200vh driver)
      scrollP.current = Math.min(window.scrollY / window.innerHeight, 1)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [camera])

  useFrame(() => {
    const p = scrollP.current
    if (!group.current) return

    // Phase 1 (0 → 0.65): rotate from profile to face camera
    const rotT = easeInOut(Math.min(p / 0.65, 1))
    const targetRot = START_ROT_Y * (1 - rotT)
    group.current.rotation.y += (targetRot - group.current.rotation.y) * 0.1

    // Phase 2 (0.55 → 0.90): zoom in
    const zoomRaw = (p - 0.55) / 0.35
    const targetZ =
      CAM_Z_START + (CAM_Z_END - CAM_Z_START) * easeInOut(Math.min(Math.max(zoomRaw, 0), 1))
    camera.position.z += (targetZ - camera.position.z) * 0.07
  })

  return (
    <group
      ref={group}
      rotation={[0, START_ROT_Y, 0]}
      scale={MODEL_SCALE}
      position={[0, MODEL_Y, 0]}
    >
      <primitive object={scene} />
    </group>
  )
}

export default function Model3D() {
  return (
    <Canvas
      camera={{ position: [0, CAMERA_Y, CAM_Z_START], fov: FOV }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#10B981" />

      <Suspense fallback={null}>
        <CinematicModel />

        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.35}
          scale={12}
          blur={2.6}
          far={4}
          color="#000000"
        />

        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload(MODEL_PATH)
