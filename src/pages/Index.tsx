import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  ArrowRight, 
  Zap, 
  Shield, 
  Clock,
  FileSpreadsheet,
  Presentation,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

const FEATURES = [
  {
    icon: Zap,
    title: "Cepat & Mudah",
    description: "Konversi file dalam hitungan detik tanpa instalasi software",
  },
  {
    icon: Shield,
    title: "Aman & Terpercaya",
    description: "File Anda dilindungi dengan enkripsi tingkat enterprise",
  },
  {
    icon: Clock,
    title: "Tersedia 24/7",
    description: "Akses kapan saja, di mana saja tanpa batasan waktu",
  },
];

const FORMATS = [
  { icon: FileText, label: "PDF", color: "bg-red-100 text-red-600" },
  { icon: FileText, label: "DOCX", color: "bg-blue-100 text-blue-600" },
  { icon: Presentation, label: "PPTX", color: "bg-orange-100 text-orange-600" },
  { icon: FileSpreadsheet, label: "XLSX", color: "bg-green-100 text-green-600" },
];

const Index = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Konversi file lebih cepat dari sebelumnya
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Konversi File dengan{" "}
              <span className="gradient-text">YPKP Convert File</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ubah format dokumen Anda dengan mudah. Mendukung PDF, DOCX, PPTX, dan XLSX. 
              Gratis 3 kali konversi untuk pengguna baru!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={user ? "/converter" : "/register"}>
                <Button size="lg" className="btn-primary px-8 py-6 text-lg">
                  {user ? "Mulai Konversi" : "Coba Gratis"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                  <Crown className="w-5 h-5 mr-2" />
                  Lihat Paket Premium
                </Button>
              </Link>
            </div>

            {/* Supported Formats */}
            <div className="mt-12">
              <p className="text-sm text-muted-foreground mb-4">Format yang didukung:</p>
              <div className="flex justify-center gap-4 flex-wrap">
                {FORMATS.map((format, index) => (
                  <motion.div
                    key={format.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl ${format.color}`}
                  >
                    <format.icon className="w-5 h-5" />
                    <span className="font-medium">{format.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mengapa Memilih <span className="gradient-text">YPKP Convert</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kami menyediakan layanan konversi file terbaik dengan fitur-fitur unggulan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="card-elevated p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card-premium p-8 md:p-12 text-center max-w-3xl mx-auto"
          >
            <Crown className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Upgrade ke Premium
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Dapatkan konversi tanpa batas, kecepatan prioritas, dan fitur eksklusif lainnya!
            </p>
            <Link to="/pricing">
              <Button size="lg" variant="secondary" className="px-8">
                Lihat Paket Premium
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                <span className="font-bold gradient-text">YPKP Convert File</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2025 YPKP Convert File. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
