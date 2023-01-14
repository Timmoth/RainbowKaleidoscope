import * as THREE from "three";
import { useRef , useMemo} from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree} from "@react-three/fiber";
import React from "react";
import fragmentShader from "./fragmentShader.glsl"
import vertexShader from './vertexShader.glsl'

const ShaderPlane = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  const size = useThree(state => state.size)
  const viewport = useThree(state => state.viewport)

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 1.0,
      },
      u_size: {
        value: new THREE.Vector2(size.width, size.height)
      },
      u_pos: {
        value: new THREE.Vector2(0.001, 0.001)
      }
    }),
    []
  );

  useThree((state) => {
    uniforms.u_size.value.set(state.size.width, state.size.height);

    if(mesh.current != undefined){
      mesh.current.scale.x = state.viewport.width;
      mesh.current.scale.y = state.viewport.height;
    }
  })

  useFrame(({ camera, mouse }) => {
    uniforms.u_time.value += 0.01;
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0);
    vector.unproject(camera);
    if(Math.abs(vector.x * vector.y) > 0.00001){
      uniforms.u_pos.value.set(vector.x, vector.y);
    }
  })

  return (
    <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
              fragmentShader={fragmentShader}
              vertexShader={vertexShader}
              uniforms={uniforms}
              />
    </mesh>
  );
};

createRoot(document.getElementById("root") as HTMLElement).render(
    <Canvas>
      <ShaderPlane />
    </Canvas>
);