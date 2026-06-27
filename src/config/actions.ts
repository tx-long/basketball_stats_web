export interface ActionOption {
  id: string;
  label: string;
  value?: number;
  subOptions?: ActionOption[];
  isFinal?: boolean;
}

export interface GameAction {
  id: string;
  label: string;
  icon: string;
  options?: ActionOption[];
  isFinal?: boolean;
}

export const BASKETBALL_ACTIONS: GameAction[] = [
  {
    id: 'shot',
    label: 'Shot',
    icon: 'basketball',
    options: [
      {
        id: 'made',
        label: 'Made',
        subOptions: [
          { id: '1pt', label: '1 Point (FT)', value: 1, isFinal: true },
          { id: '2pt', label: '2 Points', value: 2, isFinal: true },
          { id: '3pt', label: '3 Points', value: 3, isFinal: true },
        ],
      },
      {
        id: 'missed',
        label: 'Missed',
        subOptions: [
          { id: 'miss_1pt', label: '1 Point (FT)', value: 0, isFinal: true },
          { id: 'miss_2pt', label: '2 Points', value: 0, isFinal: true },
          { id: 'miss_3pt', label: '3 Points', value: 0, isFinal: true },
        ],
      },
    ],
  },
  {
    id: 'rebound',
    label: 'Rebound',
    icon: 'arrow-up',
    options: [
      { id: 'offensive', label: 'Offensive', isFinal: true },
      { id: 'defensive', label: 'Defensive', isFinal: true },
    ],
  },
  {
    id: 'assist',
    label: 'Assist',
    icon: 'hands-helping',
    isFinal: true,
  },
  {
    id: 'steal',
    label: 'Steal',
    icon: 'hand-paper',
    isFinal: true,
  },
  {
    id: 'block',
    label: 'Block',
    icon: 'shield-alt',
    isFinal: true,
  },
  {
    id: 'turnover',
    label: 'Turnover',
    icon: 'exchange-alt',
    options: [
      { id: 'turnover_badpass', label: 'Bad Pass', isFinal: true },
      { id: 'turnover_handling', label: 'Ball Handling', isFinal: true },
      { id: 'turnover_violation', label: 'Violation', isFinal: true },
      { id: 'turnover_offensivefoul', label: 'Offensive Foul', isFinal: true },
    ],
  },
  {
    id: 'foul',
    label: 'Foul',
    icon: 'exclamation-triangle',
    options: [
      { id: 'foul_personal', label: 'Personal Foul', isFinal: true },
      { id: 'foul_offensive', label: 'Offensive Foul', isFinal: true },
      { id: 'foul_technical', label: 'Technical Foul', isFinal: true },
      { id: 'foul_unsportsmanlike', label: 'Unsportsmanlike Foul', isFinal: true },
    ],
  },
  {
    id: 'fouldrawn',
    label: 'Foul Drawn',
    icon: 'hand-point-right',
    isFinal: true,
  },
  {
    id: 'substitution',
    label: 'Substitution',
    icon: 'random',
    isFinal: true,
  },
];
