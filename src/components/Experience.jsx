import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const experiences = [
  {
    title: "Senior Graphic Designer",
    company: "Remote",
    period: "2023 - Present",
    description:
      "عملتُ مع عملاء في جميع أنحاء منطقة الخليج، بما في ذلك سلطنة عمان والمملكة العربية السعودية، وقدمتُ خدماتي لمحلات رياضية، ومتاجر تجزئة، ومقاهي، وشركات. قمتُ ببناء فريق إبداعي صغير وقيادته، حيث توليتُ إدارة المشاريع وتقديم حلول تصميم متكاملة لقطاعات متنوعة.",
  },
  {
    title: "Freelance Designer",
    company: "Remote",
    period: "2022 - 2023",
    description:
      "توسعت خدماتي لتشمل العمل مع العديد من العملاء في جميع أنحاء اليمن، بما في ذلك المتاجر الإلكترونية، ومعارض السيارات، وشركات الطباعة. وقدمت مجموعة واسعة من الأعمال مثل تصميمات مواقع التواصل الاجتماعي، واللافتات التجارية، ومواد العلامات التجارية.",
  },
  {
    title: "Junior Designer",
    company: "Self-employed",
    period: "2021 - 2022",
    description:
      "بدأت مسيرتي في مجال التصميم بالعمل مع علامتين تجاريتين تابعتين لشركة متخصصة في منتجات الشوكولاتة والمكسرات. توليت مسؤولية التصميم والتسويق الرقمي، مما ساهم في بناء أساس متين في مجال العلامات التجارية والمحتوى المرئي.",
  },
];

const Experience = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="experience" className="py-20 bg-darkBg/50 w-full max-w-full overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl font-bold text-center mb-12"
        >
          خبرة في <span className="text-red-600">العمل</span>
        </motion.h2>
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
        >
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border-l-4 border-red-600 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-bold">{exp.title}</h3>
              <p className="text-red-500 mt-1">{exp.company}</p>
              <p className="text-sm text-gray-400 mb-3">{exp.period}</p>
              <p className="text-gray-300">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;