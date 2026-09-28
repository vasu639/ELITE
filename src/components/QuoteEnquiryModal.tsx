import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle2, Calendar, Gem } from 'lucide-react';
import { Product, BespokeQuoteEnquiry } from '../types';

interface QuoteEnquiryModalProps {
  product: Product;
  onClose: () => void;
  onSubmitEnquiry: (enquiry: BespokeQuoteEnquiry) => void;
}

export const QuoteEnquiryModal: React.FC<QuoteEnquiryModalProps> = ({
  product,
  onClose,
  onSubmitEnquiry,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [budgetINR, setBudgetINR] = useState('₹5,00,000 - ₹10,00,000');
  const [occasion, setOccasion] = useState('Bridal / Wedding');
  const [requiredByDate, setRequiredByDate] = useState('2026-11-15');
  const [customNotes, setCustomNotes] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEnquiry: BespokeQuoteEnquiry = {
      id: `EDJ-QUO-${Math.floor(1000 + Math.random() * 9000)}`,
      productId: product.id,
      productName: product.name,
      customerName,
      customerEmail,
      customerPhone,
      budgetINR,
      occasion,
      requiredByDate,
      notes: customNotes,
      status: 'new',
      assignedConsultant: 'Jigna Khakhar (Principal Designer)',
      createdAt: new Date().toISOString(),
    };

    onSubmitEnquiry(newEnquiry);
    setSubmittedId(newEnquiry.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#FFFDFB] text-[#282329] shadow-2xl overflow-hidden border border-stone-300 my-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#7D4856] font-semibold">
              Bespoke Quotation Request
            </span>
            <h3 className="font-serif text-xl text-[#432032]">
              {submittedId ? 'Enquiry Received' : 'Private Price & Specification Quote'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl text-[#432032]">Quotation Ticket #{submittedId}</h4>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              Your inquiry for <strong>{product.name}</strong> has been logged in our workshop queue. Founder <strong>Jigna Khakhar</strong> will prepare a confidential quotation within 1 business day.
            </p>
            <div className="p-3 bg-stone-50 border border-stone-200 text-xs text-stone-700 inline-block text-left">
              <p>· Contact Telephones: <strong>+91 9821156861</strong> / <strong>+91 7506666861</strong> (Mon-Sat 10:30 - 19:30 IST)</p>
              <p>· Direct Email: <strong>contact.elitedesignerjewelry@gmail.com</strong></p>
              <p>· Confirmation copy dispatched to: <strong>{customerEmail}</strong></p>
            </div>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#432032] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#341826] cursor-pointer"
              >
                Return to Collection
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Target piece banner */}
            <div className="p-3 bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-stone-400">Design Reference</span>
                <p className="font-serif text-sm font-semibold text-[#432032]">{product.name}</p>
                <p className="text-stone-500 font-mono text-[10px]">SKU: {product.sku} · {product.metal}</p>
              </div>
              <span className="text-xs font-serif italic text-[#7D4856]">Price on Request</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Your Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ananya Singhania"
                  className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#432032]"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Email Address *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. ananya@domain.com"
                  className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#432032]"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 98111 22334"
                  className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#432032]"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Indicative Budget (Optional)</label>
                <select
                  value={budgetINR}
                  onChange={(e) => setBudgetINR(e.target.value)}
                  className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#432032]"
                >
                  <option value="₹2,00,000 - ₹5,00,000">₹2,00,000 - ₹5,00,000</option>
                  <option value="₹5,00,000 - ₹10,00,000">₹5,00,000 - ₹10,00,000</option>
                  <option value="₹10,00,000 - ₹25,00,000">₹10,00,000 - ₹25,00,000</option>
                  <option value="₹25,00,000+ (Masterwork Collection)">₹25,00,000+ (High Jewelry)</option>
                  <option value="Flexible based on stones">Flexible based on stone grade</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Occasion</label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#432032]"
                >
                  <option value="Bridal / Wedding">Bridal / Wedding</option>
                  <option value="Milestone Anniversary">Milestone Anniversary</option>
                  <option value="Investment / Collector">Investment / Rare Gems</option>
                  <option value="Personal Milestone">Personal Milestone</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Target Delivery Date</label>
                <input
                  type="date"
                  value={requiredByDate}
                  onChange={(e) => setRequiredByDate(e.target.value)}
                  className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#432032]"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-stone-600 mb-1 font-medium">Customization & Stone Inquiries</label>
              <textarea
                rows={3}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Mention specific stone carat preferences, purity (18K vs 22K), engraving or matching bridal suites..."
                className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#432032]"
              />
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-center">
              <div className="text-[11px] text-stone-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                <span>Strictly Confidential · No unsolicited calls</span>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#432032] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#341826] flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Quotation Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
