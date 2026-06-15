import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const skills = [
  { name: "Adobe Photoshop", level: 95, icon: "🎨" },
  { name: "Adobe Illustrator", level: 90, icon: "✏️" },
  { name: "After Effects", level: 85, icon: "🎬" },
  { name: "Figma", level: 88, icon: "🖌️" },
  { name: "Blender", level: 75, icon: "🧊" },
  { name: "Premiere Pro", level: 80, icon: "🎥" },
];

const Skills = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="skills" className="py-20 bg-darkBg">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl font-bold text-center mb-12"
        >
          مهارا<span className="text-red-600">تي</span>
        </motion.h2>
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-red-600/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{skill.icon}</span>
                <h3 className="text-xl font-semibold">{skill.name}</h3>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : {}}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="bg-red-600 h-2.5 rounded-full"
                />
              </div>
              <p className="text-right text-sm mt-2 text-gray-400">{skill.level}%</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;