import React, { useState, useCallback } from 'react';
import InputSection from './components/InputSection';
import JsonViewer from './components/JsonViewer';
import AnalysisPanel from './components/AnalysisPanel';
import { ViewMode, AnalysisResult } from './types';
import { analyzeConcurJson } from './services/geminiService';
import { Code2, ListTree, Activity, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [jsonContent, setJsonContent] = useState<any | null>(null);
  const [rawString, setRawString] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.RAW);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJsonLoaded = useCallback((json: any, raw: string) => {
    setJsonContent(json);
    setRawString(raw);
    setError(null);
    setAnalysis(null);
  }, []);

  const handleError = useCallback((msg: string) => {
    setError(msg);
  }, []);

  const handleAnalyze = async () => {
    if (!rawString) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeConcurJson(rawString);
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to analyse JSON. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-100">
      {/* Header */}
      <header className="bg-[#004071] text-white px-6 py-3 flex items-center justify-between shadow-md z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0070F2] to-[#F0AB00] rounded flex items-center justify-center">
            <Activity className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              SAP Concur <span className="text-[#F0AB00]">JSON Explainer</span>
            </h1>
            <p className="text-[10px] text-slate-300">ICS Integration Connector Utility</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-400 hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
          <a
            href="https://www.covantage.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#F0AB00] hover:text-white transition-colors font-medium"
          >
            <ExternalLink size={14} />
            covantage.com.au
          </a>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Column: Input */}
        <div className="w-[300px] flex-shrink-0 h-full hidden md:block z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <InputSection onJsonLoaded={handleJsonLoaded} onError={handleError} />
        </div>

        {/* Middle Column: JSON Viewer */}
        <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-slate-200">
          <div className="border-b border-slate-100 p-2 flex justify-between items-center bg-white">
            <div className="flex bg-slate-100 p-1 rounded-md">
              <button
                onClick={() => setViewMode(ViewMode.RAW)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all
                  ${viewMode === ViewMode.RAW ? 'bg-white text-[#0070F2] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Code2 size={14} /> Raw
              </button>
              <button
                onClick={() => setViewMode(ViewMode.TREE)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all
                  ${viewMode === ViewMode.TREE ? 'bg-white text-[#0070F2] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <ListTree size={14} /> Tree
              </button>
            </div>
            <div className="text-xs text-slate-400 font-mono px-4">
              {jsonContent ? `${(rawString.length / 1024).toFixed(2)} KB` : ''}
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            {!jsonContent ? (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                <div className="text-center">
                  <Code2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Waiting for JSON input...</p>
                </div>
              </div>
            ) : (
              <JsonViewer data={jsonContent} mode={viewMode} />
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis */}
        <div className="w-[400px] flex-shrink-0 h-full bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10">
          <AnalysisPanel
            analysis={analysis}
            isLoading={isAnalyzing}
            error={error}
            onAnalyze={handleAnalyze}
            hasContent={!!jsonContent}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
