import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, GiftCard, GeneratedGiftCard, Order } from '../types';
import { DEFAULT_PRODUCTS, DEFAULT_GIFT_CARDS } from '../data/defaultData';

export interface UserSession {
  email: string;
  name: string;
  phone?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserSession | null;
  isAdmin: boolean;
  login: (email: string, name: string, phone?: string) => Promise<boolean>;
  loginAsAdmin: (email: string, mdp: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, name: string, phone?: string) => Promise<boolean>;
  
  // Storage references for admin-accessible lists
  products: Product[];
  giftCards: GiftCard[];
  generatedBons: GeneratedGiftCard[];
  orders: Order[];
  
  // Helpers to update state/storage
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setGiftCards: React.Dispatch<React.SetStateAction<GiftCard[]>>;
  setGeneratedBons: React.Dispatch<React.SetStateAction<GeneratedGiftCard[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  resetDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  
  // Database states
  const [products, setProducts] = useState<Product[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [generatedBons, setGeneratedBons] = useState<GeneratedGiftCard[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // 1. Initial Seeding and State Loading
  useEffect(() => {
    // A. Session restore
    const savedUser = localStorage.getItem('aqb_user_session');
    const savedAdmin = localStorage.getItem('aqb_admin_session');
    
    if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);
        setUser({ email: parsed.email, name: 'Administratrice', isAdmin: true });
      } catch (e) {
        localStorage.removeItem('aqb_admin_session');
      }
    } else if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({ email: parsed.email, name: parsed.name, phone: parsed.phone, isAdmin: false });
      } catch (e) {
        localStorage.removeItem('aqb_user_session');
      }
    }

    // B. Products
    const storedProducts = localStorage.getItem('aqb_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      localStorage.setItem('aqb_products', JSON.stringify(DEFAULT_PRODUCTS));
      setProducts(DEFAULT_PRODUCTS);
    }

    // C. Gift Cards
    const storedGiftCards = localStorage.getItem('aqb_giftcards');
    if (storedGiftCards) {
      setGiftCards(JSON.parse(storedGiftCards));
    } else {
      localStorage.setItem('aqb_giftcards', JSON.stringify(DEFAULT_GIFT_CARDS));
      setGiftCards(DEFAULT_GIFT_CARDS);
    }

    // D. Generated coupons seed
    const storedBons = localStorage.getItem('aqb_generated_bons');
    if (storedBons) {
      setGeneratedBons(JSON.parse(storedBons));
    } else {
      const demoBons: GeneratedGiftCard[] = [
        {
          id: 'QB-2026-F98X',
          name: 'Bon Rituel Détente',
          beneficiaryName: 'Marie-Claire Rohmer',
          message: 'Un joyeux anniversaire de la part de toute la famille ! Profite bien de cette parenthèse enchantée.',
          buyerName: 'Sophie Rohmer',
          amount: 50,
          dateGenerated: '2026-05-15',
          expiryDate: '2026-11-15',
          status: 'paid'
        },
        {
          id: 'QB-2026-K12P',
          name: 'Bon Soin Visage Signature',
          beneficiaryName: 'Aurélie Keller',
          message: 'Félicitations pour la réussite de tes examens ! Des bisous.',
          buyerName: 'Christophe Keller',
          amount: 75,
          dateGenerated: '2026-06-01',
          expiryDate: '2026-12-01',
          status: 'pending'
        },
        {
          id: 'QB-2026-S74L',
          name: 'Bon Évasion Massage Corps Complet',
          beneficiaryName: 'Nathalie Muller',
          message: 'Joyeuse fête des mères à la plus douce des mamans. Je t\'aime fort.',
          buyerName: 'Léa Muller',
          amount: 90,
          dateGenerated: '2026-06-05',
          expiryDate: '2026-12-05',
          status: 'used'
        }
      ];
      localStorage.setItem('aqb_generated_bons', JSON.stringify(demoBons));
      setGeneratedBons(demoBons);
    }

    // E. Orders seed
    const storedOrders = localStorage.getItem('aqb_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      const demoOrders: Order[] = [
        {
          id: 'ORD-72501',
          date: '2026-05-15',
          clientName: 'Sophie Rohmer',
          clientEmail: 'sophie.rohmer@gmail.com',
          clientPhone: '06 12 34 56 78',
          items: [
            {
              id: 'item-demo-1',
              type: 'giftcard',
              name: 'Bon Rituel Détente',
              price: 50,
              quantity: 1,
              imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop',
              giftCardDetails: {
                beneficiaryName: 'Marie-Claire Rohmer',
                message: 'Un joyeux anniversaire de la part de toute la famille ! Profite bien de cette parenthèse enchantée.',
                buyerName: 'Sophie Rohmer',
                validityMonths: 6
              }
            }
          ],
          subtotal: 50,
          total: 50,
          status: 'confirmed'
        },
        {
          id: 'ORD-72619',
          date: '2026-05-24',
          clientName: 'Nathalie Bertrand',
          clientEmail: 'nathalie.bertrand@outlook.com',
          clientPhone: '07 88 12 34 56',
          deliveryAddress: '12 Rue de l\'Éden, 67190 Mutzig',
          items: [
            {
              id: 'prod-esthederm-hydra',
              type: 'product',
              name: 'Crème Hydratante Eau Cellulaire Esthederm',
              price: 38,
              quantity: 1,
              imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop'
            }
          ],
          subtotal: 38,
          total: 38,
          status: 'confirmed'
        },
        {
          id: 'ORD-72740',
          date: '2026-06-01',
          clientName: 'Christophe Keller',
          clientEmail: 'c.keller@wanadoo.fr',
          clientPhone: '03 88 47 12 90',
          items: [
            {
              id: 'item-demo-2',
              type: 'giftcard',
              name: 'Bon Soin Visage Signature',
              price: 75,
              quantity: 1,
              imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop',
              giftCardDetails: {
                beneficiaryName: 'Aurélie Keller',
                message: 'Félicitations pour la réussite de tes examens ! Des bisous.',
                buyerName: 'Christophe Keller',
                validityMonths: 6
              }
            }
          ],
          subtotal: 75,
          total: 75,
          status: 'pending'
        },
        {
          id: 'ORD-72810',
          date: '2026-06-05',
          clientName: 'Léa Muller',
          clientEmail: 'lea.muller@uha.fr',
          clientPhone: '06 72 89 45 11',
          deliveryAddress: '4b Avenue des Vosges, 67120 Molsheim',
          items: [
            {
              id: 'item-demo-3',
              type: 'giftcard',
              name: 'Bon Évasion Massage Corps Complet',
              price: 90,
              quantity: 1,
              imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=600&auto=format&fit=crop',
              giftCardDetails: {
                beneficiaryName: 'Nathalie Muller',
                message: 'Joyeuse fête des mères à la plus douce des mamans. Je t\'aime fort.',
                buyerName: 'Léa Muller',
                validityMonths: 6
              }
            },
            {
              id: 'prod-bc-serum',
              type: 'product',
              name: 'Sérum booster Éclat Bernard Cassière',
              price: 52,
              quantity: 1,
              imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop'
            }
          ],
          subtotal: 142,
          total: 142,
          status: 'confirmed'
        }
      ];
      localStorage.setItem('aqb_orders', JSON.stringify(demoOrders));
      setOrders(demoOrders);
    }
  }, []);

  // 2. Synchronize DB states with localStorage
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('aqb_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (giftCards.length > 0) {
      localStorage.setItem('aqb_giftcards', JSON.stringify(giftCards));
    }
  }, [giftCards]);

  useEffect(() => {
    if (generatedBons.length > 0) {
      localStorage.setItem('aqb_generated_bons', JSON.stringify(generatedBons));
    }
  }, [generatedBons]);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('aqb_orders', JSON.stringify(orders));
    }
  }, [orders]);

  // Auth Functions
  const login = async (email: string, name: string, phone?: string): Promise<boolean> => {
    const freshUser: UserSession = { email, name, phone, isAdmin: false };
    setUser(freshUser);
    localStorage.setItem('aqb_user_session', JSON.stringify(freshUser));
    return true;
  };

  const loginAsAdmin = async (email: string, mdp: string): Promise<boolean> => {
    // Standard mock admin authorization credentials check
    if (email.toLowerCase() === 'admin@aquabeaute.fr' && mdp === 'aqua2025') {
      const adminSession = { email, isAdmin: true, loginAt: new Date().toISOString() };
      const freshAdmin: UserSession = { email, name: 'Administratrice', isAdmin: true };
      setUser(freshAdmin);
      localStorage.setItem('aqb_admin_session', JSON.stringify(adminSession));
      localStorage.removeItem('aqb_user_session'); // Clear standard user session
      return true;
    }
    return false;
  };

  const register = async (email: string, name: string, phone?: string): Promise<boolean> => {
    const freshUser: UserSession = { email, name, phone, isAdmin: false };
    setUser(freshUser);
    localStorage.setItem('aqb_user_session', JSON.stringify(freshUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aqb_user_session');
    localStorage.removeItem('aqb_admin_session');
  };

  const resetDemoData = () => {
    // Reset all products & voucher catalogs
    localStorage.removeItem('aqb_products');
    localStorage.removeItem('aqb_giftcards');
    localStorage.removeItem('aqb_generated_bons');
    localStorage.removeItem('aqb_orders');
    
    setProducts(DEFAULT_PRODUCTS);
    setGiftCards(DEFAULT_GIFT_CARDS);
    
    // Reset initial collections
    const demoBons: GeneratedGiftCard[] = [
      {
        id: 'QB-2026-F98X',
        name: 'Bon Rituel Détente',
        beneficiaryName: 'Marie-Claire Rohmer',
        message: 'Un joyeux anniversaire de la part de toute la famille ! Profite bien de cette parenthèse enchantée.',
        buyerName: 'Sophie Rohmer',
        amount: 50,
        dateGenerated: '2026-05-15',
        expiryDate: '2026-11-15',
        status: 'paid'
      },
      {
        id: 'QB-2026-K12P',
        name: 'Bon Soin Visage Signature',
        beneficiaryName: 'Aurélie Keller',
        message: 'Félicitations pour la réussite de tes examens ! Des bisous.',
        buyerName: 'Christophe Keller',
        amount: 75,
        dateGenerated: '2026-06-01',
        expiryDate: '2026-12-01',
        status: 'pending'
      },
      {
        id: 'QB-2026-S74L',
        name: 'Bon Évasion Massage Corps Complet',
        beneficiaryName: 'Nathalie Muller',
        message: 'Joyeuse fête des mères à la plus douce des mamans. Je t\'aime fort.',
        buyerName: 'Léa Muller',
        amount: 90,
        dateGenerated: '2026-06-05',
        expiryDate: '2026-12-05',
        status: 'used'
      }
    ];
    setGeneratedBons(demoBons);

    const demoOrders: Order[] = [
      {
        id: 'ORD-72501',
        date: '2026-05-15',
        clientName: 'Sophie Rohmer',
        clientEmail: 'sophie.rohmer@gmail.com',
        clientPhone: '06 12 34 56 78',
        items: [
          {
            id: 'item-demo-1',
            type: 'giftcard',
            name: 'Bon Rituel Détente',
            price: 50,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop',
            giftCardDetails: {
              beneficiaryName: 'Marie-Claire Rohmer',
              message: 'Un joyeux anniversaire de la part de toute la famille ! Profite bien de cette parenthèse enchantée.',
              buyerName: 'Sophie Rohmer',
              validityMonths: 6
            }
          }
        ],
        subtotal: 50,
        total: 50,
        status: 'confirmed'
      },
      {
        id: 'ORD-72619',
        date: '2026-05-24',
        clientName: 'Nathalie Bertrand',
        clientEmail: 'nathalie.bertrand@outlook.com',
        clientPhone: '07 88 12 34 56',
        deliveryAddress: '12 Rue de l\'Éden, 67190 Mutzig',
        items: [
          {
            id: 'prod-esthederm-hydra',
            type: 'product',
            name: 'Crème Hydratante Eau Cellulaire Esthederm',
            price: 38,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop'
          }
        ],
        subtotal: 38,
        total: 38,
        status: 'confirmed'
      }
    ];
    setOrders(demoOrders);

    localStorage.setItem('aqb_products', JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem('aqb_giftcards', JSON.stringify(DEFAULT_GIFT_CARDS));
    localStorage.setItem('aqb_generated_bons', JSON.stringify(demoBons));
    localStorage.setItem('aqb_orders', JSON.stringify(demoOrders));
  };

  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      login,
      loginAsAdmin,
      logout,
      register,
      products,
      giftCards,
      generatedBons,
      orders,
      setProducts,
      setGiftCards,
      setGeneratedBons,
      setOrders,
      resetDemoData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
