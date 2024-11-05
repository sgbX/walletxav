/**
 * 3D rendering component of our Torrus.glb in our public folder.
 * Features:
 * -->animated rotations of the 3D torus
 * -->rendered using THREE.js
 */

import React, { useRef } from 'react';
import { MeshTransmissionMaterial, useGLTF, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';

export default function Model() {
  const { nodes } = useGLTF('/torrus.glb') as any; 
  const { viewport } = useThree();
  const torus = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (torus.current) {
      torus.current.rotation.x += 0.02;
    }
  });

  const materialProps = useControls({
    thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.2, min: 1, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.02, min: 0, max: 1 },
    backside: { value: true },
    distortionScale: { value: 0, min: 0, max: 1 }, 
    temporalDistortion: { value: 0, min: 0, max: 1 }, 
  });

  return (
    <group scale={viewport.width / 3.75}>
      <Text font={'/fonts/PPNeueMontreal-Bold.otf'} position={[0, 0, -1]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
      Welcome to WalletXav
      </Text>
      <mesh ref={torus} geometry={(nodes.Torus002 as THREE.Mesh).geometry}>
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </group>
  );
}