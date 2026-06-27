export interface Player {
  id: string;
  name: string;
  number: string;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  score: number;
  coach?: string;
  assistantCoach?: string;
}

export interface GameEvent {
  id: string;
  timestamp: number;
  teamId: string;
  playerId: string;
  actionId: string;
  actionLabel: string;
  details?: string;
  points?: number;
  onCourtA?: string[]; // Player IDs on court for Team A at this moment
  onCourtB?: string[]; // Player IDs on court for Team B at this moment
}

export interface GameState {
  teamA: Team;
  teamB: Team;
  activePlayersA: string[]; // IDs
  activePlayersB: string[]; // IDs
  startersA?: string[]; // IDs of original starters
  startersB?: string[]; // IDs of original starters
  events: GameEvent[];
  isGameStarted: boolean;
  isGameFinished: boolean;
}

export interface PlayerStats {
  id: string;
  name: string;
  number: string;
  points: number;
  rebounds: number; // Total Rebounds
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number; // Personal Fouls
  
  // Advanced Basketball metrics
  fgMade: number;
  fgAttempted: number;
  twoPtMade: number;
  twoPtAttempted: number;
  threePtMade: number;
  threePtAttempted: number;
  ftMade: number;
  ftAttempted: number;
  offReb: number;
  defReb: number;
  foulsDrawn: number;
  plusMinus: number;
  efficiency: number;
  played: boolean;
}
