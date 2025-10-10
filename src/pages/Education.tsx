import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Plus, 
  Trash2,
  Save,
  Edit,
  Calendar,
  BookOpen,
  Award,
  Loader2,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const educationSchema = z.object({
  qualificationType: z.string().min(1, "Qualification type is required"),
  boardUniversity: z.string().min(1, "Board/University is required"),
  passingYear: z.number().min(1950, "Invalid year").max(new Date().getFullYear(), "Invalid year"),
  percentage: z.number().min(0).max(100).optional(),
  grade: z.string().optional(),
  subjects: z.string().optional(),
  rollNumber: z.string().optional(),
});

type EducationForm = z.infer<typeof educationSchema>;

interface Education extends EducationForm {
  id?: string;
}

interface EducationProps {
  onNext?: () => void;
}

export function Education({ onNext }: EducationProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [educations, setEducations] = useState<Education[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<EducationForm>({
    resolver: zodResolver(educationSchema),
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    
    fetchEducationData();
  }, [user, loading, navigate]);

  const fetchEducationData = async () => {
  if (!user) {
    console.log('No user found');
    return;
  }
  
  console.log('Fetching education data for user:', user.id);
  
  try {
    const { data, error } = await supabase
      .from('educational_qualifications')
      .select('*')
      .eq('user_id', user.id)
      .order('passing_year', { ascending: false });
    
    console.log('Education fetch result:', { data, error });
    
    if (error) {
      console.error('Supabase fetch error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch education data',
        variant: 'destructive',
      });
      return;
    }
    
    if (data) {
      const formattedData = data.map(item => ({
        id: item.id,
        qualificationType: item.qualification_type,
        boardUniversity: item.board_university,
        passingYear: item.passing_year,
        percentage: item.percentage || undefined,
        grade: item.grade || undefined,
        subjects: item.subjects || undefined,
        rollNumber: item.roll_number || undefined,
      }));
      setEducations(formattedData);
      console.log('Fetched educations:', formattedData);
    } else {
      console.log('No education data found');
    }
  } catch (error: any) {
    console.error('Error fetching education data:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to fetch education data',
      variant: 'destructive',
    });
  }
};


  const handleAddEducation = async (data: EducationForm) => {
  if (!user) {
    console.log('No user found');
    return;
  }
  
  console.log('Starting to save education for user:', user.id);
  console.log('Form data:', data);
  
  setIsLoading(true);
  
  try {
    const educationData = {
      user_id: user.id,
      qualification_type: data.qualificationType,
      board_university: data.boardUniversity,
      passing_year: data.passingYear,
      percentage: data.percentage || null,
      grade: data.grade || null,
      subjects: data.subjects || null,
      roll_number: data.rollNumber || null,
    };

    console.log('Education data to insert:', educationData);

    if (editingIndex !== null) {
      // Update existing education
      const educationToUpdate = educations[editingIndex];
      console.log('Updating education with ID:', educationToUpdate.id);
      
      const { data: updateData, error } = await supabase
        .from('educational_qualifications')
        .update(educationData)
        .eq('id', educationToUpdate.id)
        .select();
      
      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      
      console.log('Updated education successfully:', updateData);
      setEditingIndex(null);
    } else {
      // Add new education
      console.log('Inserting new education...');
      
      const { data: insertData, error } = await supabase
        .from('educational_qualifications')
        .insert(educationData)
        .select();
      
      console.log('Insert result:', { insertData, error });
      
      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      
      console.log('Inserted education successfully:', insertData);
    }

    form.reset();
    console.log('Fetching updated education data...');
    await fetchEducationData();
    
    toast({
      title: 'Success',
      description: editingIndex !== null ? 'Education updated successfully' : 'Education added successfully',
    });
    
  } catch (error: any) {
    console.error('Error saving education:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to save education',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};


  const handleEditEducation = (index: number) => {
    const education = educations[index];
    form.reset(education);
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteEducation = async (index: number) => {
    const education = educations[index];
    
    try {
      const { error } = await supabase
        .from('educational_qualifications')
        .delete()
        .eq('id', education.id);
      
      if (error) throw error;
      
      await fetchEducationData();
      toast({
        title: "Success",
        description: "Education deleted successfully",
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete education",
        variant: "destructive"
      });
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
            className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-6"
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
        {/* Add/Edit Education Form */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 shadow-lg hover:shadow-xl transition-all rounded-2xl h-full">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                {editingIndex !== null ? (
                  <>
                    <Edit className="h-6 w-6" />
                    Edit Education
                  </>
                ) : (
                  <>
                    <Plus className="h-6 w-6" />
                    Add Education
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={form.handleSubmit(handleAddEducation)} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-800 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                    <GraduationCap className="h-4 w-4" />
                    Qualification Type *
                  </Label>
                  <Select 
                    value={form.watch("qualificationType")}
                    onValueChange={(value) => form.setValue("qualificationType", value)}
                  >
                    <SelectTrigger className="h-12 bg-white border-2 border-cyan-200 focus:border-teal-400 rounded-xl">
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10th">10th Standard</SelectItem>
                      <SelectItem value="12th">12th Standard</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="graduation">Graduation</SelectItem>
                      <SelectItem value="post_graduation">Post Graduation</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.qualificationType && (
                    <p className="text-sm text-red-600">{form.formState.errors.qualificationType.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="boardUniversity" className="text-base font-semibold text-gray-800 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                    <BookOpen className="h-4 w-4" />
                    Board/University *
                  </Label>
                  <Input
                    id="boardUniversity"
                    placeholder="Enter board or university name"
                    className="h-12 bg-white border-2 border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 rounded-xl"
                    {...form.register("boardUniversity")}
                  />
                  {form.formState.errors.boardUniversity && (
                    <p className="text-sm text-red-600">{form.formState.errors.boardUniversity.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="passingYear" className="text-sm font-semibold text-gray-800 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                      <Calendar className="h-4 w-4" />
                      Passing Year *
                    </Label>
                    <Input
                      id="passingYear"
                      type="number"
                      min="1950"
                      max={new Date().getFullYear()}
                      placeholder="YYYY"
                      className="h-12 bg-white border-2 border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 rounded-xl"
                      {...form.register("passingYear", { valueAsNumber: true })}
                    />
                    {form.formState.errors.passingYear && (
                      <p className="text-sm text-red-600">{form.formState.errors.passingYear.message}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="percentage" className="text-sm font-semibold text-gray-800 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                      <Award className="h-4 w-4" />
                      Percentage/CGPA
                    </Label>
                    <Input
                      id="percentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="0-100"
                      className="h-12 bg-white border-2 border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 rounded-xl"
                      {...form.register("percentage", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="subjects" className="text-sm font-semibold text-gray-800" style={{ lineHeight: "1.8" }}>
                    Subjects/Stream
                  </Label>
                  <Input
                    id="subjects"
                    placeholder="e.g., Science, Commerce, Arts"
                    className="h-12 bg-white border-2 border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 rounded-xl"
                    {...form.register("subjects")}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="rollNumber" className="text-sm font-semibold text-gray-800" style={{ lineHeight: "1.8" }}>
                    Roll Number
                  </Label>
                  <Input
                    id="rollNumber"
                    placeholder="Enter roll number"
                    className="h-12 bg-white border-2 border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 rounded-xl"
                    {...form.register("rollNumber")}
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
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl px-6 py-6 font-semibold shadow-lg"
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
                        {editingIndex !== null ? "Update" : "Add Education"}
                        <Save className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Education List */}
        <motion.div variants={item}>
          <Card className="bg-white/90 border-2 border-teal-200 shadow-lg hover:shadow-xl transition-all rounded-2xl h-full">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                <GraduationCap className="h-6 w-6" />
                Your Qualifications ({educations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence mode="popLayout">
                {educations.length > 0 ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {educations.map((education, index) => (
                      <motion.div
                        key={education.id || index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200 hover:border-teal-300 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                              {education.qualificationType}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditEducation(index)}
                              className="border-teal-300 hover:bg-teal-50 rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteEducation(index)}
                              className="border-red-300 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2" style={{ lineHeight: "1.6" }}>
                          {education.boardUniversity}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            Passing Year: {education.passingYear}
                          </p>
                          {education.percentage && (
                            <p className="flex items-center gap-2">
                              <Award className="h-3 w-3" />
                              Score: {education.percentage}%
                            </p>
                          )}
                          {education.subjects && (
                            <p className="flex items-center gap-2">
                              <BookOpen className="h-3 w-3" />
                              Stream: {education.subjects}
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
                      <GraduationCap className="h-16 w-16 text-teal-300 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-gray-600 text-lg font-semibold mb-2" style={{ lineHeight: "1.8" }}>
                      No qualifications added yet
                    </p>
                    <p className="text-gray-500 text-sm" style={{ lineHeight: "1.8" }}>
                      Add your educational qualifications using the form
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
