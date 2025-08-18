import { MovingGradientCanvas } from '@/components/MovingGradient/MovingGradientCanvas'
import type { SectionDefinition } from './types'

export const gradientWavesSection: SectionDefinition = {
  id: 'gradient-waves',
  title: 'Gradient Waves',
  description: 'Flowing animated gradients that ripple across the canvas like gentle waves. This foundational piece explores the basic principles of computational color theory and smooth motion.',
  order: 1,
  component: () => (
    <MovingGradientCanvas
      canvasKey="gradient-waves"
      speed={0.3}
      noiseScale={8.0}
      flowIntensity={0.2}
      colorShift={0.02}
      colorCategory="COOL"
      animateColors={true}
      colorAnimationSpeed={0.05}
      isStatic={false}
      mouseInfluence={0.5}
    />
  )
}
