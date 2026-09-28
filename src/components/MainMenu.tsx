import React, { useState } from 'react';
import { GameMode, GameSettings, DifficultyLevel } from '../types';
import { motion } from 'framer-motion';
import { 
  Play, 
  Gamepad2, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  Users, 
  Dna, 
  Activity, 
  BookOpen, 
  User, 
  Hash, 
  Tv, 
  Sliders, 
  ArrowRight,
  Flame,
  Zap,
  Check
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface MainMenuProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onSelectMode: (mode: GameMode) => void;
  onJoinKahootPin: (pin: string) => void;
  onStartKahootHost: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  settings,
  onUpdateSettings,
  onSelectMode,
  onJoinKahootPin,
  onStartKahootHost
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const handleJoinPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim().length !== 4 || isNaN(Number(pinInput))) {
      setPinError('Ingresa un código de 4 dígitos válido (ej: 4829)');
      sounds.playIncorrect();
      return;
    }
    setPinError('');
    sounds.playClick();
    onJoinKahootPin(pinInput.trim());
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-2">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-cyan-950/60 to-emerald-950/40 border border-cyan-500/30 p-6 md:p-8 shadow-[0_0_50px_rgba(0,229,255,0.15)]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700/50 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Menú Principal & Configuración
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Aprende Biología Celular Jugando
            </h1>
            <p className="text-zinc-300 text-sm max-w-xl">
              Personaliza tus partidas, pon a prueba tus conocimientos o compite en tiempo real en modo 
              <strong className="text-purple-400"> Kahoot</strong> con un código de 4 dígitos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                sounds.playClick();
                onSelectMode('classic');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-extrabold text-sm shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Jugar Trivia Ahora</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Customizer Card */}
      <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-zinc-800">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Ajustes de Partida Personalizada</h2>
            <p className="text-xs text-zinc-400">Configura tu nombre, dificultad, número de preguntas y tiempo por pregunta</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Nombre / Nickname */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              Nombre del Jugador / Apodo
            </label>
            <input
              type="text"
              value={settings.playerName}
              onChange={(e) => onUpdateSettings({ playerName: e.target.value })}
              placeholder="Ej: ProfeBiología / Biólogo123"
              className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-medium focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
            />
          </div>

          {/* Dificultad */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Nivel de Dificultad
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'easy', label: 'Fácil', color: 'emerald' },
                { id: 'medium', label: 'Medio', color: 'amber' },
                { id: 'hard', label: 'Difícil', color: 'rose' },
                { id: 'all', label: 'Mixto', color: 'purple' }
              ].map((diff) => {
                const isSelected = settings.difficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onUpdateSettings({ difficulty: diff.id as DifficultyLevel });
                    }}
                    className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      isSelected
                        ? diff.id === 'easy'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : diff.id === 'medium'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                          : diff.id === 'hard'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                          : 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {diff.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cantidad de Preguntas */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              Cantidad de Preguntas
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((count) => {
                const isSelected = settings.questionCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onUpdateSettings({ questionCount: count });
                    }}
                    className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {count} Preguntas
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tiempo por Pregunta */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-pink-400" />
              Tiempo por Pregunta
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { time: 10, label: '10s' },
                { time: 15, label: '15s' },
                { time: 20, label: '20s' },
                { time: 30, label: '30s' },
                { time: 0, label: 'Sin límite' }
              ].map((item) => {
                const isSelected = settings.timeLimit === item.time;
                return (
                  <button
                    key={item.time}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onUpdateSettings({ timeLimit: item.time });
                    }}
                    className={`py-2.5 px-1 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Special KAHOOT Section */}
      <div className="bg-gradient-to-br from-purple-950/80 via-zinc-950 to-indigo-950/80 border-2 border-purple-500/50 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(168,85,247,0.25)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Tv className="w-48 h-48 text-purple-400" />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Kahoot Left: Join with 4-Digit PIN */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 font-black text-xs uppercase tracking-wider">
                🎮 Modo Kahoot Live!
              </span>
            </div>
            <h3 className="text-2xl font-black text-white">¿Tienes un código de 4 dígitos?</h3>
            <p className="text-xs text-zinc-300">
              Ingresa el PIN de la sala para unirte a la competencia de preguntas en vivo con otros participantes.
            </p>

            <form onSubmit={handleJoinPinSubmit} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Hash className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type="text"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="PIN 4 DÍGITOS (Ej: 4829)"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-zinc-900/90 border-2 border-purple-500/60 text-white font-mono font-black tracking-widest text-lg placeholder:text-zinc-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Entrar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {pinError && <p className="text-xs text-rose-400 font-bold">{pinError}</p>}
            </form>
          </div>

          {/* Kahoot Right: Host / Create Kahoot Room */}
          <div className="border-t md:border-t-0 md:border-l border-purple-800/40 pt-6 md:pt-0 md:pl-8 space-y-4">
            <h4 className="text-xl font-black text-purple-200 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              ¿Quieres ser el Anfitrión?
            </h4>
            <p className="text-xs text-zinc-300">
              Crea tu propia sala Kahoot con tus preguntas configuradas. Obtén un código PIN de 4 dígitos para compartir con tus amigos o estudiantes.
            </p>

            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/50 space-y-2 text-xs text-purple-200">
              <div className="flex items-center justify-between">
                <span>Dificultad seleccionada:</span>
                <span className="font-bold text-amber-300 uppercase">{settings.difficulty}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Preguntas:</span>
                <span className="font-bold text-emerald-300">{settings.questionCount} preguntas</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tiempo por pregunta:</span>
                <span className="font-bold text-pink-300">{settings.timeLimit === 0 ? 'Sin límite' : `${settings.timeLimit}s`}</span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onStartKahootHost();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-black font-black text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Tv className="w-5 h-5 text-black" />
              <span>Crear Sala Kahoot (Generar PIN 4 Dígitos)</span>
            </button>
          </div>

        </div>
      </div>

      {/* Grid of All Game Modes */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-cyan-400" />
          Todos los Modos de Juego
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Classic Quiz */}
          <div
            onClick={() => { sounds.playClick(); onSelectMode('classic'); }}
            className="group p-5 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 transition-all cursor-pointer hover:scale-[1.02] shadow-xl relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">Trivia Clásica</h4>
            <p className="text-xs text-zinc-400 mt-1">Preguntas múltiples con temporizador, comodines 50:50 y pistas del Profesor Célulo.</p>
          </div>

          {/* Kahoot Live */}
          <div
            onClick={() => { sounds.playClick(); onSelectMode('kahoot'); }}
            className="group p-5 rounded-3xl bg-purple-950/40 border border-purple-500/40 hover:border-purple-400 transition-all cursor-pointer hover:scale-[1.02] shadow-xl relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform">
              <Tv className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">Modo Kahoot Live!</h4>
            <p className="text-xs text-zinc-300 mt-1">Símbolos y colores estilo Kahoot con código PIN de 4 dígitos y podio final.</p>
          </div>

          {/* Cazador de Organelos */}
          <div
            onClick={() => { sounds.playClick(); onSelectMode('hunter'); }}
            className="group p-5 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer hover:scale-[1.02] shadow-xl relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-600 flex items-center justify-center text-black mb-3 shadow-lg group-hover:scale-110 transition-transform">
              <Dna className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">Cazador de Organelos</h4>
            <p className="text-xs text-zinc-400 mt-1">Interactúa con el esquema celular bioluminiscente e identifica cada organelo.</p>
          </div>

          {/* V/F Flash */}
          <div
            onClick={() => { sounds.playClick(); onSelectMode('truefalse'); }}
            className="group p-5 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition-all cursor-pointer hover:scale-[1.02] shadow-xl relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-600 flex items-center justify-center text-black mb-3 shadow-lg group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">Verdadero o Falso</h4>
            <p className="text-xs text-zinc-400 mt-1">Desafío de velocidad ultra rápida sobre conceptos y mitos biológicos.</p>
          </div>

          {/* Supervivencia / Mitosis Run */}
          <div
            onClick={() => { sounds.playClick(); onSelectMode('survival'); }}
            className="group p-5 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-rose-500/50 transition-all cursor-pointer hover:scale-[1.02] shadow-xl relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">Mitosis Run (Supervivencia)</h4>
            <p className="text-xs text-zinc-400 mt-1">Responde sin equivocarte. Tienes 3 vidas antes de la apoptosis celular.</p>
          </div>

          {/* Enciclopedia Celular */}
          <div
            onClick={() => { sounds.playClick(); onSelectMode('encyclopedia'); }}
            className="group p-5 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 transition-all cursor-pointer hover:scale-[1.02] shadow-xl relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-400 to-violet-600 flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">Enciclopedia Celular</h4>
            <p className="text-xs text-zinc-400 mt-1">Explora analogías divertidas y la anatomía de células animales, vegetales y procariotas.</p>
          </div>

        </div>
      </div>

    </div>
  );
};
