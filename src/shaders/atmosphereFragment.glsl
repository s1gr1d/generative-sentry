uniform float u_time;
uniform vec3 u_cloudColors[6]; // Support up to 6 different cloud colors
uniform float u_animationSpeed;
uniform sampler2D u_cloudTexture;

varying float vColorIndex;
varying float vAlpha;
varying vec2 vUv;

// Improved noise functions for cloud patterns
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

// Fractal noise for more complex cloud patterns
float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 0.0;
  
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(st);
    st *= 2.0;
    amplitude *= 0.5;
  }
  
  return value;
}

void main() {
  // Create cloud texture coordinates
  vec2 cloudUV = gl_PointCoord;
  
  // Make clouds circular with soft edges
  float dist = length(cloudUV - 0.5);
  float cloudShape = 1.0 - smoothstep(0.3, 0.5, dist);
  
  // Add fractal noise for cloud detail
  vec2 noiseUV = cloudUV * 3.0 + u_time * u_animationSpeed * 0.1;
  float cloudDetail = fbm(noiseUV);
  cloudShape *= (0.6 + 0.4 * cloudDetail);
  
  // Get color based on color index
  int colorIdx = int(mod(vColorIndex, 6.0));
  vec3 cloudColor = u_cloudColors[colorIdx];
  
  // Add some color variation
  float colorVariation = noise(cloudUV * 5.0 + u_time * 0.05);
  cloudColor = mix(cloudColor * 0.8, cloudColor * 1.2, colorVariation);
  
  // Create atmospheric perspective
  float atmosphericTint = 0.8 + 0.2 * sin(u_time * u_animationSpeed * 0.3 + vColorIndex);
  cloudColor *= atmosphericTint;
  
  // Final alpha calculation - make particles more visible
  float finalAlpha = clamp(vAlpha * cloudShape * 2.0, 0.1, 0.8);
  
  // Enhance color brightness for better visibility
  cloudColor = mix(cloudColor, cloudColor * 1.5, 0.5);
  
  // Fade out very transparent particles
  if (finalAlpha < 0.05) {
    discard;
  }
  
  gl_FragColor = vec4(cloudColor, finalAlpha);
}
