import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-brand-pink-blush/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <Logo size="sm" showSubtitle={true} className="!items-start" />
            </Link>
            <p className="text-xs text-brand-taupe leading-relaxed max-w-sm">
              Votre institut de beauté de référence à Mutzig, en Alsace. Un havre de paix confidentiel mariant technologies de pointe et rituels relaxants haut de gamme.
            </p>
            <div className="space-y-2.5 text-xs text-brand-charcoal pt-2">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>14 Rue de l'Église, 67190 Mutzig, Alsace, France</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <a href="tel:0388471290" className="hover:text-brand-gold transition-colors font-medium">03 88 47 12 90</a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <a href="mailto:contact@aquabeaute-esthetique.fr" className="hover:text-brand-gold transition-colors">contact@aquabeaute-esthetique.fr</a>
              </p>
            </div>
          </div>

          {/* Col 2: Operating Hours */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif text-lg font-semibold tracking-wider text-brand-charcoal flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-gold" />
              <span>Horaires d'Ouverture</span>
            </h4>
            <div className="text-xs text-brand-charcoal space-y-2">
              <p className="flex justify-between border-b border-brand-pink-blush/40 pb-1">
                <span className="font-medium text-brand-taupe">Lundi</span>
                <span className="italic">Fermé (ou sur rendez-vous exceptionnel)</span>
              </p>
              <p className="flex justify-between border-b border-brand-pink-blush/40 pb-1">
                <span className="font-medium">Mardi</span>
                <span>09:00 – 18:30</span>
              </p>
              <p className="flex justify-between border-b border-brand-pink-blush/40 pb-1">
                <span className="font-medium">Mercredi</span>
                <span>09:00 – 18:30</span>
              </p>
              <p className="flex justify-between border-b border-brand-pink-blush/40 pb-1">
                <span className="font-medium">Jeudi</span>
                <span className="font-semibold text-brand-taupe">09:00 – 19:00 (Nocturne)</span>
              </p>
              <p className="flex justify-between border-b border-brand-pink-blush/40 pb-1">
                <span className="font-medium">Vendredi</span>
                <span className="font-semibold text-brand-taupe">09:00 – 19:00</span>
              </p>
              <p className="flex justify-between border-b border-brand-pink-blush/40 pb-1">
                <span className="font-medium">Samedi</span>
                <span>09:00 – 16:00</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-brand-taupe">Dimanche</span>
                <span className="text-red-600 font-medium">Fermé</span>
              </p>
            </div>
          </div>

          {/* Col 3: Navigation Menu Links */}
          <div className="lg:col-span-2 space-y-4 col-span-1">
            <h4 className="font-serif text-lg font-semibold tracking-wider text-brand-charcoal">
              Prestations
            </h4>
            <ul className="text-xs space-y-2 text-brand-taupe">
              <li><Link to="/soin-visage" className="hover:text-brand-charcoal transition-all">Soins Visage</Link></li>
              <li><Link to="/soin-corps" className="hover:text-brand-charcoal transition-all">Soins Corps / Dos</Link></li>
              <li><Link to="/epilation" className="hover:text-brand-charcoal transition-all">Épilation cire & LP</Link></li>
              <li><Link to="/methodes-amincissantes" className="hover:text-brand-charcoal transition-all">Méthodes minceur</Link></li>
              <li><Link to="/espace-beaute" className="hover:text-brand-charcoal transition-all">Beauté du Regard</Link></li>
              <li><Link to="/mains-pieds" className="hover:text-brand-charcoal transition-all">Mains & Pieds</Link></li>
            </ul>
          </div>

          {/* Col 4: Shop & Brand Partners */}
          <div className="lg:col-span-2 space-y-4 col-span-1">
            <h4 className="font-serif text-lg font-semibold tracking-wider text-brand-charcoal">
              La Maison
            </h4>
            <ul className="text-xs space-y-2 text-brand-taupe">
              <li><Link to="/boutique" className="hover:text-brand-charcoal transition-all font-medium text-brand-charcoal">Boutique & Cocon</Link></li>
              <li><Link to="/boutique#giftcards" className="hover:text-brand-charcoal transition-all">Bons Cadeaux</Link></li>
              <li><Link to="/mon-compte" className="hover:text-brand-charcoal transition-all">Mon Espace Client</Link></li>
              <li><Link to="/admin" className="hover:text-brand-gold transition-all text-xs flex items-center gap-1">🔐 Dashboard Admin</Link></li>
            </ul>

            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-taupe block mb-1">Suivez-nous</span>
              <a 
                href="https://www.facebook.com/people/Aquabeaut%C3%A9/100063544573177/" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex p-2 bg-brand-pink-light border border-brand-pink hover:bg-brand-charcoal hover:text-white rounded-full transition-all text-brand-charcoal"
                title="Suivez Aquabeauté sur Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Divider and Copy */}
        <div className="border-t border-brand-pink-blush mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-taupe">
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <span>© {new Date().getFullYear()} Aquabeauté Mutzig. Tous droits réservés.</span>
            <span className="text-brand-pink-dark">|</span>
            <span>Marques Partenaires : <strong className="text-brand-charcoal font-semibold">Esthederm • Bernard Cassière</strong></span>
          </div>
          <div className="flex items-center gap-1 bg-brand-pink-light border border-brand-pink/60 px-2.5 py-1 rounded-full text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-eucalyptus" />
            <span>Paiement à la remise • Réservations locales</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
