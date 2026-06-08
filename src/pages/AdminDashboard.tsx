import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Product, GiftCard, GeneratedGiftCard, Order } from '../types';
import { 
  Briefcase, Gift, ShoppingCart, BarChart3, LogOut, 
  RotateCcw, Calendar, Search, ArrowRight, ShieldCheck, 
  Trash2, Edit, Plus, Eye, Download, Mail, CheckCircle, 
  X, HelpCircle, Archive, Check, FileDown, EyeOff, Sparkles
} from 'lucide-react';
import { downloadGiftCardPDF } from '../utils/generateGiftCardPDF';

export const AdminDashboard: React.FC = () => {
  const { 
    user, logout, products, setProducts, giftCards, setGiftCards, 
    generatedBons, setGeneratedBons, orders, setOrders, resetDemoData 
  } = useAuth();
  const navigate = useNavigate();

  // Route security shield
  if (!user?.isAdmin) {
    // Redirect inline if they try to access /admin illegally
    React.useEffect(() => {
      navigate('/admin/login');
    }, [navigate]);
    return null;
  }

  // Admin Tab: 'dashboard' | 'products' | 'giftcards' | 'coupons' | 'orders'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'giftcards' | 'coupons' | 'orders'>('dashboard');

  // Search/Filters states
  const [productSearch, setProductSearch] = useState('');
  const [couponSearch, setCouponSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  // Modal active states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<GiftCard | null>(null);

  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Form entries for Products
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pDesc, setPDesc] = useState('');
  const [pCategory, setPCategory] = useState<'visage' | 'corps' | 'accessoire' | 'autre'>('visage');
  const [pImageUrl, setPImageUrl] = useState('');
  const [pInStock, setPInStock] = useState(true);
  const [pIsActive, setPIsActive] = useState(true);

  // Form entries for Gift Cards (vouchers catalogue)
  const [vName, setVName] = useState('');
  const [vDesc, setVDesc] = useState('');
  const [vPrice, setVPrice] = useState(0);
  const [vValidity, setVValidity] = useState(6);
  const [vImageUrl, setVImageUrl] = useState('');
  const [vIsActive, setVIsActive] = useState(true);

  // Trigger quick CSV export of Generated Vouchers
  const handleExportCSV = () => {
    const headers = ['Ref;Intitule;Beneficiaire;Acheteur;Montant;Date Emission;Date Expiration;Statut'];
    const rows = generatedBons.map(b => 
      `${b.id};"${b.name}";"${b.beneficiaryName}";"${b.buyerName}";${b.amount};${b.dateGenerated};${b.expiryDate};"${b.status}"`
    );
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bons_Cadeaux_Aquabeaute_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Calculations metrics
  const totalOrdersCount = orders.length;
  const grossRevenue = orders
    .filter(ord => ord.status === 'confirmed')
    .reduce((acc, ord) => acc + ord.total, 0);
  const generatedBonsCount = generatedBons.length;
  const pendingBonsCount = generatedBons.filter(b => b.status === 'pending').length;
  const activeProductsCount = products.filter(p => p.isActive).length;

  // Recent 5 orders inside Dashboard view
  const recentOrders = [...orders].slice(0, 5);

  // Filtered queries
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredCoupons = generatedBons.filter(b => 
    b.id.toLowerCase().includes(couponSearch.toLowerCase()) ||
    b.beneficiaryName.toLowerCase().includes(couponSearch.toLowerCase()) ||
    b.buyerName.toLowerCase().includes(couponSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  // MODAL PRODUCT MANAGEMENT TRIGGER SETUP
  const openAddProductModal = () => {
    setEditingProduct(null);
    setPName('');
    setPPrice(0);
    setPDesc('');
    setPCategory('visage');
    setPImageUrl('https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop');
    setPInStock(true);
    setPIsActive(true);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPPrice(prod.price);
    setPDesc(prod.description);
    setPCategory(prod.category);
    setPImageUrl(prod.imageUrl);
    setPInStock(prod.inStock);
    setPIsActive(prod.isActive);
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || pPrice <= 0 || !pDesc) return;

    if (editingProduct) {
      // Edit existing product
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p,
        name: pName.trim(),
        price: pPrice,
        description: pDesc.trim(),
        category: pCategory,
        imageUrl: pImageUrl.trim(),
        inStock: pInStock,
        isActive: pIsActive
      } : p));
    } else {
      // Add product
      const newId = `prod-custom-${Date.now()}`;
      const newProd: Product = {
        id: newId,
        name: pName.trim(),
        price: pPrice,
        description: pDesc.trim(),
        category: pCategory,
        imageUrl: pImageUrl.trim() || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
        inStock: pInStock,
        isActive: pIsActive
      };
      setProducts(prev => [newProd, ...prev]);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Êtes-vous sûr(e) de vouloir supprimer définitivement ce produit du catalogue ?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // MODAL CARDS VOUCHER LAUNCH TRIGGER SETUP
  const openAddVoucherModal = () => {
    setEditingVoucher(null);
    setVName('');
    setVDesc('');
    setVPrice(0);
    setVValidity(6);
    setVImageUrl('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop');
    setVIsActive(true);
    setIsVoucherModalOpen(true);
  };

  const openEditVoucherModal = (card: GiftCard) => {
    setEditingVoucher(card);
    setVName(card.name);
    setVDesc(card.description);
    setVPrice(card.price);
    setVValidity(card.validityMonths);
    setVImageUrl(card.imageUrl || '');
    setVIsActive(card.isActive);
    setIsVoucherModalOpen(true);
  };

  const handleVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName || vPrice <= 0 || !vDesc) return;

    if (editingVoucher) {
      setGiftCards(prev => prev.map(c => c.id === editingVoucher.id ? {
        ...c,
        name: vName.trim(),
        description: vDesc.trim(),
        price: vPrice,
        validityMonths: vValidity,
        imageUrl: vImageUrl.trim(),
        isActive: vIsActive
      } : c));
    } else {
      const newId = `gift-custom-${Date.now()}`;
      const newCard: GiftCard = {
        id: newId,
        name: vName.trim(),
        description: vDesc.trim(),
        price: vPrice,
        validityMonths: vValidity,
        imageUrl: vImageUrl.trim() || 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop',
        isActive: vIsActive
      };
      setGiftCards(prev => [newCard, ...prev]);
    }
    setIsVoucherModalOpen(false);
  };

  const handleDeleteVoucher = (id: string) => {
    if (window.confirm("Êtes-vous sûr(e) de vouloir désactiver ce modèle de bon cadeau ?")) {
      setGiftCards(prev => prev.filter(c => c.id !== id));
    }
  };

  // Status updates
  const handleModifyCouponStatus = (id: string, newStatus: GeneratedGiftCard['status']) => {
    setGeneratedBons(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const handleModifyOrderStatus = (id: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    
    // Auto-update order dialog if open
    if (viewingOrder && viewingOrder.id === id) {
      setViewingOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Regenerate PDF voucher for customer who lost it
  const handleRegenerateCouponPdf = (bonus: GeneratedGiftCard) => {
    downloadGiftCardPDF(bonus);
  };

  return (
    <div className="min-h-screen bg-brand-cream/40 flex text-left font-sans">
      
      {/* 1. FIXED ADMIN LAYOUT SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-brand-charcoal text-brand-nude flex-col justify-between p-6 h-screen sticky top-0 shrink-0">
        <div className="space-y-8">
          
          {/* Sidebar decorative Header */}
          <div className="border-b border-brand-pink-dark/20 pb-4">
            <span className="font-serif text-xl font-bold tracking-[0.2em] text-white block">
              AQUABEAUTÉ
            </span>
            <span className="text-[9px] uppercase tracking-widest text-brand-gold font-bold block mt-0.5">
              Administratrice Dashboard
            </span>
          </div>

          {/* Menu Link selections */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
              { id: 'products', label: 'Gestion Produits', icon: Briefcase },
              { id: 'giftcards', label: 'Modèles de Bons', icon: Gift },
              { id: 'coupons', label: 'Bons Clients', icon: Archive },
              { id: 'orders', label: 'Commandes Reçues', icon: ShoppingCart }
            ].map(tab => {
              const IconComp = tab.icon;
              const isSelected = activeTab === tab.id;
              
              // Count pending order badge
              const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-brand-pink text-brand-charcoal font-bold scale-[1.02]' 
                      : 'text-brand-pink-blush hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.id === 'orders' && pendingOrdersCount > 0 && (
                    <span className="bg-amber-500 text-brand-charcoal font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                      {pendingOrdersOrdersBadge(pendingOrdersCount)}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Sidebar Footer layout controls / Disconnect */}
        <div className="space-y-4">
          <button
            onClick={resetDemoData}
            className="w-full py-2 bg-brand-pink-light/10 hover:bg-brand-pink-light/20 border border-brand-pink-blush/20 text-brand-pink-blush transition-all rounded-lg text-[10px] items-center justify-center flex gap-1 cursor-pointer"
            title="Réinitialise toutes les données du localStorage aux défauts"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser les Démo</span>
          </button>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full py-3 bg-red-950/40 hover:bg-red-900 border border-red-900/40 text-red-200 transition-all rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* 2. THE MAIN DISPLAY WINDOW SCREEN */}
      <main className="flex-1 min-w-0 min-h-screen flex flex-col justify-start">
        
        {/* Topbar Layout */}
        <header className="bg-white border-b border-brand-pink-blush/60 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-30 luxury-shadow-sm">
          <div className="space-y-0.5">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gold">Institut de Beauté Mutzig</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-brand-pink-light text-brand-charcoal text-xs font-bold px-2 py-0.5 rounded-md border border-brand-pink-blush">
                Esthéticienne connectée
              </span>
              <span className="text-xs text-brand-taupe font-semibold">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs text-brand-taupe font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Lundi 8 Juin 2026
            </span>
            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-1.5 bg-brand-cream border border-brand-pink hover:bg-brand-charcoal hover:text-white transition-all text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <span>Voir le Site Client</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </header>

        {/* Responsive Mobile Top Navigation panel (Only visible when resized) */}
        <div className="lg:hidden p-4 bg-brand-charcoal text-white flex flex-wrap gap-2 justify-around">
          <button onClick={() => setActiveTab('dashboard')} className={`text-[10px] px-2.5 py-1.5 rounded-lg font-bold uppercase ${activeTab === 'dashboard' ? 'bg-brand-pink text-brand-charcoal' : 'text-brand-pink-blush'}`}>Stats</button>
          <button onClick={() => setActiveTab('products')} className={`text-[10px] px-2.5 py-1.5 rounded-lg font-bold uppercase ${activeTab === 'products' ? 'bg-brand-pink text-brand-charcoal' : 'text-brand-pink-blush'}`}>Produits</button>
          <button onClick={() => setActiveTab('giftcards')} className={`text-[10px] px-2.5 py-1.5 rounded-lg font-bold uppercase ${activeTab === 'giftcards' ? 'bg-brand-pink text-brand-charcoal' : 'text-brand-pink-blush'}`}>Modèles</button>
          <button onClick={() => setActiveTab('coupons')} className={`text-[10px] px-2.5 py-1.5 rounded-lg font-bold uppercase ${activeTab === 'coupons' ? 'bg-brand-pink text-brand-charcoal' : 'text-brand-pink-blush'}`}>Bons Clients</button>
          <button onClick={() => setActiveTab('orders')} className={`text-[10px] px-2.5 py-1.5 rounded-lg font-bold uppercase ${activeTab === 'orders' ? 'bg-brand-pink text-brand-charcoal' : 'text-brand-pink-blush'}`}>Commandes</button>
          <button onClick={() => { logout(); navigate('/'); }} className="text-[10px] px-2.5 py-1.5 rounded-lg font-bold uppercase bg-red-950/40 text-red-200">Sortir</button>
        </div>

        {/* Content Box */}
        <div className="p-6 sm:p-8 flex-1">
          
          {/* TAB 1: GENERAL METRICS DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-brand-pink-blush">
                <h3 className="font-serif text-2xl font-bold text-brand-charcoal">Indicateurs clés d'Activité</h3>
                <span className="text-xs text-brand-taupe">Calculés en temps réel depuis le localStorage</span>
              </div>

              {/* Bento-grid of Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white p-5 rounded-2xl border border-brand-pink-blush flex items-center justify-between shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-taupe block">Chiffre d'Affaires</span>
                    <span className="text-2xl font-black text-brand-charcoal">{grossRevenue.toFixed(2)} €</span>
                    <span className="text-[9px] text-emerald-600 font-bold block">✓ Commandes payées</span>
                  </div>
                  <span className="p-3 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-brand-pink-blush flex items-center justify-between shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-taupe block">Commandes totales</span>
                    <span className="text-2xl font-black text-brand-charcoal">{totalOrdersCount}</span>
                    <span className="text-[9px] text-brand-taupe block font-medium">Panier validé client</span>
                  </div>
                  <span className="p-3 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                    <ShoppingCart className="w-5 h-5" />
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-brand-pink-blush flex items-center justify-between shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-taupe block">Bons Cadeaux Générés</span>
                    <span className="text-2xl font-black text-brand-charcoal">{generatedBonsCount}</span>
                    {pendingBonsCount > 0 && (
                      <span className="text-[10px] text-amber-600 font-bold block">⚠ {pendingBonsCount} en attente</span>
                    )}
                  </div>
                  <span className="p-3 bg-brand-pink-light text-brand-taupe border border-brand-pink rounded-full">
                    <Gift className="w-5 h-5" />
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-brand-pink-blush flex items-center justify-between shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-taupe block">Produits Actifs</span>
                    <span className="text-2xl font-black text-brand-charcoal">{activeProductsCount}</span>
                    <span className="text-[10px] text-brand-taupe block font-medium">En stock</span>
                  </div>
                  <span className="p-3 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                    <Briefcase className="w-5 h-5" />
                  </span>
                </div>

              </div>

              {/* Charts & Graphs Panel Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Simulated Chart visual using elegant high-contrast bars */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-brand-pink-blush shadow-xs space-y-4">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-brand-charcoal">Historique hebdomadaire</h4>
                    <span className="text-[11px] text-brand-taupe block">Simulation des rentrées financières journalières de cette semaine (en €)</span>
                  </div>
                  
                  {/* Visual graph panel */}
                  <div className="h-64 flex items-end justify-between gap-3 pt-6 px-4">
                    {[
                      { l: 'Lun', val: 0, scale: 'h-0 bg-red-500' },
                      { l: 'Mar', val: 125, scale: 'h-[35%] bg-brand-pink' },
                      { l: 'Mer', val: 198, scale: 'h-[55%] bg-brand-pink-dark' },
                      { l: 'Jeu', val: 320, scale: 'h-[85%] bg-brand-gold' },
                      { l: 'Ven', val: 245, scale: 'h-[70%] bg-brand-taupe' },
                      { l: 'Sam', val: 380, scale: 'h-full bg-brand-charcoal' },
                      { l: 'Dim', val: 0, scale: 'h-0' }
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 group h-full">
                        <span className="text-[10px] text-brand-charcoal font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          {bar.val}€
                        </span>
                        <div className={`w-full ${bar.scale} rounded-t-lg transition-all duration-500 hover:brightness-95`}></div>
                        <span className="text-[10px] font-semibold text-brand-taupe">{bar.l}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dashboard: informational callouts right */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-brand-pink-blush shadow-xs space-y-4">
                  <h4 className="font-serif text-lg font-bold text-brand-charcoal">Activités de l'Institut</h4>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-2.5 text-xs text-brand-charcoal">
                      <ShieldCheck className="w-5 h-5 text-brand-eucalyptus shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">Génération PDF conforme</span>
                        Système vectoriel complet jsPDF activé pour l'impression des invitations cadeaux au format A5.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-xs text-brand-charcoal">
                      <ShieldCheck className="w-5 h-5 text-brand-eucalyptus shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">Persistance Locale</span>
                        Synchronisation automatique des produits, des commandes et des sessions dans la clé `localStorage`.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-xs text-brand-charcoal">
                      <HelpCircle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">Rappels Administrateur</span>
                        Pour simuler une commande client complète : basculez sur l'onglet Boutique, ajoutez un panier et validez-le, puis revenez ici pour valider le statut.
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Recent Orders table inside Dashboard */}
              <div className="bg-white rounded-2xl border border-brand-pink-blush shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-brand-pink-blush/60 flex justify-between items-center bg-brand-cream/45">
                  <h4 className="font-serif text-lg font-bold text-brand-charcoal">5 Dernières Commandes Clients</h4>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold uppercase text-brand-gold hover:text-brand-charcoal transition-all"
                  >
                    Voir toutes les commandes →
                  </button>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-brand-taupe">Aucune commande en attente.</div>
                ) : (
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-brand-cream/30 border-b border-brand-pink-blush text-brand-taupe font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4">N° Commande</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Client</th>
                          <th className="p-4">Montant</th>
                          <th className="p-4">Statut</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-pink-blush/40">
                        {recentOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-brand-nude/25">
                            <td className="p-4 font-bold text-brand-charcoal">{ord.id}</td>
                            <td className="p-4 font-medium text-brand-taupe">{ord.date}</td>
                            <td className="p-4 font-semibold text-brand-charcoal">
                              {ord.clientName}
                              <span className="block text-[10px] text-brand-taupe font-normal">{ord.clientEmail}</span>
                            </td>
                            <td className="p-4 font-black text-brand-charcoal">{ord.total.toFixed(2)} €</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 font-bold uppercase text-[9px] rounded-full inline-block ${
                                ord.status === 'confirmed' 
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                                  : ord.status === 'cancelled'
                                  ? 'bg-red-50 text-red-800 border border-red-100'
                                  : 'bg-amber-50 text-amber-800 border border-amber-100 text-amber-50'
                              }`}>
                                {ord.status === 'confirmed' ? 'Confirmée' : ord.status === 'cancelled' ? 'Annulée' : 'En attente'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => setViewingOrder(ord)}
                                className="p-1 px-3 bg-brand-pink-light border border-brand-pink hover:bg-brand-charcoal hover:text-white rounded-lg transition-all text-[11px] font-semibold tracking-wider text-brand-charcoal inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Détails</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGER CATALOG */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-pink-blush pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-charcoal">Catalogue des Produits</h3>
                  <p className="text-xs text-brand-taupe">Ajoutez, modifiez ou supprimez des cosmétiques de la boutique client.</p>
                </div>
                
                <button
                  onClick={openAddProductModal}
                  className="px-4.5 py-2.5 bg-brand-charcoal text-white hover:bg-brand-taupe text-xs uppercase tracking-wider font-bold rounded-xl flex items-center gap-1.5 self-start cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un produit</span>
                </button>
              </div>

              {/* Filters toolbar */}
              <div className="flex items-center bg-white p-3.5 border border-brand-pink-blush rounded-xl">
                <div className="relative w-full max-w-sm">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Rechercher par nom, marque..."
                    className="w-full pl-9 pr-4 py-2 bg-brand-cream border border-brand-pink rounded-lg text-xs"
                  />
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-brand-taupe" />
                </div>
              </div>

              {/* Product matrix table */}
              <div className="bg-white rounded-2xl border border-brand-pink-blush overflow-hidden shadow-xs">
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-cream/30 border-b border-brand-pink-blush text-brand-taupe font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Visuel</th>
                        <th className="p-4">Désignation</th>
                        <th className="p-4">Prix TTC</th>
                        <th className="p-4">Catégorie</th>
                        <th className="p-4">Disponibilité</th>
                        <th className="p-4">Affichage</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-pink-blush/40">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-brand-nude/25">
                          <td className="p-4 shrink-0">
                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-brand-cream border border-brand-pink-blush">
                              <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-4 max-w-sm">
                            <span className="font-bold text-brand-charcoal text-sm block truncate">{prod.name}</span>
                            <span className="text-[11px] text-brand-taupe block line-clamp-1">{prod.description}</span>
                          </td>
                          <td className="p-4 font-bold text-sm text-brand-charcoal">{prod.price.toFixed(2)} €</td>
                          <td className="p-4 capitalize font-semibold text-brand-gold">{prod.category}</td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, inStock: !p.inStock } : p));
                              }}
                              className={`px-3 py-1 rounded-md text-[10px] uppercase font-bold text-center inline-block cursor-pointer ${
                                prod.inStock 
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                                  : 'bg-red-50 text-red-800 border border-red-100'
                              }`}
                            >
                              {prod.inStock ? 'En Stock ✓' : 'Rupture ✕'}
                            </button>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, isActive: !p.isActive } : p));
                              }}
                              className={`px-3 py-1 rounded-md text-[10px] uppercase font-bold text-center inline-block cursor-pointer ${
                                prod.isActive 
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                                  : 'bg-gray-100 text-gray-500 border border-gray-200'
                              }`}
                            >
                              {prod.isActive ? 'Visible' : 'Masqué 👁️✕'}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => openEditProductModal(prod)}
                                className="p-1.5 hover:bg-brand-pink-light rounded-lg text-brand-taupe hover:text-brand-charcoal"
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1.5 hover:bg-red-50 rounded-lg text-brand-taupe hover:text-red-600"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BONS CADEAUX TYPES CATALOG */}
          {activeTab === 'giftcards' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-pink-blush pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-charcoal">Catalogue des Modèles de Bons</h3>
                  <p className="text-xs text-brand-taupe">Gérez les types d'invitations cadeaux et rituels disponibles dans la boutique.</p>
                </div>
                
                <button
                  onClick={openAddVoucherModal}
                  className="px-4.5 py-2.5 bg-brand-charcoal text-white hover:bg-brand-taupe text-xs uppercase tracking-wider font-bold rounded-xl flex items-center gap-1.5 self-start cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un modèle</span>
                </button>
              </div>

              {/* Grid of gift vouchers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {giftCards.map((card) => (
                  <div key={card.id} className="bg-white rounded-2xl border border-brand-pink-blush overflow-hidden flex flex-col justify-between">
                    <div className="h-40 relative">
                      <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2.5 right-2.5 bg-brand-charcoal/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Valide : {card.validityMonths} mois
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-1.5 text-left">
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="font-serif text-base font-bold text-brand-charcoal line-clamp-1">{card.name}</h4>
                          <span className="text-sm font-extrabold text-brand-charcoal shrink-0">{card.price} €</span>
                        </div>
                        <p className="text-[11px] text-brand-taupe leading-relaxed line-clamp-2">{card.description}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-brand-pink-blush/40 pt-3">
                        {/* Toggle visibility */}
                        <button
                          onClick={() => {
                            setGiftCards(prev => prev.map(c => c.id === card.id ? { ...c, isActive: !c.isActive } : c));
                          }}
                          className={`text-[9px] uppercase font-extrabold px-3 py-1 rounded-md border ${
                            card.isActive 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                              : 'bg-gray-50 text-gray-500 border-gray-100'
                          }`}
                        >
                          {card.isActive ? 'Actif' : 'Désactivé 👁️✕'}
                        </button>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditVoucherModal(card)}
                            className="p-1 hover:bg-brand-pink-light text-brand-taupe hover:text-brand-charcoal rounded-md"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVoucher(card.id)}
                            className="p-1 hover:bg-red-50 text-brand-taupe hover:text-red-600 rounded-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CLIENTS GENERATED VOUCHERS LIST */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-pink-blush pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-charcoal">Bons Cadeaux Clients Générés</h3>
                  <p className="text-xs text-brand-taupe">Consultez, modifiez le règlement ou regénérez les bons d'invitations créés.</p>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-4.5 py-2.5 bg-brand-cream border border-brand-pink hover:bg-brand-pink-light text-brand-charcoal text-xs uppercase tracking-wider font-bold rounded-xl flex items-center gap-1.5 self-start cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Exporter liste CSV</span>
                </button>
              </div>

              {/* Filters toolbar */}
              <div className="flex items-center bg-white p-3.5 border border-brand-pink-blush rounded-xl">
                <div className="relative w-full max-w-sm">
                  <input
                    type="text"
                    value={couponSearch}
                    onChange={(e) => setCouponSearch(e.target.value)}
                    placeholder="Rechercher par Ref (ex: F98X) ou bénéficiaire..."
                    className="w-full pl-9 pr-4 py-2 bg-brand-cream border border-brand-pink rounded-lg text-xs"
                  />
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-brand-taupe" />
                </div>
              </div>

              {/* Coupons list table */}
              <div className="bg-white rounded-2xl border border-brand-pink-blush overflow-hidden shadow-xs">
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-cream/30 border-b border-brand-pink-blush text-brand-taupe font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Réf Code</th>
                        <th className="p-4">Bénéficiaire & Message</th>
                        <th className="p-4">Acheteur</th>
                        <th className="p-4">Désignation</th>
                        <th className="p-4">Montant</th>
                        <th className="p-4">Expiré le</th>
                        <th className="p-4">Statut</th>
                        <th className="p-4 text-center">Télécharger</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-pink-blush/40">
                      {filteredCoupons.map((coupon) => (
                        <tr key={coupon.id} className="hover:bg-brand-nude/25">
                          <td className="p-4 font-bold text-sm text-brand-charcoal">{coupon.id}</td>
                          <td className="p-4 max-w-sm">
                            <span className="font-bold text-brand-charcoal block">{coupon.beneficiaryName}</span>
                            <span className="text-[10px] text-brand-taupe block line-clamp-1 italic">"{coupon.message || "Aucun message"}"</span>
                          </td>
                          <td className="p-4 font-semibold text-brand-taupe">{coupon.buyerName}</td>
                          <td className="p-4 font-medium text-brand-charcoal capitalize">{coupon.name}</td>
                          <td className="p-4 font-extrabold">{coupon.amount} €</td>
                          <td className="p-4 font-semibold text-brand-gold">{coupon.expiryDate}</td>
                          <td className="p-4">
                            <select
                              value={coupon.status}
                              onChange={(e) => handleModifyCouponStatus(coupon.id, e.target.value as any)}
                              className={`px-3 py-1 font-bold text-[10px] uppercase rounded-lg border focus:outline-none focus:ring-1 focus:ring-brand-gold ${
                                coupon.status === 'paid' 
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                                  : coupon.status === 'pending'
                                  ? 'bg-amber-50 text-amber-800 border-amber-100'
                                  : coupon.status === 'used'
                                  ? 'bg-gray-100 text-gray-800 border-gray-200'
                                  : 'bg-red-50 text-red-800 border-red-100'
                              }`}
                            >
                              <option value="pending">🟡 En attente de paiement</option>
                              <option value="paid">🟢 Payé / Actif</option>
                              <option value="used font-bold">⚫ Utilisé / Éteint</option>
                              <option value="expired">🔴 Expiré / Désactivé</option>
                            </select>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleRegenerateCouponPdf(coupon)}
                              className="p-2 hover:bg-brand-pink-light rounded-lg text-brand-taupe hover:text-brand-charcoal inline-flex items-center gap-1"
                              title="Regénérer le PDF vectoriel"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-brand-pink-blush pb-4">
                <h3 className="font-serif text-2xl font-bold text-brand-charcoal">Gestion des Commandes Reçues</h3>
                <p className="text-xs text-brand-taupe">Basculez les règlements clients, visualisez les coordonnées complètes pour retraits.</p>
              </div>

              {/* Status Tabs filters */}
              <div className="flex bg-white p-3 border border-brand-pink-blush rounded-xl items-center justify-between">
                <div className="flex gap-2">
                  {[
                    { label: 'Toutes les commandes', value: 'all' },
                    { label: 'En attente 🟡', value: 'pending' },
                    { label: 'Confirmées 🟢', value: 'confirmed' },
                    { label: 'Annulées 🔴', value: 'cancelled' }
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setOrderFilter(tab.value as any)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                        orderFilter === tab.value
                          ? 'bg-brand-charcoal border-brand-charcoal text-white font-bold'
                          : 'bg-transparent border-transparent text-brand-taupe hover:text-brand-charcoal'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complete orders lists */}
              <div className="bg-white rounded-2xl border border-brand-pink-blush overflow-hidden shadow-xs">
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-cream/30 border-b border-brand-pink-blush text-brand-taupe font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">N° Commande</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Client</th>
                        <th className="p-4">Articles</th>
                        <th className="p-4 flex gap-1 items-center">Montant total</th>
                        <th className="p-4">Statut</th>
                        <th className="p-4 text-center">Visualiser</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-pink-blush/40">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-brand-nude/25">
                          <td className="p-4 font-bold text-sm text-brand-charcoal">{ord.id}</td>
                          <td className="p-4 font-semibold text-brand-taupe">{ord.date}</td>
                          <td className="p-4">
                            <span className="font-bold text-brand-charcoal block">{ord.clientName}</span>
                            <span className="text-[10px] text-brand-taupe block">{ord.clientEmail}</span>
                          </td>
                          <td className="p-4 font-semibold text-brand-taupe max-w-xs truncate">
                            {ord.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                          </td>
                          <td className="p-4 font-black">{ord.total} €</td>
                          <td className="p-4">
                            <select
                              value={ord.status}
                              onChange={(e) => handleModifyOrderStatus(ord.id, e.target.value as any)}
                              className={`px-3 py-1 font-bold text-[10px] uppercase rounded-lg border focus:outline-none focus:ring-1 focus:ring-brand-gold ${
                                ord.status === 'confirmed' 
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                                  : ord.status === 'pending'
                                  ? 'bg-amber-50 text-amber-800 border-amber-100'
                                  : 'bg-red-50 text-red-800 border-red-100'
                              }`}
                            >
                              <option value="pending">🟡 En attente de paiement</option>
                              <option value="confirmed">🟢 Commande Confirmée / Payé</option>
                              <option value="cancelled">🔴 Annulée</option>
                            </select>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setViewingOrder(ord)}
                              className="px-3 py-1.5 bg-brand-pink-light border border-brand-pink hover:bg-brand-charcoal hover:text-white rounded-lg transition-all text-[11px] font-semibold tracking-wider text-brand-charcoal inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Ouvrir</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-brand-nude rounded-2xl border border-brand-pink-blush shadow-2xl p-6 overflow-hidden">
            
            <div className="flex justify-between items-center border-b border-brand-pink-blush pb-3 mb-4">
              <h4 className="font-serif text-xl font-bold text-brand-charcoal">
                {editingProduct ? '✏️ Éditer le Produit' : '📦 Ajouter un Cosmétique'}
              </h4>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 hover:bg-brand-pink rounded-full">
                <X className="w-5 h-5 text-brand-taupe" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-left">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold">Désignation du produit *</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="Ex: Baume Lissant Hydratant Bernard Cassière"
                  className="w-full px-4 py-2 bg-white border border-brand-pink rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold">Prix TTC (€) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={pPrice || ''}
                    onChange={(e) => setPPrice(parseFloat(e.target.value) || 0)}
                    placeholder="Ex: 38"
                    className="w-full px-4 py-2 bg-white border border-brand-pink rounded-lg text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold">Catégorie *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value as any)}
                    className="w-full px-4 py-2 bg-white border border-brand-pink rounded-lg text-sm"
                  >
                    <option value="visage">Soin Visage</option>
                    <option value="corps">Soin Corps & Dos</option>
                    <option value="accessoire">Accessoires / Autres</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold">Description courte *</label>
                <textarea
                  required
                  rows={3}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Ex: Soin velouteux anti-fatigue..."
                  className="w-full px-4 py-2 bg-white border border-brand-pink rounded-lg text-sm resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold">URL de la photo ou placeholder *</label>
                <input
                  type="text"
                  required
                  value={pImageUrl}
                  onChange={(e) => setPImageUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-brand-pink rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-brand-pink-blush/40">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pInStock"
                    checked={pInStock}
                    onChange={(e) => setPInStock(e.target.checked)}
                    className="w-4 h-4 text-brand-gold focus:ring-1 focus:ring-brand-gold bg-white border-brand-pink"
                  />
                  <label htmlFor="pInStock" className="text-xs font-semibold">En Stock disponible</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pIsActive"
                    checked={pIsActive}
                    onChange={(e) => setPIsActive(e.target.checked)}
                    className="w-4 h-4 text-brand-gold focus:ring-1 focus:ring-brand-gold bg-white border-brand-pink"
                  />
                  <label htmlFor="pIsActive" className="text-xs font-semibold">Visible en boutique</label>
                </div>
              </div>

              <div className="border-t border-brand-pink-blush pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2 text-xs uppercase font-semibold border border-brand-taupe rounded-lg text-brand-charcoal cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="flex-1 py-2 bg-brand-pink-light hover:bg-brand-pink-blush/40 text-brand-pink border border-brand-pink/50 border-dashed text-xs uppercase font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Aperçu</span>
                </button>
                <button
                  type="submit"
                  className="flex-[1.5] py-2 bg-brand-charcoal hover:bg-brand-taupe text-white text-xs uppercase font-bold rounded-lg cursor-pointer"
                >
                  Sauvegarder
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT INVITATION VOUCHERS CATALOG */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-brand-nude rounded-2xl border border-brand-pink-blush shadow-2xl p-6 overflow-hidden">
            
            <div className="flex justify-between items-center border-b border-brand-pink-blush pb-3 mb-4">
              <h4 className="font-serif text-xl font-bold text-brand-charcoal">
                {editingVoucher ? '✏️ Éditer le Modèle' : '🎁 Nouveau Modèle de Bon'}
              </h4>
              <button onClick={() => setIsVoucherModalOpen(false)} className="p-1 hover:bg-brand-pink rounded-full">
                <X className="w-5 h-5 text-brand-taupe" />
              </button>
            </div>

            <form onSubmit={handleVoucherSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-left">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold">Intitulé du bon d'invitation *</label>
                <input
                  type="text"
                  required
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  placeholder="Ex: Bon Rituel Visage Signature"
                  className="w-full px-4 py-2 bg-white border border-brand-pink rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold">Prix minimum fixe (€) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={vPrice || ''}
                    onChange={(e) => setVPrice(parseInt(e.target.value) || 0)}
                    placeholder="Ex: 75"
                    className="w-full px-4 py-2 bg-white border border-brand-pink rounded-lg text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold">Durée de validité (mois) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={vValidity || ''}
                    onChange={(e) => setVValidity(parseInt(e.target.value) || 6)}
                    placeholder="Ex: 6"
                    className="w-full px-4 py-2 bg-white border border-brand-pink rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold">Prestations/Soins concernées *</label>
                <textarea
                  required
                  rows={3}
                  value={vDesc}
                  onChange={(e) => setVDesc(e.target.value)}
                  placeholder="Ex: Massage relaxant californien enrichi..."
                  className="w-full px-4 py-2 bg-white border border-brand-pink rounded-lg text-sm resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold">Image de couverture *</label>
                <input
                  type="text"
                  required
                  value={vImageUrl}
                  onChange={(e) => setVImageUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-brand-pink rounded-lg text-sm"
                />
              </div>

              <div className="pt-2 border-t border-brand-pink-blush/40 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vIsActive"
                  checked={vIsActive}
                  onChange={(e) => setVIsActive(e.target.checked)}
                  className="w-4 h-4 text-brand-gold focus:ring-1 focus:ring-brand-gold bg-white border-brand-pink"
                />
                <label htmlFor="vIsActive" className="text-xs font-semibold">Activer ce modèle de bon en boutique</label>
              </div>

              <div className="border-t border-brand-pink-blush pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="flex-1 py-2 text-xs uppercase font-semibold border border-brand-taupe rounded-lg text-brand-charcoal"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-2 bg-brand-charcoal hover:bg-brand-taupe text-white text-xs uppercase font-bold rounded-lg"
                >
                  Sauvegarder modèle
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 3: VIEW ORDER DETAIL DIALOG */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-brand-nude rounded-2xl border border-brand-pink-blush shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col justify-between">
            
            <div className="flex justify-between items-center border-b border-brand-pink-blush pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-brand-pink text-brand-charcoal rounded-md">
                  <ShoppingCart className="w-4 h-4 text-brand-taupe" />
                </span>
                <h4 className="font-serif text-lg font-bold text-brand-charcoal">
                  Détail Commande {viewingOrder.id}
                </h4>
              </div>
              <button onClick={() => setViewingOrder(null)} className="p-1 hover:bg-brand-pink rounded-full">
                <X className="w-5 h-5 text-brand-taupe" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-5 text-xs text-left">
              
              {/* Order client coordinates cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-brand-pink-blush space-y-1.5 leading-normal">
                  <span className="text-[10px] uppercase font-bold text-brand-gold">Coordonnées Client</span>
                  <p className="font-bold text-sm text-brand-charcoal">{viewingOrder.clientName}</p>
                  <p className="font-medium">📧 : <a href={`mailto:${viewingOrder.clientEmail}`} className="text-brand-gold underline">{viewingOrder.clientEmail}</a></p>
                  <p className="font-medium">📞 : {viewingOrder.clientPhone || 'Aucun numéro'}</p>
                  
                  {/* Mailto launch button */}
                  <a
                    href={`mailto:${viewingOrder.clientEmail}?subject=Validation de votre commande ${viewingOrder.id} - Aquabeauté&body=Bonjour ${viewingOrder.clientName},%0D%0A%0D%0ANous avons bien enregistré votre commande d'un montant total de ${viewingOrder.total} € chez Aquabeauté.%0D%0A....`}
                    className="inline-flex items-center gap-1 text-[10px] text-brand-gold hover:text-brand-charcoal font-bold uppercase tracking-wider mt-2.5 bg-brand-cream py-1 px-3 border border-brand-pink-blush rounded-md"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Envoyer un mail de contact</span>
                  </a>
                </div>

                <div className="bg-white p-4 rounded-xl border border-brand-pink-blush space-y-1.5 leading-normal">
                  <span className="text-[10px] uppercase font-bold text-brand-gold">Adresse de Livraison</span>
                  {viewingOrder.deliveryAddress ? (
                    <p className="font-semibold text-brand-charcoal text-[11px] leading-relaxed">
                      📍 {viewingOrder.deliveryAddress}
                    </p>
                  ) : (
                    <div className="text-brand-eucalyptus font-semibold border border-green-100 bg-green-50/20 rounded-md p-2 text-[11px]">
                      🎁 Uniquement des invitations cadeaux (E-bons à télécharger). Pas de livraison colis physique requise.
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-brand-pink-blush/30 text-[10px] text-brand-taupe">
                    Commandée d'Alsace le : <strong className="font-bold text-brand-charcoal">{viewingOrder.date}</strong>
                  </div>
                </div>
              </div>

              {/* Products rows tables */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-brand-gold block mb-1">Articles Commandés</span>
                
                <div className="border border-brand-pink-blush rounded-xl overflow-hidden divide-y divide-brand-pink-blush/40 bg-white">
                  {viewingOrder.items.map((it, idx) => (
                    <div key={idx} className="p-4 flex justify-between items-center gap-4">
                      <div>
                        <span className="font-bold text-sm text-brand-charcoal block">{it.name} (x{it.quantity})</span>
                        <span className="text-[10px] text-brand-taupe font-medium">{it.type === 'giftcard' ? 'Bon d\'invitation cadeau' : 'Cosmétique physique'}</span>
                        
                        {/* If giftcard details */}
                        {it.type === 'giftcard' && it.giftCardDetails && (
                          <div className="mt-2 p-2 bg-brand-pink-light rounded-lg text-[10px] font-medium text-brand-taupe space-y-0.5 max-w-sm">
                            <p>💝 Destinataire : <strong className="font-bold text-brand-charcoal">{it.giftCardDetails.beneficiaryName}</strong></p>
                            <p>Message : "{it.giftCardDetails.message || 'Aucun message'}"</p>
                            {it.giftCardDetails.buyerName && <p>Acheteur : {it.giftCardDetails.buyerName}</p>}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <span className="font-black text-sm text-brand-charcoal block">{it.price * it.quantity} €</span>
                        <span className="text-[10px] text-brand-taupe block font-medium">{it.price} €/u</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtotal metrics summary */}
              <div className="flex justify-between items-center p-4 bg-brand-cream border border-brand-pink rounded-xl text-brand-charcoal font-sans text-xs">
                <span className="font-semibold text-brand-taupe uppercase tracking-wider">Montant total encaissable :</span>
                <span className="text-lg font-black text-brand-eucalyptus">{viewingOrder.total} € TTC</span>
              </div>

            </div>

            {/* Footer with fast status edits */}
            <div className="border-t border-brand-pink-blush pt-4 mt-4 select-none shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs">Modifier le statut :</span>
                <select
                  value={viewingOrder.status}
                  onChange={(e) => handleModifyOrderStatus(viewingOrder.id, e.target.value as any)}
                  className="px-3 py-1.5 font-bold uppercase text-[10px] rounded-lg border focus:outline-none focus:ring-1 focus:ring-brand-gold bg-white"
                >
                  <option value="pending">🟡 En attente de paiement</option>
                  <option value="confirmed">🟢 Confirmée / Payé</option>
                  <option value="cancelled">🔴 Annulée</option>
                </select>
              </div>

              <button
                onClick={() => setViewingOrder(null)}
                className="px-6 py-2 bg-brand-charcoal hover:bg-brand-taupe text-white text-xs uppercase font-bold rounded-lg self-end"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 4: PRODUCT LIVE PREVIEW */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-brand-nude rounded-3xl border border-brand-pink-blush shadow-2xl p-6 md:p-8 overflow-hidden max-h-[90vh] flex flex-col justify-between">
            
            <div className="flex justify-between items-center border-b border-brand-pink-blush/60 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2 text-brand-pink">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <h4 className="font-serif text-lg font-bold tracking-wider text-brand-charcoal">
                  Prévisualisation du Rendu Boutique
                </h4>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="p-1 hover:bg-brand-pink/20 rounded-full cursor-pointer transition-colors">
                <X className="w-5 h-5 text-brand-taupe" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 space-y-6 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Simulated product photo with custom asymmetric rounded layout matching the design */}
                <div className="relative aspect-square w-full bg-brand-cream rounded-[40px_4px_40px_4px] overflow-hidden border-4 border-white shadow-md select-none group">
                  <img 
                    src={pImageUrl || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop'} 
                    alt={pName || 'Aperçu du Produit'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {!pInStock && (
                    <div className="absolute top-4 left-4 bg-brand-charcoal/80 text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md">
                      Épuisé
                    </div>
                  )}
                </div>

                {/* Details column */}
                <div className="space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pink bg-brand-pink-light border border-brand-pink-blush px-2.5 py-1 rounded-md inline-block">
                      {pCategory === 'visage' ? '✨ Soin Visage' : pCategory === 'corps' ? '💆 Soin Corps' : '🌸 Accessoire / Autre'}
                    </span>
                    
                    <h3 className="font-serif text-2xl font-normal text-brand-charcoal leading-tight">
                      {pName || 'Nom de votre Préparation'}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-brand-pink">{pPrice || '0'} €</span>
                    <span className="text-[10px] text-brand-taupe uppercase font-bold tracking-wider">TTC</span>
                  </div>

                  <div className="border-t border-b border-brand-pink-blush/40 py-3">
                    <p className="text-xs text-brand-taupe leading-relaxed font-light whitespace-pre-line">
                      {pDesc || 'Saisissez une description pour tester le rendu de mise en page.'}
                    </p>
                  </div>

                  {/* Operational States indicators */}
                  <div className="space-y-2 text-[11px] leading-relaxed select-none">
                    <div className="flex items-center gap-1.5 text-brand-taupe">
                      <span className={`w-2 h-2 rounded-full ${pInStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>Statut Stock : <strong>{pInStock ? 'Disponible à Mutzig (Mise de côté directe)' : 'Non disponible (Sur commande)'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-brand-taupe">
                      <span className={`w-2 h-2 rounded-full ${pIsActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>Visibilité Publique : <strong>{pIsActive ? 'Affiché en direct' : 'Masqué (Brouillon temporaire)'}</strong></span>
                    </div>
                  </div>

                  {/* Add to cart mock action buttons */}
                  <div className="pt-2">
                    <button 
                      type="button" 
                      disabled={!pInStock}
                      className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
                        pInStock 
                          ? 'bg-brand-pink hover:bg-brand-pink-dark text-white cursor-pointer' 
                          : 'bg-brand-cream/80 text-brand-taupe/60 cursor-not-allowed border border-brand-pink-blush/40'
                      }`}
                    >
                      <span>Ajouter au panier</span>
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            </div>

            <div className="border-t border-brand-pink-blush/60 pt-4 mt-4 text-center shrink-0">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-8 py-2.5 bg-brand-charcoal hover:bg-black text-white text-xs uppercase font-bold rounded-full cursor-pointer transition-colors"
              >
                Retour au formulaire
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// Helper inside sidebar to show visual counter
function pendingOrdersOrdersBadge(count: number): string {
  if (count <= 0) return '';
  return `${count} act`;
}

export default AdminDashboard;
