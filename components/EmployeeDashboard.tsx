
import React, { useState, useEffect } from 'react';
import { PresencePlan, ApprovalStatus } from '../types';
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
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ t, employeePlan, onPlanUpdate, teamPlans, currentDate, onDateChange, onCopyPreviousPlan }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [deadlineNotification, setDeadlineNotification] = useState<{type: 'warning' | 'error', title: string, msg: string} | null>(null);

  useEffect(() => {
    const checkDeadline = () => {
        const deadline = getSubmissionDeadline(employeePlan.weekOf);
        const now = new Date();
        
        // Check if plan is not submitted or rejected
        if (employeePlan.status === ApprovalStatus.NotSubmitted || employeePlan.status === ApprovalStatus.Rejected) {
            if (now > deadline) {
                // Overdue
                setDeadlineNotification({
                    type: 'error',
                    title: t.plan_overdue,
                    msg: t.plan_overdue_msg
                });
            } else {
                // Check if approaching (e.g., within 24 hours)
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
    // Set up an interval to check periodically (e.g., every minute)
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
        />
        <MyTeamStatus t={t} teamPlans={teamPlans} />
    </div>
  );
};

export default EmployeeDashboard;
