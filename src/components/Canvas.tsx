/**
 * This components is setting up the 3D scene using React three fiber 
 * As well as React three Drei
 * Features:
 * --> using Canvas to create a 3D rendering context
 * --> Renders the Model from our Model component
 * --> Environmeent component to add lighting and reflections
 */

'use client';
import { Canvas } from '@react-three/fiber';
import Model from '../components/Model';
import { Environment } from '@react-three/drei';

export default function Index() {
  return (
    <Canvas style={{ background: '#FFFFFF' }}>
      <Model />
      <directionalLight intensity={2} position={[0, 2, 3]} />
      <Environment preset="city" />
    </Canvas>
  );
}