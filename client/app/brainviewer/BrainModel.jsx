'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';

const BrainModel = ({ 
  vertices, 
  faces, 
  activationData, 
  currentTimeIndex = 0, 
  colorScale = 'rainbow', 
  scale = 1 
}) => {
  const meshRef = useRef();
  const { camera } = useThree();
  const [hovered, setHover] = useState(false);
  const [clicked, setClick] = useState(false);
  const [hoveredVertex, setHoveredVertex] = useState(null);
  
  // Generate sample data if no activation data is provided
  const effectiveActivationData = useMemo(() => {
    if (activationData && activationData.length > 0) return activationData;
    
    // Generate sample data if none provided
    if (!vertices || vertices.length === 0) return [];
    
    // Create 100 time points of sample activation data
    const sampleData = [];
    for (let t = 0; t < 100; t++) {
      const timePoint = [];
      // For each vertex
      for (let i = 0; i < vertices.length; i++) {
        // Create a traveling wave pattern
        const x = vertices[i][0];
        const y = vertices[i][1];
        const z = vertices[i][2];
        const distance = Math.sqrt(x*x + y*y + z*z);
        const wave = Math.sin(distance * 5 - t * 0.1) * 0.5 + 0.5;
        timePoint.push(wave);
      }
      sampleData.push(timePoint);
    }
    return sampleData;
  }, [vertices, activationData]);

  // Convert vertices and faces to Three.js format
  const geometry = useMemo(() => {
    if (!vertices || !faces) return null;

    const geometry = new THREE.BufferGeometry();

    // Create vertices
    const vertexArray = new Float32Array(vertices.flat());
    geometry.setAttribute('position', new THREE.BufferAttribute(vertexArray, 3));

    // Create faces
    const indices = new Uint32Array(faces.flat());
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    // Calculate normals for proper lighting
    geometry.computeVertexNormals();

    return geometry;
  }, [vertices, faces]);

  // Color mapping functions for different color scales
  const getColor = useMemo(() => {
    const colorFunctions = {
      // Rainbow color scale (blue -> cyan -> green -> yellow -> red)
      rainbow: (value) => {
        const a = (1 - value) * 4; // 0->4
        const X = Math.floor(a);
        const Y = Math.floor(255 * (a - X));
        let r, g, b;
        
        switch (X) {
          case 0: r = 255; g = Y; b = 0; break;
          case 1: r = 255 - Y; g = 255; b = 0; break;
          case 2: r = 0; g = 255; b = Y; break;
          case 3: r = 0; g = 255 - Y; b = 255; break;
          case 4: r = 0; g = 0; b = 255; break;
        }
        
        return [r / 255, g / 255, b / 255];
      },
      
      // Heat map (black -> red -> yellow -> white)
      heatmap: (value) => {
        let r, g, b;
        
        if (value < 0.33) {
          // Black to Red
          r = value * 3;
          g = 0;
          b = 0;
        } else if (value < 0.66) {
          // Red to Yellow
          r = 1;
          g = (value - 0.33) * 3;
          b = 0;
        } else {
          // Yellow to White
          r = 1;
          g = 1;
          b = (value - 0.66) * 3;
        }
        
        return [r, g, b];
      },
      
      // Blue to Red (cool to hot)
      blueRed: (value) => {
        return [
          value,           // Red increases with value
          0,               // No green
          1 - value        // Blue decreases with value
        ];
      }
    };
    
    // Default to rainbow if colorScale is not recognized
    return colorFunctions[colorScale] || colorFunctions.rainbow;
  }, [colorScale]);

  // Create color attribute based on activation data
  useEffect(() => {
    if (!geometry || !effectiveActivationData || effectiveActivationData.length === 0) return;

    // Use the activation data for the current time point
    const currentActivation = effectiveActivationData[currentTimeIndex % effectiveActivationData.length];
    if (!currentActivation) return;

    // Create color buffer
    const colors = new Float32Array(vertices.length * 3);
    
    // Find min and max for color scaling
    const min = Math.min(...currentActivation);
    const max = Math.max(...currentActivation);
    const range = max - min;

    // Set color for each vertex based on activation value
    for (let i = 0; i < currentActivation.length; i++) {
      const value = currentActivation[i];
      const normalizedValue = range !== 0 ? (value - min) / range : 0;
      
      // Apply the selected color scale
      const [r, g, b] = getColor(normalizedValue);

      const idx = i * 3;
      colors[idx] = r;
      colors[idx + 1] = g;
      colors[idx + 2] = b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }, [geometry, activationData, currentTimeIndex, vertices]);

  // No automatic rotation on hover
  // Removing the rotation logic that was previously here

  if (!geometry) return null;

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          // Get the vertex index
          const vertexIndex = e.face.a;
          setHoveredVertex({
            position: e.point,
            value: activationData && currentTimeIndex < activationData.length 
                   ? activationData[currentTimeIndex][vertexIndex]
                   : 0
          });
        }}
        onPointerOut={() => {
          setHover(false);
          setHoveredVertex(null);
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          setClick(!clicked);
        }}
        scale={clicked ? 1.1 : 1}
      >
        <meshStandardMaterial 
          color="white"
          emissive="white"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.1}
          wireframe={false}
        />
      </mesh>

      {hoveredVertex && (
        <Html position={hoveredVertex.position}>
          <div className="p-2 bg-white rounded shadow text-xs">
            Value: {hoveredVertex.value !== undefined && hoveredVertex.value !== null 
                    ? hoveredVertex.value.toFixed(2) 
                    : 'N/A'}
          </div>
        </Html>
      )}
    </group>
  );
};

export default BrainModel;
