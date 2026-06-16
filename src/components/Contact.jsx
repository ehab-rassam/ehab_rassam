import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaInstagram, FaBehance, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { FaFacebookF, FaPinterestP } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { ContactForm } from "../features/contact/ContactForm.jsx";

const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="contact" className="py-20 bg-darkBg">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 px-2"
        >
          تواصل <span className="text-red-600">معنا</span>
        </motion.h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            className="space-y-6 min-w-0"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4">معلومات الاتصال</h3>
              <p className="text-gray-300 mb-6">
                لا تتردد في التواصل معنا للتعاون أو لمجرد إلقاء التحية الودية.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                    📞
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="text-white font-medium">120 9494 77 967+</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                    ✉️
                  </div>
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="text-white font-medium">ehabrassam1@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div>
              <h3 className="text-xl font-bold mb-3">تابعني</h3>

              <div className="flex gap-4 flex-wrap">

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/ehab_rassam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center 
                  transition-all duration-300 hover:scale-110 
                  hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-500"
                >
                  <FaInstagram className="text-white text-lg" />
                </a>


                {/* Behance */}
                <a
                  href="https://www.behance.net/ehabrassam1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center 
                  transition-all duration-300 hover:scale-110 hover:bg-blue-600"
                >
                  <FaBehance className="text-white text-lg" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/ehab-rassam-75a327348"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center 
                  transition-all duration-300 hover:scale-110 hover:bg-blue-500"
                >
                  <FaLinkedinIn className="text-white text-lg" />
                </a>

                <a
                  href="https://www.facebook.com/share/18g9ZTp1JZ/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center 
                  transition-all duration-300 hover:scale-110 hover:bg-blue-600"
                >
                  <FaFacebookF className="text-white text-lg" />
                </a>

                <a
                  href="https://x.com/ehab_rassam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center 
                  transition-all duration-300 hover:scale-110 hover:bg-black"
                >
                  <FaXTwitter className="text-white text-lg" />
                </a>

                <a
                  href="https://pin.it/2qyzptha0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center 
                  transition-all duration-300 hover:scale-110 hover:bg-red-600"
                >
                  <FaPinterestP className="text-white text-lg" />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/967779494210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center 
                  transition-all duration-300 hover:scale-110 hover:bg-green-500"
                >
                  <FaWhatsapp className="text-white text-lg" />
                </a>

              </div>
            </div>
          </motion.div>

          <div className="min-w-0">
            <ContactForm inView={inView} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;