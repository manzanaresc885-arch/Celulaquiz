import React, { useState, useEffect } from 'react';
import { QUESTIONS } from '../data/cellData';
import { Question } from '../types';
import { motion } from 'framer-motion';
import { Activity, Zap, Flame, ShieldAlert, RotateCcw, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/sound';
import { MotivationalModal } from './MotivationalModal';

interface SurvivalModeProps {
  onAddScore: (points: number) => void;
  onUpdateStreak: (isCorrect: boolean) => void;
}

export const SurvivalMode: React.FC<SurvivalModeProps> = ({
  onAddScore,
  onUpdateStreak
}) => {
  const [atpEnergy, setAtpEnergy] = useState(100);
  const [divisionsCount, setDivisionsCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);

  const currentQuestion: Question = QUESTIONS[currentIndex % QUESTIONS.length];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted || gameOver) return;

    setSelectedOption(idx);
    setIsSubmitted(true);

    const isCorrect = idx === currentQuestion.correctIndex;

    if (isCorrect) {
      sounds.playCorrect();
      onAddScore(120);
      onUpdateStreak(true);

      // Increase energy and check division
      setAtpEnergy(prev => {
        const next = Math.min(100, prev + 25);
        return next;
      });
      setDivisionsCount(prev => prev + 1);
    } else {
      sounds.playIncorrect();
      onUpdateStreak(false);

      setAtpEnergy(prev => {
        const next = prev - 35;
        if (next <= 0) {
          setGameOver(true);
        }
        return Math.max(0, next);
      });
      setShowMotivational(true);
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    setIsSubmitted(false);
    setSelectedOption(null);
    setShowMotivational(false);

    if (!gameOver) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    sounds.playPowerup();
    setAtpEnergy(100);
    setDivisionsCount(0);
    setCurrentIndex(0);
    setGameOver(false);
    setIsSubmitted(false);
    setSelectedOption(null);
  };

  if (gameOver) {
    return (
      <div className="w-full max-w-md mx-auto my-8 p-6 bg-zinc-950 border border-rose-500/40 rounded-3xl text-center text-white shadow-[0_0_50px_rgba(244,63,94,0.3)]">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-rose-950 border border-rose-600 text-rose-400 flex items-center justify-center text-3xl">
          ⚡
        </div>
        <h2 className="text-2xl font-black">Nivel de ATP Agotado</h2>
        <p className="text-xs text-zinc-400 mt-1">La célula necesitó más energía para completar la mitosis.</p>

        <div className="my-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <span className="text-xs text-zinc-500 block uppercase font-mono">Divisiones Celulares Exitosas</span>
          <span className="text-4xl font-extrabold text-rose-400 mt-1 block">{divisionsCount} Mitosis</span>
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 text-black font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-102 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Intentar de Nuevo (Recargar Célula)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* ATP Energy Bar & Mitosis Score */}
      <div className="bg-zinc-950 border border-rose-500/30 p-4 rounded-2xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-rose-400">
            <Zap className="w-4 h-4 fill-rose-400 animate-bounce" />
            <span>Reserva de Energía ATP: {atpEnergy}%</span>
          </div>
          <span className="font-mono text-cyan-300 font-bold">{divisionsCount} Divisiones</span>
        </div>

        {/* Health / Energy Bar */}
        <div className="w-full h-3.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5">
          <motion.div
            className={`h-full rounded-full transition-all ${
              atpEnergy > 50
                ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_12px_rgba(0,255,136,0.5)]'
                : atpEnergy > 25
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                : 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_12px_rgba(244,63,94,0.5)]'
            }`}
            animate={{ width: `${atpEnergy}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-5">{currentQuestion.question}</h3>

        <div className="space-y-2.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = currentQuestion.correctIndex === idx;

            let style = 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-rose-500/50';

            if (isSubmitted) {
              if (isCorrect) {
                style = 'bg-emerald-950 border-emerald-500 text-emerald-200';
              } else if (isSelected) {
                style = 'bg-rose-950 border-rose-500 text-rose-200';
              } else {
                style = 'bg-zinc-900/40 border-zinc-850 text-zinc-600 opacity-40';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isSubmitted}
                className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all cursor-pointer ${style}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 text-black font-extrabold text-sm shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Continuar Mitosis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <MotivationalModal
        isOpen={showMotivational}
        onClose={handleNextQuestion}
        correctAnswerText={currentQuestion.options[currentQuestion.correctIndex]}
        userAnswerText={selectedOption !== null ? currentQuestion.options[selectedOption] : ''}
        explanation={currentQuestion.explanation}
      />
    </div>
  );
};
