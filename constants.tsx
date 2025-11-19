
import { PresenceStatus, ApprovalStatus, UserRole, PresencePlan, User, DailyPlan } from './types';

export const ICONS = {
  [PresenceStatus.Office]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>
  ),
  [PresenceStatus.Home]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
  ),
  [PresenceStatus.Vacation]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.997 5.997 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v1.5a1.5 1.5 0 01-3 0V12a2 2 0 00-2-2 2 2 0 01-2-2V8.5A1.5 1.5 0 017.5 7 2 2 0 006 6c-.526 0-.988.27-1.215.688A5.978 5.978 0 014 10c0-.34.028-.675.083-1h.249z" clipRule="evenodd" /></svg>
  ),
  [PresenceStatus.Sick]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
  ),
  [PresenceStatus.Branch]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v5a1 1 0 001 1h2.05a2.5 2.5 0 014.9 0H21a1 1 0 001-1V8a1 1 0 00-1-1h-7z" /></svg>
  ),
  [PresenceStatus.Other]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
  ),
};

export const TRANSLATIONS = {
  en: {
    title: 'ClockIn',
    subtitle: 'Weekly Presence Management',
    employee: 'Employee',
    team_lead: 'Team Lead',
    hr: 'HR',
    admin: 'Admin',
    weekly_plan: 'Weekly Plan',
    team_presence: 'Team Presence',
    hr_dashboard: 'HR Dashboard',
    admin_panel: 'Admin Panel',
    user_management: 'User Management',
    system_settings: 'System Settings',
    audit_log: 'Audit Log',
    week_of: 'Week of',
    submit_plan: 'Submit Plan',
    plan_submitted: 'Plan Submitted!',
    submission_deadline: 'Submission deadline: Thursday 15:00',
    status: 'Status',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    not_submitted: 'Not Submitted',
    approve: 'Approve',
    reject: 'Reject',
    team_member: 'Team Member',
    weekly_schedule: 'Weekly Schedule',
    actions: 'Actions',
    presence_distribution: 'Presence Distribution',
    compliance_rate: 'Compliance Rate',
    total_submissions: 'Total Submissions',
    approval_rate: 'Approval Rate',
    team_compliance: 'Team Compliance',
    [PresenceStatus.Office]: 'Office',
    [PresenceStatus.Home]: 'Home',
    [PresenceStatus.Vacation]: 'Vacation',
    [PresenceStatus.Sick]: 'Sick',
    [PresenceStatus.Branch]: 'Branch',
    [PresenceStatus.Other]: 'Other',
    select_status: 'Select Status',
    reminder_title: 'Friendly Reminder',
    reminder_body: 'Your weekly presence plan is due by Thursday 15:00. Please submit it on time.',
    close: 'Close',
    whos_in_office: "Who's in the Office Today?",
    no_one_in_office: "No one is in the office today.",
    role: 'Role',
    change_role: 'Change Role',
    action: 'Action',
    timestamp: 'Timestamp',
    user: 'User',
    my_team_status: "My Team's Status Today",
    team_weekly_status: 'Team Weekly Status',
    in_office: "In the Office",
    at_home: "Working from Home",
    no_one_in_office_team: "No one from your team is in the office.",
    no_one_at_home_team: "No one from your team is working from home.",
    plan_history: "Plan History",
    view_history: "View History",
    back_to_current_week: "Back to Current Week",
    hr_history: "HR Plan History",
    filter_by_date: "Filter by Date",
    start_date: "Start Date",
    end_date: "End Date",
    apply: "Apply",
    reset: "Reset",
    no_plans_in_range: "No plans found for the selected date range.",
    back_to_dashboard: "Back to Dashboard",
    sign_in_with_google: 'Sign in with Google',
    sign_out: 'Sign Out',
    filter_by_user: 'Filter by User',
    filter_by_status: 'Filter by Status',
    select_users: 'Select Users',
    select_week: 'Select Week',
    all_statuses: 'All Statuses',
    no_matching_plans: 'No plans match the current filters.',
    daily_view: 'Daily View',
    weekly_view: 'Weekly View',
    next_week: 'Next Week',
    previous_week: 'Previous Week',
    current_week: 'Current Week',
  },
  he: {
    title: 'נוכחות',
    subtitle: 'מערכת ניהול נוכחות שבועית',
    employee: 'עובד',
    team_lead: 'ראש צוות',
    hr: 'משאבי אנוש',
    admin: 'מנהל מערכת',
    weekly_plan: 'תוכנית שבועית',
    team_presence: 'נוכחות צוותית',
    hr_dashboard: 'לוח מחוונים למשאבי אנוש',
    admin_panel: 'פאנל ניהול',
    user_management: 'ניהול משתמשים',
    system_settings: 'הגדרות מערכת',
    audit_log: 'יומן ביקורת',
    week_of: 'שבוע של',
    submit_plan: 'הגש תוכנית',
    plan_submitted: 'התוכנית הוגשה!',
    submission_deadline: 'מועד אחרון להגשה: יום חמישי 15:00',
    status: 'סטטוס',
    pending: 'ממתין לאישור',
    approved: 'מאושר',
    rejected: 'נדחה',
    not_submitted: 'לא הוגש',
    approve: 'אשר',
    reject: 'דחה',
    team_member: 'חבר צוות',
    weekly_schedule: 'לו"ז שבועי',
    actions: 'פעולות',
    presence_distribution: 'תמהיל נוכחות',
    compliance_rate: 'שיעור הגשות',
    total_submissions: 'סך הכל הגשות',
    approval_rate: 'שיעור אישורים',
    team_compliance: 'הגשות בצוות',
    [PresenceStatus.Office]: 'משרד',
    [PresenceStatus.Home]: 'בית',
    [PresenceStatus.Vacation]: 'חופשה',
    [PresenceStatus.Sick]: 'מחלה',
    [PresenceStatus.Branch]: 'סניף',
    [PresenceStatus.Other]: 'אחר',
    select_status: 'בחר סטטוס',
    reminder_title: 'תזכורת ידידותית',
    reminder_body: 'יש להגיש את תוכנית הנוכחות השבועית עד יום חמישי בשעה 15:00. אנא הגש אותה בזמן.',
    close: 'סגור',
    whos_in_office: "מי במשרד היום?",
    no_one_in_office: "אף אחד לא במשרד היום.",
    role: 'תפקיד',
    change_role: 'שנה תפקיד',
    action: 'פעולה',
    timestamp: 'חותמת זמן',
    user: 'משתמש',
    my_team_status: "סטטוס הצוות שלי היום",
    team_weekly_status: 'סטטוס צוותי שבועי',
    in_office: "במשרד",
    at_home: "עובדים מהבית",
    no_one_in_office_team: "אף אחד מהצוות שלך לא במשרד.",
    no_one_at_home_team: "אף אחד מהצוות שלך לא עובד מהבית.",
    plan_history: "היסטוריית תוכניות",
    view_history: "צפה בהיסטוריה",
    back_to_current_week: "חזרה לשבוע הנוכחי",
    hr_history: "היסטוריית תוכניות כללית",
    filter_by_date: "סינון לפי תאריך",
    start_date: "תאריך התחלה",
    end_date: "תאריך סיום",
    apply: "החל",
    reset: "אפס",
    no_plans_in_range: "לא נמצאו תוכניות בטווח התאריכים שנבחר.",
    back_to_dashboard: "חזרה ללוח המחוונים",
    sign_in_with_google: 'התחברות עם גוגל',
    sign_out: 'התנתקות',
    filter_by_user: 'סינון לפי משתמש',
    filter_by_status: 'סינון לפי סטטוס',
    select_users: 'בחר עובדים',
    select_week: 'בחר שבוע',
    all_statuses: 'כל הסטטוסים',
    no_matching_plans: 'לא נמצאו תוכניות התואמות לסינון.',
    daily_view: 'תצוגה יומית',
    weekly_view: 'תצוגה שבועית',
    next_week: 'שבוע הבא',
    previous_week: 'שבוע שעבר',
    current_week: 'שבוע נוכחי',
  },
};

export const PRESENCE_STATUS_OPTIONS = [
  { value: PresenceStatus.Office, color: 'bg-blue-500', icon: ICONS[PresenceStatus.Office] },
  { value: PresenceStatus.Home, color: 'bg-green-500', icon: ICONS[PresenceStatus.Home] },
  { value: PresenceStatus.Vacation, color: 'bg-yellow-500', icon: ICONS[PresenceStatus.Vacation] },
  { value: PresenceStatus.Sick, color: 'bg-red-500', icon: ICONS[PresenceStatus.Sick] },
  { value: PresenceStatus.Branch, color: 'bg-purple-500', icon: ICONS[PresenceStatus.Branch] },
  { value: PresenceStatus.Other, color: 'bg-gray-500', icon: ICONS[PresenceStatus.Other] },
];

// Helper to get the week days for any specific date
export const getWeekDays = (baseDate: Date = new Date()): DailyPlan[] => {
  const days = [];
  // Create a copy to avoid mutating the original date
  const targetDate = new Date(baseDate);
  const dayOfWeek = targetDate.getDay(); // 0 is Sunday, 6 is Saturday
  const firstDayOfWeek = targetDate.getDate() - dayOfWeek; 
  
  for (let i = 0; i < 5; i++) { // Sunday to Thursday
      const date = new Date(targetDate);
      date.setDate(firstDayOfWeek + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateString = date.toLocaleDateString('en-CA'); // YYYY-MM-DD
      days.push({ day: dayName, date: dateString, status: null });
  }
  return days;
};

export const getCurrentWeekDays = (): DailyPlan[] => {
  return getWeekDays(new Date());
};

export const MOCK_USER: User = {
    id: 'u1',
    name: 'Dana Cohen',
    avatarUrl: `https://i.pravatar.cc/150?u=dana`,
    role: UserRole.Employee,
};


export const MOCK_EMPLOYEE_PLAN: PresencePlan = {
  user: MOCK_USER,
  weekOf: getCurrentWeekDays()[0].date,
  status: ApprovalStatus.NotSubmitted,
  plan: getCurrentWeekDays(),
};

export const MOCK_TEAM_PLANS: PresencePlan[] = [
  {
    user: { id: 'u2', name: 'Avi Levi', avatarUrl: `https://i.pravatar.cc/150?u=avi`, role: UserRole.Employee },
    weekOf: getCurrentWeekDays()[0].date,
    status: ApprovalStatus.Approved, // Changed to Approved for "Who's in office" feature
    plan: [
      { ...getCurrentWeekDays()[0], status: PresenceStatus.Office }, // Sunday
      { ...getCurrentWeekDays()[1], status: PresenceStatus.Office }, // Monday
      { ...getCurrentWeekDays()[2], status: PresenceStatus.Home },
      { ...getCurrentWeekDays()[3], status: PresenceStatus.Home },
      { ...getCurrentWeekDays()[4], status: PresenceStatus.Office },
    ],
  },
  {
    user: { id: 'u3', name: 'Yael Mizrahi', avatarUrl: `https://i.pravatar.cc/150?u=yael`, role: UserRole.Employee },
    weekOf: getCurrentWeekDays()[0].date,
    status: ApprovalStatus.Approved,
    plan: [
      { ...getCurrentWeekDays()[0], status: PresenceStatus.Home },
      { ...getCurrentWeekDays()[1], status: PresenceStatus.Home },
      { ...getCurrentWeekDays()[2], status: PresenceStatus.Vacation },
      { ...getCurrentWeekDays()[3], status: PresenceStatus.Vacation },
      { ...getCurrentWeekDays()[4], status: PresenceStatus.Vacation },
    ],
  },
  {
    user: { id: 'u4', name: 'Moshe Katz', avatarUrl: `https://i.pravatar.cc/150?u=moshe`, role: UserRole.Employee },
    weekOf: getCurrentWeekDays()[0].date,
    status: ApprovalStatus.NotSubmitted,
    plan: getCurrentWeekDays(),
  },
  {
    user: { id: 'u5', name: 'Rivka Shalom', avatarUrl: `https://i.pravatar.cc/150?u=rivka`, role: UserRole.Employee },
    weekOf: getCurrentWeekDays()[0].date,
    status: ApprovalStatus.Rejected,
    plan: [
      { ...getCurrentWeekDays()[0], status: PresenceStatus.Branch },
      { ...getCurrentWeekDays()[1], status: PresenceStatus.Branch },
      { ...getCurrentWeekDays()[2], status: PresenceStatus.Branch },
      { ...getCurrentWeekDays()[3], status: PresenceStatus.Branch },
      { ...getCurrentWeekDays()[4], status: PresenceStatus.Branch },
    ],
  },
];

const getPastWeekDays = (weeksAgo: number): DailyPlan[] => {
  const today = new Date();
  // Adjust date by weeksAgo
  today.setDate(today.getDate() - (weeksAgo * 7));
  return getWeekDays(today).map(day => {
     const randomStatus = [
      PresenceStatus.Office,
      PresenceStatus.Home,
      PresenceStatus.Office,
      PresenceStatus.Home,
      PresenceStatus.Vacation,
    ][Math.floor(Math.random() * 5)];
    return { ...day, status: randomStatus };
  });
};

export const MOCK_HISTORICAL_PLANS: PresencePlan[] = [1, 2, 3].map(i => {
    const plan = getPastWeekDays(i);
    return {
        user: MOCK_USER,
        weekOf: plan[0].date,
        status: ApprovalStatus.Approved,
        plan: plan,
        submittedAt: new Date(Date.now() - (i * 7 + 3) * 24 * 60 * 60 * 1000),
    }
});

export const MOCK_ALL_USERS: User[] = [
  MOCK_USER,
  ...MOCK_TEAM_PLANS.map(p => p.user),
  { id: 'u6', name: 'Ronit Gal', avatarUrl: `https://i.pravatar.cc/150?u=ronit`, role: UserRole.TeamLead },
  { id: 'u7', name: 'Shira Klein', avatarUrl: `https://i.pravatar.cc/150?u=shira`, role: UserRole.HR },
  { id: 'u8', name: 'Admin User', avatarUrl: `https://i.pravatar.cc/150?u=admin`, role: UserRole.Admin },
];

export const MOCK_ALL_HISTORICAL_PLANS: PresencePlan[] = MOCK_ALL_USERS.flatMap(user => {
    return [1, 2, 3, 4].map(i => {
        const plan = getPastWeekDays(i);
        return {
            user: user,
            weekOf: plan[0].date,
            status: ApprovalStatus.Approved,
            plan: plan,
            submittedAt: new Date(Date.now() - (i * 7 + 2) * 24 * 60 * 60 * 1000),
        };
    });
});

export const MOCK_AUDIT_LOGS = [
  { timestamp: new Date(Date.now() - 3600000), user: 'Dana Cohen', action: 'Submitted weekly plan.' },
  { timestamp: new Date(Date.now() - 7200000), user: 'Ronit Gal', action: 'Approved plan for Avi Levi.' },
  { timestamp: new Date(Date.now() - 86400000), user: 'Admin User', action: 'Updated system setting: Submission Deadline.' },
  { timestamp: new Date(Date.now() - 172800000), user: 'Yael Mizrahi', action: 'Submitted weekly plan.' },
];
