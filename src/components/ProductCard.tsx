import React from 'react';
import { Heart, ArrowUpRight, Clock, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { JewelryVisual } from './JewelryVisual';

interface ProductCardProps {
  product: Product;
  isShortlisted: boolean;
  onToggleShortlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickEnquire?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isShortlisted,
  onToggleShortlist,
  onSelectProduct,
  onQuickEnquire,
}) => {
  const formatPrice = (price: number | null) => {
    if (price === null) {
      return (
        <span className="text-[#c59b27] font-semibold tracking-wide">
          Price on Request
        </span>
      );
    }
    return (
      <span className="font-mono tabular-nums text-[#083338] font-bold">
        ₹{price.toLocaleString('en-IN')}
      </span>
    );
  };

  return (
    <article className="group flex flex-col bg-white border border-teal-900/10 transition-all duration-300 hover:shadow-xl hover:border-teal-600/30 text-left">
      {/* Product Image Slot (65%-75% visual focus) */}
      <div className="relative overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
        <JewelryVisual 
          product={product} 
          aspectRatio="square" 
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />

        {/* Shortlist Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleShortlist(product);
          }}
          className={`absolute top-3 right-3 z-20 p-2.5 rounded-full transition-all duration-200 cursor-pointer ${
            isShortlisted 
              ? 'bg-[#083338] text-[#f5ecc7] border border-[#d4af37]/50 shadow-md' 
              : 'bg-black/35 backdrop-blur-md text-white/90 hover:bg-[#083338] hover:text-[#f5ecc7]'
          }`}
          aria-label={isShortlisted ? 'Remove from shortlist' : 'Save for consultation'}
          title={isShortlisted ? 'In consultation shortlist' : 'Save for consultation'}
        >
          <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Sales Mode & Availability Quick Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          {product.salesMode === 'ready-to-buy' && (
            <span className="text-[10px] tracking-wider uppercase font-medium bg-[#042326]/90 text-teal-200 px-2 py-0.5 backdrop-blur-xs border border-teal-500/30">
              Ready to Buy · In Stock
            </span>
          )}
          {product.salesMode === 'made-to-order' && (
            <span className="text-[10px] tracking-wider uppercase font-medium bg-[#042326]/90 text-[#f5ecc7] px-2 py-0.5 backdrop-blur-xs border border-[#d4af37]/30">
              Made to Order · {product.leadTimeDays}d
            </span>
          )}
          {product.salesMode === 'price-on-request' && (
            <span className="text-[10px] tracking-wider uppercase font-medium bg-[#083338]/90 text-[#f5ecc7] px-2 py-0.5 backdrop-blur-xs border border-[#d4af37]/40">
              Bespoke · Price on Request
            </span>
          )}
        </div>
      </div>

      {/* Card Content & Clean Unboxed Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line with typographic separators */}
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-teal-800/70 font-sans mb-1.5">
            <span>{product.metal}</span>
            <span aria-hidden="true">·</span>
            <span>{product.collection}</span>
            <span aria-hidden="true">·</span>
            <span>{product.certification.lab}</span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-serif text-base font-normal text-[#1A2826] group-hover:text-[#083338] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Specific Highlights (Mangalsutra length or Set inclusions or Diamond specs) */}
          <p className="text-xs text-stone-500 mt-1 line-clamp-1">
            {product.category === 'mangalsutras' && (
              <span>{product.mangalsutraLengthInches}&quot; Chain ({product.mangalsutraLengthCm} cm) · {product.mangalsutraStrandCount}</span>
            )}
            {product.category === 'pendant-sets' && (
              <span>{product.setInclusions?.split('.')[0] || 'Complete 3-Piece Suite'}</span>
            )}
            {product.category === 'rings' && (
              <span>{product.naturalStones.centerStone || `${product.ringBandWidthMm}mm Band`}</span>
            )}
            {product.category !== 'mangalsutras' && product.category !== 'pendant-sets' && product.category !== 'rings' && (
              <span>{product.naturalStones.centerStone || product.naturalStones.species}</span>
            )}
          </p>
        </div>

        {/* Price & Primary Action Baseline */}
        <div className="pt-4 mt-3 border-t border-teal-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-stone-400">
              {product.price ? 'Price (Incl. 3% GST)' : 'Bespoke Quote'}
            </span>
            <div className="text-sm">
              {formatPrice(product.price)}
            </div>
          </div>

          <button
            onClick={() => onSelectProduct(product)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#083338] hover:text-[#0d7480] group-hover:translate-x-0.5 transition-all cursor-pointer py-1"
          >
            <span>{product.salesMode === 'price-on-request' ? 'Request Quote' : 'View Design'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#c59b27]" />
          </button>
        </div>
      </div>
    </article>
  );
};
