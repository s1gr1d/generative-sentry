import { SpanDataGradients } from "@/components/SpanDataGradients";
import type { SectionDefinition } from "./types";

export const spanDataGradientsSection: SectionDefinition = {
	id: "span-data-gradients",
	title: "Trace Cloud",
	description: "Algorithmic art generated from span performance data",
	bodyText:
		"A cloud of metrics, dense and deep,\nA hazy overview the systems keep.\nIts grain and color tell the tale,\nOf performance, success, or a sudden fail.\nOf performance, success, or a sudden fail.",
	order: 10,
	component: () => (
		<SpanDataGradients layerCount={3} showLabels={true} regenerationKey={Date.now()} />
	),
};
