import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      const role = localStorage.getItem('cda_auth_role');
      if (role === 'employee') {
        navigate('/admin/pos');
      } else {
        navigate('/admin');
      }
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background font-sans overflow-hidden">
      {/* Left Column: Image/Brand area */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-end p-16">
        {/* Background Image with overlay gradient */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544025162-d76f60b52cb8?q=80&w=2669&auto=format&fit=crop')` }}
        >
          {/* A gradient from bottom to top to make the text readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent mix-blend-multiply opacity-90"></div>
          {/* Added a subtle radial gradient specifically in the bottom left where text is */}
          <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-transparent to-transparent opacity-80"></div>
        </div>

        {/* Content on top of image */}
        <div className="relative z-10 max-w-lg mb-8">
          <div className="w-12 h-[1px] bg-brand-light opacity-50 mb-6"></div>
          <h1 className="text-white text-5xl md:text-6xl font-serif tracking-tight leading-tight mb-2">
            The Art of<br/>
            <span className="text-brand italic font-medium pr-2">Fire & Time</span>
          </h1>
          <p className="text-text-secondary mt-6 text-lg tracking-wide font-light max-w-sm">
            A curated gallery where the visceral quality of the flame meets the precision of the blade.
          </p>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-16 lg:px-24 xl:px-32 bg-background relative relative z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
        
        <div className="w-full max-w-md">
          {/* Logo / Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <Flame className="text-brand" size={24} strokeWidth={2.5} />
              <h2 className="text-brand-light tracking-[0.2em] font-serif uppercase text-xl font-bold">
                CASA DE CARNES
              </h2>
            </div>
            <p className="text-text-muted text-xs uppercase tracking-[0.15em] font-medium">
              Management Portal Access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 relative group">
              <label className="text-xs uppercase tracking-[0.1em] text-text-secondary font-semibold block mb-2">
                Usuário ou Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-brand transition-colors">
                  <span className="text-lg pb-0.5">@</span>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface/40 hover:bg-surface/60 focus:bg-surface/80 border border-surface-light text-text-primary rounded-lg py-3.5 pl-11 pr-4 outline-none focus:border-brand/40 transition-all duration-300 placeholder:text-text-muted/50 font-sans shadow-inner"
                  placeholder="admin@casadecarnes.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 relative group">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs uppercase tracking-[0.1em] text-text-secondary font-semibold block">
                  Senha
                </label>
                <a href="#" className="text-[10px] uppercase font-bold tracking-wider text-text-muted hover:text-brand transition-colors">
                  Esqueceu?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-brand transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface/40 hover:bg-surface/60 focus:bg-surface/80 border border-surface-light text-text-primary rounded-lg py-3.5 pl-11 pr-4 outline-none focus:border-brand/40 transition-all duration-300 placeholder:text-text-muted/50 font-sans shadow-inner tracking-widest"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger text-sm py-3 px-4 rounded-lg flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse"></div>
                {error}
              </div>
            )}

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer w-5 h-5 appearance-none rounded border border-surface-light bg-surface/40 checked:bg-brand checked:border-brand transition-all cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-background opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-text-secondary text-sm group-hover:text-text-primary transition-colors">Lembrar nesta estação</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-background font-bold tracking-[0.1em] text-sm uppercase py-4 rounded-lg mt-8 transition-all duration-300 shadow-[0_0_20px_rgba(230,138,92,0.15)] hover:shadow-[0_0_25px_rgba(230,138,92,0.3)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Acessar Painel
              <ArrowRight size={16} className="ml-1 opacity-80" />
            </button>
          </form>

          {/* Footer Notice */}
          <div className="mt-16 sm:mt-24">
            <p className="text-text-muted/60 text-[10px] leading-relaxed mb-4">
              © 2026 Casa de Carnes. Todos os direitos reservados.<br/>
              Acesso exclusivo para funcionários autorizados. O acesso não autorizado é estritamente proibido.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-text-muted text-[11px] hover:text-text-primary transition-colors">Suporte</a>
              <a href="#" className="text-text-muted text-[11px] hover:text-text-primary transition-colors">Política de Privacidade</a>
              <a href="#" className="text-text-muted text-[11px] hover:text-text-primary transition-colors">Status do Sistema</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

