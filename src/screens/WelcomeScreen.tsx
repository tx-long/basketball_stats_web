import { useGame } from '../context/GameContext';

export const WelcomeScreen = ({ navigation }: any) => {
  const { t } = useGame();
  const appName = 'GBA';

  const splitAppName = (name: string) => {
    for (let i = 1; i < name.length; i++) {
      if (name[i] >= 'A' && name[i] <= 'Z') {
        return [name.substring(0, i), name.substring(i)];
      }
    }
    const mid = Math.ceil(name.length / 2);
    return [name.substring(0, mid), name.substring(mid)];
  };

  const [firstPart, secondPart] = splitAppName(appName);

  return (
    <div className="welcome-container">
      <img src="/logo.png" className="welcome-logo-img" alt="GBA Logo" />
      <h1 className="welcome-logo">
        {firstPart}<span>{secondPart}</span>
      </h1>
      <p className="welcome-subtitle">{t('welcome_subtitle')}</p>
      
      <button 
        className="welcome-start-btn"
        onClick={() => navigation.navigate('Setup')}
      >
        {t('welcome_start_btn')}
      </button>
      
      <p className="welcome-description">{t('welcome_description')}</p>
    </div>
  );
};
