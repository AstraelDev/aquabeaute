export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'visage' | 'corps' | 'accessoire' | 'autre';
  imageUrl: string;
  inStock: boolean;
  isActive: boolean;
}

export interface GiftCard {
  id: string;
  name: string;
  description: string;
  price: number;
  validityMonths: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface GeneratedGiftCard {
  id: string; // generated ref code e.g. QB-2026-XXXX
  name: string; // name of voucher type (e.g. Bon Soin Visage Signature)
  beneficiaryName: string;
  message: string;
  buyerName: string;
  amount: number;
  dateGenerated: string;
  expiryDate: string;
  status: 'pending' | 'paid' | 'used' | 'expired';
}

export interface CartItem {
  id: string; // unique item id in cart (for products = product.id, for gift cards = product.id + timestamp / customizable details)
  type: 'product' | 'giftcard';
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  // properties specific to customized gift cards
  giftCardDetails?: {
    beneficiaryName: string;
    message: string;
    buyerName: string;
    validityMonths: number;
    pdfUrl?: string; // Cache data URL if generated or reference
  };
}

export interface Order {
  id: string; // e.g. ORD-10943
  date: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  deliveryAddress?: string; // only if contains physical products
  items: CartItem[];
  subtotal: number;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface CareItem {
  id: string;
  name: string;
  duration?: string;
  price: number;
  description?: string;
  isSpecial?: boolean; // Highlight with badge
}

export interface CareCategory {
  id: string;
  title: string;
  slug: string;
  description: string;
  items: CareItem[];
  imageUrl: string;
}
