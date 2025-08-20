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
} from "@react-three/drei";
import {
	EffectComposer,
	Bloom,
	ChromaticAberration,
	Noise,
	DepthOfField,
} from "@react-three/postprocessing";
import { FloatingPlanet, type FloatingPlanetProps } from "./FloatingPlanet";
import { ErrorBoundary } from "../ErrorBoundary";
import { COLOR_PALETTE } from "@/utils/colorPalette";
import styles from "./FloatingPlanet.module.css";

export interface FloatingPlanetCanvasProps extends Omit<FloatingPlanetProps, "ref"> {
	/** Canvas height (default: '100vh') */
	height?: string;
	/** Enable performance monitoring (default: false) */
	showStats?: boolean;
	/** Enable camera controls (default: true) */
	enableControls?: boolean;
	/** Background color from palette (default: 'RICH_BLACK') */
	backgroundColor?: string;
	/** Enable post-processing effects (default: true) */
	enablePostProcessing?: boolean;
	/** Canvas key for React */
	canvasKey?: string;
	/** Additional CSS class name */
	className?: string;
}

const LoadingFallback: React.FC = () => (
	<group>
		{/* Simple animated loading planet - massive scale */}
		<mesh>
			<sphereGeometry args={[10000, 32, 16]} />
			<meshStandardMaterial color={COLOR_PALETTE.DK_BLUE} transparent opacity={0.3} wireframe />
		</mesh>
		{/* Loading assets as small spheres - close to planet surface */}
		{Array.from({ length: 8 }).map((_, i) => {
			const angle = (i / 8) * Math.PI * 2;
			const radius = 10100; // Very close to planet surface
			return (
				<mesh
					key={i}
					position={[
						Math.cos(angle) * radius,
						(Math.random() - 0.5) * 200,
						Math.sin(angle) * radius,
					]}
				>
					<sphereGeometry args={[1000, 8, 6]} />
					<meshStandardMaterial color={COLOR_PALETTE.LT_GREEN} transparent opacity={0.5} />
				</mesh>
			);
		})}
	</group>
);

const FloatingPlanetCanvas: React.FC<FloatingPlanetCanvasProps> = ({
	height = "100vh",
	showStats = false,
	enableControls = true,
	backgroundColor = COLOR_PALETTE.RICH_BLACK,
	enablePostProcessing = true,
	canvasKey = "floating-planet",
	className,
	...planetProps
}) => {
	return (
		<ErrorBoundary>
			<div
				style={{ height, width: "100%", position: "relative" }}
				className={`${styles.container} ${className || ""}`}
			>
				<span className={styles.srOnly}>
					3D floating planet with randomly placed vegetation and environmental assets
				</span>

				<Canvas
					key={canvasKey}
					className={styles.canvas}
					camera={{
						position: [15000, 8000, 15000], // Closer to the planet for better view
						fov: 60,
						near: 100,
						far: 50000,
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

					{/* Scene background and atmospheric fog */}
					<color attach="background" args={[backgroundColor]} />
					<fog attach="fog" args={[backgroundColor, 12000, 35000]} />

					{/* Brighter optimized lighting setup */}
					<ambientLight intensity={0.8} />

					{/* Main sun light - brighter */}
					<directionalLight
						position={[15000, 15000, 10000]}
						intensity={2.0}
						castShadow
						shadow-mapSize={[1024, 1024]}
						shadow-camera-far={50000}
						shadow-camera-left={-10000}
						shadow-camera-right={10000}
						shadow-camera-top={10000}
						shadow-camera-bottom={-10000}
						color={COLOR_PALETTE.LT_YELLOW}
					/>

					{/* Secondary atmospheric lights - brighter */}
					<pointLight
						position={[-7500, 5000, 7500]}
						intensity={1.0}
						color={COLOR_PALETTE.LT_BLUE}
						distance={50000}
					/>
					<pointLight
						position={[7500, -5000, -7500]}
						intensity={0.8}
						color={COLOR_PALETTE.LT_PURPLE}
						distance={50000}
					/>

					{/* Additional fill light */}
					<pointLight
						position={[0, 20000, 0]}
						intensity={0.6}
						color={COLOR_PALETTE.LT_YELLOW}
						distance={60000}
					/>

					{/* Space environment */}
					<Environment preset="night" />

					{/* Subtle ground plane for depth reference */}
					<mesh position={[0, -10000, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
						<planeGeometry args={[50000, 50000]} />
						<meshLambertMaterial color={backgroundColor} transparent opacity={0.05} />
					</mesh>

					{/* Contact shadows for planet */}
					<ContactShadows
						position={[0, -8000, 0]}
						opacity={0.2}
						scale={25000}
						blur={3}
						far={12000}
					/>

					{/* Main floating planet component */}
					<Suspense fallback={<LoadingFallback />}>
						<FloatingPlanet {...planetProps} />
					</Suspense>

					{/* Camera controls */}
					{enableControls && (
						<OrbitControls
							enablePan
							enableZoom
							enableRotate
							zoomSpeed={0.8}
							panSpeed={0.6}
							rotateSpeed={0.5}
							minDistance={8000}
							maxDistance={25000}
							minPolarAngle={0}
							maxPolarAngle={Math.PI}
							target={[0, 0, 0]}
							enableDamping
							dampingFactor={0.05}
						/>
					)}

					{/* Post-processing effects for atmospheric feel */}
					{enablePostProcessing && (
						<EffectComposer>
							{/* Subtle bloom for magical glow */}
							<Bloom intensity={0.4} luminanceThreshold={0.7} luminanceSmoothing={0.6} />

							{/* Slight chromatic aberration for atmosphere */}
							<ChromaticAberration offset={[0.0005, 0.0005]} />

							{/* Depth of field for cinematic focus */}
							<DepthOfField focusDistance={0.8} focalLength={0.5} bokehScale={2} height={480} />

							{/* Subtle film grain */}
							<Noise opacity={0.02} />
						</EffectComposer>
					)}

					{/* Performance monitoring */}
					{showStats && <Stats />}

					{/* Preload assets */}
					<Preload all />
				</Canvas>

				{/* Instructions overlay */}
				<div className={styles.instructionsOverlay}>
					<div style={{ marginBottom: "4px" }}>
						🎯 <strong>Drag to orbit</strong> • <strong>Scroll to zoom</strong>
					</div>
					<div style={{ marginBottom: "4px" }}>
						🌍 <strong>Watch the rotating planet ecosystem</strong>
					</div>
					<div>Floating planet with procedurally placed vegetation</div>
				</div>
			</div>
		</ErrorBoundary>
	);
};

export { FloatingPlanetCanvas };
