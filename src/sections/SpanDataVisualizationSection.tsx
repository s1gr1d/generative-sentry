import { Section } from "@/components/Layout";
import { SpanDataGradients } from "@/components/SpanDataGradients";

export const SpanDataVisualizationSection = () => {
	return (
		<Section
			id="span-data-visualization"
			title="Performance Span Data Visualization"
			bodyText="Algorithmic art generated from distributed tracing and performance data"
		>
			<SpanDataGradients layerCount={3} showLabels={true} />
		</Section>
	);
};
