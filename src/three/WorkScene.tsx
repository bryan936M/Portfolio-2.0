"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { TextureLoader, SRGBColorSpace, DoubleSide } from "three";

function Covers({
  images,
  progress,
  onReady,
}: {
  images: string[];
  progress: number;
  onReady: () => void;
}) {
  const textures = useLoader(TextureLoader, images);
  useEffect(onReady, [onReady]);
  textures.forEach((texture) => {
    texture.colorSpace = SRGBColorSpace;
  });
  return (
    <group
      rotation={[
        0.05 * (1 - progress),
        -0.24 * (1 - progress),
        -0.08 * (1 - progress),
      ]}
    >
      {textures.map((texture, index) => {
        const direction = index === 0 ? -1 : 1;
        return (
          <mesh
            key={index}
            position={[
              direction * (1.5 - progress * 0.6),
              direction * 0.16 * (1 - progress),
              -index * 0.8,
            ]}
            rotation={[
              0.04 * (1 - progress),
              direction * 0.36 * (1 - progress),
              direction * 0.12 * (1 - progress),
            ]}
            scale={index === 0 ? 1.1 : 1}
          >
            <planeGeometry args={[3.4, 2.2]} />
            <meshBasicMaterial map={texture} side={DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}
export default function WorkScene({
  images,
  progress,
  onReady,
}: {
  images: string[];
  progress: number;
  onReady: () => void;
}) {
  return (
    <Canvas
      aria-hidden="true"
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.7], fov: 43 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
    >
      <Suspense fallback={null}>
        <Covers images={images} progress={progress} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
