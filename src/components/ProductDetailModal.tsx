import React, { useState } from 'react';
import { 
  X, Heart, ShieldCheck, Truck, Sparkles, Scale, Award, 
  HelpCircle, CheckCircle2, Calendar, ShoppingBag, MessageSquare, ChevronRight, Share2 
} from 'lucide-react';
import { Product, MetalType, CartItem } from '../types';
import { JewelryVisual } from './JewelryVisual';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  isShortlisted: boolean;
  onToggleShortlist: (product: Product, note?: string) => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onOpenConsultationWithProduct: (product: Product) => void;
  onOpenQuoteEnquiry: (product: Product) => void;
  onOpenRingGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isShortlisted,
  onToggleShortlist,
  onAddToCart,
  onOpenConsultationWithProduct,
  onOpenQuoteEnquiry,
  onOpenRingGuide,
}) => {
  const [selectedMetal, setSelectedMetal] = useState<MetalType>(product.metal);
  const [selectedRingSize, setSelectedRingSize] = useState<number | undefined>(
    product.ringSizes ? product.ringSizes[0] : undefined
  );
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
  const [selectedAngle, setSelectedAngle] = useState(0);
  const [customNote, setCustomNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setDeliveryStatus('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    // Realistic Indian pin delivery estimate
    const metroPins = ['400', '110', '560', '700', '600', '500', '380', '411'];
    const isMetro = metroPins.some(prefix => pincode.startsWith(prefix));
    const transitDays = isMetro ? '2 business days' : '3-4 business days';
    
    if (product.salesMode === 'ready-to-buy') {
      setDeliveryStatus(`Serviceable by Insured Courier. Dispatch within 24h · Delivery in ${transitDays}.`);
    } else if (product.salesMode === 'made-to-order') {
      setDeliveryStatus(`Serviceable. Workshop crafting time ${product.leadTimeDays} days + ${transitDays} insured transit.`);
    } else {
      setDeliveryStatus(`Consultation & delivery available nationwide. Private consultation recommended.`);
    }
  };

  const handlePrimaryBuy = () => {
    if (product.salesMode === 'price-on-request' || product.price === null) {
      onOpenQuoteEnquiry(product);
      return;
    }

    onAddToCart({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      category: product.category,
      salesMode: product.salesMode,
      selectedSize: selectedRingSize,
      selectedMetal: selectedMetal,
      price: product.price,
      leadTimeDays: product.leadTimeDays,
      quantity: 1,
      setInclusions: product.setInclusions,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-[#FFFDFB] text-[#282329] shadow-2xl overflow-hidden flex flex-col my-auto border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top bar with quick close */}
        <div className="px-6 py-3 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
            <span>SKU: {product.sku}</span>
            <span>·</span>
            <span className="text-[#432032] font-semibold">{product.collection}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="Share Design Link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Two-Column Contiguous Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Visual Gallery (5 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 bg-[#181116] flex flex-col justify-between">
            <div className="relative">
              <JewelryVisual 
                product={product} 
                aspectRatio="square" 
                className="w-full shadow-2xl border border-white/10"
              />

              {/* Lab Certification Stamp */}
              <div className="mt-4 p-3 bg-stone-900/90 border border-amber-400/20 text-stone-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-300 shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-100">{product.certification.lab} Certified Authentic</p>
                    <p className="text-[11px] text-stone-400">Report #{product.certification.reportNumber}</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  Verifiable
                </span>
              </div>
            </div>

            {/* Hallmarking Reassurance Note */}
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-stone-400 space-y-1">
              <p className="flex items-center gap-1.5 text-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{product.hallmarkRecord} — Assayed and verified in India</span>
              </p>
              <p>Natural, conflict-free Kimberley Process diamonds and documented origin gemstones.</p>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase & Specification Module (7 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white overflow-y-auto">
            
            {/* Header Identity */}
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#c59b27] font-semibold mb-1">
                <span>{product.category}</span>
                <span>·</span>
                <span>Fine Diamond Jewelry</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#083338] leading-tight">
                {product.name}
              </h2>

              {/* Price & Status Display */}
              <div className="mt-3 flex items-baseline gap-3 flex-wrap">
                {product.price !== null ? (
                  <>
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-[#083338] tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-500 font-sans">
                      Includes 3% GST & Insured National Delivery
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-2xl text-[#c59b27] font-semibold">
                      Price on Request
                    </span>
                    <span className="text-xs text-stone-500 font-sans">
                      (Bespoke High Jewelry)
                    </span>
                  </div>
                )}
              </div>

              {/* Direct Language Status Pill */}
              <div className="mt-2 flex items-center gap-2">
                {product.salesMode === 'ready-to-buy' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Ready to Buy · In Stock ({product.stockQuantity} available)
                  </span>
                )}
                {product.salesMode === 'made-to-order' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 border border-teal-200">
                    <Sparkles className="w-3 h-3 text-[#c59b27]" />
                    Made to Order · Workshop Lead Time {product.leadTimeDays} Days
                  </span>
                )}
                {product.salesMode === 'price-on-request' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#083338] bg-teal-50 px-2 py-0.5 border border-[#d4af37]/40">
                    <MessageSquare className="w-3 h-3 text-[#0d7480]" />
                    Bespoke · Consultation & Quotation Route
                  </span>
                )}
              </div>
            </div>

            {/* Set Inclusions Callout for Pendant Sets per PDF Page 6 */}
            {product.category === 'pendant-sets' && product.setInclusions && (
              <div className="p-3 bg-stone-50 border border-stone-200 text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#432032] block mb-1">
                  Explicit Set Inclusions
                </span>
                <p className="text-stone-700 leading-relaxed">{product.setInclusions}</p>
              </div>
            )}

            {/* Mangalsutra Specifications per PDF Page 5 */}
            {product.category === 'mangalsutras' && (
              <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 border border-stone-200">
                <div>
                  <span className="text-stone-500 uppercase tracking-wider text-[10px] block">Chain Length</span>
                  <span className="font-medium text-[#282329]">{product.mangalsutraLengthInches} inches ({product.mangalsutraLengthCm} cm)</span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase tracking-wider text-[10px] block">Strand Structure</span>
                  <span className="font-medium text-[#282329]">{product.mangalsutraStrandCount}</span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase tracking-wider text-[10px] block">Pendant Design</span>
                  <span className="font-medium text-[#282329]">{product.mangalsutraPendantStyle}</span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase tracking-wider text-[10px] block">Occasion</span>
                  <span className="font-medium text-[#282329]">{product.mangalsutraOccasion}</span>
                </div>
              </div>
            )}

            {/* Ring Size Selector if Ring */}
            {product.category === 'rings' && product.ringSizes && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#432032]">
                    Select Indian Ring Size
                  </label>
                  <button
                    onClick={onOpenRingGuide}
                    className="text-xs text-[#7D4856] underline cursor-pointer hover:text-[#432032]"
                  >
                    Ring Sizing Chart & Caliper Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.ringSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedRingSize(size)}
                      className={`w-10 h-10 text-xs font-mono font-medium border transition-colors cursor-pointer ${
                        selectedRingSize === size
                          ? 'border-[#432032] bg-[#432032] text-white'
                          : 'border-stone-300 bg-white text-stone-800 hover:border-stone-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Precious Metal Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#432032] mb-1.5">
                Metal Choice
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {(['18K Yellow Gold', '18K Rose Gold', '18K White Gold', 'Platinum 950'] as MetalType[]).map((met) => (
                  <button
                    key={met}
                    onClick={() => setSelectedMetal(met)}
                    className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                      selectedMetal === met
                        ? 'border-[#432032] bg-[#432032] text-white font-medium'
                        : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {met}
                  </button>
                ))}
              </div>
            </div>

            {/* Natural Stones & Weight Disclosure Matrix */}
            <div className="border border-teal-100 divide-y divide-teal-50 text-xs">
              <div className="p-2.5 bg-teal-50/60 font-semibold uppercase tracking-wider text-[11px] text-[#083338] flex items-center justify-between">
                <span>Certified Material & Design Specifications</span>
                <span className="text-[#c59b27] font-mono text-[10px]">{product.certification.lab} CERTIFIED</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-stone-500">Precious Metal Purity</span>
                <span className="font-mono text-[#083338] font-medium">{product.purity || product.metal}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-stone-500">Net Metal Weight (Gold/Pt)</span>
                <span className="font-mono text-[#083338] font-medium">{product.netMetalWeightGrams} g (±0.2g tolerance)</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-stone-500">Gross Weight</span>
                <span className="font-mono text-stone-700">{product.grossWeightGrams} g</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-stone-500">BIS Hallmark & HUID</span>
                <span className="text-[#083338] font-medium font-mono">{product.hallmarkRecord} {product.huidCode ? `· HUID: ${product.huidCode}` : ''}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-stone-500">Center Gemstone / Diamond</span>
                <span className="text-[#083338] font-medium">{product.naturalStones.centerStone || product.naturalStones.species}</span>
              </div>
              {product.diamondDetails?.cut && (
                <div className="p-2.5 flex justify-between bg-teal-50/30">
                  <span className="text-stone-500">Diamond 4Cs Grading</span>
                  <span className="font-mono text-[#083338] font-medium">
                    {product.diamondDetails.cut} · Color {product.diamondDetails.color || 'F'} · Clarity {product.diamondDetails.clarity || 'VVS1'} · {product.diamondDetails.carat || product.naturalStones.totalCaratWeight} ct
                  </span>
                </div>
              )}
              {product.accentStonesDetails && (
                <div className="p-2.5 flex justify-between">
                  <span className="text-stone-500">Accent / Micro-Set Diamonds</span>
                  <span className="text-stone-800">{product.accentStonesDetails}</span>
                </div>
              )}
              {product.settingType && (
                <div className="p-2.5 flex justify-between">
                  <span className="text-stone-500">Setting Architecture</span>
                  <span className="text-stone-800">{product.settingType}</span>
                </div>
              )}
              {product.makingCharges && (
                <div className="p-2.5 flex justify-between">
                  <span className="text-stone-500">Making Charges</span>
                  <span className="text-stone-700 font-mono">{product.makingCharges}</span>
                </div>
              )}
              <div className="p-2.5 flex justify-between">
                <span className="text-stone-500">Total Gem Carat Weight</span>
                <span className="font-mono text-[#083338] font-medium">{product.naturalStones.totalCaratWeight} ct tw</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-stone-500">Certification Report No.</span>
                <span className="font-mono text-stone-800 font-medium">{product.certification.reportNumber} ({product.certification.lab})</span>
              </div>
            </div>

            {/* Delivery Serviceability & PIN Code Checker */}
            <div className="p-3 bg-teal-50/40 border border-teal-100">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#083338] mb-1.5">
                <Truck className="w-3.5 h-3.5 text-[#0d7480]" />
                <span>Delivery & Insured Transit Check</span>
              </div>
              <form onSubmit={checkPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit India PIN (e.g. 400053)"
                  className="flex-1 p-2 text-xs border border-teal-200 bg-white focus:outline-none focus:border-[#083338]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#083338] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#0c444a] cursor-pointer"
                >
                  Verify
                </button>
              </form>
              {deliveryStatus && (
                <p className="mt-2 text-xs text-stone-700 bg-white p-2 border border-teal-100">
                  {deliveryStatus}
                </p>
              )}
            </div>

            {/* Custom Consultation Notes on Shortlist */}
            {isShortlisted && (
              <div className="p-3 bg-amber-50/60 border border-[#d4af37]/40 text-xs">
                <span className="font-semibold text-amber-900 block mb-1">
                  Private Consultation Note for Studio Specialists
                </span>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => {
                    setCustomNote(e.target.value);
                    onToggleShortlist(product, e.target.value);
                  }}
                  placeholder="e.g. Prefer in 18k Yellow Gold, need 18-inch chain, custom engraving..."
                  className="w-full p-2 text-xs border border-[#d4af37]/50 bg-white focus:outline-none"
                />
              </div>
            )}

            {/* Action Buttons Hub */}
            <div className="space-y-2 pt-2">
              {/* Primary Action Button */}
              {product.salesMode === 'price-on-request' ? (
                <button
                  onClick={() => onOpenQuoteEnquiry(product)}
                  className="w-full py-3.5 bg-[#083338] text-white border border-[#d4af37]/40 text-xs font-semibold uppercase tracking-widest hover:bg-[#0c444a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <MessageSquare className="w-4 h-4 text-[#d4af37]" />
                  <span>Request Bespoke Quotation</span>
                </button>
              ) : (
                <button
                  onClick={handlePrimaryBuy}
                  className="w-full py-3.5 bg-[#083338] text-white border border-[#d4af37]/40 text-xs font-semibold uppercase tracking-widest hover:bg-[#0c444a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                  <span>
                    {product.salesMode === 'ready-to-buy' ? 'Add to Shopping Bag' : 'Order Made-to-Order Piece'}
                  </span>
                </button>
              )}

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onToggleShortlist(product)}
                  className={`py-2.5 px-3 border text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isShortlisted
                      ? 'border-[#083338] bg-teal-50 text-[#083338] font-semibold'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-current text-[#0d7480]' : ''}`} />
                  <span>{isShortlisted ? 'Saved in Shortlist' : 'Save for Consultation'}</span>
                </button>

                <button
                  onClick={() => onOpenConsultationWithProduct(product)}
                  className="py-2.5 px-3 border border-stone-300 bg-white text-[#1A2826] hover:bg-teal-50 hover:border-teal-400 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#0d7480]" />
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>

            {/* Curated Story quote */}
            <div className="pt-2 text-xs italic text-stone-500 border-t border-stone-100">
              &ldquo;{product.story}&rdquo;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
