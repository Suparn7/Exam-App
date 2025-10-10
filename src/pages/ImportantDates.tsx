import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Award, BookOpen, Users, AlertCircle, CheckCircle, FileCheck, Bell } from "lucide-react";

export function ImportantDates() {
  const { t } = useTranslation();

  const dates = [
    {
      label: t('dates.applicationStart'),
      value: "11 August 2025",
      icon: Calendar,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    {
      label: t('dates.applicationDeadline'),
      value: "10 September 2025 (till 23:59:59)",
      icon: Clock,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      label: t('dates.admitCard'),
      value: t('dates.toBeAnnounced'),
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      label: t('dates.examDate'),
      value: t('dates.toBeAnnounced'),
      icon: BookOpen,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200"
    }
  ];

  const ageCategories = [
    {
      category: t('dates.general'),
      minAge: "18 years",
      maxAge: "40 years"
    },
    {
      category: t('dates.ews'),
      minAge: "18 years",
      maxAge: "42 years"
    }
  ];

  const instructions = [
    "Double-check all details before submission",
    "Keep all required documents ready in prescribed format",
    "Submit before the last date to avoid issues",
    "Both Regular & Backlog vacancies available",
    "Follow official JANMCE-2025 notification for full details"
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-2 text-base shadow-lg" style={{ lineHeight: "1.8" }}>
                {t('home.subtitle')}
              </Badge>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-4"
              style={{ lineHeight: "1.6" }}
            >
              {t('dates.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-700 max-w-2xl mx-auto"
              style={{ lineHeight: "1.8" }}
            >
              Important information about application timeline and eligibility criteria
            </motion.p>
          </motion.div>

          {/* Important Dates with Timeline Effect */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="mb-20"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-12"
              style={{ lineHeight: "1.6" }}
            >
              Important Dates
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {dates.map((date, index) => (
                <motion.div 
                  key={index}
                  variants={item}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div 
                    className="relative h-full"
                  >
                    <Card className={`bg-white/80 backdrop-blur-lg border-2 ${date.borderColor} shadow-xl hover:shadow-2xl transition-all h-full`}>
                      <CardContent className="p-8">
                        <div className="flex items-center gap-5">
                          <motion.div 
                            className={`p-4 rounded-2xl ${date.bgColor} ${date.color}`}
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
                            <date.icon className="h-8 w-8" />
                          </motion.div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 mb-2 text-base" style={{ lineHeight: "1.8" }}>
                              {date.label}
                            </p>
                            <p className={`text-lg font-bold ${date.color}`} style={{ lineHeight: "1.6" }}>
                              {date.value}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {/* Educational Qualification */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div 
                className="relative h-full"
                
              >
                <Card className="bg-white/80 backdrop-blur-lg border-2 border-teal-200 shadow-xl h-full">
                  <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <BookOpen className="h-7 w-7" />
                      </motion.div>
                      {t('dates.education')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-8">
                    <p className="text-gray-700 leading-relaxed text-base" style={{ lineHeight: "1.8" }}>
                      {t('dates.educationDesc')}
                    </p>
                    <motion.div 
                      className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl"
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(234, 179, 8, 0.3)",
                          "0 0 20px rgba(234, 179, 8, 0.6)",
                          "0 0 10px rgba(234, 179, 8, 0.3)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Bell className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                        <p className="text-yellow-800 font-semibold text-base" style={{ lineHeight: "1.8" }}>
                          {t('dates.additionalReq')}
                        </p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Age Criteria */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div 
                className="relative h-full"
              >
                <Card className="bg-white/80 backdrop-blur-lg border-2 border-cyan-200 shadow-xl h-full">
                  <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Users className="h-7 w-7" />
                      </motion.div>
                      {t('dates.ageCriteria')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-cyan-200 bg-cyan-50/50">
                            <th className="text-left py-4 px-4 font-bold text-cyan-800 text-base" style={{ lineHeight: "1.8" }}>
                              {t('dates.category')}
                            </th>
                            <th className="text-left py-4 px-4 font-bold text-cyan-800 text-base" style={{ lineHeight: "1.8" }}>
                              {t('dates.minAge')}
                            </th>
                            <th className="text-left py-4 px-4 font-bold text-cyan-800 text-base" style={{ lineHeight: "1.8" }}>
                              {t('dates.maxAge')}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {ageCategories.map((category, index) => (
                            <motion.tr 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.1 }}
                              className="border-b border-cyan-100 hover:bg-cyan-50/50 transition-colors"
                            >
                              <td className="py-4 px-4 text-gray-800 font-medium text-base" style={{ lineHeight: "1.8" }}>
                                {category.category}
                              </td>
                              <td className="py-4 px-4 text-teal-600 font-bold text-base" style={{ lineHeight: "1.8" }}>
                                {category.minAge}
                              </td>
                              <td className="py-4 px-4 text-cyan-600 font-bold text-base" style={{ lineHeight: "1.8" }}>
                                {category.maxAge}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>

          {/* Important Instructions */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div 
              className="relative"
            >
              <Card className="bg-white/80 backdrop-blur-lg border-2 border-blue-200 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white">
                  <CardTitle className="text-2xl md:text-3xl font-extrabold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                    <motion.div
                      animate={{
                        rotate: [0, 20, -20, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <AlertCircle className="h-8 w-8" />
                    </motion.div>
                    {t('dates.instructions')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {instructions.map((instruction, index) => (
                      <motion.div 
                        key={index}
                        variants={item}
                        whileHover={{ scale: 1.05, x: 5 }}
                        className="flex items-start gap-4 p-4 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl border border-cyan-200 hover:border-teal-300 hover:shadow-md transition-all"
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.2,
                          }}
                        >
                          <CheckCircle className="w-6 h-6 text-teal-600 mt-0.5 flex-shrink-0" />
                        </motion.div>
                        <p className="text-gray-800 font-medium text-base" style={{ lineHeight: "1.8" }}>
                          {instruction}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Additional Animated Timeline Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-cyan-500 via-teal-500 to-blue-500 rounded-full"></div>
              
              <div className="space-y-12">
                {dates.slice(0, 2).map((date, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className="flex-1"></div>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          "0 0 10px rgba(6, 182, 212, 0.5)",
                          "0 0 20px rgba(6, 182, 212, 0.8)",
                          "0 0 10px rgba(6, 182, 212, 0.5)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.5,
                      }}
                      className="w-16 h-16 rounded-full bg-white border-4 border-cyan-500 flex items-center justify-center z-10"
                    >
                      <date.icon className={`h-8 w-8 ${date.color}`} />
                    </motion.div>
                    <div className="flex-1">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-lg border-2 border-cyan-200"
                      >
                        <p className="font-bold text-cyan-700 text-lg mb-2" style={{ lineHeight: "1.8" }}>
                          {date.label}
                        </p>
                        <p className={`text-base font-semibold ${date.color}`} style={{ lineHeight: "1.6" }}>
                          {date.value}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
