import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Float, Text } from "@react-three/drei";

function FloatingIcons() {
  const icons = [
    { text: "</>", pos: [-3.5, 2, -2], color: "#3b82f6" }, // Coding
    { text: "📐", pos: [3.2, 1.8, -3], color: "#60a5fa" }, // Architect/Engineering
    { text: "💼", pos: [-2.8, -1.8, -1], color: "#93c5fd" }, // Business
    { text: "🎓", pos: [2.5, -2, -4], color: "#2563eb" }, // Students
    { text: "📊", pos: [-1.2, 3.2, -5], color: "#3b82f6" }, // Analytics/Progress
    { text: "🚀", pos: [4, 0, -2], color: "#60a5fa" }, // Growth/Launch
    { text: "🎨", pos: [1.5, 2.5, -3], color: "#93c5fd" }, // Design
    { text: "📝", pos: [-4, 0, -3], color: "#2563eb" }, // Content/Contract
  ];

  return (
    <>
      {icons.map((icon, idx) => (
        <Float
          key={idx}
          speed={1.2 + Math.random()}
          rotationIntensity={0.5}
          floatIntensity={1.5}
          position={icon.pos as [number, number, number]}
        >
          <Text
            fontSize={0.45}
            color={icon.color}
            maxWidth={2}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            material-transparent={true}
            material-opacity={0.12}
          >
            {icon.text}
          </Text>
        </Float>
      ))}
    </>
  );
}

function Particles({ count = 100 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.3} />
    </points>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <FloatingIcons />
        <Particles count={150} />
      </Canvas>
    </div>
  );
}
