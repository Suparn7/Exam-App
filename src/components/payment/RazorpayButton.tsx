import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CreditCard, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  amount: number; // Amount in rupees
  orderId?: string;
  applicationId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  onSuccess: (paymentData: RazorpayPaymentData) => Promise<void>;
  onFailure?: (error: any) => void;
  disabled?: boolean;
  className?: string;
}

export interface RazorpayPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export function RazorpayButton({
  amount,
  orderId,
  applicationId,
  userName = "Candidate",
  userEmail = "",
  userPhone = "",
  onSuccess,
  onFailure,
  disabled = false,
  className = "",
}: RazorpayButtonProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      // Razorpay options
      const options = {
        key: "rzp_test_RQfF96mdomltrN", // Your Razorpay Key ID
        amount: amount * 100, // Amount in paise (multiply by 100)
        currency: "INR",
        name: "Exam Registration Portal",
        description: `Application Payment - ${applicationId}`,
        image: "/logo.png", // Your logo URL
        order_id: orderId, // Optional: Generate this from backend for better security
        handler: async function (response: RazorpayPaymentData) {
          console.log("Razorpay payment success:", response);
          
          try {
            await onSuccess(response);
            setIsSuccess(true);
            
            toast({
              title: "Payment Successful! 🎉",
              description: `Payment ID: ${response.razorpay_payment_id}`,
            });
          } catch (error: any) {
            console.error("Error in onSuccess callback:", error);
            toast({
              title: "Payment Recorded But Error Occurred",
              description: error.message || "Please contact support with your payment ID",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        notes: {
          application_id: applicationId,
        },
        theme: {
          color: "#06B6D4", // Cyan-500 color
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed by user");
            setIsProcessing(false);
            
            toast({
              title: "Payment Cancelled",
              description: "You closed the payment window",
              variant: "destructive",
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on("payment.failed", function (response: any) {
        console.error("Razorpay payment failed:", response);
        setIsProcessing(false);
        
        const errorMessage = response.error?.description || "Payment failed";
        
        toast({
          title: "Payment Failed",
          description: errorMessage,
          variant: "destructive",
        });

        if (onFailure) {
          onFailure(response.error);
        }
      });

      razorpay.open();
    } catch (error: any) {
      console.error("Error initializing payment:", error);
      setIsProcessing(false);
      
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });

      if (onFailure) {
        onFailure(error);
      }
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isProcessing || isSuccess}
      size="lg"
      className={`bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl px-8 py-6 font-semibold shadow-lg ${className}`}
    >
      {isSuccess ? (
        <>
          <CheckCircle className="mr-2 h-5 w-5" />
          Payment Completed
        </>
      ) : isProcessing ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mr-2"
          >
            <Loader2 className="h-5 w-5" />
          </motion.div>
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-5 w-5" />
          Pay ₹{amount.toFixed(2)} with Razorpay
        </>
      )}
    </Button>
  );
}
