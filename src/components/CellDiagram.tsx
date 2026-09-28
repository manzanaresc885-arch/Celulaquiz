import React, { useState } from 'react';
import { ORGANELLES } from '../data/cellData';
import { OrganelleInfo } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Cpu, Sun, Shield, Box, Hammer, Network, Package, Droplet, Trash2, Info, Sparkles } from 'lucide-react';

interface CellDiagramProps {
  cellType?: 'animal' | 'plant' | 'procaryote';
  onSelectOrganelle?: (organelle: OrganelleInfo) => void;
  selectedOrganelleId?: string | null;
  highlightOrganelleId?: string | null;
  interactive?: boolean;
}

export const CellDiagram: React.FC<CellDiagramProps> = ({
  cellType = 'animal',
  onSelectOrganelle,
  selectedOrganelleId,
  highlightOrganelleId,
  interactive = true
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  // Filter organelles based on cell type
  const activeOrganelles = ORGANELLES.filter(org => org.foundIn.includes(cellType as 'animal' | 'plant' | 'procaryote'));

  const hoveredOrganelle = ORGANELLES.find(o => o.id === (hoveredId || selectedOrganelleId || highlightOrganelleId));

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Bioluminescent Canvas Background */}
      <div className="relative w-full aspect-square max-h-[460px] bg-gradient-to-b from-slate-950 via-zinc-950 to-black rounded-3xl p-4 border border-cyan-500/20 shadow-[0_0_30px_rgba(0,229,255,0.15)] overflow-hidden flex items-center justify-center">
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

        {/* Floating Cytoplasm Cytoskeleton particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/30 animate-pulse"
              style={{
                top: `${15 + (i * 7) % 70}%`,
                left: `${20 + (i * 13) % 65}%`,
                animationDelay: `${i * 0.4}s`
              }}
            />
          ))}
        </div>

        {/* Interactive Cell SVG Diagram */}
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-2xl select-none"
        >
          <defs>
            {/* Bioluminescent Gradients */}
            <radialGradient id="grad-cytoplasm" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="70%" stopColor="#020617" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>

            <radialGradient id="grad-nucleo" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
            </radialGradient>

            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="glow-highlight" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Plant Cell Wall (If Plant) */}
          {cellType === 'plant' && (
            <motion.rect
              x="30"
              y="30"
              width="340"
              height="340"
              rx="40"
              fill="none"
              stroke="#2ecc71"
              strokeWidth={hoveredId === 'pared' || highlightOrganelleId === 'pared' ? "8" : "5"}
              className={`transition-all duration-300 ${interactive ? 'cursor-pointer' : ''}`}
              onClick={() => interactive && onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'pared')!)}
              onMouseEnter={() => setHoveredId('pared')}
              onMouseLeave={() => setHoveredId(null)}
              animate={{
                filter: hoveredId === 'pared' || highlightOrganelleId === 'pared' ? 'drop-shadow(0 0 12px #2ecc71)' : 'none'
              }}
            />
          )}

          {/* Outer Cell Membrane Boundary */}
          <motion.path
            d={
              cellType === 'plant'
                ? "M 50 50 H 350 V 350 H 50 Z"
                : cellType === 'procaryote'
                ? "M 100 80 Q 200 40 300 80 Q 360 200 300 320 Q 200 360 100 320 Q 40 200 100 80 Z"
                : "M 200 40 C 330 30 370 120 360 220 C 350 330 250 370 150 360 C 40 340 30 220 50 130 C 70 50 120 40 200 40 Z"
            }
            fill="url(#grad-cytoplasm)"
            stroke={hoveredId === 'membrana' || highlightOrganelleId === 'membrana' ? "#c084fc" : "#9d4edd"}
            strokeWidth={hoveredId === 'membrana' || highlightOrganelleId === 'membrana' ? "6" : "3.5"}
            className={`transition-all duration-300 ${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => interactive && onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'membrana')!)}
            onMouseEnter={() => setHoveredId('membrana')}
            onMouseLeave={() => setHoveredId(null)}
          />

          {/* Cytoplasm label / background feel */}
          <text x="200" y="375" textAnchor="middle" fill="#64748b" className="text-[10px] font-mono tracking-widest uppercase pointer-events-none">
            {cellType === 'plant' ? 'Célula Vegetal' : cellType === 'procaryote' ? 'Célula Procariota (Bacteriana)' : 'Célula Animal (Eucariota)'}
          </text>

          {/* ORGANELLES PATHS */}

          {/* 1. NUCLEUS (In Animal & Plant) */}
          {activeOrganelles.some(o => o.id === 'nucleo') && (
            <g
              className={`transition-all duration-300 ${interactive ? 'cursor-pointer group' : ''}`}
              onClick={() => interactive && onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'nucleo')!)}
              onMouseEnter={() => setHoveredId('nucleo')}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Nucleus Outer Glow */}
              <circle
                cx="200"
                cy="190"
                r="48"
                fill="url(#grad-nucleo)"
                stroke={hoveredId === 'nucleo' || highlightOrganelleId === 'nucleo' ? "#22d3ee" : "#0284c7"}
                strokeWidth={hoveredId === 'nucleo' || highlightOrganelleId === 'nucleo' ? "4" : "2"}
                filter={hoveredId === 'nucleo' || highlightOrganelleId === 'nucleo' ? "url(#glow-cyan)" : undefined}
              />
              {/* Nucleolus inside */}
              <circle cx="195" cy="185" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="195" cy="185" r="8" fill="#38bdf8" className="animate-pulse" />
              {/* Chromatin strands */}
              <path d="M 180 200 Q 190 210 205 195 Q 215 205 220 190" fill="none" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.7" />
            </g>
          )}

          {/* 2. MITOCHONDRIA (Energy) */}
          {activeOrganelles.some(o => o.id === 'mitocondria') && (
            <g>
              {/* Mitochondria 1 */}
              <g
                className={`transition-all duration-300 ${interactive ? 'cursor-pointer' : ''}`}
                onClick={() => interactive && onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'mitocondria')!)}
                onMouseEnter={() => setHoveredId('mitocondria')}
                onMouseLeave={() => setHoveredId(null)}
              >
                <rect
                  x="280"
                  y="120"
                  width="45"
                  height="26"
                  rx="13"
                  transform="rotate(25 300 130)"
                  fill="#831843"
                  stroke={hoveredId === 'mitocondria' || highlightOrganelleId === 'mitocondria' ? "#f43f5e" : "#e11d48"}
                  strokeWidth={hoveredId === 'mitocondria' || highlightOrganelleId === 'mitocondria' ? "3" : "1.5"}
                />
                <path d="M 285 130 Q 295 125 300 135 Q 310 125 320 130" fill="none" stroke="#f43f5e" strokeWidth="2" transform="rotate(25 300 130)" />
              </g>

              {/* Mitochondria 2 */}
              <g
                className={`transition-all duration-300 ${interactive ? 'cursor-pointer' : ''}`}
                onClick={() => interactive && onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'mitocondria')!)}
                onMouseEnter={() => setHoveredId('mitocondria')}
                onMouseLeave={() => setHoveredId(null)}
              >
                <rect
                  x="80"
                  y="260"
                  width="45"
                  height="26"
                  rx="13"
                  transform="rotate(-20 100 270)"
                  fill="#831843"
                  stroke={hoveredId === 'mitocondria' || highlightOrganelleId === 'mitocondria' ? "#f43f5e" : "#e11d48"}
                  strokeWidth={hoveredId === 'mitocondria' || highlightOrganelleId === 'mitocondria' ? "3" : "1.5"}
                />
                <path d="M 85 270 Q 95 265 100 275 Q 110 265 120 270" fill="none" stroke="#f43f5e" strokeWidth="2" transform="rotate(-20 100 270)" />
              </g>
            </g>
          )}

          {/* 3. CHLOROPLASTS (Plant Only) */}
          {activeOrganelles.some(o => o.id === 'cloroplasto') && (
            <g>
              <g
                className={`transition-all duration-300 ${interactive ? 'cursor-pointer' : ''}`}
                onClick={() => interactive && onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'cloroplasto')!)}
                onMouseEnter={() => setHoveredId('cloroplasto')}
                onMouseLeave={() => setHoveredId(null)}
              >
                <ellipse cx="100" cy="110" rx="26" ry="16" transform="rotate(-15 100 110)" fill="#064e3b" stroke={hoveredId === 'cloroplasto' || highlightOrganelleId === 'cloroplasto' ? "#10b981" : "#059669"} strokeWidth="2" />
                <circle cx="92" cy="108" r="4" fill="#34d399" />
                <circle cx="104" cy="112" r="4" fill="#34d399" />
                <circle cx="112" cy="106" r="4" fill="#34d399" />
              </g>
              <g
                className={`transition-all duration-300 ${interactive ? 'cursor-pointer' : ''}`}
                onClick={() => interactive && onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'cloroplasto')!)}
                onMouseEnter={() => setHoveredId('cloroplasto')}
                onMouseLeave={() => setHoveredId(null)}
              >
                <ellipse cx="290" cy="270" rx="28" ry="17" transform="rotate(20 290 270)" fill="#064e3b" stroke={hoveredId === 'cloroplasto' || highlightOrganelleId === 'cloroplasto' ? "#10b981" : "#059669"} strokeWidth="2" />
                <circle cx="282" cy="268" r="4" fill="#34d399" />
                <circle cx="294" cy="272" r="4" fill="#34d399" />
              </g>
            </g>
          )}

          {/* 4. VACUOLE */}
          {activeOrganelles.some(o => o.id === 'vacuola') && (
            <g
              className={`transition-all duration-300 ${interactive ? 'cursor-pointer' : ''}`}
              onClick={() => interactive && onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'vacuola')!)}
              onMouseEnter={() => setHoveredId('vacuola')}
              onMouseLeave={() => setHoveredId(null)}
            >
              <path
                d={cellType === 'plant' ? "M 220 220 C 270 200 320 240 300 300 C 270 330 210 310 220 220 Z" : "M 90 200 C 110 190 120 210 100 220 C 80 220 75 205 90 200 Z"}
                fill="#0c4a6e"
                fillOpacity="0.6"
                stroke={hoveredId === 'vacuola' || highlightOrganelleId === 'vacuola' ? "#38bdf8" : "#0284c7"}
                strokeWidth={hoveredId === 'vacuola' || highlightOrganelleId === 'vacuola' ? "3" : "1.5"}
              />
            </g>
          )}

          {/* 5. GOLGI APPARATUS */}
          {activeOrganelles.some(o => o.id === 'golgi') && (
            <g
              className={`transition-all duration-300 ${interactive ? 'cursor-pointer' : ''}`}
              onClick={() => interactive && onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'golgi')!)}
              onMouseEnter={() => setHoveredId('golgi')}
              onMouseLeave={() => setHoveredId(null)}
            >
              <path d="M 270 170 Q 290 160 300 180" fill="none" stroke="#e879f9" strokeWidth="4" strokeLinecap="round" />
              <path d="M 265 180 Q 288 172 298 190" fill="none" stroke="#d946ef" strokeWidth="4" strokeLinecap="round" />
              <path d="M 272 192 Q 285 185 292 200" fill="none" stroke="#c026d3" strokeWidth="4" strokeLinecap="round" />
              <circle cx="308" cy="180" r="3" fill="#f0abfc" />
              <circle cx="302" cy="195" r="2.5" fill="#f0abfc" />
            </g>
          )}

          {/* 6. ENDOPLASMIC RETICULUM */}
          {activeOrganelles.some(o => o.id === 'reticulo') && (
            <g
              className={`transition-all duration-300 ${interactive ? 'cursor-pointer' : ''}`}
              onClick={() => interactive && onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'reticulo')!)}
              onMouseEnter={() => setHoveredId('reticulo')}
              onMouseLeave={() => setHoveredId(null)}
            >
              <path d="M 148 160 C 130 150 120 180 135 200 C 120 210 130 230 150 225" fill="none" stroke="#f87171" strokeWidth="3" strokeDasharray="3 2" />
            </g>
          )}

          {/* 7. RIBOSOMES (Little floating yellow dots) */}
          {activeOrganelles.some(o => o.id === 'ribosoma') && (
            <g
              className={`transition-all duration-300 ${interactive ? 'cursor-pointer' : ''}`}
              onClick={() => interactive && onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'ribosoma')!)}
              onMouseEnter={() => setHoveredId('ribosoma')}
              onMouseLeave={() => setHoveredId(null)}
            >
              {[
                [130, 165], [125, 185], [140, 210], [170, 120], [240, 130], [250, 250], [160, 270]
              ].map(([cx, cy], idx) => (
                <circle key={idx} cx={cx} cy={cy} r="3" fill="#facc15" className="animate-pulse" />
              ))}
            </g>
          )}

          {/* 8. LYSOSOMES (Animal) */}
          {activeOrganelles.some(o => o.id === 'lisosoma') && (
            <g
              className={`transition-all duration-300 ${interactive ? 'cursor-pointer' : ''}`}
              onClick={() => interactive && onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'lisosoma')!)}
              onMouseEnter={() => setHoveredId('lisosoma')}
              onMouseLeave={() => setHoveredId(null)}
            >
              <circle cx="160" cy="280" r="10" fill="#ea580c" stroke="#fb923c" strokeWidth="2" />
              <circle cx="250" cy="100" r="8" fill="#ea580c" stroke="#fb923c" strokeWidth="2" />
            </g>
          )}
        </svg>

        {/* Hover / Selected Organelle Floating Tooltip Card */}
        <AnimatePresence>
          {hoveredOrganelle && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-3 left-3 right-3 bg-zinc-900/95 backdrop-blur-md border border-cyan-500/40 p-3 rounded-2xl shadow-xl flex items-center gap-3 z-20 pointer-events-none"
            >
              <div
                className="p-2.5 rounded-xl text-black font-bold flex items-center justify-center shrink-0 shadow-lg"
                style={{ backgroundColor: hoveredOrganelle.color }}
              >
                {getOrganelleIcon(hoveredOrganelle.iconName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-bold text-sm truncate">{hoveredOrganelle.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                    {hoveredOrganelle.analogy}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 line-clamp-1 mt-0.5">{hoveredOrganelle.description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper caption */}
      {interactive && (
        <p className="text-xs text-zinc-400 mt-2 text-center flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Haz clic o pasa el cursor sobre cualquier organelo para explorarlo
        </p>
      )}
    </div>
  );
};
