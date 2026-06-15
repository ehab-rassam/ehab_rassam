import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const cards = [
  {
    title: "الخدمات",
    description:
      "هوية العلامة التجارية، تصميم وسائل التواصل الاجتماعي، التغليف، مونتاج وموشن، UI/UX.",
    icon: "🎨",
  },
  {
    title: "التخصصات",
    description:
      "Photoshop • Illustrator • InDesign • After Effects • Premiere Pro • Blender • Figma, and AI-powered creative tools & workflows",
    icon: "⚙️",
  },
  {
    title: "الشهادات",
    description:
      "حاصل على شهادات في التصميم الجرافيكي، وتحرير الفيديو، والتسويق الرقمي، مع خبرة مهنية تزيد عن 4 سنوات.",
    icon: "🏆",
  },
];

const AboutCards = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-20 bg-darkBg/50">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl font-bold text-center mb-12"
        >
          اكثر <span className="text-red-600">عني</span>
        </motion.h2>
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05, rotateY: 10 }}
              className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-red-600/20 hover:border-red-600/50 transition-all duration-300 shadow-xl"
            >
              <div className="text-5xl mb-4">{card.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
              <p className="text-gray-300">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutCards;