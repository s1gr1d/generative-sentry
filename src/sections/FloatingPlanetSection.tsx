import { FloatingPlanetCanvas } from "@/components/FloatingPlanet";
import type { SectionDefinition } from "./types";

export const FloatingPlanetSection = () => {
	return (
		<FloatingPlanetCanvas
			planetSize={400000.0}
			assetCount={60}
			assetSize={50000.0}
			rotationSpeed={0.003}
			colorCategory="ALL"
			enableFloating={true}
			enablePostProcessing={true}
			showStats={false}
			enableControls={true}
			canvasKey="floating-planet-section"
		/>
	);
};

export const floatingPlanetSection: SectionDefinition = {
	id: "floating-planet",
	title: "Floating Planet Ecosystem",
	description:
		"A 3D floating planet with procedurally placed vegetation and environmental assets. Features atmospheric fog, post-processing effects, and gentle orbital animations.",
	bodyText:
		"Showcases 3D asset management and instanced rendering with atmospheric fog effects, post-processing with bloom and depth of field, procedural asset placement on sphere surface, orbital camera controls, multiple lighting sources, shadow mapping, and instanced mesh rendering for performance optimization.",
	component: FloatingPlanetSection,
	order: 120,
};
