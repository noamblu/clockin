
import React, { useMemo, useState } from 'react';
import { PresencePlan, ApprovalStatus, MandatoryDate, Team, User, StatusOption, DailyPlan } from '../types';
import StatusBadge from './StatusBadge';
import { ICON_MAP, getStatusLabel } from '../constants';
import MandatoryDatesManagement from './MandatoryDatesManagement';

interface TeamViewProps {
  t: any;
  teamPlans: PresencePlan[];
  onTeamPlanUpdate: (updatedPlans: PresencePlan[]) => void;
  mandatoryDates: MandatoryDate[];
  onAddMandatoryDate: (rule: MandatoryDate) => void;
  onDeleteMandatoryDate: (id: string) => void;
  teams: Team[];
  currentUser: User | null;
  statusOptions: StatusOption[];
  language: 'en' | 'he';
}

const TeamView: React.FC<TeamViewProps> = ({ t, teamPlans, onTeamPlanUpdate, mandatoryDates, onAddMandatoryDate, onDeleteMandatoryDate, teams, currentUser, statusOptions, language }) => {
  const [notifyUser, setNotifyUser] = useState<User | null>(null);
  const [approvalPlan, setApprovalPlan] = useState<PresencePlan | null>(null);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);

  const handleApproval = (userId: string, newStatus: ApprovalStatus) => {
    const updatedPlans = teamPlans.map(plan => 
      plan.user.id === userId ? { ...plan, status: newStatus } : plan
    );
    onTeamPlanUpdate(updatedPlans);

    // If approving, trigger notification flow
    if (newStatus === ApprovalStatus.Approved) {
        const plan = teamPlans.find(p => p.user.id === userId);
        if (plan) {
            setNotifyUser(plan.user);
            setApprovalPlan(plan);
            setIsNotifyModalOpen(true);
        }
    }
  };

  const leadingTeam = teams.find(t => t.leaderId === currentUser?.id) || teams.find(t => t.id === currentUser?.teamId);
  
  const coverageWarnings = useMemo(() => {
    if (teamPlans.length === 0) return [];
    const days = teamPlans[0].plan;
    const missingDays: string[] = [];

    days.forEach(dayTemplate => {
        const hasOffice = teamPlans.some(userPlan => {
            if (userPlan.status === ApprovalStatus.NotSubmitted || userPlan.status === ApprovalStatus.Rejected) return false;
            const userDay = userPlan.plan.find(d => d.date === dayTemplate.date);
            return userDay?.status === 'Office'; 
        });

        if (!hasOffice) {
            missingDays.push(dayTemplate.day); 
        }
    });
    return missingDays;
  }, [teamPlans]);

  const handleWhatsApp = (phoneNumber: string, userName: string, type: 'reminder' | 'approval', weekOf: string) => {
      const cleanNumber = phoneNumber.replace(/\D/g, ''); 
      let finalNumber = cleanNumber;
      if (cleanNumber.startsWith('0')) {
          finalNumber = '972' + cleanNumber.substring(1);
      }
      
      let message = '';
      if (type === 'reminder') {
          message = t.reminder_msg_whatsapp.replace('{name}', userName).replace('{week}', weekOf);
      } else {
          message = t.approval_msg_whatsapp.replace('{name}', userName).replace('{week}', weekOf);
      }
      
      const url = `https://wa.me/${finalNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      
      if (type === 'approval') setIsNotifyModalOpen(false);
  };

  const handleEmail = (email: string, userName: string, type: 'reminder' | 'approval', weekOf: string) => {
      let subject = '';
      let body = '';
      
      if (type === 'reminder') {
          subject = t.email_subject_reminder;
          body = t.email_body_reminder.replace('{name}', userName).replace('{week}', weekOf);
      } else {
          subject = t.email_subject_approval;
          body = t.email_body_approval.replace('{name}', userName).replace('{week}', weekOf);
      }
      
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');

      // Show toast/alert simulation
      alert(t.email_sent_msg.replace('{email}', email));
      
      if (type === 'approval') setIsNotifyModalOpen(false);
  };

  return (
    <div className="space-y-8">
        {coverageWarnings.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                    </div>
                    <div className="ms-3">
                        <p className="text-sm text-red-700 dark:text-red-200">
                            {t.coverage_warning.replace('{days}', coverageWarnings.join(', '))}
                        </p>
                    </div>
                </div>
            </div>
        )}

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
                        <div className="flex items-center group">
                            <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={plan.user.avatarUrl} alt="" />
                            </div>
                            <div className="ms-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                    {plan.user.name}
                                </div>
                                {(plan.status === ApprovalStatus.NotSubmitted || plan.status === ApprovalStatus.Pending) && (
                                    <div className="flex mt-1 space-x-2 rtl:space-x-reverse">
                                        {plan.user.phoneNumber && (
                                            <button 
                                                onClick={() => handleWhatsApp(plan.user.phoneNumber!, plan.user.name, 'reminder', plan.weekOf)}
                                                className="text-green-500 hover:text-green-600 transition-colors"
                                                title={t.send_whatsapp_reminder}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                                                </svg>
                                            </button>
                                        )}
                                        {plan.user.email && (
                                             <button 
                                                onClick={() => handleEmail(plan.user.email!, plan.user.name, 'reminder', plan.weekOf)}
                                                className="text-blue-500 hover:text-blue-600 transition-colors"
                                                title={t.send_email_reminder}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1 rtl:space-x-reverse">
                            {plan.plan.map((day, index) => (
                            <DayStatusIcon key={index} day={day} statusOptions={statusOptions} language={language} />
                            ))}
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <StatusBadge status={plan.status} t={t} />
                                {plan.violationReason && (
                                    <div className="ms-2 text-orange-500 group relative cursor-help">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                        <div className="absolute bottom-full start-1/2 transform -translate-x-1/2 mb-2 w-48 bg-black text-white text-xs rounded p-2 hidden group-hover:block z-10 shadow-lg">
                                            <p className="font-bold mb-1 text-orange-300">{t.policy_violation_flag}</p>
                                            {plan.violationReason}
                                        </div>
                                    </div>
                                )}
                            </div>
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
        
        {leadingTeam && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border-t-4 border-indigo-500">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.mandatory_dates}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage policies for <span className="font-semibold text-indigo-600 dark:text-indigo-400">{leadingTeam.name}</span> team.</p>
                </div>
                <MandatoryDatesManagement 
                    t={t}
                    teams={teams}
                    mandatoryDates={mandatoryDates}
                    onAdd={onAddMandatoryDate}
                    onDelete={onDeleteMandatoryDate}
                    fixedTeamId={leadingTeam.id}
                    statusOptions={statusOptions}
                    language={language}
                />
            </div>
        )}

        {isNotifyModalOpen && notifyUser && approvalPlan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t.notify_approval}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {t.notify_approval_msg.replace('{name}', notifyUser.name)}
                    </p>
                    <div className="flex flex-col gap-3">
                         {notifyUser.phoneNumber && (
                             <button
                                onClick={() => handleWhatsApp(notifyUser.phoneNumber!, notifyUser.name, 'approval', approvalPlan.weekOf)}
                                className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                             >
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                                     <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                                 </svg>
                                 {t.send_whatsapp}
                             </button>
                         )}
                         {notifyUser.email && (
                             <button
                                onClick={() => handleEmail(notifyUser.email!, notifyUser.name, 'approval', approvalPlan.weekOf)}
                                className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                             >
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                                </svg>
                                 {t.send_email}
                             </button>
                         )}
                         <button
                            onClick={() => setIsNotifyModalOpen(false)}
                            className="mt-2 px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 rounded-md"
                         >
                             {t.cancel}
                         </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

const DayStatusIcon: React.FC<{ day: DailyPlan, statusOptions: StatusOption[], language: 'en' | 'he' }> = ({ day, statusOptions, language }) => {
    if (!day.status) {
        return <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600" title="Not Set"></div>;
    }
    const option = statusOptions.find(opt => opt.value === day.status);
    if (!option) return null;
    
    const label = getStatusLabel(option, language);
    const title = day.note ? `${label}: ${day.note}` : label;

    return (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${option.color}`} title={title}>
            {React.cloneElement(ICON_MAP[option.icon], {className: "w-4 h-4"})}
        </div>
    );
};

export default TeamView;
