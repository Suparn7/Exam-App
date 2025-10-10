import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone,
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle,
  Loader2,
  Users,
  CreditCard,
  Home,
  MapPinned,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const personalInfoSchema = z.object({
  postId: z.string().min(1, "Please select a post"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  category: z.enum(["general", "obc", "sc", "st", "ews"], { required_error: "Category is required" }),
  aadhar_number: z.string().regex(/^\d{12}$/, "Aadhar number must be 12 digits"),
  address: z.string().min(1, "Address is required"),
  state: z.string().default("Jharkhand"),
  district: z.string().min(1, "District is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  alternativeMobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits").optional(),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

interface PersonalInfoProps {
  onNext?: () => void;
  onSave?: (data: PersonalInfoForm) => Promise<boolean>;
}

export function PersonalInfo({ onNext, onSave }: PersonalInfoProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [existingData, setExistingData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const form = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      state: "Jharkhand"
    }
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchPosts();
    fetchExistingData();
  }, [user, loading, navigate]);

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, post_name');
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.log('Error fetching posts:', error);
      toast({ title: "Error", description: "Failed to load posts", variant: "destructive" });
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchExistingData = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('personal_info')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setExistingData(data);
        form.reset({
          postId: 'post_id' in data ? String(data.post_id ?? "") : "",
          firstName: data.first_name,
          middleName: data.middle_name || "",
          lastName: data.last_name,
          fatherName: data.father_name,
          motherName: data.mother_name,
          dateOfBirth: data.date_of_birth,
          gender: data.gender,
          category: data.category,
          aadhar_number: data.aadhar_number || "",
          address: data.address,
          state: data.state,
          district: data.district,
          pincode: data.pincode,
          alternativeMobile: data.alternative_mobile || "",
        });
      }
    } catch (error) {
      console.error('Error fetching personal info:', error);
    }
  };

  const handleSubmit = async (data: PersonalInfoForm) => {
    if (!user) return;
    setIsLoading(true);
    try {
      if (!data.dateOfBirth) {
        toast({
          title: "Validation Error",
          description: "Date of Birth is required.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      let saveResult = true;
      if (onSave) {
        saveResult = await onSave(data);
      }
      if (saveResult && onNext) onNext();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save personal information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading || postsLoading) {
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
            Loading form...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Post Selection Section */}
          <motion.div variants={item}>
            <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-t-2xl">
                <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                  <Sparkles className="h-6 w-6" />
                  Select Post/Exam
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Label htmlFor="postId" className="text-base font-semibold text-gray-800" style={{ lineHeight: "1.8" }}>
                    Post/Exam *
                  </Label>
                  <Select
                    value={form.watch("postId")}
                    onValueChange={(value) => form.setValue("postId", value)}
                  >
                    <SelectTrigger className="h-14 bg-white border-2 border-cyan-200 focus:border-teal-400 rounded-xl text-base">
                      <SelectValue placeholder="Select post/exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {posts.map((post) => (
                        <SelectItem key={post.id} value={post.id}>{post.post_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.postId && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm text-red-600 flex items-center gap-2"
                      style={{ lineHeight: "1.8" }}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {form.formState.errors.postId.message}
                    </motion.p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Personal Details Section */}
          <motion.div variants={item}>
            <Card className="bg-white/90 border-2 border-teal-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-t-2xl">
                <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                  <User className="h-6 w-6" />
                  Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700" style={{ lineHeight: "1.8" }}>
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      className="h-12 bg-white border-2 border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 rounded-xl"
                      placeholder="Enter first name"
                      {...form.register("firstName")}
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName" className="text-sm font-semibold text-gray-700" style={{ lineHeight: "1.8" }}>
                      Middle Name
                    </Label>
                    <Input
                      id="middleName"
                      className="h-12 bg-white border-2 border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 rounded-xl"
                      placeholder="Enter middle name"
                      {...form.register("middleName")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700" style={{ lineHeight: "1.8" }}>
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      className="h-12 bg-white border-2 border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 rounded-xl"
                      placeholder="Enter last name"
                      {...form.register("lastName")}
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Parent Details Section */}
          <motion.div variants={item}>
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-2xl">
                <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                  <Users className="h-6 w-6" />
                  Parent Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatherName" className="text-sm font-semibold text-gray-700" style={{ lineHeight: "1.8" }}>
                      Father's Name *
                    </Label>
                    <Input
                      id="fatherName"
                      className="h-12 bg-white border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 rounded-xl"
                      placeholder="Enter father's name"
                      {...form.register("fatherName")}
                    />
                    {form.formState.errors.fatherName && (
                      <p className="text-sm text-red-600">{form.formState.errors.fatherName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName" className="text-sm font-semibold text-gray-700" style={{ lineHeight: "1.8" }}>
                      Mother's Name *
                    </Label>
                    <Input
                      id="motherName"
                      className="h-12 bg-white border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 rounded-xl"
                      placeholder="Enter mother's name"
                      {...form.register("motherName")}
                    />
                    {form.formState.errors.motherName && (
                      <p className="text-sm text-red-600">{form.formState.errors.motherName.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Basic Info Section */}
          <motion.div variants={item}>
            <Card className="bg-white/90 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-2xl">
                <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                  <Calendar className="h-6 w-6" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700" style={{ lineHeight: "1.8" }}>
                      Date of Birth *
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        className="pl-11 h-12 bg-white border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl"
                        {...form.register("dateOfBirth")}
                      />
                    </div>
                    {form.formState.errors.dateOfBirth && (
                      <p className="text-sm text-red-600">{form.formState.errors.dateOfBirth.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700" style={{ lineHeight: "1.8" }}>
                      Gender *
                    </Label>
                    <Select value={form.watch("gender")} onValueChange={(value) => form.setValue("gender", value as any)}>
                      <SelectTrigger className="h-12 bg-white border-2 border-gray-200 focus:border-purple-400 rounded-xl">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.gender && (
                      <p className="text-sm text-red-600">{form.formState.errors.gender.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700" style={{ lineHeight: "1.8" }}>
                      Category *
                    </Label>
                    <Select value={form.watch("category")} onValueChange={(value) => form.setValue("category", value as any)}>
                      <SelectTrigger className="h-12 bg-white border-2 border-gray-200 focus:border-purple-400 rounded-xl">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="obc">OBC</SelectItem>
                        <SelectItem value="sc">SC</SelectItem>
                        <SelectItem value="st">ST</SelectItem>
                        <SelectItem value="ews">EWS</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.category && (
                      <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
                    )}
                  </div>
                </div>

                {/* Aadhar Number */}
                <div className="space-y-2">
                  <Label htmlFor="aadhar_number" className="text-sm font-semibold text-gray-700 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                    <CreditCard className="h-4 w-4" />
                    Aadhar Number *
                  </Label>
                  <Input
                    id="aadhar_number"
                    placeholder="Enter 12-digit Aadhar number"
                    className="h-12 bg-white border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl"
                    maxLength={12}
                    {...form.register("aadhar_number")}
                  />
                  {form.formState.errors.aadhar_number && (
                    <p className="text-sm text-red-600">{form.formState.errors.aadhar_number.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Address Section */}
          <motion.div variants={item}>
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-2xl">
                <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                  <Home className="h-6 w-6" />
                  Address Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                    <MapPin className="h-4 w-4" />
                    Full Address *
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete address"
                    className="min-h-[100px] bg-white border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 rounded-xl"
                    {...form.register("address")}
                  />
                  {form.formState.errors.address && (
                    <p className="text-sm text-red-600">{form.formState.errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-semibold text-gray-700" style={{ lineHeight: "1.8" }}>
                      State *
                    </Label>
                    <Input
                      id="state"
                      value="Jharkhand"
                      readOnly
                      className="h-12 bg-gray-100 border-2 border-gray-200 rounded-xl"
                      {...form.register("state")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-sm font-semibold text-gray-700" style={{ lineHeight: "1.8" }}>
                      District *
                    </Label>
                    <Input
                      id="district"
                      placeholder="Enter district"
                      className="h-12 bg-white border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 rounded-xl"
                      {...form.register("district")}
                    />
                    {form.formState.errors.district && (
                      <p className="text-sm text-red-600">{form.formState.errors.district.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-sm font-semibold text-gray-700 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                      <MapPinned className="h-4 w-4" />
                      Pincode *
                    </Label>
                    <Input
                      id="pincode"
                      placeholder="6-digit pincode"
                      className="h-12 bg-white border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 rounded-xl"
                      maxLength={6}
                      {...form.register("pincode")}
                    />
                    {form.formState.errors.pincode && (
                      <p className="text-sm text-red-600">{form.formState.errors.pincode.message}</p>
                    )}
                  </div>
                </div>

                {/* Alternative Mobile */}
                <div className="space-y-2">
                  <Label htmlFor="alternativeMobile" className="text-sm font-semibold text-gray-700 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                    <Phone className="h-4 w-4" />
                    Alternative Mobile Number
                  </Label>
                  <Input
                    id="alternativeMobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    className="h-12 bg-white border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 rounded-xl"
                    maxLength={10}
                    {...form.register("alternativeMobile")}
                  />
                  {form.formState.errors.alternativeMobile && (
                    <p className="text-sm text-red-600">{form.formState.errors.alternativeMobile.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 pt-6"
        >
          <Button 
            type="button"
            onClick={() => navigate('/dashboard')} 
            variant="outline"
            size="lg"
            className="flex items-center gap-2 border-2 border-gray-300 hover:bg-gray-50 rounded-xl px-8 py-6 font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            size="lg"
            className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl px-8 py-6 font-semibold shadow-lg"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Loader2 className="h-5 w-5" />
                </motion.div>
                Saving...
              </>
            ) : (
              <>
                {existingData ? "Update Information" : "Save & Continue"}
                <Save className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
