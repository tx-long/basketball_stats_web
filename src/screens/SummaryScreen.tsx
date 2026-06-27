import { useGame } from '../context/GameContext';
import { exportToPDF, exportToText } from '../services/exportService';
import { FileText, FileDown, RotateCcw } from 'lucide-react';

export const SummaryScreen = ({ navigation }: any) => {
  const { teamA, teamB, events, getPlayerStats, resetGame, startersA, startersB, language, t } = useGame();

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

  const renderStatsTable = (teamName: string, stats: any[]) => (
    <div className="summary-table-section">
      <h3 className="summary-table-title">{teamName}</h3>
      <div className="summary-table-wrapper">
        <table className="summary-table">
          <thead>
            <tr>
              <th className="summary-cell-num">#</th>
              <th>{language === 'VN' ? 'Tên VĐV' : 'Name'}</th>
              <th>PTS</th>
              <th>REB</th>
              <th>AST</th>
              <th>STL</th>
              <th>BLK</th>
              <th>TO</th>
              <th>PF</th>
            </tr>
          </thead>
          <tbody>
            {stats.map(s => (
              <tr key={s.id}>
                <td className="summary-cell-num">{s.number}</td>
                <td className="summary-cell-name">{s.name}</td>
                <td className="summary-cell-bold">{s.points}</td>
                <td>{s.rebounds}</td>
                <td>{s.assists}</td>
                <td>{s.steals}</td>
                <td>{s.blocks}</td>
                <td>{s.turnovers}</td>
                <td>{s.fouls}</td>
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
