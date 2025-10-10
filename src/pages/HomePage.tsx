import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";
import medicalPattern from "@/assets/medical-pattern.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Calendar, 
  FileText, 
  Users, 
  Shield, 
  Clock, 
  Award,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Lock
} from "lucide-react";
import { Link } from "react-router-dom";

export function HomePage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    registrationNo: '',
    password: ''
  });

  const features = [
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Government-grade security for your data",
      color: "text-cyan-500"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance",
      color: "text-teal-500"
    },
    {
      icon: Award,
      title: "Certified Process",
      description: "Official JSSC examination portal",
      color: "text-blue-500"
    },
    {
      icon: Users,
      title: "Thousands of Candidates",
      description: "Join lakhs of applicants",
      color: "text-cyan-600"
    }
  ];

  const stats = [
    { label: "Total Applications", value: "50,000+", icon: FileText },
    { label: "Success Rate", value: "95%", icon: Award },
    { label: "Active Candidates", value: "25,000+", icon: Users },
    { label: "Processing Time", value: "2 Min", icon: Clock }
  ];

  const notices = [
    {
      title: "JANMCE-2025 Notice (Advt 03/2025-JANMCE)",
      date: "09-08-2025 | 12:34 PM",
      important: true
    },
    {
      title: "Brochure of Jharkhand Auxiliary Nurse Midwife Competitive Examination 2025 - Regular",
      date: "09-08-2025 | 12:13 AM",
      important: false
    },
    {
      title: "Brochure of Jharkhand Auxiliary Nurse Midwife Competitive Examination 2025 - Backlog",
      date: "09-08-2025 | 12:01 AM",
      important: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"
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
          className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"
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
        
        <div className="absolute inset-0 opacity-10">
          <img 
            src={heroBanner} 
            alt="JANMCE-2025 Hero Banner" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-teal-500/10 to-blue-500/10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 text-base shadow-lg">
                    {t('home.subtitle')}
                  </Badge>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent leading-tight"
                >
                  JANMCE-2025
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl text-gray-700 leading-relaxed"
                >
                  Jharkhand Auxiliary Nurse Midwife Competitive Examination - Your gateway to a prestigious nursing career in government healthcare.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/register">
                  <Button 
                    className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-600 hover:via-teal-600 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all"
                  >
                    {t('nav.register')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/important-dates">
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-teal-500 text-teal-700 hover:bg-teal-50 px-8 py-6 text-lg rounded-xl shadow-lg transition-all"
                  >
                    {t('nav.importantDates')}
                    <Calendar className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-white/60 backdrop-blur-lg border border-cyan-200 rounded-2xl p-6 shadow-xl"
                
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Calendar className="h-8 w-8 text-cyan-600" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-cyan-700 text-lg">
                      {t('home.lastDate')}
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      10 September 2025
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Login Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="space-y-6"
            >
              <div 
                className="relative"
                
              >
                <Card className="bg-white/70 backdrop-blur-xl border border-cyan-200 shadow-2xl overflow-hidden">
                  <CardHeader className="text-center bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white py-6">
                    <CardTitle className="text-3xl font-extrabold">
                      Candidate Login
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-center space-y-4"
                    >
                      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                        <h3 className="font-bold text-cyan-700 text-xl mb-2">New Candidates</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          First time registering? Create your account and complete exam registration.
                        </p>
                        <Link to="/auth">
                          <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white py-3 rounded-xl shadow-md transition-all">
                            Sign Up / Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>

                      <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                        <h3 className="font-bold text-teal-700 text-xl mb-2">Existing Candidates</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Already have an account? Login to view your applications and status.
                        </p>
                        <Link to="/auth">
                          <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-3 rounded-xl shadow-md transition-all">
                            Login with Email & Password
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        After registration, you'll receive an application number to track your progress.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="bg-yellow-50/80 backdrop-blur-lg border-2 border-yellow-300 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <motion.div 
                        className="w-3 h-3 bg-yellow-500 rounded-full mt-1"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [1, 0.7, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                      <div>
                        <p className="text-sm font-bold text-yellow-700">
                          Payment Notice
                        </p>
                        <p className="text-sm text-gray-700">
                          {t('home.paymentNotice')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-br from-cyan-500 via-teal-600 to-blue-700 overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center"
              >
                <Card className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl hover:shadow-2xl transition-all h-full">
                  <CardContent className="pt-8 pb-6">
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    >
                      <stat.icon className="h-10 w-10 mx-auto mb-4 text-white" />
                    </motion.div>
                    <p className="text-3xl font-extrabold text-white mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-white/90 font-medium">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-white via-cyan-50 to-teal-50 relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Why Choose JANMCE Portal?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the most advanced and secure government examination platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div 
                  className="relative h-full"
                  
                >
                  <Card className="bg-white/80 backdrop-blur-lg border-2 border-cyan-200 shadow-xl hover:shadow-2xl transition-all h-full">
                    <CardContent className="pt-8 pb-6 text-center">
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                          delay: index * 0.5,
                        }}
                      >
                        <feature.icon className={`h-14 w-14 mx-auto mb-4 ${feature.color}`} />
                      </motion.div>
                      <h3 className="font-bold text-xl text-gray-800 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notices Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-12">
              Latest Notices & Updates
            </h2>

            <div className="space-y-4">
              {notices.map((notice, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div
                    className="relative"
                    
                  >
                    <Card className={`bg-white/80 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all ${notice.important ? 'border-2 border-teal-300' : 'border border-cyan-200'}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              {notice.important && (
                                <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold">
                                  Important
                                </Badge>
                              )}
                              <span className="text-sm text-gray-500 font-medium">
                                {t('home.updated')}: {notice.date}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-800 leading-relaxed text-base">
                              {notice.title}
                            </h3>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="flex-shrink-0 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
