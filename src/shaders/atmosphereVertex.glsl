uniform float u_time;
uniform float u_planetRadius;
uniform float u_atmosphereThickness;
uniform float u_animationSpeed;

attribute float size;
attribute float colorIndex;
attribute float alphaVariation;

varying float vColorIndex;
varying float vAlpha;
varying vec2 vUv;

// Simple noise function for atmospheric movement
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vColorIndex = colorIndex;
  vUv = uv;
  
  // Calculate distance from planet center
  float distanceFromCenter = length(position);
  float normalizedDistance = (distanceFromCenter - u_planetRadius) / u_atmosphereThickness;
  
  // Create animated movement for clouds
  vec3 animatedPosition = position;
  
  // Add swirling motion based on position
  float angle = atan(position.z, position.x);
  float height = position.y;
  
  // Create different wind layers at different heights
  float windSpeed1 = u_time * u_animationSpeed * 0.3;
  float windSpeed2 = u_time * u_animationSpeed * 0.5;
  
  // Apply swirling motion
  float swirl1 = sin(angle * 3.0 + windSpeed1) * 0.02;
  float swirl2 = cos(angle * 2.0 + windSpeed2) * 0.01;
  
  animatedPosition.x += swirl1 * (1.0 + normalizedDistance);
  animatedPosition.z += swirl2 * (1.0 + normalizedDistance);
  
  // Add vertical drift
  float verticalNoise = noise(vec2(angle * 5.0, u_time * u_animationSpeed * 0.1));
  animatedPosition.y += verticalNoise * 0.01;
  
  // Calculate alpha based on distance and variation
  float baseAlpha = 1.0 - smoothstep(0.0, 1.0, normalizedDistance);
  vAlpha = baseAlpha * alphaVariation * (0.3 + 0.7 * sin(u_time * u_animationSpeed * 0.2 + colorIndex * 10.0));
  
  // Calculate final position
  vec4 mvPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  
  // Size particles based on distance and distance from camera
  float scaleFactor = size * (1.0 + normalizedDistance * 0.5);
  gl_PointSize = clamp(scaleFactor * (500.0 / -mvPosition.z), 5.0, 200.0);
}
