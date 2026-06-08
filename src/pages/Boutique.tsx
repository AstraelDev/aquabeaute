import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { GiftCard, Product } from '../types';
import { Sparkles, Gift, ShoppingBag, Eye, Heart, BadgeCheck, X, Check } from 'lucide-react';
import { GiftCardModal } from '../components/GiftCardModal';

export const Boutique: React.FC = () => {
  const { products, giftCards } = useAuth();
  const { addToCart } = useCart();

  // Modal active triggers
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'visage' | 'corps' | 'accessoire'>('all');
  
  // Custom toast notifications for added products
  const [addedToastProduct, setAddedToastProduct] = useState<string | null>(null);

  // Filter dynamic lists
  const activeProducts = products.filter(p => {
    if (!p.isActive) return false;
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  const activeVouchers = giftCards.filter(g => g.isActive);

  // Trigger quick toast when adding product
  const handleAddProductToCart = (prod: Product) => {
    addToCart({
      id: prod.id,
      type: 'product',
      name: prod.name,
      price: prod.price,
      imageUrl: prod.imageUrl
    }, false);

    setAddedToastProduct(prod.name);
    setTimeout(() => {
      setAddedToastProduct(null);
    }, 2500);
  };

  // Scroll to giftcards if hash matches
  useEffect(() => {
    if (window.location.hash === '#giftcards') {
      const el = document.getElementById('giftcards');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Toast Notification */}
      {addedToastProduct && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-charcoal border border-brand-pink text-white rounded-xl py-3.5 px-5 shadow-2xl flex items-center gap-3.5 max-w-sm animate-slide-up leading-normal">
          <span className="p-1.5 bg-brand-pink text-brand-charcoal rounded-full shrink-0">
            <Check className="w-4 h-4" />
          </span>
          <div>
            <span className="text-brand-pink font-semibold text-xs block uppercase tracking-wider">Panier Modifié</span>
            <p className="text-xs text-brand-nude line-clamp-2 mt-0.5">
              "{addedToastProduct}" a été ajouté à votre panier.
            </p>
          </div>
          <button onClick={() => setAddedToastProduct(null)} className="p-1 hover:text-brand-pink ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <section className="bg-brand-cream border-b border-brand-pink py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-pink/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-xs uppercase tracking-[0.2em] text-brand-gold font-semibold">Boutique en Ligne</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal text-brand-charcoal mt-2">
            La Boutique <span className="italic text-brand-taupe font-light">&</span> Rituels Cadeaux
          </h2>
          <p className="text-xs sm:text-sm text-brand-taupe max-w-xl mx-auto mt-4 leading-relaxed">
            Offrez l'évasion suprême en personnalisant nos élégants bons d'invitation au format A5 et découvrez notre sélection d'onctions et de produits cosmétiques haut de gamme.
          </p>
          <div className="w-16 h-[1px] bg-brand-gold mx-auto mt-5"></div>
        </div>
      </section>

      {/* SECTION 1: BONS CADEAUX (La vedette - Highlight section) */}
      <section id="giftcards" className="bg-brand-nude py-16 scroll-mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-12">
            <span className="p-2 bg-brand-pink/50 text-brand-charcoal rounded-full inline-block">
              <Gift className="w-5 h-5 text-brand-taupe" />
            </span>
            <h3 className="font-serif text-3xl font-normal text-brand-charcoal">Rituels de Bons Cadeaux</h3>
            <p className="text-xs text-brand-taupe max-w-md mx-auto leading-relaxed">
              Choisissez l'un de nos formats d'invitation. Personnalisez-le immédiatement en ligne afin de générer son PDF imprimable au format A5.
            </p>
            <div className="w-12 h-[1px] bg-brand-pink mx-auto"></div>
          </div>

          {/* Gift vouchers grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeVouchers.map((card) => (
              <div 
                key={card.id}
                className="bg-white rounded-2xl border border-brand-pink-blush overflow-hidden luxury-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
              >
                {/* Image Cover */}
                <div className="h-48 bg-brand-cream relative overflow-hidden group">
                  <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-brand-nude/90 backdrop-blur-xs px-3 py-1 border border-brand-pink rounded-full text-[10px] font-bold text-brand-charcoal">
                    Validité : {card.validityMonths} mois
                  </div>
                </div>

                {/* Content body */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-5 text-left">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="font-serif text-lg font-bold text-brand-charcoal max-h-[1.5em] line-clamp-1">
                        {card.name}
                      </h4>
                      <span className="text-base font-extrabold text-brand-charcoal shrink-0">
                        {card.id === 'gift-liberte' ? 'Dès ' : ''}{card.price} €
                      </span>
                    </div>
                    <p className="text-xs text-brand-taupe leading-relaxed line-clamp-3">
                      {card.description}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedGiftCard(card)}
                    className="w-full py-3 bg-brand-charcoal hover:bg-brand-taupe text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-brand-pink" />
                    <span>Offrir ce bon cadeau</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 2: PHYSICAL COSMETICS */}
      <section className="bg-brand-cream py-16 border-t border-brand-pink-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="text-left space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-brand-gold font-semibold">La Coconerie</span>
              <h3 className="font-serif text-3xl font-normal text-brand-charcoal">Cosmétiques & Éclat</h3>
              <p className="text-xs text-brand-taupe max-w-sm">Notre sélection exclusive de produits Esthederm et Bernard Cassière.</p>
            </div>

            {/* Sub-Category Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Tous les produits', value: 'all' },
                { label: 'Visage', value: 'visage' },
                { label: 'Corps', value: 'corps' },
                { label: 'Accessoires', value: 'accessoire' }
              ].map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilterCategory(btn.value as any)}
                  className={`px-4.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 ${
                    filterCategory === btn.value
                      ? 'bg-brand-charcoal border-brand-charcoal text-white'
                      : 'bg-white border-brand-pink-blush text-brand-taupe hover:border-brand-taupe hover:text-brand-charcoal'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fallback empty view */}
          {activeProducts.length === 0 ? (
            <div className="text-center bg-white p-12 rounded-2xl border border-brand-pink overflow-hidden max-w-md mx-auto space-y-4">
              <span className="p-3 bg-brand-pink-light text-brand-taupe rounded-full inline-block">
                <ShoppingBag className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-serif text-lg font-bold">Aucun cosmétique trouvé</h4>
                <p className="text-xs text-brand-taupe mt-1">Revenez bientôt pour de nouvelles collections en boutique !</p>
              </div>
            </div>
          ) : (
            /* Products List Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  className="bg-white rounded-2xl border border-brand-pink-blush overflow-hidden luxury-shadow transition-all duration-300 hover:shadow-md flex flex-col justify-between group"
                >
                  {/* Photo area */}
                  <div className="w-full aspect-square bg-brand-cream relative overflow-hidden shrink-0 border-b border-brand-pink-blush/40">
                    <img 
                      src={prod.imageUrl} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Brand Labels badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                      {prod.name.toLowerCase().includes('esthederm') && (
                        <span className="bg-brand-charcoal text-white text-[8px] tracking-widest uppercase font-bold px-2 py-0.5 rounded-md">
                          Esthederm
                        </span>
                      )}
                      {prod.name.toLowerCase().includes('bernard') && (
                        <span className="bg-brand-gold text-brand-nude text-[8px] tracking-widest uppercase font-bold px-1.5 py-0.5 rounded-md">
                          Bernard Cassière
                        </span>
                      )}
                    </div>

                    {/* Stock Alert Label */}
                    {!prod.inStock && (
                      <div className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-xs flex items-center justify-center text-xs font-bold text-white uppercase tracking-wider">
                        Rupture temporaire
                      </div>
                    )}
                  </div>

                  {/* Body textual information */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-4 text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest">
                        {prod.category}
                      </span>
                      <h4 className="text-sm font-bold text-brand-charcoal line-clamp-2 h-10">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-brand-taupe leading-relaxed line-clamp-2">
                        {prod.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-pink-blush/40 pt-3 mt-1.5">
                      <span className="text-xs text-brand-taupe font-sans tracking-wide">Prix TTC :</span>
                      <span className="text-sm font-extrabold text-brand-charcoal">
                        {prod.price.toFixed(2)} €
                      </span>
                    </div>

                    {/* Action button */}
                    {prod.inStock ? (
                      <button
                        onClick={() => handleAddProductToCart(prod)}
                        className="w-full py-2.5 bg-brand-nude border border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-colors duration-200 text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Ajouter au panier</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 bg-brand-pink-blush/40 border border-brand-pink text-brand-taupe rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-not-allowed"
                      >
                        <span>Rupture de Stock</span>
                      </button>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* SECTION 4: ASSURANCES CLIENTS */}
      <section className="bg-brand-nude py-12 text-center border-t border-brand-pink-blush">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1 p-3">
              <span className="text-sm font-serif font-bold text-brand-charcoal uppercase tracking-widest block">🌿 PAIEMENT LOCAL</span>
              <p className="text-xs text-brand-taupe">Aucun frais en ligne. Règlement à la remise en boutique en toute sécurité.</p>
            </div>
            <div className="space-y-1 p-3">
              <span className="text-sm font-serif font-bold text-brand-charcoal uppercase tracking-widest block">⚡ TÉLÉCHARGEMENT PDF</span>
              <p className="text-xs text-brand-taupe">Créez votre carte d'invitation personnalisée et téléchargez son PDF instantanément.</p>
            </div>
            <div className="space-y-1 p-3">
              <span className="text-sm font-serif font-bold text-brand-charcoal uppercase tracking-widest block">👜 RETRAIT GRATUIT</span>
              <p className="text-xs text-brand-taupe">Retrait gratuit de vos huiles et cosmétiques directement à l'institut à Mutzig.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE MODAL DISPLAY */}
      {selectedGiftCard && (
        <GiftCardModal 
          card={selectedGiftCard}
          isOpen={true}
          onClose={() => setSelectedGiftCard(null)}
        />
      )}

    </div>
  );
};
export default Boutique;
