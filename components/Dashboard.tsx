import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, HardHat, TrendingUp } from 'lucide-react';
import { Task, Language, RiskLevel, Status } from '../types';
import { TRANSLATIONS } from '../constants';
import * as d3 from 'd3';

interface Props {
  tasks: Task[];
  language: Language;
  riskData: any;
}

const Dashboard: React.FC<Props> = ({ tasks, language, riskData }) => {
  const t = TRANSLATIONS[language];
  
  // Computed Metrics
  const totalTasks = tasks.length;
  const criticalTasks = tasks.filter(t => t.riskLevel === RiskLevel.Critical).length;
  const completedTasks = tasks.filter(t => t.status === Status.Completed).length;
  const progressAvg = Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / totalTasks);
  
  // Data for Charts
  const manpowerData = tasks.slice(0, 10).map((task, i) => ({
    name: `W${i+1}`,
    civil: Math.floor(Math.random() * 50) + 20,
    structural: Math.floor(Math.random() * 30) + 10,
    piping: Math.floor(Math.random() * 40) + 15
  }));

  const curveData = Array.from({length: 6}, (_, i) => ({
    week: `${t.week} ${i-3}`,
    planned: (i + 1) * 15,
    actual: (i + 1) * 12 + Math.random() * 5
  }));

  // D3 Gauge Ref (Mock Implementation for Visual)
  const d3Container = React.useRef(null);

  useEffect(() => {
    if (d3Container.current) {
        d3.select(d3Container.current).selectAll("*").remove();
        // Simple D3 logic could go here, relying on Recharts for main viz
    }
  }, [language]);

  return (
    <div className="space-y-6 animate-fade-in p-4">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.activity}</p>
            <h3 className="text-3xl font-bold text-slate-900">{totalTasks}</h3>
            <p className="text-xs text-green-600 font-medium flex items-center mt-1">
              <TrendingUp size={12} className="mr-1" /> +12% vs Baseline
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-full">
            <Activity className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.hseCompliance}</p>
            <h3 className="text-3xl font-bold text-slate-900">98.5%</h3>
            <p className="text-xs text-red-500 font-medium mt-1">
              2 {t.simops}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-full">
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.riskAnalysis}</p>
            <h3 className="text-3xl font-bold text-red-600">{criticalTasks}</h3>
            <p className="text-xs text-slate-500 mt-1">High Risk Activities</p>
          </div>
          <div className="bg-red-50 p-3 rounded-full">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.manpower}</p>
            <h3 className="text-3xl font-bold text-orange-600">425</h3>
            <p className="text-xs text-slate-500 mt-1">On Site Today</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-full">
            <HardHat className="text-orange-600" size={24} />
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* S-Curve */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h4 className="text-lg font-bold text-slate-800 mb-4">{t.schedule} - Progress S-Curve</h4>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={curveData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="week" tick={{fontSize: 12}} />
                        <YAxis tick={{fontSize: 12}} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="planned" stroke="#2563eb" strokeWidth={3} name="Planned %" />
                        <Line type="monotone" dataKey="actual" stroke="#16a34a" strokeWidth={3} name="Actual %" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Manpower Histogram */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h4 className="text-lg font-bold text-slate-800 mb-4">{t.manpowerHistogram}</h4>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={manpowerData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis tick={{fontSize: 12}} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} />
                        <Legend />
                        <Bar dataKey="civil" stackId="a" fill="#3b82f6" name="Civil" />
                        <Bar dataKey="structural" stackId="a" fill="#6366f1" name="Struct." />
                        <Bar dataKey="piping" stackId="a" fill="#0ea5e9" name="Piping" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* AI Risk Insight Box */}
      {riskData && (
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-400">
            <h4 className="text-lg font-bold flex items-center mb-2">
                <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded mr-2 uppercase font-extrabold">AI Insight</span>
                {t.riskAnalysis}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm opacity-90">
                <div>
                    <strong className="block text-yellow-300 mb-1">Top Risks Detected:</strong>
                    <ul className="list-disc list-inside">
                        {riskData.topRisks?.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>
                </div>
                <div>
                    <strong className="block text-blue-300 mb-1">Mitigation Strategy:</strong>
                    <p>{riskData.mitigationAdvice}</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
