import { PortalSentryLogoCanvas } from "@/components/PortalSentryLogo";
import type { SectionDefinition } from "./types";

export const portalSentryLogoSection: SectionDefinition = {
	id: "portal-sentry-logo",
	title: "Logo Portal",
	description:
		"Interactive 3D cube showing the Sentry logo in different colors from different viewing angles. Use the controls to rotate and explore each side.",
	bodyText:
		"A quantum turn, a mirrored face,\nReveals the essence of time and space.\nYou peer inside a logical stack,\nWhere Sentry's logo returns on the track.",
	order: 7, // Place it after existing sections
	component: () => <PortalSentryLogoCanvas scale={1} enableControls={true} />,
};
