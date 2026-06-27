import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { GameState, Team, GameEvent, PlayerStats } from '../types';
import VN from '../locales/VN.json';
import EN from '../locales/EN.json';

const appName = 'GBA';

interface GameContextType extends GameState {
  setupTeams: (teamA: Team, teamB: Team) => void;
  setActiveLineup: (teamId: string, playerIds: string[]) => void;
  logEvent: (event: Omit<GameEvent, 'id' | 'timestamp'>) => void;
  finishGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  getPlayerStats: (playerId: string) => PlayerStats | undefined;
  language: 'VN' | 'EN';
  setLanguage: (lang: 'VN' | 'EN') => void;
  t: (key: string) => string;
}

const initialState: GameState = {
  teamA: { id: 'teamA', name: 'Team A', players: [], score: 0 },
  teamB: { id: 'teamB', name: 'Team B', players: [], score: 0 },
  activePlayersA: [],
  activePlayersB: [],
  events: [],
  isGameStarted: false,
  isGameFinished: false,
};

const loadSavedState = (): GameState => {
  try {
    const saved = localStorage.getItem('game_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        teamA: parsed.teamA || initialState.teamA,
        teamB: parsed.teamB || initialState.teamB,
        activePlayersA: parsed.activePlayersA || initialState.activePlayersA,
        activePlayersB: parsed.activePlayersB || initialState.activePlayersB,
        startersA: parsed.startersA,
        startersB: parsed.startersB,
        events: parsed.events || initialState.events,
        isGameStarted: parsed.isGameStarted ?? initialState.isGameStarted,
        isGameFinished: parsed.isGameFinished ?? initialState.isGameFinished,
      };
    }
  } catch (error) {
    console.error('Error loading game state:', error);
  }
  return initialState;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const savedState = loadSavedState();

  const [teamA, setTeamA] = useState<Team>(savedState.teamA);
  const [teamB, setTeamB] = useState<Team>(savedState.teamB);
  const [activePlayersA, setActivePlayersA] = useState<string[]>(savedState.activePlayersA);
  const [activePlayersB, setActivePlayersB] = useState<string[]>(savedState.activePlayersB);
  const [startersA, setStartersA] = useState<string[] | undefined>(savedState.startersA);
  const [startersB, setStartersB] = useState<string[] | undefined>(savedState.startersB);
  const [events, setEvents] = useState<GameEvent[]>(savedState.events);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(savedState.isGameStarted);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(savedState.isGameFinished);

  const [language, setLanguageState] = useState<'VN' | 'EN'>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved === 'EN' || saved === 'VN') ? saved : 'VN';
  });

  // Save state on change
  useEffect(() => {
    if (isGameStarted) {
      const stateToSave = {
        teamA,
        teamB,
        activePlayersA,
        activePlayersB,
        startersA,
        startersB,
        events,
        isGameStarted,
        isGameFinished,
      };
      localStorage.setItem('game_state', JSON.stringify(stateToSave));
    }
  }, [teamA, teamB, activePlayersA, activePlayersB, startersA, startersB, events, isGameStarted, isGameFinished]);

  const setupTeams = useCallback((tA: Team, tB: Team) => {
    setTeamA(tA);
    setTeamB(tB);
    setActivePlayersA([]);
    setActivePlayersB([]);
    setStartersA(undefined);
    setStartersB(undefined);
    setEvents([]);
    setIsGameStarted(true);
    setIsGameFinished(false);
  }, []);

  const setActiveLineup = useCallback((teamId: string, playerIds: string[]) => {
    const isTeamA = teamId === 'teamA';
    if (isTeamA) {
      setActivePlayersA(playerIds);
      setStartersA(prev => prev || playerIds);
    } else {
      setActivePlayersB(playerIds);
      setStartersB(prev => prev || playerIds);
    }
  }, []);

  const logEvent = useCallback((eventData: Omit<GameEvent, 'id' | 'timestamp'>) => {
    const newEvent: GameEvent = {
      ...eventData,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
      onCourtA: activePlayersA,
      onCourtB: activePlayersB,
    };
    
    setEvents(prev => [...prev, newEvent]);

    // Update scores
    if (newEvent.points) {
      if (newEvent.teamId === 'teamA') {
        setTeamA(prev => ({ ...prev, score: prev.score + newEvent.points! }));
      } else {
        setTeamB(prev => ({ ...prev, score: prev.score + newEvent.points! }));
      }
    }
  }, [activePlayersA, activePlayersB]);

  const finishGame = useCallback(() => {
    setIsGameFinished(true);
  }, []);

  const resumeGame = useCallback(() => {
    setIsGameFinished(false);
  }, []);

  const resetGame = useCallback(() => {
    setTeamA(initialState.teamA);
    setTeamB(initialState.teamB);
    setActivePlayersA(initialState.activePlayersA);
    setActivePlayersB(initialState.activePlayersB);
    setStartersA(undefined);
    setStartersB(undefined);
    setEvents(initialState.events);
    setIsGameStarted(initialState.isGameStarted);
    setIsGameFinished(initialState.isGameFinished);
    localStorage.removeItem('game_state');
  }, []);

  const getPlayerStats = useCallback((playerId: string): PlayerStats | undefined => {
    const isTeamA = teamA.players.some(p => p.id === playerId);
    const player = [...teamA.players, ...teamB.players].find(p => p.id === playerId);
    if (!player) return undefined;

    const stats: PlayerStats = {
      id: player.id,
      name: player.name,
      number: player.number,
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fouls: 0,
      
      fgMade: 0,
      fgAttempted: 0,
      twoPtMade: 0,
      twoPtAttempted: 0,
      threePtMade: 0,
      threePtAttempted: 0,
      ftMade: 0,
      ftAttempted: 0,
      offReb: 0,
      defReb: 0,
      foulsDrawn: 0,
      plusMinus: 0,
      efficiency: 0,
      played: false,
    };

    // Determine if player has participated
    stats.played = activePlayersA.includes(playerId) ||
                   activePlayersB.includes(playerId) ||
                   events.some(e => e.playerId === playerId);

    events.forEach(e => {
      // Calculate Plus-Minus (+/-)
      if (e.points) {
        const onCourt = isTeamA ? e.onCourtA : e.onCourtB;
        if (onCourt && onCourt.includes(playerId)) {
          if (e.teamId === (isTeamA ? 'teamA' : 'teamB')) {
            stats.plusMinus += e.points;
          } else {
            stats.plusMinus -= e.points;
          }
        }
      }

      // Check player-specific stats
      if (e.playerId === playerId) {
        if (e.points) stats.points += e.points;

        // Shots Division
        if (e.actionId === '1pt') {
          stats.ftMade += 1;
          stats.ftAttempted += 1;
        } else if (e.actionId === 'miss_1pt') {
          stats.ftAttempted += 1;
        } else if (e.actionId === '2pt') {
          stats.twoPtMade += 1;
          stats.twoPtAttempted += 1;
          stats.fgMade += 1;
          stats.fgAttempted += 1;
        } else if (e.actionId === 'miss_2pt') {
          stats.twoPtAttempted += 1;
          stats.fgAttempted += 1;
        } else if (e.actionId === '3pt') {
          stats.threePtMade += 1;
          stats.threePtAttempted += 1;
          stats.fgMade += 1;
          stats.fgAttempted += 1;
        } else if (e.actionId === 'miss_3pt') {
          stats.threePtAttempted += 1;
          stats.fgAttempted += 1;
        }

        // Rebounds Division
        if (e.actionId === 'offensive') {
          stats.offReb += 1;
          stats.rebounds += 1;
        } else if (e.actionId === 'defensive') {
          stats.defReb += 1;
          stats.rebounds += 1;
        } else if (e.actionId === 'rebound') {
          stats.rebounds += 1;
        }

        // Other basic actions
        if (e.actionId === 'assist') {
          stats.assists += 1;
        } else if (e.actionId === 'steal') {
          stats.steals += 1;
        } else if (e.actionId === 'block') {
          stats.blocks += 1;
        } else if (e.actionId === 'turnover' || e.actionId.startsWith('turnover_')) {
          stats.turnovers += 1;
        } else if (e.actionId === 'foul' || e.actionId.startsWith('foul_')) {
          stats.fouls += 1;
        } else if (e.actionId === 'fouldrawn') {
          stats.foulsDrawn += 1;
        }
      }
    });

    // EFF = (PTS + REB + AST + STL + BLK) - ((FGA - FGM) + (FTA - FTM) + TO)
    const pts = stats.points;
    const reb = stats.rebounds;
    const ast = stats.assists;
    const stl = stats.steals;
    const blk = stats.blocks;
    const fga = stats.fgAttempted;
    const fgm = stats.fgMade;
    const fta = stats.ftAttempted;
    const ftm = stats.ftMade;
    const to = stats.turnovers;

    stats.efficiency = (pts + reb + ast + stl + blk) - ((fga - fgm) + (fta - ftm) + to);

    return stats;
  }, [teamA, teamB, activePlayersA, activePlayersB, events]);

  const setLanguage = useCallback((lang: 'VN' | 'EN') => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    const dictionary: Record<string, string> = language === 'VN' ? VN : EN;
    const value = dictionary[key] || key;
    return value.replace(/O-Ref/g, appName).replace(/ORef/g, appName);
  }, [language]);

  return (
    <GameContext.Provider value={{ 
      teamA,
      teamB,
      activePlayersA,
      activePlayersB,
      startersA,
      startersB,
      events,
      isGameStarted,
      isGameFinished,
      setupTeams, 
      setActiveLineup, 
      logEvent, 
      finishGame, 
      resumeGame,
      resetGame, 
      getPlayerStats,
      language,
      setLanguage,
      t
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
