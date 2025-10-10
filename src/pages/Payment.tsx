import { useState, useEffect } from "react";
import { useRegistrationData } from "@/hooks/useRegistrationData";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, Clock, IndianRupee, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { RazorpayButton, RazorpayPaymentData } from "@/components/payment/RazorpayButton";

export function Payment() {
  const { updateLocalData, loadRegistrationData } = useRegistrationData();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [applicationId, setApplicationId] = useState<string>("");
  const [personalInfo, setPersonalInfo] = useState<any>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchCategoryAndAmount();
    fetchPaymentDetails();
    fetchPersonalInfo();
  }, [user, loading, navigate]);

  useEffect(() => {
    const markExemptedPayment = async () => {
      if (!user || !["sc", "st"].includes(category.toLowerCase())) return;
      
      const { data: app } = await supabase
        .from("applications")
        .select("id")
        .eq("user_id", user.id)
        .single();
      
      if (!app) return;

      const { data: payment } = await supabase
        .from("payments")
        .select("id, payment_status")
        .eq("application_id", app.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (payment && payment.payment_status === "completed") {
        setPaymentStatus("completed");
        return;
      }

      const { error } = await supabase
        .from("payments")
        .insert({
          application_id: app.id,
          amount: 0,
          payment_status: "completed",
          payment_method: "exempted",
          payment_date: new Date().toISOString(),
        });

      if (!error) {
        setPaymentStatus("completed");
        fetchPaymentDetails();
      }
    };
    
    markExemptedPayment();
  }, [user, category]);

  const mapCategoryForPayment = (cat: string) => {
    if (!cat) return "";
    const lower = cat.trim().toLowerCase();
    switch (lower) {
      case "ur":
      case "general":
        return "general";
      case "obc":
        return "obc";
      case "sc":
        return "sc";
      case "st":
        return "st";
      case "ews":
        return "ews";
      default:
        return lower;
    }
  };

  const fetchPersonalInfo = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("personal_info")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!error && data) {
      setPersonalInfo(data);
    }
  };

  const fetchCategoryAndAmount = async () => {
    if (!user) return;
    
    const { data: personalInfo, error: infoError } = await supabase
      .from("personal_info")
      .select("category")
      .eq("user_id", user.id)
      .single();

    console.log("[Payment] personalInfo:", personalInfo, "infoError:", infoError);

    if (infoError || !personalInfo) {
      setCategory("");
      setAmount(0);
      return;
    }

    setCategory(personalInfo.category);
    const paymentCategory = mapCategoryForPayment(personalInfo.category);

    console.log("[Payment] mapped category for payment table:", paymentCategory);

    const { data: catPay, error: catError } = await supabase
      .from("category_payments")
      .select("amount")
      .eq("category", paymentCategory)
      .single();

    console.log("[Payment] category_payments query:", {
      paymentCategory,
      catPay,
      catError,
    });

    setAmount(catPay?.amount ?? 0);
  };

  const fetchPaymentDetails = async () => {
    if (!user) return;
    
    const { data: app, error: appError } = await supabase
      .from("applications")
      .select("id")
      .eq("user_id", user.id)
      .single();

    console.log("[Payment] fetchPaymentDetails: fetched application", app, "error:", appError);

    if (!app) return;
    
    setApplicationId(app.id);

    const { data: payment, error: payError } = await supabase
      .from("payments")
      .select("*")
      .eq("application_id", app.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log("[Payment] fetchPaymentDetails: payment query", {
      application_id: app.id,
      payment,
      payError,
    });

    if (payment) {
      setPaymentDetails(payment);
      setPaymentStatus(payment.payment_status);
      updateLocalData('paymentDetails', payment);
    }
  };

  const handlePaymentSuccess = async (razorpayData: RazorpayPaymentData) => {
    console.log("Processing payment success:", razorpayData);

    try {
      const { data: app } = await supabase
        .from("applications")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (!app) throw new Error("Application not found");

      const { error } = await supabase
        .from("payments")
        .insert({
          application_id: app.id,
          amount,
          payment_status: "completed",
          payment_method: "razorpay",
          transaction_id: razorpayData.razorpay_payment_id,
          payment_date: new Date().toISOString(),
          razorpay_order_id: razorpayData.razorpay_order_id,
          razorpay_payment_id: razorpayData.razorpay_payment_id,
          razorpay_signature: razorpayData.razorpay_signature,
        });

      if (error) throw error;

      setPaymentStatus("completed");
      await fetchPaymentDetails();
      await loadRegistrationData();

      // IMPORTANT: Force update the parent component
     window.dispatchEvent(new CustomEvent('payment-completed'));

      toast({
        title: "Payment Successful! 🎉",
        description: "Your payment has been recorded successfully.",
      });
    } catch (error: any) {
      console.error("Error saving payment:", error);
      throw error;
    }
  };

  const handlePaymentFailure = (error: any) => {
    console.error("Payment failed:", error);
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-700 text-lg font-semibold" style={{ lineHeight: "1.8" }}>
            Loading payment details...
          </p>
        </motion.div>
      </div>
    );
  }

  const isExempted = ["sc", "st"].includes(category.toLowerCase());
  const isPaymentCompleted = paymentStatus === "completed";

  return (
    <div className="space-y-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl mx-auto"
      >
        {/* Payment Summary Card */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                <CreditCard className="h-6 w-6" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Category and Amount */}
              <div className="bg-white p-6 rounded-xl border-2 border-blue-200 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold" style={{ lineHeight: "1.8" }}>
                    Category:
                  </span>
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-base px-4 py-1">
                    {category || "-"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold" style={{ lineHeight: "1.8" }}>
                    Application Fee:
                  </span>
                  <div className="flex items-center gap-2 text-2xl font-bold text-blue-700">
                    <IndianRupee className="h-6 w-6" />
                    {amount.toFixed(2)}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t-2 border-blue-100">
                  <span className="text-gray-700 font-semibold" style={{ lineHeight: "1.8" }}>
                    Payment Status:
                  </span>
                  {isPaymentCompleted ? (
                    <Badge className="bg-green-500 text-white text-base px-4 py-2">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </Badge>
                  ) : isExempted ? (
                    <Badge className="bg-green-500 text-white text-base px-4 py-2">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Exempted
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500 text-white text-base px-4 py-2">
                      <Clock className="h-4 w-4 mr-2" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>

              {/* Payment Details if completed */}
              {paymentDetails && isPaymentCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 p-4 rounded-xl border-2 border-green-200"
                >
                  <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                    <CheckCircle className="h-5 w-5" />
                    Payment Information
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="font-semibold capitalize">{paymentDetails.payment_method}</span>
                    </div>
                    {paymentDetails.transaction_id && (
                      <div className="flex justify-between">
                        <span>Transaction ID:</span>
                        <span className="font-mono text-xs">{paymentDetails.transaction_id}</span>
                      </div>
                    )}
                    {paymentDetails.payment_date && (
                      <div className="flex justify-between">
                        <span>Payment Date:</span>
                        <span>{new Date(paymentDetails.payment_date).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Exemption Notice */}
              {isExempted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 p-6 rounded-xl border-2 border-green-200 text-center"
                >
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <p className="text-green-700 font-semibold text-lg" style={{ lineHeight: "1.8" }}>
                    You are exempted from payment for your category ({category}).
                  </p>
                  <p className="text-green-600 text-sm mt-2" style={{ lineHeight: "1.8" }}>
                    No payment is required. You can proceed to the next step.
                  </p>
                </motion.div>
              )}

              {/* Razorpay Button */}
              {!isExempted && amount > 0 && !isPaymentCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4"
                >
                  <RazorpayButton
                    amount={amount}
                    applicationId={applicationId}
                    userName={`${personalInfo?.first_name || ''} ${personalInfo?.last_name || ''}`.trim() || "Candidate"}
                    userEmail={user?.email || ""}
                    userPhone={personalInfo?.alternative_mobile || ""}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                    className="w-full"
                  />

                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span style={{ lineHeight: "1.8" }}>Secure payment powered by Razorpay</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
