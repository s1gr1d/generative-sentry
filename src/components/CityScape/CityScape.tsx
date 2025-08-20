import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { COLOR_PALETTE, NORMALIZED_RGB } from "@/utils/colorPalette";
import type { SpanData } from "@/types/spanData";

export interface CityScapeProps {
	/** Span data to visualize */
	spanData?: SpanData[];
	/** Number of columns in the grid */
	cols?: number;
	/** Number of rows in the grid */
	rows?: number;
	/** Size of each cube */
	cubeSize?: number;
	/** Gap between cubes */
	gap?: number;
	/** Height multiplier factor for durations */
	heightFactor?: number;
	/** Maximum duration to cap heights (in ms) */
	maxDuration?: number;
	/** Whether to show wireframe outlines */
	showWireframe?: boolean;
	/** Whether to animate the buildings */
	animate?: boolean;
}

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

const CityScape: React.FC<CityScapeProps> = ({
	spanData = [],
	cols = 50,
	rows = 50,
	cubeSize = 35,
	gap = 4,
	heightFactor = 5,
	maxDuration = 1000,
	showWireframe = true,
	animate = false,
}) => {
	const groupRef = useRef<THREE.Group>(null);
	const timeRef = useRef(0);

	// Create cube instances data from span data
	const cubesData = useMemo(() => {
		const data = [];

		// Fill grid positions with span data, cycling through data to fill entire grid
		for (let z = 0; z < rows; z++) {
			for (let x = 0; x < cols; x++) {
				const index = z * cols + x;
				// Cycle through span data using modulo to ensure grid is always full
				const span = spanData.length > 0 ? spanData[index % spanData.length] : null;

				data.push({
					x: x * (cubeSize + gap),
					z: z * (cubeSize + gap),
					gridX: x,
					gridZ: z,
					span,
					// Calculate height based on duration
					height: span
						? Math.min(span.duration, maxDuration) * heightFactor + cubeSize
						: cubeSize * 0.5, // Fallback for no data
					// Get color based on operation or status
					color: span ? getOperationColor(span.op) : [...NORMALIZED_RGB.RICH_BLACK],
				});
			}
		}
		return data;
	}, [spanData, cols, rows, cubeSize, gap, heightFactor, maxDuration]);

	// Optional animation frame for gentle effects
	useFrame((state) => {
		if (!animate || !groupRef.current) return;

		timeRef.current = state.clock.elapsedTime;

		// Add subtle pulsing effect to buildings with errors
		groupRef.current.children.forEach((child, index) => {
			const cubeData = cubesData[index];

			if (child instanceof THREE.Group && cubeData.span?.status !== "ok") {
				const pulse = Math.sin(timeRef.current * 2 + index * 0.1) * 0.05 + 1;
				child.scale.y = pulse;
			}
		});
	});

	return (
		<>
			{/* Camera controls */}
			<OrbitControls
				enablePan={false}
				enableZoom={true}
				enableRotate={true}
				maxDistance={2000}
				minDistance={300}
				maxPolarAngle={Math.PI / 2.2}
				autoRotate={true}
				autoRotateSpeed={0.5}
			/>

			{/* Lighting */}
			<ambientLight intensity={0.3} />
			<directionalLight
				position={[200, 400, 300]}
				intensity={0.8}
				color={COLOR_PALETTE.LT_YELLOW}
				castShadow
			/>
			<directionalLight
				position={[-200, 200, -300]}
				intensity={0.4}
				color={COLOR_PALETTE.LT_BLUE}
			/>

			{/* Grid of cubes */}
			<group
				ref={groupRef}
				position={[(-(cols - 1) * (cubeSize + gap)) / 2, 0, (-(rows - 1) * (cubeSize + gap)) / 2]}
			>
				{cubesData.map((cube, index) => {
					const buildingHeight = cube.height;

					return (
						<group
							key={index}
							position={[cube.x, 0, cube.z]}
							userData={{ span: cube.span }} // Store span data for interactions
						>
							{/* Main cube */}
							<mesh position={[0, buildingHeight / 2, 0]}>
								<boxGeometry args={[cubeSize, buildingHeight, cubeSize]} />
								<meshStandardMaterial
									color={new THREE.Color(...cube.color)}
									metalness={0.1}
									roughness={0.7}
								/>
							</mesh>

							{/* Wireframe outline */}
							{showWireframe && (
								<mesh position={[0, buildingHeight / 2, 0]}>
									<boxGeometry args={[cubeSize + 0.5, buildingHeight + 0.5, cubeSize + 0.5]} />
									<meshBasicMaterial
										color={COLOR_PALETTE.RICH_BLACK}
										wireframe={true}
										transparent={true}
										opacity={0.6}
									/>
								</mesh>
							)}

							{/* Error indicator for failed spans */}
							{cube.span?.status !== "ok" && (
								<mesh position={[0, buildingHeight + cubeSize * 0.3, 0]}>
									<sphereGeometry args={[cubeSize * 0.15, 8, 6]} />
									<meshStandardMaterial
										color={COLOR_PALETTE.DK_PINK}
										emissive={COLOR_PALETTE.DK_PINK}
										emissiveIntensity={0.2}
									/>
								</mesh>
							)}
						</group>
					);
				})}
			</group>
		</>
	);
};

export { CityScape };
