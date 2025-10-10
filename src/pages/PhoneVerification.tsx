import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { SMSService, generateOTP } from "@/lib/sms";
import { supabase } from "@/integrations/supabase/client";
import { 
  Smartphone, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Send, 
  Shield,
  Lock,
  Sparkles,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Header } from "@/components/layout/Header";

export function PhoneVerification() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    checkVerificationStatus();
  }, [user, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const checkVerificationStatus = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone_verified, mobile_number')
        .eq('user_id', user.id)
        .single();

      console.log('Profile fetched from Supabase:', profile);
      console.log('phone_verified value:', profile?.phone_verified);

      if (profile?.phone_verified) {
        console.log('User is verified, navigating to /register');
        navigate('/register');
      } else if (profile?.mobile_number) {
        setMobile(profile.mobile_number);
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (newOtp.every(digit => digit !== '') && !isLoading) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
      handleVerifyOtp(pastedData);
    }
  };

  const handleSendOtp = async () => {
    if (!mobile.trim() || mobile.length < 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const otpCode = generateOTP();
      setGeneratedOtp(otpCode);

      // Store OTP in database
      await supabase
        .from('phone_otps')
        .insert({
          user_id: user!.id,
          mobile: mobile,
          code: otpCode,
          purpose: 'registration',
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        });

      // Send SMS
      const smsResult = await SMSService.sendOTP(mobile, otpCode);
      
      if (smsResult) {
        await supabase
          .from('profiles')
          .update({ mobile_number: mobile })
          .eq('user_id', user!.id);

        setStep('otp');
        setTimeLeft(120);
        setCanResend(false);
        setAttempts(0);
        
        toast({
          title: "OTP Sent Successfully",
          description: `Verification code sent to ${mobile}`,
        });

        // Focus first OTP input
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Failed to Send OTP",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otpCode?: string) => {
    const codeToVerify = otpCode || otp.join('');
    
    if (codeToVerify.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: otpRecord, error } = await supabase
        .from('phone_otps')
        .select('*')
        .eq('user_id', user!.id)
        .eq('mobile', mobile)
        .eq('code', codeToVerify)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !otpRecord) {
        setAttempts(prev => prev + 1);
        
        if (attempts >= 2) {
          toast({
            title: "Too Many Failed Attempts",
            description: "Please request a new OTP",
            variant: "destructive"
          });
          setOtp(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        } else {
          toast({
            title: "Invalid or Expired OTP",
            description: `Please check the code. ${3 - attempts - 1} attempts remaining`,
            variant: "destructive"
          });
          setOtp(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        }
        return;
      }

      await supabase
        .from('phone_otps')
        .update({ used: true })
        .eq('id', otpRecord.id);

      await supabase
        .from('profiles')
        .update({ phone_verified: true })
        .eq('user_id', user!.id);

      setIsVerified(true);

      toast({
        title: "Phone Verified Successfully!",
        description: "You can now proceed to exam registration",
      });

      setTimeout(() => {
        navigate('/register');
      }, 2000);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Verification Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    await supabase
      .from('phone_otps')
      .update({ used: true })
      .eq('user_id', user!.id)
      .eq('mobile', mobile)
      .eq('used', false);

    setOtp(['', '', '', '', '', '']);
    await handleSendOtp();
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(6, 182, 212, 0.4)",
                  "0 0 40px rgba(6, 182, 212, 0.7)",
                  "0 0 20px rgba(6, 182, 212, 0.4)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <Smartphone className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-3" style={{ lineHeight: "1.6" }}>
              Phone Verification
            </h1>
            <p className="text-gray-700 text-base" style={{ lineHeight: "1.8" }}>
              {step === 'phone' 
                ? "Enter your mobile number to receive verification code"
                : "Enter the 6-digit code sent to your mobile"
              }
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!isVerified ? (
              <motion.div
                key="verification-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                
              >
                <Card className="bg-white/90 backdrop-blur-xl border-2 border-cyan-200 shadow-2xl">
                  {step === 'phone' ? (
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="p-8 space-y-8"
                    >
                      <motion.div variants={item} className="space-y-3">
                        <label htmlFor="mobile" className="text-sm font-bold text-gray-800 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                          <Smartphone className="h-4 w-4 text-cyan-600" />
                          Mobile Number
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">
                            +91
                          </span>
                          <Input
                            id="mobile"
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="pl-16 h-14 text-lg bg-white/50 border-2 border-cyan-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 rounded-xl"
                            maxLength={10}
                            style={{ lineHeight: "1.8" }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                          <Shield className="h-3 w-3" />
                          We'll send a verification code to this number
                        </p>
                      </motion.div>

                      <motion.div variants={item} className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => navigate('/auth')}
                          className="flex items-center gap-2 border-2 border-gray-300 hover:bg-gray-50 rounded-xl px-6 py-6"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </Button>
                        
                        <Button
                          onClick={handleSendOtp}
                          disabled={isLoading || mobile.length !== 10}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl px-6 py-6 font-semibold shadow-lg"
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <RefreshCw className="w-5 h-5" />
                            </motion.div>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              Send OTP
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="p-8 space-y-8"
                    >
                      <motion.div variants={item} className="text-center bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-4 border-2 border-cyan-200">
                        <p className="text-sm text-gray-600 mb-2" style={{ lineHeight: "1.8" }}>
                          Code sent to:
                        </p>
                        <p className="text-lg font-bold text-gray-800" style={{ lineHeight: "1.8" }}>
                          +91 {mobile}
                        </p>
                      </motion.div>

                      <motion.div variants={item} className="space-y-4">
                        <label className="text-sm font-bold text-gray-800 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                          <Lock className="h-4 w-4 text-teal-600" />
                          Enter Verification Code
                        </label>
                        
                        <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                          {otp.map((digit, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Input
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold bg-white border-2 border-cyan-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 rounded-xl"
                                disabled={isLoading}
                              />
                            </motion.div>
                          ))}
                        </div>

                        {attempts > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200"
                          >
                            <AlertCircle className="h-4 w-4" />
                            <span style={{ lineHeight: "1.8" }}>
                              Invalid OTP. {3 - attempts} attempts remaining
                            </span>
                          </motion.div>
                        )}
                      </motion.div>

                      {timeLeft > 0 && (
                        <motion.div 
                          variants={item}
                          className="flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-cyan-50 to-teal-50 p-4 rounded-xl border-2 border-cyan-200"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Clock className="w-5 h-5 text-teal-600" />
                          </motion.div>
                          <span className="font-semibold text-gray-700" style={{ lineHeight: "1.8" }}>
                            Resend in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                          </span>
                        </motion.div>
                      )}

                      <motion.div variants={item} className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setStep('phone');
                            setOtp(['', '', '', '', '', '']);
                            setAttempts(0);
                          }}
                          className="flex items-center gap-2 border-2 border-gray-300 hover:bg-gray-50 rounded-xl px-6 py-6"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Change
                        </Button>
                        
                        <Button
                          onClick={() => handleVerifyOtp()}
                          disabled={isLoading || otp.some(d => !d)}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl px-6 py-6 font-semibold shadow-lg"
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <RefreshCw className="w-5 h-5" />
                            </motion.div>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Verify
                            </>
                          )}
                        </Button>
                      </motion.div>

                      {canResend && (
                        <motion.div variants={item} className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResendOtp}
                            disabled={isLoading}
                            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 font-semibold rounded-xl"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Didn't receive code? Resend
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                
              >
                <Card className="bg-gradient-to-br from-green-500 to-emerald-500 border-0 shadow-2xl">
                  <div className="p-10 text-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 1,
                      }}
                    >
                      <CheckCircle className="h-20 w-20 text-white mx-auto mb-6" />
                    </motion.div>
                    <h2 className="text-3xl font-extrabold text-white mb-4" style={{ lineHeight: "1.6" }}>
                      Verified Successfully! ✓
                    </h2>
                    <p className="text-white/90 text-lg" style={{ lineHeight: "1.8" }}>
                      Redirecting to registration...
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-cyan-200"
          >
            <p className="text-xs text-gray-600" style={{ lineHeight: "1.8" }}>
              Having trouble? Contact support at{" "}
              <a href="mailto:janmce.helpdesk@gmail.com" className="text-teal-600 hover:text-teal-700 font-semibold">
                janmce.helpdesk@gmail.com
              </a>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
