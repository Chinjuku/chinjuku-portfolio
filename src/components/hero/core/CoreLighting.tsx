import React from "react";
import { Environment, Lightformer } from "@react-three/drei";

/** Studio lighting for the Core: softbox strips for chrome, faint icy rim on the neural core. */
export const CoreLighting: React.FC = () => (
  <>
    <ambientLight intensity={0.15} />
    <directionalLight position={[4, 6, 5]} intensity={1.2} color="#F4F6FA" />
    <pointLight position={[-3, 1.5, -2]} color="#8ABFFF" intensity={0.6} />
    <Environment resolution={256} frames={1}>
      {/* softbox studio: long strips give the chrome its Apple-like highlights */}
      <Lightformer form="rect" intensity={3} position={[0, 5, -2]} scale={[10, 1.2, 1]} rotation-x={Math.PI / 2} />
      <Lightformer form="rect" intensity={2} position={[-5, 1, -1]} scale={[8, 0.6, 1]} rotation-y={Math.PI / 2} />
      <Lightformer form="rect" intensity={2} position={[5, -1, -1]} scale={[8, 0.6, 1]} rotation-y={-Math.PI / 2} />
      <Lightformer form="ring" color="#8ABFFF" intensity={1.5} position={[0, 0, -6]} scale={3} />
    </Environment>
  </>
);
