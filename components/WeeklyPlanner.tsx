
import React, { useState, useEffect } from 'react';
import { PresencePlan, DailyPlan, PresenceStatus, ApprovalStatus } from '../types';
import { PRESENCE_STATUS_OPTIONS } from '../constants';
import StatusBadge from './StatusBadge';

interface WeeklyPlannerProps {
  t: any;
  plan: PresencePlan;
  onPlanUpdate: (updatedPlan: PresencePlan) => void;
  onViewHistoryClick: () => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ t, plan, onPlanUpdate, onViewHistoryClick, currentDate, onDateChange }) => {
  const [currentPlan, setCurrentPlan] = useState<DailyPlan[]>(plan.plan);

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
  };

  const changeWeek = (offset: number) => {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + (offset * 7));
      onDateChange(newDate);
  };

  const isSubmitted = plan.status !== ApprovalStatus.NotSubmitted && plan.status !== ApprovalStatus.Rejected;

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
         <div className="text-center">
            <button
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                {t.submit_plan}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t.submission_deadline}</p>
        </div>
      ) : (
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
            <p className="font-semibold text-green-700 dark:text-green-300">{t.plan_submitted}</p>
             {plan.status === ApprovalStatus.Rejected && (
                 <button onClick={() => {
                     const updatedPlan = {...plan, status: ApprovalStatus.NotSubmitted};
                     onPlanUpdate(updatedPlan);
                 }} className="mt-2 text-sm text-red-600 hover:underline font-bold">
                    Edit and Resubmit
                 </button>
             )}
        </div>
      )}
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

    const handleSelect = (status: PresenceStatus) => {
        onStatusChange(index, status);
        setIsOpen(false);
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 flex flex-col justify-between relative">
            <div>
                <p className="font-bold text-gray-800 dark:text-gray-200">{day.day}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{day.date}</p>
            </div>
            <div className="mt-4">
                 <button
                    onClick={() => !isDisabled && setIsOpen(!isOpen)}
                    disabled={isDisabled}
                    className={`w-full text-start flex items-center justify-between p-2 rounded-md transition-colors ${
                        isDisabled 
                            ? 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed' 
                            : 'bg-white dark:bg-slate-600 hover:bg-gray-100 dark:hover:bg-slate-500'
                    }`}
                >
                    {selectedOption ? (
                        <span className="flex items-center">
                            <span className={`w-5 h-5 me-2 ${selectedOption.color} rounded`}>{selectedOption.icon}</span>
                            {t[selectedOption.value]}
                        </span>
                    ) : (
                        <span className="text-gray-500 dark:text-gray-400">{t.select_status}</span>
                    )}
                    {!isDisabled && <svg className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>}
                </button>
                {isOpen && !isDisabled && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 rounded-md shadow-lg border border-gray-200 dark:border-slate-600">
                        {PRESENCE_STATUS_OPTIONS.map(option => (
                             <div key={option.value} onClick={() => handleSelect(option.value)} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer">
                                <span className={`w-5 h-5 me-2 ${option.color} rounded`}>{option.icon}</span>
                                <span className="text-sm font-medium">{t[option.value]}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WeeklyPlanner;
