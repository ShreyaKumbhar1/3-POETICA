import React, { useEffect, useRef } from 'react';
import { useAtmosphere } from '../../context/AtmosphereContext';

export default function AtmosphericCanvas() {
  const bgCanvasRef = useRef(null);

  const {
    atmosphere = 'sakura',
    timeOfDay = 'golden',
    reducedMotion = false,
    ambientParticle = 'auto',
    petalIntensity = 'medium',
    windStrength = 'medium',
    breezeLevel = 'medium',
    breezeTrigger = 0,
    mousePosRef
  } = useAtmosphere();

  // User interactive breeze boost (smooth decaying impulse)
  const breezeBoostRef = useRef(0);

  useEffect(() => {
    if (breezeTrigger > 0) {
      breezeBoostRef.current = Math.min(breezeBoostRef.current + 2.8, 5.0);
    }
  }, [breezeTrigger]);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Parallax tracking (smooth lerp)
    let curMouseX = 0;
    let curMouseY = 0;

    const isMobile = width < 768;

    // Determine active environmental simulation
    let effectiveScene = 'sakura';
    if (ambientParticle && ambientParticle !== 'auto') {
      if (ambientParticle === 'rain') effectiveScene = 'rain';
      else if (ambientParticle === 'snow') effectiveScene = 'winter';
      else if (ambientParticle === 'stars') effectiveScene = 'night';
      else if (ambientParticle === 'leaves') effectiveScene = 'autumn';
      else if (ambientParticle === 'none') effectiveScene = 'none';
      else effectiveScene = 'sakura';
    } else {
      if (atmosphere === 'rain') effectiveScene = 'rain';
      else if (atmosphere === 'night') effectiveScene = 'night';
      else if (atmosphere === 'winter') effectiveScene = 'winter';
      else if (atmosphere === 'autumn') effectiveScene = 'autumn';
      else if (atmosphere === 'forest') effectiveScene = 'forest';
      else if (atmosphere === 'ocean') effectiveScene = 'ocean';
      else if (atmosphere === 'mountain') effectiveScene = 'mountain';
      else if (atmosphere === 'spring') effectiveScene = 'spring';
      else if (atmosphere === 'sunrise') effectiveScene = 'sunrise';
      else if (atmosphere === 'minimal') effectiveScene = 'minimal';
      else effectiveScene = 'sakura'; // 'sakura', 'auto', fallback
    }

    // Particle multipliers
    const intensityMult = petalIntensity === 'high' ? 1.5 : petalIntensity === 'low' ? 0.55 : 1.0;
    // Responsive wind multiplier: Low (gentle/slow 0.45x), Medium (1.0x), High (strong drift 2.4x)
    const windMult = windStrength === 'high' ? 2.4 : windStrength === 'low' ? 0.45 : 1.0;
    // Ambient breeze sway and gust scaling: Off (0x), Low (0.55x), Medium (1.0x), High (1.75x)
    const breezeMult = breezeLevel === 'off' ? 0 : breezeLevel === 'low' ? 0.55 : breezeLevel === 'high' ? 1.75 : 1.0;

    // -----------------------------------------------------------------
    // 1. SAKURA PETAL CLASS (Authentic Notched Shape + 3D Tumble + Wind)
    // -----------------------------------------------------------------
    class SakuraPetal {
      constructor(preDistribute = true) {
        const randTier = Math.random();
        if (randTier < 0.35) {
          this.tier = 0; // Far
        } else if (randTier < 0.82) {
          this.tier = 1; // Mid
        } else {
          this.tier = 2; // Near / Foreground
        }
        this.init(preDistribute);
      }

      init(preDistribute = false) {
        if (preDistribute) {
          this.x = Math.random() * (width + 160) - 80;
          this.y = Math.random() * (height + 160) - 80;
        } else {
          if (Math.random() > 0.4) {
            this.x = -60 - Math.random() * 80;
            this.y = Math.random() * (height * 0.9) - 40;
          } else {
            this.x = Math.random() * (width * 0.75) - 60;
            this.y = -60 - Math.random() * 40;
          }
        }

        if (this.tier === 0) {
          this.baseSize = Math.random() * 4 + 6;
          this.speedX = Math.random() * 1.5 + 1.2;
          this.speedY = Math.random() * 1.0 + 0.8;
          this.opacity = Math.random() * 0.25 + 0.50;
          this.depth = 0.3;
        } else if (this.tier === 1) {
          this.baseSize = Math.random() * 6 + 11;
          this.speedX = Math.random() * 2.2 + 2.0;
          this.speedY = Math.random() * 1.4 + 1.2;
          this.opacity = Math.random() * 0.25 + 0.75;
          this.depth = 0.65;
        } else {
          this.baseSize = Math.random() * 10 + 20;
          this.speedX = Math.random() * 3.2 + 3.0;
          this.speedY = Math.random() * 2.0 + 1.6;
          this.opacity = Math.random() * 0.20 + 0.80;
          this.depth = 1.0;
        }

        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.045;

        this.flip = Math.random() * Math.PI * 2;
        this.flipSpeed = Math.random() * 0.045 + 0.025;

        this.sway = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.03 + 0.018;
        this.swayAmp = Math.random() * 1.6 + 0.8;

        const colorPicker = Math.random();
        if (timeOfDay === 'night' || atmosphere === 'night') {
          this.color = colorPicker > 0.5
            ? `rgba(230, 215, 250, ${this.opacity})`
            : `rgba(210, 190, 240, ${this.opacity * 0.88})`;
          this.innerHighlight = 'rgba(255, 255, 255, 0.4)';
          this.underside = 'rgba(150, 110, 185, 0.3)';
        } else if (timeOfDay === 'sunset') {
          this.color = colorPicker > 0.6
            ? `rgba(255, 195, 215, ${this.opacity})`
            : colorPicker > 0.3
            ? `rgba(255, 175, 198, ${this.opacity})`
            : `rgba(250, 215, 225, ${this.opacity})`;
          this.innerHighlight = 'rgba(255, 240, 245, 0.5)';
          this.underside = 'rgba(210, 115, 145, 0.35)';
        } else {
          this.color = colorPicker > 0.65
            ? `rgba(255, 205, 222, ${this.opacity})`
            : colorPicker > 0.3
            ? `rgba(255, 180, 205, ${this.opacity})`
            : `rgba(255, 228, 238, ${this.opacity})`;
          this.innerHighlight = 'rgba(255, 255, 255, 0.55)';
          this.underside = 'rgba(220, 125, 160, 0.35)';
        }
      }

      update(totalGust, gustSwirl) {
        if (reducedMotion) {
          this.x += this.speedX * 0.25;
          this.y += this.speedY * 0.2;
          if (this.x > width + 50 || this.y > height + 50) this.init(false);
          return;
        }

        this.sway += this.swaySpeed;
        this.flip += this.flipSpeed;
        this.rotation += this.rotSpeed * (1 + (totalGust - 1) * 0.6);

        const windX = (this.speedX + Math.sin(this.sway) * this.swayAmp) * windMult * totalGust;
        const windY = (this.speedY + Math.cos(this.sway) * 0.5) * (1 + (totalGust - 1) * 0.35);

        const swirlX = Math.sin(this.y * 0.005 + gustSwirl) * (totalGust - 1) * 2.2;
        const swirlY = Math.cos(this.x * 0.005 + gustSwirl) * (totalGust - 1) * 1.2;

        this.x += windX + swirlX;
        this.y += windY + swirlY;

        if (this.x > width + 75 || this.y > height + 75 || this.x < -120 || this.y < -120) {
          this.init(false);
        }
      }

      draw(c) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);

        const scaleX = Math.max(0.12, Math.abs(Math.cos(this.flip)));
        c.scale(scaleX, 1);

        const s = this.baseSize;

        c.fillStyle = this.color;
        c.beginPath();
        c.moveTo(0, s);
        c.bezierCurveTo(s * 0.75, s * 0.45, s * 0.95, -s * 0.5, s * 0.36, -s);
        c.lineTo(0, -s * 0.72);
        c.lineTo(-s * 0.36, -s);
        c.bezierCurveTo(-s * 0.95, -s * 0.5, -s * 0.75, s * 0.45, 0, s);
        c.closePath();
        c.fill();

        if (this.tier >= 1) {
          c.fillStyle = this.innerHighlight;
          c.beginPath();
          c.ellipse(0, -s * 0.1, s * 0.22, s * 0.5, 0, 0, Math.PI * 2);
          c.fill();

          c.fillStyle = this.underside;
          c.beginPath();
          c.arc(0, s * 0.45, s * 0.25, 0, Math.PI * 2);
          c.fill();
        }

        c.restore();
      }
    }

    // -----------------------------------------------------------------
    // 2. SUN MOTE / GOLDEN POLLEN CLASS
    // -----------------------------------------------------------------
    class SunMote {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = initial ? Math.random() * width : Math.random() * width * 0.8;
        this.y = initial ? Math.random() * height : -20;
        this.size = Math.random() * 2.2 + 1.2;
        this.speedX = (Math.random() * 0.8 + 0.3) * windMult;
        this.speedY = Math.random() * 0.6 + 0.4;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.03 + 0.015;
        this.baseAlpha = Math.random() * 0.35 + 0.25;
      }

      update(gust) {
        if (reducedMotion) return;
        this.pulse += this.pulseSpeed;
        this.x += (this.speedX + Math.sin(this.pulse) * 0.4) * gust;
        this.y += this.speedY + Math.cos(this.pulse) * 0.3;

        if (this.x > width + 30 || this.y > height + 30) {
          this.reset(false);
        }
      }

      draw(c) {
        c.save();
        const alpha = this.baseAlpha + Math.sin(this.pulse) * 0.18;
        c.fillStyle = timeOfDay === 'night'
          ? `rgba(220, 235, 255, ${Math.max(0.05, alpha)})`
          : `rgba(255, 245, 210, ${Math.max(0.05, alpha)})`;
        c.shadowBlur = 6;
        c.shadowColor = timeOfDay === 'night' ? '#BFD7EA' : '#FFE89E';
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    // -----------------------------------------------------------------
    // 3. RAIN DROP CLASS (Organic Rainfall + Wind Tilt)
    // -----------------------------------------------------------------
    class RainDrop {
      constructor(preDistribute = true) {
        this.reset(preDistribute);
      }

      reset(initial = false) {
        this.x = initial ? Math.random() * (width + 240) - 120 : Math.random() * (width + 300) - 100;
        this.y = initial ? Math.random() * height : -30 - Math.random() * 50;
        this.length = Math.random() * 16 + 14;
        this.thickness = Math.random() * 1.2 + 0.8;
        this.speedY = Math.random() * 10 + 16;
        this.opacity = Math.random() * 0.32 + 0.38;
      }

      update(totalGust) {
        if (reducedMotion) {
          this.y += this.speedY * 0.3;
          if (this.y > height + 20) this.reset(false);
          return;
        }

        // Wind angle tilt: low = gentle angle, high = driving rain
        const windX = (windMult * 4.5 + Math.sin(this.y * 0.01) * 0.6) * totalGust;
        this.x += windX;
        this.y += this.speedY * (1 + (totalGust - 1) * 0.2);

        if (this.y > height + 40 || this.x > width + 100 || this.x < -100) {
          this.reset(false);
        }
      }

      draw(c, totalGust) {
        c.save();
        const slantX = (windMult * 3.8) * totalGust;
        c.strokeStyle = `rgba(175, 205, 235, ${this.opacity})`;
        c.lineWidth = this.thickness;
        c.lineCap = 'round';
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x + slantX, this.y + this.length);
        c.stroke();
        c.restore();
      }
    }

    // -----------------------------------------------------------------
    // 4. STAR CLASS (Twinkling Night Sky - Fixed in place, wind does not blow)
    // -----------------------------------------------------------------
    class Star {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height * 0.95;
        this.baseSize = Math.random() * 1.8 + 0.8;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.04 + 0.015;
        this.baseAlpha = Math.random() * 0.45 + 0.35;
        this.hasSparkle = Math.random() > 0.82;
        this.colorTint = Math.random() > 0.6 ? '#EDE4FF' : Math.random() > 0.3 ? '#FFFDF5' : '#D6EAFF';
      }

      update() {
        // Starlight twinkles gently; strictly immune to wind movement
        this.pulse += this.pulseSpeed;
      }

      draw(c) {
        c.save();
        const curAlpha = Math.max(0.1, Math.min(1.0, this.baseAlpha + Math.sin(this.pulse) * 0.35));
        const r = this.baseSize * (0.85 + Math.sin(this.pulse) * 0.2);

        c.fillStyle = this.colorTint;
        c.globalAlpha = curAlpha;
        c.shadowBlur = this.hasSparkle ? 8 : 4;
        c.shadowColor = this.colorTint;

        c.beginPath();
        c.arc(this.x, this.y, r, 0, Math.PI * 2);
        c.fill();

        // Delicate 4-point twinkle sparkle on bright stars
        if (this.hasSparkle && curAlpha > 0.65) {
          c.strokeStyle = this.colorTint;
          c.lineWidth = 0.8;
          const sLen = r * 3.2;
          c.beginPath();
          c.moveTo(this.x - sLen, this.y);
          c.lineTo(this.x + sLen, this.y);
          c.moveTo(this.x, this.y - sLen);
          c.lineTo(this.x, this.y + sLen);
          c.stroke();
        }
        c.restore();
      }
    }

    // -----------------------------------------------------------------
    // 5. SNOWFLAKE CLASS (Soft Winter Flurries + Wind Drift)
    // -----------------------------------------------------------------
    class SnowFlake {
      constructor(preDistribute = true) {
        this.tier = Math.random() < 0.4 ? 0 : Math.random() < 0.8 ? 1 : 2;
        this.reset(preDistribute);
      }

      reset(initial = false) {
        this.x = initial ? Math.random() * (width + 100) - 50 : Math.random() * (width + 120) - 60;
        this.y = initial ? Math.random() * height : -20 - Math.random() * 40;

        if (this.tier === 0) {
          this.size = Math.random() * 2 + 2;
          this.speedY = Math.random() * 0.8 + 0.8;
          this.opacity = Math.random() * 0.3 + 0.4;
        } else if (this.tier === 1) {
          this.size = Math.random() * 3 + 4;
          this.speedY = Math.random() * 1.2 + 1.2;
          this.opacity = Math.random() * 0.25 + 0.65;
        } else {
          this.size = Math.random() * 4 + 7;
          this.speedY = Math.random() * 1.6 + 1.6;
          this.opacity = Math.random() * 0.2 + 0.8;
        }

        this.sway = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.03 + 0.015;
      }

      update(totalGust) {
        if (reducedMotion) {
          this.y += this.speedY * 0.3;
          if (this.y > height + 20) this.reset(false);
          return;
        }

        this.sway += this.swaySpeed;
        const driftX = (Math.sin(this.sway) * 1.2 + windMult * 2.2) * totalGust;
        this.x += driftX;
        this.y += this.speedY * (1 + (totalGust - 1) * 0.25);

        if (this.y > height + 30 || this.x > width + 50 || this.x < -60) {
          this.reset(false);
        }
      }

      draw(c) {
        c.save();
        c.fillStyle = `rgba(245, 250, 255, ${this.opacity})`;
        c.shadowBlur = this.tier === 2 ? 6 : 2;
        c.shadowColor = '#FFFFFF';
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    // -----------------------------------------------------------------
    // 6. AUTUMN LEAF CLASS (Amber & Crimson Leaves Fluttering in Wind)
    // -----------------------------------------------------------------
    class AutumnLeaf {
      constructor(preDistribute = true) {
        this.reset(preDistribute);
      }

      reset(initial = false) {
        this.x = initial ? Math.random() * (width + 120) - 60 : -40;
        this.y = initial ? Math.random() * height : Math.random() * (height * 0.8);
        this.size = Math.random() * 8 + 12;
        this.speedX = Math.random() * 1.8 + 1.4;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.04;
        this.flip = Math.random() * Math.PI * 2;
        this.flipSpeed = Math.random() * 0.04 + 0.02;

        const palette = [
          'rgba(215, 95, 50, 0.85)',   // Crimson maple
          'rgba(230, 135, 45, 0.85)',  // Warm amber
          'rgba(210, 160, 50, 0.85)',  // Goldenrod
          'rgba(175, 75, 65, 0.85)'    // Russet wine
        ];
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }

      update(totalGust) {
        if (reducedMotion) {
          this.x += this.speedX * 0.3;
          this.y += this.speedY * 0.25;
          if (this.x > width + 40 || this.y > height + 40) this.reset(false);
          return;
        }

        this.rotation += this.rotSpeed * totalGust;
        this.flip += this.flipSpeed;
        const windX = (this.speedX + Math.sin(this.flip) * 1.4) * windMult * totalGust;
        const windY = (this.speedY + Math.cos(this.flip) * 0.6);

        this.x += windX;
        this.y += windY;

        if (this.x > width + 50 || this.y > height + 50) {
          this.reset(false);
        }
      }

      draw(c) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        const scaleX = Math.max(0.2, Math.abs(Math.cos(this.flip)));
        c.scale(scaleX, 1);

        const s = this.size;
        c.fillStyle = this.color;
        c.beginPath();
        c.moveTo(0, -s);
        c.quadraticCurveTo(s * 0.7, -s * 0.3, s * 0.5, s * 0.6);
        c.lineTo(0, s);
        c.lineTo(-s * 0.5, s * 0.6);
        c.quadraticCurveTo(-s * 0.7, -s * 0.3, 0, -s);
        c.closePath();
        c.fill();
        c.restore();
      }
    }

    // -----------------------------------------------------------------
    // 7. RAIN RIPPLE CLASS (Expanding concentric rings on bottom ground)
    // -----------------------------------------------------------------
    class RainRipple {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = height * (0.75 + Math.random() * 0.23);
        this.radius = Math.random() * 2 + 1;
        this.maxRadius = Math.random() * 18 + 14;
        this.alpha = Math.random() * 0.35 + 0.25;
        this.growth = Math.random() * 0.4 + 0.3;
      }
      update() {
        this.radius += this.growth;
        this.alpha *= 0.94;
        if (this.radius > this.maxRadius || this.alpha < 0.02) {
          this.reset();
        }
      }
      draw(c) {
        c.save();
        c.strokeStyle = `rgba(180, 210, 240, ${this.alpha})`;
        c.lineWidth = 1;
        c.beginPath();
        c.ellipse(this.x, this.y, this.radius, this.radius * 0.4, 0, 0, Math.PI * 2);
        c.stroke();
        c.restore();
      }
    }

    // -----------------------------------------------------------------
    // 8. SHOOTING STAR CLASS (Occasional meteoric celestial streak)
    // -----------------------------------------------------------------
    class ShootingStar {
      constructor() {
        this.reset();
      }
      reset() {
        this.active = false;
        this.delay = Math.random() * 240 + 120;
        this.x = Math.random() * width * 0.8;
        this.y = Math.random() * height * 0.4;
        this.len = Math.random() * 80 + 70;
        this.speed = Math.random() * 10 + 14;
        this.alpha = 1.0;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
      }
      update() {
        if (!this.active) {
          this.delay--;
          if (this.delay <= 0) this.active = true;
          return;
        }
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= 0.025;
        if (this.alpha <= 0 || this.x > width + 100 || this.y > height + 100) {
          this.reset();
        }
      }
      draw(c) {
        if (!this.active || this.alpha <= 0) return;
        c.save();
        const tailX = this.x - Math.cos(this.angle) * this.len;
        const tailY = this.y - Math.sin(this.angle) * this.len;
        const grad = c.createLinearGradient(tailX, tailY, this.x, this.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, `rgba(255, 255, 255, ${this.alpha * 0.9})`);
        c.strokeStyle = grad;
        c.lineWidth = 1.6;
        c.beginPath();
        c.moveTo(tailX, tailY);
        c.lineTo(this.x, this.y);
        c.stroke();
        c.restore();
      }
    }

    // -----------------------------------------------------------------
    // 9. FIREFLY CLASS (Pulsating bioluminescent woodland spirits)
    // -----------------------------------------------------------------
    class Firefly {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = Math.random() * height * 0.9;
        this.size = Math.random() * 2.4 + 1.6;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.6 + 0.3;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.04 + 0.02;
        this.baseAlpha = Math.random() * 0.4 + 0.45;
        this.color = Math.random() > 0.4 ? 'rgba(195, 255, 140,' : 'rgba(235, 255, 160,';
      }
      update(totalGust) {
        if (reducedMotion) return;
        this.pulse += this.pulseSpeed;
        this.angle += (Math.random() - 0.5) * 0.12;
        this.x += (Math.cos(this.angle) * this.speed + windMult * 0.6) * totalGust;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.x > width + 40) this.x = -30;
        if (this.x < -40) this.x = width + 30;
        if (this.y > height + 30) this.y = -20;
        if (this.y < -30) this.y = height + 20;
      }
      draw(c) {
        c.save();
        const a = Math.max(0.08, this.baseAlpha + Math.sin(this.pulse) * 0.35);
        c.fillStyle = `${this.color} ${a})`;
        c.shadowBlur = 10;
        c.shadowColor = '#D4FFA6';
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    // -----------------------------------------------------------------
    // 10. FOREST LEAF CLASS (Translucent emerald leaves fluttering)
    // -----------------------------------------------------------------
    class ForestLeaf {
      constructor(preDistribute = true) {
        this.reset(preDistribute);
      }
      reset(initial = false) {
        this.x = initial ? Math.random() * (width + 120) - 60 : -40;
        this.y = initial ? Math.random() * height : Math.random() * (height * 0.85);
        this.size = Math.random() * 6 + 9;
        this.speedX = Math.random() * 1.6 + 1.2;
        this.speedY = Math.random() * 0.8 + 0.6;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.035;
        this.flip = Math.random() * Math.PI * 2;
        this.flipSpeed = Math.random() * 0.035 + 0.02;
        const greens = [
          'rgba(145, 185, 130, 0.75)',
          'rgba(170, 205, 145, 0.75)',
          'rgba(125, 168, 120, 0.70)',
          'rgba(185, 215, 160, 0.70)'
        ];
        this.color = greens[Math.floor(Math.random() * greens.length)];
      }
      update(totalGust) {
        if (reducedMotion) return;
        this.rotation += this.rotSpeed * totalGust;
        this.flip += this.flipSpeed;
        this.x += (this.speedX + Math.sin(this.flip) * 1.2) * windMult * totalGust;
        this.y += this.speedY + Math.cos(this.flip) * 0.4;
        if (this.x > width + 40 || this.y > height + 40) this.reset(false);
      }
      draw(c) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        const sx = Math.max(0.2, Math.abs(Math.cos(this.flip)));
        c.scale(sx, 1);
        const s = this.size;
        c.fillStyle = this.color;
        c.beginPath();
        c.moveTo(0, -s);
        c.quadraticCurveTo(s * 0.6, 0, 0, s);
        c.quadraticCurveTo(-s * 0.6, 0, 0, -s);
        c.closePath();
        c.fill();
        c.restore();
      }
    }

    // -----------------------------------------------------------------
    // 11. OCEAN SPRAY CLASS (Fine glistening spray blown by ocean breeze)
    // -----------------------------------------------------------------
    class OceanSpray {
      constructor(preDistribute = true) {
        this.reset(preDistribute);
      }
      reset(initial = false) {
        this.x = initial ? Math.random() * width : -20;
        this.y = height * (0.62 + Math.random() * 0.32);
        this.size = Math.random() * 2.2 + 1.2;
        this.speedX = (Math.random() * 2.4 + 1.8) * windMult;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.35 + 0.35;
        this.sway = Math.random() * Math.PI * 2;
      }
      update(totalGust) {
        if (reducedMotion) return;
        this.sway += 0.04;
        this.x += this.speedX * totalGust;
        this.y += this.speedY + Math.sin(this.sway) * 0.5;
        if (this.x > width + 30) this.reset(false);
      }
      draw(c) {
        c.save();
        c.fillStyle = `rgba(235, 248, 255, ${this.opacity})`;
        c.shadowBlur = 4;
        c.shadowColor = '#D4EEF9';
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    // -----------------------------------------------------------------
    // 12. DANDELION SEED CLASS (Ethereal drifting spring parachutes)
    // -----------------------------------------------------------------
    class DandelionSeed {
      constructor(preDistribute = true) {
        this.reset(preDistribute);
      }
      reset(initial = false) {
        this.x = initial ? Math.random() * (width + 80) - 40 : -30;
        this.y = initial ? Math.random() * (height * 0.85) : Math.random() * (height * 0.8);
        this.size = Math.random() * 4 + 5;
        this.speedX = Math.random() * 1.5 + 1.2;
        this.speedY = Math.random() * 0.5 + 0.3;
        this.angle = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.03;
        this.sway = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.3 + 0.55;
      }
      update(totalGust) {
        if (reducedMotion) return;
        this.sway += 0.03;
        this.angle += this.rotSpeed * totalGust;
        this.x += (this.speedX + Math.sin(this.sway) * 1.0) * windMult * totalGust;
        this.y += (this.speedY + Math.cos(this.sway) * 0.3);
        if (this.x > width + 40 || this.y > height + 40) this.reset(false);
      }
      draw(c) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        c.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(0, this.size * 2);
        c.stroke();
        c.fillStyle = `rgba(180, 160, 140, ${this.opacity})`;
        c.beginPath();
        c.arc(0, this.size * 2, 1.2, 0, Math.PI * 2);
        c.fill();
        const rays = 6;
        for (let r = 0; r < rays; r++) {
          const a = -Math.PI * 0.8 + (r / (rays - 1)) * Math.PI * 0.6;
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(Math.cos(a) * this.size, Math.sin(a) * this.size);
          c.stroke();
        }
        c.restore();
      }
    }

    // -----------------------------------------------------------------
    // 13. ZEN MOTE CLASS (Slowly pulsating serene pearl motes)
    // -----------------------------------------------------------------
    class ZenMote {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = initial ? Math.random() * width : Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.size = Math.random() * 3.5 + 2.0;
        this.speedY = -(Math.random() * 0.4 + 0.2);
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.025 + 0.012;
        this.baseAlpha = Math.random() * 0.25 + 0.25;
      }
      update(totalGust) {
        if (reducedMotion) return;
        this.pulse += this.pulseSpeed;
        this.x += (this.speedX + Math.sin(this.pulse) * 0.5) * totalGust;
        this.y += this.speedY;
        if (this.y < -20) this.reset(false);
      }
      draw(c) {
        c.save();
        const a = Math.max(0.06, this.baseAlpha + Math.sin(this.pulse) * 0.18);
        c.fillStyle = `rgba(235, 220, 230, ${a})`;
        c.shadowBlur = 8;
        c.shadowColor = 'rgba(215, 195, 210, 0.5)';
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    // -----------------------------------------------------------------
    // INITIALIZE PARTICLES PER EFFECTIVE SCENE
    // -----------------------------------------------------------------
    const sakuraPetals = [];
    const sunMotes = [];
    const rainDrops = [];
    const rainRipples = [];
    const stars = [];
    const shootingStars = [];
    const snowFlakes = [];
    const autumnLeaves = [];
    const fireflies = [];
    const forestLeaves = [];
    const oceanSprays = [];
    const dandelionSeeds = [];
    const zenMotes = [];

    if (effectiveScene === 'sakura') {
      const basePetalCount = isMobile ? 55 : 125;
      const totalPetalCount = Math.round(basePetalCount * intensityMult);
      for (let i = 0; i < totalPetalCount; i++) sakuraPetals.push(new SakuraPetal(true));
      const moteCount = isMobile ? 18 : 35;
      for (let j = 0; j < moteCount; j++) sunMotes.push(new SunMote());
    } else if (effectiveScene === 'rain') {
      const rainCount = isMobile ? 80 : 180;
      for (let i = 0; i < rainCount; i++) rainDrops.push(new RainDrop(true));
      const rippleCount = isMobile ? 10 : 22;
      for (let r = 0; r < rippleCount; r++) rainRipples.push(new RainRipple());
    } else if (effectiveScene === 'night') {
      const starCount = isMobile ? 90 : 180;
      for (let i = 0; i < starCount; i++) stars.push(new Star());
      shootingStars.push(new ShootingStar());
    } else if (effectiveScene === 'winter') {
      const snowCount = isMobile ? 65 : 140;
      for (let i = 0; i < snowCount; i++) snowFlakes.push(new SnowFlake(true));
    } else if (effectiveScene === 'autumn') {
      const leafCount = isMobile ? 35 : 75;
      for (let i = 0; i < leafCount; i++) autumnLeaves.push(new AutumnLeaf(true));
    } else if (effectiveScene === 'forest') {
      const flyCount = isMobile ? 25 : 55;
      for (let i = 0; i < flyCount; i++) fireflies.push(new Firefly());
      const fLeafCount = isMobile ? 18 : 35;
      for (let j = 0; j < fLeafCount; j++) forestLeaves.push(new ForestLeaf(true));
    } else if (effectiveScene === 'ocean') {
      const sprayCount = isMobile ? 30 : 65;
      for (let i = 0; i < sprayCount; i++) oceanSprays.push(new OceanSpray(true));
      const moteCount = isMobile ? 15 : 30;
      for (let j = 0; j < moteCount; j++) sunMotes.push(new SunMote());
    } else if (effectiveScene === 'mountain') {
      const moteCount = isMobile ? 25 : 50;
      for (let j = 0; j < moteCount; j++) sunMotes.push(new SunMote());
    } else if (effectiveScene === 'spring') {
      const seedCount = isMobile ? 25 : 50;
      for (let i = 0; i < seedCount; i++) dandelionSeeds.push(new DandelionSeed(true));
      const petalCount = isMobile ? 20 : 40;
      for (let j = 0; j < petalCount; j++) sakuraPetals.push(new SakuraPetal(true));
    } else if (effectiveScene === 'sunrise') {
      const moteCount = isMobile ? 30 : 60;
      for (let j = 0; j < moteCount; j++) sunMotes.push(new SunMote());
    } else if (effectiveScene === 'minimal') {
      const zenCount = isMobile ? 20 : 40;
      for (let i = 0; i < zenCount; i++) zenMotes.push(new ZenMote());
    }

    // -----------------------------------------------------------------
    // RANDOMIZED ANIME WIND GUST STATE MACHINE (Scaled with breezeMult)
    // -----------------------------------------------------------------
    let gustProgress = 0;
    let gustActive = false;
    let nextGustTime = (3.5 + Math.random() * 4.0) / Math.max(0.4, breezeMult);
    let gustDuration = 2.4;
    let gustStrength = 1.0;
    let gustSwirl = 0;
    let time = 0;

    // -----------------------------------------------------------------
    // ANIMATION RENDER LOOP
    // -----------------------------------------------------------------
    const render = () => {
      time += 0.016;

      if (!reducedMotion && mousePosRef?.current) {
        curMouseX += (mousePosRef.current.targetX - curMouseX) * 0.06;
        curMouseY += (mousePosRef.current.targetY - curMouseY) * 0.06;
      }

      if (!reducedMotion) {
        if (breezeMult > 0) {
          if (!gustActive) {
            nextGustTime -= 0.016;
            if (nextGustTime <= 0) {
              gustActive = true;
              gustProgress = 0;
              gustDuration = 2.0 + Math.random() * 1.6;
              gustStrength = (0.7 + Math.random() * 0.8) * breezeMult;
            }
          } else {
            gustProgress += 0.016 / gustDuration;
            if (gustProgress >= 1.0) {
              gustActive = false;
              nextGustTime = (3.5 + Math.random() * 4.5) / Math.max(0.4, breezeMult);
            }
          }
        } else {
          gustActive = false;
        }
      }

      const gustEnvelope = gustActive ? Math.sin(gustProgress * Math.PI) * gustStrength : 0;
      const naturalGust = 1.0 + gustEnvelope;

      if (breezeBoostRef.current > 0.02) {
        breezeBoostRef.current *= 0.95;
      } else {
        breezeBoostRef.current = 0;
      }

      const totalGust = naturalGust + breezeBoostRef.current;
      gustSwirl += 0.02 * totalGust;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Environmental Atmosphere Gradient
      if (effectiveScene === 'sakura') {
        drawAtmosphericSakuraEnvironment(ctx, width, height, timeOfDay, curMouseX, curMouseY, time);
      } else if (effectiveScene === 'rain') {
        drawRainEnvironment(ctx, width, height, timeOfDay, curMouseX, curMouseY);
      } else if (effectiveScene === 'night') {
        drawNightEnvironment(ctx, width, height, curMouseX, curMouseY);
      } else if (effectiveScene === 'winter') {
        drawWinterEnvironment(ctx, width, height, curMouseX, curMouseY);
      } else if (effectiveScene === 'autumn') {
        drawAutumnEnvironment(ctx, width, height, curMouseX, curMouseY);
      } else if (effectiveScene === 'forest') {
        drawForestEnvironment(ctx, width, height, curMouseX, curMouseY, time);
      } else if (effectiveScene === 'ocean') {
        drawOceanEnvironment(ctx, width, height, curMouseX, curMouseY, time);
      } else if (effectiveScene === 'mountain') {
        drawMountainEnvironment(ctx, width, height, curMouseX, curMouseY, time);
      } else if (effectiveScene === 'spring') {
        drawSpringEnvironment(ctx, width, height, curMouseX, curMouseY, time);
      } else if (effectiveScene === 'sunrise') {
        drawSunriseEnvironment(ctx, width, height, curMouseX, curMouseY, time);
      } else if (effectiveScene === 'minimal') {
        drawMinimalEnvironment(ctx, width, height, curMouseX, curMouseY, time);
      } else {
        drawAtmosphericSakuraEnvironment(ctx, width, height, timeOfDay, curMouseX, curMouseY, time);
      }

      // 2. Draw Active Particles
      if (effectiveScene === 'sakura') {
        if (!reducedMotion) {
          sunMotes.forEach(m => { m.update(totalGust); m.draw(ctx); });
        }
        sakuraPetals.forEach(p => { p.update(totalGust, gustSwirl); p.draw(ctx); });
      } else if (effectiveScene === 'rain') {
        rainDrops.forEach(r => { r.update(totalGust); r.draw(ctx, totalGust); });
        if (!reducedMotion) {
          rainRipples.forEach(rp => { rp.update(); rp.draw(ctx); });
        }
      } else if (effectiveScene === 'night') {
        stars.forEach(s => { s.update(); s.draw(ctx); });
        if (!reducedMotion) {
          shootingStars.forEach(ss => { ss.update(); ss.draw(ctx); });
        }
      } else if (effectiveScene === 'winter') {
        snowFlakes.forEach(sf => { sf.update(totalGust); sf.draw(ctx); });
      } else if (effectiveScene === 'autumn') {
        autumnLeaves.forEach(leaf => { leaf.update(totalGust); leaf.draw(ctx); });
      } else if (effectiveScene === 'forest') {
        fireflies.forEach(f => { f.update(totalGust); f.draw(ctx); });
        forestLeaves.forEach(fl => { fl.update(totalGust); fl.draw(ctx); });
      } else if (effectiveScene === 'ocean') {
        if (!reducedMotion) {
          sunMotes.forEach(m => { m.update(totalGust); m.draw(ctx); });
        }
        oceanSprays.forEach(os => { os.update(totalGust); os.draw(ctx); });
      } else if (effectiveScene === 'mountain') {
        if (!reducedMotion) {
          sunMotes.forEach(m => { m.update(totalGust); m.draw(ctx); });
        }
      } else if (effectiveScene === 'spring') {
        dandelionSeeds.forEach(ds => { ds.update(totalGust); ds.draw(ctx); });
        sakuraPetals.forEach(p => { p.update(totalGust, gustSwirl); p.draw(ctx); });
      } else if (effectiveScene === 'sunrise') {
        if (!reducedMotion) {
          sunMotes.forEach(m => { m.update(totalGust); m.draw(ctx); });
        }
      } else if (effectiveScene === 'minimal') {
        zenMotes.forEach(zm => { zm.update(totalGust); zm.draw(ctx); });
      }

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [atmosphere, timeOfDay, reducedMotion, ambientParticle, petalIntensity, windStrength, breezeLevel]);

  return (
    <canvas
      ref={bgCanvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
    />
  );
}

// ---------------------------------------------------------------------
// 1. OPEN SAKURA ENVIRONMENT RENDERER (NO TREES / NO BRANCHES)
// Warm ivory, soft blush pink, subtle peach, lavender sky, glowing bloom.
// ---------------------------------------------------------------------
function drawAtmosphericSakuraEnvironment(ctx, width, height, timeOfDay, mouseX, mouseY, time) {
  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';
  const isMorning = timeOfDay === 'morning';

  const px = mouseX * 8;
  const py = mouseY * 5;

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  if (isNight) {
    sky.addColorStop(0, '#151126');
    sky.addColorStop(0.38, '#231836');
    sky.addColorStop(0.72, '#332047');
    sky.addColorStop(1, '#462758');
  } else if (isSunset) {
    sky.addColorStop(0, '#FDE8ED');
    sky.addColorStop(0.32, '#F8CAD6');
    sky.addColorStop(0.68, '#F0B8C8');
    sky.addColorStop(1, '#E2A2BC');
  } else if (isMorning) {
    sky.addColorStop(0, '#F4F7FD');
    sky.addColorStop(0.35, '#FDEFF5');
    sky.addColorStop(0.70, '#F8E0EC');
    sky.addColorStop(1, '#EBD6E8');
  } else {
    sky.addColorStop(0, '#EFE6F6');
    sky.addColorStop(0.26, '#FCE6ED');
    sky.addColorStop(0.58, '#FDECE6');
    sky.addColorStop(0.84, '#FFF7F0');
    sky.addColorStop(1, '#FDF2EB');
  }

  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  const sunX = width * 0.82 + px;
  const sunY = -15 + py;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, width * 0.85);

  if (isNight) {
    sunGlow.addColorStop(0, 'rgba(235, 230, 255, 0.22)');
    sunGlow.addColorStop(0.4, 'rgba(205, 195, 245, 0.08)');
    sunGlow.addColorStop(1, 'transparent');
  } else if (isSunset) {
    sunGlow.addColorStop(0, 'rgba(255, 222, 190, 0.30)');
    sunGlow.addColorStop(0.45, 'rgba(245, 180, 198, 0.12)');
    sunGlow.addColorStop(1, 'transparent');
  } else {
    sunGlow.addColorStop(0, 'rgba(255, 248, 230, 0.38)');
    sunGlow.addColorStop(0.32, 'rgba(255, 230, 238, 0.20)');
    sunGlow.addColorStop(0.65, 'rgba(255, 215, 230, 0.08)');
    sunGlow.addColorStop(1, 'transparent');
  }
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, width, height);

  const beamCount = 4;
  for (let b = 0; b < beamCount; b++) {
    const beamAngle = 0.58 + b * 0.13;
    const beamWidth = width * 0.20;
    const bGrad = ctx.createLinearGradient(sunX, sunY, sunX - Math.cos(beamAngle) * height * 1.2, height);
    bGrad.addColorStop(0, isNight ? 'rgba(220, 210, 255, 0.07)' : 'rgba(255, 250, 235, 0.11)');
    bGrad.addColorStop(0.55, isNight ? 'rgba(220, 210, 255, 0.02)' : 'rgba(255, 242, 225, 0.035)');
    bGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.moveTo(sunX - b * 50, sunY);
    ctx.lineTo(sunX - b * 50 - Math.cos(beamAngle) * height * 1.2 - beamWidth, height);
    ctx.lineTo(sunX - b * 50 - Math.cos(beamAngle) * height * 1.2 + beamWidth, height);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  const hazeGrad1 = ctx.createLinearGradient(0, height * 0.65, 0, height);
  hazeGrad1.addColorStop(0, 'transparent');
  hazeGrad1.addColorStop(0.5, isNight ? 'rgba(45, 30, 60, 0.25)' : 'rgba(255, 235, 244, 0.28)');
  hazeGrad1.addColorStop(1, isNight ? 'rgba(30, 20, 42, 0.40)' : 'rgba(253, 240, 232, 0.35)');

  ctx.fillStyle = hazeGrad1;
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height * 0.72 + py * 0.4);
  ctx.bezierCurveTo(
    width * 0.35, height * 0.68 + py * 0.4,
    width * 0.65, height * 0.74 + py * 0.4,
    width, height * 0.70 + py * 0.4
  );
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  const hazeGrad2 = ctx.createLinearGradient(0, height * 0.82, 0, height);
  hazeGrad2.addColorStop(0, 'transparent');
  hazeGrad2.addColorStop(1, isNight ? 'rgba(35, 22, 48, 0.35)' : 'rgba(255, 244, 238, 0.30)');

  ctx.fillStyle = hazeGrad2;
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height * 0.86 + py * 0.2);
  ctx.bezierCurveTo(
    width * 0.4, height * 0.84 + py * 0.2,
    width * 0.7, height * 0.88 + py * 0.2,
    width, height * 0.85 + py * 0.2
  );
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------------
// 2. RAIN ENVIRONMENT RENDERER (Moody Slate & Wet Overcast Sheen)
// ---------------------------------------------------------------------
function drawRainEnvironment(ctx, width, height, timeOfDay, mouseX, mouseY) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#E3ECF5');
  grad.addColorStop(0.35, '#D5E2EE');
  grad.addColorStop(0.70, '#C4D5E5');
  grad.addColorStop(1, '#B5C8DB');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Soft atmospheric rain mist in lower third
  const mistGrad = ctx.createLinearGradient(0, height * 0.6, 0, height);
  mistGrad.addColorStop(0, 'transparent');
  mistGrad.addColorStop(0.6, 'rgba(220, 235, 248, 0.35)');
  mistGrad.addColorStop(1, 'rgba(195, 215, 235, 0.55)');
  ctx.fillStyle = mistGrad;
  ctx.fillRect(0, height * 0.6, width, height * 0.4);
}

// ---------------------------------------------------------------------
// 3. NIGHT ENVIRONMENT RENDERER (Velvet Cosmic Indigo & Lunar Bloom)
// ---------------------------------------------------------------------
function drawNightEnvironment(ctx, width, height, mouseX, mouseY) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#0F0B1C');
  grad.addColorStop(0.35, '#1B122C');
  grad.addColorStop(0.70, '#26183C');
  grad.addColorStop(1, '#331D4D');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Moonlit Starlight Glow radiating from upper center-right
  const moonX = width * 0.75 + mouseX * 8;
  const moonY = height * 0.15 + mouseY * 5;
  const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, width * 0.65);
  moonGlow.addColorStop(0, 'rgba(220, 215, 255, 0.22)');
  moonGlow.addColorStop(0.35, 'rgba(175, 160, 230, 0.08)');
  moonGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = moonGlow;
  ctx.fillRect(0, 0, width, height);
}

// ---------------------------------------------------------------------
// 4. WINTER ENVIRONMENT RENDERER (Frosted Pearl & Ice Crystal Light)
// ---------------------------------------------------------------------
function drawWinterEnvironment(ctx, width, height, mouseX, mouseY) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#F5F8FC');
  grad.addColorStop(0.4, '#E8F0F7');
  grad.addColorStop(0.75, '#DCE7F2');
  grad.addColorStop(1, '#CDDCEB');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Frost glow at upper center
  const frostGlow = ctx.createRadialGradient(width * 0.5, 0, 10, width * 0.5, 0, width * 0.7);
  frostGlow.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  frostGlow.addColorStop(0.5, 'rgba(235, 245, 255, 0.15)');
  frostGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = frostGlow;
  ctx.fillRect(0, 0, width, height);
}

// ---------------------------------------------------------------------
// 5. AUTUMN ENVIRONMENT RENDERER (Warm Amber & Golden Twilight)
// ---------------------------------------------------------------------
function drawAutumnEnvironment(ctx, width, height, mouseX, mouseY) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#FFF6EE');
  grad.addColorStop(0.32, '#FDE3CE');
  grad.addColorStop(0.68, '#F7CEAD');
  grad.addColorStop(1, '#EEB990');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Harvest sunlight glow
  const harvestX = width * 0.8;
  const harvestY = 0;
  const harvestGlow = ctx.createRadialGradient(harvestX, harvestY, 20, harvestX, harvestY, width * 0.8);
  harvestGlow.addColorStop(0, 'rgba(255, 230, 195, 0.38)');
  harvestGlow.addColorStop(0.45, 'rgba(255, 205, 160, 0.12)');
  harvestGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = harvestGlow;
  ctx.fillRect(0, 0, width, height);
}

// ---------------------------------------------------------------------
// 6. MOUNTAIN ENVIRONMENT RENDERER (Misty Alpine Parallax Ridges - NO trees)
// ---------------------------------------------------------------------
function drawMountainEnvironment(ctx, width, height, mouseX, mouseY, time) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#EEF4F8');
  sky.addColorStop(0.35, '#DEEAE5');
  sky.addColorStop(0.70, '#CDDDD7');
  sky.addColorStop(1, '#BACEC7');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // Distant Alpine Ridge Silhouettes (3 parallax depths, soft pastel layers)
  const ridges = [
    { baseY: 0.52, amp: 75, freq: 0.002, color: 'rgba(175, 195, 190, 0.45)', parallax: 0.1 },
    { baseY: 0.65, amp: 95, freq: 0.0025, color: 'rgba(150, 175, 170, 0.55)', parallax: 0.2 },
    { baseY: 0.78, amp: 110, freq: 0.003, color: 'rgba(125, 155, 148, 0.65)', parallax: 0.35 }
  ];

  ridges.forEach((r, idx) => {
    ctx.save();
    ctx.fillStyle = r.color;
    ctx.beginPath();
    ctx.moveTo(0, height);
    const pxOffset = mouseX * r.parallax * 40;
    for (let x = 0; x <= width + 40; x += 30) {
      const ridgeY = height * r.baseY + Math.sin((x + pxOffset) * r.freq + idx * 1.5) * r.amp * 0.7
        + Math.cos((x + pxOffset) * r.freq * 2.1) * r.amp * 0.3;
      if (x === 0) ctx.lineTo(x, ridgeY);
      else ctx.lineTo(x, ridgeY);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Soft alpine mist veil between ridges
    const mist = ctx.createLinearGradient(0, height * r.baseY, 0, height * (r.baseY + 0.15));
    mist.addColorStop(0, 'rgba(235, 245, 240, 0.35)');
    mist.addColorStop(1, 'transparent');
    ctx.fillStyle = mist;
    ctx.fillRect(0, height * r.baseY, width, height * 0.15);
    ctx.restore();
  });
}

// ---------------------------------------------------------------------
// 7. OCEAN ENVIRONMENT RENDERER (Undulating 3D Translucent Waves & Foam Crests)
// ---------------------------------------------------------------------
function drawOceanEnvironment(ctx, width, height, mouseX, mouseY, time) {
  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.65);
  sky.addColorStop(0, '#E8F4FA');
  sky.addColorStop(0.5, '#D2E9F5');
  sky.addColorStop(1, '#BCDDF0');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // Distant horizon sunlight glow
  const sunGlow = ctx.createRadialGradient(width * 0.6 + mouseX * 10, height * 0.5, 10, width * 0.6, height * 0.5, width * 0.6);
  sunGlow.addColorStop(0, 'rgba(255, 250, 230, 0.35)');
  sunGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, width, height);

  // 3 Layers of rolling 3D ocean swell waves
  const waveLayers = [
    { baseY: 0.62, amp: 14, freq: 0.005, speed: 0.8, color: 'rgba(150, 195, 225, 0.50)' },
    { baseY: 0.72, amp: 20, freq: 0.004, speed: 1.2, color: 'rgba(125, 178, 215, 0.60)' },
    { baseY: 0.84, amp: 26, freq: 0.0035, speed: 1.6, color: 'rgba(98, 160, 202, 0.75)' }
  ];

  waveLayers.forEach((w, idx) => {
    ctx.save();
    ctx.fillStyle = w.color;
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width + 20; x += 15) {
      const y = height * w.baseY + Math.sin(x * w.freq + time * w.speed + idx) * w.amp;
      if (x === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Wave crest foam line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    for (let x = 0; x <= width + 20; x += 15) {
      const y = height * w.baseY + Math.sin(x * w.freq + time * w.speed + idx) * w.amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  });
}

// ---------------------------------------------------------------------
// 8. FOREST ENVIRONMENT RENDERER (Emerald Woodland Canopy Rays - NO trees/branches)
// ---------------------------------------------------------------------
function drawForestEnvironment(ctx, width, height, mouseX, mouseY, time) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#E8F2E6');
  grad.addColorStop(0.35, '#D5E6D2');
  grad.addColorStop(0.70, '#BFD8BB');
  grad.addColorStop(1, '#A7C9A2');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Sunlight filtering down through upper canopy (soft crepuscular rays)
  ctx.save();
  const sunX = width * 0.4 + mouseX * 10;
  const sunY = -30;
  for (let b = 0; b < 5; b++) {
    const angle = 0.85 + b * 0.15;
    const bGrad = ctx.createLinearGradient(sunX, sunY, sunX + Math.cos(angle) * height * 1.3, height);
    bGrad.addColorStop(0, 'rgba(255, 255, 220, 0.14)');
    bGrad.addColorStop(0.6, 'rgba(230, 255, 200, 0.04)');
    bGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.moveTo(sunX + b * 40, sunY);
    ctx.lineTo(sunX + b * 40 + Math.cos(angle) * height * 1.3 - width * 0.12, height);
    ctx.lineTo(sunX + b * 40 + Math.cos(angle) * height * 1.3 + width * 0.12, height);
    ctx.closePath();
    ctx.fill();
  }
  // Soft mossy woodland mist along lower ground
  const mistGrad = ctx.createLinearGradient(0, height * 0.65, 0, height);
  mistGrad.addColorStop(0, 'transparent');
  mistGrad.addColorStop(1, 'rgba(180, 215, 175, 0.35)');
  ctx.fillStyle = mistGrad;
  ctx.fillRect(0, height * 0.65, width, height * 0.35);
  ctx.restore();
}

// ---------------------------------------------------------------------
// 9. SPRING ENVIRONMENT RENDERER (Lilac-Rose Vernal Dawn Radiance)
// ---------------------------------------------------------------------
function drawSpringEnvironment(ctx, width, height, mouseX, mouseY, time) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#F6EFF7');
  grad.addColorStop(0.35, '#FCEEF1');
  grad.addColorStop(0.70, '#F5E4EC');
  grad.addColorStop(1, '#E9D6E5');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Vernal Spring Sun Glow
  const sunX = width * 0.8 + mouseX * 8;
  const sunY = height * 0.1 + mouseY * 5;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, width * 0.8);
  sunGlow.addColorStop(0, 'rgba(255, 250, 235, 0.40)');
  sunGlow.addColorStop(0.4, 'rgba(255, 225, 235, 0.18)');
  sunGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, width, height);
}

// ---------------------------------------------------------------------
// 10. GOLDEN DAWN / SUNRISE ENVIRONMENT RENDERER (Radiant Radial Morning Rays)
// ---------------------------------------------------------------------
function drawSunriseEnvironment(ctx, width, height, mouseX, mouseY, time) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#FBE4D2');
  grad.addColorStop(0.35, '#F9D0BA');
  grad.addColorStop(0.70, '#F5B89E');
  grad.addColorStop(1, '#EE9A7C');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Radiant Morning Dawn Sun
  ctx.save();
  const sunX = width * 0.5;
  const sunY = height * 0.88;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 30, sunX, sunY, width * 0.85);
  sunGlow.addColorStop(0, 'rgba(255, 245, 210, 0.55)');
  sunGlow.addColorStop(0.35, 'rgba(255, 215, 160, 0.25)');
  sunGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, width, height);

  // Rotating Sunrise Rays
  const rayCount = 8;
  for (let r = 0; r < rayCount; r++) {
    const angle = (r / rayCount) * Math.PI + Math.sin(time * 0.2) * 0.05;
    ctx.fillStyle = 'rgba(255, 240, 200, 0.08)';
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    ctx.lineTo(sunX + Math.cos(angle - 0.06) * width * 1.5, sunY - Math.sin(angle - 0.06) * height * 1.5);
    ctx.lineTo(sunX + Math.cos(angle + 0.06) * width * 1.5, sunY - Math.sin(angle + 0.06) * height * 1.5);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------------
// 11. CALM SANCTUARY / MINIMAL (Ethereal Harmonic Zen Waves)
// ---------------------------------------------------------------------
function drawMinimalEnvironment(ctx, width, height, mouseX, mouseY, time) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#FAF7F3');
  grad.addColorStop(0.4, '#F4EDE6');
  grad.addColorStop(0.75, '#EDE3DB');
  grad.addColorStop(1, '#E4D7CF');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Fluid undulating zen light ribbons
  ctx.save();
  for (let w = 0; w < 3; w++) {
    ctx.strokeStyle = `rgba(215, 195, 210, ${0.14 - w * 0.03})`;
    ctx.lineWidth = 40;
    ctx.beginPath();
    for (let x = 0; x <= width; x += 20) {
      const y = height * (0.35 + w * 0.18) + Math.sin(x * 0.003 + time * 0.5 + w) * 45;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}
