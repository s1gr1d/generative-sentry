import { CityScapeCanvas } from "@/components/CityScape/CityScapeCanvas";
import { POPULAR_DATASETS } from "@/data/sampleSpanData";
import type { SectionDefinition } from "./types";

export const cityScapeSection: SectionDefinition = {
	id: "cityscape",
	title: "Span Duration Cityscape",
	description: "A 3D city skyline where building heights represent span durations from Sentry data",
	bodyText:
		"This visualization transforms Sentry span data into an architectural cityscape. Each building's height corresponds to the span duration - taller buildings represent slower operations. Buildings are colored by operation type: blue for HTTP requests, purple for database operations, orange for UI operations, and more. Failed spans are marked with glowing red indicators on top.",
	order: 15,
	component: () => (
		<CityScapeCanvas
			canvasKey="cityscape"
			spanData={POPULAR_DATASETS.allSpans.slice(0, 2000)} // Limit to 2000 spans for performance
			cols={50}
			rows={40}
			cubeSize={35}
			gap={4}
			heightFactor={2}
			maxDuration={500}
			showWireframe={true}
			animate={true}
		/>
	),
};
