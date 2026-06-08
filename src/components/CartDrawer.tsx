import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { GeneratedGiftCard, CartItem, Order } from '../types';
import { X, Trash2, Download, ShoppingBag, ArrowRight, CheckCircle, Gift, Home, MapPin } from 'lucide-react';
import { generateGiftCardPDF, downloadGiftCardPDF } from '../utils/generateGiftCardPDF';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal, total, cartCount } = useCart();
  const { user, login, orders, setOrders } = useAuth();

  // Step 1: 'cart' | Step 2: 'checkout_info' | Step 3: 'success'
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout_info' | 'success'>('cart');
  
  // Checkout Info Form State
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientEmail, setClientEmail] = useState(user?.email || '');
  const [clientPhone, setClientPhone] = useState(user?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState('');

  if (!isOpen) return null;

  // Check if any cart item is physical product
  const hasPhysicalProducts = cartItems.some(item => item.type === 'product');

  // Perform checkout submission
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;

    setIsSubmitting(true);

    // Auto-login/register user state if they aren't authenticated
    if (!user) {
      await login(clientEmail, clientName, clientPhone);
    }

    const uniqueId = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-${uniqueId}`;

    // Compile order details
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      clientName,
      clientEmail,
      clientPhone,
      deliveryAddress: hasPhysicalProducts ? deliveryAddress : undefined,
      items: [...cartItems],
      subtotal,
      total,
      status: 'pending'
    };

    // Save order in mock DB ( localStorage / State )
    // Ensure orders are updated properly
    setOrders(prev => [newOrder, ...prev]);
    setLastCreatedOrderId(orderId);
    
    // Simulate slight luxury loading behavior
    setTimeout(() => {
      setIsSubmitting(false);
      setCheckoutStep('success');
      clearCart();
    }, 1200);
  };

  // Redownload PDF right from Cart
  const handleRedownloadPdf = (item: CartItem) => {
    if (item.type !== 'giftcard' || !item.giftCardDetails) return;

    // Reconstruct voucher info for download
    const refId = item.id.replace('cart-gift-', '');
    const issueDate = new Date().toISOString().split('T')[0];
    const expDate = new Date();
    expDate.setMonth(expDate.getMonth() + item.giftCardDetails.validityMonths);
    const expFormatted = `${expDate.getFullYear()}-${(expDate.getMonth() + 1).toString().padStart(2, '0')}-${expDate.getDate().toString().padStart(2, '0')}`;

    const tempGiftCard: GeneratedGiftCard = {
      id: refId,
      name: item.name,
      beneficiaryName: item.giftCardDetails.beneficiaryName,
      message: item.giftCardDetails.message,
      buyerName: item.giftCardDetails.buyerName || 'Un proche',
      amount: item.price,
      dateGenerated: issueDate,
      expiryDate: expFormatted,
      status: 'pending'
    };

    downloadGiftCardPDF(tempGiftCard);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-brand-charcoal/40 backdrop-blur-xs animate-fade-in">
      
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide-over panel */}
      <div className="relative w-full max-w-lg h-full bg-brand-nude shadow-2xl flex flex-col z-10 border-l border-brand-pink-blush overflow-hidden animate-slide-left">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-brand-pink-blush bg-brand-cream flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-taupe" />
            <h3 className="font-serif text-xl font-bold tracking-wide text-brand-charcoal">
              {checkoutStep === 'cart' && 'Mon Panier'}
              {checkoutStep === 'checkout_info' && 'Informations de livraison'}
              {checkoutStep === 'success' && 'Félicitations !'}
            </h3>
            {checkoutStep === 'cart' && cartCount > 0 && (
              <span className="bg-brand-pink text-brand-charcoal font-medium text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-brand-pink-blush text-brand-taupe hover:text-brand-charcoal rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic step rendering */}
        <div className="flex-1 overflow-y-auto p-5">
          
          {/* STEP 1: BASKET DISPLAY */}
          {checkoutStep === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-4">
                  <span className="p-4 bg-brand-pink-light rounded-full text-brand-taupe">
                    <ShoppingBag className="w-8 h-8" />
                  </span>
                  <div>
                    <h4 className="font-serif text-lg font-semibold text-brand-charcoal">Votre panier est vide</h4>
                    <p className="text-xs text-brand-taupe mt-1 max-w-xs leading-relaxed">
                      Laissez-vous tenter par nos cosmétiques d'exception ou offrez une invitation au voyage à vos proches.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 btn-luxury-secondary text-xs rounded-lg py-2.5 px-6"
                  >
                    Découvrir la boutique
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-4 bg-white rounded-xl border border-brand-pink-blush flex gap-4 hover:shadow-xs transition-shadow duration-300 relative group"
                    >
                      {/* Item Thumbnail */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-brand-cream shrink-0 border border-brand-pink-blush">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Detail Column */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-semibold text-brand-charcoal truncate pr-2">
                            {item.name}
                          </h4>
                          <span className="text-sm font-bold text-brand-charcoal shrink-0">
                            {item.price} €
                          </span>
                        </div>

                        {/* Gift Card Specific Info */}
                        {item.type === 'giftcard' && item.giftCardDetails && (
                          <div className="mt-2 p-2 bg-brand-pink-light rounded-lg border border-brand-pink-blush/30 text-[11px] text-brand-taupe flex flex-col gap-1">
                            <p className="flex items-center gap-1 font-medium text-brand-charcoal">
                              <Gift className="w-3.5 h-3.5 text-brand-gold" />
                              Destinataire : <span className="font-bold">{item.giftCardDetails.beneficiaryName}</span>
                            </p>
                            {item.giftCardDetails.message && (
                              <p className="italic line-clamp-1">"{item.giftCardDetails.message}"</p>
                            )}
                            <button
                              onClick={() => handleRedownloadPdf(item)}
                              className="mt-1 flex items-center gap-1 text-[10px] text-brand-gold hover:text-brand-charcoal uppercase tracking-wider font-semibold self-start"
                            >
                              <Download className="w-3 h-3" />
                              Re-télécharger le PDF
                            </button>
                          </div>
                        )}

                        {/* Quantity / Subtotal Control for physical models */}
                        <div className="flex items-center justify-between mt-3">
                          {item.type === 'product' ? (
                            <div className="flex items-center gap-2 border border-brand-pink rounded-lg bg-brand-nude">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-0.5 hover:bg-brand-pink-blush text-brand-taupe transition-colors"
                              >
                                -
                              </button>
                              <span className="text-xs text-brand-charcoal font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-0.5 hover:bg-brand-pink-blush text-brand-taupe transition-colors"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-brand-taupe bg-brand-cream px-2 py-0.5 rounded-md border border-brand-pink-blush">
                              Soin unique
                            </span>
                          )}

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:bg-red-50 text-brand-taupe hover:text-red-600 rounded-md transition-all"
                            title="Supprimer du panier"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT CONTACT DETAILS */}
          {checkoutStep === 'checkout_info' && (
            <form onSubmit={handleConfirmOrder} className="flex flex-col gap-4">
              <div className="p-4 bg-brand-pink-light rounded-xl border border-brand-pink-blush text-xs text-brand-taupe leading-relaxed">
                📢 <span className="font-semibold text-brand-charcoal">Validation finale</span> : Nous collectons vos coordonnées pour valider la commande. <strong>Aucun paiement en ligne</strong> immédiat n'est requis. Nous vous recontacterons sous 24h par email ou téléphone pour finaliser les modalités de règlement (virement, chèque ou retrait sur place).
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-charcoal">Nom et Prénom *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-brand-pink rounded-lg text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-gold focus:outline-none"
                  placeholder="Claire Schmitt"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-charcoal">Adresse Email *</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-brand-pink rounded-lg text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-gold focus:outline-none"
                  placeholder="claire.schmitt@example.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-charcoal">Numéro de téléphone</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-brand-pink rounded-lg text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-gold focus:outline-none"
                  placeholder="Ex: 06 12 34 56 78"
                />
              </div>

              {hasPhysicalProducts && (
                <div className="flex flex-col gap-1.5 p-4 border border-brand-pink bg-white/50 rounded-xl mt-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-charcoal mb-1">
                    <MapPin className="w-4 h-4 text-brand-gold" />
                    <span>Adresse de Livraison (Produit Physique) *</span>
                  </div>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-brand-pink rounded-lg text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-gold focus:outline-none resize-none"
                    placeholder="Ex: 14 Rue de l'Éden, 67190 Mutzig"
                  />
                  <p className="text-[10px] text-brand-taupe leading-snug mt-1">
                    Délivré par paquet postal ou retrait physique disponible à l'institut Aquabeauté à Mutzig.
                  </p>
                </div>
              )}

              {/* Order summary reminder */}
              <div className="bg-brand-cream border border-brand-pink rounded-lg p-4 mt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-taupe">Récapitulatif</span>
                <div className="flex justify-between items-center text-sm font-bold text-brand-charcoal mt-1">
                  <span>Montant Total</span>
                  <span>{total} € TTC</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="flex-1 py-3 text-xs uppercase font-medium border border-brand-taupe rounded-lg text-brand-charcoal hover:bg-brand-pink-light transition-all"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] py-3 text-xs uppercase font-bold bg-brand-charcoal text-white hover:bg-brand-taupe rounded-lg flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Enregistrement...' : 'Confirmer ma commande'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: TRANSACTION REGISTERED SUCCESSFULLY */}
          {checkoutStep === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-5">
              <span className="p-4 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <CheckCircle className="w-10 h-10" />
              </span>
              
              <div>
                <h4 className="font-serif text-2xl font-bold text-brand-charcoal">Commande Enregistrée !</h4>
                <p className="text-xs text-brand-gold font-semibold uppercase tracking-wider mt-1"> Référence {lastCreatedOrderId}</p>
                <p className="text-xs text-brand-taupe mt-3 leading-relaxed max-w-sm">
                  Votre commande a bien été enregistrée par notre équipe. Un mail récapitulatif a été envoyé à <strong className="text-brand-charcoal">{clientEmail}</strong>.
                </p>
                <p className="text-xs text-brand-taupe mt-2 leading-relaxed max-w-sm font-medium">
                  L'équipe de l'institut Aquabeauté à Mutzig vous recontactera sous 24h pour finaliser le règlement et convenir du mode de remise (retrait ou envoi).
                </p>
              </div>

              <div className="w-full p-4 bg-brand-cream border border-brand-pink-blush rounded-xl">
                <p className="text-xs text-brand-charcoal text-left flex justify-between">
                  <span className="font-medium text-brand-taupe">Client :</span>
                  <span className="font-semibold">{clientName}</span>
                </p>
                <p className="text-xs text-brand-charcoal text-left flex justify-between mt-1">
                  <span className="font-medium text-brand-taupe">Total commandé :</span>
                  <span className="font-bold text-brand-eucalyptus">{total} €</span>
                </p>
              </div>

              <button
                onClick={() => {
                  setCheckoutStep('cart');
                  onClose();
                }}
                className="w-full btn-luxury-primary text-xs rounded-xl py-3"
              >
                Continuer mes visites
              </button>
            </div>
          )}

        </div>

        {/* Drawer Footer summary (Sticky at bottom, only on core item view, step 1) */}
        {checkoutStep === 'cart' && cartItems.length > 0 && (
          <div className="p-5 border-t border-brand-pink-blush bg-brand-cream flex flex-col gap-4">
            <div className="space-y-1.5 text-sm text-brand-charcoal">
              <div className="flex justify-between">
                <span className="text-brand-taupe font-medium">Sous-total :</span>
                <span className="font-medium">{subtotal} €</span>
              </div>
              <div className="flex justify-between text-base font-bold text-brand-charcoal border-t border-brand-pink-blush/60 pt-2">
                <span>Total TTC :</span>
                <span className="text-brand-charcoal">{total} €</span>
              </div>
            </div>

            <button
              onClick={() => setCheckoutStep('checkout_info')}
              className="w-full py-3.5 bg-brand-charcoal hover:bg-brand-taupe text-brand-nude text-xs uppercase font-bold tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
            >
              <span>Valider ma commande</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
export default CartDrawer;
