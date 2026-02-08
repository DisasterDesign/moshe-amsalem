'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center, Environment } from '@react-three/drei'
import { RoundedBoxGeometry } from 'three-stdlib'
import * as THREE from 'three'

// Uniform gold material for the scales model and cubes
const goldMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#C9A962'),
  metalness: 0.9,
  roughness: 0.2,
})

// Shared mouse state
const mouseTarget = { x: 0, y: 0 }
const mouseCurrent = { x: 0, y: 0 }

// ============================================
// Gold Wall - Grid of brick-like cubes
// ============================================
function GoldWall({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Rounded box geometry - shared across all instances
  const roundedGeometry = useMemo(
    () => new RoundedBoxGeometry(1, 1, 1, 4, 0.08),
    []
  )

  const cubeData = useMemo(() => {
    const cols = isMobile ? 12 : 16
    const rows = isMobile ? 9 : 11
    const cubeSize = 1.8
    const gap = 0.15
    const spacing = cubeSize + gap
    const data = []

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col - (cols - 1) / 2) * spacing
        const y = (row - (rows - 1) / 2) * spacing

        data.push({ x, y, scale: cubeSize, currentRotX: 0 })
      }
    }
    return data
  }, [isMobile])

  // Wall dimensions for mouse mapping
  const wallDims = useMemo(() => {
    const cols = isMobile ? 12 : 16
    const rows = isMobile ? 9 : 11
    const spacing = 1.8 + 0.15
    return {
      halfW: ((cols - 1) / 2) * spacing,
      halfH: ((rows - 1) / 2) * spacing,
    }
  }, [isMobile])

  // Set initial transforms
  useEffect(() => {
    if (!meshRef.current) return
    for (let i = 0; i < cubeData.length; i++) {
      const cube = cubeData[i]
      dummy.position.set(cube.x, cube.y, 0)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.setScalar(cube.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [cubeData, dummy])

  useFrame(() => {
    if (!groupRef.current || !meshRef.current) return

    // Parallax - rotate entire wall group
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

    // Mouse world position on wall plane
    const mouseWorldX = mouseCurrent.x * wallDims.halfW
    const mouseWorldY = -mouseCurrent.y * wallDims.halfH
    const hoverRadius = 3.5

    // Update cube rotations based on mouse proximity
    for (let i = 0; i < cubeData.length; i++) {
      const cube = cubeData[i]
      const dx = cube.x - mouseWorldX
      const dy = cube.y - mouseWorldY
      const dist = Math.sqrt(dx * dx + dy * dy)

      // Target: 20 degrees (0.349 rad) when mouse is on cube, fade with distance
      let targetRotX = 0
      if (dist < hoverRadius) {
        const proximity = 1 - dist / hoverRadius
        targetRotX = proximity * 0.349 // 20 degrees max
      }

      // Smooth lerp
      cube.currentRotX = THREE.MathUtils.lerp(cube.currentRotX, targetRotX, 0.08)

      // Only update matrix if cube is rotating or was recently
      if (Math.abs(cube.currentRotX) > 0.001) {
        dummy.position.set(cube.x, cube.y, 0)
        dummy.rotation.set(cube.currentRotX, 0, 0)
        dummy.scale.setScalar(cube.scale)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <instancedMesh
        ref={meshRef}
        args={[roundedGeometry, undefined, cubeData.length]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#C9A962"
          metalness={0.9}
          roughness={0.2}
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
    <Center>
      <primitive object={scene} scale={1} />
    </Center>
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
