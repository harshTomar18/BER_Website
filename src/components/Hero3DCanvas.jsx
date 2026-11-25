import React, { useEffect, useRef } from 'react';
import { Camera, Renderer, Transform, Mesh, Plane, Program, Geometry } from 'ogl';

export default function Hero3DCanvas({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. WebGL Renderer with fallback and transparent canvas
    let renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2)
      });
    } catch (e) {
      console.warn('WebGL Renderer failed to initialize:', e);
      return;
    }

    const gl = renderer.gl;
    if (!gl) return;

    gl.clearColor(0, 0, 0, 0);

    const canvas = renderer.gl.canvas;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    // 2. Camera & Scene
    const camera = new Camera(gl, { fov: 46 });
    camera.position.set(0, 4.4, 13);
    camera.lookAt([0, 0, -2]);

    const scene = new Transform();

    // Mouse movement tracker with smooth lerp
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x;
      mouse.targetY = y;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ----------------------------------------------------
    // 3. MOTION CYBER WAVE GRID (Robust analytical shader, no fwidth dependency)
    // ----------------------------------------------------
    const gridGeometry = new Plane(gl, {
      width: 58,
      height: 44,
      widthSegments: 85,
      heightSegments: 70
    });

    const gridProgram = new Program(gl, {
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Organic undulating wave dynamics
          float w1 = sin(pos.x * 0.26 + uTime * 0.8) * cos(pos.y * 0.28 + uTime * 0.6) * 1.55;
          float w2 = sin(pos.x * 0.52 - uTime * 0.5 + pos.y * 0.38) * 0.75;
          float w3 = cos(length(pos.xy * 0.16) - uTime * 1.05) * 0.55;
          
          // Cursor proximity ripple
          float dist = distance(uv, uMouse * 0.42 + 0.5);
          float ripple = sin(dist * 13.0 - uTime * 3.4) * exp(-dist * 2.8) * 1.15;

          pos.z += w1 + w2 + w3 + ripple;
          vElevation = pos.z;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        varying vec2 vUv;
        varying float vElevation;
        uniform float uTime;

        void main() {
          // Robust analytical grid without fwidth dependency
          vec2 gridUv = fract(vUv * 36.0);
          vec2 distToLine = min(gridUv, 1.0 - gridUv);
          float lineDist = min(distToLine.x, distToLine.y);
          
          // High-contrast neon wire lines
          float gridAlpha = smoothstep(0.048, 0.0, lineDist);

          // Star nodes at wireframe intersections
          float nodeDist = length(distToLine);
          float nodeAlpha = smoothstep(0.09, 0.0, nodeDist);

          // Atmospheric horizon and vignette falloff
          float horizon = smoothstep(0.01, 0.35, vUv.y) * smoothstep(0.99, 0.62, vUv.y);
          float edge = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x);

          // Vivid Cyber Palette: Cyan, Electric Blue, Bright Amber-Orange
          vec3 cyan = vec3(0.0, 0.88, 1.0);
          vec3 electricBlue = vec3(0.12, 0.42, 0.98);
          vec3 orange = vec3(1.0, 0.42, 0.10);

          // Elevation-based radiant lighting
          float normElev = clamp((vElevation + 2.4) / 4.8, 0.0, 1.0);
          vec3 wireGlow = mix(electricBlue, cyan, normElev);
          wireGlow = mix(wireGlow, orange, pow(normElev, 2.8) * 0.8);

          // Bright intersection sparkle
          vec3 nodeGlow = mix(cyan, vec3(1.0), 0.45);

          vec3 finalColor = wireGlow * gridAlpha + nodeGlow * nodeAlpha * 1.35;
          float alpha = (gridAlpha * 0.88 + nodeAlpha * 0.75 + 0.04) * horizon * edge;

          if (alpha < 0.01) discard;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: [0, 0] }
      },
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    const gridMesh = new Mesh(gl, { geometry: gridGeometry, program: gridProgram });
    gridMesh.position.set(0, -2.5, -4.5);
    gridMesh.rotation.x = -Math.PI / 2.34;
    gridMesh.setParent(scene);

    // ----------------------------------------------------
    // 4. FLOATING 3D STAR CONSTELLATION & DATA STREAM PARTICLES
    // ----------------------------------------------------
    const particleCount = 280;
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 38;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 2;
      scales[i] = Math.random() * 0.9 + 0.4;

      if (Math.random() > 0.78) {
        colors[i * 3 + 0] = 1.0;
        colors[i * 3 + 1] = 0.45;
        colors[i * 3 + 2] = 0.12; // Orange accent
      } else {
        colors[i * 3 + 0] = 0.0;
        colors[i * 3 + 1] = 0.86;
        colors[i * 3 + 2] = 1.0;  // Neon cyan
      }
    }

    const particleGeometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      scale: { size: 1, data: scales },
      color: { size: 3, data: colors }
    });

    const particleProgram = new Program(gl, {
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute float scale;
        attribute vec3 color;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vec3 pos = position;
          
          // Floating cosmic drift
          pos.y += sin(uTime * 0.7 + pos.x * 0.4) * 0.45;
          pos.x += cos(uTime * 0.55 + pos.z * 0.3) * 0.35;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float size = (scale * 30.0) / -mvPosition.z;
          gl_PointSize = max(size, 2.0);
          vAlpha = sin(uTime * 2.2 + scale * 12.0) * 0.3 + 0.7;

          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragment: `
        precision highp float;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          
          float glow = smoothstep(0.5, 0.0, dist);
          float core = smoothstep(0.18, 0.0, dist);
          
          vec3 finalColor = mix(vColor, vec3(1.0), core * 0.7);
          float alpha = glow * vAlpha * 0.9;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthTest: false
    });

    const particleMesh = new Mesh(gl, {
      geometry: particleGeometry,
      program: particleProgram,
      mode: gl.POINTS
    });
    particleMesh.setParent(scene);

    // ----------------------------------------------------
    // 5. ANIMATION & RESIZE LOOP
    // ----------------------------------------------------
    let raf = 0;
    let time = 0;

    const onResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / Math.max(height, 1) });
    };

    window.addEventListener('resize', onResize);
    onResize();

    const update = () => {
      time += 0.022;

      // Mouse lerping for smooth inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.055;
      mouse.y += (mouse.targetY - mouse.y) * 0.055;

      gridProgram.uniforms.uTime.value = time;
      gridProgram.uniforms.uMouse.value = [mouse.x, mouse.y];
      particleProgram.uniforms.uTime.value = time;

      // Subtle dynamic camera parallax
      camera.position.x = mouse.x * 1.9;
      camera.position.y = 4.4 + mouse.y * 1.1;
      camera.lookAt([0, 0, -2]);

      renderer.render({ scene, camera });
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', onResize);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`hero-3d-bg ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}
