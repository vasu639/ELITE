export type JewelryCategory = 
  | 'earrings'
  | 'pendants'
  | 'necklaces'
  | 'bracelets'
  | 'rings'
  | 'pendant-sets'
  | 'mangalsutras';

export type SalesMode = 'ready-to-buy' | 'made-to-order' | 'price-on-request';

export type MetalType = 
  | '18K Yellow Gold'
  | '18K Rose Gold'
  | '18K White Gold'
  | '22K Yellow Gold'
  | 'Platinum 950';

export interface NaturalStoneDisclosure {
  species: string;
  origin: string;
  treatment: string;
  count: number;
  totalCaratWeight: number;
  centerStone?: string;
  accentStones?: string;
  diamondDetails?: {
    cut: 'Brilliant' | 'Ideal' | 'Emerald Cut' | 'Pear' | 'Oval' | 'Rose Cut';
    color: 'D' | 'E' | 'F' | 'G' | 'H' | 'Fancy Vivid';
    clarity: 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'IF';
    carat: number;
  };
}

export interface CertificationInfo {
  lab: 'GIA' | 'IGI' | 'BIS Hallmark' | 'SGL';
  reportNumber: string;
  date: string;
  verifiable: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  size?: string;
  metal: MetalType;
  price: number | null; // null for price-on-request, never 0
  stock: number;
  leadTimeDays: number;
}

export interface Product {
  id: string;
  handle: string;
  name: string;
  sku: string;
  category: JewelryCategory;
  collection: string;
  salesMode: SalesMode;
  price: number | null; // null for Price on Request, never 0!
  leadTimeDays: number; // 0-3 for ready-to-buy, 14-21 for made-to-order
  stockQuantity: number;
  
  // Visual presentation
  imageTag: string; // descriptive icon / jewelry outline render style
  imageUrl?: string; // high-resolution uploaded photograph of the design
  additionalImages?: string[]; // multi-angle gallery photos
  galleryAngles: string[];
  
  // Materials and weight
  metal: MetalType;
  purity?: string; // e.g. "18K (750)" or "22K (916)"
  netMetalWeightGrams: number;
  grossWeightGrams: number;
  hallmarkRecord: string;
  huidCode?: string; // 6-digit alphanumeric unique BIS HUID code
  makingCharges?: string; // e.g. "₹850 / gram" or "12%"
  settingType?: string; // e.g. "4-Prong Comfort Crown" or "Micro-Set Halo"
  
  // Gemstones & Diamond 4Cs
  naturalStones: NaturalStoneDisclosure;
  diamondDetails?: {
    cut?: string; // e.g. "Round Brilliant", "Pear", "Emerald Cut"
    color?: string; // e.g. "D", "E", "F", "G", "Fancy Vivid"
    clarity?: string; // e.g. "VVS1", "VVS2", "VS1", "IF"
    carat?: number; // e.g. 1.25
    fluorescence?: string; // e.g. "None / Inert"
    symmetry?: string; // e.g. "Triple Excellent"
  };
  accentStonesDetails?: string; // e.g. "38 micro-set round diamonds (0.42 ct, F-G/VVS)"
  
  // Category-specific attributes
  earringStyle?: 'Stud' | 'Hoop' | 'Drop' | 'Chandelier';
  earringClosure?: 'Push Back' | 'Screw Back' | 'Omega Clip';
  
  pendantDimensions?: string;
  chainIncluded?: boolean;
  
  necklaceLength?: string;
  necklaceClosure?: string;
  
  braceletType?: 'Bangle' | 'Tennis' | 'Cuff';
  wristSizeCm?: string;
  
  ringSizes?: number[]; // e.g. [10, 12, 14, 16, 18]
  ringBandWidthMm?: number;
  ringResizeEligible?: boolean;
  
  // Explicit Inclusions for Pendant Sets
  setInclusions?: string; // e.g. "1 Pendant + 1 Pair of Earrings (2 Earrings). Chain not included."
  
  // Mangalsutras
  mangalsutraLengthInches?: 16 | 18 | 22 | 36;
  mangalsutraLengthCm?: number;
  mangalsutraPendantStyle?: 'Solitaire' | 'Cluster' | 'Geometric' | 'Traditional Floral';
  mangalsutraStrandCount?: 'Single Strand' | 'Double Strand' | 'Artisanal Triple String';
  mangalsutraOccasion?: 'Everyday Luxury' | 'Festive' | 'Bridal';

  // Verification & Trust
  certification: CertificationInfo;
  story: string;
  specifications: Record<string, string>;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: JewelryCategory;
  salesMode: SalesMode;
  selectedSize?: string | number;
  selectedMetal: MetalType;
  price: number;
  leadTimeDays: number;
  quantity: number;
  setInclusions?: string;
}

export interface ShortlistItem {
  productId: string;
  addedAt: string;
  notes?: string;
  preferredSize?: string;
  preferredMetal?: MetalType;
}

export interface ConsultationBooking {
  id: string;
  mode: 'online' | 'showroom';
  date: string;
  timeSlot: string;
  timezone: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  consultantName: string;
  notes?: string;
  shortlistedProductIds: string[];
  status: 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
  createdAt: string;
  meetingLink?: string;
  showroomLocation?: string;
}

export interface BespokeQuoteEnquiry {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  budgetINR?: string;
  occasion?: string;
  requiredByDate?: string;
  notes?: string;
  status: 'new' | 'in-review' | 'quoted' | 'accepted' | 'declined';
  assignedConsultant: string;
  quotedPriceINR?: number;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  items: CartItem[];
  subtotal: number;
  taxGst: number;
  shippingCharge: number;
  total: number;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'emi' | 'wire';
  paymentStatus: 'paid' | 'verified';
  orderDate: string;
  estimatedDeliveryDate: string;
  qcMilestone: 'Cast & Pre-Polish' | 'Precision Stone Setting' | 'BIS Hallmark Audit' | 'Insured Dispatch';
  trackingNumber: string;
}

export interface AdminUploadedAsset {
  id: string;
  name: string;
  url: string; // Base64 data URL or external asset URL
  category: JewelryCategory;
  uploadedAt: string;
  fileSize?: string;
  specsSummary?: string;
  dimensions?: string;
  // Full specifications of design
  specifications?: Record<string, string>;
  metal?: string;
  purity?: string;
  netWeight?: string;
  grossWeight?: string;
  centerDiamond?: string;
  accentDiamonds?: string;
  certification?: string;
  price?: number | null;
  sku?: string;
  hallmark?: string;
  huid?: string;
  makingCharges?: string;
  settingType?: string;
  story?: string;
}
