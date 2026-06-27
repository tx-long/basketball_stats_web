import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Check, ChevronLeft } from 'lucide-react';

export const LineupScreen = ({ navigation }: any) => {
  const { teamA, teamB, startersA, startersB, setActiveLineup, language, t } = useGame();
  
  const [selectedA, setSelectedA] = useState<string[]>(() => startersA || []);
  const [selectedB, setSelectedB] = useState<string[]>(() => startersB || []);

  const togglePlayer = (team: 'A' | 'B', playerId: string) => {
    const selected = team === 'A' ? selectedA : selectedB;
    const setSelected = team === 'A' ? setSelectedA : setSelectedB;

    if (selected.includes(playerId)) {
      setSelected(selected.filter(id => id !== playerId));
    } else {
      if (selected.length >= 5) return;
      setSelected([...selected, playerId]);
    }
  };

  const handleStart = () => {
    if (selectedA.length !== 5 || selectedB.length !== 5) {
      alert(t('lineup_validation_error'));
      return;
    }

    setActiveLineup('teamA', selectedA);
    setActiveLineup('teamB', selectedB);
    navigation.navigate('Game');
  };

  const renderPlayerGrid = (team: 'A' | 'B') => {
    const players = team === 'A' ? teamA.players : teamB.players;
    const selected = team === 'A' ? selectedA : selectedB;

    return (
      <div className="lineup-grid">
        {players.map(player => {
          const isSelected = selected.includes(player.id);
          return (
            <div 
              key={player.id} 
              className={`lineup-player-card ${isSelected ? 'selected' : ''}`}
              onClick={() => togglePlayer(team, player.id)}
            >
              <span className="lineup-player-number">#{player.number}</span>
              <span className="lineup-player-name" title={player.name}>{player.name}</span>
              {isSelected && (
                <div className="lineup-check-icon">
                  <Check size={14} color="#FFFFFF" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="lineup-container">
      <div className="lineup-header">
        <h2 className="lineup-header-title">{t('lineup_title')}</h2>
        <p className="lineup-header-subtitle">{t('lineup_subtitle')}</p>
      </div>
      
      <div className="lineup-scroll-view">
        <div className="lineup-section">
          <div className="lineup-section-header">
            <span className="lineup-team-name">{teamA.name}</span>
            <span className="lineup-count">{selectedA.length}/5</span>
          </div>
          {renderPlayerGrid('A')}
        </div>

        <div className="lineup-section">
          <div className="lineup-section-header">
            <span className="lineup-team-name">{teamB.name}</span>
            <span className="lineup-count">{selectedB.length}/5</span>
          </div>
          {renderPlayerGrid('B')}
        </div>
      </div>

      <div className="lineup-footer">
        <button className="lineup-back-btn" onClick={() => navigation.goBack()}>
          <ChevronLeft size={20} />
          <span>{language === 'VN' ? 'Quay lại' : 'Back'}</span>
        </button>
        <button className="lineup-start-btn" onClick={handleStart}>
          {t('lineup_start_btn')}
        </button>
      </div>
    </div>
  );
};
