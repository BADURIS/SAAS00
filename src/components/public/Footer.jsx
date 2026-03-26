import React from 'react';
import { Phone, MapPin, Instagram, Lock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function Footer() {
    const { settings } = useStore();

    if (!settings) return null;

    return (
        <footer className="bg-surface border-t border-surface-light text-text-primary mt-auto">
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Brand */}
                    <div>
                        <p className="text-brand font-serif font-bold text-xs tracking-[0.3em] uppercase mb-3">Editorial Roast & Ember</p>
                        <h3 className="font-serif text-2xl font-bold text-white mb-4">
                            Casa dos Assados
                        </h3>
                        <p className="text-text-muted text-sm leading-relaxed">
                            {settings.description}
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white text-xs tracking-[0.25em] uppercase font-bold mb-6">Contato</h4>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-center gap-3 text-text-muted text-sm">
                                <Phone size={16} className="text-brand flex-shrink-0" />
                                <span>{settings.contact.phone}</span>
                            </li>
                            <li className="flex items-center gap-3 text-text-muted text-sm">
                                <Instagram size={16} className="text-brand flex-shrink-0" />
                                <span>{settings.contact.instagram}</span>
                            </li>
                            <li className="flex items-start gap-3 text-text-muted text-sm">
                                <MapPin size={16} className="text-brand flex-shrink-0 mt-0.5" />
                                <span>{settings.contact.address?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="text-white text-xs tracking-[0.25em] uppercase font-bold mb-6">Horário</h4>
                        <ul className="flex flex-col gap-3 text-sm">
                            <li className="flex justify-between gap-4">
                                <span className="text-text-muted">Seg – Sex</span>
                                <span className="text-white font-medium">{settings.hours.weekdays}</span>
                            </li>
                            <li className="flex justify-between gap-4">
                                <span className="text-text-muted">Sáb – Dom</span>
                                <span className="text-white font-medium">{settings.hours.weekend}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-surface-light mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-text-muted text-xs">
                        © {new Date().getFullYear()} Casa dos Assados · Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-text-muted text-xs tracking-widest">PRIVACY · TERMS · CONTACT</span>
                        <a href="/admin" className="flex items-center gap-1 text-text-muted/30 hover:text-text-muted transition-colors text-xs">
                            <Lock size={10} /> Área Restrita
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
