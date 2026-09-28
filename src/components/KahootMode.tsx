import React, { useState, useEffect } from 'react';
import { QUESTIONS } from '../data/cellData';
import { Question, DifficultyLevel, KahootRoom, PlayerState } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tv, 
  Users, 
  Hash, 
  Copy, 
  Check, 
  Play, 
  Clock, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Plus, 
  Flame, 
  Crown,
  UserCheck,
  Zap,
  Sliders,
  CheckCircle2,
  XCircle,
  Home
} from 'lucide-react';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

interface KahootModeProps {
  initialPin?: string | null;
  onAddScore: (points: number) => void;
  onUpdateStreak: (isCorrect: boolean) => void;
  onGoHome: () => void;
  defaultPlayerName?: string;
  defaultDifficulty?: DifficultyLevel;
  defaultQuestionCount?: number;
  defaultTimeLimit?: number;
}

const AVATARS = ['🦠', '🧬', '🔬', '🧫', '🧪', '🌱', '🐸', '🐱', '🚀', '⭐'];
const COLORS = [
  'bg-red-500', 
  'bg-blue-500', 
  'bg-yellow-500', 
  'bg-emerald-500', 
  'bg-purple-500', 
  'bg-pink-500'
];

export const KahootMode: React.FC<KahootModeProps> = ({
  initialPin,
  onAddScore,
  onUpdateStreak,
  onGoHome,
  defaultPlayerName = 'Científico',
  defaultDifficulty = 'all',
  defaultQuestionCount = 10,
  defaultTimeLimit = 20
}) => {
  // Mode step: 'select_action' | 'create_room' | 'join_pin' | 'lobby' | 'playing' | 'leaderboard' | 'podium'
  const [step, setStep] = useState<'select_action' | 'create_room' | 'join_pin' | 'lobby' | 'playing' | 'leaderboard' | 'podium'>(
    initialPin ? 'join_pin' : 'select_action'
  );

  // Room config
  const [roomName, setRoomName] = useState('Desafío Celular Kahoot');
  const [hostName, setHostName] = useState(defaultPlayerName);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(defaultDifficulty);
  const [questionCount, setQuestionCount] = useState<number>(defaultQuestionCount);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(defaultTimeLimit === 0 ? 20 : defaultTimeLimit);
  const [pinCode, setPinCode] = useState<string>('');

  // Join PIN state
  const [enteredPin, setEnteredPin] = useState(initialPin || '');
  const [joinedPlayerName, setJoinedPlayerName] = useState(defaultPlayerName);
  const [selectedAvatar, setSelectedAvatar] = useState('🧬');
  const [pinError, setPinError] = useState('');

  // Room state
  const [room, setRoom] = useState<KahootRoom | null>(null);
  const [isHost, setIsHost] = useState(true);
  const [myPlayerId, setMyPlayerId] = useState<string>('');

  // Gameplay state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(false);
  const [myAnswer, setMyAnswer] = useState<number | null>(null);
  const [showQuestionResult, setShowQuestionResult] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  // Generate random 4-digit pin code
  const generatePin = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setPinCode(code);
    return code;
  };

  // BroadcastChannel for cross-tab multiplayer simulation
  useEffect(() => {
    if (!room?.pin) return;
    const bc = new BroadcastChannel(`kahoot_room_${room.pin}`);

    bc.onmessage = (event) => {
      const data = event.data;
      if (data.type === 'PLAYER_JOINED') {
        setRoom(prev => {
          if (!prev) return null;
          if (prev.players.some(p => p.id === data.player.id)) return prev;
          return { ...prev, players: [...prev.players, data.player] };
        });
      } else if (data.type === 'PLAYER_ANSWERED') {
        setRoom(prev => {
          if (!prev) return null;
          const updated = prev.players.map(p => 
            p.id === data.playerId 
              ? { ...p, lastAnswerIdx: data.answerIdx, lastAnswerTime: data.answerTime } 
              : p
          );
          return { ...prev, players: updated };
        });
      } else if (data.type === 'GAME_STARTED') {
        setStep('playing');
        setCurrentQIndex(0);
        setTimeLeft(room.timePerQuestion);
        setTimerActive(true);
      }
    };

    return () => bc.close();
  }, [room?.pin]);

  // Create Room Action
  const handleCreateRoom = () => {
    const pin = generatePin();
    sounds.playClick();

    const hostPlayer: PlayerState = {
      id: 'host_' + Date.now(),
      name: `${hostName} (Host)`,
      avatar: '👑',
      score: 0,
      streak: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      color: 'bg-purple-500'
    };

    // Filter questions based on settings
    let qList = QUESTIONS;
    if (difficulty !== 'all') {
      qList = QUESTIONS.filter(q => q.difficulty === difficulty);
    }
    // Shuffle and slice to selected question count
    const shuffledQuestions = [...qList].sort(() => 0.5 - Math.random()).slice(0, questionCount);

    const newRoom: KahootRoom = {
      pin,
      roomName,
      hostName,
      difficulty,
      questionCount: shuffledQuestions.length,
      timePerQuestion,
      status: 'lobby',
      players: [
        hostPlayer,
        { id: 'bot_1', name: 'Ana (Científica)', avatar: '🔬', score: 0, streak: 0, correctAnswers: 0, totalAnswers: 0, color: 'bg-cyan-500' },
        { id: 'bot_2', name: 'Carlos (Biólogo)', avatar: '🧪', score: 0, streak: 0, correctAnswers: 0, totalAnswers: 0, color: 'bg-amber-500' }
      ],
      currentQuestionIndex: 0,
      questions: shuffledQuestions
    };

    setRoom(newRoom);
    setIsHost(true);
    setMyPlayerId(hostPlayer.id);
    setStep('lobby');
  };

  // Join Room via PIN Action
  const handleJoinByPin = () => {
    if (enteredPin.length !== 4 || isNaN(Number(enteredPin))) {
      setPinError('Ingresa un código de 4 dígitos válido');
      sounds.playIncorrect();
      return;
    }

    sounds.playClick();
    setPinError('');

    const newPlayer: PlayerState = {
      id: 'player_' + Date.now(),
      name: joinedPlayerName || 'Participante',
      avatar: selectedAvatar,
      score: 0,
      streak: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };

    let qList = QUESTIONS.slice(0, questionCount);

    const joinedRoom: KahootRoom = {
      pin: enteredPin,
      roomName: `Sala #${enteredPin}`,
      hostName: 'Anfitrión',
      difficulty,
      questionCount: qList.length,
      timePerQuestion,
      status: 'lobby',
      players: [
        { id: 'host_default', name: 'Anfitrión (Host)', avatar: '👑', score: 0, streak: 0, correctAnswers: 0, totalAnswers: 0, color: 'bg-purple-500' },
        newPlayer,
        { id: 'bot_1', name: 'Sofía', avatar: '🐸', score: 0, streak: 0, correctAnswers: 0, totalAnswers: 0, color: 'bg-emerald-500' }
      ],
      currentQuestionIndex: 0,
      questions: qList
    };

    setRoom(joinedRoom);
    setIsHost(false);
    setMyPlayerId(newPlayer.id);

    // Notify other tabs
    try {
      const bc = new BroadcastChannel(`kahoot_room_${enteredPin}`);
      bc.postMessage({ type: 'PLAYER_JOINED', player: newPlayer });
    } catch (e) {
      console.log('Broadcast error', e);
    }

    setStep('lobby');
  };

  // Add Bot Player to lobby
  const handleAddBotPlayer = () => {
    if (!room) return;
    sounds.playPowerup();
    const botNames = ['Mateo', 'Lucía', 'Gael', 'Elena', 'Valentina', 'Diego'];
    const botAvatars = ['🐱', '🌱', '⭐', '🚀', '🧫'];
    const randomName = botNames[Math.floor(Math.random() * botNames.length)];
    const randomAvatar = botAvatars[Math.floor(Math.random() * botAvatars.length)];

    const botPlayer: PlayerState = {
      id: 'bot_' + Date.now(),
      name: `${randomName} (Bot)`,
      avatar: randomAvatar,
      score: 0,
      streak: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };

    setRoom(prev => prev ? { ...prev, players: [...prev.players, botPlayer] } : null);
  };

  // Copy PIN code to clipboard
  const handleCopyPin = () => {
    if (!room?.pin) return;
    navigator.clipboard.writeText(room.pin);
    setCopiedPin(true);
    sounds.playClick();
    setTimeout(() => setCopiedPin(false), 2000);
  };

  // Start Kahoot Game
  const handleStartGame = () => {
    if (!room) return;
    sounds.playFanfare();

    try {
      const bc = new BroadcastChannel(`kahoot_room_${room.pin}`);
      bc.postMessage({ type: 'GAME_STARTED' });
    } catch (e) {
      console.log('Broadcast error', e);
    }

    setStep('playing');
    setCurrentQIndex(0);
    setMyAnswer(null);
    setShowQuestionResult(false);
    setTimeLeft(room.timePerQuestion);
    setTimerActive(true);
  };

  // Timer logic during gameplay
  useEffect(() => {
    if (step !== 'playing' || !timerActive) return;

    if (timeLeft <= 0) {
      handleTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timerActive, timeLeft]);

  // When time expires or all players answered
  const handleTimeExpired = () => {
    setTimerActive(false);
    setShowQuestionResult(true);

    if (!room) return;
    const currentQ = room.questions[currentQIndex];
    if (!currentQ) return;

    // Calculate score updates for all players (simulating bot answers too)
    const updatedPlayers = room.players.map(p => {
      let ansIdx = p.id === myPlayerId ? myAnswer : p.lastAnswerIdx;
      // If bot hadn't answered yet, assign a semi-random answer
      if (ansIdx === undefined || ansIdx === null) {
        ansIdx = Math.random() > 0.3 ? currentQ.correctIndex : Math.floor(Math.random() * 4);
      }

      const isCorrect = ansIdx === currentQ.correctIndex;
      const speedBonus = Math.max(200, Math.round((timeLeft / room.timePerQuestion) * 500));
      const points = isCorrect ? (500 + speedBonus) : 0;

      if (p.id === myPlayerId) {
        if (isCorrect) {
          sounds.playCorrect();
          onAddScore(points);
          onUpdateStreak(true);
        } else {
          sounds.playIncorrect();
          onUpdateStreak(false);
        }
      }

      return {
        ...p,
        score: p.score + points,
        streak: isCorrect ? p.streak + 1 : 0,
        correctAnswers: isCorrect ? p.correctAnswers + 1 : p.correctAnswers,
        totalAnswers: p.totalAnswers + 1,
        lastAnswerIdx: ansIdx
      };
    });

    setRoom({ ...room, players: updatedPlayers });
  };

  // Player selects an option
  const handleAnswerOption = (optionIndex: number) => {
    if (myAnswer !== null || !timerActive || showQuestionResult) return;
    sounds.playClick();
    setMyAnswer(optionIndex);

    // Notify broadcast channel
    if (room?.pin) {
      try {
        const bc = new BroadcastChannel(`kahoot_room_${room.pin}`);
        bc.postMessage({ 
          type: 'PLAYER_ANSWERED', 
          playerId: myPlayerId, 
          answerIdx: optionIndex, 
          answerTime: timeLeft 
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  // Go to Leaderboard Screen after question result
  const handleShowLeaderboard = () => {
    sounds.playClick();
    setStep('leaderboard');
  };

  // Next Question or Podium
  const handleNextQuestion = () => {
    if (!room) return;
    sounds.playClick();

    if (currentQIndex + 1 < room.questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setMyAnswer(null);
      setShowQuestionResult(false);
      setTimeLeft(room.timePerQuestion);
      setTimerActive(true);
      setStep('playing');
    } else {
      setStep('podium');
      sounds.playFanfare();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  };

  // Render Kahoot Option Button Helper
  const kahootStyles = [
    { bg: 'bg-red-600 hover:bg-red-500 border-red-500 text-white', shape: '▲', label: 'Rojo' },
    { bg: 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white', shape: '◆', label: 'Azul' },
    { bg: 'bg-amber-500 hover:bg-amber-400 border-amber-400 text-black', shape: '●', label: 'Amarillo' },
    { bg: 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white', shape: '■', label: 'Verde' }
  ];

  // 1. SELECT ACTION SCREEN
  if (step === 'select_action') {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 py-4">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950 border border-purple-500/50 text-purple-300 font-bold text-xs uppercase tracking-widest">
            <Tv className="w-4 h-4 text-purple-400" />
            Modo Kahoot Live!
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">¿Cómo quieres jugar Kahoot?</h2>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto">
            Ingresa a una sala con un código de 4 dígitos o sé el anfitrión para desafiar a otros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Join with 4 Digit PIN Card */}
          <div
            onClick={() => { sounds.playClick(); setStep('join_pin'); }}
            className="p-8 rounded-3xl bg-gradient-to-br from-purple-950/80 via-zinc-950 to-purple-900/50 border-2 border-purple-500/50 hover:border-purple-400 transition-all cursor-pointer hover:scale-102 shadow-[0_0_30px_rgba(168,85,247,0.2)] text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500 text-white flex items-center justify-center text-2xl font-mono font-black shadow-lg">
              #4D
            </div>
            <h3 className="text-xl font-black text-white">Unirse con Código PIN</h3>
            <p className="text-xs text-zinc-300">
              Ingresa los 4 dígitos generados por tu profesor, anfitrión o amigo para competir en directo.
            </p>
            <button className="w-full py-3 rounded-2xl bg-purple-500 text-white font-extrabold text-sm shadow-md">
              Ingresar PIN de 4 Dígitos
            </button>
          </div>

          {/* Host / Create Room Card */}
          <div
            onClick={() => { sounds.playClick(); setStep('create_room'); }}
            className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-zinc-950 to-pink-950/50 border-2 border-pink-500/50 hover:border-pink-400 transition-all cursor-pointer hover:scale-102 shadow-[0_0_30px_rgba(244,63,94,0.2)] text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-400 text-black flex items-center justify-center text-2xl font-black shadow-lg">
              👑
            </div>
            <h3 className="text-xl font-black text-white">Crear Sala (Anfitrión)</h3>
            <p className="text-xs text-zinc-300">
              Genera tu propio PIN de 4 dígitos, personaliza la dificultad, tiempo y cantidad de preguntas.
            </p>
            <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-amber-400 text-black font-extrabold text-sm shadow-md">
              Crear Sala & Generar PIN
            </button>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onGoHome}
            className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Volver al Menú Principal</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. CREATE ROOM SCREEN
  if (step === 'create_room') {
    return (
      <div className="w-full max-w-2xl mx-auto bg-zinc-950 border border-purple-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              Configurar Sala Kahoot Live
            </h2>
            <p className="text-xs text-zinc-400">Personaliza el juego y obtén tu código PIN de 4 dígitos</p>
          </div>
          <button
            onClick={() => setStep('select_action')}
            className="text-xs text-zinc-500 hover:text-white"
          >
            Atrás
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">Nombre de la Sala</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-medium text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">Tu Nombre de Anfitrión</label>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-medium text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase block mb-1">Dificultad</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-bold cursor-pointer"
              >
                <option value="easy">Fácil</option>
                <option value="medium">Medio</option>
                <option value="hard">Difícil (Experto)</option>
                <option value="all">Todas / Mixto</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase block mb-1">Preguntas</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-bold cursor-pointer"
              >
                <option value={5}>5 preguntas</option>
                <option value={10}>10 preguntas</option>
                <option value={15}>15 preguntas</option>
                <option value={20}>20 preguntas</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase block mb-1">Tiempo p/ Pregunta</label>
              <select
                value={timePerQuestion}
                onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-bold cursor-pointer"
              >
                <option value={10}>10 segundos</option>
                <option value={15}>15 segundos</option>
                <option value={20}>20 segundos</option>
                <option value={30}>30 segundos</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreateRoom}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-black font-black text-base shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Tv className="w-5 h-5 text-black" />
          <span>Generar PIN 4 Dígitos & Abrir Sala</span>
        </button>
      </div>
    );
  }

  // 3. JOIN BY PIN SCREEN
  if (step === 'join_pin') {
    return (
      <div className="w-full max-w-md mx-auto bg-zinc-950 border border-purple-500/50 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center">
        <div className="space-y-1">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Kahoot Live</span>
          <h2 className="text-2xl font-black text-white">Unirse con Código PIN</h2>
        </div>

        <div className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">Código PIN de 4 dígitos</label>
            <div className="relative">
              <Hash className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                maxLength={4}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ''))}
                placeholder="4829"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-zinc-900 border-2 border-purple-500/60 text-white font-mono font-black tracking-widest text-xl text-center focus:outline-none focus:border-purple-400 uppercase"
              />
            </div>
            {pinError && <p className="text-xs text-rose-400 mt-1 font-bold">{pinError}</p>}
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">Tu Nombre de Jugador</label>
            <input
              type="text"
              value={joinedPlayerName}
              onChange={(e) => setJoinedPlayerName(e.target.value)}
              placeholder="Ej: Sofía"
              className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-medium text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">Elige tu Avatar</label>
            <div className="flex flex-wrap gap-2 justify-center py-1">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition-all cursor-pointer ${
                    selectedAvatar === av
                      ? 'bg-purple-600 border-purple-400 scale-110 shadow-lg'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleJoinByPin}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-sm shadow-lg hover:scale-102 transition-all cursor-pointer"
        >
          ¡Entrar a la Sala Kahoot!
        </button>

        <button
          onClick={() => setStep('select_action')}
          className="text-xs text-zinc-500 hover:text-white"
        >
          Volver
        </button>
      </div>
    );
  }

  // 4. LOBBY SCREEN (PIN Code Banner + Joined Players)
  if (step === 'lobby' && room) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        
        {/* HUGE PIN CODE BANNER */}
        <div className="bg-gradient-to-r from-purple-900 via-purple-950 to-pink-950 border-2 border-purple-400 rounded-3xl p-6 text-center space-y-3 shadow-[0_0_50px_rgba(168,85,247,0.3)] relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-400/50 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Tv className="w-3.5 h-3.5" />
            {room.roomName}
          </div>

          <p className="text-xs text-zinc-300 font-bold uppercase tracking-widest">
            ¡Únete en vivo ingresando este código de 4 dígitos!
          </p>

          <div className="flex items-center justify-center gap-3 py-2">
            <span className="text-5xl md:text-6xl font-black font-mono tracking-widest text-amber-300 bg-black/60 px-6 py-2 rounded-2xl border-2 border-amber-400 shadow-inner select-all">
              {room.pin}
            </span>
            <button
              onClick={handleCopyPin}
              className="p-3 rounded-2xl bg-purple-800/80 border border-purple-400 text-white hover:scale-105 transition-all cursor-pointer"
              title="Copiar Código PIN"
            >
              {copiedPin ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6" />}
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-purple-200">
            <span>Dificultad: <strong className="text-white uppercase">{room.difficulty}</strong></span>
            <span>•</span>
            <span>Preguntas: <strong className="text-white">{room.questionCount}</strong></span>
            <span>•</span>
            <span>Tiempo: <strong className="text-white">{room.timePerQuestion}s</strong></span>
          </div>
        </div>

        {/* Players List Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-black text-white">
                Participantes en la Sala ({room.players.length})
              </h3>
            </div>

            {isHost && (
              <button
                onClick={handleAddBotPlayer}
                className="px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-700 text-purple-300 text-xs font-bold hover:scale-105 transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Agregar Bot</span>
              </button>
            )}
          </div>

          {/* Player badges grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {room.players.map((p) => (
              <motion.div
                key={p.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-3 rounded-2xl border ${p.color}/20 border-zinc-800 bg-zinc-900 flex items-center gap-2.5 shadow-md`}
              >
                <span className="text-2xl">{p.avatar}</span>
                <div className="truncate">
                  <span className="text-xs font-bold text-white block truncate">{p.name}</span>
                  <span className="text-[10px] text-zinc-500 block">Listo</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Start Game Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800">
            <button
              onClick={onGoHome}
              className="text-xs text-zinc-500 hover:text-white"
            >
              Cancelar / Salir
            </button>

            {isHost ? (
              <button
                onClick={handleStartGame}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 text-black font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>¡Iniciar Partida Kahoot!</span>
              </button>
            ) : (
              <div className="text-xs text-amber-400 font-bold animate-pulse">
                Esperando que el anfitrión inicie la partida...
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }

  // 5. PLAYING SCREEN (Kahoot Colors & Symbols)
  if (step === 'playing' && room) {
    const currentQ: Question | undefined = room.questions[currentQIndex];
    if (!currentQ) return null;

    return (
      <div className="w-full max-w-3xl mx-auto space-y-4">
        
        {/* Kahoot Live Header */}
        <div className="flex items-center justify-between bg-zinc-950 border border-purple-500/40 p-3.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-900 text-purple-200 text-xs font-mono font-bold">
              PIN {room.pin}
            </span>
            <span className="text-xs font-extrabold text-white">
              Pregunta {currentQIndex + 1} de {room.questions.length}
            </span>
          </div>

          {/* Countdown Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-black border ${
            timeLeft <= 5 ? 'bg-rose-950 border-rose-500 text-rose-400 animate-bounce' : 'bg-zinc-900 border-zinc-800 text-amber-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Question Text Card */}
        <div className="bg-zinc-950 border-2 border-zinc-800 rounded-3xl p-6 text-center space-y-3 shadow-2xl relative overflow-hidden">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 inline-block">
            {currentQ.category}
          </span>
          <h3 className="text-xl md:text-2xl font-black text-white leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* 4 Kahoot Answer Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((option, idx) => {
            const style = kahootStyles[idx];
            const isSelected = myAnswer === idx;
            const isCorrect = currentQ.correctIndex === idx;

            let cardStateStyle = `${style.bg} border-2 opacity-100 hover:scale-[1.02]`;

            if (showQuestionResult) {
              if (isCorrect) {
                cardStateStyle = 'bg-emerald-500 border-emerald-300 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-102';
              } else if (isSelected) {
                cardStateStyle = 'bg-rose-950 border-rose-500 text-rose-200 opacity-60';
              } else {
                cardStateStyle = 'bg-zinc-900/40 border-zinc-800 text-zinc-600 opacity-30';
              }
            } else if (myAnswer !== null && !isSelected) {
              cardStateStyle += ' opacity-50 cursor-not-allowed';
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswerOption(idx)}
                disabled={myAnswer !== null || showQuestionResult}
                className={`p-5 rounded-2xl font-bold transition-all flex items-center justify-between text-left cursor-pointer ${cardStateStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-mono font-black">{style.shape}</span>
                  <span className="text-sm font-extrabold">{option}</span>
                </div>

                {showQuestionResult && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-6 h-6 text-white" />}
                    {isSelected && !isCorrect && <XCircle className="w-6 h-6 text-rose-300" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button after question submission/expiry */}
        {showQuestionResult && (
          <div className="pt-2 text-center">
            <button
              onClick={handleShowLeaderboard}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-black font-black text-sm shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Ver Tabla de Posiciones</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    );
  }

  // 6. LEADERBOARD SCREEN
  if (step === 'leaderboard' && room) {
    const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

    return (
      <div className="w-full max-w-2xl mx-auto bg-zinc-950 border border-purple-500/50 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1">
            <Trophy className="w-4 h-4" />
            Clasificación Kahoot Live
          </span>
          <h2 className="text-2xl font-black text-white">Tabla de Posiciones</h2>
        </div>

        <div className="space-y-2.5">
          {sortedPlayers.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                idx === 0
                  ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                  : idx === 1
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
                  : 'bg-zinc-950 border-zinc-850 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black font-mono ${
                  idx === 0 ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  #{idx + 1}
                </span>
                <span className="text-2xl">{p.avatar}</span>
                <div>
                  <span className="text-sm font-bold text-white block">{p.name}</span>
                  {p.streak > 1 && (
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-400" />
                      ¡Racha de {p.streak}!
                    </span>
                  )}
                </div>
              </div>

              <span className="text-lg font-black font-mono text-cyan-400">
                {p.score} PTS
              </span>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={handleNextQuestion}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-sm shadow-lg hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>
              {currentQIndex + 1 < room.questions.length ? 'Siguiente Pregunta' : 'Ver Podio Final'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 7. PODIUM SCREEN
  if (step === 'podium' && room) {
    const sorted = [...room.players].sort((a, b) => b.score - a.score);
    const first = sorted[0];
    const second = sorted[1];
    const third = sorted[2];

    return (
      <div className="w-full max-w-2xl mx-auto text-center space-y-6 py-4">
        <div className="space-y-1">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-pink-500 p-1 flex items-center justify-center text-3xl shadow-xl animate-bounce">
            🏆
          </div>
          <h2 className="text-3xl font-black text-white">¡Podio Kahoot Final!</h2>
          <p className="text-xs text-zinc-400">Excelente competencia de Biología Celular</p>
        </div>

        {/* 3D Animated Podium Steps */}
        <div className="flex items-end justify-center gap-3 pt-6 pb-2 min-h-[220px]">
          
          {/* 2nd Place */}
          {second && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 max-w-[120px] flex flex-col items-center"
            >
              <span className="text-3xl mb-1">{second.avatar}</span>
              <span className="text-xs font-bold text-zinc-300 truncate w-full">{second.name}</span>
              <span className="text-[10px] text-cyan-400 font-mono font-bold mb-1">{second.score} pts</span>
              <div className="w-full h-24 bg-gradient-to-b from-slate-400 to-slate-600 rounded-t-2xl flex items-center justify-center text-xl font-black text-slate-900 shadow-xl border-t-2 border-slate-300">
                🥈 2
              </div>
            </motion.div>
          )}

          {/* 1st Place */}
          {first && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex-1 max-w-[140px] flex flex-col items-center"
            >
              <span className="text-4xl mb-1 animate-pulse">{first.avatar}</span>
              <span className="text-sm font-black text-amber-300 truncate w-full">{first.name}</span>
              <span className="text-xs text-amber-400 font-mono font-black mb-1">{first.score} pts</span>
              <div className="w-full h-32 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 rounded-t-2xl flex items-center justify-center text-2xl font-black text-amber-950 shadow-2xl border-t-2 border-amber-200">
                🥇 1
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {third && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex-1 max-w-[120px] flex flex-col items-center"
            >
              <span className="text-3xl mb-1">{third.avatar}</span>
              <span className="text-xs font-bold text-amber-700 truncate w-full">{third.name}</span>
              <span className="text-[10px] text-cyan-400 font-mono font-bold mb-1">{third.score} pts</span>
              <div className="w-full h-18 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t-2xl flex items-center justify-center text-xl font-black text-amber-200 shadow-xl border-t-2 border-amber-600">
                🥉 3
              </div>
            </motion.div>
          )}

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setStep('create_room')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-extrabold text-sm shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jugar Otra Sala Kahoot</span>
          </button>

          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-sm hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Volver al Menú Principal</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
