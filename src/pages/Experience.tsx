import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Plus, 
  Trash2,
  Save,
  Calendar,
  Building2,
  IndianRupee,
  FileText,
  Edit,
  Loader2,
  UserCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const experienceSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  designation: z.string().min(1, "Designation is required"),
  fromDate: z.string().min(1, "From date is required"),
  toDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  salary: z.number().optional(),
  jobDescription: z.string().optional(),
});

type ExperienceForm = z.infer<typeof experienceSchema>;

interface Experience extends ExperienceForm {
  id?: string;
}

interface ExperienceProps {
  onNext?: () => void;
}

export function Experience({ onNext }: ExperienceProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<ExperienceForm>({
    resolver: zodResolver(experienceSchema),
  });

  const isCurrentJob = form.watch("isCurrent");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      return;
    }
    fetchExperienceData();
  }, [user, loading]);

  const fetchExperienceData = async () => {
    if (!user) {
      console.log('No user found');
      return;
    }
    
    console.log('Fetching experience data for user:', user.id);
    
    try {
      const { data, error } = await supabase
        .from('experience_info')
        .select('*')
        .eq('user_id', user.id)
        .order('from_date', { ascending: false });
      
      console.log('Experience fetch result:', { data, error });
      
      if (error) {
        console.error('Supabase fetch error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch experience data',
          variant: 'destructive',
        });
        return;
      }
      
      if (data) {
        const formattedData = data.map(item => ({
          id: item.id,
          companyName: item.company_name,
          designation: item.designation,
          fromDate: item.from_date,
          toDate: item.to_date || undefined,
          isCurrent: item.is_current,
          salary: item.salary || undefined,
          jobDescription: item.job_description || undefined,
        }));
        setExperiences(formattedData);
        console.log('Fetched experiences:', formattedData);
      } else {
        console.log('No experience data found');
      }
    } catch (error: any) {
      console.error('Error fetching experience data:', error);
    }
  };

  const handleAddExperience = async (data: ExperienceForm) => {
    if (!user) {
      console.log('No user found');
      return;
    }
    
    console.log('Starting to save experience for user:', user.id);
    console.log('Form data:', data);
    
    setIsLoading(true);
    
    try {
      const experienceData = {
        user_id: user.id,
        company_name: data.companyName,
        designation: data.designation,
        from_date: data.fromDate,
        to_date: data.isCurrent ? null : data.toDate,
        is_current: data.isCurrent,
        salary: data.salary || null,
        job_description: data.jobDescription || null,
      };

      console.log('Experience data to save:', experienceData);

      if (editingIndex !== null) {
        // Update existing experience
        const experienceToUpdate = experiences[editingIndex];
        console.log('Updating experience with ID:', experienceToUpdate.id);
        
        const { data: updateData, error } = await supabase
          .from('experience_info')
          .update(experienceData)
          .eq('id', experienceToUpdate.id)
          .select();
        
        console.log('Update result:', { updateData, error });
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        console.log('Updated experience successfully:', updateData);
        setEditingIndex(null);
      } else {
        // Add new experience
        console.log('Inserting new experience...');
        
        const { data: insertData, error } = await supabase
          .from('experience_info')
          .insert(experienceData)
          .select();
        
        console.log('Insert result:', { insertData, error });
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        console.log('Inserted experience successfully:', insertData);
      }

      form.reset();
      console.log('Fetching updated experience data...');
      await fetchExperienceData();
      
      toast({
        title: "Success",
        description: editingIndex !== null ? "Experience updated successfully" : "Experience added successfully",
      });
      
    } catch (error: any) {
      console.error('Error saving experience:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save experience",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditExperience = (index: number) => {
    const experience = experiences[index];
    form.reset(experience);
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteExperience = async (index: number) => {
    const experience = experiences[index];
    
    console.log('Deleting experience with ID:', experience.id);
    
    try {
      const { error } = await supabase
        .from('experience_info')
        .delete()
        .eq('id', experience.id);
      
      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      console.log('Deleted experience successfully');
      await fetchExperienceData();
      toast({
        title: "Success",
        description: "Experience deleted successfully",
      });
      
    } catch (error: any) {
      console.error('Error deleting experience:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete experience",
        variant: "destructive"
      });
    }
  };

  const handleSkip = () => {
    console.log('Skipping experience step');
    if (onNext) {
      onNext();
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

  if (loading) {
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
            Loading...
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
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Add/Edit Experience Form */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all rounded-2xl h-full">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                {editingIndex !== null ? (
                  <>
                    <Edit className="h-6 w-6" />
                    Edit Experience
                  </>
                ) : (
                  <>
                    <Plus className="h-6 w-6" />
                    Add Experience
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={form.handleSubmit(handleAddExperience)} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="companyName" className="text-base font-semibold text-gray-800 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                    <Building2 className="h-4 w-4" />
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    className="h-12 bg-white border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl"
                    {...form.register("companyName")}
                  />
                  {form.formState.errors.companyName && (
                    <p className="text-sm text-red-600">{form.formState.errors.companyName.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="designation" className="text-base font-semibold text-gray-800 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                    <UserCircle className="h-4 w-4" />
                    Designation *
                  </Label>
                  <Input
                    id="designation"
                    placeholder="Enter your designation"
                    className="h-12 bg-white border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl"
                    {...form.register("designation")}
                  />
                  {form.formState.errors.designation && (
                    <p className="text-sm text-red-600">{form.formState.errors.designation.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="fromDate" className="text-sm font-semibold text-gray-800 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                      <Calendar className="h-4 w-4" />
                      From Date *
                    </Label>
                    <Input
                      id="fromDate"
                      type="date"
                      className="h-12 bg-white border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl"
                      {...form.register("fromDate")}
                    />
                    {form.formState.errors.fromDate && (
                      <p className="text-sm text-red-600">{form.formState.errors.fromDate.message}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="toDate" className="text-sm font-semibold text-gray-800 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                      <Calendar className="h-4 w-4" />
                      To Date
                    </Label>
                    <Input
                      id="toDate"
                      type="date"
                      disabled={isCurrentJob}
                      className="h-12 bg-white border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl disabled:bg-gray-100"
                      {...form.register("toDate")}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <Checkbox
                    id="isCurrent"
                    checked={form.watch("isCurrent")}
                    onCheckedChange={(checked) => form.setValue("isCurrent", checked as boolean)}
                    className="border-purple-400"
                  />
                  <Label htmlFor="isCurrent" className="text-sm font-semibold text-gray-800" style={{ lineHeight: "1.8" }}>
                    Currently working here
                  </Label>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="salary" className="text-sm font-semibold text-gray-800 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                    <IndianRupee className="h-4 w-4" />
                    Salary (per month)
                  </Label>
                  <Input
                    id="salary"
                    type="number"
                    min="0"
                    placeholder="Enter monthly salary"
                    className="h-12 bg-white border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl"
                    {...form.register("salary", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="jobDescription" className="text-sm font-semibold text-gray-800 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                    <FileText className="h-4 w-4" />
                    Job Description
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Describe your roles and responsibilities"
                    className="min-h-[100px] bg-white border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl"
                    {...form.register("jobDescription")}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  {editingIndex !== null && (
                    <Button 
                      type="button"
                      onClick={() => {
                        setEditingIndex(null);
                        form.reset();
                      }}
                      variant="outline"
                      size="lg"
                      className="border-2 border-gray-300 hover:bg-gray-50 rounded-xl px-6 py-6 font-semibold"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl px-6 py-6 font-semibold shadow-lg"
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
                        {editingIndex !== null ? "Update" : "Add Experience"}
                        <Save className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Experience List */}
        <motion.div variants={item}>
          <Card className="bg-white/90 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all rounded-2xl h-full">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                <Briefcase className="h-6 w-6" />
                Your Experience ({experiences.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence mode="popLayout">
                {experiences.length > 0 ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {experiences.map((experience, index) => (
                      <motion.div
                        key={experience.id || index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg mb-1" style={{ lineHeight: "1.6" }}>
                              {experience.designation}
                            </h4>
                            {experience.isCurrent && (
                              <Badge className="bg-green-500 text-white mb-2">
                                Currently Working
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditExperience(index)}
                              className="border-blue-300 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteExperience(index)}
                              className="border-red-300 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {experience.companyName}
                        </p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(experience.fromDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {experience.isCurrent ? "Present" : experience.toDate ? new Date(experience.toDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                          </p>
                          {experience.salary && (
                            <p className="flex items-center gap-2">
                              <IndianRupee className="h-3 w-3" />
                              ₹{experience.salary.toLocaleString()}/month
                            </p>
                          )}
                          {experience.jobDescription && (
                            <p className="mt-2 text-gray-600 bg-white p-2 rounded-lg">
                              {experience.jobDescription}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
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
                      <Briefcase className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-gray-600 text-lg font-semibold mb-2" style={{ lineHeight: "1.8" }}>
                      No experience added yet
                    </p>
                    <p className="text-gray-500 text-sm" style={{ lineHeight: "1.8" }}>
                      Fresher? No worries! You can skip this step.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Skip Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={handleSkip}
          variant="outline"
          size="lg"
          className="w-full border-2 border-gray-300 hover:bg-gray-50 rounded-xl px-8 py-6 font-semibold"
        >
          Skip This Step (For Freshers)
        </Button>
      </motion.div>
    </div>
  );
}
