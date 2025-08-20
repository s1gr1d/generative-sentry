import { Layout, Section } from "@/components";
import { sections } from "./sections";

export function App() {
	return (
		<Layout>
			{sections.map((section) => (
				<Section
					key={section.id}
					id={section.id}
					title={section.title}
					bodyText={section.bodyText || ""}
				>
					{section.component()}
				</Section>
			))}
		</Layout>
	);
}
