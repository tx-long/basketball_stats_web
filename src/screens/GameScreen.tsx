import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BASKETBALL_ACTIONS } from '../config/actions';
import type { GameAction, ActionOption } from '../config/actions';
import { ChevronRight, ArrowLeft, RefreshCw, HandHelping, ChevronLeft } from 'lucide-react';

export const GameScreen = ({ navigation }: any) => {
  const { 
    teamA, 
    teamB, 
    activePlayersA, 
    activePlayersB, 
    logEvent, 
    finishGame, 
    getPlayerStats, 
    setActiveLineup,
    language,
    t
  } = useGame();
  
  const getActionLabel = (opt: any) => {
    if (!opt) return '';
    const key = `action_${opt.id}`;
    const translated = t(key);
    return translated !== key ? translated : opt.label;
  };

  const [selectedPlayer, setSelectedPlayer] = useState<{ id: string, teamId: string, name: string, number: string } | null>(null);
  const [currentActionStep, setCurrentActionStep] = useState<any[]>([]); // To track nested options

  // Assist Flow states
  const [isAssistFlow, setIsAssistFlow] = useState(false);
  const [assistTargetPlayerId, setAssistTargetPlayerId] = useState<string | null>(null);
  const [assistPoints, setAssistPoints] = useState<number | null>(null);

  // Substitution Flow states
  const [isSubFlow, setIsSubFlow] = useState(false);

  const handlePlayerPress = (playerId: string, teamId: string) => {
    const team = teamId === 'teamA' ? teamA : teamB;
    const player = team.players.find(p => p.id === playerId);
    if (player) {
      if (selectedPlayer?.id === playerId) {
        // Toggle selection off
        closeSelection();
      } else {
        setSelectedPlayer({ ...player, teamId });
        setCurrentActionStep([]);
        setIsAssistFlow(false);
        setIsSubFlow(false);
        setAssistTargetPlayerId(null);
        setAssistPoints(null);
      }
    }
  };

  const handleActionSelect = (action: GameAction | ActionOption) => {
    if (!selectedPlayer) return;

    if (action.id === 'assist') {
      setIsAssistFlow(true);
    } else if (action.id === 'substitution') {
      setIsSubFlow(true);
    } else if (action.isFinal) {
      logEvent({
        teamId: selectedPlayer.teamId,
        playerId: selectedPlayer.id,
        actionId: action.id,
        actionLabel: getActionLabel(action),
        points: (action as ActionOption).value,
        details: currentActionStep.map(s => getActionLabel(s)).join(' > ') + (currentActionStep.length > 0 ? ' > ' : '') + getActionLabel(action)
      });
      closeSelection();
    } else if ((action as ActionOption).subOptions || (action as GameAction).options) {
      setCurrentActionStep([...currentActionStep, action]);
    }
  };

  const handleBackStep = () => {
    setCurrentActionStep(prev => prev.slice(0, -1));
  };

  const closeSelection = () => {
    setSelectedPlayer(null);
    setCurrentActionStep([]);
    setIsAssistFlow(false);
    setAssistTargetPlayerId(null);
    setAssistPoints(null);
    setIsSubFlow(false);
  };

  const renderPlayerCard = (playerId: string, teamId: string) => {
    const team = teamId === 'teamA' ? teamA : teamB;
    const player = team.players.find(p => p.id === playerId);
    if (!player) return null;

    const stats = getPlayerStats(playerId);
    const isSelected = selectedPlayer?.id === playerId;
    
    // Pick active stats that are > 0
    const statsList = [];
    if (stats) {
      if (stats.points > 0) statsList.push({ label: 'PTS', value: stats.points });
      if (stats.rebounds > 0) statsList.push({ label: 'REB', value: stats.rebounds });
      if (stats.assists > 0) statsList.push({ label: 'AST', value: stats.assists });
      if (stats.fouls > 0) statsList.push({ label: 'PF', value: stats.fouls });
      if (stats.steals > 0) statsList.push({ label: 'STL', value: stats.steals });
      if (stats.blocks > 0) statsList.push({ label: 'BLK', value: stats.blocks });
      if (stats.turnovers > 0) statsList.push({ label: 'TO', value: stats.turnovers });
      if (stats.foulsDrawn > 0) statsList.push({ label: 'FD', value: stats.foulsDrawn });
    }

    // Sort descending by value
    statsList.sort((a, b) => b.value - a.value);
    const topStats = statsList.slice(0, 3);

    return (
      <div 
        key={playerId} 
        className={`game-player-card ${isSelected ? 'selected' : ''}`}
        onClick={() => handlePlayerPress(playerId, teamId)}
      >
        <span className="game-card-number">{player.number}</span>
        <div className="game-card-info">
          <span className="game-card-name" title={player.name}>{player.name}</span>
          {topStats.length > 0 && (
            <div className="game-stats-container">
              {topStats.map((st, idx) => (
                <div key={idx} className="game-stat-badge">
                  {st.value} {st.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSidebar = (teamId: 'teamA' | 'teamB') => {
    const isSelectedTeam = selectedPlayer?.teamId === teamId;
    const team = teamId === 'teamA' ? teamA : teamB;
    const activeList = teamId === 'teamA' ? activePlayersA : activePlayersB;
    
    const backLabel = language === 'VN' ? 'Quay lại' : 'Back';
    const confirmLabel = language === 'VN' ? 'Xác nhận' : 'Confirm';
    const cancelLabel = language === 'VN' ? 'Hủy' : 'Cancel';
    const deselectLabel = language === 'VN' ? 'Bỏ chọn' : 'Deselect';

    // --- ASSIST FLOW RENDER ---
    if (isSelectedTeam && isAssistFlow) {
      const otherOnCourt = activeList
        .filter(id => id !== selectedPlayer!.id)
        .map(id => team.players.find(p => p.id === id))
        .filter(Boolean);

      const handleConfirmAssist = () => {
        if (!assistTargetPlayerId || !assistPoints || !selectedPlayer) return;
        const shooter = team.players.find(p => p.id === assistTargetPlayerId)!;
        
        logEvent({
          teamId: selectedPlayer.teamId,
          playerId: selectedPlayer.id,
          actionId: 'assist',
          actionLabel: t('action_assist'),
          details: language === 'VN'
            ? `Kiến tạo cho ${shooter.name} (#${shooter.number})`
            : `Assist to ${shooter.name} (#${shooter.number})`
        });
        
        logEvent({
          teamId: selectedPlayer.teamId,
          playerId: assistTargetPlayerId,
          actionId: assistPoints === 3 ? '3pt' : '2pt',
          actionLabel: assistPoints === 3 ? t('action_3pt') : t('action_2pt'),
          points: assistPoints,
          details: language === 'VN'
            ? `Thành công (Kiến tạo bởi ${selectedPlayer.name} #${selectedPlayer.number})`
            : `Made Shot (Assisted by ${selectedPlayer.name} #${selectedPlayer.number})`
        });

        closeSelection();
      };

      return (
        <div className="game-action-sidebar team-active">
          <div className="sidebar-header-row">
            <span className="sidebar-title">{team.name} Stats</span>
            <button className="sidebar-deselect-btn" onClick={closeSelection}>{deselectLabel}</button>
          </div>
          <div className="sidebar-player-target">
            <strong>#{selectedPlayer!.number} {selectedPlayer!.name}</strong>
            <span className="player-flow-type"><HandHelping size={14} /> {t('game_modal_assist_title')}</span>
          </div>

          <div className="sidebar-flow-container">
            <div className="flow-section">
              <span className="flow-section-title">{t('game_modal_assist_player')}</span>
              <div className="flow-player-grid">
                {otherOnCourt.map(p => {
                  if (!p) return null;
                  const isSelected = assistTargetPlayerId === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`flow-player-btn-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setAssistTargetPlayerId(p.id)}
                    >
                      <span className="flow-player-card-no">#{p.number}</span>
                      <span className="flow-player-card-name" title={p.name}>{p.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flow-section">
              <span className="flow-section-title">{t('game_modal_assist_points')}</span>
              <div className="flow-points-row">
                {[2, 3].map(pts => {
                  const isSelected = assistPoints === pts;
                  return (
                    <button
                      key={pts}
                      type="button"
                      className={`flow-points-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => setAssistPoints(pts)}
                    >
                      {pts} PT
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flow-action-row">
              <button
                type="button"
                className="flow-cancel-btn"
                onClick={() => {
                  setIsAssistFlow(false);
                  setAssistTargetPlayerId(null);
                  setAssistPoints(null);
                }}
              >
                {backLabel}
              </button>
              <button
                type="button"
                className="flow-confirm-btn"
                disabled={!assistTargetPlayerId || !assistPoints}
                onClick={handleConfirmAssist}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // --- SUBSTITUTION FLOW RENDER ---
    if (isSelectedTeam && isSubFlow) {
      const benchPlayers = team.players.filter(p => !activeList.includes(p.id));

      const handleConfirmSub = (benchPlayerId: string) => {
        if (!selectedPlayer) return;
        const benchPlayer = team.players.find(p => p.id === benchPlayerId)!;
        
        const newLineup = activeList.map(id => id === selectedPlayer.id ? benchPlayerId : id);
        setActiveLineup(selectedPlayer.teamId, newLineup);

        logEvent({
          teamId: selectedPlayer.teamId,
          playerId: selectedPlayer.id,
          actionId: 'substitution',
          actionLabel: t('action_substitution'),
          details: language === 'VN'
            ? `Thay ra cho ${benchPlayer.name} (#${benchPlayer.number})`
            : `Subbed out for ${benchPlayer.name} (#${benchPlayer.number})`
        });

        closeSelection();
      };

      return (
        <div className="game-action-sidebar team-active">
          <div className="sidebar-header-row">
            <span className="sidebar-title">{team.name} Stats</span>
            <button className="sidebar-deselect-btn" onClick={closeSelection}>{deselectLabel}</button>
          </div>
          <div className="sidebar-player-target">
            <strong>#{selectedPlayer!.number} {selectedPlayer!.name}</strong>
            <span className="player-flow-type"><RefreshCw size={14} /> {t('game_modal_sub_title')}</span>
          </div>

          <div className="sidebar-flow-container">
            <span className="flow-section-title">{t('game_modal_sub_bench')}</span>
            {benchPlayers.length === 0 ? (
              <p className="flow-empty-bench">{t('game_modal_sub_empty')}</p>
            ) : (
              <div className="flow-sub-list">
                {benchPlayers.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className="flow-sub-item-btn"
                    onClick={() => handleConfirmSub(p.id)}
                  >
                    <span>#{p.number}</span>
                    <span className="flow-sub-item-name">{p.name}</span>
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              className="flow-cancel-btn full-width"
              onClick={() => setIsSubFlow(false)}
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      );
    }

    // --- STANDARD ACTION LIST RENDER ---
    let currentOptions: any[] = [];
    if (isSelectedTeam) {
      if (currentActionStep.length === 0) {
        currentOptions = BASKETBALL_ACTIONS;
      } else {
        const lastStep = currentActionStep[currentActionStep.length - 1];
        currentOptions = lastStep.options || lastStep.subOptions || [];
      }
    } else {
      currentOptions = BASKETBALL_ACTIONS;
    }

    return (
      <div className={`game-action-sidebar ${isSelectedTeam ? 'team-active' : 'disabled'}`}>
        <div className="sidebar-header-row">
          <span className="sidebar-title">{team.name} Stats</span>
          {isSelectedTeam && (
            <button className="sidebar-deselect-btn" onClick={closeSelection}>{deselectLabel}</button>
          )}
        </div>

        {isSelectedTeam ? (
          <div className="sidebar-player-target">
            <strong>#{selectedPlayer!.number} {selectedPlayer!.name}</strong>
          </div>
        ) : (
          <div className="sidebar-player-target placeholder">
            <span>{t('game_modal_sub_empty') ? (language === 'VN' ? 'Chọn cầu thủ để ghi nhận' : 'Select a player to log') : ''}</span>
          </div>
        )}

        <div className="sidebar-actions-wrapper">
          {isSelectedTeam && currentActionStep.length > 0 && (
            <div className="sidebar-breadcrumb-row">
              <button className="breadcrumb-back-btn" onClick={handleBackStep}>
                <ArrowLeft size={14} />
                <span>{backLabel}</span>
              </button>
              <div className="breadcrumb-text">
                {currentActionStep.map(s => getActionLabel(s)).join(' > ')}
              </div>
            </div>
          )}

          <div className="sidebar-buttons-list">
            {currentOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="sidebar-action-item-btn"
                disabled={!isSelectedTeam}
                onClick={() => handleActionSelect(opt)}
              >
                <span>{getActionLabel(opt)}</span>
                {!opt.isFinal && <ChevronRight size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="game-container">
      {selectedPlayer && (
        <div className="game-sidebar-overlay" onClick={closeSelection} />
      )}
      <div className="game-score-board">
        <button className="game-back-btn" onClick={() => navigation.goBack()}>
          <ChevronLeft size={18} />
          <span>{language === 'VN' ? 'Quay lại' : 'Back'}</span>
        </button>
        <div className="game-team-score team-a">
          <span className="game-score-name" title={teamA.name}>{teamA.name}</span>
          <span className="game-score-value">{teamA.score}</span>
        </div>
        <button className="game-finish-btn" onClick={() => {
          finishGame();
          navigation.navigate('Summary');
        }}>
          {t('game_finish_btn')}
        </button>
        <div className="game-team-score team-b">
          <span className="game-score-name" title={teamB.name}>{teamB.name}</span>
          <span className="game-score-value">{teamB.score}</span>
        </div>
      </div>

      <div className="game-split-layout">
        {/* Leftmost column: Team A Action Sidebar */}
        {renderSidebar('teamA')}

        {/* Team A Players */}
        <div className="game-team-column team-a-col">
          {activePlayersA.map(id => renderPlayerCard(id, 'teamA'))}
        </div>

        {/* Team B Players */}
        <div className="game-team-column team-b-col">
          {activePlayersB.map(id => renderPlayerCard(id, 'teamB'))}
        </div>

        {/* Rightmost column: Team B Action Sidebar */}
        {renderSidebar('teamB')}
      </div>
    </div>
  );
};
