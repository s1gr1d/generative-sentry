uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform vec3 u_color5;
uniform float u_speed;
uniform float u_noiseScale;
uniform float u_flowIntensity;
uniform float u_colorShift;

varying vec2 vUv;

// Simple noise function
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

// Fractal Brownian Motion
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.0;
    
    for (int i = 0; i < 5; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// Color mixing function using palette colors instead of HSV
vec3 getPaletteColor(float t, float variation) {
    // Normalize t to [0, 1]
    t = fract(t);
    
    // Create smooth transitions between 5 palette colors
    if (t < 0.2) {
        return mix(u_color1, u_color2, t * 5.0);
    } else if (t < 0.4) {
        return mix(u_color2, u_color3, (t - 0.2) * 5.0);
    } else if (t < 0.6) {
        return mix(u_color3, u_color4, (t - 0.4) * 5.0);
    } else if (t < 0.8) {
        return mix(u_color4, u_color5, (t - 0.6) * 5.0);
    } else {
        return mix(u_color5, u_color1, (t - 0.8) * 5.0);
    }
}

void main() {
    vec2 st = vUv * u_noiseScale;
    vec2 pos = st + u_time * u_speed * 0.1;
    
    // Generate multiple layers of noise
    float n1 = fbm(pos * 2.0 + u_time * u_speed * 0.05);
    float n2 = fbm(pos * 1.5 + u_time * u_speed * 0.03 + 100.0);
    float n3 = fbm(pos * 2.5 + u_time * u_speed * 0.07 + 200.0);
    
    // Create gradient based on UV coordinates
    float gradientX = vUv.x;
    float gradientY = vUv.y;
    
    // Combine gradient with noise for color selection
    float colorMix = gradientX + n1 * 0.3;
    colorMix += sin(u_time * u_speed * 0.02 + vUv.x * 6.28) * 0.1;
    colorMix += cos(u_time * u_speed * 0.015 + vUv.y * 6.28) * 0.1;
    
    // Add temporal color shifts
    colorMix += sin(u_time * u_speed * 0.008) * u_colorShift;
    
    // Use noise for brightness variation
    float brightness = 0.6 + n3 * 0.4 + gradientY * 0.3;
    brightness += sin(u_time * u_speed * 0.01) * 0.1;
    brightness = clamp(brightness, 0.2, 1.0);
    
    // Get color from palette
    vec3 color = getPaletteColor(colorMix, n2);
    
    // Apply brightness
    color *= brightness;
    
    // Add some subtle flowing effects
    vec2 flowPos = vUv + vec2(
        sin(u_time * u_speed * 0.03 + vUv.y * 3.14), 
        cos(u_time * u_speed * 0.025 + vUv.x * 3.14)
    ) * u_flowIntensity;
    
    float flow = fbm(flowPos * 4.0 + u_time * u_speed * 0.02);
    color += flow * 0.1;
    
    // Additional noise-based color variation
    float colorVariation = n2 * 0.15;
    color = mix(color, getPaletteColor(colorMix + 0.2, n1), colorVariation);
    
    gl_FragColor = vec4(color, 1.0);
}
