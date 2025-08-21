import { PortalSentryLogoCanvas } from "@/components/PortalSentryLogo";
import type { SectionDefinition } from "./types";

export const portalSentryLogoSection: SectionDefinition = {
	id: "portal-sentry-logo",
	title: "Logo Portal",
	description:
		"Interactive 3D cube showing the Sentry logo in different colors from different viewing angles. Use the controls to rotate and explore each side.",
	bodyText:
		"Each face a portal, a new place to see.\nA stack of environments for you and for me.\nTurn the cube slowly, a digital guide,\nTo see what colors and styles live inside.",
	order: 7, // Place it after existing sections
	component: () => <PortalSentryLogoCanvas scale={1} enableControls={true} />,
};
