import { useState } from "react";
import { SpanSoupCanvas } from "@/components/SpanSoup/SpanSoupCanvas";
import { SAMPLE_SPANS } from "@/data/sampleSpanData";
import { COLOR_PALETTE } from "@/utils/colorPalette";
import type { SectionDefinition } from "./types";

const SpanSoupSectionComponent = () => {
	const [dataType, setDataType] = useState<"operation" | "description">("operation");

	return (
		<SpanSoupCanvas
			spans={SAMPLE_SPANS}
			maxWords={80}
			bowlRadius={800}
			floatSpeed={0.3}
			forceMultiplier={5}
			dataType={dataType}
			enableControls={true}
			showStats={false}
			showDataOverlay={true}
			backgroundColor={COLOR_PALETTE.RICH_BLACK}
			onDataTypeChange={setDataType}
		/>
	);
};

export const spanSoupSection: SectionDefinition = {
	id: "span-soup",
	title: "Span Data Soup",
	description: "Interactive 3D visualization of Sentry span operations and descriptions",
	bodyText:
		"Dive into the semantic soup of your application's performance data. This visualization transforms Sentry span data into floating 3D words that you can interact with and explore. Switch between viewing span operations (like 'http.server', 'db.query') and span descriptions (meaningful words from operation details). Each word is colored based on its operation type and sized according to performance characteristics. Hover to apply forces and watch the data dance through space!",
	order: 9, // After alphabet soup
	component: SpanSoupSectionComponent,
};
