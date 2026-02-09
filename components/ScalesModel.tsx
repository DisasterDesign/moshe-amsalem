'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Uniform gold material for the scales model
const goldMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#C9A962'),
  metalness: 0.9,
  roughness: 0.2,
})

// ============================================
// Scales Model
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
      targetRotation = state.pointer.x * 0.2094
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
        gl={{ powerPreference: 'high-performance', antialias: true }}
        dpr={[1, 2]}
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

        <Scales isMobile={isMobile} />

        {/* @ts-expect-error - environmentRotation exists in drei but types are outdated */}
        <Environment preset="studio" environmentRotation={[0, 0.5236, 0]} />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/scales.glb?v=4')
