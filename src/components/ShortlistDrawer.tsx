import React, { useState } from 'react';
import { X, Heart, Trash2, Calendar, Share2, ArrowRight, MessageSquare } from 'lucide-react';
import { ShortlistItem, Product } from '../types';
import { JEWELRY_CATALOG } from '../data/jewelryCatalog';
import { JewelryVisual } from './JewelryVisual';

interface ShortlistDrawerProps {
  shortlist: ShortlistItem[];
  products?: Product[];
  onClose: () => void;
  onRemoveItem: (productId: string) => void;
  onUpdateNotes: (productId: string, notes: string) => void;
  onBookWithShortlist: () => void;
  onViewProduct: (product: Product) => void;
}

export const ShortlistDrawer: React.FC<ShortlistDrawerProps> = ({
  shortlist,
  products = [],
  onClose,
  onRemoveItem,
  onUpdateNotes,
  onBookWithShortlist,
  onViewProduct,
}) => {
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const populatedItems = shortlist.map(item => ({
    shortlistMeta: item,
    product: products.find(p => p.id === item.productId) || JEWELRY_CATALOG.find(p => p.id === item.productId),
  })).filter(i => i.product !== undefined) as { shortlistMeta: ShortlistItem; product: Product }[];

  const handleShareShortlist = () => {
    const token = Math.random().toString(36).substring(2, 10);
    const dummyShareUrl = `${window.location.origin}/shortlist?token=${token}&expires=14d`;
    navigator.clipboard.writeText(dummyShareUrl);
    setShareLinkCopied(true);
    setTimeout(() => setShareLinkCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-[#FFFDFB] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-stone-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#7D4856] fill-current" />
            <div>
              <h3 className="font-serif text-lg text-[#432032]">Consultation Shortlist</h3>
              <p className="text-[11px] text-stone-500 font-sans">
                {populatedItems.length} {populatedItems.length === 1 ? 'curated design' : 'curated designs'} saved locally
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {populatedItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 stroke-1" />
              </div>
              <p className="font-serif text-lg text-stone-700">Your shortlist is empty</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Tap the heart on any diamond ring, mangalsutra or suite to save it for your private consultation with Jigna Khakhar.
              </p>
            </div>
          ) : (
            populatedItems.map(({ shortlistMeta, product }) => (
              <div key={product.id} className="p-3.5 bg-white border border-stone-200 text-xs space-y-3 shadow-xs">
                <div className="flex gap-3">
                  <div 
                    onClick={() => { onViewProduct(product); onClose(); }}
                    className="w-20 h-20 shrink-0 cursor-pointer overflow-hidden border border-stone-200"
                  >
                    <JewelryVisual product={product} aspectRatio="square" className="w-full h-full" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase tracking-wider text-stone-400">
                          {product.category} · {product.sku}
                        </span>
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="text-stone-400 hover:text-rose-700 cursor-pointer p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 
                        onClick={() => { onViewProduct(product); onClose(); }}
                        className="font-serif text-sm font-medium text-[#282329] hover:text-[#432032] cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h4>
                      <p className="font-mono text-stone-700 mt-0.5 font-semibold">
                        {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on Request'}
                      </p>
                    </div>

                    <div className="text-[11px] text-[#7D4856]">
                      {product.salesMode === 'ready-to-buy' && 'Ready to Buy · In Stock'}
                      {product.salesMode === 'made-to-order' && `Made to Order (${product.leadTimeDays}d)`}
                      {product.salesMode === 'price-on-request' && 'Price on Request'}
                    </div>
                  </div>
                </div>

                {/* Private Notes Field for Consultation */}
                <div className="pt-2 border-t border-stone-100">
                  <label className="block text-[11px] text-stone-500 mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-[#7D4856]" />
                    <span>Private Note for Consultant (Optional):</span>
                  </label>
                  <input
                    type="text"
                    value={shortlistMeta.notes || ''}
                    onChange={(e) => onUpdateNotes(product.id, e.target.value)}
                    placeholder="e.g. Inquire about 22k vs 18k gold purity, ring size 14..."
                    className="w-full text-xs p-1.5 border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#432032]"
                  />
                </div>
              </div>
            ))
          )}

          {/* Read-Only High-Entropy Sharing link note per PDF */}
          {populatedItems.length > 0 && (
            <div className="p-3 bg-stone-50 border border-stone-200 text-xs flex items-center justify-between">
              <div>
                <p className="font-medium text-stone-800">Share Shortlist with Family</p>
                <p className="text-[10px] text-stone-500">Read-only link with 14-day auto-expiry</p>
              </div>
              <button
                onClick={handleShareShortlist}
                className="px-3 py-1.5 border border-stone-300 text-xs text-stone-700 bg-white hover:bg-stone-100 flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{shareLinkCopied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {populatedItems.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-white space-y-2">
            <button
              onClick={() => {
                onClose();
                onBookWithShortlist();
              }}
              className="w-full py-3 bg-[#432032] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#341826] flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Calendar className="w-4 h-4 text-amber-200" />
              <span>Book Consultation With Shortlist ({populatedItems.length})</span>
            </button>
            <p className="text-[10px] text-center text-stone-400">
              Shortlisted designs are automatically forwarded to founder Jigna Khakhar prior to your appointment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
