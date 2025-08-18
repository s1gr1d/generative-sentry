import { MovingGradientCanvas } from '@/components/MovingGradient/MovingGradientCanvas'
import type { SectionDefinition } from './types'

export const movingGradientsSection: SectionDefinition = {
  id: 'moving-gradients',
  title: 'Moving Gradients',
  description: 'Dynamic color transitions powered by shader programming. Watch as colors blend and flow in smooth, hypnotic motions that showcase the beauty of computational art and real-time graphics rendering.',
  order: 2,
  component: () => (
    <MovingGradientCanvas
      canvasKey="moving-gradients"
      speed={0.6}
      noiseScale={12.0}
      flowIntensity={0.25}
      colorShift={0.04}
      colorCategory="WARM"
      animateColors={true}
      colorAnimationSpeed={0.08}
      isStatic={false}
      mouseInfluence={1.0}
    />
  )
}
