import React, { useState, useEffect } from 'react';
import { Key, Save, X, ExternalLink, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSave: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, apiKey, onSave }) => {
  const [inputKey, setInputKey] = useState(apiKey);

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(inputKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-sap-dark px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Key size={18} />
            API Configuration
          </h3>
          <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Gemini API Key</label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full border border-slate-300 rounded-md p-2 text-sm font-mono focus:ring-2 focus:ring-sap-blue focus:border-transparent outline-none"
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-6">
            <div className="flex gap-2 text-blue-800 text-xs mb-1">
                <ShieldCheck size={14} className="mt-0.5" />
                <span className="font-bold">Security Note</span>
            </div>
            <p className="text-xs text-blue-700 leading-relaxed">
              Your key is stored locally in your browser and sent directly to Google. It is never sent to our servers.
            </p>
          </div>

          <div className="flex justify-between items-center">
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-sap-blue hover:underline flex items-center gap-1"
            >
              Get a free API key <ExternalLink size={10} />
            </a>
            
            <button
              onClick={handleSave}
              className="bg-sap-blue text-white px-4 py-2 rounded text-sm font-medium hover:bg-sap-dark transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;