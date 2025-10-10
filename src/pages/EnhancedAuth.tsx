import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Shield, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  Loader2, 
  Crown 
} from "lucide-react";

export function EnhancedAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user, loading } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    firstName: "",
    lastName: "",
  });

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Email and password are required",
        variant: "destructive",
      });
      return false;
    }
    if (activeTab === "signup") {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return false;
      }
      if (formData.password.length < 6) {
        toast({
          title: "Weak Password",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome Back!",
          description: "Successfully logged in to your account",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.mobile
      );

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account Exists",
            description:
              "An account with this email already exists. Please login instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration Failed",
            description: error.message || "Failed to create account",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account",
        });
        setActiveTab("login");
      }
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await signIn("admin@example.com", "admin123");

      if (error) {
        toast({
          title: "Admin Login Failed",
          description: "Invalid admin credentials",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the admin dashboard",
        });
        navigate("/admin");
      }
    } catch (error: any) {
      toast({
        title: "Admin Login Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-teal-600 to-blue-700">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 rounded-2xl"
        >
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-white" />
          <p className="mt-4 text-white text-center font-semibold text-lg tracking-wide">
            Loading...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-teal-600 to-blue-700 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-teal-400/30 rounded-full blur-3xl"
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
        className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl"
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

      <div className="flex-1 flex flex-col justify-center py-16 relative z-10">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.2, 
                duration: 1,
                type: "spring",
                stiffness: 200 
              }}
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 shadow-2xl"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(6, 182, 212, 0.5)",
                    "0 0 40px rgba(6, 182, 212, 0.8)",
                    "0 0 20px rgba(6, 182, 212, 0.5)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Shield className="w-10 h-10 text-white drop-shadow-lg" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Badge className="mb-4 bg-white/20 text-white font-semibold shadow-lg border border-white/30 backdrop-blur-md px-4 py-1.5">
                Exam Portal Authentication
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-3 font-heading tracking-tight"
            >
              Secure Access Portal
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/90 text-base max-w-lg mx-auto tracking-wide"
            >
              Sign up or log in to continue. Your credentials are protected and
              your data is secure.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
          <Card className="glass-card shadow-2xl border border-white/30 backdrop-blur-xl bg-white/10 p-8" >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-white/10 rounded-2xl backdrop-blur-sm h-14">
                  <TabsTrigger
                    value="login"
                    className="flex items-center justify-center gap-2 font-semibold text-base rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-lg text-white/80 hover:text-white h-full"
                  >

                    <User className="w-5 h-5" />
                    Login
                  </TabsTrigger>

                  <TabsTrigger
                    value="signup"
                    className="flex items-center justify-center gap-2 font-semibold text-base rounded-xl py-3 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-lg text-white/80 hover:text-white"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  {activeTab === "login" && (
                    <TabsContent value="login" key="login" className="space-y-5 mt-0">
                      <motion.form
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleLogin}
                        className="space-y-5"
                      >
                        <div className="space-y-2">
                          <Label
                            htmlFor="login-email"
                            className="flex items-center gap-2 text-white font-semibold text-sm"
                          >
                            <Mail className="w-4 h-4" />
                            Email Address
                          </Label>
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="bg-white/10 border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 text-white placeholder:text-white/60 backdrop-blur-sm rounded-xl h-12 transition-all duration-300"
                            required
                            autoComplete="email"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="login-password"
                            className="flex items-center gap-2 text-white font-semibold text-sm"
                          >
                            <Lock className="w-4 h-4" />
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="login-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              value={formData.password}
                              onChange={(e) =>
                                handleInputChange("password", e.target.value)
                              }
                              className="bg-white/10 border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 text-white placeholder:text-white/60 backdrop-blur-sm rounded-xl h-12 pr-12 transition-all duration-300"
                              required
                              autoComplete="current-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 h-10 w-10 p-0 rounded-lg transition-all"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-600 hover:via-teal-600 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/50 transition-all text-white font-semibold tracking-wide py-6 rounded-xl text-base mt-6"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                              Signing in...
                            </span>
                          ) : (
                            "Sign In to Portal"
                          )}
                        </Button>
                      </motion.form>
                    </TabsContent>
                  )}

                  {activeTab === "signup" && (
                    <TabsContent value="signup" key="signup" className="space-y-5 mt-0">
                      <motion.form
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleSignup}
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="first-name"
                              className="text-white font-semibold text-sm"
                            >
                              First Name
                            </Label>
                            <Input
                              id="first-name"
                              placeholder="First name"
                              value={formData.firstName}
                              onChange={(e) =>
                                handleInputChange("firstName", e.target.value)
                              }
                              className="bg-white/10 border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 text-white placeholder:text-white/60 backdrop-blur-sm rounded-xl h-12 transition-all duration-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="last-name"
                              className="text-white font-semibold text-sm"
                            >
                              Last Name
                            </Label>
                            <Input
                              id="last-name"
                              placeholder="Last name"
                              value={formData.lastName}
                              onChange={(e) =>
                                handleInputChange("lastName", e.target.value)
                              }
                              className="bg-white/10 border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 text-white placeholder:text-white/60 backdrop-blur-sm rounded-xl h-12 transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-email"
                            className="flex items-center gap-2 text-white font-semibold text-sm"
                          >
                            <Mail className="w-4 h-4" />
                            Email Address
                          </Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="bg-white/10 border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 text-white placeholder:text-white/60 backdrop-blur-sm rounded-xl h-12 transition-all duration-300"
                            required
                            autoComplete="email"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="mobile"
                            className="flex items-center gap-2 text-white font-semibold text-sm"
                          >
                            <Phone className="w-4 h-4" />
                            Mobile Number
                          </Label>
                          <Input
                            id="mobile"
                            type="tel"
                            placeholder="Enter mobile number"
                            value={formData.mobile}
                            onChange={(e) =>
                              handleInputChange("mobile", e.target.value)
                            }
                            className="bg-white/10 border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 text-white placeholder:text-white/60 backdrop-blur-sm rounded-xl h-12 transition-all duration-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-password"
                            className="flex items-center gap-2 text-white font-semibold text-sm"
                          >
                            <Lock className="w-4 h-4" />
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="signup-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              value={formData.password}
                              onChange={(e) =>
                                handleInputChange("password", e.target.value)
                              }
                              className="bg-white/10 border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 text-white placeholder:text-white/60 backdrop-blur-sm rounded-xl h-12 pr-12 transition-all duration-300"
                              required
                              autoComplete="new-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 h-10 w-10 p-0 rounded-lg transition-all"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="confirm-password"
                            className="text-white font-semibold text-sm"
                          >
                            Confirm Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={formData.confirmPassword}
                              onChange={(e) =>
                                handleInputChange(
                                  "confirmPassword",
                                  e.target.value
                                )
                              }
                              className="bg-white/10 border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 text-white placeholder:text-white/60 backdrop-blur-sm rounded-xl h-12 pr-12 transition-all duration-300"
                              required
                              autoComplete="new-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 h-10 w-10 p-0 rounded-lg transition-all"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              aria-label={
                                showConfirmPassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-teal-500/50 transition-all text-white font-semibold tracking-wide py-6 rounded-xl text-base mt-6"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                              Creating account...
                            </span>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </motion.form>
                    </TabsContent>
                  )}
                </AnimatePresence>
              </Tabs>

              <div className="mt-8">
                <Separator className="my-6 bg-white/20" />
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 justify-center border-2 border-white/40 bg-white/5 text-white hover:bg-white hover:text-teal-700 hover:border-white transition-all rounded-xl py-6 font-semibold backdrop-blur-sm"
                  onClick={handleAdminLogin}
                  disabled={isLoading}
                >
                  <Crown className="w-5 h-5" />
                  Admin Access
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-cyan-500 text-white border-0"
                  >
                    Demo
                  </Badge>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
