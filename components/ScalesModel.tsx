'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Center, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Gold material for the scales
const goldMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#C9A962'),
  metalness: 0.9,
  roughness: 0.2,
})

// Particle system configuration
const PARTICLE_COUNT = 100
const PARTICLE_LIFETIME = 2 // seconds
const EMIT_RATE = 3 // particles per frame

// Gold particle system that follows mouse
function GoldParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()

  // Particle state arrays
  const particleData = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const lifetimes = new Float32Array(PARTICLE_COUNT)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)

    // Initialize all particles as "dead" (lifetime = 0)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = -100 // Hide behind camera

      // Gold color with slight variation
      colors[i * 3] = 0.788 + Math.random() * 0.1     // R
      colors[i * 3 + 1] = 0.663 + Math.random() * 0.1 // G
      colors[i * 3 + 2] = 0.384 + Math.random() * 0.1 // B

      sizes[i] = 0
      lifetimes[i] = 0
      velocities[i * 3] = 0
      velocities[i * 3 + 1] = 0
      velocities[i * 3 + 2] = 0
    }

    return { positions, colors, sizes, lifetimes, velocities }
  }, [])

  const nextParticleIndex = useRef(0)
  const lastMousePos = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    if (!pointsRef.current) return

    const geometry = pointsRef.current.geometry
    const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute
    const sizeAttr = geometry.getAttribute('size') as THREE.BufferAttribute

    // Convert mouse position to world coordinates
    const mouseX = state.pointer.x * viewport.width / 2
    const mouseY = state.pointer.y * viewport.height / 2

    // Calculate mouse movement to determine if we should emit
    const mouseDelta = Math.abs(mouseX - lastMousePos.current.x) + Math.abs(mouseY - lastMousePos.current.y)
    lastMousePos.current = { x: mouseX, y: mouseY }

    // Emit new particles based on mouse movement
    const emitCount = Math.min(EMIT_RATE, Math.floor(mouseDelta * 5) + 1)

    for (let e = 0; e < emitCount; e++) {
      const i = nextParticleIndex.current

      // Set particle position at mouse
      particleData.positions[i * 3] = mouseX + (Math.random() - 0.5) * 0.3
      particleData.positions[i * 3 + 1] = mouseY + (Math.random() - 0.5) * 0.3
      particleData.positions[i * 3 + 2] = (Math.random() - 0.5) * 2

      // Random velocity (slight upward drift)
      particleData.velocities[i * 3] = (Math.random() - 0.5) * 2
      particleData.velocities[i * 3 + 1] = Math.random() * 1.5 + 0.5
      particleData.velocities[i * 3 + 2] = (Math.random() - 0.5) * 2

      // Reset lifetime and size
      particleData.lifetimes[i] = PARTICLE_LIFETIME
      particleData.sizes[i] = Math.random() * 0.15 + 0.05

      nextParticleIndex.current = (nextParticleIndex.current + 1) % PARTICLE_COUNT
    }

    // Update all particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (particleData.lifetimes[i] > 0) {
        // Update lifetime
        particleData.lifetimes[i] -= delta

        // Update position based on velocity
        particleData.positions[i * 3] += particleData.velocities[i * 3] * delta
        particleData.positions[i * 3 + 1] += particleData.velocities[i * 3 + 1] * delta
        particleData.positions[i * 3 + 2] += particleData.velocities[i * 3 + 2] * delta

        // Add some gravity and drag
        particleData.velocities[i * 3 + 1] -= delta * 0.5 // gravity
        particleData.velocities[i * 3] *= 0.98 // drag
        particleData.velocities[i * 3 + 1] *= 0.98
        particleData.velocities[i * 3 + 2] *= 0.98

        // Fade out size based on lifetime
        const lifeRatio = particleData.lifetimes[i] / PARTICLE_LIFETIME
        positionAttr.setXYZ(
          i,
          particleData.positions[i * 3],
          particleData.positions[i * 3 + 1],
          particleData.positions[i * 3 + 2]
        )
        sizeAttr.setX(i, particleData.sizes[i] * lifeRatio * lifeRatio)
      } else {
        // Hide dead particles
        positionAttr.setZ(i, -100)
        sizeAttr.setX(i, 0)
      }
    }

    positionAttr.needsUpdate = true
    sizeAttr.needsUpdate = true
  })

  // Create soft circular texture for blurry particles
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!

    // Create radial gradient for soft, blurry circle
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)')
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.15)')
    gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.05)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={particleData.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={PARTICLE_COUNT}
          array={particleData.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        map={particleTexture}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

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
        {!isMobile && <GoldParticles />}
        {/* @ts-expect-error - environmentRotation exists in drei but types are outdated */}
        <Environment preset="studio" environmentRotation={[0, 0.5236, 0]} />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/scales.glb?v=4')
