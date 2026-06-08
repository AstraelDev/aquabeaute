import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Gift, Percent, Sparkles, CheckCircle } from 'lucide-react';

interface PromoSlide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  bgColor: string;
  borderColor: string;
  accentBg: string;
  accentIcon: React.ReactNode;
  imageUrl: string;
}

export const PromoCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: PromoSlide[] = [
    {
      id: 1,
      badge: "Incontournable Saison",
      title: "Rituels de Douceur Cassiopée",
      subtitle: "Un réveil sensoriel de 90 minutes",
      description: "Profitez d'un soin complet de saison combinant un modelage holistique relaxant et un soin visage haut de gamme Bernard Cassière. Rayonnez et libérez les tensions accumulées.",
      ctaText: "Découvrir la Boutique",
      ctaLink: "/boutique",
      bgColor: "bg-white",
      borderColor: "border-brand-pink-blush/60",
      accentBg: "bg-brand-pink-light text-brand-pink",
      accentIcon: <Sparkles className="w-5 h-5" />,
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      badge: "Technologie Révolutionnaire",
      title: "Épilation Définitive Ariane",
      subtitle: "Bilan Beauté & Diagnostic offerts à Mutzig",
      description: "Dites définitivement adieu au rasoir et à la cire grâce à la haute technologie française à lumière pulsée Ariane. Confort parfait, sécurité maximale et douceur garantie.",
      ctaText: "Découvrir la technologie",
      ctaLink: "/soins",
      bgColor: "bg-white",
      borderColor: "border-brand-pink-blush/60",
      accentBg: "bg-brand-pink-light text-brand-pink",
      accentIcon: <CheckCircle className="w-5 h-5" />,
      imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      badge: "Idée Cadeau Parfaite",
      title: "Bons Cadeaux Personnalisables",
      subtitle: "Offrez la sérénité absolue en un clic",
      description: "Choisissez une prestation d'exception ou un montant libre, rédigez votre message d'affection et téléchargez instantanément votre bon cadeau au format PDF haute résolution.",
      ctaText: "Offrir un Bon Cadeau",
      ctaLink: "/boutique",
      bgColor: "bg-white",
      borderColor: "border-brand-pink-blush/60",
      accentBg: "bg-brand-pink-light text-brand-pink",
      accentIcon: <Gift className="w-5 h-5" />,
      imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // Elegantly transitions slide every 8 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div id="promo-carousel-container" className="bg-brand-cream border-b border-brand-pink-blush/40 py-8 lg:py-10 select-none overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Dynamic header row detailing the spot and offers */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-brand-pink block">
              ✦ Activités Commerciales de l'Institut ✦
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-brand-charcoal font-medium">
              Les Privilèges & Nouveautés d'Aquabeauté
            </h3>
          </div>
          
          {/* Elegant editorial style navigation arrows */}
          <div className="flex gap-2">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-brand-pink-blush hover:bg-brand-pink-light flex items-center justify-center text-brand-charcoal transition-colors focus:outline-none"
              aria-label="Annonce précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-brand-pink-blush hover:bg-brand-pink-light flex items-center justify-center text-brand-charcoal transition-colors focus:outline-none"
              aria-label="Annonce suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic transition canvas */}
        <div className="relative min-h-[290px] md:min-h-[200px] lg:min-h-[240px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`w-full ${slides[currentSlide].bgColor} rounded-3xl p-6 md:p-8 border ${slides[currentSlide].borderColor} shadow-xs flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-between overflow-hidden relative`}
            >
              
              {/* Overlay graphic background elements for that luxury editorial look */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-brand-pink-light/35 to-transparent pointer-events-none" />

              <div className="flex-1 space-y-4 text-left">
                {/* Badge component with branding style */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-pink-light border border-brand-pink-blush text-[10px] uppercase tracking-wider font-bold rounded-full text-brand-pink">
                  {slides[currentSlide].accentIcon}
                  <span>{slides[currentSlide].badge}</span>
                </span>
                
                <div className="space-y-1">
                  <h4 className="font-serif text-2xl lg:text-3xl font-medium text-brand-charcoal tracking-tight">
                    {slides[currentSlide].title}
                  </h4>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-pink italic">
                    {slides[currentSlide].subtitle}
                  </p>
                </div>
                
                <p className="text-xs sm:text-sm text-brand-taupe leading-relaxed max-w-2xl font-light">
                  {slides[currentSlide].description}
                </p>
                
                <div className="pt-2">
                  <Link
                    to={slides[currentSlide].ctaLink}
                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-charcoal hover:text-brand-pink border-b border-brand-charcoal hover:border-brand-pink pb-1 transition-all duration-300"
                  >
                    <span>{slides[currentSlide].ctaText}</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Accompanying premium visual showcase (editorial layout pattern) */}
              <div className="relative w-full md:w-48 lg:w-64 h-36 md:h-36 lg:h-44 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-brand-pink-blush/40">
                <img 
                  src={slides[currentSlide].imageUrl} 
                  alt={slides[currentSlide].title} 
                  className="w-full h-full object-cover select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                idx === currentSlide ? 'w-6 bg-brand-pink' : 'w-2 bg-brand-pink-blush'
              }`}
              aria-label={`Aller à la diapositive ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
