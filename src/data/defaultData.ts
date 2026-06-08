import { Product, GiftCard, CareCategory } from '../types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-esthederm-hydra',
    name: 'Crème Hydratante Eau Cellulaire Esthederm',
    price: 38,
    description: 'Une crème ressourçante brevetée qui insuffle une hydratation fraîche incomparable et réénergise l\'éclat.',
    category: 'visage',
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop',
    inStock: true,
    isActive: true
  },
  {
    id: 'prod-bc-serum',
    name: 'Sérum booster Éclat Bernard Cassière',
    price: 52,
    description: 'Véritable injection de vitalité à l\'extrait de grenade pour réveiller les teints ternes et lisser instantanément.',
    category: 'visage',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
    inStock: true,
    isActive: true
  },
  {
    id: 'prod-huile-relax',
    name: 'Huile Nourrissante Corps Relaxante Eucalyptus & Amande',
    price: 29,
    description: 'Riche, enveloppante et au subtil arôme d\'eucalyptus, elle soulage les tensions et sublime le grain de peau.',
    category: 'corps',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop',
    inStock: true,
    isActive: true
  },
  {
    id: 'prod-kit-mains',
    name: 'Soin Protecteur Intégral Mains & Ongles',
    price: 24,
    description: 'Onction nourrissante enrichie en beurre de karité et soin des cuticules, protège des agressions climatiques.',
    category: 'accessoire',
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600&auto=format&fit=crop',
    inStock: true,
    isActive: true
  },
  {
    id: 'prod-esthederm-sun',
    name: 'Émulsion Solaire Multi-Jeunesse Esthederm',
    price: 48,
    description: 'Une formulation dermatologique anti-taches formulée pour un bronzage en toute sérénité sans abîmer les cellules.',
    category: 'visage',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop',
    inStock: true,
    isActive: true
  },
  {
    id: 'prod-bougie-spa',
    name: 'Bougie Parfumée Ambiance "Sérénité de Mutzig"',
    price: 34,
    description: 'Créez un cocon de bien-être olfactif luxueux chez vous avec de douces notes florales et boisées apaisantes.',
    category: 'accessoire',
    imageUrl: 'https://images.unsplash.com/photo-1603006905393-24838b55694a?q=80&w=600&auto=format&fit=crop',
    inStock: false, // Rupture pour tester le bouton d'achat "Rupture"
    isActive: true
  }
];

export const DEFAULT_GIFT_CARDS: GiftCard[] = [
  {
    id: 'gift-detente',
    name: 'Bon Rituel Détente',
    description: 'Moments suspendus de paix absolue. Valable pour toute prestation à hauteur de sa valeur. Idéal pour un lâcher-prise d\'une douceur exquise.',
    price: 50,
    validityMonths: 6,
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop',
    isActive: true
  },
  {
    id: 'gift-visage',
    name: 'Bon Soin Visage Signature',
    description: 'Offrez un moment d\'excellence combinant gommage, vapeur, extraction, modelage facial haute précision et masque, suivi d\'un traitement Esthederm adapté.',
    price: 75,
    validityMonths: 6,
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop',
    isActive: true
  },
  {
    id: 'gift-corps',
    name: 'Bon Évasion Massage Corps Complet',
    description: 'Le soin ultime de régénération corporelle. Massage relaxant complet d\'une heure inspiré du classique modelage californien.',
    price: 90,
    validityMonths: 6,
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=600&auto=format&fit=crop',
    isActive: true
  },
  {
    id: 'gift-minceur',
    name: 'Bon Cure Amincissement Cellutec G5',
    description: 'Un protocole remodelant de 3 séances Cellutec G5 d\'une efficacité remarquable, incluant un bilan minceur personnalisé réalisé par nos expertes.',
    price: 120,
    validityMonths: 12,
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop',
    isActive: true
  },
  {
    id: 'gift-liberte',
    name: 'Bon Éden Liberté (Montant au choix)',
    description: 'Laissez votre bénéficiaire choisir le parfait forfait de ses rêves à l\'institut Aquabeauté. (Montant personnalisable à partir de 30 €)',
    price: 30, // threshold
    validityMonths: 12,
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop',
    isActive: true
  }
];

export const CARE_CATEGORIES: CareCategory[] = [
  {
    id: 'visage',
    title: 'Soins Visage',
    slug: 'soin-visage',
    description: 'Chaque soin est une communion d\'expertise technique et de sensoriel pour sublimer, réconforter et redonner de l\'éclat à votre peau.',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop',
    items: [
      {
        id: 'vi-01',
        name: 'Soin Éclat Immédiat',
        duration: '30 min',
        price: 35,
        description: 'Idéal pour redonner un souffle de fraîcheur instantané aux teints surmenés.'
      },
      {
        id: 'vi-02',
        name: 'Soin Équilibrant Purifiant',
        duration: '50 min',
        price: 50,
        description: 'Nettoie en profondeur, désincruste délicatement, resserre les pores et matifie durablement.'
      },
      {
        id: 'vi-03',
        name: 'Soin Visage Hydratation Profonde',
        duration: '60 min',
        price: 60,
        description: 'Bain désaltérant hautement régénérant pour désactiver les sensations de tiraillement.'
      },
      {
        id: 'vi-04',
        name: 'Soin Signature Esthederm Jeunesse',
        duration: '75 min',
        price: 78,
        description: 'L\'excellence anti-âge exclusive : lissage suprême, fermeté accrue et modelage regalbant.',
        isSpecial: true
      }
    ]
  },
  {
    id: 'corps',
    title: 'Soins Corps & Dos',
    slug: 'soin-corps',
    description: 'Une invitation à déconnecter, relâcher les points de pression musculaires et dorloter les tissus cutanés.',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop',
    items: [
      {
        id: 'co-01',
        name: 'Gommage Corps Évasion Sauvage',
        duration: '30 min',
        price: 35,
        description: 'Élimine les cellules mortes avec douceur, suivi d\'un voile de soin soyeux satiné.'
      },
      {
        id: 'co-02',
        name: 'Soin Dos Purifiant & Relaxant',
        duration: '45 min',
        price: 48,
        description: 'Gommage marin détoxifiant, modelage apaisant ciblé et application d\'un masque onctueux purifiant.'
      },
      {
        id: 'co-03',
        name: 'Modelage Californien Relaxant',
        duration: '60 min',
        price: 65,
        description: 'Le summum de la relaxation holistique. Mouvements lents et enveloppants pour un lâcher-prise total.',
        isSpecial: true
      },
      {
        id: 'co-04',
        name: 'Soin aux Pierres Chaudes Relaxantes',
        duration: '75 min',
        price: 80,
        description: 'Utilisation magistrale de roches volcaniques chauffées pour dénouer en profondeur chaque fibre.'
      }
    ]
  },
  {
    id: 'epilation',
    title: 'Épilation & Lumière Pulsée',
    slug: 'epilation',
    description: 'Douceur incomparable sous deux formats : la cire classique douce pour le plus grand confort cutané ou la dépilation durable Ariane.',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop',
    items: [
      {
        id: 'ep-01',
        name: 'Sourcils ou Lèvres (Cire)',
        price: 9,
        description: 'Entretien minutieux de votre ligne naturelle faciale.'
      },
      {
        id: 'ep-02',
        name: 'Aisselles (Cire)',
        price: 12
      },
      {
        id: 'ep-03',
        name: 'Maillot Classique (Cire)',
        price: 14,
        description: 'Formule douce protectrice de l\'intimité sensible.'
      },
      {
        id: 'ep-04',
        name: 'Demi-Jambes ou Cuisses (Cire)',
        price: 19
      },
      {
        id: 'ep-05',
        name: 'Maillot Intégral (Cire)',
        price: 25,
        description: 'Un toucher de satin parfait.'
      },
      {
        id: 'ep-06',
        name: 'Forfait Douceur Satin (Demi-Jambes + Maillot + Aisselles)',
        price: 45,
        isSpecial: true
      },
      {
        id: 'ep-07',
        name: 'Dépilation Durable Ariane : Aisselles (Forfait 6 séances)',
        price: 190,
        description: 'La technologie révolutionnaire Ariane pour éradiquer les follicules de manière définitive et sécurisée.'
      },
      {
        id: 'ep-08',
        name: 'Dépilation Durable Ariane : Maillot Classique (Forfait 6 séances)',
        price: 220
      },
      {
        id: 'ep-09',
        name: 'Dépilation Durable Ariane : Demi-Jambes (Forfait 6 séances)',
        price: 390
      }
    ]
  },
  {
    id: 'minceur',
    title: 'Méthodes Amincissantes',
    slug: 'methodes-amincissantes',
    description: 'Redéfinissez, drainez et raffermissez vos contours corporels grâce à notre technologie mécanique experte de physiothérapie.',
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop',
    items: [
      {
        id: 'mi-01',
        name: 'Séance Unitaire Cellutec G5 (Vibrations Actives minceur)',
        duration: '35 min',
        price: 45,
        description: 'Des ondes vibratoires infrasonores pour drainer les toxines et désengorger visiblement la cellulite de l\'épiderme.'
      },
      {
        id: 'mi-02',
        name: 'Cure Signature Cellutec G5 (10 séances)',
        price: 390,
        description: 'L\'attaque minceur globale. Inclut d\'office un bilan corporel personnalisé complet et des conseils hygiéno-diététiques.',
        isSpecial: true
      }
    ]
  },
  {
    id: 'espace-beaute',
    title: 'Espace Beauté Regard',
    slug: 'espace-beaute',
    description: 'Sublimez vos atouts naturels, colorez vos traits et offrez-vous un regard charismatique d\'une profondeur théâtrale.',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
    items: [
      {
        id: 'eb-01',
        name: 'Teinture des Sourcils',
        price: 12,
        description: 'Pour intensifier sans effort le dessin naturel de l\'arcade sourcilière.'
      },
      {
        id: 'eb-02',
        name: 'Teinture des Cils',
        price: 15
      },
      {
        id: 'eb-03',
        name: 'Restructuration Architecturale Sourcils',
        duration: '30 min',
        price: 20,
        description: 'Dessin complet sur-mesure pour rééquilibrer la symétrie de votre visage.'
      },
      {
        id: 'eb-04',
        name: 'Rehaussement de Cils Volumateur',
        duration: '50 min',
        price: 49,
        description: 'Recourbe majestueusement les cils dès la racine sans mascara pour un effet œil de biche divin.',
        isSpecial: true
      }
    ]
  },
  {
    id: 'mains-pieds',
    title: 'Mains & Pieds d\'Exception',
    slug: 'mains-pieds',
    description: 'Une toilette minutieuse de vos extrémités, enrichie en finitions scintillantes pour une allure sophistiquée.',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop',
    items: [
      {
        id: 'mp-01',
        name: 'Manucure Classique Élixir Douceur',
        duration: '40 min',
        price: 25,
        description: 'Limage, polissage, soin nourrissant des cuticules et gommage revitalisant pour des mains de velours.'
      },
      {
        id: 'mp-02',
        name: 'Pose de Vernis Semi-Permanent Haute Brillance',
        price: 32,
        description: 'Couleur intense séchée sous LED, tenue impeccable garantie pendant 2 à 3 semaines sur ongles sains.'
      },
      {
        id: 'mp-03',
        name: 'Dépose Douceur + Repose de Semi-Permanent',
        price: 38
      },
      {
        id: 'mp-04',
        name: 'Beauté des Pieds Cocooning Suprême',
        duration: '50 min',
        price: 40,
        description: 'Bain de pieds relaxant, élimination des callosités, masque enveloppant ultra-nourrissant et massage décontractant.',
        isSpecial: true
      }
    ]
  }
];
