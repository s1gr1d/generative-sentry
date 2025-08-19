import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { MovingGradient, type MovingGradientProps } from "./MovingGradient";
import { ErrorBoundary } from "../ErrorBoundary";
import styles from "./MovingGradient.module.css";

interface MovingGradientCanvasProps extends MovingGradientProps {
	/** Additional CSS class name */
	className?: string;
	/** Unique key for the canvas (helps with proper mounting/unmounting) */
	canvasKey?: string;
}

const MovingGradientCanvas: React.FC<MovingGradientCanvasProps> = ({
	className,
	fullScreen,
	width = 10,
	height = 10,
	canvasKey,
	...gradientProps
}) => {
	const canvasStyle = fullScreen
		? {
				position: "fixed" as const,
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				zIndex: -1,
				background: "#000",
			}
		: {
				width: "100%",
				height: "100%",
				background: "#000",
			};

	return (
		<div
			className={`${styles.container} ${fullScreen ? styles.fullScreen : ""} ${className || ""}`}
		>
			<span className={styles.srOnly}>Complex moving gradient background with noise effects</span>
			<ErrorBoundary>
				<Canvas
					key={canvasKey || "default"}
					style={canvasStyle}
					className={styles.canvas}
					camera={{ position: [0, 0, 1] }}
					gl={{ antialias: true, alpha: false }}
				>
					<Suspense fallback={null}>
						<MovingGradient
							fullScreen={fullScreen}
							width={width}
							height={height}
							{...gradientProps}
						/>
					</Suspense>
				</Canvas>
			</ErrorBoundary>
		</div>
	);
};

export { MovingGradientCanvas };
