import React from 'react';
import { X, Award, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

interface StoryModalProps {
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ onClose, onOpenConsultation }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#FFFDFB] text-[#282329] shadow-2xl overflow-hidden border border-stone-300 my-auto max-h-[90vh] flex flex-col"
        role="dialog"
      >
        <div className="px-6 py-4 border-b border-teal-100 flex items-center justify-between bg-[#042326] text-white">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
              The Atelier Narrative
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-white">
              Elite Designer Jewelry by Jigna Khakhar
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-teal-200 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs text-stone-700 leading-relaxed">
          {/* Founder Introduction */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg text-[#083338]">
              A Vision of Modern Indian High Jewelry
            </h4>
            <p>
              Founded by master jeweler and creative director <strong>Jigna Khakhar</strong>, Elite Designer Jewelry emerged from a dedication to harmonizing royal Indian heritage with contemporary European structural silhouettes. Each piece is an intimate dialogue between rare natural gems and disciplined metalwork.
            </p>
            <p>
              Operating from our private atelier in Andheri (West), Mumbai, Jigna Khakhar leads a tight-knit guild of master setters, lapidaries, and polki artisans whose families have guarded ancestral goldsmithing traditions across generations.
            </p>
          </div>

          {/* Pillars of Integrity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-teal-50/40 border border-teal-100 space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#083338]" />
              <strong className="block text-stone-900 font-semibold font-serif text-sm">BIS Hallmarking Standard</strong>
              <p className="text-[11px] text-stone-600">
                Every milligram of gold is assayed and stamped with sovereign Bureau of Indian Standards (BIS) 750 (18K) or 916 (22K) purity marks and our unique laser HUID.
              </p>
            </div>

            <div className="p-4 bg-teal-50/40 border border-teal-100 space-y-2">
              <Award className="w-5 h-5 text-[#0d7480]" />
              <strong className="block text-stone-900 font-semibold font-serif text-sm">GIA & IGI Lab Reports</strong>
              <p className="text-[11px] text-stone-600">
                Solitaires above 0.30 ct carry independent certificates from GIA or IGI, specifying exact cut grade, color, clarity, and laser-inscribed girdle numbers.
              </p>
            </div>

            <div className="p-4 bg-teal-50/40 border border-teal-100 space-y-2">
              <HeartHandshake className="w-5 h-5 text-[#c59b27]" />
              <strong className="block text-stone-900 font-semibold font-serif text-sm">Ethical Kimberley Diamonds</strong>
              <p className="text-[11px] text-stone-600">
                100% natural, ethically mined diamonds sourced in rigorous adherence to the Kimberley Process, supporting artisanal mining communities with transparency.
              </p>
            </div>
          </div>

          {/* Jigna Khakhar Personal Quote */}
          <div className="p-5 bg-teal-50/60 border-l-2 border-[#083338] space-y-1">
            <p className="font-serif italic text-sm text-[#083338]">
              &ldquo;Jewelry is never merely ornamental; it is an intimate repository of family memories, weddings, and generational milestones. We shape metal and light so your story endures forever.&rdquo;
            </p>
            <span className="block text-[11px] font-sans font-semibold text-[#0d7480] uppercase tracking-wider pt-1">
              — Jigna Khakhar, Founder & Principal Designer
            </span>
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-stone-500">
              <span className="block font-medium text-stone-700">Flagship Showroom & Atelier:</span>
              <span>634, Shree Laxmi Plaza PCS Ltd, Laxmi Industrial Estate, New Link Road, Andheri (W), Mumbai-400053</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="px-5 py-2.5 bg-[#083338] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#0c444a] border border-[#d4af37]/40 cursor-pointer shadow-sm shrink-0"
            >
              Book Personal Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
