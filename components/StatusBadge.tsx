
import React from 'react';
import { ApprovalStatus } from '../types';

interface StatusBadgeProps {
  status: ApprovalStatus;
  t: any;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, t }) => {
  const statusConfig = {
    [ApprovalStatus.Approved]: {
      label: t.approved,
      color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    },
    [ApprovalStatus.Pending]: {
      label: t.pending,
      color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    },
    [ApprovalStatus.Rejected]: {
      label: t.rejected,
      color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    },
    [ApprovalStatus.NotSubmitted]: {
      label: t.not_submitted,
      color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold leading-5 rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
