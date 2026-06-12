import React from "react";
import { Sparkles, Mail, Phone, Clock, Shield, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToPricing = () => {
    const el = document.getElementById("pricing");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-black border-t border-brand-purple-500/10 text-gray-400 font-sans mt-20 relative overflow-hidden">
      {/* Background radial highlights */}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-purple-900/10 blur-3xl pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-purple-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
        {/* Brand Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-purple-600/30 flex items-center justify-center border border-brand-purple-500/30">
              <Sparkles className="w-5 h-5 text-brand-purple-300" />
            </div>
            <div>
              <span className="font-display font-bold text-base text-white tracking-tight block">
                Shruti Jain Academic
              </span>
              <span className="text-[9px] font-semibold text-brand-purple-400 tracking-wider uppercase block -mt-1">
                Solutions
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Professional academic assistance delivered holding the highest ideals of scholarly writing, coding structure perfection, and on-time performance.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-4 h-4 text-brand-purple-400 shrink-0" />
            <span>Encrypted database, non-disclosure standard</span>
          </div>
        </div>

        {/* Core Domains */}
        <div>
          <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-5">
            Academic Scope
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button onClick={scrollToPricing} className="hover:text-white hover:underline transition-all text-left">
                Complex Assignment Writing
              </button>
            </li>
            <li>
              <button onClick={scrollToPricing} className="hover:text-white hover:underline transition-all text-left">
                High-Performance Coding (Python, Java)
              </button>
            </li>
            <li>
              <button onClick={scrollToPricing} className="hover:text-white hover:underline transition-all text-left">
                Machine Learning & AI Projects
              </button>
            </li>
            <li>
              <button onClick={scrollToPricing} className="hover:text-white hover:underline transition-all text-left">
                Dissertations & Research Literature
              </button>
            </li>
            <li>
              <button onClick={scrollToPricing} className="hover:text-white hover:underline transition-all text-left">
                MBA Case Study Solutions
              </button>
            </li>
            <li>
              <button onClick={scrollToPricing} className="hover:text-white hover:underline transition-all text-left">
                Web/App Development Capstones
              </button>
            </li>
          </ul>
        </div>

        {/* Target Audiences */}
        <div>
          <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-5">
            Catering To
          </h4>
          <ul className="space-y-2.5 text-sm text-gray-500">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-purple-500" />
              <span>University Undergraduates (B.Tech)</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-purple-500" />
              <span>Postgraduates (MBA Scholars, MCA)</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-purple-500" />
              <span>Doctoral Researchers (PhD Students)</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-purple-500" />
              <span>School Students & College Aspirants</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-purple-500" />
              <span>Working Professionals (Certifications)</span>
            </li>
          </ul>
        </div>

        {/* Contact info channels */}
        <div>
          <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-5">
            Executive Channels
          </h4>
          <div className="space-y-3.5 text-sm">
            <a
              href="mailto:shrutiassignmenthelpers@gmail.com"
              className="flex items-center gap-3 hover:text-white transition-colors"
            >
              <Mail className="w-4.5 h-4.5 text-brand-purple-400 shrink-0" />
              <span className="truncate">shrutiassignmenthelpers@gmail.com</span>
            </a>
            <a
              href="https://wa.me/919530473222"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-white transition-colors"
            >
              <Phone className="w-4.5 h-4.5 text-brand-purple-400 shrink-0" />
              <span>+91 9530473222</span>
            </a>
            <div className="flex items-center gap-3 text-gray-500">
              <Clock className="w-4.5 h-4.5 text-brand-purple-400 shrink-0" />
              <span>Open round-the-clock 24/7/365</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500">
              <MapPin className="w-4.5 h-4.5 text-brand-purple-400 shrink-0" />
              <span>Rajasthan, India (Serving Globally)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 bg-black text-center text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Shruti Jain Academic Solutions. Confidential Academic Support with Code and Thesis Integrity.</p>
          <p className="text-[10px] text-gray-700">Disclaimer: All materials provided by this consultancy are subject to standard citation guidelines. We encourage legal, academic-compliant utilization models.</p>
        </div>
      </div>
    </footer>
  );
};
