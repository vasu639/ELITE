import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, X, Sparkles, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import { authenticateStaff, StaffSession } from '../services/staffAuth';
import { EliteLogo } from './EliteLogo';

interface StaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: StaffSession) => void;
}

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = authenticateStaff(email, password);
      setLoading(false);
      if (res.success && res.session) {
        onSuccess(res.session);
        onClose();
      } else {
        setError(res.error || 'Authentication failed. Please verify your credentials.');
      }
    }, 350);
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#FFFDFB] border border-teal-900/30 shadow-2xl text-[#282329] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative top bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#042326] via-[#083338] to-[#d4af37]" />

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3.5">
              <EliteLogo size="md" variant="dark" className="shrink-0 mt-1" />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-[#0d7480] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0d7480]" />
                  <span>Atelier Staff Authentication</span>
                </div>
                <h2 className="font-serif text-2xl text-[#083338] font-normal">
                  Staff Workspace Access
                </h2>
                <p className="text-xs text-stone-500">
                  Sign in with authorized atelier credentials to manage jewelry collections, consultations, quotations, and QC tracking.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-sm hover:bg-stone-100 transition-colors cursor-pointer"
              title="Return to boutique"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                Staff Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jigna@elitedesignerjewelry.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-stone-300 focus:border-[#083338] focus:ring-1 focus:ring-[#083338] outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                  Staff Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter staff security password"
                  className="w-full text-xs pl-9 pr-10 py-2.5 bg-white border border-stone-300 focus:border-[#083338] focus:ring-1 focus:ring-[#083338] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-400 hover:text-stone-700 absolute right-3 top-3 p-0.5 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#083338] hover:bg-[#0c444a] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 border border-[#d4af37]/30"
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-[#d4af37]" />
                  <span>Authenticate & Open Workspace</span>
                </>
              )}
            </button>
          </form>

          {/* Authorized Atelier Credentials Helper */}
          <div className="pt-4 border-t border-stone-200 space-y-2">
            <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
              Atelier Staff Sign-In Shortcuts:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              <button
                type="button"
                onClick={() => handleQuickFill('jigna@elitedesignerjewelry.com', 'Atelier2026!')}
                className="p-2 border border-stone-200 hover:border-[#083338] hover:bg-teal-50/50 text-left transition-colors cursor-pointer"
              >
                <div className="font-semibold text-xs text-[#083338]">Jigna Khakhar</div>
                <div className="text-[10px] text-stone-500">Owner & Principal Jeweler</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('manager@elitedesignerjewelry.com', 'Diamond2026!')}
                className="p-2 border border-stone-200 hover:border-[#083338] hover:bg-teal-50/50 text-left transition-colors cursor-pointer"
              >
                <div className="font-semibold text-xs text-[#083338]">Pooja Shah</div>
                <div className="text-[10px] text-stone-500">Atelier Operations Manager</div>
              </button>
            </div>
            <div className="text-[10px] text-stone-400 text-center pt-1">
              Tip: Press <kbd className="px-1 py-0.5 bg-stone-100 border border-stone-300 rounded text-[9px] font-mono">Alt + S</kbd> anytime to open this staff gate.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
