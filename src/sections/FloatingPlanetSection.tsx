import React from "react";
import { FloatingPlanetCanvas } from "@/components/FloatingPlanet";
import type { SectionDefinition } from "./types";

export const FloatingPlanetSection: React.FC = () => {
	return (
		<FloatingPlanetCanvas
			planetSize={400000.0}
			assetCount={20}
			assetSize={50000.0}
			rotationSpeed={0.003}
			animationSpeed={0.6}
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
	component: FloatingPlanetSection,
	order: 120,
	category: "3D Environments",
	tags: ["3D", "Planet", "Ecosystem", "Environment", "Vegetation", "Space", "Orbital"],
	complexity: "Advanced",
	interactions: ["Camera Controls", "Orbital View", "Zoom"],
	dataVisualization: {
		type: "Environmental",
		description: "Represents a self-contained planetary ecosystem with diverse vegetation types",
		dataSource: "Procedurally generated asset placement",
		insights: [
			"Showcases 3D asset management and instanced rendering",
			"Demonstrates spatial distribution algorithms",
			"Features realistic planetary surface mapping",
			"Combines multiple 3D models in a cohesive scene",
		],
	},
	performance: {
		renderComplexity: "High",
		interactivity: "Medium",
		notes: "Uses instanced meshes for performance optimization with multiple assets",
	},
	visualFeatures: [
		"Atmospheric fog effects",
		"Post-processing with bloom and depth of field",
		"Procedural asset placement on sphere surface",
		"Orbital camera controls",
		"Multiple lighting sources",
		"Shadow mapping",
		"Instanced mesh rendering",
	],
};
