
import React from 'react';
import { Task, Language, RiskLevel } from '../types';
import { TRANSLATIONS } from '../constants';
import { Shield, AlertTriangle, FileText, CheckSquare, XSquare } from 'lucide-react';

interface Props {
  tasks: Task[];
  language: Language;
  onToggleHSE: (taskId: string, type: 'jha' | 'ptw') => void;
}

const HSEPanel: React.FC<Props> = ({ tasks, language, onToggleHSE }) => {
  const t = TRANSLATIONS[language];
  const criticalOperations = tasks.filter(t => t.riskLevel === RiskLevel.Critical || t.riskLevel === RiskLevel.High);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        {/* Compliance Scorecard */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-1">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Shield className="mr-2 text-green-600" />
                {t.hseCompliance}
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-600">Toolbox Talks (TBT)</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">100% {t.confirmed}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-600">PTW Audit</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">92%</span>
                </div>
                
                <div className="mt-6 bg-red-50 p-4 rounded-lg border border-red-100">
                    <h4 className="text-red-800 font-bold text-sm mb-2 flex items-center">
                        <AlertTriangle size={16} className="mr-2" />
                        SIMOPS Alert
                    </h4>
                    <p className="text-xs text-red-700">
                        High risk detection: {criticalOperations.length} activities require immediate Permit validation.
                    </p>
                </div>
            </div>
        </div>

        {/* High Risk Activity Log */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-1 lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <AlertTriangle className="mr-2 text-orange-500" />
                Critical Activities Watchlist (Click icons to update)
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-2 text-left">Activity</th>
                            <th className="px-4 py-2 text-left">Risk</th>
                            <th className="px-4 py-2 text-center">JHA</th>
                            <th className="px-4 py-2 text-center">PTW</th>
                            <th className="px-4 py-2 text-left">Controls</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {criticalOperations.slice(0, 8).map(task => (
                            <tr key={task.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium">{task.description}</td>
                                <td className="px-4 py-3">
                                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                                        {task.hseRisks[0] || 'General Hazard'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button onClick={() => onToggleHSE(task.id, 'jha')} className="hover:scale-110 transition">
                                        {task.jhaStatus ? 
                                            <CheckSquare size={20} className="text-green-500 inline" /> : 
                                            <XSquare size={20} className="text-red-500 inline" />
                                        }
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button onClick={() => onToggleHSE(task.id, 'ptw')} className="hover:scale-110 transition">
                                        {task.ptwStatus ? 
                                            <FileText size={20} className="text-blue-500 inline" /> : 
                                            <span className="text-orange-500 text-xs font-bold border border-orange-200 px-1 rounded bg-orange-50">DRAFT</span>
                                        }
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-xs text-slate-600">
                                    {task.responsible} - Full supervision required.
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default HSEPanel;
