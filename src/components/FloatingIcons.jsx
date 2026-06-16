import React from "react";
import { motion } from "framer-motion";

const icons = [
  "🎨", "🖌️", "📸", "🎬", "💻", "✨", "🔥", "⚡", "🌀", "🎯",
];

const FloatingIcons = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map((icon, index) => (
        <motion.div
          key={index}
          className="absolute text-3xl opacity-10"
          initial={{
            x: 0,
            y: 0,
          }}
          animate={{
            y: [0, -50, 50, -30, 30, 0],
            x: [0, 30, -30, 20, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          {icon}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingIcons;