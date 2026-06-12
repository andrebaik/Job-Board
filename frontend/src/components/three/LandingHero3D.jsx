import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const PARTICLE_COUNT = 150
const particlePositions = new Float32Array(PARTICLE_COUNT * 3)
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particlePositions[i * 3] = (Math.random() - 0.5) * 12
  particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8 + 0.5
  particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2
}

function Handle({ position }) {
  const curve = useMemo(() => {
    const pts = [
      new THREE.Vector3(0, 0, -0.28),
      new THREE.Vector3(0, 0.12, -0.3),
      new THREE.Vector3(0, 0.22, 0),
      new THREE.Vector3(0, 0.12, 0.3),
      new THREE.Vector3(0, 0, 0.28),
    ]
    return new THREE.CatmullRomCurve3(pts)
  }, [])

  return (
    <mesh position={position}>
      <tubeGeometry args={[curve, 16, 0.035, 8, false]} />
      <meshPhysicalMaterial color="#94a3b8" metalness={0.7} roughness={0.25} />
    </mesh>
  )
}

function BriefcaseModel() {
  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.6}>
      <group>
        <RoundedBox args={[2.2, 1.4, 0.9]} radius={0.12} smoothness={4}>
          <meshPhysicalMaterial
            color="#4f46e5"
            metalness={0.2}
            roughness={0.35}
            clearcoat={0.4}
            clearcoatRoughness={0.3}
          />
        </RoundedBox>

        <Handle position={[0, 0.7, 0]} />

        <mesh position={[0, 0.25, 0.455]}>
          <boxGeometry args={[1.0, 0.015, 0.015]} />
          <meshPhysicalMaterial color="#f59e0b" metalness={0.3} roughness={0.4} />
        </mesh>

        <mesh position={[0, -0.25, 0.455]}>
          <boxGeometry args={[0.6, 0.015, 0.015]} />
          <meshPhysicalMaterial color="#cbd5e1" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  )
}

function JobCards() {
  const groupRef = useRef()
  const count = 6
  const radius = 2.8

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2
    }
  })

  const cards = useMemo(() => {
    const result = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      result.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        rotY: angle,
      })
    }
    return result
  }, [])

  return (
    <group ref={groupRef}>
      {cards.map((card, i) => (
        <group key={i} position={[card.x, 0, card.z]} rotation={[0, -card.rotY, 0]}>
          <Float speed={1} rotationIntensity={0.05} floatIntensity={0.15}>
            <RoundedBox args={[0.7, 0.45, 0.04]} radius={0.04} smoothness={2}>
              <meshPhysicalMaterial
                color="#f8fafc"
                metalness={0.05}
                roughness={0.5}
                transparent
                opacity={0.85}
              />
            </RoundedBox>

            <mesh position={[-0.15, 0.12, 0.025]}>
              <boxGeometry args={[0.3, 0.02, 0.001]} />
              <meshBasicMaterial color="#4f46e5" opacity={0.6} transparent />
            </mesh>
            <mesh position={[-0.15, 0.04, 0.025]}>
              <boxGeometry args={[0.4, 0.015, 0.001]} />
              <meshBasicMaterial color="#94a3b8" opacity={0.4} transparent />
            </mesh>
            <mesh position={[-0.15, -0.04, 0.025]}>
              <boxGeometry args={[0.35, 0.015, 0.001]} />
              <meshBasicMaterial color="#94a3b8" opacity={0.3} transparent />
            </mesh>
            <mesh position={[-0.15, -0.12, 0.025]}>
              <boxGeometry args={[0.25, 0.015, 0.001]} />
              <meshBasicMaterial color="#94a3b8" opacity={0.3} transparent />
            </mesh>
          </Float>
        </group>
      ))}
    </group>
  )
}

function Particles() {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#818cf8"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 8, 6]} intensity={2} />
      <directionalLight position={[-4, 3, -5]} intensity={0.6} color="#818cf8" />
      <hemisphereLight args={["#6366f1", "#1e1b4b", 0.4]} />

      <BriefcaseModel />
      <JobCards />
      <Particles />
    </>
  )
}

export default function LandingHero3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
