import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gift, MapPin, Phone, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { CARE_CATEGORIES } from '../data/defaultData';
import { PromoCarousel } from '../components/PromoCarousel';

export const Home: React.FC = () => {
  const reviews = [
    {
      name: "Isabelle Weber",
      stars: 5,
      date: "Il y a 2 semaines",
      comment: "Un moment suspendu dans le temps ! Christelle est d'une douceur et d'un professionnalisme remarquables. Le soin du visage Signature Esthederm est tout simplement divin."
    },
    {
      name: "Jean-Pierre Schmitt",
      stars: 5,
      date: "Il y a 1 mois",
      comment: "J'ai offert un bon cadeau massage corps à mon épouse, elle est rentrée enchantée. Le système de bon d'achat PDF en ligne est très pratique et très joliment conçu !"
    },
    {
      name: "Mélanie Keller",
      stars: 5,
      date: "Il y a 6 jours",
      comment: "Adepte de l'épilation à la lumière pulsée Ariane, j'ai vu des résultats probants très rapidement et sans douleur. L'institut est d'une propreté irréprochable et sent divinement bon."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Dynamic Commercial/Promo Activities Carousel */}
      <PromoCarousel />
      
      {/* SECTION 1: ELEGANT HERO BANNER (Luxury Wellness Editorial) */}
      <section className="relative bg-brand-nude py-16 lg:py-24 overflow-hidden border-b border-brand-pink-blush/60">
        
        {/* Soft graphical elements */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-brand-pink/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-10 left-5 w-80 h-80 bg-brand-cream rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Title & Slogans Core Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="text-brand-pink font-serif italic text-lg sm:text-xl lg:text-2xl block mb-1">
                L'éveil des sens
              </span>
              
              <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] font-normal text-brand-charcoal tracking-tight">
                Une parenthèse <br/>
                <span className="lg:ml-16 italic text-brand-pink">intemporelle.</span>
              </h2>
              
              <p className="text-sm sm:text-base text-brand-taupe leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                L'institut <strong className="text-brand-charcoal font-medium">Aquabeauté</strong> vous propose une évasion relaxante unique au cœur de Mutzig. Offrez-vous une parenthèse de sérénité sur-mesure combinant rituels ancestraux et soins d'excellence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-3">
                <Link
                  to="/boutique"
                  className="px-8 py-4 bg-brand-charcoal text-white hover:bg-black transition-all duration-300 text-xs font-semibold uppercase tracking-widest rounded-full inline-flex items-center justify-center gap-2 shadow-md"
                >
                  <Gift className="w-4 h-4" />
                  <span>Offrir un Bon Cadeau</span>
                </Link>
                <Link
                  to="/boutique"
                  className="px-8 py-4 bg-white text-brand-charcoal hover:bg-brand-cream hover:text-brand-charcoal border border-brand-pink-blush transition-all duration-300 text-xs font-semibold uppercase tracking-widest rounded-full inline-flex items-center justify-center gap-2"
                >
                  <span>Boutique Cosmétiques</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Confidence notes */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 pt-6 text-[11px] text-brand-taupe">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-brand-eucalyptus" />
                  Partenaire Officiel Esthederm
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-brand-eucalyptus" />
                  Technologie Minceur Cellutec
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-brand-eucalyptus" />
                  Lumière Pulsée Ariane
                </span>
              </div>
            </div>

            {/* Overlapping Image collage with custom asymmetric editorial shapes */}
            <div className="lg:col-span-5 relative h-[450px] w-full hidden md:block select-none">
              {/* Main large asymmetric picture */}
              <div className="absolute top-0 right-0 w-[85%] h-[400px] bg-brand-pink-blush rounded-[100px_4px_100px_4px] overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop" 
                  alt="Spa massage relaxant Aquabeauté" 
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Asymmetric offset overlapping decorative/quote card strictly matching design layout */}
              <div className="absolute bottom-0 left-0 w-[240px] h-[220px] bg-white p-2 rounded-2xl shadow-2xl border border-brand-pink-blush">
                 <div className="w-full h-full bg-brand-cream rounded-xl flex flex-col items-center justify-center text-center p-4">
                    <div className="flex items-center gap-1 text-brand-gold mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="font-serif italic text-xs text-brand-charcoal">
                      "Une expérience d'écoute attentive et de relaxation profonde extraordinaire."
                    </p>
                    <span className="block text-[8px] font-bold text-brand-taupe mt-2 uppercase">— Sophie R.</span>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: MEET CHRISTELLE (Présentation) */}
      <section className="bg-brand-nude py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Image Column */}
            <div className="flex justify-center relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-brand-pink w-full max-w-sm aspect-square bg-brand-cream">
                <img 
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop" 
                  alt="Christelle chez Aquabeauté" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-3 -right-3 rounded-full bg-brand-pink/50 backdrop-blur-md p-6 border border-brand-pink-blush h-24 w-24 flex flex-col justify-center items-center">
                <span className="text-xl font-serif font-bold text-brand-charcoal mt-1">15+</span>
                <span className="text-[8px] uppercase tracking-wider text-brand-taupe text-center line-clamp-2">Ans d'Éclat</span>
              </div>
            </div>

            {/* Content Column */}
            <div className="space-y-5 text-left">
              <span className="text-xs uppercase tracking-[0.2em] text-brand-gold font-semibold">
                L'âme de l'Institut
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-normal text-brand-charcoal">
                Rencontrez Christelle
              </h3>
              <div className="h-[2px] w-12 bg-brand-gold"></div>
              
              <p className="text-sm text-brand-taupe leading-relaxed">
                Esthéticienne diplômée d'État passionnée par la cosmétologie dermatologique, <strong className="text-brand-charcoal">Christelle</strong> a fondé l'institut Aquabeauté pour offrir à chaque habitante de Mutzig et d'Alsace un lieu de ressourcement d'une profonde intimité.
              </p>
              <p className="text-sm text-brand-taupe leading-relaxed">
                Son secret réside dans l'alliance du diagnostic moléculaire de pointe via les soins brevetés <strong>Esthederm</strong>, combiné à des techniques manuelles de modelage facialis hautement relaxantes. Précise, souriante et chaleureuse, elle écoute votre corps pour lui offrir des cures sculptantes ou relaxantes adaptées.
              </p>
              
              <div className="pt-2">
                <span className="text-xs font-serif italic text-brand-charcoal block">"Ici, le soin n'est pas qu'un protocole esthétique, c'est une reconnexion intime avec votre beauté naturelle."</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold mt-1.5 block">— Christelle, Fondatrice d'Aquabeauté</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: THE 6 CARE CATEGORIES GRID */}
      <section className="bg-brand-cream py-16 lg:py-24 border-y border-brand-pink-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-brand-gold font-semibold">Nos Rituels de Soins</span>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-brand-charcoal">Explorez Nos Univers</h3>
            <p className="text-xs text-brand-taupe max-w-sm mx-auto leading-relaxed">
              Consultez nos cartes de tarifs et de prestations, spécialement triées pour s'adapter à vos désirs de beauté.
            </p>
            <div className="w-16 h-[1.5px] bg-brand-gold mx-auto mt-2"></div>
          </div>

          {/* Grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CARE_CATEGORIES.map((category) => (
              <Link 
                key={category.id}
                to={`/${category.slug}`}
                className="group relative h-96 rounded-2xl overflow-hidden border border-brand-pink-blush/60 shadow-xs hover:shadow-md transition-all duration-500 bg-white flex flex-col justify-end p-6"
              >
                {/* Image panel back */}
                <div className="absolute inset-0 bg-brand-charcoal/20 group-hover:bg-brand-charcoal/10 transition-colors duration-500 z-10"></div>
                <img 
                  src={category.imageUrl} 
                  alt={category.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                  referrerPolicy="no-referrer"
                />

                {/* Text Content */}
                <div className="relative z-20 bg-brand-nude/95 backdrop-blur-xs p-5 rounded-xl border border-brand-pink-blush text-left transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="font-serif text-lg font-bold text-brand-charcoal flex justify-between items-center group-hover:text-brand-gold transition-colors">
                    <span>{category.title}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300" />
                  </h4>
                  <p className="text-xs text-brand-taupe line-clamp-2 mt-1.5 leading-relaxed">
                    {category.description}
                  </p>
                  <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-brand-charcoal mt-3.5 border-b border-brand-pink pb-0.5">
                    Voir les tarifs et soins →
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 4: GIFT CARDS HIGHLIGHT ACTION */}
      <section className="bg-brand-nude py-16 lg:py-24 relative overflow-hidden">
        
        {/* Soft layout frames */}
        <div className="absolute -bottom-10 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center bg-brand-cream border border-brand-pink p-8 sm:p-12 lg:p-16 rounded-3xl luxury-shadow class">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="p-3 bg-brand-pink rounded-full text-brand-charcoal inline-block">
              <Gift className="w-6 h-6 text-brand-taupe" />
            </span>
            
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-brand-charcoal">
              Besoin de faire plaisir ? Offrez un <span className="italic">Bon Cadeau Aquabeauté</span>
            </h3>

            <p className="text-sm text-brand-taupe leading-relaxed">
              Sélectionnez une prestation d'exception ou offrez un bon liberté du montant de votre choix. 
              <strong> Personnalisez, téléchargez instantanément votre PDF d'invitation au format A5</strong>, et glissez-le sous l'enveloppe. 
              Idéal pour un anniversaire, la fête des mères ou simplement faire plaisir.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
              <Link
                to="/boutique"
                className="px-8 py-3.5 bg-brand-charcoal text-white hover:bg-brand-taupe transition-colors duration-300 text-xs font-semibold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Créer mon Bon Cadeau</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:0388471290"
                className="px-8 py-3.5 bg-transparent border border-brand-charcoal text-brand-charcoal hover:bg-white hover:text-brand-charcoal transition-colors duration-300 text-xs font-semibold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Nous contacter</span>
              </a>
            </div>

            <div className="text-[11px] text-brand-taupe">
              ⚠️ Les bons d'invitation sont valables pendant 6 à 12 mois pour l'ensemble des prestations de l'institut. Retrait physique possible à Mutzig.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: GOOGLE REVIEWS SECTION */}
      <section className="bg-brand-cream py-16 lg:py-24 border-t border-brand-pink-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-brand-gold font-semibold">Témoignages Clients</span>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-brand-charcoal">Ce qu'ils disent d'Aquabeauté</h3>
            <p className="text-xs text-brand-taupe">Note moyenne Google : <strong>4.9/5 ★</strong> sur l'institut de Mutzig</p>
            <div className="w-12 h-[1px] bg-brand-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-brand-pink-blush luxury-shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-brand-charcoal italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="flex justify-between items-center border-t border-brand-pink-blush/40 mt-4 pt-3.5 text-[11px]">
                  <span className="font-bold text-brand-charcoal">{rev.name}</span>
                  <span className="text-brand-taupe">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: ADRESSE, HORAIRES, PARTNERS */}
      <section className="bg-brand-nude py-16 lg:py-20 border-t border-brand-pink-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hour details & Directions */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-brand-charcoal flex items-center gap-2">
                <MapPin className="w-6 h-6 text-brand-gold" />
                <span>Nous situer à Mutzig</span>
              </h3>
              
              <p className="text-xs sm:text-sm text-brand-taupe leading-relaxed">
                L'institut de beauté est implanté au <strong>14 Rue de l'Église, 67190 Mutzig</strong>, à quelques enjambées de la rue piétonne principale de la ville et à proximité immédiate de Molsheim et Dorlisheim. Stationnements faciles.
              </p>

              <div className="p-5 bg-brand-cream border border-brand-pink rounded-xl space-y-4">
                <span className="text-xs uppercase font-bold tracking-wider text-brand-charcoal block mb-0.5">Rendez-vous et réservations locales :</span>
                
                <p className="text-xs text-brand-taupe leading-relaxed">
                  Afin de garantir une intimité et une relaxation totale à chaque cliente, Christelle propose des soins uniquement sur rendez-vous. Merci de privilégier un appel ou de passer en boutique aux heures d'ouverture.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <a 
                    href="tel:0388471290" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-charcoal hover:bg-brand-taupe text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-white" />
                    <span>03 88 47 12 90</span>
                  </a>
                  <span className="text-[11px] text-brand-taupe italic">Appel local non surtaxé</span>
                </div>
              </div>

              {/* Brands partners logos text */}
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">Institut de Beauté Partenaire Premium</span>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="px-4 py-2 bg-white rounded-lg border border-brand-pink-blush text-center shadow-xs">
                    <span className="font-serif text-sm font-bold tracking-widest text-brand-charcoal">ESTHEDERM</span>
                    <span className="block text-[7px] text-brand-taupe uppercase">PARIS</span>
                  </div>
                  <div className="px-4 py-2 bg-white rounded-lg border border-brand-pink-blush text-center shadow-xs">
                    <span className="font-serif text-sm font-bold tracking-widest text-brand-charcoal">BERNARD CASSIÈRE</span>
                    <span className="block text-[7px] text-brand-taupe uppercase">COSMÉTIQUES</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Simulated Vectorized styled local Map placeholder card */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-brand-cream relative flex justify-center items-center p-6 text-center select-none">
              <div className="absolute inset-0 bg-brand-taupe/5 opacity-60"></div>
              {/* Elegant mockup of local streets inside Mutzig */}
              <div className="relative font-serif text-brand-charcoal z-10 flex flex-col items-center gap-3">
                <MapPin className="w-10 h-10 text-brand-gold animate-bounce" />
                <div>
                  <h4 className="font-bold text-lg tracking-wide">Institut Aquabeauté</h4>
                  <p className="text-xs text-brand-taupe mt-0.5 font-sans">14 Rue de l'Église, 67190 Mutzig, Alsace</p>
                </div>
                <div className="mt-2 py-1 px-3.5 bg-brand-pink border border-brand-pink-dark rounded-full text-[9px] font-sans font-bold uppercase tracking-wider text-brand-charcoal">
                  Molsheim : 6 min • Obernai : 15 min • Strasbourg : 25 min
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
export default Home;
