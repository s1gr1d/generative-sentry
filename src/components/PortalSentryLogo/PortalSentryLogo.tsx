import { PortalSentryLogoCanvas } from "./PortalSentryLogoCanvas";
import styles from "./PortalSentryLogo.module.css";

interface PortalSentryLogoProps {
	/** Scale of the entire scene (default: 1) */
	scale?: number;
	/** Enable pivot controls for interaction (default: true) */
	enableControls?: boolean;
	/** Additional CSS class name */
	className?: string;
}

export function PortalSentryLogo({
	scale = 1,
	enableControls = true,
	className,
}: PortalSentryLogoProps) {
	return (
		<div className={`${styles.container} ${className || ""}`}>
			<PortalSentryLogoCanvas scale={scale} enableControls={enableControls} />
		</div>
	);
}
