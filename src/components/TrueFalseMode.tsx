import React, { useState } from 'react';
import { TRUE_FALSE_QUESTIONS } from '../data/cellData';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X, ArrowRight, RotateCcw, Zap } from 'lucide-react';
import { sounds } from '../utils/sound';
import { MotivationalModal } from './MotivationalModal';

interface TrueFalseModeProps {
  onAddScore: (points: number) => void;
  onUpdateStreak: (isCorrect: boolean) => void;
}

export const TrueFalseMode: React.FC<TrueFalseModeProps> = ({
  onAddScore,
  onUpdateStreak
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);

  const currentQ = TRUE_FALSE_QUESTIONS[currentIndex] || TRUE_FALSE_QUESTIONS[0];

  const handleChoose = (choice: boolean) => {
    if (isAnswered) return;

    setSelectedChoice(choice);
    setIsAnswered(true);

    const isCorrect = choice === currentQ.isTrue;

    if (isCorrect) {
      sounds.playCorrect();
      onAddScore(80);
      onUpdateStreak(true);
    } else {
      sounds.playIncorrect();
      onUpdateStreak(false);
      setShowMotivational(true);
    }
  };

  const handleNext = () => {
    sounds.playClick();
    setIsAnswered(false);
    setSelectedChoice(null);
    setShowMotivational(false);

    if (currentIndex + 1 < TRUE_FALSE_QUESTIONS.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Flash Header */}
      <div className="flex items-center justify-between bg-zinc-950 border border-amber-500/30 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-mono">
            Ronda Rápida Verdadero o Falso
          </span>
        </div>
        <span className="text-xs font-mono text-zinc-400">
          Afirmación {currentIndex + 1} de {TRUE_FALSE_QUESTIONS.length}
        </span>
      </div>

      {/* Statement Card */}
      <motion.div
        key={currentIndex}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden"
      >
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-amber-950 text-amber-400 border border-amber-700/50 flex items-center justify-center text-xl font-bold">
          ⚡
        </div>

        <h3 className="text-xl md:text-2xl font-black text-white leading-relaxed mb-8">
          "{currentQ.statement}"
        </h3>

        {/* Big True / False Choice Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleChoose(true)}
            disabled={isAnswered}
            className={`py-6 px-4 rounded-2xl border-2 font-black text-lg transition-all cursor-pointer flex flex-col items-center gap-2 ${
              isAnswered && currentQ.isTrue
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                : isAnswered && selectedChoice === true && !currentQ.isTrue
                ? 'bg-rose-950 border-rose-500 text-rose-300'
                : 'bg-emerald-950/40 border-emerald-800/80 hover:bg-emerald-900/60 text-emerald-400 hover:scale-102'
            }`}
          >
            <Check className="w-8 h-8" />
            <span>VERDADERO</span>
          </button>

          <button
            onClick={() => handleChoose(false)}
            disabled={isAnswered}
            className={`py-6 px-4 rounded-2xl border-2 font-black text-lg transition-all cursor-pointer flex flex-col items-center gap-2 ${
              isAnswered && !currentQ.isTrue
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                : isAnswered && selectedChoice === false && currentQ.isTrue
                ? 'bg-rose-950 border-rose-500 text-rose-300'
                : 'bg-rose-950/40 border-rose-800/80 hover:bg-rose-900/60 text-rose-400 hover:scale-102'
            }`}
          >
            <X className="w-8 h-8" />
            <span>FALSO</span>
          </button>
        </div>

        {/* Result Explanation */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left"
          >
            <p className="text-xs text-zinc-300 leading-relaxed">
              <strong className="text-amber-400 block mb-1">Explicación:</strong>
              {currentQ.explanation}
            </p>

            <button
              onClick={handleNext}
              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-black font-extrabold text-sm shadow-md hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Siguiente Afirmación</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Encouraging Error Modal */}
      <MotivationalModal
        isOpen={showMotivational}
        onClose={handleNext}
        correctAnswerText={currentQ.isTrue ? 'VERDADERO' : 'FALSO'}
        userAnswerText={selectedChoice ? 'VERDADERO' : 'FALSO'}
        explanation={currentQ.explanation}
      />
    </div>
  );
};
