
import React, { useState, useEffect } from 'react';
import { Task, Language, Discipline, Status, RiskLevel } from '../types';
import { TRANSLATIONS } from '../constants';
import { X, Save, Calendar, User, Briefcase, AlertTriangle, FileText, Activity } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task: Task | null;
  language: Language;
}

const TaskModal: React.FC<Props> = ({ isOpen, onClose, onSave, task, language }) => {
  const t = TRANSLATIONS[language];
  const isRTL = language === Language.Arabic;

  const initialTask: Task = {
    id: '',
    wbs: '',
    description: '',
    discipline: Discipline.Civil,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: Status.Planned,
    progress: 0,
    manpower: 0,
    equipment: [],
    materialsStatus: 100,
    hseRisks: [],
    jhaStatus: false,
    ptwStatus: false,
    riskLevel: RiskLevel.Low,
    responsible: '',
    comments: ''
  };

  const [formData, setFormData] = useState<Task>(initialTask);

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        ...initialTask,
        id: `ACT-${Math.floor(Math.random() * 100000)}`,
        wbs: `WBS-0${Math.floor(Math.random() * 9)}`
      });
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}>
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 sticky top-0 z-10 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
                <Activity className="mr-2" />
                {task ? t.editTask : t.addTask}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition">
                <X size={24} />
            </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: General Info */}
            <div className="space-y-4">
                <h3 className="text-sm uppercase font-bold text-slate-500 border-b pb-2 mb-4 flex items-center">
                    <Briefcase size={16} className="mr-2" /> Project Data
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">WBS ID</label>
                        <input 
                            type="text" 
                            required
                            value={formData.wbs}
                            onChange={(e) => setFormData({...formData, wbs: e.target.value})}
                            className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t.discipline}</label>
                        <select 
                            value={formData.discipline}
                            onChange={(e) => setFormData({...formData, discipline: e.target.value as Discipline})}
                            className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {Object.values(Discipline).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.description}</label>
                    <input 
                        type="text" 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                        <input 
                            type="date" 
                            required
                            value={formData.startDate}
                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                            className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                        <input 
                            type="date" 
                            required
                            value={formData.endDate}
                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                            className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t.manpower}</label>
                        <input 
                            type="number" 
                            min="0"
                            value={formData.manpower}
                            onChange={(e) => setFormData({...formData, manpower: parseInt(e.target.value) || 0})}
                            className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t.mri}</label>
                        <input 
                            type="number" 
                            min="0" max="100"
                            value={formData.materialsStatus}
                            onChange={(e) => setFormData({...formData, materialsStatus: parseInt(e.target.value) || 0})}
                            className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Right Column: Status & HSE */}
            <div className="space-y-4">
                <h3 className="text-sm uppercase font-bold text-slate-500 border-b pb-2 mb-4 flex items-center">
                    <AlertTriangle size={16} className="mr-2" /> Status & Safety
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t.status}</label>
                        <select 
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value as Status})}
                            className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t.progress}</label>
                        <div className="flex items-center space-x-2">
                            <input 
                                type="range" 
                                min="0" max="100"
                                value={formData.progress}
                                onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-sm font-bold w-10">{formData.progress}%</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.risk}</label>
                    <select 
                        value={formData.riskLevel}
                        onChange={(e) => setFormData({...formData, riskLevel: e.target.value as RiskLevel})}
                        className={`w-full border border-slate-300 rounded p-2 text-sm font-bold outline-none ${
                            formData.riskLevel === RiskLevel.Critical ? 'text-red-600 bg-red-50' : 
                            formData.riskLevel === RiskLevel.High ? 'text-orange-500 bg-orange-50' : 'text-slate-700'
                        }`}
                    >
                        {Object.values(RiskLevel).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                <div className="flex space-x-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={formData.jhaStatus}
                            onChange={(e) => setFormData({...formData, jhaStatus: e.target.checked})}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-bold text-slate-700">{t.jha}</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={formData.ptwStatus}
                            onChange={(e) => setFormData({...formData, ptwStatus: e.target.checked})}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-bold text-slate-700">{t.ptw}</span>
                    </label>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.comments}</label>
                    <textarea 
                        rows={3}
                        value={formData.comments || ''}
                        onChange={(e) => setFormData({...formData, comments: e.target.value})}
                        className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Log daily site conditions, delays, or notes here..."
                    ></textarea>
                </div>
            </div>

            {/* Footer */}
            <div className="col-span-1 md:col-span-2 flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition"
                >
                    {t.cancel}
                </button>
                <button 
                    type="submit" 
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-lg flex items-center transition"
                >
                    <Save size={18} className="mr-2" />
                    {t.save}
                </button>
            </div>

        </form>
      </div>
    </div>
  );
};

export default TaskModal;
