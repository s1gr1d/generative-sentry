import React from 'react'
import { Canvas } from '@react-three/fiber'
import { MovingGradient } from './MovingGradient'
import type { MovingGradientProps } from './MovingGradient'
import styles from './MovingGradient.module.css'

export interface MovingGradientCanvasProps extends MovingGradientProps {
  /** Additional CSS class name for the container */
  className?: string
  /** Custom styles for the container */
  style?: React.CSSProperties
}

const MovingGradientCanvas: React.FC<MovingGradientCanvasProps> = ({
  fullScreen = false,
  className,
  style,
  ...gradientProps
}) => {
  const containerClass = fullScreen 
    ? `${styles.fullScreenContainer} ${className || ''}`.trim()
    : `${styles.container} ${className || ''}`.trim()

  return (
    <div className={containerClass} style={style}>
      <Canvas
        className={styles.canvas}
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]} // Device pixel ratio for retina displays
      >
        <MovingGradient fullScreen={fullScreen} {...gradientProps} />
      </Canvas>
    </div>
  )
}

export { MovingGradientCanvas }
