import React, { useState } from 'react';
import { SlidersHorizontal, X, RotateCcw, ChevronDown, Check, Info } from 'lucide-react';
import { JewelryCategory, SalesMode, MetalType } from '../types';
import { CATEGORIES_CONFIG } from '../data/jewelryCatalog';

export interface FilterState {
  category: JewelryCategory | 'all';
  salesMode: SalesMode | 'all';
  metal: string;
  stoneType: string;
  maxPrice: number;
  sort: 'featured' | 'newest' | 'price-asc' | 'price-desc';
  // Category specific
  mangalsutraLength?: number;
  mangalsutraStyle?: string;
  mangalsutraStrands?: string;
  ringSize?: number;
  earringStyle?: string;
  pendantSetChainIncluded?: boolean | null;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  totalResultsCount: number;
  unpricedCountExcludedByPriceRange: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  totalResultsCount,
  unpricedCountExcludedByPriceRange,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleCategorySelect = (catKey: JewelryCategory | 'all') => {
    onFilterChange({
      ...filters,
      category: catKey,
      // reset specific category filters
      mangalsutraLength: undefined,
      mangalsutraStyle: undefined,
      mangalsutraStrands: undefined,
      ringSize: undefined,
      earringStyle: undefined,
      pendantSetChainIncluded: null,
    });
  };

  const handleResetFilters = () => {
    onFilterChange({
      category: 'all',
      salesMode: 'all',
      metal: 'all',
      stoneType: 'all',
      maxPrice: 1000000,
      sort: 'featured',
      mangalsutraLength: undefined,
      mangalsutraStyle: undefined,
      mangalsutraStrands: undefined,
      ringSize: undefined,
      earringStyle: undefined,
      pendantSetChainIncluded: null,
    });
  };

  const isFiltered = 
    filters.category !== 'all' || 
    filters.salesMode !== 'all' || 
    filters.metal !== 'all' || 
    filters.stoneType !== 'all' || 
    filters.maxPrice < 1000000 ||
    filters.mangalsutraLength !== undefined ||
    filters.mangalsutraStyle !== undefined ||
    filters.ringSize !== undefined ||
    filters.earringStyle !== undefined;

  return (
    <div className="border-b border-[#282329]/10 bg-[#FFFDFB] sticky top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        
        {/* Horizontal Category Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1 border-b border-stone-200/60">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-colors rounded-none cursor-pointer ${
              filters.category === 'all'
                ? 'bg-[#432032] text-white'
                : 'text-[#282329]/80 hover:text-[#432032] hover:bg-stone-100'
            }`}
          >
            All Collections
          </button>
          {CATEGORIES_CONFIG.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategorySelect(cat.key)}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-colors rounded-none cursor-pointer ${
                filters.category === cat.key
                  ? 'bg-[#432032] text-white'
                  : 'text-[#282329]/80 hover:text-[#432032] hover:bg-stone-100'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Secondary Filter & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          
          {/* Left: Quick Filter Triggers */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Sales Mode Segmented Filter */}
            <div className="flex items-center border border-stone-200 bg-stone-50/50 p-0.5 text-xs">
              <button
                onClick={() => onFilterChange({ ...filters, salesMode: 'all' })}
                className={`px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                  filters.salesMode === 'all' ? 'bg-[#432032] text-white' : 'text-stone-600 hover:text-black'
                }`}
              >
                All Modes
              </button>
              <button
                onClick={() => onFilterChange({ ...filters, salesMode: 'ready-to-buy' })}
                className={`px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                  filters.salesMode === 'ready-to-buy' ? 'bg-[#432032] text-white' : 'text-stone-600 hover:text-black'
                }`}
                title="Immediate purchase from inventory"
              >
                Ready to Buy
              </button>
              <button
                onClick={() => onFilterChange({ ...filters, salesMode: 'made-to-order' })}
                className={`px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                  filters.salesMode === 'made-to-order' ? 'bg-[#432032] text-white' : 'text-stone-600 hover:text-black'
                }`}
                title="Handcrafted to order with stated lead times"
              >
                Made to Order
              </button>
              <button
                onClick={() => onFilterChange({ ...filters, salesMode: 'price-on-request' })}
                className={`px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                  filters.salesMode === 'price-on-request' ? 'bg-[#432032] text-white' : 'text-stone-600 hover:text-black'
                }`}
                title="Bespoke consultation & personalized quote"
              >
                Price on Request
              </button>
            </div>

            {/* Category-Specific Direct Filters if Mangalsutras selected */}
            {filters.category === 'mangalsutras' && (
              <div className="hidden md:flex items-center gap-1.5">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold ml-2">Length:</span>
                {[16, 18, 22, 36].map((len) => (
                  <button
                    key={len}
                    onClick={() => onFilterChange({
                      ...filters,
                      mangalsutraLength: filters.mangalsutraLength === len ? undefined : len,
                    })}
                    className={`px-2 py-0.5 text-xs border cursor-pointer ${
                      filters.mangalsutraLength === len
                        ? 'border-[#432032] bg-[#432032] text-white'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {len}&quot;
                  </button>
                ))}
              </div>
            )}

            {/* Category-Specific Direct Filters if Rings selected */}
            {filters.category === 'rings' && (
              <div className="hidden md:flex items-center gap-1.5">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold ml-2">Indian Size:</span>
                {[10, 12, 14, 16, 18, 20].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => onFilterChange({
                      ...filters,
                      ringSize: filters.ringSize === sz ? undefined : sz,
                    })}
                    className={`px-2 py-0.5 text-xs border cursor-pointer ${
                      filters.ringSize === sz
                        ? 'border-[#432032] bg-[#432032] text-white'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            )}

            {/* Mobile / Full Filter Drawer Toggle */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-stone-300 text-xs font-medium text-[#282329] hover:bg-stone-50 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#7D4856]" />
              <span>All Filters</span>
              {isFiltered && (
                <span className="w-2 h-2 rounded-full bg-[#7D4856]" />
              )}
            </button>

            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs text-[#7D4856] hover:text-[#432032] underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right: Sort and Count */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-stone-500 hidden sm:inline">
              Showing <strong className="text-[#282329] font-medium">{totalResultsCount}</strong> {totalResultsCount === 1 ? 'creation' : 'creations'}
            </span>

            <div className="flex items-center gap-1.5">
              <label htmlFor="sort-select" className="text-stone-500 font-medium">Sort:</label>
              <select
                id="sort-select"
                value={filters.sort}
                onChange={(e) => onFilterChange({ ...filters, sort: e.target.value as FilterState['sort'] })}
                className="bg-transparent border border-stone-200 py-1 px-2 text-xs font-medium text-[#282329] focus:outline-none focus:border-[#432032] cursor-pointer"
              >
                <option value="featured">Curated & Featured</option>
                <option value="newest">Newest Releases</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notice if Numeric Price is active and Price-On-Request pieces are excluded per PDF requirement */}
        {filters.maxPrice < 1000000 && unpricedCountExcludedByPriceRange > 0 && (
          <div className="mt-2 text-xs bg-amber-50/70 border border-amber-200/60 p-2 text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                Numeric price filter active (under ₹{(filters.maxPrice).toLocaleString('en-IN')}). {unpricedCountExcludedByPriceRange} bespoke Price-on-Request pieces are excluded from numeric ranking.
              </span>
            </span>
            <button
              onClick={() => onFilterChange({ ...filters, maxPrice: 1000000, salesMode: 'price-on-request' })}
              className="text-[#432032] font-semibold underline ml-3 shrink-0 cursor-pointer"
            >
              View Bespoke Works
            </button>
          </div>
        )}
      </div>

      {/* Comprehensive Filter Modal / Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-[#FFFDFB] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-[#432032]">Filter Catalog</h3>
                <p className="text-xs text-stone-500 font-sans">Precision gemstone, metal & bespoke controls</p>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D4856] mb-2">
                  Jewelry Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleCategorySelect(e.target.value as JewelryCategory | 'all')}
                  className="w-full p-2 text-xs border border-stone-300 bg-white focus:outline-none focus:border-[#432032]"
                >
                  <option value="all">All Categories (7)</option>
                  <option value="earrings">Earrings</option>
                  <option value="pendants">Pendants</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="rings">Rings</option>
                  <option value="pendant-sets">Pendant Sets</option>
                  <option value="mangalsutras">Mangalsutras</option>
                </select>
              </div>

              {/* Metal & Purity */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D4856] mb-2">
                  Precious Metal & Purity
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['all', '18K Yellow Gold', '18K Rose Gold', '18K White Gold', '22K Yellow Gold', 'Platinum 950'].map((met) => (
                    <button
                      key={met}
                      onClick={() => onFilterChange({ ...filters, metal: met })}
                      className={`p-2 text-left border cursor-pointer ${
                        filters.metal === met
                          ? 'border-[#432032] bg-[#432032] text-white font-medium'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {met === 'all' ? 'All Metals' : met}
                    </button>
                  ))}
                </div>
              </div>

              {/* Natural Stone Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D4856] mb-2">
                  Natural Gemstone
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['all', 'Diamond', 'Emerald', 'Ruby', 'Sapphire', 'Polki'].map((stone) => (
                    <button
                      key={stone}
                      onClick={() => onFilterChange({ ...filters, stoneType: stone })}
                      className={`p-2 text-left border cursor-pointer ${
                        filters.stoneType === stone
                          ? 'border-[#432032] bg-[#432032] text-white font-medium'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {stone === 'all' ? 'All Gemstones' : stone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="price-range-slider" className="text-xs font-semibold uppercase tracking-wider text-[#7D4856]">
                    Max Price
                  </label>
                  <span className="text-xs font-mono font-medium text-[#432032]">
                    {filters.maxPrice >= 1000000 ? 'Any Budget' : `Under ₹${filters.maxPrice.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <input
                  id="price-range-slider"
                  type="range"
                  min="50000"
                  max="1000000"
                  step="25000"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
                  className="w-full accent-[#432032] cursor-pointer"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Note: Bespoke and high-atelier creations with Price on Request are preserved when &quot;Any Budget&quot; is selected.
                </p>
              </div>

              {/* Mangalsutra Specific Filters */}
              {filters.category === 'mangalsutras' && (
                <div className="border-t border-stone-200 pt-4 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#432032]">Mangalsutra Specifics</h4>
                  <div>
                    <label className="text-[11px] text-stone-600 block mb-1">Chain Length</label>
                    <div className="flex gap-2">
                      {[16, 18, 22, 36].map((l) => (
                        <button
                          key={l}
                          onClick={() => onFilterChange({ ...filters, mangalsutraLength: filters.mangalsutraLength === l ? undefined : l })}
                          className={`flex-1 py-1.5 text-xs border cursor-pointer ${
                            filters.mangalsutraLength === l ? 'bg-[#432032] text-white' : 'bg-white text-stone-700'
                          }`}
                        >
                          {l}&quot;
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center gap-3">
              <button
                onClick={handleResetFilters}
                className="w-1/3 py-2.5 text-xs font-medium uppercase tracking-wider text-stone-700 border border-stone-300 hover:bg-stone-100 cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-2/3 py-2.5 text-xs font-medium uppercase tracking-wider text-white bg-[#432032] hover:bg-[#341826] cursor-pointer"
              >
                Apply Filters ({totalResultsCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
