uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform float u_noiseScale;
uniform float u_speed;

varying vec2 vUv;

// Simple noise function for grain effect
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

  return mix(a, b, u.x) +
         (c - a) * u.y * (1.0 - u.x) +
         (d - b) * u.x * u.y;
}

void main() {
  vec2 st = vUv;
  
  // Create animated gradient coordinates
  vec2 gradientUV = st;
  gradientUV.x += sin(u_time * u_speed * 0.5) * 0.3;
  gradientUV.y += cos(u_time * u_speed * 0.3) * 0.2;
  
  // Generate moving gradient
  float gradient1 = smoothstep(0.0, 1.0, gradientUV.x + sin(u_time * u_speed) * 0.2);
  float gradient2 = smoothstep(0.0, 1.0, gradientUV.y + cos(u_time * u_speed * 0.7) * 0.3);
  float gradient3 = smoothstep(0.0, 1.0, length(gradientUV - 0.5) + sin(u_time * u_speed * 0.4) * 0.1);
  
  // Mix the three colors based on gradients
  vec3 color = mix(u_color1, u_color2, gradient1);
  color = mix(color, u_color3, gradient2 * 0.6);
  color = mix(color, u_color1, gradient3 * 0.3);
  
  // Add grain/noise
  float grain = noise(st * u_noiseScale + u_time * u_speed * 0.1);
  grain = (grain - 0.5) * 0.1; // Reduce noise intensity
  
  // Apply grain to color
  color += grain;
  
  gl_FragColor = vec4(color, 1.0);
}
