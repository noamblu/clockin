
import React from 'react';
import { PresenceStatus, ApprovalStatus, UserRole, PresencePlan, User, DailyPlan, Team } from './types';

export const ICONS = {
  [PresenceStatus.Office]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm3 1h6v4H7V5zm6 6H7v4h6v-4z" clipRule="evenodd" /></svg>
  ),
  [PresenceStatus.Home]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
  ),
  [PresenceStatus.Vacation]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
  ),
  [PresenceStatus.Sick]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" /></svg>
  ),
  [PresenceStatus.Branch]: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
  ),
  [PresenceStatus.Other]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
  ),
};

export const PRESENCE_STATUS_OPTIONS = [
  { value: PresenceStatus.Office, label: 'Office', icon: ICONS[PresenceStatus.Office], color: 'bg-blue-500' },
  { value: PresenceStatus.Home, label: 'Home', icon: ICONS[PresenceStatus.Home], color: 'bg-green-500' },
  { value: PresenceStatus.Vacation, label: 'Vacation', icon: ICONS[PresenceStatus.Vacation], color: 'bg-yellow-500' },
  { value: PresenceStatus.Sick, label: 'Sick', icon: ICONS[PresenceStatus.Sick], color: 'bg-red-500' },
  { value: PresenceStatus.Branch, label: 'Branch', icon: ICONS[PresenceStatus.Branch], color: 'bg-purple-500' },
  { value: PresenceStatus.Other, label: 'Other', icon: ICONS[PresenceStatus.Other], color: 'bg-gray-500' },
];

export const TRANSLATIONS = {
  en: {
    title: 'ClockIn',
    subtitle: 'Weekly Presence Management',
    sign_in_with_google: 'Sign in with Google',
    sign_out: 'Sign Out',
    weekly_plan: 'Weekly Plan',
    week_of: 'Week of',
    view_history: 'View History',
    submit_plan: 'Submit Plan',
    plan_submitted: 'Plan Submitted!',
    submission_deadline: 'Please submit by Thursday 15:00',
    select_status: 'Select status...',
    office: 'Office',
    home: 'Home',
    vacation: 'Vacation',
    sick: 'Sick',
    branch: 'Branch',
    other: 'Other',
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
    not_submitted: 'Not Submitted',
    my_team_status: "My Team's Status Today",
    team_weekly_status: "Team Weekly Status",
    team_presence: 'Team Presence',
    team_member: 'Team Member',
    weekly_schedule: 'Weekly Schedule',
    status: 'Status',
    actions: 'Actions',
    approve: 'Approve',
    reject: 'Reject',
    hr_dashboard: 'HR Dashboard',
    compliance_rate: 'Compliance Rate',
    total_submissions: 'Total Submissions',
    approval_rate: 'Approval Rate',
    presence_distribution: 'Presence Distribution',
    team_compliance: 'Team Compliance',
    whos_in_office: "Who's in the Office",
    filter_by_date: 'Filter by Date',
    no_plans_in_range: 'No plans found for the selected date range.',
    no_one_in_office: 'No one is scheduled to be in the office on this date.',
    reminder_title: 'Submission Reminder',
    reminder_body: 'Please submit your weekly presence plan by tomorrow.',
    employee: 'Employee',
    team_lead: 'Team Lead',
    hr: 'HR',
    admin: 'Admin',
    admin_panel: 'Admin Panel',
    user_management: 'User Management',
    system_settings: 'System Settings',
    audit_log: 'Audit Log',
    user: 'User',
    role: 'Role',
    edit_roles: 'Edit Roles',
    timestamp: 'Timestamp',
    action: 'Action',
    daily_view: 'Daily View',
    weekly_view: 'Weekly View',
    in_office: 'In Office',
    at_home: 'At Home',
    no_one_in_office_team: 'No team members are in the office today.',
    no_one_at_home_team: 'No team members are working from home today.',
    start_date: 'Start Date',
    end_date: 'End Date',
    filter_by_user: 'Filter by User',
    filter_by_status: 'Filter by Status',
    select_users: 'Select Users',
    all_statuses: 'All Statuses',
    reset: 'Reset',
    no_matching_plans: 'No plans match your filters.',
    previous_week: 'Previous Week',
    next_week: 'Next Week',
    copy_previous_week: 'Copy Previous Week',
    no_previous_plan: 'No plan found for the previous week.',
    plan_history: 'Plan History',
    back_to_current_week: 'Back to Current Week',
    hr_history: 'Historical Plans',
    back_to_dashboard: 'Back to Dashboard',
    profile: 'Profile',
    edit_profile: 'Edit Profile',
    save_changes: 'Save Changes',
    cancel: 'Cancel',
    confirm: 'Confirm',
    name: 'Name',
    avatar_url: 'Avatar URL',
    assigned_roles: 'Assigned Roles',
    team_management: 'Team Management',
    team_name: 'Team Name',
    team_leader: 'Team Leader',
    members: 'Members',
    add_team: 'Add Team',
    select_leader: 'Select Leader',
    delete_team: 'Delete Team',
    team: 'Team',
    no_team: 'No Team',
    search_placeholder: 'Search users...',
    confirm_role_change_title: 'Confirm Role Change',
    confirm_role_change_message: 'Are you sure you want to change this user\'s roles? This may affect their access permissions.',
    confirm_team_change_title: 'Confirm Team Assignment',
    confirm_team_change_message: 'Are you sure you want to change this user\'s team? This will affect reporting lines.',
    confirm_leader_change_title: 'Confirm Team Leader',
    confirm_leader_change_message: 'Are you sure you want to assign this user as Team Leader? They will be granted the Team Lead role.',
    confirm_delete_user_title: 'Delete User',
    confirm_delete_user_message: 'Are you sure you want to delete this user? This action cannot be undone.',
    confirm_delete_team_title: 'Delete Team',
    confirm_delete_team_message: 'Are you sure you want to delete this team? Members will be unassigned.',
    delete_user: 'Delete User',
    notifications: 'Notifications',
    mark_as_read: 'Mark as Read',
    no_notifications: 'No new notifications',
    notification_rejected: 'Plan for {user} ({date}) was rejected.',
    due_by: 'Due by',
    overdue: 'Overdue',
    deadline_approaching: 'Deadline Approaching',
    deadline_approaching_msg: 'Your weekly plan submission is due soon. Please submit by Thursday 15:00.',
    plan_overdue: 'Plan Overdue',
    plan_overdue_msg: 'You have missed the submission deadline. Please submit immediately.',
    sign_up: 'Sign Up',
    create_account: 'Create Account',
    email: 'Email',
    password: 'Password',
    full_name: 'Full Name',
    already_have_account: 'Already have an account? Sign In',
    back_to_login: 'Back to Login',
    register_success: 'Registration successful! Welcome.',
    fill_all_fields: 'Please fill in all fields.',
    create_account_title: 'Create an account',
    no_account: 'Don\'t have an account?',
    add_user: 'Add User',
  },
  he: {
    title: 'ClockIn',
    subtitle: 'מערכת ניהול נוכחות שבועית',
    sign_in_with_google: 'התחבר עם Google',
    sign_out: 'התנתק',
    weekly_plan: 'תוכנית שבועית',
    week_of: 'שבוע של',
    view_history: 'צפה בהיסטוריה',
    submit_plan: 'שלח תוכנית',
    plan_submitted: 'התוכנית נשלחה!',
    submission_deadline: 'נא לשלוח עד יום חמישי ב-15:00',
    select_status: 'בחר סטטוס...',
    office: 'משרד',
    home: 'בית',
    vacation: 'חופש',
    sick: 'מחלה',
    branch: 'סניף',
    other: 'אחר',
    approved: 'אושר',
    pending: 'ממתין',
    rejected: 'נדחה',
    not_submitted: 'לא הוגש',
    my_team_status: 'סטטוס הצוות שלי היום',
    team_weekly_status: 'סטטוס צוות שבועי',
    team_presence: 'נוכחות צוות',
    team_member: 'חבר צוות',
    weekly_schedule: 'לוח זמנים שבועי',
    status: 'סטטוס',
    actions: 'פעולות',
    approve: 'אשר',
    reject: 'דחה',
    hr_dashboard: 'לוח בקרה משאבי אנוש',
    compliance_rate: 'שיעור היענות',
    total_submissions: 'סה"כ הגשות',
    approval_rate: 'שיעור אישור',
    presence_distribution: 'התפלגות נוכחות',
    team_compliance: 'היענות צוותית',
    whos_in_office: 'מי במשרד',
    filter_by_date: 'סנן לפי תאריך',
    no_plans_in_range: 'לא נמצאו תוכניות לטווח התאריכים שנבחר.',
    no_one_in_office: 'אף אחד לא מתוכנן להיות במשרד בתאריך זה.',
    reminder_title: 'תזכורת הגשה',
    reminder_body: 'נא לשלוח את תוכנית הנוכחות השבועית שלך עד מחר.',
    employee: 'עובד',
    team_lead: 'ראש צוות',
    hr: 'משאבי אנוש',
    admin: 'מנהל מערכת',
    admin_panel: 'פאנל ניהול',
    user_management: 'ניהול משתמשים',
    system_settings: 'הגדרות מערכת',
    audit_log: 'יומן אירועים',
    user: 'משתמש',
    role: 'תפקיד',
    edit_roles: 'ערוך תפקידים',
    timestamp: 'חותמת זמן',
    action: 'פעולה',
    daily_view: 'תצוגה יומית',
    weekly_view: 'תצוגה שבועית',
    in_office: 'במשרד',
    at_home: 'בבית',
    no_one_in_office_team: 'אין חברי צוות במשרד היום.',
    no_one_at_home_team: 'אין חברי צוות העובדים מהבית היום.',
    start_date: 'תאריך התחלה',
    end_date: 'תאריך סיום',
    filter_by_user: 'סנן לפי משתמש',
    filter_by_status: 'סנן לפי סטטוס',
    select_users: 'בחר משתמשים',
    all_statuses: 'כל הסטטוסים',
    reset: 'אפס',
    no_matching_plans: 'לא נמצאו תוכניות התואמות את הסינון.',
    previous_week: 'שבוע שעבר',
    next_week: 'שבוע הבא',
    copy_previous_week: 'העתק שבוע קודם',
    no_previous_plan: 'לא נמצאה תוכנית לשבוע הקודם.',
    plan_history: 'היסטוריית תוכניות',
    back_to_current_week: 'חזרה לשבוע הנוכחי',
    hr_history: 'היסטוריית תוכניות',
    back_to_dashboard: 'חזרה ללוח הבקרה',
    profile: 'פרופיל',
    edit_profile: 'ערוך פרופיל',
    save_changes: 'שמור שינויים',
    cancel: 'ביטול',
    confirm: 'אישור',
    name: 'שם',
    avatar_url: 'כתובת תמונה',
    assigned_roles: 'תפקידים מוקצים',
    team_management: 'ניהול צוותים',
    team_name: 'שם הצוות',
    team_leader: 'ראש צוות',
    members: 'חברים',
    add_team: 'הוסף צוות',
    select_leader: 'בחר מנהל',
    delete_team: 'מחק צוות',
    team: 'צוות',
    no_team: 'ללא צוות',
    search_placeholder: 'חפש משתמשים...',
    confirm_role_change_title: 'אישור שינוי תפקיד',
    confirm_role_change_message: 'האם אתה בטוח שברצונך לשנות את התפקידים של משתמש זה? פעולה זו עשויה להשפיע על הרשאות הגישה שלהם.',
    confirm_team_change_title: 'אישור הקצאת צוות',
    confirm_team_change_message: 'האם אתה בטוח שברצונך לשנות את הצוות של משתמש זה? פעולה זו תשפיע על דיווחי הנוכחות.',
    confirm_leader_change_title: 'אישור ראש צוות',
    confirm_leader_change_message: 'האם אתה בטוח שברצונך להקצות משתמש זה כראש צוות? הם יקבלו הרשאת ראש צוות באופן אוטומטי.',
    confirm_delete_user_title: 'מחק משתמש',
    confirm_delete_user_message: 'האם אתה בטוח שברצונך למחוק משתמש זה? פעולה זו אינה הפיכה.',
    confirm_delete_team_title: 'מחק צוות',
    confirm_delete_team_message: 'האם אתה בטוח שברצונך למחוק צוות זה? חברי הצוות יוסרו מהשיוך לצוות.',
    delete_user: 'מחק משתמש',
    notifications: 'התראות',
    mark_as_read: 'סמן כנקרא',
    no_notifications: 'אין התראות חדשות',
    notification_rejected: 'תוכנית עבור {user} ({date}) נדחתה.',
    due_by: 'להגשה עד',
    overdue: 'באיחור',
    deadline_approaching: 'מועד הגשה מתקרב',
    deadline_approaching_msg: 'מועד הגשת התוכנית השבועית מתקרב. נא להגיש עד יום חמישי ב-15:00.',
    plan_overdue: 'הגשה באיחור',
    plan_overdue_msg: 'פספסת את מועד ההגשה. נא להגיש בהקדם האפשרי.',
    sign_up: 'הרשמה',
    create_account: 'צור חשבון',
    email: 'אימייל',
    password: 'סיסמה',
    full_name: 'שם מלא',
    already_have_account: 'כבר יש לך חשבון? התחבר',
    back_to_login: 'חזרה להתחברות',
    register_success: 'ההרשמה בוצעה בהצלחה! ברוך הבא.',
    fill_all_fields: 'נא למלא את כל השדות.',
    create_account_title: 'יצירת חשבון',
    no_account: 'אין לך חשבון?',
    add_user: 'הוסף משתמש',
  },
};

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Galia Levi',
  avatarUrl: 'https://i.pravatar.cc/150?u=galia',
  roles: [UserRole.Employee],
  teamId: 't1'
};

export const MOCK_TEAMS: Team[] = [
    { id: 't1', name: 'Frontend', leaderId: 'u4' },
    { id: 't2', name: 'Backend', leaderId: 'u3' },
    { id: 't3', name: 'Design', leaderId: null },
];

export const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Galia Levi', avatarUrl: 'https://i.pravatar.cc/150?u=galia', roles: [UserRole.Employee], teamId: 't1' },
    { id: 'u2', name: 'Danny Cohen', avatarUrl: 'https://i.pravatar.cc/150?u=danny', roles: [UserRole.Employee], teamId: 't1' },
    { id: 'u3', name: 'Yossi Mizrahi', avatarUrl: 'https://i.pravatar.cc/150?u=yossi', roles: [UserRole.TeamLead], teamId: 't2' },
    { id: 'u4', name: 'Dana Ron', avatarUrl: 'https://i.pravatar.cc/150?u=dana', roles: [UserRole.TeamLead, UserRole.HR], teamId: 't1' },
    { id: 'u5', name: 'Moshe P', avatarUrl: 'https://i.pravatar.cc/150?u=moshe', roles: [UserRole.Employee], teamId: 't2' },
    { id: 'u6', name: 'Sarah K', avatarUrl: 'https://i.pravatar.cc/150?u=sarah', roles: [UserRole.Employee], teamId: 't3' },
];

export const MOCK_ALL_USERS = [...MOCK_USERS, { id: 'u99', name: 'Admin User', avatarUrl: 'https://i.pravatar.cc/150?u=admin', roles: [UserRole.Admin], teamId: undefined }];


const today = new Date();
const getWeekStartDateString = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // adjust when day is Sunday
  return new Date(d.setDate(diff)).toLocaleDateString('en-CA');
};
const currentWeekStartString = getWeekStartDateString(today);

export const getWeekDays = (baseDate: Date): DailyPlan[] => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const startOfWeek = new Date(baseDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day;
  startOfWeek.setDate(diff);

  return days.map((d, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return {
      day: d,
      date: date.toLocaleDateString('en-CA'),
      status: null,
    };
  });
};

const currentWeekDays = getWeekDays(today);

export const MOCK_DAILY_PLAN: DailyPlan[] = [
  { day: 'Sunday', date: currentWeekDays[0].date, status: PresenceStatus.Office },
  { day: 'Monday', date: currentWeekDays[1].date, status: PresenceStatus.Home },
  { day: 'Tuesday', date: currentWeekDays[2].date, status: PresenceStatus.Office },
  { day: 'Wednesday', date: currentWeekDays[3].date, status: PresenceStatus.Office },
  { day: 'Thursday', date: currentWeekDays[4].date, status: PresenceStatus.Home },
];

export const MOCK_EMPLOYEE_PLAN: PresencePlan = {
  user: MOCK_USER,
  weekOf: currentWeekStartString,
  status: ApprovalStatus.Approved,
  plan: MOCK_DAILY_PLAN,
  submittedAt: new Date(),
};

export const MOCK_TEAM_PLANS: PresencePlan[] = [
  MOCK_EMPLOYEE_PLAN,
  {
    user: MOCK_USERS[1],
    weekOf: currentWeekStartString,
    status: ApprovalStatus.Pending,
    plan: [
      { day: 'Sunday', date: currentWeekDays[0].date, status: PresenceStatus.Home },
      { day: 'Monday', date: currentWeekDays[1].date, status: PresenceStatus.Home },
      { day: 'Tuesday', date: currentWeekDays[2].date, status: PresenceStatus.Office },
      { day: 'Wednesday', date: currentWeekDays[3].date, status: PresenceStatus.Office },
      { day: 'Thursday', date: currentWeekDays[4].date, status: PresenceStatus.Office },
    ],
    submittedAt: new Date(),
  },
   {
    user: MOCK_USERS[2],
    weekOf: currentWeekStartString,
    status: ApprovalStatus.Approved,
    plan: [
      { day: 'Sunday', date: currentWeekDays[0].date, status: PresenceStatus.Office },
      { day: 'Monday', date: currentWeekDays[1].date, status: PresenceStatus.Office },
      { day: 'Tuesday', date: currentWeekDays[2].date, status: PresenceStatus.Branch },
      { day: 'Wednesday', date: currentWeekDays[3].date, status: PresenceStatus.Branch },
      { day: 'Thursday', date: currentWeekDays[4].date, status: PresenceStatus.Home },
    ],
    submittedAt: new Date(),
  },
  {
    user: MOCK_USERS[3],
    weekOf: currentWeekStartString,
    status: ApprovalStatus.NotSubmitted,
    plan: [
      { day: 'Sunday', date: currentWeekDays[0].date, status: null },
      { day: 'Monday', date: currentWeekDays[1].date, status: null },
      { day: 'Tuesday', date: currentWeekDays[2].date, status: null },
      { day: 'Wednesday', date: currentWeekDays[3].date, status: null },
      { day: 'Thursday', date: currentWeekDays[4].date, status: null },
    ],
  },
  {
    user: MOCK_USERS[4],
    weekOf: currentWeekStartString,
    status: ApprovalStatus.Rejected,
    plan: [
        { day: 'Sunday', date: currentWeekDays[0].date, status: PresenceStatus.Home },
        { day: 'Monday', date: currentWeekDays[1].date, status: PresenceStatus.Home },
        { day: 'Tuesday', date: currentWeekDays[2].date, status: PresenceStatus.Home },
        { day: 'Wednesday', date: currentWeekDays[3].date, status: PresenceStatus.Home },
        { day: 'Thursday', date: currentWeekDays[4].date, status: PresenceStatus.Home },
    ],
    submittedAt: new Date(),
  }
];

// Historical Plans for History View
const lastWeekDate = new Date(today);
lastWeekDate.setDate(today.getDate() - 7);
const lastWeekStartString = getWeekStartDateString(lastWeekDate);
const lastWeekDays = getWeekDays(lastWeekDate);

export const MOCK_HISTORICAL_PLANS: PresencePlan[] = [
  {
    user: MOCK_USER,
    weekOf: lastWeekStartString,
    status: ApprovalStatus.Approved,
    plan: [
      { day: 'Sunday', date: lastWeekDays[0].date, status: PresenceStatus.Office },
      { day: 'Monday', date: lastWeekDays[1].date, status: PresenceStatus.Office },
      { day: 'Tuesday', date: lastWeekDays[2].date, status: PresenceStatus.Office },
      { day: 'Wednesday', date: lastWeekDays[3].date, status: PresenceStatus.Home },
      { day: 'Thursday', date: lastWeekDays[4].date, status: PresenceStatus.Home },
    ],
    submittedAt: new Date(lastWeekDate),
  },
  {
     user: MOCK_USER,
    weekOf: '2023-10-01',
    status: ApprovalStatus.Approved,
    plan: [
      { day: 'Sunday', date: '2023-10-01', status: PresenceStatus.Vacation },
      { day: 'Monday', date: '2023-10-02', status: PresenceStatus.Vacation },
      { day: 'Tuesday', date: '2023-10-03', status: PresenceStatus.Vacation },
      { day: 'Wednesday', date: '2023-10-04', status: PresenceStatus.Vacation },
      { day: 'Thursday', date: '2023-10-05', status: PresenceStatus.Vacation },
    ],
    submittedAt: new Date('2023-09-28'),
  }
];

export const MOCK_ALL_HISTORICAL_PLANS: PresencePlan[] = [
    ...MOCK_HISTORICAL_PLANS,
    // Add some historical data for other users for the HR dashboard/Team Status
    {
        user: MOCK_USERS[1],
        weekOf: lastWeekStartString,
        status: ApprovalStatus.Approved,
        plan: [
            { day: 'Sunday', date: lastWeekDays[0].date, status: PresenceStatus.Home },
            { day: 'Monday', date: lastWeekDays[1].date, status: PresenceStatus.Office },
            { day: 'Tuesday', date: lastWeekDays[2].date, status: PresenceStatus.Office },
            { day: 'Wednesday', date: lastWeekDays[3].date, status: PresenceStatus.Office },
            { day: 'Thursday', date: lastWeekDays[4].date, status: PresenceStatus.Home },
        ],
        submittedAt: new Date(lastWeekDate),
    }
];


export const MOCK_AUDIT_LOGS = [
    { timestamp: new Date('2023-10-26T10:00:00'), user: 'Admin User', action: 'Changed User Role: Danny Cohen to Team Lead' },
    { timestamp: new Date('2023-10-25T14:30:00'), user: 'System', action: 'Automatic Reminder Sent' },
    { timestamp: new Date('2023-10-24T09:15:00'), user: 'Dana Ron', action: 'Approved Plan for Galia Levi' },
];

export const getSubmissionDeadline = (weekOfDateStr: string): Date => {
    const weekStart = new Date(weekOfDateStr);
    // Assuming week starts on Sunday (index 0). Thursday is index 4.
    const deadline = new Date(weekStart);
    deadline.setDate(weekStart.getDate() + 4); // Move to Thursday
    deadline.setHours(15, 0, 0, 0); // Set to 15:00
    return deadline;
};
