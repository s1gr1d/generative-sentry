import { NoiseArtwork } from "@/components/NoiseArtwork";
import type { SectionDefinition } from "./types";

export const noiseArtworkSection: SectionDefinition = {
	id: "noise-artwork",
	title: "Generative Noise Fields",
	description: "Noise-based line art with organic flow patterns",
	bodyText:
		"Explore the beauty of controlled chaos through Perlin noise algorithms. Each line's position, length, direction, and color is determined by layered noise functions, creating organic patterns that feel both random and harmonious. Click anywhere on the artwork to generate a new variation with different noise seeds.",
	order: 15,
	component: () => <NoiseArtwork width={800} height={800} />,
};
