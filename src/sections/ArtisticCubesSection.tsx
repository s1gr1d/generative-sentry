import { ArtisticCubesCanvas } from '@/components/ArtisticCubes/ArtisticCubesCanvas'
import type { SectionDefinition } from './types'

export const artisticCubesSection: SectionDefinition = {
  id: 'artistic-cubes',
  title: 'Artistic Cubes',
  description: 'floating cubes with experimental drei shaders',
  bodyText: 'An experimental showcase of advanced shader materials from @react-three/drei. Features wobbling geometry, distortion effects, transmission materials, and reflective surfaces that push the boundaries of real-time 3D rendering in the browser.',
  order: 6,
  component: () => (
    <ArtisticCubesCanvas
      canvasKey="artistic-cubes"
      cubeCount={80}
      floatRadius={4.0}
      floatSpeed={0.8}
      colorCategory="WARM"
      enablePostProcessing={true}
    />
  )
}
