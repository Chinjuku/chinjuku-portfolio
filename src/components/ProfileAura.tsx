import React, { useEffect, useRef } from 'react';

interface ProfileAuraProps {
  isDark?: boolean;
  className?: string;
}

export const ProfileAura: React.FC<ProfileAuraProps> = ({
  isDark = true,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = 620);
    let height = (canvas.height = 620);
    const cx = width / 2;
    const cy = height / 2;

    const innerRadius = 140; // Just outside the avatar border
    const outerRadius = 290; // Fade out radius

    // Create radial aura dots
    const particleCount = 140;
    interface AuraDot {
      angle: number;
      distance: number;
      speed: number;
      spinSpeed: number;
      baseSize: number;
      hue: number; // 0 = Cyan, 1 = Purple/Indigo, 2 = White/Starlight
      pulsePhase: number;
    }

    const dots: AuraDot[] = [];
    for (let i = 0; i < particleCount; i++) {
      dots.push({
        angle: Math.random() * Math.PI * 2,
        distance: innerRadius + Math.random() * (outerRadius - innerRadius),
        speed: 0.35 + Math.random() * 0.7,
        spinSpeed: (Math.random() - 0.5) * 0.004,
        baseSize: 1.5 + Math.random() * 2.5,
        hue: Math.random() < 0.45 ? 0 : Math.random() < 0.8 ? 1 : 2,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let isHovered = false;
    let hoverEnergy = 0;

    const handleMouseEnter = () => {
      isHovered = true;
    };
    const handleMouseLeave = () => {
      isHovered = false;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth hover energy transition
      if (isHovered) {
        hoverEnergy = Math.min(1, hoverEnergy + 0.05);
      } else {
        hoverEnergy = Math.max(0, hoverEnergy - 0.03);
      }

      // Draw glowing radial gradient backing underneath dots
      const radialGlow = ctx.createRadialGradient(cx, cy, innerRadius * 0.7, cx, cy, outerRadius);
      if (isDark) {
        radialGlow.addColorStop(0, `rgba(139, 92, 246, ${0.18 + hoverEnergy * 0.12})`);
        radialGlow.addColorStop(0.4, `rgba(6, 182, 212, ${0.12 + hoverEnergy * 0.08})`);
        radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        radialGlow.addColorStop(0, `rgba(124, 58, 237, ${0.12 + hoverEnergy * 0.08})`);
        radialGlow.addColorStop(0.4, `rgba(79, 70, 229, ${0.08 + hoverEnergy * 0.06})`);
        radialGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
      ctx.fill();

      // Update & draw each aura dot
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Move outward and subtly spin
        dot.distance += dot.speed * (1 + hoverEnergy * 0.8);
        dot.angle += dot.spinSpeed;
        dot.pulsePhase += 0.04;

        // Reset if reached outer limit
        if (dot.distance > outerRadius) {
          dot.distance = innerRadius + Math.random() * 8;
          dot.angle = Math.random() * Math.PI * 2;
          dot.speed = 0.35 + Math.random() * 0.7;
        }

        // Calculate progress from inner to outer radius (0 = closest to avatar, 1 = outer boundary)
        const progress = (dot.distance - innerRadius) / (outerRadius - innerRadius);

        // Core requested behavior: "จากเข้มๆ แล้วจางลงมารอบนอก"
        // Close to avatar border: intense opacity (up to 0.95), fading with power curve to 0 at outer radius
        const fadeOut = Math.pow(Math.max(0, 1 - progress), 1.6);
        const pulse = 0.85 + Math.sin(dot.pulsePhase) * 0.15;
        const alpha = Math.min(1, Math.max(0, fadeOut * pulse * (isDark ? 0.95 : 0.85) * (1 + hoverEnergy * 0.3)));

        // Dots shrink as they disperse outwards
        const currentSize = Math.max(0.8, dot.baseSize * (1 - progress * 0.5) * (1 + hoverEnergy * 0.2));

        const x = cx + Math.cos(dot.angle) * dot.distance;
        const y = cy + Math.sin(dot.angle) * dot.distance;

        // Determine color based on hue type and current theme
        let dotColor: string;
        if (isDark) {
          if (dot.hue === 0) {
            dotColor = `rgba(6, 182, 212, ${alpha})`; // Starlight Cyan
          } else if (dot.hue === 1) {
            dotColor = `rgba(139, 92, 246, ${alpha})`; // Nebula Violet
          } else {
            dotColor = `rgba(240, 249, 255, ${alpha * 0.9})`; // Brilliant Star White
          }
        } else {
          if (dot.hue === 0) {
            dotColor = `rgba(8, 145, 178, ${alpha})`; // Deep Cyan
          } else if (dot.hue === 1) {
            dotColor = `rgba(109, 40, 217, ${alpha})`; // Royal Purple
          } else {
            dotColor = `rgba(67, 56, 202, ${alpha * 0.9})`; // Indigo
          }
        }

        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(x, y, currentSize, 0, Math.PI * 2);
        ctx.fill();

        // Add soft glow halo to the densest particles near the avatar
        if (progress < 0.25 && isDark) {
          ctx.fillStyle = dot.hue === 0
            ? `rgba(6, 182, 212, ${alpha * 0.3})`
            : `rgba(139, 92, 246, ${alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(x, y, currentSize * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      if (parent) {
        parent.removeEventListener('mouseenter', handleMouseEnter);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 ${className}`}
      style={{ width: '620px', height: '620px', maxWidth: '160%', maxHeight: '160%' }}
    />
  );
};

export default ProfileAura;
