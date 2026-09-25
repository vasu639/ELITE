import React, { useState, useEffect, useRef } from 'react';
import { 
  X, LayoutDashboard, ShoppingBag, MessageSquare, Calendar as CalendarIcon, 
  Package, PlusCircle, CheckCircle2, Clock, AlertCircle, Eye, Edit3, Trash2,
  ShieldCheck, Upload, Sparkles, Filter, Search, User, Phone, Mail, MapPin,
  Video, ArrowRight, ExternalLink, RotateCcw, Copy, Check, LogOut, KeyRound, Lock, UserPlus,
  Folder, FolderOpen, Image as ImageIcon, FileImage, Download, Camera, SlidersHorizontal
} from 'lucide-react';
import { Product, ConsultationBooking, BespokeQuoteEnquiry, OrderRecord, JewelryCategory, SalesMode, MetalType, AdminUploadedAsset } from '../types';
import { JEWELRY_CATALOG, CATEGORIES_CONFIG } from '../data/jewelryCatalog';
import { 
  StaffSession, StaffAccount, getStaffAccounts, updateStaffPassword, createStaffAccount 
} from '../services/staffAuth';

interface AdminPortalProps {
  onClose: () => void;
  staffSession?: StaffSession | null;
  onSignOut?: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetSampleCatalog: () => void;
  onClearAllProducts: () => void;
  bookings: ConsultationBooking[];
  onAddBooking: (booking: ConsultationBooking) => void;
  onUpdateBooking: (booking: ConsultationBooking) => void;
  onUpdateBookingStatus: (bookingId: string, status: ConsultationBooking['status']) => void;
  enquiries: BespokeQuoteEnquiry[];
  onUpdateEnquiryQuote: (enquiryId: string, quotedPrice: number) => void;
  orders: OrderRecord[];
  onUpdateOrderStatus: (orderId: string, milestone: OrderRecord['qcMilestone']) => void;
  initialTab?: 'dashboard' | 'upload' | 'catalog' | 'calendar' | 'enquiries' | 'orders' | 'staff' | 'media';
}

type StaffRole = 'Owner (Jigna Khakhar)' | 'Catalog Editor' | 'Consultant' | 'Operations';

const DEFAULT_ADMIN_ASSETS: AdminUploadedAsset[] = [
  {
    id: 'asset-1',
    name: 'The Aurora Pear Solitaire Ring',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
    category: 'rings',
    uploadedAt: '2026-09-24',
    fileSize: '1.4 MB',
    dimensions: '1800 x 1800',
    specsSummary: '18K Yellow Gold (750) · 1.50 ct Pear Natural Diamond (F/VVS1) · GIA Certified',
    metal: '18K Yellow Gold',
    purity: '18K (750 Purity)',
    netWeight: '5.20g',
    grossWeight: '5.80g',
    centerDiamond: '1.50 ct Pear Brilliant · Color F · Clarity VVS1 · Triple Excellent',
    accentDiamonds: '28 micro-pavé diamonds (0.32 ct tw, F/VVS)',
    certification: 'GIA Verified Report #2489104821',
    price: 385000,
    sku: 'EDJ-RNG-AURORA-01',
    hallmark: 'BIS Hallmark 750 (MH99210)',
    huid: 'MH99210',
    makingCharges: '₹850 / gram',
    settingType: '5-Prong V-Tip Comfort Shank',
    story: 'Conceived in Jigna Khakhar’s Mumbai studio with whisper-thin micro-prongs to maximize light return.',
    specifications: {
      'Precious Metal': '18K Solid Yellow Gold (750 Purity)',
      'Net Metal Weight': '5.20 grams',
      'Gross Weight': '5.80 grams',
      'BIS Sovereign Hallmark': 'Assayed with unique HUID MH99210',
      'Center Diamond': '1.50 Carat Pear Brilliant (F / VVS1)',
      'Accent Pavé': '28 Micro-pavé diamonds (0.32 ct tw)',
      'Gemological Certificate': 'GIA Report 2489104821',
      'Mount Architecture': 'Precision 5-Prong with comfort-tapered shank'
    }
  },
  {
    id: 'asset-2',
    name: 'Sacred Constellation Dual-Strand Mangalsutra',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
    category: 'mangalsutras',
    uploadedAt: '2026-09-24',
    fileSize: '1.8 MB',
    dimensions: '2000 x 2000',
    specsSummary: '18K Yellow Gold · 1.10 ct Round Solitaire · 18" Dual Strand · BIS Hallmark 750',
    metal: '18K Yellow Gold',
    purity: '18K (750 Purity)',
    netWeight: '8.40g',
    grossWeight: '9.20g',
    centerDiamond: '1.10 ct Round Brilliant (G/VVS2)',
    accentDiamonds: 'Natural black onyx beads woven in 18k gold wire',
    certification: 'IGI Certified Report #MNG-889104',
    price: 245000,
    sku: 'EDJ-MNG-CONSTEL-02',
    hallmark: 'BIS Hallmark 750 (KA88219)',
    huid: 'KA88219',
    makingCharges: '₹950 / gram',
    settingType: 'Bezel-Prong Hybrid Auspicious Center',
    story: 'Re-imagining the traditional mangalsutra with dual micro-strands and a floating bezel diamond pendant.',
    specifications: {
      'Precious Metal': '18K Yellow Gold (750)',
      'Net Metal Weight': '8.40 grams',
      'Gross Weight': '9.20 grams',
      'Chain Length': '18 inches (45.7 cm) with 2-inch sizing loop',
      'Strand Architecture': 'Dual-strand black auspicious beads + 18k curb links',
      'Diamond Details': '1.10 ct Round Brilliant (G/VVS2)',
      'Certification': 'IGI Certified Report MNG-889104',
      'Hallmark': 'Govt. Approved BIS Hallmark 750'
    }
  },
  {
    id: 'asset-3',
    name: 'Royal Deccan Colombian Emerald & Diamond Choker',
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80',
    category: 'necklaces',
    uploadedAt: '2026-09-23',
    fileSize: '2.1 MB',
    dimensions: '2200 x 2200',
    specsSummary: '18K White Gold · 4.80 ct Natural Emerald · 2.40 ct Rose Cut Diamonds',
    metal: '18K White Gold',
    purity: '18K (750 Purity)',
    netWeight: '24.50g',
    grossWeight: '28.10g',
    centerDiamond: '4.80 ct Octagonal Minor-Oil Colombian Emerald',
    accentDiamonds: '2.40 ct tw Rose Cut & Brilliant Diamonds (E-F/VVS)',
    certification: 'Gubelin Gem Lab & GIA Certified',
    price: null,
    sku: 'EDJ-NCK-DECCAN-03',
    hallmark: 'BIS Hallmark 750 (MH77412)',
    huid: 'MH77412',
    makingCharges: 'Bespoke Haute Joaillerie Benchwork',
    settingType: 'Art Deco Master Openwork Gallery',
    story: 'Heirloom Deccan choker cast in 18k white gold featuring minor-oil certified Muzo Colombian emerald.',
    specifications: {
      'Precious Metal': '18K Solid White Gold (750)',
      'Net Metal Weight': '24.50 grams',
      'Gross Weight': '28.10 grams',
      'Center Gemstone': '4.80 ct Natural Colombian Emerald (Minor Cedar Oil)',
      'Accent Diamonds': '2.40 ct Rose-cut and full-cut diamonds (E-F/VVS)',
      'Certification': 'Gubelin Gemological Certificate + GIA Diamond Passport',
      'Provenance': 'Jigna Khakhar High Jewelry Showroom Archive'
    }
  },
  {
    id: 'asset-4',
    name: 'Empress Micro-Pavé Diamond Tennis Bracelet',
    url: 'https://images.unsplash.com/photo-1611591475879-da60a37392c0?auto=format&fit=crop&w=1000&q=80',
    category: 'bracelets',
    uploadedAt: '2026-09-22',
    fileSize: '1.6 MB',
    dimensions: '1900 x 1900',
    specsSummary: 'Platinum 950 · 3.50 ct tw Round Brilliant Diamonds · Double Safety Catch',
    metal: 'Platinum 950',
    purity: 'PT 950 Sovereign Purity',
    netWeight: '12.80g',
    grossWeight: '14.20g',
    centerDiamond: '54 matched Round Brilliant Diamonds (3.50 ct tw, F/VVS2)',
    accentDiamonds: 'Individual 4-prong articulated platinum basket links',
    certification: 'SGL Master Diamond Jewellery Passport',
    price: 495000,
    sku: 'EDJ-BRC-EMPRESS-04',
    hallmark: 'Purity PT950 Assayed Stamped',
    huid: 'PT950-8812',
    makingCharges: '₹1,200 / gram',
    settingType: 'Individually articulated 4-prong baskets with safety clasp',
    story: 'Seamless fluid drape engineered for everyday quiet luxury with dual concealed security plungers.',
    specifications: {
      'Precious Metal': 'Solid Platinum 950',
      'Net Metal Weight': '12.80 grams',
      'Total Diamond Weight': '3.50 Carats total weight (54 stones)',
      'Diamond Color & Clarity': 'F Color · VVS2 Clarity · Triple Excellent',
      'Clasp Mechanism': 'Concealed box lock with dual safety side catches',
      'Length': '7.0 inches (17.8 cm)',
      'Certification': 'SGL International Grading Certificate'
    }
  },
  {
    id: 'asset-5',
    name: 'Dewdrop Diamond Pendant & Matching Earrings Suite',
    url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80',
    category: 'pendant-sets',
    uploadedAt: '2026-09-21',
    fileSize: '1.9 MB',
    dimensions: '2000 x 2000',
    specsSummary: '18K Rose Gold · 3-Piece Suite (Pendant + 2 Earrings + 18k Spiga Chain)',
    metal: '18K Rose Gold',
    purity: '18K (750 Purity)',
    netWeight: '9.80g',
    grossWeight: '10.90g',
    centerDiamond: '1.20 ct Pear Brilliant Solitaire Pendant + 0.90 ct tw Earring Drops',
    accentDiamonds: 'Halo micro-pavé contour setting in 18k rose gold',
    certification: 'GIA & IGI Verified Dual Certificates',
    price: 285000,
    sku: 'EDJ-SET-DEWDROP-05',
    hallmark: 'BIS Hallmark 750 (MH99210)',
    huid: 'MH99210',
    makingCharges: '₹900 / gram',
    settingType: 'Fluid Tear-Drop Floating Halo',
    story: 'Designed as an inseparable bridal morning suite with harmonious dewdrop proportions.',
    specifications: {
      'Precious Metal': '18K Warm Rose Gold (750)',
      'Net Metal Weight': '9.80 grams',
      'Gross Weight': '10.90 grams',
      'Suite Inclusions': '1 Pendant + 1 Pair Matching Earrings + 18" 18k Spiga Chain',
      'Total Diamond Carats': '2.10 ct tw (F-G / VVS1)',
      'Earring Closure': 'Screw back with safety bullet backings',
      'Certification': 'GIA Solitaire Report + IGI Suite Appraisal'
    }
  },
  {
    id: 'asset-6',
    name: 'Royal Heritage Polki Chandelier Earrings',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
    category: 'earrings',
    uploadedAt: '2026-09-20',
    fileSize: '2.3 MB',
    dimensions: '2400 x 2400',
    specsSummary: '22K Yellow Gold (916) · Uncut Natural Polki Diamonds · Bombay Screw Closure',
    metal: '22K Yellow Gold',
    purity: '22K (916 Purity)',
    netWeight: '16.40g',
    grossWeight: '18.80g',
    centerDiamond: 'Natural Syndicate Polki Diamonds (Uncut Natural Diamonds)',
    accentDiamonds: 'South Sea cultured seed pearl clusters and green tourmaline drops',
    certification: 'BIS Hallmark 916 Assayed + EDJ Provenance Certificate',
    price: 360000,
    sku: 'EDJ-EAR-POLKI-06',
    hallmark: 'BIS Hallmark 916 (MH88320)',
    huid: 'MH88320',
    makingCharges: '₹1,150 / gram (Heritage Hand-Jadau Benchwork)',
    settingType: 'Traditional 24k Jadau foil setting with royal Meenakari reverse',
    story: 'Preserving 18th-century Jaipur and Hyderabad royal jewelry traditions with hand-engraved enamel back.',
    specifications: {
      'Precious Metal': '22K Solid Yellow Gold (916 Sovereign Hallmark)',
      'Net Metal Weight': '16.40 grams',
      'Gross Weight': '18.80 grams',
      'Gemstones': 'Uncut Natural Polki Diamonds + Certified South Sea Pearls',
      'Reverse Finish': 'Hand-painted floral royal green Meenakari (Enamel)',
      'Earring Closure': 'Traditional Bombay Screw Post with secure washer',
      'Hallmark': 'Govt. of India BIS Hallmark 916 with HUID'
    }
  }
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onClose,
  staffSession,
  onSignOut,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetSampleCatalog,
  onClearAllProducts,
  bookings,
  onAddBooking,
  onUpdateBooking,
  onUpdateBookingStatus,
  enquiries,
  onUpdateEnquiryQuote,
  orders,
  onUpdateOrderStatus,
  initialTab = 'dashboard',
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'catalog' | 'calendar' | 'enquiries' | 'orders' | 'staff' | 'media'>(initialTab);
  const [currentRole, setCurrentRole] = useState<StaffRole>('Owner (Jigna Khakhar)');
  const [quoteInput, setQuoteInput] = useState<{ [id: string]: string }>({});

  // Staff Management State
  const [staffAccountsList, setStaffAccountsList] = useState<StaffAccount[]>([]);
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffAccount['role']>('Atelier Manager');
  const [newStaffPassword, setNewStaffPassword] = useState('');

  useEffect(() => {
    setStaffAccountsList(getStaffAccounts());
  }, []);

  const refreshStaffList = () => {
    setStaffAccountsList(getStaffAccounts());
  };

  // Filter & Search states for Appointments
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [bookingFilterMode, setBookingFilterMode] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState<string>('');

  // Reschedule & Edit Appointment modal state
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<ConsultationBooking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('2026-09-30');
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('04:00 PM');
  const [consultantReassign, setConsultantReassign] = useState<string>('Jigna Khakhar (Principal Designer)');
  const [internalStaffNote, setInternalStaffNote] = useState<string>('');

  // Quick New Appointment Form State
  const [showNewBookingModal, setShowNewBookingModal] = useState<boolean>(false);
  const [newBookingClientName, setNewBookingClientName] = useState<string>('');
  const [newBookingClientEmail, setNewBookingClientEmail] = useState<string>('');
  const [newBookingClientPhone, setNewBookingClientPhone] = useState<string>('');
  const [newBookingMode, setNewBookingMode] = useState<'online' | 'showroom'>('showroom');
  const [newBookingDate, setNewBookingDate] = useState<string>('2026-09-29');
  const [newBookingSlot, setNewBookingSlot] = useState<string>('02:30 PM');
  const [newBookingNotes, setNewBookingNotes] = useState<string>('');

  // Upload Design Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [designName, setDesignName] = useState<string>('');
  const [sku, setSku] = useState<string>('');
  const [category, setCategory] = useState<JewelryCategory>('rings');
  const [collection, setCollection] = useState<string>('Signature Solitaires');
  const [salesMode, setSalesMode] = useState<SalesMode>('ready-to-buy');
  const [priceINR, setPriceINR] = useState<string>('185000');
  const [stockQuantity, setStockQuantity] = useState<number>(5);
  const [leadTimeDays, setLeadTimeDays] = useState<number>(3);
  
  // Image & Admin Folder States
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [mediaPickerOpen, setMediaPickerOpen] = useState<boolean>(false);
  const [mediaFilterCategory, setMediaFilterCategory] = useState<string>('all');
  const [mediaSearchQuery, setMediaSearchQuery] = useState<string>('');
  const [selectedAssetForSpecs, setSelectedAssetForSpecs] = useState<AdminUploadedAsset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderFileInputRef = useRef<HTMLInputElement>(null);

  // Metal & Hallmarking
  const [metal, setMetal] = useState<MetalType>('18K Yellow Gold');
  const [metalPurity, setMetalPurity] = useState<string>('18K (750 Purity)');
  const [netMetalWeight, setNetMetalWeight] = useState<string>('5.20');
  const [grossWeight, setGrossWeight] = useState<string>('5.80');
  const [hallmarkRecord, setHallmarkRecord] = useState<string>('BIS Hallmark 750 (MH99210)');
  const [huidCode, setHuidCode] = useState<string>('MH99210');
  const [makingCharges, setMakingCharges] = useState<string>('₹850 / gram');
  const [settingType, setSettingType] = useState<string>('4-Prong Comfort Crown');

  // Diamond 4Cs & Gemstone Specifications
  const [gemstoneSpecies, setGemstoneSpecies] = useState<string>('Natural Diamond');
  const [gemstoneOrigin, setGemstoneOrigin] = useState<string>('Kimberley Process Certified, Botswana');
  const [gemstoneTreatment, setGemstoneTreatment] = useState<string>('Untreated Natural Diamond');
  const [gemstoneTotalCarats, setGemstoneTotalCarats] = useState<string>('1.10');
  const [gemstoneCenterNotes, setGemstoneCenterNotes] = useState<string>('1.10 ct Round Brilliant Diamond (F/VVS1)');
  const [diamondCut, setDiamondCut] = useState<string>('Round Brilliant');
  const [diamondColor, setDiamondColor] = useState<string>('F');
  const [diamondClarity, setDiamondClarity] = useState<string>('VVS1');
  const [diamondFluorescence, setDiamondFluorescence] = useState<string>('None / Inert');
  const [diamondSymmetry, setDiamondSymmetry] = useState<string>('Triple Excellent');
  const [accentStonesNotes, setAccentStonesNotes] = useState<string>('36 micro-pavé diamonds (0.38 ct tw, F-G/VVS)');
  const [laserInscription, setLaserInscription] = useState<string>('GIA 2489104821');

  // Certification
  const [certLab, setCertLab] = useState<'GIA' | 'IGI' | 'BIS Hallmark' | 'SGL'>('GIA');
  const [certReportNumber, setCertReportNumber] = useState<string>('GIA-2489104821');
  const [story, setStory] = useState<string>('Conceived and hand-sculpted in Jigna Khakhar’s Mumbai studio with comfort-fit shank and micro-claw prongs.');
  const [visualTag, setVisualTag] = useState<string>('ring-pear-solitaire');
  
  // Category specific upload states
  const [mangalsutraLength, setMangalsutraLength] = useState<16 | 18 | 22 | 36>(18);
  const [mangalsutraStrands, setMangalsutraStrands] = useState<'Single Strand' | 'Double Strand' | 'Artisanal Triple String'>('Single Strand');
  const [mangalsutraStyle, setMangalsutraStyle] = useState<'Solitaire' | 'Cluster' | 'Geometric' | 'Traditional Floral'>('Solitaire');
  const [mangalsutraOccasion, setMangalsutraOccasion] = useState<'Everyday Luxury' | 'Festive' | 'Bridal'>('Everyday Luxury');
  const [setInclusions, setSetInclusions] = useState<string>('1 Pendant + 1 Pair of Earrings (2 Earrings). 18k Gold Chain included.');
  const [ringBandWidth, setRingBandWidth] = useState<number>(2.2);
  const [necklaceLength, setNecklaceLength] = useState<string>('16 inches (40.6 cm)');
  const [necklaceClasp, setNecklaceClasp] = useState<string>('Box Clasp with Double Safety Latch');
  const [braceletSize, setBraceletSize] = useState<string>('2.4 Standard (60 mm)');
  const [braceletLock, setBraceletLock] = useState<string>('Side-Push Button with Safety Catch');
  const [earringStyle, setEarringStyle] = useState<string>('Stud');
  const [earringClosure, setEarringClosure] = useState<string>('Bombay Screw Back (Safety Fit)');

  // Admin Folder Assets State with Local Storage persistence
  const [adminFolderAssets, setAdminFolderAssets] = useState<AdminUploadedAsset[]>(() => {
    try {
      const saved = localStorage.getItem('edj_admin_media_folder');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_ADMIN_ASSETS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('edj_admin_media_folder', JSON.stringify(adminFolderAssets));
    } catch (e) {
      // ignore
    }
  }, [adminFolderAssets]);

  const [toastNotice, setToastNotice] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  const showNotice = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastNotice({ message, type });
    setTimeout(() => setToastNotice(null), 4500);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, addToFolderOnly = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      showNotice('File size exceeds 8MB limit.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        if (!addToFolderOnly) {
          setUploadedImageUrl(result);
        }
        // Save to Admin Images Folder with all current design specifications
        const assetName = designName.trim() || file.name.replace(/\.[^/.]+$/, "");
        const newAsset: AdminUploadedAsset = {
          id: `asset-${Date.now()}`,
          name: assetName,
          url: result,
          category: category,
          uploadedAt: new Date().toISOString().split('T')[0],
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          dimensions: '2000 x 2000',
          specsSummary: `${metal} (${metalPurity}) · ${gemstoneTotalCarats} ct ${diamondCut} (${diamondColor}/${diamondClarity}) · ${certLab}`,
          metal,
          purity: metalPurity,
          netWeight: `${netMetalWeight}g`,
          grossWeight: `${grossWeight}g`,
          centerDiamond: `${gemstoneTotalCarats} ct ${diamondCut} · Color ${diamondColor} · Clarity ${diamondClarity}`,
          accentDiamonds: accentStonesNotes,
          certification: `${certLab} Report #${certReportNumber}`,
          price: salesMode === 'price-on-request' ? null : (Number(priceINR) || null),
          sku: sku || undefined,
          hallmark: hallmarkRecord,
          huid: huidCode,
          makingCharges: makingCharges,
          settingType: settingType,
          story: story,
          specifications: {
            'Precious Metal & Purity': `${metal} (${metalPurity})`,
            'Net Metal Weight': `${netMetalWeight} grams`,
            'Gross Weight': `${grossWeight} grams`,
            'BIS Hallmark & HUID': `${hallmarkRecord} · HUID: ${huidCode}`,
            'Diamond Specifications': `${diamondCut} · ${diamondColor}/${diamondClarity} · ${gemstoneTotalCarats} ct`,
            'Gemstone Center Notes': gemstoneCenterNotes || 'Center Gemstone',
            'Accent Pavé Stones': accentStonesNotes,
            'Setting & Architecture': settingType,
            'Making Charges': makingCharges,
            'Certification': `${certLab} Verified Report #${certReportNumber}`,
            'Atelier Provenance': 'Elite Designer Jewelry, Andheri West, Mumbai'
          }
        };
        setAdminFolderAssets(prev => [newAsset, ...prev]);
        showNotice(`Image & specifications for "${assetName}" saved to Admin Design Folder!`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectAssetForDesign = (asset: AdminUploadedAsset) => {
    setUploadedImageUrl(asset.url);
    if (asset.name) setDesignName(asset.name);
    if (asset.category) setCategory(asset.category);
    if (asset.metal) setMetal(asset.metal as MetalType);
    if (asset.purity) setMetalPurity(asset.purity);
    if (asset.netWeight) setNetMetalWeight(asset.netWeight.replace(/[^0-9.]/g, ''));
    if (asset.grossWeight) setGrossWeight(asset.grossWeight.replace(/[^0-9.]/g, ''));
    if (asset.hallmark) setHallmarkRecord(asset.hallmark);
    if (asset.huid) setHuidCode(asset.huid);
    if (asset.makingCharges) setMakingCharges(asset.makingCharges);
    if (asset.settingType) setSettingType(asset.settingType);
    if (asset.price !== undefined) {
      if (asset.price === null) {
        setSalesMode('price-on-request');
        setPriceINR('');
      } else {
        setSalesMode('ready-to-buy');
        setPriceINR(asset.price.toString());
      }
    }
    if (asset.sku) setSku(asset.sku);
    if (asset.story) setStory(asset.story);
    if (asset.centerDiamond) {
      setGemstoneCenterNotes(asset.centerDiamond);
    }
    if (asset.accentDiamonds) {
      setAccentStonesNotes(asset.accentDiamonds);
    }
    if (asset.certification) {
      if (asset.certification.toUpperCase().includes('GIA')) setCertLab('GIA');
      else if (asset.certification.toUpperCase().includes('IGI')) setCertLab('IGI');
      else if (asset.certification.toUpperCase().includes('SGL')) setCertLab('SGL');
      else if (asset.certification.toUpperCase().includes('BIS')) setCertLab('BIS Hallmark');
    }
    setMediaPickerOpen(false);
    showNotice(`Loaded image and all specifications for "${asset.name}" into Design Form!`, 'success');
  };

  const handleDeleteAsset = (assetId: string) => {
    setAdminFolderAssets(prev => prev.filter(a => a.id !== assetId));
    showNotice('Image removed from Admin Design Folder.', 'info');
  };

  // Stats calculation
  const totalSalesINR = orders.reduce((sum, o) => sum + o.total, 0) + 1420000;
  const activeEnquiriesCount = enquiries.length;
  const upcomingAppointmentsCount = bookings.filter(b => b.status === 'confirmed').length;

  const handleSendQuote = (enquiryId: string) => {
    const val = Number(quoteInput[enquiryId]);
    if (val && !isNaN(val)) {
      onUpdateEnquiryQuote(enquiryId, val);
      showNotice(`Priced quotation of ₹${val.toLocaleString('en-IN')} dispatched to customer with 14-day price lock.`, 'success');
    }
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setDesignName(prod.name);
    setSku(prod.sku);
    setCategory(prod.category);
    setCollection(prod.collection);
    setSalesMode(prod.salesMode);
    setPriceINR(prod.price !== null ? prod.price.toString() : '');
    setStockQuantity(prod.stockQuantity);
    setLeadTimeDays(prod.leadTimeDays);
    setUploadedImageUrl(prod.imageUrl || '');
    setMetal(prod.metal);
    setMetalPurity(prod.purity || (prod.metal.includes('22K') ? '22K (916 Purity)' : '18K (750 Purity)'));
    setNetMetalWeight(prod.netMetalWeightGrams.toString());
    setGrossWeight(prod.grossWeightGrams.toString());
    setHallmarkRecord(prod.hallmarkRecord);
    setHuidCode(prod.huidCode || 'MH99210');
    setMakingCharges(prod.makingCharges || '₹850 / gram');
    setSettingType(prod.settingType || '4-Prong Comfort Crown');
    setGemstoneSpecies(prod.naturalStones.species);
    setGemstoneOrigin(prod.naturalStones.origin);
    setGemstoneTreatment(prod.naturalStones.treatment);
    setGemstoneTotalCarats(prod.naturalStones.totalCaratWeight.toString());
    setGemstoneCenterNotes(prod.naturalStones.centerStone || '');
    setDiamondCut(prod.diamondDetails?.cut || 'Round Brilliant');
    setDiamondColor(prod.diamondDetails?.color || 'F');
    setDiamondClarity(prod.diamondDetails?.clarity || 'VVS1');
    setDiamondFluorescence(prod.diamondDetails?.fluorescence || 'None / Inert');
    setDiamondSymmetry(prod.diamondDetails?.symmetry || 'Triple Excellent');
    setAccentStonesNotes(prod.accentStonesDetails || '36 micro-pavé diamonds (0.38 ct tw, F-G/VVS)');
    setCertLab(prod.certification.lab);
    setCertReportNumber(prod.certification.reportNumber);
    setStory(prod.story);
    setVisualTag(prod.imageTag);

    if (prod.mangalsutraLengthInches) setMangalsutraLength(prod.mangalsutraLengthInches);
    if (prod.mangalsutraStrandCount) setMangalsutraStrands(prod.mangalsutraStrandCount);
    if (prod.mangalsutraPendantStyle) setMangalsutraStyle(prod.mangalsutraPendantStyle);
    if (prod.mangalsutraOccasion) setMangalsutraOccasion(prod.mangalsutraOccasion);
    if (prod.setInclusions) setSetInclusions(prod.setInclusions);
    if (prod.ringBandWidthMm) setRingBandWidth(prod.ringBandWidthMm);

    setActiveTab('upload');
  };

  const handleResetUploadForm = () => {
    setEditingProductId(null);
    setDesignName('');
    setSku('');
    setCategory('rings');
    setCollection('Signature Solitaires');
    setSalesMode('ready-to-buy');
    setPriceINR('185000');
    setStockQuantity(5);
    setLeadTimeDays(3);
    setUploadedImageUrl('');
    setMetal('18K Yellow Gold');
    setMetalPurity('18K (750 Purity)');
    setNetMetalWeight('5.20');
    setGrossWeight('5.80');
    setHallmarkRecord('BIS Hallmark 750 (MH99210)');
    setHuidCode('MH99210');
    setMakingCharges('₹850 / gram');
    setSettingType('4-Prong Comfort Crown');
    setGemstoneSpecies('Natural Diamond');
    setGemstoneOrigin('Kimberley Process Certified, Botswana');
    setGemstoneTreatment('Untreated Natural Diamond');
    setGemstoneTotalCarats('1.10');
    setGemstoneCenterNotes('1.10 ct Round Brilliant Diamond (F/VVS1)');
    setDiamondCut('Round Brilliant');
    setDiamondColor('F');
    setDiamondClarity('VVS1');
    setDiamondFluorescence('None / Inert');
    setDiamondSymmetry('Triple Excellent');
    setAccentStonesNotes('36 micro-pavé diamonds (0.38 ct tw, F-G/VVS)');
    setCertLab('GIA');
    setCertReportNumber('GIA-2489104821');
    setLaserInscription('GIA 2489104821');
    setStory('Conceived and hand-sculpted in Jigna Khakhar’s Mumbai studio with comfort-fit shank.');
    setVisualTag('ring-pear-solitaire');
    setMangalsutraLength(18);
    setSetInclusions('1 Pendant + 1 Pair of Earrings (2 Earrings). 18k Gold Chain included.');
  };

  const handleSaveOrPublishDesign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designName.trim()) {
      showNotice('Please provide a Design Name', 'error');
      return;
    }

    const calculatedPrice = salesMode === 'price-on-request' ? null : (Number(priceINR) || 120000);
    const generatedHandle = designName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalSku = sku.trim() || `EDJ-${category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newDesign: Product = {
      id: editingProductId || `edj-${category.substring(0, 3)}-${Date.now().toString().slice(-4)}`,
      handle: generatedHandle,
      name: designName.trim(),
      sku: finalSku,
      category,
      collection: collection.trim() || 'Atelier Collection',
      salesMode,
      price: calculatedPrice,
      leadTimeDays: salesMode === 'ready-to-buy' ? (Number(leadTimeDays) || 2) : (Number(leadTimeDays) || 18),
      stockQuantity: salesMode === 'ready-to-buy' ? Number(stockQuantity) : 0,
      imageUrl: uploadedImageUrl || undefined,
      imageTag: visualTag || (category === 'mangalsutras' ? 'mangalsutra-solitaire' : category === 'rings' ? 'ring-pear-solitaire' : 'earrings-diamond-studs'),
      galleryAngles: ['front-hero', 'profile-setting', 'hand-worn-scale'],
      metal,
      purity: metalPurity,
      netMetalWeightGrams: parseFloat(netMetalWeight) || 5.0,
      grossWeightGrams: parseFloat(grossWeight) || 5.5,
      hallmarkRecord: hallmarkRecord || 'BIS Hallmark 750 (KA88219)',
      huidCode: huidCode || 'MH99210',
      makingCharges: makingCharges || '₹850 / gram',
      settingType: settingType || '4-Prong Comfort Crown',
      naturalStones: {
        species: gemstoneSpecies || 'Natural Diamond',
        origin: gemstoneOrigin || 'Kimberley Process Compliant',
        treatment: gemstoneTreatment || 'Untreated',
        count: 1,
        totalCaratWeight: parseFloat(gemstoneTotalCarats) || 1.0,
        centerStone: gemstoneCenterNotes || 'Center Gemstone',
      },
      diamondDetails: {
        cut: diamondCut,
        color: diamondColor,
        clarity: diamondClarity,
        carat: parseFloat(gemstoneTotalCarats) || 1.0,
        fluorescence: diamondFluorescence,
        symmetry: diamondSymmetry,
      },
      accentStonesDetails: accentStonesNotes,
      certification: {
        lab: certLab,
        reportNumber: certReportNumber || `CERT-${Math.floor(100000 + Math.random() * 900000)}`,
        date: '2026-09-25',
        verifiable: true,
      },
      story: story.trim() || 'Mastercrafted in our Mumbai atelier with comfort-fit shank.',
      specifications: {
        'Metal Purity': metalPurity || metal,
        'Net Metal Weight': `${netMetalWeight} grams`,
        'Gross Weight': `${grossWeight} grams`,
        'BIS Hallmark & HUID': `${hallmarkRecord} · HUID: ${huidCode}`,
        'Diamond 4Cs': `${diamondCut} · ${diamondColor}/${diamondClarity} · ${gemstoneTotalCarats} ct`,
        'Certification': `${certLab} Report: ${certReportNumber}`,
        'Crafting Atelier': 'Elite Designer Jewelry, Andheri West, Mumbai',
      },
      featured: true,
    };

    // Category specifics
    if (category === 'mangalsutras') {
      newDesign.mangalsutraLengthInches = mangalsutraLength;
      newDesign.mangalsutraLengthCm = Math.round(mangalsutraLength * 2.54 * 10) / 10;
      newDesign.mangalsutraStrandCount = mangalsutraStrands;
      newDesign.mangalsutraPendantStyle = mangalsutraStyle;
      newDesign.mangalsutraOccasion = mangalsutraOccasion;
    }
    if (category === 'pendant-sets') {
      newDesign.setInclusions = setInclusions;
      newDesign.chainIncluded = setInclusions.toLowerCase().includes('chain included');
    }
    if (category === 'rings') {
      newDesign.ringSizes = [10, 12, 14, 16, 18, 20];
      newDesign.ringBandWidthMm = ringBandWidth;
      newDesign.ringResizeEligible = true;
    }

    if (editingProductId) {
      onUpdateProduct(newDesign);
      showNotice(`Updated design "${newDesign.name}" successfully!`, 'success');
    } else {
      onAddProduct(newDesign);
      showNotice(`Published new design "${newDesign.name}" to the storefront catalog!`, 'success');
    }

    // Automatically synchronize design image and complete specifications into Admin Folder
    if (uploadedImageUrl || newDesign.imageUrl) {
      const activeUrl = uploadedImageUrl || newDesign.imageUrl || '';
      setAdminFolderAssets(prev => {
        const existingIdx = prev.findIndex(a => a.url === activeUrl || a.name.toLowerCase() === newDesign.name.toLowerCase());
        const updatedAsset: AdminUploadedAsset = {
          id: existingIdx >= 0 ? prev[existingIdx].id : `asset-${Date.now()}`,
          name: newDesign.name,
          url: activeUrl,
          category: newDesign.category,
          uploadedAt: new Date().toISOString().split('T')[0],
          fileSize: existingIdx >= 0 && prev[existingIdx].fileSize ? prev[existingIdx].fileSize : '1.8 MB',
          dimensions: '2000 x 2000',
          specsSummary: `${newDesign.metal} (${newDesign.purity || '750'}) · ${newDesign.grossWeightGrams}g · ${newDesign.diamondDetails?.carat || 1.0} ct (${newDesign.diamondDetails?.color || 'F'}/${newDesign.diamondDetails?.clarity || 'VVS1'}) · ${newDesign.certification.lab}`,
          metal: newDesign.metal,
          purity: newDesign.purity,
          netWeight: `${newDesign.netMetalWeightGrams}g`,
          grossWeight: `${newDesign.grossWeightGrams}g`,
          centerDiamond: `${newDesign.diamondDetails?.carat || 1.0} ct ${newDesign.diamondDetails?.cut || 'Round Brilliant'} · Color ${newDesign.diamondDetails?.color || 'F'} · Clarity ${newDesign.diamondDetails?.clarity || 'VVS1'}`,
          accentDiamonds: newDesign.accentStonesDetails,
          certification: `${newDesign.certification.lab} Report #${newDesign.certification.reportNumber}`,
          price: newDesign.price,
          sku: newDesign.sku,
          hallmark: newDesign.hallmarkRecord,
          huid: newDesign.huidCode,
          makingCharges: newDesign.makingCharges,
          settingType: newDesign.settingType,
          story: newDesign.story,
          specifications: {
            'Precious Metal & Purity': `${newDesign.metal} (${newDesign.purity || '750 Purity'})`,
            'Net Metal Weight': `${newDesign.netMetalWeightGrams} grams`,
            'Gross Weight': `${newDesign.grossWeightGrams} grams`,
            'BIS Hallmark & HUID': `${newDesign.hallmarkRecord} · HUID: ${newDesign.huidCode || 'MH99210'}`,
            'Center Diamond': `${newDesign.diamondDetails?.cut || 'Round Brilliant'} · ${newDesign.diamondDetails?.carat || 1.0} ct (${newDesign.diamondDetails?.color || 'F'}/${newDesign.diamondDetails?.clarity || 'VVS1'})`,
            'Accent Stones': newDesign.accentStonesDetails || 'None',
            'Mount & Setting': newDesign.settingType || '4-Prong Comfort Crown',
            'Making Charges': newDesign.makingCharges || '₹850 / gram',
            'Gemological Lab': `${newDesign.certification.lab} Verified Report #${newDesign.certification.reportNumber}`,
            'Catalog Collection': newDesign.collection,
            'Sales Mode': newDesign.salesMode === 'price-on-request' ? 'Bespoke (Price on Request)' : `Ready to Buy (₹${(newDesign.price || 0).toLocaleString('en-IN')})`
          }
        };
        if (existingIdx >= 0) {
          const next = [...prev];
          next[existingIdx] = updatedAsset;
          return next;
        }
        return [updatedAsset, ...prev];
      });
    }

    handleResetUploadForm();
  };

  const handleCreateWalkinBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingClientName || !newBookingClientEmail) {
      showNotice('Please enter client name and email', 'error');
      return;
    }
    const created: ConsultationBooking = {
      id: `EDJ-BK-${Math.floor(1000 + Math.random() * 9000)}`,
      mode: newBookingMode,
      date: newBookingDate,
      timeSlot: newBookingSlot,
      timezone: 'IST (UTC+05:30)',
      customerName: newBookingClientName,
      customerEmail: newBookingClientEmail,
      customerPhone: newBookingClientPhone || '+91 98200 00000',
      consultantName: consultantReassign,
      notes: newBookingNotes || 'Staff scheduled appointment',
      shortlistedProductIds: [],
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      meetingLink: newBookingMode === 'online' ? 'https://meet.google.com/edj-fine-appointment' : undefined,
      showroomLocation: newBookingMode === 'showroom' ? 'Elite Designer Jewelry Showroom & Atelier, 634 Shree Laxmi Plaza PCS Ltd, Laxmi Industrial Estate, New Link Road, Andheri (West), Mumbai 400053' : undefined,
    };
    onAddBooking(created);
    setShowNewBookingModal(false);
    setNewBookingClientName('');
    setNewBookingClientEmail('');
    setNewBookingClientPhone('');
    setNewBookingNotes('');
    showNotice(`Appointment ${created.id} confirmed for ${created.customerName}.`, 'success');
  };

  const handleSaveReschedule = () => {
    if (!selectedBookingForAction) return;
    const updated: ConsultationBooking = {
      ...selectedBookingForAction,
      date: rescheduleDate,
      timeSlot: rescheduleSlot,
      consultantName: consultantReassign,
      status: 'rescheduled',
      notes: internalStaffNote 
        ? `${selectedBookingForAction.notes || ''} [Staff: ${internalStaffNote}]`
        : selectedBookingForAction.notes,
    };
    onUpdateBooking(updated);
    setSelectedBookingForAction(null);
    showNotice(`Appointment ${updated.id} rescheduled to ${rescheduleDate} at ${rescheduleSlot}.`, 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffSession) {
      showNotice('No active staff session found.', 'error');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      showNotice('New passwords do not match. Please re-enter.', 'error');
      return;
    }
    const res = updateStaffPassword(staffSession.staffId, oldPasswordInput, newPasswordInput);
    if (res.success) {
      showNotice('Staff security password updated successfully!', 'success');
      setOldPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      refreshStaffList();
    } else {
      showNotice(res.error || 'Failed to update password.', 'error');
    }
  };

  const handleCreateNewStaffAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim() || !newStaffPassword.trim()) {
      showNotice('Please complete all required fields.', 'error');
      return;
    }
    const res = createStaffAccount({
      name: newStaffName.trim(),
      email: newStaffEmail.trim(),
      role: newStaffRole,
      password: newStaffPassword.trim(),
    });
    if (res.success) {
      showNotice(`Staff credentials created for ${newStaffName}!`, 'success');
      setNewStaffName('');
      setNewStaffEmail('');
      setNewStaffPassword('');
      refreshStaffList();
    } else {
      showNotice(res.error || 'Failed to register staff account.', 'error');
    }
  };

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    if (bookingFilterStatus !== 'all' && b.status !== bookingFilterStatus) return false;
    if (bookingFilterMode !== 'all' && b.mode !== bookingFilterMode) return false;
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      return b.customerName.toLowerCase().includes(q) ||
             b.customerEmail.toLowerCase().includes(q) ||
             b.id.toLowerCase().includes(q) ||
             b.consultantName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-6xl bg-[#FFFDFB] text-[#282329] shadow-2xl overflow-hidden border border-stone-300 my-auto flex flex-col h-[92vh]"
        role="dialog"
      >
        {/* Admin Navigation Top Header */}
        <div className="px-4 sm:px-6 py-3 bg-[#042326] text-white flex items-center justify-between border-b border-[#0d7480]/30 shadow-md">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg tracking-tight font-medium text-white">Elite Atelier Workspace</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 uppercase tracking-widest font-mono">
                  {staffSession ? staffSession.role : 'Authorized Staff'}
                </span>
              </div>
              <p className="text-[11px] text-teal-200/80 font-sans hidden sm:block">
                Staff: <span className="font-medium text-white">{staffSession?.name || 'Jigna Khakhar'}</span> ({staffSession?.email || 'jigna@elitedesignerjewelry.com'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Upload Button right in header */}
            <button
              onClick={() => { handleResetUploadForm(); setActiveTab('upload'); }}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#083338] text-white hover:bg-[#0c444a] border border-[#d4af37]/40 text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Upload Design</span>
            </button>

            {/* Quick Link to Images Folder */}
            <button
              onClick={() => setActiveTab('media')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/40 text-teal-200 hover:text-white border border-teal-500/30 text-xs font-medium uppercase tracking-wider cursor-pointer"
            >
              <Folder className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Design Images Folder ({adminFolderAssets.length})</span>
            </button>

            {/* Staff Role Switcher */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs bg-black/40 px-2.5 py-1 border border-teal-500/20">
              <span className="text-teal-200/70">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as StaffRole)}
                className="bg-transparent text-[#d4af37] font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Owner (Jigna Khakhar)" className="text-black">Owner (Jigna Khakhar)</option>
                <option value="Catalog Editor" className="text-black">Catalog Editor (Upload & Media)</option>
                <option value="Consultant" className="text-black">Consultant (Calendar & Enquiries)</option>
                <option value="Operations" className="text-black">Operations (QC Milestones & Orders)</option>
              </select>
            </div>

            {/* Sign Out Button */}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="px-2.5 py-1.5 bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-700/50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Lock Workspace and Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out & Lock</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-teal-200 hover:text-white cursor-pointer ml-1"
              title="Close Portal View"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-6 bg-[#083338]/10 border-b border-teal-900/20 flex gap-4 sm:gap-6 text-xs font-medium uppercase tracking-wider overflow-x-auto bg-stone-100">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 flex items-center gap-1.5 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'dashboard' ? 'border-[#083338] text-[#083338] font-bold' : 'border-transparent text-stone-600 hover:text-black'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 flex items-center gap-1.5 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'upload' ? 'border-[#083338] text-[#083338] font-bold' : 'border-transparent text-stone-600 hover:text-black'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-[#0d7480]" />
            <span>Upload Design</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`py-3 flex items-center gap-1.5 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'media' ? 'border-[#083338] text-[#083338] font-bold' : 'border-transparent text-stone-600 hover:text-black'
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>Design Images Folder ({adminFolderAssets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 flex items-center gap-1.5 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'catalog' ? 'border-[#083338] text-[#083338] font-bold' : 'border-transparent text-stone-600 hover:text-black'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Live Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-3 flex items-center gap-1.5 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'calendar' ? 'border-[#083338] text-[#083338] font-bold' : 'border-transparent text-stone-600 hover:text-black'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Consultation Calendar ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`py-3 flex items-center gap-1.5 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'enquiries' ? 'border-[#083338] text-[#083338] font-bold' : 'border-transparent text-stone-600 hover:text-black'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Bespoke Enquiries ({enquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 flex items-center gap-1.5 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'orders' ? 'border-[#083338] text-[#083338] font-bold' : 'border-transparent text-stone-600 hover:text-black'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders & QC Milestones ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`py-3 flex items-center gap-1.5 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'staff' ? 'border-[#083338] text-[#083338] font-bold' : 'border-transparent text-stone-600 hover:text-black'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>Staff & Security</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FFFDFB]">
          
          {/* Notification Toast */}
          {toastNotice && (
            <div className={`mb-4 p-3.5 border text-xs flex items-center justify-between gap-2 shadow-xs transition-all ${
              toastNotice.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : toastNotice.type === 'info'
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <div className="flex items-center gap-2">
                {toastNotice.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span className="font-medium">{toastNotice.message}</span>
              </div>
              <button 
                onClick={() => setToastNotice(null)}
                className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Actions Bar */}
              <div className="p-4 bg-gradient-to-r from-teal-50/50 via-teal-50/30 to-stone-50 border border-teal-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg text-[#083338] font-semibold">Jigna Khakhar Atelier Control Center</h3>
                  <p className="text-xs text-stone-600">
                    Currently managing <strong>{products.length}</strong> active store pieces and <strong>{bookings.length}</strong> customer appointments.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { handleResetUploadForm(); setActiveTab('upload'); }}
                    className="px-4 py-2 bg-[#083338] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#0c444a] border border-[#d4af37]/40 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Upload New Jewelry</span>
                  </button>

                  <button
                    onClick={() => setShowNewBookingModal(true)}
                    className="px-4 py-2 border border-stone-300 bg-white hover:bg-stone-100 text-xs font-semibold uppercase tracking-wider text-stone-800 cursor-pointer flex items-center gap-1.5"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-[#0d7480]" />
                    <span>Schedule Walk-In</span>
                  </button>

                  {products.length === 0 && (
                    <button
                      onClick={onResetSampleCatalog}
                      className="px-3.5 py-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-xs font-medium text-amber-900 cursor-pointer flex items-center gap-1"
                      title="Populate catalog with Jigna Khakhar's sample showcase pieces"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>Load Curated Archive Pieces</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white border border-stone-200">
                  <span className="text-[10px] uppercase font-mono text-stone-400 block">Total Catalog Designs</span>
                  <p className="font-serif text-2xl font-medium text-[#083338] mt-1 tabular-nums">
                    {products.length} Designs
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    {products.length === 0 ? 'Catalog is empty (Ready for upload)' : 'Active in Boutique'}
                  </p>
                </div>

                <div className="p-4 bg-white border border-stone-200">
                  <span className="text-[10px] uppercase font-mono text-stone-400 block">Consultation Appointments</span>
                  <p className="font-serif text-2xl font-medium text-[#083338] mt-1 tabular-nums">
                    {upcomingAppointmentsCount} Confirmed
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">Online Video & Mumbai Showroom</p>
                </div>

                <div className="p-4 bg-white border border-stone-200">
                  <span className="text-[10px] uppercase font-mono text-stone-400 block">Bespoke Quotation Enquiries</span>
                  <p className="font-serif text-2xl font-medium text-[#083338] mt-1 tabular-nums">
                    {activeEnquiriesCount} Pending
                  </p>
                  <p className="text-[11px] text-amber-700 mt-1">1 business day response target</p>
                </div>

                <div className="p-4 bg-white border border-stone-200">
                  <span className="text-[10px] uppercase font-mono text-stone-400 block">BIS Hallmark Integrity</span>
                  <p className="font-serif text-2xl font-medium text-emerald-800 mt-1">
                    100% Compliant
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">750 / 916 Sovereign Assay</p>
                </div>
              </div>

              {/* Operational Guide for Jigna Khakhar & Team */}
              <div className="p-4 bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-700">
                <h4 className="font-serif text-base text-[#083338] font-semibold">Storefront Publishing Safeguards</h4>
                <p>
                  1. <strong>Direct Cart Restrictions:</strong> Price on Request designs can never enter a zero-price cart. They redirect shoppers to the bespoke quotation request workflow.
                </p>
                <p>
                  2. <strong>Explicit Inclusions:</strong> Pendant sets require exact declarations (*e.g. 1 Pendant + 1 Pair of Earrings*). Mangalsutras must have chain length in inches/cm and strand count declared.
                </p>
                <p>
                  3. <strong>Appointment Buffers:</strong> All appointments enforce a 30-minute meeting window with 15-minute buffers and 24-hour minimum notice.
                </p>
              </div>
            </div>
          )}

          {/* 2. UPLOAD NEW DESIGN FORM */}
          {activeTab === 'upload' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="font-serif text-xl text-[#083338]">
                    {editingProductId ? 'Edit Jewelry Design' : 'Upload & Publish New Jewelry Creation'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Add new certified diamond, gold, or precious gemstone designs directly to the boutique storefront.
                  </p>
                </div>
                {editingProductId && (
                  <button
                    onClick={handleResetUploadForm}
                    className="text-xs text-[#0d7480] underline cursor-pointer"
                  >
                    Cancel Editing & Create New
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveOrPublishDesign} className="space-y-6 text-xs">
                
                {/* 1. Design Photography & Admin Folder Integration */}
                <div className="p-4 bg-white border border-teal-100 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#083338] flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-[#d4af37]" />
                        <span>1. Design Photography & Admin Folder Asset</span>
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Upload high-resolution design photography or select an asset from the Admin Design Images Folder.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMediaPickerOpen(true)}
                      className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-[#083338] border border-teal-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-[#c59b27]" />
                      <span>Choose from Admin Folder ({adminFolderAssets.length})</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                    {/* Image Preview Box */}
                    <div className="relative aspect-square bg-[#042326] border-2 border-dashed border-[#d4af37]/40 overflow-hidden flex flex-col items-center justify-center group">
                      {uploadedImageUrl ? (
                        <>
                          <img 
                            src={uploadedImageUrl} 
                            alt={designName || 'Uploaded Design'} 
                            className="w-full h-full object-cover object-center" 
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-2 py-1 bg-white text-[#083338] text-[10px] font-semibold uppercase cursor-pointer"
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              onClick={() => setUploadedImageUrl('')}
                              className="px-2 py-1 bg-red-800 text-white text-[10px] font-semibold uppercase cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                          <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 text-[#d4af37] px-2 py-0.5 font-mono border border-[#d4af37]/30">
                            Attached Photo
                          </span>
                        </>
                      ) : (
                        <div className="p-4 text-center space-y-2">
                          <ImageIcon className="w-10 h-10 text-[#d4af37]/60 mx-auto" />
                          <p className="text-[11px] text-teal-200/80 font-medium">No Image Uploaded Yet</p>
                          <p className="text-[10px] text-teal-200/50">Storefront will display high-precision SVG render as fallback</p>
                        </div>
                      )}
                    </div>

                    {/* Image Upload Inputs & Actions */}
                    <div className="sm:col-span-2 space-y-3">
                      <div className="p-3 bg-teal-50/40 border border-teal-100 space-y-2">
                        <label className="block text-stone-700 font-medium text-xs">
                          Upload Design Image File (JPG, PNG, WEBP up to 8MB)
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, false)}
                          className="w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-[#083338] file:text-white hover:file:bg-[#0c444a] file:cursor-pointer cursor-pointer border border-stone-300 bg-white"
                        />
                        <p className="text-[10px] text-teal-800">
                          Automatically archives this uploaded photograph into the Admin Design Images Folder for future reuse.
                        </p>
                      </div>

                      <div>
                        <label className="block text-stone-600 mb-1 font-medium">Or Direct Image URL (CDN / Cloud Hosted)</label>
                        <input
                          type="url"
                          value={uploadedImageUrl}
                          onChange={(e) => setUploadedImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/... or https://cdn.atelier.com/..."
                          className="w-full p-2 border border-stone-300 bg-white font-mono text-xs focus:outline-none focus:border-[#083338]"
                        />
                      </div>

                      {/* Quick Presets row */}
                      <div>
                        <span className="block text-[11px] text-stone-500 mb-1 font-medium">Quick Select from Admin Folder Presets:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {adminFolderAssets.slice(0, 4).map(asset => (
                            <button
                              key={asset.id}
                              type="button"
                              onClick={() => handleSelectAssetForDesign(asset)}
                              className="px-2 py-1 bg-stone-100 hover:bg-teal-50 hover:border-teal-300 border border-stone-200 text-[10px] text-stone-700 flex items-center gap-1 cursor-pointer"
                            >
                              <img src={asset.url} alt="" className="w-3.5 h-3.5 object-cover rounded-xs" />
                              <span className="truncate max-w-[120px]">{asset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 2. Basic Identity */}
                <div className="p-4 bg-white border border-stone-200 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#083338] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>2. Identity & Classification</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-stone-600 mb-1 font-medium">Design Name *</label>
                      <input
                        type="text"
                        required
                        value={designName}
                        onChange={(e) => setDesignName(e.target.value)}
                        placeholder="e.g. Maharani Pigeon-Blood Ruby & Diamond Suite"
                        className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#083338] font-serif text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">SKU Reference</label>
                      <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="e.g. EDJ-SET-MAH02 (or auto)"
                        className="w-full p-2 border border-stone-300 bg-white font-mono text-xs focus:outline-none focus:border-[#083338]"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as JewelryCategory)}
                        className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#083338]"
                      >
                        <option value="rings">Solitaires & Rings</option>
                        <option value="mangalsutras">Mangalsutras</option>
                        <option value="pendant-sets">Pendant Sets</option>
                        <option value="earrings">Earrings</option>
                        <option value="necklaces">Necklaces</option>
                        <option value="bracelets">Bracelets</option>
                        <option value="pendants">Pendants</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Collection</label>
                      <select
                        value={collection}
                        onChange={(e) => setCollection(e.target.value)}
                        className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#083338]"
                      >
                        <option value="Signature Solitaires">Signature Solitaires</option>
                        <option value="Royal Heritage">Royal Heritage</option>
                        <option value="Modern Heirlooms">Modern Heirlooms</option>
                        <option value="Heritage Color">Heritage Color</option>
                        <option value="Celestial Light">Celestial Light</option>
                        <option value="High Atelier Works">High Atelier Works</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Fallback Vector Silhouette</label>
                      <select
                        value={visualTag}
                        onChange={(e) => setVisualTag(e.target.value)}
                        className="w-full p-2 border border-stone-300 bg-white focus:outline-none"
                      >
                        <option value="ring-pear-solitaire">Pear Solitaire Ring</option>
                        <option value="ring-emerald-halo">Emerald Step-Cut Halo</option>
                        <option value="ring-marquise-couture">Marquise Couture Ring</option>
                        <option value="mangalsutra-solitaire">Solitaire Mangalsutra</option>
                        <option value="mangalsutra-geometric">Geometric Dual-Strand Mangalsutra</option>
                        <option value="mangalsutra-bridal-heritage">Bridal Kundan Mangalsutra</option>
                        <option value="pendant-set-dewdrop">Diamond Dewdrop Set</option>
                        <option value="pendant-set-ruby">Burmese Ruby Set</option>
                        <option value="earrings-diamond-studs">Diamond Studs</option>
                        <option value="earrings-polki-chandelier">Polki Chandelier Earrings</option>
                        <option value="necklace-tennis-diamond">Tennis Necklace</option>
                        <option value="necklace-hasli-polki">Hasli Polki Choker</option>
                        <option value="bracelet-tennis-classic">Tennis Bracelet</option>
                        <option value="bracelet-open-cuff">Architectural Cuff</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Sales Mode, Pricing & Stock */}
                <div className="p-4 bg-white border border-stone-200 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#083338]">
                    3. Commercials, Pricing & Making Charges
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Sales Mode *</label>
                      <select
                        value={salesMode}
                        onChange={(e) => setSalesMode(e.target.value as SalesMode)}
                        className="w-full p-2 border border-stone-300 bg-white font-medium"
                      >
                        <option value="ready-to-buy">Ready to Buy (Stocked)</option>
                        <option value="made-to-order">Made to Order (Fixed Price)</option>
                        <option value="price-on-request">Price on Request (Bespoke)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">
                        Price in INR {salesMode === 'price-on-request' ? '(Quoted via Atelier)' : '*'}
                      </label>
                      <input
                        type="number"
                        disabled={salesMode === 'price-on-request'}
                        value={salesMode === 'price-on-request' ? '' : priceINR}
                        onChange={(e) => setPriceINR(e.target.value)}
                        placeholder={salesMode === 'price-on-request' ? 'Quotation Route' : 'e.g. 185000'}
                        className="w-full p-2 border border-stone-300 bg-white font-mono disabled:bg-stone-100 disabled:text-stone-400"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Making Charges</label>
                      <input
                        type="text"
                        value={makingCharges}
                        onChange={(e) => setMakingCharges(e.target.value)}
                        placeholder="e.g. ₹850 / gram or 12%"
                        className="w-full p-2 border border-stone-300 bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Stock Quantity</label>
                      <input
                        type="number"
                        min="0"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                        className="w-full p-2 border border-stone-300 bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Crafting Lead Time (Days)</label>
                      <input
                        type="number"
                        min="1"
                        value={leadTimeDays}
                        onChange={(e) => setLeadTimeDays(parseInt(e.target.value) || 1)}
                        className="w-full p-2 border border-stone-300 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Precious Metal, Weight & BIS Hallmarking */}
                <div className="p-4 bg-white border border-stone-200 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#083338]">
                    4. Precious Metal, Purity & BIS Hallmarking (Govt. of India Standards)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Precious Metal</label>
                      <select
                        value={metal}
                        onChange={(e) => {
                          const val = e.target.value as MetalType;
                          setMetal(val);
                          if (val.includes('22K')) setMetalPurity('22K (916 Purity)');
                          else if (val.includes('18K')) setMetalPurity('18K (750 Purity)');
                          else if (val.includes('Platinum')) setMetalPurity('Pt 950 Sovereign');
                        }}
                        className="w-full p-2 border border-stone-300 bg-white"
                      >
                        <option value="18K Yellow Gold">18K Yellow Gold</option>
                        <option value="18K Rose Gold">18K Rose Gold</option>
                        <option value="18K White Gold">18K White Gold</option>
                        <option value="22K Yellow Gold">22K Yellow Gold</option>
                        <option value="Platinum 950">Platinum 950</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Purity Declaration</label>
                      <input
                        type="text"
                        value={metalPurity}
                        onChange={(e) => setMetalPurity(e.target.value)}
                        placeholder="e.g. 18K (750 Purity)"
                        className="w-full p-2 border border-stone-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Net Metal Weight (g)</label>
                      <input
                        type="text"
                        value={netMetalWeight}
                        onChange={(e) => setNetMetalWeight(e.target.value)}
                        placeholder="e.g. 5.20"
                        className="w-full p-2 border border-stone-300 bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Gross Weight (g)</label>
                      <input
                        type="text"
                        value={grossWeight}
                        onChange={(e) => setGrossWeight(e.target.value)}
                        placeholder="e.g. 5.80"
                        className="w-full p-2 border border-stone-300 bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">BIS Hallmark Stamping</label>
                      <input
                        type="text"
                        value={hallmarkRecord}
                        onChange={(e) => setHallmarkRecord(e.target.value)}
                        placeholder="e.g. BIS Hallmark 750 (KA88219)"
                        className="w-full p-2 border border-stone-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Unique 6-Digit BIS HUID</label>
                      <input
                        type="text"
                        value={huidCode}
                        onChange={(e) => setHuidCode(e.target.value)}
                        placeholder="e.g. MH99210"
                        className="w-full p-2 border border-stone-300 bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Setting Architecture</label>
                      <input
                        type="text"
                        value={settingType}
                        onChange={(e) => setSettingType(e.target.value)}
                        placeholder="e.g. 4-Prong Comfort Crown"
                        className="w-full p-2 border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Complete Diamond 4Cs & Gemstone Specifications */}
                <div className="p-4 bg-white border border-stone-200 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#083338]">
                    5. Diamond 4Cs & Natural Gemstone Disclosures
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Gemstone Species</label>
                      <input
                        type="text"
                        value={gemstoneSpecies}
                        onChange={(e) => setGemstoneSpecies(e.target.value)}
                        placeholder="e.g. Natural Diamond, Colombian Emerald"
                        className="w-full p-2 border border-stone-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Center Carat Weight</label>
                      <input
                        type="text"
                        value={gemstoneTotalCarats}
                        onChange={(e) => setGemstoneTotalCarats(e.target.value)}
                        placeholder="e.g. 1.25"
                        className="w-full p-2 border border-stone-300 bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Diamond Cut Shape</label>
                      <select
                        value={diamondCut}
                        onChange={(e) => setDiamondCut(e.target.value)}
                        className="w-full p-2 border border-stone-300 bg-white"
                      >
                        <option value="Round Brilliant">Round Brilliant</option>
                        <option value="Pear Brilliant">Pear Brilliant</option>
                        <option value="Emerald Step-Cut">Emerald Step-Cut</option>
                        <option value="Oval Brilliant">Oval Brilliant</option>
                        <option value="Marquise Cut">Marquise Cut</option>
                        <option value="Cushion Brilliant">Cushion Brilliant</option>
                        <option value="Princess Cut">Princess Cut</option>
                        <option value="Rose Cut Heritage">Rose Cut Heritage</option>
                        <option value="Uncut Polki Diamond">Uncut Polki Diamond</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Diamond Color</label>
                      <select
                        value={diamondColor}
                        onChange={(e) => setDiamondColor(e.target.value)}
                        className="w-full p-2 border border-stone-300 bg-white font-mono"
                      >
                        <option value="D">D (Exceptional White+)</option>
                        <option value="E">E (Exceptional White)</option>
                        <option value="F">F (Rare White+)</option>
                        <option value="G">G (Rare White)</option>
                        <option value="H">H (White)</option>
                        <option value="Fancy Vivid Yellow">Fancy Vivid Yellow</option>
                        <option value="Fancy Pink">Fancy Pink</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Diamond Clarity</label>
                      <select
                        value={diamondClarity}
                        onChange={(e) => setDiamondClarity(e.target.value)}
                        className="w-full p-2 border border-stone-300 bg-white font-mono"
                      >
                        <option value="FL">FL (Flawless)</option>
                        <option value="IF">IF (Internally Flawless)</option>
                        <option value="VVS1">VVS1 (Very Very Slightly Included 1)</option>
                        <option value="VVS2">VVS2 (Very Very Slightly Included 2)</option>
                        <option value="VS1">VS1 (Very Slightly Included 1)</option>
                        <option value="VS2">VS2 (Very Slightly Included 2)</option>
                        <option value="SI1">SI1 (Slightly Included 1)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Polish & Symmetry</label>
                      <input
                        type="text"
                        value={diamondSymmetry}
                        onChange={(e) => setDiamondSymmetry(e.target.value)}
                        placeholder="e.g. Triple Excellent"
                        className="w-full p-2 border border-stone-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Fluorescence</label>
                      <select
                        value={diamondFluorescence}
                        onChange={(e) => setDiamondFluorescence(e.target.value)}
                        className="w-full p-2 border border-stone-300 bg-white"
                      >
                        <option value="None / Inert">None / Inert</option>
                        <option value="Faint Blue">Faint Blue</option>
                        <option value="Medium Blue">Medium Blue</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Natural Origin</label>
                      <input
                        type="text"
                        value={gemstoneOrigin}
                        onChange={(e) => setGemstoneOrigin(e.target.value)}
                        placeholder="e.g. Kimberley Process Certified, Botswana"
                        className="w-full p-2 border border-stone-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Center Stone Description</label>
                      <input
                        type="text"
                        value={gemstoneCenterNotes}
                        onChange={(e) => setGemstoneCenterNotes(e.target.value)}
                        placeholder="e.g. 1.15 ct Pear Brilliant Diamond (E/VVS1) with micro claw prongs"
                        className="w-full p-2 border border-stone-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Accent / Pavé Diamonds</label>
                      <input
                        type="text"
                        value={accentStonesNotes}
                        onChange={(e) => setAccentStonesNotes(e.target.value)}
                        placeholder="e.g. 36 micro-pavé diamonds (0.38 ct tw, F-G/VVS)"
                        className="w-full p-2 border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Certification & Authentication */}
                <div className="p-4 bg-white border border-stone-200 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#083338]">
                    6. Gemological Certification & Laser Inscription
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Certification Lab</label>
                      <select
                        value={certLab}
                        onChange={(e) => setCertLab(e.target.value as any)}
                        className="w-full p-2 border border-stone-300 bg-white"
                      >
                        <option value="GIA">GIA (Gemological Institute of America)</option>
                        <option value="IGI">IGI (International Gemological Institute)</option>
                        <option value="BIS Hallmark">BIS Hallmark (Govt. of India)</option>
                        <option value="SGL">SGL (Solitaire Gemmological Laboratories)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Report Number</label>
                      <input
                        type="text"
                        value={certReportNumber}
                        onChange={(e) => setCertReportNumber(e.target.value)}
                        placeholder="e.g. GIA-2489104821"
                        className="w-full p-2 border border-stone-300 bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Girdle Laser Inscription</label>
                      <input
                        type="text"
                        value={laserInscription}
                        onChange={(e) => setLaserInscription(e.target.value)}
                        placeholder="e.g. GIA 2489104821"
                        className="w-full p-2 border border-stone-300 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 7. Category-Specific Rules */}
                {category === 'mangalsutras' && (
                  <div className="p-4 bg-teal-50/50 border border-teal-100 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#083338]">
                      Mangalsutra Specific Fields
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-stone-600 mb-1 font-medium">Chain Length</label>
                        <select
                          value={mangalsutraLength}
                          onChange={(e) => setMangalsutraLength(parseInt(e.target.value) as 16 | 18 | 22 | 36)}
                          className="w-full p-2 border border-stone-300 bg-white"
                        >
                          <option value={16}>16 inches (40.6 cm)</option>
                          <option value={18}>18 inches (45.7 cm)</option>
                          <option value={22}>22 inches (55.8 cm)</option>
                          <option value={36}>36 inches (91.4 cm)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-600 mb-1 font-medium">Strand Count</label>
                        <select
                          value={mangalsutraStrands}
                          onChange={(e) => setMangalsutraStrands(e.target.value as any)}
                          className="w-full p-2 border border-stone-300 bg-white"
                        >
                          <option value="Single Strand">Single Strand</option>
                          <option value="Double Strand">Double Strand</option>
                          <option value="Artisanal Triple String">Artisanal Triple String</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-600 mb-1 font-medium">Pendant Style</label>
                        <select
                          value={mangalsutraStyle}
                          onChange={(e) => setMangalsutraStyle(e.target.value as any)}
                          className="w-full p-2 border border-stone-300 bg-white"
                        >
                          <option value="Solitaire">Solitaire</option>
                          <option value="Geometric">Geometric</option>
                          <option value="Traditional Floral">Traditional Floral</option>
                          <option value="Cluster">Cluster</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-600 mb-1 font-medium">Occasion</label>
                        <select
                          value={mangalsutraOccasion}
                          onChange={(e) => setMangalsutraOccasion(e.target.value as any)}
                          className="w-full p-2 border border-stone-300 bg-white"
                        >
                          <option value="Everyday Luxury">Everyday Luxury</option>
                          <option value="Festive">Festive</option>
                          <option value="Bridal">Bridal</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {category === 'pendant-sets' && (
                  <div className="p-4 bg-teal-50/50 border border-teal-100 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#083338]">
                      Pendant Set Inclusions
                    </h4>
                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Explicit Set Inclusions Declaration *</label>
                      <input
                        type="text"
                        value={setInclusions}
                        onChange={(e) => setSetInclusions(e.target.value)}
                        placeholder="e.g. 1 Pendant + 1 Pair of Earrings (2 Earrings). 18k Spiga chain included."
                        className="w-full p-2 border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                )}

                {category === 'rings' && (
                  <div className="p-4 bg-teal-50/50 border border-teal-100 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#083338]">
                      Solitaire & Ring Sizing
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-600 mb-1 font-medium">Band Width (mm)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={ringBandWidth}
                          onChange={(e) => setRingBandWidth(parseFloat(e.target.value) || 2.2)}
                          className="w-full p-2 border border-stone-300 bg-white font-mono"
                        />
                      </div>
                      <div className="flex items-center pt-5">
                        <span className="text-xs text-stone-600">
                          ✓ Available in Indian standard ring sizes 10 through 20 with 90-day complimentary resizing.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. Narrative & Craftsmanship Story */}
                <div className="p-4 bg-white border border-stone-200 space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#083338]">
                    8. Atelier Story & Craftsmanship Description
                  </label>
                  <textarea
                    rows={3}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Describe inspiration, stone setting technique, and bench finishing..."
                    className="w-full p-2 border border-stone-300 bg-white text-xs focus:outline-none focus:border-[#083338]"
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleResetUploadForm}
                    className="px-4 py-2.5 border border-stone-300 text-stone-700 text-xs font-medium uppercase tracking-wider hover:bg-stone-50 cursor-pointer"
                  >
                    Reset Form
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#083338] text-white border border-[#d4af37]/40 text-xs font-semibold uppercase tracking-wider hover:bg-[#0c444a] cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-[#d4af37]" />
                    <span>{editingProductId ? 'Update & Save Changes' : 'Publish Design to Boutique'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2.5 ADMIN DESIGN IMAGES FOLDER */}
          {activeTab === 'media' && (
            <div className="space-y-5">
              {/* Hidden file input for folder upload */}
              <input
                ref={folderFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageFileUpload(e, true)}
                className="hidden"
              />

              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-teal-100 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-serif text-lg text-[#083338] font-semibold">
                      Admin Design Images Folder
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 bg-teal-50 text-[#083338] border border-teal-200 font-mono font-semibold">
                      {adminFolderAssets.length} Design Assets
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Central archive of high-resolution jewelry design photographs, CAD visuals, and detailed gemological specifications.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => folderFileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#083338] hover:bg-[#0c444a] text-white border border-[#d4af37]/40 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Upload Image to Folder</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { handleResetUploadForm(); setActiveTab('upload'); }}
                    className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#083338]" />
                    <span>New Design Form</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="p-3 bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
                  <div className="relative w-full">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={mediaSearchQuery}
                      onChange={(e) => setMediaSearchQuery(e.target.value)}
                      placeholder="Search design assets by name or specs..."
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 text-xs focus:outline-none focus:border-[#083338]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-stone-500 font-medium">Discipline:</span>
                  <select
                    value={mediaFilterCategory}
                    onChange={(e) => setMediaFilterCategory(e.target.value)}
                    className="p-1.5 border border-stone-300 bg-white text-xs focus:outline-none"
                  >
                    <option value="all">All Categories ({adminFolderAssets.length})</option>
                    <option value="rings">Solitaires & Rings</option>
                    <option value="mangalsutras">Mangalsutras</option>
                    <option value="pendant-sets">Pendant Sets</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="earrings">Earrings</option>
                  </select>
                </div>
              </div>

              {/* Design Images Grid */}
              {adminFolderAssets.filter(asset => {
                if (mediaFilterCategory !== 'all' && asset.category !== mediaFilterCategory) return false;
                if (mediaSearchQuery.trim()) {
                  const q = mediaSearchQuery.toLowerCase();
                  return asset.name.toLowerCase().includes(q) || 
                         (asset.specsSummary && asset.specsSummary.toLowerCase().includes(q)) ||
                         asset.category.toLowerCase().includes(q);
                }
                return true;
              }).length === 0 ? (
                <div className="p-16 text-center bg-stone-50 border border-stone-200 space-y-3">
                  <FileImage className="w-12 h-12 text-stone-300 mx-auto" />
                  <h4 className="font-serif text-lg text-stone-800">No Design Images Match Filters</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Try searching for another piece or upload a new design photograph directly to this admin folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => folderFileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#083338] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Upload Design Photograph
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adminFolderAssets
                    .filter(asset => {
                      if (mediaFilterCategory !== 'all' && asset.category !== mediaFilterCategory) return false;
                      if (mediaSearchQuery.trim()) {
                        const q = mediaSearchQuery.toLowerCase();
                        return asset.name.toLowerCase().includes(q) || 
                               (asset.specsSummary && asset.specsSummary.toLowerCase().includes(q)) ||
                               asset.category.toLowerCase().includes(q);
                      }
                      return true;
                    })
                    .map((asset) => (
                      <div 
                        key={asset.id} 
                        className="bg-white border border-stone-200 hover:border-teal-400 shadow-xs flex flex-col justify-between transition-all group overflow-hidden"
                      >
                        {/* Image Preview with overlay */}
                        <div className="relative aspect-4/3 bg-[#042326] overflow-hidden">
                          <img 
                            src={asset.url} 
                            alt={asset.name} 
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                          />
                          
                          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                            <span className="text-[10px] px-2 py-0.5 bg-black/80 text-[#d4af37] font-mono uppercase tracking-wider border border-[#d4af37]/30">
                              {asset.category}
                            </span>
                          </div>

                          <div className="absolute top-2 right-2">
                            <span className="text-[9px] px-1.5 py-0.5 bg-black/70 text-stone-300 font-mono">
                              {asset.fileSize || '1.8 MB'}
                            </span>
                          </div>

                          {/* Quick hover action bar */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            <button
                              type="button"
                              onClick={() => handleSelectAssetForDesign(asset)}
                              className="px-3 py-1.5 bg-[#d4af37] text-[#042326] text-xs font-semibold uppercase tracking-wider hover:bg-[#e0c35c] cursor-pointer flex items-center gap-1 shadow-md"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Use in Design</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedAssetForSpecs(asset)}
                              className="px-3 py-1.5 bg-white text-[#083338] text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 cursor-pointer flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect Specs</span>
                            </button>
                          </div>
                        </div>

                        {/* Metadata Details */}
                        <div className="p-3.5 space-y-2 text-xs flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-serif text-sm font-semibold text-stone-900 line-clamp-1">
                                {asset.name}
                              </h4>
                              <span className="text-[10px] text-stone-400 font-mono shrink-0">
                                {asset.uploadedAt}
                              </span>
                            </div>

                            {/* Specifications Summary */}
                            <p className="text-[11px] text-teal-900 bg-teal-50/70 p-2 border border-teal-100 mt-1.5 line-clamp-2">
                              <span className="font-semibold block text-[10px] uppercase text-[#0d7480] tracking-wider mb-0.5">
                                Design Specifications:
                              </span>
                              {asset.specsSummary || '18K Yellow Gold · Certified Natural Diamond Solitaire · BIS Hallmark Assayed'}
                            </p>
                          </div>

                          {/* Card Footer Actions */}
                          <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                            <button
                              type="button"
                              onClick={() => setSelectedAssetForSpecs(asset)}
                              className="text-[#0d7480] hover:text-[#083338] font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <SlidersHorizontal className="w-3 h-3 text-[#d4af37]" />
                              <span>All Specifications</span>
                            </button>

                            <div className="flex items-center gap-2">
                              <a
                                href={asset.url}
                                target="_blank"
                                rel="noreferrer"
                                download={`${asset.name}.jpg`}
                                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                                title="Open or download high-res file"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                              <button
                                type="button"
                                onClick={() => handleDeleteAsset(asset.id)}
                                className="p-1 text-stone-400 hover:text-rose-700 cursor-pointer"
                                title="Delete from admin folder"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <h3 className="font-semibold text-stone-800 uppercase tracking-wider">
                    Published Storefront Designs ({products.length})
                  </h3>
                  <p className="text-stone-500">Live products visible to customers across the seven categories</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { handleResetUploadForm(); setActiveTab('upload'); }}
                    className="px-3.5 py-1.5 bg-[#083338] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#0c444a] border border-[#d4af37]/40 cursor-pointer flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Upload New</span>
                  </button>

                  {products.length === 0 ? (
                    <button
                      onClick={onResetSampleCatalog}
                      className="px-3.5 py-1.5 bg-teal-50 text-[#083338] border border-teal-300 text-xs font-medium cursor-pointer"
                    >
                      Load Sample Archive Pieces
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (confirm('Clear all designs from store catalog?')) {
                          onClearAllProducts();
                        }
                      }}
                      className="px-3.5 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-medium cursor-pointer"
                    >
                      Clear Catalog
                    </button>
                  )}
                </div>
              </div>

              {products.length === 0 ? (
                <div className="p-16 text-center bg-stone-50 border border-stone-200 text-xs space-y-3">
                  <Package className="w-10 h-10 text-stone-400 mx-auto" />
                  <h4 className="font-serif text-lg text-[#083338]">No Designs in Storefront Catalog</h4>
                  <p className="text-stone-500 max-w-md mx-auto">
                    The store is currently empty as requested. Click &quot;Upload New&quot; above to create and publish pieces, or click &quot;Load Sample Archive Pieces&quot; to restore the initial showcase pieces.
                  </p>
                  <button
                    onClick={() => { handleResetUploadForm(); setActiveTab('upload'); }}
                    className="mt-2 px-5 py-2.5 bg-[#083338] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#0c444a] border border-[#d4af37]/40 cursor-pointer"
                  >
                    Upload First Design
                  </button>
                </div>
              ) : (
                <div className="border border-stone-200 divide-y divide-stone-200 text-xs bg-white shadow-xs">
                  <div className="grid grid-cols-12 p-3 bg-stone-100 font-semibold text-stone-700 text-[11px]">
                    <span className="col-span-4">Design Name & SKU</span>
                    <span className="col-span-2">Category</span>
                    <span className="col-span-2">Sales Mode</span>
                    <span className="col-span-2">Price (INR)</span>
                    <span className="col-span-2 text-right">Actions</span>
                  </div>

                  {products.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 p-3 items-center hover:bg-stone-50">
                      <div className="col-span-4">
                        <p className="font-medium text-stone-900">{item.name}</p>
                        <span className="text-[10px] font-mono text-stone-400">{item.sku} · {item.metal}</span>
                      </div>
                      <span className="col-span-2 uppercase text-[10px] text-stone-600 font-semibold">{item.category}</span>
                      <span className="col-span-2">
                        <span className={`text-[10px] px-2 py-0.5 border ${
                          item.salesMode === 'ready-to-buy' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : item.salesMode === 'made-to-order' 
                            ? 'bg-amber-50 text-amber-800 border-amber-200' 
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {item.salesMode}
                        </span>
                      </span>
                      <span className="col-span-2 font-mono font-medium">
                        {item.price !== null ? `₹${item.price.toLocaleString('en-IN')}` : 'Price on Request'}
                      </span>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartEditProduct(item)}
                          className="p-1 text-stone-500 hover:text-[#083338] cursor-pointer"
                          title="Edit Design"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${item.name}" from storefront catalog?`)) {
                              onDeleteProduct(item.id);
                            }
                          }}
                          className="p-1 text-stone-400 hover:text-rose-700 cursor-pointer"
                          title="Delete Design"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. CONSULTATION CALENDAR & APPOINTMENTS */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <h3 className="font-semibold text-stone-800 uppercase tracking-wider">
                    Personal Appointments & Consultation Schedule
                  </h3>
                  <p className="text-stone-500">Live booking queue (Online HD Video & Mumbai Andheri West Showroom)</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNewBookingModal(true)}
                    className="px-3.5 py-1.5 bg-[#083338] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#0c444a] border border-[#d4af37]/40 cursor-pointer flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>New Appointment</span>
                  </button>
                </div>
              </div>

              {/* Filter controls */}
              <div className="p-3 bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500 font-medium">Status:</span>
                    <select
                      value={bookingFilterStatus}
                      onChange={(e) => setBookingFilterStatus(e.target.value)}
                      className="p-1 border border-stone-300 bg-white"
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="rescheduled">Rescheduled</option>
                      <option value="completed">Completed / Attended</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500 font-medium">Mode:</span>
                    <select
                      value={bookingFilterMode}
                      onChange={(e) => setBookingFilterMode(e.target.value)}
                      className="p-1 border border-stone-300 bg-white"
                    >
                      <option value="all">All Modes</option>
                      <option value="online">Online Video</option>
                      <option value="showroom">Showroom</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center border border-stone-300 bg-white px-2 py-1">
                  <Search className="w-3.5 h-3.5 text-stone-400 mr-1.5" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search client name, email, ref..."
                    className="text-xs bg-transparent focus:outline-none w-48"
                  />
                </div>
              </div>

              {/* Bookings Table / Cards */}
              {filteredBookings.length === 0 ? (
                <div className="p-12 text-center text-stone-500 bg-stone-50 border border-stone-200 text-xs">
                  No appointments match the filter criteria.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((b) => (
                    <div key={b.id} className="p-4 bg-white border border-stone-200 text-xs space-y-3 shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-stone-400 font-bold">{b.id}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-semibold border ${
                              b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                              b.status === 'rescheduled' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                              b.status === 'completed' ? 'bg-stone-100 text-stone-800 border-stone-300' :
                              'bg-rose-50 text-rose-800 border-rose-300'
                            }`}>
                              {b.status}
                            </span>
                          </div>
                          <h4 className="font-serif text-base font-semibold text-[#083338] mt-0.5">{b.customerName}</h4>
                          <p className="text-stone-600 flex items-center gap-3 text-[11px] mt-0.5">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-stone-400" />{b.customerEmail}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-stone-400" />{b.customerPhone}</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-medium text-stone-900 block text-xs">{b.date} at {b.timeSlot}</span>
                          <span className="text-[11px] text-[#0d7480] font-semibold flex items-center justify-end gap-1 mt-0.5">
                            {b.mode === 'online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                            <span>{b.mode === 'online' ? 'Google Meet Video' : 'Mumbai Showroom'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Specialist and notes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-stone-50 p-2.5 text-[11px]">
                        <div>
                          <strong className="text-stone-500">Assigned Specialist:</strong>
                          <span className="ml-1 font-semibold text-[#083338]">{b.consultantName}</span>
                        </div>
                        <div>
                          <strong className="text-stone-500">Client Requirements:</strong>
                          <span className="ml-1 text-stone-700">{b.notes || 'None specified'}</span>
                        </div>
                      </div>

                      {/* Attached Shortlist */}
                      {b.shortlistedProductIds.length > 0 && (
                        <div className="p-2 bg-amber-50/50 border border-amber-200/60 text-[11px]">
                          <strong className="text-[#083338]">Attached Client Shortlist ({b.shortlistedProductIds.length} designs):</strong>
                          <span className="ml-2 font-mono text-stone-600">{b.shortlistedProductIds.join(', ')}</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-stone-400 text-[10px]">
                          Created on {new Date(b.createdAt).toLocaleDateString()}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedBookingForAction(b);
                              setRescheduleDate(b.date);
                              setRescheduleSlot(b.timeSlot);
                              setConsultantReassign(b.consultantName);
                            }}
                            className="px-3 py-1 border border-stone-300 hover:bg-stone-50 text-stone-700 cursor-pointer text-xs"
                          >
                            Manage / Reschedule
                          </button>

                          {b.status !== 'completed' && (
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'completed')}
                              className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 cursor-pointer text-xs"
                            >
                              Mark Attended
                            </button>
                          )}

                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                if (confirm(`Cancel appointment for ${b.customerName}?`)) {
                                  onUpdateBookingStatus(b.id, 'cancelled');
                                }
                              }}
                              className="px-3 py-1 text-rose-700 hover:bg-rose-50 cursor-pointer text-xs"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. BESPOKE ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-700 uppercase tracking-wider">
                  Bespoke Quotation Queue (Page 7 Specification)
                </span>
                <span className="text-stone-500">Auto-assigned to Jigna Khakhar</span>
              </div>

              {enquiries.length === 0 ? (
                <div className="p-12 text-center text-stone-500 bg-stone-50 border border-stone-200 text-xs">
                  No pending quotation enquiries at this moment. Customers browsing unpriced high jewelry can submit requests through the boutique.
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.map((enq) => (
                    <div key={enq.id} className="p-4 bg-white border border-stone-200 text-xs space-y-3 shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-[10px] text-stone-400">{enq.id} · {new Date(enq.createdAt).toLocaleDateString()}</span>
                          <h4 className="font-serif text-base font-semibold text-[#083338]">{enq.productName}</h4>
                          <p className="text-stone-600">Client: <strong>{enq.customerName}</strong> ({enq.customerEmail} · {enq.customerPhone})</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-mono border ${
                          enq.status === 'quoted' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                          {enq.status === 'quoted' ? `Quoted ₹${(enq.quotedPriceINR || 0).toLocaleString('en-IN')}` : 'Action Required'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-stone-50 p-2.5 text-[11px]">
                        <div><strong className="text-stone-500">Occasion:</strong> {enq.occasion || 'Bridal'}</div>
                        <div><strong className="text-stone-500">Budget Range:</strong> {enq.budgetINR || 'Flexible'}</div>
                        <div><strong className="text-stone-500">Target Date:</strong> {enq.requiredByDate || 'Flexible'}</div>
                      </div>

                      {enq.notes && (
                        <p className="italic text-stone-600 text-[11px] bg-amber-50/50 p-2 border border-amber-100">
                          &ldquo;{enq.notes}&rdquo;
                        </p>
                      )}

                      {/* Quote Generator Action */}
                      <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2">
                        <label className="text-stone-600 font-medium">Issue Formal Quote (INR):</label>
                        <input
                          type="number"
                          placeholder="e.g. 580000"
                          value={quoteInput[enq.id] || ''}
                          onChange={(e) => setQuoteInput({ ...quoteInput, [enq.id]: e.target.value })}
                          className="p-1.5 border border-stone-300 text-xs w-36 font-mono"
                        />
                        <button
                          onClick={() => handleSendQuote(enq.id)}
                          className="px-4 py-1.5 bg-[#083338] text-white font-medium hover:bg-[#0c444a] border border-[#d4af37]/40 cursor-pointer text-xs"
                        >
                          Send Official Quote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. ORDERS & QC MILESTONES */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-700 uppercase tracking-wider">
                  Order Fulfillment & Milestone Pipeline
                </span>
                <span className="text-stone-500">Insured Cargo Transit</span>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center text-stone-500 bg-stone-50 border border-stone-200 text-xs">
                  No orders placed yet. Place an order through the shopping bag to test fulfillment tracking!
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 bg-white border border-stone-200 text-xs space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-[10px] text-stone-400">Order: {ord.id} · {ord.orderDate}</span>
                          <h4 className="font-semibold text-stone-800">{ord.customerName} ({ord.phone})</h4>
                          <p className="text-stone-500 text-[11px]">{ord.shippingAddress.street}, {ord.shippingAddress.city}, PIN: {ord.shippingAddress.pincode}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-base font-bold text-[#083338]">₹{ord.total.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 block mt-0.5">
                            PAID · {ord.paymentMethod.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Milestone Progress Bar */}
                      <div className="p-3 bg-stone-50 border border-stone-200 space-y-2">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-stone-600">Active QC Stage: <strong>{ord.qcMilestone}</strong></span>
                          <span className="font-mono text-stone-500">Tracking: {ord.trackingNumber}</span>
                        </div>
                        <div className="flex gap-2">
                          {(['Cast & Pre-Polish', 'Precision Stone Setting', 'BIS Hallmark Audit', 'Insured Dispatch'] as OrderRecord['qcMilestone'][]).map(ms => (
                            <button
                              key={ms}
                              onClick={() => onUpdateOrderStatus(ord.id, ms)}
                              className={`flex-1 py-1 px-1 text-[10px] font-medium border text-center transition-colors cursor-pointer ${
                                ord.qcMilestone === ms 
                                  ? 'bg-[#083338] text-white border-[#083338]' 
                                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              {ms}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: Staff Accounts & Security Credentials */}
          {activeTab === 'staff' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              
              {/* Active Session Card */}
              <div className="p-5 bg-stone-900 text-white border border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <h3 className="font-serif text-lg text-white font-medium">Active Staff Session</h3>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono uppercase tracking-wider">
                      Authenticated
                    </span>
                  </div>
                  <p className="text-xs text-stone-300">
                    Logged in as <strong className="text-amber-200">{staffSession?.name || 'Jigna Khakhar'}</strong> ({staffSession?.email || 'jigna@elitedesignerjewelry.com'}) · Role: {staffSession?.role || 'Owner & Principal Jeweler'}
                  </p>
                  <p className="text-[11px] text-stone-400 font-mono">
                    Session established: {staffSession?.loginTime ? new Date(staffSession.loginTime).toLocaleString() : 'Active Station'}
                  </p>
                </div>

                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="px-4 py-2 bg-rose-900/80 hover:bg-rose-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors border border-rose-700 shrink-0"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out & Lock Workspace</span>
                  </button>
                )}
              </div>

              {/* Two Column Section: Change Password & Create Staff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Panel 1: Change Staff Password */}
                <div className="bg-white border border-stone-200 p-5 space-y-4 shadow-xs">
                  <div className="border-b border-stone-100 pb-2">
                    <h4 className="font-serif text-base text-[#083338] flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#0d7480]" />
                      <span>Change Security Password</span>
                    </h4>
                    <p className="text-xs text-stone-500">
                      Update the login password for your atelier staff account.
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Current Password *</label>
                      <input
                        type="password"
                        required
                        value={oldPasswordInput}
                        onChange={(e) => setOldPasswordInput(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full p-2 border border-stone-300 bg-[#FFFDFB] focus:border-[#083338] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-medium mb-1">New Password (Min. 6 chars) *</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="Create strong new password"
                        className="w-full p-2 border border-stone-300 bg-[#FFFDFB] focus:border-[#083338] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Confirm New Password *</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder="Re-type new password"
                        className="w-full p-2 border border-stone-300 bg-[#FFFDFB] focus:border-[#083338] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#083338] hover:bg-[#0c444a] text-white font-medium uppercase tracking-wider text-xs transition-colors cursor-pointer border border-[#d4af37]/40"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Panel 2: Register New Staff Account */}
                <div className="bg-white border border-stone-200 p-5 space-y-4 shadow-xs">
                  <div className="border-b border-stone-100 pb-2">
                    <h4 className="font-serif text-base text-[#083338] flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-[#0d7480]" />
                      <span>Add Atelier Staff Member</span>
                    </h4>
                    <p className="text-xs text-stone-500">
                      Grant atelier access to an authorized team member.
                    </p>
                  </div>

                  <form onSubmit={handleCreateNewStaffAccount} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newStaffName}
                        onChange={(e) => setNewStaffName(e.target.value)}
                        placeholder="e.g. Kavita Parekh"
                        className="w-full p-2 border border-stone-300 bg-[#FFFDFB] focus:border-[#083338] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Staff Email Address *</label>
                      <input
                        type="email"
                        required
                        value={newStaffEmail}
                        onChange={(e) => setNewStaffEmail(e.target.value)}
                        placeholder="kavita@elitedesignerjewelry.com"
                        className="w-full p-2 border border-stone-300 bg-[#FFFDFB] focus:border-[#083338] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Atelier Role *</label>
                      <select
                        value={newStaffRole}
                        onChange={(e) => setNewStaffRole(e.target.value as any)}
                        className="w-full p-2 border border-stone-300 bg-[#FFFDFB] focus:border-[#083338] outline-none"
                      >
                        <option value="Atelier Manager">Atelier Manager</option>
                        <option value="Master Gemologist">Master Gemologist</option>
                        <option value="Senior Consultant">Senior Consultant</option>
                        <option value="Owner & Principal Jeweler">Owner & Principal Jeweler</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Temporary Initial Password *</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={newStaffPassword}
                        onChange={(e) => setNewStaffPassword(e.target.value)}
                        placeholder="Assign password (min 6 chars)"
                        className="w-full p-2 border border-stone-300 bg-[#FFFDFB] focus:border-[#083338] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#083338] hover:bg-[#0c444a] text-white font-medium uppercase tracking-wider text-xs transition-colors cursor-pointer border border-[#d4af37]/40"
                    >
                      Authorize & Register Staff
                    </button>
                  </form>
                </div>

              </div>

              {/* Panel 3: Staff Accounts Registry */}
              <div className="bg-white border border-stone-200 p-5 space-y-4 shadow-xs">
                <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                  <div>
                    <h4 className="font-serif text-base text-[#083338]">Authorized Staff Registry</h4>
                    <p className="text-xs text-stone-500">All registered credentials permitted to access the atelier workspace.</p>
                  </div>
                  <span className="font-mono text-xs text-stone-400">Total: {staffAccountsList.length} Accounts</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-50 text-stone-500 border-b uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-2.5">Staff Name</th>
                        <th className="p-2.5">Email</th>
                        <th className="p-2.5">Role</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Member Since</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {staffAccountsList.map((acc) => {
                        const isCurrent = staffSession?.email.toLowerCase() === acc.email.toLowerCase();
                        return (
                          <tr key={acc.id} className={isCurrent ? 'bg-teal-50/50' : 'hover:bg-stone-50'}>
                            <td className="p-2.5 font-medium text-stone-800 flex items-center gap-1.5">
                              <span>{acc.name}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 bg-[#083338] text-[#d4af37] text-[9px] uppercase font-mono font-semibold rounded-xs">
                                  You
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 font-mono text-stone-600">{acc.email}</td>
                            <td className="p-2.5 text-stone-700">{acc.role}</td>
                            <td className="p-2.5">
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>Active</span>
                              </span>
                            </td>
                            <td className="p-2.5 text-stone-400 font-mono text-[11px]">
                              {new Date(acc.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* MODAL: Reschedule / Manage Appointment */}
      {selectedBookingForAction && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 space-y-4 border border-stone-300 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-serif text-base text-[#083338]">Manage Appointment: {selectedBookingForAction.id}</h4>
              <button onClick={() => setSelectedBookingForAction(null)} className="p-1 text-stone-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Client Name</label>
                <input type="text" disabled value={selectedBookingForAction.customerName} className="w-full p-2 bg-stone-100 border text-stone-600" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Reschedule Date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full p-2 border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Time Slot</label>
                  <select
                    value={rescheduleSlot}
                    onChange={(e) => setRescheduleSlot(e.target.value)}
                    className="w-full p-2 border border-stone-300 bg-white"
                  >
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Reassign Specialist</label>
                <select
                  value={consultantReassign}
                  onChange={(e) => setConsultantReassign(e.target.value)}
                  className="w-full p-2 border border-stone-300 bg-white"
                >
                  <option value="Jigna Khakhar (Principal Designer)">Jigna Khakhar (Principal Designer)</option>
                  <option value="Aarav Mehta (Senior Gemologist)">Aarav Mehta (Senior Gemologist)</option>
                  <option value="Sunita Parekh (Bridal Specialist)">Sunita Parekh (Bridal Specialist)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Internal Contact Note</label>
                <input
                  type="text"
                  value={internalStaffNote}
                  onChange={(e) => setInternalStaffNote(e.target.value)}
                  placeholder="e.g. Client requested evening slot after 5pm"
                  className="w-full p-2 border border-stone-300 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setSelectedBookingForAction(null)}
                className="px-3 py-2 border text-stone-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReschedule}
                className="px-4 py-2 bg-[#432032] text-white font-medium hover:bg-black"
              >
                Save Changes & Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create New Walk-in Appointment */}
      {showNewBookingModal && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <form onSubmit={handleCreateWalkinBooking} className="bg-white max-w-md w-full p-6 space-y-4 border border-stone-300 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-serif text-base text-[#432032]">Schedule New Consultation (Staff Booking)</h4>
              <button type="button" onClick={() => setShowNewBookingModal(false)} className="p-1 text-stone-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={newBookingClientName}
                  onChange={(e) => setNewBookingClientName(e.target.value)}
                  placeholder="e.g. Shalini Roy"
                  className="w-full p-2 border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Client Email *</label>
                  <input
                    type="email"
                    required
                    value={newBookingClientEmail}
                    onChange={(e) => setNewBookingClientEmail(e.target.value)}
                    placeholder="shalini@example.com"
                    className="w-full p-2 border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Phone</label>
                  <input
                    type="tel"
                    value={newBookingClientPhone}
                    onChange={(e) => setNewBookingClientPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full p-2 border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Mode</label>
                  <select
                    value={newBookingMode}
                    onChange={(e) => setNewBookingMode(e.target.value as any)}
                    className="w-full p-2 border border-stone-300 bg-white"
                  >
                    <option value="showroom">Showroom</option>
                    <option value="online">Online Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    value={newBookingDate}
                    onChange={(e) => setNewBookingDate(e.target.value)}
                    className="w-full p-2 border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Time Slot</label>
                  <select
                    value={newBookingSlot}
                    onChange={(e) => setNewBookingSlot(e.target.value)}
                    className="w-full p-2 border border-stone-300 bg-white"
                  >
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Requirements / Notes</label>
                <input
                  type="text"
                  value={newBookingNotes}
                  onChange={(e) => setNewBookingNotes(e.target.value)}
                  placeholder="e.g. Interested in custom bridal necklace"
                  className="w-full p-2 border border-stone-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowNewBookingModal(false)}
                className="px-3 py-2 border text-stone-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#083338] text-white font-medium hover:bg-[#0c444a]"
              >
                Create Appointment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Choose from Admin Design Images Folder (Media Picker) */}
      {mediaPickerOpen && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 sm:p-5 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-4xl w-full p-5 space-y-4 border border-teal-200 shadow-2xl text-xs max-h-[88vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#0d7480] font-semibold">
                  Atelier Media Archive
                </span>
                <h4 className="font-serif text-lg text-[#083338] font-semibold">
                  Select Design Image from Admin Folder
                </h4>
              </div>
              <button 
                type="button"
                onClick={() => setMediaPickerOpen(false)} 
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Upload or Search inside picker */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-2.5 border border-stone-200">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={mediaSearchQuery}
                  onChange={(e) => setMediaSearchQuery(e.target.value)}
                  placeholder="Filter folder assets by name or specs..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 text-xs focus:outline-none focus:border-[#083338]"
                />
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-[#083338] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-[#0c444a]"
              >
                <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Upload New Photo</span>
              </button>
            </div>

            {/* Assets Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
              {adminFolderAssets
                .filter(asset => {
                  if (mediaFilterCategory !== 'all' && asset.category !== mediaFilterCategory) return false;
                  if (mediaSearchQuery.trim()) {
                    const q = mediaSearchQuery.toLowerCase();
                    return asset.name.toLowerCase().includes(q) || 
                           (asset.specsSummary && asset.specsSummary.toLowerCase().includes(q));
                  }
                  return true;
                })
                .map(asset => (
                  <div
                    key={asset.id}
                    onClick={() => handleSelectAssetForDesign(asset)}
                    className="border border-stone-200 hover:border-[#083338] hover:shadow-md cursor-pointer transition-all bg-stone-50 group flex flex-col justify-between overflow-hidden"
                  >
                    <div className="relative aspect-square bg-[#042326] overflow-hidden">
                      <img 
                        src={asset.url} 
                        alt={asset.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                      <span className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 bg-black/80 text-[#d4af37] font-mono uppercase">
                        {asset.category}
                      </span>
                    </div>

                    <div className="p-2 space-y-1">
                      <p className="font-serif text-xs font-medium text-stone-900 line-clamp-1">
                        {asset.name}
                      </p>
                      <p className="text-[10px] text-stone-500 line-clamp-1 font-mono">
                        {asset.specsSummary?.split('·')[0] || asset.fileSize}
                      </p>
                      <button
                        type="button"
                        className="w-full mt-1 py-1 bg-teal-50 group-hover:bg-[#083338] group-hover:text-white text-[#083338] text-[10px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3 text-[#d4af37]" />
                        <span>Select Photo</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="pt-2 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setMediaPickerOpen(false)}
                className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-50 cursor-pointer"
              >
                Close Picker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Inspect All Design Specifications */}
      {selectedAssetForSpecs && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 sm:p-5 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-2xl w-full p-6 space-y-5 border border-[#d4af37]/40 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#d4af37] font-semibold bg-[#042326] px-2 py-0.5">
                  Atelier Master Specification Record
                </span>
                <h3 className="font-serif text-xl text-[#083338] font-normal mt-1">
                  {selectedAssetForSpecs.name}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedAssetForSpecs(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Asset Image Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-[#042326] p-3 border border-[#d4af37]/30">
              <div className="aspect-square overflow-hidden border border-[#d4af37]/40">
                <img 
                  src={selectedAssetForSpecs.url} 
                  alt={selectedAssetForSpecs.name} 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="sm:col-span-2 text-teal-100/90 space-y-1.5 text-xs">
                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-mono font-semibold">
                  High-Resolution Design Asset
                </span>
                <p className="font-serif text-base text-white font-medium">
                  {selectedAssetForSpecs.name}
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-stone-300 pt-1">
                  <div>Category: <span className="text-white uppercase">{selectedAssetForSpecs.category}</span></div>
                  <div>Archived: <span className="text-white">{selectedAssetForSpecs.uploadedAt}</span></div>
                  <div>File Size: <span className="text-white">{selectedAssetForSpecs.fileSize || '1.8 MB'}</span></div>
                  <div>Dimensions: <span className="text-white">{selectedAssetForSpecs.dimensions || '2000 x 2000'}</span></div>
                </div>
              </div>
            </div>

            {/* Full Specifications Grid */}
            <div className="space-y-3">
              <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#083338] border-b pb-1 flex items-center justify-between">
                <span>Technical Specifications & Gemological Disclosure</span>
                {selectedAssetForSpecs.sku && (
                  <span className="font-mono text-[10px] text-stone-500 font-normal">SKU: {selectedAssetForSpecs.sku}</span>
                )}
              </h4>

              {/* Dynamic specifications list if present */}
              {selectedAssetForSpecs.specifications ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(selectedAssetForSpecs.specifications).map(([key, val]) => (
                    <div key={key} className="p-2.5 bg-teal-50/40 border border-teal-100">
                      <span className="text-[10px] text-teal-800/80 uppercase font-mono block font-medium">{key}</span>
                      <p className="font-medium text-[#083338] mt-0.5 text-xs">{val}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-2.5 bg-stone-50 border border-stone-200">
                    <span className="text-[10px] text-stone-500 uppercase font-mono block">Precious Metal & Purity</span>
                    <p className="font-medium text-stone-900 mt-0.5">
                      {selectedAssetForSpecs.metal ? `${selectedAssetForSpecs.metal} (${selectedAssetForSpecs.purity || '750'})` : selectedAssetForSpecs.specsSummary?.split('·')[0] || '18K Yellow Gold (750 Purity)'}
                    </p>
                  </div>

                  <div className="p-2.5 bg-stone-50 border border-stone-200">
                    <span className="text-[10px] text-stone-500 uppercase font-mono block">BIS Hallmarking & HUID</span>
                    <p className="font-medium text-stone-900 mt-0.5">
                      {selectedAssetForSpecs.hallmark ? `${selectedAssetForSpecs.hallmark} · HUID: ${selectedAssetForSpecs.huid || 'MH99210'}` : 'Sovereign BIS 750 / 916 Stamped · Unique HUID MH99210'}
                    </p>
                  </div>

                  <div className="p-2.5 bg-stone-50 border border-stone-200">
                    <span className="text-[10px] text-stone-500 uppercase font-mono block">Diamond Specifications</span>
                    <p className="font-medium text-stone-900 mt-0.5">
                      {selectedAssetForSpecs.centerDiamond || selectedAssetForSpecs.specsSummary?.split('·')[1] || '1.10 ct Round Brilliant (F/VVS1) · Triple Excellent'}
                    </p>
                  </div>

                  <div className="p-2.5 bg-stone-50 border border-stone-200">
                    <span className="text-[10px] text-stone-500 uppercase font-mono block">Gemological Certification</span>
                    <p className="font-medium text-stone-900 mt-0.5">
                      {selectedAssetForSpecs.certification || selectedAssetForSpecs.specsSummary?.split('·')[2] || 'GIA Verified Report & Laser Inscription'}
                    </p>
                  </div>

                  <div className="p-2.5 bg-stone-50 border border-stone-200">
                    <span className="text-[10px] text-stone-500 uppercase font-mono block">Weight Disclosure</span>
                    <p className="font-medium text-stone-900 mt-0.5">
                      Net: {selectedAssetForSpecs.netWeight || '5.20g'} · Gross: {selectedAssetForSpecs.grossWeight || '5.80g'}
                    </p>
                  </div>

                  <div className="p-2.5 bg-stone-50 border border-stone-200">
                    <span className="text-[10px] text-stone-500 uppercase font-mono block">Setting & Bench Architecture</span>
                    <p className="font-medium text-stone-900 mt-0.5">
                      {selectedAssetForSpecs.settingType || '4-Prong Comfort Crown with Micro-Claw Prongs'}
                    </p>
                  </div>
                </div>
              )}

              {selectedAssetForSpecs.story && (
                <div className="p-2.5 bg-stone-50 border border-stone-200 text-stone-600 text-[11px] leading-relaxed">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block font-medium mb-0.5">Design Ethos & Atelier Notes</span>
                  {selectedAssetForSpecs.story}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
              <a
                href={selectedAssetForSpecs.url}
                target="_blank"
                rel="noreferrer"
                download={`${selectedAssetForSpecs.name}.jpg`}
                className="px-3.5 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download High-Res Photograph</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssetForSpecs(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSelectAssetForDesign(selectedAssetForSpecs);
                    setSelectedAssetForSpecs(null);
                    setActiveTab('upload');
                  }}
                  className="px-4 py-2 bg-[#083338] text-white hover:bg-[#0c444a] border border-[#d4af37]/40 font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Load into Design Form</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
