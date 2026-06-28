import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Plus, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';

export const SetupScreen = ({ navigation }: any) => {
  const { teamA: contextTeamA, teamB: contextTeamB, setupTeams, t } = useGame();
  
  const [teamA, setTeamA] = useState(() => {
    if (contextTeamA.players && contextTeamA.players.length > 0) {
      return {
        name: contextTeamA.name,
        coach: contextTeamA.coach || '',
        assistantCoach: contextTeamA.assistantCoach || '',
        players: contextTeamA.players.map(p => ({ ...p }))
      };
    }
    return { name: 'Lakers', coach: '', assistantCoach: '', players: [{ id: 'a_1', name: '', number: '' }] };
  });

  const [teamB, setTeamB] = useState(() => {
    if (contextTeamB.players && contextTeamB.players.length > 0) {
      return {
        name: contextTeamB.name,
        coach: contextTeamB.coach || '',
        assistantCoach: contextTeamB.assistantCoach || '',
        players: contextTeamB.players.map(p => ({ ...p }))
      };
    }
    return { name: 'Warriors', coach: '', assistantCoach: '', players: [{ id: 'b_1', name: '', number: '' }] };
  });

  const addPlayer = (team: 'A' | 'B') => {
    const setTeam = team === 'A' ? setTeamA : setTeamB;
    const currentTeam = team === 'A' ? teamA : teamB;
    
    if (currentTeam.players.length >= 15) return;

    setTeam({
      ...currentTeam,
      players: [...currentTeam.players, { id: Math.random().toString(), name: '', number: '' }]
    });
  };

  const removePlayer = (team: 'A' | 'B', id: string) => {
    const setTeam = team === 'A' ? setTeamA : setTeamB;
    const currentTeam = team === 'A' ? teamA : teamB;
    
    setTeam({
      ...currentTeam,
      players: currentTeam.players.filter(p => p.id !== id)
    });
  };

  const updatePlayer = (team: 'A' | 'B', id: string, field: 'name' | 'number', value: string) => {
    const setTeam = team === 'A' ? setTeamA : setTeamB;
    const currentTeam = team === 'A' ? teamA : teamB;
    
    setTeam({
      ...currentTeam,
      players: currentTeam.players.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  const handleNext = () => {
    const sanitizeId = (str: string) => {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .trim();
    };

    const teamAName = teamA.name || 'Team A';
    const teamBName = teamB.name || 'Team B';

    const formattedTeamA = {
      id: 'teamA',
      name: teamAName,
      coach: teamA.coach,
      assistantCoach: teamA.assistantCoach,
      players: teamA.players
        .filter(p => p.name && p.number)
        .map(p => ({
          ...p,
          id: `${sanitizeId(teamAName)}_${sanitizeId(p.number)}_${sanitizeId(p.name)}`
        })),
      score: 0
    };
    const formattedTeamB = {
      id: 'teamB',
      name: teamBName,
      coach: teamB.coach,
      assistantCoach: teamB.assistantCoach,
      players: teamB.players
        .filter(p => p.name && p.number)
        .map(p => ({
          ...p,
          id: `${sanitizeId(teamBName)}_${sanitizeId(p.number)}_${sanitizeId(p.name)}`
        })),
      score: 0
    };

    if (formattedTeamA.players.length < 5 || formattedTeamB.players.length < 5) {
      alert(t('setup_validation_error'));
      return;
    }

    setupTeams(formattedTeamA, formattedTeamB);
    navigation.navigate('Lineup');
  };

  const renderTeamSection = (team: 'A' | 'B') => {
    const data = team === 'A' ? teamA : teamB;
    const setData = team === 'A' ? setTeamA : setTeamB;
    const teamTitle = team === 'A' ? t('setup_team_a') : t('setup_team_b');

    return (
      <div className="setup-team-section">
        <span className="setup-section-title">{teamTitle}</span>
        <input
          type="text"
          className="setup-team-input"
          placeholder={teamTitle}
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <div className="setup-coach-row">
          <input
            type="text"
            className="setup-input-coach"
            placeholder={t('setup_coach_placeholder')}
            value={data.coach}
            onChange={(e) => setData({ ...data, coach: e.target.value })}
          />
          <input
            type="text"
            className="setup-input-coach"
            placeholder={t('setup_assistant_coach_placeholder')}
            value={data.assistantCoach}
            onChange={(e) => setData({ ...data, assistantCoach: e.target.value })}
          />
        </div>
        
        <div className="setup-player-list">
          {data.players.map((player, index) => (
            <div key={player.id} className="setup-player-row">
              <span className="setup-player-index">{index + 1}</span>
              <input
                type="text"
                className="setup-input-name"
                placeholder={t('setup_player_name')}
                value={player.name}
                onChange={(e) => updatePlayer(team, player.id, 'name', e.target.value)}
              />
              <input
                type="text"
                className="setup-input-number"
                placeholder={t('setup_player_number')}
                value={player.number}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  updatePlayer(team, player.id, 'number', val);
                }}
              />
              <button 
                type="button"
                onClick={() => removePlayer(team, player.id)} 
                className="setup-remove-btn"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <button 
          type="button"
          className="setup-add-player-btn" 
          onClick={() => addPlayer(team)}
          disabled={data.players.length >= 15}
        >
          <Plus size={18} />
          <span>{t('setup_add_player')} ({data.players.length}/15)</span>
        </button>
      </div>
    );
  };

  return (
    <div className="setup-container">
      <div className="setup-header">
        <h2 className="setup-header-title">{t('setup_title')}</h2>
      </div>
      
      <div className="setup-scroll-view">
        {renderTeamSection('A')}
        {renderTeamSection('B')}
      </div>

      <div className="setup-footer">
        <button className="setup-back-btn" onClick={() => navigation.goBack()}>
          <ChevronLeft size={20} />
          <span>{t('common_back')}</span>
        </button>
        <button className="setup-next-btn" onClick={handleNext}>
          <span>{t('setup_next_btn')}</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
