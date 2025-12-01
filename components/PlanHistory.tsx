
import React, { useState } from 'react';
import { PresencePlan, StatusOption, DailyPlan } from '../types';
import StatusBadge from './StatusBadge';
import { ICON_MAP, getStatusLabel, getDayLabel } from '../constants';

interface PlanHistoryProps {
  t: any;
  historicalPlans: PresencePlan[];
  onBack: () => void;
  statusOptions: StatusOption[];
  language: 'en' | 'he';
}

const PlanHistory: React.FC<PlanHistoryProps> = ({ t, historicalPlans, onBack, statusOptions, language }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.plan_history}</h2>
        <button
          onClick={onBack}
          className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {t.back_to_current_week}
        </button>
      </div>

      <div className="space-y-4">
        {historicalPlans.length > 0 ? (
          historicalPlans.map((plan, index) => (
            <HistoryRow key={`${plan.weekOf}-${index}`} plan={plan} t={t} statusOptions={statusOptions} language={language} />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t.no_previous_plan}</p>
        )}
      </div>
    </div>
  );
};

const HistoryRow: React.FC<{ plan: PresencePlan; t: any, statusOptions: StatusOption[], language: 'en' | 'he' }> = ({ plan, t, statusOptions, language }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg transition-shadow hover:shadow-md">
      <button
        className="w-full flex flex-col sm:flex-row justify-between items-center p-4 text-start"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div>
           <p className="font-semibold text-gray-800 dark:text-gray-200">{`${t.week_of} ${plan.weekOf}`}</p>
           <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.submitted}: {plan.submittedAt ? new Date(plan.submittedAt).toLocaleDateString() : '-'}
           </p>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse mt-2 sm:mt-0">
          <StatusBadge status={plan.status} t={t} />
          <svg className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {plan.plan.map((day) => (
              <div key={day.date} className="bg-white dark:bg-slate-700 rounded p-3 shadow-sm border border-gray-100 dark:border-gray-600">
                <p className="font-bold text-gray-800 dark:text-gray-200">{getDayLabel(day.day, language)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{day.date}</p>
                <DayStatusDisplay status={day.status} note={day.note} t={t} statusOptions={statusOptions} language={language} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DayStatusDisplay: React.FC<{ status: string | null, note?: string, t: any, statusOptions: StatusOption[], language: 'en' | 'he' }> = ({ status, note, t, statusOptions, language }) => {
    if (!status) return null;
    const option = statusOptions.find(opt => opt.value === status);
    if (!option) return null;

    return (
        <div className="flex items-center">
            <span className={`w-5 h-5 flex items-center justify-center text-white rounded me-2 ${option.color}`}>
                {React.cloneElement(ICON_MAP[option.icon], {className: "w-3 h-3"})}
            </span>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getStatusLabel(option, language)}
                </span>
                {note && <span className="text-xs text-gray-500 dark:text-gray-400">({note})</span>}
            </div>
        </div>
    )
}

export default PlanHistory;
