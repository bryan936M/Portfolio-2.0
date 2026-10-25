"use client";

import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { Texture, TextureLoader, SRGBColorSpace, DoubleSide } from "three";

function Covers({
  textures,
  progress,
  onReady,
}: {
  textures: Texture[];
  progress: number;
  onReady: () => void;
}) {
  const reported = useRef(false);
  const onRendered = useCallback(() => {
    if (reported.current) return;
    reported.current = true;
    onReady();
  }, [onReady]);
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
            onAfterRender={
              index === textures.length - 1 ? onRendered : undefined
            }
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
  onUnavailable,
}: {
  images: string[];
  progress: number;
  onReady: () => void;
  onUnavailable: () => void;
}) {
  const [textures, setTextures] = useState<Texture[] | null>(null);
  const active = useRef(false);
  const onRendered = useCallback(() => {
    if (active.current) onReady();
  }, [onReady]);
  useEffect(() => {
    active.current = true;
    let cancelled = false;
    const owned: Texture[] = [];
    const loader = new TextureLoader();
    onUnavailable();
    setTextures(null);
    Promise.all(
      images.map(
        (source) =>
          new Promise<Texture>((resolve, reject) => {
            const texture = loader.load(source, resolve, undefined, () =>
              reject(new Error(`Could not load project texture: ${source}`)),
            );
            owned.push(texture);
          }),
      ),
    )
      .then((loaded) => {
        if (cancelled) return;
        loaded.forEach((texture) => {
          texture.colorSpace = SRGBColorSpace;
        });
        setTextures(loaded);
      })
      .catch(() => {
        if (cancelled) return;
        owned.forEach((texture) => texture.dispose());
        onUnavailable();
        console.warn(
          "A project texture is unavailable; keeping the static project covers.",
        );
      });
    return () => {
      cancelled = true;
      active.current = false;
      owned.forEach((texture) => texture.dispose());
    };
  }, [images, onUnavailable]);
  if (!textures) return null;
  return (
    <Canvas
      aria-hidden="true"
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.7], fov: 43 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
    >
      <Covers textures={textures} progress={progress} onReady={onRendered} />
    </Canvas>
  );
}
