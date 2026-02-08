'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Gold color palette for wall bricks
const WALL_COLORS = [
  new THREE.Color('#8B6914'),
  new THREE.Color('#9E7A1A'),
  new THREE.Color('#B08D20'),
  new THREE.Color('#C5A028'),
  new THREE.Color('#C9A962'),
  new THREE.Color('#D4AF37'),
]

// Gold material for the scales model
const goldMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#C9A962'),
  metalness: 0.9,
  roughness: 0.2,
})

// Shared mouse state
const mouseTarget = { x: 0, y: 0 }
const mouseCurrent = { x: 0, y: 0 }

// Reusable temp color to avoid allocations in render loop
const tempColor = new THREE.Color()

// ============================================
// Gold Wall - Grid of brick-like cubes
// ============================================
function GoldWall({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const cubeData = useMemo(() => {
    const cols = isMobile ? 22 : 30
    const rows = isMobile ? 16 : 20
    const spacing = 1.05
    const cubeSize = 0.95
    const data = []

    for (let row = 0; row < rows; row++) {
      // Brick offset - every other row shifts by half
      const rowOffset = row % 2 === 0 ? 0 : spacing * 0.5

      for (let col = 0; col < cols; col++) {
        const x = (col - (cols - 1) / 2) * spacing + rowOffset
        const y = (row - (rows - 1) / 2) * spacing
        const z = (Math.random() - 0.5) * 0.3 // slight depth variation

        const scale = cubeSize * (0.92 + Math.random() * 0.16) // ±8%
        const rotX = (Math.random() - 0.5) * 0.06 // ±~3 degrees
        const rotY = (Math.random() - 0.5) * 0.06
        const rotZ = (Math.random() - 0.5) * 0.06

        const baseColor = WALL_COLORS[Math.floor(Math.random() * WALL_COLORS.length)].clone()
        baseColor.r += (Math.random() - 0.5) * 0.03
        baseColor.g += (Math.random() - 0.5) * 0.03
        baseColor.b += (Math.random() - 0.5) * 0.02

        data.push({
          x, y, z, scale, rotX, rotY, rotZ,
          baseColor,
          shimmerPhase: Math.random() * Math.PI * 2,
        })
      }
    }
    return data
  }, [isMobile])

  // Set initial transforms and colors
  useEffect(() => {
    if (!meshRef.current) return
    for (let i = 0; i < cubeData.length; i++) {
      const cube = cubeData[i]
      dummy.position.set(cube.x, cube.y, cube.z)
      dummy.rotation.set(cube.rotX, cube.rotY, cube.rotZ)
      dummy.scale.setScalar(cube.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, cube.baseColor)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  }, [cubeData, dummy])

  useFrame((state) => {
    if (!meshRef.current) return

    // Parallax - rotate the whole wall group
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseCurrent.x * 0.08,
        0.05
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouseCurrent.y * 0.05,
        0.05
      )
    }

    // Shimmer wave across the wall
    const time = state.clock.getElapsedTime()
    let colorChanged = false

    for (let i = 0; i < cubeData.length; i++) {
      const cube = cubeData[i]
      const shimmerWave = Math.sin(time * 0.8 + cube.x * 0.4 + cube.y * 0.2 + cube.shimmerPhase)

      if (shimmerWave > 0.6) {
        const brightness = (shimmerWave - 0.6) / 0.4
        tempColor.copy(cube.baseColor)
        tempColor.r = Math.min(1, tempColor.r + brightness * 0.25)
        tempColor.g = Math.min(1, tempColor.g + brightness * 0.2)
        tempColor.b = Math.min(1, tempColor.b + brightness * 0.15)
        meshRef.current.setColorAt(i, tempColor)
        colorChanged = true
      } else {
        meshRef.current.setColorAt(i, cube.baseColor)
        colorChanged = true
      }
    }

    if (colorChanged && meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, cubeData.length]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          metalness={0.88}
          roughness={0.22}
          envMapIntensity={1.0}
        />
      </instancedMesh>
    </group>
  )
}

// ============================================
// Gold Floor
// ============================================
function GoldFloor() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!groupRef.current) return
    // Follow the same parallax as the wall
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouseCurrent.x * 0.08,
      0.05
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouseCurrent.y * 0.05,
      0.05
    )
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, -7.5, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 25]} />
        <meshStandardMaterial
          color="#6B5310"
          metalness={0.95}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>
    </group>
  )
}

// ============================================
// Mouse/Orientation Tracker
// ============================================
function InputTracker({ isMobile }: { isMobile: boolean }) {
  useEffect(() => {
    if (isMobile) {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        const gamma = (e.gamma || 0) / 45
        const beta = ((e.beta || 0) - 45) / 45
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

  useFrame(() => {
    mouseCurrent.x = THREE.MathUtils.lerp(mouseCurrent.x, mouseTarget.x, 0.04)
    mouseCurrent.y = THREE.MathUtils.lerp(mouseCurrent.y, mouseTarget.y, 0.04)
  })

  return null
}

// ============================================
// Scales Model - positioned on the floor
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
    <group position={[0, -3, 0]}>
      <Center>
        <primitive object={scene} scale={1} />
      </Center>
    </group>
  )
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

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ powerPreference: 'high-performance', antialias: false }}
        dpr={[1, isMobile ? 1 : 1.5]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[8, 12, 5]}
          intensity={1.2}
          color="#FFF8DC"
          castShadow={false}
        />
        <directionalLight position={[-5, -5, -3]} intensity={0.2} color="#C5A028" />
        <pointLight position={[0, 3, 8]} intensity={0.4} color="#FFD700" />

        <InputTracker isMobile={isMobile} />

        {/* Gold brick wall background */}
        <GoldWall isMobile={isMobile} />

        {/* Gold reflective floor */}
        <GoldFloor />

        {/* Scales on the floor */}
        <Scales isMobile={isMobile} />

        {/* @ts-expect-error - environmentRotation exists in drei but types are outdated */}
        <Environment preset="studio" environmentRotation={[0, 0.5236, 0]} />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/scales.glb?v=4')
