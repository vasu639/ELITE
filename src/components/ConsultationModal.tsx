import React, { useState } from 'react';
import { 
  X, Calendar as CalendarIcon, Clock, Video, MapPin, 
  CheckCircle2, Heart, User, Mail, Phone, ArrowRight, ShieldCheck, Download, ExternalLink 
} from 'lucide-react';
import { ConsultationBooking, Product, ShortlistItem } from '../types';
import { JEWELRY_CATALOG } from '../data/jewelryCatalog';

interface ConsultationModalProps {
  onClose: () => void;
  shortlist: ShortlistItem[];
  products?: Product[];
  preselectedProduct?: Product | null;
  onBookingConfirmed: (booking: ConsultationBooking) => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  onClose,
  shortlist,
  products = [],
  preselectedProduct,
  onBookingConfirmed,
}) => {
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1); // 1: Mode, 2: Slot, 3: Details, 4: Confirmed
  const [meetingMode, setMeetingMode] = useState<'online' | 'showroom'>('online');
  const [selectedDate, setSelectedDate] = useState('2026-09-28');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [assignedConsultant, setAssignedConsultant] = useState('Jigna Khakhar (Principal Designer)');
  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationBooking | null>(null);

  // Available dates (starting +24 hours per scheduling rules)
  const availableDates = [
    { date: '2026-09-28', label: 'Mon, 28 Sep' },
    { date: '2026-09-29', label: 'Tue, 29 Sep' },
    { date: '2026-09-30', label: 'Wed, 30 Sep' },
    { date: '2026-10-01', label: 'Thu, 01 Oct' },
    { date: '2026-10-02', label: 'Fri, 02 Oct' },
    { date: '2026-10-03', label: 'Sat, 03 Oct' },
  ];

  const timeSlots = [
    '11:00 AM',
    '12:30 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM',
  ];

  // Resolve products in shortlist
  const attachedProducts = shortlist.map(s => products.find(p => p.id === s.productId) || JEWELRY_CATALOG.find(p => p.id === s.productId)).filter(Boolean) as Product[];
  if (preselectedProduct && !attachedProducts.some(p => p.id === preselectedProduct.id)) {
    attachedProducts.unshift(preselectedProduct);
  }

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: ConsultationBooking = {
      id: `EDJ-BK-${Math.floor(1000 + Math.random() * 9000)}`,
      mode: meetingMode,
      date: selectedDate,
      timeSlot: selectedSlot,
      timezone: 'IST (UTC+05:30)',
      customerName,
      customerEmail,
      customerPhone,
      consultantName: assignedConsultant,
      notes: customerNotes,
      shortlistedProductIds: attachedProducts.map(p => p.id),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      meetingLink: meetingMode === 'online' ? 'https://meet.google.com/edj-fine-appointment' : undefined,
      showroomLocation: meetingMode === 'showroom' ? 'Elite Designer Jewelry Showroom & Workshop, 634 Shree Laxmi Plaza PCS Ltd, Laxmi Industrial Estate, New Link Road, Andheri (West), Mumbai 400053' : undefined,
    };

    setConfirmedBooking(newBooking);
    onBookingConfirmed(newBooking);
    setStage(4);
  };

  const downloadCalendarInvite = () => {
    if (!confirmedBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Elite Designer Jewelry//Consultation//EN
BEGIN:VEVENT
UID:${confirmedBooking.id}@elitedesignerjewelry.com
DTSTAMP:20260925T120000Z
DTSTART:20260928T053000Z
DTEND:20260928T060000Z
SUMMARY:Elite Designer Jewelry Consultation with ${confirmedBooking.consultantName}
DESCRIPTION:Private fine jewelry consultation. Booking Ref: ${confirmedBooking.id}.
LOCATION:${confirmedBooking.mode === 'online' ? 'Google Meet Video' : 'Mumbai Workshop'}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `consultation-${confirmedBooking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#FFFDFB] text-[#282329] shadow-2xl overflow-hidden border border-stone-300 my-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-teal-100 flex items-center justify-between bg-[#042326] text-white">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
              Workshop Appointment
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-white">
              Complimentary Consultation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-teal-200 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Stage Progress Indicator (if not completed) */}
        {stage !== 4 && (
          <div className="px-6 py-3 bg-teal-50/50 border-b border-teal-100 flex items-center justify-between text-xs">
            <div className={`flex items-center gap-2 ${stage >= 1 ? 'text-[#083338] font-semibold' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${stage >= 1 ? 'bg-[#083338] text-white' : 'bg-stone-200 text-stone-600'}`}>
                1
              </span>
              <span>Meeting Type</span>
            </div>
            <div className="w-8 h-[1px] bg-teal-200" />
            <div className={`flex items-center gap-2 ${stage >= 2 ? 'text-[#083338] font-semibold' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${stage >= 2 ? 'bg-[#083338] text-white' : 'bg-stone-200 text-stone-600'}`}>
                2
              </span>
              <span>Select Slot</span>
            </div>
            <div className="w-8 h-[1px] bg-teal-200" />
            <div className={`flex items-center gap-2 ${stage >= 3 ? 'text-[#083338] font-semibold' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${stage >= 3 ? 'bg-[#083338] text-white' : 'bg-stone-200 text-stone-600'}`}>
                3
              </span>
              <span>Details & Shortlist</span>
            </div>
          </div>
        )}

        {/* Stage 1: Choose Meeting Type */}
        {stage === 1 && (
          <div className="p-6 space-y-6">
            <p className="text-xs text-stone-600 leading-relaxed">
              Experience personalized guidance directly with founder Jigna Khakhar or senior diamond specialists. Discuss custom designs, bridal styling, or inspect shortlisted creations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Online Option */}
              <div
                onClick={() => setMeetingMode('online')}
                className={`p-5 border cursor-pointer transition-all ${
                  meetingMode === 'online'
                    ? 'border-[#083338] bg-teal-50/50 ring-1 ring-[#083338]'
                    : 'border-stone-200 hover:border-teal-400 bg-white'
                }`}
              >
                <div className="w-10 h-10 bg-amber-50 text-[#083338] flex items-center justify-center mb-3">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg text-[#083338]">Online HD Video Session</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Complimentary 30-minute private video session via Google Meet. Macro camera diamond inspection from any city.
                </p>
                <div className="mt-3 text-[11px] text-[#0d7480] font-medium flex items-center gap-1">
                  <span>Anywhere in India & Worldwide</span>
                </div>
              </div>

              {/* Showroom Option */}
              <div
                onClick={() => setMeetingMode('showroom')}
                className={`p-5 border cursor-pointer transition-all ${
                  meetingMode === 'showroom'
                    ? 'border-[#083338] bg-teal-50/50 ring-1 ring-[#083338]'
                    : 'border-stone-200 hover:border-teal-400 bg-white'
                }`}
              >
                <div className="w-10 h-10 bg-teal-50 text-[#083338] flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg text-[#083338]">Mumbai Workshop Showroom</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Private 45-minute personal appointment at Shree Laxmi Plaza, Andheri (West). Tactile viewing of certified loose gemstones, solitaires & gold.
                </p>
                <div className="mt-3 text-[11px] text-[#0d7480] font-medium flex items-center gap-1">
                  <span>Andheri (West), Mumbai Flagship Showroom</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setStage(2)}
                className="px-6 py-2.5 bg-[#083338] text-white border border-[#d4af37]/40 text-xs font-semibold uppercase tracking-wider hover:bg-[#0c444a] flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Continue to Slots</span>
                <ArrowRight className="w-4 h-4 text-[#d4af37]" />
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Select Date & Available Real Slot */}
        {stage === 2 && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700 uppercase tracking-wider">
                Select Available Slot (30m + 15m Buffer)
              </span>
              <span className="text-stone-500 font-mono">Timezone: Indian Standard Time (IST)</span>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs text-stone-500 mb-2 font-medium">Select Date (24-hour advance booking)</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {availableDates.map(d => (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d.date)}
                    className={`py-2 px-1 text-xs border text-center transition-colors cursor-pointer ${
                      selectedDate === d.date
                        ? 'border-[#083338] bg-[#083338] text-white font-semibold'
                        : 'border-stone-200 bg-white hover:bg-teal-50 text-stone-700'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-xs text-stone-500 mb-2 font-medium">Select Time Slot</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2.5 px-3 text-xs border text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      selectedSlot === slot
                        ? 'border-[#083338] bg-[#083338] text-white font-semibold'
                        : 'border-stone-200 bg-white hover:bg-teal-50 text-stone-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{slot} IST</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Consultant Selection */}
            <div className="p-3 bg-teal-50/50 border border-teal-100 text-xs">
              <span className="text-stone-500 block mb-1 font-medium">Assigned Consultation Specialist:</span>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#083338]">{assignedConsultant}</span>
                <span className="text-[11px] text-stone-500">Next Available Specialist</span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-between">
              <button
                onClick={() => setStage(1)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-black cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStage(3)}
                className="px-6 py-2.5 bg-[#083338] text-white border border-[#d4af37]/40 text-xs font-semibold uppercase tracking-wider hover:bg-[#0c444a] flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Enter Your Details</span>
                <ArrowRight className="w-4 h-4 text-[#d4af37]" />
              </button>
            </div>
          </div>
        )}

        {/* Stage 3: Enter Details & Attached Shortlist */}
        {stage === 3 && (
          <form onSubmit={handleConfirmBooking} className="p-6 space-y-4">
            <div className="p-3 bg-amber-50/70 border border-amber-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold text-amber-950">
                  {meetingMode === 'online' ? 'Online Video Session' : 'Mumbai Workshop Visit'}
                </span>
                <p className="text-stone-600">{selectedDate} at {selectedSlot} IST</p>
              </div>
              <button 
                type="button"
                onClick={() => setStage(2)}
                className="text-amber-900 underline text-xs cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Attached Designs Preview */}
            {attachedProducts.length > 0 && (
              <div className="border border-stone-200 p-3 bg-stone-50">
                <span className="text-xs font-semibold text-[#432032] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#7D4856]" />
                  <span>{attachedProducts.length} Shortlisted Designs Attached to this Appointment</span>
                </span>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {attachedProducts.map(p => (
                    <div key={p.id} className="p-1.5 bg-white border border-stone-200 text-[11px] shrink-0 w-44">
                      <p className="font-medium text-stone-800 line-clamp-1">{p.name}</p>
                      <p className="text-stone-500 font-mono text-[10px]">
                        {p.price ? `₹${p.price.toLocaleString('en-IN')}` : 'Price on Request'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Your Full Name *</label>
                <div className="flex items-center border border-stone-300 bg-white px-2.5 py-2">
                  <User className="w-3.5 h-3.5 text-stone-400 mr-2" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Radhika Sharma"
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Email Address (for calendar link) *</label>
                <div className="flex items-center border border-stone-300 bg-white px-2.5 py-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400 mr-2" />
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. radhika@example.com"
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Phone / WhatsApp *</label>
                <div className="flex items-center border border-stone-300 bg-white px-2.5 py-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400 mr-2" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +91 9821156861"
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Occasion / Specific Requirements</label>
                <input
                  type="text"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Bridal solitaire ring, 18k Yellow Gold"
                  className="w-full border border-stone-300 bg-white px-2.5 py-2 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStage(2)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-black cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#083338] text-white border border-[#d4af37]/40 text-xs font-semibold uppercase tracking-wider hover:bg-[#0c444a] cursor-pointer shadow-md"
              >
                Confirm Appointment & Reserve Slot
              </button>
            </div>
          </form>
        )}

        {/* Stage 4: Confirmed Receipt & Calendar Invite */}
        {stage === 4 && confirmedBooking && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-14 h-14 bg-teal-50 text-teal-800 rounded-full flex items-center justify-center mx-auto border border-teal-200">
              <CheckCircle2 className="w-8 h-8 text-[#0d7480]" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Booking Reference: {confirmedBooking.id}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#083338] mt-1">
                Your Appointment is Confirmed
              </h3>
              <p className="text-xs text-stone-600 mt-2 max-w-md mx-auto">
                A confirmation invite and calendar details have been dispatched to <strong>{confirmedBooking.customerEmail}</strong>. For queries or rescheduling, email <a href="mailto:contact.elitedesignerjewelry@gmail.com" className="text-[#083338] underline font-medium">contact.elitedesignerjewelry@gmail.com</a>.
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 text-xs text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Consultant:</span>
                <span className="font-semibold text-stone-800">{confirmedBooking.consultantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date & Slot:</span>
                <span className="font-medium text-stone-800">{confirmedBooking.date} at {confirmedBooking.timeSlot} ({confirmedBooking.timezone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Mode:</span>
                <span className="font-medium text-stone-800">
                  {confirmedBooking.mode === 'online' ? 'Google Meet Video Session' : 'Mumbai Workshop Showroom'}
                </span>
              </div>
              {confirmedBooking.meetingLink && (
                <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                  <span className="text-stone-500">Private Video Room:</span>
                  <a 
                    href={confirmedBooking.meetingLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#432032] underline font-semibold flex items-center gap-1"
                  >
                    <span>Open Meet Room</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <button
                onClick={downloadCalendarInvite}
                className="px-5 py-2.5 bg-stone-900 text-white text-xs font-medium uppercase tracking-wider hover:bg-black flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-stone-300 text-stone-700 text-xs font-medium uppercase tracking-wider hover:bg-stone-50 cursor-pointer"
              >
                Return to Store
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
