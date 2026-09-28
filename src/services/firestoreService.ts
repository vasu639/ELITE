import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { OrderRecord, ConsultationBooking, BespokeQuoteEnquiry, Product } from '../types';

export async function saveOrderToFirestore(order: OrderRecord): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, 'orders', order.id), {
      id: order.id,
      customerName: order.customerName,
      email: order.email,
      phone: order.phone,
      total: order.total,
      subtotal: order.subtotal,
      taxGst: order.taxGst,
      shippingCharge: order.shippingCharge,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: 'pending',
      orderDate: order.orderDate,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      qcMilestone: order.qcMilestone,
      trackingNumber: order.trackingNumber,
      itemCount: order.items.length,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveConsultationToFirestore(booking: ConsultationBooking): Promise<void> {
  const path = `consultations/${booking.id}`;
  try {
    await setDoc(doc(db, 'consultations', booking.id), {
      id: booking.id,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      mode: booking.mode,
      date: booking.date,
      timeSlot: booking.timeSlot,
      timezone: booking.timezone,
      consultantName: booking.consultantName,
      notes: booking.notes || '',
      shortlistedProductIds: booking.shortlistedProductIds,
      status: booking.status,
      meetingLink: booking.meetingLink || '',
      showroomLocation: booking.showroomLocation || '',
      createdAt: booking.createdAt,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveQuotationToFirestore(enquiry: BespokeQuoteEnquiry): Promise<void> {
  const path = `quotations/${enquiry.id}`;
  try {
    await setDoc(doc(db, 'quotations', enquiry.id), {
      id: enquiry.id,
      productId: enquiry.productId,
      productName: enquiry.productName,
      customerName: enquiry.customerName,
      customerEmail: enquiry.customerEmail,
      customerPhone: enquiry.customerPhone,
      budgetINR: enquiry.budgetINR || '',
      occasion: enquiry.occasion || '',
      requiredByDate: enquiry.requiredByDate || '',
      notes: enquiry.notes || '',
      status: enquiry.status,
      assignedConsultant: enquiry.assignedConsultant,
      createdAt: enquiry.createdAt,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, 'products', product.id), {
      ...product,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchProductsFromFirestore(): Promise<Product[]> {
  const path = 'products';
  try {
    const snap = await getDocs(collection(db, path));
    const items: Product[] = [];
    snap.forEach((d) => {
      items.push(d.data() as Product);
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}
