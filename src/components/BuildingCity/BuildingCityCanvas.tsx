import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { BuildingCity, type BuildingCityProps } from "./BuildingCity";
import { ErrorBoundary } from "../ErrorBoundary";
import { COLOR_PALETTE } from "@/utils/colorPalette";
import styles from "./BuildingCity.module.css";

interface BuildingCityCanvasProps extends BuildingCityProps {
	/** Additional CSS class name */
	className?: string;
	/** Unique key for the canvas (helps with proper mounting/unmounting) */
	canvasKey?: string;
}

const BuildingCityCanvas: React.FC<BuildingCityCanvasProps> = ({
	className,
	canvasKey,
	cols = 30,
	rows = 30,
	buildingSize = 60,
	gap = 20,
	buildingScale = 15,
	...buildingCityProps
}) => {
	// Calculate optimal camera distance based on grid size
	const gridWidth = (cols - 1) * (buildingSize + gap);
	const gridDepth = (rows - 1) * (buildingSize + gap);
	const maxDimension = Math.max(gridWidth, gridDepth);
	const cameraDistance = maxDimension * 0.9;

	// Orthographic camera setup
	const frustumSize = maxDimension * 1.3;
	const aspect = 1; // Assuming square viewport

	return (
		<div className={`${styles.container} ${className || ""}`}>
			<span className={styles.srOnly}>
				3D Building City where building types represent span durations from Sentry data
			</span>
			<ErrorBoundary>
				<Canvas
					key={canvasKey || "building-city-default"}
					className={styles.canvas}
					orthographic
					camera={{
						left: (frustumSize * aspect) / -2,
						right: (frustumSize * aspect) / 2,
						top: frustumSize / 2,
						bottom: frustumSize / -2,
						near: 1,
						far: 15000,
						position: [cameraDistance * 0.8, cameraDistance * 0.8, cameraDistance * 0.8],
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
						args={[COLOR_PALETTE.RICH_BLACK, cameraDistance * 0.1, cameraDistance * 2]}
					/>

					<Suspense fallback={null}>
						<BuildingCity
							cols={cols}
							rows={rows}
							buildingSize={buildingSize}
							gap={gap}
							buildingScale={buildingScale}
							{...buildingCityProps}
						/>
					</Suspense>
				</Canvas>
			</ErrorBoundary>
		</div>
	);
};

export { BuildingCityCanvas };
