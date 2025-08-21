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
	title: "Sentry Planet",
	description:
		"A 3D floating planet with procedurally placed vegetation and environmental assets. Features atmospheric fog, post-processing effects, and gentle orbital animations.",
	bodyText:
		"The state of a system, a sphere made to bloom.\nA living landscape dispelling all gloom.\nLush green for the healthy, a digital lawn,\nBut withering failure, a new digital dawn.",

	component: FloatingPlanetSection,
	order: 120,
};
