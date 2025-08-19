import type { SectionDefinition } from './types'
import { gradientWavesSection } from './GradientWavesSection'
import { movingGradientsSection } from './MovingGradientsSection'
import { complexGradientsSection } from './ComplexGradientsSection'
import { interactiveGradientsSection } from './InteractiveGradientsSection'
import { floatingCubesSection } from './FloatingCubesSection'
import { artisticCubesSection } from './ArtisticCubesSection'
import { alphabetSoupSection } from './AlphabetSoupSection'
import { sentryDataSection } from './SentryDataSection'

// Registry of all available sections
const sectionRegistry: SectionDefinition[] = [
  gradientWavesSection,
  movingGradientsSection,
  complexGradientsSection,
  interactiveGradientsSection,
  floatingCubesSection,
  artisticCubesSection,
  alphabetSoupSection,
  sentryDataSection,
]

// Sort sections by order
export const sections = sectionRegistry.sort((a, b) => a.order - b.order)

// Helper function to get section by ID
export const getSectionById = (id: string): SectionDefinition | undefined => {
  return sections.find(section => section.id === id)
}

// Export types
export type { SectionDefinition, SectionConfig } from './types'
