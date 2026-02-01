import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginRequiredModal = ({ isOpen, onClose }: LoginRequiredModalProps) => {
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Login Diperlukan</h2>
              <p className="text-muted-foreground mt-2">
                Anda harus login terlebih dahulu untuk menggunakan fitur konversi file.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={onClose}>
                <Button className="w-full btn-primary">
                  <LogIn className="w-4 h-4 mr-2" />
                  Masuk
                </Button>
              </Link>
              <Link to="/register" onClick={onClose}>
                <Button variant="outline" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Buat Akun Baru
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginRequiredModal;
