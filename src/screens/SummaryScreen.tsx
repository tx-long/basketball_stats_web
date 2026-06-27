import { useGame } from '../context/GameContext';
import { exportToPDF, exportToText } from '../services/exportService';
import { FileText, FileDown, RotateCcw, ChevronLeft } from 'lucide-react';

export const SummaryScreen = ({ navigation }: any) => {
  const { teamA, teamB, events, getPlayerStats, resetGame, resumeGame, startersA, startersB, language, t } = useGame();

  const statsA = teamA.players.map(p => getPlayerStats(p.id)!);
  const statsB = teamB.players.map(p => getPlayerStats(p.id)!);

  const handleExportPDF = () => exportToPDF(teamA, teamB, statsA, statsB, startersA, startersB, language);
  const handleExportText = () => exportToText(events, teamA, teamB, language);

  const handleReset = () => {
    resetGame();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  const handleBack = () => {
    resumeGame();
    navigation.goBack();
  };

  const renderStatsTable = (teamName: string, stats: any[]) => (
    <div className="summary-table-section">
      <h3 className="summary-table-title">{teamName}</h3>
      <div className="summary-table-wrapper">
        <table className="summary-table">
          <thead>
            <tr>
              <th className="summary-cell-num">#</th>
              <th className="summary-cell-name">{language === 'VN' ? 'Tên VĐV' : 'Name'}</th>
              <th className="summary-cell-stat">PTS</th>
              <th className="summary-cell-stat">REB</th>
              <th className="summary-cell-stat">AST</th>
              <th className="summary-cell-stat">STL</th>
              <th className="summary-cell-stat">BLK</th>
              <th className="summary-cell-stat">TO</th>
              <th className="summary-cell-stat">PF</th>
            </tr>
          </thead>
          <tbody>
            {stats.map(s => (
              <tr key={s.id}>
                <td className="summary-cell-num">{s.number}</td>
                <td className="summary-cell-name">{s.name}</td>
                <td className="summary-cell-stat summary-cell-bold">{s.points}</td>
                <td className="summary-cell-stat">{s.rebounds}</td>
                <td className="summary-cell-stat">{s.assists}</td>
                <td className="summary-cell-stat">{s.steals}</td>
                <td className="summary-cell-stat">{s.blocks}</td>
                <td className="summary-cell-stat">{s.turnovers}</td>
                <td className="summary-cell-stat">{s.fouls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="summary-container">
      <div className="summary-header">
        <button className="summary-back-btn" onClick={handleBack}>
          <ChevronLeft size={18} />
          <span>{language === 'VN' ? 'Quay lại' : 'Back'}</span>
        </button>
        <h2 className="summary-header-title">{t('summary_title')}</h2>
        <div className="summary-final-score">
          <span className="summary-score-text">
            {teamA.name} {teamA.score} - {teamB.score} {teamB.name}
          </span>
        </div>
      </div>

      <div className="summary-scroll-view">
        {renderStatsTable(teamA.name, statsA)}
        {renderStatsTable(teamB.name, statsB)}
      </div>

      <div className="summary-footer">
        <div className="summary-export-row">
          <button className="summary-export-btn" onClick={handleExportPDF}>
            <FileDown size={18} />
            <span>{t('summary_export_pdf')}</span>
          </button>
          <button className="summary-export-btn" onClick={handleExportText}>
            <FileText size={18} />
            <span>{t('summary_export_log')}</span>
          </button>
        </div>
        <button className="summary-new-game-btn" onClick={handleReset}>
          <RotateCcw size={18} />
          <span>{t('summary_new_game')}</span>
        </button>
      </div>
    </div>
  );
};
