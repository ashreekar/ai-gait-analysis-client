// components/Gait/DigitalTwin.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export const DigitalTwin = ({ angle }: { angle: number }) => {
  return (
    <div className="h-64 w-full bg-black rounded-3xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {/* Simple Hip */}
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial color="#00B4D8" />
        </mesh>
        {/* Animated Leg */}
        <group rotation={[0, 0, (angle * Math.PI) / 180]}>
          <mesh position={[0, -0.7, 0]}>
            <capsuleGeometry args={[0.1, 1.2]} />
            <meshStandardMaterial color="#2ECC71" />
          </mesh>
        </group>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};