import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode } from '../types';
import { ChevronRight, ChevronDown, Copy, Check, Search, PlusSquare, MinusSquare, X, Filter, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface JsonViewerProps {
  data: any;
  mode: ViewMode;
}

// Section Types for Logic
type Section = 'root' | 'report' | 'entry' | 'allocation' | 'attendee' | 'audit';

const getChildSection = (key: string, current: Section): Section => {
  if (['reports', 'report'].some(k => key.toLowerCase().includes(k))) return 'report';
  if (['entries', 'expenseentries'].some(k => key.toLowerCase().includes(k))) return 'entry';
  if (['allocations', 'itemizations'].some(k => key.toLowerCase().includes(k))) return 'allocation';
  if (['attendees'].some(k => key.toLowerCase().includes(k))) return 'attendee';
  if (['audit', 'workflow'].some(k => key.toLowerCase().includes(k))) return 'audit';
  return current;
};

const getSectionColor = (section: Section): string => {
  switch (section) {
    case 'report': return 'text-blue-700';
    case 'entry': return 'text-purple-700';
    case 'allocation': return 'text-orange-700';
    case 'attendee': return 'text-emerald-700';
    case 'audit': return 'text-slate-500';
    default: return 'text-slate-700';
  }
};

const findPaths = (data: any, term: string, currentPath: string, results: Set<string>) => {
  if (!term) return;
  const lowerTerm = term.toLowerCase();
  if (typeof data !== 'object' || data === null) {
    if (String(data).toLowerCase().includes(lowerTerm)) results.add(currentPath);
    return;
  }
  Object.keys(data).forEach(key => {
    const newPath = currentPath ? `${currentPath}.${key}` : key;
    if (key.toLowerCase().includes(lowerTerm)) results.add(newPath);
    const value = data[key];
    if (typeof value === 'object' && value !== null) {
      findPaths(value, term, newPath, results);
    } else {
      if (String(value).toLowerCase().includes(lowerTerm)) results.add(newPath);
    }
  });
};

const Highlight: React.FC<{ text: string; term: string }> = ({ text, term }) => {
  if (!term || !text.toLowerCase().includes(term.toLowerCase())) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${term})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ?
          <span key={i} className="bg-yellow-200 text-slate-900 font-bold rounded-sm px-0.5">{part}</span> :
          part
      )}
    </span>
  );
};

const getAllPaths = (data: any, rootPath: string = 'root') => {
  const paths = new Set<string>();
  const traverse = (obj: any, path: string) => {
    paths.add(path);
    if (obj && typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(k => traverse(obj[k], `${path}.${k}`));
    }
  };
  traverse(data, rootPath);
  return paths;
};

const flattenObject = (obj: any, prefix = ''): any => {
  return Object.keys(obj).reduce((acc: any, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    const val = obj[k];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(acc, flattenObject(val, pre + k));
    } else if (Array.isArray(val)) {
      acc[pre + k] = JSON.stringify(val);
    } else {
      acc[pre + k] = val;
    }
    return acc;
  }, {});
};

const exportToExcel = (data: any) => {
  if (!data) return;
  const rows: any[] = [];
  const collectRows = (node: any, context: any) => {
    if (Array.isArray(node)) { node.forEach(item => collectRows(item, context)); return; }
    if (typeof node === 'object' && node !== null) {
      const keys = Object.keys(node);
      const arrayKeys = keys.filter(k => {
        const val = node[k];
        return Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && val[0] !== null;
      });
      const primitiveProps = { ...node };
      arrayKeys.forEach(k => delete primitiveProps[k]);
      const newContext = { ...context, ...primitiveProps };
      if (arrayKeys.length === 0) {
        rows.push(flattenObject(newContext));
      } else {
        arrayKeys.forEach(key => { node[key].forEach((child: any) => collectRows(child, newContext)); });
      }
    }
  };
  collectRows(data, {});
  if (rows.length === 0) return;
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Concur Data');
  XLSX.writeFile(wb, 'SAP_Concur_Export.xlsx');
};

interface JsonNodeProps {
  name: string;
  value: any;
  isLast: boolean;
  level: number;
  path: string;
  section: Section;
  expandedKeys: Set<string>;
  toggleKey: (key: string) => void;
  searchTerm: string;
  hideNulls: boolean;
}

const JsonNode: React.FC<JsonNodeProps> = ({
  name, value, isLast, level, path, section, expandedKeys, toggleKey, searchTerm, hideNulls
}) => {
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);
  const isExpanded = expandedKeys.has(path);
  const nextSection = getChildSection(name, section);
  const colorClass = getSectionColor(nextSection);

  if (!isObject) {
    const valString = typeof value === 'string' ? `"${value}"` : String(value);
    const valColor = typeof value === 'string' ? 'text-green-600' :
      typeof value === 'number' ? 'text-blue-600' :
        typeof value === 'boolean' ? 'text-purple-600' : 'text-slate-500';
    return (
      <div className="font-mono text-sm leading-6 hover:bg-black/5 px-2 rounded flex items-start">
        <div style={{ paddingLeft: `${level * 20}px` }} className="flex items-center">
          <span className={`mr-1 opacity-70 ${colorClass}`}><Highlight text={name} term={searchTerm} /></span>
          <span className="text-slate-400 mr-2">:</span>
          <span className={`${valColor} break-all`}><Highlight text={valString} term={searchTerm} /></span>
          {!isLast && <span className="text-slate-400">,</span>}
        </div>
      </div>
    );
  }

  let keys = Object.keys(value);
  if (hideNulls && !isArray) keys = keys.filter(k => value[k] !== null);
  const isEmpty = keys.length === 0;

  return (
    <div className="font-mono text-sm">
      <div
        className="flex items-center cursor-pointer hover:bg-black/5 px-2 rounded py-0.5 select-none"
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={() => toggleKey(path)}
      >
        <button className="mr-1 text-slate-400 hover:text-[#0070F2] transition-colors focus:outline-none">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <span className={`font-medium ${colorClass}`}><Highlight text={name} term={searchTerm} /></span>
        <span className="text-slate-400 mx-1">:</span>
        <span className="text-slate-500 text-xs">
          {isArray ? '[' : '{'}
          {!isExpanded && <span className="mx-1 text-slate-400 italic">{keys.length} {keys.length === 1 ? 'item' : 'items'}</span>}
          {!isExpanded && (isArray ? ']' : '}')}
          {!isExpanded && !isLast && <span className="text-slate-400">,</span>}
        </span>
      </div>

      {isExpanded && !isEmpty && (
        <div className={`border-l-2 ml-4 ${section === 'report' ? 'border-blue-100' : 'border-slate-100'}`}>
          {keys.map((key, idx) => (
            <JsonNode
              key={key}
              name={key}
              value={value[key]}
              isLast={idx === keys.length - 1}
              level={level + 1}
              path={`${path}.${key}`}
              section={nextSection}
              expandedKeys={expandedKeys}
              toggleKey={toggleKey}
              searchTerm={searchTerm}
              hideNulls={hideNulls}
            />
          ))}
        </div>
      )}

      {isExpanded && (
        <div style={{ paddingLeft: `${level * 20}px` }} className="px-2 py-0.5 text-slate-500">
          {isArray ? ']' : '}'}
          {!isLast && <span className="text-slate-400">,</span>}
        </div>
      )}
    </div>
  );
};

const JsonViewer: React.FC<JsonViewerProps> = ({ data, mode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(['root']));
  const [hideNulls, setHideNulls] = useState(false);

  useEffect(() => {
    if (data) {
      setExpandedKeys(getAllPaths(data));
      setSearchTerm('');
    }
  }, [data]);

  useEffect(() => {
    if (!searchTerm.trim()) return;
    const foundPaths = new Set<string>();
    findPaths(data, searchTerm, 'root', foundPaths);
    const keysToExpand = new Set<string>(expandedKeys);
    foundPaths.forEach(path => {
      const parts = path.split('.');
      let current = '';
      parts.forEach((part, idx) => {
        current = idx === 0 ? part : `${current}.${part}`;
        if (idx < parts.length - 1) keysToExpand.add(current);
      });
    });
    setExpandedKeys(keysToExpand);
  }, [searchTerm, data]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleKey = useCallback((path: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(path)) { next.delete(path); } else { next.add(path); }
      return next;
    });
  }, []);

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (mode === ViewMode.RAW) {
    return (
      <div className="relative h-full overflow-auto bg-slate-50 p-4">
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 bg-white border border-slate-200 rounded text-slate-500 hover:text-[#0070F2] shadow-sm transition-all z-10"
          title="Copy JSON"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
        <pre className="font-mono text-xs text-slate-700 whitespace-pre-wrap break-all">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-3 border-b border-slate-100 bg-slate-50/50">
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keys or values..."
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none transition-shadow bg-white"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="h-6 w-px bg-slate-300 mx-2"></div>
        <button onClick={() => exportToExcel(data)} className="p-2.5 text-slate-500 hover:text-green-600 hover:bg-white rounded-md transition-colors flex items-center gap-1.5" title="Export to Excel">
          <FileSpreadsheet size={20} />
        </button>
        <div className="h-6 w-px bg-slate-300 mx-2"></div>
        <button onClick={() => setHideNulls(!hideNulls)} className={`p-2.5 rounded-md transition-colors ${hideNulls ? 'bg-blue-100 text-[#0070F2]' : 'text-slate-500 hover:text-[#0070F2] hover:bg-white'}`} title={hideNulls ? 'Show Null Values' : 'Hide Null Values'}>
          <Filter size={20} />
        </button>
        <div className="h-6 w-px bg-slate-300 mx-2"></div>
        <button onClick={() => setExpandedKeys(getAllPaths(data))} className="p-2.5 text-slate-500 hover:text-[#0070F2] hover:bg-white rounded-md transition-colors" title="Expand All">
          <PlusSquare size={20} />
        </button>
        <button onClick={() => setExpandedKeys(new Set(['root']))} className="p-2.5 text-slate-500 hover:text-[#0070F2] hover:bg-white rounded-md transition-colors" title="Collapse All">
          <MinusSquare size={20} />
        </button>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <JsonNode
          name="root"
          value={data}
          isLast={true}
          level={0}
          path="root"
          section="root"
          expandedKeys={expandedKeys}
          toggleKey={toggleKey}
          searchTerm={searchTerm}
          hideNulls={hideNulls}
        />
      </div>
    </div>
  );
};

export default JsonViewer;
