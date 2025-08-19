import React, { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";
import * as THREE from "three";
import { COLOR_PALETTE, NORMALIZED_RGB } from "@/utils/colorPalette";
import type { SpanData } from "@/types/spanData";

export interface SpanSoupProps {
	/** Span data to extract text from */
	spans: SpanData[];
	/** Maximum number of words to display (default: 80) */
	maxWords?: number;
	/** Radius of the soup bowl (default: 800) */
	bowlRadius?: number;
	/** Base floating speed (default: 0.3) */
	floatSpeed?: number;
	/** Force multiplier for mouse interactions (default: 5) */
	forceMultiplier?: number;
	/** Whether to show span operations or descriptions (default: 'operation') */
	dataType?: "operation" | "description";
}

interface WordData {
	id: string;
	text: string;
	position: THREE.Vector3;
	originalPosition: THREE.Vector3;
	velocity: THREE.Vector3;
	color: keyof typeof COLOR_PALETTE;
	size: number;
	sourceSpan: SpanData;
	phaseOffset: number;
	rotationSpeed: THREE.Vector3;
	isHovered: boolean;
	lastHoverTime: number;
}

const SpanSoup: React.FC<SpanSoupProps> = ({
	spans,
	maxWords = 80,
	bowlRadius = 800,
	floatSpeed = 0.3,
	forceMultiplier = 5,
	dataType = "operation",
}) => {
	const groupRef = useRef<THREE.Group>(null);
	const wordsRef = useRef<Map<string, THREE.Mesh>>(new Map());
	const { camera, raycaster, pointer } = useThree();
	const setHoveredWord = useState<string | null>(null)[1];
	const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

	// Extract meaningful text from span data
	const extractTextFromSpans = (
		spans: SpanData[],
	): Array<{
		text: string;
		sourceSpan: SpanData;
	}> => {
		const textSources: Array<{
			text: string;
			sourceSpan: SpanData;
		}> = [];

		spans.forEach((span) => {
			if (dataType === "operation") {
				// Extract operation type
				textSources.push({
					text: span.op,
					sourceSpan: span,
				});
			} else {
				// Extract description, split into meaningful words
				const words = span.description
					.replace(/[^a-zA-Z0-9\s]/g, " ") // Replace special chars with spaces
					.split(/\s+/)
					.filter((word) => word.length > 2) // Only keep words longer than 2 chars
					.slice(0, 3); // Limit to first 3 words per description

				words.forEach((word) => {
					textSources.push({
						text: word,
						sourceSpan: span,
					});
				});
			}
		});

		return textSources;
	};

	// Get color based on span characteristics
	const getColorForSpan = (span: SpanData): keyof typeof COLOR_PALETTE => {
		// Color by operation type
		if (span.op.startsWith("ui.")) return "LT_PINK";
		if (span.op.startsWith("http.")) return "BLURPLE";
		if (span.op.startsWith("db.")) return "DK_VIOLET";
		if (span.op.startsWith("cache.")) return "DK_GREEN";
		if (span.op.startsWith("auth.")) return "DK_ORANGE";
		if (span.op.startsWith("navigation.")) return "LT_BLUE";
		if (span.op.startsWith("resource.")) return "DK_YELLOW";
		if (span.op.startsWith("function.")) return "LT_PURPLE";
		if (span.op.startsWith("file.")) return "DK_BLUE";
		if (span.op.startsWith("process.")) return "LT_ORANGE";

		// Color by status if operation type doesn't match
		if (span.status !== "ok") return "DK_PINK";

		// Default color by duration
		if (span.duration < 20) return "LT_GREEN";
		if (span.duration < 100) return "BLURPLE";
		if (span.duration < 500) return "DK_PURPLE";
		return "DK_PINK"; // Very slow operations
	};

	// Generate word data from spans
	const wordsData = useMemo<WordData[]>(() => {
		const textSources = extractTextFromSpans(spans);
		const words: WordData[] = [];

		// Create unique words to avoid duplicates
		const uniqueTexts = new Map<string, { text: string; sourceSpan: SpanData }>();
		textSources.forEach((source) => {
			const key = source.text.toLowerCase();
			if (!uniqueTexts.has(key)) {
				uniqueTexts.set(key, source);
			}
		});

		// Convert unique texts to word data
		Array.from(uniqueTexts.values()).forEach((source, index) => {
			if (words.length >= maxWords) return;

			// Generate random position within bowl radius
			const angle = Math.random() * Math.PI * 2;
			const distance = Math.random() * bowlRadius * 0.8;
			const height = (Math.random() - 0.5) * bowlRadius * 0.6;

			const position = new THREE.Vector3(
				Math.cos(angle) * distance,
				height,
				Math.sin(angle) * distance,
			);

			// Size based on operation type and duration
			const baseSize = dataType === "operation" ? 60 : 40; // Operations are larger
			const durationMultiplier = Math.min(source.sourceSpan.duration / 100, 2); // 0-2x multiplier
			const size = baseSize + durationMultiplier * 20 + Math.random() * 15;

			words.push({
				id: `word-${index}`,
				text: source.text,
				position: position.clone(),
				originalPosition: position.clone(),
				velocity: new THREE.Vector3(0, 0, 0),
				color: getColorForSpan(source.sourceSpan),
				size,
				sourceSpan: source.sourceSpan,
				phaseOffset: Math.random() * Math.PI * 2,
				rotationSpeed: new THREE.Vector3(
					(Math.random() - 0.5) * 0.01,
					(Math.random() - 0.5) * 0.01,
					(Math.random() - 0.5) * 0.01,
				),
				isHovered: false,
				lastHoverTime: 0,
			});
		});

		return words.slice(0, maxWords);
	}, [spans, maxWords, bowlRadius, dataType]);

	// Mouse interaction handling
	useFrame((state) => {
		if (!groupRef.current) return;

		const time = state.clock.getElapsedTime();

		// Update raycaster
		raycaster.setFromCamera(pointer, camera);

		// Track mouse movement for force direction
		const currentMouse = { x: pointer.x, y: pointer.y };
		const mouseDelta = {
			x: currentMouse.x - lastMousePosition.x,
			y: currentMouse.y - lastMousePosition.y,
		};
		setLastMousePosition(currentMouse);

		// Check for intersections with words
		const wordMeshes = Array.from(wordsRef.current.values());
		const intersects = raycaster.intersectObjects(wordMeshes);

		// Reset hover states
		wordsData.forEach((word) => {
			word.isHovered = false;
		});

		// Set hover for intersected words
		let newHoveredWord: string | null = null;
		if (intersects.length > 0) {
			const intersectedMesh = intersects[0].object as THREE.Mesh;
			const wordId = intersectedMesh.userData.wordId;
			if (wordId) {
				const word = wordsData.find((w) => w.id === wordId);
				if (word) {
					word.isHovered = true;
					word.lastHoverTime = time;
					newHoveredWord = wordId;

					// Apply directional force based on mouse movement
					const forceDirection = new THREE.Vector3(
						mouseDelta.x * forceMultiplier,
						-mouseDelta.y * forceMultiplier,
						0,
					);

					// Transform force to world space
					forceDirection.unproject(camera);
					forceDirection.sub(camera.position).normalize();
					forceDirection.multiplyScalar(forceMultiplier * 50);

					word.velocity.add(forceDirection);
				}
			}
		}
		setHoveredWord(newHoveredWord);

		// Update word positions and animations
		wordsData.forEach((word) => {
			const wordMesh = wordsRef.current.get(word.id);
			if (!wordMesh) return;

			// Gentle floating animation
			const floatX = Math.sin(time * floatSpeed + word.phaseOffset) * 15;
			const floatY = Math.cos(time * floatSpeed * 0.7 + word.phaseOffset) * 20;
			const floatZ = Math.sin(time * floatSpeed * 0.5 + word.phaseOffset) * 12;

			// Apply velocity (from mouse interactions)
			word.position.add(word.velocity);

			// Apply damping to velocity
			word.velocity.multiplyScalar(0.95);

			// Gentle return to original position
			const returnForce = word.originalPosition.clone().sub(word.position).multiplyScalar(0.002);
			word.velocity.add(returnForce);

			// Combine floating animation with physics
			wordMesh.position.set(
				word.position.x + floatX,
				word.position.y + floatY,
				word.position.z + floatZ,
			);

			// Rotation animation
			wordMesh.rotation.x += word.rotationSpeed.x;
			wordMesh.rotation.y += word.rotationSpeed.y;
			wordMesh.rotation.z += word.rotationSpeed.z;

			// Scale effect for hovered words
			const targetScale = word.isHovered ? 1.3 : 1.0;
			const currentScale = wordMesh.scale.x;
			const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
			wordMesh.scale.setScalar(newScale);
		});
	});

	return (
		<group ref={groupRef}>
			{wordsData.map((word) => (
				<Text3D
					key={word.id}
					ref={(mesh) => {
						if (mesh) {
							wordsRef.current.set(word.id, mesh);
							mesh.userData.wordId = word.id;
						}
					}}
					font="/fonts/rubik-bold.json"
					size={word.size}
					height={word.size * 0.15}
					curveSegments={8}
					bevelEnabled
					bevelThickness={word.size * 0.01}
					bevelSize={word.size * 0.005}
					bevelOffset={0}
					bevelSegments={3}
					position={word.position}
				>
					{word.text}
					<meshStandardMaterial
						color={new THREE.Color(...NORMALIZED_RGB[word.color])}
						metalness={0.2}
						roughness={0.3}
						emissive={new THREE.Color(...NORMALIZED_RGB[word.color]).multiplyScalar(0.1)}
					/>
				</Text3D>
			))}
		</group>
	);
};

export { SpanSoup };
