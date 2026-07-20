import { useContext } from 'react';
import { BattleContext } from '../context/BattleContext';

export function useBattle() {
  const context = useContext(BattleContext);

  if (!context) {
    throw new Error('useBattle must be used inside a BattleProvider.');
  }

  return context;
}