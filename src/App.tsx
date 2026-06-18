import React, { useState, useCallback, useEffect } from 'react';
import InputSection from './components/InputSection';
import JsonViewer from './components/JsonViewer';
import { ViewMode } from './types';
import { Code2, ListTree, ExternalLink, AlertCircle, X } from 'lucide-react';

const App: React.FC = () => {
  const [jsonContent, setJsonContent] = useState<any | null>(null);
  const [rawString, setRawString] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.RAW);
  const [error, setError] = useState<string | null>(null);
  const [leftWidth, setLeftWidth] = useState(380); // Default width set to 380px (more visible by default)
  const [isResizing, setIsResizing] = useState(false);

  const handleJsonLoaded = useCallback((json: any, raw: string) => {
    setJsonContent(json);
    setRawString(raw);
    setError(null);
    setViewMode(ViewMode.TREE);
  }, []);

  const handleError = useCallback((msg: string) => {
    setError(msg);
  }, []);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      // Limit the input column width between 280px and 600px
      const newWidth = Math.max(280, Math.min(600, e.clientX));
      setLeftWidth(newWidth);
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-100">
      {/* Header */}
      <header className="bg-teal-950 text-white px-6 py-3 flex items-center justify-between shadow-md z-20 flex-shrink-0 border-b border-teal-900">
        <div className="flex items-center gap-4">
          <img 
            src="/tools/JSON/logo2.png" 
            alt="Covantage Logo" 
            className="h-8 object-contain"
            onError={(e) => {
              // Fallback to text logo if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="h-6 w-px bg-teal-800 hidden sm:block"></div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Covantage ICS <span className="text-amber-500 font-semibold">JSON Explainer</span>
            </h1>
            <p className="text-[10px] text-teal-300">ICS Integration Connector Utility</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://www.covantage.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-white transition-colors font-semibold"
          >
            <ExternalLink size={14} />
            covantage.com.au
          </a>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className={`flex-1 flex overflow-hidden ${isResizing ? 'cursor-col-resize select-none' : ''}`}>

        {/* Left Column: Input */}
        <div 
          style={{ width: `${leftWidth}px` }} 
          className="flex-shrink-0 h-full hidden md:block z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
        >
          <InputSection onJsonLoaded={handleJsonLoaded} onError={handleError} />
        </div>

        {/* Resizer Splitter Bar */}
        <div
          onMouseDown={startResizing}
          className={`w-1 hover:w-1 bg-slate-200 hover:bg-[#0070F2] cursor-col-resize h-full transition-colors z-20 flex-shrink-0 hidden md:block
            ${isResizing ? 'bg-[#0070F2]' : ''}`}
          title="Drag to resize panels"
        />

        {/* Middle Column: JSON Viewer */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {error && (
            <div className="bg-red-50 border-b border-red-200 text-red-700 px-4 py-2 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500" />
                <span>{error}</span>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="text-red-400 hover:text-red-600 transition-colors p-1"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="border-b border-slate-100 p-2.5 flex justify-between items-center bg-white">
            <div className="flex bg-slate-100 p-1.5 rounded-lg">
              <button
                onClick={() => setViewMode(ViewMode.RAW)}
                className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition-all
                  ${viewMode === ViewMode.RAW ? 'bg-white text-[#0070F2] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Code2 size={16} /> Raw
              </button>
              <button
                onClick={() => setViewMode(ViewMode.TREE)}
                className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition-all
                  ${viewMode === ViewMode.TREE ? 'bg-white text-[#0070F2] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <ListTree size={16} /> Tree
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
      </div>
    </div>
  );
};

export default App;
