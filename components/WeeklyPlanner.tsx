
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PresencePlan, DailyPlan, ApprovalStatus, MandatoryDate, WorkPolicy, StatusOption } from '../types';
import { getSubmissionDeadline, ICON_MAP, getStatusLabel, getDayLabel } from '../constants';
import StatusBadge from './StatusBadge';

interface WeeklyPlannerProps {
  t: any;
  plan: PresencePlan;
  onPlanUpdate: (updatedPlan: PresencePlan) => void;
  onViewHistoryClick: () => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onCopyPreviousPlan: () => void;
  mandatoryDates: MandatoryDate[];
  workPolicy?: WorkPolicy;
  statusOptions: StatusOption[];
  language: 'en' | 'he';
}

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ t, plan, onPlanUpdate, onViewHistoryClick, currentDate, onDateChange, onCopyPreviousPlan, mandatoryDates, workPolicy, statusOptions, language }) => {
  const [currentPlan, setCurrentPlan] = useState<DailyPlan[]>(plan.plan);
  const [showSuccess, setShowSuccess] = useState(false);
  const [policyViolation, setPolicyViolation] = useState<string | null>(null);
  const [isPolicyConfirmOpen, setIsPolicyConfirmOpen] = useState(false);
  const [pendingViolationReason, setPendingViolationReason] = useState<string | null>(null);

  useEffect(() => {
    const planWithMandatory = plan.plan.map(day => {
        const rule = mandatoryDates.find(d => {
            if (d.date !== day.date) return false;
            if (!d.teamIds || d.teamIds.length === 0) return true;
            if (plan.user.teamId && d.teamIds.includes(plan.user.teamId)) return true;
            return false;
        });

        if (rule) {
            // Ensure the mandatory status is still valid in current options, otherwise fallback or keep
            return { ...day, status: rule.status };
        }
        return day;
    });
    setCurrentPlan(planWithMandatory);
    setPolicyViolation(null);
  }, [plan, mandatoryDates]);

  const handleStatusChange = (dayIndex: number, newStatus: string) => {
    const updatedPlan = [...currentPlan];
    updatedPlan[dayIndex].status = newStatus;
    if (newStatus !== 'Other') {
        updatedPlan[dayIndex].note = '';
    }
    setCurrentPlan(updatedPlan);
    setPolicyViolation(null); 
  };

  const handleNoteChange = (dayIndex: number, note: string) => {
    const updatedPlan = [...currentPlan];
    updatedPlan[dayIndex].note = note;
    setCurrentPlan(updatedPlan);
  };

  const policyStats = useMemo(() => {
      if (!workPolicy) return { officeCount: 0, homeCount: 0 };
      const officeCount = currentPlan.filter(d => d.status === 'Office').length;
      const homeCount = currentPlan.filter(d => d.status === 'Home').length;
      return { officeCount, homeCount };
  }, [currentPlan, workPolicy]);

  const handleSubmit = () => {
    const isPlanComplete = currentPlan.every(day => day.status !== null);
    if (!isPlanComplete) {
      alert('Please fill out the plan for all days before submitting.');
      return;
    }

    let violationMsg = null;

    if (workPolicy) {
        const { officeCount, homeCount } = policyStats;
        if (officeCount < workPolicy.minOfficeDays) {
            violationMsg = `Min ${workPolicy.minOfficeDays} office days required. You have ${officeCount}.`;
        } else if (homeCount > workPolicy.maxHomeDays) {
             violationMsg = `Max ${workPolicy.maxHomeDays} home days allowed. You have ${homeCount}.`;
        }
    }

    if (violationMsg) {
        setPendingViolationReason(violationMsg);
        setIsPolicyConfirmOpen(true);
        return;
    }

    confirmSubmit();
  };

  const confirmSubmit = () => {
      const updatedPresencePlan = {
      ...plan,
      plan: currentPlan,
      status: ApprovalStatus.Pending,
      submittedAt: new Date(),
      violationReason: pendingViolationReason || undefined
    };
    onPlanUpdate(updatedPresencePlan);
    setShowSuccess(true);
    setIsPolicyConfirmOpen(false);
    setPendingViolationReason(null);
    setPolicyViolation(null);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const changeWeek = (offset: number) => {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + (offset * 7));
      onDateChange(newDate);
  };

  const isSubmitted = plan.status !== ApprovalStatus.NotSubmitted && plan.status !== ApprovalStatus.Rejected;
  
  const deadline = getSubmissionDeadline(plan.weekOf);
  const now = new Date();
  const isOverdue = now > deadline && plan.status === ApprovalStatus.NotSubmitted;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.weekly_plan}</h2>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            <button onClick={() => changeWeek(-1)} className="p-2 rounded-md hover:bg-white dark:hover:bg-slate-600 text-gray-600 dark:text-gray-300 transition-colors" title={t.previous_week}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </button>
            <span className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-200 min-w-[120px] text-center">{`${t.week_of} ${plan.weekOf}`}</span>
            <button onClick={() => changeWeek(1)} className="p-2 rounded-md hover:bg-white dark:hover:bg-slate-600 text-gray-600 dark:text-gray-300 transition-colors" title={t.next_week}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </button>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {!isSubmitted && (
                <div className={`text-sm font-medium ${isOverdue ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-gray-500 dark:text-gray-400'}`}>
                    {isOverdue ? (
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 me-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                            {t.overdue}
                        </span>
                    ) : (
                        <span>{t.due_by}: {deadline.toLocaleDateString()} 15:00</span>
                    )}
                </div>
            )}
            <button onClick={onViewHistoryClick} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">{t.view_history}</button>
            <StatusBadge status={plan.status} t={t} />
        </div>
      </div>
      
      {workPolicy && !isSubmitted && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-bold text-blue-800 dark:text-blue-200 mb-2">{t.work_policy}</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                  <div className={`flex items-center ${policyStats.officeCount < workPolicy.minOfficeDays ? 'text-orange-600 dark:text-orange-400 font-semibold' : 'text-green-600 dark:text-green-400'}`}>
                      <span className="me-2">🏢</span>
                      {t.office}: {policyStats.officeCount} / Min {workPolicy.minOfficeDays}
                  </div>
                   <div className={`flex items-center ${policyStats.homeCount > workPolicy.maxHomeDays ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-green-600 dark:text-green-400'}`}>
                      <span className="me-2">🏠</span>
                      {t.home}: {policyStats.homeCount} / Max {workPolicy.maxHomeDays}
                  </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {t.policy_summary.replace('{min}', workPolicy.minOfficeDays).replace('{max}', workPolicy.maxHomeDays)}
              </p>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {currentPlan.map((day, index) => {
             const mandatoryRule = mandatoryDates.find(d => {
                if (d.date !== day.date) return false;
                if (!d.teamIds || d.teamIds.length === 0) return true;
                if (plan.user.teamId && d.teamIds.includes(plan.user.teamId)) return true;
                return false;
            });

            return (
                <DayCard 
                    key={day.date} 
                    day={day} 
                    index={index} 
                    onStatusChange={handleStatusChange} 
                    onNoteChange={handleNoteChange}
                    t={t} 
                    isDisabled={isSubmitted}
                    mandatoryRule={mandatoryRule}
                    statusOptions={statusOptions}
                    language={language}
                />
            );
        })}
      </div>

      {!isSubmitted ? (
         <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg"
                >
                {t.submit_plan}
            </button>
            <button
                onClick={onCopyPreviousPlan}
                className="w-full sm:w-auto bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
                >
                {t.copy_previous_week}
            </button>
        </div>
      ) : (
        <div className={`text-center p-6 rounded-lg border transition-all duration-500 ${showSuccess ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 shadow-lg scale-105' : 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900'}`}>
            <div className="flex justify-center mb-3">
                 <div className={`rounded-full bg-green-100 dark:bg-green-800 p-3 ${showSuccess ? 'animate-bounce' : ''}`}>
                    <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
            </div>
            <p className="text-xl font-bold text-green-800 dark:text-green-200">{t.plan_submitted}</p>
            <button 
                onClick={() => {
                    const updatedPlan = {...plan, status: ApprovalStatus.NotSubmitted};
                    onPlanUpdate(updatedPlan);
                }} 
                className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-bold bg-transparent border-none cursor-pointer"
            >
                {t.update_plan}
            </button>
        </div>
      )}
      {!isSubmitted && <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">{t.submission_deadline}</p>}

      {isPolicyConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center mb-4 text-orange-600 dark:text-orange-400">
                    <svg className="w-6 h-6 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    <h3 className="text-lg font-bold">{t.policy_override_title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{t.policy_override_msg.replace('{violation}', pendingViolationReason)}</p>
                <div className="flex justify-end space-x-4 rtl:space-x-reverse">
                    <button onClick={() => setIsPolicyConfirmOpen(false)} className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors">{t.cancel}</button>
                    <button onClick={confirmSubmit} className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">{t.confirm}</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

interface DayCardProps {
    day: DailyPlan;
    index: number;
    onStatusChange: (index: number, status: string) => void;
    onNoteChange: (index: number, note: string) => void;
    t: any;
    isDisabled: boolean;
    mandatoryRule?: MandatoryDate;
    statusOptions: StatusOption[];
    language: 'en' | 'he';
}

const DayCard: React.FC<DayCardProps> = ({ day, index, onStatusChange, onNoteChange, t, isDisabled, mandatoryRule, statusOptions, language }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const currentStatus = day.status;
    const selectedOption = currentStatus ? statusOptions.find(opt => opt.value === currentStatus) : null;
    const isSelected = !!currentStatus;
    const isLocked = isDisabled;

    const handleSelect = (status: string) => {
        onStatusChange(index, status);
        setIsOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`rounded-lg p-4 flex flex-col justify-between relative transition-all duration-300 ${isSelected ? 'bg-white dark:bg-slate-700 ring-2 ring-indigo-500/50 shadow-md' : 'bg-slate-50 dark:bg-slate-700/50 border border-transparent'}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200">{getDayLabel(day.day, language)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{day.date}</p>
                </div>
                {isSelected && !mandatoryRule && (
                    <div className="text-indigo-500 dark:text-indigo-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                )}
                {mandatoryRule && (
                    <div className="text-orange-500 dark:text-orange-400" title={mandatoryRule.description}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    </div>
                )}
            </div>
            
            {mandatoryRule && (
                <div className="mb-2 text-xs text-orange-600 dark:text-orange-300 font-medium bg-orange-50 dark:bg-orange-900/30 p-1 rounded">
                    {mandatoryRule.description}
                </div>
            )}

            <div className="relative" ref={dropdownRef}>
                 <button
                    onClick={() => !isLocked && setIsOpen(!isOpen)}
                    disabled={isLocked}
                    className={`w-full text-start flex items-center justify-between p-2 rounded-md transition-colors ${isLocked ? 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed opacity-80' : 'bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500'}`}
                >
                    {selectedOption ? (
                        <div className="flex items-center">
                             <div className={`w-6 h-6 flex items-center justify-center me-2 ${selectedOption.color} text-white rounded shadow-sm`}>
                                {React.cloneElement(ICON_MAP[selectedOption.icon], { className: "w-4 h-4" })}
                            </div>
                            <span className="font-medium truncate text-gray-800 dark:text-gray-200">{getStatusLabel(selectedOption, language)}</span>
                        </div>
                    ) : (
                        <span className="text-gray-500 dark:text-gray-400">{t.select_status}</span>
                    )}
                    {!isLocked && <svg className={`w-4 h-4 flex-shrink-0 transition-transform text-gray-500 dark:text-gray-400 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>}
                </button>
                {isOpen && !isLocked && (
                    <div className="absolute z-50 mt-2 w-full min-w-[160px] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-600 p-1 animate-in fade-in zoom-in duration-200">
                        {statusOptions.map(option => (
                             <div key={option.id} onClick={() => handleSelect(option.value)} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                                <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${option.color} text-white rounded-lg shadow-sm`}>
                                    {React.cloneElement(ICON_MAP[option.icon], {className: "w-5 h-5"})}
                                </div>
                                <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-200">{getStatusLabel(option, language)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {currentStatus === 'Other' && (
                <div className="mt-2">
                    <input
                        type="text"
                        value={day.note || ''}
                        onChange={(e) => onNoteChange(index, e.target.value)}
                        placeholder={t.specify_reason}
                        disabled={isLocked}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            )}
        </div>
    )
}

export default WeeklyPlanner;
