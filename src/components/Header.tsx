import { Link, useNavigate } from "react-router-dom";
import { FileText, LogOut, Crown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              YPKP Convert File
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                {/* Usage Counter */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                  {profile?.is_premium ? (
                    <span className="flex items-center gap-1 text-sm font-medium text-premium">
                      <Crown className="w-4 h-4" />
                      Premium
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{3 - (profile?.conversion_count || 0)}</span> konversi tersisa
                    </span>
                  )}
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-2">
                  <Link to="/pricing">
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                      {profile?.is_premium ? "Kelola Langganan" : "Upgrade Premium"}
                    </Button>
                  </Link>
                  
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {profile?.full_name || user.email?.split("@")[0]}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost">Masuk</Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-primary">Daftar</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
