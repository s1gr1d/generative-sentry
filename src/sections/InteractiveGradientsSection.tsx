import { MovingGradientCanvas } from "@/components/MovingGradient/MovingGradientCanvas";
import type { SectionDefinition } from "./types";

export const interactiveGradientsSection: SectionDefinition = {
	id: "interactive-gradients",
	title: "Interactive Gradients",
	description: "interactive gradients",
	bodyText:
		"Responsive color fields that react to your mouse movements. Move your cursor across the canvas to influence the flow and intensity of the gradients, creating a unique interactive art experience.",
	order: 4,
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
	),
};
