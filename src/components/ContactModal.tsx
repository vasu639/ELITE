import React from 'react';
import { X, MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink, Instagram } from 'lucide-react';

interface ContactModalProps {
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose, onOpenConsultation }) => {
  const whatsappUrl = `https://wa.me/919821156861?text=${encodeURIComponent('Hello Elite Designer Jewelry, I would like to inquire about fine diamond jewelry designs and consultation availability.')}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#FAFCFB] text-[#1A2826] shadow-2xl overflow-hidden border border-[#0d7480]/30 my-auto"
        role="dialog"
      >
        <div className="px-6 py-4 border-b border-teal-100 flex items-center justify-between bg-[#042326] text-white">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
              Contact & Flagship Showroom
            </span>
            <h3 className="font-serif text-xl text-white">
              Contact Elite Designer Jewelry
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-teal-200 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Mumbai Showroom Address */}
          <div className="p-4 bg-white border border-teal-100 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#083338] font-semibold text-sm">
              <MapPin className="w-4 h-4 text-[#0d7480]" />
              <span>Flagship Private Showroom & Studio</span>
            </div>
            <p className="text-stone-800 leading-relaxed font-sans text-xs">
              634, Shree Laxmi Plaza PCS Ltd<br />
              Laxmi Industrial Estate, New Link Road,<br />
              Andheri (West), Mumbai - 400053
            </p>
            <p className="text-teal-700 text-[11px] font-medium">
              (Showroom entry by confirmed personal appointment only · Valet parking available)
            </p>
          </div>

          {/* Contact Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-teal-50/50 border border-teal-100 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#083338] font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#0d7480]" />
                <span>Contact Telephones</span>
              </div>
              <div className="space-y-0.5">
                <a href="tel:+919821156861" className="block font-mono text-[#083338] font-semibold hover:text-[#0d7480]">
                  +91 9821156861
                </a>
                <a href="tel:+917506666861" className="block font-mono text-[#083338] font-semibold hover:text-[#0d7480]">
                  +91 7506666861
                </a>
              </div>
              <p className="text-[10px] text-stone-500 pt-0.5">Mon - Sat: 10:30 AM - 7:30 PM IST</p>
            </div>

            <div className="p-3.5 bg-teal-50/50 border border-teal-100 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#083338] font-semibold">
                <Mail className="w-3.5 h-3.5 text-[#0d7480]" />
                <span>Email Address</span>
              </div>
              <a href="mailto:contact.elitedesignerjewelry@gmail.com" className="block font-mono text-stone-900 font-medium hover:text-[#0d7480] break-all">
                contact.elitedesignerjewelry@gmail.com
              </a>
              <p className="text-[10px] text-stone-500 pt-0.5">Bespoke quotes within 24 hours</p>
            </div>
          </div>

          {/* Social & Messaging Direct Connect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-4 bg-[#083338] hover:bg-[#0c444a] text-white border border-[#d4af37]/40 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-[#d4af37]" />
              <span>WhatsApp Direct</span>
              <ExternalLink className="w-3.5 h-3.5 text-teal-200" />
            </a>

            <a
              href="https://www.instagram.com/elitedesigner_jewelry/"
              target="_blank"
              rel="noreferrer"
              className="py-3 px-4 bg-gradient-to-r from-[#833ab4]/15 via-[#fd1d1d]/15 to-[#fcb045]/15 hover:from-[#833ab4]/25 hover:via-[#fd1d1d]/25 hover:to-[#fcb045]/25 text-[#083338] border border-[#d4af37]/40 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              title="Official Instagram: @elitedesigner_jewelry"
            >
              <Instagram className="w-4 h-4 text-[#d4af37]" />
              <span>Instagram @elitedesigner_jewelry</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#083338]" />
            </a>
          </div>

          <div className="pt-2 border-t border-teal-100 flex justify-between items-center">
            <span className="text-stone-600">Looking for custom engagement or bridal sets?</span>
            <button
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="text-[#083338] hover:text-[#0d7480] font-semibold underline underline-offset-2 cursor-pointer font-serif text-sm"
            >
              Book Personal Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
