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
		"The labels of a system, a whispered plea.\nWords of a span's operation, for all to see.\nThey hover in silence, a key to the flow,\nUntil a hover makes their purpose show.",
	order: 9, // After alphabet soup
	component: SpanSoupSectionComponent,
};
