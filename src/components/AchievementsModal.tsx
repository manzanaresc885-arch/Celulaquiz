import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Trophy, Sparkles, CheckCircle2, X } from 'lucide-react';
import { sounds } from '../utils/sound';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  streak: number;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  score,
  streak
}) => {
  if (!isOpen) return null;

  const achievements = [
    {
      id: 'first_step',
      title: 'Primer Paso Celular',
      description: 'Comienza tu viaje de aprendizaje en CélulaQuiz.',
      unlocked: score > 0,
      icon: '🌱'
    },
    {
      id: 'streak_5',
      title: 'Racha de ADN',
      description: 'Consigue una racha de 5 respuestas correctas seguidas.',
      unlocked: streak >= 5,
      icon: '🔥'
    },
    {
      id: 'score_500',
      title: 'Explorador Microscópico',
      description: 'Acumula 500 puntos en cualquier modo de juego.',
      unlocked: score >= 500,
      icon: '🔬'
    },
    {
      id: 'score_1000',
      title: 'Biólogo Celular Maestro',
      description: 'Alcanza la cifra de 1,000 puntos totales.',
      unlocked: score >= 1000,
      icon: '🧬'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-lg bg-zinc-950 border border-amber-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(251,191,36,0.2)] text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800/60">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black">Logros y Trofeos Celulares</h3>
                <p className="text-xs text-zinc-400">Tus medallas de aprendizaje y progreso</p>
              </div>
            </div>
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Achievements Grid */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                  ach.unlocked
                    ? 'bg-zinc-900 border-amber-500/50 shadow-md'
                    : 'bg-zinc-950/60 border-zinc-850 opacity-50 grayscale'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-2xl shrink-0">
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{ach.title}</h4>
                    {ach.unlocked && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-amber-400" />
                        Desbloqueado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
