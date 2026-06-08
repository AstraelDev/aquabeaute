import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const { cartCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSoinsOpen, setIsSoinsOpen] = useState(false);

  // Active styles for navigation links
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs uppercase tracking-widest font-medium transition-all duration-300 relative py-1 hover:text-brand-gold ${
      isActive ? 'text-brand-gold font-semibold border-b border-brand-gold/60' : 'text-brand-charcoal'
    }`;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <>
      {/* Top micro announcement ribbon (elegant text) */}
      <div className="bg-brand-charcoal text-brand-nude text-[10px] tracking-widest uppercase py-2 px-4 text-center font-medium flex justify-center items-center gap-2 relative z-30">
        <span>✦ INSTITUT AQUABEAUTÉ MUTZIG — RESSOURCEZ VOTRE CORPS ET VOTRE ESPRIT ✦</span>
        <Link 
          to="/admin" 
          className="hidden sm:flex items-center gap-1 text-[10px] text-brand-gold hover:text-white transition-colors absolute right-4 uppercase font-semibold border-l border-brand-pink-dark/30 pl-3-accent"
        >
          <User className="w-3 h-3" />
          <span>Accès Admin (aqua2025)</span>
        </Link>
      </div>

      {/* Primary Sticky Header */}
      <header className="sticky top-0 z-40 bg-brand-nude/90 backdrop-blur-md border-b border-brand-pink-blush/60 luxury-shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
          
          {/* Left: Mobile hamburger */}
          <button 
            onClick={toggleMobileMenu}
            className="sm:hidden p-2 text-brand-charcoal hover:text-brand-gold transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Left/Center: Desktop Navigation (Part 1 - Prestations) */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={getLinkClass}>Accueil</NavLink>
            
            {/* Soins drop-down simulation */}
            <div className="relative group">
              <button 
                onClick={() => setIsSoinsOpen(!isSoinsOpen)}
                onMouseEnter={() => setIsSoinsOpen(true)}
                className="text-xs uppercase tracking-widest font-medium text-brand-charcoal hover:text-brand-gold transition-all py-1 flex items-center gap-1 cursor-pointer"
              >
                <span>Les Soins</span>
                <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              
              {/* Dropdown Box */}
              <div 
                className="absolute top-full left-0 mt-2 w-52 bg-brand-nude border border-brand-pink-blush rounded-xl shadow-lg p-2 flex flex-col gap-1 transition-all duration-300 opacity-0 group-hover:opacity-100 invisible group-hover:visible"
                onMouseLeave={() => setIsSoinsOpen(false)}
              >
                <Link to="/soin-visage" className="px-3 py-2 text-xs text-brand-charcoal hover:bg-brand-pink-light tracking-wide rounded-lg transition-colors">Soins Visage</Link>
                <Link to="/soin-corps" className="px-3 py-2 text-xs text-brand-charcoal hover:bg-brand-pink-light tracking-wide rounded-lg transition-colors">Soins Corps / Dos</Link>
                <Link to="/epilation" className="px-3 py-2 text-xs text-brand-charcoal hover:bg-brand-pink-light tracking-wide rounded-lg transition-colors">Épilation Cire & Ariane</Link>
                <Link to="/methodes-amincissantes" className="px-3 py-2 text-xs text-brand-charcoal hover:bg-brand-pink-light tracking-wide rounded-lg transition-colors">Amincissement (Cellutec)</Link>
                <Link to="/espace-beaute" className="px-3 py-2 text-xs text-brand-charcoal hover:bg-brand-pink-light tracking-wide rounded-lg transition-colors">Espace Beauté Regard</Link>
                <Link to="/mains-pieds" className="px-3 py-2 text-xs text-brand-charcoal hover:bg-brand-pink-light tracking-wide rounded-lg transition-colors">Soin Mains & Pieds</Link>
              </div>
            </div>

            <NavLink to="/boutique" className={getLinkClass}>Boutique & Cadeaux</NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={getLinkClass}>Administration</NavLink>
            )}
          </nav>

          {/* Center Brand Identity (Logo Branding) */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center md:static md:translate-x-0 md:text-center shrink-0">
            <Link to="/" className="group inline-block hover:opacity-95 transition-all duration-300">
              <Logo size="sm" showSubtitle={true} />
            </Link>
          </div>

          {/* Right Section: Member Profile (Simulated) + Shopping Cart Bag */}
          <div className="flex items-center gap-1 sm:gap-3.5">
            
            {/* Account Link or State */}
            {user ? (
              <div className="flex items-center gap-1 text-xs text-brand-charcoal">
                <Link 
                  to="/mon-compte" 
                  className="hidden sm:flex items-center gap-1 text-xs tracking-wider font-medium text-brand-charcoal hover:text-brand-gold transition-colors"
                >
                  <User className="w-4 h-4 text-brand-taupe" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Link>
                <button 
                  onClick={() => { logout(); navigate('/'); }} 
                  className="p-2 text-brand-taupe hover:text-brand-charcoal rounded-full"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                to="/mon-compte" 
                className="p-2 text-brand-charcoal hover:text-brand-gold rounded-full transition-colors flex items-center gap-1"
                title="Mon Compte"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-semibold tracking-wider uppercase">Connexion</span>
              </Link>
            )}

            {/* Cart Button */}
            <button 
              onClick={toggleCart}
              className="p-2 bg-brand-cream border border-brand-pink rounded-full text-brand-charcoal hover:bg-brand-charcoal hover:text-brand-nude transition-all duration-300 relative"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-charcoal border border-brand-nude text-brand-nude rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-brand-cream border-t border-brand-pink-blush py-4 px-6 flex flex-col gap-4 animate-fade-in">
            <NavLink 
              to="/" 
              onClick={toggleMobileMenu}
              className="text-sm font-semibold uppercase tracking-wider text-brand-charcoal"
            >
              Accueil
            </NavLink>
            <div className="border-t border-brand-pink-blush/60 pt-2 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-brand-taupe tracking-wider uppercase">Nos Soins</span>
              <Link to="/soin-visage" onClick={toggleMobileMenu} className="text-sm text-brand-charcoal pl-3">Soins Visage</Link>
              <Link to="/soin-corps" onClick={toggleMobileMenu} className="text-sm text-brand-charcoal pl-3">Soins Corps & Dos</Link>
              <Link to="/epilation" onClick={toggleMobileMenu} className="text-sm text-brand-charcoal pl-3">Épilations Cire & Lumière pulsée</Link>
              <Link to="/methodes-amincissantes" onClick={toggleMobileMenu} className="text-sm text-brand-charcoal pl-3">Amincissement Cellutec</Link>
              <Link to="/espace-beaute" onClick={toggleMobileMenu} className="text-sm text-brand-charcoal pl-3">Espace Beauté Regard</Link>
              <Link to="/mains-pieds" onClick={toggleMobileMenu} className="text-sm text-brand-charcoal pl-3">Mains & Pieds</Link>
            </div>
            <NavLink 
              to="/boutique" 
              onClick={toggleMobileMenu}
              className="text-sm font-semibold uppercase tracking-wider text-brand-charcoal border-t border-brand-pink-blush/60 pt-3"
            >
              Boutique & Bons Cadeaux
            </NavLink>
            {isAdmin && (
              <NavLink 
                to="/admin" 
                onClick={toggleMobileMenu}
                className="text-sm font-semibold uppercase tracking-wider text-brand-gold border-t border-brand-pink-blush/60 pt-3"
              >
                Espace Admin 🔐
              </NavLink>
            )}
            <Link 
              to="/admin" 
              onClick={toggleMobileMenu}
              className="text-xs font-semibold uppercase tracking-wider text-brand-gold border-t border-brand-pink-blush/60 pt-3 flex items-center gap-1"
            >
              🔐 Connexion Admin
            </Link>
          </div>
        )}
      </header>

      {/* Slide-over cart panel */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
export default Header;
