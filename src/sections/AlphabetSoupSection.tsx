import { AlphabetSoupCanvas } from "@/components/AlphabetSoup/AlphabetSoupCanvas";
import type { SectionDefinition } from "./types";
import { SAMPLE_SENTRY_ENVELOPES } from "@/data/sampleSentryEnvelopes";

export const alphabetSoupSection: SectionDefinition = {
	id: "alphabet-soup",
	title: "Span Letters",
	description: "Interactive 3D letters from Sentry error data with hover physics",
	bodyText:
		"From an uncaught exception, they break free,\nLost letters from a stack trace decree.\nA fragmented message, floating in place,\nThe source of an error, found by a trace.",
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
