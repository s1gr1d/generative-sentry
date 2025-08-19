import { SentryLogoCanvas } from "@/components/SentryLogo";
import type { SectionDefinition } from "./types";

export const heroCanvasSection: SectionDefinition = {
	id: "hero-canvas",
	title: "", // No title needed for canvas-only section
	description: "",
	bodyText: "", // No body text for canvas-only section
	order: 0, // This will be the first section
	component: () => <SentryLogoCanvas scale={1.2} autoRotate={true} rotationSpeed={0.2} />,
};
