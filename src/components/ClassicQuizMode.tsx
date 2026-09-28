import React, { useState, useEffect } from 'react';
import { QUESTIONS } from '../data/cellData';
import { Question, DifficultyLevel } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, HelpCircle, Eye, Lightbulb, Clock, CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';
import { MotivationalModal } from './MotivationalModal';

interface ClassicQuizModeProps {
  difficulty: DifficultyLevel;
  questionCount?: number;
  timeLimit?: number;
  onAddScore: (points: number) => void;
  onUpdateStreak: (isCorrect: boolean) => void;
}

export const ClassicQuizMode: React.FC<ClassicQuizModeProps> = ({
  difficulty,
  questionCount = 10,
  timeLimit = 20,
  onAddScore,
  onUpdateStreak
}) => {
  // Filter questions for the selected difficulty
  const baseQuestions = difficulty === 'all'
    ? QUESTIONS
    : QUESTIONS.filter(q => q.difficulty === difficulty);

  // Limit questions to questionCount
  const filteredQuestions = baseQuestions.slice(0, questionCount);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [lifelinesUsed, setLifelinesUsed] = useState<{ fiftyFifty: boolean; hint: boolean }>({
    fiftyFifty: false,
    hint: false
  });
  
  // Timer state
  const initialTime = timeLimit === 0 ? 999 : timeLimit;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timerActive, setTimerActive] = useState(timeLimit !== 0);

  // Motivational popup state
  const [showMotivationalModal, setShowMotivationalModal] = useState(false);
  
  // Quiz completed summary
  const [quizFinished, setQuizFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion: Question | undefined = filteredQuestions[currentIndex] || filteredQuestions[0];

  useEffect(() => {
    // Reset state on question change or difficulty change
    setSelectedOption(null);
    setIsSubmitted(false);
    setEliminatedOptions([]);
    setShowHint(false);
    const resetTime = timeLimit === 0 ? 999 : timeLimit;
    setTimeLeft(resetTime);
    setTimerActive(timeLimit !== 0);
  }, [currentIndex, difficulty, timeLimit]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || isSubmitted || quizFinished || !currentQuestion) return;
    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerActive, isSubmitted, quizFinished]);

  const handleTimeOut = () => {
    setIsSubmitted(true);
    setTimerActive(false);
    sounds.playIncorrect();
    onUpdateStreak(false);
    setShowMotivationalModal(true);
  };

  const handleSelectOption = (index: number) => {
    if (isSubmitted || eliminatedOptions.includes(index)) return;
    sounds.playClick();
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted || !currentQuestion) return;

    setIsSubmitted(true);
    setTimerActive(false);

    const isCorrect = selectedOption === currentQuestion.correctIndex;

    if (isCorrect) {
      sounds.playCorrect();
      setCorrectCount(prev => prev + 1);
      const bonusPoints = Math.max(10, timeLeft * 5);
      onAddScore(100 + bonusPoints);
      onUpdateStreak(true);
    } else {
      sounds.playIncorrect();
      onUpdateStreak(false);
      setShowMotivationalModal(true);
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    setShowMotivationalModal(false);
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      sounds.playFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleUse5050 = () => {
    if (lifelinesUsed.fiftyFifty || isSubmitted || !currentQuestion) return;
    sounds.playPowerup();

    const wrongIndices = currentQuestion.options
      .map((_, idx) => idx)
      .filter(idx => idx !== currentQuestion.correctIndex);
    
    // Pick 2 random wrong options to eliminate
    const shuffled = [...wrongIndices].sort(() => 0.5 - Math.random());
    setEliminatedOptions(shuffled.slice(0, 2));
    setLifelinesUsed(prev => ({ ...prev, fiftyFifty: true }));
  };

  const handleUseHint = () => {
    if (lifelinesUsed.hint || isSubmitted) return;
    sounds.playPowerup();
    setShowHint(true);
    setLifelinesUsed(prev => ({ ...prev, hint: true }));
  };

  const handleRestartQuiz = () => {
    sounds.playClick();
    setCurrentIndex(0);
    setCorrectCount(0);
    setQuizFinished(false);
    setLifelinesUsed({ fiftyFifty: false, hint: false });
  };

  if (quizFinished) {
    const percentage = Math.round((correctCount / filteredQuestions.length) * 100);
    return (
      <div className="max-w-xl mx-auto my-8 p-6 bg-zinc-950 border border-cyan-500/30 rounded-3xl text-center shadow-[0_0_50px_rgba(0,229,255,0.2)]">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-400 to-pink-500 p-1 flex items-center justify-center text-4xl shadow-xl animate-bounce">
          🏆
        </div>
        <h2 className="text-2xl font-black text-white">¡Nivel Completado!</h2>
        <p className="text-sm text-zinc-400 mt-1">Has respondido todas las preguntas de nivel {difficulty}</p>

        <div className="my-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex justify-around items-center">
          <div>
            <span className="text-3xl font-extrabold text-cyan-400">{correctCount} / {filteredQuestions.length}</span>
            <span className="block text-xs text-zinc-500 uppercase mt-1">Aciertos</span>
          </div>
          <div className="h-10 w-px bg-zinc-800" />
          <div>
            <span className="text-3xl font-extrabold text-emerald-400">{percentage}%</span>
            <span className="block text-xs text-zinc-500 uppercase mt-1">Precisión</span>
          </div>
        </div>

        <button
          onClick={handleRestartQuiz}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-102 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Volver a Jugar este Nivel</span>
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Quiz Progress & Timer Header */}
      <div className="flex items-center justify-between bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
            Pregunta {currentIndex + 1} de {filteredQuestions.length}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold uppercase">
            {currentQuestion.category}
          </span>
        </div>

        {/* Lifelines / Comodines */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUse5050}
            disabled={lifelinesUsed.fiftyFifty || isSubmitted}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              lifelinesUsed.fiftyFifty
                ? 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-indigo-950/80 border-indigo-700 text-indigo-300 hover:scale-105'
            }`}
            title="Eliminar 2 opciones incorrectas"
          >
            50:50
          </button>

          <button
            onClick={handleUseHint}
            disabled={lifelinesUsed.hint || isSubmitted}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 transition-all cursor-pointer ${
              lifelinesUsed.hint
                ? 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-amber-950/80 border-amber-700 text-amber-300 hover:scale-105'
            }`}
            title="Ver pista del Profesor Célulo"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Pista
          </button>

          {/* Timer Display */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
            timeLimit !== 0 && timeLeft <= 5
              ? 'bg-rose-950/90 border-rose-600 text-rose-400 animate-pulse'
              : 'bg-zinc-950 border-zinc-800 text-cyan-300'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLimit === 0 ? '∞' : `${timeLeft}s`}</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden"
      >
        <h3 className="text-lg md:text-xl font-bold text-white leading-snug mb-5">
          {currentQuestion.question}
        </h3>

        {/* Hint Box if activated */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-2xl bg-amber-950/40 border border-amber-700/50 text-amber-300 text-xs flex items-start gap-2"
            >
              <Lightbulb className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <strong>Pista del Profesor:</strong> {currentQuestion.hint}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = currentQuestion.correctIndex === index;
            const isEliminated = eliminatedOptions.includes(index);

            let buttonStyle = 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-cyan-500/50 hover:bg-zinc-850';

            if (isSubmitted) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
              } else if (isSelected) {
                buttonStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
              } else {
                buttonStyle = 'bg-zinc-900/40 border-zinc-850 text-zinc-600 opacity-50';
              }
            } else if (isSelected) {
              buttonStyle = 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,229,255,0.25)]';
            }

            if (isEliminated) {
              return (
                <div key={index} className="p-3.5 rounded-2xl bg-zinc-900/30 border border-zinc-900 text-zinc-700 text-xs line-through cursor-not-allowed opacity-40">
                  {option} (Eliminada)
                </div>
              );
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                disabled={isSubmitted}
                className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl font-mono text-xs flex items-center justify-center font-bold ${
                    isSelected ? 'bg-cyan-400 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>

                {isSubmitted && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Submit or Next Action Button */}
        <div className="mt-6 flex items-center justify-end">
          {!isSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
                selectedOption !== null
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-102'
                  : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
              }`}
            >
              <span>Confirmar Respuesta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-amber-400 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Siguiente Pregunta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Motivational Error Modal popup when answer is wrong */}
      <MotivationalModal
        isOpen={showMotivationalModal}
        onClose={handleNextQuestion}
        correctAnswerText={currentQuestion.options[currentQuestion.correctIndex]}
        userAnswerText={selectedOption !== null ? currentQuestion.options[selectedOption] : 'Tiempo agotado'}
        explanation={currentQuestion.explanation}
        hint={currentQuestion.hint}
      />
    </div>
  );
};
