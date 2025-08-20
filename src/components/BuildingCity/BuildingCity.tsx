import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { COLOR_PALETTE, NORMALIZED_RGB } from "@/utils/colorPalette";
import type { SpanData } from "@/types/spanData";

export interface BuildingCityProps {
	/** Span data to visualize */
	spanData?: SpanData[];
	/** Number of columns in the grid */
	cols?: number;
	/** Number of rows in the grid */
	rows?: number;
	/** Base size of each building area */
	buildingSize?: number;
	/** Gap between buildings */
	gap?: number;
	/** Maximum duration to determine building type (in ms) */
	maxDuration?: number;
	/** Whether to animate the buildings */
	animate?: boolean;
	/** Scale factor for building models */
	buildingScale?: number;
}

// Building model paths (ordered from smallest to largest)
const BUILDING_MODELS = {
	SMALL_BUILDING_1: "/models/buildings/Small Building1.glb",
	SMALL_BUILDING_2: "/models/buildings/Small Building2.glb",
	LARGE_BUILDING_1: "/models/buildings/Large Building1.glb",
	LARGE_BUILDING_2: "/models/buildings/Large Building2.glb",
	SKYSCRAPER_1: "/models/buildings/Skyscraper1.glb",
	SKYSCRAPER_2: "/models/buildings/Skyscraper2.glb",
	SKYSCRAPER_3: "/models/buildings/Skyscraper3.glb",
} as const;

// Simple Perlin-like noise function for color variation
const noise = (x: number, y: number): number => {
	// Simple hash-based noise function
	let n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
	return n - Math.floor(n);
};

const smoothNoise = (x: number, y: number): number => {
	const intX = Math.floor(x);
	const intY = Math.floor(y);
	const fracX = x - intX;
	const fracY = y - intY;

	const a = noise(intX, intY);
	const b = noise(intX + 1, intY);
	const c = noise(intX, intY + 1);
	const d = noise(intX + 1, intY + 1);

	const i1 = a + fracX * (b - a);
	const i2 = c + fracX * (d - c);

	return i1 + fracY * (i2 - i1);
};

const perlinNoise = (x: number, y: number): number => {
	let total = 0;
	let frequency = 0.05;
	let amplitude = 1;
	let maxValue = 0;

	for (let i = 0; i < 4; i++) {
		total += smoothNoise(x * frequency, y * frequency) * amplitude;
		maxValue += amplitude;
		amplitude *= 0.5;
		frequency *= 2;
	}

	return total / maxValue;
};

// Color mapping based on span operation types
const getOperationColor = (operation: string): [number, number, number] => {
	if (operation.startsWith("http.")) return [...NORMALIZED_RGB.DK_BLUE];
	if (operation.startsWith("db.")) return [...NORMALIZED_RGB.DK_PURPLE];
	if (operation.startsWith("ui.")) return [...NORMALIZED_RGB.DK_ORANGE];
	if (operation.startsWith("cache.")) return [...NORMALIZED_RGB.DK_GREEN];
	if (operation.startsWith("auth.")) return [...NORMALIZED_RGB.DK_PINK];
	if (operation.startsWith("resource.")) return [...NORMALIZED_RGB.LT_YELLOW];
	if (operation.startsWith("navigation.")) return [...NORMALIZED_RGB.LT_BLUE];
	if (operation.startsWith("function.")) return [...NORMALIZED_RGB.LT_PURPLE];
	if (operation.startsWith("file.")) return [...NORMALIZED_RGB.LT_GREEN];
	if (operation.startsWith("process.")) return [...NORMALIZED_RGB.LT_PINK];
	return [...NORMALIZED_RGB.BLURPLE]; // Default color
};

// Generate colorful variation based on position using Perlin noise
const getNoiseBasedColor = (gridX: number, gridZ: number): [number, number, number] => {
	const noiseValue = perlinNoise(gridX, gridZ);
	const colorIndex = Math.floor(noiseValue * 10) % 10;

	const colorVariations: [number, number, number][] = [
		[...NORMALIZED_RGB.DK_VIOLET],
		[...NORMALIZED_RGB.LT_VIOLET],
		[...NORMALIZED_RGB.DK_PURPLE],
		[...NORMALIZED_RGB.LT_PURPLE],
		[...NORMALIZED_RGB.DK_BLURPLE],
		[...NORMALIZED_RGB.BLURPLE],
		[...NORMALIZED_RGB.LT_BLURPLE],
		[...NORMALIZED_RGB.DK_PINK],
		[...NORMALIZED_RGB.LT_PINK],
		[...NORMALIZED_RGB.DK_ORANGE],
	];

	return colorVariations[colorIndex];
};

// Function to determine building model based on span duration (7-tier system)
const getBuildingModel = (duration: number, maxDuration: number): string => {
	const normalizedDuration = Math.min(duration, maxDuration) / maxDuration;

	// Map duration to 7 building types from smallest to largest
	if (normalizedDuration >= 6 / 7) return BUILDING_MODELS.SKYSCRAPER_3; // Longest traces
	if (normalizedDuration >= 5 / 7) return BUILDING_MODELS.SKYSCRAPER_2;
	if (normalizedDuration >= 4 / 7) return BUILDING_MODELS.SKYSCRAPER_1;
	if (normalizedDuration >= 3 / 7) return BUILDING_MODELS.LARGE_BUILDING_2;
	if (normalizedDuration >= 2 / 7) return BUILDING_MODELS.LARGE_BUILDING_1;
	if (normalizedDuration >= 1 / 7) return BUILDING_MODELS.SMALL_BUILDING_2;
	return BUILDING_MODELS.SMALL_BUILDING_1; // Shortest traces
};

// Building component that handles individual building rendering
const Building: React.FC<{
	modelPath: string;
	position: [number, number, number];
	operationColor: [number, number, number];
	noiseColor: [number, number, number];
	span: SpanData | null;
	animate: boolean;
	index: number;
	scale: number;
}> = ({ modelPath, position, operationColor, noiseColor, span, animate, index, scale }) => {
	const buildingRef = useRef<THREE.Group>(null);
	const { scene } = useGLTF(modelPath);

	// Clone the scene to avoid sharing geometry between instances
	const clonedScene = useMemo(() => scene.clone(), [scene]);

	// Apply colorful overlay blending operation and noise colors
	useMemo(() => {
		clonedScene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				// Enable shadow casting for all meshes
				child.castShadow = true;
				child.receiveShadow = true;

				if (child.material) {
					if (Array.isArray(child.material)) {
						child.material.forEach((material) => {
							if (material instanceof THREE.MeshStandardMaterial) {
								// Store original color if not already stored
								if (!material.userData.originalColor) {
									material.userData.originalColor = material.color.clone();
								}
								// Blend operation color with noise color for more variety
								const originalColor = material.userData.originalColor;
								const opColor = new THREE.Color(...operationColor);
								const noiseCol = new THREE.Color(...noiseColor);

								// Mix operation color (60%) with noise color (40%) for vibrant variation
								const blendedColor = opColor.clone().lerp(noiseCol, 0.4);

								// Apply blended color tint while preserving some of the original (30% tint)
								material.color.copy(originalColor).lerp(blendedColor, 0.3);
							}
						});
					} else if (child.material instanceof THREE.MeshStandardMaterial) {
						// Store original color if not already stored
						if (!child.material.userData.originalColor) {
							child.material.userData.originalColor = child.material.color.clone();
						}
						// Blend operation color with noise color for more variety
						const originalColor = child.material.userData.originalColor;
						const opColor = new THREE.Color(...operationColor);
						const noiseCol = new THREE.Color(...noiseColor);

						// Mix operation color (60%) with noise color (40%) for vibrant variation
						const blendedColor = opColor.clone().lerp(noiseCol, 0.4);

						// Apply blended color tint while preserving some of the original (30% tint)
						child.material.color.copy(originalColor).lerp(blendedColor, 0.3);
					}
				}
			}
		});
	}, [clonedScene, operationColor, noiseColor]);

	// Optional animation for buildings with errors
	useFrame((state) => {
		if (!animate || !buildingRef.current || span?.status === "ok") return;

		const time = state.clock.elapsedTime;
		const pulse = Math.sin(time * 2 + index * 0.1) * 0.05 + 1;
		buildingRef.current.scale.y = pulse;
	});

	return (
		<group ref={buildingRef} position={position}>
			<primitive object={clonedScene} scale={[scale, scale, scale]} />

			{/* Error indicator for failed spans */}
			{span?.status !== "ok" && (
				<mesh position={[0, (50 * scale) / 50, 0]}>
					<sphereGeometry args={[8, 8, 6]} />
					<meshStandardMaterial
						color={COLOR_PALETTE.DK_PINK}
						emissive={COLOR_PALETTE.DK_PINK}
						emissiveIntensity={0.3}
					/>
				</mesh>
			)}
		</group>
	);
};

const BuildingCity: React.FC<BuildingCityProps> = ({
	spanData = [],
	cols = 30,
	rows = 30,
	buildingSize = 60,
	gap = 10,
	maxDuration = 1000,
	animate = false,
	buildingScale = 20,
}) => {
	const groupRef = useRef<THREE.Group>(null);

	// Preload all building models
	useGLTF.preload(BUILDING_MODELS.SMALL_BUILDING_1);
	useGLTF.preload(BUILDING_MODELS.SMALL_BUILDING_2);
	useGLTF.preload(BUILDING_MODELS.LARGE_BUILDING_1);
	useGLTF.preload(BUILDING_MODELS.LARGE_BUILDING_2);
	useGLTF.preload(BUILDING_MODELS.SKYSCRAPER_1);
	useGLTF.preload(BUILDING_MODELS.SKYSCRAPER_2);
	useGLTF.preload(BUILDING_MODELS.SKYSCRAPER_3);

	// Create building instances data from span data
	const buildingsData = useMemo(() => {
		const data = [];

		// Simple deterministic random function based on position
		const getRandomOffset = (x: number, z: number, seed: number): number => {
			const hash = ((x * 73856093) ^ (z * 19349663) ^ (seed * 83492791)) % 1000000;
			return (hash / 1000000 - 0.5) * 2; // Returns value between -1 and 1
		};

		// Fill grid positions with span data, cycling through data to fill entire grid
		for (let z = 0; z < rows; z++) {
			for (let x = 0; x < cols; x++) {
				const index = z * cols + x;
				// Cycle through span data using modulo to ensure grid is always full
				const span = spanData.length > 0 ? spanData[index % spanData.length] : null;

				// Add small random offsets to break the perfect grid alignment
				const maxOffset = gap * 0.3; // 30% of gap size
				const offsetX = getRandomOffset(x, z, 12345) * maxOffset;
				const offsetZ = getRandomOffset(x, z, 67890) * maxOffset;

				data.push({
					x: x * (buildingSize + gap) + offsetX,
					z: z * (buildingSize + gap) + offsetZ,
					gridX: x,
					gridZ: z,
					span,
					// Determine building model based on duration
					modelPath: span
						? getBuildingModel(span.duration, maxDuration)
						: BUILDING_MODELS.SMALL_BUILDING_1,
					// Get color based on operation or status
					operationColor: span
						? getOperationColor(span.op)
						: ([...NORMALIZED_RGB.RICH_BLACK] as [number, number, number]),
					// Get noise-based color for variation
					noiseColor: getNoiseBasedColor(x, z),
					index,
				});
			}
		}
		return data;
	}, [spanData, cols, rows, buildingSize, gap, maxDuration]);

	// Calculate ground plane size
	const gridWidth = (cols - 1) * (buildingSize + gap) + buildingSize * 2;
	const gridDepth = (rows - 1) * (buildingSize + gap) + buildingSize * 2;

	return (
		<>
			{/* Camera controls */}
			<OrbitControls
				enablePan={false}
				enableZoom={true}
				enableRotate={true}
				maxDistance={3000}
				minDistance={500}
				maxPolarAngle={Math.PI / 2.2}
				autoRotate={true}
				autoRotateSpeed={0.3}
			/>

			{/* Lighting */}
			<ambientLight intensity={0.3} />
			<directionalLight
				position={[300, 500, 400]}
				intensity={0.8}
				color={COLOR_PALETTE.LT_YELLOW}
				castShadow
			/>
			<directionalLight
				position={[-300, 300, -400]}
				intensity={0.4}
				color={COLOR_PALETTE.LT_BLUE}
			/>

			{/* Dark gray ground plane */}
			<mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				<planeGeometry args={[gridWidth, gridDepth]} />
				<meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.1} />
			</mesh>

			{/* Grid of buildings */}
			<group
				ref={groupRef}
				position={[
					(-(cols - 1) * (buildingSize + gap)) / 2,
					0,
					(-(rows - 1) * (buildingSize + gap)) / 2,
				]}
			>
				{buildingsData.map((building, index) => (
					<Building
						key={index}
						modelPath={building.modelPath}
						position={[building.x, 0, building.z]}
						operationColor={building.operationColor}
						noiseColor={building.noiseColor}
						span={building.span}
						animate={animate}
						index={building.index}
						scale={buildingScale}
					/>
				))}
			</group>
		</>
	);
};

export { BuildingCity };
