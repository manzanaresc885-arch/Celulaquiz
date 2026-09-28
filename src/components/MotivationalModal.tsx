import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOTIVATIONAL_CHARACTERS } from '../data/cellData';
import { Heart, Sparkles, ArrowRight, Lightbulb, RefreshCw } from 'lucide-react';
import { sounds } from '../utils/sound';

interface MotivationalModalProps {
  isOpen: boolean;
  onClose: () => void;
  correctAnswerText: string;
  explanation: string;
  hint?: string;
  userAnswerText?: string;
}

export const MotivationalModal: React.FC<MotivationalModalProps> = ({
  isOpen,
  onClose,
  correctAnswerText,
  explanation,
  hint,
  userAnswerText
}) => {
  if (!isOpen) return null;

  // Pick a random motivational character
  const character = MOTIVATIONAL_CHARACTERS[Math.floor(Math.random() * MOTIVATIONAL_CHARACTERS.length)];
  const quote = character.quotes[Math.floor(Math.random() * character.quotes.length)];

  const handleNext = () => {
    sounds.playClick();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-zinc-950 border-2 border-pink-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.25)] text-white overflow-hidden"
        >
          {/* Top glowing ambient accent */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Character Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-zinc-900 rounded-[14px] flex items-center justify-center text-3xl">
                {character.avatar}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">{character.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-800 font-medium">
                  {character.role}
                </span>
              </div>
              <p className="text-xs text-pink-400/90 italic font-medium mt-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 inline" />
                "{quote}"
              </p>
            </div>
          </div>

          {/* User vs Correct Answer Comparison */}
          <div className="space-y-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 my-4">
            {userAnswerText && (
              <div className="text-xs">
                <span className="text-zinc-500 block mb-1">Tu respuesta:</span>
                <span className="text-rose-400 font-semibold line-through decoration-rose-500/80">
                  {userAnswerText}
                </span>
              </div>
            )}
            <div className="text-xs pt-1 border-t border-zinc-800/80">
              <span className="text-cyan-400 font-bold block mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Respuesta Correcta:
              </span>
              <span className="text-emerald-400 font-bold text-sm block bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/30">
                {correctAnswerText}
              </span>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-cyan-950/30 border border-cyan-800/50 rounded-2xl p-3.5 text-xs text-zinc-300 leading-relaxed mb-4">
            <span className="text-cyan-300 font-bold block mb-1 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              ¿Por qué es así?
            </span>
            {explanation}
          </div>

          {/* Hint / Memory Trick */}
          {hint && (
            <div className="text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-800/40 rounded-xl p-2.5 mb-5 flex items-start gap-2">
              <span className="text-base leading-none">💡</span>
              <div>
                <strong className="block text-amber-200">Truco para recordar:</strong>
                {hint}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>¡Entendido! Continuar aprendiendo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
