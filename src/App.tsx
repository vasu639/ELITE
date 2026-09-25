import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, ShortlistItem, ConsultationBooking, BespokeQuoteEnquiry, OrderRecord, JewelryCategory } from './types';
import { JEWELRY_CATALOG, CATEGORIES_CONFIG } from './data/jewelryCatalog';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FilterBar, FilterState } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ConsultationModal } from './components/ConsultationModal';
import { ShortlistDrawer } from './components/ShortlistDrawer';
import { QuoteEnquiryModal } from './components/QuoteEnquiryModal';
import { CheckoutDrawer } from './components/CheckoutDrawer';
import { AdminPortal } from './components/AdminPortal';
import { RingSizeGuideModal } from './components/RingSizeGuideModal';
import { JewelryCareModal } from './components/JewelryCareModal';
import { StoryModal } from './components/StoryModal';
import { ContactModal } from './components/ContactModal';
import { StaffLoginModal } from './components/StaffLoginModal';
import { Footer } from './components/Footer';
import { Sparkles, Calendar, Heart, ShieldCheck, ArrowRight, MessageSquare, Lock } from 'lucide-react';
import { StaffSession, getActiveStaffSession, clearStaffSession } from './services/staffAuth';

export default function App() {
  // Staff authentication state
  const [staffSession, setStaffSession] = useState<StaffSession | null>(() => getActiveStaffSession());
  const [staffLoginOpen, setStaffLoginOpen] = useState(false);

  // State for Catalog Filters
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    salesMode: 'all',
    metal: 'all',
    stoneType: 'all',
    maxPrice: 1000000,
    sort: 'featured',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers visibility state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [consultationPreselectedProduct, setConsultationPreselectedProduct] = useState<Product | null>(null);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [quoteEnquiryProduct, setQuoteEnquiryProduct] = useState<Product | null>(null);
  const [ringGuideOpen, setRingGuideOpen] = useState(false);
  const [careModalOpen, setCareModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Products state (starts empty as requested: "admin will upload jewelleries dont put any product now")
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('edj_uploaded_products');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('edj_uploaded_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  const [adminInitialTab, setAdminInitialTab] = useState<'dashboard' | 'upload' | 'catalog' | 'calendar' | 'enquiries' | 'orders'>('dashboard');

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setShortlist(prev => prev.filter(s => s.productId !== productId));
  };

  const handleResetSampleCatalog = () => {
    setProducts(JEWELRY_CATALOG);
  };

  const handleClearAllProducts = () => {
    setProducts([]);
    setShortlist([]);
  };

  // Staff Portal Access handlers
  const handleOpenStaffWorkspace = () => {
    if (staffSession) {
      setAdminOpen(true);
    } else {
      setStaffLoginOpen(true);
    }
  };

  const handleStaffSignOut = () => {
    clearStaffSession();
    setStaffSession(null);
    setAdminOpen(false);
    if (window.location.hash.toLowerCase() === '#staff' || window.location.hash.toLowerCase() === '#admin') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Discreet staff listener: URL hash (#staff / #admin) and Keyboard shortcut (Alt+S)
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#staff' || hash === '#admin') {
        const active = getActiveStaffSession();
        if (active) {
          setStaffSession(active);
          setAdminOpen(true);
        } else {
          setStaffLoginOpen(true);
        }
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 's') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        const active = getActiveStaffSession();
        if (active) {
          setStaffSession(active);
          setAdminOpen(true);
        } else {
          setStaffLoginOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAddBooking = (newBooking: ConsultationBooking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const handleUpdateBooking = (updated: ConsultationBooking) => {
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  // Shortlist state in localStorage (starts empty)
  const [shortlist, setShortlist] = useState<ShortlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('edj_shortlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('edj_shortlist', JSON.stringify(shortlist));
    } catch (e) {
      console.error(e);
    }
  }, [shortlist]);

  // Shopping Bag State (starts empty)
  const [cart, setCart] = useState<CartItem[]>([]);

  // Consultation Bookings state
  const [bookings, setBookings] = useState<ConsultationBooking[]>([
    {
      id: 'EDJ-BK-8821',
      mode: 'showroom',
      date: '2026-09-29',
      timeSlot: '04:00 PM',
      timezone: 'IST (UTC+05:30)',
      customerName: 'Meera Kapadia',
      customerEmail: 'meera.k@example.com',
      customerPhone: '+91 98201 99220',
      consultantName: 'Jigna Khakhar (Principal Designer)',
      notes: 'Viewing Bridal Mangalsutra & Nizam Hasli Choker',
      shortlistedProductIds: ['edj-mng-003', 'edj-nck-002'],
      status: 'confirmed',
      createdAt: '2026-09-24T10:00:00Z',
      showroomLocation: 'Elite Designer Jewelry Showroom & Atelier, 634 Shree Laxmi Plaza PCS Ltd, Laxmi Industrial Estate, New Link Road, Andheri (West), Mumbai 400053',
    }
  ]);

  // Bespoke Quotation Enquiries state
  const [enquiries, setEnquiries] = useState<BespokeQuoteEnquiry[]>([
    {
      id: 'EDJ-QUO-4102',
      productId: 'edj-rng-003',
      productName: 'Imperial Marquise & Oval Diamond Crest Ring',
      customerName: 'Sanjay Vora',
      customerEmail: 'sanjay.vora@heritagecap.in',
      customerPhone: '+91 98200 11988',
      budgetINR: '₹10,00,000 - ₹25,00,000',
      occasion: '25th Wedding Anniversary',
      requiredByDate: '2026-11-20',
      notes: 'Interested in GIA Type IIa certificate confirmation and Platinum 950 weight.',
      status: 'new',
      assignedConsultant: 'Jigna Khakhar (Principal Designer)',
      createdAt: '2026-09-24T14:30:00Z',
    }
  ]);

  // Order Fulfillment Records
  const [orders, setOrders] = useState<OrderRecord[]>([
    {
      id: 'EDJ-ORD-9021',
      items: [
        {
          id: 'item-1',
          productId: 'edj-set-001',
          productName: 'Seraphina Dewdrop Diamond Pendant & Earring Set',
          sku: 'EDJ-SET-SER01',
          category: 'pendant-sets',
          salesMode: 'ready-to-buy',
          selectedMetal: '18K White Gold',
          price: 215000,
          leadTimeDays: 2,
          quantity: 1,
          setInclusions: '1 Pendant + 1 Pair of Earrings (2 Earrings) + 18K Spiga Chain',
        }
      ],
      subtotal: 215000,
      taxGst: 6450,
      shippingCharge: 0,
      total: 221450,
      customerName: 'Priyanka Sen',
      email: 'priyanka.sen@gmail.com',
      phone: '+91 98300 77123',
      shippingAddress: {
        street: '12 Alipore Avenue, Green Park',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700027',
      },
      paymentMethod: 'card',
      paymentStatus: 'paid',
      orderDate: '24 Sep 2026',
      estimatedDeliveryDate: '28 Sep 2026',
      qcMilestone: 'Precision Stone Setting',
      trackingNumber: 'BVC-EXP-819201',
    }
  ]);

  // Shortlist Handlers
  const handleToggleShortlist = (product: Product, note?: string) => {
    setShortlist(prev => {
      const exists = prev.some(item => item.productId === product.id);
      if (exists) {
        return prev.filter(item => item.productId !== product.id);
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            addedAt: new Date().toISOString(),
            notes: note || '',
          }
        ];
      }
    });
  };

  const handleUpdateShortlistNotes = (productId: string, notes: string) => {
    setShortlist(prev => prev.map(item => 
      item.productId === productId ? { ...item, notes } : item
    ));
  };

  const handleRemoveShortlistItem = (productId: string) => {
    setShortlist(prev => prev.filter(item => item.productId !== productId));
  };

  // Cart Handlers
  const handleAddToCart = (newItem: Omit<CartItem, 'id'>) => {
    setCart(prev => {
      const existing = prev.find(
        i => i.productId === newItem.productId && 
             i.selectedMetal === newItem.selectedMetal && 
             i.selectedSize === newItem.selectedSize
      );
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...newItem, id: `cart-${Date.now()}` }];
    });
    setCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, qty: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  // Filter & Search Logic adhering to Page 5 PDF specification:
  const { filteredProducts, unpricedCountExcluded } = useMemo(() => {
    let result = [...products];
    let unpricedExcluded = 0;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.metal.toLowerCase().includes(q) ||
        p.naturalStones.species.toLowerCase().includes(q) ||
        p.story.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // Sales Mode
    if (filters.salesMode !== 'all') {
      result = result.filter(p => p.salesMode === filters.salesMode);
    }

    // Metal
    if (filters.metal !== 'all') {
      result = result.filter(p => p.metal.toLowerCase().includes(filters.metal.toLowerCase()));
    }

    // Stone type
    if (filters.stoneType !== 'all') {
      result = result.filter(p => 
        p.naturalStones.species.toLowerCase().includes(filters.stoneType.toLowerCase()) ||
        (p.naturalStones.centerStone && p.naturalStones.centerStone.toLowerCase().includes(filters.stoneType.toLowerCase()))
      );
    }

    // Mangalsutra specific filters
    if (filters.mangalsutraLength) {
      result = result.filter(p => p.mangalsutraLengthInches === filters.mangalsutraLength);
    }

    // Ring size filter
    if (filters.ringSize) {
      result = result.filter(p => p.ringSizes && p.ringSizes.includes(filters.ringSize!));
    }

    // Numeric Price Filter Rule per PDF Page 5
    if (filters.maxPrice < 1000000) {
      const unpricedBefore = result.filter(p => p.price === null).length;
      result = result.filter(p => p.price !== null && p.price <= filters.maxPrice);
      unpricedExcluded = unpricedBefore;
    }

    // Sorting rule per PDF Page 5:
    // "Sort by featured, newest and price. Put unpriced designs after priced designs for price sorting. Do not invent a numerical price for ranking."
    result.sort((a, b) => {
      if (filters.sort === 'price-asc') {
        if (a.price === null && b.price === null) return 0;
        if (a.price === null) return 1; // unpriced after priced
        if (b.price === null) return -1;
        return a.price - b.price;
      }
      if (filters.sort === 'price-desc') {
        if (a.price === null && b.price === null) return 0;
        if (a.price === null) return 1; // unpriced after priced
        if (b.price === null) return -1;
        return b.price - a.price;
      }
      if (filters.sort === 'newest') {
        return b.id.localeCompare(a.id);
      }
      // featured default
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    return { filteredProducts: result, unpricedCountExcluded: unpricedExcluded };
  }, [products, filters, searchQuery]);

  const heroItem = products.length > 0 ? (products.find(p => p.featured) || products[0]) : null;

  const handleOpenConsultationWithProduct = (product: Product) => {
    setSelectedProduct(null);
    setConsultationPreselectedProduct(product);
    setConsultationOpen(true);
  };

  const handleOpenQuoteFromProduct = (product: Product) => {
    setSelectedProduct(null);
    setQuoteEnquiryProduct(product);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#282329] flex flex-col font-sans">
      
      {/* 1. Header with Top Bar Contract */}
      <Header
        onOpenConsultation={() => { setConsultationPreselectedProduct(null); setConsultationOpen(true); }}
        onOpenShortlist={() => setShortlistOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onOpenStory={() => setStoryModalOpen(true)}
        onOpenCare={() => setCareModalOpen(true)}
        onOpenRingGuide={() => setRingGuideOpen(true)}
        onSelectCategory={(cat) => setFilters(f => ({ ...f, category: cat as JewelryCategory | 'all' }))}
        cartItems={cart}
        shortlist={shortlist}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />

      <main className="flex-1">
        
        {/* 2. Hero Section (Campaign Focal Point) */}
        {filters.category === 'all' && !searchQuery && (
          <HeroSection
            heroProduct={heroItem}
            onExploreDesigns={() => {
              const el = document.getElementById('catalog-grid-anchor');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onBookConsultation={() => {
              setConsultationPreselectedProduct(null);
              setConsultationOpen(true);
            }}
            onViewProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {/* 3. Seven Categories Quick Visual Ribbon (per PDF Page 4 Homepage Composition) */}
        {filters.category === 'all' && !searchQuery && (
          <section className="border-b border-teal-900/10 bg-teal-50/30 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#0d7480]">
                  The Seven Atelier Disciplines
                </span>
                <span className="text-xs text-stone-500 hidden sm:inline">
                  Select any category to explore specifications & certified pieces
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {CATEGORIES_CONFIG.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setFilters(f => ({ ...f, category: cat.key }))}
                    className="p-3 text-left bg-white border border-stone-200/80 hover:border-[#083338] transition-colors group cursor-pointer"
                  >
                    <span className="font-serif text-sm font-medium text-[#083338] group-hover:text-[#0d7480] block">
                      {cat.title}
                    </span>
                    <span className="text-[10px] text-stone-500 line-clamp-2 mt-1 leading-tight">
                      {cat.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. Filter & Category Discovery Bar */}
        <div id="catalog-grid-anchor">
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            totalResultsCount={filteredProducts.length}
            unpricedCountExcludedByPriceRange={unpricedCountExcluded}
          />
        </div>

        {/* 5. Main Catalog Grid (3-4 desktop columns, 2 mobile columns per PDF Page 3) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Active Category Header if filtered */}
          {filters.category !== 'all' && (
            <div className="mb-6 pb-4 border-b border-stone-200 text-left">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#0d7480] font-semibold mb-1">
                <span>Atelier Discipline</span>
                <span>·</span>
                <span className="capitalize">{filters.category}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#083338]">
                {CATEGORIES_CONFIG.find(c => c.key === filters.category)?.title}
              </h2>
              <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                {CATEGORIES_CONFIG.find(c => c.key === filters.category)?.tagline} All pieces feature sovereign BIS hallmarking and conflict-free natural diamonds.
              </p>
            </div>
          )}

          {/* Product Grid or Empty State */}
          {products.length === 0 ? (
            <div className="border border-teal-100 bg-white p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-sm space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-[#083338]">
                <Sparkles className="w-8 h-8 text-[#d4af37]" />
              </div>
              
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-widest font-mono text-[#0d7480] font-semibold block">
                  Elite Designer Jewelry · Haute Joaillerie
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#083338] font-normal">
                  The Atelier Collection is Currently Being Curated
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
                  Founder and master jeweler Jigna Khakhar is individually handcrafting, hallmarking, and setting each signature creation. We welcome clients for personal appointments and bespoke commissions at our Mumbai showroom or via live HD video appointment.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setConsultationPreselectedProduct(null);
                    setConsultationOpen(true);
                  }}
                  className="px-6 py-3 bg-[#083338] hover:bg-[#0c444a] text-white border border-[#d4af37]/40 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  <span>Book Private Atelier Consultation</span>
                </button>

                <button
                  onClick={() => setContactModalOpen(true)}
                  className="px-6 py-3 border border-[#083338] text-[#083338] hover:bg-teal-50/50 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-[#0d7480]" />
                  <span>Contact Mumbai Showroom</span>
                </button>
              </div>

              {/* Atelier standards footer banner */}
              <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-center gap-3 text-xs text-stone-500">
                <span className="text-[11px] font-mono text-[#0d7480] font-semibold uppercase tracking-wider">Atelier Standards:</span>
                <span className="text-stone-600">Sovereign BIS Hallmark</span>
                <span>·</span>
                <span className="text-stone-600">GIA & IGI Certified Diamonds</span>
                <span>·</span>
                <span className="text-stone-600">Bespoke Solitaires & Mangalsutras</span>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-stone-50 border border-stone-200 p-8 space-y-3">
              <Sparkles className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="font-serif text-xl text-stone-800">No matching creations found</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                No designs match your active filter criteria. Try resetting price ranges or clearing gemstone filters.
              </p>
              <button
                onClick={() => setFilters({
                  category: 'all',
                  salesMode: 'all',
                  metal: 'all',
                  stoneType: 'all',
                  maxPrice: 1000000,
                  sort: 'featured',
                })}
                className="mt-3 px-5 py-2.5 bg-[#083338] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#0c444a] border border-[#d4af37]/40 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isShortlisted={shortlist.some(s => s.productId === product.id)}
                  onToggleShortlist={handleToggleShortlist}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onQuickEnquire={(p) => handleOpenQuoteFromProduct(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 6. Curated Consultation Banner per PDF Page 3 */}
        <section className="bg-[#042326] text-white py-14 border-t border-b border-[#083338]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs uppercase tracking-widest font-mono text-[#d4af37]">
              Private Joaillerie Atelier · Andheri West, Mumbai
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal text-balance">
              Design a Sacred Heirloom with Founder Jigna Khakhar
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/80 max-w-xl mx-auto leading-relaxed">
              Whether you are selecting a bespoke engagement diamond, custom mangalsutra length, or bridal necklace suite, our atelier offers complimentary 30-minute personal appointments online or at our Mumbai showroom.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  setConsultationPreselectedProduct(null);
                  setConsultationOpen(true);
                }}
                className="px-6 py-3 bg-[#d4af37] text-[#042326] hover:bg-[#e0c35c] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Book 30-Minute Consultation</span>
              </button>
              <button
                onClick={() => setStoryModalOpen(true)}
                className="px-6 py-3 border border-[#d4af37]/40 text-[#f5ecc7] hover:bg-white/10 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <span>Read Jigna Khakhar&apos;s Story</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* 7. Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setFilters(f => ({ ...f, category: cat as JewelryCategory | 'all' }));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenStory={() => setStoryModalOpen(true)}
        onOpenCare={() => setCareModalOpen(true)}
        onOpenRingGuide={() => setRingGuideOpen(true)}
        onOpenConsultation={() => {
          setConsultationPreselectedProduct(null);
          setConsultationOpen(true);
        }}
        onOpenContact={() => setContactModalOpen(true)}
        onOpenStaffLogin={handleOpenStaffWorkspace}
      />

      {/* Discreet Authenticated Staff Session Pill (ONLY visible when staff is actively signed in) */}
      {staffSession && (
        <div className="fixed bottom-4 left-4 z-40 bg-[#042326] text-amber-200 border border-[#d4af37]/40 px-3.5 py-1.5 shadow-xl text-xs flex items-center gap-2 animate-in fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="font-medium text-white">{staffSession.name}</span>
          <span className="text-amber-200/70 text-[10px] hidden sm:inline">({staffSession.role})</span>
          <span className="text-stone-400">·</span>
          <button
            onClick={() => setAdminOpen(true)}
            className="text-amber-300 hover:text-white font-semibold underline cursor-pointer text-xs"
          >
            Workspace
          </button>
          <span className="text-stone-400">·</span>
          <button
            onClick={handleStaffSignOut}
            className="text-stone-300 hover:text-rose-300 cursor-pointer text-[11px]"
            title="Lock and sign out"
          >
            Lock
          </button>
        </div>
      )}

      {/* Modals & Slide-over Drawers */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isShortlisted={shortlist.some(s => s.productId === selectedProduct.id)}
          onToggleShortlist={handleToggleShortlist}
          onAddToCart={handleAddToCart}
          onOpenConsultationWithProduct={handleOpenConsultationWithProduct}
          onOpenQuoteEnquiry={handleOpenQuoteFromProduct}
          onOpenRingGuide={() => setRingGuideOpen(true)}
        />
      )}

      {consultationOpen && (
        <ConsultationModal
          onClose={() => setConsultationOpen(false)}
          shortlist={shortlist}
          products={products}
          preselectedProduct={consultationPreselectedProduct}
          onBookingConfirmed={(booking) => {
            setBookings(prev => [booking, ...prev]);
          }}
        />
      )}

      {shortlistOpen && (
        <ShortlistDrawer
          shortlist={shortlist}
          products={products}
          onClose={() => setShortlistOpen(false)}
          onRemoveItem={handleRemoveShortlistItem}
          onUpdateNotes={handleUpdateShortlistNotes}
          onBookWithShortlist={() => {
            setConsultationPreselectedProduct(null);
            setConsultationOpen(true);
          }}
          onViewProduct={(p) => setSelectedProduct(p)}
        />
      )}

      {quoteEnquiryProduct && (
        <QuoteEnquiryModal
          product={quoteEnquiryProduct}
          onClose={() => setQuoteEnquiryProduct(null)}
          onSubmitEnquiry={(enq) => {
            setEnquiries(prev => [enq, ...prev]);
          }}
        />
      )}

      {cartOpen && (
        <CheckoutDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onOrderCompleted={(ord) => {
            setOrders(prev => [ord, ...prev]);
            setCart([]);
          }}
        />
      )}

      {adminOpen && (
        <AdminPortal
          onClose={() => setAdminOpen(false)}
          staffSession={staffSession}
          onSignOut={handleStaffSignOut}
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onResetSampleCatalog={handleResetSampleCatalog}
          onClearAllProducts={handleClearAllProducts}
          bookings={bookings}
          onAddBooking={handleAddBooking}
          onUpdateBooking={handleUpdateBooking}
          onUpdateBookingStatus={(id, status) => {
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
          }}
          enquiries={enquiries}
          onUpdateEnquiryQuote={(id, price) => {
            setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'quoted', quotedPriceINR: price } : e));
          }}
          orders={orders}
          onUpdateOrderStatus={(id, milestone) => {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, qcMilestone: milestone } : o));
          }}
          initialTab={adminInitialTab}
        />
      )}

      {/* Staff Authentication Gate */}
      <StaffLoginModal
        isOpen={staffLoginOpen}
        onClose={() => {
          setStaffLoginOpen(false);
          if (window.location.hash.toLowerCase() === '#staff' || window.location.hash.toLowerCase() === '#admin') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
        onSuccess={(session) => {
          setStaffSession(session);
          setAdminOpen(true);
        }}
      />

      {ringGuideOpen && (
        <RingSizeGuideModal onClose={() => setRingGuideOpen(false)} />
      )}

      {careModalOpen && (
        <JewelryCareModal onClose={() => setCareModalOpen(false)} />
      )}

      {storyModalOpen && (
        <StoryModal
          onClose={() => setStoryModalOpen(false)}
          onOpenConsultation={() => {
            setStoryModalOpen(false);
            setConsultationOpen(true);
          }}
        />
      )}

      {contactModalOpen && (
        <ContactModal
          onClose={() => setContactModalOpen(false)}
          onOpenConsultation={() => {
            setContactModalOpen(false);
            setConsultationOpen(true);
          }}
        />
      )}
    </div>
  );
}
