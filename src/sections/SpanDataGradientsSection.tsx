import { SpanDataGradients } from "@/components/SpanDataGradients";
import type { SectionDefinition } from "./types";

export const spanDataGradientsSection: SectionDefinition = {
	id: "span-data-gradients",
	title: "Performance Data Visualization",
	description: "Algorithmic art generated from span performance data",
	bodyText:
		"Experience the beauty of distributed systems through data-driven art. This visualization transforms real performance traces - HTTP requests, database queries, UI operations - into flowing gradients where speed, variance, and operation types directly influence the visual parameters.",
	order: 10,
	component: () => (
		<SpanDataGradients layerCount={3} showLabels={true} regenerationKey={Date.now()} />
	),
};
