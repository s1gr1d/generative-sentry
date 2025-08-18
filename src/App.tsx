import { Layout, Section } from './components/Layout'
import { MovingGradientCanvas } from './components/MovingGradient/MovingGradientCanvas'
import { MovingGradientExample } from './components/MovingGradient/MovingGradientExample'

export function App() {
  return (
    <Layout>
      <Section
        id="complex-gradients"
        title="Complex Gradients with mouse interaction"
        description="Multi-layered color effects with advanced shader techniques. This piece combines multiple gradient algorithms to create complex, sophisticated visual patterns that demonstrate the power of modern GPU computing."
      >

             <MovingGradientCanvas
               speed={0.5}
               noiseScale={10.0}
               flowIntensity={0.15}
               colorShift={0.03}
               colorCategory="PURPLES"
               animateColors={false}
               colorAnimationSpeed={0.1}
               isStatic={false}
               mouseInfluence={2.0}
               width={8}
               height={6}
             />
                  </Section>
      <Section
        id="moving-gradients" 
        title="Moving Gradients"
        description="Dynamic color transitions powered by shader programming. Watch as colors blend and flow in smooth, hypnotic motions that showcase the beauty of computational art and real-time graphics rendering."
      >
        <MovingGradientCanvas />
      </Section>

      <Section
        id="complex-gradients"
        title="Complex Gradients"
        description="Multi-layered color effects with advanced shader techniques. This piece combines multiple gradient algorithms to create complex, sophisticated visual patterns that demonstrate the power of modern GPU computing."
      >
        <MovingGradientCanvas 
          speed={0.8}
          colorCategory="BLURPLES"
          mouseInfluence={1.5}
          animateColors={true}
        />
      </Section>

      <Section
        id="complex-gradients"
        title="Complex Gradients with mouse interaction"
        description="Multi-layered color effects with advanced shader techniques. This piece combines multiple gradient algorithms to create complex, sophisticated visual patterns that demonstrate the power of modern GPU computing."
      >

             <MovingGradientCanvas
               speed={0.5}
               noiseScale={10.0}
               flowIntensity={0.15}
               colorShift={0.03}
               colorCategory="PURPLES"
               animateColors={false}
               colorAnimationSpeed={0.1}
               isStatic={false}
               mouseInfluence={2.0}
               width={8}
               height={6}
             />
                  </Section>



    </Layout>
  )
}
