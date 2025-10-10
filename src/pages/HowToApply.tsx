import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  FileText, 
  Upload, 
  CreditCard, 
  Download,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Users,
  AlertCircle,
  Zap,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

export function HowToApply() {
  const { t } = useTranslation();

  const steps = [
    {
      step: 1,
      title: t('apply.step1'),
      description: "Create your account and get registration credentials via SMS",
      icon: UserPlus,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200"
    },
    {
      step: 2,
      title: t('apply.step2'),
      description: "Complete personal, educational, and experience information",
      icon: FileText,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    {
      step: 3,
      title: t('apply.step3'),
      description: "Upload all required documents in prescribed format",
      icon: Upload,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      step: 4,
      title: t('apply.step4'),
      description: "Complete payment process using secure payment gateway",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      step: 5,
      title: t('apply.step5'),
      description: "Download and save your application acknowledgment",
      icon: Download,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    }
  ];

  const requirements = [
    {
      title: "Personal Documents",
      items: [
        "Passport size photograph (recent)",
        "Signature in prescribed format",
        "Aadhar Card (clear copy)",
        "Valid mobile number for SMS verification"
      ],
      icon: FileText,
      color: "text-cyan-600",
      borderColor: "border-cyan-200",
      bgGradient: "from-cyan-50 to-teal-50"
    },
    {
      title: "Educational Certificates",
      items: [
        "10th/Matric Certificate",
        "ANM Training Certificate",
        "Nursing Council Registration",
        "Institution Recognition Certificate"
      ],
      icon: Upload,
      color: "text-teal-600",
      borderColor: "border-teal-200",
      bgGradient: "from-teal-50 to-blue-50"
    },
    {
      title: "Additional Requirements",
      items: [
        "Valid email address",
        "Payment method (Debit/Credit Card/Net Banking)",
        "Permanent address proof",
        "Category certificate (if applicable)"
      ],
      icon: Shield,
      color: "text-blue-600",
      borderColor: "border-blue-200",
      bgGradient: "from-blue-50 to-cyan-50"
    }
  ];

  const tips = [
    {
      title: "Before You Start",
      content: "Ensure you have all required documents ready in digital format before beginning the registration process.",
      icon: Zap,
      color: "text-yellow-600"
    },
    {
      title: "Photo & Signature Guidelines",
      content: "Upload recent passport-size photo and signature in JPG/PNG format, size should be between 10KB to 100KB.",
      icon: Star,
      color: "text-purple-600"
    },
    {
      title: "Payment Process",
      content: "Keep your payment method ready. Transaction failures may cause delays in application processing.",
      icon: CreditCard,
      color: "text-green-600"
    },
    {
      title: "Technical Support",
      content: "For technical issues, contact helpline: 7250310625 (10:00 AM to 6:00 PM, Monday to Saturday).",
      icon: AlertCircle,
      color: "text-red-600"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
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
              {t('apply.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-700 max-w-2xl mx-auto"
              style={{ lineHeight: "1.8" }}
            >
              Step-by-step guide to complete your JANMCE-2025 application process
            </motion.p>
          </motion.div>

          {/* Application Steps with Enhanced Design */}
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
              Application Process
            </motion.h2>

            {/* Vertical Timeline with Connecting Line */}
            <div className="max-w-4xl mx-auto relative">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-teal-500 to-blue-500 rounded-full transform md:-translate-x-1/2"></div>

              <div className="space-y-8">
                {steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    variants={item}
                    whileHover={{ scale: 1.02, x: index % 2 === 0 ? 5 : -5 }}
                    className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className="flex-1 hidden md:block"></div>
                    
                    {/* Step Number Circle */}
                    <motion.div
                      animate={{
                        scale: [1, 1.15, 1],
                        boxShadow: [
                          "0 0 15px rgba(6, 182, 212, 0.4)",
                          "0 0 30px rgba(6, 182, 212, 0.7)",
                          "0 0 15px rgba(6, 182, 212, 0.4)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center z-10 shadow-xl flex-shrink-0"
                    >
                      <span className="text-white font-extrabold text-2xl md:text-3xl">
                        {step.step}
                      </span>
                    </motion.div>

                    <div className="flex-1">
                      <div 
                        className="relative"
                        
                      >
                        <Card className={`bg-white/90 backdrop-blur-lg border-2 ${step.borderColor} shadow-xl hover:shadow-2xl transition-all`}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-5">
                              <motion.div 
                                className={`flex-shrink-0 w-14 h-14 ${step.bgColor} rounded-2xl flex items-center justify-center`}
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
                                <step.icon className={`h-7 w-7 ${step.color}`} />
                              </motion.div>
                              <div className="flex-1">
                                <h3 className={`text-xl font-bold mb-2 ${step.color}`} style={{ lineHeight: "1.8" }}>
                                  {step.title}
                                </h3>
                                <p className="text-gray-700 text-base" style={{ lineHeight: "1.8" }}>
                                  {step.description}
                                </p>
                              </div>
                              <ArrowRight className={`h-6 w-6 ${step.color} flex-shrink-0`} />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-center mt-12"
            >
              <Link to="/register">
                <Button className="bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-600 hover:via-teal-600 hover:to-blue-700 text-white px-10 py-6 text-lg rounded-xl shadow-xl hover:shadow-cyan-500/50 transition-all">
                  Start Your Application
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Requirements Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-12"
              style={{ lineHeight: "1.6" }}
            >
              Document Requirements
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {requirements.map((req, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <div 
                    className="relative h-full"
                    
                  >
                    <Card className={`bg-gradient-to-br ${req.bgGradient} backdrop-blur-lg border-2 ${req.borderColor} shadow-xl hover:shadow-2xl transition-all h-full`}>
                      <CardHeader className="bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm">
                        <CardTitle className="flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                          <motion.div
                            animate={{
                              rotate: [0, 15, -15, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: index * 0.5,
                            }}
                          >
                            <req.icon className={`h-7 w-7 ${req.color}`} />
                          </motion.div>
                          <span className={`${req.color} font-bold text-lg`}>
                            {req.title}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          {req.items.map((item, itemIndex) => (
                            <motion.li 
                              key={itemIndex}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: itemIndex * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <motion.div
                                animate={{
                                  scale: [1, 1.2, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: itemIndex * 0.2,
                                }}
                              >
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              </motion.div>
                              <span className="text-sm text-gray-800 font-medium" style={{ lineHeight: "1.8" }}>
                                {item}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Important Tips Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-12"
              style={{ lineHeight: "1.6" }}
            >
              Important Tips
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {tips.map((tip, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <div 
                    className="relative h-full"
                    
                  >
                    <Card className="bg-white/90 backdrop-blur-lg border-2 border-teal-200 shadow-lg hover:shadow-xl transition-all h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <motion.div
                            animate={{
                              y: [0, -5, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.3,
                            }}
                          >
                            <tip.icon className={`h-8 w-8 ${tip.color} flex-shrink-0`} />
                          </motion.div>
                          <div>
                            <h3 className="font-bold text-gray-800 mb-2 text-lg" style={{ lineHeight: "1.8" }}>
                              {tip.title}
                            </h3>
                            <p className="text-sm text-gray-700" style={{ lineHeight: "1.8" }}>
                              {tip.content}
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

          {/* Support Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div 
              className="relative"
              
            >
              <Card className="bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 border-0 shadow-2xl">
                <CardContent className="p-10 text-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                  >
                    <Users className="h-16 w-16 text-white mx-auto mb-6" />
                  </motion.div>
                  <h3 className="text-3xl font-extrabold text-white mb-4" style={{ lineHeight: "1.6" }}>
                    Need Help?
                  </h3>
                  <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto" style={{ lineHeight: "1.8" }}>
                    Our support team is here to help you throughout the application process. 
                    Don't hesitate to reach out if you face any difficulties.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg font-semibold">
                      <Clock className="mr-2 h-5 w-5" />
                      {t('home.helpline')}
                    </Button>
                    <Button className="bg-white/20 backdrop-blur-lg text-white border-2 border-white hover:bg-white/30 px-8 py-6 text-lg rounded-xl shadow-lg font-semibold">
                      <Shield className="mr-2 h-5 w-5" />
                      Email Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
