import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { FloatingCubes, type FloatingCubesProps } from './FloatingCubes'
import { ErrorBoundary } from '../ErrorBoundary'
import styles from './FloatingCubes.module.css'

interface FloatingCubesCanvasProps extends FloatingCubesProps {
  /** Additional CSS class name */
  className?: string
  /** Unique key for the canvas (helps with proper mounting/unmounting) */
  canvasKey?: string
}

const FloatingCubesCanvas: React.FC<FloatingCubesCanvasProps> = ({
  className,
  canvasKey,
  ...cubesProps
}) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <span className={styles.srOnly}>Interactive 3D floating cubes with mouse controls</span>
      <ErrorBoundary>
        <Canvas
          key={canvasKey || 'floating-cubes-default'}
          className={styles.canvas}
          camera={{ 
            position: [0, 0, 500], 
            fov: 60,
            near: 1,
            far: 10000
          }}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Scene background and fog */}
          <color attach="background" args={['#181225']} />
          <fog attach="fog" args={['#181225', 1, 10000]} />
          
          {/* Basic lighting setup */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />
          
          <Suspense fallback={null}>
            <FloatingCubes {...cubesProps} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}

export { FloatingCubesCanvas }
