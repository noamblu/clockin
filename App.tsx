
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, PresencePlan, User, ApprovalStatus, MandatoryDate, WorkPolicy, Team, StatusOption } from './types';
import { TRANSLATIONS, MOCK_EMPLOYEE_PLAN, MOCK_TEAM_PLANS, MOCK_HISTORICAL_PLANS, MOCK_USER, MOCK_ALL_USERS, getWeekDays, MOCK_MANDATORY_DATES, MOCK_WORK_POLICY, MOCK_TEAMS, INITIAL_STATUS_OPTIONS } from './constants';
import Header from './components/Header';
import EmployeeDashboard from './components/EmployeeDashboard';
import TeamView from './components/TeamView';
import Dashboard from './components/Dashboard';
import AdminView from './components/AdminView';
import NotificationBanner from './components/NotificationBanner';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs as 'light' | 'dark';
    }
    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  return 'light';
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'he'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.Employee);
  
  const [employeePlansMap, setEmployeePlansMap] = useState<Record<string, PresencePlan>>({
    [MOCK_EMPLOYEE_PLAN.weekOf]: MOCK_EMPLOYEE_PLAN
  });
  
  const [currentPlannerDate, setCurrentPlannerDate] = useState(new Date());

  const [teamPlans, setTeamPlans] = useState<PresencePlan[]>(MOCK_TEAM_PLANS);
  const [showReminder, setShowReminder] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_ALL_USERS);
  const [mandatoryDates, setMandatoryDates] = useState<MandatoryDate[]>(MOCK_MANDATORY_DATES);
  const [workPolicy, setWorkPolicy] = useState<WorkPolicy>(MOCK_WORK_POLICY);
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>(INITIAL_STATUS_OPTIONS);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

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
        let existingUser = allUsers.find(u => u.email === googleUser.email);
        
        if (!existingUser) {
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

  const handleRegister = (newUser: Partial<User>) => {
      const user: User = {
          id: `u${Date.now()}`,
          name: newUser.name || 'New User',
          email: newUser.email,
          avatarUrl: 'https://i.pravatar.cc/150?u=default',
          roles: [UserRole.Employee]
      };
      setAllUsers([...allUsers, user]);
      setCurrentUser(user);
      setUserRole(UserRole.Employee);
      setIsAuthenticated(true);
      setIsRegistering(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowProfile(false);
    setIsRegistering(false);
  };

  const handleLogoClick = () => {
      setShowProfile(false);
      setUserRole(UserRole.Employee);
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
      setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleAddMandatoryDate = (rule: MandatoryDate) => {
    setMandatoryDates([...mandatoryDates, rule]);
  };

  const handleDeleteMandatoryDate = (id: string) => {
    setMandatoryDates(mandatoryDates.filter(d => d.id !== id));
  };

  const handleUpdateWorkPolicy = (newPolicy: WorkPolicy) => {
      setWorkPolicy(newPolicy);
  };

  const handleAddStatus = (status: StatusOption) => {
    setStatusOptions([...statusOptions, status]);
  };

  const handleDeleteStatus = (id: string) => {
    setStatusOptions(statusOptions.filter(s => s.id !== id));
  };

  const handleCopyPreviousPlan = useCallback(() => {
    const prevDate = new Date(currentPlannerDate);
    prevDate.setDate(prevDate.getDate() - 7);
    const prevWeekDays = getWeekDays(prevDate);
    const prevWeekOf = prevWeekDays[0].date;
    
    let sourcePlan = employeePlansMap[prevWeekOf];
    
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

  // Derived state for current week's plan view
  const currentWeekDays = getWeekDays(currentPlannerDate);
  const currentWeekOf = currentWeekDays[0].date;
  const currentEmployeePlan = employeePlansMap[currentWeekOf] || {
      user: currentUser || MOCK_USER,
      weekOf: currentWeekOf,
      status: ApprovalStatus.NotSubmitted,
      plan: currentWeekDays
  };

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-200 ${theme}`}>
      {!isAuthenticated ? (
         isRegistering ? (
             <Register 
                onRegister={handleRegister} 
                onSwitchToLogin={() => setIsRegistering(false)} 
                t={t}
                language={language}
                setLanguage={setLanguage}
             />
         ) : (
            <Login 
                onLogin={handleLogin} 
                t={t} 
                language={language}
                setLanguage={setLanguage}
            />
         )
      ) : (
          <>
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
                onProfileClick={() => setShowProfile(true)}
                onLogoClick={handleLogoClick}
            />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {showReminder && (
                    <NotificationBanner 
                        title={t.reminder_title} 
                        message={t.reminder_body} 
                        onClose={() => setShowReminder(false)} 
                    />
                )}
                
                {showProfile && currentUser ? (
                    <UserProfile 
                        t={t} 
                        user={currentUser} 
                        onUpdate={handleUserUpdate} 
                        onClose={() => setShowProfile(false)} 
                    />
                ) : (
                    <>
                        {userRole === UserRole.Employee && (
                            <EmployeeDashboard 
                                t={t} 
                                employeePlan={currentEmployeePlan} 
                                onPlanUpdate={handlePlanUpdate}
                                teamPlans={teamPlans}
                                currentDate={currentPlannerDate}
                                onDateChange={setCurrentPlannerDate}
                                onCopyPreviousPlan={handleCopyPreviousPlan}
                                mandatoryDates={mandatoryDates}
                                workPolicy={workPolicy}
                                statusOptions={statusOptions}
                                language={language}
                            />
                        )}
                        {userRole === UserRole.TeamLead && (
                             <TeamView 
                                t={t} 
                                teamPlans={teamPlans} 
                                onTeamPlanUpdate={handleTeamPlanUpdate} 
                                mandatoryDates={mandatoryDates}
                                onAddMandatoryDate={handleAddMandatoryDate}
                                onDeleteMandatoryDate={handleDeleteMandatoryDate}
                                teams={teams}
                                currentUser={currentUser}
                                statusOptions={statusOptions}
                                language={language}
                            />
                        )}
                        {userRole === UserRole.HR && (
                             <Dashboard 
                                t={t} 
                                teamPlans={[...teamPlans, ...MOCK_HISTORICAL_PLANS]} 
                                teams={teams}
                                users={allUsers}
                                statusOptions={statusOptions}
                                language={language}
                            />
                        )}
                        {userRole === UserRole.Admin && (
                             <AdminView 
                                t={t} 
                                mandatoryDates={mandatoryDates}
                                onAddMandatoryDate={handleAddMandatoryDate}
                                onDeleteMandatoryDate={handleDeleteMandatoryDate}
                                workPolicy={workPolicy}
                                onUpdateWorkPolicy={handleUpdateWorkPolicy}
                                statusOptions={statusOptions}
                                onAddStatus={handleAddStatus}
                                onDeleteStatus={handleDeleteStatus}
                                language={language}
                            />
                        )}
                    </>
                )}
            </main>
          </>
      )}
    </div>
  );
};

export default App;
