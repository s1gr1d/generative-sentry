import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { NORMALIZED_RGB, getRandomColorNames, COLOR_PALETTE, type ColorCategory } from '@/utils/colorPalette'

export interface FloatingCubesProps {
  /** Number of cubes to generate (default: 20) */
  cubeCount?: number
  /** Type of shader/material to use (default: 'standard') */
  shaderType?: 'standard' | 'phong' | 'wireframe' | 'glow' | 'metallic'
  /** Radius within which each cube can float (default: 1.5) */
  floatRadius?: number
  /** Speed of floating animation (default: 0.5) */
  floatSpeed?: number
  /** Color category for cube colors (default: 'ALL') */
  colorCategory?: ColorCategory
  /** Enable wireframe overlay (default: false) */
  enableWireframe?: boolean
  /** Size of cubes (default: 0.5) */
  cubeSize?: number
}

interface CubeData {
  id: number
  position: THREE.Vector3
  originalPosition: THREE.Vector3
  color: keyof typeof COLOR_PALETTE
  phaseOffset: THREE.Vector3
  rotationSpeed: THREE.Vector3
}

const FloatingCubes: React.FC<FloatingCubesProps> = ({
  cubeCount = 20,
  shaderType = 'standard',
  floatRadius = 1.5,
  floatSpeed = 0.5,
  colorCategory = 'ALL',
  enableWireframe = false,
  cubeSize = 0.5
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const { camera, size } = useThree()
  
  // Mouse tracking state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const windowHalfX = size.width / 2
  const windowHalfY = size.height / 2
  
  // Generate cube data with positions and colors
  const cubesData = useMemo<CubeData[]>(() => {
    const colors = getRandomColorNames(cubeCount, colorCategory)
    
    return Array.from({ length: cubeCount }, (_, i) => {
      // Distribute cubes randomly in 3D space (similar to the reference example)
      const basePosition = new THREE.Vector3(
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000
      )
      
      return {
        id: i,
        position: basePosition.clone(),
        originalPosition: basePosition.clone(),
        color: colors[i % colors.length],
        phaseOffset: new THREE.Vector3(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        )
      }
    })
  }, [cubeCount, colorCategory])
  
  // Mouse event handling
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX - windowHalfX) * 10
      const mouseY = (event.clientY - windowHalfY) * 10
      setMousePosition({ x: mouseX, y: mouseY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [windowHalfX, windowHalfY])
  
  // Create material based on shader type
  const createMaterial = useMemo(() => {
    return (colorName: keyof typeof COLOR_PALETTE) => {
      const color = new THREE.Color(...NORMALIZED_RGB[colorName])
      
      switch (shaderType) {
        case 'phong':
          return new THREE.MeshPhongMaterial({
            color,
            shininess: 100,
            specular: 0x444444
          })
        
        case 'wireframe':
          return new THREE.MeshBasicMaterial({
            color,
            wireframe: true,
            transparent: true,
            opacity: 0.8
          })
        
        case 'glow':
          return new THREE.MeshLambertMaterial({
            color,
            emissive: color.clone().multiplyScalar(0.3),
            transparent: true,
            opacity: 0.9
          })
        
        case 'metallic':
          return new THREE.MeshStandardMaterial({
            color,
            metalness: 0.8,
            roughness: 0.2,
            envMapIntensity: 1.0
          })
        
        case 'standard':
        default:
          return new THREE.MeshStandardMaterial({
            color,
            metalness: 0.1,
            roughness: 0.3
          })
      }
    }
  }, [shaderType])
  
  // Animation loop
  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.getElapsedTime() * floatSpeed
    
    // Update camera position based on mouse movement (like the reference example)
    camera.position.x += (mousePosition.x - camera.position.x) * 0.05
    camera.position.y += (-mousePosition.y - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
    
    // Group rotation animation (like the reference example)
    const rx = Math.sin(time * 0.7) * 0.5
    const ry = Math.sin(time * 0.3) * 0.5
    const rz = Math.sin(time * 0.2) * 0.5
    groupRef.current.rotation.x = rx
    groupRef.current.rotation.y = ry
    groupRef.current.rotation.z = rz
    
    // Individual cube floating animation within radius
    groupRef.current.children.forEach((cube, index) => {
      const cubeData = cubesData[index]
      if (!cubeData) return
      
      // Floating animation within radius
      const floatX = Math.sin(time + cubeData.phaseOffset.x) * floatRadius * 20
      const floatY = Math.cos(time * 0.7 + cubeData.phaseOffset.y) * floatRadius * 20
      const floatZ = Math.sin(time * 0.5 + cubeData.phaseOffset.z) * floatRadius * 20
      
      // Update position relative to original position
      cube.position.copy(cubeData.originalPosition)
      cube.position.x += floatX
      cube.position.y += floatY
      cube.position.z += floatZ
      
      // Individual cube rotation animation
      cube.rotation.x += cubeData.rotationSpeed.x
      cube.rotation.y += cubeData.rotationSpeed.y
      cube.rotation.z += cubeData.rotationSpeed.z
    })
  })
  
  return (
    <group ref={groupRef}>
      {cubesData.map((cubeData) => (
        <mesh
          key={cubeData.id}
          position={cubeData.position}
          material={createMaterial(cubeData.color)}
        >
          <boxGeometry args={[cubeSize * 100, cubeSize * 100, cubeSize * 100]} />
          
          {/* Optional wireframe overlay */}
          {enableWireframe && shaderType !== 'wireframe' && (
            <mesh>
              <boxGeometry args={[cubeSize * 100 + 1, cubeSize * 100 + 1, cubeSize * 100 + 1]} />
              <meshBasicMaterial
                color={COLOR_PALETTE[cubeData.color]}
                wireframe={true}
                transparent={true}
                opacity={0.3}
              />
            </mesh>
          )}
        </mesh>
      ))}
    </group>
  )
}

export { FloatingCubes }
