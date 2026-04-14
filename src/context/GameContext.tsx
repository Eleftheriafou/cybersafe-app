import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import type { GameState, GameAction, RoleId } from '@/types';
import { getScenariosForRole } from '@/data/scenarios';

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: GameState = {
  currentScreen: 'intro',
  selectedRole: null,
  scenarios: [],
  currentScenarioIndex: 0,
  answers: [],
  score: 0,
  maxPossibleScore: 0,
  startedAt: null,
  completedAt: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'GO_TO_ROLE_SELECTION':
      return { ...state, currentScreen: 'role-selection' };

    case 'START_GAME': {
      const maxPossibleScore = action.scenarios.reduce((sum, s) => {
        const best = Math.max(...s.choices.map((c) => c.scoreImpact));
        return sum + Math.max(0, best);
      }, 0);
      return {
        ...state,
        selectedRole: action.role,
        scenarios: action.scenarios,
        currentScenarioIndex: 0,
        answers: [],
        score: 0,
        maxPossibleScore,
        currentScreen: 'game',
        startedAt: new Date(),
        completedAt: null,
      };
    }

    case 'SUBMIT_ANSWER':
      return {
        ...state,
        answers: [...state.answers, action.answer],
        // Score floor at 0 — penalties can't take you negative
        score: Math.max(0, state.score + action.answer.scoreImpact),
      };

    case 'NEXT_SCENARIO': {
      const next = state.currentScenarioIndex + 1;
      if (next >= state.scenarios.length) {
        return { ...state, currentScreen: 'results', completedAt: new Date() };
      }
      return { ...state, currentScenarioIndex: next };
    }

    case 'RESTART':
      return { ...initialState };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface GameContextValue {
  state: GameState;
  /** Navigate intro → role-selection */
  goToRoleSelection: () => void;
  /** Confirm role and begin the game in one atomic step */
  beginGame: (role: RoleId) => void;
  submitAnswer: (scenarioId: string, choiceId: string, isCorrect: boolean, scoreImpact: number) => void;
  nextScenario: () => void;
  restart: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const goToRoleSelection = () => dispatch({ type: 'GO_TO_ROLE_SELECTION' });

  // Role + scenarios go into a single dispatch so they land in one state update.
  // This avoids the stale-closure bug that occurs when two dispatches are called
  // back-to-back and the second one reads role from the pre-first-dispatch state.
  const beginGame = (role: RoleId) => {
    const scenarios = getScenariosForRole(role);
    dispatch({ type: 'START_GAME', role, scenarios });
  };

  const submitAnswer = (
    scenarioId: string,
    choiceId: string,
    isCorrect: boolean,
    scoreImpact: number,
  ) => dispatch({ type: 'SUBMIT_ANSWER', answer: { scenarioId, choiceId, isCorrect, scoreImpact } });

  const nextScenario = () => dispatch({ type: 'NEXT_SCENARIO' });

  const restart = () => dispatch({ type: 'RESTART' });

  return (
    <GameContext.Provider value={{ state, goToRoleSelection, beginGame, submitAnswer, nextScenario, restart }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within <GameProvider>');
  return ctx;
}
