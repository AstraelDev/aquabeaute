import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CARE_CATEGORIES, DEFAULT_GIFT_CARDS } from '../data/defaultData';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Heart, Info, Gift } from 'lucide-react';
import { GiftCardModal } from '../components/GiftCardModal';
import { GiftCard } from '../types';

interface CarePageProps {
  categoryId?: string;
}

export const CarePage: React.FC<CarePageProps> = ({ categoryId }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { giftCards } = useAuth();

  // Find category dynamically based on prop or route slug
  const category = CARE_CATEGORIES.find(
    c => c.id === categoryId || c.slug === slug
  );

  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-brand-nude">
        <h3 className="font-serif text-3xl font-bold">Catégorie introuvable</h3>
        <p className="text-sm text-brand-taupe mt-2">Désolé, cette catégorie de prestation n'existe pas.</p>
        <Link to="/" className="mt-4 btn-luxury-primary text-xs rounded-lg py-2">Retourner à l'accueil</Link>
      </div>
    );
  }

  // Find a matching pre-saved giftcard catalog type to pre-fill if customer wants to purchase as voucher!
  const getGiftCardToBuy = (): GiftCard | null => {
    if (category.id === 'visage') {
      return giftCards.find(g => g.id === 'gift-visage') || null;
    }
    if (category.id === 'corps') {
      return giftCards.find(g => g.id === 'gift-corps') || null;
    }
    if (category.id === 'minceur') {
      return giftCards.find(g => g.id === 'gift-minceur') || null;
    }
    // Default fallback to "Bon Rituel Détente"
    return giftCards.find(g => g.id === 'gift-detente') || giftCards[0] || null;
  };

  const handleOpenVoucherModal = () => {
    const cardToBuy = getGiftCardToBuy();
    if (cardToBuy) {
      setSelectedGiftCard(cardToBuy);
    } else {
      navigate('/boutique#giftcards');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-nude">
      
      {/* Dynamic Header Banner with parallax layout */}
      <section className="relative h-[45vh] min-h-[300px] bg-brand-charcoal overflow-hidden flex flex-col justify-end p-8 lg:p-16">
        {/* Overlay dark */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/40 to-transparent z-10"></div>
        <img 
          src={category.imageUrl} 
          alt={category.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-100 select-none pointer-events-none"
          referrerPolicy="no-referrer"
        />

        {/* Text area */}
        <div className="max-w-7xl mx-auto w-full relative z-20 text-left space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-brand-pink">
            ✦ RITUELS ET BIEN-ÊTRE DE L'INSTITUT ✦
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-brand-nude">
            {category.title}
          </h2>
          <p className="text-xs sm:text-sm text-brand-pink-light font-sans max-w-2xl leading-relaxed">
            {category.description}
          </p>
        </div>
      </section>

      {/* Specialty Technology Highlight Blocks */}
      {category.id === 'epilation' && (
        <section className="bg-brand-cream border-b border-brand-pink py-8 sm:py-10 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-pink-blush flex flex-col lg:flex-row gap-6 items-center luxury-shadow-sm">
              <span className="p-4 bg-brand-pink-light text-brand-gold rounded-full shrink-0">
                <Sparkles className="w-8 h-8 text-brand-taupe" />
              </span>
              <div className="space-y-2">
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-brand-charcoal">
                  Technologie Révolutionnaire : Lumière Pulsée Ariane 🇫🇷
                </h4>
                <p className="text-xs sm:text-sm text-brand-taupe leading-relaxed">
                  L'institut Aquabeauté est équipé du dispositif dermatologique de référence <strong>Ariane</strong>. Cette technologie de pointe élimine durablement, de manière sécurisée et totalement indolore, les poils indésirables. Idéal pour retrouver un toucher velours à vie. Séance de diagnostic et bilan offerts sur simple appel.
                </p>
                <div className="inline-flex items-center gap-2 bg-brand-pink-light text-brand-charcoal text-[11px] font-semibold tracking-wider rounded-md py-1 px-3.5 mt-1">
                  🛡️ Certification CE Médicale • Résultats visibles dès la première séance
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {category.id === 'minceur' && (
        <section className="bg-brand-cream border-b border-brand-pink py-8 sm:py-10 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-pink-blush flex flex-col lg:flex-row gap-6 items-center luxury-shadow-sm">
              <span className="p-4 bg-brand-pink-light text-brand-gold rounded-full shrink-0">
                <Sparkles className="w-8 h-8 text-brand-taupe" />
              </span>
              <div className="space-y-2">
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-brand-charcoal">
                  Minceur Révolutionnaire : Cellutec G5 Multi-fréquences 💆‍♀️
                </h4>
                <p className="text-xs sm:text-sm text-brand-taupe leading-relaxed">
                  Grâce à la technique brevetée du <strong>Cellutec G5</strong>, nous diffusons de douces ondes vibratoires infrasonores à percussion rotative adaptées. Ce traitement mécanique favorise le désengorgement graisseux profond, draine efficacement les toxines et stimule instantanément la synthèse d'élastine pour lisser visiblement la cellulite.
                </p>
                <div className="inline-flex items-center gap-1.5 bg-brand-pink-light text-brand-charcoal text-[11px] font-semibold tracking-wider rounded-md py-1 px-3.5 mt-1">
                  👙 Perte de centimètres • Action fermeté • Jambes légères incomparables
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {category.id === 'visage' && (
        <section className="bg-brand-cream border-b border-brand-pink py-8 sm:py-10 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-6 border border-brand-pink-blush flex flex-wrap gap-8 items-center justify-around luxury-shadow-sm">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">Partenaire Électif Officiel</span>
                <p className="font-serif text-lg font-bold text-brand-charcoal tracking-widest">L'EXCELLENCE ESTHEDERM</p>
              </div>
              <div className="h-[1px] w-full sm:w-[1px] sm:h-12 bg-brand-pink-blush"></div>
              <div className="max-w-md text-xs text-brand-taupe text-center sm:text-left">
                Profitez de la formulation certifiée brevetée **"Eau Cellulaire"** d'Esthederm Paris. Chaque soin visage est enrichi en rééquilibrants cellulaires de pointe pour dynamiser le métabolisme de votre épiderme.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: THE DETAILED CARE AND TRANSACTION GRID TABLE */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-gold">Prestations & Tarifs</span>
            <h3 className="font-serif text-3xl font-normal text-brand-charcoal">Notre Carte de Soins</h3>
            <p className="text-xs text-brand-taupe">Tous nos soins sont prodigués par Christelle avec des huiles et émulsions haut de gamme.</p>
            <div className="w-16 h-[1.5px] bg-brand-pink mx-auto mt-2"></div>
          </div>

          {/* Pricing table */}
          <div className="bg-white rounded-2xl border border-brand-pink-blush luxury-shadow overflow-hidden flex flex-col divide-y divide-brand-pink-blush/60">
            {category.items.map((item) => (
              <div 
                key={item.id}
                className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-brand-nude/40 transition-colors duration-200 text-left"
              >
                {/* Information detailed area */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h4 className="font-serif text-lg font-bold text-brand-charcoal">
                      {item.name}
                    </h4>
                    
                    {item.duration && (
                      <span className="bg-brand-cream text-brand-taupe font-sans text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border border-brand-pink-blush">
                        ⏱️ {item.duration}
                      </span>
                    )}

                    {item.isSpecial && (
                      <span className="bg-brand-pink text-brand-charcoal text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-current text-brand-taupe" />
                        Signature
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs text-brand-taupe leading-relaxed pr-6">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Pricing & shopping calls */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 border-brand-pink-blush/40 pt-3 md:pt-0">
                  <span className="font-bold text-xl text-brand-charcoal">
                    {item.price.toFixed(2)} €
                  </span>

                  <button
                    onClick={handleOpenVoucherModal}
                    className="px-5 py-2.5 bg-brand-cream border border-brand-charcoal hover:bg-brand-charcoal hover:text-white text-brand-charcoal transition-colors duration-200 text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Offrir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 4: HOW TO RENDER APPOINTMENTS / RESERVATION */}
      <section className="bg-brand-cream py-16 text-center border-t border-brand-pink-blush">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h4 className="font-serif text-2xl font-bold text-brand-charcoal">Réserver ma séance à l'institut Aquabeauté</h4>
          
          <p className="text-xs sm:text-sm text-brand-taupe leading-relaxed">
            Pour réserver l'une de ces magnifiques prestations, vous pouvez appeler directement Christelle au téléphone au <strong className="text-brand-charcoal">03 88 47 12 90</strong> ou passer nous rendre visite au 14 Rue de l'Église à Mutzig. L'accueil et le sourire chaleureux vous garantissent de trouver le créneau horaire de vos rêves.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-3 justify-center">
            <a 
              href="tel:0388471290" 
              className="px-8 py-3.5 bg-brand-charcoal hover:bg-brand-taupe text-white text-xs font-semibold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 duration-300 shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Appeler : 03 88 47 12 90</span>
            </a>
            <Link 
              to="/boutique" 
              className="px-8 py-3.5 bg-white border border-brand-charcoal text-brand-charcoal hover:bg-brand-pink-light text-xs font-semibold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 duration-300"
            >
              <Gift className="w-4 h-4" />
              <span>Acheter en Bon Cadeau</span>
            </Link>
          </div>
        </div>
      </section>

      {/* DISMISSABLE MODAL INSTANCE FOR BON CADEAU TRIGGERED FORM PRESTATIONS */}
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
export default CarePage;
