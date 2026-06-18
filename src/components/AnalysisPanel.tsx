import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, Info, DollarSign, Calendar, FileText } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  onAnalyze: () => void;
  hasContent: boolean;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isLoading, error, onAnalyze, hasContent }) => {
  if (!hasContent) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center border-l border-slate-200 bg-white">
        <FileText className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-slate-600">No JSON Loaded</h3>
        <p className="max-w-xs">Upload a file or paste SAP Concur JSON to start the analysis.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <Info className="w-5 h-5 text-[#0070F2]" />
          ICS Explainer
        </h2>
        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm
            ${isLoading
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-[#0070F2] text-white hover:bg-[#004071]'
            }`}
        >
          {isLoading ? 'Analysing...' : 'Analyse JSON'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6 flex gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!analysis && !isLoading && !error && (
          <div className="text-center py-12">
            <p className="text-slate-500">Click "Analyse JSON" to get AI-powered insights about this SAP Concur payload.</p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        )}

        {analysis && (
          <div className="space-y-8">
            {/* Summary Section */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Executive Summary</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-slate-700 text-sm leading-relaxed">
                {analysis.summary}
              </div>
            </section>

            {/* Financials */}
            {(analysis.financialPostingInfo.totalAmount !== undefined || analysis.financialPostingInfo.postingDate) && (
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Financial Context</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Total Amount</div>
                      <div className="font-mono font-semibold text-slate-800">
                        {analysis.financialPostingInfo.totalAmount?.toFixed(2)} {analysis.financialPostingInfo.currency}
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Posting Date</div>
                      <div className="font-mono font-semibold text-slate-800">
                        {analysis.financialPostingInfo.postingDate || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Warnings/Alerts */}
            {analysis.warnings && analysis.warnings.length > 0 && (
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Integrity Check</h3>
                <ul className="space-y-2">
                  {analysis.warnings.map((warning, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-sm text-amber-800 bg-amber-50 p-2 rounded border border-amber-100">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Field Deep Dive */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Field Analysis</h3>
              <div className="space-y-3">
                {analysis.fieldExplanations.map((item, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-mono text-sm text-[#0070F2] font-medium">{item.field}</div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full
                        ${item.importance === 'high' ? 'bg-red-100 text-red-700' :
                          item.importance === 'medium' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                        {item.importance}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-500 mb-2 truncate" title={item.value}>
                      Value: {item.value}
                    </div>
                    <p className="text-sm text-slate-700">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;
