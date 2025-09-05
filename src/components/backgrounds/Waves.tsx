/**
 * @description Professional wave animation background for modern web applications. Built with Canvas API and TypeScript. Features smooth flowing effects, customizable patterns, and performance optimization. Perfect for landing pages, app backgrounds, and creative sections. Free to use in NextBunny's builder. Enhance visual appeal with dynamic wave animations.
 * @category Background
 * @subcategory Wavy
 */
"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { createNoise3D } from "simplex-noise";

const defaultControls = {
  className: "",
  colors: ["--primary", "--secondary", "--muted", "--accent"],
  waveWidth: 50,
  blur: 10,
  speed: 0.001,
  waveOpacity: 0.5,
  wavePosition: 0.7,
};

// Define prop types including optional controls
type WavesProps = {
  // Revert prop type to reference local defaults
  controls?: Partial<typeof defaultControls>;
};

export default function Waves({ controls: userControls }: WavesProps) {
  const controls = { ...defaultControls, ...userControls };
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const wRef = useRef<number>(0);
  const hRef = useRef<number>(0);
  const ntRef = useRef<number>(0);
  let i: number, x: number;
  let animationId: number = 0;

  // Add ref for observer
  const observerRef = useRef<ResizeObserver | null>(null);

  const render = () => {
    const ctx = ctxRef.current;
    const w = wRef.current;
    const h = hRef.current;

    if (!ctx) return;

    ctx.globalAlpha = 1;
    ctx.fillStyle = `hsl(${getColorValue("background")})`;
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = controls.waveOpacity || 0.5;
    drawWave(5);
    animationId = requestAnimationFrame(render);
  };

  // Add function to update canvas dimensions
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const container = canvas?.parentElement;

    if (!canvas || !ctx || !container) return;

    const newWidth = container.offsetWidth;
    const newHeight = container.offsetHeight;

    // Only update if dimensions actually changed
    if (wRef.current !== newWidth || hRef.current !== newHeight) {
      wRef.current = ctx.canvas.width = newWidth;
      hRef.current = ctx.canvas.height = newHeight;
      ctx.filter = `blur(${controls.blur}px)`;
    }
  }, [controls.blur]);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const container = canvas.parentElement;
    if (!ctx || !container) return;

    ctxRef.current = ctx;
    wRef.current = ctx.canvas.width = container.offsetWidth;
    hRef.current = ctx.canvas.height = container.offsetHeight;
    ctx.filter = `blur(${controls.blur}px)`;
    ntRef.current = 0;

    // Create and use ResizeObserver instead of window.onresize
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new ResizeObserver(() => {
      updateCanvasDimensions();
    });

    if (container) {
      observerRef.current.observe(container);
    }

    // Keep window.onresize as a fallback
    window.addEventListener("resize", updateCanvasDimensions);

    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls.blur]);

  const getColorValue = (cssVar: string) => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const cleanVar = cssVar.replace("--", "");
    return computedStyle.getPropertyValue(`--${cleanVar}`).trim();
  };

  const drawWave = (n: number) => {
    const ctx = ctxRef.current;
    const w = wRef.current;
    const h = hRef.current;

    if (!ctx) return;

    ntRef.current += controls.speed;

    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = controls.waveWidth || 50;
      const colorVar = controls.colors[i % controls.colors.length];
      ctx.strokeStyle = colorVar.startsWith("#")
        ? colorVar
        : `hsl(${getColorValue(colorVar)})`;
      for (x = 0; x < w; x += 5) {
        const y = noise(x / 800, 0.3 * i, ntRef.current) * 100;
        ctx.lineTo(x, y + h * controls.wavePosition);
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  useEffect(() => {
    init();
    // Force immediate update after mounting
    setTimeout(updateCanvasDimensions, 50);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener("resize", updateCanvasDimensions);
    };
  }, [init, updateCanvasDimensions]);

  // Add useEffect to force dimension updates if parent container changes
  useEffect(() => {
    // This effect will run when the component rerenders
    // Use setTimeout to ensure DOM has updated
    const timer = setTimeout(updateCanvasDimensions, 0);
    return () => clearTimeout(timer);
  });

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // I'm sorry but i have got to support it on safari.
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 -z-10  w-full h-full flex flex-col items-center justify-center overflow-hidden",
        controls.className
      )}
    >
      <canvas
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${controls.blur}px)` } : {}),
        }}
      ></canvas>
    </div>
  );
}
