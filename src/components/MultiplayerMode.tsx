import React, { useState } from 'react';
import { QUESTIONS } from '../data/cellData';
import { Question, PlayerState } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Sparkles, UserCheck, ShieldAlert, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

const CELL_AVATARS = [
  { name: 'Cito-Célula', icon: '🦠', color: '#00E5FF' },
  { name: 'Vegeta-Planta', icon: '🌱', color: '#00FF88' },
  { name: 'Bacterio-Boy', icon: '🧫', color: '#FF2A85' },
  { name: 'Mitocó-Fuerza', icon: '⚡', color: '#FFC800' }
];

export const MultiplayerMode: React.FC = () => {
  const [matchStarted, setMatchStarted] = useState(false);
  const [matchFinished, setMatchFinished] = useState(false);

  // Player configurations
  const [p1, setP1] = useState<PlayerState>({
    name: 'Jugador 1',
    avatar: '🦠',
    score: 0,
    streak: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    color: '#00E5FF'
  });

  const [p2, setP2] = useState<PlayerState>({
    name: 'Jugador 2',
    avatar: '🌱',
    score: 0,
    streak: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    color: '#00FF88'
  });

  // Turn state: 0 = Player 1's turn, 1 = Player 2's turn
  const [activePlayer, setActivePlayer] = useState<0 | 1>(0);
  const [currentRound, setCurrentRound] = useState(0);
  const totalRounds = 6;

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Questions pool
  const currentQuestion: Question = QUESTIONS[currentRound % QUESTIONS.length];

  const handleStartMatch = () => {
    sounds.playPowerup();
    setP1(prev => ({ ...prev, score: 0, correctAnswers: 0, totalAnswers: 0 }));
    setP2(prev => ({ ...prev, score: 0, correctAnswers: 0, totalAnswers: 0 }));
    setCurrentRound(0);
    setActivePlayer(0);
    setMatchStarted(true);
    setMatchFinished(false);
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const handleOptionClick = (optionIdx: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIdx);
    setIsAnswered(true);

    const isCorrect = optionIdx === currentQuestion.correctIndex;
    const isP1Turn = activePlayer === 0;

    if (isCorrect) {
      sounds.playCorrect();
      if (isP1Turn) {
        setP1(prev => ({
          ...prev,
          score: prev.score + 150,
          correctAnswers: prev.correctAnswers + 1,
          totalAnswers: prev.totalAnswers + 1
        }));
      } else {
        setP2(prev => ({
          ...prev,
          score: prev.score + 150,
          correctAnswers: prev.correctAnswers + 1,
          totalAnswers: prev.totalAnswers + 1
        }));
      }
    } else {
      sounds.playIncorrect();
      if (isP1Turn) {
        setP1(prev => ({ ...prev, totalAnswers: prev.totalAnswers + 1 }));
      } else {
        setP2(prev => ({ ...prev, totalAnswers: prev.totalAnswers + 1 }));
      }
    }
  };

  const handleNextTurn = () => {
    sounds.playClick();
    setIsAnswered(false);
    setSelectedOption(null);

    // If P1 just finished turn, switch to P2 on same question.
    // If P2 just finished turn, increment round!
    if (activePlayer === 0) {
      setActivePlayer(1);
    } else {
      if (currentRound + 1 >= totalRounds) {
        setMatchFinished(true);
        sounds.playFanfare();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } else {
        setActivePlayer(0);
        setCurrentRound(prev => prev + 1);
      }
    }
  };

  const currentPlayer = activePlayer === 0 ? p1 : p2;

  // Pre-game Setup Screen
  if (!matchStarted) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-zinc-950 border border-pink-500/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(244,63,94,0.2)] text-white">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 flex items-center justify-center text-3xl shadow-xl">
            ⚔️
          </div>
          <h2 className="text-2xl font-black">Batalla Multijugador 1v1</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Compite localmente en el mismo dispositivo respondiendo las preguntas de biología celular.
          </p>
        </div>

        {/* Player Name & Avatar Configurator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          {/* Player 1 Card */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-cyan-500/40 space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase block">Jugador 1</span>
            <input
              type="text"
              value={p1.name}
              onChange={(e) => setP1(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-cyan-400"
              placeholder="Nombre P1"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Avatar:</span>
              <div className="flex gap-1.5">
                {CELL_AVATARS.map((av) => (
                  <button
                    key={av.name}
                    onClick={() => setP1(prev => ({ ...prev, avatar: av.icon, color: av.color }))}
                    className={`p-1.5 rounded-xl text-lg border transition-all cursor-pointer ${
                      p1.avatar === av.icon ? 'bg-cyan-950 border-cyan-400 scale-110' : 'bg-zinc-950 border-zinc-800 opacity-60'
                    }`}
                  >
                    {av.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Player 2 Card */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-emerald-500/40 space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">Jugador 2</span>
            <input
              type="text"
              value={p2.name}
              onChange={(e) => setP2(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-emerald-400"
              placeholder="Nombre P2"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Avatar:</span>
              <div className="flex gap-1.5">
                {CELL_AVATARS.map((av) => (
                  <button
                    key={av.name}
                    onClick={() => setP2(prev => ({ ...prev, avatar: av.icon, color: av.color }))}
                    className={`p-1.5 rounded-xl text-lg border transition-all cursor-pointer ${
                      p2.avatar === av.icon ? 'bg-emerald-950 border-emerald-400 scale-110' : 'bg-zinc-950 border-zinc-800 opacity-60'
                    }`}
                  >
                    {av.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleStartMatch}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-black font-black text-base shadow-[0_0_25px_rgba(244,63,94,0.4)] hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Swords className="w-5 h-5" />
          <span>¡INICIAR DUELO CELULAR!</span>
        </button>
      </div>
    );
  }

  // Match Summary Winner Screen
  if (matchFinished) {
    const p1Won = p1.score > p2.score;
    const isTie = p1.score === p2.score;
    const winner = p1Won ? p1 : p2;

    return (
      <div className="w-full max-w-xl mx-auto my-6 p-6 bg-zinc-950 border border-pink-500/40 rounded-3xl text-center shadow-[0_0_50px_rgba(244,63,94,0.3)] text-white">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-400 to-pink-500 p-1 flex items-center justify-center text-4xl shadow-xl animate-bounce">
          🏆
        </div>

        <h2 className="text-2xl font-black">
          {isTie ? '¡Empate Legendario!' : `¡Ganó ${winner.name}!`}
        </h2>
        <p className="text-xs text-zinc-400 mt-1">Gran demostración de conocimiento celular</p>

        {/* Final Score Table */}
        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-cyan-500/40">
            <div className="text-3xl mb-1">{p1.avatar}</div>
            <h4 className="font-bold text-sm text-cyan-300">{p1.name}</h4>
            <span className="text-2xl font-black text-white block mt-2">{p1.score} PTS</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-emerald-500/40">
            <div className="text-3xl mb-1">{p2.avatar}</div>
            <h4 className="font-bold text-sm text-emerald-300">{p2.name}</h4>
            <span className="text-2xl font-black text-white block mt-2">{p2.score} PTS</span>
          </div>
        </div>

        <button
          onClick={handleStartMatch}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-cyan-400 text-black font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-102 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Revancha (Nuevo Duelo)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Scoreboard Bar */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-2xl border transition-all ${
          activePlayer === 0 ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.3)] scale-102' : 'bg-zinc-950 border-zinc-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{p1.avatar}</span>
              <div>
                <h4 className="font-bold text-xs text-white">{p1.name}</h4>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">JUGADOR 1</span>
              </div>
            </div>
            <span className="text-xl font-extrabold text-cyan-300">{p1.score} PTS</span>
          </div>
        </div>

        <div className={`p-3 rounded-2xl border transition-all ${
          activePlayer === 1 ? 'bg-emerald-950/80 border-emerald-400 shadow-[0_0_20px_rgba(0,255,136,0.3)] scale-102' : 'bg-zinc-950 border-zinc-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{p2.avatar}</span>
              <div>
                <h4 className="font-bold text-xs text-white">{p2.name}</h4>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">JUGADOR 2</span>
              </div>
            </div>
            <span className="text-xl font-extrabold text-emerald-300">{p2.score} PTS</span>
          </div>
        </div>
      </div>

      {/* Active Turn Header */}
      <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-2xl flex items-center justify-between text-xs">
        <span className="font-mono text-zinc-400">Ronda {currentRound + 1} de {totalRounds}</span>
        <div className="flex items-center gap-1.5 font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-xl">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Turno de: {currentPlayer.name} ({currentPlayer.avatar})</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-5">{currentQuestion.question}</h3>

        <div className="space-y-2.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = currentQuestion.correctIndex === idx;

            let style = 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-pink-500/50';

            if (isAnswered) {
              if (isCorrect) {
                style = 'bg-emerald-950 border-emerald-500 text-emerald-200';
              } else if (isSelected) {
                style = 'bg-rose-950 border-rose-500 text-rose-200';
              } else {
                style = 'bg-zinc-900/40 border-zinc-850 text-zinc-600 opacity-40';
              }
            } else if (isSelected) {
              style = 'bg-pink-950 border-pink-400 text-pink-200';
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${style}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNextTurn}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-amber-400 text-black font-extrabold text-sm shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{activePlayer === 0 ? `Pasar turno a ${p2.name}` : 'Siguiente Ronda'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
