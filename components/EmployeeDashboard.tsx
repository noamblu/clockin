
import React, { useState, useEffect } from 'react';
import { PresencePlan, ApprovalStatus, MandatoryDate, WorkPolicy, StatusOption } from '../types';
import WeeklyPlanner from './WeeklyPlanner';
import MyTeamStatus from './MyTeamStatus';
import PlanHistory from './PlanHistory';
import NotificationBanner from './NotificationBanner';
import { MOCK_HISTORICAL_PLANS, getSubmissionDeadline } from '../constants';

interface EmployeeDashboardProps {
  t: any;
  employeePlan: PresencePlan;
  onPlanUpdate: (updatedPlan: PresencePlan) => void;
  teamPlans: PresencePlan[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onCopyPreviousPlan: () => void;
  mandatoryDates: MandatoryDate[];
  workPolicy: WorkPolicy;
  statusOptions: StatusOption[];
  language: 'en' | 'he';
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ t, employeePlan, onPlanUpdate, teamPlans, currentDate, onDateChange, onCopyPreviousPlan, mandatoryDates, workPolicy, statusOptions, language }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [deadlineNotification, setDeadlineNotification] = useState<{type: 'warning' | 'error', title: string, msg: string} | null>(null);

  useEffect(() => {
    const checkDeadline = () => {
        const deadline = getSubmissionDeadline(employeePlan.weekOf);
        const now = new Date();
        
        if (employeePlan.status === ApprovalStatus.NotSubmitted || employeePlan.status === ApprovalStatus.Rejected) {
            if (now > deadline) {
                setDeadlineNotification({
                    type: 'error',
                    title: t.plan_overdue,
                    msg: t.plan_overdue_msg
                });
            } else {
                const timeDiff = deadline.getTime() - now.getTime();
                const hoursRemaining = timeDiff / (1000 * 3600);
                
                if (hoursRemaining < 24 && hoursRemaining > 0) {
                    setDeadlineNotification({
                        type: 'warning',
                        title: t.deadline_approaching,
                        msg: t.deadline_approaching_msg
                    });
                } else {
                    setDeadlineNotification(null);
                }
            }
        } else {
            setDeadlineNotification(null);
        }
    };

    checkDeadline();
    const interval = setInterval(checkDeadline, 60000);
    return () => clearInterval(interval);

  }, [employeePlan, t]);

  if (showHistory) {
    return (
        <div className="lg:col-span-3">
            <PlanHistory 
                t={t} 
                historicalPlans={MOCK_HISTORICAL_PLANS} 
                onBack={() => setShowHistory(false)} 
                statusOptions={statusOptions}
                language={language}
            />
        </div>
    );
  }

  return (
    <div className="space-y-8">
        {deadlineNotification && (
            <NotificationBanner 
                title={deadlineNotification.title}
                message={deadlineNotification.msg}
                type={deadlineNotification.type}
                onClose={() => setDeadlineNotification(null)}
            />
        )}
        <WeeklyPlanner 
            t={t} 
            plan={employeePlan} 
            onPlanUpdate={onPlanUpdate} 
            onViewHistoryClick={() => setShowHistory(true)}
            currentDate={currentDate}
            onDateChange={onDateChange}
            onCopyPreviousPlan={onCopyPreviousPlan}
            mandatoryDates={mandatoryDates}
            workPolicy={workPolicy}
            statusOptions={statusOptions}
            language={language}
        />
        <MyTeamStatus t={t} teamPlans={teamPlans} statusOptions={statusOptions} language={language} />
    </div>
  );
};

export default EmployeeDashboard;
