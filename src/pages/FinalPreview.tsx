import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  User, 
  GraduationCap, 
  Briefcase, 
  CreditCard, 
  FileImage,
  Download,
  FileText,
  MapPin,
  Phone,
  Calendar,
  Award,
  Building2,
  IndianRupee,
  Shield,
  Sparkles,
  Trophy,
  Star,
  PartyPopper
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const FinalPreview: React.FC = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [otherDetails, setOtherDetails] = useState<any>(null);
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [payment, setPayment] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [post, setPost] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [finalAppNumber, setFinalAppNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      setLoadingData(true);
      try {
        console.log('Fetching all data for final preview...');

        // Personal Info
        const { data: pi } = await supabase
          .from("personal_info")
          .select("*, post_id")
          .eq("user_id", user.id)
          .single();
        setPersonalInfo(pi);
        console.log('Personal Info:', pi);

        // Other Details
        const { data: od } = await supabase
          .from("other_details")
          .select("*")
          .eq("user_id", user.id)
          .single();
        setOtherDetails(od);
        console.log('Other Details:', od);

        // Application
        const { data: app } = await supabase
          .from("applications")
          .select("*, post_id, application_number, status")
          .eq("user_id", user.id)
          .single();
        setApplication(app);
        console.log('Application:', app);

        // Post
        if (app?.post_id) {
          const { data: postData } = await supabase
            .from("posts")
            .select("post_name, post_code")
            .eq("id", app.post_id)
            .single();
          setPost(postData);
          console.log('Post:', postData);
        }

        // Education
        const { data: edu } = await supabase
          .from("educational_qualifications")
          .select("*")
          .eq("user_id", user.id)
          .order('passing_year', { ascending: false });
        setEducation(edu || []);
        console.log('Education:', edu);

        // Experience
        const { data: exp } = await supabase
          .from("experience_info")
          .select("*")
          .eq("user_id", user.id)
          .order('from_date', { ascending: false });
        setExperience(exp || []);
        console.log('Experience:', exp);

        // Payment
        if (app?.id) {
          const { data: pay } = await supabase
            .from("payments")
            .select("*")
            .eq("application_id", app.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          setPayment(pay);
          console.log('Payment:', pay);
        }

        // Documents
        const { data: docs } = await supabase
          .from("documents")
          .select("id, file_name, file_url, created_at, document_type")
          .eq("user_id", user.id);
        setDocuments(docs || []);
        console.log('Documents:', docs);
      } catch (error: any) {
        console.error('Error fetching preview data:', error);
        toast({ title: "Error", description: "Failed to load review data", variant: "destructive" });
      } finally {
        setLoadingData(false);
      }
    };
    fetchAll();
  }, [user]);

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

  if (loading || loadingData) {
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
            Loading your application...
          </p>
        </motion.div>
      </div>
    );
  }

  if (submitted && finalAppNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-teal-50 flex flex-col items-center justify-center relative overflow-hidden p-4">
        {/* Celebration Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-8"
        >
          <PartyPopper className="h-20 w-20 text-green-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border-2 border-green-200 shadow-2xl rounded-3xl p-8 text-center max-w-2xl">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent" style={{ lineHeight: "1.6" }}>
              Application Submitted Successfully! 🎉
            </h1>
            
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-2xl mb-6 border-2 border-green-200">
              <p className="text-lg font-semibold text-gray-700 mb-2" style={{ lineHeight: "1.8" }}>
                Your Application Number:
              </p>
              <p className="text-3xl font-bold text-green-600 mb-2" style={{ lineHeight: "1.6" }}>
                {finalAppNumber}
              </p>
              <p className="text-sm text-gray-600" style={{ lineHeight: "1.8" }}>
                Please save this number for future reference
              </p>
            </div>

            <div className="text-gray-700 mb-6 space-y-2" style={{ lineHeight: "1.8" }}>
              <p className="text-base">
                Your application has been successfully submitted and is now under review.
              </p>
              <p className="text-sm text-gray-600">
                You can track your application status and download your application summary from the dashboard.
              </p>
            </div>

            <Button 
              onClick={() => navigate("/dashboard")} 
              size="lg"
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl px-8 py-6 font-semibold shadow-lg"
            >
              <Trophy className="mr-2 h-5 w-5" />
              Go to Dashboard
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  const completionPercentage = Math.round(
    ((personalInfo ? 1 : 0) +
    (education.length > 0 ? 1 : 0) +
    (payment ? 1 : 0) +
    (documents.length > 0 ? 1 : 0)) / 4 * 100
  );

  return (
    <div className="space-y-8">
      {/* Congratulations Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center bg-gradient-to-r from-green-50 to-teal-50 p-8 rounded-3xl border-2 border-green-200"
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
          className="inline-block mb-4"
        >
          <Trophy className="h-16 w-16 text-yellow-500" />
        </motion.div>
        
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent" style={{ lineHeight: "1.6" }}>
          Congratulations! Almost There! 🎉
        </h1>
        
        <p className="text-lg text-gray-700 mb-4" style={{ lineHeight: "1.8" }}>
          Please review your application details carefully before final submission
        </p>

        {post && (
          <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-lg px-6 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            {post.post_name} ({post.post_code})
          </Badge>
        )}

        {/* Progress Bar */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Application Completion</span>
            <span className="text-sm font-bold text-green-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-500 to-teal-500"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Personal Information */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                <User className="h-6 w-6" />
                Personal Information
                <CheckCircle className="h-5 w-5 ml-auto" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-cyan-200">
                  <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Full Name</p>
                  <p className="font-semibold text-gray-800" style={{ lineHeight: "1.6" }}>
                    {personalInfo?.first_name} {personalInfo?.middle_name} {personalInfo?.last_name}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-cyan-200">
                  <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Father's Name</p>
                  <p className="font-semibold text-gray-800" style={{ lineHeight: "1.6" }}>{personalInfo?.father_name}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-cyan-200">
                  <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Mother's Name</p>
                  <p className="font-semibold text-gray-800" style={{ lineHeight: "1.6" }}>{personalInfo?.mother_name}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-cyan-200 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-600" />
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Date of Birth</p>
                    <p className="font-semibold text-gray-800" style={{ lineHeight: "1.6" }}>
                      {personalInfo?.date_of_birth ? new Date(personalInfo.date_of_birth).toLocaleDateString('en-IN') : '--'}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-cyan-200">
                  <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Gender</p>
                  <p className="font-semibold text-gray-800 capitalize" style={{ lineHeight: "1.6" }}>{personalInfo?.gender}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-cyan-200">
                  <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Category</p>
                  <Badge className="bg-cyan-500 text-white">{personalInfo?.category}</Badge>
                </div>
                <div className="bg-white p-4 rounded-xl border border-cyan-200 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-600" />
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Aadhar Number</p>
                    <p className="font-semibold text-gray-800" style={{ lineHeight: "1.6" }}>{personalInfo?.aadhar_number}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-cyan-200 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-cyan-600" />
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Mobile Number</p>
                    <p className="font-semibold text-gray-800" style={{ lineHeight: "1.6" }}>{personalInfo?.alternative_mobile || user?.phone || '--'}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-cyan-200 md:col-span-2 flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-cyan-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Address</p>
                    <p className="font-semibold text-gray-800" style={{ lineHeight: "1.6" }}>
                      {personalInfo?.address}, {personalInfo?.district}, {personalInfo?.state} - {personalInfo?.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Other Details */}
        {otherDetails && (
          <motion.div variants={item}>
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-2xl">
                <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                  <FileText className="h-6 w-6" />
                  Other Details
                  <CheckCircle className="h-5 w-5 ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {otherDetails.nationality && (
                    <div className="bg-white p-4 rounded-xl border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Nationality</p>
                      <p className="font-semibold text-gray-800" style={{ lineHeight: "1.6" }}>{otherDetails.nationality}</p>
                    </div>
                  )}
                  {otherDetails.religion && (
                    <div className="bg-white p-4 rounded-xl border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Religion</p>
                      <p className="font-semibold text-gray-800" style={{ lineHeight: "1.6" }}>{otherDetails.religion}</p>
                    </div>
                  )}
                  {otherDetails.disability_status && (
                    <div className="bg-white p-4 rounded-xl border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Disability Status</p>
                      <p className="font-semibold text-gray-800" style={{ lineHeight: "1.6" }}>{otherDetails.disability_status}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Education */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                <GraduationCap className="h-6 w-6" />
                Educational Qualifications ({education.length})
                {education.length > 0 && <CheckCircle className="h-5 w-5 ml-auto" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {education.length === 0 ? (
                <p className="text-gray-600 text-center py-4" style={{ lineHeight: "1.8" }}>No qualifications added.</p>
              ) : (
                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border-2 border-teal-200">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                          {edu.qualification_type}
                        </Badge>
                        {edu.percentage && (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Star className="h-4 w-4 fill-yellow-500" />
                            <span className="font-bold">{edu.percentage}%</span>
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-gray-800 text-lg mb-1" style={{ lineHeight: "1.6" }}>{edu.board_university}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p style={{ lineHeight: "1.8" }}>
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Year: {edu.passing_year}
                        </p>
                        {edu.subjects && <p style={{ lineHeight: "1.8" }}>Stream: {edu.subjects}</p>}
                        {edu.roll_number && <p style={{ lineHeight: "1.8" }}>Roll No: {edu.roll_number}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Experience */}
        {experience.length > 0 && (
          <motion.div variants={item}>
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-2xl">
                <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                  <Briefcase className="h-6 w-6" />
                  Work Experience ({experience.length})
                  <CheckCircle className="h-5 w-5 ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border-2 border-purple-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-800 text-lg" style={{ lineHeight: "1.6" }}>{exp.designation}</p>
                          <p className="text-gray-600 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                            <Building2 className="h-4 w-4" />
                            {exp.company_name}
                          </p>
                        </div>
                        {exp.is_current && (
                          <Badge className="bg-green-500 text-white">Currently Working</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p style={{ lineHeight: "1.8" }}>
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(exp.from_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })} - 
                          {exp.is_current ? ' Present' : exp.to_date ? ` ${new Date(exp.to_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` : ' --'}
                        </p>
                        {exp.salary && (
                          <p style={{ lineHeight: "1.8" }}>
                            <IndianRupee className="h-3 w-3 inline mr-1" />
                            ₹{exp.salary.toLocaleString()}/month
                          </p>
                        )}
                      </div>
                      {exp.job_description && (
                        <p className="text-sm text-gray-600 mt-2 bg-purple-50 p-2 rounded" style={{ lineHeight: "1.8" }}>
                          {exp.job_description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Payment */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                <CreditCard className="h-6 w-6" />
                Payment Details
                {payment && <CheckCircle className="h-5 w-5 ml-auto" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {payment ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-green-200 flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <IndianRupee className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Amount Paid</p>
                      <p className="text-2xl font-bold text-green-600" style={{ lineHeight: "1.6" }}>₹{payment.amount}</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-green-200">
                    <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Status</p>
                    <Badge className="bg-green-500 text-white text-base">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {payment.payment_status}
                    </Badge>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-green-200">
                    <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Payment Method</p>
                    <p className="font-semibold text-gray-800 capitalize" style={{ lineHeight: "1.6" }}>{payment.payment_method}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-green-200">
                    <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Transaction ID</p>
                    <p className="font-mono text-xs text-gray-800" style={{ lineHeight: "1.6" }}>{payment.transaction_id || '--'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-green-200 md:col-span-2">
                    <p className="text-xs text-gray-600 mb-1" style={{ lineHeight: "1.8" }}>Payment Date</p>
                    <p className="font-semibold text-gray-800" style={{ lineHeight: "1.6" }}>
                      {payment.payment_date ? new Date(payment.payment_date).toLocaleString('en-IN') : '--'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4" style={{ lineHeight: "1.8" }}>No payment record found.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Documents */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                <FileImage className="h-6 w-6" />
                Uploaded Documents ({documents.length})
                {documents.length > 0 && <CheckCircle className="h-5 w-5 ml-auto" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {documents.length === 0 ? (
                <p className="text-gray-600 text-center py-4" style={{ lineHeight: "1.8" }}>No documents uploaded.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {documents.map((doc, idx) => (
                    <div key={doc.id || idx} className="bg-white p-3 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all">
                      {doc.file_url ? (
                        <div className="relative group">
                          <img
                            src={doc.file_url}
                            alt={doc.document_type || `Document ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg mb-2 border"
                            onError={e => { e.currentTarget.style.display = 'none'; }}
                          />
                          <a 
                            href={doc.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                          >
                            <Download className="h-8 w-8 text-white" />
                          </a>
                        </div>
                      ) : (
                        <div className="w-full h-32 flex items-center justify-center bg-gray-100 text-gray-400 border rounded-lg mb-2">
                          No Preview
                        </div>
                      )}
                      <p className="text-xs font-semibold text-gray-800 text-center capitalize" style={{ lineHeight: "1.6" }}>
                        {doc.document_type || 'Document'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
