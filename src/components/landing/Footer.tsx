'use client';

import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-display text-iris-forest dark:text-iris-offWhite">IRIS</span>
            <p className="text-sm text-text-muted mt-2">Memórias que conectam. Presença que permanece.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Produto</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><a href="#manifesto" className="hover:text-emotion">Manifesto</a></li>
              <li><a href="#modulos" className="hover:text-emotion">Módulos</a></li>
              <li><a href="#planos" className="hover:text-emotion">Planos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Suporte</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><a href="#" className="hover:text-emotion">Central de ajuda</a></li>
              <li><a href="#" className="hover:text-emotion">Privacidade</a></li>
              <li><a href="#" className="hover:text-emotion">Termos de uso</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Redes</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><a href="#" className="hover:text-emotion">Instagram</a></li>
              <li><a href="#" className="hover:text-emotion">Twitter</a></li>
              <li><a href="#" className="hover:text-emotion">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-text-muted flex justify-center items-center gap-1">
          Feito com <Heart size={12} className="text-rose-500" /> por IRIS • {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}