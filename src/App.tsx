import { GameProvider, useGame } from '@/context/GameContext';
import { Layout } from '@/components/layout/Layout';
import { IntroScreen } from '@/screens/IntroScreen';
import { RoleSelectionScreen } from '@/screens/RoleSelectionScreen';
import { GameScreen } from '@/screens/GameScreen';
import { ResultsScreen } from '@/screens/ResultsScreen';

function AppScreens() {
  const { state } = useGame();

  const screens = {
    intro:           <IntroScreen />,
    'role-selection': <RoleSelectionScreen />,
    game:            <GameScreen />,
    results:         <ResultsScreen />,
  };

  return (
    <Layout>
      {screens[state.currentScreen]}
    </Layout>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppScreens />
    </GameProvider>
  );
}
