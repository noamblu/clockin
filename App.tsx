
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UserRole, PresencePlan, User, ApprovalStatus } from './types';
import { TRANSLATIONS, MOCK_EMPLOYEE_PLAN, MOCK_TEAM_PLANS, MOCK_ALL_HISTORICAL_PLANS, MOCK_HISTORICAL_PLANS, MOCK_USER, MOCK_ALL_USERS, getWeekDays } from './constants';
import Header from './components/Header';
import EmployeeDashboard from './components/EmployeeDashboard';
import TeamView from './components/TeamView';
import Dashboard from './components/Dashboard';
import AdminView from './components/AdminView';
import NotificationBanner from './components/NotificationBanner';
import Login from './components/Login';
import UserProfile from './components/UserProfile';

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
  const [showProfile, setShowProfile] = useState(false);
  
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_ALL_USERS);

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
  
  const handleLogin = (googleUser?: Partial<User>) => {
    if (googleUser) {
        // Handle Google SSO Login
        // Check if user exists in our "database" (allUsers) by email or ID
        let existingUser = allUsers.find(u => u.email === googleUser.email);
        
        if (!existingUser) {
            // If not exists, create a new user entry (Simulation)
            existingUser = {
                id: googleUser.id || `u${Date.now()}`,
                name: googleUser.name || 'Google User',
                avatarUrl: googleUser.avatarUrl || 'https://i.pravatar.cc/150?u=google',
                roles: [UserRole.Employee],
                email: googleUser.email
            };
            setAllUsers([...allUsers, existingUser]);
        }

        setCurrentUser(existingUser);
        setUserRole(existingUser.roles[0]);
        setIsAuthenticated(true);
    } else {
        // Default Mock Login
        const loggedInUser: User = {
            id: 'u99',
            name: 'Galia Levi',
            avatarUrl: `https://i.pravatar.cc/150?u=galia`,
            roles: [UserRole.Employee, UserRole.Admin], 
            email: 'galia@example.com'
        };
        setCurrentUser(loggedInUser);
        setUserRole(loggedInUser.roles[0]);
        setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowProfile(false);
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

  const handleUserUpdate = (updatedUser: User) => {
      setCurrentUser(updatedUser);
  };

  const handleCopyPreviousPlan = useCallback(() => {
    const prevDate = new Date(currentPlannerDate);
    prevDate.setDate(prevDate.getDate() - 7);
    const prevWeekDays = getWeekDays(prevDate);
    const prevWeekOf = prevWeekDays[0].date;
    
    let sourcePlan = employeePlansMap[prevWeekOf];
    
    // Fallback to mock history if not in local state
    if (!sourcePlan) {
        const userIdToCheck = currentUser?.id || MOCK_USER.id;
        sourcePlan = MOCK_HISTORICAL_PLANS.find(p => p.weekOf === prevWeekOf && p.user.id === userIdToCheck);
    }

    if (sourcePlan && sourcePlan.plan) {
        const currentWeekDays = getWeekDays(currentPlannerDate);
        const newPlanDays = currentWeekDays.map((day, index) => {
            const sourceDay = sourcePlan!.plan[index];
            return {
                ...day,
                status: sourceDay ? sourceDay.status : null
            };
        });
        
        const currentWeekOf = currentWeekDays[0].date;
        const newPlan: PresencePlan = {
            user: currentUser || MOCK_USER,
            weekOf: currentWeekOf,
            status: ApprovalStatus.NotSubmitted,
            plan: newPlanDays
        };
        
        handlePlanUpdate(newPlan);
    } else {
        alert(t.no_previous_plan);
    }
  }, [currentPlannerDate, employeePlansMap, currentUser, t, handlePlanUpdate]);

  const getCurrentWeekPlan = useMemo(() => {
      const tempWeekDays = getWeekDays(currentPlannerDate);
      const weekOfStr = tempWeekDays[0].date;

      if (employeePlansMap[weekOfStr]) {
          return employeePlansMap[weekOfStr];
      }

      return {
          user: currentUser || MOCK_EMPLOYEE_PLAN.user,
          weekOf: weekOfStr,
          status: ApprovalStatus.NotSubmitted,
          plan: tempWeekDays,
      };
  }, [currentPlannerDate, employeePlansMap, currentUser]);

  const renderContent = () => {
    if (showProfile && currentUser) {
        return <UserProfile t={t} user={currentUser} onUpdate={handleUserUpdate} onClose={() => setShowProfile(false)} />;
    }

    switch (userRole) {
      case UserRole.Employee:
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
            onCopyPreviousPlan={handleCopyPreviousPlan}
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
    return (
        <Login 
            onLogin={handleLogin} 
            t={t} 
            language={language} 
            setLanguage={setLanguage}
        />
    );
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
        onProfileClick={() => setShowProfile(!showProfile)}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {!showProfile && showReminder && (
          <NotificationBanner 
            title={t.reminder_title} 
            message={t.reminder_body} 
            onClose={() => setShowReminder(false)} 
          />
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
