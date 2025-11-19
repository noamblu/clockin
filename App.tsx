
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UserRole, PresencePlan, User, ApprovalStatus } from './types';
import { TRANSLATIONS, MOCK_EMPLOYEE_PLAN, MOCK_TEAM_PLANS, MOCK_ALL_HISTORICAL_PLANS, getWeekDays } from './constants';
import Header from './components/Header';
import EmployeeDashboard from './components/EmployeeDashboard';
import TeamView from './components/TeamView';
import Dashboard from './components/Dashboard';
import AdminView from './components/AdminView';
import NotificationBanner from './components/NotificationBanner';
import Login from './components/Login';

const App: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'he'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.Employee);
  
  // Manage a map of plans keyed by the week starting date string
  const [employeePlansMap, setEmployeePlansMap] = useState<Record<string, PresencePlan>>({
    [MOCK_EMPLOYEE_PLAN.weekOf]: MOCK_EMPLOYEE_PLAN
  });
  
  // Track the current date being viewed in the planner
  const [currentPlannerDate, setCurrentPlannerDate] = useState(new Date());

  const [teamPlans, setTeamPlans] = useState<PresencePlan[]>(MOCK_TEAM_PLANS);
  const [showReminder, setShowReminder] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);


  // Simulate reminder notification
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(() => {
      if (userRole === UserRole.Employee) {
        setShowReminder(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [userRole, isAuthenticated]);
  
  const handleLogin = () => {
    const loggedInUser = {
      id: 'u99',
      name: 'Galia Levi',
      avatarUrl: `https://i.pravatar.cc/150?u=galia`,
      role: UserRole.Employee,
    };
    setCurrentUser(loggedInUser);
    setUserRole(loggedInUser.role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const handlePlanUpdate = useCallback((updatedPlan: PresencePlan) => {
    setEmployeePlansMap(prev => ({
        ...prev,
        [updatedPlan.weekOf]: updatedPlan
    }));
  }, []);

  const handleTeamPlanUpdate = useCallback((updatedPlans: PresencePlan[]) => {
    setTeamPlans(updatedPlans);
  }, []);

  // Helper to get the plan for the current view date, or generate a new one
  const getCurrentWeekPlan = useMemo(() => {
      const tempWeekDays = getWeekDays(currentPlannerDate);
      const weekOfStr = tempWeekDays[0].date;

      if (employeePlansMap[weekOfStr]) {
          return employeePlansMap[weekOfStr];
      }

      // If no plan exists for this week, create a fresh one (but don't save to state until edited)
      return {
          user: currentUser || MOCK_EMPLOYEE_PLAN.user,
          weekOf: weekOfStr,
          status: ApprovalStatus.NotSubmitted,
          plan: tempWeekDays,
      };
  }, [currentPlannerDate, employeePlansMap, currentUser]);

  const renderContent = () => {
    switch (userRole) {
      case UserRole.Employee:
        // Combine current and historical plans for the team to make date range filter useful
        const teamUserIds = MOCK_TEAM_PLANS.map(p => p.user.id);
        const allTeamHistoricalPlans = MOCK_ALL_HISTORICAL_PLANS.filter(p => teamUserIds.includes(p.user.id));
        const allTeamPlansForDashboard = [...teamPlans, ...allTeamHistoricalPlans];
        return (
          <EmployeeDashboard
            t={t}
            employeePlan={getCurrentWeekPlan}
            onPlanUpdate={handlePlanUpdate}
            teamPlans={allTeamPlansForDashboard}
            currentDate={currentPlannerDate}
            onDateChange={setCurrentPlannerDate}
          />
        );
      case UserRole.TeamLead:
        return <TeamView t={t} teamPlans={teamPlans} onTeamPlanUpdate={handleTeamPlanUpdate} />;
      case UserRole.HR:
        return <Dashboard t={t} teamPlans={[...teamPlans, ...MOCK_ALL_HISTORICAL_PLANS]} />;
      case UserRole.Admin:
        return <AdminView t={t} />;
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} t={t} language={language} setLanguage={setLanguage}/>;
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header
        t={t}
        user={currentUser}
        language={language}
        setLanguage={setLanguage}
        userRole={userRole}
        setUserRole={setUserRole}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {showReminder && <NotificationBanner t={t} onClose={() => setShowReminder(false)} />}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
