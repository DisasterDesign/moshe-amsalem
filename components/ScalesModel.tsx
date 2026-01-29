'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Gold material for the scales
const goldMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#C9A962'),
  metalness: 0.9,
  roughness: 0.2,
})

function Scales({ isMobile }: { isMobile: boolean }) {
  const { scene } = useGLTF('/models/scales.glb?v=4')
  const beamRef = useRef<THREE.Object3D | null>(null)
  const leftPanRef = useRef<THREE.Object3D | null>(null)
  const rightPanRef = useRef<THREE.Object3D | null>(null)

  useEffect(() => {
    // Apply gold material to all meshes and find nodes
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = goldMaterial
      }
      const name = child.name.toLowerCase()
      // Find beam
      if (name.includes('beam') || name.includes('bar') || name.includes('arm')) {
        beamRef.current = child
      }
      // Find pans/bowls
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
      // On mobile: gentle automatic animation using sine wave
      const time = state.clock.getElapsedTime()
      targetRotation = Math.sin(time * 0.5) * 0.1 // Gentle swing
    } else {
      // On desktop: mouse-based animation
      const mouseX = state.pointer.x
      targetRotation = mouseX * 0.2094 // 12 degrees max
    }

    // Rotate beam
    if (beamRef.current) {
      beamRef.current.rotation.x = THREE.MathUtils.lerp(
        beamRef.current.rotation.x,
        targetRotation,
        0.05
      )
    }

    // Rotate pans in opposite direction to simulate gravity
    const panRotation = -targetRotation
    if (leftPanRef.current) {
      leftPanRef.current.rotation.x = THREE.MathUtils.lerp(
        leftPanRef.current.rotation.x,
        panRotation,
        0.05
      )
    }
    if (rightPanRef.current) {
      rightPanRef.current.rotation.x = THREE.MathUtils.lerp(
        rightPanRef.current.rotation.x,
        panRotation,
        0.05
      )
    }
  })

  return (
    <Center>
      <primitive object={scene} scale={1} />
    </Center>
  )
}

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
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <Scales isMobile={isMobile} />
        {/* @ts-expect-error - environmentRotation exists in drei but types are outdated */}
        <Environment preset="studio" environmentRotation={[0, 0.5236, 0]} />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/scales.glb?v=4')
