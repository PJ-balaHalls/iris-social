// Componente placeholder. Substitua pelo código real.
'use client';

import { 
  User, BookOpen, Heart, Sparkles, Users, ShoppingBag, 
  Map, Mail, Star, Camera 
} from 'lucide-react';

const modules = [
  { icon: <User size={28} />, title: 'Identity Space', description: 'Seu perfil modular, como um bloco de memórias e interesses.' },
  { icon: <BookOpen size={28} />, title: 'iLIFE', description: 'Diários, cartas, álbuns e sonhos – sua vida pessoal organizada.' },
  { icon: <Heart size={28} />, title: 'usLIFE', description: 'Espaço compartilhado para casais, amigos e família.' },
  { icon: <Sparkles size={28} />, title: 'IRIS AI', description: 'Inteligência emocional para reflexões e insights.' },
  { icon: <Users size={28} />, title: 'Comunidades', description: 'Grupos temáticos com propósito e conexão real.' },
  { icon: <ShoppingBag size={28} />, title: 'Marketplace', description: 'Temas, widgets e agentes criados pela comunidade.' },
];

export function ModulesSection() {
  return (
    <section id="modulos" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-h2 font-display text-emotion">Um ecossistema completo</h2>
          <p className="text-text-secondary max-w-2xl mx-auto mt-4">
            O IRIS reúne tudo o que você precisa para preservar memórias e fortalecer vínculos.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod, idx) => (
            <div key={idx} className="card p-6 hover:shadow-lg transition-all group">
              <div className="text-emotion mb-4 group-hover:scale-110 transition-transform duration-300">
                {mod.icon}
              </div>
              <h3 className="text-xl font-display mb-2">{mod.title}</h3>
              <p className="text-text-muted">{mod.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}