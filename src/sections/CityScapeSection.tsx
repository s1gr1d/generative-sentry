import { CityScapeCanvas } from "@/components/CityScape/CityScapeCanvas";
import { POPULAR_DATASETS } from "@/data/sampleSpanData";
import type { SectionDefinition } from "./types";

export const cityScapeSection: SectionDefinition = {
	id: "cityscape",
	title: "Span Blocks",
	description: "A 3D city skyline where building heights represent span durations from Sentry data",
	bodyText:
		"A cityscape of logic, rendered on a grid,\nWhere every transaction is not just hid.\nBlue for the network, a swift HTTP,\nPurple for queries that run to the sea.\nTheir length, a duration, their color, a clue,\nRevealing the story of all that came through.",

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
