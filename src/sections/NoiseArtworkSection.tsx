import { NoiseArtwork } from "@/components/NoiseArtwork";
import type { SectionDefinition } from "./types";

export const noiseArtworkSection: SectionDefinition = {
	id: "noise-artwork",
	title: "Noise Fields",
	description: "Noise-based line art with organic flow patterns",
	bodyText:
		"Here, data gives way to the soul of the code,\nA field of pure noise, a new path is showed.\nNo spans to be measured, no errors to fear,\nJust a canvas of chaos for all who are here.\nEach line, a whisper of a random desire,\nA glitch in the system, setting the soul on fire.\n\nThis piece is not for looking, but for being a part,\nA hand in the sculpting, the making of art.\nSo reach out and touch it, watch the lines bend,\nA new composition that you can extend.\nThe colors of Sentry, your digital clay,\nTo mold and to shape in your own special way.",

	order: 15,
	component: () => <NoiseArtwork width={800} height={800} />,
};
