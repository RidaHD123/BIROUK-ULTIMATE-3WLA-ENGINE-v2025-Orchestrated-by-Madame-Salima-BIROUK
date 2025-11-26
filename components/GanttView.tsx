
import React from 'react';
import { Task, Language, Status, RiskLevel } from '../types';
import { TRANSLATIONS } from '../constants';
import { AlertCircle, Calendar, Plus, Edit2, Trash2, CheckSquare, XSquare } from 'lucide-react';

interface Props {
  tasks: Task[];
  language: Language;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const GanttView: React.FC<Props> = ({ tasks, language, onEdit, onDelete, onAdd }) => {
  const t = TRANSLATIONS[language];
  const isRTL = language === Language.Arabic;

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.Completed: return 'bg-green-100 text-green-800 border-green-200';
      case Status.InProgress: return 'bg-blue-100 text-blue-800 border-blue-200';
      case Status.Delayed: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.Critical: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">CRITICAL</span>;
      case RiskLevel.High: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500 text-white">HIGH</span>;
      case RiskLevel.Medium: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-400 text-black">MED</span>;
      default: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500 text-white">LOW</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center">
            <Calendar className="mr-2 text-blue-600" size={20} />
            {t.schedule}
        </h3>
        <button 
            onClick={onAdd}
            className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 transition shadow-md"
        >
            <Plus size={16} className={isRTL ? 'ml-2' : 'mr-2'} /> {t.addTask}
        </button>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar flex-1">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-slate-500 uppercase bg-slate-100 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-4 py-3 font-bold w-16">{t.actions}</th>
              <th className="px-4 py-3 font-bold w-20">ID</th>
              <th className="px-4 py-3 font-bold min-w-[200px]">{t.activity}</th>
              <th className="px-4 py-3 font-bold min-w-[120px]">{t.discipline}</th>
              <th className="px-4 py-3 font-bold w-32 text-center">{t.status}</th>
              <th className="px-4 py-3 font-bold w-20 text-center">%</th>
              <th className="px-4 py-3 font-bold w-20 text-center">{t.mri}</th>
              <th className="px-4 py-3 font-bold w-24 text-center">{t.risk}</th>
              <th className="px-4 py-3 font-bold w-16 text-center">JHA</th>
              <th className="px-4 py-3 font-bold min-w-[150px]">{t.constraints}</th>
              {/* Timeline Placeholders */}
              <th className="px-2 py-3 w-10 text-center border-l border-slate-300 bg-slate-200">W-1</th>
              <th className="px-2 py-3 w-10 text-center border-l border-blue-200 bg-blue-50 font-extrabold text-blue-800 ring-2 ring-inset ring-blue-200">CUR</th>
              <th className="px-2 py-3 w-10 text-center border-l border-slate-300 bg-slate-200">W+1</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-4 py-3 flex items-center space-x-2">
                    <button 
                        onClick={() => onEdit(task)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition" 
                        title={t.editTask}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button 
                        onClick={() => { if(window.confirm(t.delete + '?')) onDelete(task.id); }}
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded transition" 
                        title={t.delete}
                    >
                        <Trash2 size={16} />
                    </button>
                </td>
                <td className="px-4 py-3 font-mono text-slate-500 text-xs">{task.wbs}</td>
                <td className="px-4 py-3 font-medium text-slate-900">
                    {task.description}
                    {task.comments && <div className="text-[10px] text-slate-400 italic mt-1 truncate max-w-[200px]">{task.comments}</div>}
                </td>
                <td className="px-4 py-3 text-slate-600">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs border border-slate-200">
                        {task.discipline}
                    </span>
                </td>
                <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase border ${getStatusColor(task.status)}`}>
                        {task.status}
                    </span>
                </td>
                <td className="px-4 py-3 text-center font-bold text-slate-700">{task.progress}%</td>
                <td className="px-4 py-3 text-center">
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                        <div 
                            className={`h-1.5 rounded-full ${task.materialsStatus < 100 ? 'bg-yellow-400' : 'bg-green-500'}`} 
                            style={{width: `${task.materialsStatus}%`}}
                        ></div>
                    </div>
                </td>
                <td className="px-4 py-3 text-center">{getRiskBadge(task.riskLevel)}</td>
                <td className="px-4 py-3 text-center">
                    {task.jhaStatus ? 
                        <CheckSquare size={16} className="text-green-600 mx-auto" /> : 
                        <XSquare size={16} className="text-red-400 mx-auto" />
                    }
                </td>
                <td className="px-4 py-3 text-xs text-red-500">
                    {task.delayCause ? (
                        <span className="flex items-center">
                            <AlertCircle size={12} className="mr-1" /> {task.delayCause}
                        </span>
                    ) : '-'}
                </td>
                
                {/* Visual Gantt bars */}
                {[0,1,2].map((w) => (
                    <td key={w} className={`p-0 border-l ${w===1 ? 'border-blue-200 bg-blue-50/20' : 'border-slate-100'}`}>
                        {task.progress < 100 && (
                            <div className={`h-3 m-1 rounded-sm opacity-80 ${
                                task.status === Status.Delayed ? 'bg-red-400' : 
                                task.riskLevel === RiskLevel.Critical ? 'bg-orange-400' : 'bg-blue-500'
                            }`} style={{
                                width: `${Math.random() * 80 + 20}%`
                            }}></div>
                        )}
                    </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GanttView;
