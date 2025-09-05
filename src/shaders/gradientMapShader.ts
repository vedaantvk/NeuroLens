// Keep MAX_GRADIENT_COLORS in sync with page.tsx if it's used here, or pass it as a define
// For simplicity, assuming it's hardcoded or managed elsewhere for now.
const MAX_GRADIENT_COLORS = 10;

export const gradientMapVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Use standard projection matrix for orthographic camera
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const gradientMapFragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec3 uGradientColors[${MAX_GRADIENT_COLORS}]; // N-Color Gradient Map
  uniform int uNumGradientColors;

  // Helper: Luminance
  float getLuminance(vec3 color) {
    return dot(color.rgb, vec3(0.299, 0.587, 0.114));
  }

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    float luminance = getLuminance(texColor.rgb);

    vec3 finalColor = texColor.rgb; // Default to original color

    // Apply Gradient Map if enabled and enough colors
    if (uNumGradientColors >= 2) {
      // Calculate the fractional index in the gradient array
      float scaledLum = luminance * float(uNumGradientColors - 1);

      // Get the indices of the two colors to interpolate between
      int index0 = int(floor(scaledLum));
      int index1 = int(ceil(scaledLum));

      // Clamp indices
      index0 = clamp(index0, 0, uNumGradientColors - 1);
      index1 = clamp(index1, 0, uNumGradientColors - 1);

      // Get the interpolation factor (fractional part)
      float t = fract(scaledLum);

      // Fetch the two colors
      vec3 color0 = uGradientColors[index0];
      vec3 color1 = uGradientColors[index1];

      // Interpolate
      finalColor = mix(color0, color1, t);
    }

    gl_FragColor = vec4(finalColor, texColor.a); // Combine with original alpha
  }
`;
