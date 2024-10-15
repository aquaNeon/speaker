import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, useTexture } from '@react-three/drei';
import { Model } from './Model.jsx';

const InteractiveRadio = () => {
  const ref = useRef();
  const texture = useTexture('src/assets/4.jpg');

  // useFrame(() => {
  //   if (ref.current) {
  //       // rotate torus 
  //       ref.current.rotation.y += 0.01;
  //   }
  // });

  return (
    <>
      <mesh ref={ref} position={[0, 0, 0.5]} scale={2} >
        <Model rotation={[Math.PI * 0.15, Math.PI *0.1, 0]} scale={1.5}/>
        {/* <MeshTransmissionMaterial 
          thickness={1.5}
          backsideThickness={1}
          chromaticAberration={0.2}
          backside={true}
        /> */}
      </mesh>
    </>
  );
};

const Experience = () => {
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <InteractiveRadio />
    </>
  );
};

export default Experience;
