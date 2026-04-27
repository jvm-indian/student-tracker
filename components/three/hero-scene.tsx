'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Grid, Line, Box, Sphere } from '@react-three/drei'
import { useRef, Suspense, useMemo } from 'react'
import * as THREE from 'three'

function CoreServer() {
  const coreRef = useRef<THREE.Group>(null)
  const ringRef1 = useRef<THREE.Mesh>(null)
  const ringRef2 = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.2
      coreRef.current.position.y = Math.sin(t) * 0.2 + 1
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x = t * 0.5
      ringRef1.current.rotation.y = t * 0.2
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y = t * 0.5
      ringRef2.current.rotation.z = t * 0.3
    }
  })

  return (
    <group ref={coreRef}>
      {/* Outer server chassis */}
      <Box args={[2, 4, 2]}>
        <meshStandardMaterial color="#0ea5e9" wireframe emissive="#0ea5e9" emissiveIntensity={0.8} />
      </Box>
      <Box args={[1.9, 3.9, 1.9]}>
        <meshStandardMaterial color="#020617" opacity={0.9} transparent />
      </Box>
      
      {/* Inner Glowing Data Core */}
      <Sphere args={[0.6, 32, 32]}>
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={2.5} />
      </Sphere>

      {/* Orbiting rings */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1} />
      </mesh>
      <mesh ref={ringRef2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3, 0.015, 16, 100]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

function DataNodes() {
  const nodesRef = useRef<THREE.InstancedMesh>(null)
  const nodeCount = 80
  
  const positions = useMemo(() => {
    const pos = new Float32Array(nodeCount * 3)
    for (let i = 0; i < nodeCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10 + 4
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!nodesRef.current) return
    const time = state.clock.elapsedTime
    
    const dummy = new THREE.Object3D()
    for (let i = 0; i < nodeCount; i++) {
      const x = positions[i * 3]
      const y = positions[i * 3 + 1] + Math.sin(time * 0.5 + i) * 1.5
      const z = positions[i * 3 + 2]
      
      dummy.position.set(x, y, z)
      dummy.rotation.x = time * 0.5 + i
      dummy.rotation.y = time * 0.5 + i
      dummy.updateMatrix()
      nodesRef.current.setMatrixAt(i, dummy.matrix)
    }
    nodesRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={nodesRef} args={[undefined, undefined, nodeCount]}>
      <boxGeometry args={[0.15, 0.15, 0.15]} />
      <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
    </instancedMesh>
  )
}

function DataConnections() {
  // Draw glowing lines connecting random points to the core
  const lines = useMemo(() => {
    const l = []
    for (let i = 0; i < 25; i++) {
      const start: [number, number, number] = [0, 1, 0] // Core position
      const end: [number, number, number] = [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 + 4,
        (Math.random() - 0.5) * 15
      ]
      l.push({ start, end })
    }
    return l
  }, [])

  return (
    <>
      {lines.map((line, i) => (
        <Line 
          key={i}
          points={[line.start, line.end]} 
          color="#14b8a6" 
          lineWidth={0.5} 
          transparent 
          opacity={0.15} 
        />
      ))}
    </>
  )
}

function HolographicGrid() {
  return (
    <Grid
      position={[0, -4, 0]}
      args={[50, 50]}
      cellSize={1}
      cellThickness={1}
      cellColor="#0ea5e9"
      sectionSize={5}
      sectionThickness={1.5}
      sectionColor="#8b5cf6"
      fadeDistance={30}
      fadeStrength={1.5}
    />
  )
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#0ea5e9" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#14b8a6" />
      <spotLight position={[0, 15, 0]} angle={0.5} penumbra={1} intensity={1} color="#8b5cf6" />
      
      <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />
      
      <CoreServer />
      <DataNodes />
      <DataConnections />
      <HolographicGrid />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.4}
        maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under the grid
        minPolarAngle={Math.PI / 4}
      />
    </>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 4, 18], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
