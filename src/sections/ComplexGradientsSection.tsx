import { MovingGradientCanvas } from '@/components/MovingGradient/MovingGradientCanvas'
import type { SectionDefinition } from './types'

export const complexGradientsSection: SectionDefinition = {
  id: 'complex-gradients',
  title: 'Complex Gradients',
  description: 'complex gradients',
  bodyText: 'Multi-layered color effects with advanced shader techniques. This piece combines multiple gradient algorithms to create complex, sophisticated visual patterns that demonstrate the power of modern GPU computing.',
  order: 3,
  component: () => (
    <MovingGradientCanvas
      canvasKey="complex-gradients"
      speed={0.8}
      noiseScale={15.0}
      flowIntensity={0.35}
      colorShift={0.06}
      colorCategory="BLURPLES"
      animateColors={true}
      colorAnimationSpeed={0.12}
      isStatic={false}
      mouseInfluence={1.5}
    />
  )
}
