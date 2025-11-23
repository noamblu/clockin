import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PresencePlan, User, ApprovalStatus, DailyPlan, StatusOption } from '../types';
import { ICON_MAP, getStatusLabel } from '../constants';
import StatusBadge from './StatusBadge';

interface MyTeamStatusProps {
  t: any;
  teamPlans: PresencePlan[];
  statusOptions: StatusOption[];
  language: 'en' | 'he';
}

const DayStatusDisplay: React.FC<{ status: string | null, note?: string, t: any, statusOptions: StatusOption[], language: 'en' | 'he' }> = ({ status, note, t, statusOptions, language }) => {
    if (!status) return null;
    const option = statusOptions.find(opt => opt.value === status);
    if (!option) return null;

    return (
        <div className="flex items-center">
            <span className={`w-5 h-5 flex items-center justify-center text-white rounded me-2 ${option.color}`}>{React.cloneElement(ICON_MAP[option.icon], {className: "w-3 h-3"})}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {getStatusLabel(option, language)}
                {note && <span className="text-xs text-gray-500 dark:text-gray-400 ms-1">({note})</span>}
            </span>
        </div>
    )
}

const WeeklyPlanRow: React.FC<{ plan: PresencePlan; t: any, statusOptions: StatusOption[], language: 'en' | 'he' }> = ({ plan, t, statusOptions, language }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg transition-shadow hover:shadow-md bg-white dark:bg-slate-800">
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
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {plan.plan.map((day) => (
              <div key={day.date} className="bg-white dark:bg-slate-700 rounded p-3 shadow-sm border border-gray-100 dark:border-gray-600">
                <p className="font-bold text-gray-800 dark:text-gray-200">{day.day}</p>
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

const RangePlanRow: React.FC<{ user: User; days: DailyPlan[]; t: any, statusOptions: StatusOption[], language: 'en' | 'he' }> = ({ user, days, t, statusOptions, language }) => {
  const [isOpen, setIsOpen] = useState(true); 

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg transition-shadow hover:shadow-md bg-white dark:bg-slate-800">
      <button
        className="w-full flex flex-col sm:flex-row justify-between items-center p-4 text-start"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center mb-2 sm:mb-0">
            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full me-3"/>
            <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{`${days.length} days in range`}</p>
            </div>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <svg className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {days.map((day) => (
              <div key={day.date} className="bg-white dark:bg-slate-700 rounded p-3 shadow-sm border border-gray-100 dark:border-gray-600">
                <p className="font-bold text-gray-800 dark:text-gray-200">{day.day}</p>
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

const MyTeamStatus: React.FC<MyTeamStatusProps> = ({ t, teamPlans, statusOptions, language }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const teamMembers = useMemo(() => {
    return [...new Map(teamPlans.map(item => [item.user.id, item.user])).values()].sort((a: User, b: User) => a.name.localeCompare(b.name));
  }, [teamPlans]);

  const handleUserSelection = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };
  
  const resetFilters = () => {
      setStartDate('');
      setEndDate('');
      setSelectedUserIds([]);
      setSelectedStatus('all');
  }

  const filteredWeeklyPlans = useMemo(() => {
    if (startDate && endDate) return []; 
    
    return teamPlans.filter(plan => {
      if (plan.status !== ApprovalStatus.Approved) return false;
      if (startDate && plan.weekOf < startDate) return false; 
      if (endDate && plan.weekOf > endDate) return false;
      if (selectedUserIds.length > 0 && !selectedUserIds.includes(plan.user.id)) return false;
      if (selectedStatus !== 'all' && !plan.plan.some(day => day.status === selectedStatus)) return false;
      return true;
    }).sort((a: PresencePlan, b: PresencePlan) => new Date(b.weekOf).getTime() - new Date(a.weekOf).getTime());
  }, [teamPlans, startDate, endDate, selectedUserIds, selectedStatus]);

  const rangeFilteredData = useMemo(() => {
    if (!startDate || !endDate) return [];

    const groupedData = new Map<string, { user: User, days: DailyPlan[] }>();

    teamPlans.forEach(plan => {
      if (plan.status !== ApprovalStatus.Approved) return;
      if (selectedUserIds.length > 0 && !selectedUserIds.includes(plan.user.id)) return;

      plan.plan.forEach(day => {
        if (day.date >= startDate && day.date <= endDate) {
          if (selectedStatus !== 'all' && day.status !== selectedStatus) return;

          if (!groupedData.has(plan.user.id)) {
            groupedData.set(plan.user.id, { user: plan.user, days: [] });
          }
          groupedData.get(plan.user.id)!.days.push(day);
        }
      });
    });

    return Array.from(groupedData.values())
      .sort((a, b) => a.user.name.localeCompare(b.user.name))
      .map(item => ({
        ...item,
        days: item.days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }));

  }, [teamPlans, startDate, endDate, selectedUserIds, selectedStatus]);

  const todayString = new Date().toLocaleDateString('en-CA');
  
  const usersByStatus = useMemo(() => {
      const groups: Record<string, User[]> = {};
      
      teamPlans.forEach(plan => {
          if (plan.status !== ApprovalStatus.Approved) return;

          const todayPlan = plan.plan.find(p => p.date === todayString);
          if (todayPlan && todayPlan.status) {
              if (!groups[todayPlan.status]) {
                  groups[todayPlan.status] = [];
              }
              groups[todayPlan.status].push(plan.user);
          }
      });
      return groups;
  }, [teamPlans, todayString]);

  const hasAnyStatusToday = Object.keys(usersByStatus).length > 0;
  const isRangeMode = !!(startDate && endDate);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 sticky top-24">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {viewMode === 'daily' ? t.my_team_status : t.team_weekly_status}
        </h3>
        <div className="flex-shrink-0 bg-slate-200 dark:bg-slate-700 p-1 rounded-md">
          <button 
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1 text-sm font-semibold rounded transition-colors ${viewMode === 'daily' ? 'bg-white dark:bg-slate-600 shadow text-indigo-700 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-slate-300/50 dark:hover:bg-slate-600/50'}`}
          >
            {t.daily_view}
          </button>
          <button 
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1 text-sm font-semibold rounded transition-colors ${viewMode === 'weekly' ? 'bg-white dark:bg-slate-600 shadow text-indigo-700 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-slate-300/50 dark:hover:bg-slate-600/50'}`}
          >
            {t.weekly_view}
          </button>
        </div>
      </div>

      {/* Filters (only for weekly view) */}
      {viewMode === 'weekly' && (
         <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg mb-4">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                 <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.start_date}</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.end_date}</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white" />
                 </div>
                 <div className="relative" ref={dropdownRef}>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.filter_by_user}</label>
                    <button 
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-start truncate"
                    >
                        {selectedUserIds.length === 0 ? t.all_users : `${selectedUserIds.length} users selected`}
                    </button>
                    {isUserDropdownOpen && (
                         <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 rounded-md shadow-lg border border-gray-200 dark:border-slate-600 max-h-40 overflow-y-auto p-2">
                            {teamMembers.map(user => (
                                <label key={user.id} className="flex items-center p-1 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer rounded">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedUserIds.includes(user.id)} 
                                        onChange={() => handleUserSelection(user.id)} 
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ms-2 text-sm text-gray-700 dark:text-gray-200">{user.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.filter_by_status}</label>
                    <select 
                        value={selectedStatus} 
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    >
                        <option value="all">{t.all_statuses}</option>
                         {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{getStatusLabel(opt, language)}</option>
                        ))}
                    </select>
                 </div>
             </div>
             {(startDate || endDate || selectedUserIds.length > 0 || selectedStatus !== 'all') && (
                 <div className="mt-2 flex justify-end">
                     <button onClick={resetFilters} className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 underline">{t.reset}</button>
                 </div>
             )}
         </div>
      )}

      {viewMode === 'daily' ? (
        <div className="space-y-6">
            {hasAnyStatusToday ? (
                Object.keys(usersByStatus).map(status => {
                    const option = statusOptions.find(opt => opt.value === status);
                    if (!option) return null;
                    
                    return (
                        <div key={status}>
                             <div className="flex items-center mb-3">
                                <span className={`w-3 h-3 rounded-full me-2 ${option.color}`}></span>
                                <h4 className="font-semibold text-gray-800 dark:text-white flex items-center">
                                    {getStatusLabel(option, language)}
                                    <span className="ms-2 text-xs font-normal text-gray-500 dark:text-gray-400">({usersByStatus[status].length})</span>
                                </h4>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {usersByStatus[status].map(user => (
                                    <div key={user.id} className="flex items-center bg-slate-50 dark:bg-slate-700/50 rounded-full pe-3 ps-1 py-1 border border-slate-200 dark:border-slate-600">
                                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full me-2"/>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>{t.not_submitted}</p>
                </div>
            )}
        </div>
      ) : (
         <div className="space-y-4">
             {isRangeMode ? (
                 rangeFilteredData.length > 0 ? (
                     rangeFilteredData.map(item => (
                         <RangePlanRow key={item.user.id} user={item.user} days={item.days} t={t} statusOptions={statusOptions} language={language} />
                     ))
                 ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t.no_matching_plans}</p>
                 )
             ) : (
                 filteredWeeklyPlans.length > 0 ? (
                    filteredWeeklyPlans.map((plan, index) => (
                        <WeeklyPlanRow key={`${plan.user.id}-${plan.weekOf}-${index}`} plan={plan} t={t} statusOptions={statusOptions} language={language} />
                    ))
                ) : (
                     <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t.no_matching_plans}</p>
                )
             )}
         </div>
      )}
    </div>
  );
};

export default MyTeamStatus;