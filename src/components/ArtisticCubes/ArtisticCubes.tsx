import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
	MeshWobbleMaterial,
	MeshDistortMaterial,
	MeshReflectorMaterial,
	MeshTransmissionMaterial,
	Sparkles,
} from "@react-three/drei";
import {
	NORMALIZED_RGB,
	getRandomColorNames,
	COLOR_PALETTE,
	type ColorCategory,
} from "@/utils/colorPalette";

export interface ArtisticCubesProps {
	/** Number of cubes to generate (default: 60) */
	cubeCount?: number;
	/** Radius within which each cube can float (default: 2.0) */
	floatRadius?: number;
	/** Speed of floating animation (default: 0.8) */
	floatSpeed?: number;
	/** Color category for cube colors (default: 'ALL') */
	colorCategory?: ColorCategory;
	/** Size of cubes (default: 0.8) */
	cubeSize?: number;
	/** Enable sparkles effect (default: true) */
	enableSparkles?: boolean;
}

interface ArtisticCubeData {
	id: number;
	position: THREE.Vector3;
	originalPosition: THREE.Vector3;
	color: keyof typeof COLOR_PALETTE;
	phaseOffset: THREE.Vector3;
	rotationSpeed: THREE.Vector3;
	materialType: "wobble" | "distort" | "reflection" | "transmission" | "holographic";
	intensity: number;
}

const ArtisticCubes: React.FC<ArtisticCubesProps> = ({
	cubeCount = 60,
	floatRadius = 2.0,
	floatSpeed = 0.8,
	colorCategory = "ALL",
	cubeSize = 0.8,
	enableSparkles = true,
}) => {
	const groupRef = useRef<THREE.Group>(null);
	const { camera, size } = useThree();

	// Mouse tracking state
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const windowHalfX = size.width / 2;
	const windowHalfY = size.height / 2;

	// Generate artistic cube data with random material types
	const cubesData = useMemo<ArtisticCubeData[]>(() => {
		const colors = getRandomColorNames(cubeCount, colorCategory);
		const materialTypes: ArtisticCubeData["materialType"][] = [
			"wobble",
			"distort",
			"reflection",
			"transmission",
			"holographic",
		];

		return Array.from({ length: cubeCount }, (_, i) => {
			// Distribute cubes randomly in 3D space
			const basePosition = new THREE.Vector3(
				Math.random() * 1500 - 750,
				Math.random() * 1500 - 750,
				Math.random() * 1500 - 750,
			);

			return {
				id: i,
				position: basePosition.clone(),
				originalPosition: basePosition.clone(),
				color: colors[i % colors.length],
				phaseOffset: new THREE.Vector3(
					Math.random() * Math.PI * 2,
					Math.random() * Math.PI * 2,
					Math.random() * Math.PI * 2,
				),
				rotationSpeed: new THREE.Vector3(
					(Math.random() - 0.5) * 0.03,
					(Math.random() - 0.5) * 0.03,
					(Math.random() - 0.5) * 0.03,
				),
				materialType: materialTypes[Math.floor(Math.random() * materialTypes.length)],
				intensity: Math.random() * 0.5 + 0.5, // Random intensity between 0.5 and 1.0
			};
		});
	}, [cubeCount, colorCategory]);

	// Mouse event handling
	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			const mouseX = (event.clientX - windowHalfX) * 8;
			const mouseY = (event.clientY - windowHalfY) * 8;
			setMousePosition({ x: mouseX, y: mouseY });
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [windowHalfX, windowHalfY]);

	// Create artistic material based on type
	const createArtisticMaterial = (cubeData: ArtisticCubeData) => {
		const baseColor = new THREE.Color(...NORMALIZED_RGB[cubeData.color]);

		switch (cubeData.materialType) {
			case "wobble":
				return (
					<MeshWobbleMaterial
						color={baseColor}
						factor={cubeData.intensity * 2}
						speed={cubeData.intensity * 3}
						roughness={0.1}
						metalness={0.3}
					/>
				);

			case "distort":
				return (
					<MeshDistortMaterial
						color={baseColor}
						distort={cubeData.intensity * 0.8}
						speed={cubeData.intensity * 2}
						roughness={0.2}
						metalness={0.5}
					/>
				);

			case "reflection":
				return (
					<MeshReflectorMaterial
						color={baseColor}
						roughness={0.1}
						metalness={0.9}
						mixStrength={0.8}
						mixContrast={1}
						resolution={256}
						mirror={0.8}
						depthScale={1}
						minDepthThreshold={0.9}
						maxDepthThreshold={1}
						distortion={cubeData.intensity}
						distortionScale={0.5}
					/>
				);

			case "transmission":
				return (
					<MeshTransmissionMaterial
						color={baseColor}
						thickness={cubeData.intensity}
						roughness={0.1}
						transmission={0.9}
						ior={1.5}
						chromaticAberration={0.1}
						anisotropy={0.3}
					/>
				);

			case "holographic":
				return (
					<meshPhongMaterial
						color={baseColor}
						shininess={100}
						specular={baseColor.clone().multiplyScalar(0.8)}
						transparent={true}
						opacity={0.7}
						emissive={baseColor.clone().multiplyScalar(0.2)}
					/>
				);

			default:
				return <meshStandardMaterial color={baseColor} metalness={0.5} roughness={0.3} />;
		}
	};

	// Animation loop with enhanced effects
	useFrame((state) => {
		if (!groupRef.current) return;

		const time = state.clock.getElapsedTime() * floatSpeed;

		// Update camera position based on mouse movement
		camera.position.x += (mousePosition.x - camera.position.x) * 0.03;
		camera.position.y += (-mousePosition.y - camera.position.y) * 0.03;
		camera.lookAt(0, 0, 0);

		// Enhanced group rotation with time-based variation
		const rx = Math.sin(time * 0.4) * 0.3 + Math.cos(time * 0.8) * 0.1;
		const ry = Math.sin(time * 0.6) * 0.4 + Math.sin(time * 1.2) * 0.15;
		const rz = Math.sin(time * 0.3) * 0.2 + Math.cos(time * 0.9) * 0.1;
		groupRef.current.rotation.x = rx;
		groupRef.current.rotation.y = ry;
		groupRef.current.rotation.z = rz;

		// Individual cube floating animation with artistic variations
		groupRef.current.children.forEach((cubeGroup, index) => {
			const cubeData = cubesData[index];
			if (!cubeData || !cubeGroup) return;

			// Enhanced floating animation with multiple wave patterns
			const floatX =
				Math.sin(time + cubeData.phaseOffset.x) * floatRadius * 25 +
				Math.cos(time * 0.7 + cubeData.phaseOffset.x) * floatRadius * 10;
			const floatY =
				Math.cos(time * 0.8 + cubeData.phaseOffset.y) * floatRadius * 30 +
				Math.sin(time * 1.3 + cubeData.phaseOffset.y) * floatRadius * 8;
			const floatZ =
				Math.sin(time * 0.6 + cubeData.phaseOffset.z) * floatRadius * 20 +
				Math.cos(time * 1.1 + cubeData.phaseOffset.z) * floatRadius * 12;

			// Update position relative to original position
			cubeGroup.position.copy(cubeData.originalPosition);
			cubeGroup.position.x += floatX;
			cubeGroup.position.y += floatY;
			cubeGroup.position.z += floatZ;

			// Enhanced rotation with material-specific variations
			const rotationMultiplier =
				cubeData.materialType === "wobble" ? 1.5 : cubeData.materialType === "distort" ? 2.0 : 1.0;
			cubeGroup.rotation.x += cubeData.rotationSpeed.x * rotationMultiplier;
			cubeGroup.rotation.y += cubeData.rotationSpeed.y * rotationMultiplier;
			cubeGroup.rotation.z += cubeData.rotationSpeed.z * rotationMultiplier;

			// Scale pulsing effect for certain materials
			if (cubeData.materialType === "transmission" || cubeData.materialType === "holographic") {
				const scaleBase = 1 + Math.sin(time * 2 + cubeData.phaseOffset.x) * 0.1;
				cubeGroup.scale.setScalar(scaleBase);
			}
		});
	});

	return (
		<>
			<group ref={groupRef}>
				{cubesData.map((cubeData) => (
					<group key={cubeData.id}>
						<mesh position={cubeData.position}>
							<boxGeometry args={[cubeSize * 60, cubeSize * 60, cubeSize * 60]} />
							{createArtisticMaterial(cubeData)}
						</mesh>
					</group>
				))}
			</group>

			{/* Ambient sparkles for extra artistic effect */}
			{enableSparkles && (
				<Sparkles
					count={100}
					scale={800}
					size={3}
					speed={0.4}
					opacity={0.6}
					color={COLOR_PALETTE.LT_BLURPLE}
				/>
			)}
		</>
	);
};

export { ArtisticCubes };
