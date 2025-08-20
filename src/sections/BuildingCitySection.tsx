import { BuildingCityCanvas } from "@/components/BuildingCity/BuildingCityCanvas";
import { POPULAR_DATASETS } from "@/data/sampleSpanData";
import type { SectionDefinition } from "./types";

export const buildingCitySection: SectionDefinition = {
	id: "building-city",
	title: "Realistic Building Cityscape",
	description:
		"A 3D city built from architectural models where building types represent span durations",
	bodyText:
		"This visualization creates a realistic cityscape using actual building models to represent Sentry span data. Longer span durations become tall skyscrapers while shorter operations are represented by smaller buildings. The city uses the same lighting and effects as the cubic cityscape but provides a more immersive architectural experience. Buildings are colored by operation type and failed spans are marked with glowing error indicators.",
	order: 16,
	component: () => (
		<BuildingCityCanvas
			canvasKey="building-city"
			spanData={POPULAR_DATASETS.allSpans.slice(0, 900)} // Limit for performance with 3D models
			cols={20}
			rows={20}
			buildingSize={70}
			gap={130}
			maxDuration={500}
			animate={false}
			buildingScale={100}
		/>
	),
};
