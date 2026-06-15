import React, { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import AboutCards from "./components/AboutCards";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingIcons from "./components/FloatingIcons";
import { motion, useScroll, useSpring } from "framer-motion";

const Hero = lazy(() => import("./components/Hero"));

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="bg-darkBg text-white overflow-x-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-red-600 origin-left z-50"
        style={{ scaleX }}
      />
      <Navbar />
      <Suspense
        fallback={
          <section
            className="min-h-screen flex items-center justify-center bg-darkBg pt-20"
            aria-busy="true"
            aria-label="جاري تحميل القسم الرئيسي"
          >
            <p className="text-gray-500 text-sm">جاري التحميل…</p>
          </section>
        }
      >
        <Hero />
      </Suspense>
      <AboutCards />
      <Skills />
      <Experience />
      <Education />
      <Projects />
      <Contact />
      <Footer />
      <FloatingIcons />
    </div>
  );
}

export default App;
