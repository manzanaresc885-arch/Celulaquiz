import React, { useState } from 'react';
import { ORGANELLES } from '../data/cellData';
import { OrganelleInfo } from '../types';
import { CellDiagram } from './CellDiagram';
import { Search, BookOpen, Sparkles, Cpu, Zap, Sun, Shield, Box, Hammer, Network, Package, Droplet, Trash2, Info, Lightbulb } from 'lucide-react';
import { sounds } from '../utils/sound';

export const CellEncyclopedia: React.FC = () => {
  const [selectedOrganelle, setSelectedOrganelle] = useState<OrganelleInfo>(ORGANELLES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cellTypeFilter, setCellTypeFilter] = useState<'all' | 'animal' | 'plant' | 'procaryote'>('all');

  const filteredOrganelles = ORGANELLES.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.analogy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = cellTypeFilter === 'all' || org.foundIn.includes(cellTypeFilter as 'animal' | 'plant' | 'procaryote');
    return matchesSearch && matchesType;
  });

  const getOrganelleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Sun': return <Sun className="w-5 h-5" />;
      case 'Shield': return <Shield className="w-5 h-5" />;
      case 'Box': return <Box className="w-5 h-5" />;
      case 'Hammer': return <Hammer className="w-5 h-5" />;
      case 'Network': return <Network className="w-5 h-5" />;
      case 'Package': return <Package className="w-5 h-5" />;
      case 'Droplet': return <Droplet className="w-5 h-5" />;
      case 'Trash2': return <Trash2 className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-zinc-950 border border-indigo-500/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(99,102,241,0.15)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-700/50">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Enciclopedia Celular Interactiva</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Explora las estructuras, funciones y analogías del micromundo.</p>
            </div>
          </div>

          {/* Cell type filter pill */}
          <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-2xl border border-zinc-800 self-start md:self-auto">
            {(['all', 'animal', 'plant', 'procaryote'] as const).map(type => (
              <button
                key={type}
                onClick={() => { sounds.playClick(); setCellTypeFilter(type); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                  cellTypeFilter === type
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {type === 'all' ? 'Todos' : type === 'animal' ? 'Animal' : type === 'plant' ? 'Vegetal' : 'Procariota'}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar organelo por nombre o función (Ej: Mitocondria, Energía, ADN...)"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Content Layout: Organelle List + Main Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Organelles Directory */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredOrganelles.map((org) => {
            const isSelected = selectedOrganelle.id === org.id;
            return (
              <button
                key={org.id}
                onClick={() => { sounds.playClick(); setSelectedOrganelle(org); }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 border-indigo-500 text-white shadow-lg scale-102'
                    : 'bg-zinc-950/80 border-zinc-850 text-zinc-300 hover:bg-zinc-900/60'
                }`}
              >
                <div
                  className="p-2 rounded-xl text-black font-bold shrink-0"
                  style={{ backgroundColor: org.color }}
                >
                  {getOrganelleIcon(org.iconName)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm truncate">{org.name}</h4>
                  <span className="text-[10px] text-zinc-500 font-medium block truncate">{org.analogy}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Detailed Organelle View & Interactive Diagram */}
        <div className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-2xl text-black font-extrabold text-xl shadow-lg"
                style={{ backgroundColor: selectedOrganelle.color }}
              >
                {getOrganelleIcon(selectedOrganelle.iconName)}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">{selectedOrganelle.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono font-bold mt-1 inline-block">
                  {selectedOrganelle.analogy}
                </span>
              </div>
            </div>

            {/* Found in badges */}
            <div className="flex flex-wrap gap-1">
              {selectedOrganelle.foundIn.map(f => (
                <span key={f} className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800 uppercase font-mono">
                  {f === 'animal' ? '🐾 Animal' : f === 'plant' ? '🌱 Vegetal' : '🧫 Procariota'}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider font-mono">Función Biológica</h4>
            <p className="text-sm text-zinc-200 leading-relaxed bg-zinc-900/60 p-4 rounded-2xl border border-zinc-850">
              {selectedOrganelle.description}
            </p>
          </div>

          {/* Fun Fact */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-200 text-sm mb-0.5">Dato Curioso:</strong>
              {selectedOrganelle.funFact}
            </div>
          </div>

          {/* Interactive diagram highlighting this organelle */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider font-mono mb-3">Ubicación Celular</h4>
            <CellDiagram
              cellType={selectedOrganelle.foundIn.includes('plant') ? 'plant' : 'animal'}
              highlightOrganelleId={selectedOrganelle.id}
              interactive={false}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
