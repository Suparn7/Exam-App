import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Shield, 
  Users, 
  Globe,
  Heart,
  Save,
  Loader2,
  Church
} from "lucide-react";

interface OtherDetailsProps {
  onNext?: () => void;
}

export function OtherDetails({ onNext }: OtherDetailsProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [otherDetails, setOtherDetails] = useState<any>({
    category: "",
    nationality: "",
    religion: "",
    disability_status: ""
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchOtherDetails();
  }, [user, loading, navigate]);

  const fetchOtherDetails = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("other_details")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      console.log("OtherDetails fetch result:", { data, error });
      if (error) throw error;
      if (data) {
        setOtherDetails({
          // category: data.category || "", // Removed because 'category' does not exist
          nationality: data.nationality || "",
          religion: data.religion || "",
          disability_status: data.disability_status || ""
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch other details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    // Validation
    if (!otherDetails.category) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    if (!otherDetails.nationality) {
      toast({
        title: "Validation Error",
        description: "Please enter nationality",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("other_details")
        .upsert({
          user_id: user.id,
          category: otherDetails.category,
          nationality: otherDetails.nationality,
          religion: otherDetails.religion,
          disability_status: otherDetails.disability_status,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Other details saved successfully!",
      });
      
      // Call onNext to move to next step
      if (onNext) {
        onNext();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save other details",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-700 text-lg font-semibold" style={{ lineHeight: "1.8" }}>
            Loading details...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Category Section */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                <Users className="h-6 w-6" />
                Category Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Label className="text-base font-semibold text-gray-800" style={{ lineHeight: "1.8" }}>
                Category *
              </Label>
              <Select
                value={otherDetails.category}
                onValueChange={(value) => setOtherDetails({ ...otherDetails, category: value })}
              >
                <SelectTrigger className="h-14 bg-white border-2 border-cyan-200 focus:border-teal-400 rounded-xl text-base">
                  <SelectValue placeholder="Select your category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General / UR (Unreserved)</SelectItem>
                  <SelectItem value="OBC">OBC (Other Backward Class)</SelectItem>
                  <SelectItem value="EBC">EBC (Extremely Backward Class)</SelectItem>
                  <SelectItem value="SC">SC (Scheduled Caste)</SelectItem>
                  <SelectItem value="ST">ST (Scheduled Tribe)</SelectItem>
                  <SelectItem value="EWS">EWS (Economically Weaker Section)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600" style={{ lineHeight: "1.8" }}>
                Select the category under which you are applying
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Nationality Section */}
        <motion.div variants={item}>
          <Card className="bg-white/90 border-2 border-teal-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                <Globe className="h-6 w-6" />
                Nationality Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Label className="text-base font-semibold text-gray-800" style={{ lineHeight: "1.8" }}>
                Nationality *
              </Label>
              <Input
                placeholder="Enter nationality (e.g., Indian)"
                className="h-14 bg-white border-2 border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 rounded-xl text-base"
                value={otherDetails.nationality}
                onChange={(e) => setOtherDetails({ ...otherDetails, nationality: e.target.value })}
              />
              <p className="text-xs text-gray-600" style={{ lineHeight: "1.8" }}>
                Enter your nationality as per official documents
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Religion Section */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                <Church className="h-6 w-6" />
                Religion (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Label className="text-base font-semibold text-gray-800" style={{ lineHeight: "1.8" }}>
                Religion
              </Label>
              <Select
                value={otherDetails.religion}
                onValueChange={(value) => setOtherDetails({ ...otherDetails, religion: value })}
              >
                <SelectTrigger className="h-14 bg-white border-2 border-gray-200 focus:border-blue-400 rounded-xl text-base">
                  <SelectValue placeholder="Select religion (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hindu">Hindu</SelectItem>
                  <SelectItem value="Muslim">Muslim</SelectItem>
                  <SelectItem value="Christian">Christian</SelectItem>
                  <SelectItem value="Sikh">Sikh</SelectItem>
                  <SelectItem value="Buddhist">Buddhist</SelectItem>
                  <SelectItem value="Jain">Jain</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600" style={{ lineHeight: "1.8" }}>
                This field is optional
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disability Status Section */}
        <motion.div variants={item}>
          <Card className="bg-white/90 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                <Heart className="h-6 w-6" />
                Disability Status (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Label className="text-base font-semibold text-gray-800" style={{ lineHeight: "1.8" }}>
                Do you have any disability?
              </Label>
              <Select
                value={otherDetails.disability_status}
                onValueChange={(value) => setOtherDetails({ ...otherDetails, disability_status: value })}
              >
                <SelectTrigger className="h-14 bg-white border-2 border-gray-200 focus:border-purple-400 rounded-xl text-base">
                  <SelectValue placeholder="Select disability status (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">No Disability</SelectItem>
                  <SelectItem value="Physically Handicapped">Physically Handicapped (PH)</SelectItem>
                  <SelectItem value="Visually Impaired">Visually Impaired (VI)</SelectItem>
                  <SelectItem value="Hearing Impaired">Hearing Impaired (HI)</SelectItem>
                  <SelectItem value="Other">Other Disability</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600" style={{ lineHeight: "1.8" }}>
                If you have a disability certificate, you may be eligible for special provisions
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl px-8 py-6 font-semibold shadow-lg"
        >
          {isSaving ? (
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
              <Save className="mr-2 h-5 w-5" />
              Save Progress
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
