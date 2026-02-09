"use client";

import { useRef, useEffect, useCallback } from "react";

const SCALE = 3;
const DAMPING = 0.992;
const GOLD_R = 201;
const GOLD_G = 168;
const GOLD_B = 76;

export default function GoldRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buf1Ref = useRef<Float32Array | null>(null);
  const buf2Ref = useRef<Float32Array | null>(null);
  const dimsRef = useRef({ w: 0, h: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const addDrop = useCallback((gx: number, gy: number, strength: number) => {
    const buf = buf1Ref.current;
    const { w, h } = dimsRef.current;
    if (!buf) return;
    const radius = 8;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const px = gx + dx;
        const py = gy + dy;
        if (px < 1 || px >= w - 1 || py < 1 || py >= h - 1) continue;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= radius) {
          buf[py * w + px] += strength * (1 - dist / radius);
        }
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const w = Math.ceil(window.innerWidth / SCALE);
      const h = Math.ceil(window.innerHeight / SCALE);
      canvas.width = w;
      canvas.height = h;
      dimsRef.current = { w, h };
      buf1Ref.current = new Float32Array(w * h);
      buf2Ref.current = new Float32Array(w * h);
    };

    resize();
    window.addEventListener("resize", resize);

    const imageData = ctx.createImageData(canvas.width, canvas.height);

    const step = () => {
      const buf1 = buf1Ref.current;
      const buf2 = buf2Ref.current;
      const { w, h } = dimsRef.current;
      if (!buf1 || !buf2) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      // Recreate imageData if canvas resized
      const img =
        imageData.width === w && imageData.height === h
          ? imageData
          : ctx.createImageData(w, h);
      const data = img.data;

      // Ripple simulation
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          buf2[i] =
            (buf1[i - 1] + buf1[i + 1] + buf1[i - w] + buf1[i + w]) / 2 -
            buf2[i];
          buf2[i] *= DAMPING;
        }
      }

      // Render
      for (let i = 0; i < w * h; i++) {
        const v = Math.abs(buf2[i]) / 200;
        const pi = i * 4;
        data[pi] = Math.min(255, v * GOLD_R * 0.6) | 0;
        data[pi + 1] = Math.min(255, v * GOLD_G * 0.5) | 0;
        data[pi + 2] = Math.min(255, v * GOLD_B * 0.3) | 0;
        data[pi + 3] = 255;
      }

      ctx.putImageData(img, 0, 0);

      // Swap buffers
      buf1Ref.current = buf2;
      buf2Ref.current = buf1;

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const { w, h } = dimsRef.current;
      const gx = Math.floor((e.clientX / window.innerWidth) * w);
      const gy = Math.floor((e.clientY / window.innerHeight) * h);

      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      const strength = Math.min(300, 50 + velocity * 3);

      addDrop(gx, gy, strength);

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = (e: MouseEvent) => {
      const { w, h } = dimsRef.current;
      const gx = Math.floor((e.clientX / window.innerWidth) * w);
      const gy = Math.floor((e.clientY / window.innerHeight) * h);
      addDrop(gx, gy, 700);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
    };
  }, [addDrop]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ imageRendering: "auto" }}
    />
  );
}
