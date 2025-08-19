import { AlphabetSoupCanvas } from "@/components/AlphabetSoup/AlphabetSoupCanvas";
import type { SectionDefinition } from "./types";
import { SAMPLE_SENTRY_ENVELOPES } from "@/data/sampleSentryEnvelopes";

export const alphabetSoupSection: SectionDefinition = {
	id: "alphabet-soup",
	title: "Alphabet Soup",
	description: "Interactive 3D letters from Sentry error data with hover physics",
	bodyText:
		"Interactive 3D visualization where error data transforms into floating letters. Each character represents fragments from Sentry error messages, function names, and exception types. Hover over letters to apply directional forces and watch them dance through the digital soup!",
	order: 8, // After artistic cubes
	component: () => (
		<AlphabetSoupCanvas
			envelopes={SAMPLE_SENTRY_ENVELOPES}
			maxLetters={150}
			bowlRadius={800}
			floatSpeed={0.3}
			forceMultiplier={5}
			enableControls={true}
			showStats={false}
			backgroundColor="#181225" // RICH_BLACK
		/>
	),

	//<AlphabetSoupSection />
};
