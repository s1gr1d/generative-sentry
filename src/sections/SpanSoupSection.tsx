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
	title: "Span Soup",
	description: "Interactive 3D visualization of Sentry span operations and descriptions",
	bodyText:
		"The semantic soup, where code finds its words,\nA hovering chaos of beautiful birds.\nOPs and descriptions, in hues of their kind,\nA dance of latency, for all to find.",
	order: 9, // After alphabet soup
	component: SpanSoupSectionComponent,
};
