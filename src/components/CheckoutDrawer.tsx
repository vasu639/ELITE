import React, { useState } from 'react';
import { 
  X, Trash2, ShieldCheck, Truck, CreditCard, Lock, 
  CheckCircle2, ArrowRight, Download, Clock, QrCode, Building 
} from 'lucide-react';
import { CartItem, OrderRecord } from '../types';
import { JEWELRY_CATALOG } from '../data/jewelryCatalog';
import { JewelryVisual } from './JewelryVisual';

interface CheckoutDrawerProps {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onOrderCompleted: (order: OrderRecord) => void;
}

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'confirmed'>('cart');
  
  // Shipping form fields
  const [customerName, setCustomerName] = useState('Radhika Sharma');
  const [customerEmail, setCustomerEmail] = useState('radhika.sharma@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98200 44556');
  const [streetAddress, setStreetAddress] = useState('Flat 402, Sea Green Apartments, Worli Sea Face');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400030');
  
  // Payment simulation
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'emi' | 'wire'>('upi');
  const [upiId, setUpiId] = useState('radhika@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxGst = Math.round(subtotal * 0.03); // 3% GST on fine jewelry standard in India
  const shippingCharge = 0; // Complimentary Insured Transit
  const totalPayable = subtotal + taxGst;

  // Check if cart has mixed ready and made-to-order
  const hasReadyToBuy = cart.some(i => i.salesMode === 'ready-to-buy');
  const hasMadeToOrder = cart.some(i => i.salesMode === 'made-to-order');

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderNumber = `EDJ-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: OrderRecord = {
        id: orderNumber,
        items: [...cart],
        subtotal,
        taxGst,
        shippingCharge,
        total: totalPayable,
        customerName,
        email: customerEmail,
        phone: customerPhone,
        shippingAddress: {
          street: streetAddress,
          city,
          state,
          pincode,
        },
        paymentMethod,
        paymentStatus: 'paid',
        orderDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        estimatedDeliveryDate: hasMadeToOrder ? '18-22 Business Days' : '3-4 Business Days',
        qcMilestone: 'Cast & Pre-Polish',
        trackingNumber: `BVC-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      setConfirmedOrder(newOrder);
      onOrderCompleted(newOrder);
      setIsProcessing(false);
      setStep('confirmed');
    }, 1200);
  };

  const downloadInvoice = () => {
    if (!confirmedOrder) return;
    const invoiceText = `======================================================
ELITE DESIGNER JEWELRY BY JIGNA KHAKHAR
Tax Invoice & Provenance Guarantee
634, Shree Laxmi Plaza PCS Ltd, Laxmi Industrial Estate,
New Link Road, Andheri (West), Mumbai-400053
Contact: +91 9821156861 / +91 7506666861
GSTIN: 27AABCE9218M1ZG | BIS Certificate: 750/916
======================================================
Order Ref: ${confirmedOrder.id}
Date: ${confirmedOrder.orderDate}
Customer: ${confirmedOrder.customerName}
Delivery PIN: ${confirmedOrder.shippingAddress.pincode}, ${confirmedOrder.shippingAddress.city}
Tracking Ref: ${confirmedOrder.trackingNumber} (BVC Insured Courier)
------------------------------------------------------
Purchased Specifications:
${confirmedOrder.items.map(i => `* ${i.productName} (SKU: ${i.sku})
  Metal: ${i.selectedMetal} | Size: ${i.selectedSize || 'Standard'}
  Qty: ${i.quantity} x ₹${i.price.toLocaleString('en-IN')}`).join('\n')}
------------------------------------------------------
Subtotal: ₹${confirmedOrder.subtotal.toLocaleString('en-IN')}
GST (3% Fine Jewelry): ₹${confirmedOrder.taxGst.toLocaleString('en-IN')}
Insured Transit: COMPLIMENTARY (₹0)
TOTAL PAID: ₹${confirmedOrder.total.toLocaleString('en-IN')}
Payment Status: VERIFIED (${confirmedOrder.paymentMethod.toUpperCase()})
======================================================
All diamonds accompanied by genuine GIA/IGI grading records.
Lifetime buyback and metal exchange valid at our Mumbai showroom.`;

    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${confirmedOrder.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-[#FFFDFB] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-stone-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-teal-100 flex items-center justify-between bg-[#042326] text-white">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
              Elite Boutique Checkout
            </span>
            <h3 className="font-serif text-lg text-white">
              {step === 'cart' && 'Your Shopping Bag'}
              {step === 'shipping' && 'Delivery & Insured Transit'}
              {step === 'payment' && 'Secure Payment Gateway'}
              {step === 'confirmed' && 'Order Verification & Receipt'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-teal-200 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* STEP 1: Shopping Bag Items */}
          {step === 'cart' && (
            <div className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6 stroke-1" />
                  </div>
                  <p className="font-serif text-lg text-stone-700">Your bag is empty</p>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Explore our certified collections and add in-stock or made-to-order pieces to proceed.
                  </p>
                </div>
              ) : (
                <>
                  {/* Mixed Order Notification if applicable */}
                  {hasReadyToBuy && hasMadeToOrder && (
                    <div className="p-3 bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                      <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">Split Crafting & Transit Schedule</strong>
                        Your bag includes in-stock items (ships in 24h) and made-to-order items (handcrafted in 14-21 days). Both ship via complimentary insured courier.
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {cart.map((item) => {
                      const matched = JEWELRY_CATALOG.find(p => p.id === item.productId);
                      return (
                        <div key={item.id} className="p-3 bg-white border border-stone-200 text-xs flex gap-3 shadow-xs">
                          {matched && (
                            <div className="w-20 h-20 shrink-0 border border-stone-200 overflow-hidden">
                              <JewelryVisual product={matched} aspectRatio="square" className="w-full h-full" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] uppercase font-mono text-stone-400">
                                  SKU: {item.sku}
                                </span>
                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="text-stone-400 hover:text-rose-700 cursor-pointer p-0.5"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <h4 className="font-serif text-sm font-semibold text-[#083338] line-clamp-1">
                                {item.productName}
                              </h4>
                              <p className="text-stone-500 text-[11px] mt-0.5">
                                {item.selectedMetal} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}
                              </p>
                              {item.setInclusions && (
                                <p className="text-[10px] text-amber-900 font-medium">{item.setInclusions.split('.')[0]}</p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                              <div className="flex items-center border border-stone-300">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  className="px-2 py-0.5 hover:bg-stone-100 text-stone-600 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="px-2.5 py-0.5 font-mono text-xs tabular-nums">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="px-2 py-0.5 hover:bg-stone-100 text-stone-600 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>

                              <span className="font-mono text-stone-900 font-bold tabular-nums">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 2: Shipping & Delivery Form */}
          {step === 'shipping' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-teal-50/40 border border-teal-100">
                <p className="font-semibold text-[#083338] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0d7480]" />
                  <span>Tamper-Evident Insured Doorstep Transit</span>
                </p>
                <p className="text-stone-600">
                  Every parcel is shipped in double-sealed tamper-evident security vault packaging via specialized precious cargo couriers (BVC / Sequel Logistics). Direct signature required upon delivery.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-stone-600 mb-1 font-medium">Recipient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#083338]"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Email for Tracking *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#083338]"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Contact Phone (OTP on delivery) *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#083338]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-600 mb-1 font-medium">Street Address / Landmark *</label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#083338]"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-medium">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#083338]"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-medium">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#083338]"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Postal PIN Code *</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2 border border-stone-300 bg-white focus:outline-none focus:border-[#083338]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method & Review */}
          {step === 'payment' && (
            <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
              <div className="border border-stone-200 divide-y divide-stone-200">
                
                {/* UPI Option */}
                <div 
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer ${paymentMethod === 'upi' ? 'bg-teal-50/50' : 'bg-white'}`}
                >
                  <input type="radio" checked={paymentMethod === 'upi'} readOnly className="mt-1 accent-[#083338]" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="font-semibold text-stone-900">UPI Instant Payment (Zero Surcharge)</strong>
                      <span className="text-[10px] uppercase font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                        Fastest
                      </span>
                    </div>
                    <p className="text-stone-500 mt-0.5">Google Pay, PhonePe, Paytm, BHIM</p>
                    {paymentMethod === 'upi' && (
                      <div className="mt-3">
                        <label className="block text-[11px] text-stone-600 mb-1">Enter Virtual Payment Address (VPA)</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi"
                          className="w-full p-2 border border-stone-300 bg-white text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Credit / Debit Card Option */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer ${paymentMethod === 'card' ? 'bg-teal-50/50' : 'bg-white'}`}
                >
                  <input type="radio" checked={paymentMethod === 'card'} readOnly className="mt-1 accent-[#083338]" />
                  <div className="flex-1">
                    <strong className="font-semibold text-stone-900">Credit / Debit Card</strong>
                    <p className="text-stone-500 mt-0.5">Visa, Mastercard, RuPay, Amex</p>
                    {paymentMethod === 'card' && (
                      <div className="mt-3 space-y-2">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="Card Number"
                          className="w-full p-2 border border-stone-300 bg-white text-xs"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" placeholder="MM / YY" defaultValue="09/29" className="p-2 border border-stone-300 bg-white text-xs" />
                          <input type="password" maxLength={3} placeholder="CVV" defaultValue="•••" className="p-2 border border-stone-300 bg-white text-xs" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* NetBanking / Bank Wire for High Value Jewels */}
                <div 
                  onClick={() => setPaymentMethod('wire')}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer ${paymentMethod === 'wire' ? 'bg-teal-50/50' : 'bg-white'}`}
                >
                  <input type="radio" checked={paymentMethod === 'wire'} readOnly className="mt-1 accent-[#083338]" />
                  <div className="flex-1">
                    <strong className="font-semibold text-stone-900">RTGS / NEFT Direct Bank Transfer</strong>
                    <p className="text-stone-500 mt-0.5">Recommended for purchases above ₹2,00,000</p>
                    {paymentMethod === 'wire' && (
                      <div className="mt-2 p-2 bg-amber-50 text-[11px] text-amber-900">
                        Atelier account details will be generated on confirmation with price lock for 24 hours.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Razorpay PCI DSS Trust Shield */}
              <div className="p-3 bg-stone-50 border border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-stone-600" />
                  <span>256-bit Bank Grade Encryption (Razorpay India Integration)</span>
                </span>
                <span className="font-mono uppercase text-stone-600 font-semibold">PCI DSS v4.0</span>
              </div>
            </form>
          )}

          {/* STEP 4: Confirmed Order Receipt */}
          {step === 'confirmed' && confirmedOrder && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold">
                  Order Verified: #{confirmedOrder.id}
                </span>
                <h3 className="font-serif text-2xl text-[#083338] mt-1">
                  Thank you, {confirmedOrder.customerName}
                </h3>
                <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                  Your fine jewelry order has been received. Our master artisans are preparing your pieces under strict quality control.
                </p>
              </div>

              {/* QC Milestone Tracker per PDF Page 10 */}
              <div className="p-4 bg-stone-50 border border-stone-200 text-left space-y-3">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">
                  Production & Dispatch Timeline
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="p-2 bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300">
                    1. Cast & Pre-Polish
                    <span className="block text-[8px] text-emerald-700 font-mono mt-0.5">COMPLETED</span>
                  </div>
                  <div className="p-2 bg-amber-50 text-amber-900 font-semibold border border-amber-300">
                    2. Stone Setting
                    <span className="block text-[8px] text-amber-700 font-mono mt-0.5">IN PROGRESS</span>
                  </div>
                  <div className="p-2 bg-white text-stone-400 border border-stone-200">
                    3. BIS Hallmark Audit
                    <span className="block text-[8px] text-stone-400 font-mono mt-0.5">PENDING</span>
                  </div>
                  <div className="p-2 bg-white text-stone-400 border border-stone-200">
                    4. Insured Dispatch
                    <span className="block text-[8px] text-stone-400 font-mono mt-0.5">PENDING</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between text-xs text-stone-700">
                  <span>Insured Courier Waybill:</span>
                  <span className="font-mono font-semibold">{confirmedOrder.trackingNumber}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button
                  onClick={downloadInvoice}
                  className="px-5 py-2.5 bg-[#083338] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#0c444a] border border-[#d4af37]/40 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Download Tax Invoice & Guarantee</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 border border-stone-300 text-stone-700 text-xs font-medium uppercase tracking-wider hover:bg-stone-50 cursor-pointer"
                >
                  Return to Boutique
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Persistent Price Summary & Footer Action (for steps 1, 2, 3) */}
        {step !== 'confirmed' && cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-white space-y-3">
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-mono text-stone-800 tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>GST (3% Indian Standard for Fine Jewelry)</span>
                <span className="font-mono text-stone-800 tabular-nums">₹{taxGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Doorstep Insured Transit</span>
                <span className="text-emerald-700 font-medium uppercase text-[10px]">Complimentary</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#282329] pt-2 border-t border-stone-100">
                <span>Total Payable Amount</span>
                <span className="font-mono text-base text-[#083338] font-bold tabular-nums">₹{totalPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Stepper Buttons */}
            {step === 'cart' && (
              <button
                onClick={() => setStep('shipping')}
                className="w-full py-3.5 bg-[#083338] hover:bg-[#0c444a] text-white text-xs font-semibold uppercase tracking-wider border border-[#d4af37]/30 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Proceed to Insured Shipping</span>
                <ArrowRight className="w-4 h-4 text-[#d4af37]" />
              </button>
            )}

            {step === 'shipping' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('cart')}
                  className="w-1/3 py-3 border border-stone-300 text-stone-700 text-xs font-medium uppercase tracking-wider hover:bg-stone-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('payment')}
                  className="w-2/3 py-3 bg-[#083338] hover:bg-[#0c444a] text-white text-xs font-semibold uppercase tracking-wider border border-[#d4af37]/30 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Select Payment Method</span>
                  <ArrowRight className="w-4 h-4 text-[#d4af37]" />
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('shipping')}
                  className="w-1/3 py-3 border border-stone-300 text-stone-700 text-xs font-medium uppercase tracking-wider hover:bg-stone-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="w-2/3 py-3 bg-[#083338] hover:bg-[#0c444a] text-white text-xs font-semibold uppercase tracking-wider border border-[#d4af37]/30 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-70"
                >
                  <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{isProcessing ? 'Verifying with Bank...' : `Pay ₹${totalPayable.toLocaleString('en-IN')}`}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
