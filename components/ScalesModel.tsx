'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Gold color palette
const GOLD_COLORS = [
  new THREE.Color('#8B6914'),  // dark gold
  new THREE.Color('#C5A028'),  // medium gold
  new THREE.Color('#D4AF37'),  // light gold
  new THREE.Color('#FFD700'),  // bright gold
  new THREE.Color('#FFF8DC'),  // flash/sparkle
]

// Gold material for the scales model
const goldMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#C9A962'),
  metalness: 0.9,
  roughness: 0.2,
})

// Shared mouse/orientation state
const mouseTarget = { x: 0, y: 0 }
const mouseCurrent = { x: 0, y: 0 }

// ============================================
// Gold Cubes Layer (InstancedMesh)
// ============================================
interface LayerConfig {
  count: number
  spreadX: number
  spreadY: number
  zMin: number
  zMax: number
  sizeMin: number
  sizeMax: number
  opacity: number
  parallaxStrength: number
  rotationSpeedRange: number
  breathAmplitude: number
}

function GoldCubesLayer({ config }: { config: LayerConfig }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Per-cube persistent data
  const cubeData = useMemo(() => {
    const data = []
    for (let i = 0; i < config.count; i++) {
      const baseColor = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)]
      // Slight color variation
      const color = baseColor.clone()
      color.r += (Math.random() - 0.5) * 0.05
      color.g += (Math.random() - 0.5) * 0.05
      color.b += (Math.random() - 0.5) * 0.03

      const scale = config.sizeMin + Math.random() * (config.sizeMax - config.sizeMin)

      data.push({
        x: (Math.random() - 0.5) * config.spreadX,
        y: (Math.random() - 0.5) * config.spreadY,
        z: config.zMin + Math.random() * (config.zMax - config.zMin),
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * config.rotationSpeedRange,
        rotSpeedY: (Math.random() - 0.5) * config.rotationSpeedRange,
        rotSpeedZ: (Math.random() - 0.5) * config.rotationSpeedRange,
        scale,
        breathPhase: Math.random() * Math.PI * 2,
        breathSpeed: 0.3 + Math.random() * 0.4,
        color,
        baseColor: color.clone(),
        shimmerPhase: Math.random() * Math.PI * 2,
      })
    }
    return data
  }, [config])

  // Set initial instance colors
  useEffect(() => {
    if (!meshRef.current) return
    for (let i = 0; i < cubeData.length; i++) {
      meshRef.current.setColorAt(i, cubeData[i].color)
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  }, [cubeData])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime()
    const pStr = config.parallaxStrength

    // Parallax rotation from mouse
    const parallaxRotY = mouseCurrent.x * pStr * 0.1
    const parallaxRotX = -mouseCurrent.y * pStr * 0.1

    for (let i = 0; i < cubeData.length; i++) {
      const cube = cubeData[i]

      // Self-rotation
      cube.rotX += cube.rotSpeedX * delta
      cube.rotY += cube.rotSpeedY * delta
      cube.rotZ += cube.rotSpeedZ * delta

      // Breathing
      const breathOffset = Math.sin(time * cube.breathSpeed + cube.breathPhase) * config.breathAmplitude

      // Position with parallax offset
      const px = cube.x + mouseCurrent.x * pStr * 0.5
      const py = cube.y + breathOffset + mouseCurrent.y * pStr * 0.3
      const pz = cube.z

      dummy.position.set(px, py, pz)
      dummy.rotation.set(
        cube.rotX + parallaxRotX,
        cube.rotY + parallaxRotY,
        cube.rotZ
      )
      dummy.scale.setScalar(cube.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)

      // Shimmer effect - wave of brightness
      const shimmerWave = Math.sin(time * 1.5 + cube.x * 0.3 + cube.shimmerPhase)
      if (shimmerWave > 0.7) {
        const brightness = (shimmerWave - 0.7) / 0.3 // 0 to 1
        const shimmerColor = cube.baseColor.clone()
        shimmerColor.r = Math.min(1, shimmerColor.r + brightness * 0.3)
        shimmerColor.g = Math.min(1, shimmerColor.g + brightness * 0.25)
        shimmerColor.b = Math.min(1, shimmerColor.b + brightness * 0.2)
        meshRef.current.setColorAt(i, shimmerColor)
      } else {
        meshRef.current.setColorAt(i, cube.baseColor)
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, config.count]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        metalness={0.85}
        roughness={0.25}
        transparent
        opacity={config.opacity}
        envMapIntensity={1.2}
      />
    </instancedMesh>
  )
}

// ============================================
// Mouse/Orientation Tracker
// ============================================
function InputTracker({ isMobile }: { isMobile: boolean }) {
  useEffect(() => {
    if (isMobile) {
      // Try gyroscope on mobile
      const handleOrientation = (e: DeviceOrientationEvent) => {
        const gamma = (e.gamma || 0) / 45 // -1 to 1
        const beta = ((e.beta || 0) - 45) / 45 // centered around 45 degrees
        mouseTarget.x = Math.max(-1, Math.min(1, gamma))
        mouseTarget.y = Math.max(-1, Math.min(1, beta))
      }
      window.addEventListener('deviceorientation', handleOrientation)
      return () => window.removeEventListener('deviceorientation', handleOrientation)
    } else {
      const handleMouseMove = (e: MouseEvent) => {
        mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1
        mouseTarget.y = (e.clientY / window.innerHeight) * 2 - 1
      }
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isMobile])

  // Smooth lerp the mouse position each frame
  useFrame(() => {
    mouseCurrent.x = THREE.MathUtils.lerp(mouseCurrent.x, mouseTarget.x, 0.04)
    mouseCurrent.y = THREE.MathUtils.lerp(mouseCurrent.y, mouseTarget.y, 0.04)
  })

  return null
}

// ============================================
// Scales Model (kept from original)
// ============================================
function Scales({ isMobile }: { isMobile: boolean }) {
  const { scene } = useGLTF('/models/scales.glb?v=4')
  const beamRef = useRef<THREE.Object3D | null>(null)
  const leftPanRef = useRef<THREE.Object3D | null>(null)
  const rightPanRef = useRef<THREE.Object3D | null>(null)

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = goldMaterial
      }
      const name = child.name.toLowerCase()
      if (name.includes('beam') || name.includes('bar') || name.includes('arm')) {
        beamRef.current = child
      }
      if (name.includes('pan') || name.includes('bowl') || name.includes('plate') || name.includes('dish')) {
        if (name.includes('left') || name.includes('l_') || name.includes('_l')) {
          leftPanRef.current = child
        } else if (name.includes('right') || name.includes('r_') || name.includes('_r')) {
          rightPanRef.current = child
        } else if (!leftPanRef.current) {
          leftPanRef.current = child
        } else if (!rightPanRef.current) {
          rightPanRef.current = child
        }
      }
    })
  }, [scene])

  useFrame((state) => {
    let targetRotation: number
    if (isMobile) {
      const time = state.clock.getElapsedTime()
      targetRotation = Math.sin(time * 0.5) * 0.1
    } else {
      targetRotation = mouseCurrent.x * 0.2094
    }

    if (beamRef.current) {
      beamRef.current.rotation.x = THREE.MathUtils.lerp(
        beamRef.current.rotation.x, targetRotation, 0.05
      )
    }
    const panRotation = -targetRotation
    if (leftPanRef.current) {
      leftPanRef.current.rotation.x = THREE.MathUtils.lerp(
        leftPanRef.current.rotation.x, panRotation, 0.05
      )
    }
    if (rightPanRef.current) {
      rightPanRef.current.rotation.x = THREE.MathUtils.lerp(
        rightPanRef.current.rotation.x, panRotation, 0.05
      )
    }
  })

  return (
    <Center>
      <primitive object={scene} scale={1} />
    </Center>
  )
}

// ============================================
// Layer configs
// ============================================
function getLayerConfigs(isMobile: boolean): LayerConfig[] {
  if (isMobile) {
    return [
      { // Far background
        count: 80, spreadX: 30, spreadY: 25, zMin: -15, zMax: -8,
        sizeMin: 0.15, sizeMax: 0.4, opacity: 0.4,
        parallaxStrength: 0.3, rotationSpeedRange: 0.1, breathAmplitude: 0.03,
      },
      { // Mid
        count: 100, spreadX: 25, spreadY: 20, zMin: -8, zMax: -3,
        sizeMin: 0.2, sizeMax: 0.6, opacity: 0.6,
        parallaxStrength: 0.6, rotationSpeedRange: 0.15, breathAmplitude: 0.05,
      },
      { // Near foreground
        count: 70, spreadX: 20, spreadY: 18, zMin: -3, zMax: 2,
        sizeMin: 0.3, sizeMax: 0.8, opacity: 0.5,
        parallaxStrength: 1.0, rotationSpeedRange: 0.2, breathAmplitude: 0.08,
      },
    ]
  }

  return [
    { // Far background
      count: 250, spreadX: 40, spreadY: 30, zMin: -20, zMax: -10,
      sizeMin: 0.15, sizeMax: 0.5, opacity: 0.4,
      parallaxStrength: 0.3, rotationSpeedRange: 0.08, breathAmplitude: 0.03,
    },
    { // Mid
      count: 350, spreadX: 35, spreadY: 25, zMin: -10, zMax: -3,
      sizeMin: 0.25, sizeMax: 0.7, opacity: 0.6,
      parallaxStrength: 0.7, rotationSpeedRange: 0.12, breathAmplitude: 0.06,
    },
    { // Near foreground
      count: 200, spreadX: 30, spreadY: 22, zMin: -3, zMax: 3,
      sizeMin: 0.35, sizeMax: 1.0, opacity: 0.5,
      parallaxStrength: 1.2, rotationSpeedRange: 0.18, breathAmplitude: 0.1,
    },
  ]
}

// ============================================
// Main Export
// ============================================
export default function ScalesModel() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const layers = useMemo(() => getLayerConfigs(isMobile), [isMobile])

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ powerPreference: 'high-performance', antialias: false }}
        dpr={[1, isMobile ? 1 : 1.5]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#FFF8DC" />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#C5A028" />
        <pointLight position={[0, 5, 5]} intensity={0.5} color="#FFD700" />

        <InputTracker isMobile={isMobile} />

        {/* Gold cube layers - far to near */}
        {layers.map((config, i) => (
          <GoldCubesLayer key={i} config={config} />
        ))}

        {/* Scales model on top */}
        <Scales isMobile={isMobile} />

        {/* @ts-expect-error - environmentRotation exists in drei but types are outdated */}
        <Environment preset="studio" environmentRotation={[0, 0.5236, 0]} />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/scales.glb?v=4')
