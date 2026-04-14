import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useGame } from '@/context/GameContext';
import { ROLES } from '@/data/roles';

// ─── Risk Profile Definition ──────────────────────────────────────────────────

type RiskProfile = {
  id: 'risk-averse' | 'neutral' | 'risky' | 'red-peril';
  label: string;
  tagline: string;
  description: string;
  /** CSS classes for the card colour theme */
  avatar: string;
  avatarBg: string;
  avatarRing: string;
  headerBg: string;
  headerText: string;
  bodyBg: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  barColor: string;
  /** Emoji "face" + accessory layers for the cartoon avatar */
  face: string;
  hat: string;
  accessory: string;
};

const PROFILES: RiskProfile[] = [
  {
    id: 'risk-averse',
    label: 'Risk Averse',
    tagline: 'Security Champion',
    description:
      'You have sharp security instincts and consistently spot the warning signs others miss. Your careful habits protect not just yourself but everyone around you. The office is safer because of people like you.',
    avatar: 'from-green-400 to-emerald-600',
    avatarBg: 'bg-gradient-to-br from-green-400 to-emerald-600',
    avatarRing: 'ring-green-500',
    headerBg: 'bg-green-600',
    headerText: 'text-white',
    bodyBg: 'bg-green-50',
    border: 'border-green-300',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-800',
    barColor: 'bg-green-500',
    face: '😎',
    hat: '🛡️',
    accessory: '✨',
  },
  {
    id: 'neutral',
    label: 'Neutral',
    tagline: 'Security Aware',
    description:
      'You have a solid foundation and catch many common threats, but some attack patterns still slip past your radar. A little more practice will sharpen your judgment significantly.',
    avatar: 'from-amber-400 to-yellow-500',
    avatarBg: 'bg-gradient-to-br from-amber-400 to-yellow-500',
    avatarRing: 'ring-amber-400',
    headerBg: 'bg-amber-500',
    headerText: 'text-white',
    bodyBg: 'bg-amber-50',
    border: 'border-amber-300',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    barColor: 'bg-amber-400',
    face: '🤔',
    hat: '📚',
    accessory: '💭',
  },
  {
    id: 'risky',
    label: 'Risky Person',
    tagline: 'Security Liability',
    description:
      'You would likely fall for a well-crafted phishing email or social engineering attempt. The scenarios you missed are exactly the techniques attackers use in real office environments. Training is strongly recommended.',
    avatar: 'from-orange-400 to-red-500',
    avatarBg: 'bg-gradient-to-br from-orange-400 to-red-500',
    avatarRing: 'ring-orange-400',
    headerBg: 'bg-orange-500',
    headerText: 'text-white',
    bodyBg: 'bg-orange-50',
    border: 'border-orange-300',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-800',
    barColor: 'bg-orange-400',
    face: '😬',
    hat: '⚠️',
    accessory: '🪤',
  },
  {
    id: 'red-peril',
    label: 'Red Peril',
    tagline: 'Critical Threat to the Company',
    description:
      'Your security instincts put the entire organisation at risk. The attack patterns you missed are actively used by criminals targeting offices every day. Immediate, mandatory cybersecurity awareness training is required.',
    avatar: 'from-red-500 to-rose-700',
    avatarBg: 'bg-gradient-to-br from-red-500 to-rose-700',
    avatarRing: 'ring-red-500',
    headerBg: 'bg-red-700',
    headerText: 'text-white',
    bodyBg: 'bg-red-50',
    border: 'border-red-400',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-800',
    barColor: 'bg-red-500',
    face: '😱',
    hat: '🚨',
    accessory: '💀',
  },
];

function getProfile(pct: number): RiskProfile {
  if (pct >= 75) return PROFILES[0]; // Risk Averse
  if (pct >= 50) return PROFILES[1]; // Neutral
  if (pct >= 25) return PROFILES[2]; // Risky
  return PROFILES[3];                // Red Peril
}

// ─── Cartoon Profile Card ─────────────────────────────────────────────────────

interface ProfileCardProps {
  profile: RiskProfile;
  pct: number;
  score: number;
  maxPossibleScore: number;
  correctCount: number;
  totalScenarios: number;
  roleLabel?: string;
  roleIcon?: string;
}

function ProfileCard({
  profile,
  pct,
  score,
  maxPossibleScore,
  correctCount,
  totalScenarios,
  roleLabel,
  roleIcon,
}: ProfileCardProps) {
  return (
    <div className={`rounded-2xl border-2 overflow-hidden shadow-lg ${profile.border}`}>
      {/* Cartoon avatar section */}
      <div className={`${profile.headerBg} px-6 pt-8 pb-6 flex flex-col items-center gap-3 relative`}>
        {/* Decorative background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-4 -left-6 w-24 h-24 rounded-full bg-white/5" />
        </div>

        {/* Floating accessory above avatar */}
        <div className="relative z-10">
          <span
            className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl animate-bounce"
            style={{ animationDuration: '2s' }}
          >
            {profile.hat}
          </span>

          {/* Avatar circle */}
          <div
            className={`w-24 h-24 rounded-full ${profile.avatarBg} ring-4 ${profile.avatarRing} ring-offset-2 ring-offset-transparent flex items-center justify-center shadow-xl`}
          >
            <span className="text-5xl">{profile.face}</span>
          </div>

          {/* Badge overlay — bottom right of avatar */}
          <span className="absolute -bottom-1 -right-1 text-xl bg-white rounded-full shadow-md p-0.5 leading-none">
            {profile.accessory}
          </span>
        </div>

        {/* Profile name */}
        <div className="text-center relative z-10 mt-2">
          <p className={`text-xl font-extrabold tracking-tight ${profile.headerText}`}>
            {profile.label}
          </p>
          <p className={`text-sm font-medium mt-0.5 ${profile.headerText} opacity-80`}>
            {profile.tagline}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className={`grid grid-cols-3 divide-x divide-black/10 border-b border-black/10 ${profile.bodyBg}`}>
        {[
          { value: `${pct}%`, label: 'Score' },
          { value: `${correctCount}/${totalScenarios}`, label: 'Correct' },
          { value: `${score} pts`, label: 'Points' },
        ].map(({ value, label }) => (
          <div key={label} className="px-4 py-3 text-center">
            <p className="text-lg font-bold text-slate-800 tabular-nums">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Score bar */}
      <div className={`px-5 py-4 ${profile.bodyBg} border-b border-black/5`}>
        <div className="w-full bg-black/10 rounded-full h-3 overflow-hidden">
          <div
            className={`${profile.barColor} h-full rounded-full transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-slate-500">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Description */}
      <div className={`px-5 py-4 ${profile.bodyBg}`}>
        {roleLabel && (
          <p className="text-xs text-slate-400 mb-2">
            {roleIcon} Playing as <span className="font-medium text-slate-600">{roleLabel}</span>
          </p>
        )}
        <p className="text-sm text-slate-700 leading-relaxed">{profile.description}</p>
      </div>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

export function ResultsScreen() {
  const { state, restart, goToRoleSelection } = useGame();
  const { score, maxPossibleScore, answers, selectedRole, scenarios } = state;

  const pct = maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0;
  const profile = getProfile(pct);
  const role = ROLES.find((r) => r.id === selectedRole);
  const correctCount = answers.filter((a) => a.isCorrect).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Profile card */}
      <ProfileCard
        profile={profile}
        pct={pct}
        score={score}
        maxPossibleScore={maxPossibleScore}
        correctCount={correctCount}
        totalScenarios={scenarios.length}
        roleLabel={role?.label}
        roleIcon={role?.icon}
      />

      {/* CTA buttons */}
      <div className="flex gap-3">
        <Button variant="secondary" fullWidth onClick={goToRoleSelection}>
          Change Role
        </Button>
        <Button fullWidth onClick={restart}>
          Play Again
        </Button>
      </div>

      {/* Per-answer breakdown */}
      <div className="flex flex-col gap-4">
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Answer Review
        </h3>

        {answers.map((answer, i) => {
          const scenario = scenarios.find((s) => s.id === answer.scenarioId);
          const pickedChoice = scenario?.choices.find((c) => c.id === answer.choiceId);
          const correctChoice = scenario?.choices.find((c) => c.isCorrect);
          const isCorrect = answer.isCorrect;

          return (
            <div
              key={answer.scenarioId}
              className={`rounded-xl border overflow-hidden ${isCorrect ? 'border-green-200' : 'border-red-200'}`}
            >
              {/* Row header */}
              <div className={`px-4 py-3 flex items-center gap-3 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                <span className="text-sm">{isCorrect ? '✅' : '❌'}</span>
                <p className="text-white font-semibold text-sm flex-1 leading-tight">
                  {i + 1}. {scenario?.title}
                </p>
                <span className="text-white text-sm font-bold tabular-nums flex-shrink-0">
                  {answer.scoreImpact > 0 ? '+' : ''}{answer.scoreImpact} pts
                </span>
              </div>

              {/* Your answer */}
              <div className={`px-4 py-3 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Your answer
                </p>
                <p className="text-sm text-slate-700">{pickedChoice?.text}</p>

                {/* Correct answer — only shown when wrong */}
                {!isCorrect && correctChoice && (
                  <div className="mt-3 pt-3 border-t border-black/5">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
                      Correct answer
                    </p>
                    <p className="text-sm text-green-800">{correctChoice.text}</p>
                  </div>
                )}

                {/* Explanation */}
                <div className="mt-3 pt-3 border-t border-black/5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    {isCorrect ? 'Why this was right' : 'What went wrong'}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">{pickedChoice?.feedback}</p>
                </div>
              </div>

              {/* Key lesson */}
              <div className="px-4 py-3 bg-brand-50 border-t border-brand-100 flex items-start gap-3">
                <span className="text-sm flex-shrink-0 mt-0.5">💡</span>
                <div>
                  <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">
                    Key Lesson
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">{scenario?.lesson}</p>
                </div>
              </div>
            </div>
          );
        })}

        {answers.length === 0 && (
          <div className="rounded-xl bg-white border border-slate-200 p-6 text-center">
            <p className="text-slate-400 text-sm">No answers to review.</p>
          </div>
        )}
      </div>

      {/* Second restart at the bottom so it's reachable after reading */}
      <Button fullWidth onClick={restart} className="mb-4">
        Play Again
      </Button>
    </div>
  );
}
