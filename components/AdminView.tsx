
import React, { useState } from 'react';
import { MOCK_ALL_USERS, MOCK_AUDIT_LOGS, MOCK_TEAMS, AVAILABLE_COLORS, ICON_MAP, getStatusLabel } from '../constants';
import { User, UserRole, Team, MandatoryDate, WorkPolicy, StatusOption, IconName } from '../types';
import MandatoryDatesManagement from './MandatoryDatesManagement';

interface AdminViewProps {
  t: any;
  mandatoryDates: MandatoryDate[];
  onAddMandatoryDate: (rule: MandatoryDate) => void;
  onDeleteMandatoryDate: (id: string) => void;
  workPolicy: WorkPolicy;
  onUpdateWorkPolicy: (policy: WorkPolicy) => void;
  statusOptions: StatusOption[];
  onAddStatus: (status: StatusOption) => void;
  onDeleteStatus: (id: string) => void;
  language: 'en' | 'he';
}

const AdminView: React.FC<AdminViewProps> = ({ t, mandatoryDates, onAddMandatoryDate, onDeleteMandatoryDate, workPolicy, onUpdateWorkPolicy, statusOptions, onAddStatus, onDeleteStatus, language }) => {
  const [users, setUsers] = useState<User[]>(MOCK_ALL_USERS);
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);

  const handleRoleUpdate = (userId: string, newRoles: UserRole[]) => {
    setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, roles: newRoles } : user
    ));
  };

  const handleTeamAssignment = (userId: string, teamId: string | undefined) => {
    setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, teamId: teamId } : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const handleAddTeam = (name: string) => {
      const newTeam: Team = {
          id: `t${teams.length + 1}`,
          name,
          leaderId: null
      };
      setTeams([...teams, newTeam]);
  };

  const handleUpdateTeam = (teamId: string, updates: Partial<Team>) => {
      setTeams(prev => prev.map(team => team.id === teamId ? { ...team, ...updates } : team));

      // Automatically assign Team Lead role if a leader is selected
      if (updates.leaderId) {
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.id === updates.leaderId && !user.roles.includes(UserRole.TeamLead)) {
                return { ...user, roles: [...user.roles, UserRole.TeamLead] };
            }
            return user;
        }));
      }
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
    // Unassign users from the deleted team
    setUsers(prevUsers => prevUsers.map(user => 
        user.teamId === teamId ? { ...user, teamId: undefined } : user
    ));
  };

  const handleAddUser = (name: string, email: string, phoneNumber?: string) => {
      const newUser: User = {
          id: `u${Date.now()}`,
          name,
          email,
          phoneNumber,
          avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
          roles: [UserRole.Employee]
      };
      setUsers(prev => [...prev, newUser]);
  };

  const handlePolicyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      onUpdateWorkPolicy({
          ...workPolicy,
          [name]: parseInt(value, 10) || 0
      });
  };

  // Status Configuration State
  const [newStatusLabel, setNewStatusLabel] = useState('');
  const [newStatusLabelHe, setNewStatusLabelHe] = useState('');
  const [newStatusColor, setNewStatusColor] = useState(AVAILABLE_COLORS[0]);
  const [newStatusIcon, setNewStatusIcon] = useState<IconName>('office');

  const handleAddNewStatus = () => {
      if (newStatusLabel) {
          const newStatus: StatusOption = {
              id: `s${Date.now()}`,
              value: newStatusLabel, // Using label as value for simplicity in this mock context
              label: newStatusLabel,
              labelHe: newStatusLabelHe,
              color: newStatusColor,
              icon: newStatusIcon
          };
          onAddStatus(newStatus);
          setNewStatusLabel('');
          setNewStatusLabelHe('');
      }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.admin_panel}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="lg:col-span-2">
             <Card title={t.status_configuration}>
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{t.add_status}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.status_label}</label>
                            <input 
                                type="text" 
                                value={newStatusLabel} 
                                onChange={(e) => setNewStatusLabel(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                                placeholder="e.g. Client Site"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.status_label_he}</label>
                            <input 
                                type="text" 
                                value={newStatusLabelHe} 
                                onChange={(e) => setNewStatusLabelHe(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                                placeholder="לדוגמה: אצל לקוח"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.status_color}</label>
                            <select 
                                value={newStatusColor}
                                onChange={(e) => setNewStatusColor(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                            >
                                {AVAILABLE_COLORS.map(color => (
                                    <option key={color} value={color} className={color.replace('bg-', 'text-')}>
                                        {color.replace('bg-', '').replace('-500', '')}
                                    </option>
                                ))}
                            </select>
                        </div>
                         <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.status_icon}</label>
                            <select 
                                value={newStatusIcon}
                                onChange={(e) => setNewStatusIcon(e.target.value as IconName)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                            >
                                {Object.keys(ICON_MAP).map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className={`w-10 h-10 rounded-md flex items-center justify-center text-white shadow-sm ${newStatusColor}`}>
                                {React.cloneElement(ICON_MAP[newStatusIcon], { className: "w-6 h-6" })}
                             </div>
                            <button 
                                onClick={handleAddNewStatus}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm h-10"
                            >
                                {t.add_status}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {statusOptions.map(option => (
                        <div key={option.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
                            <div className="flex items-center">
                                <div className={`w-8 h-8 flex items-center justify-center text-white rounded-md shadow-sm me-3 ${option.color}`}>
                                    {React.cloneElement(ICON_MAP[option.icon], { className: "w-5 h-5" })}
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {getStatusLabel(option, language)}
                                </span>
                            </div>
                            {!option.isDefault && (
                                <button 
                                    onClick={() => onDeleteStatus(option.id)}
                                    className="text-red-400 hover:text-red-600 p-1"
                                    title="Delete Status"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
             </Card>
         </div>

        <div className="lg:col-span-2">
            <Card title={t.mandatory_dates}>
                <MandatoryDatesManagement 
                    t={t}
                    teams={teams}
                    mandatoryDates={mandatoryDates}
                    onAdd={onAddMandatoryDate}
                    onDelete={onDeleteMandatoryDate}
                    statusOptions={statusOptions}
                    language={language}
                />
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card title={t.team_management}>
                <TeamManagementTable 
                    t={t} 
                    teams={teams} 
                    users={users} 
                    onAddTeam={handleAddTeam} 
                    onUpdateTeam={handleUpdateTeam} 
                    onDeleteTeam={handleDeleteTeam}
                />
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card title={t.user_management}>
                <UserManagementTable 
                    t={t} 
                    users={users} 
                    teams={teams} 
                    onRoleUpdate={handleRoleUpdate} 
                    onTeamAssignment={handleTeamAssignment}
                    onDeleteUser={handleDeleteUser}
                    onAddUser={handleAddUser}
                />
            </Card>
        </div>
        <Card title={t.system_settings}>
           <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.submission_deadline}</label>
                        <input type="text" value="Thursday 15:00" readOnly className="mt-1 block w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manager Approval Deadline</label>
                        <input type="text" value="Friday 12:00" readOnly className="mt-1 block w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-1">{t.work_policy}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.work_policy_description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.min_office_days}</label>
                            <input 
                                type="number" 
                                name="minOfficeDays"
                                value={workPolicy.minOfficeDays} 
                                onChange={handlePolicyChange}
                                min="0"
                                max="5"
                                className="mt-1 block w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.max_home_days}</label>
                            <input 
                                type="number" 
                                name="maxHomeDays"
                                value={workPolicy.maxHomeDays} 
                                onChange={handlePolicyChange}
                                min="0"
                                max="5"
                                className="mt-1 block w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                            />
                        </div>
                    </div>
                </div>
           </div>
        </Card>
        <Card title={t.audit_log}>
            <AuditLogTable t={t} logs={MOCK_AUDIT_LOGS} />
        </Card>
      </div>
    </div>
  );
};

const Card: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
);

interface TeamManagementTableProps {
    t: any;
    teams: Team[];
    users: User[];
    onAddTeam: (name: string) => void;
    onUpdateTeam: (id: string, updates: Partial<Team>) => void;
    onDeleteTeam: (id: string) => void;
}

const TeamManagementTable: React.FC<TeamManagementTableProps> = ({ t, teams, users, onAddTeam, onUpdateTeam, onDeleteTeam }) => {
    const [newTeamName, setNewTeamName] = useState('');
    
    const [pendingLeaderChange, setPendingLeaderChange] = useState<{teamId: string, leaderId: string | null} | null>(null);
    const [isLeaderConfirmOpen, setIsLeaderConfirmOpen] = useState(false);

    const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const handleCreate = () => {
        if (newTeamName.trim()) {
            onAddTeam(newTeamName);
            setNewTeamName('');
        }
    };

    const handleLeaderChange = (teamId: string, leaderId: string | null) => {
        setPendingLeaderChange({ teamId, leaderId });
        setIsLeaderConfirmOpen(true);
    };

    const confirmLeaderChange = () => {
        if (pendingLeaderChange) {
            onUpdateTeam(pendingLeaderChange.teamId, { leaderId: pendingLeaderChange.leaderId });
            setPendingLeaderChange(null);
        }
        setIsLeaderConfirmOpen(false);
    };

    const handleDeleteClick = (teamId: string) => {
        setTeamToDelete(teamId);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (teamToDelete) {
            onDeleteTeam(teamToDelete);
        }
        setIsDeleteConfirmOpen(false);
        setTeamToDelete(null);
    };

    return (
        <div>
            <div className="mb-4 flex flex-col sm:flex-row gap-2 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.team_name}</label>
                    <input 
                        type="text" 
                        value={newTeamName} 
                        onChange={(e) => setNewTeamName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder={t.team_name}
                    />
                </div>
                <button 
                    onClick={handleCreate}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    {t.add_team}
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.team_name}</th>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.team_leader}</th>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.members}</th>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {teams.map(team => {
                            const teamMembers = users.filter(u => u.teamId === team.id);
                            const memberCount = teamMembers.length;
                            return (
                                <tr key={team.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {team.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        <select 
                                            value={team.leaderId || ''}
                                            onChange={(e) => handleLeaderChange(team.id, e.target.value || null)}
                                            className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:ring-0 cursor-pointer text-gray-900 dark:text-white"
                                        >
                                            <option value="">{t.select_leader}</option>
                                            {teamMembers.map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {memberCount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        <button
                                            onClick={() => handleDeleteClick(team.id)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            title={t.delete_team}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
             <ConfirmationDialog 
                isOpen={isLeaderConfirmOpen}
                onClose={() => setIsLeaderConfirmOpen(false)}
                onConfirm={confirmLeaderChange}
                title={t.confirm_leader_change_title}
                message={t.confirm_leader_change_message}
                t={t}
            />
            <ConfirmationDialog 
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={confirmDelete}
                title={t.confirm_delete_team_title}
                message={t.confirm_delete_team_message}
                t={t}
            />
        </div>
    );
};

interface UserManagementTableProps {
    t: any;
    users: User[];
    teams: Team[];
    onRoleUpdate: (userId: string, newRoles: UserRole[]) => void;
    onTeamAssignment: (userId: string, teamId: string | undefined) => void;
    onDeleteUser: (userId: string) => void;
    onAddUser: (name: string, email: string, phoneNumber?: string) => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({ t, users, teams, onRoleUpdate, onTeamAssignment, onDeleteUser, onAddUser }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // New user state
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPhone, setNewUserPhone] = useState('');

    const [pendingTeamAssignment, setPendingTeamAssignment] = useState<{userId: string, teamId: string | undefined} | null>(null);
    const [isTeamConfirmOpen, setIsTeamConfirmOpen] = useState(false);

    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const startEditing = (user: User) => {
        setEditingId(user.id);
        setSelectedRoles([...user.roles]);
    };

    const initiateSave = () => {
        setIsConfirmOpen(true);
    };

    const confirmSave = () => {
        if (editingId) {
            onRoleUpdate(editingId, selectedRoles);
            setEditingId(null);
        }
        setIsConfirmOpen(false);
    };
    
    const handleTeamChange = (userId: string, teamId: string | undefined) => {
        setPendingTeamAssignment({ userId, teamId });
        setIsTeamConfirmOpen(true);
    };

    const confirmTeamChange = () => {
        if (pendingTeamAssignment) {
            onTeamAssignment(pendingTeamAssignment.userId, pendingTeamAssignment.teamId);
        }
        setIsTeamConfirmOpen(false);
        setPendingTeamAssignment(null);
    };

    const handleDeleteClick = (userId: string) => {
        setUserToDelete(userId);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            onDeleteUser(userToDelete);
        }
        setIsDeleteConfirmOpen(false);
        setUserToDelete(null);
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    const toggleRole = (role: UserRole) => {
        setSelectedRoles(prev => 
            prev.includes(role) 
                ? prev.filter(r => r !== role) 
                : [...prev, role]
        );
    };

    const handleCreateUser = () => {
        if (newUserName && newUserEmail) {
            onAddUser(newUserName, newUserEmail, newUserPhone);
            setNewUserName('');
            setNewUserEmail('');
            setNewUserPhone('');
        } else {
            alert('Please fill in name and email');
        }
    };

    const handleWhatsApp = (phoneNumber: string, userName: string) => {
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        let finalNumber = cleanNumber;
        if (cleanNumber.startsWith('0')) {
            finalNumber = '972' + cleanNumber.substring(1);
        }
        const message = `Hi ${userName}, ...`;
        const url = `https://wa.me/${finalNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
    <div>
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{t.add_user}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                 <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.full_name}</label>
                    <input 
                        type="text" 
                        value={newUserName} 
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                        placeholder={t.full_name}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.email}</label>
                    <input 
                        type="email" 
                        value={newUserEmail} 
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                        placeholder={t.email}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.phone_number}</label>
                    <input 
                        type="tel" 
                        value={newUserPhone} 
                        onChange={(e) => setNewUserPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                        placeholder={t.phone_number}
                    />
                </div>
                <button 
                    onClick={handleCreateUser}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm h-[38px]"
                >
                    {t.add_user}
                </button>
            </div>
        </div>

        <div className="mb-4">
             <div className="relative rounded-md shadow-sm max-w-xs">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full ps-10 sm:text-sm border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md py-2 border"
                    placeholder={t.search_placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.user}</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.team}</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.role}</th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.actions}</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredUsers.map(user => {
                        const isEditing = editingId === user.id;
                        return (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                                    <div className="ms-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                        {user.email && <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>}
                                        {user.phoneNumber && <div className="text-xs text-gray-500 dark:text-gray-400">{user.phoneNumber}</div>}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <select
                                    value={user.teamId || ''}
                                    onChange={(e) => handleTeamChange(user.id, e.target.value || undefined)}
                                    className="bg-transparent text-sm text-gray-900 dark:text-white border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:ring-0 cursor-pointer"
                                >
                                    <option value="">{t.no_team}</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>{team.name}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-6 py-4">
                                {isEditing ? (
                                    <div className="flex flex-col space-y-1">
                                        {Object.values(UserRole).map(role => (
                                            <label key={role} className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRoles.includes(role)}
                                                    onChange={() => toggleRole(role)}
                                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">{t[role.toLowerCase().replace(' ', '_')]}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-1">
                                        {user.roles.map(role => (
                                            <span key={role} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {t[role.toLowerCase().replace(' ', '_')]}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium align-top">
                                {isEditing ? (
                                    <div className="flex flex-col space-y-2">
                                        <button 
                                            onClick={initiateSave} 
                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 font-bold text-start"
                                        >
                                            Save
                                        </button>
                                        <button 
                                            onClick={cancelEditing} 
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-start"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <button 
                                            onClick={() => startEditing(user)}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            {t.edit_roles}
                                        </button>
                                        {user.phoneNumber && (
                                            <button
                                                onClick={() => handleWhatsApp(user.phoneNumber!, user.name)}
                                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                title={t.send_whatsapp}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                                                </svg>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteClick(user.id)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            title={t.delete_user}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
            <ConfirmationDialog 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmSave}
                title={t.confirm_role_change_title}
                message={t.confirm_role_change_message}
                t={t}
            />
            <ConfirmationDialog 
                isOpen={isTeamConfirmOpen}
                onClose={() => setIsTeamConfirmOpen(false)}
                onConfirm={confirmTeamChange}
                title={t.confirm_team_change_title}
                message={t.confirm_team_change_message}
                t={t}
            />
            <ConfirmationDialog 
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={confirmDelete}
                title={t.confirm_delete_user_title}
                message={t.confirm_delete_user_message}
                t={t}
            />
        </div>
    </div>
    );
};

const AuditLogTable: React.FC<{ t: any, logs: any[] }> = ({ t, logs }) => (
     <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.timestamp}</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.user}</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.action}</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {logs.map((log, index) => (
                    <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{log.timestamp.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{log.user}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{log.action}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  t: any;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, title, message, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-4 rtl:space-x-reverse">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
