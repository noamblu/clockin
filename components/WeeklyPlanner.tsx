
import React, { useState, useEffect } from 'react';
import { PresencePlan, DailyPlan, PresenceStatus, ApprovalStatus } from '../types';
import { PRESENCE_STATUS_OPTIONS, getSubmissionDeadline } from '../constants';
import StatusBadge from './StatusBadge';

interface WeeklyPlannerProps {
  t: any;
  plan: PresencePlan;
  onPlanUpdate: (updatedPlan: PresencePlan) => void;
  onViewHistoryClick: () => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onCopyPreviousPlan: () => void;
}

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ t, plan, onPlanUpdate, onViewHistoryClick, currentDate, onDateChange, onCopyPreviousPlan }) => {
  const [currentPlan, setCurrentPlan] = useState<DailyPlan[]>(plan.plan);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync internal state when the plan prop changes (e.g., switching weeks)
  useEffect(() => {
    setCurrentPlan(plan.plan);
  }, [plan]);

  const handleStatusChange = (dayIndex: number, newStatus: PresenceStatus) => {
    const updatedPlan = [...currentPlan];
    updatedPlan[dayIndex].status = newStatus;
    setCurrentPlan(updatedPlan);
  };

  const handleSubmit = () => {
    const isPlanComplete = currentPlan.every(day => day.status !== null);
    if (!isPlanComplete) {
      alert('Please fill out the plan for all days before submitting.');
      return;
    }
    const updatedPresencePlan = {
      ...plan,
      plan: currentPlan,
      status: ApprovalStatus.Pending,
      submittedAt: new Date(),
    };
    onPlanUpdate(updatedPresencePlan);
    setShowSuccess(true);
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
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      {/* Header Section with Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.weekly_plan}</h2>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            <button 
                onClick={() => changeWeek(-1)} 
                className="p-2 rounded-md hover:bg-white dark:hover:bg-slate-600 text-gray-600 dark:text-gray-300 transition-colors"
                title={t.previous_week}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </button>
            <span className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-200 min-w-[120px] text-center">
                {`${t.week_of} ${plan.weekOf}`}
            </span>
            <button 
                onClick={() => changeWeek(1)} 
                className="p-2 rounded-md hover:bg-white dark:hover:bg-slate-600 text-gray-600 dark:text-gray-300 transition-colors"
                title={t.next_week}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </button>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Deadline Display */}
            {!isSubmitted && (
                <div className={`text-sm font-medium ${isOverdue ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-gray-500 dark:text-gray-400'}`}>
                    {isOverdue ? (
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 me-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            {t.overdue}
                        </span>
                    ) : (
                        <span>{t.due_by}: {deadline.toLocaleDateString()} 15:00</span>
                    )}
                </div>
            )}
            <button
                onClick={onViewHistoryClick}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                {t.view_history}
            </button>
            <StatusBadge status={plan.status} t={t} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {currentPlan.map((day, index) => (
          <DayCard key={day.date} day={day} index={index} onStatusChange={handleStatusChange} t={t} isDisabled={isSubmitted}/>
        ))}
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
        <div className={`text-center p-6 rounded-lg border transition-all duration-500 ${
            showSuccess 
                ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 shadow-lg scale-105' 
                : 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900'
        }`}>
            <div className="flex justify-center mb-3">
                 <div className={`rounded-full bg-green-100 dark:bg-green-800 p-3 ${showSuccess ? 'animate-bounce' : ''}`}>
                    <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
            </div>
            <p className="text-xl font-bold text-green-800 dark:text-green-200">{t.plan_submitted}</p>
             {plan.status === ApprovalStatus.Rejected && (
                 <button onClick={() => {
                     const updatedPlan = {...plan, status: ApprovalStatus.NotSubmitted};
                     onPlanUpdate(updatedPlan);
                 }} className="mt-4 text-sm text-red-600 hover:underline font-bold">
                    Edit and Resubmit
                 </button>
             )}
        </div>
      )}
      {!isSubmitted && <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">{t.submission_deadline}</p>}
    </div>
  );
};

interface DayCardProps {
    day: DailyPlan;
    index: number;
    onStatusChange: (index: number, status: PresenceStatus) => void;
    t: any;
    isDisabled: boolean;
}

const DayCard: React.FC<DayCardProps> = ({ day, index, onStatusChange, t, isDisabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = day.status ? PRESENCE_STATUS_OPTIONS.find(opt => opt.value === day.status) : null;
    const isSelected = !!day.status;

    const handleSelect = (status: PresenceStatus) => {
        onStatusChange(index, status);
        setIsOpen(false);
    }

    return (
        <div className={`rounded-lg p-4 flex flex-col justify-between relative transition-all duration-300 ${
            isSelected 
                ? 'bg-white dark:bg-slate-700 ring-2 ring-indigo-500/50 shadow-md' 
                : 'bg-slate-50 dark:bg-slate-700/50 border border-transparent'
        }`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200">{day.day}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{day.date}</p>
                </div>
                {isSelected && (
                    <div className="text-indigo-500 dark:text-indigo-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                )}
            </div>
            <div className="relative">
                 <button
                    onClick={() => !isDisabled && setIsOpen(!isOpen)}
                    disabled={isDisabled}
                    className={`w-full text-start flex items-center justify-between p-2 rounded-md transition-colors ${
                        isDisabled 
                            ? 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed' 
                            : 'bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500'
                    }`}
                >
                    {selectedOption ? (
                        <span className="flex items-center">
                            <span className={`w-5 h-5 me-2 ${selectedOption.color} rounded`}>{selectedOption.icon}</span>
                            <span className="truncate">{t[selectedOption.value]}</span>
                        </span>
                    ) : (
                        <span className="text-gray-500 dark:text-gray-400">{t.select_status}</span>
                    )}
                    {!isDisabled && <svg className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>}
                </button>
                {isOpen && !isDisabled && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 rounded-md shadow-lg border border-gray-200 dark:border-slate-600 max-h-60 overflow-y-auto">
                        {PRESENCE_STATUS_OPTIONS.map(option => (
                             <div key={option.value} onClick={() => handleSelect(option.value)} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer">
                                <span className={`w-5 h-5 me-2 flex-shrink-0 ${option.color} rounded`}>{option.icon}</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{t[option.value]}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WeeklyPlanner;
