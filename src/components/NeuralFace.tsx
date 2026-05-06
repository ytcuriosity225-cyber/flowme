"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface NeuralFaceProps {
  isScanning?: boolean;
  isSuccess?: boolean;
  inputActive?: boolean; // When user is typing — accelerate rotation
}

export function NeuralFace({ isScanning = false, isSuccess = false, inputActive = false }: NeuralFaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const stateRef = useRef({ isScanning, isSuccess, inputActive });

  // Keep state ref updated without re-creating the scene
  useEffect(() => {
    stateRef.current = { isScanning, isSuccess, inputActive };
  }, [isScanning, isSuccess, inputActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 0.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Theme color ---
    function getThemeColor(): THREE.Color {
      if (typeof document === "undefined") return new THREE.Color(0x00ff41);
      const style = getComputedStyle(document.documentElement);
      const hex = style.getPropertyValue("--neon-primary").trim() || "#00FF41";
      return new THREE.Color(hex);
    }

    const baseColor = getThemeColor();
    const glowColor = baseColor.clone().multiplyScalar(1.5);
    const dimColor = baseColor.clone().multiplyScalar(0.4);

    // --- Build the head (high-poly sphere + face deformation) ---
    const headGeometry = new THREE.SphereGeometry(1, 64, 48);
    const positions = headGeometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      let newY = y * 1.38;
      let newZ = z;
      let newX = x;

      // Flatten the front face area gently
      if (z > 0.3 && Math.abs(x) < 0.7 && y > -0.5 && y < 0.6) {
        newZ = z * 0.82;
      }

      // Nose bridge and tip
      if (z > 0.5 && Math.abs(x) < 0.12 && y > -0.15 && y < 0.2) {
        newZ = z + 0.15;
      }

      // Eye socket indentations (deeper)
      if (z > 0.4 && Math.abs(x) > 0.18 && Math.abs(x) < 0.42 && y > 0.05 && y < 0.32) {
        newZ = z - 0.12;
      }

      // Cheekbone lift
      if (z > 0.3 && Math.abs(x) > 0.45 && Math.abs(x) < 0.7 && y > -0.1 && y < 0.2) {
        newZ = z + 0.06;
      }

      // Brow ridge
      if (z > 0.5 && Math.abs(x) < 0.5 && y > 0.28 && y < 0.4) {
        newZ = z + 0.05;
        newY = newY + 0.02;
      }

      // Chin narrowing + jaw definition
      if (y < -0.4) {
        const chinFactor = 1 - Math.abs(y + 0.4) * 0.55;
        newX = x * Math.max(0.55, chinFactor);
        // Slight chin protrusion
        if (z > 0.3 && Math.abs(x) < 0.25 && y > -0.7) {
          newZ = z + 0.06;
        }
      }

      // Temple indentation
      if (Math.abs(x) > 0.7 && y > 0.2 && y < 0.6) {
        newX = x * 0.92;
      }

      positions.setXYZ(i, newX, newY, newZ);
    }

    headGeometry.computeVertexNormals();

    // Store original positions for vertex jitter effect
    const originalPositions = new Float32Array(positions.array);

    // --- Neck & shoulders ---
    const neckGeometry = new THREE.CylinderGeometry(0.32, 0.42, 0.7, 20, 4, true);
    const shoulderGeometry = new THREE.BoxGeometry(2.4, 0.25, 0.75, 16, 2, 8);
    const shoulderPositions = shoulderGeometry.attributes.position;

    for (let i = 0; i < shoulderPositions.count; i++) {
      const x = shoulderPositions.getX(i);
      const y = shoulderPositions.getY(i);
      const distFromCenter = Math.abs(x);
      if (distFromCenter > 0.6) {
        const dropFactor = (distFromCenter - 0.6) * 0.45;
        shoulderPositions.setY(i, y - dropFactor);
      }
    }

    // --- Point cloud materials ---
    const pointMaterial = new THREE.PointsMaterial({
      color: baseColor,
      size: 0.02,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: baseColor,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });

    // Glow point material (brighter, larger points for key vertices)
    const glowPointMaterial = new THREE.PointsMaterial({
      color: glowColor,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    // --- Assemble group ---
    const group = new THREE.Group();

    // Head
    const headPoints = new THREE.Points(headGeometry, pointMaterial.clone());
    const headWire = new THREE.Mesh(headGeometry, wireMaterial.clone());
    const headGlow = new THREE.Points(headGeometry, glowPointMaterial.clone());
    group.add(headPoints);
    group.add(headWire);
    group.add(headGlow);

    // Neck
    const neckPoints = new THREE.Points(neckGeometry, pointMaterial.clone());
    const neckWire = new THREE.Mesh(neckGeometry, wireMaterial.clone());
    neckPoints.position.y = -1.65;
    neckWire.position.y = -1.65;
    group.add(neckPoints);
    group.add(neckWire);

    // Shoulders
    const shoulderPoints = new THREE.Points(shoulderGeometry, pointMaterial.clone());
    const shoulderWire = new THREE.Mesh(shoulderGeometry, wireMaterial.clone());
    shoulderPoints.position.y = -2.05;
    shoulderWire.position.y = -2.05;
    group.add(shoulderPoints);
    group.add(shoulderWire);

    scene.add(group);

    // --- Neural connection lines (random connections between nearby vertices) ---
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0.04,
    });
    const connectionPoints: number[] = [];
    const posArray = positions.array as Float32Array;

    for (let i = 0; i < positions.count; i += 3) {
      for (let j = i + 3; j < Math.min(i + 15, positions.count); j += 3) {
        const dx = posArray[i * 3] - posArray[j * 3];
        const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
        const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 0.25 && Math.random() > 0.7) {
          connectionPoints.push(
            posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2],
            posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2]
          );
        }
      }
    }

    if (connectionPoints.length > 0) {
      const connectionGeometry = new THREE.BufferGeometry();
      connectionGeometry.setAttribute("position", new THREE.Float32BufferAttribute(connectionPoints, 3));
      const connectionLines = new THREE.LineSegments(connectionGeometry, connectionMaterial);
      group.add(connectionLines);
    }

    // --- Scan ring ---
    const scanRingGeometry = new THREE.RingGeometry(1.4, 1.45, 80);
    const scanRingMaterial = new THREE.MeshBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const scanRing = new THREE.Mesh(scanRingGeometry, scanRingMaterial);
    scanRing.position.z = 0.5;
    scene.add(scanRing);

    // --- Floating ambient particles ---
    const particleCount = 350;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.6 + Math.random() * 1.8;
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = (r * Math.cos(phi)) * 1.3;
      particlePositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      particleSpeeds[i] = 0.5 + Math.random() * 1.5;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: baseColor,
      size: 0.015,
      transparent: true,
      opacity: 0.25,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Orbital rings ---
    const ring1Geometry = new THREE.TorusGeometry(2, 0.005, 8, 128);
    const ring1Material = new THREE.MeshBasicMaterial({ color: dimColor, transparent: true, opacity: 0.15 });
    const ring1 = new THREE.Mesh(ring1Geometry, ring1Material);
    ring1.rotation.x = Math.PI / 2.2;
    scene.add(ring1);

    const ring2Geometry = new THREE.TorusGeometry(2.3, 0.003, 8, 128);
    const ring2Material = new THREE.MeshBasicMaterial({ color: dimColor, transparent: true, opacity: 0.08 });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.x = Math.PI / 1.8;
    ring2.rotation.z = 0.3;
    scene.add(ring2);

    // --- Animation Loop ---
    let time = 0;
    let currentRotSpeed = 0.5;
    let targetRotSpeed = 0.5;

    function animate() {
      time += 0.008;
      frameRef.current = requestAnimationFrame(animate);

      const state = stateRef.current;

      // Dynamic rotation speed
      if (state.isScanning || state.inputActive) {
        targetRotSpeed = 3.0; // War-Speed
      } else if (state.isSuccess) {
        targetRotSpeed = 0.8;
      } else {
        targetRotSpeed = 0.5;
      }
      currentRotSpeed += (targetRotSpeed - currentRotSpeed) * 0.05;

      // Smooth rotation
      group.rotation.y = Math.sin(time * currentRotSpeed) * 0.35;
      group.rotation.x = Math.sin(time * currentRotSpeed * 0.6) * 0.06;

      // Vertex jitter when scanning/input active
      if (state.isScanning || state.inputActive) {
        const jitterAmount = state.isScanning ? 0.015 : 0.008;
        for (let i = 0; i < positions.count; i++) {
          positions.setXYZ(
            i,
            originalPositions[i * 3] + (Math.random() - 0.5) * jitterAmount,
            originalPositions[i * 3 + 1] + (Math.random() - 0.5) * jitterAmount,
            originalPositions[i * 3 + 2] + (Math.random() - 0.5) * jitterAmount
          );
        }
        positions.needsUpdate = true;
      }

      // Glow intensity
      const glowMat = headGlow.material as THREE.PointsMaterial;
      if (state.isSuccess) {
        glowMat.opacity = 0.8 + Math.sin(time * 3) * 0.2;
        glowMat.size = 0.05;
      } else if (state.isScanning) {
        glowMat.opacity = 0.4 + Math.sin(time * 5) * 0.3;
        glowMat.size = 0.035;
      } else {
        glowMat.opacity = 0.15 + Math.sin(time * 2) * 0.1;
        glowMat.size = 0.025;
      }

      // Particles
      particles.rotation.y = time * 0.12;
      particles.rotation.x = Math.sin(time * 0.15) * 0.08;

      // Orbital rings
      ring1.rotation.z = time * 0.3;
      ring2.rotation.z = -time * 0.2;

      // Scan ring
      if (state.isScanning) {
        scanRingMaterial.opacity = 0.6 + Math.sin(time * 4) * 0.3;
        scanRing.position.y = Math.sin(time * 2.5) * 1.8;
        scanRing.scale.setScalar(1 + Math.sin(time * 3) * 0.15);
      } else {
        scanRingMaterial.opacity *= 0.93;
      }

      renderer.render(scene, camera);
    }

    animate();

    // --- Handle resize ---
    function onResize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // Only run once — state changes are tracked via ref

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: "320px" }}
    />
  );
}
