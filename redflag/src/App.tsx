import './index.css';
import { useGame } from './hooks/useGame';
import HomePage from './components/HomePage';
import SetupPage from './components/SetupPage';
import TurnIntro from './components/TurnIntro';
import SuspenseScreen from './components/SuspenseScreen';
import SwipeCard from './components/SwipeCard';
import ResultsScreen from './components/ResultsScreen';
import GreenFlagOffer from './components/GreenFlagOffer';
import ExPartnerOffer from './components/ExPartnerOffer';

function App() {
  const { state, currentPlayer, statistics, goToScreen, start, prepareTurn, accept, reject, acceptGreen, rejectGreen, acceptEx, rejectEx, endEarly, reset } = useGame();

  return (
    <div className="flex flex-col min-h-svh bg-[#F0F0F0]">
      {state.screen === 'home' && (
        <HomePage onStart={() => goToScreen('setup')} />
      )}

      {state.screen === 'setup' && (
        <SetupPage
          onStart={(players) => start(players)}
          onBack={() => goToScreen('home')}
        />
      )}

      {state.screen === 'turn-intro' && currentPlayer && (
        <TurnIntro
          player={currentPlayer}
          onReady={() => prepareTurn()}
          onEndGame={endEarly}
        />
      )}

      {state.screen === 'suspense' && (
        <SuspenseScreen
          onComplete={() => goToScreen('swipe')}
          isSamePartner={state.currentTurn !== null && state.currentTurn.acceptedInTurn.length > 0}
          currentStageIndex={currentPlayer?.currentStageIndex ?? 0}
        />
      )}

      {state.screen === 'swipe' && state.currentTurn && currentPlayer && (
        <SwipeCard
          turn={state.currentTurn}
          player={currentPlayer}
          onAccept={accept}
          onReject={reject}
          onEndGame={endEarly}
        />
      )}

      {state.screen === 'green-flag-offer' && state.greenFlagOffer && currentPlayer && (
        <GreenFlagOffer
          offer={state.greenFlagOffer}
          player={currentPlayer}
          onAccept={acceptGreen}
          onReject={rejectGreen}
        />
      )}

      {state.screen === 'ex-partner-offer' && state.exPartnerOffer && currentPlayer && (
        <ExPartnerOffer
          offer={state.exPartnerOffer}
          player={currentPlayer}
          onAccept={acceptEx}
          onReject={rejectEx}
        />
      )}

      {state.screen === 'results' && statistics && (
        <ResultsScreen statistics={statistics} onRestart={reset} />
      )}
    </div>
  );
}

export default App;
