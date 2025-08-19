import React, { Component, ReactNode, ErrorInfo } from "react";
import { COLOR_PALETTE } from "@/utils/colorPalette";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Canvas Error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: "100%",
						height: "100%",
						minHeight: "400px",
						background: COLOR_PALETTE.RICH_BLACK,
						color: COLOR_PALETTE.BLURPLE,
						flexDirection: "column",
						gap: "1rem",
						padding: "2rem",
						borderRadius: "8px",
					}}
				>
					<div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>🎨 Canvas Loading...</div>
					<div style={{ fontSize: "0.9rem", opacity: 0.7, textAlign: "center" }}>
						The generative art canvas is initializing. Please wait a moment or refresh the page.
					</div>
					<button
						onClick={() => this.setState({ hasError: false })}
						style={{
							background: COLOR_PALETTE.BLURPLE,
							color: COLOR_PALETTE.RICH_BLACK,
							border: "none",
							padding: "0.5rem 1rem",
							borderRadius: "4px",
							cursor: "pointer",
							marginTop: "1rem",
						}}
					>
						Try Again
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}
