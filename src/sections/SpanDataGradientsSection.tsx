import { SpanDataGradients } from "@/components/SpanDataGradients";
import type { SectionDefinition } from "./types";
import { MovingGradientCanvas } from "@/components/MovingGradient/MovingGradientCanvas";

export const spanDataGradientsSection: SectionDefinition = {
	id: "span-data-gradients",
	title: "Trace Cloud",
	description: "Algorithmic art generated from span performance data",
	bodyText:
		"A flow of data, a system's true heart.\nEach gradient is born from a functional start.\nDepending on speed, the colors will bend,\nA digital flow, without any end.",
	order: 10,
	component: () => (
		<MovingGradientCanvas
			canvasKey="interactive-gradients"
			speed={0.5}
			noiseScale={10.0}
			flowIntensity={0.15}
			colorShift={0.03}
			colorCategory="PURPLES"
			animateColors={false}
			colorAnimationSpeed={0.1}
			isStatic={false}
			mouseInfluence={2.0}
			width={8}
			height={6}
		/>
		//<SpanDataGradients layerCount={2} showLabels={true} regenerationKey={Date.now()} />
	),
};
