
import React, { useState } from 'react';
import { MOCK_ALL_USERS, MOCK_AUDIT_LOGS } from '../constants';
import { User, UserRole } from '../types';

interface AdminViewProps {
  t: any;
}

const AdminView: React.FC<AdminViewProps> = ({ t }) => {
  const [users, setUsers] = useState<User[]>(MOCK_ALL_USERS);

  const handleRoleUpdate = (userId: string, newRole: UserRole) => {
    setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.admin_panel}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2">
            <Card title={t.user_management}>
                <UserManagementTable t={t} users={users} onRoleUpdate={handleRoleUpdate} />
            </Card>
        </div>
        <Card title={t.system_settings}>
           <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.submission_deadline}</label>
                    <input type="text" value="Thursday 15:00" readOnly className="mt-1 block w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manager Approval Deadline</label>
                    <input type="text" value="Friday 12:00" readOnly className="mt-1 block w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
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

interface UserManagementTableProps {
    t: any;
    users: User[];
    onRoleUpdate: (userId: string, newRole: UserRole) => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({ t, users, onRoleUpdate }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.Employee);

    const startEditing = (user: User) => {
        setEditingId(user.id);
        setSelectedRole(user.role);
    };

    const saveEditing = (userId: string) => {
        onRoleUpdate(userId, selectedRole);
        setEditingId(null);
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    return (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.user}</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.role}</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.actions}</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {users.map(user => {
                    const isEditing = editingId === user.id;
                    return (
                    <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                                <div className="ms-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {isEditing ? (
                                <select 
                                    value={selectedRole} 
                                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                                    className="block w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-1"
                                >
                                    {Object.values(UserRole).map(role => (
                                        <option key={role} value={role}>{t[role.toLowerCase().replace(' ', '_')]}</option>
                                    ))}
                                </select>
                            ) : (
                                t[user.role.toLowerCase().replace(' ', '_')]
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {isEditing ? (
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <button 
                                        onClick={() => saveEditing(user.id)} 
                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 font-bold"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        onClick={cancelEditing} 
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => startEditing(user)}
                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    {t.change_role}
                                </button>
                            )}
                        </td>
                    </tr>
                    )
                })}
            </tbody>
        </table>
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


export default AdminView;
