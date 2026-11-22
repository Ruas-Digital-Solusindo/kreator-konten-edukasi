import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const DURATION = 150;
export const FPS = 30;

const Kubus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Semua gerakan dihitung dari `frame`, BUKAN useFrame() milik R3F.
  const rotY = (frame / FPS) * Math.PI * 0.8;
  const rotX = Math.sin(frame / 25) * 0.4;
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const naikTurun = Math.sin(frame / 18) * 0.15;

  return (
    <mesh
      position={[0, naikTurun, 0]}
      rotation={[rotX, rotY, 0]}
      scale={scale * 0.9}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#f28c28" roughness={0.35} metalness={0.1} />
    </mesh>
  );
};

export const ContohThree: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const judulOpacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#f6efe2" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={2} />
        <Kubus />
      </ThreeCanvas>
      <div
        style={{
          position: "absolute",
          bottom: 220,
          width: "100%",
          textAlign: "center",
          fontSize: 80,
          fontWeight: 800,
          color: "#14213d",
          fontFamily: "sans-serif",
          opacity: judulOpacity,
        }}
      >
        Contoh 3D dengan Three.js
      </div>
    </AbsoluteFill>
  );
};
