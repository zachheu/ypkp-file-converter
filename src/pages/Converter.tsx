import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  FileImage,
  ArrowRight,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import LoginRequiredModal from "@/components/modals/LoginRequiredModal";
import UpgradePremiumModal from "@/components/modals/UpgradePremiumModal";
import ConversionSuccessModal from "@/components/modals/ConversionSuccessModal";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const FORMATS = {
  pdf: { label: "PDF", icon: FileText, color: "format-badge-pdf" },
  docx: { label: "DOCX", icon: FileText, color: "format-badge-docx" },
  pptx: { label: "PPTX", icon: Presentation, color: "format-badge-ppt" },
  xlsx: { label: "XLSX", icon: FileSpreadsheet, color: "format-badge-excel" },
};

type FormatKey = keyof typeof FORMATS;

const getConversionOptions = (sourceFormat: FormatKey): FormatKey[] => {
  const all: FormatKey[] = ["pdf", "docx", "pptx", "xlsx"];
  return all.filter(f => f !== sourceFormat);
};

const detectFormat = (fileName: string): FormatKey | null => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "doc" || ext === "docx") return "docx";
  if (ext === "ppt" || ext === "pptx") return "pptx";
  if (ext === "xls" || ext === "xlsx") return "xlsx";
  return null;
};

const Converter = () => {
  const { user, profile, canConvert, incrementConversion } = useAuth();
  const navigate = useNavigate();
  
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceFormat, setSourceFormat] = useState<FormatKey | null>(null);
  const [targetFormat, setTargetFormat] = useState<FormatKey | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFileName, setConvertedFileName] = useState("");
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const format = detectFormat(file.name);
    if (!format) {
      toast.error("Format file tidak didukung. Gunakan PDF, DOCX, PPTX, atau XLSX.");
      return;
    }
    
    setSelectedFile(file);
    setSourceFormat(format);
    setTargetFormat(null);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setSourceFormat(null);
    setTargetFormat(null);
  };

  const handleConvert = async () => {
    // Check if user is logged in
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Check if user can convert
    if (!canConvert()) {
      setShowUpgradeModal(true);
      return;
    }

    if (!selectedFile || !targetFormat) {
      toast.error("Pilih file dan format tujuan");
      return;
    }

    setIsConverting(true);

    // Simulate conversion (in real app, this would be an API call)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Record conversion in database
    try {
      await supabase.from("conversion_history").insert({
        user_id: user.id,
        original_filename: selectedFile.name,
        original_format: sourceFormat,
        target_format: targetFormat,
        file_size: selectedFile.size,
      });

      // Increment conversion count
      await incrementConversion();

      const newFileName = selectedFile.name.replace(/\.[^.]+$/, `.${targetFormat}`);
      setConvertedFileName(newFileName);
      setShowSuccessModal(true);
    } catch (error) {
      toast.error("Terjadi kesalahan saat konversi");
    }

    setIsConverting(false);
  };

  const handleDownload = () => {
    // Simulate download (in real app, this would download the actual file)
    toast.success("File berhasil diunduh!");
    setShowSuccessModal(false);
    clearFile();
  };

  const remainingConversions = profile ? 3 - profile.conversion_count : 3;

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Konversi File dengan <span className="gradient-text">Mudah</span>
            </h1>
            <p className="text-muted-foreground">
              Ubah format dokumen Anda dalam hitungan detik
            </p>
            
            {user && !profile?.is_premium && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
                <span className="text-sm">
                  Sisa konversi gratis: <span className="font-bold text-primary">{remainingConversions}</span>/3
                </span>
              </div>
            )}
          </div>

          {/* Upload Zone */}
          <div className="card-elevated p-8 mb-6">
            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`upload-zone p-12 text-center cursor-pointer transition-all ${
                  isDragging ? "dragover" : ""
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-medium mb-2">
                    Seret file ke sini atau klik untuk memilih
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mendukung PDF, DOCX, PPTX, XLSX
                  </p>
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selected File */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                  {sourceFormat && (
                    <div className={`format-badge ${FORMATS[sourceFormat].color}`}>
                      {FORMATS[sourceFormat].label}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={clearFile}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-destructive" />
                  </button>
                </div>

                {/* Conversion Options */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Dari</label>
                    <div className={`format-badge ${sourceFormat ? FORMATS[sourceFormat].color : ""} py-2 px-4`}>
                      {sourceFormat ? FORMATS[sourceFormat].label : "-"}
                    </div>
                  </div>
                  
                  <ArrowRight className="w-6 h-6 text-muted-foreground mt-6" />
                  
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Ke</label>
                    <Select
                      value={targetFormat || ""}
                      onValueChange={(value) => setTargetFormat(value as FormatKey)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih format" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceFormat && getConversionOptions(sourceFormat).map((format) => (
                          <SelectItem key={format} value={format}>
                            <span className="flex items-center gap-2">
                              {FORMATS[format].label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Convert Button */}
                <Button
                  onClick={handleConvert}
                  disabled={!targetFormat || isConverting}
                  className="w-full btn-primary py-6 text-lg"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Mengkonversi...
                    </>
                  ) : (
                    <>
                      <FileImage className="w-5 h-5 mr-2" />
                      Konversi Sekarang
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Supported Formats */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">Format yang didukung:</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {Object.entries(FORMATS).map(([key, format]) => (
                <span key={key} className={`format-badge ${format.color}`}>
                  {format.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Modals */}
      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      <UpgradePremiumModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
      <ConversionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        fileName={convertedFileName}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default Converter;
