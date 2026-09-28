import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Calendar, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';
import { Product, CartItem, ShortlistItem } from '../types';
import { EliteLogo } from './EliteLogo';

interface HeaderProps {
  onOpenConsultation: () => void;
  onOpenShortlist: () => void;
  onOpenCart: () => void;
  onOpenStory: () => void;
  onOpenCare: () => void;
  onOpenRingGuide: () => void;
  onSelectCategory: (category: string) => void;
  cartItems: CartItem[];
  shortlist: ShortlistItem[];
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenConsultation,
  onOpenShortlist,
  onOpenCart,
  onOpenStory,
  onOpenCare,
  onOpenRingGuide,
  onSelectCategory,
  cartItems,
  shortlist,
  onSearchChange,
  searchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Top micro reassurance banner */}
      <aside aria-label="Announcement" className="bg-[#042326] text-amber-100/95 text-xs py-1.5 px-4 text-center font-medium tracking-wider flex items-center justify-center gap-4 border-b border-[#d4af37]/20 shadow-xs">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Complimentary Insured Courier Transit Across India · BIS Hallmarked 750 / 916</span>
        </span>
        <span className="hidden md:inline text-amber-300/40">|</span>
        <button 
          onClick={onOpenConsultation}
          className="hidden md:inline text-[#d4af37] hover:text-white underline underline-offset-2 transition-colors cursor-pointer font-serif"
        >
          Book Studio Consultation · Mumbai Showroom & HD Video
        </button>
      </aside>

      {/* Main Top Bar strictly obeying Top Bar Contract: [Brand title] — [Nav links] — [Primary actions] */}
      <header className="sticky top-0 z-40 bg-[#FAFCFB]/95 backdrop-blur-md border-b border-teal-900/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Mobile menu button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1A2826] hover:text-[#083338] focus-visible:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#1A2826] hover:text-[#083338]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Zone 1: Company Logo & Brand Identity */}
          <div className="flex items-center">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onSelectCategory('all'); }}
              className="group flex items-center gap-2.5 sm:gap-3 text-left"
              title="Elite Designer Jewelry · Fine Diamond Jewelry"
            >
              <EliteLogo size="md" variant="dark" className="shrink-0" />
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-[#083338] group-hover:text-[#0d7480] transition-colors leading-tight">
                  Elite Designer Jewelry
                </span>
                <span className="block text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-sans text-[#b88e36] font-semibold mt-0.5">
                  Fine Diamond Jewelry
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-wider uppercase font-medium text-[#1A2826]/80">
            <button
              onClick={() => onSelectCategory('all')}
              className="hover:text-[#083338] transition-colors py-1 hover:border-b-2 hover:border-[#083338] cursor-pointer"
            >
              Shop Designs
            </button>
            <button
              onClick={() => onSelectCategory('mangalsutras')}
              className="hover:text-[#083338] transition-colors py-1 hover:border-b-2 hover:border-[#083338] cursor-pointer"
            >
              Mangalsutras
            </button>
            <button
              onClick={() => onSelectCategory('rings')}
              className="hover:text-[#083338] transition-colors py-1 hover:border-b-2 hover:border-[#083338] cursor-pointer"
            >
              Solitaires & Rings
            </button>
            <button
              onClick={onOpenStory}
              className="hover:text-[#083338] transition-colors py-1 hover:border-b-2 hover:border-[#083338] cursor-pointer"
            >
              Our Story
            </button>
            <button
              onClick={onOpenConsultation}
              className="hover:text-[#083338] transition-colors py-1 hover:border-b-2 hover:border-[#083338] cursor-pointer"
            >
              Consultations
            </button>
            <button
              onClick={onOpenRingGuide}
              className="hover:text-[#083338] transition-colors py-1 hover:border-b-2 hover:border-[#083338] cursor-pointer text-[#0d7480]"
            >
              Size Guide
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search Toggle */}
            <div className="relative hidden md:block">
              {searchOpen ? (
                <div className="flex items-center bg-white border border-[#083338] rounded-none px-3 py-1.5 shadow-sm">
                  <Search className="w-4 h-4 text-[#0d7480] mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search diamonds, SKU, emerald..."
                    className="w-48 lg:w-60 text-xs bg-transparent focus:outline-none text-[#1A2826]"
                    autoFocus
                  />
                  <button 
                    onClick={() => { setSearchOpen(false); onSearchChange(''); }}
                    className="text-xs text-stone-400 hover:text-stone-700 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 text-[#1A2826] hover:text-[#083338] rounded-md hover:bg-teal-50 transition-colors"
                  aria-label="Search catalog"
                  title="Search catalog"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Saved Designs / Shortlist with Notification Badge */}
            <button
              onClick={onOpenShortlist}
              className="relative p-2.5 text-[#1A2826] hover:text-[#083338] rounded-md hover:bg-teal-50 transition-colors cursor-pointer"
              aria-label={`Saved designs shortlist (${shortlist.length} items)`}
              title={`Saved designs shortlist (${shortlist.length} items)`}
            >
              <Heart className={`w-5 h-5 ${shortlist.length > 0 ? 'text-[#0d7480] fill-[#0d7480]/20' : ''}`} />
              {shortlist.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#083338] text-[#f5ecc7] text-[10px] font-bold flex items-center justify-center tabular-nums ring-2 ring-white shadow-xs animate-in zoom-in-50 duration-200">
                  {shortlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-[#1A2826] hover:text-[#083338] rounded-md hover:bg-teal-50 transition-colors cursor-pointer"
              aria-label="Shopping bag"
              title="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#c59b27] text-white text-[10px] font-bold flex items-center justify-center tabular-nums ring-2 ring-white shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Book Appointment CTA */}
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white bg-[#083338] hover:bg-[#0c444a] border border-[#d4af37]/40 transition-colors rounded-none cursor-pointer shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Mobile search bar if open */}
        {searchOpen && (
          <div className="md:hidden px-4 py-2.5 bg-teal-50/50 border-t border-teal-100 flex items-center">
            <Search className="w-4 h-4 text-teal-800 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search design, SKU, metal or gemstone..."
              className="w-full text-xs bg-transparent focus:outline-none text-[#1A2826]"
              autoFocus
            />
            <button 
              onClick={() => { setSearchOpen(false); onSearchChange(''); }}
              className="p-1 text-stone-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mobile drawer navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAFCFB] border-t border-teal-100 px-6 py-6 space-y-4 shadow-xl">
            <div className="space-y-3 pb-4 border-b border-teal-100">
              <p className="text-xs uppercase tracking-widest text-[#0d7480] font-semibold">Collections & Categories</p>
              <button
                onClick={() => { onSelectCategory('all'); setMobileMenuOpen(false); }}
                className="block text-left w-full py-1.5 text-sm font-medium text-[#1A2826] hover:text-[#083338]"
              >
                All Fine Jewelry
              </button>
              <button
                onClick={() => { onSelectCategory('rings'); setMobileMenuOpen(false); }}
                className="block text-left w-full py-1.5 text-sm font-medium text-[#1A2826] hover:text-[#083338]"
              >
                Solitaires & Rings
              </button>
              <button
                onClick={() => { onSelectCategory('mangalsutras'); setMobileMenuOpen(false); }}
                className="block text-left w-full py-1.5 text-sm font-medium text-[#1A2826] hover:text-[#083338]"
              >
                Mangalsutras
              </button>
              <button
                onClick={() => { onSelectCategory('pendant-sets'); setMobileMenuOpen(false); }}
                className="block text-left w-full py-1.5 text-sm font-medium text-[#1A2826] hover:text-[#083338]"
              >
                Pendant Sets (3-Piece)
              </button>
              <button
                onClick={() => { onSelectCategory('earrings'); setMobileMenuOpen(false); }}
                className="block text-left w-full py-1.5 text-sm font-medium text-[#1A2826] hover:text-[#083338]"
              >
                Earrings & Chandeliers
              </button>
              <button
                onClick={() => { onSelectCategory('necklaces'); setMobileMenuOpen(false); }}
                className="block text-left w-full py-1.5 text-sm font-medium text-[#1A2826] hover:text-[#083338]"
              >
                Necklaces & Chokers
              </button>
              <button
                onClick={() => { onSelectCategory('bracelets'); setMobileMenuOpen(false); }}
                className="block text-left w-full py-1.5 text-sm font-medium text-[#1A2826] hover:text-[#083338]"
              >
                Bracelets & Cuffs
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => { onOpenShortlist(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 border border-teal-200 text-xs font-medium text-[#083338] flex items-center justify-center gap-1.5 hover:bg-teal-50"
              >
                <Heart className="w-4 h-4 text-[#0d7480]" />
                <span>Saved Creations / Shortlist</span>
                {shortlist.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#083338] text-[#f5ecc7] text-[10px] font-bold rounded-full">
                    {shortlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => { onOpenConsultation(); setMobileMenuOpen(false); }}
                className="w-full text-center py-3 bg-[#083338] text-white text-xs font-semibold uppercase tracking-wider border border-[#d4af37]/40 shadow-sm"
              >
                Book Studio Consultation
              </button>
              <div className="flex gap-4 pt-2 text-xs text-stone-600 justify-center">
                <button onClick={() => { onOpenStory(); setMobileMenuOpen(false); }}>Our Story</button>
                <span>·</span>
                <button onClick={() => { onOpenRingGuide(); setMobileMenuOpen(false); }}>Ring Sizer</button>
                <span>·</span>
                <button onClick={() => { onOpenCare(); setMobileMenuOpen(false); }}>Jewelry Care</button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

