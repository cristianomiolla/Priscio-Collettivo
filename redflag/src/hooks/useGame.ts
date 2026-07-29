import { useState, useCallback, useEffect } from 'react';
import type { GameState, Player, Screen } from '../types';
import {
  createInitialState,
  startGame,
  generateTurn,
  acceptFlag,
  rejectFlag,
  acceptGreenFlag,
  rejectGreenFlag,
  tryExPartnerOffer,
  acceptExPartner,
  rejectExPartner,
  calculateStatistics,
  endGameEarly,
  saveGameState,
  loadGameState,
  clearSavedGame,
} from '../game/engine';

export function useGame() {
  const [state, setState] = useState<GameState>(() => {
    const saved = loadGameState();
    if (saved && saved.players.length > 0 && saved.currentPlayerIndex < saved.players.length) {
      // If we have a saved turn, resume at turn-intro keeping the turn data
      // so acceptedInTurn is preserved; otherwise start fresh at turn-intro
      return { ...saved, screen: 'turn-intro' as Screen };
    }
    if (saved) clearSavedGame();
    return createInitialState();
  });

  // Persist state changes
  useEffect(() => {
    saveGameState(state);
  }, [state]);

  const goToScreen = useCallback((screen: Screen) => {
    setState((prev) => ({ ...prev, screen }));
  }, []);

  const start = useCallback((players: Player[]) => {
    setState(startGame(players));
  }, []);

  const prepareTurn = useCallback(() => {
    setState((prev) => {
      // If we already have a saved turn (e.g. after page reload), reuse it
      if (prev.currentTurn && prev.currentTurn.acceptedInTurn.length > 0) {
        const savedTurn = prev.currentTurn;
        // Generate a new red flag for the same partner, keeping accepted history
        const turn = generateTurn(prev, savedTurn.partner, savedTurn.acceptedInTurn);
        if (!turn) return prev;
        return { ...prev, currentTurn: turn, screen: 'suspense' };
      }

      // Try to offer an ex partner before generating a new one
      const withExOffer = tryExPartnerOffer(prev);
      if (withExOffer.exPartnerOffer) return withExOffer;

      const turn = generateTurn(prev);
      if (!turn) return prev;
      return { ...prev, currentTurn: turn, screen: 'suspense' };
    });
  }, []);

  const accept = useCallback(() => {
    setState((prev) => acceptFlag(prev));
  }, []);

  const reject = useCallback(() => {
    setState((prev) => rejectFlag(prev));
  }, []);

  const acceptGreen = useCallback(() => {
    setState((prev) => acceptGreenFlag(prev));
  }, []);

  const rejectGreen = useCallback(() => {
    setState((prev) => rejectGreenFlag(prev));
  }, []);

  const acceptEx = useCallback(() => {
    setState((prev) => acceptExPartner(prev));
  }, []);

  const rejectEx = useCallback(() => {
    setState((prev) => {
      const afterReject = rejectExPartner(prev);
      // After rejecting ex, proceed with normal turn generation
      const turn = generateTurn(afterReject);
      if (!turn) return afterReject;
      return { ...afterReject, currentTurn: turn, screen: 'suspense' };
    });
  }, []);

  const endEarly = useCallback(() => {
    setState((prev) => endGameEarly(prev));
  }, []);

  const reset = useCallback(() => {
    clearSavedGame();
    setState(createInitialState());
  }, []);

  const currentPlayer = state.players[state.currentPlayerIndex] ?? null;
  const statistics = state.isFinished ? calculateStatistics(state.players) : null;

  return {
    state,
    currentPlayer,
    statistics,
    goToScreen,
    start,
    prepareTurn,
    accept,
    reject,
    acceptGreen,
    rejectGreen,
    acceptEx,
    rejectEx,
    endEarly,
    reset,
  };
}
