import { BuildingCityCanvas } from "@/components/BuildingCity/BuildingCityCanvas";
import { POPULAR_DATASETS } from "@/data/sampleSpanData";
import type { SectionDefinition } from "./types";

export const buildingCitySection: SectionDefinition = {
	id: "building-city",
	title: "Span City",
	description:
		"A 3D city built from architectural models where building types represent span durations",
	bodyText:
		"The data architects built this town,\nWhere spans are houses, and all can look down.\nThe tall ones are slow, where the system must wait,\nThe small ones are quick, sealed by a fast fate.\nEach building a function, a microservice line,\nMapped by the data of Sentry's design.",

	order: 16,
	component: () => (
		<BuildingCityCanvas
			canvasKey="building-city"
			spanData={POPULAR_DATASETS.allSpans.slice(0, 900)} // Limit for performance with 3D models
			cols={25}
			rows={25}
			buildingSize={70}
			gap={130}
			maxDuration={500}
			animate={false}
			buildingScale={100}
		/>
	),
};
