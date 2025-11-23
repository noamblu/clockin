
import React, { useState, useMemo, useEffect } from 'react';
import { PresencePlan, ApprovalStatus, User, HRNotification, Team, StatusOption } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HRHistoryView from './HRHistoryView';
import { getStatusLabel } from '../constants';

interface DashboardProps {
  t: any;
  teamPlans: PresencePlan[]; 
  teams: Team[];
  users: User[];
  statusOptions: StatusOption[];
  language: 'en' | 'he';
}

const Dashboard: React.FC<DashboardProps> = ({ t, teamPlans: allPlans, teams, users, statusOptions, language }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notifications, setNotifications] = useState<HRNotification[]>([]);
  
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  const [selectedUserId, setSelectedUserId] = useState<string>('all');

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
                  date: new Date().toLocaleDateString(), 
                  type: 'alert',
                  isRead: false 
              });
          }
      });
      setNotifications(alerts);
  }, [allPlans, t]);

  // Hooks must be called unconditionally at the top level
  const filteredUsers = useMemo(() => {
    if (selectedTeamId === 'all') return users;
    return users.filter(u => u.teamId === selectedTeamId);
  }, [users, selectedTeamId]);

  const weekOf = useMemo(() => {
    const d = new Date(selectedDate);
    const day = d.getDay();
    const diff = d.getDate() - day; 
    const sunday = new Date(d.setDate(diff));
    return sunday.toLocaleDateString('en-CA');
  }, [selectedDate]);

  const teamPlans = useMemo(() => {
    return allPlans.filter(p => {
        if (p.weekOf !== weekOf) return false;
        if (selectedTeamId !== 'all') {
            if (p.user.teamId !== selectedTeamId) return false;
        }
        if (selectedUserId !== 'all') {
            if (p.user.id !== selectedUserId) return false;
        }
        return true;
    });
  }, [allPlans, weekOf, selectedTeamId, selectedUserId]);

  const totalCompanyEmployees = useMemo(() => {
    if (selectedUserId !== 'all') return 1;
    return filteredUsers.length;
  }, [filteredUsers, selectedUserId]);

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
    }, {} as Record<string, number>);

  const pieChartData = Object.entries(presenceDistribution).map(([name, value]) => {
    const option = statusOptions.find(opt => opt.value === name);
    return {
      name: option ? getStatusLabel(option, language) : name,
      originalName: name,
      value
    };
  });

  const COLORS = statusOptions.reduce((acc, option) => {
    const colorMap: { [key: string]: string } = {
        'bg-blue-500': '#3B82F6',
        'bg-green-500': '#22C55E',
        'bg-yellow-500': '#EAB308',
        'bg-red-500': '#EF4444',
        'bg-purple-500': '#8B5CF6',
        'bg-gray-500': '#6B7280',
        'bg-pink-500': '#EC4899',
        'bg-indigo-500': '#6366F1',
        'bg-teal-500': '#14B8A6',
        'bg-orange-500': '#F97316',
        'bg-cyan-500': '#06B6D4',
        'bg-lime-500': '#84CC16',
    };
    const label = getStatusLabel(option, language);
    const color = colorMap[option.color] || '#6B7280';
    acc[label] = color;
    acc[option.value] = color;
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
      return todaySchedule?.status === 'Office';
    }).map(plan => plan.user);

  if (showHistory) {
    return <HRHistoryView t={t} onBack={() => setShowHistory(false)} statusOptions={statusOptions} language={language} />;
  }

  const handleMarkAsRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleWhatsApp = (userId: string, message: string) => {
      const user = users.find(u => u.id === userId);
      if (!user || !user.phoneNumber) return;

      const cleanNumber = user.phoneNumber.replace(/\D/g, '');
      let finalNumber = cleanNumber;
      if (cleanNumber.startsWith('0')) {
          finalNumber = '972' + cleanNumber.substring(1);
      }
      const url = `https://wa.me/${finalNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  
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
                    notifications.filter(n => !n.isRead).map(notification => {
                        const user = users.find(u => u.id === notification.userId);
                        return (
                            <div key={notification.id} className="bg-white dark:bg-slate-800 border-l-4 border-red-500 rounded-r-lg shadow-md p-4 flex items-start">
                                <img src={notification.avatarUrl} alt={notification.userName} className="h-10 w-10 rounded-full me-3 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{notification.userName}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                                    <div className="flex gap-2 mt-2">
                                        <button 
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            {t.mark_as_read}
                                        </button>
                                        {user && user.phoneNumber && (
                                             <button 
                                                onClick={() => handleWhatsApp(user.id, notification.message)}
                                                className="text-xs font-medium text-green-600 hover:text-green-700 flex items-center"
                                                title={t.send_whatsapp}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="me-1">
                                                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                                                </svg>
                                                WhatsApp
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg text-center text-gray-500 dark:text-gray-400 text-sm">
                        {t.no_notifications}
                    </div>
                )}
            </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label htmlFor="selected-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.filter_by_date}</label>
                    <input 
                        type="date" 
                        id="selected-date" 
                        value={selectedDate.toLocaleDateString('en-CA')} 
                        onChange={e => setSelectedDate(e.target.value ? new Date(e.target.value + 'T00:00:00') : new Date())} 
                        className="w-full bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500 rounded-md shadow-sm p-2 text-sm" />
                </div>

                <div>
                    <label htmlFor="team-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.filter_by_team}</label>
                    <select
                        id="team-filter"
                        value={selectedTeamId}
                        onChange={(e) => {
                            setSelectedTeamId(e.target.value);
                            setSelectedUserId('all'); 
                        }}
                        className="w-full bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500 rounded-md shadow-sm p-2 text-sm"
                    >
                        <option value="all">{t.all_teams}</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="user-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.filter_by_user}</label>
                    <select
                        id="user-filter"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="w-full bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500 rounded-md shadow-sm p-2 text-sm"
                    >
                        <option value="all">{t.all_users}</option>
                        {filteredUsers.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
      
      {teamPlans.length > 0 || (submittedPlans.length === 0 && totalCompanyEmployees > 0) ? (
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
