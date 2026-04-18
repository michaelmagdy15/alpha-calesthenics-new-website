import React from 'react';
import { PackageTier, ClientStatus } from '../../types/admin';

interface StatusBadgeProps {
  type: 'tier' | 'status';
  value: PackageTier | ClientStatus;
  isCompact?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, isCompact }) => {
  const getStyles = () => {
    if (type === 'tier') {
      switch (value) {
        case 'Alpha Elite':
          return 'bg-primary/20 text-primary border-primary/30';
        case 'Alpha Athlete':
          return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        default:
          return 'bg-white/10 text-on-surface-variant border-white/20';
      }
    } else {
      switch (value) {
        case 'Assessment Pending':
          return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        case 'Program Building':
          return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        case 'Active in App':
          return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        case 'Inactive':
          return 'bg-red-500/20 text-red-400 border-red-500/30';
        default:
          return 'bg-white/10 text-on-surface-variant border-white/20';
      }
    }
  };

  return (
    <span className={`font-bold rounded-full uppercase tracking-widest border transition-all whitespace-nowrap ${isCompact ? 'text-[8px] px-2 py-0.5' : 'text-[10px] px-2.5 py-1'} ${getStyles()}`}>
      {value}
    </span>
  );
};

export default StatusBadge;
