import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Award, Lock } from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/jewelryCatalog';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenStory: () => void;
  onOpenCare: () => void;
  onOpenRingGuide: () => void;
  onOpenConsultation: () => void;
  onOpenContact: () => void;
  onOpenStaffLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenStory,
  onOpenCare,
  onOpenRingGuide,
  onOpenConsultation,
  onOpenContact,
  onOpenStaffLogin,
}) => {
  return (
    <footer className="bg-[#042326] text-[#FAFCFB] border-t border-[#0d7480]/30 pt-14 pb-8 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-left">
          
          {/* Col 1: Brand & Philosophy (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="font-serif text-2xl tracking-tight text-white block">
                Elite Designer Jewelry
              </span>
              <span className="block text-[10px] tracking-[0.25em] uppercase font-sans text-[#d4af37] font-semibold mt-0.5">
                Fine Diamond Jewelry
              </span>
            </div>
            <p className="text-teal-100/80 text-xs leading-relaxed max-w-sm">
              Dedicated to authentic craftsmanship, conflict-free certified diamonds, BIS hallmarked gold, and bespoke consultation experiences at our Mumbai flagship atelier.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-teal-100/70 text-[11px]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  634, Shree Laxmi Plaza PCS Ltd,<br />
                  Laxmi Industrial Estate, New Link Road,<br />
                  Andheri (West), Mumbai - 400053
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>
                  Contact: <a href="tel:+919821156861" className="text-white hover:text-[#d4af37] font-mono">+91 9821156861</a> / <a href="tel:+917506666861" className="text-white hover:text-[#d4af37] font-mono">+91 7506666861</a>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <a href="mailto:contact.elitedesignerjewelry@gmail.com" className="text-white hover:text-[#d4af37]">
                  contact.elitedesignerjewelry@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Seven Collections */}
          <div className="space-y-3">
            <p className="font-serif text-sm tracking-wider uppercase text-[#d4af37] font-semibold">
              Fine Jewelry
            </p>
            <ul className="space-y-2 text-teal-100/80">
              {CATEGORIES_CONFIG.map(cat => (
                <li key={cat.key}>
                  <button
                    onClick={() => onSelectCategory(cat.key)}
                    className="hover:text-[#d4af37] transition-colors cursor-pointer text-left"
                  >
                    {cat.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Atelier & Services */}
          <div className="space-y-3">
            <p className="font-serif text-sm tracking-wider uppercase text-[#d4af37] font-semibold">
              Contact & Services
            </p>
            <ul className="space-y-2 text-teal-100/80">
              <li>
                <button onClick={onOpenConsultation} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Book Personal Appointment / Video Consultation
                </button>
              </li>
              <li>
                <button onClick={onOpenRingGuide} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Ring Sizing & Caliper Guide
                </button>
              </li>
              <li>
                <button onClick={onOpenCare} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Jewelry Care & Longevity
                </button>
              </li>
              <li>
                <button onClick={onOpenStory} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Craftsmanship Story & Heritage
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Andheri West Showroom & WhatsApp
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Assurance & Ethics */}
          <div className="space-y-3">
            <p className="font-serif text-sm tracking-wider uppercase text-[#d4af37] font-semibold">
              Assurance & Standards
            </p>
            <div className="space-y-3 text-[11px] text-teal-100/70">
              <div className="p-2.5 bg-[#083338]/60 border border-[#d4af37]/20 space-y-1">
                <span className="font-semibold text-[#d4af37] block">BIS Sovereign Hallmark</span>
                <p>Assayed by Govt. of India approved hallmarking centers (750 / 916 purity) with verifiable 6-digit HUID.</p>
              </div>
              <div className="p-2.5 bg-[#083338]/60 border border-[#d4af37]/20 space-y-1">
                <span className="font-semibold text-[#d4af37] block">GIA & IGI Diamond Grading</span>
                <p>Laser-inscribed girdles and internationally verifiable lab certificate records.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-teal-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-teal-200/60">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Elite Designer Jewelry · Fine Diamond Jewelry. All rights reserved.</span>
            {onOpenStaffLogin && (
              <button
                onClick={onOpenStaffLogin}
                className="text-teal-500 hover:text-[#d4af37] transition-colors ml-1 p-0.5 cursor-pointer inline-flex items-center gap-1 opacity-40 hover:opacity-100 text-[10px]"
                title="Atelier Staff Workspace (Alt+S)"
                aria-label="Atelier Staff Access"
              >
                <Lock className="w-2.5 h-2.5" />
                <span className="font-mono">Staff</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>Insured Transit Across India</span>
            <span>·</span>
            <span>15-Day Inspection Exchange</span>
            <span>·</span>
            <span>Lifetime Gold Buyback Guarantee</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
