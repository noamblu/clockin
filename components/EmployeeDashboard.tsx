
import React, { useState } from 'react';
import { PresencePlan } from '../types';
import WeeklyPlanner from './WeeklyPlanner';
import MyTeamStatus from './MyTeamStatus';
import PlanHistory from './PlanHistory';
import { MOCK_HISTORICAL_PLANS } from '../constants';

interface EmployeeDashboardProps {
  t: any;
  employeePlan: PresencePlan;
  onPlanUpdate: (updatedPlan: PresencePlan) => void;
  teamPlans: PresencePlan[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ t, employeePlan, onPlanUpdate, teamPlans, currentDate, onDateChange }) => {
  const [showHistory, setShowHistory] = useState(false);

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
        <WeeklyPlanner 
            t={t} 
            plan={employeePlan} 
            onPlanUpdate={onPlanUpdate} 
            onViewHistoryClick={() => setShowHistory(true)}
            currentDate={currentDate}
            onDateChange={onDateChange}
        />
        <MyTeamStatus t={t} teamPlans={teamPlans} />
    </div>
  );
};

export default EmployeeDashboard;