
import React, { useState, useRef, useEffect } from 'react';
import { MandatoryDate, Team, StatusOption } from '../types';
import { getStatusLabel } from '../constants';

interface MandatoryDatesManagementProps {
    t: any;
    teams: Team[];
    mandatoryDates: MandatoryDate[];
    onAdd: (rule: MandatoryDate) => void;
    onDelete: (id: string) => void;
    fixedTeamId?: string;
    statusOptions: StatusOption[];
    language: 'en' | 'he';
}

const MandatoryDatesManagement: React.FC<MandatoryDatesManagementProps> = ({ t, teams, mandatoryDates, onAdd, onDelete, fixedTeamId, statusOptions, language }) => {
    const [newDate, setNewDate] = useState('');
    const [newStatus, setNewStatus] = useState<string>('Office');
    const [newDescription, setNewDescription] = useState('');
    const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAdd = () => {
        if (newDate && newDescription) {
            const teamsToApply = fixedTeamId ? [fixedTeamId] : selectedTeamIds;

            onAdd({
                id: `m${Date.now()}`,
                date: newDate,
                status: newStatus,
                description: newDescription,
                teamIds: teamsToApply
            });
            setNewDate('');
            setNewDescription('');
            setNewStatus('Office');
            setSelectedTeamIds([]);
        }
    };

    const toggleTeam = (teamId: string) => {
        setSelectedTeamIds(prev => 
            prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
        );
    };

    const displayedRules = mandatoryDates.filter(rule => {
        if (!fixedTeamId) return true; 
        return rule.teamIds?.includes(fixedTeamId);
    });

    return (
        <div>
             <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{t.add_rule}</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                     <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.date}</label>
                        <input 
                            type="date" 
                            value={newDate} 
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                        />
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.mandatory_status}</label>
                        <select 
                            value={newStatus} 
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                        >
                             {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{getStatusLabel(opt, language)}</option>
                            ))}
                        </select>
                    </div>
                    
                    {!fixedTeamId ? (
                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.apply_to}</label>
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm text-start truncate"
                            >
                                {selectedTeamIds.length === 0 ? t.all_teams : `${selectedTeamIds.length} ${t.specific_teams}`}
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 rounded-md shadow-lg border border-gray-200 dark:border-slate-600 max-h-40 overflow-y-auto p-2">
                                    {teams.map(team => (
                                        <label key={team.id} className="flex items-center p-1 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer rounded">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedTeamIds.includes(team.id)} 
                                                onChange={() => toggleTeam(team.id)} 
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ms-2 text-sm text-gray-700 dark:text-gray-200">{team.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.apply_to}</label>
                            <input 
                                type="text" 
                                disabled 
                                value={teams.find(t => t.id === fixedTeamId)?.name || 'My Team'}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-gray-100 dark:bg-slate-600 text-gray-500 dark:text-gray-300 text-sm cursor-not-allowed"
                            />
                        </div>
                    )}

                     <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.description}</label>
                        <input 
                            type="text" 
                            value={newDescription} 
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                            placeholder="e.g. Team Day"
                        />
                    </div>
                    <button 
                        onClick={handleAdd}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                    >
                        {t.add_rule}
                    </button>
                </div>
            </div>

             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.date}</th>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.status}</th>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.apply_to}</th>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.description}</th>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {displayedRules.map(rule => {
                            const statusOpt = statusOptions.find(o => o.value === rule.status);
                            const appliedTeams = rule.teamIds && rule.teamIds.length > 0 
                                ? rule.teamIds.map(tid => teams.find(t => t.id === tid)?.name).filter(Boolean).join(', ') 
                                : t.all_teams;

                            return (
                                <tr key={rule.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{rule.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                         <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusOpt?.color}`}>
                                            {statusOpt ? getStatusLabel(statusOpt, language) : rule.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate" title={appliedTeams}>
                                        {appliedTeams}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{rule.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => onDelete(rule.id)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            title={t.delete_rule}
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
        </div>
    );
}

export default MandatoryDatesManagement;
