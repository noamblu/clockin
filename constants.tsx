
import React from 'react';
import { PresenceStatus, ApprovalStatus, UserRole, PresencePlan, User, DailyPlan, Team, MandatoryDate, WorkPolicy, StatusOption, IconName } from './types';

export const ICON_MAP: any = {
  office: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm3 1h6v4H7V5zm6 6H7v4h6v-4z" clipRule="evenodd" /></svg>,
  home: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>,
  sun: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>,
  heart: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>,
  truck: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0014 7z" /></svg>,
  question: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>,
  briefcase: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" /></svg>,
  user: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
  star: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
  coffee: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>,
};

export const AVAILABLE_COLORS = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-gray-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
    'bg-lime-500',
];

export const INITIAL_STATUS_OPTIONS: StatusOption[] = [
  { id: 's1', value: 'Office', label: 'Office', labelHe: 'משרד', icon: 'office', color: 'bg-blue-500', isDefault: true },
  { id: 's2', value: 'Home', label: 'Home', labelHe: 'בית', icon: 'home', color: 'bg-green-500', isDefault: true },
  { id: 's3', value: 'Vacation', label: 'Vacation', labelHe: 'חופש', icon: 'sun', color: 'bg-yellow-500', isDefault: true },
  { id: 's4', value: 'Sick', label: 'Sick', labelHe: 'מחלה', icon: 'heart', color: 'bg-red-500', isDefault: true },
  { id: 's5', value: 'Branch', label: 'Branch', labelHe: 'סניף', icon: 'truck', color: 'bg-purple-500', isDefault: false },
  { id: 's6', value: 'Other', label: 'Other', labelHe: 'אחר', icon: 'question', color: 'bg-gray-500', isDefault: true },
];

export const getStatusLabel = (option: StatusOption, language: 'en' | 'he') => {
    if (language === 'he') {
        return option.labelHe || option.label;
    }
    return option.label;
};

export const PRESENCE_STATUS_OPTIONS = INITIAL_STATUS_OPTIONS.map(opt => ({
    ...opt,
    icon: ICON_MAP[opt.icon]
}));

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
    update_plan: 'Update Plan',
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
    daily_presence_snapshot: 'Daily Presence Snapshot',
    filter_by_date: 'Filter by Date',
    no_plans_in_range: 'No plans found for the selected date range.',
    no_one_in_office: 'No one is scheduled to be in the office on this date.',
    no_data_for_date: 'No presence data available for this date.',
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
    phone_number: 'Phone Number',
    send_whatsapp: 'Send WhatsApp',
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
    mandatory_dates: 'Mandatory Dates & Policies',
    add_rule: 'Add Rule',
    date: 'Date',
    description: 'Description',
    mandatory_status: 'Mandatory Status',
    delete_rule: 'Delete Rule',
    mandatory_rule_exists: 'Company Policy: ',
    apply_to: 'Apply to',
    all_teams: 'All Teams',
    select_teams: 'Select Teams',
    specific_teams: 'Specific Teams',
    work_policy: 'Work Policy',
    work_policy_description: 'Set global constraints for weekly planning. These limits are checked during plan submission.',
    min_office_days: 'Min Office Days / Week',
    max_home_days: 'Max Home Days / Week',
    policy_violation_title: 'Policy Violation',
    policy_violation_msg: 'The plan violates the company policy.',
    policy_summary: 'Policy: Min {min} Office days, Max {max} Home days.',
    policy_override_title: 'Confirm Policy Violation',
    policy_override_msg: 'Your plan violates the work policy ({violation}). Do you want to submit it for manager approval anyway?',
    policy_violation_flag: 'Policy Violation',
    coverage_warning: 'Warning: No team members scheduled for Office on: {days}',
    filter_by_team: 'Filter by Team',
    all_users: 'All Users',
    status_configuration: 'Presence Status Configuration',
    add_status: 'Add Status',
    status_label: 'Label (EN)',
    status_label_he: 'Label (HE)',
    status_color: 'Color',
    status_icon: 'Icon',
    preview: 'Preview',
    specify_reason: 'Specify reason',
    reminder_msg_whatsapp: 'Hi {name}, please remember to submit your weekly presence plan for {week}.',
    approval_msg_whatsapp: 'Hi {name}, your weekly presence plan for {week} has been approved.',
    send_email: 'Send Email',
    send_whatsapp_reminder: 'Send WhatsApp Reminder',
    send_email_reminder: 'Send Email Reminder',
    notify_approval: 'Notify Approval?',
    notify_approval_msg: 'Do you want to notify {name} via WhatsApp/Email that their plan is approved?',
    email_sent: 'Email Sent!',
    email_sent_msg: 'An email has been sent to {email}.',
    email_subject_reminder: 'Reminder: Weekly Presence Plan',
    email_body_reminder: 'Hi {name},\n\nPlease submit your weekly presence plan for {week}.\n\nThanks,',
    email_subject_approval: 'Plan Approved: Weekly Presence',
    email_body_approval: 'Hi {name},\n\nYour weekly presence plan for {week} has been approved.\n\nThanks,',
    notification_plan_submitted: '{name} submitted a plan for week {week}.',
    notification_plan_approved: 'Your plan for {week} was approved!',
    notification_plan_rejected: 'Your plan for {week} was rejected.',
    view_plan: 'View Plan',
    today: 'Today',
    prev_day: 'Previous Day',
    next_day: 'Next Day',
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
    update_plan: 'עדכן תוכנית',
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
    daily_presence_snapshot: 'תמונת מצב יומית',
    filter_by_date: 'סנן לפי תאריך',
    no_plans_in_range: 'לא נמצאו תוכניות לטווח התאריכים שנבחר.',
    no_one_in_office: 'אף אחד לא מתוכנן להיות במשרד בתאריך זה.',
    no_data_for_date: 'אין נתוני נוכחות עבור תאריך זה.',
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
    no_one_at_home_team: 'אין חברי צוות בבית היום.',
    start_date: 'תאריך התחלה',
    end_date: 'תאריך סיום',
    filter_by_user: 'סנן לפי משתמש',
    filter_by_status: 'סנן לפי סטטוס',
    select_users: 'בחר משתמשים',
    all_statuses: 'כל הסטטוסים',
    reset: 'אפס',
    no_matching_plans: 'לא נמצאו תוכניות התואמות את הסינון.',
    previous_week: 'שבוע קודם',
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
    phone_number: 'מספר טלפון',
    send_whatsapp: 'שלח הודעה',
    assigned_roles: 'תפקידים משויכים',
    team_management: 'ניהול צוותים',
    team_name: 'שם הצוות',
    team_leader: 'ראש צוות',
    members: 'חברים',
    add_team: 'הוסף צוות',
    select_leader: 'בחר ראש צוות',
    delete_team: 'מחק צוות',
    team: 'צוות',
    no_team: 'ללא צוות',
    search_placeholder: 'חפש משתמשים...',
    confirm_role_change_title: 'אשר שינוי תפקיד',
    confirm_role_change_message: 'האם אתה בטוח שברצונך לשנות את תפקידי המשתמש? פעולה זו תשפיע על הרשאות הגישה שלו.',
    confirm_team_change_title: 'אשר שיוך צוות',
    confirm_team_change_message: 'האם אתה בטוח שברצונך לשנות את הצוות של המשתמש? פעולה זו תשפיע על דיווחי כפיפות.',
    confirm_leader_change_title: 'אשר ראש צוות',
    confirm_leader_change_message: 'האם אתה בטוח שברצונך למנות משתמש זה לראש צוות? התפקיד ראש צוות יתווסף לו.',
    confirm_delete_user_title: 'מחק משתמש',
    confirm_delete_user_message: 'האם אתה בטוח שברצונך למחוק משתמש זה? לא ניתן לבטל פעולה זו.',
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
    deadline_approaching_msg: 'מועד הגשת תוכנית הנוכחות מתקרב. נא לשלוח עד יום חמישי ב-15:00.',
    plan_overdue: 'איחור בהגשה',
    plan_overdue_msg: 'עבר מועד ההגשה. נא להגיש את התוכנית בהקדם.',
    sign_up: 'הרשמה',
    create_account: 'צור חשבון',
    email: 'אימייל',
    password: 'סיסמה',
    full_name: 'שם מלא',
    already_have_account: 'כבר יש לך חשבון? התחבר',
    back_to_login: 'חזרה להתחברות',
    register_success: 'ההרשמה עברה בהצלחה! ברוך הבא.',
    fill_all_fields: 'נא למלא את כל השדות.',
    create_account_title: 'צור חשבון',
    no_account: 'אין לך חשבון?',
    add_user: 'הוסף משתמש',
    mandatory_dates: 'תאריכי חובה ומדיניות',
    add_rule: 'הוסף כלל',
    date: 'תאריך',
    description: 'תיאור',
    mandatory_status: 'סטטוס חובה',
    delete_rule: 'מחק כלל',
    mandatory_rule_exists: 'מדיניות חברה: ',
    apply_to: 'החל על',
    all_teams: 'כל הצוותים',
    select_teams: 'בחר צוותים',
    specific_teams: 'צוותים מסוימים',
    work_policy: 'מדיניות עבודה',
    work_policy_description: 'הגדר מגבלות גלובליות לתכנון שבועי. הגבלות אלו ייבדקו בעת הגשת התוכנית.',
    min_office_days: 'מינימום ימי משרד / שבוע',
    max_home_days: 'מקסימום ימי בית / שבוע',
    policy_violation_title: 'חריגה ממדיניות',
    policy_violation_msg: 'התוכנית שלך אינה עומדת במדיניות העבודה של החברה.',
    policy_summary: 'מדיניות: מינימום {min} ימי משרד, מקסימום {max} ימי בית.',
    policy_override_title: 'אישור חריגה ממדיניות',
    policy_override_msg: 'התוכנית שלך חורגת ממדיניות העבודה ({violation}). האם אתה בטוח שברצונך לשלוח אותה לאישור מנהל בכל זאת?',
    policy_violation_flag: 'חריגת מדיניות',
    coverage_warning: 'אזהרה: אין נוכחות משרדית בצוות בימים: {days}',
    filter_by_team: 'סינון לפי צוות',
    all_users: 'כל המשתמשים',
    status_configuration: 'הגדרת סטטוסי נוכחות',
    add_status: 'הוסף סטטוס',
    status_label: 'תווית (EN)',
    status_label_he: 'תווית (HE)',
    status_color: 'צבע',
    status_icon: 'אייקון',
    preview: 'תצוגה מקדימה',
    specify_reason: 'פרט סיבה',
    reminder_msg_whatsapp: 'היי {name}, תזכורת: נא למלא את תוכנית הנוכחות השבועית עבור {week}.',
    approval_msg_whatsapp: 'היי {name}, תוכנית הנוכחות שלך לשבוע {week} אושרה.',
    send_email: 'שלח מייל',
    send_whatsapp_reminder: 'שלח תזכורת בוואטסאפ',
    send_email_reminder: 'שלח תזכורת במייל',
    notify_approval: 'לשלוח התראה על אישור?',
    notify_approval_msg: 'האם ברצונך לשלוח הודעת אישור ל{name} בוואטסאפ/מייל?',
    email_sent: 'המייל נשלח!',
    email_sent_msg: 'הודעת מייל נשלחה לכתובת {email}.',
    email_subject_reminder: 'תזכורת: תוכנית נוכחות שבועית',
    email_body_reminder: 'היי {name},\n\nנא למלא את תוכנית הנוכחות השבועית עבור {week}.\n\nבברכה,',
    email_subject_approval: 'תוכנית נוכחות אושרה',
    email_body_approval: 'היי {name},\n\nתוכנית הנוכחות השבועית שלך עבור {week} אושרה.\n\nבברכה,',
    notification_plan_submitted: '{name} הגיש תוכנית עבור שבוע {week}.',
    notification_plan_approved: 'התוכנית שלך לשבוע {week} אושרה!',
    notification_plan_rejected: 'התוכנית שלך לשבוע {week} נדחתה.',
    view_plan: 'צפה בתוכנית',
    today: 'היום',
    prev_day: 'יום קודם',
    next_day: 'יום הבא',
  }
};

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Galia Levi',
  avatarUrl: 'https://i.pravatar.cc/150?u=galia',
  roles: [UserRole.Employee],
  teamId: 't1',
  email: 'galia@example.com',
  phoneNumber: '050-1234567'
};

export const MOCK_ALL_USERS: User[] = [
    MOCK_USER,
    { id: 'u2', name: 'Dana Ron', avatarUrl: 'https://i.pravatar.cc/150?u=dana', roles: [UserRole.TeamLead, UserRole.Employee], teamId: 't1', email: 'dana@example.com', phoneNumber: '052-1234567' },
    { id: 'u3', name: 'Yossi Mizrahi', avatarUrl: 'https://i.pravatar.cc/150?u=yossi', roles: [UserRole.Employee], teamId: 't2', email: 'yossi@example.com', phoneNumber: '053-1234567' },
    { id: 'u4', name: 'Rina Cohen', avatarUrl: 'https://i.pravatar.cc/150?u=rina', roles: [UserRole.HR], email: 'rina@example.com', phoneNumber: '054-1234567' },
    { id: 'u5', name: 'Admin User', avatarUrl: 'https://i.pravatar.cc/150?u=admin', roles: [UserRole.Admin], email: 'admin@example.com', phoneNumber: '055-1234567' },
    { id: 'u6', name: 'David Levi', avatarUrl: 'https://i.pravatar.cc/150?u=david', roles: [UserRole.Employee], teamId: 't1', email: 'david@example.com', phoneNumber: '050-7654321' },
    { id: 'u7', name: 'Sarah Klein', avatarUrl: 'https://i.pravatar.cc/150?u=sarah', roles: [UserRole.Employee], teamId: 't2', email: 'sarah@example.com', phoneNumber: '052-7654321' },
    { id: 'u8', name: 'Moshe Cohen', avatarUrl: 'https://i.pravatar.cc/150?u=moshe', roles: [UserRole.Employee], teamId: 't3', email: 'moshe@example.com', phoneNumber: '053-7654321' },
];

export const MOCK_TEAMS: Team[] = [
    { id: 't1', name: 'Frontend', leaderId: 'u2' },
    { id: 't2', name: 'Backend', leaderId: 'u3' }, 
    { id: 't3', name: 'Design', leaderId: null },
];

export const getWeekDays = (date: Date = new Date()): DailyPlan[] => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day; // adjust when day is Sunday
  startOfWeek.setDate(diff);

  const correctedDays = [];
  for (let i = 0; i < 5; i++) {
    const current = new Date(startOfWeek);
    current.setDate(startOfWeek.getDate() + i);
    correctedDays.push({
      day: current.toLocaleDateString('en-US', { weekday: 'long' }),
      date: current.toLocaleDateString('en-CA'),
      status: null as string | null,
      note: ''
    });
  }
  return correctedDays;
};

// Generate consistent mock plans for all users so the dashboard looks populated
export const generateMockTeamPlans = (): PresencePlan[] => {
    const weekDays = getWeekDays();
    const weekOf = weekDays[0].date;
    
    // Statuses for random generation
    const statuses = ['Office', 'Home', 'Office', 'Office', 'Home']; 
    
    return MOCK_ALL_USERS.map(user => {
        // Deterministic pseudo-random based on user ID char code to keep it stable across re-renders
        const idSum = user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        const plan = weekDays.map((day, idx) => {
            // Rotate statuses based on user ID to create variety
            const statusIndex = (idSum + idx) % statuses.length;
            return { ...day, status: statuses[statusIndex] };
        });

        return {
            user: user,
            weekOf: weekOf,
            status: ApprovalStatus.Approved,
            plan: plan,
            submittedAt: new Date()
        };
    });
};

export const MOCK_EMPLOYEE_PLAN: PresencePlan = {
  user: MOCK_USER,
  weekOf: getWeekDays()[0].date,
  status: ApprovalStatus.NotSubmitted,
  plan: getWeekDays(),
};

export const MOCK_TEAM_PLANS: PresencePlan[] = generateMockTeamPlans();

export const MOCK_AUDIT_LOGS = [
  { timestamp: new Date('2023-10-26 10:00'), user: 'Admin', action: 'Approved plan for Galia Levi' },
  { timestamp: new Date('2023-10-26 09:30'), user: 'Galia Levi', action: 'Submitted weekly plan' },
  { timestamp: new Date('2023-10-25 14:00'), user: 'System', action: 'Reminder sent to all employees' },
];

export const MOCK_HISTORICAL_PLANS: PresencePlan[] = [
    {
        user: MOCK_USER,
        weekOf: '2023-10-15',
        status: ApprovalStatus.Approved,
        plan: [
            { day: 'Sunday', date: '2023-10-15', status: 'Office' },
            { day: 'Monday', date: '2023-10-16', status: 'Home' },
            { day: 'Tuesday', date: '2023-10-17', status: 'Office' },
            { day: 'Wednesday', date: '2023-10-18', status: 'Branch' },
            { day: 'Thursday', date: '2023-10-19', status: 'Home' },
        ]
    },
    {
        user: MOCK_USER,
        weekOf: '2023-10-08',
        status: ApprovalStatus.Approved,
        plan: [
            { day: 'Sunday', date: '2023-10-08', status: 'Home' },
            { day: 'Monday', date: '2023-10-09', status: 'Home' },
            { day: 'Tuesday', date: '2023-10-10', status: 'Office' },
            { day: 'Wednesday', date: '2023-10-11', status: 'Office' },
            { day: 'Thursday', date: '2023-10-12', status: 'Office' },
        ]
    }
];

export const MOCK_ALL_HISTORICAL_PLANS: PresencePlan[] = [
    ...MOCK_HISTORICAL_PLANS,
     {
        user: MOCK_ALL_USERS[1],
        weekOf: '2023-10-15',
        status: ApprovalStatus.Approved,
        plan: [
            { day: 'Sunday', date: '2023-10-15', status: 'Office' },
            { day: 'Monday', date: '2023-10-16', status: 'Office' },
            { day: 'Tuesday', date: '2023-10-17', status: 'Home' },
            { day: 'Wednesday', date: '2023-10-18', status: 'Home' },
            { day: 'Thursday', date: '2023-10-19', status: 'Office' },
        ]
    },
];

export const getSubmissionDeadline = (weekOf: string): Date => {
    const date = new Date(weekOf);
    date.setDate(date.getDate() + 4);
    date.setHours(15, 0, 0, 0);
    return date;
};

export const MOCK_MANDATORY_DATES: MandatoryDate[] = [
    {
      id: 'm1',
      date: '2025-11-20', 
      status: 'Office',
      description: 'All Hands Meeting',
      teamIds: [] 
    },
    {
      id: 'm2',
      date: '2025-12-25', 
      status: 'Vacation',
      description: 'Christmas Holiday',
    },
    {
        id: 'm3',
        date: '2025-11-19',
        status: 'Office',
        description: 'Frontend Hackathon',
        teamIds: ['t1'] 
    }
];

export const MOCK_WORK_POLICY: WorkPolicy = {
    minOfficeDays: 3,
    maxHomeDays: 2
};
