import React from 'react';
import { X, Shield, Sparkles, AlertTriangle, Droplets } from 'lucide-react';

interface JewelryCareModalProps {
  onClose: () => void;
}

export const JewelryCareModal: React.FC<JewelryCareModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#FFFDFB] text-[#282329] shadow-2xl overflow-hidden border border-stone-300 my-auto"
        role="dialog"
      >
        <div className="px-6 py-4 border-b border-teal-100 flex items-center justify-between bg-[#042326] text-white">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
              Fine Jewelry Care Manual
            </span>
            <h3 className="font-serif text-xl text-white">
              Fine Jewelry Longevity & Gemstone Care
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-teal-200 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Diamond & Gold Routine Care */}
          <div className="p-4 bg-white border border-teal-100 space-y-2">
            <h4 className="font-serif text-base text-[#083338] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>Diamonds, 18K Gold & Platinum</span>
            </h4>
            <p className="text-stone-600 leading-relaxed">
              Clean with lukewarm water, mild non-detergent soap, and our ultra-soft camel-hair brush provided with your order. Gently brush behind the basket setting where lotions and natural oils accumulate. Rinse with distilled water and blot dry with a lint-free microfiber cloth.
            </p>
          </div>

          {/* Emeralds & Polki Care Warnings */}
          <div className="p-4 bg-teal-50/40 border border-teal-200 space-y-2 text-stone-900">
            <h4 className="font-serif text-base text-[#083338] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#c59b27]" />
              <span>Special Care: Natural Emeralds, Pearls & Polki (Uncut Diamonds)</span>
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-stone-700">
              <li><strong>Never use ultrasonic or steam cleaners:</strong> Natural Colombian and Zambian emeralds possess internal inclusions and traditional cedarwood oils that heat and sonic vibrations can compromise.</li>
              <li><strong>Polki & Kundan Jewelry:</strong> Because traditional 24k gold foil sits behind uncut diamonds, keep polki pieces away from direct water immersion, perfume sprays, and high humidity.</li>
              <li><strong>Basra & South Sea Pearls:</strong> Apply perfumes, hairsprays, and cosmetics prior to putting on pearls. Wipe with a damp chamois cloth after wearing.</li>
            </ul>
          </div>

          {/* Storage & Annual Showroom Inspection */}
          <div className="p-4 bg-white border border-teal-100 space-y-2">
            <h4 className="font-serif text-base text-[#083338] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#0d7480]" />
              <span>Studio Storage & Complimentary Annual Prong Check</span>
            </h4>
            <p className="text-stone-600 leading-relaxed">
              Store each piece individually in its bespoke Elite Designer Jewelry plush pouch or rigid velvet case to prevent diamonds from scratching softer precious metals. We provide complimentary annual prong tightening and sonic cleaning for all Jigna Khakhar clients at our Mumbai showroom in Andheri West.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#083338] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#0c444a] border border-[#d4af37]/40 cursor-pointer"
            >
              Close Care Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
