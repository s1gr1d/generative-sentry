import { ReactNode } from "react";

export interface SectionConfig {
	id: string;
	title: string;
	description: string;
	order: number;
	component: ReactNode;
}

export interface SectionDefinition {
	id: string;
	title: string;
	description: string;
	bodyText?: string;
	order: number;
	component: () => ReactNode;
}
