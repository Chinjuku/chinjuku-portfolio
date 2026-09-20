import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

export interface ForceFieldBackgroundProps {
  /**
   * URL of the image to use as the base for the particle field
   * @default "/cosmic-nebula.jpg"
   */
  imageUrl?: string;
  /**
   * Base hue for the color palette (0-360)
   * @default 260 (Nebula violet/cyan)
   */
  hue?: number;
  /**
   * Color saturation (0-100)
   * @default 90
   */
  saturation?: number;
  /**
   * Brightness threshold for particle visibility (0-255)
   * @default 255
   */
  threshold?: number;
  /**
   * Minimum stroke weight for particles
   * @default 1.5
   */
  minStroke?: number;
  /**
   * Maximum stroke weight for particles
   * @default 5.5
   */
  maxStroke?: number;
  /**
   * Spacing between particles (lower = more density)
   * @default 11
   */
  spacing?: number;
  /**
   * Noise scale for particle placement irregularity
   * @default 0
   */
  noiseScale?: number;
  /**
   * Density factor (probability of particle existence)
   * @default 2.0
   */
  density?: number;
  /**
   * Invert the source image brightness mapping
   * @default false (for space, stars and nebula are naturally bright)
   */
  invertImage?: boolean;
  /**
   * Invert the wireframe/particle visibility condition
   * @default true
   */
  invertWireframe?: boolean;
  /**
   * Enable the magnifier/force field effect
   * @default true
   */
  magnifierEnabled?: boolean;
  /**
   * Radius of the force field effect around the cursor
   * @default 160
   */
  magnifierRadius?: number;
  /**
   * Strength of the force pushing particles away
   * @default 12
   */
  forceStrength?: number;
  /**
   * Friction factor for particle movement (0-1)
   * @default 0.9
   */
  friction?: number;
  /**
   * Speed at which particles return to original position
   * @default 0.05
   */
  restoreSpeed?: number;
  /**
   * Whether dark mode is active (adjusts particle palette lightness for contrast)
   * @default true
   */
  isDark?: boolean;
  /**
   * Callback invoked periodically to report actual real-time FPS and point count
   */
  onStatsUpdate?: (stats: { fps: number; pointCount: number }) => void;
  /**
   * Additional CSS class names
   */
  className?: string;
}

export const ForceFieldBackground: React.FC<ForceFieldBackgroundProps> = ({
  imageUrl = "/cosmic-nebula.jpg",
  hue = 260,
  saturation = 90,
  threshold = 255,
  minStroke = 1.0,
  maxStroke = 4.2,
  spacing = 13,
  noiseScale = 0,
  density = 2.0,
  invertImage = false,
  invertWireframe = true,
  magnifierEnabled = true,
  magnifierRadius = 160,
  forceStrength = 12,
  friction = 0.9,
  restoreSpeed = 0.05,
  isDark = true,
  onStatsUpdate,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep latest props in ref to access inside p5 closure without re-instantiating
  const propsRef = useRef({
    hue, saturation, threshold, minStroke, maxStroke, spacing, noiseScale,
    density, invertImage, invertWireframe, magnifierEnabled, magnifierRadius,
    forceStrength, friction, restoreSpeed, isDark, onStatsUpdate
  });

  useEffect(() => {
    propsRef.current = {
      hue, saturation, threshold, minStroke, maxStroke, spacing, noiseScale,
      density, invertImage, invertWireframe, magnifierEnabled, magnifierRadius,
      forceStrength, friction, restoreSpeed, isDark, onStatsUpdate
    };
  }, [hue, saturation, threshold, minStroke, maxStroke, spacing, noiseScale, density, invertImage, invertWireframe, magnifierEnabled, magnifierRadius, forceStrength, friction, restoreSpeed, isDark, onStatsUpdate]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }

    const sketch = (p: p5) => {
      let originalImg: p5.Image;
      let img: p5.Image;
      let palette: p5.Color[] = [];
      let points: {
        pos: p5.Vector;
        originalPos: p5.Vector;
        vel: p5.Vector;
      }[] = [];

      let lastHue = -1;
      let lastSaturation = -1;
      let lastSpacing = -1;
      let lastNoiseScale = -1;
      let lastDensity = -1;
      let lastIsDark: boolean | null = null;
      let lastInvertImage: boolean | null = null;
      let magnifierX = 0;
      let magnifierY = 0;
      const magnifierInertia = 0.12;

      p.setup = async () => {
        if (!containerRef.current) return;
        const w = containerRef.current.clientWidth || window.innerWidth;
        const h = containerRef.current.clientHeight || window.innerHeight;

        p.createCanvas(w, h);
        p.pixelDensity(1);
        p.frameRate(60);

        magnifierX = p.width / 2;
        magnifierY = p.height / 2;

        try {
          const loadPromise = new Promise<p5.Image>((resolve, reject) => {
            p.loadImage(
              imageUrl,
              (loaded) => resolve(loaded),
              (err) => reject(err)
            );
          });
          originalImg = await loadPromise;
          setIsLoading(false);
          processImage();
          generatePalette(propsRef.current.hue, propsRef.current.saturation, propsRef.current.isDark);
          generatePoints();
        } catch (err) {
          console.error("Failed to load space background image", err);
          setError("Failed to load cosmic canvas");
          setIsLoading(false);
        }
      };

      p.windowResized = () => {
        if (!containerRef.current || !originalImg) return;
        const w = containerRef.current.clientWidth || window.innerWidth;
        const h = containerRef.current.clientHeight || window.innerHeight;
        p.resizeCanvas(w, h);
        processImage();
        generatePoints();
      };

      function processImage() {
        if (!originalImg) return;
        img = originalImg.get();
        if (p.width > 0 && p.height > 0) {
          img.resize(p.width, p.height);
        }
        img.filter(p.GRAY);

        if (propsRef.current.invertImage) {
          img.loadPixels();
          for (let i = 0; i < img.pixels.length; i += 4) {
            img.pixels[i] = 255 - img.pixels[i];
            img.pixels[i + 1] = 255 - img.pixels[i + 1];
            img.pixels[i + 2] = 255 - img.pixels[i + 2];
          }
          img.updatePixels();
        }
        // Cache pixels in memory once so draw() doesn't reload buffer every frame
        img.loadPixels();
        lastInvertImage = propsRef.current.invertImage;
      }

      function generatePalette(h: number, s: number, isDark = true) {
        palette = [];
        p.push();
        // Explicitly declare HSL ranges with 0.0 - 1.0 alpha range
        p.colorMode(p.HSL, 360, 100, 100, 1);
        // In dark mode: softer starlight luminescence (alpha 0.55) so dots never compete with typography
        // In light mode: gentle muted cosmic dust (alpha 0.28) for maximum reading comfort
        const alpha = isDark ? 0.55 : 0.28;
        for (let i = 0; i < 12; i++) {
          const lightness = isDark
            ? p.map(i, 0, 11, 94, 20)
            : p.map(i, 0, 11, 28, 64);
          const saturation = isDark ? s : Math.min(s, 70);
          palette.push(p.color(h, saturation, lightness, alpha));
        }
        p.pop();
        lastIsDark = isDark;
      }

      function generatePoints() {
        if (!img) return;
        points = [];
        const { spacing, density, noiseScale } = propsRef.current;
        // Cap point count dynamically so high-resolution / Retina screens don't exceed ~4,200 points
        const targetMaxPoints = 4200;
        const autoMinSpacing = Math.ceil(Math.sqrt((img.width * img.height) / targetMaxPoints));
        const safeSpacing = Math.max(spacing, autoMinSpacing, 8);

        for (let y = 0; y < img.height; y += safeSpacing) {
          for (let x = 0; x < img.width; x += safeSpacing) {
            if (p.random() > density) continue;

            let nx = 0;
            let ny = 0;
            if (noiseScale > 0) {
              nx = p.noise(x * noiseScale, y * noiseScale) - 0.5;
              ny = p.noise((x + 500) * noiseScale, (y + 500) * noiseScale) - 0.5;
            }

            const px = x + nx * safeSpacing;
            const py = y + ny * safeSpacing;

            points.push({
              pos: p.createVector(px, py),
              originalPos: p.createVector(px, py),
              vel: p.createVector(0, 0),
            });
          }
        }

        lastSpacing = spacing;
        lastNoiseScale = noiseScale;
        lastDensity = density;

        propsRef.current.onStatsUpdate?.({
          fps: Math.round(p.frameRate()) || 60,
          pointCount: points.length,
        });
      }

      function applyForceField(mx: number, my: number) {
        const props = propsRef.current;
        if (!props.magnifierEnabled) return;

        const target = p.createVector(mx, my);

        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          const dir = p5.Vector.sub(pt.pos, target);
          const d = dir.mag();

          if (d < props.magnifierRadius) {
            dir.normalize();
            // Inverse distance repulsion
            const force = dir.mult(props.forceStrength / Math.max(1, d * 0.15));
            pt.vel.add(force);
          }

          pt.vel.mult(props.friction);
          const restore = p5.Vector.sub(pt.pos, pt.originalPos).mult(-props.restoreSpeed);
          pt.vel.add(restore);
          pt.pos.add(pt.vel);
        }
      }

      p.draw = () => {
        if (!img) return;
        p.clear(); // Transparent background allowing underlying cosmic nebula space backdrop to show through

        const props = propsRef.current;

        if (props.hue !== lastHue || props.saturation !== lastSaturation || props.isDark !== lastIsDark) {
          generatePalette(props.hue, props.saturation, props.isDark);
          lastHue = props.hue;
          lastSaturation = props.saturation;
        }

        if (props.invertImage !== lastInvertImage) {
          processImage();
        }

        if (props.spacing !== lastSpacing || props.noiseScale !== lastNoiseScale || props.density !== lastDensity) {
          generatePoints();
        }

        // Periodically report live telemetry stats
        if (p.frameCount % 20 === 0 && props.onStatsUpdate) {
          props.onStatsUpdate({
            fps: Math.round(p.frameRate()) || 60,
            pointCount: points.length,
          });
        }

        // Support mouse and touch pointer
        let targetX = p.mouseX;
        let targetY = p.mouseY;

        // If touch event is active on canvas
        const touches = p.touches as { x: number; y: number }[];
        if (touches && touches.length > 0) {
          targetX = touches[0].x;
          targetY = touches[0].y;
        }

        // Smooth follower
        magnifierX = p.lerp(magnifierX, targetX, magnifierInertia);
        magnifierY = p.lerp(magnifierY, targetY, magnifierInertia);

        applyForceField(magnifierX, magnifierY);

        p.noFill();

        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          const x = pt.pos.x;
          const y = pt.pos.y;
          const d = p.dist(x, y, magnifierX, magnifierY);

          const px = p.constrain(Math.floor(x), 0, img.width - 1);
          const py = p.constrain(Math.floor(y), 0, img.height - 1);

          const index = (px + py * img.width) * 4;
          const brightness = img.pixels[index];

          if (brightness === undefined) continue;

          const condition = props.invertWireframe
            ? brightness < props.threshold
            : brightness > props.threshold;

          if (condition) {
            let shadeIndex = Math.floor(p.map(brightness, 0, 255, 0, palette.length - 1));
            shadeIndex = p.constrain(shadeIndex, 0, palette.length - 1);

            let strokeSize = p.map(brightness, 0, 255, props.minStroke, props.maxStroke);

            if (props.magnifierEnabled && d < props.magnifierRadius) {
              const factor = p.map(d, 0, props.magnifierRadius, 2.2, 1);
              strokeSize *= factor;
            }

            if (palette[shadeIndex]) {
              p.stroke(palette[shadeIndex]);
              p.strokeWeight(strokeSize);
              p.point(x, y);
            }
          }
        }
      };
    };

    const myP5 = new p5(sketch, containerRef.current);
    p5InstanceRef.current = myP5;

    return () => {
      myP5.remove();
    };
  }, [imageUrl]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      ref={containerRef}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-white/40 text-xs tracking-widest uppercase font-mono animate-pulse">
          Generating Cosmic Force Field...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400/60 text-xs tracking-widest uppercase font-mono">
          {error}
        </div>
      )}
    </div>
  );
};

export default ForceFieldBackground;
