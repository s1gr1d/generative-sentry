import { FloatingCubesCanvas } from "@/components/FloatingCubes/FloatingCubesCanvas";
import type { SectionDefinition } from "./types";

export const floatingCubesSection: SectionDefinition = {
	id: "floating-cubes",
	title: "Floating Cubes",
	description: "floating cubes with configurable shaders",
	bodyText:
		"Interactive 3D floating cubes that gently drift within their own orbital radius. Each cube features configurable shader materials and responds to mouse movement for camera rotation and zoom controls. A perfect demonstration of Three.js particle systems with bounded motion.",
	order: 5,
	component: () => (
		<FloatingCubesCanvas
			canvasKey="floating-cubes"
			cubeCount={150}
			shaderType="standard"
			floatRadius={3.0}
			floatSpeed={1.0}
			colorCategory="BLURPLES"
			enableWireframe={false}
		/>
	),
};
