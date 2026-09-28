export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'all';

export type GameMode = 'home' | 'classic' | 'hunter' | 'truefalse' | 'multiplayer' | 'survival' | 'encyclopedia' | 'kahoot';

export interface GameSettings {
  playerName: string;
  difficulty: DifficultyLevel;
  questionCount: number; // 5, 10, 15, or 20
  timeLimit: number; // in seconds, 0 = unlimited
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: DifficultyLevel;
  organelleId?: string;
  category: 'organelles' | 'organelos' | 'functions' | 'transport' | 'genetics' | 'comparison';
  hint: string;
}

export interface OrganelleInfo {
  id: string;
  name: string;
  analogy: string;
  description: string;
  color: string;
  iconName: string;
  foundIn: ('animal' | 'plant' | 'procaryote')[];
  funFact: string;
  svgPath: string; // ID or key for diagram location
}

export interface PlayerState {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  correctAnswers: number;
  totalAnswers: number;
  color: string;
  lastAnswerTime?: number;
  lastAnswerIdx?: number | null;
  isReady?: boolean;
}

export interface KahootRoom {
  pin: string;
  roomName: string;
  hostName: string;
  difficulty: DifficultyLevel;
  questionCount: number;
  timePerQuestion: number;
  status: 'lobby' | 'playing' | 'leaderboard' | 'podium';
  players: PlayerState[];
  currentQuestionIndex: number;
  questions: Question[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}
