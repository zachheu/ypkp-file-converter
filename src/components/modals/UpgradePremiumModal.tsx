import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, X, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradePremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradePremiumModal = ({ isOpen, onClose }: UpgradePremiumModalProps) => {
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl btn-premium mb-4">
                <Crown className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold">Batas Gratis Tercapai</h2>
              <p className="text-muted-foreground mt-2">
                Anda telah menggunakan 3 konversi gratis. Upgrade ke Premium untuk konversi tanpa batas!
              </p>
            </div>

            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-premium" />
                Keuntungan Premium
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  Konversi file tanpa batas
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  Prioritas kecepatan konversi
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  Dukungan format lebih banyak
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  Tanpa watermark
                </li>
              </ul>
            </div>

            <Link to="/pricing" onClick={onClose}>
              <Button className="w-full btn-premium">
                <Crown className="w-4 h-4 mr-2" />
                Lihat Paket Premium
              </Button>
            </Link>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpgradePremiumModal;
