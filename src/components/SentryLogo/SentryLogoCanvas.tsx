import { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	useGLTF,
	MeshDistortMaterial,
	MeshWobbleMaterial,
	GradientTexture,
	GradientType,
	Text3D,
	OrbitControls,
	Outlines,
} from "@react-three/drei";
import {
	EffectComposer,
	Noise,
	DepthOfField,
	Bloom,
	Vignette,
	ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import {
	PRIMARY_COLORS,
	SECONDARY_COLORS,
	NORMALIZED_RGB,
	getRandomColors,
} from "@/utils/colorPalette";

interface SentryLogoCanvasProps {
	/** Scale of the logo (default: 1) */
	scale?: number;
	/** Enable auto rotation (default: true) */
	autoRotate?: boolean;
	/** Auto rotation speed (default: 0.5) */
	rotationSpeed?: number;
}

function SentryLogo({ scale = 1, autoRotate = true, rotationSpeed = 0.5 }: SentryLogoCanvasProps) {
	const logoRef = useRef<THREE.Group>(null);
	const [modelError, setModelError] = useState(false);
	const [meshesReady, setMeshesReady] = useState(false);

	// Load the Sentry logo GLTF model - hooks must be called unconditionally
	const gltf = useGLTF("/sentry-logo-3d.glb");

	useEffect(() => {
		console.log("GLTF loaded:", gltf);
		console.log("GLTF scene:", gltf?.scene);

		if (!gltf?.scene) {
			console.warn("No GLTF scene found");
			setModelError(true);
		} else {
			console.log("GLTF scene loaded successfully");
			setModelError(false);
		}
	}, [gltf]);

	// Animation loop
	useFrame((state) => {
		if (!logoRef.current) return;

		const time = state.clock.getElapsedTime();

		// Auto rotation
		if (autoRotate) {
			logoRef.current.rotation.y = time * rotationSpeed;
		}

		// Gentle floating animation
		logoRef.current.position.y = Math.sin(time * 0.8) * 0.2;
	});

	// Create materials
	const standardMaterial = new THREE.MeshStandardMaterial({
		color: new THREE.Color(...NORMALIZED_RGB.BLURPLE),
		metalness: 0.3,
		roughness: 0.2,
	});

	// Fallback logo using geometric shapes
	const FallbackLogo = () => (
		<group>
			{/* Create a stylized "S" shape using geometric primitives */}
			<mesh position={[0, 0.5, 0]}>
				<torusGeometry args={[0.8, 0.3, 8, 16, Math.PI]} />
				<meshStandardMaterial color={new THREE.Color(...NORMALIZED_RGB.BLURPLE)} />
			</mesh>
			<mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI]}>
				<torusGeometry args={[0.8, 0.3, 8, 16, Math.PI]} />
				<meshStandardMaterial color={new THREE.Color(...NORMALIZED_RGB.BLURPLE)} />
			</mesh>
			{/* Central connecting piece */}
			<mesh position={[0, 0, 0]}>
				<cylinderGeometry args={[0.2, 0.2, 0.6, 8]} />
				<meshStandardMaterial color={new THREE.Color(...NORMALIZED_RGB.LT_BLURPLE)} />
			</mesh>
		</group>
	);

	// Function to traverse and apply materials to all meshes
	const applyMaterialToMeshes = (object: THREE.Object3D, material: THREE.Material) => {
		object.traverse((child: THREE.Object3D) => {
			if (child instanceof THREE.Mesh) {
				child.material = material;
			}
		});
	};

	// Clone the scene to avoid issues with multiple instances
	const clonedScene = gltf?.scene?.clone();

	// Extract meshes for wobble conversion
	const originalMeshes = useRef<
		Array<{ mesh: THREE.Mesh; originalMaterial: THREE.Material | THREE.Material[] }>
	>([]);

	// Collect all meshes from the GLTF model and store their original materials
	useEffect(() => {
		console.log("Cloned scene:", clonedScene);
		if (clonedScene) {
			const meshes: Array<{
				mesh: THREE.Mesh;
				originalMaterial: THREE.Material | THREE.Material[];
			}> = [];
			clonedScene.traverse((child: THREE.Object3D) => {
				if (child instanceof THREE.Mesh) {
					console.log("Found mesh:", child);
					meshes.push({
						mesh: child,
						originalMaterial: Array.isArray(child.material) ? [...child.material] : child.material,
					});
				}
			});
			originalMeshes.current = meshes;
			console.log("Total meshes found:", meshes.length);

			// Set initial standard materials
			applyMaterialToMeshes(clonedScene, standardMaterial);

			// Trigger re-render when meshes are ready
			setMeshesReady(meshes.length > 0);
			console.log("Meshes ready state set to:", meshes.length > 0);
		} else {
			console.log("No cloned scene available");
			setMeshesReady(false);
		}
	}, [clonedScene, standardMaterial]);

	// Component to render GLTF meshes with improved gradient distort material
	const SentryLogoMeshes = () => {
		console.log(
			"SentryLogoMeshes rendering - clonedScene:",
			!!clonedScene,
			"meshes:",
			originalMeshes.current.length,
			"meshesReady:",
			meshesReady,
		);

		if (!clonedScene || !meshesReady || originalMeshes.current.length === 0) {
			console.log(
				"No cloned scene or meshes available - scene:",
				!!clonedScene,
				"meshes:",
				originalMeshes.current.length,
				"ready:",
				meshesReady,
			);
			return null;
		}

		console.log("Rendering", originalMeshes.current.length, "meshes");

		return (
			<group>
				{originalMeshes.current.map(({ mesh }, index) => (
					<mesh
						key={index}
						geometry={mesh.geometry}
						position={[mesh.position.x, mesh.position.y - 0.4, mesh.position.z]}
						rotation={[mesh.rotation.x, mesh.rotation.y, mesh.rotation.z]}
						scale={[mesh.scale.x * 3, mesh.scale.y * 3, mesh.scale.z * 3]}
					>
						<Outlines thickness={0.05} color={PRIMARY_COLORS.DK_BLURPLE} />

						<MeshDistortMaterial distort={0.6} speed={1.2} roughness={0.2} metalness={0.8}>
							<GradientTexture
								stops={[0, 0.2, 0.4, 0.6, 0.8, 1]}
								colors={[
									new THREE.Color(...NORMALIZED_RGB.DK_VIOLET),
									new THREE.Color(...NORMALIZED_RGB.BLURPLE),
									new THREE.Color(...NORMALIZED_RGB.LT_BLURPLE),
									new THREE.Color(...NORMALIZED_RGB.DK_PINK),
									new THREE.Color(...NORMALIZED_RGB.LT_PINK),
									new THREE.Color(...NORMALIZED_RGB.DK_ORANGE),
								]}
								type={GradientType.Linear}
							/>
						</MeshDistortMaterial>
					</mesh>
				))}
			</group>
		);
	};

	return (
		<group ref={logoRef} scale={[scale, scale, scale]}>
			{modelError || !clonedScene ? (
				// Use fallback logo if GLTF model fails to load
				<>
					<FallbackLogo />
					{!modelError && <div style={{ display: "none" }}>Loading...</div>}
				</>
			) : (
				// Render the actual Sentry logo with distort material
				<SentryLogoMeshes />
			)}
		</group>
	);
}

// 3D Text Components
function LeftText() {
	const textRef = useRef<THREE.Group>(null);

	useFrame((state) => {
		if (!textRef.current) return;
		const time = state.clock.getElapsedTime();
		textRef.current.position.y = Math.sin(time * 0.6 + Math.PI) * 0.15;
		// Add subtle rotation animation
		textRef.current.rotation.z = Math.sin(time * 0.4) * 0.05;
	});

	return (
		<group ref={textRef} position={[-9, 5, -1]} rotation={[0, 0.2, -0.15]}>
			<Text3D
				font="/fonts/rubik-bold.json"
				size={0.7}
				height={0.2}
				curveSegments={12}
				bevelEnabled
				bevelThickness={0.02}
				bevelSize={0.02}
				bevelOffset={0}
				bevelSegments={5}
			>
				GENERATIVE
				<Outlines thickness={0.05} color={SECONDARY_COLORS.DK_YELLOW} />
				<MeshDistortMaterial distort={0.3} speed={0.8} roughness={0.1} metalness={0.9}>
					<GradientTexture
						stops={[0, 0.5, 1]}
						colors={[
							new THREE.Color(...NORMALIZED_RGB.BLURPLE),
							new THREE.Color(...NORMALIZED_RGB.LT_BLURPLE),
							new THREE.Color(...NORMALIZED_RGB.DK_VIOLET),
						]}
						type={GradientType.Linear}
					/>
				</MeshDistortMaterial>
			</Text3D>
		</group>
	);
}

function RightText() {
	const textRef = useRef<THREE.Group>(null);

	useFrame((state) => {
		if (!textRef.current) return;
		const time = state.clock.getElapsedTime();
		textRef.current.position.y = Math.sin(time * 0.7) * 0.12;
		// Add dynamic rotation animation
		textRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
		textRef.current.rotation.z = Math.cos(time * 0.3) * 0.08;
	});

	return (
		<group ref={textRef} position={[3.5, -2.8, 0.5]} rotation={[0.1, -0.3, 0.2]}>
			<Text3D
				font="/fonts/rubik-bold.json"
				size={0.6}
				height={0.15}
				curveSegments={12}
				bevelEnabled
				bevelThickness={0.015}
				bevelSize={0.015}
				bevelOffset={0}
				bevelSegments={5}
			>
				SENTRY
				<Outlines thickness={0.05} color={SECONDARY_COLORS.DK_YELLOW} />
				<MeshDistortMaterial distort={0.4} speed={1} roughness={0.15} metalness={0.7}>
					<GradientTexture
						stops={[0, 0.5, 1]}
						colors={[
							new THREE.Color(...NORMALIZED_RGB.DK_PINK),
							new THREE.Color(...NORMALIZED_RGB.LT_PINK),
							new THREE.Color(...NORMALIZED_RGB.DK_ORANGE),
						]}
						type={GradientType.Radial}
					/>
				</MeshDistortMaterial>
			</Text3D>
		</group>
	);
}

// Loading fallback component
function LoadingLogo() {
	const logoRef = useRef<THREE.Group>(null);

	useFrame((state) => {
		if (!logoRef.current) return;
		const time = state.clock.getElapsedTime();
		logoRef.current.rotation.y = time * 0.5;
		logoRef.current.position.y = Math.sin(time * 0.8) * 0.2;
	});

	return (
		<group ref={logoRef}>
			<mesh>
				<sphereGeometry args={[1.5, 32, 32]} />
				<MeshDistortMaterial distort={0.6} speed={1.2} roughness={0.2} metalness={0.8}>
					<GradientTexture
						stops={[0, 0.5, 1]}
						colors={[
							new THREE.Color(...NORMALIZED_RGB.BLURPLE),
							new THREE.Color(...NORMALIZED_RGB.LT_BLURPLE),
							new THREE.Color(...NORMALIZED_RGB.DK_VIOLET),
						]}
						type={GradientType.Radial}
					/>
				</MeshDistortMaterial>
			</mesh>
		</group>
	);
}

// Wobbly balls component with random properties
interface WobblyBallData {
	id: number;
	position: THREE.Vector3;
	size: number;
	color: string;
	distortType: "wobble" | "distort";
	speed: number;
	factor: number;
	phaseOffset: THREE.Vector3;
	drift: THREE.Vector3;
}

function WobblyBalls() {
	// Generate random wobbly ball data
	const ballsData = useMemo<WobblyBallData[]>(() => {
		const colors = getRandomColors(12, "ALL"); // Get 12 random colors

		return Array.from({ length: 12 }, (_, i) => ({
			id: i,
			position: new THREE.Vector3(
				(Math.random() - 0.5) * 20, // X: -10 to 10
				(Math.random() - 0.5) * 15, // Y: -7.5 to 7.5
				(Math.random() - 0.5) * 10, // Z: -5 to 5
			),
			size: 0.3 + Math.random() * 0.8, // Size: 0.3 to 1.1
			color: colors[i],
			distortType: Math.random() > 0.5 ? "wobble" : "distort",
			speed: 0.5 + Math.random() * 2, // Speed: 0.5 to 2.5
			factor: 0.3 + Math.random() * 1.2, // Factor: 0.3 to 1.5
			phaseOffset: new THREE.Vector3(
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2,
			),
			drift: new THREE.Vector3(
				(Math.random() - 0.5) * 0.02,
				(Math.random() - 0.5) * 0.02,
				(Math.random() - 0.5) * 0.02,
			),
		}));
	}, []);

	return (
		<group>
			{ballsData.map((ball) => (
				<WobblyBall key={ball.id} data={ball} />
			))}
		</group>
	);
}

function WobblyBall({ data }: { data: WobblyBallData }) {
	const ballRef = useRef<THREE.Mesh>(null);

	useFrame((state) => {
		if (!ballRef.current) return;

		const time = state.clock.getElapsedTime();

		// Floating animation with phase offset
		ballRef.current.position.x =
			data.position.x + Math.sin(time * 0.8 + data.phaseOffset.x) * 2 + time * data.drift.x;
		ballRef.current.position.y =
			data.position.y + Math.cos(time * 0.6 + data.phaseOffset.y) * 1.5 + time * data.drift.y;
		ballRef.current.position.z =
			data.position.z + Math.sin(time * 0.4 + data.phaseOffset.z) * 1 + time * data.drift.z;

		// Gentle rotation
		ballRef.current.rotation.x += 0.01 * data.speed;
		ballRef.current.rotation.y += 0.008 * data.speed;
		ballRef.current.rotation.z += 0.006 * data.speed;
	});

	return (
		<mesh ref={ballRef} scale={[data.size, data.size, data.size]}>
			<sphereGeometry args={[1, 16, 16]} />
			{data.distortType === "wobble" ? (
				<MeshWobbleMaterial
					color={data.color}
					factor={data.factor}
					speed={data.speed}
					roughness={0.1}
					metalness={0.6}
					transparent
					opacity={0.8}
				/>
			) : (
				<MeshDistortMaterial
					color={data.color}
					distort={data.factor}
					speed={data.speed}
					roughness={0.15}
					metalness={0.7}
					transparent
					opacity={0.75}
				/>
			)}
		</mesh>
	);
}

// Background component with gradient sphere
function GradientBackground() {
	const sphereRef = useRef<THREE.Mesh>(null);

	useFrame((state) => {
		if (!sphereRef.current) return;
		const time = state.clock.getElapsedTime();
		sphereRef.current.rotation.y = time * 0.02;
		sphereRef.current.rotation.x = time * 0.01;
	});

	return (
		<mesh ref={sphereRef} scale={[50, 50, 50]} position={[0, 0, -25]}>
			<sphereGeometry args={[1, 32, 32]} />
			<meshBasicMaterial side={THREE.BackSide}>
				<GradientTexture
					stops={[0, 0.3, 0.6, 1]}
					colors={[
						new THREE.Color(...NORMALIZED_RGB.RICH_BLACK),
						new THREE.Color(...NORMALIZED_RGB.DK_VIOLET),
						new THREE.Color(...NORMALIZED_RGB.DK_BLURPLE),
						new THREE.Color(...NORMALIZED_RGB.BACKGROUND_GREY),
					]}
					type={GradientType.Radial}
				/>
			</meshBasicMaterial>
		</mesh>
	);
}

export function SentryLogoCanvas({ scale, autoRotate, rotationSpeed }: SentryLogoCanvasProps) {
	return (
		<Canvas
			camera={{ position: [0, 0, 8], fov: 60 }}
			style={{
				width: "100%",
				height: "100vh",
				pointerEvents: "none", // Allow scroll events to pass through
			}}
			gl={{ antialias: true, alpha: false }}
			dpr={[1, 2]}
		>
			{/* Gradient background */}
			<GradientBackground />

			{/* Wobbly balls scattered throughout the scene */}
			<WobblyBalls />

			{/* Enhanced lighting setup - brighter for lighter scene */}
			<ambientLight intensity={0.2} />
			<directionalLight
				position={[10, 10, 5]}
				intensity={2.2}
				castShadow
				shadow-mapSize={[2048, 2048]}
			/>
			<directionalLight position={[-5, 5, 3]} intensity={0.2} color={PRIMARY_COLORS.LT_BLURPLE} />
			<pointLight position={[-10, -10, -5]} intensity={0.8} color={PRIMARY_COLORS.LT_BLURPLE} />
			<pointLight position={[5, 5, -3]} intensity={2} color={SECONDARY_COLORS.DK_PINK} />
			<pointLight position={[0, 10, 5]} intensity={0.5} color={SECONDARY_COLORS.LT_YELLOW} />

			{/* The logo with Suspense boundary */}
			<Suspense fallback={<LoadingLogo />}>
				<SentryLogo scale={scale} autoRotate={autoRotate} rotationSpeed={rotationSpeed} />
			</Suspense>

			{/* 3D Text */}
			<Suspense fallback={null}>
				<LeftText />
				<RightText />
			</Suspense>

			{/* Camera controls - disabled to allow page scrolling */}
			<OrbitControls
				enablePan={false}
				enableZoom={false}
				enableRotate={false}
				autoRotate={false}
				enabled={false}
			/>

			{/* Post-processing effects */}
			<EffectComposer>
				<DepthOfField focusDistance={0} focalLength={0.2} bokehScale={2} height={480} />
				<Bloom
					intensity={0.5}
					width={300}
					height={300}
					kernelSize={5}
					luminanceThreshold={0.15}
					luminanceSmoothing={0.025}
				/>
				<Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.05} />
				<Vignette eskil={false} offset={0.1} darkness={0.5} />
				<ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0005, 0.0012]} />
			</EffectComposer>
		</Canvas>
	);
}

// Preload the GLTF model to improve loading performance
useGLTF.preload("/sentry-logo-3d.glb");
