// ─── Domain Enums ────────────────────────────────────────────────────────────

export type Screen = 'intro' | 'role-selection' | 'game' | 'results';

export type RoleId = 'employee' | 'manager' | 'it-admin' | 'executive';

export type ScenarioCategory =
  | 'phishing'
  | 'social-engineering'
  | 'password-security'
  | 'data-handling'
  | 'physical-security'
  | 'incident-response';

export type Difficulty = 'easy' | 'medium' | 'hard';

// ─── Core Data Models ─────────────────────────────────────────────────────────

export interface Role {
  id: RoleId;
  label: string;
  description: string;
  icon: string;
  focusAreas: ScenarioCategory[];
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  /** Shown after the player picks this option */
  feedback: string;
  /** Points awarded (negative values penalise) */
  scoreImpact: number;
}

export type ContextType = 'email' | 'sms' | 'browser' | 'poster' | 'phone' | 'social' | 'plain';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  /** Optional context artefact (email body, SMS, etc.) */
  context?: string;
  /** How to render the context block */
  contextType?: ContextType;
  category: ScenarioCategory;
  difficulty: Difficulty;
  choices: Choice[];
  /** The single takeaway shown after the scenario is answered */
  lesson: string;
  /** When set, only shown to these roles */
  roleFilter?: RoleId[];
}

// ─── Game State ───────────────────────────────────────────────────────────────

export interface Answer {
  scenarioId: string;
  choiceId: string;
  isCorrect: boolean;
  scoreImpact: number;
}

export interface GameState {
  currentScreen: Screen;
  selectedRole: RoleId | null;
  scenarios: Scenario[];
  currentScenarioIndex: number;
  answers: Answer[];
  score: number;
  maxPossibleScore: number;
  startedAt: Date | null;
  completedAt: Date | null;
}

// ─── Game Actions ─────────────────────────────────────────────────────────────

export type GameAction =
  | { type: 'GO_TO_ROLE_SELECTION' }
  | { type: 'START_GAME'; role: RoleId; scenarios: Scenario[] }
  | { type: 'SUBMIT_ANSWER'; answer: Answer }
  | { type: 'NEXT_SCENARIO' }
  | { type: 'RESTART' };
