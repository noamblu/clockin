
import React, { useState, useMemo } from 'react';
import { PresencePlan, ApprovalStatus, User, Team, StatusOption } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HRHistoryView from './HRHistoryView';
import { getStatusLabel, ICON_MAP } from '../constants';

interface DashboardProps {
  t: any;
  teamPlans: PresencePlan[];
  teams: Team[];
  users: User[];
  statusOptions: StatusOption[];
  language: 'en' | 'he';
  theme: 'light' | 'dark';
}

const Dashboard: React.FC<DashboardProps> = ({ t, teamPlans: allPlans, teams, users, statusOptions, language, theme }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  const [selectedUserId, setSelectedUserId] = useState<string>('all');
  
  // Date Range State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter plans based on selection
  const filteredPlans = useMemo(() => {
      return allPlans.filter(plan => {
          if (selectedTeamId !== 'all' && plan.user.teamId !== selectedTeamId) return false;
          if (selectedUserId !== 'all' && plan.user.id !== selectedUserId) return false;
          
          if (startDate) {
              if (plan.weekOf < startDate) return false;
          }
          if (endDate) {
               if (plan.weekOf > endDate) return false;
          }

          return true;
      });
  }, [allPlans, selectedTeamId, selectedUserId, startDate, endDate]);

  // Calculate Statistics
  const stats = useMemo(() => {
    const total = filteredPlans.length;
    const approved = filteredPlans.filter((p) => p.status === ApprovalStatus.Approved).length;
    const submitted = filteredPlans.filter((p) => p.status !== ApprovalStatus.NotSubmitted).length;
    
    const complianceRate = total === 0 ? 0 : Math.round((submitted / total) * 100);
    const approvalRate = submitted === 0 ? 0 : Math.round((approved / submitted) * 100);

    // Presence Distribution (for the week/range)
    const distribution: Record<string, number> = {};
    
    filteredPlans.forEach(plan => {
        if (plan.status === ApprovalStatus.Approved) {
            plan.plan.forEach(day => {
                if (day.status) {
                    distribution[day.status] = (distribution[day.status] || 0) + 1;
                }
            });
        }
    });

    const pieData = Object.keys(distribution).map(status => {
        const opt = statusOptions.find(o => o.value === status);
        return {
            name: opt ? getStatusLabel(opt, language) : status,
            value: distribution[status],
            color: opt ? opt.color.replace('bg-', '') : 'gray-500', // Simple color mapping
            rawColor: opt ? opt.color : 'bg-gray-500' 
        };
    });

    // Map Tailwind colors to Hex for Recharts
    const getColorHex = (tailwindClass: string) => {
        if (!tailwindClass) return '#6b7280';
        if (tailwindClass.includes('blue')) return '#3b82f6';
        if (tailwindClass.includes('green')) return '#22c55e';
        if (tailwindClass.includes('yellow')) return '#eab308';
        if (tailwindClass.includes('red')) return '#ef4444';
        if (tailwindClass.includes('purple')) return '#a855f7';
        if (tailwindClass.includes('gray')) return '#6b7280';
        if (tailwindClass.includes('pink')) return '#ec4899';
        if (tailwindClass.includes('indigo')) return '#6366f1';
        if (tailwindClass.includes('teal')) return '#14b8a6';
        if (tailwindClass.includes('orange')) return '#f97316';
        if (tailwindClass.includes('cyan')) return '#06b6d4';
        if (tailwindClass.includes('lime')) return '#84cc16';
        return '#8884d8';
    };

    const formattedPieData = pieData.map(d => ({ ...d, hex: getColorHex(d.rawColor) }));

    return { complianceRate, total, approvalRate, pieData: formattedPieData };
  }, [filteredPlans, statusOptions, language]);

  const dailyPresenceData = useMemo(() => {
      const dateStr = selectedDate.toLocaleDateString('en-CA');
      
      const groupedByStatus: Record<string, User[]> = {};
      
      filteredPlans.forEach(plan => {
          if (plan.status !== ApprovalStatus.Approved) return;
          
          const dayPlan = plan.plan.find(d => d.date === dateStr);
          if (dayPlan && dayPlan.status) {
              if (!groupedByStatus[dayPlan.status]) {
                  groupedByStatus[dayPlan.status] = [];
              }
              groupedByStatus[dayPlan.status].push(plan.user);
          }
      });

      return groupedByStatus;
  }, [filteredPlans, selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value) {
        // Create date as UTC to avoid timezone shifts when picking from input type="date"
        const d = new Date(e.target.value);
        setSelectedDate(d);
      }
  };

  const handlePrevDay = () => {
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() - 1);
      setSelectedDate(newDate);
  };

  const handleNextDay = () => {
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + 1);
      setSelectedDate(newDate);
  };

  const handleToday = () => {
      setSelectedDate(new Date());
  };

  const resetFilters = () => {
      setSelectedTeamId('all');
      setSelectedUserId('all');
      setStartDate('');
      setEndDate('');
  };

  // Team Compliance Data for Bar Chart
  const teamComplianceData = useMemo(() => {
      const data: any[] = [];
      teams.forEach(team => {
          // Skip if filtering by a specific team and this isn't it
          if (selectedTeamId !== 'all' && team.id !== selectedTeamId) return;

          const teamUsers = users.filter(u => u.teamId === team.id);
          const teamPlanIds = teamUsers.map(u => u.id);
          
          const plans = filteredPlans.filter(p => teamPlanIds.includes(p.user.id));
          
          const submittedCount = plans.filter(p => p.status !== ApprovalStatus.NotSubmitted).length;
          // Use total users in team as denominator unless filtered view is very specific
          // For simplicity, we use the effective plans found or total users if no plans found in filter but users exist
          const effectiveTotal = plans.length > 0 ? plans.length : (startDate || endDate ? 0 : teamUsers.length); 

          const rate = effectiveTotal === 0 ? 0 : Math.round((submittedCount / effectiveTotal) * 100);
          
          data.push({
              name: team.name,
              rate: rate
          });
      });
      return data;
  }, [teams, users, filteredPlans, selectedTeamId, startDate, endDate]);

  if (showHistory) {
    return <HRHistoryView t={t} onBack={() => setShowHistory(false)} statusOptions={statusOptions} language={language} />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.hr_dashboard}</h2>
        <button
          onClick={() => setShowHistory(true)}
          className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {t.view_history}
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.start_date}</label>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm text-gray-900 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.end_date}</label>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm text-gray-900 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.filter_by_team}</label>
                <select 
                    value={selectedTeamId} 
                    onChange={(e) => {
                        setSelectedTeamId(e.target.value);
                        setSelectedUserId('all'); // Reset user filter when team changes
                    }}
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm text-gray-900 dark:text-white"
                >
                    <option value="all">{t.all_teams}</option>
                    {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.filter_by_user}</label>
                <select 
                    value={selectedUserId} 
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm text-gray-900 dark:text-white"
                >
                    <option value="all">{t.all_users}</option>
                    {users
                        .filter(u => selectedTeamId === 'all' || u.teamId === selectedTeamId)
                        .map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
            </div>
        </div>
        {(startDate || endDate || selectedTeamId !== 'all' || selectedUserId !== 'all') && (
            <div className="mt-4 flex justify-end">
                <button onClick={resetFilters} className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 underline font-medium">
                    {t.reset}
                </button>
            </div>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t.compliance_rate}</h3>
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{stats.complianceRate}%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t.total_submissions}</h3>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t.approval_rate}</h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">{stats.approvalRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Presence Distribution Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t.presence_distribution}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hex} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', 
                        borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                        color: theme === 'dark' ? '#fff' : '#000'
                    }}
                    itemStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Compliance Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t.team_compliance}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamComplianceData}>
                <XAxis 
                    dataKey="name" 
                    stroke={theme === 'dark' ? '#94a3b8' : '#4b5563'} 
                    tick={{fill: theme === 'dark' ? '#cbd5e1' : '#374151'}}
                />
                <YAxis 
                    stroke={theme === 'dark' ? '#94a3b8' : '#4b5563'} 
                    tick={{fill: theme === 'dark' ? '#cbd5e1' : '#374151'}}
                />
                <Tooltip 
                    cursor={{fill: theme === 'dark' ? '#334155' : '#f3f4f6'}}
                    contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', 
                        borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                        color: theme === 'dark' ? '#fff' : '#000'
                    }}
                />
                <Bar dataKey="rate" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily Presence Snapshot with History Navigation */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.daily_presence_snapshot}</h3>
              <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                  <button 
                      onClick={handlePrevDay} 
                      className="p-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                      title={t.prev_day}
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                  </button>
                  <div className="flex items-center mx-2">
                       <label className="sr-only">{t.filter_by_date}</label>
                      <input 
                        type="date" 
                        value={selectedDate.toLocaleDateString('en-CA')}
                        onChange={handleDateChange}
                        className="rounded-md border-none bg-transparent py-1 px-2 focus:ring-0 sm:text-sm text-gray-900 dark:text-white font-medium cursor-pointer"
                      />
                  </div>
                   <button 
                      onClick={handleNextDay} 
                      className="p-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                      title={t.next_day}
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                  </button>
                  <button 
                    onClick={handleToday}
                    className="ms-2 px-2 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                      {t.today}
                  </button>
              </div>
          </div>

          <div className="space-y-6">
              {Object.keys(dailyPresenceData).length > 0 ? (
                   Object.keys(dailyPresenceData).map(status => {
                    const option = statusOptions.find(opt => opt.value === status);
                    if (!option) return null;
                    
                    return (
                        <div key={status}>
                             <div className="flex items-center mb-3">
                                <span className={`w-3 h-3 rounded-full me-2 ${option.color}`}></span>
                                <h4 className="font-semibold text-gray-800 dark:text-white flex items-center">
                                    {getStatusLabel(option, language)}
                                    <span className="ms-2 text-xs font-normal text-gray-500 dark:text-gray-400">({dailyPresenceData[status].length})</span>
                                </h4>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {dailyPresenceData[status].map(user => (
                                    <div key={user.id} className="flex items-center bg-slate-50 dark:bg-slate-700/50 rounded-full pe-3 ps-1 py-1 border border-slate-200 dark:border-slate-600">
                                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full me-2"/>
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block leading-tight">{user.name}</span>
                                            {user.teamId && (
                                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                                    {teams.find(t => t.id === user.teamId)?.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
              ) : (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                      {t.no_data_for_date}
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
