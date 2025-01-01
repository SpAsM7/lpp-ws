"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function AuthAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Setup
    const scene = new THREE.Scene();
    
    // Calculate camera frustum based on aspect ratio
    const aspect = width / height;
    const frustumSize = 2;
    const camera = new THREE.OrthographicCamera(
      -1, 1, 1, -1, 0.1, 10 // Use simpler frustum
    );

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

    renderer.setPixelRatio(1); // Force pixel ratio to 1 for consistency
    renderer.setSize(width, height, false); // false to prevent auto-scaling
    container.appendChild(renderer.domElement);

    // Create shader material
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(width, height) },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_aspect: { value: aspect }
      },
      fragmentShader: `
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_time;
        uniform float u_aspect;

        vec4 wave(vec2 uv, float speed, float height, vec3 col) {
            // Adjust UV coordinates to account for aspect ratio
            uv.x *= u_aspect;
            
            float taper = abs(uv.x) * 1.;
            uv.y += smoothstep(1., 0., taper) * sin(u_time * speed + uv.x * height) * .2;
            float alpha = smoothstep(0.073 * smoothstep(.1, .9, taper),
              0.,
              abs(uv.y)*(1.-0.073) - .2*0.082)
              * smoothstep(1., .1, abs(uv.x));
            return vec4(col * 1.5, alpha * 0.5);
        }

        void main() {
            // Center and normalize coordinates
            vec2 uv = (gl_FragCoord.xy - u_resolution.xy * 0.5) / min(u_resolution.x, u_resolution.y);
            
            vec4 color = vec4(0.);
            
            vec3[] colors = vec3[](
              vec3(0.83, 0.20, 0.57),
              vec3(0.96, 0.25, 0.52),
              vec3(1.0, 0.41, 0.45),
              vec3(1.0, 0.54, 0.41)
            );
            
            for (int i = 1; i <= 5; i++) {
                float t = float(i) / 5.0;
                vec4 l = wave(
                  uv * vec2(1.5, 4.0),
                  0.3 + t * 0.3,
                  4.5 * t,
                  colors[i % 4] * vec3(.2 + t * .7, .2 + t * .4, 1.0 * t)
                );
                color += l;
            }
            
            gl_FragColor = color;
        }
      `,
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    // Create mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, shaderMaterial);
    scene.add(mesh);
    camera.position.z = 1;

    // Animation
    let animationFrameId: number;
    const animate = () => {
      shaderMaterial.uniforms.u_time.value += 0.01;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      shaderMaterial.uniforms.u_mouse.value.set(x, y);
    };
    container.addEventListener("mousemove", handleMouseMove);

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      const newAspect = newWidth / newHeight;
      
      renderer.setSize(newWidth, newHeight, false);
      shaderMaterial.uniforms.u_resolution.value.set(newWidth, newHeight);
      shaderMaterial.uniforms.u_aspect.value = newAspect;
    };
    window.addEventListener("resize", handleResize);

    // Initial resize
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      shaderMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="h-full w-full overflow-hidden flex items-center justify-center"
      style={{ 
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        transform: 'translate(0, 0)', // Force GPU acceleration
        willChange: 'transform' // Optimize for animations
      }}
    />
  );
}
