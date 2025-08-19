import React from "react";
import { Section } from "@/components/Layout";
import { SpanDataGradients } from "@/components/SpanDataGradients";
import type { SectionProps } from "./types";

export const SpanDataVisualizationSection: React.FC<SectionProps> = ({
	id = "span-data-visualization",
	title = "Performance Span Data Visualization",
	description = "Algorithmic art generated from distributed tracing and performance data",
}) => {
	return (
		<Section id={id} title={title} description={description} fullHeight>
			<SpanDataGradients layerCount={3} showLabels={true} />
		</Section>
	);
};
