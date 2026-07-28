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
      // Resume at the turn-intro so player can re-orient
      return { ...saved, screen: 'turn-intro' as Screen, currentTurn: null };
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
    endEarly,
    reset,
  };
}
