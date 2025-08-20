import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { COLOR_PALETTE, getRandomColorNames, type ColorCategory } from "@/utils/colorPalette";

export interface FloatingPlanetProps {
	/** Planet size multiplier (default: 1.0) */
	planetSize?: number;
	/** Number of assets to place on planet (default: 15) */
	assetCount?: number;
	/** Asset size multiplier (default: 0.8) */
	assetSize?: number;
	/** Planet rotation speed (default: 0.002) */
	rotationSpeed?: number;
	/** Color category for asset colors (default: 'ALL') */
	colorCategory?: ColorCategory;
	/** Enable gentle floating animation for assets (default: true) */
	enableFloating?: boolean;
}

// Asset model paths
const PLANET_ASSET_MODELS = {
	planet: "/models/planet/Planet.glb",
	treeBlobLarge: "/models/planet/Tree Blob.glb",
	treeBlobMedium: "/models/planet/Tree Blob2.glb",
	treeBlobSmall: "/models/planet/Tree Blob3.glb",
	treeLightLarge: "/models/planet/Tree Light.glb",
	treeLightSmall: "/models/planet/Tree Light2.glb",
	plant: "/models/planet/Plant.glb",
	grass: "/models/planet/Grass.glb",
	bush: "/models/planet/Bush.glb",
} as const;

// Asset types for random distribution
const ASSET_TYPES = [
	"treeBlobLarge",
	"treeBlobMedium",
	"treeBlobSmall",
	"treeLightLarge",
	"treeLightSmall",
	"plant",
	"grass",
	"bush",
] as const;

// Planet data interface
interface PlanetAssetData {
	id: number;
	type: keyof typeof PLANET_ASSET_MODELS;
	position: THREE.Vector3;
	spherical: THREE.Spherical;
	scale: number;
	color: keyof typeof COLOR_PALETTE;
	floatOffset: number;
	originalPosition: THREE.Vector3;
}

// Load all planet models
const usePlanetModels = () => {
	const planet = useGLTF(PLANET_ASSET_MODELS.planet);
	const treeBlobLarge = useGLTF(PLANET_ASSET_MODELS.treeBlobLarge);
	const treeBlobMedium = useGLTF(PLANET_ASSET_MODELS.treeBlobMedium);
	const treeBlobSmall = useGLTF(PLANET_ASSET_MODELS.treeBlobSmall);
	const treeLightLarge = useGLTF(PLANET_ASSET_MODELS.treeLightLarge);
	const treeLightSmall = useGLTF(PLANET_ASSET_MODELS.treeLightSmall);
	const plant = useGLTF(PLANET_ASSET_MODELS.plant);
	const grass = useGLTF(PLANET_ASSET_MODELS.grass);
	const bush = useGLTF(PLANET_ASSET_MODELS.bush);

	return {
		planet,
		treeBlobLarge,
		treeBlobMedium,
		treeBlobSmall,
		treeLightLarge,
		treeLightSmall,
		plant,
		grass,
		bush,
	};
};

// Extract geometry and material from GLTF model
const extractFromGLTF = (
	gltf: any,
): { geometry: THREE.BufferGeometry; originalMaterial: THREE.Material | null } => {
	let geometry: THREE.BufferGeometry | null = null;
	let originalMaterial: THREE.Material | null = null;

	console.log("Extracting from GLTF:", gltf);
	console.log("GLTF scene children:", gltf.scene.children);

	gltf.scene.traverse((child: any) => {
		console.log("Traversing child:", child.type, child.name);
		if (child.isMesh && child.geometry) {
			console.log("Found mesh with geometry:", child.name, child.geometry);
			if (!geometry) {
				geometry = child.geometry.clone();
				originalMaterial = child.material;
				console.log("Using geometry from:", child.name);
			}
		}
	});

	if (!geometry) {
		console.warn("No geometry found in GLTF, using fallback sphere");
		geometry = new THREE.SphereGeometry(1, 64, 32); // Unit sphere that will be scaled
	}

	return {
		geometry,
		originalMaterial,
	};
};

// Optimized material creation with brighter settings
const createAssetMaterial = (
	originalMaterial: THREE.Material | null,
	overlayColor: string,
): THREE.Material => {
	if (originalMaterial && (originalMaterial as any).map) {
		// Preserve original texture with brighter overlay
		const material = new THREE.MeshStandardMaterial({
			map: (originalMaterial as any).map,
			normalMap: (originalMaterial as any).normalMap,
			roughnessMap: (originalMaterial as any).roughnessMap,
			metalnessMap: (originalMaterial as any).metalnessMap,
			color: overlayColor,
			transparent: false, // Better performance
			metalness: 0.2,
			roughness: 0.5, // More reflective
		});
		return material;
	} else {
		// Brighter fallback material
		return new THREE.MeshStandardMaterial({
			color: overlayColor,
			metalness: 0.2,
			roughness: 0.5,
		});
	}
};

// Generate random spherical coordinates for asset placement
const generateSpherePositionAndRotation = (
	radius: number,
): { position: THREE.Vector3; spherical: THREE.Spherical } => {
	// Generate spherical coordinates
	const phi = Math.acos(-1 + 2 * Math.random()); // Uniform distribution on sphere
	const theta = Math.random() * 2 * Math.PI;

	// Create spherical coordinate object
	const spherical = new THREE.Spherical(radius, phi, theta);

	// Convert to cartesian position
	const position = new THREE.Vector3();
	position.setFromSpherical(spherical);

	return { position, spherical };
};

// Optimized instanced assets component
const InstancedAssets: React.FC<{
	assetsData: PlanetAssetData[];
	planetModels: ReturnType<typeof usePlanetModels>;
	assetGroupRef: React.RefObject<THREE.Group | null>;
}> = React.memo(({ assetsData, planetModels, assetGroupRef }) => {
	// Group assets by type for instancing
	const instancedMeshData = useMemo(() => {
		const groupedAssets: Record<string, PlanetAssetData[]> = {};
		assetsData.forEach((asset) => {
			if (!groupedAssets[asset.type]) {
				groupedAssets[asset.type] = [];
			}
			groupedAssets[asset.type].push(asset);
		});

		return Object.entries(groupedAssets)
			.map(([type, assets]) => {
				const model = planetModels[type as keyof typeof planetModels];
				if (!model?.scene) return null;

				const { geometry, originalMaterial } = extractFromGLTF(model);
				const material = createAssetMaterial(originalMaterial, COLOR_PALETTE.LT_GREEN);

				// Create instanced mesh
				const mesh = new THREE.InstancedMesh(geometry, material, assets.length);
				mesh.castShadow = true;
				mesh.receiveShadow = true;

				// Set up matrices for all instances
				assets.forEach((asset, index) => {
					const dummy = new THREE.Object3D();
					dummy.position.copy(asset.position);
					dummy.scale.setScalar(asset.scale);

					// Proper surface orientation using quaternions
					const vectorToPointOnSphere = new THREE.Vector3();
					vectorToPointOnSphere.setFromSpherical(asset.spherical);
					const originalOrientation = new THREE.Vector3(0, 1, 0);
					dummy.quaternion.setFromUnitVectors(
						originalOrientation,
						vectorToPointOnSphere.normalize(),
					);

					// Add natural variation
					const randomRotation = new THREE.Euler(
						(Math.random() - 0.5) * 0.3,
						Math.random() * Math.PI * 2,
						(Math.random() - 0.5) * 0.2,
					);
					const randomQuaternion = new THREE.Quaternion().setFromEuler(randomRotation);
					dummy.quaternion.multiply(randomQuaternion);

					dummy.updateMatrix();
					mesh.setMatrixAt(index, dummy.matrix);
				});

				mesh.instanceMatrix.needsUpdate = true;

				return { type, mesh, assets };
			})
			.filter((item): item is NonNullable<typeof item> => item !== null);
	}, [assetsData, planetModels]);

	// Cleanup instanced meshes on unmount
	useEffect(() => {
		return () => {
			instancedMeshData.forEach(({ mesh }) => {
				mesh?.geometry?.dispose();
				if (Array.isArray(mesh?.material)) {
					mesh.material.forEach((mat: THREE.Material) => mat.dispose());
				} else {
					mesh?.material?.dispose();
				}
			});
		};
	}, [instancedMeshData]);

	return (
		<group ref={assetGroupRef}>
			{instancedMeshData.map(({ type, mesh }) => (
				<primitive key={type} object={mesh} />
			))}
		</group>
	);
});

export const FloatingPlanet: React.FC<FloatingPlanetProps> = ({
	planetSize = 10000.0, // Even larger planet for better visibility
	assetCount = 15,
	assetSize = 1000.0, // Proportionally larger assets
	rotationSpeed = 0.002,
	colorCategory = "ALL",
	enableFloating = true,
}) => {
	const planetGroupRef = useRef<THREE.Group>(null);
	const assetGroupRef = useRef<THREE.Group>(null);
	const planetRef = useRef<THREE.Mesh>(null);

	// Load all planet models
	const planetModels = usePlanetModels();

	// Generate asset data
	const assetsData = useMemo<PlanetAssetData[]>(() => {
		const colors = getRandomColorNames(assetCount, colorCategory);
		const planetRadius = planetSize / 55; // Use planetSize directly as radius

		return Array.from({ length: assetCount }, (_, i) => {
			const assetType = ASSET_TYPES[Math.floor(Math.random() * ASSET_TYPES.length)];
			const { position, spherical } = generateSpherePositionAndRotation(
				planetRadius + (Math.random() * 100 + 50),
			);

			return {
				id: i,
				type: assetType,
				position: position.clone(),
				spherical: spherical.clone(),
				scale: assetSize, // * (0.8 + Math.random() * 0.4), // Vary scale slightly
				color: colors[i % colors.length],
				floatOffset: Math.random() * Math.PI * 2,
				originalPosition: position.clone(),
			};
		});
	}, [assetCount, assetSize, planetSize, colorCategory]);

	// Simple asset loading (no instancing needed)
	console.log(`Loading ${assetsData.length} individual assets using simple meshes`);

	// Optimized animation loop with useCallback
	const animate = useCallback(() => {
		// Rotate the entire planet group (planet + assets together)
		if (planetGroupRef.current && enableFloating) {
			planetGroupRef.current.rotation.y += rotationSpeed;
			planetGroupRef.current.rotation.x += rotationSpeed * 0.05; // Very slight wobble
		}
	}, [rotationSpeed, enableFloating]);

	useFrame(animate);

	// Optimized planet geometry and material creation
	const planetData = useMemo(() => {
		if (!planetModels.planet?.scene) {
			return {
				geometry: new THREE.SphereGeometry(1, 64, 32),
				material: new THREE.MeshStandardMaterial({
					color: COLOR_PALETTE.LT_BLUE,
					metalness: 0.2,
					roughness: 0.6,
				}),
			};
		}

		const { geometry, originalMaterial } = extractFromGLTF(planetModels.planet);
		const material = createAssetMaterial(originalMaterial, COLOR_PALETTE.LT_BLUE);

		return { geometry, material };
	}, [planetModels.planet]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			planetData.geometry?.dispose();
			planetData.material?.dispose();
		};
	}, [planetData]);

	console.log("Rendering FloatingPlanet with:", { planetSize, assetCount, assetsData: assetsData });

	// Debug log the first asset position and scale
	if (assetsData.length > 0) {
		console.log("First asset debug info:", {
			originalPosition: assetsData[0].position,
			scale: assetsData[0].scale,
			type: assetsData[0].type,
			color: assetsData[0].color,
		});
		console.log("Camera should be at:", { camera: "check camera position" });
		console.log("Asset scale value:", assetsData[0].scale);
	}

	return (
		<group ref={planetGroupRef}>
			{/* Main Planet - optimized rendering */}
			<mesh
				ref={planetRef}
				geometry={planetData.geometry}
				material={planetData.material}
				scale={[planetSize, planetSize, planetSize]}
				castShadow
				receiveShadow
			/>

			{/* Assets positioned directly in planet group (no separate rotation) */}
			<InstancedAssets
				assetsData={assetsData}
				planetModels={planetModels}
				assetGroupRef={assetGroupRef as React.RefObject<THREE.Group | null>}
			/>
		</group>
	);
};

// Preload all planet models
useGLTF.preload(PLANET_ASSET_MODELS.planet);
useGLTF.preload(PLANET_ASSET_MODELS.treeBlobLarge);
useGLTF.preload(PLANET_ASSET_MODELS.treeBlobMedium);
useGLTF.preload(PLANET_ASSET_MODELS.treeBlobSmall);
useGLTF.preload(PLANET_ASSET_MODELS.treeLightLarge);
useGLTF.preload(PLANET_ASSET_MODELS.treeLightSmall);
useGLTF.preload(PLANET_ASSET_MODELS.plant);
useGLTF.preload(PLANET_ASSET_MODELS.grass);
useGLTF.preload(PLANET_ASSET_MODELS.bush);
