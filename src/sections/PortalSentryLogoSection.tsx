import { PortalSentryLogoCanvas } from "@/components/PortalSentryLogo";
import type { SectionDefinition } from "./types";

export const portalSentryLogoSection: SectionDefinition = {
	id: "portal-sentry-logo",
	title: "Portal Sentry Logo",
	description:
		"Interactive 3D cube showing the Sentry logo in different colors from different viewing angles. Use the controls to rotate and explore each side.",
	bodyText:
		"Each face of the cube contains a portal to a unique environment featuring the Sentry logo in different color schemes from our official palette. Rotate the cube using the interactive controls to discover vibrant variations of the logo, each with its own distinctive atmosphere and decorative elements.",
	order: 7, // Place it after existing sections
	component: () => <PortalSentryLogoCanvas scale={1} enableControls={true} />,
};
