import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { GeneratedGiftCard, CartItem, Order } from '../types';
import { KeyRound, Mail, User, Phone, ShoppingBag, Eye, Download, LogOut, CheckCircle, Clock } from 'lucide-react';
import { downloadGiftCardPDF } from '../utils/generateGiftCardPDF';
import { Logo } from '../components/Logo';

export const UserAccount: React.FC = () => {
  const { user, login, register, logout, orders } = useAuth();

  // Log modes
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState(''); // Simulated password field

  const [notif, setNotif] = useState('');

  // Handle Log submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (isRegisterMode) {
      if (!name) {
        setNotif('Le nom est requis.');
        return;
      }
      await register(email, name, phone);
      setNotif('Votre compte client fictif a été créé avec succès.');
    } else {
      await login(email, name || email.split('@')[0], phone);
      setNotif('Bienvenue dans votre espace client Aquabeauté.');
    }

    // Reset fields
    setPassword('');
  };

  // Filter client orders from central mock localStorage list
  const clientOrders = orders.filter(
    ord => ord.clientEmail.toLowerCase() === user?.email.toLowerCase()
  );

  // Re-generate PDF voucher from client history
  const handleDownloadHistoricalPdf = (item: CartItem) => {
    if (item.type !== 'giftcard' || !item.giftCardDetails) return;

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
    <div className="min-h-screen bg-brand-nude py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Display */}
        {!user ? (
          
          /* LOGIN OR REGISTER CARD */
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-brand-pink-blush overflow-hidden shadow-xl">
            
            {/* Form logo header */}
            <div className="p-6 bg-brand-cream text-center border-b border-brand-pink-blush flex flex-col items-center justify-center">
              <Logo size="sm" />
              <span className="text-[9px] uppercase tracking-widest text-brand-taupe block mt-2">
                Espace Client Cocon
              </span>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-6 lg:p-8 flex flex-col gap-4 text-left">
              
              <h3 className="font-serif text-xl font-semibold text-brand-charcoal text-center mb-1">
                {isRegisterMode ? 'Créer un compte client' : 'Connexion Espace Client'}
              </h3>
              
              <p className="text-[11px] text-brand-taupe text-center line-clamp-2 leading-relaxed">
                Connectez-vous pour retrouver vos factures, l'historique de vos commandes de cosmétiques ou re-télécharger vos bons cadeaux.
              </p>

              {notif && (
                <div className="p-3 text-xs text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-100 font-medium">
                  {notif}
                </div>
              )}

              {isRegisterMode && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-brand-charcoal">Nom Complet *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Claire Schmitt"
                      className="w-full pl-10 pr-4 py-2 bg-white border border-brand-pink rounded-lg text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-gold focus:outline-none"
                    />
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-brand-taupe" />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-charcoal">Adresse Email *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="claire.schmitt@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-brand-pink rounded-lg text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-gold focus:outline-none"
                  />
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-brand-taupe" />
                </div>
              </div>

              {isRegisterMode && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-brand-charcoal">Téléphone</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 12 34 56 78"
                      className="w-full pl-10 pr-4 py-2 bg-white border border-brand-pink rounded-lg text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-gold focus:outline-none"
                    />
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-brand-taupe" />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-charcoal">Mot de passe (Simulé)</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-brand-pink rounded-lg text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-gold focus:outline-none"
                  />
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-brand-taupe" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-charcoal text-white hover:bg-brand-taupe duration-200 text-xs font-bold uppercase tracking-wider rounded-lg mt-2 cursor-pointer"
              >
                {isRegisterMode ? "S'enregistrer" : "Se Connecter"}
              </button>

              <div className="text-center mt-3 border-t border-brand-pink-blush pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setNotif('');
                    setName('');
                    setPhone('');
                  }}
                  className="text-xs text-brand-gold hover:text-brand-charcoal font-semibold uppercase tracking-wider"
                >
                  {isRegisterMode ? 'Déjà cliente ? Se connecter' : 'Nouvelle cliente ? Créer mon espace'}
                </button>
              </div>

            </form>

          </div>

        ) : (
          
          /* CONNECTED USER ACCOUNT LOG */
          <div className="space-y-8 text-left">
            
            {/* Welcome banner card */}
            <div className="p-6 sm:p-8 bg-brand-cream border border-brand-pink rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gold">Votre Havre de Bien-être</span>
                <h2 className="font-serif text-3xl font-normal text-brand-charcoal">Bienvenue, {user.name} !</h2>
                <p className="text-xs text-brand-taupe flex items-center gap-1">
                  Connecté(e) avec l'adresse : <strong className="text-brand-charcoal font-semibold">{user.email}</strong>
                </p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 ring-1 ring-brand-taupe text-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-all text-xs font-semibold uppercase tracking-wider rounded-md inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>

            {/* Profile detail details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Profile card left column */}
              <div className="md:col-span-4 bg-white rounded-2xl p-6 border border-brand-pink-blush space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gold block pb-2 border-b border-brand-pink-blush">
                  Vos coordonnées :
                </span>
                
                <div className="space-y-3.5 text-xs text-brand-charcoal">
                  <div>
                    <span className="text-[10px] text-brand-taupe block uppercase font-medium">Nom complet</span>
                    <p className="font-bold text-sm mt-0.5">{user.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-taupe block uppercase font-medium">Adresse Email</span>
                    <p className="font-semibold text-sm mt-0.5">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-taupe block uppercase font-medium">Téléphone portable</span>
                    <p className="text-sm mt-0.5">{user.phone || 'Non renseigné'}</p>
                  </div>
                </div>

                <div className="bg-brand-cream rounded-xl p-3 text-[11px] text-brand-taupe leading-relaxed mt-4 border border-brand-pink-blush">
                  💎 <span className="font-semibold text-brand-charcoal">Programme fidélité</span> : Vos achats à l'institut Aquabeauté de Mutzig sont comptabilisés. À partir de 10 rituels, profitez de -10% sur toute la boutique !
                </div>
              </div>

              {/* Order history right column */}
              <div className="md:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-brand-pink-blush space-y-5">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gold block pb-2 border-b border-brand-pink-blush flex justify-between">
                  <span>Historique de vos commandes</span>
                  <span>({clientOrders.length})</span>
                </span>

                {clientOrders.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <span className="p-3 bg-brand-pink-light text-brand-taupe rounded-full inline-block">
                      <ShoppingBag className="w-5 h-5" />
                    </span>
                    <h4 className="text-sm font-bold text-brand-charcoal">Aucune commande répertoriée</h4>
                    <p className="text-xs text-brand-taupe max-w-xs mx-auto">
                      Vos commandes de cosmétiques ou de bons d'invitation apparaîtront directement ici.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clientOrders.map((ord) => (
                      <div 
                        key={ord.id}
                        className="p-4 bg-brand-nude/40 rounded-xl border border-brand-pink-blush space-y-3 text-xs"
                      >
                        {/* Header details */}
                        <div className="flex justify-between items-center pb-2 border-b border-brand-pink-blush/40 text-[11px]">
                          <div>
                            <span className="font-bold text-brand-charcoal text-xs">{ord.id}</span>
                            <span className="text-brand-taupe block font-sans">Date : {ord.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-brand-pink-blush">
                            {ord.status === 'confirmed' ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-bold uppercase text-[9px]">Confirmée / Payé</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                <span className="text-amber-700 font-bold uppercase text-[9px]">En attente de règlement</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* List items */}
                        <div className="space-y-2.5">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-start gap-4 text-xs font-sans">
                              <div>
                                <p className="font-semibold text-brand-charcoal font-sans">
                                  {it.name} <span className="text-brand-taupe">x{it.quantity}</span>
                                </p>
                                
                                {/* Gift code direct redownloading */}
                                {it.type === 'giftcard' && it.giftCardDetails && (
                                  <div className="flex flex-col gap-1 mt-1 pl-2 border-l border-brand-pink-dark text-[11px] text-brand-taupe">
                                    <p>Destinataire : <strong className="font-semibold text-brand-charcoal">{it.giftCardDetails.beneficiaryName}</strong></p>
                                    <button
                                      onClick={() => handleDownloadHistoricalPdf(it)}
                                      className="flex items-center gap-1 text-[9px] text-brand-gold hover:text-brand-charcoal font-semibold uppercase tracking-wider self-start"
                                    >
                                      <Download className="w-3 h-3" />
                                      Regénérer Bon PDF
                                    </button>
                                  </div>
                                )}
                              </div>
                              <span className="font-bold text-brand-charcoal">{it.price * it.quantity} €</span>
                            </div>
                          ))}
                        </div>

                        {/* Subtotal Footer */}
                        <div className="flex justify-between items-center border-t border-brand-pink-blush/40 pt-2 text-[11px] font-bold text-brand-charcoal">
                          <span>Montant global :</span>
                          <span className="text-brand-eucalyptus text-sm">{ord.total} €</span>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>

          </div>

        )}

      </div>
    </div>
  );
};
export default UserAccount;
