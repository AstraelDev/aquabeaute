import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, KeyRound, Mail, ArrowLeft, RotateCcw } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAsAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@aquabeaute.fr');
  const [password, setPassword] = useState('aqua2025');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    const ok = await loginAsAdmin(email, password);

    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } else {
      setError('Identifiants incorrects. Modifiez le mot de passe pour tester.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream py-16 flex flex-col items-center justify-center p-4">
      
      {/* Back to Client Site */}
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-1 text-xs text-brand-taupe hover:text-brand-charcoal uppercase tracking-wider font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour au site principal</span>
      </button>

      {/* Main Container */}
      <div className="w-full max-w-md bg-white rounded-2xl border-2 border-brand-pink-blush shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Shield icon */}
        <div className="flex justify-center mb-4">
          <span className="p-3 bg-brand-pink-light text-brand-charcoal border border-brand-pink rounded-full">
            <ShieldAlert className="w-6 h-6 text-brand-taupe" />
          </span>
        </div>

        {/* Text */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="font-serif text-2xl font-bold tracking-wider text-brand-charcoal">
            Administration Aquabeauté
          </h2>
          <p className="text-xs text-brand-taupe leading-relaxed">
            Espace de gestion restreint aux gérantes et esthéticiennes autorisées de l'institut de Mutzig.
          </p>
        </div>

        {/* Real test advice block */}
        <div className="p-4 bg-brand-pink-light border border-brand-pink rounded-xl text-left text-xs text-brand-taupe space-y-1 mb-5 leading-normal">
          <p className="font-bold text-brand-charcoal">🔑 Codes d'accès d'évaluation :</p>
          <p>• Identifiant : <strong className="text-brand-charcoal font-semibold">admin@aquabeaute.fr</strong></p>
          <p>• Mot de passe : <strong className="text-brand-charcoal font-semibold">aqua2025</strong></p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-brand-charcoal">Adresse Email Admin *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-pink rounded-lg text-sm focus:ring-1 focus:ring-brand-gold focus:outline-none"
                placeholder="admin@aquabeaute.fr"
              />
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-brand-taupe" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-brand-charcoal">Mot de Passe *</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-pink rounded-lg text-sm focus:ring-1 focus:ring-brand-gold focus:outline-none"
                placeholder="••••••••"
              />
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-brand-taupe" />
            </div>
          </div>

          {error && (
            <div className="p-2.5 text-xs text-red-700 bg-red-50 rounded-lg border border-red-100 font-medium">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="p-2.5 text-xs text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-100 font-medium">
              🎉 Authentification réussie ! Chargement du tableau de bord...
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-brand-charcoal hover:bg-brand-taupe text-white transition-colors duration-200 text-xs font-bold uppercase tracking-wider rounded-lg mt-1 cursor-pointer"
          >
            Se Connecter en tant qu'Adm.
          </button>

        </form>

        <p className="text-[10px] text-brand-taupe mt-6 text-center">
          Système mock sécurisé localisé en localStorage. À remplacer par une vraie API JWT pour mise en production finale.
        </p>

      </div>
    </div>
  );
};
export default AdminLogin;
