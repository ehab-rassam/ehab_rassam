import React from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import heroImage from "../images/image1.jpeg";

const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 2] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Sphere args={[1, 100, 200]} scale={2}>
            <MeshDistortMaterial
              color="#dc2626"
              distort={0.5}
              speed={2}
              roughness={0.2}
              metalness={0.8}
            />
          </Sphere>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row-reverse items-center md:items-stretch justify-between gap-12">
        
        {/* النص */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 flex flex-col text-center md:text-start"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="text-red-600">ايهاب</span> رسام
          </h1>

          <p className="text-xl text-gray-300 mb-6">
            مصمم جرافيكس
          </p>

          <p className="text-gray-400 mb-8 leading-relaxed">
            مصمم إبداعي بخبرة تتجاوز 4 سنوات في تقديم حلول بصرية متكاملة تشمل التصميم الجرافيكي، المونتاج، والتسويق الإلكتروني.
أساعد العلامات التجارية والمتاجر على بناء هوية قوية، وإنشاء محتوى احترافي يجذب الجمهور ويحقق نتائج حقيقية في السوق.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <a
              href="https://www.instagram.com/ehab_rassam?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition-all duration-300"
            >
              Instagram
            </a>

            <a
              href="https://www.behance.net/ehabrassam1"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-red-600 hover:bg-red-600 text-white px-6 py-3 rounded-full transition-all duration-300"
            >
              Behance
            </a>
          </div>
        </motion.div>

        {/* الصورة */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2"
        >
          <img  
            src={heroImage}
            alt="Ehab Rassam"
            className="rounded-2xl shadow-2xl border-2 border-red-600/30 w-full max-w-md mx-auto"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;