import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
	COLOR_PALETTE,
	NORMALIZED_RGB,
	getRandomColorNames,
	type ColorCategory,
} from "@/utils/colorPalette";

// Import shaders
import atmosphereVertexShader from "@/shaders/atmosphereVertex.glsl?raw";
import atmosphereFragmentShader from "@/shaders/atmosphereFragment.glsl?raw";

export interface AtmosphereProps {
	/** Planet radius for atmosphere positioning */
	planetRadius: number;
	/** Thickness of the atmospheric layer */
	atmosphereThickness?: number;
	/** Number of cloud particles */
	particleCount?: number;
	/** Animation speed multiplier */
	animationSpeed?: number;
	/** Color category for cloud colors */
	colorCategory?: ColorCategory;
	/** Minimum particle size */
	minParticleSize?: number;
	/** Maximum particle size */
	maxParticleSize?: number;
}

export const Atmosphere: React.FC<AtmosphereProps> = ({
	planetRadius,
	atmosphereThickness = planetRadius * 0.2,
	particleCount = 1000,
	animationSpeed = 1.0,
	colorCategory = "ALL",
	minParticleSize = 20,
	maxParticleSize = 80,
}) => {
	const pointsRef = useRef<THREE.Points>(null);
	const materialRef = useRef<THREE.ShaderMaterial>(null);

	// Generate cloud colors from the approved palette
	const cloudColors = useMemo(() => {
		const colorNames = getRandomColorNames(6, colorCategory);
		return colorNames.map((colorName) => NORMALIZED_RGB[colorName]);
	}, [colorCategory]);

	// Create geometry with particle attributes
	const geometry = useMemo(() => {
		const geo = new THREE.BufferGeometry();

		const positions: number[] = [];
		const sizes: number[] = [];
		const colorIndices: number[] = [];
		const alphaVariations: number[] = [];

		console.log("Creating atmosphere with:", {
			planetRadius,
			atmosphereThickness,
			particleCount,
			minParticleSize,
			maxParticleSize,
		});

		for (let i = 0; i < particleCount; i++) {
			// Generate random radius within atmosphere thickness
			const radius = planetRadius + Math.random() * atmosphereThickness;

			// Generate random point on sphere surface
			const phi = Math.acos(-1 + 2 * Math.random()); // Uniform distribution
			const theta = Math.random() * 2 * Math.PI;

			// Convert spherical to cartesian coordinates
			const x = radius * Math.sin(phi) * Math.cos(theta);
			const y = radius * Math.sin(phi) * Math.sin(theta);
			const z = radius * Math.cos(phi);

			positions.push(x, y, z);

			// Random size within range
			const size = minParticleSize + Math.random() * (maxParticleSize - minParticleSize);
			sizes.push(size);

			// Random color index
			colorIndices.push(Math.floor(Math.random() * 6));

			// Random alpha variation
			alphaVariations.push(0.3 + Math.random() * 0.7);

			// Debug first few particles
			if (i < 3) {
				console.log(`Particle ${i}:`, {
					position: [x, y, z],
					radius,
					size,
					distance: Math.sqrt(x * x + y * y + z * z),
				});
			}
		}

		geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
		geo.setAttribute("size", new THREE.BufferAttribute(new Float32Array(sizes), 1));
		geo.setAttribute("colorIndex", new THREE.BufferAttribute(new Float32Array(colorIndices), 1));
		geo.setAttribute(
			"alphaVariation",
			new THREE.BufferAttribute(new Float32Array(alphaVariations), 1),
		);

		return geo;
	}, [planetRadius, atmosphereThickness, particleCount, minParticleSize, maxParticleSize]);

	// Create shader material
	const material = useMemo(() => {
		// Create a simple cloud texture using canvas
		const canvas = document.createElement("canvas");
		canvas.width = 64;
		canvas.height = 64;
		const ctx = canvas.getContext("2d")!;

		// Create radial gradient for cloud texture
		const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
		gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
		gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
		gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 64, 64);

		const cloudTexture = new THREE.CanvasTexture(canvas);

		return new THREE.ShaderMaterial({
			uniforms: {
				u_time: { value: 0 },
				u_planetRadius: { value: planetRadius },
				u_atmosphereThickness: { value: atmosphereThickness },
				u_animationSpeed: { value: animationSpeed },
				u_cloudColors: { value: cloudColors.map((color) => new THREE.Vector3(...color)) },
				u_cloudTexture: { value: cloudTexture },
			},
			vertexShader: atmosphereVertexShader,
			fragmentShader: atmosphereFragmentShader,
			transparent: true,
			depthWrite: false,
			blending: THREE.NormalBlending, // Changed from AdditiveBlending for better visibility
			side: THREE.DoubleSide,
			alphaTest: 0.001, // Helps with rendering order
		});
	}, [planetRadius, atmosphereThickness, animationSpeed, cloudColors]);

	// Animation loop
	useFrame((state, delta) => {
		if (materialRef.current) {
			materialRef.current.uniforms.u_time.value += delta;
		}
	});

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			geometry?.dispose();
			material?.dispose();
		};
	}, [geometry, material]);

	return (
		<points ref={pointsRef} geometry={geometry} material={material}>
			<primitive ref={materialRef} object={material} attach="material" />
		</points>
	);
};

export default Atmosphere;
