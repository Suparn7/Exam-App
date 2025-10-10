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
  Camera, 
  Plus, 
  Trash2, 
  Save, 
  ImageIcon, 
  Edit, 
  Loader2,
  Upload,
  FileImage,
  CheckCircle,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const documentSchema = z.object({
  documentType: z.enum(["photo", "signature"], { required_error: "Document type is required" }),
  file: z.any().refine((file) => file instanceof File && file.size > 0, "File is required"),
});

type DocumentForm = z.infer<typeof documentSchema>;

interface Document {
  id?: string;
  documentType: "photo" | "signature";
  file_url: string;
  file_name: string;
  status?: string;
}

interface DocumentsUploadProps {
  onNext?: () => void;
}

export function DocumentsUpload({ onNext }: DocumentsUploadProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<DocumentForm>({
    resolver: zodResolver(documentSchema),
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchDocuments();
  }, [user, loading, navigate]);

  const fetchDocuments = async () => {
    if (!user) {
      console.log('No user found');
      return;
    }

    console.log('Fetching documents for user:', user.id);

    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      console.log('Documents fetch result:', { data, error });

      if (error) {
        console.error('Supabase fetch error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch documents',
          variant: 'destructive',
        });
        return;
      }

      if (data) {
        const formatted = data.map((doc: any) => ({
          id: doc.id,
          documentType: doc.document_type,
          file_url: doc.file_url || doc.file_path,
          file_name: doc.file_name,
          status: doc.status,
        }));
        setDocuments(formatted);
        console.log('Fetched documents:', formatted);
      } else {
        console.log('No documents found');
      }
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch documents",
        variant: "destructive",
      });
    }
  };

  const handleUploadDocument = async (data: DocumentForm) => {
    if (!user) {
      console.log('No user found in handleUploadDocument');
      return;
    }

    console.log('Starting document upload for user:', user.id);
    console.log('Form data:', data);

    setIsLoading(true);

    try {
      const file = data.file as File;
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${data.documentType}_${Date.now()}.${fileExt}`;
      const storagePath = `${data.documentType}s/${fileName}`;

      console.log('Uploading to storage:', storagePath);

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully');

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(storagePath);

      const file_url = urlData?.publicUrl || "";
      console.log('Public URL:', file_url);

      // Save metadata in DB
      const docData = {
        user_id: user.id,
        document_type: data.documentType,
        file_url,
        file_path: storagePath,
        file_name: fileName,
        file_size: file.size,
        mime_type: file.type,
        status: "uploaded" as const,
      };

      console.log('Saving document metadata:', docData);

      if (editingIndex !== null) {
        const docToUpdate = documents[editingIndex];
        console.log('Updating document with ID:', docToUpdate.id);

        const { error } = await supabase
          .from("documents")
          .update(docData)
          .eq("id", docToUpdate.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }

        console.log('Document updated successfully');
        setEditingIndex(null);
      } else {
        console.log('Inserting new document...');

        const { error } = await supabase
          .from("documents")
          .insert(docData);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }

        console.log('Document inserted successfully');
      }

      form.reset();
      setPreviewUrl(null);
      await fetchDocuments();

      toast({
        title: "Success",
        description: editingIndex !== null ? "Document updated successfully" : "Document uploaded successfully",
      });

    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDocument = (index: number) => {
    const doc = documents[index];
    form.reset({ documentType: doc.documentType });
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDocument = async (index: number) => {
    const doc = documents[index];

    console.log('Deleting document with ID:', doc.id);

    try {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", doc.id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      console.log('Document deleted successfully');
      await fetchDocuments();

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("file", file, { shouldValidate: true });
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
        {/* Upload Document Form */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all rounded-2xl h-full">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                {editingIndex !== null ? (
                  <>
                    <Edit className="h-6 w-6" />
                    Edit Document
                  </>
                ) : (
                  <>
                    <Upload className="h-6 w-6" />
                    Upload Document
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={form.handleSubmit(handleUploadDocument)} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-800 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                    <FileImage className="h-4 w-4" />
                    Document Type *
                  </Label>
                  <Select
                    value={form.watch("documentType")}
                    onValueChange={(value) => form.setValue("documentType", value as "photo" | "signature")}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-12 bg-white border-2 border-green-200 focus:border-teal-400 rounded-xl">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="photo">
                        <div className="flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          Passport Photo
                        </div>
                      </SelectItem>
                      <SelectItem value="signature">
                        <div className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Signature
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.documentType && (
                    <p className="text-sm text-red-600">{form.formState.errors.documentType.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="file" className="text-base font-semibold text-gray-800 flex items-center gap-2" style={{ lineHeight: "1.8" }}>
                    <ImageIcon className="h-4 w-4" />
                    Upload Image *
                  </Label>
                  <div className="relative">
                    <Input
                      id="file"
                      type="file"
                      accept="image/*"
                      className="h-12 bg-white border-2 border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 rounded-xl"
                      disabled={isLoading}
                      onChange={handleFileChange}
                    />
                  </div>
                  {form.formState.errors.file && (
                    <p className="text-sm text-red-600">{String(form.formState.errors.file.message)}</p>
                  )}

                  {/* Image Preview */}
                  {previewUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-4 bg-white rounded-xl border-2 border-green-200"
                    >
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block" style={{ lineHeight: "1.8" }}>
                        Preview:
                      </Label>
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-48 object-contain rounded-lg border border-gray-200"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                  <p className="text-sm text-gray-700" style={{ lineHeight: "1.8" }}>
                    <strong>Note:</strong> Please ensure the image is clear and follows the specified format requirements.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  {editingIndex !== null && (
                    <Button
                      type="button"
                      onClick={() => {
                        setEditingIndex(null);
                        setPreviewUrl(null);
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
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl px-6 py-6 font-semibold shadow-lg"
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
                        Uploading...
                      </>
                    ) : (
                      <>
                        {editingIndex !== null ? "Update" : "Upload"}
                        <Upload className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Document List */}
        <motion.div variants={item}>
          <Card className="bg-white/90 border-2 border-teal-200 shadow-lg hover:shadow-xl transition-all rounded-2xl h-full">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-3" style={{ lineHeight: "1.8" }}>
                <FileImage className="h-6 w-6" />
                Your Documents ({documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence mode="popLayout">
                {documents.length > 0 ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {documents.map((doc, index) => (
                      <motion.div
                        key={doc.id || index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-gradient-to-br from-teal-50 to-green-50 rounded-xl border-2 border-teal-200 hover:border-teal-300 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <Badge className="bg-gradient-to-r from-teal-500 to-green-500 text-white mb-2">
                              {doc.documentType === 'photo' ? 'Passport Photo' : 'Signature'}
                            </Badge>
                            {doc.status === 'uploaded' && (
                              <Badge className="bg-green-500 text-white ml-2">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Uploaded
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditDocument(index)}
                              className="border-teal-300 hover:bg-teal-50 rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteDocument(index)}
                              className="border-red-300 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {doc.file_url && (
                            <div className="relative group">
                              <img
                                src={doc.file_url}
                                alt={doc.documentType}
                                className="h-24 w-24 object-cover rounded-lg border-2 border-teal-200 shadow"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <Eye className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800 mb-1" style={{ lineHeight: "1.6" }}>
                              {doc.file_name}
                            </p>
                            <p className="text-xs text-gray-600" style={{ lineHeight: "1.6" }}>
                              Status: {doc.status}
                            </p>
                          </div>
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
                      <FileImage className="h-16 w-16 text-teal-300 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-gray-600 text-lg font-semibold mb-2" style={{ lineHeight: "1.8" }}>
                      No documents uploaded yet
                    </p>
                    <p className="text-gray-500 text-sm" style={{ lineHeight: "1.8" }}>
                      Upload your photo and signature to continue
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
