import type { ReactNode } from "react";
import styles from "./Section.module.css";

interface SectionProps {
	id: string;
	title: string;
	bodyText: string;
	children: ReactNode;
	className?: string;
}

export function Section({ id, title, bodyText, children, className }: SectionProps) {
	// Check if this is a canvas-only section (no title or bodyText)
	const isCanvasOnly = (!title && !bodyText) || id === "hero-canvas";

	return (
		<section
			className={`${styles.section} ${className || ""} ${isCanvasOnly ? styles.canvasOnly : ""}`}
			data-section={id}
		>
			<div className={styles.content}>
				<div className={isCanvasOnly ? styles.fullCanvasContainer : styles.artContainer}>
					{children}
				</div>
				{!isCanvasOnly && (
					<div className={styles.textContainer}>
						<div className={styles.textContent}>
							<h2 className={styles.title}>{title}</h2>
							<p className={styles.description}>{bodyText}</p>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
