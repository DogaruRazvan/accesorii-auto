"use client"

import { Suspense, useEffect, useMemo, useRef } from "react"

type ProgressRef = { current: number }
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, Environment, ContactShadows, Float } from "@react-three/drei"
import * as THREE from "three"

const MODEL_PATH =
  process.env.NEXT_PUBLIC_HERO_MODEL || "/models/car_house.glb"

/* ─── Reglaje (modifica aici daca vrei alt look) ───────────────────────── */
const TARGET_SIZE = 3.1         // inaltimea modelului in unitati (auto-scalat)
const FRONT_ROT_Y = 0           // rotatia finala (cu fata la camera). Daca apare
                                // cu spatele, pune Math.PI.
const SPIN_TURNS = 1.15         // cate ture face pe tot scroll-ul
// Sens INVERS fata de varianta veche: pleaca din partea cealalta.
const START_ROT_Y = FRONT_ROT_Y - SPIN_TURNS * Math.PI * 2
const ROT_DONE_AT = 0.72        // rotatia se termina la 72% din scroll
                                // (ultima parte e doar zoom)

// Camera: porneste departe / lateral / jos -> ajunge la cadru-erou (zoom)
const CAM_START = new THREE.Vector3(3.2, -0.3, 8.5)
const CAM_END = new THREE.Vector3(0, 0.6, 4.2)
const LOOK_AT = new THREE.Vector3(0, 0, 0)

// Pe mobil (sub breakpoint-ul `small` = 1024px) departam camera ca modelul sa
// para ~40% mai mic. 1.65 ≈ -39% marime aparenta.
const MOBILE_BREAKPOINT = 1024
const MOBILE_ZOOM_OUT = 1.65

/* ─── Easing ───────────────────────────────────────────────────────────── */
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1)
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

function CinematicModel({ progress }: { progress: ProgressRef }) {
  const spin = useRef<THREE.Group>(null)
  const { scene } = useGLTF(MODEL_PATH)
  const { camera } = useThree()

  // Normalizeaza orice .glb: centreaza in origine + scaleaza la TARGET_SIZE.
  const { offset, scale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    return { offset: center.clone().multiplyScalar(-1), scale: TARGET_SIZE / maxDim }
  }, [scene])

  // Detecteaza mobil (latimea ecranului) — fara re-render, citit in useFrame
  const isMobile = useRef(false)
  useEffect(() => {
    const update = () => {
      isMobile.current = window.innerWidth < MOBILE_BREAKPOINT
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  useFrame(() => {
    const p = progress.current

    // Rotatie condusa de scroll, lin (lerp spre tinta -> nu sare brusc)
    if (spin.current) {
      const rt = easeInOutCubic(clamp01(p / ROT_DONE_AT))
      const targetRot = START_ROT_Y + (FRONT_ROT_Y - START_ROT_Y) * rt
      spin.current.rotation.y += (targetRot - spin.current.rotation.y) * 0.12
    }

    // Camera: dolly + zoom pe tot scroll-ul, lin
    const ct = easeInOutCubic(clamp01(p))
    const target = CAM_START.clone().lerp(CAM_END, ct)
    // Pe mobil departam camera (lookAt = origine) -> model ~40% mai mic,
    // umbra ramane aliniata sub el (nu scalam mesh-ul).
    if (isMobile.current) target.multiplyScalar(MOBILE_ZOOM_OUT)
    camera.position.lerp(target, 0.1)
    camera.lookAt(LOOK_AT)
  })

  return (
    <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.35}>
      <group ref={spin} rotation={[0, START_ROT_Y, 0]}>
        <group scale={scale}>
          <primitive object={scene} position={offset.toArray()} />
        </group>
      </group>
    </Float>
  )
}

export default function Model3D({ progress }: { progress: ProgressRef }) {
  return (
    <Canvas
      camera={{ position: CAM_START.toArray(), fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* Lumini -> volum, reflexii, accent verde brand */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.3} castShadow />
      <directionalLight position={[-6, 2, -4]} intensity={0.5} color="#10B981" />
      <spotLight position={[0, 6, 2]} angle={0.5} penumbra={1} intensity={0.6} />

      <Suspense fallback={null}>
        <CinematicModel progress={progress} />

        <ContactShadows
          position={[0, -TARGET_SIZE / 2 - 0.05, 0]}
          opacity={0.4}
          scale={12}
          blur={2.8}
          far={4}
          color="#000000"
        />

        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload(MODEL_PATH)
