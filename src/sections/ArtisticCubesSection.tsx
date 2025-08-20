import { ArtisticCubesCanvas } from "@/components/ArtisticCubes/ArtisticCubesCanvas";
import type { SectionDefinition } from "./types";

export const artisticCubesSection: SectionDefinition = {
	id: "artistic-cubes",
	title: "Cubes",
	description: "floating cubes with experimental drei shaders",
	bodyText:
		"A binary ballet, soft and slow.\nOne is a trace, a successful flow.\nThe other, an error, a red signal flash,\nShowing where the system began to crash.",
	order: 6,
	component: () => (
		<ArtisticCubesCanvas
			canvasKey="artistic-cubes"
			cubeCount={80}
			floatRadius={4.0}
			floatSpeed={0.8}
			colorCategory="WARM"
			enablePostProcessing={true}
		/>
	),
};
