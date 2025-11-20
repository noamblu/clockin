
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PresencePlan, User, ApprovalStatus, PresenceStatus, DailyPlan } from '../types';
import { PRESENCE_STATUS_OPTIONS } from '../constants';
import StatusBadge from './StatusBadge';

const DayStatusDisplay: React.FC<{ status: PresenceStatus | null, t: any }> = ({ status, t }) => {
    if (!status) return null;
    const option = PRESENCE_STATUS_OPTIONS.find(opt => opt.value === status);
    if (!option) return null;

    return (
        <div className="flex items-center">
            <span className={`w-5 h-5 flex items-center justify-center text-white rounded me-2 ${option.color}`}>{React.cloneElement(option.icon, {className: "w-3 h-3"})}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t[status]}</span>
        </div>
    )
}

const WeeklyPlanRow: React.FC<{ plan: PresencePlan; t: any }> = ({ plan, t }) => {
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
                <DayStatusDisplay status={day.status} t={t} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const RangePlanRow: React.FC<{ user: User; days: DailyPlan[]; t: any }> = ({ user, days, t }) => {
  const [isOpen, setIsOpen] = useState(true); // Default to open for range search results

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
                <DayStatusDisplay status={day.status} t={t} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface MyTeamStatusProps {
  t: any;
  teamPlans: PresencePlan[];
}

const MyTeamStatus: React.FC<MyTeamStatusProps> = ({ t, teamPlans }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  
  // State and logic for Weekly View
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
    // Get unique users from all plans (historical and current)
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

  // Logic for Standard Weekly View (Whole weeks)
  const filteredWeeklyPlans = useMemo(() => {
    // Only used when NOT in specific date range mode
    if (startDate && endDate) return []; 
    
    return teamPlans.filter(plan => {
      // Only show Approved plans
      if (plan.status !== ApprovalStatus.Approved) return false;

      if (startDate && plan.weekOf < startDate) return false; // Fallback for single date selection if user clears one
      if (endDate && plan.weekOf > endDate) return false;
      if (selectedUserIds.length > 0 && !selectedUserIds.includes(plan.user.id)) return false;
      if (selectedStatus !== 'all' && !plan.plan.some(day => day.status === selectedStatus)) return false;
      return true;
    }).sort((a: PresencePlan, b: PresencePlan) => new Date(b.weekOf).getTime() - new Date(a.weekOf).getTime());
  }, [teamPlans, startDate, endDate, selectedUserIds, selectedStatus]);

  // Logic for Date Range View (Specific days across multiple weeks)
  const rangeFilteredData = useMemo(() => {
    if (!startDate || !endDate) return [];

    const groupedData = new Map<string, { user: User, days: DailyPlan[] }>();

    teamPlans.forEach(plan => {
      // Only show Approved plans
      if (plan.status !== ApprovalStatus.Approved) return;

      // Filter by User
      if (selectedUserIds.length > 0 && !selectedUserIds.includes(plan.user.id)) return;

      plan.plan.forEach(day => {
        // Filter by Date Range
        if (day.date >= startDate && day.date <= endDate) {
          
          // Filter by Status
          if (selectedStatus !== 'all' && day.status !== selectedStatus) return;

          if (!groupedData.has(plan.user.id)) {
            groupedData.set(plan.user.id, { user: plan.user, days: [] });
          }
          groupedData.get(plan.user.id)!.days.push(day);
        }
      });
    });

    // Sort users alphabetically and days chronologically
    return Array.from(groupedData.values())
      .sort((a, b) => a.user.name.localeCompare(b.user.name))
      .map(item => ({
        ...item,
        days: item.days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }));

  }, [teamPlans, startDate, endDate, selectedUserIds, selectedStatus]);


  // Logic for Daily View
  const todayString = new Date().toLocaleDateString('en-CA');
  
  // Group users by their status for today
  const usersByStatus = useMemo(() => {
      const groups: Record<string, User[]> = {};
      
      teamPlans.forEach(plan => {
          // Ensure plan is approved
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

      {viewMode === 'daily' ? (
        <div>
            {hasAnyStatusToday ? (
                PRESENCE_STATUS_OPTIONS.map(option => {
                    const users = usersByStatus[option.value];
                    if (!users || users.length === 0) return null;
                    
                    return (
                        <div key={option.value} className="mb-6 last:mb-0">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                <span className={`w-3 h-3 rounded-full me-2 ${option.color}`}></span>
                                {t[option.value]}
                            </h4>
                            <div className="flex flex-wrap gap-4">
                                {users.map(user => (
                                    <div key={user.id} className="flex items-center group relative">
                                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full shadow ring-2 ring-transparent group-hover:ring-indigo-500 transition-all"/>
                                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                                            {user.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">{t.no_one_in_office_team}</p>
                </div>
            )}
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                    <label htmlFor="start-date-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.start_date}</label>
                    <input id="start-date-filter" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500 rounded-md shadow-sm p-2 text-sm" />
                </div>

                <div>
                    <label htmlFor="end-date-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.end_date}</label>
                    <input id="end-date-filter" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500 rounded-md shadow-sm p-2 text-sm" />
                </div>
              
                <div className="relative" ref={dropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.filter_by_user}</label>
                    <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex justify-between items-center w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 text-sm text-start h-[42px]"
                    >
                    <span className="truncate">{selectedUserIds.length > 0 ? `${selectedUserIds.length} ${t.user}(s) selected` : t.select_users}</span>
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    {isUserDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 rounded-md shadow-lg border border-gray-200 dark:border-slate-600 max-h-60 overflow-y-auto">
                        {teamMembers.map(user => (
                        <label key={user.id} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer">
                            <input type="checkbox" checked={selectedUserIds.includes(user.id)} onChange={() => handleUserSelection(user.id)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                            <span className="ms-3 text-sm">{user.name}</span>
                        </label>
                        ))}
                    </div>
                    )}
                </div>

                <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.filter_by_status}</label>
                    <select
                    id="status-filter"
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="block w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 h-[42px]"
                    >
                    <option value="all">{t.all_statuses}</option>
                    {PRESENCE_STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{t[opt.value]}</option>
                    ))}
                    </select>
                </div>
                <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                    <button onClick={resetFilters} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">{t.reset}</button>
                </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            {isRangeMode ? (
              rangeFilteredData.length > 0 ? (
                rangeFilteredData.map((item) => (
                  <RangePlanRow key={item.user.id} user={item.user} days={item.days} t={t} />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    {t.no_matching_plans}
                </div>
              )
            ) : (
               filteredWeeklyPlans.length > 0 ? filteredWeeklyPlans.map((plan) => (
                <WeeklyPlanRow key={`${plan.user.id}-${plan.weekOf}`} plan={plan} t={t} />
              )) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    {t.no_matching_plans}
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyTeamStatus;
