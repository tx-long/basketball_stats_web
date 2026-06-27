import { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { SetupScreen } from './screens/SetupScreen';
import { LineupScreen } from './screens/LineupScreen';
import { GameScreen } from './screens/GameScreen';
import { SummaryScreen } from './screens/SummaryScreen';

type ScreenName = 'Welcome' | 'Setup' | 'Lineup' | 'Game' | 'Summary';

function AppContent() {
  const { language, setLanguage, isGameStarted, isGameFinished, activePlayersA, activePlayersB } = useGame();
  
  // Initialize the screen based on loaded localStorage game state
  const [screenHistory, setScreenHistory] = useState<ScreenName[]>(() => {
    if (isGameFinished) return ['Welcome', 'Setup', 'Lineup', 'Game', 'Summary'];
    if (isGameStarted) {
      if (activePlayersA.length === 5 && activePlayersB.length === 5) {
        return ['Welcome', 'Setup', 'Lineup', 'Game'];
      }
      return ['Welcome', 'Setup', 'Lineup'];
    }
    return ['Welcome'];
  });

  const currentScreen = screenHistory[screenHistory.length - 1];

  const navigation = {
    navigate: (screenName: ScreenName) => {
      setScreenHistory(prev => [...prev, screenName]);
    },
    goBack: () => {
      setScreenHistory(prev => {
        if (prev.length <= 1) return prev;
        return prev.slice(0, -1);
      });
    },
    reset: (_options: any) => {
      setScreenHistory(['Welcome']);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'VN' ? 'EN' : 'VN');
  };

  return (
    <div className="app-container">
      {/* Global floating Language Selector at top right - only visible during setup */}
      {(currentScreen === 'Welcome' || currentScreen === 'Setup') && (
        <button className="global-lang-btn" onClick={toggleLanguage}>
          {language === 'VN' ? '🇻🇳 VN' : '🇬🇧 EN'}
        </button>
      )}

      {currentScreen === 'Welcome' && <WelcomeScreen navigation={navigation} />}
      {currentScreen === 'Setup' && <SetupScreen navigation={navigation} />}
      {currentScreen === 'Lineup' && <LineupScreen navigation={navigation} />}
      {currentScreen === 'Game' && <GameScreen navigation={navigation} />}
      {currentScreen === 'Summary' && <SummaryScreen navigation={navigation} />}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
