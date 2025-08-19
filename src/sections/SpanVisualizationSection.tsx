import SpanVisualization from '@/components/SpanVisualization';
import type { SectionDefinition } from './types';

const SpanVisualizationSection = () => {
  return <SpanVisualization />;
};

export const spanVisualizationSection: SectionDefinition = {
  id: 'span-visualization',
  title: 'Performance Span Visualization',
  description: 'Interactive 3D exploration of distributed tracing data with statistical analysis and artistic topology visualization.',
  bodyText: 'Advanced data science meets generative art in this immersive 3D visualization of performance span data. Each particle represents a distributed trace operation, positioned by duration and operation type, with organic noise-based movement. Explore statistical insights through interactive analytics while watching data flow through beautifully rendered topology networks.',
  order: 9,
  component: SpanVisualizationSection
};

export default SpanVisualizationSection;
