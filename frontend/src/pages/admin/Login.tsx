import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDineFlow } from '../../context/DineFlowContext';
import { ShieldCheck, Lock, Mail, KeyRound, UtensilsCrossed, ArrowRight, Info } from 'lucide-react';

export default function Login() {
  const { loginAdmin } = useDineFlow();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@dineflow.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAdmin(email, password);
      setIsLoading(false);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message);
      }
    }, 600);
  };

  const handleQuickFill = () => {
    setEmail('admin@dineflow.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6 relative z-10">
        
        {/* Brand Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 mx-auto shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-orange-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white">DineFlow Staff Portal</h1>
          <p className="text-xs text-slate-400">Authorized Kitchen & Restaurant Management</p>
        </div>

        {/* Demo Credentials Quick Fill Banner */}
        <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
          <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <p className="font-semibold text-orange-400">Demo Staff Credentials:</p>
            <p className="font-mono text-[11px] text-slate-400 mt-0.5">Email: admin@dineflow.com | Pass: admin123</p>
            <button
              type="button"
              onClick={handleQuickFill}
              className="mt-1.5 text-[11px] font-bold text-orange-400 hover:underline block"
            >
              Auto-fill Demo Credentials
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50"
                placeholder="admin@dineflow.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Security Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                Login to Management
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
