import React from 'react';
import { ArrowRight, Calendar, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { Product } from '../types';
import { JewelryVisual } from './JewelryVisual';

interface HeroSectionProps {
  heroProduct?: Product | null;
  onExploreDesigns: () => void;
  onBookConsultation: () => void;
  onViewProduct: (product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroProduct,
  onExploreDesigns,
  onBookConsultation,
  onViewProduct,
}) => {
  return (
    <section className="relative bg-[#042326] text-[#FFFDFB] overflow-hidden border-b border-[#083338]">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(13,116,128,0.25),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.08),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Vision & Direct CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            {/* Quiet metadata line */}
            <div className="flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase text-[#d4af37] font-medium">
              <span>Haute Joaillerie Atelier</span>
              <span aria-hidden="true">·</span>
              <span>Mumbai Flagship</span>
              <span aria-hidden="true">·</span>
              <span>BIS 750 / 916 Assayed</span>
            </div>

            {/* Display Headline with balanced wrapping */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.12] text-balance">
              Where Royal Heritage Meets Pure Architectural Modernity.
            </h1>

            {/* Subtitle prose */}
            <p className="font-sans text-sm sm:text-base text-teal-100/90 max-w-xl leading-relaxed font-light">
              Crafted under the exacting direction of founder <strong>Jigna Khakhar</strong>. Discover certified conflict-free natural solitaires, modern bridal mangalsutras, and bespoke suites crafted in solid 18k and 22k gold.
            </p>

            {/* Two Primary Action Routes per PDF Specification */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreDesigns}
                className="px-6 py-3.5 bg-[#d4af37] text-[#042326] hover:bg-[#e0c35c] text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Shop Catalog Designs</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onBookConsultation}
                className="px-6 py-3.5 border border-[#d4af37]/40 text-[#f5ecc7] hover:bg-white/10 text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer backdrop-blur-xs"
              >
                <Calendar className="w-4 h-4 text-[#d4af37]" />
                <span>Book Atelier Consultation</span>
              </button>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-[11px] text-teal-100/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>100% Certified Natural Diamonds</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>GIA & IGI Verified Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Complimentary Insured Transit</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Piece or Atelier Holding Showcase (5 cols) */}
          <div className="lg:col-span-5 z-10">
            {heroProduct ? (
              <div 
                onClick={() => onViewProduct(heroProduct)}
                className="relative group cursor-pointer border border-[#d4af37]/30 bg-black/40 p-3 shadow-2xl backdrop-blur-xs transition-transform duration-500 hover:scale-[1.01]"
              >
                <div className="overflow-hidden">
                  <JewelryVisual 
                    product={heroProduct} 
                    aspectRatio="square" 
                    className="w-full"
                  />
                </div>

                {/* Showcase Caption */}
                <div className="p-4 bg-[#031d20] text-white flex items-center justify-between border-t border-[#d4af37]/20">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-mono">
                      Featured Masterpiece · {heroProduct.collection}
                    </span>
                    <h3 className="font-serif text-lg font-medium text-white group-hover:text-[#d4af37] transition-colors">
                      {heroProduct.name}
                    </h3>
                    <p className="font-mono text-xs text-stone-300 font-semibold mt-0.5">
                      {heroProduct.price ? `₹${heroProduct.price.toLocaleString('en-IN')} (Incl. 3% GST)` : 'Price on Request'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs uppercase tracking-wider text-[#d4af37] font-medium underline flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-[#d4af37]/30 bg-black/50 p-6 sm:p-8 backdrop-blur-md text-left space-y-5 shadow-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-mono">
                    Private Atelier · Jigna Khakhar
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-white font-normal">
                  Bespoke High Jewelry Atelier
                </h3>

                <p className="text-xs text-teal-100/80 leading-relaxed font-light">
                  Founder and master jeweler Jigna Khakhar crafts individual solitaires, certified natural diamonds, and heirloom mangalsutras at our Mumbai atelier. Reserve an appointment for custom bespoke design.
                </p>

                <div className="pt-2 space-y-2.5">
                  <button
                    onClick={onBookConsultation}
                    className="w-full py-3 bg-[#d4af37] hover:bg-[#e0c35c] text-[#042326] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Private Consultation</span>
                  </button>
                  <button
                    onClick={onExploreDesigns}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Seven Signature Categories</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
