import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
	OrbitControls,
	Environment,
	ContactShadows,
	Preload,
	Stats,
	AdaptiveDpr,
	AdaptiveEvents,
	Html,
} from "@react-three/drei";
import { AlphabetSoup, type AlphabetSoupProps } from "./AlphabetSoup";
import { ErrorBoundary } from "../ErrorBoundary";

export interface AlphabetSoupCanvasProps extends Omit<AlphabetSoupProps, "ref"> {
	/** Canvas height (default: '100vh') */
	height?: string;
	/** Enable performance monitoring (default: false) */
	showStats?: boolean;
	/** Enable camera controls (default: true) */
	enableControls?: boolean;
	/** Background color from palette (default: 'RICH_BLACK') */
	backgroundColor?: string;
}

const LoadingFallback: React.FC = () => (
	<mesh>
		<boxGeometry args={[1, 1, 1]} />
		<meshStandardMaterial color="#7553ff" transparent opacity={0.5} />
	</mesh>
);

const AlphabetSoupCanvas: React.FC<AlphabetSoupCanvasProps> = ({
	height = "100vh",
	showStats = false,
	enableControls = true,
	backgroundColor = "#181225", // RICH_BLACK
	...alphabetSoupProps
}) => {
	return (
		<ErrorBoundary>
			<div style={{ height, width: "100%", position: "relative" }}>
				<Canvas
					camera={{
						position: [200, 500, 1000],
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

					{/* Main alphabet soup component */}
					<Suspense fallback={<LoadingFallback />}>
						<AlphabetSoup {...alphabetSoupProps} />
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

				{/* Overlay instructions */}
				<div
					style={{
						position: "absolute",
						bottom: "20px",
						left: "20px",
						color: "#ffffff",
						fontSize: "13px",
						fontFamily: "Rubik, sans-serif",
						background: "rgba(24, 18, 37, 0.9)",
						border: "1px solid rgba(117, 83, 255, 0.3)",
						padding: "12px 16px",
						borderRadius: "8px",
						backdropFilter: "blur(8px)",
						zIndex: 10,
					}}
				>
					<div style={{ marginBottom: "4px" }}>
						🖱️ <strong>Hover over letters</strong> to apply forces
					</div>
					<div style={{ marginBottom: "4px" }}>
						🎯 <strong>Drag to orbit</strong> • <strong>Scroll to zoom</strong>
					</div>
					<div>📊 Letters represent errors from Sentry data</div>
				</div>
			</div>
		</ErrorBoundary>
	);
};

export { AlphabetSoupCanvas };
