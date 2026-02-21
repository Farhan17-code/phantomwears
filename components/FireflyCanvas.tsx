
import React, { useEffect, useRef } from 'react';

const FireflyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fireflies: any[] = [];
    const count = 40;

    class Firefly {
      x = Math.random() * width;
      y = Math.random() * height;
      s = Math.random() * 2;
      ang = Math.random() * 2 * Math.PI;
      v = (Math.random() + 0.5) * 0.5;
      opacity = Math.random();
      fadeOut = Math.random() > 0.5;

      update() {
        this.x += Math.cos(this.ang) * this.v;
        this.y += Math.sin(this.ang) * this.v;
        this.ang += (Math.random() - 0.5) * 0.1;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        if (this.fadeOut) {
          this.opacity -= 0.005;
          if (this.opacity <= 0.1) this.fadeOut = false;
        } else {
          this.opacity += 0.005;
          if (this.opacity >= 0.8) this.fadeOut = true;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        ctx.fill();
      }
    }

    for (let i = 0; i < count; i++) {
      fireflies.push(new Firefly());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      fireflies.forEach(f => {
        f.update();
        f.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
};

export default FireflyCanvas;
