import type { SectionDefinition } from "./types";
import { heroCanvasSection } from "./HeroCanvasSection";
import { floatingCubesSection } from "./FloatingCubesSection";
import { artisticCubesSection } from "./ArtisticCubesSection";
import { alphabetSoupSection } from "./AlphabetSoupSection";
import { spanSoupSection } from "./SpanSoupSection";
import { portalSentryLogoSection } from "./PortalSentryLogoSection";

import { spanDataGradientsSection } from "./SpanDataGradientsSection";

// Registry of all available sections
const sectionRegistry: SectionDefinition[] = [
	heroCanvasSection,
	//  gradientWavesSection,
	// movingGradientsSection,
	// complexGradientsSection,
	// interactiveGradientsSection,
	floatingCubesSection,
	artisticCubesSection,
	alphabetSoupSection,
	spanSoupSection,
	portalSentryLogoSection,
	spanDataGradientsSection,
	/* sentryDataSection,*/
	/* spanVisualizationSection,*/
];

// Sort sections by order
export const sections = sectionRegistry.sort((a, b) => a.order - b.order);

// Helper function to get section by ID
export const getSectionById = (id: string): SectionDefinition | undefined => {
	return sections.find((section) => section.id === id);
};

// Export types
export type { SectionDefinition, SectionConfig } from "./types";
