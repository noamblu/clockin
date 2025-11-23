
import React, { useState, useMemo } from 'react';
import { PresencePlan, StatusOption } from '../types';
import StatusBadge from './StatusBadge';
import { MOCK_ALL_HISTORICAL_PLANS, ICON_MAP, getStatusLabel } from '../constants';

interface HRHistoryViewProps {
  t: any;
  onBack: () => void;
  statusOptions: StatusOption[];
  language: 'en' | 'he';
}

const HRHistoryView: React.FC<HRHistoryViewProps> = ({ t, onBack, statusOptions, language }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredPlans = useMemo(() => {
    return MOCK_ALL_HISTORICAL_PLANS.filter(plan => {
      if (!startDate && !endDate) return true;
      const planDate = new Date(plan.weekOf);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && planDate < start) return false;
      if (end && planDate > end) return false;
      return true;
    }).sort((a, b) => new Date(b.weekOf).getTime() - new Date(a.weekOf).getTime());
  }, [startDate, endDate]);

  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.hr_history}</h2>
        <button
          onClick={onBack}
          className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {t.back_to_dashboard}
        </button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4 items-center">
        <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 me-4">{t.filter_by_date}</h3>
        <div className="flex-1 w-full md:w-auto">
            <label htmlFor="start-date" className="sr-only">{t.start_date}</label>
            <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500 rounded-md shadow-sm p-2 text-sm" />
        </div>
         <div className="flex-1 w-full md:w-auto">
            <label htmlFor="end-date" className="sr-only">{t.end_date}</label>
            <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500 rounded-md shadow-sm p-2 text-sm" />
        </div>
        <button onClick={resetFilter} className="w-full md:w-auto bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">{t.reset}</button>
      </div>

      <div className="space-y-4">
        {filteredPlans.length > 0 ? (
            filteredPlans.map((plan, index) => (
                <HistoricalPlanRow key={`${plan.user.id}-${plan.weekOf}-${index}`} plan={plan} t={t} statusOptions={statusOptions} language={language} />
            ))
        ) : (
            <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">{t.no_plans_in_range}</p>
            </div>
        )}
      </div>
    </div>
  );
};

const HistoricalPlanRow: React.FC<{ plan: PresencePlan; t: any, statusOptions: StatusOption[], language: 'en' | 'he' }> = ({ plan, t, statusOptions, language }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg transition-shadow hover:shadow-md">
      <button
        className="w-full flex flex-col sm:flex-row justify-between items-center p-4 text-start"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center mb-2 sm:mb-0">
            <img src={plan.user.avatarUrl} alt={plan.user.name} className="w-10 h-10 rounded-full me-3"/>
            <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{plan.user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{`${t.week_of} ${plan.weekOf}`}</p>
            </div>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <StatusBadge status={plan.status} t={t} />
          <svg className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {plan.plan.map((day) => (
              <div key={day.date} className="bg-white dark:bg-slate-700 rounded p-3 shadow-sm">
                <p className="font-bold text-gray-800 dark:text-gray-200">{day.day}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{day.date}</p>
                <DayStatusDisplay status={day.status} t={t} statusOptions={statusOptions} language={language} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DayStatusDisplay: React.FC<{ status: string | null, t: any, statusOptions: StatusOption[], language: 'en' | 'he' }> = ({ status, t, statusOptions, language }) => {
    if (!status) return null;
    const option = statusOptions.find(opt => opt.value === status);
    if (!option) return null;

    return (
        <div className="flex items-center">
            <span className={`w-5 h-5 flex items-center justify-center text-white rounded me-2 ${option.color}`}>{React.cloneElement(ICON_MAP[option.icon], {className: "w-3 h-3"})}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{getStatusLabel(option, language)}</span>
        </div>
    )
}

export default HRHistoryView;
