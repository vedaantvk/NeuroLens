import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import {
  gradientMapVertexShader,
  gradientMapFragmentShader,
  // @ts-ignore
} from "@/shaders/gradientMapShader";

const MAX_GRADIENT_COLORS = 10;

export interface UseThreeGradientMapProps {
  mountRef: React.RefObject<HTMLDivElement | null>;
  imageUrl?: string; // Optional: for images
  videoUrl?: string; // Optional: for videos
  lightColors?: string[]; // Can be hex colors or CSS variable names
  darkColors?: string[]; // Can be hex colors or CSS variable names
  originalBackground?: boolean; // Added: If true, show original texture without shader
  uploadedImageData?: string; // Data URL from IndexedDB
  debugMode?: boolean; // Optional: Enable debug logging (defaults to iframe detection)
}

// Helper function to convert HSL to hex
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Enhanced color processing with better fallbacks for iframe environments
function processColor(colorStr: string, isDarkTheme: boolean = false, isDebugMode: boolean = false): string {
  // If it's already a hex color (starts with #)
  if (colorStr.startsWith("#")) {
    return colorStr;
  }

  // If it's a CSS variable (starts with --)
  if (colorStr.startsWith("--")) {
    try {
      if (typeof window === "undefined" || !document.documentElement) {
        if (isDebugMode) {
          console.warn(
            `[processColor] SSR environment, returning fallback for ${colorStr}`
          );
        }
        return getSmartFallback(colorStr, isDarkTheme);
      }

      const cssValue = getComputedStyle(document.documentElement)
        .getPropertyValue(colorStr)
        .trim();

      if (isDebugMode) {
        console.log(
          `[processColor] CSS variable ${colorStr} resolved to: "${cssValue}"`
        );
      }

      // Check if CSS value is empty or not found
      if (!cssValue || cssValue === "") {
        if (isDebugMode) {
          console.warn(
            `[processColor] CSS variable ${colorStr} is empty, using smart fallback`
          );
        }
        return getSmartFallback(colorStr, isDarkTheme, isDebugMode);
      }

      // If CSS value is in HSL format
      if (cssValue.includes(" ")) {
        const hslValues = cssValue
          .split(" ")
          .map((v) => parseFloat(v.replace("%", "")));

        if (hslValues.length >= 3) {
          const hexColor = hslToHex(hslValues[0], hslValues[1], hslValues[2]);
          if (isDebugMode) {
            console.log(
              `[processColor] Converted HSL ${cssValue} to hex ${hexColor}`
            );
          }
          return hexColor;
        }
      }

      // If it's already a hex or other direct color value
      if (isDebugMode) {
        console.log(`[processColor] Using direct CSS value: ${cssValue}`);
      }
      return cssValue;
    } catch (error) {
      if (isDebugMode) {
        console.warn(`Failed to process CSS variable ${colorStr}:`, error);
      }
      return getSmartFallback(colorStr, isDarkTheme, isDebugMode);
    }
  }

  // For any other string format, return as is (assumes it's a valid color string)
  return colorStr;
}

// Smart fallback colors based on common CSS variable names and theme
function getSmartFallback(cssVarName: string, isDarkTheme: boolean, isDebugMode: boolean = false): string {
  const lightThemeFallbacks: Record<string, string> = {
    "--background": "#ffffff",
    "--foreground": "#000000",
    "--primary": "#0ea5e9",
    "--secondary": "#64748b",
    "--accent": "#6366f1",
    "--muted": "#f1f5f9",
    "--border": "#e2e8f0",
    "--ring": "#0ea5e9",
  };

  const darkThemeFallbacks: Record<string, string> = {
    "--background": "#0f172a",
    "--foreground": "#f8fafc",
    "--primary": "#38bdf8",
    "--secondary": "#64748b",
    "--accent": "#a78bfa",
    "--muted": "#1e293b",
    "--border": "#334155",
    "--ring": "#38bdf8",
  };

  const fallbacks = isDarkTheme ? darkThemeFallbacks : lightThemeFallbacks;
  const fallbackColor = fallbacks[cssVarName];

  if (fallbackColor) {
    if (isDebugMode) {
      console.log(
        `[getSmartFallback] Using smart fallback for ${cssVarName}: ${fallbackColor} (theme: ${
          isDarkTheme ? "dark" : "light"
        })`
      );
    }
    return fallbackColor;
  }

  // Ultimate fallback
  const ultimateFallback = isDarkTheme ? "#1e293b" : "#ffffff";
  if (isDebugMode) {
    console.log(
      `[getSmartFallback] Using ultimate fallback for ${cssVarName}: ${ultimateFallback}`
    );
  }
  return ultimateFallback;
}

// Helper to get theme colors (fallback if specific theme colors not provided)
function getFallbackThemeColors(): string[] {
  try {
    // Default fallback colors in case CSS variables aren't available
    if (typeof window === "undefined" || !document.documentElement) {
      return ["#ffffff", "#0ea5e9", "#6366f1", "#ffffff"];
    }

    // Extract HSL values from CSS variables
    const backgroundHsl = getComputedStyle(document.documentElement)
      .getPropertyValue("--background")
      .trim()
      .split(" ")
      .map((v) => parseFloat(v.replace("%", "")));

    const primaryHsl = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim()
      .split(" ")
      .map((v) => parseFloat(v.replace("%", "")));

    const secondaryHsl = getComputedStyle(document.documentElement)
      .getPropertyValue("--secondary")
      .trim()
      .split(" ")
      .map((v) => parseFloat(v.replace("%", "")));

    // Convert to hex
    return [
      hslToHex(backgroundHsl[0], backgroundHsl[1], backgroundHsl[2]),
      hslToHex(primaryHsl[0], primaryHsl[1], primaryHsl[2]),
      hslToHex(secondaryHsl[0], secondaryHsl[1], secondaryHsl[2]),
      "#ffffff", // Use white instead of accent color
    ];
  } catch (error) {
    console.warn("Failed to extract theme colors:", error);
    // Fallback colors
    return ["#ffffff", "#0ea5e9", "#6366f1", "#ffffff"];
  }
}

export function useThreeGradientMap({
  mountRef,
  imageUrl,
  videoUrl,
  lightColors,
  darkColors,
  originalBackground = false, // Default to false if not provided
  uploadedImageData, // New prop for uploaded image data
  debugMode, // Optional debug mode
}: UseThreeGradientMapProps) {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<
    THREE.ShaderMaterial | THREE.MeshBasicMaterial | null
  >(null);
  const textureRef = useRef<THREE.Texture | THREE.VideoTexture | null>(null); // Allow VideoTexture type
  const animationFrameIdRef = useRef<number | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  // Add state to track theme changes (already existed, but now more relevant)
  const { theme, resolvedTheme } = useTheme(); // Use next-themes hook

  // Process the input colors based on the current theme
  const getCurrentColors = useCallback((): string[] => {
    // Detect if we're in an iframe environment
    const isIframe = typeof window !== "undefined" && window !== window.top;
    
    // Auto-enable debug mode in iframe environments or when explicitly requested
    const isDebugMode = debugMode !== undefined ? debugMode : isIframe;

    // Try multiple sources to determine the current theme
    const currentTheme =
      resolvedTheme ||
      theme ||
      (typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
        ? "dark"
        : "light");
    const isDarkTheme = currentTheme === "dark";
    let selectedColorSet = isDarkTheme ? darkColors : lightColors;

    if (isDebugMode) {
      console.log(
        `[getCurrentColors] Environment: ${
          isIframe ? "iframe" : "normal"
        }, Current theme: ${currentTheme}, resolvedTheme: ${resolvedTheme}, theme: ${theme}, isDark: ${isDarkTheme}`
      );
      console.log(`[getCurrentColors] Selected color set:`, selectedColorSet);
    }

    if (!selectedColorSet || selectedColorSet.length === 0) {
      // Fallback if specific theme colors aren't provided for the current theme
      // Or if neither lightColors nor darkColors are provided at all.
      if (isDebugMode) {
        console.log(`[getCurrentColors] Using fallback theme colors`);
      }
      selectedColorSet = getFallbackThemeColors(); // Use a generic fallback
    }

    const processedColors = selectedColorSet.map((color) =>
      processColor(color, isDarkTheme, isDebugMode)
    );
    if (isDebugMode) {
      console.log(`[getCurrentColors] Final processed colors:`, processedColors);
    }
    return processedColors;
  }, [lightColors, darkColors, resolvedTheme, theme, debugMode]);

  // Effect for Three.js Initialization, Animation Loop, Resize, Cleanup
  useEffect(() => {
    // Detect if we're in an iframe environment and enable debug logging accordingly
    const isIframe = typeof window !== "undefined" && window !== window.top;
    const isDebugMode = debugMode !== undefined ? debugMode : isIframe;
    
    if (isDebugMode) {
      console.log("useThreeGradientMap useEffect called");
    }
    
    // Capture mountRef.current at the start of the effect
    const currentMountNode = mountRef.current;

    // If the mount node isn't available yet, do nothing
    if (!currentMountNode) {
      if (isDebugMode) {
        console.warn("Mount point not available when effect ran.");
      }
      return;
    }

    let isMounted = true;
    let resizeListenerCleanup: (() => void) | null = null;
    let initTimeoutId: NodeJS.Timeout | null = null; // Added for cleanup

    // Add a function to wait for CSS variables to be available (mainly for iframe environments)
    const waitForCSSVars = async (
      maxAttempts: number = isIframe ? 10 : 3 // Less waiting for standalone apps
    ): Promise<boolean> => {
      // Skip waiting if no CSS variables are used in the color sets
      const hasCSSVars = [...(lightColors || []), ...(darkColors || [])].some(color => 
        typeof color === 'string' && color.startsWith('--')
      );
      
      if (!hasCSSVars) {
        if (isDebugMode) {
          console.log("[waitForCSSVars] No CSS variables detected, skipping wait");
        }
        return true;
      }

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (!isMounted) return false;

        try {
          const testVar = getComputedStyle(document.documentElement)
            .getPropertyValue("--background")
            .trim();
          if (testVar && testVar !== "") {
            if (isDebugMode) {
              console.log(
                `[waitForCSSVars] CSS variables available after ${attempt + 1} attempts`
              );
            }
            return true;
          }
        } catch (error) {
          if (isDebugMode) {
            console.warn(
              `[waitForCSSVars] Error checking CSS variables on attempt ${attempt + 1}:`,
              error
            );
          }
        }

        // Wait 100ms before next attempt (or less for standalone)
        await new Promise((resolve) => setTimeout(resolve, isIframe ? 100 : 50));
      }

      if (isDebugMode) {
        console.warn(
          `[waitForCSSVars] CSS variables not available after ${maxAttempts} attempts, continuing anyway`
        );
      }
      return false;
    };

    const initThree = async () => {
      // Check for media URL or uploaded image data
      if (!imageUrl && !videoUrl && !uploadedImageData) {
        console.warn("No media URL or uploaded image data provided.");
        return;
      }

      // Wait for CSS variables to be available
      await waitForCSSVars();

      try {
        // Use the captured mount node
        const mount = currentMountNode;

        // Scene, Camera, Renderer
        sceneRef.current = new THREE.Scene();
        cameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        cameraRef.current.position.z = 1; // Position camera

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true, // Needed for toDataURL
        });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.appendChild(renderer.domElement);
        rendererRef.current = renderer; // Store renderer instance

        // Process colors - use getCurrentColors which is theme-aware
        const processedColors = getCurrentColors();

        // Geometry
        const geometry = new THREE.PlaneGeometry(2, 2);

        // Texture
        const textureLoader = new THREE.TextureLoader();

        // Function to create and assign material (called after texture loads)
        const createAndAssignMaterial = (
          texture: THREE.Texture | THREE.VideoTexture
        ) => {
          if (!isMounted) return;

          texture.colorSpace = THREE.SRGBColorSpace; // Apply colorspace
          textureRef.current = texture; // Store texture

          let material: THREE.ShaderMaterial | THREE.MeshBasicMaterial;

          if (originalBackground) {
            // Use basic material if originalBackground is true
            material = new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true,
              depthTest: false, // Ensure it renders correctly without depth issues
              depthWrite: false,
            });
          } else {
            // Use shader material if originalBackground is false
            const initialGradientColors = processedColors.map(
              (hex) => new THREE.Color(hex)
            );
            const paddedColors = [...initialGradientColors];
            while (paddedColors.length < MAX_GRADIENT_COLORS) {
              paddedColors.push(new THREE.Color(0x000000)); // Pad with black
            }

            material = new THREE.ShaderMaterial({
              uniforms: {
                uTexture: { value: texture },
                uGradientColors: { value: paddedColors },
                uNumGradientColors: { value: initialGradientColors.length },
              },
              vertexShader: gradientMapVertexShader,
              fragmentShader: gradientMapFragmentShader,
              transparent: true,
              depthTest: false, // Ensure it renders correctly without depth issues
              depthWrite: false,
            });
          }

          materialRef.current = material; // Store the created material

          // Create mesh only *after* material is ready
          if (!sceneRef.current?.getObjectByName("gradientPlane")) {
            const planeMesh = new THREE.Mesh(geometry, material);
            planeMesh.name = "gradientPlane"; // Name for potential lookup
            sceneRef.current?.add(planeMesh);
          } else {
            // If mesh exists, update its material
            const existingMesh = sceneRef.current.getObjectByName(
              "gradientPlane"
            ) as THREE.Mesh;
            if (existingMesh) {
              existingMesh.material = material;
            }
          }
          if (material instanceof THREE.ShaderMaterial) {
            material.needsUpdate = true; // Ensure shader updates if needed
          }
        };

        // Handle different image sources
        if (videoUrl) {
          const video = document.createElement("video");
          video.crossOrigin = "anonymous";
          video.loop = true;
          video.muted = true; // Essential for autoplay
          video.playsInline = true;
          video.src = videoUrl;
          videoElementRef.current = video; // Store for cleanup

          video
            .play()
            .then(() => {
              const videoTexture = new THREE.VideoTexture(video);
              createAndAssignMaterial(videoTexture); // Create material with video texture
            })
            .catch((error) => {
              console.error("Error playing video:", error);
              // Fallback: if video fails, try loading imageUrl if available?
              // Or simply log error and do nothing further with texture
            });
        } else if (uploadedImageData) {
          // Handle uploaded image data (data URL)
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const texture = new THREE.Texture(img);
            texture.needsUpdate = true;
            createAndAssignMaterial(texture);
          };
          img.onerror = (error) => {
            console.error("Error loading uploaded image:", error);
          };
          img.src = uploadedImageData;
        } else if (imageUrl) {
          textureLoader.load(
            imageUrl,
            (loadedTexture: THREE.Texture) => {
              createAndAssignMaterial(loadedTexture); // Create material with image texture
            },
            undefined,
            (error: unknown) => {
              if (error instanceof ErrorEvent) {
                console.error(
                  "Error loading image texture (ErrorEvent):",
                  error.message
                );
              } else {
                console.error("Error loading image texture (unknown):", error);
              }
            }
          );
        } else {
          // This case should ideally be caught by the check at the start of initThree
          console.warn("No image or video URL provided for texture.");
        }

        // Render Loop
        const animate = () => {
          if (
            !rendererRef.current ||
            !sceneRef.current ||
            !cameraRef.current ||
            !isMounted
          )
            return;
          animationFrameIdRef.current = requestAnimationFrame(animate);
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        };
        animate();

        // Resize Handling
        const handleResize = () => {
          // Use captured node in resize handler
          if (!rendererRef.current || !cameraRef.current || !currentMountNode)
            return;
          const width = currentMountNode.clientWidth;
          const height = currentMountNode.clientHeight;
          rendererRef.current.setSize(width, height);
          // Ortho camera aspect ratio update (if needed, uncomment and adjust)
          // cameraRef.current.left = -width / height;
          // cameraRef.current.right = width / height;
          // cameraRef.current.top = 1;
          // cameraRef.current.bottom = -1;
          // cameraRef.current.updateProjectionMatrix();
        };
        window.addEventListener("resize", handleResize);
        resizeListenerCleanup = () =>
          window.removeEventListener("resize", handleResize);

        // Initial size calculation after setup
        handleResize();
      } catch (error) {
        console.error("Error initializing Three.js:", error);
      }
    };

    if (isMounted) {
      // Delay initialization slightly to allow layout calculation
      initTimeoutId = setTimeout(async () => {
        if (isMounted) {
          // Check again in case unmounted during delay
          await initThree();
        }
      }, 100); // 100ms delay
    }

    // Cleanup
    return () => {
      isMounted = false;
      if (initTimeoutId) clearTimeout(initTimeoutId); // Clear timeout
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
      if (resizeListenerCleanup) resizeListenerCleanup();

      // Use the initially captured currentMountNode for cleanup consistency
      const mountNode = currentMountNode;

      // Cleanup video element if it exists
      if (videoElementRef.current) {
        videoElementRef.current.pause();
        videoElementRef.current.removeAttribute("src");
        videoElementRef.current.load();
        videoElementRef.current = null;
      }

      textureRef.current?.dispose();
      materialRef.current?.dispose();
      sceneRef.current?.traverse((object) => {
        if (object instanceof THREE.Mesh && object.geometry) {
          object.geometry.dispose();
        }
      });
      if (rendererRef.current) {
        rendererRef.current.dispose();
        try {
          // Use the captured node for removing the canvas
          if (mountNode && rendererRef.current.domElement) {
            mountNode.removeChild(rendererRef.current.domElement);
          }
        } catch (e) {
          /* Ignore potential error during cleanup */
        }
      }
      // Clear refs
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      materialRef.current = null;
      textureRef.current = null;
    };
    // Rerun effect if mountRef, imageUrl, videoUrl, lightColors, darkColors, uploadedImageData, or theme changes
  }, [
    mountRef,
    imageUrl,
    videoUrl,
    lightColors,
    darkColors,
    resolvedTheme,
    theme,
    originalBackground, // Rerun if originalBackground changes
    uploadedImageData, // Add uploadedImageData to dependency array
    debugMode, // Add debugMode to dependency array
    getCurrentColors, // Added memoized function to dependency array
  ]);

  // Effect to watch for theme color changes via MutationObserver (kept for CSS var changes)
  // This can be a secondary mechanism if direct CSS vars are changed without a theme switch event
  const [cssVarVersion, setCssVarVersion] = useState<number>(0);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateCssVars = () => setCssVarVersion((prev) => prev + 1);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          updateCssVars();
          break;
        }
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
    return () => observer.disconnect();
  }, []);

  // Effect to update shader uniforms when theme colors (from props or theme switch) or CSS vars change
  useEffect(() => {
    // Only update shader uniforms if the material is a ShaderMaterial
    if (materialRef.current instanceof THREE.ShaderMaterial) {
      console.log("Updating shader uniforms");
      // Get current theme-aware colors
      const processedColors = getCurrentColors();

      const newThreeColors = processedColors.map((hex) => new THREE.Color(hex));
      const paddedColors = [...newThreeColors];
      while (paddedColors.length < MAX_GRADIENT_COLORS) {
        paddedColors.push(new THREE.Color(0x000000)); // Pad with black
      }

      materialRef.current.uniforms.uGradientColors.value = paddedColors;
      materialRef.current.uniforms.uNumGradientColors.value =
        newThreeColors.length;
      materialRef.current.needsUpdate = true;
    }
  }, [
    getCurrentColors,
    lightColors,
    darkColors,
    resolvedTheme,
    theme,
    cssVarVersion,
    originalBackground, // Rerun if originalBackground changes
  ]); // Update when theme, colors, or originalBackground change

  // Download function
  const downloadImage = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
      console.error("Renderer/Scene/Camera not available for download.");
      return;
    }
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const canvas = renderer.domElement;

    try {
      // Force a render before capturing
      renderer.render(scene, camera);

      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "gradient-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating image for download:", error);
    }
  };

  return { downloadImage };
}
