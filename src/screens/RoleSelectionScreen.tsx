import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useGame } from '@/context/GameContext';
import { ROLES } from '@/data/roles';
import type { RoleId } from '@/types';

const categoryLabels: Record<string, string> = {
  'phishing':           'Phishing',
  'social-engineering': 'Social Engineering',
  'password-security':  'Passwords',
  'data-handling':      'Data Handling',
  'physical-security':  'Physical Security',
  'incident-response':  'Incident Response',
};

export function RoleSelectionScreen() {
  const { beginGame } = useGame();
  const [selected, setSelected] = useState<RoleId | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Choose Your Role</h2>
        <p className="text-slate-400 mt-1 text-sm">
          Scenarios are tailored to the security challenges you face in your position.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ROLES.map((role) => (
          <Card
            key={role.id}
            onClick={() => setSelected(role.id)}
            selected={selected === role.id}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{role.icon}</span>
              <p className="font-semibold text-slate-800">{role.label}</p>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed">
              {role.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
              {role.focusAreas.map((area) => (
                <Badge key={area} variant="info">
                  {categoryLabels[area] ?? area}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Button
        size="lg"
        fullWidth
        disabled={!selected}
        onClick={() => selected && beginGame(selected)}
      >
        Start as {selected ? ROLES.find((r) => r.id === selected)?.label : '…'}
      </Button>
    </div>
  );
}
