import React, { useState } from 'react';
import { GiftCard, GeneratedGiftCard } from '../types';
import { X, Sparkles, Download, ShoppingBag, Eye } from 'lucide-react';
import { generateGiftCardPDF, downloadGiftCardPDF } from '../utils/generateGiftCardPDF';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

interface GiftCardModalProps {
  card: GiftCard;
  isOpen: boolean;
  onClose: () => void;
}

export const GiftCardModal: React.FC<GiftCardModalProps> = ({ card, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { setGeneratedBons } = useAuth();

  // Form Fields
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [message, setMessage] = useState('');
  const [customPrice, setCustomPrice] = useState<number>(card.id === 'gift-liberte' ? 50 : card.price);
  
  // Statuses
  const [error, setError] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedCardData, setGeneratedCardData] = useState<GeneratedGiftCard | null>(null);

  if (!isOpen) return null;

  const isCustomPriceType = card.id === 'gift-liberte';

  // Handle addition to cart + PDF download
  const handleSubmit = (e: React.FormEvent, onlyPDF = false) => {
    e.preventDefault();

    if (!beneficiaryName.trim()) {
      setError('Le prénom et nom du destinataire sont obligatoires.');
      return;
    }

    if (isCustomPriceType && customPrice < 30) {
      setError('Le montant minimum pour un bon liberté est de 30 €.');
      return;
    }

    setError('');
    const selectedPrice = isCustomPriceType ? customPrice : card.price;

    // Generate unique reference ID
    const randomHex = Math.floor(1000 + Math.random() * 9000); // 4 digit code
    const refId = `QB-2026-${randomHex}`;

    // Expiry Date calculations: defaults to validation month scope (e.g., 6 or 12 months)
    const issueDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(issueDate.getMonth() + card.validityMonths);

    const padZero = (n: number) => n.toString().padStart(2, '0');
    const dateFormatted = `${issueDate.getFullYear()}-${padZero(issueDate.getMonth() + 1)}-${padZero(issueDate.getDate())}`;
    const expiryFormatted = `${expiryDate.getFullYear()}-${padZero(expiryDate.getMonth() + 1)}-${padZero(expiryDate.getDate())}`;

    const newGiftObject: GeneratedGiftCard = {
      id: refId,
      name: card.name,
      beneficiaryName: beneficiaryName.trim(),
      message: message.trim(),
      buyerName: buyerName.trim() || 'Un proche',
      amount: selectedPrice,
      dateGenerated: dateFormatted,
      expiryDate: expiryFormatted,
      status: 'pending' // client order will turn this to 'paid' when confirmed
    };

    // Store in global mock DB (localStorage synced state)
    setGeneratedBons(prev => [newGiftObject, ...prev]);
    setGeneratedCardData(newGiftObject);
    setIsGenerated(true);

    if (onlyPDF) {
      // Just download the PDF immediately
      downloadGiftCardPDF(newGiftObject);
    } else {
      // Add customized card to Basket
      addToCart({
        id: `cart-gift-${refId}`,
        type: 'giftcard',
        name: card.name,
        price: selectedPrice,
        imageUrl: card.imageUrl || 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop',
        giftCardDetails: {
          beneficiaryName: beneficiaryName.trim(),
          buyerName: buyerName.trim(),
          message: message.trim(),
          validityMonths: card.validityMonths
        }
      }, true);

      // Trigger standard PDF download so they get it immediately too
      downloadGiftCardPDF(newGiftObject);
      
      // Close modal on success
      onClose();
      // Reset form states
      setBeneficiaryName('');
      setBuyerName('');
      setMessage('');
      setIsGenerated(false);
      setGeneratedCardData(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-4xl bg-brand-nude rounded-2xl shadow-2xl overflow-hidden border border-brand-pink-blush max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-pink-blush bg-brand-cream">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-brand-pink rounded-full text-brand-charcoal">
              <Sparkles className="w-5 h-5 text-brand-taupe" />
            </span>
            <div>
              <h3 className="font-serif text-2xl font-semibold tracking-tight text-brand-charcoal">
                Personnaliser : {card.name}
              </h3>
              <p className="text-xs text-brand-taupe mt-0.5">
                Création et téléchargement instantané de votre bon cadeau premium
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-brand-pink-blush rounded-full transition-colors duration-200 text-brand-taupe hover:text-brand-charcoal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content - Side by side preview & form */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Column */}
            <form onSubmit={(e) => handleSubmit(e, false)} className="lg:col-span-7 flex flex-col gap-5">
              
              {/* Custom price numerical input for Bon Liberté */}
              {isCustomPriceType && (
                <div className="flex flex-col gap-1.5 p-4 bg-brand-pink-light rounded-xl border border-brand-pink-blush">
                  <label className="text-sm font-semibold text-brand-charcoal">
                    Montant de votre Bon Cadeau personnalisé (en €) *
                  </label>
                  <p className="text-xs text-brand-taupe mb-2">
                    Définissez la valeur libre que votre proche pourra dépenser (minimum de 30 €)
                  </p>
                  <div className="relative rounded-lg shadow-sm max-w-xs">
                    <input
                      type="number"
                      min="30"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(parseInt(e.target.value) || 0)}
                      className="w-full pl-4 pr-12 py-2 text-lg font-semibold bg-white border border-brand-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent text-brand-charcoal"
                      placeholder="Ex: 50"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-brand-taupe font-medium">
                      € TTC
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-brand-charcoal flex justify-between">
                  <span>Prénom & Nom du/de la bénéficiaire *</span>
                  <span className="text-[11px] text-brand-gold">(Obligatoire)</span>
                </label>
                <input
                  type="text"
                  required
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="Ex: Claire Schmitt"
                  className="w-full px-4 py-2.5 bg-white border border-brand-pink rounded-lg focus:ring-1 focus:ring-brand-gold focus:outline-none text-brand-charcoal text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-brand-charcoal flex justify-between">
                  <span>Votre Prénom / Nom</span>
                  <span className="text-[11px] text-brand-taupe font-normal">(Optionnel)</span>
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Ex: Sophie & Luc"
                  className="w-full px-4 py-2.5 bg-white border border-brand-pink rounded-lg focus:ring-1 focus:ring-brand-gold focus:outline-none text-brand-charcoal text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-brand-charcoal flex justify-between">
                  <span>Votre Message Personnalisé</span>
                  <span className="text-[11px] text-brand-taupe font-normal">(Optionnel - Max 200 car.)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ex: Joyeux anniversaire de notre part ! Profite bien de cette parenthèse magique à Mutzig..."
                  className="w-full px-4 py-2.5 bg-white border border-brand-pink rounded-lg focus:ring-1 focus:ring-brand-gold focus:outline-none text-brand-charcoal text-sm resize-none"
                />
              </div>

              {error && (
                <div className="p-3 text-xs text-red-700 bg-red-50 rounded-lg border border-red-100 font-medium">
                  {error}
                </div>
              )}

              <div className="text-[11px] text-brand-taupe leading-relaxed">
                ℹ️ <span className="font-semibold">Mentions légales</span> : Les bons cadeaux ont une durée de validité de <span className="font-semibold">{card.validityMonths} mois</span> à compter de leur achat. Ils sont valables uniquement pour les soins et prestations de l\'institut (non remboursables, non échangeables pour des cosmétiques physiques).
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4 border-t border-brand-pink-blush pt-5">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-brand-taupe text-brand-charcoal hover:bg-brand-cream transition-colors duration-200 uppercase tracking-wider text-xs font-semibold rounded-lg"
                >
                  <Download className="w-4 h-4" />
                  Générer le PDF seul
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-brand-charcoal text-white hover:bg-brand-taupe transition-colors duration-200 uppercase tracking-wider text-xs font-semibold rounded-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Ajouter au Panier (avec PDF)
                </button>
              </div>

            </form>

            {/* Live Card Preview Column */}
            <div className="lg:col-span-5 flex flex-col justify-start gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-taupe block mb-1">
                Aperçu instantané du bon :
              </span>
              
              {/* Beautiful luxury presentation voucher mockup */}
              <div className="w-full aspect-[1.41] bg-brand-cream border-2 border-brand-pink-blush p-4 rounded-xl relative flex flex-col justify-between shadow-lg overflow-hidden select-none">
                
                {/* Thin golden internal frame */}
                <div className="absolute inset-1.5 border border-brand-gold/50 rounded-lg pointer-events-none"></div>

                {/* Cover texture top blur */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-pink/30 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-gold/15 rounded-full blur-2xl pointer-events-none"></div>

                {/* Logo & Header */}
                <div className="text-center z-10 pt-1 flex flex-col items-center justify-center">
                  <Logo size="sm" />
                  <span className="block text-[7px] tracking-[0.2em] text-brand-taupe uppercase mt-1">
                    L'ÉDEN DU BIEN-ÊTRE À MUTZIG
                  </span>
                  <div className="w-12 h-[1px] bg-brand-pink/40 mx-auto mt-1"></div>
                </div>

                {/* Body Details */}
                <div className="text-center z-10 my-1 py-1 px-1 bg-brand-nude/65 rounded-lg border border-brand-pink/25 backdrop-blur-xs">
                  <span className="block text-[8px] uppercase tracking-widest text-brand-gold font-semibold mb-0.5">
                    Invitation au Voyage
                  </span>
                  <span className="block font-serif text-sm font-bold text-brand-charcoal leading-tight truncate">
                    {card.name.toUpperCase()}
                  </span>
                  <span className="block text-[11px] font-semibold text-brand-eucalyptus mt-0.5">
                    Valeur : {isCustomPriceType ? (customPrice || 30) : card.price} € TTC
                  </span>
                </div>

                {/* Form parameters live display */}
                <div className="text-left text-[8px] space-y-1 mx-2 z-10">
                  <p className="flex justify-between border-b border-brand-pink-blush/40 pb-0.5">
                    <span className="text-brand-taupe">Destinataire :</span>
                    <span className="font-semibold text-brand-charcoal">
                      {beneficiaryName.trim() ? beneficiaryName : '...........................................'}
                    </span>
                  </p>
                  <p className="flex justify-between border-b border-brand-pink-blush/40 pb-0.5">
                    <span className="text-brand-taupe font-normal">De la part de :</span>
                    <span className="italic font-medium text-brand-charcoal">
                      {buyerName.trim() ? buyerName : '...........................................'}
                    </span>
                  </p>
                  <div className="mt-1 pt-0.5">
                    <span className="text-[7px] text-brand-taupe block">Message :</span>
                    <p className="italic text-[7.5px] text-brand-charcoal leading-relaxed line-clamp-2 mt-0.5 pl-1 italic">
                      {message.trim() ? `"${message}"` : '"Votre message doux écrit ici..."'}
                    </p>
                  </div>
                </div>

                {/* Footer with validation details */}
                <div className="flex justify-between items-end border-t border-brand-gold/25 pt-1 mt-1 z-10">
                  <div className="text-[6.5px] text-brand-taupe">
                    <p>Code : QB-2026-MOCK</p>
                    <p>Valide : {card.validityMonths} mois</p>
                  </div>
                  <div className="text-[6px] text-brand-taupe text-right">
                    <p className="font-semibold">Réservation requise</p>
                    <p>14 r. de l'Église, Mutzig • 03 88 47 12 90</p>
                  </div>
                </div>

              </div>

              {/* Informative advice */}
              <div className="bg-brand-cream hover:bg-brand-pink-light transition-all rounded-lg p-3.5 border border-brand-pink-blush flex items-start gap-2.5 text-xs text-brand-taupe leading-relaxed">
                <Eye className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-brand-charcoal block mb-0.5">Visualisez votre PDF</span>
                  Chaque bon personnalisé est rédigé de façon asymétrique et imprimé au format A5. Vous pouvez à tout moment regénérer et télécharger un PDF de test en cliquant sur "Générer le PDF seul" ou l'envoyer dans le panier directement.
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
export default GiftCardModal;
