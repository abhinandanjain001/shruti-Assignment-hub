import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Sparkles, Menu, X, LogOut, ShieldCheck, User } from "lucide-react";

interface HeaderProps {
  onOpenAuth: (tab: "login" | "signup") => void;
  adminOpen: boolean;
  setAdminOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, adminOpen, setAdminOpen }) => {
  const { user, userProfile, isAdmin, signOutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setAdminOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const menuItems = [
    { name: "Our Services", id: "services" },
    { name: "Subject Expertise", id: "expertise" },
    { name: "How It Works", id: "how-it-works" },
    { name: "Portfolio", id: "portfolio" },
    { name: "Why Choose Us", id: "why-sk" },
    { name: "Pricing", id: "pricing" },
    { name: "FAQ", id: "faq" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md py-3.5 border-b border-brand-purple-100 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Brand Logo */}
        <button
          onClick={() => {
            setAdminOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple-600 to-brand-purple-800 flex items-center justify-center shadow-md shadow-brand-purple-600/20">
            <Sparkles className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg md:text-xl text-slate-900 tracking-tight leading-none">
              Shruti Jain
            </h1>
            <p className="text-[10px] font-semibold text-brand-purple-700 uppercase tracking-widest leading-none mt-1">
              Academic Solutions
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {!adminOpen && menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-semibold text-slate-600 hover:text-brand-purple-700 transition-colors cursor-pointer"
            >
              {item.name}
            </button>
          ))}
          {adminOpen && (
            <button
              onClick={() => setAdminOpen(false)}
              className="text-sm font-semibold text-brand-purple-700 hover:text-brand-purple-900 transition-colors cursor-pointer"
            >
              ← Back to Main Website
            </button>
          )}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Admin badge */}
          {isAdmin && (
            <button
              onClick={() => setAdminOpen(!adminOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                adminOpen
                  ? "bg-brand-purple-700 text-white shadow-md shadow-brand-purple-600/20"
                  : "bg-brand-purple-50 text-brand-purple-700 border border-brand-purple-200 hover:border-brand-purple-400"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              {adminOpen ? "View Website" : "Admin Panel"}
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl">
                <User className="w-4 h-4 text-brand-purple-600" />
                <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate" title={userProfile?.displayName || user.email || ""}>
                  {userProfile?.displayName || user.email?.split("@")[0] || "Student"}
                </span>
              </div>
              <button
                onClick={signOutUser}
                className="p-2 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-600 rounded-xl transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenAuth("login")}
                className="text-xs font-bold text-slate-600 hover:text-slate-950 px-3 py-2 transition-all cursor-pointer"
              >
                Student Sign In
              </button>
              <button
                onClick={() => onOpenAuth("signup")}
                className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl text-center shadow-md shadow-brand-purple-600/10 active:scale-98 transition-all cursor-pointer"
              >
                Submit Project Brief
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          {isAdmin && (
            <button
              onClick={() => setAdminOpen(!adminOpen)}
              className="p-2 bg-brand-purple-50 text-brand-purple-700 border border-brand-purple-100 rounded-xl"
            >
              <ShieldCheck className="w-4.5 h-4.5" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-slate-200 p-6 flex flex-col gap-5 lg:hidden animate-fade-in shadow-xl">
          <nav className="flex flex-col gap-4">
            {!adminOpen && menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-left text-base font-semibold text-slate-700 hover:text-brand-purple-600 py-1"
              >
                {item.name}
              </button>
            ))}
            {adminOpen && (
              <button
                onClick={() => setAdminOpen(false)}
                className="text-left text-base font-semibold text-brand-purple-600 py-1"
              >
                ← Back to Main Website
              </button>
            )}
          </nav>

          <div className="border-t border-slate-200 pt-4 flex flex-col gap-3">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <User className="w-4 h-4 text-brand-purple-600 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-800 block truncate">
                    Logged: {userProfile?.displayName || user.email || "Student"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    signOutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm py-2.5 rounded-xl font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of Profile
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth("login");
                  }}
                  className="w-full text-center text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 py-2.5 rounded-xl"
                >
                  Student Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth("signup");
                  }}
                  className="w-full text-center text-sm font-semibold text-white bg-brand-purple-600 py-2.5 rounded-xl"
                >
                  Submit Project Brief
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
