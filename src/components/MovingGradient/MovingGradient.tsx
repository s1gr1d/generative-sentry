import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NORMALIZED_RGB } from '@/utils/colorPalette'
import vertexShader from '../../shaders/gradientVertex.glsl?raw'
import fragmentShader from '../../shaders/gradientFragment.glsl?raw'

export interface MovingGradientProps {
  /** Speed of the gradient animation (default: 1.0) */
  speed?: number
  /** Scale of the noise/grain effect (default: 10.0) */
  noiseScale?: number
  /** Whether to fill the entire viewport (default: false) */
  fullScreen?: boolean
  /** Custom width (used when not fullScreen) */
  width?: number
  /** Custom height (used when not fullScreen) */
  height?: number
  /** Z-position of the gradient plane (default: -1) */
  zPosition?: number
}

const MovingGradient: React.FC<MovingGradientProps> = ({
  speed = 1.0,
  noiseScale = 10.0,
  fullScreen = false,
  width = 10,
  height = 10,
  zPosition = -1
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Create shader material with the approved colors
  const shaderMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0.0 },
        u_color1: { value: new THREE.Color(...NORMALIZED_RGB.DK_PURPLE) },
        u_color2: { value: new THREE.Color(...NORMALIZED_RGB.LT_PURPLE) },
        u_color3: { value: new THREE.Color(...NORMALIZED_RGB.DK_ORANGE) },
        u_noiseScale: { value: noiseScale },
        u_speed: { value: speed }
      }
    })
    
    return material
  }, [noiseScale, speed])
  
  // Update uniforms when props change
  useEffect(() => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.u_noiseScale.value = noiseScale
      shaderMaterial.uniforms.u_speed.value = speed
    }
  }, [noiseScale, speed, shaderMaterial])
  
  // Animate the gradient
  useFrame((state) => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.u_time.value = state.clock.getElapsedTime()
    }
  })
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shaderMaterial.dispose()
    }
  }, [shaderMaterial])
  
  // Calculate geometry size based on props
  const { geometryWidth, geometryHeight } = useMemo(() => {
    if (fullScreen) {
      // Use a large plane for full screen coverage
      return { geometryWidth: 100, geometryHeight: 100 }
    }
    return { geometryWidth: width, geometryHeight: height }
  }, [fullScreen, width, height])
  
  return (
    <mesh
      ref={meshRef}
      position={[0, 0, zPosition]}
      material={shaderMaterial}
    >
      <planeGeometry args={[geometryWidth, geometryHeight]} />
    </mesh>
  )
}

export { MovingGradient }
