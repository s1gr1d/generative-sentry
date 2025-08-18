import React, { useState } from 'react'
import { MovingGradientCanvas } from '../MovingGradient/MovingGradientCanvas'
import styles from './GradientExample.module.css'

const GradientExample: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const [noiseScale, setNoiseScale] = useState(10.0)

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <h2>Moving Gradient Example</h2>
        
        <div className={styles.controlGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={isFullScreen}
              onChange={(e) => setIsFullScreen(e.target.checked)}
            />
            Full Screen Mode
          </label>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>
            Speed: {speed.toFixed(1)}
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </label>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>
            Grain Scale: {noiseScale.toFixed(1)}
            <input
              type="range"
              min="1.0"
              max="50.0"
              step="1.0"
              value={noiseScale}
              onChange={(e) => setNoiseScale(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </label>
        </div>
      </div>

      {!isFullScreen && (
        <div className={styles.gradientContainer}>
          <h3>Contained Gradient</h3>
          <div className={styles.gradientBox}>
            <MovingGradientCanvas
              speed={speed}
              noiseScale={noiseScale}
              width={8}
              height={6}
            />
          </div>
        </div>
      )}

      {isFullScreen && (
        <MovingGradientCanvas
          fullScreen
          speed={speed}
          noiseScale={noiseScale}
        />
      )}
    </div>
  )
}

export { GradientExample }
