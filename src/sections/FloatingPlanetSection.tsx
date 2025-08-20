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
		"A living graph where green trees can grow,\nOr brown withered branches begin to show.\nEach stalk an endpoint, a service well-tended,\nIts health, by the foliage, perfectly rendered.\nA world of metrics, where failure is seen,\nIn a single glimpse of the digital green.",

	component: FloatingPlanetSection,
	order: 120,
};
