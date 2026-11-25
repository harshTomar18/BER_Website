/**
 * CircularGallery - A WebGL-powered interactive gallery built with OGL.
 * Features:
 * - Immersive circular bending effect
 * - Smooth inertia-based scrolling (drag, touch, wheel)
 * - Click detection on items to trigger navigation or selection
 * - Custom typography and rounded corners with smooth SDF shaders
 * - Programmatic controls (reset, scroll to item)
 */

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function getFontSize(font) {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 42;
}

function createTextTexture(gl, text, font = '700 42px "Poppins", sans-serif', color = '#20285b') {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2d context');

  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const fontSize = getFontSize(font);
  const textHeight = Math.ceil(fontSize * 1.3);

  canvas.width = Math.max(Math.ceil((textWidth + 80) * dpr), 1);
  canvas.height = Math.max(Math.ceil((textHeight + 40) * dpr), 1);

  context.scale(dpr, dpr);
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, (textWidth + 80) / 2, (textHeight + 40) / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: textWidth + 80, height: textHeight + 40 };
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = '#20285b', font = '700 42px "Poppins", sans-serif' }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    this.textWidth = width;
    this.textHeight = height;

    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.05) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    this.mesh.setParent(this.plane);
    this.onResize();
  }

  onResize() {
    if (!this.mesh || !this.textHeight) return;
    const aspect = this.textWidth / this.textHeight;
    const relHeight = 0.185;
    const planeAspect = (this.plane.scale.y || 1) / (this.plane.scale.x || 1);
    const relWidth = relHeight * aspect * planeAspect;
    this.mesh.scale.set(relWidth, relHeight, 1);
    this.mesh.position.y = -0.5 - relHeight * 0.65 - 0.05;
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0.08,
    font,
    itemData
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.itemData = itemData;

    this.speed = 0;
    this.isBefore = false;
    this.isAfter = false;

    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    // 16x10 placeholder texture to prevent errors before image loads
    const dummy = document.createElement('canvas');
    dummy.width = 16;
    dummy.height = 10;
    const ctx = dummy.getContext('2d');
    ctx.fillStyle = '#0b1e4a';
    ctx.fillRect(0, 0, 16, 10);

    const texture = new Texture(this.gl, {
      generateMipmaps: false,
      image: dummy
    });

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec4 color = texture2D(tMap, vUv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(color.rgb, color.a * alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [800, 500] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });

    const img = new Image();
    if (this.image.startsWith('http') || this.image.startsWith('//')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      texture.image = img;
      texture.needsUpdate = true;
      const nw = img.naturalWidth || 800;
      const nh = img.naturalHeight || 500;
      this.program.uniforms.uImageSizes.value = [nw, nh];
    };
    img.onerror = () => {
      if (this.itemData && this.itemData.fallbackImage && img.src !== this.itemData.fallbackImage) {
        img.src = this.itemData.fallbackImage;
      }
    };
    img.src = this.image;
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font
    });
  }

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(Math.max(0, R * R - effectiveX * effectiveX));
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(Math.min(1, effectiveX / R));
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(Math.min(1, effectiveX / R));
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    const heightFraction = (this.screen && this.screen.width < 768) ? 0.50 : 0.56;
    this.plane.scale.y = this.viewport.height * heightFraction;
    this.plane.scale.x = this.plane.scale.y * 1.35;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

    if (this.title) {
      this.title.onResize();
    }

    this.padding = this.plane.scale.x * 0.06;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class AppCore {
  constructor(
    container,
    {
      items,
      bend = 3,
      textColor = '#0b1e4a',
      borderRadius = 0.08,
      font = '600 26px "Poppins", sans-serif',
      scrollSpeed = 2,
      scrollEase = 0.04,
      onItemClick
    }
  ) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.onItemClick = onItemClick;

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.renderer.gl.canvas.style.display = 'block';
    this.renderer.gl.canvas.style.width = '100%';
    this.renderer.gl.canvas.style.height = '100%';
    this.container.appendChild(this.renderer.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    });
  }

  createMedias(items, bend = 3, textColor, borderRadius, font) {
    const rawItems = items && items.length ? items : [];
    // Ensure sufficient items to wrap seamlessly across the viewport
    let list = [...rawItems];
    while (list.length < 12 && list.length > 0) {
      list = list.concat(rawItems);
    }
    this.mediasImages = list;
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        itemData: data
      });
    });
  }

  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    this.startX = clientX;
    this.startY = clientY;
    this.startTime = Date.now();
  }

  onTouchMove(e) {
    if (!this.isDown) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const distance = (this.startX - clientX) * (this.scrollSpeed * 0.025);
    this.scroll.target = (this.scroll.position ?? 0) + distance;
  }

  onTouchUp(e) {
    if (!this.isDown) return;
    this.isDown = false;
    this.onCheck();

    // Check if interaction was a tap/click rather than a swipe
    const clientX = e && ('changedTouches' in e ? e.changedTouches[0].clientX : e.clientX);
    const clientY = e && ('changedTouches' in e ? e.changedTouches[0].clientY : e.clientY);
    if (clientX !== undefined && clientY !== undefined && this.startX !== undefined) {
      const dist = Math.hypot(clientX - this.startX, clientY - this.startY);
      const duration = Date.now() - (this.startTime || 0);
      if (dist < 8 && duration < 400 && this.onItemClick && this.medias && this.medias.length) {
        this.detectClick(clientX);
      }
    }
  }

  detectClick(clientX) {
    const rect = this.container.getBoundingClientRect();
    const relX = (clientX - rect.left) / rect.width - 0.5;
    const clickX = relX * this.viewport.width;

    // Find plane closest to the click point
    let closestMedia = null;
    let minDist = Infinity;
    for (const media of this.medias) {
      const planeX = media.plane.position.x;
      const halfW = media.plane.scale.x / 2;
      const dist = Math.abs(planeX - clickX);
      if (dist < halfW * 1.1 && dist < minDist) {
        minDist = dist;
        closestMedia = media;
      }
    }

    if (closestMedia && closestMedia.itemData) {
      this.onItemClick(closestMedia.itemData, closestMedia.index);
    }
  }

  onWheel(e) {
    // Only intercept horizontal or vertical delta when hovering over the gallery
    const delta = e.deltaX !== 0 ? e.deltaX : (e.deltaY || e.wheelDelta || e.detail);
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.25;
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(this.scroll.target / width);
    this.scroll.target = itemIndex * width;
  }

  onResize() {
    if (!this.container) return;
    this.screen = {
      width: this.container.clientWidth || window.innerWidth,
      height: this.container.clientHeight || 500
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / Math.max(this.screen.height, 1)
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.scene) {
      this.scene.position.y = height * 0.06;
    }
    if (this.medias) {
      this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }

  reset() {
    this.scroll.target = 0;
  }

  scrollToIndex(index) {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    this.scroll.target = index * width;
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);

    window.addEventListener('resize', this.boundOnResize);
    this.container.addEventListener('wheel', this.boundOnWheel, { passive: true });
    this.container.addEventListener('mousedown', this.boundOnTouchDown);
    this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });

    window.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    window.addEventListener('touchmove', this.boundOnTouchMove, { passive: true });
    window.addEventListener('touchend', this.boundOnTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.boundOnResize);
    window.removeEventListener('mousemove', this.boundOnTouchMove);
    window.removeEventListener('mouseup', this.boundOnTouchUp);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnTouchUp);

    if (this.container) {
      this.container.removeEventListener('wheel', this.boundOnWheel);
      this.container.removeEventListener('mousedown', this.boundOnTouchDown);
      this.container.removeEventListener('touchstart', this.boundOnTouchDown);
    }

    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
      const ext = this.renderer.gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }
  }
}

/**
 * CircularGallery React Component
 */
export const CircularGallery = forwardRef(function CircularGallery(
  {
    items,
    bend = 3,
    textColor = '#20285b',
    borderRadius = 0.08,
    font = '700 42px "Poppins", sans-serif',
    scrollSpeed = 2,
    scrollEase = 0.04,
    className = '',
    onItemClick,
    initialIndex = 0
  },
  ref
) {
  const containerRef = useRef(null);
  const appRef = useRef(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (appRef.current) appRef.current.reset();
    },
    scrollToIndex: (idx) => {
      if (appRef.current) appRef.current.scrollToIndex(idx);
    }
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new AppCore(containerRef.current, {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
      onItemClick
    });

    appRef.current = app;

    if (initialIndex > 0) {
      app.scrollToIndex(initialIndex);
    }

    // ResizeObserver ensures seamless adaptation if container size shifts
    const ro = new ResizeObserver(() => {
      app.onResize();
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      app.destroy();
      appRef.current = null;
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, onItemClick]);

  return (
    <div
      ref={containerRef}
      className={`circular-gallery-canvas-wrap ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'grab'
      }}
    />
  );
});

export default CircularGallery;
