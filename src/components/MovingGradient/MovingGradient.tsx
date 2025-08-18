import React, { useRef, useMemo, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NORMALIZED_RGB, getRandomColorNames, COLOR_PALETTE, type ColorCategory } from '@/utils/colorPalette'
import vertexShader from '../../shaders/complexGradientVertex.glsl?raw'
import fragmentShader from '../../shaders/complexGradientFragment.glsl?raw'

export interface MovingGradientProps {
  /** Speed of the gradient animation (default: 1.0) */
  speed?: number
  /** Scale of the noise effect (default: 3.0) */
  noiseScale?: number
  /** Intensity of the flowing movement (default: 0.1) */
  flowIntensity?: number
  /** Intensity of color shifting over time (default: 0.05) */
  colorShift?: number
  /** Whether to fill the entire viewport (default: false) */
  fullScreen?: boolean
  /** Custom width (used when not fullScreen) */
  width?: number
  /** Custom height (used when not fullScreen) */
  height?: number
  /** Z-position of the gradient plane (default: -1) */
  zPosition?: number
  /** Color category for random color selection (default: 'ALL') */
  colorCategory?: ColorCategory
  /** Fixed colors (overrides random selection) - use color names like 'BLURPLE', 'DK_PURPLE', etc. */
  colors?: readonly [keyof typeof COLOR_PALETTE, keyof typeof COLOR_PALETTE, keyof typeof COLOR_PALETTE, keyof typeof COLOR_PALETTE, keyof typeof COLOR_PALETTE]
  /** Whether to animate color changes (default: false) */
  animateColors?: boolean
  /** Color animation speed (default: 0.1) */
  colorAnimationSpeed?: number
  /** Whether the gradient should be static (no automatic animation) (default: true) */
  isStatic?: boolean
  /** Mouse influence intensity on the gradient (default: 1.0) */
  mouseInfluence?: number
}

const MovingGradient: React.FC<MovingGradientProps> = ({
  speed = 1.0,
  noiseScale = 3.0,
  flowIntensity = 0.1,
  colorShift = 0.05,
  fullScreen = false,
  width = 10,
  height = 10,
  zPosition = -1,
  colorCategory = 'ALL',
  colors,
  animateColors = false,
  colorAnimationSpeed = 0.1,
  isStatic = true,
  mouseInfluence = 1.0
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const colorChangeTimeRef = useRef<number>(0)
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5))
  
  // Generate or use provided colors
  const currentColors = useMemo(() => {
    if (colors) {
      return colors
    }
    const randomColors = getRandomColorNames(5, colorCategory)
    
    // Fallback to ensure we always have 5 colors
    const fallbackColors: (keyof typeof COLOR_PALETTE)[] = ['BLURPLE', 'DK_PURPLE', 'LT_PINK', 'DK_ORANGE', 'LT_GREEN']
    
    while (randomColors.length < 5) {
      randomColors.push(fallbackColors[randomColors.length])
    }
    
    return randomColors.slice(0, 5) as [keyof typeof COLOR_PALETTE, keyof typeof COLOR_PALETTE, keyof typeof COLOR_PALETTE, keyof typeof COLOR_PALETTE, keyof typeof COLOR_PALETTE]
  }, [colors, colorCategory])
  
  // Create shader material with the complex gradient effects
  const shaderMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_color1: { value: new THREE.Color(...(NORMALIZED_RGB[currentColors[0]] || [0.5, 0.3, 1])) },
        u_color2: { value: new THREE.Color(...(NORMALIZED_RGB[currentColors[1]] || [0.3, 0.05, 0.35])) },
        u_color3: { value: new THREE.Color(...(NORMALIZED_RGB[currentColors[2]] || [1, 0.3, 0.7])) },
        u_color4: { value: new THREE.Color(...(NORMALIZED_RGB[currentColors[3]] || [0.9, 0.5, 0.1])) },
        u_color5: { value: new THREE.Color(...(NORMALIZED_RGB[currentColors[4]] || [0.75, 0.9, 0.3])) },
        u_speed: { value: speed },
        u_noiseScale: { value: noiseScale },
        u_flowIntensity: { value: flowIntensity },
        u_colorShift: { value: colorShift },
        u_mouse: { value: mouseRef.current },
        u_mouseInfluence: { value: mouseInfluence },
        u_isStatic: { value: isStatic }
      }
    })


    
    return material
  }, [currentColors, speed, noiseScale, flowIntensity, colorShift, mouseInfluence, isStatic])


  
  // Update uniforms when props change
  useEffect(() => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.u_speed.value = speed
      shaderMaterial.uniforms.u_noiseScale.value = noiseScale
      shaderMaterial.uniforms.u_flowIntensity.value = flowIntensity
      shaderMaterial.uniforms.u_colorShift.value = colorShift
      shaderMaterial.uniforms.u_mouseInfluence.value = mouseInfluence
      shaderMaterial.uniforms.u_isStatic.value = isStatic
      shaderMaterial.uniforms.u_resolution.value.set(
        fullScreen ? window.innerWidth : width * 100,
        fullScreen ? window.innerHeight : height * 100
      )
    }
  }, [speed, noiseScale, flowIntensity, colorShift, mouseInfluence, isStatic, fullScreen, width, height, shaderMaterial])
  
  // Update colors when currentColors change
  useEffect(() => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.u_color1.value.set(...(NORMALIZED_RGB[currentColors[0]] || [0.5, 0.3, 1]))
      shaderMaterial.uniforms.u_color2.value.set(...(NORMALIZED_RGB[currentColors[1]] || [0.3, 0.05, 0.35]))
      shaderMaterial.uniforms.u_color3.value.set(...(NORMALIZED_RGB[currentColors[2]] || [1, 0.3, 0.7]))
      shaderMaterial.uniforms.u_color4.value.set(...(NORMALIZED_RGB[currentColors[3]] || [0.9, 0.5, 0.1]))
      shaderMaterial.uniforms.u_color5.value.set(...(NORMALIZED_RGB[currentColors[4]] || [0.75, 0.9, 0.3]))
    }
  }, [currentColors, shaderMaterial])
  
  // Handle pointer events using React Three Fiber's event system
  const handlePointerMove = useCallback((event: any) => {
    // event.uv contains normalized coordinates [0,1] for the mesh
    if (event.uv && shaderMaterial) {
      mouseRef.current.set(event.uv.x, event.uv.y)
      shaderMaterial.uniforms.u_mouse.value = mouseRef.current
    }
  }, [shaderMaterial])

  // Animate the gradient and optionally change colors
  useFrame((state) => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.u_time.value = state.clock.getElapsedTime()
      
      // Animate colors if enabled
      if (animateColors) {
        colorChangeTimeRef.current += colorAnimationSpeed * 0.016 // ~60fps
        
        if (colorChangeTimeRef.current > 5.0) { // Change colors every 5 seconds
          colorChangeTimeRef.current = 0
          const newColors = getRandomColorNames(5, colorCategory)
          
          // Smoothly transition to new colors
          shaderMaterial.uniforms.u_color1.value.lerp(
            new THREE.Color(...(NORMALIZED_RGB[newColors[0]] || [0.5, 0.3, 1])), 
            0.02
          )
          shaderMaterial.uniforms.u_color2.value.lerp(
            new THREE.Color(...(NORMALIZED_RGB[newColors[1]] || [0.3, 0.05, 0.35])), 
            0.02
          )
          shaderMaterial.uniforms.u_color3.value.lerp(
            new THREE.Color(...(NORMALIZED_RGB[newColors[2]] || [1, 0.3, 0.7])), 
            0.02
          )
          shaderMaterial.uniforms.u_color4.value.lerp(
            new THREE.Color(...(NORMALIZED_RGB[newColors[3]] || [0.9, 0.5, 0.1])), 
            0.02
          )
          shaderMaterial.uniforms.u_color5.value.lerp(
            new THREE.Color(...(NORMALIZED_RGB[newColors[4]] || [0.75, 0.9, 0.3])), 
            0.02
          )
        }
      }
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
      onPointerMove={handlePointerMove}
    >
      <planeGeometry args={[geometryWidth, geometryHeight]} />
    </mesh>
  )
}

export { MovingGradient }
