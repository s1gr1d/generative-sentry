import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { ArtisticCubes, type ArtisticCubesProps } from "./ArtisticCubes";
import { ErrorBoundary } from "../ErrorBoundary";
import styles from "./ArtisticCubes.module.css";

interface ArtisticCubesCanvasProps extends ArtisticCubesProps {
	/** Additional CSS class name */
	className?: string;
	/** Unique key for the canvas (helps with proper mounting/unmounting) */
	canvasKey?: string;
	/** Enable post-processing effects (default: true) */
	enablePostProcessing?: boolean;
}

const ArtisticCubesCanvas: React.FC<ArtisticCubesCanvasProps> = ({
	className,
	canvasKey,
	enablePostProcessing = true,
	...cubesProps
}) => {
	return (
		<div className={`${styles.container} ${className || ""}`}>
			<span className={styles.srOnly}>Artistic 3D cubes with experimental shader effects</span>
			<ErrorBoundary>
				<Canvas
					key={canvasKey || "artistic-cubes-default"}
					className={styles.canvas}
					camera={{
						position: [0, 0, 400],
						fov: 75,
						near: 1,
						far: 10000,
					}}
					gl={{ antialias: true, alpha: true }}
				>
					{/* Scene background and fog */}
					<color attach="background" args={["#181225"]} />
					<fog attach="fog" args={["#181225", 100, 8000]} />

					{/* Enhanced lighting for artistic materials */}
					<ambientLight intensity={0.6} />
					<pointLight position={[100, 100, 100]} intensity={1.2} />
					<pointLight position={[-100, -100, -100]} intensity={0.8} color="#ff45a8" />
					<pointLight position={[200, -200, 200]} intensity={0.6} color="#7553ff" />
					<directionalLight position={[0, 10, 5]} intensity={0.5} />

					<Suspense fallback={null}>
						<ArtisticCubes {...cubesProps} />
					</Suspense>

					{/* Post-processing effects for extra artistic flair */}
					{enablePostProcessing && (
						<EffectComposer>
							<Bloom intensity={0.3} luminanceThreshold={0.8} luminanceSmoothing={0.4} />
							<ChromaticAberration offset={[0.001, 0.001]} />
							<Noise opacity={0.05} />
						</EffectComposer>
					)}
				</Canvas>
			</ErrorBoundary>
		</div>
	);
};

export { ArtisticCubesCanvas };
