import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
	OrbitControls,
	Environment,
	ContactShadows,
	Preload,
	Stats,
	AdaptiveDpr,
	AdaptiveEvents,
} from "@react-three/drei";
import { SpanSoup, type SpanSoupProps } from "./SpanSoup";
import { ErrorBoundary } from "../ErrorBoundary";
import { COLOR_PALETTE } from "@/utils/colorPalette";
import styles from "./SpanSoup.module.css";

export interface SpanSoupCanvasProps extends Omit<SpanSoupProps, "ref"> {
	/** Canvas height (default: '100vh') */
	height?: string;
	/** Enable performance monitoring (default: false) */
	showStats?: boolean;
	/** Enable camera controls (default: true) */
	enableControls?: boolean;
	/** Background color from palette (default: 'RICH_BLACK') */
	backgroundColor?: string;
	/** Whether to show the data type overlay (default: true) */
	showDataOverlay?: boolean;
	/** Callback when data type changes */
	onDataTypeChange?: (dataType: "operation" | "description") => void;
}

const LoadingFallback: React.FC = () => (
	<mesh>
		<boxGeometry args={[1, 1, 1]} />
		<meshStandardMaterial color={COLOR_PALETTE.BLURPLE} transparent opacity={0.5} />
	</mesh>
);

const SpanSoupCanvas: React.FC<SpanSoupCanvasProps> = ({
	height = "100vh",
	showStats = false,
	enableControls = true,
	backgroundColor = COLOR_PALETTE.RICH_BLACK,
	showDataOverlay = true,
	onDataTypeChange,
	dataType = "operation",
	...spanSoupProps
}) => {
	const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
	const [currentDataType, setCurrentDataType] = useState<"operation" | "description">(dataType);

	const handleDataTypeChange = (newDataType: "operation" | "description") => {
		setCurrentDataType(newDataType);
		onDataTypeChange?.(newDataType);
	};

	return (
		<ErrorBoundary>
			<div style={{ height, width: "100%", position: "relative" }}>
				<Canvas
					camera={{
						position: [1000, 500, 1000],
						fov: 60,
						near: 1,
						far: 5000,
					}}
					gl={{
						antialias: true,
						alpha: false,
						powerPreference: "high-performance",
					}}
					dpr={[1, 2]}
					performance={{
						min: 0.1,
						max: 1,
						debounce: 200,
					}}
					style={{ background: backgroundColor }}
				>
					{/* Adaptive performance optimizations */}
					<AdaptiveDpr pixelated />
					<AdaptiveEvents />

					{/* Lighting setup */}
					<ambientLight intensity={0.4} />
					<spotLight
						position={[1000, 1000, 1000]}
						angle={0.3}
						penumbra={1}
						intensity={0.8}
						castShadow
						shadow-mapSize={[1024, 1024]}
					/>
					<pointLight position={[-1000, -1000, 1000]} intensity={0.3} />

					{/* Environment and atmosphere */}
					<Environment preset="warehouse" />

					{/* Ground shadows */}
					<ContactShadows position={[0, -400, 0]} opacity={0.2} scale={2000} blur={2} far={1000} />

					{/* Main span soup component */}
					<Suspense fallback={<LoadingFallback />}>
						<SpanSoup {...spanSoupProps} dataType={currentDataType} />
					</Suspense>

					{/* Camera controls */}
					{enableControls && (
						<OrbitControls
							enablePan
							enableZoom
							enableRotate
							zoomSpeed={0.6}
							panSpeed={0.8}
							rotateSpeed={0.4}
							minDistance={200}
							maxDistance={3000}
							minPolarAngle={Math.PI / 6}
							maxPolarAngle={Math.PI - Math.PI / 6}
							target={[0, 0, 0]}
						/>
					)}

					{/* Performance monitoring */}
					{showStats && <Stats />}

					{/* Preload assets */}
					<Preload all />
				</Canvas>

				{/* Data type overlay */}
				{showDataOverlay && (
					<div className={styles.dataOverlay}>
						<div className={`${styles.dataPanel} ${isPanelCollapsed ? styles.collapsed : ""}`}>
							<div className={styles.panelHeader}>
								<h4>Span Data Display</h4>
								<button
									className={styles.toggleButton}
									onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
									aria-label={isPanelCollapsed ? "Expand data panel" : "Collapse data panel"}
								>
									{isPanelCollapsed ? "▲" : "▼"}
								</button>
							</div>

							{!isPanelCollapsed && (
								<div className={styles.panelContent}>
									<div className={styles.dataTypeToggle}>
										<label>
											<input
												type="radio"
												name="dataType"
												value="operation"
												checked={currentDataType === "operation"}
												onChange={() => handleDataTypeChange("operation")}
											/>
											<span className={styles.radioLabel}>Operations</span>
										</label>
										<label>
											<input
												type="radio"
												name="dataType"
												value="description"
												checked={currentDataType === "description"}
												onChange={() => handleDataTypeChange("description")}
											/>
											<span className={styles.radioLabel}>Descriptions</span>
										</label>
									</div>

									<div className={styles.dataInfo}>
										<h5>Currently Showing:</h5>
										<div className={styles.currentData}>
											{currentDataType === "operation" ? (
												<>
													<strong>Span Operations</strong>
													<p>
														The operation type of each span (e.g., "http.server", "ui.paint",
														"db.query")
													</p>
												</>
											) : (
												<>
													<strong>Span Descriptions</strong>
													<p>Descriptive text from each span broken into individual words</p>
												</>
											)}
										</div>
									</div>

									<div className={styles.colorLegend}>
										<h5>Color Meanings:</h5>
										<div className={styles.colorGrid}>
											<div className={styles.colorItem}>
												<span
													className={styles.colorDot}
													style={{ backgroundColor: COLOR_PALETTE.LT_PINK }}
												></span>
												<span>UI Operations</span>
											</div>
											<div className={styles.colorItem}>
												<span
													className={styles.colorDot}
													style={{ backgroundColor: COLOR_PALETTE.BLURPLE }}
												></span>
												<span>HTTP Requests</span>
											</div>
											<div className={styles.colorItem}>
												<span
													className={styles.colorDot}
													style={{ backgroundColor: COLOR_PALETTE.DK_VIOLET }}
												></span>
												<span>Database</span>
											</div>
											<div className={styles.colorItem}>
												<span
													className={styles.colorDot}
													style={{ backgroundColor: COLOR_PALETTE.DK_GREEN }}
												></span>
												<span>Cache</span>
											</div>
											<div className={styles.colorItem}>
												<span
													className={styles.colorDot}
													style={{ backgroundColor: COLOR_PALETTE.DK_ORANGE }}
												></span>
												<span>Authentication</span>
											</div>
											<div className={styles.colorItem}>
												<span
													className={styles.colorDot}
													style={{ backgroundColor: COLOR_PALETTE.DK_PINK }}
												></span>
												<span>Errors/Slow</span>
											</div>
										</div>
									</div>
								</div>
							)}

							{isPanelCollapsed && (
								<div className={styles.collapsedSummary}>
									<span className={styles.summaryText}>
										Showing: {currentDataType === "operation" ? "Operations" : "Descriptions"}
									</span>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Instructions overlay */}
				<div className={styles.instructionsOverlay}>
					<div style={{ marginBottom: "4px" }}>
						🖱️ <strong>Hover over words</strong> to apply forces
					</div>
					<div style={{ marginBottom: "4px" }}>
						🎯 <strong>Drag to orbit</strong> • <strong>Scroll to zoom</strong>
					</div>
					<div>📊 Words represent Sentry span data</div>
				</div>
			</div>
		</ErrorBoundary>
	);
};

export { SpanSoupCanvas };
