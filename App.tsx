
import React, { useState, useEffect } from 'react';
import { Language, Task, RiskLevel } from './types';
import { TRANSLATIONS, MOCK_TASKS } from './constants';
import LanguageSelector from './components/LanguageSelector';
import Dashboard from './components/Dashboard';
import GanttView from './components/GanttView';
import HSEPanel from './components/HSEPanel';
import TaskModal from './components/TaskModal';
import { generateExecutiveSummary, analyzeRisks } from './services/geminiService';
import { LayoutDashboard, Calendar, Shield, Download, FileText, Send, Loader2, PlusCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.English);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'hse'>('dashboard');
  const [executiveSummary, setExecutiveSummary] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [riskData, setRiskData] = useState<any>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const t = TRANSLATIONS[currentLanguage];
  const isRTL = currentLanguage === Language.Arabic;

  // Initial AI Data Load
  useEffect(() => {
    const fetchAI = async () => {
        setLoadingAI(true);
        // Pass current live tasks to AI for real analysis
        const summary = await generateExecutiveSummary(currentLanguage, tasks);
        const risks = await analyzeRisks(tasks);
        setExecutiveSummary(summary);
        setRiskData(risks);
        setLoadingAI(false);
    };
    fetchAI();
  }, [currentLanguage, tasks.length]); // Re-run if language changes or tasks count changes significantly

  // CRUD Operations
  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
        // Update existing
        setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    } else {
        // Add new
        setTasks(prev => [task, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleHSE = (taskId: string, type: 'jha' | 'ptw') => {
    setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
            return {
                ...t,
                jhaStatus: type === 'jha' ? !t.jhaStatus : t.jhaStatus,
                ptwStatus: type === 'ptw' ? !t.ptwStatus : t.ptwStatus
            };
        }
        return t;
    }));
  };

  // Export Functions
  const handleExportPDF = async () => {
    const input = document.getElementById('main-content');
    if (!input) return;
    
    const originalStyle = input.style.overflow;
    input.style.overflow = 'visible'; 
    
    try {
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape', 'mm', 'a3');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`3WLA_Report_Birouk_v2025_${currentLanguage}.pdf`);
    } finally {
        input.style.overflow = originalStyle;
    }
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tasks.map(t => ({
        ID: t.id,
        WBS: t.wbs,
        Activity: t.description,
        Discipline: t.discipline,
        Start: t.startDate,
        End: t.endDate,
        Status: t.status,
        Progress: t.progress,
        MRI: t.materialsStatus,
        Risk: t.riskLevel,
        Comments: t.comments || ''
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "3WLA_Daily_Report");
    XLSX.writeFile(wb, `3WLA_Daily_Report_Birouk_${currentLanguage}.xlsx`);
  };

  const handleMockDownload = (type: string) => {
    alert(`[DEMO] Generating ${type} file for Madame Salima BIROUK...`);
  };

  return (
    <div className={`min-h-screen bg-slate-100 flex flex-col ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Task Modal */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTask} 
        task={editingTask}
        language={currentLanguage}
      />

      {/* Header */}
      <header className="bg-slate-900 text-white shadow-xl z-50 sticky top-0">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="flex items-center space-x-4">
                <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl shadow-inner">
                    B
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-wide">{t.title}</h1>
                    <p className="text-xs text-blue-300 uppercase tracking-widest">{t.subtitle}</p>
                </div>
            </div>
            
            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
                <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
                <div className="h-8 w-[1px] bg-slate-700 mx-2 hidden md:block"></div>
                <button 
                    onClick={handleExportPDF}
                    className="hidden md:flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition"
                >
                    <Download size={16} className={isRTL ? 'ml-2' : 'mr-2'} /> PDF
                </button>
            </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 container mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        
        {/* Sidebar Navigation */}
        <aside className="col-span-12 md:col-span-2 space-y-2">
            <nav className="space-y-1">
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}
                >
                    <LayoutDashboard size={20} className={isRTL ? 'ml-3' : 'mr-3'} /> {t.dashboard}
                </button>
                <button 
                    onClick={() => setActiveTab('schedule')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'schedule' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}
                >
                    <Calendar size={20} className={isRTL ? 'ml-3' : 'mr-3'} /> {t.schedule}
                </button>
                <button 
                    onClick={() => setActiveTab('hse')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'hse' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}
                >
                    <Shield size={20} className={isRTL ? 'ml-3' : 'mr-3'} /> {t.hse}
                </button>
            </nav>

            <div className="pt-6 border-t border-slate-200 mt-6 space-y-2">
                 <button 
                    onClick={handleAddTask}
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow transition mb-4"
                >
                    <PlusCircle size={20} className={isRTL ? 'ml-2' : 'mr-2'} /> {t.addTask}
                </button>

                <p className="px-4 text-xs font-bold text-slate-400 uppercase mb-3">{t.reports}</p>
                <button onClick={handleExportExcel} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-white rounded transition flex items-center">
                    <FileText size={16} className={isRTL ? 'ml-2' : 'mr-2'} /> Excel (.xlsx)
                </button>
                <button onClick={() => handleMockDownload('Primavera P6 XER')} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-white rounded transition flex items-center">
                    <FileText size={16} className={isRTL ? 'ml-2' : 'mr-2'} /> Primavera (.xer)
                </button>
            </div>
        </aside>

        {/* Main Content Area */}
        <main id="main-content" className="col-span-12 md:col-span-10">
            
            {/* Executive Message Block */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-xl p-6 text-white mb-6 relative overflow-hidden shadow-lg">
                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-2 flex items-center">
                        <Send size={20} className={isRTL ? 'ml-2' : 'mr-2'} /> {t.executiveSummary}
                    </h2>
                    <div className="text-blue-100 italic leading-relaxed font-serif text-lg">
                        {loadingAI ? (
                            <div className="flex items-center space-x-2">
                                <Loader2 className="animate-spin" />
                                <span>Generating Madame Birouk's insights...</span>
                            </div>
                        ) : (
                            `"${executiveSummary}"`
                        )}
                    </div>
                    <div className="mt-4 flex justify-end">
                       <div className="text-right">
                           <div className="font-signature text-2xl text-yellow-400" style={{fontFamily: 'cursive'}}>Salima Birouk</div>
                           <div className="text-xs uppercase tracking-widest text-slate-400">HSE & Planning Authority</div>
                       </div>
                    </div>
                </div>
                {/* Decoration */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Dynamic View */}
            <div className="min-h-[500px]">
                {activeTab === 'dashboard' && <Dashboard tasks={tasks} language={currentLanguage} riskData={riskData} />}
                {activeTab === 'schedule' && (
                    <GanttView 
                        tasks={tasks} 
                        language={currentLanguage} 
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onAdd={handleAddTask}
                    />
                )}
                {activeTab === 'hse' && (
                    <HSEPanel 
                        tasks={tasks} 
                        language={currentLanguage} 
                        onToggleHSE={handleToggleHSE}
                    />
                )}
            </div>

            <footer className="mt-12 text-center text-xs text-slate-400 pb-6">
                <p>BIROUK ULTIMATE 3WLA ENGINE v2025 | {t.generatedBy}</p>
                <p className="mt-1 font-mono">System Status: ONLINE | API: {process.env.API_KEY ? 'CONNECTED' : 'MOCK MODE'}</p>
            </footer>
        </main>

      </div>
    </div>
  );
}

export default App;
