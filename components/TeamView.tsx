
import React from 'react';
import { PresencePlan, ApprovalStatus, PresenceStatus } from '../types';
import StatusBadge from './StatusBadge';
import { PRESENCE_STATUS_OPTIONS } from '../constants';

interface TeamViewProps {
  t: any;
  teamPlans: PresencePlan[];
  onTeamPlanUpdate: (updatedPlans: PresencePlan[]) => void;
}

const TeamView: React.FC<TeamViewProps> = ({ t, teamPlans, onTeamPlanUpdate }) => {
  
  const handleApproval = (userId: string, newStatus: ApprovalStatus) => {
    const updatedPlans = teamPlans.map(plan => 
      plan.user.id === userId ? { ...plan, status: newStatus } : plan
    );
    onTeamPlanUpdate(updatedPlans);
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.team_presence}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{`${t.week_of} ${teamPlans[0]?.weekOf || ''}`}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.team_member}</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.weekly_schedule}</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.status}</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {teamPlans.map((plan) => (
              <tr key={plan.user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={plan.user.avatarUrl} alt="" />
                    </div>
                    <div className="ms-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{plan.user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    {plan.plan.map((day, index) => (
                      <DayStatusIcon key={index} status={day.status} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={plan.status} t={t} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {plan.status === ApprovalStatus.Pending && (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <button onClick={() => handleApproval(plan.user.id, ApprovalStatus.Approved)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-900 px-3 py-1 rounded-md transition">{t.approve}</button>
                      <button onClick={() => handleApproval(plan.user.id, ApprovalStatus.Rejected)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900 px-3 py-1 rounded-md transition">{t.reject}</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DayStatusIcon: React.FC<{ status: PresenceStatus | null }> = ({ status }) => {
    if (!status) {
        return <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600" title="Not Set"></div>;
    }
    const option = PRESENCE_STATUS_OPTIONS.find(opt => opt.value === status);
    if (!option) return null;
    
    return (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${option.color}`} title={status}>
            {React.cloneElement(option.icon, {className: "w-4 h-4"})}
        </div>
    );
};

export default TeamView;
