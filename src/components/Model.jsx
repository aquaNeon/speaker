import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xD1d1d1,
  metalness: 1,
  roughness: 0.85,
  clearcoat: 0.2,
  reflectivity: 0.9,
  clearcoatRoughness: 0.35,
});

const buttonsMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xFF0000,
  metalness: 0,
  roughness: 0.55,
  clearcoat: 0.2,
  reflectivity: 0.9,
  clearcoatRoughness: 0.15,
});

const textMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xb4b4b4,
  metalness: 0,
  roughness: 0.55,
  clearcoat: 0.2,
  reflectivity: 0.9,
  clearcoatRoughness: 0.15,
});


const emissionMaterial = new THREE.MeshPhysicalMaterial({
  emissive: 0x00FF00,
  emissiveIntensity: 3,
});

const dialMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xe4e4FF,
  metalness: 1,
  roughness: 0.55,
  clearcoat: 0.2,
  reflectivity: 0.9,
  clearcoatRoughness: 0.15,
});

const glossySteelMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xD1d1d1,
  metalness: 1,
  roughness: 0.1,
  clearcoat: 0.2,
  reflectivity: 0.2,
  clearcoatRoughness: 0.15,
});

const roughSteelMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x9b9b9b,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 0.5,
  reflectivity: 0.25,
  clearcoatRoughness: 0.05,
});



export function Model({ setOrbitControlsEnabled, ...props }) {
  const { nodes, materials } = useGLTF('/models/mojang3.glb');
  const antennaeRef = useRef();
  const dialRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [rotationZ, setRotationZ] = useState(-1.558); // Initial Z rotation
  const [rotationY, setRotationY] = useState(0.395); // Initial Y rotation
  const [dialRotation, setDialRotation] = useState(0);
  const [startAngle, setStartAngle] = useState(0);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      const movementX = e.movementX || e.nativeEvent.movementX;
      const movementY = e.movementY || e.nativeEvent.movementY;
      
      // Update Z rotation (about 15 degrees movement)
      const newRotationZ = rotationZ + movementX * 0.005; // Reduced from 0.01
      setRotationZ(Math.max(-1.558 - 0.13, Math.min(-1.558 + 0.13, newRotationZ))); // Changed from 0.26 to 0.13 (about 7.5 degrees each way)
      
      // Update Y rotation (reduced to prevent cutting through the model)
      const newRotationY = rotationY - movementY * 0.003; // Reduced from 0.005
      setRotationY(Math.max(0.395 - 0.13, Math.min(0.395 + 0.13, newRotationY))); // Changed from 0.26 to 0.13
    }
  };

  const handleDialPointerDown = useCallback((e) => {
    e.stopPropagation();
    setIsDragging(true);
    setOrbitControlsEnabled(false);
    const angle = Math.atan2(e.point.z, e.point.x);
    setStartAngle(angle - dialRotation);
  }, [setOrbitControlsEnabled, dialRotation]);

  const handleDialPointerUp = useCallback(() => {
    setIsDragging(false);
    setOrbitControlsEnabled(true);
  }, [setOrbitControlsEnabled]);

  const handleDialPointerMove = useCallback((e) => {
    if (isDragging) {
      const angle = Math.atan2(e.point.z, e.point.x);
      const newRotation = angle - startAngle;
      setDialRotation(newRotation);
    }
  }, [isDragging, startAngle]);

  useFrame(() => {
    if (dialRef.current) {
      dialRef.current.rotation.y = dialRotation;
    }
    // Keep any existing frame updates for antennae here
  });

  useEffect(() => {
    document.addEventListener('pointerup', handlePointerUp);
    return () => {
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <group {...props} dispose={null}>
      <mesh 
        ref={antennaeRef}
        geometry={nodes.Antennae.geometry} 
        material={glossySteelMaterial} 
        position={[-0.881, 0.505, -0.213]} 
        rotation={[1.526, rotationY, rotationZ]} 
        scale={[0.009, 0.007, 0.009]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      />
      <mesh geometry={nodes.Back.geometry} material={bodyMaterial} position={[-0.383, 0.055, -0.07]} scale={[1, 1, 0.673]} />
      <mesh geometry={nodes.Battery.geometry} material={bodyMaterial} position={[0.507, -0.074, -0.237]} scale={[0.244, 0.433, 0.044]} />
      <mesh geometry={nodes.Bottom.geometry} material={bodyMaterial} position={[-0.002, -0.479, 0.064]} />
      <mesh 
        ref={dialRef}
        geometry={nodes.Dial.geometry} 
        material={dialMaterial} 
        position={[0.656, 0.503, 0.19]} 
        rotation={[Math.PI / 2, 0, 0]} 
        scale={[0.11, 0.016, 0.097]}
        onPointerDown={handleDialPointerDown}
        onPointerUp={handleDialPointerUp}
        onPointerMove={handleDialPointerMove}
      />
      <mesh geometry={nodes.FM_Line.geometry} material={buttonsMaterial} position={[0.44, 0.2, 0.308]} rotation={[Math.PI, 0, Math.PI]} scale={[-0.014, -0.002, 0]} />
      <group position={[0.44, -0.315, 0.307]} rotation={[Math.PI / 2, 0, 0]} scale={0.007}>
        <mesh geometry={nodes.Torus004.geometry} material={roughSteelMaterial} />
        <mesh geometry={nodes.Torus004_1.geometry} material={emissionMaterial} />
      </group>
      <mesh geometry={nodes.GlassFront.geometry} material={materials.M_GlassTransparent} position={[0.44, 0.055, 0.308]} scale={[1, 1, 0.518]} />
      <group position={[-0.383, 0.055, 0]}>
        <mesh geometry={nodes.Cube026.geometry} material={bodyMaterial} />
        <mesh geometry={nodes.Cube026_1.geometry} material={materials.M_PlasticRoughDark} />
      </group>
      <group position={[-0.881, 0.499, -0.213]} rotation={[0, 1.497, 0]} scale={[0.009, 0.007, 0.009]}>
        <mesh geometry={nodes.Cylinder015.geometry} material={glossySteelMaterial} />
        <mesh geometry={nodes.Cylinder015_1.geometry} material={glossySteelMaterial} />
      </group>
      <group position={[-0.383, 0.055, 0]}>
        <mesh geometry={nodes.Cube027.geometry} material={bodyMaterial} />
        <mesh geometry={nodes.Cube027_1.geometry} material={bodyMaterial} />
      </group>
      <mesh geometry={nodes.Screws.geometry} material={roughSteelMaterial} position={[0.406, 0.054, -0.249]} rotation={[Math.PI / 2, 0, 0]} scale={1.217} />
      <mesh geometry={nodes.speaker.geometry} material={bodyMaterial} position={[-0.383, 0.055, 0]} />
      <mesh geometry={nodes.TEXT.geometry} material={textMaterial} position={[0.551, 0.31, 0.308]} rotation={[Math.PI, 0, Math.PI]} scale={[-0.029, -0.002, 0]} />
    </group>
  );
}

useGLTF.preload('/models/mojang3.glb');

