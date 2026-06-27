import type { Team, GameEvent, PlayerStats } from '../types';

const generateTeamTableHTML = (team: Team, stats: PlayerStats[], starters: string[] = [], language: 'VN' | 'EN' = 'VN') => {
  const teamAbbr = team.name.slice(0, 3).toUpperCase();

  // Calculate team totals
  let totalFgM = 0, totalFgA = 0;
  let totalTwoM = 0, totalTwoA = 0;
  let totalThreeM = 0, totalThreeA = 0;
  let totalFtM = 0, totalFtA = 0;
  let totalOR = 0, totalDR = 0, totalTOT = 0;
  let totalAS = 0, totalTO = 0, totalST = 0, totalBS = 0;
  let totalPF = 0, totalFD = 0;
  let totalPlusMinus = 0;
  let totalEF = 0;
  let totalPTS = 0;

  stats.forEach(p => {
    if (p.played) {
      totalFgM += p.fgMade;
      totalFgA += p.fgAttempted;
      totalTwoM += p.twoPtMade;
      totalTwoA += p.twoPtAttempted;
      totalThreeM += p.threePtMade;
      totalThreeA += p.threePtAttempted;
      totalFtM += p.ftMade;
      totalFtA += p.ftAttempted;
      totalOR += p.offReb;
      totalDR += p.defReb;
      totalTOT += p.rebounds;
      totalAS += p.assists;
      totalTO += p.turnovers;
      totalST += p.steals;
      totalBS += p.blocks;
      totalPF += p.fouls;
      totalFD += p.foulsDrawn;
      totalPlusMinus += p.plusMinus;
      totalEF += p.efficiency;
      totalPTS += p.points;
    }
  });

  const getPercent = (made: number, att: number) => {
    return att > 0 ? (made / att * 100).toFixed(1) : '0.0';
  };

  const rowsHTML = stats.map(p => {
    const isStarter = starters.includes(p.id);
    const starterMarker = isStarter ? '*' : '';

    if (!p.played) {
      return `
        <tr>
          <td>${starterMarker}${p.number}</td>
          <td class="player-name">${p.name}</td>
          <td colspan="19">DNP</td>
        </tr>
      `;
    }

    return `
      <tr>
        <td>${starterMarker}${p.number}</td>
        <td class="player-name">${p.name}</td>
        <td>${p.fgMade}/${p.fgAttempted}</td>
        <td>${getPercent(p.fgMade, p.fgAttempted)}</td>
        <td>${p.twoPtMade}/${p.twoPtAttempted}</td>
        <td>${getPercent(p.twoPtMade, p.twoPtAttempted)}</td>
        <td>${p.threePtMade}/${p.threePtAttempted}</td>
        <td>${getPercent(p.threePtMade, p.threePtAttempted)}</td>
        <td>${p.ftMade}/${p.ftAttempted}</td>
        <td>${getPercent(p.ftMade, p.ftAttempted)}</td>
        <td>${p.offReb}</td>
        <td>${p.defReb}</td>
        <td>${p.rebounds}</td>
        <td>${p.assists}</td>
        <td>${p.turnovers}</td>
        <td>${p.steals}</td>
        <td>${p.blocks}</td>
        <td>${p.fouls}</td>
        <td>${p.foulsDrawn}</td>
        <td>${p.efficiency}</td>
        <td><strong>${p.points}</strong></td>
      </tr>
    `;
  }).join('');

  // Team/Coach visual row matching FIBA box score
  const teamRowLabel = language === 'VN' ? 'Đội / HLV' : 'Team/Coach';
  const teamRowHTML = `
    <tr class="team-row">
      <td></td>
      <td class="player-name">${teamRowLabel}</td>
      <td></td><td></td>
      <td></td><td></td>
      <td></td><td></td>
      <td></td><td></td>
      <td>0</td><td>0</td><td>0</td>
      <td></td><td>0</td><td></td><td></td>
      <td>0</td><td></td>
      <td></td><td></td>
    </tr>
  `;

  // Totals bottom row
  const totalsLabel = language === 'VN' ? 'Tổng cộng' : 'Totals';
  const totalsRowHTML = `
    <tr class="total-row">
      <td></td>
      <td class="player-name">${totalsLabel}</td>
      <td>${totalFgM}/${totalFgA}</td>
      <td>${getPercent(totalFgM, totalFgA)}</td>
      <td>${totalTwoM}/${totalTwoA}</td>
      <td>${getPercent(totalTwoM, totalTwoA)}</td>
      <td>${totalThreeM}/${totalThreeA}</td>
      <td>${getPercent(totalThreeM, totalThreeA)}</td>
      <td>${totalFtM}/${totalFtA}</td>
      <td>${getPercent(totalFtM, totalFtA)}</td>
      <td>${totalOR}</td>
      <td>${totalDR}</td>
      <td>${totalTOT}</td>
      <td>${totalAS}</td>
      <td>${totalTO}</td>
      <td>${totalST}</td>
      <td>${totalBS}</td>
      <td>${totalPF}</td>
      <td>${totalFD}</td>
      <td>${totalEF}</td>
      <td><strong>${totalPTS}</strong></td>
    </tr>
  `;

  const coachLabel = language === 'VN' ? 'HLV Trưởng:' : 'Coach:';
  const assistantCoachLabel = language === 'VN' ? 'Trợ lý HLV:' : 'Assistant Coach(es):';

  const tableHeaderNo = language === 'VN' ? 'Số' : 'No';
  const tableHeaderName = language === 'VN' ? 'Tên VĐV' : 'Name';
  const tableHeaderFG = language === 'VN' ? 'Ném rổ' : 'Field Goals';
  const tableHeader2PT = language === 'VN' ? 'Ném 2đ' : '2 Points';
  const tableHeader3PT = language === 'VN' ? 'Ném 3đ' : '3 Points';
  const tableHeaderFT = language === 'VN' ? 'Ném phạt' : 'Free Throws';
  const tableHeaderReb = language === 'VN' ? 'Bắt bóng' : 'Rebounds';
  const tableHeaderFouls = language === 'VN' ? 'Lỗi' : 'Fouls';

  const coachName = team.coach || '___________________';
  const assistantCoachName = team.assistantCoach || '___________________';

  return `
    <div class="team-section">
      <div class="header-section">
        <div class="team-title">${team.name} (${teamAbbr})</div>
        <div class="coaches-info">
          ${coachLabel} <strong>${coachName}</strong> &nbsp;&nbsp;&nbsp;&nbsp; ${assistantCoachLabel} <strong>${assistantCoachName}</strong>
        </div>
      </div>
      <table class="stats-table">
        <thead>
          <tr>
            <th rowspan="2" style="width: 3%">${tableHeaderNo}</th>
            <th rowspan="2" style="width: 15%">${tableHeaderName}</th>
            <th colspan="2" style="width: 10%">${tableHeaderFG}</th>
            <th colspan="2" style="width: 10%">${tableHeader2PT}</th>
            <th colspan="2" style="width: 10%">${tableHeader3PT}</th>
            <th colspan="2" style="width: 10%">${tableHeaderFT}</th>
            <th colspan="3" style="width: 10%">${tableHeaderReb}</th>
            <th rowspan="2" style="width: 3%">AS</th>
            <th rowspan="2" style="width: 3%">TO</th>
            <th rowspan="2" style="width: 3%">ST</th>
            <th rowspan="2" style="width: 3%">BS</th>
            <th colspan="2" style="width: 6%">${tableHeaderFouls}</th>
            <th rowspan="2" style="width: 3%">EF</th>
            <th rowspan="2" style="width: 4%">PTS</th>
          </tr>
          <tr>
            <th>M/A</th>
            <th>%</th>
            <th>M/A</th>
            <th>%</th>
            <th>M/A</th>
            <th>%</th>
            <th>M/A</th>
            <th>%</th>
            <th>OR</th>
            <th>DR</th>
            <th>TOT</th>
            <th>PF</th>
            <th>FD</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
          ${teamRowHTML}
          ${totalsRowHTML}
        </tbody>
      </table>
    </div>
  `;
};

export const exportToPDF = (
  teamA: Team,
  teamB: Team,
  statsA: PlayerStats[],
  statsB: PlayerStats[],
  startersA: string[] = [],
  startersB: string[] = [],
  language: 'VN' | 'EN' = 'VN'
) => {
  const pdfTitle = language === 'VN' ? 'Bản Thống Kê Chỉ Số Trận Đấu' : 'Match Box Score Summary';
  
  // Helper to sanitize team names for file system compatibility
  const sanitizeFilename = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric with underscore
      .replace(/_+/g, '_') // Eliminate duplicate underscores
      .trim();
  };

  const sanitizedTeamA = sanitizeFilename(teamA.name);
  const sanitizedTeamB = sanitizeFilename(teamB.name);

  // Format current local time: YYYYMMDD_HHmmss
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  const timeString = `${year}${month}${day}_${hour}${minute}${second}`;
  const customName = `${sanitizedTeamA}_${sanitizedTeamB}_${timeString}`;

  const html = `
    <html>
      <head>
        <meta charset="utf-8">
        <title>${customName}</title>
        <style>
          @media print {
            @page {
              size: A4 landscape;
              margin: 10mm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #000000;
            margin: 0;
            padding: 15px;
            font-size: 10px;
            background-color: #FFFFFF;
          }
          .title-box {
            text-align: center;
            font-size: 20px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
            border-bottom: 3px double #000000;
            padding-bottom: 5px;
          }
          .team-section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .header-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 6px;
          }
          .team-title {
            font-size: 15px;
            font-weight: 900;
            text-transform: uppercase;
          }
          .coaches-info {
            font-size: 9px;
            font-weight: bold;
          }
          .stats-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
          }
          .stats-table th, .stats-table td {
            border: 1px solid #000000;
            padding: 5px 3px;
            text-align: center;
            vertical-align: middle;
            font-size: 9px;
          }
          .stats-table th {
            background-color: #EAEAEA !important;
            font-weight: bold;
            text-transform: uppercase;
          }
          .stats-table td.player-name {
            text-align: left;
            padding-left: 6px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .stats-table tr.team-row td {
            font-weight: bold;
            background-color: #F8F9FA !important;
          }
          .stats-table tr.total-row td {
            font-weight: bold;
            background-color: #ECECEC !important;
            border-top: 2px double #000000;
          }
        </style>
      </head>
      <body>
        <div class="title-box">${pdfTitle}</div>
        ${generateTeamTableHTML(teamA, statsA, startersA, language)}
        ${generateTeamTableHTML(teamB, statsB, startersB, language)}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    alert(language === 'VN' ? 'Không thể mở cửa sổ in. Vui lòng tắt chặn pop-up!' : 'Could not open print window. Please disable pop-up blocker!');
  }
};

export const exportToText = (events: GameEvent[], teamA: Team, teamB: Team, language: 'VN' | 'EN' = 'VN') => {
  let log = language === 'VN' 
    ? `NHẬT KÝ TRẬN ĐẤU: ${teamA.name} vs ${teamB.name}\n`
    : `GAME LOG: ${teamA.name} vs ${teamB.name}\n`;
  log += language === 'VN'
    ? `KẾT QUẢ CHUNG CUỘC: ${teamA.score} - ${teamB.score}\n\n`
    : `FINAL SCORE: ${teamA.score} - ${teamB.score}\n\n`;
  log += language === 'VN'
    ? `Thời gian | Đội | Cầu thủ | Hành động | Chi tiết\n`
    : `Time | Team | Player | Action | Details\n`;
  log += `--------------------------------------------------\n`;

  const allPlayers = [...teamA.players, ...teamB.players];
  events.forEach(e => {
    const time = new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const teamName = e.teamId === 'teamA' ? teamA.name : teamB.name;
    const player = allPlayers.find(p => p.id === e.playerId);
    const playerName = player ? `${player.name} (#${player.number})` : 'Unknown';
    log += `[${time}] ${teamName} - ${playerName}: ${e.actionLabel} (${e.details || ''})\n`;
  });

  const blob = new Blob([log], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `game_log_${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
