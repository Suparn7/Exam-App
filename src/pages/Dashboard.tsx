import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  FileText, 
  CreditCard, 
  Upload, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  Bell,
  Calendar,
  Award,
  BookOpen,
  TrendingUp,
  Shield,
  ArrowRight,
  Download,
  PartyPopper,
  Star
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import { supabase } from "@/integrations/supabase/client";

// Define the Payment interface based on actual payments table fields
interface Payment {
  id: string;
  amount: number;
  application_id: string;
  created_at: string;
  payment_date: string;
  payment_method: string;
  payment_status: 'completed' | 'pending' | 'failed' | 'refunded';
  transaction_id: string;
  updated_at: string;
}

interface UserData {
  profile?: any;
  personalInfo?: any;
  applications?: any[];
  documents?: any[];
  payments?: any[];
}

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<UserData>({});
  const [mobileVerified, setMobileVerified] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    
    fetchUserData();
  }, [user, loading, navigate]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setMobileVerified(!!profile?.phone_verified);

      // Fetch personal info
      const { data: personalInfo } = await supabase
        .from('personal_info')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch applications
      const { data: applications } = await supabase
        .from('applications')
        .select('*, posts(*)')
        .eq('user_id', user.id);

      // Fetch documents
      const { data: documents } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id);

      // Fetch payments (by application_id for this user)
      let payments: Payment[] = [];
      if (applications && Array.isArray(applications)) {
        const applicationIds = applications.map((app: any) => app.id);
        if (applicationIds.length > 0) {
          const { data: paymentsData } = await supabase
            .from('payments')
            .select('*')
            .in('application_id', applicationIds);
          payments = (paymentsData as Payment[]) || [];
        }
      }

      setUserData({
        profile,
        personalInfo,
        applications: applications || [],
        documents: documents || [],
        payments: payments || []
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getProfileCompletionPercentage = () => {
    // Check if any application is submitted - that means 100% complete
    const hasSubmittedApplication = userData.applications?.some(
      (app: any) => app.status === 'submitted' || app.status === 'payment_completed'
    );

    if (hasSubmittedApplication) {
      return 100;
    }

    // Otherwise calculate based on progress
    let completed = 0;
    const total = 4;

    if (userData.personalInfo) completed++;
    if (userData.documents && userData.documents.length > 0) completed++;
    if (userData.applications && userData.applications.length > 0) completed++;
    if (userData.payments && userData.payments.length > 0) completed++;

    return (completed / total) * 100;
  };

  const hasSubmittedApplication = userData.applications?.some(
    (app: any) => app.status === 'submitted' || app.status === 'payment_completed'
  );

  const submittedApplication = userData.applications?.find(
    (app: any) => app.status === 'submitted' || app.status === 'payment_completed'
  );

  const stats = [
    { 
      label: "Total Applications", 
      value: userData.applications?.length || 0, 
      icon: FileText, 
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200"
    },
    { 
      label: "Documents Uploaded", 
      value: userData.documents?.length || 0, 
      icon: Upload, 
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    { 
      label: "Profile Completion", 
      value: `${Math.round(getProfileCompletionPercentage())}%`, 
      icon: TrendingUp, 
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
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

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10"
        >
          <motion.div
            className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-700 text-lg font-semibold" style={{ lineHeight: "1.8" }}>
            Loading dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  // If not mobile verified, show only Start Registration
  if (!mobileVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-4 relative z-10"
        >
          <div
            
          >
            <Card className="bg-white/90 backdrop-blur-xl border-2 border-cyan-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
                <CardTitle className="flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <Shield className="h-6 w-6" />
                  </motion.div>
                  Phone Verification Required
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="mb-6 text-gray-700 text-base" style={{ lineHeight: "1.8" }}>
                  Please verify your mobile number to continue registration and access profile features.
                </p>
                <Button 
                  onClick={() => navigate('/verify-phone')} 
                  className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white py-6 rounded-xl shadow-lg font-semibold"
                >
                  Start Registration
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
        }}
      />

      <div className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-4"
            >
              <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-2 text-base shadow-lg" style={{ lineHeight: "1.8" }}>
                Candidate Dashboard
              </Badge>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-3" style={{ lineHeight: "1.6" }}>
              Welcome, {userData.personalInfo?.first_name || 'Candidate'}!
            </h1>
            <p className="text-gray-700 text-lg" style={{ lineHeight: "1.8" }}>
              Manage your applications and track your progress
            </p>
          </motion.div>

          {/* SUCCESS CARD - Show first if application is submitted */}
          {submittedApplication && (
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="mb-12 max-w-4xl mx-auto"
            >
              <div
                
              >
                <Card className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 border-0 shadow-2xl relative overflow-hidden">
                  {/* Animated stars */}
                  <motion.div
                    className="absolute top-4 right-4"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  >
                    <Star className="h-12 w-12 text-yellow-300 fill-yellow-300" />
                  </motion.div>
                  <motion.div
                    className="absolute bottom-4 left-4"
                    animate={{
                      rotate: [360, 0],
                      scale: [1, 1.3, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                  >
                    <PartyPopper className="h-10 w-10 text-yellow-200" />
                  </motion.div>

                  <CardContent className="p-10 text-center relative z-10">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <CheckCircle className="h-20 w-20 text-white mx-auto mb-6" />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" style={{ lineHeight: "1.6" }}>
                      Application Successfully Submitted! 🎉
                    </h2>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border-2 border-white/30">
                      <p className="text-white/90 text-lg mb-4" style={{ lineHeight: "1.8" }}>
                        <strong>Post Name:</strong> {submittedApplication.posts?.post_name}
                      </p>
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <Award className="h-6 w-6 text-yellow-300" />
                        <p className="text-2xl font-bold text-white">
                          Registration #: {submittedApplication.application_number}
                        </p>
                      </div>
                      <p className="text-white/80 text-sm" style={{ lineHeight: "1.8" }}>
                        Please save this registration number for future reference
                      </p>
                    </div>
                    <Badge className="bg-white text-green-700 text-lg px-6 py-2 font-bold shadow-lg">
                      Status: {submittedApplication.status.toUpperCase()}
                    </Badge>
                    <p className="text-white/90 text-base mt-6" style={{ lineHeight: "1.8" }}>
                      Your application has been successfully submitted. No further edits are allowed.
                      You will be notified about further updates via email and SMS.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                      <Button className="bg-white text-green-700 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg font-semibold">
                        <Download className="mr-2 h-5 w-5" />
                        Download Receipt
                      </Button>
                      <Button className="bg-white/20 backdrop-blur-lg text-white border-2 border-white hover:bg-white/30 px-8 py-6 text-lg rounded-xl shadow-lg font-semibold">
                        <FileText className="mr-2 h-5 w-5" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Stats Cards */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={item}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div
                  
                >
                  <Card className={`bg-white/90 backdrop-blur-lg border-2 ${stat.borderColor} shadow-xl hover:shadow-2xl transition-all h-full`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center`}
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
                          <stat.icon className={`h-8 w-8 ${stat.color}`} />
                        </motion.div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium mb-1" style={{ lineHeight: "1.8" }}>
                            {stat.label}
                          </p>
                          <p className={`text-3xl font-extrabold ${stat.color}`}>
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Profile Completion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-12"
          >
            <div
              
            >
              <Card className="bg-white/90 backdrop-blur-lg border-2 border-teal-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                  <CardTitle className="flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                    <TrendingUp className="h-6 w-6" />
                    Profile Completion Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-semibold text-base" style={{ lineHeight: "1.8" }}>
                        {Math.round(getProfileCompletionPercentage())}% Complete
                      </span>
                      <span className="text-sm text-gray-600">
                        {hasSubmittedApplication ? "All done! 🎉" : userData.personalInfo ? "Keep going!" : "Get started"}
                      </span>
                    </div>
                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${getProfileCompletionPercentage()}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    {[
                      { label: "Personal Info", completed: hasSubmittedApplication || !!userData.personalInfo, icon: User },
                      { label: "Documents", completed: hasSubmittedApplication || (userData.documents && userData.documents.length > 0), icon: Upload },
                      { label: "Application", completed: hasSubmittedApplication || (userData.applications && userData.applications.length > 0), icon: FileText },
                      { label: "Payment", completed: hasSubmittedApplication, icon: CreditCard },
                    ].map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className={`p-4 rounded-xl border-2 text-center ${
                          step.completed 
                            ? "bg-green-50 border-green-300" 
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <step.icon className={`h-6 w-6 mx-auto mb-2 ${
                          step.completed ? "text-green-600" : "text-gray-400"
                        }`} />
                        <p className="text-xs font-semibold text-gray-700" style={{ lineHeight: "1.6" }}>
                          {step.label}
                        </p>
                        {step.completed && (
                          <CheckCircle className="h-4 w-4 text-green-600 mx-auto mt-1" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Applications Section - Only show if not submitted or show all applications */}
          {!submittedApplication && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div
                
              >
                <Card className="bg-white/90 backdrop-blur-lg border-2 border-cyan-200 shadow-2xl">
                  <CardHeader className="bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white">
                    <CardTitle className="flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                      <FileText className="h-6 w-6" />
                      Your Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <AnimatePresence mode="wait">
                      {userData.applications && userData.applications.length > 0 ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4"
                        >
                          {userData.applications.map((app: any, index: number) => (
                            <motion.div 
                              key={app.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                              className="p-6 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl border-2 border-cyan-200 hover:border-teal-300 hover:shadow-lg transition-all"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-gray-800 text-lg" style={{ lineHeight: "1.8" }}>
                                  {app.posts?.post_name}
                                </h4>
                                <Badge className={
                                  app.status === 'submitted' ? 'bg-green-500 text-white' :
                                  app.status === 'completed' ? 'bg-blue-500 text-white' :
                                  app.status === 'payment_completed' ? 'bg-purple-500 text-white' :
                                  'bg-gray-500 text-white'
                                }>
                                  {app.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                                <Award className="h-4 w-4" />
                                Application #: <span className="font-semibold">{app.application_number}</span>
                              </p>
                              {app.status !== 'submitted' && (
                                <Button 
                                  size="sm"
                                  onClick={() => navigate('/register')}
                                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white mt-3"
                                >
                                  Continue Registration
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-12"
                        >
                          <motion.div
                            animate={{
                              y: [0, -10, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          >
                            <Calendar className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                          </motion.div>
                          <p className="text-gray-600 text-lg mb-6" style={{ lineHeight: "1.8" }}>
                            No applications yet
                          </p>
                          <Button 
                            onClick={() => navigate('/verify-phone')}
                            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg font-semibold"
                          >
                            Start Registration
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
