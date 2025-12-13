import React, { useRef, useState } from 'react';
import { Upload, X, FileJson } from 'lucide-react';

interface InputSectionProps {
  onJsonLoaded: (json: any, rawString: string) => void;
  onError: (msg: string) => void;
}

const DEMO_JSON = {
  "batchId": "BATCH-2023-10-27-001",
  "companyId": "SAP_Test_Corp",
  "reports": [
    {
      "reportId": "B8A8A9E198274B",
      "employeeId": "E10055",
      "userLoginId": "jsmith@example.com",
      "reportName": "October Client Visit - London",
      "reportDate": "2023-10-25",
      "reportTotal": 1450.50,
      "reportCurrency": "GBP",
      "approvalStatus": "APPROVED",
      "entries": [
        {
          "entryId": "ENT-001",
          "expenseTypeCode": "HOTEL",
          "transactionDate": "2023-10-20",
          "transactionAmount": 850.00,
          "vendorDescription": "Grand Hotel London",
          "isPersonal": false,
          "allocations": [
            {
              "costCenterCode": "CC-9001",
              "percentage": 100
            }
          ]
        },
        {
          "entryId": "ENT-002",
          "expenseTypeCode": "MEAL",
          "transactionDate": "2023-10-21",
          "transactionAmount": 45.50,
          "vendorDescription": "Pret A Manger",
          "attendees": []
        }
      ]
    }
  ]
};

const InputSection: React.FC<InputSectionProps> = ({ onJsonLoaded, onError }) => {
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processJson = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      onJsonLoaded(parsed, content);
    } catch (e) {
      onError("Invalid JSON syntax. Please check the file or text.");
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    if (e.target.value.trim() === '') {
        // Optional: clear state if empty
        return;
    }
    // We delay parsing slightly or wait for blur in a real app, 
    // but for instant feedback let's just try parse if it looks complete
    if (e.target.value.trim().endsWith('}') || e.target.value.trim().endsWith(']')) {
         try {
            const parsed = JSON.parse(e.target.value);
            onJsonLoaded(parsed, e.target.value);
        } catch (e) {
            // Squelch errors while typing
        }
    }
  };

  const handleBlur = () => {
      if (textInput.trim()) {
          processJson(textInput);
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTextInput(content);
      processJson(content);
    };
    reader.onerror = () => {
      onError("Failed to read file.");
    };
    reader.readAsText(file);
    
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const loadDemoData = () => {
    const jsonStr = JSON.stringify(DEMO_JSON, null, 2);
    setTextInput(jsonStr);
    onJsonLoaded(DEMO_JSON, jsonStr);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="font-semibold text-slate-800">Input Source</h2>
        <button 
          onClick={() => setTextInput('')} 
          className="text-slate-400 hover:text-red-500 transition-colors"
          title="Clear Input"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="p-4 flex flex-col gap-4 flex-1">
         {/* File Upload Trigger */}
         <div 
           className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-sap-blue hover:bg-blue-50 transition-colors cursor-pointer group"
           onClick={() => fileInputRef.current?.click()}
         >
           <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-white text-slate-500 group-hover:text-sap-blue transition-colors">
              <Upload size={24} />
           </div>
           <p className="text-sm font-medium text-slate-700">Click to upload JSON file</p>
           <p className="text-xs text-slate-400 mt-1">Accepts .json, .txt</p>
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleFileChange} 
             accept=".json,.txt" 
             className="hidden" 
            />
         </div>

         <div className="flex items-center gap-2">
            <hr className="flex-1 border-slate-200"/>
            <span className="text-xs text-slate-400 uppercase font-bold">Or Paste Text</span>
            <hr className="flex-1 border-slate-200"/>
         </div>

         <textarea
           className="flex-1 w-full border border-slate-200 rounded-md p-3 font-mono text-xs focus:ring-2 focus:ring-sap-blue focus:border-transparent outline-none resize-none bg-slate-50"
           placeholder="Paste SAP Concur JSON here..."
           value={textInput}
           onChange={handleTextChange}
           onBlur={handleBlur}
         />

         <button 
           onClick={loadDemoData}
           className="text-xs text-sap-blue font-medium hover:underline flex items-center justify-center gap-2 py-2"
         >
           <FileJson size={14} />
           Load Demo SAP Expense Report
         </button>
      </div>
    </div>
  );
};

export default InputSection;