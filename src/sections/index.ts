import type { SectionDefinition } from "./types";
import { heroCanvasSection } from "./HeroCanvasSection";
import { artisticCubesSection } from "./ArtisticCubesSection";
import { alphabetSoupSection } from "./AlphabetSoupSection";
import { spanSoupSection } from "./SpanSoupSection";
import { portalSentryLogoSection } from "./PortalSentryLogoSection";

import { spanDataGradientsSection } from "./SpanDataGradientsSection";
import { cityScapeSection } from "./CityScapeSection";
import { buildingCitySection } from "./BuildingCitySection";
import { floatingPlanetSection } from "./FloatingPlanetSection";
import { noiseArtworkSection } from "./NoiseArtworkSection";

// Registry of all available sections
const sectionRegistry: SectionDefinition[] = [
	heroCanvasSection,
	portalSentryLogoSection,
	alphabetSoupSection,
	spanSoupSection,
	spanDataGradientsSection,
	cityScapeSection,
	buildingCitySection,
	floatingPlanetSection,
	noiseArtworkSection,
	//  gradientWavesSection,
	// movingGradientsSection,
	// complexGradientsSection,
	// interactiveGradientsSection,
	//	floatingCubesSection,
	// artisticCubesSection,

	/* sentryDataSection,*/
	/* spanVisualizationSection,*/
];

// Sort sections by order
export const sections = sectionRegistry; // .sort((a, b) => a.order - b.order);

// Helper function to get section by ID
export const getSectionById = (id: string): SectionDefinition | undefined => {
	return sections.find((section) => section.id === id);
};

// Export types
export type { SectionDefinition, SectionConfig } from "./types";
