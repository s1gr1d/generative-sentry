import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  Text3D, 
  Float,
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import { SAMPLE_SPANS, SPANS_BY_OPERATION } from '@/data/sampleSpanData';
import { COLOR_PALETTE, PRIMARY_COLORS, SECONDARY_COLORS, TERTIARY_COLORS, hexToThreeColor } from '@/utils/colorPalette';
import type { SpanData } from '@/types/spanData';

// Operation color mapping for consistent visualization
const OPERATION_COLORS: Record<string, string> = {
  'http.server': PRIMARY_COLORS.BLURPLE,
  'http.client': PRIMARY_COLORS.LT_BLURPLE,
  'ui.paint': SECONDARY_COLORS.DK_PINK,
  'ui.mount': SECONDARY_COLORS.LT_PINK,
  'ui.render': SECONDARY_COLORS.DK_ORANGE,
  'db.query': PRIMARY_COLORS.DK_VIOLET,
  'db.transaction': PRIMARY_COLORS.LT_VIOLET,
  'navigation.navigate': TERTIARY_COLORS.DK_BLUE,
  'function.call': TERTIARY_COLORS.LT_BLUE,
  'cache.get': TERTIARY_COLORS.DK_GREEN,
  'cache.set': TERTIARY_COLORS.LT_GREEN,
  'resource.script': SECONDARY_COLORS.DK_YELLOW,
  'auth.verify': TERTIARY_COLORS.LT_GREEN,
  'ui.interaction': SECONDARY_COLORS.LT_ORANGE,
  'navigation.load': PRIMARY_COLORS.DK_PURPLE,
  'resource.stylesheet': TERTIARY_COLORS.DK_BLUE,
  'cache.miss': PRIMARY_COLORS.LT_PURPLE,
  'process.data': SECONDARY_COLORS.DK_ORANGE,
  'db.connection': PRIMARY_COLORS.DK_BLURPLE,
  'resource.font': SECONDARY_COLORS.LT_YELLOW,
  'function.async': TERTIARY_COLORS.LT_BLUE,
  'file.read': TERTIARY_COLORS.DK_GREEN,
  'auth.login': SECONDARY_COLORS.DK_PINK,
  'auth.logout': SECONDARY_COLORS.LT_PINK,
  'file.write': TERTIARY_COLORS.LT_GREEN,
  'file.upload': SECONDARY_COLORS.DK_YELLOW,
  'process.image': TERTIARY_COLORS.LT_BLUE,
  'process.video': SECONDARY_COLORS.DK_ORANGE,
  'resource.image': PRIMARY_COLORS.LT_VIOLET
};

// Performance categories for positioning
const PERFORMANCE_LAYERS = {
  fast: { y: 0, color: TERTIARY_COLORS.DK_GREEN },      // < 20ms
  medium: { y: 4, color: SECONDARY_COLORS.DK_YELLOW },   // 20-100ms
  slow: { y: 8, color: SECONDARY_COLORS.DK_ORANGE },     // 100-500ms
  verySlow: { y: 12, color: SECONDARY_COLORS.DK_PINK }   // > 500ms
};

// Noise function for organic movement
const noise = (x: number, y: number, z: number, time: number): number => {
  return Math.sin(x * 0.1 + time) * Math.cos(y * 0.1 + time) * Math.sin(z * 0.1 + time * 0.5);
};

// Individual span particle component
interface SpanParticleProps {
  span: SpanData;
  index: number;
}

const SpanParticle = ({ span, index }: SpanParticleProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const originalPosition = useRef<[number, number, number]>([0, 0, 0]);
  
  // Calculate position based on span properties
  const position = useMemo(() => {
    // Radial positioning based on operation type
    const operations = Object.keys(SPANS_BY_OPERATION);
    const operationIndex = operations.indexOf(span.op);
    const operationAngle = (operationIndex / operations.length) * Math.PI * 2;
    
    // Distance from center based on duration (logarithmic scale)
    const radius = Math.log(span.duration + 1) * 3;
    
    // Height based on performance category
    let height = 0;
    if (span.duration < 20) height = PERFORMANCE_LAYERS.fast.y;
    else if (span.duration < 100) height = PERFORMANCE_LAYERS.medium.y;
    else if (span.duration < 500) height = PERFORMANCE_LAYERS.slow.y;
    else height = PERFORMANCE_LAYERS.verySlow.y;
    
    // Add some randomness for organic feel
    const randomOffset = (Math.random() - 0.5) * 2;
    
    const pos: [number, number, number] = [
      Math.cos(operationAngle) * radius + randomOffset,
      height + (Math.random() - 0.5) * 1.5,
      Math.sin(operationAngle) * radius + randomOffset
    ];
    
    originalPosition.current = pos;
    return pos;
  }, [span]);
  
  // Size based on duration with logarithmic scaling
  const size = useMemo(() => {
    const baseSize = 0.1;
    const scale = Math.log(span.duration + 1) * 0.15;
    return Math.max(baseSize, Math.min(scale, 1.0));
  }, [span.duration]);
  
  // Color based on operation type
  const color = useMemo(() => {
    const hexColor = OPERATION_COLORS[span.op] || COLOR_PALETTE.RICH_BLACK;
    return new THREE.Color(...hexToThreeColor(hexColor));
  }, [span.op]);
  
  // Animation with organic movement
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime * 0.5;
    const [x, y, z] = originalPosition.current;
    
    // Add organic floating movement
    const noiseX = noise(x, y, z, time) * 0.3;
    const noiseY = noise(x + 100, y, z, time * 0.7) * 0.2;
    const noiseZ = noise(x, y + 100, z, time * 0.8) * 0.3;
    
    meshRef.current.position.set(
      x + noiseX,
      y + noiseY,
      z + noiseZ
    );
    
    // Gentle rotation
    meshRef.current.rotation.x = time * 0.2 + index * 0.01;
    meshRef.current.rotation.y = time * 0.3 + index * 0.02;
  });
  
  return (
    <Float speed={1.5 + Math.random()} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh 
        ref={meshRef} 
        position={position}
        scale={[size, size, size]}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.8}
        />
        
        {/* Tooltip on hover */}
        <Html distanceFactor={10} position={[0, 1.5, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(24, 18, 37, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'Monaco, monospace',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'none'
          }}>
            <div><strong>{span.op}</strong></div>
            <div>{span.description}</div>
            <div>{Math.round(span.duration)}ms</div>
            <div>{span.project.name}</div>
          </div>
        </Html>
      </mesh>
    </Float>
  );
};

// Performance layer indicators
const PerformanceLayerIndicator = ({ layer, label, y }: { layer: string; label: string; y: number }) => {
  const color = PERFORMANCE_LAYERS[layer as keyof typeof PERFORMANCE_LAYERS]?.color || COLOR_PALETTE.RICH_BLACK;
  
  return (
    <group position={[0, y, 0]}>
      {/* Ring indicator */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[15, 15.5, 32]} />
        <meshBasicMaterial 
          color={new THREE.Color(...hexToThreeColor(color))}
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Label */}
      <Text3D
        font="/fonts/rubik-bold.json"
        size={0.8}
        height={0.1}
        position={[16, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        {label}
        <meshStandardMaterial 
          color={new THREE.Color(...hexToThreeColor(color))}
          emissive={new THREE.Color(...hexToThreeColor(color))}
          emissiveIntensity={0.2}
        />
      </Text3D>
    </group>
  );
};

// Operation type legend in 3D space
const OperationLegend = () => {
  const operations = Object.keys(SPANS_BY_OPERATION).slice(0, 12); // Show top 12 operations
  
  return (
    <group position={[-25, 8, 0]}>
      {operations.map((operation, index) => {
        const color = OPERATION_COLORS[operation] || COLOR_PALETTE.RICH_BLACK;
        const y = index * -1.2;
        
        return (
          <group key={operation} position={[0, y, 0]}>
            <mesh position={[-1, 0, 0]}>
              <sphereGeometry args={[0.2]} />
              <meshStandardMaterial 
                color={new THREE.Color(...hexToThreeColor(color))}
                emissive={new THREE.Color(...hexToThreeColor(color))}
                emissiveIntensity={0.3}
              />
            </mesh>
            
            <Text3D
              font="/fonts/rubik-bold.json"
              size={0.3}
              height={0.05}
              position={[0, -0.1, 0]}
            >
              {operation}
              <meshStandardMaterial 
                color={new THREE.Color(1, 1, 1)}
              />
            </Text3D>
          </group>
        );
      })}
    </group>
  );
};

// Data flow connections between related spans
const SpanConnections = () => {
  const lines = useMemo(() => {
    const connections: Array<{ start: THREE.Vector3; end: THREE.Vector3; strength: number }> = [];
    
    // Find spans that might be related (same trace_id or sequential timing)
    const spansByTrace = new Map<string, SpanData[]>();
    SAMPLE_SPANS.forEach(span => {
      if (!spansByTrace.has(span.trace_id)) {
        spansByTrace.set(span.trace_id, []);
      }
      spansByTrace.get(span.trace_id)!.push(span);
    });
    
    // Create connections within traces (parent-child relationships)
    spansByTrace.forEach(spans => {
      if (spans.length < 2) return;
      
      for (let i = 0; i < spans.length - 1; i++) {
        const span1 = spans[i];
        const span2 = spans[i + 1];
        
        // Calculate positions (similar to SpanParticle logic)
        const getSpanPosition = (span: SpanData) => {
          const operations = Object.keys(SPANS_BY_OPERATION);
          const operationIndex = operations.indexOf(span.op);
          const operationAngle = (operationIndex / operations.length) * Math.PI * 2;
          const radius = Math.log(span.duration + 1) * 3;
          
          let height = 0;
          if (span.duration < 20) height = PERFORMANCE_LAYERS.fast.y;
          else if (span.duration < 100) height = PERFORMANCE_LAYERS.medium.y;
          else if (span.duration < 500) height = PERFORMANCE_LAYERS.slow.y;
          else height = PERFORMANCE_LAYERS.verySlow.y;
          
          return new THREE.Vector3(
            Math.cos(operationAngle) * radius,
            height,
            Math.sin(operationAngle) * radius
          );
        };
        
        connections.push({
          start: getSpanPosition(span1),
          end: getSpanPosition(span2),
          strength: Math.min(span1.duration, span2.duration) / 1000
        });
      }
    });
    
    return connections.slice(0, 100); // Limit for performance
  }, []);
  
  return (
    <group>
      {lines.map((connection, index) => {
        const distance = connection.start.distanceTo(connection.end);
        const midpoint = new THREE.Vector3().addVectors(connection.start, connection.end).multiplyScalar(0.5);
        
        return (
          <mesh key={index} position={midpoint} lookAt={connection.end}>
            <cylinderGeometry args={[0.01, 0.01, distance, 8]} />
            <meshBasicMaterial 
              color={new THREE.Color(...hexToThreeColor(PRIMARY_COLORS.LT_BLURPLE))}
              transparent
              opacity={Math.min(connection.strength, 0.3)}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Main scene component
const SpanVisualizationScene = () => {
  // Sample spans for visualization (limit for performance)
  const visualizationSpans = useMemo(() => {
    return SAMPLE_SPANS.slice(0, 300); // Show 300 spans for good balance of detail and performance
  }, []);
  
  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={0.5}
        castShadow
      />
      <spotLight 
        position={[-10, 10, -10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={0.3}
      />
      
      {/* Environment */}
      <Environment preset="studio" background={false} />
      
      {/* Performance layer indicators */}
      <PerformanceLayerIndicator layer="fast" label="Fast (<20ms)" y={0} />
      <PerformanceLayerIndicator layer="medium" label="Medium (20-100ms)" y={4} />
      <PerformanceLayerIndicator layer="slow" label="Slow (100-500ms)" y={8} />
      <PerformanceLayerIndicator layer="verySlow" label="Very Slow (>500ms)" y={12} />
      
      {/* Operation legend */}
      <OperationLegend />
      
      {/* Span connections */}
      <SpanConnections />
      
      {/* Span particles */}
      {visualizationSpans.map((span, index) => (
        <SpanParticle 
          key={`${span.span_id}-${index}`}
          span={span} 
          index={index}
        />
      ))}
      
      {/* Ground plane with subtle contact shadows */}
      <ContactShadows 
        position={[0, -2, 0]} 
        opacity={0.2} 
        scale={50} 
        blur={2} 
        far={10} 
      />
      
      {/* Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={50}
        minDistance={5}
        target={[0, 6, 0]}
      />
    </>
  );
};

// Main canvas component
const SpanVisualizationCanvas = () => {
  return (
    <div style={{ width: '100%', height: '600px', background: 'linear-gradient(135deg, #f6f6f8 0%, #e8e8f0 100%)' }}>
      <Canvas
        camera={{ 
          position: [25, 15, 25], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <SpanVisualizationScene />
      </Canvas>
    </div>
  );
};

export default SpanVisualizationCanvas;
