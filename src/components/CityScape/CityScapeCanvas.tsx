import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { CityScape, type CityScapeProps } from "./CityScape";
import { ErrorBoundary } from "../ErrorBoundary";
import { COLOR_PALETTE } from "@/utils/colorPalette";
import styles from "./CityScape.module.css";

interface CityScapeCanvasProps extends CityScapeProps {
	/** Additional CSS class name */
	className?: string;
	/** Unique key for the canvas (helps with proper mounting/unmounting) */
	canvasKey?: string;
}

const CityScapeCanvas: React.FC<CityScapeCanvasProps> = ({
	className,
	canvasKey,
	cols = 50,
	rows = 50,
	cubeSize = 40,
	gap = 5,
	...cityScapeProps
}) => {
	// Calculate optimal camera distance based on grid size
	const gridWidth = (cols - 1) * (cubeSize + gap);
	const gridDepth = (rows - 1) * (cubeSize + gap);
	const maxDimension = Math.max(gridWidth, gridDepth);
	const cameraDistance = maxDimension * 0.8;

	// Orthographic camera setup
	const frustumSize = maxDimension * 1.2;
	const aspect = 1; // Assuming square viewport

	return (
		<div className={`${styles.container} ${className || ""}`}>
			<span className={styles.srOnly}>
				3D City Skyline with Perlin noise-based height variations
			</span>
			<ErrorBoundary>
				<Canvas
					key={canvasKey || "cityscape-default"}
					className={styles.canvas}
					orthographic
					camera={{
						left: (frustumSize * aspect) / -2,
						right: (frustumSize * aspect) / 2,
						top: frustumSize / 2,
						bottom: frustumSize / -2,
						near: 1,
						far: 10000,
						position: [cameraDistance * 0.7, cameraDistance * 0.7, cameraDistance * 0.7],
						zoom: 1,
					}}
					gl={{
						antialias: true,
						alpha: true,
						powerPreference: "high-performance",
					}}
					shadows
				>
					{/* Scene background */}
					<color attach="background" args={[COLOR_PALETTE.RICH_BLACK]} />

					{/* Atmospheric fog */}
					<fog
						attach="fog"
						args={[COLOR_PALETTE.RICH_BLACK, cameraDistance * 0.5, cameraDistance * 2]}
					/>

					<Suspense fallback={null}>
						<CityScape cols={cols} rows={rows} cubeSize={cubeSize} gap={gap} {...cityScapeProps} />
					</Suspense>
				</Canvas>
			</ErrorBoundary>
		</div>
	);
};

export { CityScapeCanvas };
