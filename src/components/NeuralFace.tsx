"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface NeuralFaceProps {
  isScanning?: boolean;
  isSuccess?: boolean;
}

export function NeuralFace({ isScanning = false, isSuccess = false }: NeuralFaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.5;
    camera.position.y = 0.3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Build the head (elongated sphere + face deformation) ---
    const headGeometry = new THREE.SphereGeometry(1, 48, 36);
    const positions = headGeometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      // Elongate vertically (skull shape)
      let newY = y * 1.35;

      // Flatten the front face area
      let newZ = z;
      if (z > 0.3 && Math.abs(x) < 0.7 && y > -0.5 && y < 0.6) {
        newZ = z * 0.85;
      }

      // Nose protrusion
      if (z > 0.5 && Math.abs(x) < 0.15 && y > -0.2 && y < 0.15) {
        newZ = z + 0.12;
      }

      // Eye socket indentations
      if (z > 0.4 && Math.abs(x) > 0.15 && Math.abs(x) < 0.4 && y > 0.05 && y < 0.3) {
        newZ = z - 0.08;
      }

      // Chin narrowing
      if (y < -0.4) {
        const chinFactor = 1 - (Math.abs(y + 0.4) * 0.5);
        const narrowX = x * Math.max(0.6, chinFactor);
        positions.setXYZ(i, narrowX, newY, newZ);
      } else {
        positions.setXYZ(i, x, newY, newZ);
      }
    }

    headGeometry.computeVertexNormals();

    // --- Neck & shoulders geometry ---
    const neckGeometry = new THREE.CylinderGeometry(0.35, 0.45, 0.6, 16, 4, true);
    const shoulderGeometry = new THREE.BoxGeometry(2.2, 0.3, 0.8, 12, 2, 6);
    const shoulderPositions = shoulderGeometry.attributes.position;

    // Round the shoulders
    for (let i = 0; i < shoulderPositions.count; i++) {
      const x = shoulderPositions.getX(i);
      const y = shoulderPositions.getY(i);
      const z = shoulderPositions.getZ(i);
      const distFromCenter = Math.abs(x);
      if (distFromCenter > 0.6) {
        const dropFactor = (distFromCenter - 0.6) * 0.4;
        shoulderPositions.setY(i, y - dropFactor);
      }
    }

    // --- Create point cloud material ---
    function getThemeColor(): THREE.Color {
      if (typeof document === "undefined") return new THREE.Color(0x00ff41);
      const style = getComputedStyle(document.documentElement);
      const hex = style.getPropertyValue("--neon-primary").trim() || "#00FF41";
      return new THREE.Color(hex);
    }

    const baseColor = getThemeColor();

    const pointMaterial = new THREE.PointsMaterial({
      color: baseColor,
      size: 0.018,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: baseColor,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });

    // --- Assemble the group ---
    const group = new THREE.Group();

    // Head
    const headPoints = new THREE.Points(headGeometry, pointMaterial.clone());
    const headWire = new THREE.Mesh(headGeometry, wireMaterial.clone());
    group.add(headPoints);
    group.add(headWire);

    // Neck
    const neckPoints = new THREE.Points(neckGeometry, pointMaterial.clone());
    const neckWire = new THREE.Mesh(neckGeometry, wireMaterial.clone());
    neckPoints.position.y = -1.6;
    neckWire.position.y = -1.6;
    group.add(neckPoints);
    group.add(neckWire);

    // Shoulders
    const shoulderPoints = new THREE.Points(shoulderGeometry, pointMaterial.clone());
    const shoulderWire = new THREE.Mesh(shoulderGeometry, wireMaterial.clone());
    shoulderPoints.position.y = -2.0;
    shoulderWire.position.y = -2.0;
    group.add(shoulderPoints);
    group.add(shoulderWire);

    scene.add(group);

    // --- Scan line ring ---
    const scanRingGeometry = new THREE.RingGeometry(1.3, 1.35, 64);
    const scanRingMaterial = new THREE.MeshBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const scanRing = new THREE.Mesh(scanRingGeometry, scanRingMaterial);
    scanRing.position.z = 0.5;
    scene.add(scanRing);

    // --- Floating particles around the head ---
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.8 + Math.random() * 1.2;
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = (r * Math.cos(phi)) * 1.2;
      particlePositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: baseColor,
      size: 0.012,
      transparent: true,
      opacity: 0.3,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Animation Loop ---
    let time = 0;

    function animate() {
      time += 0.008;
      frameRef.current = requestAnimationFrame(animate);

      // Slow rotation
      group.rotation.y = Math.sin(time * 0.5) * 0.3;
      group.rotation.x = Math.sin(time * 0.3) * 0.05;

      // Floating particles rotation
      particles.rotation.y = time * 0.15;
      particles.rotation.x = Math.sin(time * 0.2) * 0.1;

      // Scan ring animation
      if (isScanning) {
        scanRingMaterial.opacity = 0.5 + Math.sin(time * 4) * 0.3;
        scanRing.position.y = Math.sin(time * 2) * 1.5;
        scanRing.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
      } else {
        scanRingMaterial.opacity *= 0.95;
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
      container.removeChild(renderer.domElement);
    };
  }, [isScanning, isSuccess]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: "320px" }}
    />
  );
}
