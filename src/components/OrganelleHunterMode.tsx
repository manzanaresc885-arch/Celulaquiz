import React, { useState } from 'react';
import { ORGANELLES } from '../data/cellData';
import { OrganelleInfo } from '../types';
import { CellDiagram } from './CellDiagram';
import { motion } from 'framer-motion';
import { Dna, Sparkles, CheckCircle2, RotateCcw, Target, Lightbulb } from 'lucide-react';
import { sounds } from '../utils/sound';
import { MotivationalModal } from './MotivationalModal';

interface OrganelleHunterModeProps {
  onAddScore: (points: number) => void;
  onUpdateStreak: (isCorrect: boolean) => void;
}

export const OrganelleHunterMode: React.FC<OrganelleHunterModeProps> = ({
  onAddScore,
  onUpdateStreak
}) => {
  const [cellType, setCellType] = useState<'animal' | 'plant'>('animal');
  
  // Organelles for current cell type
  const activeOrganelles = ORGANELLES.filter(o => o.foundIn.includes(cellType));
  
  const [targetIndex, setTargetIndex] = useState(0);
  const [selectedOrganelle, setSelectedOrganelle] = useState<OrganelleInfo | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);
  const [highlightOrganelleId, setHighlightOrganelleId] = useState<string | null>(null);

  const currentTarget = activeOrganelles[targetIndex] || activeOrganelles[0];

  const handleSelectOrganelle = (organelle: OrganelleInfo) => {
    if (isAnswered) return;
    
    setSelectedOrganelle(organelle);
    setIsAnswered(true);

    if (organelle.id === currentTarget.id) {
      sounds.playCorrect();
      onAddScore(150);
      onUpdateStreak(true);
      setHighlightOrganelleId(currentTarget.id);
    } else {
      sounds.playIncorrect();
      onUpdateStreak(false);
      setHighlightOrganelleId(currentTarget.id);
      setShowMotivational(true);
    }
  };

  const handleNextTarget = () => {
    sounds.playClick();
    setIsAnswered(false);
    setSelectedOrganelle(null);
    setShowMotivational(false);
    setHighlightOrganelleId(null);

    if (targetIndex + 1 < activeOrganelles.length) {
      setTargetIndex(prev => prev + 1);
    } else {
      // Loop or switch cell type
      setTargetIndex(0);
      setCellType(prev => prev === 'animal' ? 'plant' : 'animal');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Target Challenge Banner */}
      <div className="bg-zinc-950 border border-emerald-500/30 rounded-3xl p-5 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-700/50 shrink-0">
            <Target className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
              Cazador de Organelos ({targetIndex + 1} de {activeOrganelles.length})
            </span>
            <h2 className="text-base md:text-lg font-black text-white mt-0.5">
              ¿Dónde se ubica: <span className="text-emerald-300 font-extrabold">{currentTarget.name}</span>?
            </h2>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 inline shrink-0" />
              Pista: {currentTarget.analogy} — {currentTarget.description}
            </p>
          </div>
        </div>

        {/* Cell Type Toggle Button */}
        <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 shrink-0">
          <button
            onClick={() => { sounds.playClick(); setCellType('animal'); setTargetIndex(0); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              cellType === 'animal'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🐾 Célula Animal
          </button>
          <button
            onClick={() => { sounds.playClick(); setCellType('plant'); setTargetIndex(0); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              cellType === 'plant'
                ? 'bg-emerald-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🌱 Célula Vegetal
          </button>
        </div>
      </div>

      {/* Main Interactive Diagram Canvas */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
        <CellDiagram
          cellType={cellType}
          onSelectOrganelle={handleSelectOrganelle}
          selectedOrganelleId={selectedOrganelle?.id}
          highlightOrganelleId={highlightOrganelleId}
          interactive={!isAnswered}
        />

        {/* Action Controls when answered */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-4"
          >
            <div>
              {selectedOrganelle?.id === currentTarget.id ? (
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>¡Excelente ojo biológico! Encontraste el/la {currentTarget.name}.</span>
                </div>
              ) : (
                <div className="text-rose-400 font-bold text-sm">
                  <span>Haz seleccionado {selectedOrganelle?.name}. El organelo correcto era {currentTarget.name}.</span>
                </div>
              )}
            </div>

            <button
              onClick={handleNextTarget}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-extrabold text-sm shadow-lg hover:scale-105 transition-all cursor-pointer shrink-0"
            >
              Siguiente Organelo
            </button>
          </motion.div>
        )}
      </div>

      {/* Motivational Error Modal */}
      <MotivationalModal
        isOpen={showMotivational}
        onClose={handleNextTarget}
        correctAnswerText={currentTarget.name}
        userAnswerText={selectedOrganelle?.name}
        explanation={currentTarget.description}
        hint={`Recuerda que ${currentTarget.name} es conocido como "${currentTarget.analogy}". ${currentTarget.funFact}`}
      />
    </div>
  );
};
