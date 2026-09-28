import React from 'react';
import { GameMode, DifficultyLevel } from '../types';
import { Volume2, VolumeX, Sparkles, Award, Dna, Swords, Activity, BookOpen, Flame, HelpCircle, Home, Tv } from 'lucide-react';
import { sounds } from '../utils/sound';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  difficulty: DifficultyLevel;
  onChangeDifficulty: (diff: DifficultyLevel) => void;
  score: number;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAchievements: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  difficulty,
  onChangeDifficulty,
  score,
  streak,
  soundEnabled,
  onToggleSound,
  onOpenAchievements
}) => {
  const modes: { id: GameMode; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'home', label: 'Inicio', icon: <Home className="w-4 h-4" />, color: 'from-cyan-400 to-emerald-400' },
    { id: 'classic', label: 'Trivia Clásica', icon: <HelpCircle className="w-4 h-4" />, color: 'from-cyan-500 to-blue-600' },
    { id: 'kahoot', label: 'Kahoot Live!', icon: <Tv className="w-4 h-4" />, color: 'from-purple-500 to-pink-500' },
    { id: 'hunter', label: 'Cazador Organelos', icon: <Dna className="w-4 h-4" />, color: 'from-emerald-400 to-teal-600' },
    { id: 'truefalse', label: 'V/F Flash', icon: <Sparkles className="w-4 h-4" />, color: 'from-amber-400 to-orange-600' },
    { id: 'survival', label: 'Mitosis Run', icon: <Activity className="w-4 h-4" />, color: 'from-rose-500 to-red-600' },
    { id: 'encyclopedia', label: 'Enciclopedia', icon: <BookOpen className="w-4 h-4" />, color: 'from-indigo-400 to-violet-600' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-black/95 backdrop-blur-xl border-b border-zinc-800/80 px-3 md:px-4 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Top Row: Logo, Difficulty, Sound & Stats on Mobile */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2">
          {/* Logo */}
          <div 
            onClick={() => { sounds.playClick(); onSelectMode('home'); }}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-emerald-400 to-pink-500 p-0.5 shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-lg md:text-xl">
                🦠
              </div>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-0.5">
                Célula<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-pink-400">Quiz</span>
              </h1>
              <span className="text-[9px] md:text-[10px] text-zinc-400 font-medium block -mt-1">Aprende Biología</span>
            </div>
          </div>

          {/* Controls & Difficulty Pill */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Difficulty Selector */}
            <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl">
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((d) => (
                <button
                  key={d}
                  onClick={() => { sounds.playClick(); onChangeDifficulty(d); }}
                  className={`text-[10px] md:text-[11px] font-extrabold min-h-[32px] px-2 py-0.5 rounded-lg transition-all capitalize cursor-pointer touch-manipulation ${
                    difficulty === d
                      ? d === 'easy'
                        ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                        : d === 'medium'
                        ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                        : 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {d === 'easy' ? 'Fácil' : d === 'medium' ? 'Medio' : 'Pro'}
                </button>
              ))}
            </div>

            {/* Score Pill on Mobile */}
            <div className="flex items-center gap-1 bg-cyan-950/70 border border-cyan-800/60 px-2.5 py-1.5 rounded-xl text-cyan-300 text-xs font-black shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{score}</span>
            </div>

            {/* Sound Toggle Button */}
            <button
              onClick={onToggleSound}
              className={`min-h-[36px] min-w-[36px] p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center touch-manipulation ${
                soundEnabled
                  ? 'bg-cyan-950/80 border-cyan-700 text-cyan-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Game Mode Navigation Tabs - Touch Panning & Scrollable Bar */}
        <nav className="w-full md:w-auto overflow-x-auto touch-pan-x scrollbar-none py-1 flex items-center gap-1.5 scroll-smooth active:cursor-grabbing">
          {modes.map((m) => {
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => { sounds.playClick(); onSelectMode(m.id); }}
                className={`min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer touch-manipulation shrink-0 ${
                  isActive
                    ? `bg-gradient-to-r ${m.color} text-black shadow-lg scale-102 font-black`
                    : 'bg-zinc-900/90 text-zinc-300 hover:bg-zinc-800 border border-zinc-800/80'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
