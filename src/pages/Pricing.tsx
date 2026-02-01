import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Crown, 
  Check, 
  CreditCard, 
  Building2, 
  Copy,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 29000,
    features: [
      "50 konversi per bulan",
      "Semua format file",
      "Kecepatan standar",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 49000,
    popular: true,
    features: [
      "Konversi tanpa batas",
      "Semua format file",
      "Kecepatan prioritas",
      "Prioritas support",
      "Tanpa watermark",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99000,
    features: [
      "Konversi tanpa batas",
      "Semua format file",
      "Kecepatan tercepat",
      "24/7 dedicated support",
      "API access",
      "Custom integration",
    ],
  },
];

const BANKS = [
  { id: "bca", name: "Bank BCA", account: "1234567890", holder: "PT YPKP Indonesia" },
  { id: "mandiri", name: "Bank Mandiri", account: "0987654321", holder: "PT YPKP Indonesia" },
  { id: "bni", name: "Bank BNI", account: "5678901234", holder: "PT YPKP Indonesia" },
  { id: "bri", name: "Bank BRI", account: "4321098765", holder: "PT YPKP Indonesia" },
];

const Pricing = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [step, setStep] = useState<"plans" | "payment" | "confirm">("plans");
  const [transferNote, setTransferNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard!");
  };

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }
    setSelectedPlan(planId);
    setStep("payment");
  };

  const handleConfirmPayment = async () => {
    if (!user || !selectedPlan || !selectedBank) return;

    setIsSubmitting(true);
    
    const plan = PLANS.find(p => p.id === selectedPlan);
    const bank = BANKS.find(b => b.id === selectedBank);
    
    if (!plan || !bank) return;

    try {
      // Create subscription record
      const { error } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        plan_name: plan.name,
        price_monthly: plan.price,
        status: "pending",
        payment_method: bank.name,
      });

      if (error) throw error;

      setStep("confirm");
      toast.success("Pembayaran sedang diverifikasi");
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }

    setIsSubmitting(false);
  };

  const selectedPlanData = PLANS.find(p => p.id === selectedPlan);
  const selectedBankData = BANKS.find(b => b.id === selectedBank);

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {step === "plans" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl btn-premium mb-4">
                <Crown className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Pilih Paket <span className="gradient-text">Premium</span>
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Dapatkan akses tak terbatas ke semua fitur konversi file dengan paket premium kami
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {PLANS.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative card-elevated p-6 ${
                    plan.popular ? "ring-2 ring-premium" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full btn-premium text-sm font-medium">
                      Populer
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold">
                        Rp {plan.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-muted-foreground">/bulan</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full ${plan.popular ? "btn-premium" : "btn-primary"}`}
                  >
                    Pilih Paket
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === "payment" && selectedPlanData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <button
              onClick={() => setStep("plans")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>

            <div className="card-elevated p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Pembayaran</h2>

              {/* Selected Plan Summary */}
              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{selectedPlanData.name}</p>
                    <p className="text-sm text-muted-foreground">Bulanan</p>
                  </div>
                  <p className="text-xl font-bold">
                    Rp {selectedPlanData.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Bank Selection */}
              <div className="mb-6">
                <Label className="text-base mb-4 block">Pilih Metode Pembayaran</Label>
                <RadioGroup
                  value={selectedBank || ""}
                  onValueChange={setSelectedBank}
                  className="grid grid-cols-2 gap-4"
                >
                  {BANKS.map((bank) => (
                    <div key={bank.id}>
                      <RadioGroupItem
                        value={bank.id}
                        id={bank.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={bank.id}
                        className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary"
                      >
                        <Building2 className="w-5 h-5 text-primary" />
                        <span className="font-medium">{bank.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Bank Details */}
              {selectedBankData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-secondary/50 rounded-xl p-4 mb-6 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Bank</span>
                    <span className="font-medium">{selectedBankData.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">No. Rekening</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{selectedBankData.account}</span>
                      <button
                        onClick={() => copyToClipboard(selectedBankData.account)}
                        className="p-1 hover:bg-primary/10 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Atas Nama</span>
                    <span className="font-medium">{selectedBankData.holder}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Jumlah Transfer</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">
                        Rp {selectedPlanData.price.toLocaleString("id-ID")}
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedPlanData.price.toString())}
                        className="p-1 hover:bg-primary/10 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Transfer Note */}
              <div className="mb-6">
                <Label htmlFor="note">Catatan Transfer (Opsional)</Label>
                <Textarea
                  id="note"
                  placeholder="Contoh: Nama bank pengirim, tanggal transfer, dll."
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={handleConfirmPayment}
                disabled={!selectedBank || isSubmitting}
                className="w-full btn-premium py-6"
              >
                {isSubmitting ? (
                  "Memproses..."
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Konfirmasi Pembayaran
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === "confirm" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="card-elevated p-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              
              <h2 className="text-2xl font-bold mb-4">Pembayaran Diterima!</h2>
              <p className="text-muted-foreground mb-6">
                Terima kasih! Pembayaran Anda sedang diverifikasi. 
                Akun premium Anda akan aktif dalam 1x24 jam setelah verifikasi selesai.
              </p>

              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground">Paket yang dipilih</p>
                <p className="font-bold text-lg">{selectedPlanData?.name}</p>
                <p className="text-primary font-medium">
                  Rp {selectedPlanData?.price.toLocaleString("id-ID")}/bulan
                </p>
              </div>

              <Button onClick={() => navigate("/converter")} className="w-full btn-primary">
                Kembali ke Converter
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Pricing;
