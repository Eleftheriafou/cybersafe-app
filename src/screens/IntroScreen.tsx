import { Button } from '@/components/ui/Button';
import { useGame } from '@/context/GameContext';

export function IntroScreen() {
  const { goToRoleSelection } = useGame();

  return (
    <div className="flex flex-col items-center text-center gap-8">
      {/* Hero */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-brand-600/20 border border-brand-500/40 flex items-center justify-center text-5xl shadow-lg shadow-brand-500/20">
          🛡️
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          CyberSafe Challenge
        </h1>
        <p className="text-brand-200 text-lg max-w-md">
          Test your cybersecurity awareness through realistic workplace scenarios.
        </p>
      </div>

      {/* Stats strip */}
      <div className="w-full grid grid-cols-3 gap-4">
        {[
          { value: '10', label: 'Scenarios' },
          { value: '4', label: 'Roles' },
          { value: '~10 min', label: 'Duration' },
        ].map(({ value, label }) => (
          <div key={label} className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="w-full rounded-xl bg-white/5 border border-white/10 p-6 text-left space-y-3">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
          How it works
        </h2>
        <ol className="space-y-2 text-slate-300 text-sm list-none">
          {[
            'Choose a role that matches your position',
            'Work through realistic security scenarios',
            'Each decision affects your final score',
            'Learn from instant feedback on every choice',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-medium">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <Button size="lg" onClick={goToRoleSelection} className="min-w-48">
        Get Started →
      </Button>
    </div>
  );
}
