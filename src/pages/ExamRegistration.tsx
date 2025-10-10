import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { RegistrationStepper } from "@/components/registration/RegistrationStepper";
import { ProtectedRoute } from "@/components/registration/ProtectedRoute";
import { ApplicationStatusGuard } from "@/components/registration/ApplicationStatusGuard";
import { useRegistrationData } from "@/hooks/useRegistrationData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Upload, 
  CreditCard, 
  FileCheck,
  ArrowLeft,
  ArrowRight,
  Save,
  FileText,
  CheckCircle,
  Loader2,
  Sparkles,
  Shield
} from "lucide-react";
import { Education } from "@/pages/Education";
import { DocumentsUpload } from "@/pages/DocumentsUpload";
import { Payment } from "@/pages/Payment";
import { OtherDetails } from "@/pages/OtherDetails";
import { PersonalInfo } from "@/pages/PersonalInfo";
import { Experience } from "./Experience";
import { FinalPreview } from "@/pages/FinalPreview";

const REGISTRATION_STEPS = [
  {
    id: 1,
    title: "Personal Info",
    description: "Basic details",
    icon: User,
    component: "PersonalInfo",
    color: "from-cyan-500 to-teal-500"
  },
  {
    id: 2,
    title: "Other Details",
    description: "Additional info",
    icon: FileText,
    component: "OtherDetails",
    color: "from-teal-500 to-blue-500"
  },
  {
    id: 3,
    title: "Education",
    description: "Qualifications",
    icon: GraduationCap,
    component: "Education",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 4,
    title: "Experience",
    description: "Work history",
    icon: Briefcase,
    component: "Experience",
    color: "from-cyan-500 to-teal-500"
  },
  {
    id: 5,
    title: "Documents",
    description: "Upload files",
    icon: Upload,
    component: "Documents",
    color: "from-teal-500 to-blue-500"
  },
  {
    id: 6,
    title: "Payment",
    description: "Fee payment",
    icon: CreditCard,
    component: "Payment",
    color: "from-blue-500 to-purple-500"
  },
  {
    id: 7,
    title: "Review",
    description: "Final check",
    icon: FileCheck,
    component: "Review",
    color: "from-purple-500 to-cyan-500"
  }
];

export function ExamRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data, loading, saving, savePersonalInfo, saveEducationInfo, saveExperienceInfo, updateLocalData, ensureApplication, loadRegistrationData } = useRegistrationData();

  useEffect(() => {
    console.log('ExamRegistration paymentDetails:', data.paymentDetails);
    // Check if payment is completed
    if (data.paymentDetails?.payment_status === 'completed') {
      setPaymentCompleted(true);
    }
  }, [data.paymentDetails]);

  // Listen for payment completion event
  useEffect(() => {
    const handlePaymentCompleted = async () => {
      console.log('Payment completed event received, reloading data...');
      await loadRegistrationData();
      setPaymentCompleted(true);
    };

    window.addEventListener('payment-completed', handlePaymentCompleted);

    return () => {
      window.removeEventListener('payment-completed', handlePaymentCompleted);
    };
  }, [loadRegistrationData]);

  if (!('otherDetails' in data)) {
    (data as any).otherDetails = {};
  }
  const { debounce, batchOperations, createCache } = usePerformanceOptimization();

  const postsCache = createCache();

  useEffect(() => {
    const fetchPosts = async () => {
      const cacheKey = 'active_posts';
      const cachedPosts = postsCache.get(cacheKey);
      
      if (cachedPosts) {
        setPosts(cachedPosts);
        setPostsLoading(false);
        return;
      }

      setPostsLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, post_name, post_code, is_active')
          .eq('is_active', true)
          .order('post_name');
        
        if (!error && data) {
          setPosts(data);
          postsCache.set(cacheKey, data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Error",
          description: "Failed to load exam posts",
          variant: "destructive"
        });
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const maxCompletedStep = Math.max(0, ...data.completedSteps);
    const isPaymentCompleted = data.paymentDetails?.payment_status === 'completed' || paymentCompleted;
    
    console.log('Calculating current step:', { maxCompletedStep, isPaymentCompleted, paymentDetails: data.paymentDetails });
    
    if (maxCompletedStep >= 6 && isPaymentCompleted) {
      setCurrentStep(7);
    } else {
      const nextStep = maxCompletedStep < 6 ? maxCompletedStep + 1 : 6;
      setCurrentStep(nextStep);
    }
  }, [data.completedSteps, data.paymentDetails, paymentCompleted]);

  const steps = REGISTRATION_STEPS.map(step => ({
    ...step,
    completed:
      step.id === 6
        ? data.paymentDetails?.payment_status === 'completed' || paymentCompleted
        : data.completedSteps.includes(step.id),
    current: step.id === currentStep
  }));

  const handleStepClick = (stepId: number) => {
    const maxAllowedStep = Math.max(1, ...data.completedSteps) + 1;
    if (stepId <= maxAllowedStep) {
      setCurrentStep(stepId);
    } else {
      toast({
        title: "Complete Previous Steps",
        description: "Please complete the previous steps before proceeding",
        variant: "destructive"
      });
    }
  };

  const handleNext = async () => {
    if (currentStep < 6) {
      if (currentStep === 4) {
        await handleSaveCurrentStep();
        setCurrentStep(prev => prev + 1);
      } else {
        const saveSuccess = await handleSaveCurrentStep();
        if (saveSuccess) {
          setCurrentStep(prev => prev + 1);
        }
      }
    } else if (currentStep === 6) {
      // Check payment status before allowing next
      const isPaymentDone = data.paymentDetails?.payment_status === 'completed' || paymentCompleted;
      
      if (isPaymentDone) {
        setCurrentStep(7);
      } else {
        toast({
          title: "Payment Required",
          description: "Please complete the payment to proceed",
          variant: "destructive"
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveCurrentStep = async () => {
    try {
      switch (currentStep) {
        case 1: {
          return true;
        }
        case 2: {
          const otherDetails = (data as any).otherDetails || {};
          const { error } = await supabase
            .from('other_details')
            .upsert({
              user_id: user?.id,
              ...otherDetails,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });
          if (error) throw error;
          return true;
        }
        case 3: {
          return true;
        }
        case 4: {
          return true;
        }
        case 5: {
          return true;
        }
        default:
          return true;
      }
    } catch (error) {
      console.error('Error saving step:', error);
      toast({
        title: "Error Saving Data",
        description: "Please try again",
        variant: "destructive"
      });
      return false;
    }
  };

  const handlePersonalInfoChange = (field: string, value: any) => {
    updateLocalData('personalInfo', {
      ...data.personalInfo,
      [field]: value
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfo onNext={handleNext} onSave={async (formData) => {
          updateLocalData('personalInfo', formData);
          return await savePersonalInfo(formData);
        }} />;
      case 2:
        return <OtherDetails onNext={handleNext} />;
      case 3:
        return <Education onNext={handleNext} />;
      case 4:
        return <Experience onNext={handleNext} />;
      case 5:
        return <DocumentsUpload />;
      case 6: {
        return <Payment />;
      }
      case 7:
        return <FinalPreview />;
      default:
        return null;
    }
  };

  if (loading) {
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
            Loading registration data...
          </p>
        </motion.div>
      </div>
    );
  }

  const isPaymentCompleted = data.paymentDetails?.payment_status === 'completed' || paymentCompleted;

  return (
    <ProtectedRoute requirePhoneVerification={true}>
      <ApplicationStatusGuard allowedStatuses={['draft', 'payment_pending', 'document_pending', 'payment_completed']}>
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

          <main className="container mx-auto px-4 py-12 relative z-10">
            {/* Header Section */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 rounded-full text-base font-semibold mb-6 shadow-xl"
                style={{ lineHeight: "1.8" }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Shield className="w-5 h-5" />
                </motion.div>
                Welcome, {user?.email}
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-4"
                style={{ lineHeight: "1.6" }}
              >
                Exam Registration Portal
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-gray-700 text-lg max-w-2xl mx-auto"
                style={{ lineHeight: "1.8" }}
              >
                Complete your registration step by step. Your progress is automatically saved.
              </motion.p>
            </div>

            {/* Progress Stepper */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-12"
            >
              <RegistrationStepper
                steps={steps}
                currentStep={currentStep}
                onStepClick={handleStepClick}
              />
            </motion.div>

            {/* Main Content Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Card className="bg-white/90 backdrop-blur-xl border-2 border-cyan-200 shadow-2xl rounded-3xl">
                <div className="p-8">
                  {/* Step Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <motion.div 
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.div
                        className={`w-16 h-16 bg-gradient-to-br ${steps[currentStep - 1]?.color} rounded-2xl flex items-center justify-center shadow-xl`}
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        {React.createElement(steps[currentStep - 1]?.icon || User, {
                          className: "w-8 h-8 text-white"
                        })}
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800" style={{ lineHeight: "1.6" }}>
                          Step {currentStep}: {steps[currentStep - 1]?.title}
                        </h2>
                        <p className="text-gray-600 text-base" style={{ lineHeight: "1.8" }}>
                          {steps[currentStep - 1]?.description}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleSaveCurrentStep}
                        disabled={saving}
                        className="flex items-center gap-2 border-2 border-teal-300 hover:bg-teal-50 rounded-xl px-6 py-6 font-semibold"
                      >
                        {saving ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        {saving ? "Saving..." : "Save Progress"}
                      </Button>
                    </motion.div>
                  </div>

                  {/* Step Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.4 }}
                      className="min-h-[400px]"
                    >
                      {renderStepContent()}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  {currentStep !== 1 && (
                    <motion.div 
                      className="flex justify-between mt-10 pt-8 border-t-2 border-cyan-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handlePrevious}
                        disabled={saving}
                        className="flex items-center gap-2 border-2 border-gray-300 hover:bg-gray-50 rounded-xl px-8 py-6 font-semibold"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                      </Button>

                      {currentStep === 6 ? (
                        <Button
                          size="lg"
                          onClick={handleNext}
                          disabled={!isPaymentCompleted}
                          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl px-8 py-6 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      ) : currentStep === 7 ? (
                        <Button
                          size="lg"
                          onClick={async () => {
                            try {
                              const nextAppNumber = `REG${new Date().getFullYear()}${String(Date.now()).slice(-7)}`;
                              const { error } = await supabase
                                .from('applications')
                                .update({
                                  status: 'submitted',
                                  submitted_at: new Date().toISOString(),
                                  application_number: nextAppNumber
                                })
                                .eq('id', (data.applicationInfo as any)?.id)
                                .select()
                                .single();
                              if (error) throw error;
                              toast({ title: 'Success', description: 'Application submitted successfully!' });
                              navigate('/dashboard');
                            } catch (err) {
                              toast({ title: 'Error', description: 'Failed to submit application', variant: 'destructive' });
                            }
                          }}
                          disabled={saving}
                          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl px-8 py-6 font-semibold shadow-lg"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Submit Application
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          onClick={handleNext}
                          disabled={saving}
                          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl px-8 py-6 font-semibold shadow-lg"
                        >
                          Next
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      )}
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          </main>
        </div>
      </ApplicationStatusGuard>
    </ProtectedRoute>
  );
}
