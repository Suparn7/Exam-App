import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Mail, Menu, X, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Example: check if user is admin (replace with your logic)
  const isAdmin = user?.role === "admin" || user?.email?.endsWith("@admin.com");

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: t('nav.home') },
    { path: "/important-dates", label: t('nav.importantDates') },
    { path: "/how-to-apply", label: t('nav.howToApply') },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="sticky top-0 z-50 w-full border-b border-white/20 bg-gradient-to-br from-cyan-600 via-teal-700 to-blue-800 shadow-2xl backdrop-blur-xl"
    >
      {/* Top Info Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-cyan-700/90 via-teal-700/80 to-blue-700/80 text-white py-2 px-4 backdrop-blur-md"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs gap-2">
            <div className="flex items-center gap-4" style={{ lineHeight: "1.8" }}>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="h-4 w-4 text-cyan-300" />
                <span className="text-white/90">7250310625</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="h-4 w-4 text-cyan-300" />
                <span className="text-white/90">janmce.helpdesk@gmail.com</span>
              </motion.div>
            </div>
            <motion.div
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20"
              animate={{
                boxShadow: [
                  "0 0 10px rgba(255, 255, 255, 0.2)",
                  "0 0 20px rgba(255, 255, 255, 0.4)",
                  "0 0 10px rgba(255, 255, 255, 0.2)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              style={{ lineHeight: "1.8" }}
            >
              <Calendar className="h-4 w-4 text-yellow-300" />
              <span className="text-white font-semibold">
                {t('home.lastDate')}: 10 Sep 2025
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <Link to="/">
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-white to-cyan-100 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30"
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
                whileHover={{ rotate: 360 }}
                style={{ transition: "transform 0.6s ease" }}
              >
                <span className="text-teal-700 font-extrabold text-xl tracking-wider drop-shadow">
                  JH
                </span>
              </motion.div>
              <div>
                <Badge
                  className="bg-white/20 text-white border-white/30 mb-1 text-xs backdrop-blur-sm"
                  style={{ lineHeight: "1.8" }}
                >
                  {t('home.subtitle')}
                </Badge>
                <h1
                  className="font-heading text-xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg"
                  style={{ lineHeight: "1.6" }}
                >
                  JANMCE-2025
                </h1>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link, index) => (
              <Link key={link.path} to={link.path}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Button
                    variant={isActive(link.path) ? "default" : "ghost"}
                    size="sm"
                    className={
                      isActive(link.path)
                        ? "bg-white text-teal-700 hover:bg-cyan-50 shadow-lg font-semibold"
                        : "text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 font-semibold"
                    }
                    style={{ lineHeight: "1.8" }}
                  >
                    {link.label}
                  </Button>
                </motion.div>
              </Link>
            ))}

            {!loading && !user && (
              <Link to="/auth">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    variant={isActive('/auth') ? "default" : "ghost"}
                    size="sm"
                    className={
                      isActive('/auth')
                        ? "bg-white text-teal-700 hover:bg-cyan-50 shadow-lg font-semibold"
                        : "text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 font-semibold"
                    }
                    style={{ lineHeight: "1.8" }}
                  >
                    Login
                  </Button>
                </motion.div>
              </Link>
            )}

            {!loading && user && !isAdmin && (
              <>
                <Link to="/dashboard">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button
                      variant={isActive('/dashboard') ? "default" : "ghost"}
                      size="sm"
                      className={
                        isActive('/dashboard')
                          ? "bg-white text-teal-700 hover:bg-cyan-50 shadow-lg font-semibold"
                          : "text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 font-semibold"
                      }
                      style={{ lineHeight: "1.8" }}
                    >
                      Dashboard
                    </Button>
                  </motion.div>
                </Link>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="text-white hover:bg-red-500/20 backdrop-blur-sm border border-red-300/30 font-semibold"
                    style={{ lineHeight: "1.8" }}
                  >
                    Logout
                  </Button>
                </motion.div>
              </>
            )}

            {!loading && user && isAdmin && (
              <>
                <Link to="/admin">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button
                      variant={isActive('/admin') ? "default" : "ghost"}
                      size="sm"
                      className={
                        isActive('/admin')
                          ? "bg-white text-teal-700 hover:bg-cyan-50 shadow-lg font-semibold"
                          : "text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 font-semibold"
                      }
                      style={{ lineHeight: "1.8" }}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Admin Panel
                    </Button>
                  </motion.div>
                </Link>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="text-white hover:bg-red-500/20 backdrop-blur-sm border border-red-300/30 font-semibold"
                    style={{ lineHeight: "1.8" }}
                  >
                    Logout
                  </Button>
                </motion.div>
              </>
            )}

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <LanguageToggle />
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 space-y-2 pb-4"
            >
              {navLinks.map((link, index) => (
                <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant={isActive(link.path) ? "default" : "ghost"}
                      size="sm"
                      className={
                        isActive(link.path)
                          ? "w-full bg-white text-teal-700 hover:bg-cyan-50 shadow-lg font-semibold justify-start"
                          : "w-full text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 font-semibold justify-start"
                      }
                      style={{ lineHeight: "1.8" }}
                    >
                      {link.label}
                    </Button>
                  </motion.div>
                </Link>
              ))}

              {!loading && !user && (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      variant={isActive('/auth') ? "default" : "ghost"}
                      size="sm"
                      className={
                        isActive('/auth')
                          ? "w-full bg-white text-teal-700 hover:bg-cyan-50 shadow-lg font-semibold justify-start"
                          : "w-full text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 font-semibold justify-start"
                      }
                      style={{ lineHeight: "1.8" }}
                    >
                      Login
                    </Button>
                  </motion.div>
                </Link>
              )}

              {!loading && user && !isAdmin && (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        variant={isActive('/dashboard') ? "default" : "ghost"}
                        size="sm"
                        className={
                          isActive('/dashboard')
                            ? "w-full bg-white text-teal-700 hover:bg-cyan-50 shadow-lg font-semibold justify-start"
                            : "w-full text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 font-semibold justify-start"
                        }
                        style={{ lineHeight: "1.8" }}
                      >
                        Dashboard
                      </Button>
                    </motion.div>
                  </Link>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-white hover:bg-red-500/20 backdrop-blur-sm border border-red-300/30 font-semibold justify-start"
                      style={{ lineHeight: "1.8" }}
                    >
                      Logout
                    </Button>
                  </motion.div>
                </>
              )}

              {!loading && user && isAdmin && (
                <>
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        variant={isActive('/admin') ? "default" : "ghost"}
                        size="sm"
                        className={
                          isActive('/admin')
                            ? "w-full bg-white text-teal-700 hover:bg-cyan-50 shadow-lg font-semibold justify-start"
                            : "w-full text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 font-semibold justify-start"
                        }
                        style={{ lineHeight: "1.8" }}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </motion.div>
                  </Link>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-white hover:bg-red-500/20 backdrop-blur-sm border border-red-300/30 font-semibold justify-start"
                      style={{ lineHeight: "1.8" }}
                    >
                      Logout
                    </Button>
                  </motion.div>
                </>
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-2"
              >
                <LanguageToggle />
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
