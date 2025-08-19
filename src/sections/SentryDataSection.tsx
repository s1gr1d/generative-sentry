import SentryDataDemo from "@/components/SentryDataDemo";
import type { SectionDefinition } from "./types";

export const sentryDataSection: SectionDefinition = {
	id: "sentry-data",
	title: "Sentry Error Data",
	description: "Interactive error visualization",
	bodyText:
		"Comprehensive visualization of generated Sentry error envelopes demonstrating various error types, levels, and patterns. This dataset serves as the foundation for creating generative art based on real-world error patterns and metrics.",
	order: 7,
	component: () => <SentryDataDemo />,
};
