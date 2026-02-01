import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Download, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConversionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  onDownload: () => void;
}

const ConversionSuccessModal = ({ 
  isOpen, 
  onClose, 
  fileName,
  onDownload 
}: ConversionSuccessModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md card-elevated p-6"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-4"
              >
                <CheckCircle className="w-10 h-10 text-success" />
              </motion.div>
              <h2 className="text-xl font-bold">Konversi Berhasil!</h2>
              <p className="text-muted-foreground mt-2">
                File Anda telah berhasil dikonversi dan siap untuk diunduh.
              </p>
            </div>

            <div className="bg-secondary/50 rounded-xl p-4 mb-6 flex items-center gap-3">
              <FileCheck className="w-8 h-8 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{fileName}</p>
                <p className="text-sm text-muted-foreground">Siap diunduh</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Tutup
              </Button>
              <Button onClick={onDownload} className="flex-1 btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Unduh
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConversionSuccessModal;
