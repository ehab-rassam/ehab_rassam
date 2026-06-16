import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ps1 from "../images/ps1.webp";
import ps24 from "../images/ps24.webp";
import ps2 from "../images/ps2.webp";
import ps3 from "../images/ps3.webp";
import ps4 from "../images/ps4.webp";
import ps5 from "../images/ps5.webp";
import ps6 from "../images/ps6.webp";
import ps7 from "../images/ps7.webp";
import ps8 from "../images/ps8.webp";
import ps9 from "../images/ps9.webp";
import ps10 from "../images/ps10.webp";
import ps11 from "../images/ps11.webp";
import ps12 from "../images/ps12.webp";
import ps13 from "../images/ps13.webp";
import ps14 from "../images/ps14.webp";
import ps15 from "../images/ps15.webp";
import ps16 from "../images/ps16.webp";
import ps17 from "../images/ps17.webp";
import ps18 from "../images/ps18.webp";
import ps19 from "../images/ps19.webp";
import ps20 from "../images/ps20.webp";
import ps21 from "../images/ps21.webp";
import ps22 from "../images/ps22.webp";
import ps23 from "../images/ps23.webp";
// import ps24 from "../images/ps24.webp";

const categories = [
  "الكل",
  "تصوير المنتجات",
  "بوسترات",
  "لافتات",
  "E-commerce",
  "التعبئة والتغليف",
  "تحرير الفيديو",
  "الموشن جرافيك",
];

const projects = [
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps1,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps2,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps3,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps4,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps5,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps6,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps7,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps8,
  },
   {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps9,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps10,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps11,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps12,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps13,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps14,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps15,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps16,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps17,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps18,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps19,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps20,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps21,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps22,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps23,
  },
  {
    title: "تصوير المنتج",
    category: "تصوير المنتجات",
    image: ps24,
  },
  {
    title: "بوسترات وسائل التواصل الاجتماعي",
    category: "بوسترات",
    image: "https://via.placeholder.com/400x500?text=Poster+Design",
  },
  {
    title: "Brand Banner",
    category: "لافتات",
    image: "https://via.placeholder.com/400x500?text=Banner",
  },
  {
    title: "Salla Store",
    category: "E-commerce",
    image: "https://via.placeholder.com/400x500?text=E-commerce",
  },
  {
    title: "Luxury Package",
    category: "التعبئة والتغليف",
    image: "https://via.placeholder.com/400x500?text=التعبئة والتغليف",
  },
  {
    title: "Corporate Video",
    category: "تحرير الفيديو",
    image: "https://via.placeholder.com/400x500?text=Video+Editing",
  },
  {
    title: "Explainer Motion",
    category: "الموشن جرافيك",
    image: "https://via.placeholder.com/400x500?text=Motion+Graphics",
  },
];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const filteredProjects =
    activeCategory === "الكل"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 bg-darkBg/50">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl font-bold text-center mb-12"
        >
          من <span className="text-red-600">اعمالي</span>
        </motion.h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-red-600 text-white"
                  : "bg-black/40 text-gray-300 hover:bg-red-600/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="group relative overflow-hidden rounded-xl cursor-pointer"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {project.title}
                  </h3>
                  <p className="text-red-400 text-sm">{project.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;