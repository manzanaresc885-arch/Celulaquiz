import React, { useState } from 'react';
import { GameMode, DifficultyLevel, GameSettings } from './types';
import { Navbar } from './components/Navbar';
import { MainMenu } from './components/MainMenu';
import { ClassicQuizMode } from './components/ClassicQuizMode';
import { KahootMode } from './components/KahootMode';
import { OrganelleHunterMode } from './components/OrganelleHunterMode';
import { TrueFalseMode } from './components/TrueFalseMode';
import { MultiplayerMode } from './components/MultiplayerMode';
import { SurvivalMode } from './components/SurvivalMode';
import { CellEncyclopedia } from './components/CellEncyclopedia';
import { AchievementsModal } from './components/AchievementsModal';
import { sounds } from './utils/sound';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('home');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    playerName: 'Científico',
    difficulty: 'easy',
    questionCount: 10,
    timeLimit: 20
  });
  const [kahootPin, setKahootPin] = useState<string | null>(null);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAchievements, setShowAchievements] = useState(false);

  const handleUpdateSettings = (newPartial: Partial<GameSettings>) => {
    setGameSettings(prev => ({ ...prev, ...newPartial }));
  };

  const handleAddScore = (points: number) => {
    setScore(prev => prev + points);
  };

  const handleUpdateStreak = (isCorrect: boolean) => {
    if (isCorrect) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playClick();
  };

  const handleJoinKahootPin = (pin: string) => {
    setKahootPin(pin);
    setCurrentMode('kahoot');
  };

  const handleStartKahootHost = () => {
    setKahootPin(null);
    setCurrentMode('kahoot');
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black flex flex-col font-sans relative overflow-x-hidden touch-auto">
      
      {/* Background bioluminescent ambient lights */}
      <div className="fixed top-0 left-1/4 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-cyan-600/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-pink-600/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        difficulty={gameSettings.difficulty}
        onChangeDifficulty={(diff) => handleUpdateSettings({ difficulty: diff })}
        score={score}
        streak={streak}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenAchievements={() => setShowAchievements(true)}
      />

      {/* Main Container with Motion Page Transitions */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 md:px-6 py-3 md:py-6 my-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMode}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full"
          >
            {currentMode === 'home' && (
              <MainMenu
                settings={gameSettings}
                onUpdateSettings={handleUpdateSettings}
                onSelectMode={setCurrentMode}
                onJoinKahootPin={handleJoinKahootPin}
                onStartKahootHost={handleStartKahootHost}
              />
            )}

            {currentMode === 'classic' && (
              <ClassicQuizMode
                difficulty={gameSettings.difficulty}
                questionCount={gameSettings.questionCount}
                timeLimit={gameSettings.timeLimit}
                onAddScore={handleAddScore}
                onUpdateStreak={handleUpdateStreak}
              />
            )}

            {currentMode === 'kahoot' && (
              <KahootMode
                initialPin={kahootPin}
                defaultPlayerName={gameSettings.playerName}
                defaultDifficulty={gameSettings.difficulty}
                defaultQuestionCount={gameSettings.questionCount}
                defaultTimeLimit={gameSettings.timeLimit}
                onAddScore={handleAddScore}
                onUpdateStreak={handleUpdateStreak}
                onGoHome={() => setCurrentMode('home')}
              />
            )}

            {currentMode === 'hunter' && (
              <OrganelleHunterMode
                onAddScore={handleAddScore}
                onUpdateStreak={handleUpdateStreak}
              />
            )}

            {currentMode === 'truefalse' && (
              <TrueFalseMode
                onAddScore={handleAddScore}
                onUpdateStreak={handleUpdateStreak}
              />
            )}

            {currentMode === 'multiplayer' && (
              <MultiplayerMode />
            )}

            {currentMode === 'survival' && (
              <SurvivalMode
                onAddScore={handleAddScore}
                onUpdateStreak={handleUpdateStreak}
              />
            )}

            {currentMode === 'encyclopedia' && (
              <CellEncyclopedia />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Eye-Catching Footer across all tabs */}
      <footer className="border-t-2 border-cyan-500/40 bg-gradient-to-r from-zinc-950 via-purple-950/80 to-zinc-950 py-5 px-4 md:px-6 text-center shadow-[0_-10px_30px_rgba(0,229,255,0.15)] relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Authors Notice in Italics */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping inline-block shrink-0" />
            <p className="italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-300 to-amber-300 font-extrabold text-sm md:text-base tracking-wide drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]">
              <i>autores Carlos y Deiber de célulaquiz</i>
            </p>
          </div>

          {/* Direct Link Button to Enter Game */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentMode('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 text-black font-black text-xs md:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 touch-manipulation min-h-[44px]"
            >
              <Heart className="w-4 h-4 fill-black shrink-0" />
              <span>⚡ Link Directo para Entrar</span>
            </button>
          </div>

        </div>
      </footer>

      {/* Achievements Modal */}
      {showAchievements && (
        <AchievementsModal
          onClose={() => setShowAchievements(false)}
        />
      )}

    </div>
  );
}
