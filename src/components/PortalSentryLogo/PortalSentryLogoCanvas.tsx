import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	useGLTF,
	MeshPortalMaterial,
	CameraControls,
	Environment,
	PivotControls,
	Edges,
} from "@react-three/drei";
import * as THREE from "three";
import {
	PRIMARY_COLORS,
	SECONDARY_COLORS,
	TERTIARY_COLORS,
	NORMALIZED_RGB,
} from "@/utils/colorPalette";

interface PortalSentryLogoCanvasProps {
	/** Scale of the entire scene (default: 1) */
	scale?: number;
	/** Enable pivot controls for interaction (default: true) */
	enableControls?: boolean;
}

// Loading fallback for the Sentry logo
function LoadingSentryLogo() {
	const logoRef = useRef<THREE.Group>(null);

	useFrame((state) => {
		if (!logoRef.current) return;
		const time = state.clock.getElapsedTime();
		logoRef.current.rotation.y = time * 0.5;
	});

	return (
		<group ref={logoRef}>
			<mesh>
				<torusGeometry args={[0.8, 0.3, 8, 16, Math.PI]} />
				<meshStandardMaterial color={new THREE.Color(...NORMALIZED_RGB.BLURPLE)} />
			</mesh>
			<mesh rotation={[0, 0, Math.PI]}>
				<torusGeometry args={[0.8, 0.3, 8, 16, Math.PI]} />
				<meshStandardMaterial color={new THREE.Color(...NORMALIZED_RGB.BLURPLE)} />
			</mesh>
		</group>
	);
}

// Individual portal side component
function PortalSide({
	bgColor,
	logoColor,
	index,
}: {
	bgColor: string;
	logoColor: string;
	index: number;
}) {
	const meshRef = useRef<THREE.Mesh>(null);
	const gltf = useGLTF("/sentry-logo-3d.glb");

	useFrame((_, delta) => {
		if (meshRef.current) {
			meshRef.current.rotation.x += delta * 0.3;
			meshRef.current.rotation.y += delta * 0.2;
		}
	});

	// Clone and prepare the Sentry logo for this portal
	const SentryLogoMesh = () => {
		if (!gltf?.scene) return <LoadingSentryLogo />;

		const clonedScene = gltf.scene.clone();

		// Apply the specific color to all meshes in the logo
		clonedScene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.material = new THREE.MeshStandardMaterial({
					color: new THREE.Color(logoColor),
					metalness: 0.4,
					roughness: 0.3,
				});
			}
		});

		return (
			<primitive object={clonedScene} scale={[3, 3, 3]} position={[0, -0.5, 0]} ref={meshRef} />
		);
	};

	return (
		<MeshPortalMaterial attach={`material-${index}`} blur={0} resolution={512}>
			{/* Everything inside this portal is isolated */}
			<ambientLight intensity={0.4} />
			<Environment preset="city" />

			{/* Background sphere with portal color */}
			<mesh scale={[100, 100, 100]} position={[0, 0, -25]}>
				<sphereGeometry args={[1, 32, 32]} />
				<meshBasicMaterial color={bgColor} side={THREE.BackSide} />
			</mesh>

			{/* Accent lighting with portal color */}
			<spotLight
				castShadow
				color={bgColor}
				intensity={2}
				position={[10, 10, 10]}
				angle={0.15}
				penumbra={1}
				shadow-normalBias={0.05}
				shadow-bias={0.0001}
			/>
			<pointLight color={logoColor} intensity={1.5} position={[-5, 5, 3]} />

			{/* The Sentry logo with animated rotation */}
			<Suspense fallback={<LoadingSentryLogo />}>
				<SentryLogoMesh />
			</Suspense>
		</MeshPortalMaterial>
	);
}

// Main portal cube component
function PortalCube({ scale = 1 }: { scale: number }) {
	const cubeRef = useRef<THREE.Group>(null);

	// Auto-rotation when not being manually controlled
	useFrame((_, delta) => {
		if (cubeRef.current) {
			cubeRef.current.rotation.y += delta * 0.2;
			cubeRef.current.rotation.x += delta * 0.1;
		}
	});

	// Define the six portal configurations using approved colors
	const portalConfigs = [
		{
			rotation: [0, 0, 0] as [number, number, number],
			bgColor: PRIMARY_COLORS.DK_VIOLET,
			logoColor: PRIMARY_COLORS.LT_BLURPLE,
		},
		{
			rotation: [0, Math.PI, 0] as [number, number, number],
			bgColor: PRIMARY_COLORS.DK_BLURPLE,
			logoColor: SECONDARY_COLORS.LT_PINK,
		},
		{
			rotation: [0, Math.PI / 2, Math.PI / 2] as [number, number, number],
			bgColor: SECONDARY_COLORS.DK_ORANGE,
			logoColor: PRIMARY_COLORS.BLURPLE,
		},
		{
			rotation: [0, Math.PI / 2, -Math.PI / 2] as [number, number, number],
			bgColor: SECONDARY_COLORS.DK_YELLOW,
			logoColor: PRIMARY_COLORS.DK_PURPLE,
		},
		{
			rotation: [0, -Math.PI / 2, 0] as [number, number, number],
			bgColor: TERTIARY_COLORS.DK_GREEN,
			logoColor: SECONDARY_COLORS.DK_ORANGE,
		},
		{
			rotation: [0, Math.PI / 2, 0] as [number, number, number],
			bgColor: TERTIARY_COLORS.DK_BLUE,
			logoColor: SECONDARY_COLORS.LT_YELLOW,
		},
	];

	return (
		<group ref={cubeRef}>
			<mesh castShadow receiveShadow scale={[scale, scale, scale]}>
				<boxGeometry args={[3, 3, 3]} />
				<Edges color={PRIMARY_COLORS.RICH_BLACK} />

				{portalConfigs.map((config, index) => (
					<PortalSide
						key={index}
						bgColor={config.bgColor}
						logoColor={config.logoColor}
						index={index}
					/>
				))}
			</mesh>
		</group>
	);
}

export function PortalSentryLogoCanvas({
	scale = 1,
	enableControls = true,
}: PortalSentryLogoCanvasProps) {
	return (
		<Canvas
			shadows
			camera={{ position: [-4, 2, 4], fov: 60 }}
			style={{
				width: "100%",
				height: "100vh",
				background: `linear-gradient(135deg, ${PRIMARY_COLORS.RICH_BLACK}, ${PRIMARY_COLORS.DK_VIOLET})`,
			}}
			gl={{ antialias: true }}
			dpr={[1, 2]}
		>
			{/* Ambient and directional lighting */}
			<ambientLight intensity={0.3} />
			<directionalLight
				position={[10, 10, 5]}
				intensity={1}
				castShadow
				shadow-mapSize={[1024, 1024]}
			/>
			<pointLight position={[-10, -10, -5]} intensity={0.5} color={PRIMARY_COLORS.LT_BLURPLE} />

			{enableControls && (
				<PivotControls
					anchor={[-1.5, -1.5, -1.5]}
					scale={0.75}
					lineWidth={2}
					axisColors={[SECONDARY_COLORS.DK_PINK, TERTIARY_COLORS.DK_GREEN, TERTIARY_COLORS.DK_BLUE]}
				>
					<PortalCube scale={scale} />
				</PivotControls>
			)}

			{!enableControls && <PortalCube scale={scale} />}

			<CameraControls
				makeDefault
				mouseButtons={{
					left: 1, // ROTATE
					middle: 0, // NONE
					right: 2, // TRUCK (pan)
					wheel: 0, // NONE (disable zoom)
				}}
			/>
		</Canvas>
	);
}

// Preload the GLTF model
useGLTF.preload("/sentry-logo-3d.glb");
