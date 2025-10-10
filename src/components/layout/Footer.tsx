import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Facebook, Twitter, Globe, Linkedin, MapPin, Clock, Shield, Award, ExternalLink, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function Footer() {
  const { t } = useTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/", label: "Facebook", color: "hover:text-blue-400" },
    { icon: Twitter, href: "https://twitter.com/", label: "Twitter", color: "hover:text-cyan-400" },
    { icon: Linkedin, href: "https://www.linkedin.com/", label: "LinkedIn", color: "hover:text-blue-300" },
    { icon: Globe, href: "https://jssc.nic.in/", label: "Official Website", color: "hover:text-teal-300" },
  ];

  const quickLinks = [
    { name: "Application Status", href: "#" },
    { name: "Admit Card", href: "#" },
    { name: "Results", href: "#" },
    { name: "Syllabus", href: "#" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative bg-gradient-to-br from-cyan-600 via-teal-700 to-blue-800 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Decorative Wave at Top */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="currentColor"
            className="text-cyan-50"
            animate={{
              d: [
                "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
                "M321.39,66.44c58-5.79,114.16-20.13,172-31.86,82.39-11.72,168.19-12.73,250.45-.39C823.78,41,906.67,82,985.66,102.83c70.05,13.48,146.53,21.09,214.34,8V0H0V37.35A600.21,600.21,0,0,0,321.39,66.44Z",
                "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12"
        >
          {/* Organization Info */}
          <motion.div variants={item}>
            <div className="flex items-start gap-3 mb-6">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-white to-cyan-100 rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255, 255, 255, 0.3)",
                    "0 0 40px rgba(255, 255, 255, 0.6)",
                    "0 0 20px rgba(255, 255, 255, 0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                whileHover={{ rotate: 360, scale: 1.1 }}
                style={{ transition: "transform 0.6s ease" }}
              >
                <span className="text-teal-700 font-extrabold text-2xl tracking-wider">
                  JH
                </span>
              </motion.div>
              <div>
                <Badge
                  className="bg-white/20 text-white border-white/30 mb-2 text-xs backdrop-blur-sm"
                  style={{ lineHeight: "1.8" }}
                >
                  {t("home.subtitle")}
                </Badge>
                <h2
                  className="font-heading text-xl font-bold text-white drop-shadow-lg"
                  style={{ lineHeight: "1.8" }}
                >
                  Jharkhand Staff Selection Commission
                </h2>
              </div>
            </div>
            <p
              className="text-white/90 text-sm mb-6 leading-relaxed"
              style={{ lineHeight: "1.8" }}
            >
              Conducting fair and transparent recruitment processes for
              government positions in Jharkhand.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center ${social.color} hover:bg-white/20 transition-all border border-white/20`}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={item}>
            <h3
              className="font-heading font-bold mb-6 text-white text-lg flex items-center gap-2"
              style={{ lineHeight: "1.8" }}
            >
              <ExternalLink className="w-5 h-5" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-white text-sm flex items-center gap-2 transition-all group"
                    style={{ lineHeight: "1.8" }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 bg-cyan-300 rounded-full"
                      whileHover={{ scale: 1.5 }}
                    />
                    {link.name}
                    <ArrowUp className="w-3 h-3 rotate-45 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Information */}
          <motion.div variants={item}>
            <h3
              className="font-heading font-bold mb-6 text-white text-lg flex items-center gap-2"
              style={{ lineHeight: "1.8" }}
            >
              <Phone className="w-5 h-5" />
              Support Info
            </h3>
            <div className="space-y-4 text-sm">
              <motion.div
                className="flex items-start gap-3 text-white/90"
                whileHover={{ x: 5 }}
                style={{ lineHeight: "1.8" }}
              >
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>7250310625</span>
              </motion.div>
              <motion.div
                className="flex items-start gap-3 text-white/90"
                whileHover={{ x: 5 }}
                style={{ lineHeight: "1.8" }}
              >
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="break-all">janmce.helpdesk@gmail.com</span>
              </motion.div>
              <motion.div
                className="flex items-start gap-3 text-white/90"
                whileHover={{ x: 5 }}
                style={{ lineHeight: "1.8" }}
              >
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{t("home.support")}</span>
              </motion.div>
            </div>
            <Button
              asChild
              className="mt-6 bg-white text-teal-700 hover:bg-cyan-50 shadow-lg hover:shadow-xl transition-all rounded-xl font-semibold"
            >
              <motion.a
                href="mailto:janmce.helpdesk@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.a>
            </Button>
          </motion.div>

          {/* Important Notice */}
          <motion.div variants={item}>
            <h3
              className="font-heading font-bold mb-6 text-white text-lg flex items-center gap-2"
              style={{ lineHeight: "1.8" }}
            >
              <Shield className="w-5 h-5" />
              Important Notice
            </h3>
            <ul className="space-y-3 text-sm text-white/90">
              <motion.li
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{ lineHeight: "1.8" }}
              >
                <Award className="w-4 h-4 mt-1 flex-shrink-0 text-cyan-300" />
                <span>
                  By registering on the JSSC website, you agree to provide
                  accurate information.
                </span>
              </motion.li>
              <motion.li
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                style={{ lineHeight: "1.8" }}
              >
                <Award className="w-4 h-4 mt-1 flex-shrink-0 text-cyan-300" />
                <span>
                  Your personal data will be kept confidential and used solely
                  for recruitment purposes.
                </span>
              </motion.li>
              <motion.li
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                style={{ lineHeight: "1.8" }}
              >
                <Award className="w-4 h-4 mt-1 flex-shrink-0 text-cyan-300" />
                <span>
                  Ensure you meet all eligibility criteria before registering.
                </span>
              </motion.li>
              <motion.li
                className="flex items-start gap-2 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(255, 255, 255, 0.2)",
                    "0 0 20px rgba(255, 255, 255, 0.4)",
                    "0 0 10px rgba(255, 255, 255, 0.2)",
                  ],
                }}
                style={{ lineHeight: "1.8" }}
              >
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-300" />
                <span className="text-white font-bold">
                  Last Date: 10 Sep 2025
                </span>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-white/20 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p
              className="text-white/80 text-xs md:text-sm text-center md:text-left"
              style={{ lineHeight: "1.8" }}
            >
              &copy; 2025 Jharkhand Staff Selection Commission. All Rights
              Reserved.
            </p>
            <div className="flex gap-4 text-xs text-white/70">
              <a
                href="#"
                className="hover:text-white transition-colors"
                style={{ lineHeight: "1.8" }}
              >
                Privacy Policy
              </a>
              <span>|</span>
              <a
                href="#"
                className="hover:text-white transition-colors"
                style={{ lineHeight: "1.8" }}
              >
                Terms & Conditions
              </a>
              <span>|</span>
              <a
                href="#"
                className="hover:text-white transition-colors"
                style={{ lineHeight: "1.8" }}
              >
                Sitemap
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-500 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:shadow-cyan-500/50 transition-all"
          whileHover={{ scale: 1.1, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </footer>
  );
}
