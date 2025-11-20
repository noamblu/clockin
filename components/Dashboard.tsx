
import React, { useState, useMemo, useEffect } from 'react';
import { PresencePlan, ApprovalStatus, PresenceStatus, User, HRNotification } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PRESENCE_STATUS_OPTIONS } from '../constants';
import HRHistoryView from './HRHistoryView';

interface DashboardProps {
  t: any;
  teamPlans: PresencePlan[]; // This now contains ALL plans, current and historical
}

const Dashboard: React.FC<DashboardProps> = ({ t, teamPlans: allPlans }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notifications, setNotifications] = useState<HRNotification[]>([]);

  // Generate notifications based on plans needing attention (specifically Rejected plans)
  useEffect(() => {
      const alerts: HRNotification[] = [];
      
      allPlans.forEach(plan => {
          if (plan.status === ApprovalStatus.Rejected) {
              const id = `rej-${plan.user.id}-${plan.weekOf}`;
              alerts.push({
                  id: id,
                  userId: plan.user.id,
                  userName: plan.user.name,
                  avatarUrl: plan.user.avatarUrl,
                  message: t.notification_rejected.replace('{user}', plan.user.name).replace('{date}', plan.weekOf),
                  date: new Date().toLocaleDateString(), // In real app, would be rejection date
                  type: 'alert',
                  isRead: false // Reset read status on refresh/load in this mock
              });
          }
      });
      
      setNotifications(alerts);
  }, [allPlans, t]);

  const handleMarkAsRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (showHistory) {
    return <HRHistoryView t={t} onBack={() => setShowHistory(false)} />;
  }
  
  const getWeekStartDateString = (date: Date): string => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // adjust when day is Sunday
    const sunday = new Date(d.setDate(diff));
    return sunday.toLocaleDateString('en-CA');
  };
  
  const weekOf = getWeekStartDateString(selectedDate);

  const teamPlans = useMemo(() => {
    return allPlans.filter(p => p.weekOf === weekOf);
  }, [allPlans, weekOf]);

  const totalCompanyEmployees = useMemo(() => {
    const userIds = new Set<string>();
    allPlans.forEach(p => userIds.add(p.user.id));
    return userIds.size;
  }, [allPlans]);

  const submittedPlans = teamPlans.filter(p => p.status !== ApprovalStatus.NotSubmitted);
  const approvedPlans = teamPlans.filter(p => p.status === ApprovalStatus.Approved);
  
  const complianceRate = totalCompanyEmployees > 0 ? (submittedPlans.length / totalCompanyEmployees) * 100 : 0;
  const approvalRate = submittedPlans.length > 0 ? (approvedPlans.length / submittedPlans.length) * 100 : 0;

  const presenceDistribution = teamPlans
    .flatMap(p => p.plan)
    .filter(d => d.status)
    .reduce((acc, day) => {
      if(day.status) {
        acc[day.status] = (acc[day.status] || 0) + 1;
      }
      return acc;
    }, {} as Record<PresenceStatus, number>);

  const pieChartData = Object.entries(presenceDistribution).map(([name, value]) => ({
    name: t[name as PresenceStatus],
    value
  }));

  const COLORS = PRESENCE_STATUS_OPTIONS.reduce((acc, option) => {
    // Tailwind colors are not directly available in JS, so we'll approximate
    const colorMap: { [key: string]: string } = {
        'bg-blue-500': '#3B82F6',
        'bg-green-500': '#22C55E',
        'bg-yellow-500': '#EAB308',
        'bg-red-500': '#EF4444',
        'bg-purple-500': '#8B5CF6',
        'bg-gray-500': '#6B7280',
    };
    acc[t[option.value]] = colorMap[option.color];
    return acc;
  }, {} as {[key: string]: string});
  
  const teamComplianceData = [
    { name: 'Team A', compliance: 95 },
    { name: 'Team B', compliance: 88 },
    { name: 'Team C', compliance: 100 },
    { name: 'Team D', compliance: 92 },
  ];

  const selectedDateString = selectedDate.toLocaleDateString('en-CA');

  const inOfficeToday: User[] = teamPlans
    .filter(plan => {
      if (plan.status !== ApprovalStatus.Approved) return false;
      const todaySchedule = plan.plan.find(day => day.date === selectedDateString);
      return todaySchedule?.status === PresenceStatus.Office;
    }).map(plan => plan.user);


  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.hr_dashboard}</h2>
            <button
                onClick={() => setShowHistory(true)}
                className="mt-4 sm:mt-0 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
                {t.view_history}
            </button>
        </div>

        {/* Notification Panel */}
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 me-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    {t.notifications}
                    {unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">{unreadCount}</span>
                    )}
                </h3>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {notifications.filter(n => !n.isRead).length > 0 ? (
                    notifications.filter(n => !n.isRead).map(notification => (
                        <div key={notification.id} className="bg-white dark:bg-slate-800 border-l-4 border-red-500 rounded-r-lg shadow-md p-4 flex items-start">
                            <img src={notification.avatarUrl} alt={notification.userName} className="h-10 w-10 rounded-full me-3 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{notification.userName}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                                <button 
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    {t.mark_as_read}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg text-center text-gray-500 dark:text-gray-400 text-sm">
                        {t.no_notifications}
                    </div>
                )}
            </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4 items-center">
            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 me-4">{t.filter_by_date}</h3>
            <div className="flex-1 w-full md:w-auto">
                <label htmlFor="selected-date" className="sr-only">{t.filter_by_date}</label>
                <input 
                    type="date" 
                    id="selected-date" 
                    value={selectedDate.toLocaleDateString('en-CA')} 
                    onChange={e => setSelectedDate(e.target.value ? new Date(e.target.value + 'T00:00:00') : new Date())} 
                    className="w-full bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500 rounded-md shadow-sm p-2 text-sm" />
            </div>
        </div>
      
      {teamPlans.length > 0 ? (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricCard title={t.compliance_rate} value={`${complianceRate.toFixed(0)}%`} />
                <MetricCard title={t.total_submissions} value={`${submittedPlans.length}/${totalCompanyEmployees}`} />
                <MetricCard title={t.approval_rate} value={`${approvalRate.toFixed(0)}%`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title={t.presence_distribution}>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {pieChartData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard title={t.team_compliance}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={teamComplianceData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="compliance" fill="#4f46e5" />
                    </BarChart>
                </ResponsiveContainer>
                </ChartCard>

                <div className="lg:col-span-2">
                <ChartCard title={`${t.whos_in_office} (${selectedDate.toLocaleDateString()})`}>
                    {inOfficeToday.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {inOfficeToday.map(user => (
                        <div key={user.id} className="flex flex-col items-center text-center p-2">
                            <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full mb-2 shadow-md" />
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="flex items-center justify-center h-40">
                        <p className="text-gray-500 dark:text-gray-400 text-center">{t.no_one_in_office}</p>
                    </div>
                    )}
                </ChartCard>
                </div>

            </div>
        </>
      ) : (
        <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <p className="text-gray-500 dark:text-gray-400">{t.no_plans_in_range}</p>
        </div>
      )}
    </div>
  );
};

const MetricCard: React.FC<{title: string, value: string}> = ({title, value}) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
);

const ChartCard: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
    {children}
  </div>
);

export default Dashboard;
