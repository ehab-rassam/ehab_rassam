import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const educations = [
  {
    degree: "Bachelor of Computer Science",
    institution: "Al-Razi University",
    year: "2021 – 2028 (Expected)",
    description: "أسعى للحصول على شهادة في علوم الحاسوب، وتطوير مهارات تقنية وتحليلية وحل المشكلات قوية تدعم العمل الإبداعي والرقمي.",
  },
  {
    degree: "Advanced Courses & Workshops",
    institution: "Online Platforms",
    year: "2022 – Present",
    description: "أكملتُ دوراتٍ متقدمة مدفوعة الأجر في التصميم الجرافيكي، والتصوير الفوتوغرافي، وصناعة الأفلام، وإنتاج المحتوى، بما في ذلك برامج يقدمها أحمد حمدي، وجو حطاب، ومحمد إحسان. كما حصلتُ على دبلوم شامل في التسويق الرقمي من أكاديمية ماستري مع الدكتور سهل مهدي والدكتور ثابت حجازي، بالإضافة إلى دورات متخصصة أخرى.",
  },
  {
    degree: "Foundations in Design & Language",
    institution: "French American Institute + Graphics Institute",
    year: "2021 – 2022",
    description: "أكملتُ تدريباً تأسيسياً في التصميم الجرافيكي، بالإضافة إلى شهادات في اللغة الإنجليزية للمبتدئين والمتوسطين. كما حصلتُ على شهادات مبكرة في التسويق الرقمي وتحرير الفيديو، مما ساهم في بناء قاعدة قوية في المهارات الإبداعية والتواصلية.",
  },
];

const Education = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="education" className="py-20 bg-darkBg">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl font-bold text-center mb-12"
        >
          التعليم <span className="text-red-600">والشهادات</span>
        </motion.h2>
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {educations.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              whileHover={{ rotateY: 5 }}
              className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-red-600/20 hover:border-red-600/50 transition-all duration-300"
            >
              <h3 className="text-xl font-bold">{edu.degree}</h3>
              <p className="text-red-500 mt-1">{edu.institution}</p>
              <p className="text-sm text-gray-400 mb-3">{edu.year}</p>
              <p className="text-gray-300">{edu.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;