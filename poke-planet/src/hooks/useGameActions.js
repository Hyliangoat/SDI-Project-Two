import { useContext } from "react";
import { GameActionsContext } from "../context/GameActionsContext";
export function useGameActions() {
  const value = useContext(GameActionsContext);
  if (!value)
    throw new Error("useGameActions must be used within GameDataProvider.");
  return value;
}
