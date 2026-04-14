import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useGame } from '@/context/GameContext';
import { ContextMockup } from '@/components/game/ContextMockup';
import type { Choice } from '@/types';

const difficultyVariant = { easy: 'success', medium: 'warning', hard: 'danger' } as const;

const categoryLabels: Record<string, string> = {
  'phishing':           'Phishing',
  'social-engineering': 'Social Engineering',
  'password-security':  'Passwords',
  'data-handling':      'Data Handling',
  'physical-security':  'Physical Security',
  'incident-response':  'Incident Response',
};

// ─── Progress dots ────────────────────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i < current
              ? 'w-2.5 h-2.5 bg-brand-500'
              : i === current
              ? 'w-3.5 h-3.5 bg-white ring-2 ring-brand-400'
              : 'w-2.5 h-2.5 bg-white/20'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Animated score display ───────────────────────────────────────────────────

function ScoreDisplay({ score, delta }: { score: number; delta: number | null }) {
  return (
    <div className="relative flex items-center gap-1">
      <span className="text-slate-400 text-sm">Score:</span>
      <span
        key={score}
        className="text-white font-bold text-sm tabular-nums animate-score-pop"
      >
        {score}
      </span>
      {delta !== null && (
        <span
          className={`absolute -top-5 right-0 text-xs font-bold tabular-nums animate-fade-up ${
            delta >= 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {delta > 0 ? '+' : ''}{delta}
        </span>
      )}
    </div>
  );
}

// ─── Choice button ────────────────────────────────────────────────────────────

type ChoiceState = 'idle' | 'picked-correct' | 'picked-wrong' | 'reveal-correct' | 'dimmed';

const LABELS = ['A', 'B', 'C', 'D'];

interface ChoiceButtonProps {
  choice: Choice;
  choiceState: ChoiceState;
  index: number;
  onClick: () => void;
}

function ChoiceButton({ choice, choiceState, index, onClick }: ChoiceButtonProps) {
  const isIdle = choiceState === 'idle';

  const containerCls: Record<ChoiceState, string> = {
    idle:             'bg-white border-slate-200 hover:border-brand-400 hover:bg-brand-50 hover:shadow-md cursor-pointer',
    'picked-correct': 'bg-green-50 border-green-500 shadow-sm cursor-default animate-fade-in',
    'picked-wrong':   'bg-red-50 border-red-400 shadow-sm cursor-default animate-shake',
    'reveal-correct': 'bg-green-50 border-green-400 border-dashed cursor-default animate-fade-in',
    dimmed:           'bg-slate-50 border-slate-100 opacity-40 cursor-default',
  };

  const labelCls: Record<ChoiceState, string> = {
    idle:             'bg-slate-100 text-slate-500',
    'picked-correct': 'bg-green-500 text-white',
    'picked-wrong':   'bg-red-400 text-white',
    'reveal-correct': 'bg-green-400 text-white',
    dimmed:           'bg-slate-200 text-slate-300',
  };

  const textCls: Record<ChoiceState, string> = {
    idle:             'text-slate-700',
    'picked-correct': 'text-green-800 font-medium',
    'picked-wrong':   'text-red-800 font-medium',
    'reveal-correct': 'text-green-700',
    dimmed:           'text-slate-400',
  };

  const icon =
    choiceState === 'picked-correct' ? '✓' :
    choiceState === 'picked-wrong'   ? '✗' :
    choiceState === 'reveal-correct' ? '✓' :
    LABELS[index] ?? String(index + 1);

  return (
    <button
      disabled={!isIdle}
      onClick={onClick}
      className={`w-full text-left rounded-xl border px-4 py-3.5 flex items-start gap-3 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${containerCls[choiceState]}`}
    >
      <span className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-150 ${labelCls[choiceState]}`}>
        {icon}
      </span>
      <span className={`text-sm leading-relaxed ${textCls[choiceState]}`}>
        {choice.text}
      </span>
    </button>
  );
}

// ─── Feedback panel ───────────────────────────────────────────────────────────

interface FeedbackPanelProps {
  isCorrect: boolean;
  scoreImpact: number;
  explanation: string;
  lesson: string;
  isLastScenario: boolean;
  onContinue: () => void;
}

function FeedbackPanel({ isCorrect, scoreImpact, explanation, lesson, isLastScenario, onContinue }: FeedbackPanelProps) {
  return (
    <div className={`rounded-xl border overflow-hidden animate-fade-up ${isCorrect ? 'border-green-300' : 'border-red-300'}`}>
      {/* Result header */}
      <div className={`px-5 py-4 flex items-center gap-3 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
        <span className="text-xl flex-shrink-0">{isCorrect ? '✅' : '❌'}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-tight">
            {isCorrect ? 'Correct!' : 'Not quite.'}
          </p>
          <p className="text-white/80 text-xs mt-0.5 leading-tight">
            {isCorrect
              ? 'Good security instincts.'
              : 'This is a common mistake — here\'s what to look for.'}
          </p>
        </div>
        <span className={`flex-shrink-0 text-sm font-bold tabular-nums px-2.5 py-1 rounded-full ${
          isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {scoreImpact > 0 ? '+' : ''}{scoreImpact} pts
        </span>
      </div>

      {/* Why */}
      <div className={`px-5 py-4 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          {isCorrect ? 'Why this was the right call' : 'What went wrong'}
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">{explanation}</p>
      </div>

      {/* Key lesson */}
      <div className="px-5 py-4 bg-brand-50 border-t border-brand-100">
        <div className="flex items-start gap-3">
          <span className="text-lg flex-shrink-0">💡</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700 mb-1">
              Key Lesson
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">{lesson}</p>
          </div>
        </div>
      </div>

      {/* Continue */}
      <div className="px-5 py-4 bg-white border-t border-slate-100 flex justify-end">
        <Button onClick={onContinue} size="md">
          {isLastScenario ? 'See My Results →' : 'Next Question →'}
        </Button>
      </div>
    </div>
  );
}

// ─── Game Screen ──────────────────────────────────────────────────────────────

export function GameScreen() {
  const { state, submitAnswer, nextScenario } = useGame();
  const { scenarios, currentScenarioIndex, score } = state;
  const scenario = scenarios[currentScenarioIndex];

  const [pickedId, setPickedId] = useState<string | null>(null);
  // Track the last delta for the animated score bump
  const [lastDelta, setLastDelta] = useState<number | null>(null);

  useEffect(() => {
    setPickedId(null);
    setLastDelta(null);
  }, [currentScenarioIndex]);

  if (!scenario) return null;

  const pickedChoice = scenario.choices.find((c) => c.id === pickedId) ?? null;
  const hasAnswered = pickedId !== null;
  const isLastScenario = currentScenarioIndex + 1 >= scenarios.length;

  const handlePick = (choice: Choice) => {
    if (hasAnswered) return;
    setPickedId(choice.id);
    setLastDelta(choice.scoreImpact);
  };

  const handleContinue = () => {
    if (!pickedChoice) return;
    submitAnswer(scenario.id, pickedChoice.id, pickedChoice.isCorrect, pickedChoice.scoreImpact);
    nextScenario();
  };

  const getChoiceState = (choice: Choice): ChoiceState => {
    if (!hasAnswered) return 'idle';
    if (choice.id === pickedId) return choice.isCorrect ? 'picked-correct' : 'picked-wrong';
    if (!pickedChoice?.isCorrect && choice.isCorrect) return 'reveal-correct';
    return 'dimmed';
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-xs font-medium">
          {currentScenarioIndex + 1} / {scenarios.length}
        </span>
        <ScoreDisplay score={score} delta={hasAnswered ? lastDelta : null} />
      </div>

      {/* Progress dots */}
      <ProgressDots total={scenarios.length} current={currentScenarioIndex} />

      {/* Scenario card */}
      <div className="rounded-xl bg-white border border-slate-200 p-5 sm:p-6 flex flex-col gap-4 shadow-sm animate-fade-in">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={difficultyVariant[scenario.difficulty]}>
            {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
          </Badge>
          <Badge variant="info">
            {categoryLabels[scenario.category] ?? scenario.category}
          </Badge>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">
          {scenario.title}
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">{scenario.description}</p>

        {/* Contextual evidence mockup */}
        {scenario.context && (
          <ContextMockup
            context={scenario.context}
            contextType={scenario.contextType ?? 'plain'}
          />
        )}
      </div>

      {/* Choices */}
      {!hasAnswered && (
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          What do you do?
        </p>
      )}
      <div className="flex flex-col gap-2.5">
        {scenario.choices.map((choice, i) => (
          <ChoiceButton
            key={choice.id}
            choice={choice}
            choiceState={getChoiceState(choice)}
            index={i}
            onClick={() => handlePick(choice)}
          />
        ))}
      </div>

      {/* Feedback */}
      {hasAnswered && pickedChoice && (
        <FeedbackPanel
          isCorrect={pickedChoice.isCorrect}
          scoreImpact={pickedChoice.scoreImpact}
          explanation={pickedChoice.feedback}
          lesson={scenario.lesson}
          isLastScenario={isLastScenario}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
